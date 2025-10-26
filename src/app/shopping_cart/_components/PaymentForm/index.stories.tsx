import type { Meta, StoryObj } from "@storybook/react";
import { PaymentForm } from ".";

export default {
  title: "shopping_cart/PaymentForm",
  component: PaymentForm,
} as Meta<typeof PaymentForm>;

type Story = StoryObj<typeof PaymentForm>;

export const Default: Story = {};
