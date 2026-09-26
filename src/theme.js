// Shared design tokens used by the app's screens and components.
export const colors = {
  bg: "#080F10",
  surface: "#111C1D",
  surfaceElevated: "#182526",
  border: "rgba(174,210,197,0.11)",
  borderStrong: "rgba(174,210,197,0.18)",
  divider: "rgba(174,210,197,0.09)",
  divider2: "#142021",
  textPrimary: "#F8FAFC",
  textHeading: "#FFFFFF",
  textSecondary: "#CBD5E1",
  textMuted: "#A5B4AE",
  textFaint: "#788B81",
  textDim: "#5E7067",
  accent: "#56D9B1",
  accentStrong: "#31B892",
  accentOn: "#061410",
  positive: "#E8C37D",
  blue: "#56D9B1",
  green: "#56D9B1",
  purple: "#91A99B",
  amber: "#D8B56F",
  red: "#E5675F",
};

export const statusColor = {
  "In progress": { fg: "#74E2BE", bg: "rgba(63,214,170,0.16)" },
  Completed: { fg: colors.positive, bg: "rgba(232,195,125,0.15)" },
  "On hold": { fg: "#F3A17D", bg: "rgba(243,161,125,0.14)" },
  Lead: { fg: "#C0CCC5", bg: "rgba(192,204,197,0.12)" },
  Paid: { fg: colors.positive, bg: "rgba(232,195,125,0.13)" },
  Pending: { fg: "#D7C18F", bg: "rgba(216,181,111,0.11)" },
};

export const currencyOptions = [
  { code: "ZAR", label: "South African Rand (R)", symbol: "R", separated: true },
  { code: "USD", label: "US Dollar ($)", symbol: "$" },
  { code: "GBP", label: "British Pound (£)", symbol: "£" },
  { code: "EUR", label: "Euro (€)", symbol: "€" },
  { code: "AUD", label: "Australian Dollar (A$)", symbol: "A$" },
  { code: "NGN", label: "Nigerian Naira (₦)", symbol: "₦" },
  { code: "KES", label: "Kenyan Shilling (KSh)", symbol: "KSh", separated: true },
  { code: "CAD", label: "Canadian Dollar (C$)", symbol: "C$" },
  { code: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
];

export function currencySymbol(currencyCode = "USD") {
  const option = currencyOptions.find((item) => item.code === currencyCode) || currencyOptions.find((item) => item.code === "USD");
  return option.symbol;
}

export function currency(amount, currencyCode = "USD") {
  const option = currencyOptions.find((item) => item.code === currencyCode) || currencyOptions.find((item) => item.code === "USD");
  const number = Number(amount);
  const formattedNumber = Math.abs(number).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const sign = number < 0 ? "−" : "";
  return `${sign}${option.symbol}${option.separated ? " " : ""}${formattedNumber}`;
}
