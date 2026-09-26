import { useState } from "react";
import Modal from "./Modal";
import Field from "./Field";
import Icon from "./Icon";
import { currencySymbol } from "../theme";

function todayISO() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function asISODate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function AddClientModal({ onClose, onSubmit, client, invoice, currencyCode = "USD" }) {
  const [form, setForm] = useState(() => ({
    name: client?.name || "",
    email: client?.email || "",
    project: client?.project || "",
    projectType: client?.projectType || "Other",
    status: client?.status || "In progress",
    amount: invoice?.amount != null ? String(invoice.amount) : "",
    issueMode: client ? "manual" : "today",
    issued: asISODate(invoice?.issued) || todayISO(),
    hasDueDate: Boolean(invoice?.due),
    due: asISODate(invoice?.due),
  }));
  const [error, setError] = useState("");

  function submit() {
    const amount = Number(form.amount);
    if (!form.name.trim() || !form.email.trim() || !form.project.trim()) {
      setError("Enter the client name, email, and project title.");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a fee amount greater than zero.");
      return;
    }
    if (form.issueMode === "manual" && !form.issued) {
      setError("Choose an issued date.");
      return;
    }
    if (form.hasDueDate && !form.due) {
      setError("Choose a due date or select No due date.");
      return;
    }
    const issuedDate = form.issueMode === "today" ? todayISO() : form.issued;
    if (form.hasDueDate && form.due < issuedDate) {
      setError("The due date cannot be earlier than the issued date.");
      return;
    }
    onSubmit({
      ...form,
      amount,
      issued: issuedDate,
      due: form.hasDueDate ? form.due : "",
    });
  }

  const inputStyle = { width: "100%", boxSizing: "border-box", background: "#0D1A17", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 12px", color: "#EDEFEC", fontSize: 13.5, outline: "none" };
  const choiceStyle = (active) => ({ display: "flex", alignItems: "center", gap: 7, color: active ? "#DDF5E9" : "#A3B2AA", fontSize: 12.5, cursor: "pointer" });

  return (
    <Modal onClose={onClose} ariaLabel={client ? "Edit client details" : "Add a new client"}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600 }}>{client ? "Edit client details" : "New client and invoice"}</div>
        <button onClick={onClose} aria-label="Close" style={{ background: "transparent", border: "none", color: "#8B9389", cursor: "pointer", padding: 4 }}>
          <Icon name="x" size={16} />
        </button>
      </div>
      <div style={{ fontSize: 12.5, color: "#8B9389", marginBottom: 16 }}>{client ? "Update the client and their invoice details." : "Add client details, project fee, and invoice dates."}</div>

      <Field label="Full name" placeholder="e.g. Riley Chen" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Field label="Email address" placeholder="riley@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Field label="Project title" placeholder="Landing page redesign" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} />

      <label style={{ display: "block", marginBottom: 14, color: "#A3B2AA", fontSize: 12.5 }}>Project type
        <select value={form.projectType} onChange={(e) => setForm({ ...form, projectType: e.target.value })} style={{ width: "100%", boxSizing: "border-box", background: "#0D1A17", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 12px", color: "#EDEFEC", fontSize: 13.5, marginTop: 6 }}>
          <option>Branding &amp; identity</option>
          <option>Design</option>
          <option>Web development</option>
          <option>Mobile app</option>
          <option>Marketing</option>
          <option>Consulting</option>
          <option>Other</option>
        </select>
      </label>

      <Field label={`Project / fee amount (${currencySymbol(currencyCode)})`} type="number" min="0.01" step="0.01" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: "#A3B2AA", marginBottom: 8, fontWeight: 500 }}>Issued date</div>
        <div style={{ display: "flex", gap: 16, marginBottom: form.issueMode === "manual" ? 9 : 0 }}>
          <label style={choiceStyle(form.issueMode === "today")}><input type="radio" name="issueMode" checked={form.issueMode === "today"} onChange={() => setForm({ ...form, issueMode: "today" })} /> Use today</label>
          <label style={choiceStyle(form.issueMode === "manual")}><input type="radio" name="issueMode" checked={form.issueMode === "manual"} onChange={() => setForm({ ...form, issueMode: "manual" })} /> Choose date</label>
        </div>
        {form.issueMode === "manual" && <input aria-label="Manual issued date" type="date" value={form.issued} onChange={(e) => setForm({ ...form, issued: e.target.value })} style={inputStyle} />}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12.5, color: "#A3B2AA", marginBottom: 8, fontWeight: 500 }}>Due date</div>
        <div style={{ display: "flex", gap: 16, marginBottom: form.hasDueDate ? 9 : 0 }}>
          <label style={choiceStyle(!form.hasDueDate)}><input type="radio" name="dueMode" checked={!form.hasDueDate} onChange={() => setForm({ ...form, hasDueDate: false, due: "" })} /> No due date</label>
          <label style={choiceStyle(form.hasDueDate)}><input type="radio" name="dueMode" checked={form.hasDueDate} onChange={() => setForm({ ...form, hasDueDate: true })} /> Choose date</label>
        </div>
        {form.hasDueDate && <input aria-label="Invoice due date" type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} style={inputStyle} />}
      </div>

      <label style={{ display: "block", marginBottom: 18 }}>
        <span style={{ display: "block", fontSize: 12.5, color: "#8B9389", marginBottom: 6, fontWeight: 500 }}>Status</span>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={{ width: "100%", boxSizing: "border-box", background: "#0D1A17", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 12px", color: "#EDEFEC", fontSize: 13.5, outline: "none" }}
        >
          <option>In progress</option>
          <option>Lead</option>
          <option>On hold</option>
          <option>Completed</option>
        </select>
      </label>

      {error && <div role="alert" style={{ color: "#FFAA9E", fontSize: 12.5, marginTop: -8, marginBottom: 12 }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#D8DBD6", borderRadius: 9, padding: "9px 16px", fontSize: 13, cursor: "pointer" }}>Cancel</button>
        <button onClick={submit} className="primary-action" style={{ minHeight: 38, display: "inline-flex", alignItems: "center", gap: 6, background: "#3FD6AA", border: "none", color: "#06120D", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 650, cursor: "pointer", boxShadow: "0 4px 12px rgba(63,214,170,0.18)" }}><Icon name={client ? "check" : "plus"} size={14} /> {client ? "Save changes" : "New client"}</button>
      </div>
    </Modal>
  );
}
