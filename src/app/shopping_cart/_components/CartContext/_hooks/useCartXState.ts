"use client";

import { Cart, Product } from "@/features/shopping_cart/types";
import { useMachine } from "@xstate/react";
import { createMachine, fromPromise, MachineSnapshot, StateFrom } from "xstate";
import { useCart } from "./useCart";

type StateMachineContext = {
  address: {
    address1: string;
    address2: string;
    postalCode: string;
    phoneNumber: string;
  };
  paymentInfo: {
    paymentMethodId: string;
  };
};

const stateMachine = createMachine(
  {
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
    context: {},
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
              SUBMIT: {
                target: "registerAddress",
              },
            },
          },
          // 住所登録
          registerAddress: {
            invoke: {
              src: "",
              input: ({ event }) => {
                return {
                  address1: event.address1,
                  address2: event.address2,
                  postalCode: event.postalCode,
                  phoneNumber: event.phoneNumber,
                };
              },
              onDone: {
                target: "payment",
              },
              onError: {
                target: "registerAddress",
              },
            },
          },
          // 支払い入力
          inputPayment: {},
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
  },
  {
    actors: {
      registerAddress: fromPromise(async ({ input }) => {}),
    },
  },
);

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
  ) => {};

  return {
    cart,
    addItem,
    removeItem,
    submit,
    state,
    submitAddress,
  };
};
