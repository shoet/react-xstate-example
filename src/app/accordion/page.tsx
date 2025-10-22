"use client";
import { useMachine } from "@xstate/react";
import clsx from "clsx";
import Image from "next/image";
import { ReactNode, useEffect } from "react";
import { assign, createMachine } from "xstate";

type AccordionItem = {
  id: string;
  title: string;
  item: ReactNode;
};

const AccordionItemA = () => {
  return <p className={clsx("break-words")}>{"item_A".repeat(20)}</p>;
};

const AccordionItemB = () => {
  return <p className={clsx("break-words")}>{"item_B".repeat(20)}</p>;
};

const AccordionItemC = () => {
  return (
    <div
      className={clsx("flex flex-row items-center justify-between", "min-w-0")}
    >
      <div className={clsx("relative h-[100px] aspect-square")}>
        <Image
          className={clsx("object-cover object-center")}
          src="/profile_icon.png"
          alt="photo"
          fill
        />
      </div>
      <p className={clsx("break-words min-w-0")}>{"item_C".repeat(20)}</p>
    </div>
  );
};

const items: AccordionItem[] = [
  {
    id: "1",
    title: "アイテムA",
    item: <AccordionItemA />,
  },
  {
    id: "2",
    title: "アイテムB",
    item: <AccordionItemB />,
  },
  {
    id: "3",
    title: "アイテムC",
    item: <AccordionItemC />,
  },
];

const machine = createMachine({
  context: {
    animating: false,
  } as {
    currentOpenedId: string | undefined;
    animating: boolean;
  },
  initial: "idle",
  states: {
    idle: {
      on: {
        CLICK_SUMMARY: {
          actions: [
            ({ event }) => {
              console.log("event", event);
            },
            assign({ currentOpenedId: ({ event }) => event.id }),
          ],
          guard: ({ context }) => !context.animating,
          target: "animating",
        },
      },
    },
    animating: {
      entry: assign({ animating: true }),
      after: {
        300: {
          actions: [
            () => {
              console.log("run after");
            },
            assign({ animating: false }),
          ],
          target: "idle",
        },
      },
    },
  },
});

export default function Page() {
  const [state, send, actor] = useMachine(machine);
  useEffect(() => {
    console.log("change state", state.context);
  }, [state]);
  return (
    <div className={clsx("h-screen relative")}>
      <div>status: {state.value.toString()}</div>
      <div>
        animating:{" "}
        {state.context.animating ? "アニメーション" : "アニメーション終了"}
      </div>
      <div>current: {state.context.currentOpenedId}</div>
      <div
        className={clsx(
          "absolute top-50 right-1/2 translate-x-1/2",
          "w-[500px] border border-gray-50 rounded-xl p-4 min-w-0",
        )}
      >
        {items.map((a) => {
          const isOpen = state.context.currentOpenedId === a.id;
          return (
            <div key={a.id}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  send({ type: "CLICK_SUMMARY", id: a.id });
                }}
              >
                {a.title}
              </button>
              <div
                className={clsx(
                  "transition-all duration-300 ease-in-out",
                  isOpen ? "opacity-100" : "opacity-0 h-0",
                )}
              >
                {a.item}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
