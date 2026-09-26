import { useState } from "react";
import Icon from "./Icon";
import { colors } from "../theme";

export default function Topbar({ search, setSearch, setPage, clients, invoices, theme, onCycleTheme, sidebarOpen, onToggleSidebar }) {
  const [resultSelected, setResultSelected] = useState(false);
  const query = search.trim().toLowerCase();
  const resultGroups = query ? [
    {
      label: "Clients",
      page: "clients",
      items: clients
        .filter((client) => `${client.name} ${client.email}`.toLowerCase().includes(query))
        .slice(0, 4)
        .map((client) => ({ id: `client-${client.id}`, title: client.name, subtitle: client.email, page: "clients", filterQuery: client.name })),
    },
    {
      label: "Projects",
      page: "clients",
      items: clients
        .filter((client) => client.project.toLowerCase().includes(query))
        .slice(0, 4)
        .map((client) => ({ id: `project-${client.id}`, title: client.project, subtitle: client.name, page: "clients", filterQuery: client.project })),
    },
    {
      label: "Invoices",
      page: "invoices",
      items: invoices
        .filter((invoice) => `${invoice.id} ${invoice.client}`.toLowerCase().includes(query))
        .slice(0, 4)
        .map((invoice) => ({ id: `invoice-${invoice.id}`, title: invoice.id, subtitle: `${invoice.client} · ${invoice.status}`, page: "invoices", filterQuery: invoice.id })),
    },
  ] : [];
  const matchingResults = resultGroups.flatMap((group) => group.items);
  const themeDetails = {
    "dark-green": { label: "Dark Green", icon: "palette" },
    "dark-neutral": { label: "Dark Neutral", icon: "moon" },
    light: { label: "Light Mode", icon: "sun" },
  }[theme] || { label: "Dark Green", icon: "palette" };

  function openSearchResult(result) {
    setPage(result.page);
    setSearch(result.filterQuery);
    setResultSelected(true);
  }

  return (
    <div className="app-topbar" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderBottom: `1px solid ${colors.divider}`, flexShrink: 0 }}>
      <button
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        className="sidebar-toggle"
      >
        <Icon name="menu" size={17} />
      </button>
      <div className="global-search" style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", gap: 8, background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "8px 12px", maxWidth: 380 }}>
        <Icon name="search" size={15} style={{ color: "#6D746E" }} />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setResultSelected(false); }}
          onKeyDown={(event) => { if (event.key === "Enter" && matchingResults[0]) openSearchResult(matchingResults[0]); }}
          placeholder="Search clients, invoices, projects..."
          style={{ border: "none", outline: "none", background: "transparent", color: "#EDEFEC", fontSize: 13, flex: 1 }}
        />
        {query && !resultSelected && <div className="global-search-popover" role="listbox" aria-label="Search results">
          {matchingResults.length ? resultGroups.filter((group) => group.items.length > 0).map((group) => (
            <div className="global-search-group" key={group.label} role="group" aria-label={group.label}>
              <div className="global-search-heading"><span>{group.label}</span><span>{group.items.length}</span></div>
              {group.items.map((result) => (
                <button className="global-search-result" key={result.id} role="option" aria-selected="false" onClick={() => openSearchResult(result)}>
                  <span className="global-search-copy"><span className="global-search-title">{result.title}</span><span className="global-search-subtitle">{result.subtitle}</span></span>
                  <Icon name="arrowRight" size={14} className="global-search-arrow" />
                </button>
              ))}
            </div>
          )) : <div className="global-search-empty">No matching clients, projects, or invoices.</div>}
        </div>}
      </div>
      <button className="theme-cycle-button" type="button" onClick={onCycleTheme} aria-label={`Current theme: ${themeDetails.label}. Click to switch theme`} title={`Theme: ${themeDetails.label} · Click to change`}>
        <Icon name={themeDetails.icon} size={15} />
        <span>{themeDetails.label}</span>
      </button>
    </div>
  );
}
