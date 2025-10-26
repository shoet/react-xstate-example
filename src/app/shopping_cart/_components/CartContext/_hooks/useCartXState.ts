"use client";

import { Cart, Product } from "@/features/shopping_cart/types";
import { useMachine } from "@xstate/react";
import { assign, createMachine, fromPromise, StateFrom } from "xstate";
import { useCart } from "./useCart";
import { registerAddress } from "@/features/shopping_cart/service/registerAddress";
import { registerPaymentMethod } from "@/features/shopping_cart/service/registerPaymentMethod";

type StateMachineContext = {
  addressId: string | undefined;
  confirmCardRedirectURL: string | undefined;
  paymentMethodId: string | undefined;
};

const stateMachine = createMachine({
  id: "cart",
  initial: "browsing",
  always: [
    {
      actions: [
        ({ context }) => {
          console.log({ context });
        },
        "saveSnapshot",
      ],
    },
  ],
  context: {} as StateMachineContext,
  states: {
    // 商品閲覧・カート編集中
    browsing: {
      on: {
        ADD_ITEM: {
          actions: "handleAddCartItem",
        },
        REMOVE_ITEM: {
          actions: "handleRemoveCartItem",
        },
        PURCHASE: {
          target: "checkout",
        },
      },
    },
    // 決済工程
    checkout: {
      initial: "inputAddress",
      states: {
        // 住所入力
        inputAddress: {
          on: {
            SUBMIT_ADDRESS: {
              target: "registerAddress",
            },
          },
        },
        // 住所登録
        registerAddress: {
          invoke: {
            src: "handleRegisterAddress",
            input: ({ event }) => {
              return {
                address1: event.address1,
                address2: event.address2,
                postalCode: event.postalCode,
                phoneNumber: event.phoneNumber,
              };
            },
            onDone: {
              target: "inputPayment",
              actions: assign({
                addressId: ({ event }) => event.output.addressId,
              }),
            },
            onError: {
              target: "registerAddress",
            },
          },
        },
        // 支払い入力
        inputPayment: {
          on: {
            START_REGISTER: {
              target: "paymentStartRegister",
            },
          },
        },
        // カード登録開始
        paymentStartRegister: {
          invoke: {
            src: "handleRegisterPaymentMethod",
            input: ({ event }) => {
              return {
                cardNumber: event.cardNumber,
                expiryYear: event.expiryYear,
                expiryMonth: event.expiryMonth,
                cardHolder: event.cardHolder,
                securityCode: event.securityCode,
              };
            },
            onDone: {
              target: "paymentConfirmRegister",
              actions: assign({
                confirmCardRedirectURL: ({ event }) => event.output.redirectURL,
                paymentMethodId: ({ event }) => event.output.paymentMethodId,
              }),
            },
            onError: {
              target: "inputPayment",
            },
          },
        },
        // カード会社確認待ち
        paymentConfirmRegister: {
          on: {
            NEXT_PAYMENT: {
              target: "payment",
            },
          },
        },
        // 決済会社登録
        // 支払い方法登録
        payment: {
          on: {
            ON_CHANGE: {},
            SUBMIT: {
              target: "confirm",
            },
          },
        },
        // 支払い確認
        confirm: {
          on: {
            ON_CHANGE: {},
            SUBMIT: {
              target: "processing",
            },
          },
        },
        // 決済処理
        processing: {
          invoke: {
            src: "handleSubmitCart",
            onDone: {
              target: "success",
            },
            onError: {
              target: "error",
            },
          },
        },
        success: {}, // 成功
        error: {}, // エラー
      },
    },
  },
});

export type XCartState = StateFrom<typeof stateMachine>;

export type UseCartXStateReturnType = {
  cart: Cart;
  addItem: (product: Product) => void;
  removeItem: (product: Product) => void;
  submit: () => Promise<void>;
  state: XCartState;
  submitAddress: (
    address1: string,
    address2: string,
    postalCode: string,
    phoneNumber: string,
  ) => Promise<void>;
  submitPaymentMethod: (
    cardNumber: string,
    cardHolder: string,
    expiryYear: string,
    expiryMonth: string,
    securityCode: string,
  ) => Promise<void>;
  goNextPaymentConfirm: () => void;
};

export const useCartXState = () => {
  const {
    addItem: add,
    removeItem: remove,
    submit: submitCart,
    cart,
  } = useCart();
  const [state, send, actor] = useMachine(
    stateMachine.provide({
      actions: {
        handleAddCartItem: ({ event }) => {
          add(event.product);
        },
        handleRemoveCartItem: ({ event }) => {
          remove(event.product);
        },
        handleSubmitCart: async () => {
          await submitCart();
        },
        saveSnapshot: ({ self }) => {
          const snapshot = self.getSnapshot();
          const json = snapshot.toJSON();
          console.log(JSON.stringify(json));
        },
      },
      actors: {
        handleRegisterAddress: fromPromise(async ({ input }) => {
          const addressId = await registerAddress(
            input.address1,
            input.address2,
            input.postalCode,
            input.phoneNumber,
          );
          return {
            addressId: addressId,
          };
        }),
        handleRegisterPaymentMethod: fromPromise(async ({ input }) => {
          const { redirectURL, paymentMethodId } = await registerPaymentMethod(
            input.cardNumber,
            input.expiryYear,
            input.expiryMonth,
            input.cardHolder,
            input.securityCode,
          );
          return {
            redirectURL: redirectURL,
            paymentMethodId: paymentMethodId,
          };
        }),
      },
    }),
  );
  const addItem = (product: Product) => {
    send({ type: "ADD_ITEM", product: product });
  };
  const removeItem = (product: Product) => {
    send({ type: "REMOVE_ITEM", product: product });
  };
  const submit = async () => {
    send({ type: "PURCHASE" });
  };
  const submitAddress = async (
    address1: string,
    address2: string,
    postalCode: string,
    phoneNumber: string,
  ) => {
    send({
      type: "SUBMIT_ADDRESS",
      address1,
      address2,
      postalCode,
      phoneNumber,
    });
  };
  const submitPaymentMethod = async (
    cardNumber: string,
    cardHolder: string,
    expiryYear: string,
    expiryMonth: string,
    securityCode: string,
  ) => {
    send({
      type: "START_REGISTER",
      cardNumber,
      expiryYear,
      expiryMonth,
      cardHolder,
      securityCode,
    });
  };
  const goNextPaymentConfirm = async () => {
    send({
      type: "NEXT_PAYMENT",
    });
  };

  return {
    cart,
    addItem,
    removeItem,
    submit,
    state,
    submitAddress,
    submitPaymentMethod,
    goNextPaymentConfirm,
  };
};
