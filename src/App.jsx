import { useCallback, useEffect, useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import Dashboard from "./screens/Dashboard";
import Clients from "./screens/Clients";
import Invoices from "./screens/Invoices";
import TimeTracking from "./screens/TimeTracking";
import About from "./screens/About";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AddClientModal from "./components/AddClientModal";
import Modal from "./components/Modal";
import ProfileModal from "./components/ProfileModal";

const defaultProfile = { name: "", title: "", photo: "", currency: "" };
const themes = ["dark-green", "dark-neutral", "light"];
const legacyDemoClientEmails = new Map([
  [1, "ava@northwind.co"],
  [2, "jules@orbital.io"],
  [3, "priya@lumen.co"],
  [4, "marcus@drift.dev"],
  [5, "sofia@venlani.co"],
  [6, "diego@flux.studio"],
]);
const legacyDemoInvoiceClients = new Map([
  ["INV-2041", "Ava Mitchell"],
  ["INV-2042", "Jules Tanaka"],
  ["INV-2043", "Priya Raman"],
  ["INV-2044", "Marcus Hale"],
  ["INV-2045", "Diego Romero"],
  ["INV-2046", "Sofia Beltran"],
]);

function loadStoredValue(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(fallback) && !Array.isArray(parsed) ? fallback : parsed;
  } catch {
    return fallback;
  }
}

function loadProfile() {
  try {
    const savedProfile = localStorage.getItem("work-hub-profile");
    return savedProfile ? { ...defaultProfile, ...JSON.parse(savedProfile) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function loadClients() {
  return loadStoredValue("work-hub-clients", []).filter((client) =>
    client && typeof client === "object" &&
    typeof client.name === "string" && typeof client.email === "string" &&
    typeof client.project === "string" &&
    !(legacyDemoClientEmails.get(client.id) === client.email)
  );
}

function loadInvoices() {
  return loadStoredValue("work-hub-invoices", []).filter((invoice) =>
    invoice && typeof invoice === "object" &&
    typeof invoice.id === "string" && typeof invoice.client === "string" &&
    Number.isFinite(Number(invoice.amount)) &&
    !(legacyDemoInvoiceClients.get(invoice.id) === invoice.client)
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia("(min-width: 761px)").matches);
  const [page, setPage] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    const savedTheme = loadStoredValue("work-hub-theme", "dark-green");
    return themes.includes(savedTheme) ? savedTheme : "dark-green";
  });
  const [clients, setClients] = useState(loadClients);
  const [invoices, setInvoices] = useState(loadInvoices);
  const [timeEntries, setTimeEntries] = useState(() => loadStoredValue("work-hub-time-entries", []));
  const [activeTimer, setActiveTimer] = useState(() => loadStoredValue("work-hub-active-timer", null));
  const [timerNow, setTimerNow] = useState(() => Date.now());
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [profile, setProfile] = useState(loadProfile);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const dismissSplash = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("work-hub-clients", JSON.stringify(clients));
      localStorage.setItem("work-hub-invoices", JSON.stringify(invoices));
    } catch {
      // Keep client and invoice changes available for the current session.
    }
  }, [clients, invoices]);

  useEffect(() => {
    const interval = window.setInterval(() => setTimerNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("work-hub-time-entries", JSON.stringify(timeEntries));
      if (activeTimer) localStorage.setItem("work-hub-active-timer", JSON.stringify(activeTimer));
      else localStorage.removeItem("work-hub-active-timer");
    } catch {
      // Keep tracking available for the current session if storage is unavailable.
    }
  }, [timeEntries, activeTimer]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("work-hub-theme", JSON.stringify(theme));
    } catch {
      // Keep the selected theme for this session if storage is unavailable.
    }
  }, [theme]);

  function cycleTheme() {
    setTheme((current) => themes[(themes.indexOf(current) + 1) % themes.length]);
  }

  function saveClient(form) {
    const clientId = editingClient?.id ?? Date.now();
    const initials = form.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const palette = ["#3FD6AA", "#7BCBB0", "#5AAE91", "#95BBA8", "#55C4A0"];
    const updatedClient = {
      ...(editingClient || {}),
      id: clientId,
      name: form.name.trim(),
      email: form.email.trim(),
      project: form.project.trim(),
      projectType: form.projectType,
      status: form.status,
      initials,
      color: editingClient?.color || palette[clients.length % palette.length],
      projectStartDate: form.issued,
      projectEndDate: form.due,
    };

    if (editingClient) {
      setClients((prev) => prev.map((client) => client.id === clientId ? updatedClient : client));
      setInvoices((prev) => prev.map((invoice) => invoice.clientId === clientId || (!invoice.clientId && invoice.client === editingClient.name)
        ? { ...invoice, clientId, client: updatedClient.name, amount: form.amount, issued: form.issued, due: form.due }
        : invoice));
      setEditingClient(null);
    } else {
      const invoiceNumber = Math.max(0, ...invoices.map((invoice) => Number(String(invoice.id).replace(/\D/g, "")) || 0)) + 1;
      setClients((prev) => [updatedClient, ...prev]);
      setInvoices((prev) => [{ id: `INV-${String(invoiceNumber).padStart(4, "0")}`, clientId, client: updatedClient.name, issued: form.issued, due: form.due, amount: form.amount, status: "Pending" }, ...prev]);
      setShowAddClient(false);
    }
  }

  function removeClient() {
    if (!clientToDelete) return;
    const deletedClient = clientToDelete;
    setClients((prev) => prev.filter((client) => client.id !== deletedClient.id));
    setInvoices((prev) => prev.filter((invoice) => invoice.clientId !== deletedClient.id && invoice.client !== deletedClient.name));
    setClientToDelete(null);
  }

  function updateInvoice(updatedInvoice) {
    setInvoices((prev) => prev.map((invoice) => invoice.id === updatedInvoice.id ? updatedInvoice : invoice));
    if (updatedInvoice.clientId != null) {
      setClients((prev) => prev.map((client) => client.id === updatedInvoice.clientId
        ? { ...client, projectStartDate: updatedInvoice.issued, projectEndDate: updatedInvoice.due }
        : client));
    }
  }

  function removeInvoice(id) {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
  }

  function saveProfile(updatedProfile) {
    setProfile(updatedProfile);
    try {
      localStorage.setItem("work-hub-profile", JSON.stringify(updatedProfile));
    } catch {
      // Keep the current-session profile if browser storage is unavailable.
    }
    setShowProfile(false);
  }

  function startTimer(client, now) {
    if (activeTimer) return;
    setActiveTimer({
      clientId: client.id,
      clientName: client.name,
      project: client.project,
      projectType: client.projectType || "Other",
      date: `${new Date(now).getFullYear()}-${String(new Date(now).getMonth() + 1).padStart(2, "0")}-${String(new Date(now).getDate()).padStart(2, "0")}`,
      status: "running",
      accumulatedMs: 0,
      runStartedAt: now,
      billable: true,
    });
  }

  function pauseTimer(now) {
    if (!activeTimer || activeTimer.status !== "running") return;
    setActiveTimer({ ...activeTimer, accumulatedMs: activeTimer.accumulatedMs + now - activeTimer.runStartedAt, status: "paused", runStartedAt: null });
  }

  function resumeTimer(now) {
    if (!activeTimer || activeTimer.status !== "paused") return;
    setActiveTimer({ ...activeTimer, status: "running", runStartedAt: now });
  }

  function setTimerBillable(billable) {
    if (!activeTimer) return;
    setActiveTimer({ ...activeTimer, billable });
  }

  function stopTimer(entry) {
    setTimeEntries((previous) => [entry, ...previous]);
    setActiveTimer(null);
  }

  const shell = {
    fontFamily: "Inter, 'Avenir Next', 'Segoe UI', sans-serif",
    background: "#0D1A17",
    color: "#EDEFEC",
    width: "100%",
    height: "100%",
    minHeight: "min(640px, 100svh)",
    display: "flex",
    flex: 1,
    borderRadius: 0,
    overflow: "hidden",
    border: 0,
    position: "relative",
  };

  return (
    <div className="app-shell" data-theme={theme} style={shell}>
      {showSplash && <SplashScreen onDone={dismissSplash} />}

      {sidebarOpen && <>
        <button className="app-sidebar-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setSidebarOpen(false)} />
        <Sidebar
          page={page}
          setPage={setPage}
          profile={profile}
          onEditProfile={() => setShowProfile(true)}
          onNavigate={() => {
            if (window.matchMedia("(max-width: 760px)").matches) setSidebarOpen(false);
          }}
        />
      </>}

      <div className="app-content" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <Topbar search={search} setSearch={setSearch} setPage={setPage} clients={clients} invoices={invoices} theme={theme} onCycleTheme={cycleTheme} sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)} />

        <div className="app-page" style={{ flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", padding: "26px 28px" }}>
          {page === "dashboard" && (
            <Dashboard clients={clients} invoices={invoices} profile={profile} currencyCode={profile.currency} onNewClient={() => { setPage("clients"); setShowAddClient(true); }} onViewInvoices={() => setPage("invoices")} />
          )}
          {page === "clients" && (
            <Clients clients={clients} search={search} onAddClient={() => setShowAddClient(true)} onEditClient={(client) => setEditingClient(client)} onRemoveClient={(client) => setClientToDelete(client)} />
          )}
          {page === "invoices" && (
            <Invoices invoices={invoices} profile={profile} search={search} currencyCode={profile.currency} onUpdateInvoice={updateInvoice} onRemoveInvoice={removeInvoice} />
          )}
          {page === "time" && (
            <TimeTracking
              clients={clients}
              entries={timeEntries}
              activeTimer={activeTimer}
              now={timerNow}
              onStart={startTimer}
              onPause={pauseTimer}
              onResume={resumeTimer}
              onSetBillable={setTimerBillable}
              onStop={stopTimer}
              onAddEntry={(entry) => setTimeEntries((previous) => [entry, ...previous])}
              onDeleteEntry={(id) => setTimeEntries((previous) => previous.filter((entry) => entry.id !== id))}
              onNewProject={() => { setPage("clients"); setShowAddClient(true); }}
            />
          )}
          {page === "about" && (
            <About onBack={() => setPage("dashboard")} />
          )}
        </div>
      </div>

      {showAddClient && (
        <AddClientModal currencyCode={profile.currency} onClose={() => setShowAddClient(false)} onSubmit={saveClient} />
      )}
      {editingClient && (
        <AddClientModal
          key={editingClient.id}
          client={editingClient}
          invoice={invoices.find((invoice) => invoice.clientId === editingClient.id || (!invoice.clientId && invoice.client === editingClient.name))}
          currencyCode={profile.currency}
          onClose={() => setEditingClient(null)}
          onSubmit={saveClient}
        />
      )}
      {clientToDelete && (
        <Modal onClose={() => setClientToDelete(null)} ariaLabel="Confirm client deletion">
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F3EF", marginBottom: 10 }}>Are you sure you want to delete this client?</div>
          <div style={{ color: "#A3B2AA", fontSize: 13, marginBottom: 20 }}>{clientToDelete.name} and their associated invoice will be removed.</div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
            <button className="secondary-action" onClick={() => setClientToDelete(null)}>Cancel</button>
            <button className="danger-action" onClick={removeClient}>Delete</button>
          </div>
        </Modal>
      )}
      {showProfile && (
        <ProfileModal profile={profile} onClose={() => setShowProfile(false)} onSave={saveProfile} />
      )}
    </div>
  );
}