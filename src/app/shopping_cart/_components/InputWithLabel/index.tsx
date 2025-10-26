import clsx from "clsx";
import { ComponentProps } from "react";

export const InputWithLabel = (
  props: { label: string } & ComponentProps<"input">,
) => {
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
