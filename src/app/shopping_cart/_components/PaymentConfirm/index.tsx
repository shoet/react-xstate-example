import clsx from "clsx";
import { useState } from "react";

export const PaymentConfirm = (props: {
  redirectURL: string;
  onNext: () => void;
}) => {
  const [clickedConfirm, setClickedConfirm] = useState(false);
  return (
    <div className={clsx("border border-border px-6 py-4 rounded-xl")}>
      <div className={clsx("flex flex-col gap-4")}>
        <div className={clsx("font-bold text-lg w-full")}>
          決済代行会社の確認
        </div>
        <div>
          <a
            href={props.redirectURL}
            target="_blank"
            rel="noreferrer noopener"
            className={clsx(
              "p-2 text-white bg-emerald-400 font-bold rounded-md",
            )}
            onClick={() => {
              setClickedConfirm(true);
            }}
          >
            本人確認をする
          </a>
        </div>
        <button
          className={clsx(
            "p-2 text-white bg-emerald-400 cursor-pointer disabled:bg-gray-300 disabled:cursor-default font-bold rounded-md",
          )}
          disabled={!clickedConfirm}
          onClick={props.onNext}
        >
          次へ進む
        </button>
      </div>
    </div>
  );
};
