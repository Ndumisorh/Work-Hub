import { useState } from "react";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";
import { colors } from "../theme";

const inputStyle = { width: "100%", boxSizing: "border-box", background: "#0D1A17", border: `1px solid ${colors.borderStrong}`, borderRadius: 9, padding: "9px 12px", color: "#EDEFEC", fontSize: 13 };

function dateISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatHours(seconds) {
  return `${(seconds / 3600).toFixed(1)}h`;
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function weekStart(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

function ManualEntryModal({ clients, onClose, onSave }) {
  const [clientId, setClientId] = useState(clients[0] ? String(clients[0].id) : "");
  const [date, setDate] = useState(dateISO(new Date()));
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");
  const [billable, setBillable] = useState(true);
  const [error, setError] = useState("");
  const client = clients.find((item) => String(item.id) === clientId);

  function submit(event) {
    event.preventDefault();
    const durationSeconds = Math.round(Number(hours) * 3600);
    if (!client || !date || !Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      setError("Choose a project, date, and duration greater than zero.");
      return;
    }
    onSave({
      id: `time-${Date.now()}`,
      clientId: client.id,
      client: client.name,
      project: client.project,
      projectType: client.projectType || "Other",
      date,
      durationSeconds,
      notes: notes.trim(),
      billable,
      source: "manual",
    });
  }

  return (
    <Modal onClose={onClose} ariaLabelledBy="manual-time-title">
      <form onSubmit={submit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
          <h2 id="manual-time-title" style={{ margin: 0, color: "#F1F3EF", fontSize: 16 }}>Add time manually</h2>
          <button type="button" onClick={onClose} aria-label="Close" style={{ border: 0, background: "transparent", color: colors.textMuted, cursor: "pointer" }}><Icon name="x" size={16} /></button>
        </div>
        <label style={{ display: "block", color: colors.textMuted, fontSize: 12.5, marginBottom: 13 }}>Project
          <select value={clientId} onChange={(event) => setClientId(event.target.value)} style={{ ...inputStyle, marginTop: 6 }}>
            {clients.map((item) => <option key={item.id} value={item.id}>{item.project} · {item.name}</option>)}
          </select>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
          <label style={{ display: "block", color: colors.textMuted, fontSize: 12.5, marginBottom: 13 }}>Date
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} style={{ ...inputStyle, marginTop: 6 }} />
          </label>
          <label style={{ display: "block", color: colors.textMuted, fontSize: 12.5, marginBottom: 13 }}>Hours
            <input type="number" min="0.01" step="0.01" placeholder="2.5" value={hours} onChange={(event) => setHours(event.target.value)} style={{ ...inputStyle, marginTop: 6 }} />
          </label>
        </div>
        <label style={{ display: "block", color: colors.textMuted, fontSize: 12.5, marginBottom: 13 }}>Note <span style={{ opacity: 0.65 }}>(optional)</span>
          <input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="e.g. Logo concepts and review" maxLength={140} style={{ ...inputStyle, marginTop: 6 }} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, color: colors.textMuted, fontSize: 12.5, marginBottom: 16 }}>
          <input type="checkbox" checked={billable} onChange={(event) => setBillable(event.target.checked)} /> Billable time
        </label>
        {error && <div role="alert" style={{ color: "#FFAA9E", fontSize: 12, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" className="secondary-action" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-action" style={{ border: 0, borderRadius: 9, padding: "9px 14px", background: colors.accent, color: "#06120D", fontWeight: 650, cursor: "pointer" }}>Save time</button>
        </div>
      </form>
    </Modal>
  );
}

export default function TimeTracking({ clients, entries, activeTimer, now, onStart, onPause, onResume, onSetBillable, onStop, onAddEntry, onDeleteEntry, onNewProject }) {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const currentWeekStart = weekStart(new Date());
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const weekEntries = entries.filter((entry) => entry.date >= dateISO(currentWeekStart) && entry.date <= dateISO(new Date()));
  const monthEntries = entries.filter((entry) => entry.date.startsWith(currentMonth));
  const weekSeconds = weekEntries.reduce((sum, entry) => sum + entry.durationSeconds, 0);
  const monthSeconds = monthEntries.reduce((sum, entry) => sum + entry.durationSeconds, 0);
  const weekBillable = weekEntries.filter((entry) => entry.billable).reduce((sum, entry) => sum + entry.durationSeconds, 0);
  const activeClient = activeTimer ? clients.find((client) => client.id === activeTimer.clientId) : null;
  const activeSeconds = activeTimer ? Math.floor((activeTimer.accumulatedMs + (activeTimer.status === "running" ? now - activeTimer.runStartedAt : 0)) / 1000) : 0;

  const dailyTotals = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + index);
    const iso = dateISO(date);
    const seconds = weekEntries.filter((entry) => entry.date === iso).reduce((sum, entry) => sum + entry.durationSeconds, 0);
    return { label: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date), date: iso, seconds };
  });
  const maxDaySeconds = Math.max(3600, ...dailyTotals.map((day) => day.seconds));

  const projectTotals = (() => {
    const totals = new Map();
    entries.forEach((entry) => {
      const current = totals.get(entry.clientId) || { project: entry.project, client: entry.client, seconds: 0 };
      current.seconds += entry.durationSeconds;
      totals.set(entry.clientId, current);
    });
    return [...totals.entries()].sort((a, b) => b[1].seconds - a[1].seconds);
  })();
  const maxProjectSeconds = Math.max(1, ...projectTotals.map(([, project]) => project.seconds));

  function formatDate(value) {
    const date = new Date(`${value}T00:00:00`);
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
  }

  function timerFor(client) {
    return activeTimer?.clientId === client.id;
  }

  function stopTimer() {
    if (!activeTimer) return;
    const totalMs = activeTimer.accumulatedMs + (activeTimer.status === "running" ? now - activeTimer.runStartedAt : 0);
    onStop({
      id: `time-${Date.now()}`,
      clientId: activeTimer.clientId,
      client: activeClient?.name || activeTimer.clientName,
      project: activeClient?.project || activeTimer.project,
      projectType: activeClient?.projectType || activeTimer.projectType || "Other",
      date: activeTimer.date,
      durationSeconds: Math.max(1, Math.round(totalMs / 1000)),
      notes: "",
      billable: activeTimer.billable !== false,
      source: "timer",
    });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 4 }}>
        <div style={{ fontSize: 20, fontWeight: 650, color: "#F1F3EF" }}>Time tracking</div>
        <button onClick={() => setShowManualEntry(true)} className="secondary-action" disabled={!clients.length} title={!clients.length ? "Add a project before entering time" : "Add a time entry"}><Icon name="plus" size={14} /> Add time</button>
      </div>
      <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 20 }}>Track project hours when you want. Your timer stays in your control.</div>

      <div style={{ display: "flex", gap: 14, marginBottom: 18 }} className="dashboard-stats">
        <StatCard label="This week" value={formatHours(weekSeconds)} icon="clock" accent={colors.accent} />
        <StatCard label="This month" value={formatHours(monthSeconds)} icon="calendar" accent="#70B7F2" />
        <StatCard label="Billable this week" value={formatHours(weekBillable)} icon="dollar" accent={colors.positive} positive />
      </div>

      <div className="time-tracking-layout" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.9fr)", gap: 16, alignItems: "start" }}>
        <section style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 15 }}>
            <h2 style={{ margin: 0, fontSize: 14, color: "#F1F3EF" }}>Projects</h2>
            <span style={{ color: colors.textMuted, fontSize: 11.5 }}>{clients.length} available</span>
          </div>
          {clients.length === 0 ? (
            <div style={{ padding: "18px 0", color: colors.textMuted, fontSize: 12.5 }}>Add a client and project before tracking time. <button onClick={onNewProject} style={{ border: 0, background: "none", padding: 0, color: colors.accent, cursor: "pointer" }}>Create project</button></div>
          ) : clients.map((client, index) => {
            const isActive = timerFor(client);
            const anotherTimerRunning = Boolean(activeTimer && !isActive);
            const seconds = projectTotals.find(([id]) => id === client.id)?.[1].seconds || 0;
            return (
              <div key={client.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "13px 0", borderTop: index ? `1px solid ${colors.divider}` : "1px solid transparent" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                    <span style={{ color: "#EDEFEC", fontSize: 13, fontWeight: 600, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{client.project}</span>
                    {isActive && <span style={{ color: colors.accent, fontSize: 10.5, whiteSpace: "nowrap" }}>{activeTimer.status === "running" ? "TRACKING" : "PAUSED"}</span>}
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 11.5, marginTop: 4 }}>{client.name} · {client.projectType || "Other"} · {formatHours(seconds)} tracked</div>
                </div>
                {isActive ? (
                  <div className="time-project-controls" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 7, flexShrink: 0 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, color: colors.textMuted, fontSize: 10.5, whiteSpace: "nowrap" }} title="Include this timer in billable hours">
                      <input type="checkbox" checked={activeTimer.billable !== false} onChange={(event) => onSetBillable(event.target.checked)} /> Billable
                    </label>
                    <span aria-live="off" style={{ color: "#F1F3EF", fontSize: 13, fontVariantNumeric: "tabular-nums", minWidth: 67 }}>{formatDuration(activeSeconds)}</span>
                    <button className="secondary-action" aria-label={activeTimer.status === "running" ? "Pause timer" : "Resume timer"} title={activeTimer.status === "running" ? "Pause" : "Resume"} onClick={() => activeTimer.status === "running" ? onPause(now) : onResume(now)} style={{ minHeight: 33, padding: "6px 9px" }}>
                      <Icon name={activeTimer.status === "running" ? "pause" : "play"} size={13} />
                    </button>
                    <button className="danger-action" onClick={stopTimer} style={{ minHeight: 33, padding: "6px 10px" }}>Stop</button>
                  </div>
                ) : (
                  <button className="secondary-action" disabled={anotherTimerRunning} onClick={() => onStart(client, now)} title={anotherTimerRunning ? "Stop the current timer first" : "Start project timer"} style={{ minHeight: 33, padding: "6px 10px" }}><Icon name="play" size={13} /> Start</button>
                )}
              </div>
            );
          })}
          {activeTimer && !activeClient && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, color: "#E7C78A", fontSize: 11.5, marginTop: 8 }}>This timer belongs to a removed project.<button className="danger-action" onClick={stopTimer} style={{ minHeight: 30, padding: "5px 9px" }}>Stop and save</button></div>}
        </section>

        <section style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 17 }}>
            <h2 style={{ margin: 0, fontSize: 14, color: "#F1F3EF" }}>This week</h2>
            <span style={{ color: colors.textMuted, fontSize: 11.5 }}>Hours per day</span>
          </div>
          <div role="img" aria-label="Bar chart of hours tracked each day this week" style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 9, height: 128, alignItems: "end", borderBottom: `1px solid ${colors.divider}`, padding: "0 1px 8px" }}>
            {dailyTotals.map((day) => (
              <div key={day.date} title={`${day.label}: ${formatHours(day.seconds)}`} style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 7 }}>
                <div style={{ width: "100%", height: `${Math.max(day.seconds ? 8 : 2, day.seconds / maxDaySeconds * 86)}px`, background: day.seconds ? "linear-gradient(180deg,#63E2B6,#259B77)" : "rgba(255,255,255,0.06)", borderRadius: "5px 5px 2px 2px", transition: "height 180ms ease" }} />
                <span style={{ color: colors.textMuted, fontSize: 10.5 }}>{day.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", color: colors.textMuted, fontSize: 11.5 }}><span>Total time</span><strong style={{ color: "#EDEFEC" }}>{formatHours(weekSeconds)}</strong></div>
          <div style={{ marginTop: 5, display: "flex", justifyContent: "space-between", color: colors.textMuted, fontSize: 11.5 }}><span>Billable portion</span><span style={{ color: colors.positive }}>{formatHours(weekBillable)}</span></div>
        </section>
      </div>

      <section style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20, marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 14, color: "#F1F3EF" }}>Hours by project</h2>
          <span style={{ color: colors.textMuted, fontSize: 11.5 }}>All time</span>
        </div>
        {projectTotals.length === 0 ? <div style={{ color: colors.textMuted, fontSize: 12.5, padding: "8px 0" }}>Your project totals will appear here after you log time.</div> : (
          <div style={{ display: "grid", gap: 12 }}>
            {projectTotals.slice(0, 6).map(([id, project]) => (
              <div key={id} style={{ display: "grid", gridTemplateColumns: "minmax(100px, 1fr) minmax(80px, 1.5fr) 48px", alignItems: "center", gap: 12 }}>
                <div style={{ minWidth: 0 }}><div style={{ color: "#EDEFEC", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.project}</div><div style={{ color: colors.textMuted, fontSize: 10.5, marginTop: 2 }}>{project.client}</div></div>
                <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 9, overflow: "hidden" }}><div style={{ width: `${project.seconds / maxProjectSeconds * 100}%`, height: "100%", background: colors.accent, borderRadius: 9 }} /></div>
                <div style={{ color: "#D8E1DB", textAlign: "right", fontSize: 11.5 }}>{formatHours(project.seconds)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20, marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 14, color: "#F1F3EF" }}>Recent time entries</h2>
          <span style={{ color: colors.textMuted, fontSize: 11.5 }}>{entries.length} total</span>
        </div>
        {entries.length === 0 ? <div style={{ color: colors.textMuted, fontSize: 12.5, padding: "10px 0" }}>No time logged yet. Start a timer or add an entry manually.</div> : (
          <div>
            {[...entries].sort((a, b) => `${b.date}-${b.id}`.localeCompare(`${a.date}-${a.id}`)).slice(0, 12).map((entry, index) => (
              <div key={entry.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", alignItems: "center", gap: 14, padding: "11px 0", borderTop: index ? `1px solid ${colors.divider}` : `1px solid ${colors.divider}` }}>
                <div style={{ minWidth: 0 }}><div style={{ color: "#EDEFEC", fontSize: 12.5, fontWeight: 550, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.project} <span style={{ color: colors.textMuted, fontWeight: 400 }}>· {entry.client}</span></div><div style={{ color: colors.textMuted, fontSize: 10.5, marginTop: 3 }}>{formatDate(entry.date)} · {entry.source === "manual" ? "Manual entry" : "Timer"}{entry.notes ? ` · ${entry.notes}` : ""} · {entry.billable ? "Billable" : "Non-billable"}</div></div>
                <div style={{ color: "#D8E1DB", fontSize: 12, fontVariantNumeric: "tabular-nums" }}>{formatHours(entry.durationSeconds)}</div>
                <button onClick={() => onDeleteEntry(entry.id)} aria-label={`Delete time entry for ${entry.project} on ${formatDate(entry.date)}`} title="Delete time entry" style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: `1px solid ${colors.border}`, borderRadius: 8, background: "transparent", color: "#D88D84", cursor: "pointer" }}><Icon name="trash" size={13} /></button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showManualEntry && <ManualEntryModal clients={clients} onClose={() => setShowManualEntry(false)} onSave={(entry) => { onAddEntry(entry); setShowManualEntry(false); }} />}
    </div>
  );
}
