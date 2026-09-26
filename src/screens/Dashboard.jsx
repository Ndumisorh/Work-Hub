import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import StatCard from "../components/StatCard";
import { colors, currency } from "../theme";

export default function Dashboard({ clients, invoices, profile, currencyCode = "USD", onNewClient, onViewInvoices }) {
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentHour(new Date().getHours()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const firstName = profile.name.trim().split(/\s+/)[0] || "there";
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const collected = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const outstanding = totalInvoiced - collected;
  const activeProjects = clients.filter((c) => c.status === "In progress").length;
  const pendingInvoices = invoices.filter((invoice) => invoice.status === "Pending").length;
  const datedProjects = clients.filter((client) => client.projectStartDate && client.projectEndDate);

  function formatDate(value) {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
  }

  function dateState(value) {
    const date = new Date(`${value}T00:00:00Z`);
    const today = new Date();
    const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const difference = date.getTime() - todayUTC;
    return difference < 0 ? "past" : difference > 0 ? "future" : "today";
  }

  function daysRemaining(value) {
    const end = new Date(`${value}T00:00:00Z`);
    const today = new Date();
    const startOfToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.ceil((end.getTime() - startOfToday) / 86400000);
  }

  return (
    <div>
      <div className="dashboard-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 750, color: "#F8FAFC", letterSpacing: "-0.45px" }}>{greeting}, {firstName}</div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 5 }}>Here's what's happening across your studio today.</div>
        </div>
        <button
          onClick={onNewClient}
          className="primary-action"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#3FD6AA",
            color: "#06120D",
            border: "none",
            borderRadius: 8,
            minHeight: 40,
            padding: "9px 16px",
            fontSize: 13.5,
            fontWeight: 650,
            cursor: "pointer",
            boxShadow: "0 5px 18px rgba(63, 214, 170, 0.28)",
            transition: "background 0.2s ease",
          }}
        >
          <Icon name="plus" size={14} /> New client
        </button>
      </div>

      <div className="dashboard-stats" style={{ display: "flex", gap: 18, marginBottom: 22 }}>
        <StatCard label="Active projects" value={activeProjects} icon="grid" accent="#3FD6AA" />
        <StatCard label="Pending invoices" value={pendingInvoices} delta="Awaiting payment" icon="file" accent="#A3B2AA" />
        <StatCard label="Outstanding balance" value={currency(outstanding, currencyCode)} delta={`${currency(collected, currencyCode)} collected`} icon="dollar" accent={colors.positive} positive />
      </div>

      <section aria-labelledby="dated-projects-heading" style={{ marginBottom: 22, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "19px 22px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
          <h2 id="dated-projects-heading" style={{ fontSize: 14, fontWeight: 650, color: "#F8FAFC", margin: 0 }}>Scheduled projects</h2>
          <span style={{ fontSize: 11.5, color: colors.textMuted }}>Projects with start and end dates</span>
        </div>
        {datedProjects.length === 0 ? (
          <div style={{ padding: "12px 0 4px", color: colors.textMuted, fontSize: 12.5 }}>No projects have both dates yet. Add a due date to a client invoice to see its project schedule here.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {datedProjects.map((project, index) => {
              const remaining = daysRemaining(project.projectEndDate);
              const startState = dateState(project.projectStartDate);
              const endState = dateState(project.projectEndDate);
              const startLabel = startState === "today" ? "Starts today" : `${startState === "past" ? "Started" : "Starts"} ${formatDate(project.projectStartDate)}`;
              const endLabel = endState === "today" ? "Ends today" : `${endState === "past" ? "Ended" : "Ends"} ${formatDate(project.projectEndDate)}`;
              return (
                <div key={project.id} className="scheduled-project-row" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(180px, 0.9fr) auto", alignItems: "center", gap: 14, padding: "12px 0", borderTop: index ? `1px solid ${colors.divider}` : "none" }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: "#E8F0EB", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.project}</div>
                    <div style={{ color: colors.textMuted, fontSize: 11.5, marginTop: 3 }}>{project.name}</div>
                  </div>
                  <div className="scheduled-project-dates" style={{ display: "grid", gap: 4, color: colors.textMuted, fontSize: 11.5 }}>
                    <span>{startLabel}</span>
                    <span>{endLabel}</span>
                  </div>
                  <div style={{ color: remaining < 0 ? "#F3A17D" : colors.accent, background: remaining < 0 ? "rgba(243,161,125,0.1)" : "rgba(63,214,170,0.1)", borderRadius: 20, padding: "5px 9px", fontSize: 11.5, fontWeight: 650, whiteSpace: "nowrap" }}>
                    {remaining < 0 ? "Overdue" : remaining === 0 ? "Due today" : `${remaining} days left`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="dashboard-panels" style={{ display: "flex", gap: 18 }}>
        <div style={{ flex: 1.4, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "22px 22px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Recent activity</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16 }}>A snapshot of your workspace</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 0 5px", color: colors.textMuted, fontSize: 12.5, lineHeight: 1.6 }}>
              Your workspace activity will appear here as you add clients, invoices, and time entries.
            </div>
          </div>
        </div>

        <div style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "22px 22px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>Studio snapshot</div>
          <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 16 }}>Your current client and invoice totals</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.8 }}>
              <span style={{ color: colors.textMuted }}>Active clients</span>
              <span style={{ fontWeight: 600, color: "#F8FAFC" }}>{activeProjects}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.8 }}>
              <span style={{ color: "#94A3B8" }}>Collected</span>
              <span style={{ fontWeight: 700, color: colors.positive }}>{currency(collected, currencyCode)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.8 }}>
              <span style={{ color: colors.textMuted }}>Awaiting payment</span>
              <span style={{ fontWeight: 600, color: "#D8E1DB" }}>{currency(outstanding, currencyCode)}</span>
            </div>
          </div>
          <div style={{ marginTop: "auto", background: "rgba(63, 214, 170, 0.07)", border: "1px solid rgba(63, 214, 170, 0.14)", borderRadius: 11, padding: "14px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <div style={{ fontSize: 12, color: "#A7D9C4", lineHeight: 1.5 }}>A timely reminder can help keep payments on track.</div>
            <button onClick={onViewInvoices} className="nudge-action">
              <Icon name="send" size={13} /> Nudge overdue invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}