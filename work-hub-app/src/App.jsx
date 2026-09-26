import { useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import Dashboard from "./screens/Dashboard";
import Clients from "./screens/Clients";
import Invoices from "./screens/Invoices";
import About from "./screens/About";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AddClientModal from "./components/AddClientModal";
import { initialClients, initialInvoices } from "./data/seedData";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [clients, setClients] = useState(initialClients);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [search, setSearch] = useState("");

  function addClient(form) {
    const initials = form.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const palette = ["#3E7BFA", "#34C6A0", "#B98CE8", "#E8A33D", "#E5675F"];
    setClients((prev) => [
      { id: Date.now(), name: form.name, email: form.email, project: form.project || "Untitled project", status: form.status, initials, color: palette[prev.length % palette.length] },
      ...prev,
    ]);
    setShowAddClient(false);
  }

  function removeClient(id) {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleInvoiceStatus(id) {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: inv.status === "Paid" ? "Pending" : "Paid" } : inv)));
  }

  const shell = {
    fontFamily: "-apple-system, 'Inter', 'Segoe UI', sans-serif",
    background: "#0A0D0B",
    color: "#EDEFEC",
    width: "100%",
    minHeight: 640,
    display: "flex",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #1B211D",
    position: "relative",
  };

  return (
    <div style={shell}>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <Sidebar page={page} setPage={setPage} clientCount={clients.length} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar search={search} setSearch={setSearch} showNotifs={showNotifs} setShowNotifs={setShowNotifs} />

        <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>
          {page === "dashboard" && (
            <Dashboard clients={clients} invoices={invoices} onNewClient={() => { setPage("clients"); setShowAddClient(true); }} />
          )}
          {page === "clients" && (
            <Clients clients={clients} search={search} onAddClient={() => setShowAddClient(true)} onRemoveClient={removeClient} />
          )}
          {page === "invoices" && (
            <Invoices invoices={invoices} onToggleStatus={toggleInvoiceStatus} />
          )}
          {page === "about" && (
            <About onBack={() => setPage("dashboard")} />
          )}
        </div>
      </div>

      {showAddClient && (
        <AddClientModal onClose={() => setShowAddClient(false)} onAdd={addClient} />
      )}
    </div>
  );
}
