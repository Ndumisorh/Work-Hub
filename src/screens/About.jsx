import Icon from "../components/Icon";
import { colors } from "../theme";

const tips = [
  {
    icon: "info",
    title: "What’s new",
    body: "Your dashboard now brings project activity and invoice totals together in one place. You can see paid and outstanding amounts at a glance, track which projects are active this month, and quickly spot what needs attention without jumping between screens.",
    accent: colors.accent,
  },
  {
    icon: "users",
    title: "Keep client statuses current",
    body: "The “Active projects” number on your dashboard only counts clients marked as In progress.\n\nIf a project is finished or on hold, update the client status in the Clients page. This keeps your dashboard accurate and helps you focus on the work that is actually moving forward.",
    accent: colors.accent,
  },
  {
    icon: "check",
    title: "Update invoices when paid",
    body: "When a client pays, open the invoice and mark it as Paid.\n\nThis automatically moves the amount from Outstanding to Collected and updates the totals on both the Dashboard and the Invoices page. Keeping this up to date gives you a clear picture of your real cash flow.",
    accent: colors.positive,
  },
  {
    icon: "search",
    title: "Find work quickly",
    body: "Use the search bar at the top of any page to find clients, invoices, or projects instantly.\n\nYou can search by client name, email address, project title, or invoice number. This is the fastest way to jump to exactly what you need without scrolling through lists.",
    accent: colors.accent,
  },
  {
    icon: "clock",
    title: "Track your time properly",
    body: "Start a timer from the Time tracking page when you begin work on a project.\n\nYou can also add time manually later. Accurate time logs help you understand how long projects really take and make future estimates more reliable.",
    accent: colors.positive,
  },
  {
    icon: "calendar",
    title: "Review your week",
    body: "The “This week” card on the dashboard shows how many active clients you have, how much you’ve collected, and how much is still waiting. Check it every few days so you always know where your studio stands.",
    accent: colors.accent,
  },
];

export default function About({ onBack }) {
  return (
    <div style={{ maxWidth: 760 }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: colors.textMuted, fontSize: 12.5, cursor: "pointer", marginBottom: 18, padding: 0 }}>
        <Icon name="arrowRight" size={13} style={{ transform: "rotate(180deg)" }} /> Back to dashboard
      </button>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#F1F3EF", marginBottom: 6 }}>Help &amp; studio tips</div>
      <div style={{ fontSize: 13.5, color: colors.textMuted, marginBottom: 24, lineHeight: 1.55 }}>Practical guidance to help you keep your projects, time, and studio finances in good shape.</div>

      <div className="help-tip-list" style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {tips.map((tip, index) => (
          <article key={tip.title} className="help-tip-card" style={{ display: "grid", gridTemplateColumns: "42px minmax(0, 1fr) 18px", alignItems: "start", gap: 15, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "21px 22px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
            <div aria-hidden="true" style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: index === 2 || index === 4 ? "rgba(232,195,125,0.12)" : "rgba(86,217,177,0.12)", border: `1px solid ${tip.accent}26`, color: tip.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 6px 18px ${tip.accent}0B, inset 0 1px 0 rgba(255,255,255,0.04)` }}>
              <Icon name={tip.icon} size={18} />
            </div>
            <div style={{ minWidth: 0, paddingTop: 1 }}>
              <h2 style={{ fontSize: 14, fontWeight: 680, color: "#F2F5F1", margin: "0 0 8px", letterSpacing: "-0.1px" }}>{tip.title}</h2>
              <p style={{ fontSize: 12.7, color: "#AAB8B1", lineHeight: 1.72, margin: 0, whiteSpace: "pre-line" }}>{tip.body}</p>
            </div>
            <Icon name="arrowRight" size={15} style={{ color: tip.accent, opacity: 0.62, marginTop: 4 }} />
          </article>
        ))}
      </div>
    </div>
  );
}
