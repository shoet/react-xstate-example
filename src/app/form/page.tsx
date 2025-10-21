"use client";

import { useMachine } from "@xstate/react";
import clsx from "clsx";
import { assign, createMachine, fromPromise } from "xstate";

function isValidSend(
  email: string | undefined,
  password: string | undefined,
): boolean {
  return (email?.length || 0) > 0 && (password?.length || 0) > 0;
}

class DisplayError extends Error {
  displayMessage?: string;
  cause?: string;

  constructor(
    message: string,
    details?: {
      displayMessage?: string;
      cause?: string;
    },
  ) {
    super(message);
    this.name = "DisplayError";
    this.displayMessage = details?.displayMessage;
    this.cause = details?.cause;
  }
}

const machine = createMachine({
  context: {
    email: "",
    password: "",
  } as {
    email: string;
    password: string;
    error: DisplayError | undefined;
  },
  initial: "inputForm",
  states: {
    inputForm: {
      on: {
        ON_CHANGE_EMAIL: {
          actions: assign({ email: ({ event }) => event.value }),
        },
        ON_CHANGE_PASSWORD: {
          actions: assign({ password: ({ event }) => event.value }),
        },
        SUBMIT: {
          target: "sending",
          guard: ({ context }) => isValidSend(context.email, context.password),
          actions: [assign({ error: undefined }), "handleSubmit"],
        },
      },
    },
    sending: {
      invoke: {
        src: "submitForm",
        input: ({ context }) => {
          return {
            email: context.email,
            password: context.password,
          };
        },
        onDone: {
          target: "success",
        },
        onError: {
          target: "error",
          actions: assign({
            error: ({ event }) => {
              return new DisplayError("failed to submit", {
                displayMessage: "送信に失敗しました。",
                cause:
                  event.error instanceof Error
                    ? event.error.message
                    : undefined,
              });
            },
          }),
        },
      },
    },
    success: {
      always: {
        target: "inputForm",
        actions: assign({ email: "", password: "" }),
      },
    },
    error: {
      always: {
        target: "inputForm",
      },
    },
  },
}).provide({
  actors: {
    submitForm: fromPromise(async ({ input }) => {
      return await submitForm(input.email, input.password);
    }),
  },
});

async function submitForm(email: string, password: string): Promise<void> {
  await new Promise((res) => setTimeout(res, 2000));
  throw new Error("failed test");
  console.log("### submited", { email, password });
}

export default function Page() {
  const [state, send] = useMachine(machine);
  return (
    <div className={clsx("flex flex-row items-center")}>
      <div
        className={clsx(
          "w-1/2 h-screen",
          "bg-gradient-to-b from-cyan-500 from- via-blue-500 via-",
        )}
      ></div>
      <div className={clsx("w-1/2 flex justify-center items-center")}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send({ type: "SUBMIT" });
          }}
          className={clsx("border border-gray-100/50 rounded-xl min-w-[400px]")}
        >
          <div
            className={clsx(
              "h-[200px] bg-cyan-400 rounded-t-xl overflow-hidden",
            )}
          ></div>
          <div className={clsx("p-4")}>
            <div className={clsx("flex flex-col items-start gap-4")}>
              <label className={clsx("font-bold text-base")} htmlFor="email">
                メールアドレス
              </label>
              <input
                className={clsx(
                  "border border-gray-50/50 rounded-md p-2 w-full",
                )}
                name="email"
                onChange={(e) =>
                  send({ type: "ON_CHANGE_EMAIL", value: e.target.value })
                }
                placeholder="メールアドレス"
                value={state.context.email}
              />
              <label className={clsx("font-bold text-base")} htmlFor="password">
                パスワード
              </label>
              <input
                className={clsx(
                  "border border-gray-50/50 rounded-md p-2 w-full",
                )}
                onChange={(e) =>
                  send({ type: "ON_CHANGE_PASSWORD", value: e.target.value })
                }
                name="password"
                type="password"
                placeholder="パスワード"
                value={state.context.password}
              />
            </div>
            {state.context.error && (
              <div className={clsx("text-red-500")}>
                {state.context.error.displayMessage}
              </div>
            )}
            <button
              type="submit"
              className={clsx(
                "mt-8 w-full",
                "px-2 py-1 font-bold text-lg text-white bg-purple-500 hover:bg-purple-700 rounded-md cursor-pointer",
                "disabled:bg-gray-500 disabled:cursor-default",
                state.matches("sending") && "disabled:bg-sky-500",
              )}
              disabled={
                !isValidSend(state.context.email, state.context.password) ||
                state.matches("sending")
              }
            >
              {state.matches("sending") ? "・・・" : "送信"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
