import { useState } from "react";
import Icon from "../components/Icon";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";
import { colors, currency, currencySymbol } from "../theme";

function asISODate(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function displayDate(value) {
  const iso = asISODate(value);
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

function InvoiceEditor({ invoice, currencyCode, onClose, onSave }) {
  const [form, setForm] = useState({
    ...invoice,
    issued: asISODate(invoice.issued),
    due: asISODate(invoice.due),
    amount: String(invoice.amount),
  });
  const [error, setError] = useState("");

  function submit() {
    const amount = Number(form.amount);
    if (!form.issued || !Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid issue date and an amount greater than zero.");
      return;
    }
    onSave({ ...form, amount });
  }

  const fieldStyle = { width: "100%", background: "#0D1A17", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 12px", color: "#EDEFEC", fontSize: 13, marginTop: 6 };

  return (
    <Modal onClose={onClose} ariaLabelledBy="invoice-edit-title">
      <h2 id="invoice-edit-title" style={{ margin: "0 0 16px", fontSize: 16, color: "#F1F3EF" }}>Edit invoice {invoice.id}</h2>
      <label style={{ display: "block", marginBottom: 13, color: colors.textMuted, fontSize: 12.5 }}>Client
        <input value={form.client} readOnly style={{ ...fieldStyle, opacity: 0.75 }} />
      </label>
      <label style={{ display: "block", marginBottom: 13, color: colors.textMuted, fontSize: 12.5 }}>Amount ({currencySymbol(currencyCode)})
        <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={fieldStyle} />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <label style={{ display: "block", marginBottom: 13, color: colors.textMuted, fontSize: 12.5 }}>Issued
          <input type="date" value={form.issued} onChange={(e) => setForm({ ...form, issued: e.target.value })} style={fieldStyle} />
        </label>
        <label style={{ display: "block", marginBottom: 13, color: colors.textMuted, fontSize: 12.5 }}>Due date
          <input type="date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} style={fieldStyle} />
        </label>
      </div>
      <label style={{ display: "block", marginBottom: 16, color: colors.textMuted, fontSize: 12.5 }}>Status
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={fieldStyle}>
          <option>Pending</option>
          <option>Paid</option>
        </select>
      </label>
      {error && <div role="alert" style={{ color: "#FFAA9E", fontSize: 12, marginBottom: 12 }}>{error}</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
        <button className="secondary-action" onClick={onClose}>Cancel</button>
        <button className="primary-action" onClick={submit}>Save changes</button>
      </div>
    </Modal>
  );
}

export default function Invoices({ invoices, profile, search = "", currencyCode = "USD", onUpdateInvoice, onRemoveInvoice }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const collected = invoices.filter((invoice) => invoice.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const outstanding = totalInvoiced - collected;
  const filteredInvoices = invoices.filter((invoice) => `${invoice.id} ${invoice.client} ${invoice.status}`.toLowerCase().includes(search.toLowerCase()));
  const allSelected = filteredInvoices.length > 0 && filteredInvoices.every((invoice) => selectedIds.includes(invoice.id));
  const gridColumns = selectionMode ? "36px 1fr 1.6fr 1fr 1fr 1fr 1fr 112px" : "1fr 1.6fr 1fr 1fr 1fr 1fr 112px";

  function toggleSelected(id) {
    setSelectedIds((previous) => previous.includes(id) ? previous.filter((selectedId) => selectedId !== id) : [...previous, id]);
  }

  function selectAll() {
    setSelectedIds((previous) => allSelected
      ? previous.filter((id) => !filteredInvoices.some((invoice) => invoice.id === id))
      : [...new Set([...previous, ...filteredInvoices.map((invoice) => invoice.id)])]);
  }

  async function exportPDF() {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const generated = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date());

    doc.setFillColor(13, 31, 25);
    doc.rect(0, 0, pageWidth, 43, "F");
    doc.setFillColor(63, 214, 170);
    doc.roundedRect(14, 10, 15, 15, 3, 3, "F");
    doc.setTextColor(6, 18, 13);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("W", 21.5, 20.2, { align: "center" });
    doc.setTextColor(230, 241, 235);
    doc.setFontSize(10);
    doc.text("WORK HUB", 34, 15);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Invoice Summary", 14, 34);
    doc.setTextColor(172, 194, 182);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Client billing report  ·  Generated ${generated}`, pageWidth - 14, 19, { align: "right" });

    const metrics = [
      ["TOTAL INVOICED", currency(totalInvoiced, currencyCode)],
      ["COLLECTED", currency(collected, currencyCode)],
      ["OUTSTANDING", currency(outstanding, currencyCode)],
      ["INVOICES", String(invoices.length)],
    ];
    const gap = 5;
    const cardWidth = (pageWidth - 28 - gap * 3) / 4;
    metrics.forEach(([label, value], index) => {
      const x = 14 + index * (cardWidth + gap);
      doc.setFillColor(245, 249, 247);
      doc.setDrawColor(226, 235, 230);
      doc.roundedRect(x, 51, cardWidth, 23, 2.5, 2.5, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(105, 126, 115);
      doc.text(label, x + 5, 59);
      doc.setFontSize(13);
      doc.setTextColor(index === 1 ? 31 : 24, index === 1 ? 139 : 46, index === 1 ? 101 : 37);
      doc.text(value, x + 5, 68);
    });

    autoTable(doc, {
      startY: 82,
      margin: { left: 14, right: 14, bottom: 17 },
      head: [["INVOICE", "CLIENT", "ISSUE DATE", "DUE DATE", "AMOUNT", "STATUS"]],
      body: invoices.map((invoice) => [invoice.id, invoice.client, displayDate(invoice.issued), displayDate(invoice.due), currency(invoice.amount, currencyCode), invoice.status]),
      theme: "grid",
      styles: { font: "helvetica", fontSize: 9, cellPadding: 4, textColor: [45, 59, 51], lineColor: [226, 235, 230], lineWidth: 0.15 },
      headStyles: { fillColor: [25, 65, 51], textColor: [237, 247, 241], fontStyle: "bold", fontSize: 8 },
      alternateRowStyles: { fillColor: [247, 250, 248] },
      columnStyles: { 0: { cellWidth: 31, fontStyle: "bold" }, 1: { cellWidth: 70 }, 2: { cellWidth: 36 }, 3: { cellWidth: 36 }, 4: { cellWidth: 40, halign: "right", fontStyle: "bold" }, 5: { cellWidth: 35, halign: "center" } },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 5) {
          const paid = data.cell.raw === "Paid";
          data.cell.styles.textColor = paid ? [24, 132, 92] : [168, 116, 38];
          data.cell.styles.fontStyle = "bold";
        }
      },
      didDrawPage: () => {
        const y = pageHeight - 10;
        doc.setDrawColor(222, 231, 226);
        doc.line(14, y - 5, pageWidth - 14, y - 5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(117, 132, 123);
        doc.text(`Prepared for ${profile.title || profile.name || "your studio"}  ·  Generated with Work Hub`, 14, y);
        doc.text(`Page ${doc.internal.getCurrentPageInfo().pageNumber}`, pageWidth - 14, y, { align: "right" });
      },
    });
    doc.save("work-hub-invoice-summary.pdf");
  }

  function deleteInvoice() {
    if (!invoiceToDelete) return;
    onRemoveInvoice(invoiceToDelete.id);
    setSelectedIds((previous) => previous.filter((id) => id !== invoiceToDelete.id));
    setInvoiceToDelete(null);
  }

  function deleteSelected() {
    selectedIds.forEach(onRemoveInvoice);
    setSelectedIds([]);
    setSelectionMode(false);
  }

  function saveEditedInvoice(invoice) {
    onUpdateInvoice(invoice);
    setEditingInvoice(null);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontSize: 19, fontWeight: 600, color: "#F1F3EF" }}>Invoices</div>
        <button onClick={exportPDF} className="secondary-action" style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Icon name="download" size={14} /> Export PDF
        </button>
      </div>
      <div style={{ fontSize: 13, color: "#8B9389", marginBottom: 18 }}>Manage billing across every active engagement.</div>

      <div className="invoice-summary-stats" style={{ display: "flex", gap: 18, marginBottom: 22 }}>
        <StatCard label="Total invoiced" value={currency(totalInvoiced, currencyCode)} icon="file" accent="#3FD6AA" />
        <StatCard label="Collected" value={currency(collected, currencyCode)} icon="check" accent={colors.positive} positive />
        <StatCard label="Outstanding" value={currency(outstanding, currencyCode)} icon="clock" accent="#A3B2AA" />
      </div>

      {selectionMode && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ color: colors.textMuted, fontSize: 12.5 }}>{selectedIds.length} selected</span>
          <button className="danger-action" disabled={!selectedIds.length} onClick={deleteSelected}>Delete selected</button>
          <button className="secondary-action" onClick={() => { setSelectionMode(false); setSelectedIds([]); }}>Done</button>
        </div>
      )}

      <div className="invoice-table-scroll" style={{ position: "relative", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
        <div className="invoice-table-inner" style={{ position: "relative" }}>
        <div className="invoice-table-heading" style={{ display: "grid", gridTemplateColumns: gridColumns, alignItems: "center", padding: "11px 18px", fontSize: 11.5, fontWeight: 600, color: "#91A197", letterSpacing: 0.3, borderBottom: `1px solid ${colors.divider}` }}>
          {selectionMode && <input aria-label="Select all invoices" type="checkbox" checked={allSelected} onChange={selectAll} />}
          <div>INVOICE</div><div>CLIENT</div><div>ISSUED</div><div>DUE</div><div>AMOUNT</div><div>STATUS</div><div style={{ textAlign: "right" }}>MENU</div>
        </div>
        {filteredInvoices.map((invoice, index) => (
          <div key={invoice.id} className={`invoice-data-row${selectionMode ? " is-selectable" : ""}`} style={{ display: "grid", gridTemplateColumns: gridColumns, alignItems: "center", padding: "12px 18px", borderTop: index ? `1px solid ${colors.divider}` : "none", fontSize: 13 }}>
            {selectionMode && <input className="invoice-select-cell" aria-label={`Select invoice ${invoice.id}`} type="checkbox" checked={selectedIds.includes(invoice.id)} onChange={() => toggleSelected(invoice.id)} />}
            <div className="invoice-id-cell" style={{ fontWeight: 600, color: "#EDEFEC" }}>{invoice.id}</div>
            <div className="invoice-client-cell" data-label="Client" style={{ color: "#D8DBD6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{invoice.client}</div>
            <div className="invoice-issued-cell" data-label="Issued" style={{ color: "#A3B2AA", fontSize: 12 }}>{displayDate(invoice.issued)}</div>
            <div className="invoice-due-cell" data-label="Due" style={{ color: "#A3B2AA", fontSize: 12 }}>{displayDate(invoice.due)}</div>
            <div className="invoice-amount-cell" data-label="Amount" style={{ fontWeight: 600, color: invoice.status === "Paid" ? colors.positive : "#EDEFEC" }}>{currency(invoice.amount, currencyCode)}</div>
            <div className="invoice-status-cell" data-label="Status"><Badge status={invoice.status} /></div>
            <div className="invoice-menu-cell" style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
              <button aria-label={`Invoice menu ${invoice.id}`} aria-expanded={openMenuId === invoice.id} onClick={() => setOpenMenuId(openMenuId === invoice.id ? null : invoice.id)} className="invoice-menu-trigger">
                <Icon name="more" size={17} />
              </button>
              {openMenuId === invoice.id && (
                <div className="invoice-menu" role="menu">
                  <button role="menuitem" onClick={() => { setEditingInvoice(invoice); setOpenMenuId(null); }}><Icon name="edit" size={14} /> Edit</button>
                  <button role="menuitem" onClick={() => { setInvoiceToDelete(invoice); setOpenMenuId(null); }}><Icon name="trash" size={14} /> Delete</button>
                  <button role="menuitem" onClick={() => { setSelectionMode(true); toggleSelected(invoice.id); setOpenMenuId(null); }}><Icon name="check" size={14} /> Select</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {!filteredInvoices.length && <div style={{ padding: 28, textAlign: "center", color: colors.textMuted }}>{invoices.length ? "No invoices match your search." : "No invoices yet. Create a client with a project fee to add an invoice."}</div>}
        </div>
      </div>

      {editingInvoice && <InvoiceEditor invoice={editingInvoice} currencyCode={currencyCode} onClose={() => setEditingInvoice(null)} onSave={saveEditedInvoice} />}
      {invoiceToDelete && (
        <Modal onClose={() => setInvoiceToDelete(null)} ariaLabel="Confirm invoice deletion">
          <h2 style={{ margin: "0 0 9px", fontSize: 16 }}>Delete invoice {invoiceToDelete.id}?</h2>
          <p style={{ margin: "0 0 20px", color: colors.textMuted, fontSize: 13, lineHeight: 1.5 }}>This invoice will be permanently removed from your records.</p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
            <button className="secondary-action" onClick={() => setInvoiceToDelete(null)}>Cancel</button>
            <button className="danger-action" onClick={deleteInvoice}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}