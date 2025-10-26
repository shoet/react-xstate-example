import clsx from "clsx";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";

const InputWithLabel = (props: { label: string } & ComponentProps<"input">) => {
  const { name, ...rest } = props;
  return (
    <div className={clsx("flex flex-col justify-start gap-2 w-full")}>
      <label htmlFor={name} className={clsx("font-bold text-sm")}>
        {props.label}
      </label>
      <input
        name={name}
        {...rest}
        className={clsx("border border-form-border rounded-md px-2 py-2")}
      />
    </div>
  );
};

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
