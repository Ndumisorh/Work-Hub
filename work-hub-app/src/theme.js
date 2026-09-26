// Design tokens shared by every screen and component.
// Slate Indigo Theme

export const colors = {
  bg: "#0F172A",
  surface: "#1E293B",
  surfaceElevated: "#334155",
  border: "#334155",
  borderStrong: "#475569",
  divider: "#334155",
  divider2: "#1E293B",

  textPrimary: "#F8FAFC",
  textHeading: "#FFFFFF",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",
  textFaint: "#64748B",
  textDim: "#475569",

  accent: "#6366F1",
  accentStrong: "#4F46E5",
  accentOn: "#FFFFFF",

  blue: "#6366F1",
  green: "#10B981",
  purple: "#A855F7",
  amber: "#F59E0B",
  red: "#EF4444",
};

export const statusColor = {
  "In progress": { fg: colors.blue, bg: "rgba(99,102,241,0.15)" },
  "Completed": { fg: colors.green, bg: "rgba(16,185,129,0.15)" },
  "On hold": { fg: colors.amber, bg: "rgba(245,158,11,0.15)" },
  "Lead": { fg: colors.textSecondary, bg: "rgba(148,163,184,0.15)" },
  "Paid": { fg: colors.green, bg: "rgba(16,185,129,0.15)" },
  "Pending": { fg: colors.amber, bg: "rgba(245,158,11,0.15)" },
};

export function currency(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}