import type { Meta, StoryObj } from "@storybook/react";
import { AddressForm } from ".";

export default {
  title: "shopping_cart/AddressForm",
  component: AddressForm,
} as Meta<typeof AddressForm>;

type Story = StoryObj<typeof AddressForm>;

export const Default: Story = {};
