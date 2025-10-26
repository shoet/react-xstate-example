import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputWithLabel } from "../InputWithLabel";

type Props = {
  onSubmit: (
    cardNumber: string,
    cardHolder: string,
    expiryYear: string,
    expiryMonth: string,
    securityCode: string,
  ) => void;
};

export const PaymentForm = (props: Props) => {
  const { onSubmit } = props;
  const { register, getValues } = useForm<{
    cardNumber: string;
    cardHolder: string;
    expiryYear: string;
    expiryMonth: string;
    securityCode: string;
  }>();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(
          getValues("cardNumber"),
          getValues("cardHolder"),
          getValues("expiryYear"),
          getValues("expiryMonth"),
          getValues("securityCode"),
        );
      }}
      className={clsx("border border-border px-6 py-4 rounded-xl")}
    >
      <div className={clsx("font-bold text-lg w-full")}>カードの登録</div>
      <div className={clsx("flex flex-col gap-4")}>
        <InputWithLabel label="カード番号" {...register("cardNumber")} />
        <div>
          <label className={clsx("font-bold text-sm")}>有効期限</label>
          <div className={clsx("flex flex-row items-center gap-2")}>
            <input
              className={clsx("border border-form-border rounded-md px-2 py-1")}
              {...register("expiryYear")}
            />
            {"/"}
            <input
              className={clsx("border border-form-border rounded-md px-2 py-1")}
              {...register("expiryMonth")}
            />
          </div>
        </div>
        <InputWithLabel label="名義人" {...register("cardHolder")} />
        <InputWithLabel
          label="セキュリティコード"
          {...register("securityCode")}
        />
      </div>
      <button
        type="submit"
        className={clsx(
          "mt-8",
          "w-full px-4 py-3 rounded-md font-bold bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer",
        )}
      >
        カードを登録
      </button>
    </form>
  );
};
