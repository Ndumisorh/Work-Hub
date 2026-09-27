import NavItem from "./NavItem";
import Icon from "./Icon";

export default function Sidebar({ page, setPage, profile, onEditProfile, onNavigate }) {
  function navigate(nextPage) {
    setPage(nextPage);
    onNavigate?.();
  }

  const displayName = profile.name.trim();
  const initials = displayName ? displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() : "";
  return (
    <div
      id="app-navigation"
      className="app-sidebar"
      style={{
        width: 216,
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "18px 14px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        background: "#0F1C19",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 6px", marginBottom: 22 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "linear-gradient(135deg,#69E6BB,#2BAE84)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,
            color: "#06120D",
            boxShadow: "0 0 12px rgba(63, 214, 170, 0.22)",
          }}
        >
          W
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>{displayName ? `${displayName}’s Hub` : "Your Hub"}</div>
          <div style={{ fontSize: 10.5, color: "#94A3B8" }}>Work Hub</div>
        </div>
      </div>

      <div className="app-sidebar-section-label" style={{ fontSize: 10.5, fontWeight: 600, color: "#64748B", letterSpacing: 0.6, padding: "0 8px", marginBottom: 8 }}>
        WORKSPACE
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <NavItem icon="grid" label="Dashboard" active={page === "dashboard"} onClick={() => navigate("dashboard")} />
        <NavItem icon="users" label="Clients" active={page === "clients"} onClick={() => navigate("clients")} />
        <NavItem icon="file" label="Invoices" active={page === "invoices"} onClick={() => navigate("invoices")} />
        <NavItem icon="clock" label="Time tracking" active={page === "time"} onClick={() => navigate("time")} />
      </div>

      <div className="app-sidebar-section-label" style={{ fontSize: 10.5, fontWeight: 600, color: "#64748B", letterSpacing: 0.6, padding: "0 8px", marginTop: 24, marginBottom: 8 }}>SUPPORT</div>
      <NavItem icon="help" label="Help and support" active={page === "about"} onClick={() => navigate("about")} />

      <button
        type="button"
        onClick={onEditProfile}
        aria-label="Edit your profile"
        title="Edit your profile"
        style={{
          marginTop: "auto",
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 9,
          padding: "10px 6px 4px",
          width: "100%",
          borderLeft: 0,
          borderRight: 0,
          borderBottom: 0,
          background: "transparent",
          textAlign: "left",
          cursor: "pointer",
          borderRadius: 9,
          color: "inherit",
        }}
      >
        {profile.photo ? (
          <img src={profile.photo} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "1px solid rgba(255,255,255,0.1)" }} />
        ) : (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#182923",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: initials ? 10 : 15,
            fontWeight: 600,
            color: "#72DDB8",
          }}
        >
          {initials || <Icon name="user" size={15} />}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: "#F8FAFC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName || "Your Name"}</div>
          <div style={{ fontSize: 10.5, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.title || "Set up your profile"}</div>
        </div>
      </button>
    </div>
  );
}