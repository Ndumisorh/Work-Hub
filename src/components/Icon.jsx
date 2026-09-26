
// A single icon component with every glyph the app needs, so every
// screen imports one thing instead of a dozen separate icon files.
export default function Icon({ name, size = 16, style, className }) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round",
    strokeLinejoin: "round", style, className,
  };

  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    users: <><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2" /><path d="M16.5 7.2a3.2 3.2 0 0 1 0 6.2" /><path d="M20 20c0-2.9-1.7-5.2-4.3-6" /></>,
    file: <><path d="M6 2.5h8l4.5 4.5V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" /><path d="M14 2.5V7h4.5" /></>,
    info: <><circle cx="12" cy="12" r="9.2" /><path d="M12 11v5.5" /><circle cx="12" cy="7.7" r="0.9" fill="currentColor" stroke="none" /></>,
    help: <><circle cx="12" cy="12" r="9.2" /><path d="M9.7 9a2.4 2.4 0 1 1 4.2 1.6c-1.2 1.1-1.9 1.4-1.9 3" /><path d="M12 17.4h.01" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
    bell: <><path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" /><path d="M10 19a2 2 0 0 0 4 0" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <path d="M4 12.5l5 5L20 7" />,
    flag: <><path d="M5 3v18" /><path d="M5 4h11l-2.2 4L16 12H5" /></>,
    user: <><circle cx="12" cy="8" r="3.4" /><path d="M4.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7" /></>,
    send: <path d="M21 3L11 13M21 3l-6.5 18-3.5-8L3 9l18-6z" />,
    calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 9.5h17" /><path d="M8 2.5v5M16 2.5v5" /></>,
    edit: <><path d="M4 20l.9-3.9L16.4 4.6a1.5 1.5 0 0 1 2.1 0l1 1a1.5 1.5 0 0 1 0 2.1L8 19.2 4 20z" /><path d="M14.4 6.6l3 3" /></>,
    trash: <><path d="M4.5 7h15" /><path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" /><path d="M6.5 7l1 12.5A1.5 1.5 0 0 0 9 21h6a1.5 1.5 0 0 0 1.5-1.5L17.5 7" /><path d="M10 11v6M14 11v6" /></>,
    x: <path d="M6 6l12 12M18 6L6 18" />,
    dollar: <><circle cx="12" cy="12" r="9.2" /><path d="M12 7v10M9.5 15a2.6 2.6 0 0 0 2.6 1.6h.5a2.4 2.4 0 0 0 0-4.8h-1a2.4 2.4 0 0 1 0-4.8h.4A2.6 2.6 0 0 1 14.5 8.6" /></>,
    clock: <><circle cx="12" cy="12" r="9.2" /><path d="M12 7v5.3l3.6 2.1" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    moon: <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2z" />,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1.1a2 2 0 0 0 1.5-3.3 1.7 1.7 0 0 1 1.3-2.8H18a3 3 0 0 0 3-3c0-4.9-4-8.9-9-8.9z" /><circle cx="7.5" cy="11" r=".8" fill="currentColor" /><circle cx="10" cy="7.5" r=".8" fill="currentColor" /><circle cx="15" cy="8" r=".8" fill="currentColor" /></>,
    play: <path d="M8 5.5v13l10-6.5z" fill="currentColor" stroke="none" />,
    pause: <><path d="M8 5.5h3v13H8z" fill="currentColor" stroke="none" /><path d="M15 5.5h3v13h-3z" fill="currentColor" stroke="none" /></>,
    arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
    download: <><path d="M12 3v13" /><path d="M7 11l5 5 5-5" /><path d="M4 20.5h16" /></>,
    chevron: <path d="M6 9l6 6 6-6" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    inbox: <><path d="M3.5 12h5l1.7 3h3.6l1.7-3h5" /><path d="M6.4 5h11.2L21 12v6a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18v-6z" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}
