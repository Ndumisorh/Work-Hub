import Icon from "../components/Icon";
import Badge from "../components/Badge";
import { colors } from "../theme";

export default function Clients({ clients, search, onAddClient, onEditClient, onRemoveClient }) {
  const filtered = clients.filter((c) =>
    (c.name + c.email + c.project).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontSize: 19, fontWeight: 600, color: "#F1F3EF" }}>Client directory</div>
        <button
          onClick={onAddClient}
          className="primary-action"
          style={{ display: "flex", alignItems: "center", gap: 6, minHeight: 40, background: "#3FD6AA", color: "#06120D", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13.5, fontWeight: 650, cursor: "pointer", boxShadow: "0 5px 18px rgba(63,214,170,0.22)" }}
        >
          <Icon name="plus" size={14} /> New client
        </button>
      </div>
      <div style={{ fontSize: 13, color: "#8B9389", marginBottom: 18 }}>{filtered.length} client{filtered.length !== 1 ? "s" : ""} in your roster</div>

      <div className="client-table-scroll" style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflowX: "auto" }}>
        <div className="client-table-heading" style={{ display: "grid", gridTemplateColumns: "1.6fr 1.8fr 1.6fr 1fr 80px", minWidth: 700, padding: "11px 18px", fontSize: 11.5, fontWeight: 600, color: "#91A197", letterSpacing: 0.3, borderBottom: `1px solid ${colors.divider}` }}>
          <div>CLIENT</div><div>EMAIL</div><div>PROJECT</div><div>STATUS</div><div style={{ textAlign: "right" }}>ACTIONS</div>
        </div>
        {filtered.length === 0 && (
          <div className="client-empty-state" style={{ minWidth: 700, padding: "32px 18px", textAlign: "center", color: "#6D746E", fontSize: 13 }}>
            {clients.length === 0 ? "No clients yet. Add your first client to get started." : "No clients match your search."}
          </div>
        )}
        {filtered.map((c, i) => (
          <div key={c.id} className="client-data-row" style={{ display: "grid", gridTemplateColumns: "1.6fr 1.8fr 1.6fr 1fr 80px", minWidth: 700, alignItems: "center", padding: "13px 18px", borderTop: i > 0 ? `1px solid ${colors.divider}` : "none", fontSize: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: c.color + "26", color: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.initials}</div>
              <span style={{ fontWeight: 500, color: "#EDEFEC" }}>{c.name}</span>
            </div>
            <div style={{ color: "#9BA39C", display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <Icon name="send" size={12} style={{ color: "#5B625C", flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</span>
            </div>
            <div style={{ color: "#9BA39C", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.project}</div>
            <div><Badge status={c.status} /></div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
              <button onClick={() => onEditClient(c)} aria-label={`Edit ${c.name}`} title={`Edit ${c.name}`} className="client-action-button" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${colors.border}`, background: "rgba(255,255,255,0.025)", color: "#A3B2AA", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="edit" size={15} />
              </button>
              <button onClick={() => onRemoveClient(c)} aria-label={`Delete ${c.name}`} title={`Delete ${c.name}`} className="client-action-button client-action-delete" style={{ width: 34, height: 34, borderRadius: 9, border: `1px solid ${colors.border}`, background: "rgba(255,255,255,0.025)", color: "#E58B80", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="trash" size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
