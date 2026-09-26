import { statusColor } from "../theme";

export default function Badge({ status }) {
  const c = statusColor[status] || statusColor["Lead"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px",
      border: `1px solid ${c.fg}30`, borderRadius: 20, fontSize: 12, fontWeight: 650, color: c.fg, background: c.bg,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c.fg, boxShadow: `0 0 7px ${c.fg}55` }} />
      {status}
    </span>
  );
}
