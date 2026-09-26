import Icon from "./Icon";
import { colors } from "../theme";

export default function StatCard({ label, value, delta, icon, accent, positive = false }) {
  return (
    <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "20px 22px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 12.5, color: colors.textMuted, fontWeight: 500, letterSpacing: 0.2 }}>{label}</span>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: accent + "22", color: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={15} />
        </div>
      </div>
      <div style={{ fontSize: 30, fontWeight: 720, color: positive ? colors.positive : colors.textHeading, letterSpacing: -0.8, marginBottom: 7 }}>{value}</div>
      {delta && <div style={{ fontSize: 11.5, color: colors.textMuted }}>{delta}</div>}
    </div>
  );
}
