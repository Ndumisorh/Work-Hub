import Icon from "./Icon";

export default function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      type="button"
      className={`app-nav-item${active ? " is-active" : ""}`}
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "9px 12px", borderRadius: 9, border: "none", cursor: "pointer",
        background: active ? "rgba(63,214,170,0.1)" : "transparent",
        color: active ? "#3FD6AA" : "#A3B2AA",
        fontSize: 13.5, fontWeight: 500, textAlign: "left", transition: "background 0.15s, color 0.15s",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon name={icon} size={16} />
      <span className="app-nav-label" style={{ flex: 1 }}>{label}</span>
      {badge != null ? <span className="app-nav-badge" style={{ fontSize: 10.5, fontWeight: 700, background: "#3FD6AA", color: "#08120E", borderRadius: 20, padding: "1px 6px" }}>{badge}</span> : null}
    </button>
  );
}
