import clsx from "clsx";
import { useForm } from "react-hook-form";
import { InputWithLabel } from "../InputWithLabel";

export const AddressForm = (props: {
  onSubmit: (
    address1: string,
    address2: string,
    postalCode: string,
    phoneNumber: string,
  ) => {};
}) => {
  const { register, getValues } = useForm<{
    address1: string;
    address2: string;
    postalCode: string;
    phoneNumber: string;
  }>();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(),
          props.onSubmit(
            getValues("address1"),
            getValues("address2"),
            getValues("postalCode"),
            getValues("phoneNumber"),
          );
      }}
      className={clsx("border border-border px-6 py-4 rounded-xl")}
    >
      <div className={clsx("font-bold text-lg w-full", "mb-8")}>住所の入力</div>
      <div className={clsx("flex flex-col gap-4")}>
        <InputWithLabel label="郵便番号" {...register("postalCode")} />
        <InputWithLabel label="住所1" {...register("address1")} />
        <InputWithLabel label="住所2" {...register("address2")} />
        <InputWithLabel label="電話番号" {...register("phoneNumber")} />
      </div>
      <button
        type="submit"
        className={clsx(
          "mt-8",
          "w-full px-4 py-3 rounded-md font-bold bg-emerald-500 hover:bg-emerald-400 text-white cursor-pointer",
        )}
      >
        住所を登録
      </button>
    </form>
  );
};
