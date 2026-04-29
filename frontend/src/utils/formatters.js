import { format } from "date-fns";

export const formatDisplayDate = (value) => {
  if (!value) return "-";

  try {
    return format(new Date(value), "dd MMM yyyy");
  } catch (error) {
    return value;
  }
};

export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
