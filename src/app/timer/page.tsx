"use client";

import clsx from "clsx";
import { ComponentProps, useEffect, useRef } from "react";
import { createMachine, assign } from "xstate";
import { useMachine } from "@xstate/react";
import { useTimer } from "./_hooks/useTimer";

const Button = (props: ComponentProps<"button">) => {
  const { className, ...rest } = props;

  return (
    <button
      className={clsx(
        "px-2 py-1 text-white bg-blue-500 hover:bg-blue-300 cursor-pointer font-bold text-lg rounded-full",
        "disabled:bg-gray-300 disabled:cursor-default",
        className,
      )}
      {...rest}
    />
  );
};

const stateMachine = createMachine({
  id: "counter",
  context: {
    second: 10,
    initialSecond: 10,
  } as {
    second: number;
    initialSecond: number;
  },
  initial: "stop",
  states: {
    stop: {
      entry: [
        assign({
          second: ({ context }) => context.initialSecond,
        }),
        "handleReset",
      ],
      on: {
        START: {
          target: "started",
        },
      },
    },
    started: {
      entry: "handleStart",
      on: {
        COUNT_DOWN: {
          actions: assign({
            second: ({ context }) => context.second - 1,
          }),
        },
        PAUSE: {
          target: "pause",
        },
        RESET: {
          target: "stop",
        },
        COMPLETE: {
          target: "complete",
        },
      },
    },
    pause: {
      entry: "handlePause",
      on: {
        START: {
          target: "started",
        },
        RESET: {
          target: "stop",
        },
      },
    },
    complete: {
      on: {
        RESET: {
          target: "stop",
        },
      },
    },
  },
});

export default function Page() {
  const [state, send] = useMachine(
    stateMachine.provide({
      actions: {
        handleStart: () => {
          start();
        },
        handlePause: () => {
          pause();
        },
        handleReset: () => {
          reset();
        },
      },
    }),
  );

  const { start, pause, reset } = useTimer({
    cb: () => {
      send({
        type: "COUNT_DOWN",
      });
    },
    intervalMS: 1000,
  });

  useEffect(() => {
    if (state.context.second === 0) {
      send({ type: "COMPLETE" });
    }
  }, [state.context.second]);

  return (
    <div className={clsx("flex items-center justify-center h-screen")}>
      <div className={clsx("w-[500px] p-4 border border-gray-300 rounded-lg")}>
        <h1 className={clsx("text-2xl font-bold")}>タイマー</h1>
        <div
          className={clsx(
            "flex flex-row items-center justify-between",
            "text-xl font-bold",
          )}
        >
          <div>カウントダウン</div>
          {state.matches("complete") ? (
            <div>完了</div>
          ) : (
            <div>{state.context.second}秒</div>
          )}
        </div>
        <div
          className={clsx(
            "mt-[100px]",
            "flex flex-row items-center justify-center gap-6",
          )}
        >
          <Button
            onClick={() => {
              send({
                type: "START",
              });
            }}
            disabled={state.matches("started")}
          >
            スタート
          </Button>
          <Button
            disabled={!state.matches("started")}
            onClick={() => {
              send({
                type: "PAUSE",
              });
            }}
          >
            一時停止
          </Button>
          <Button
            onClick={() => {
              send({
                type: "RESET",
              });
            }}
          >
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
}
