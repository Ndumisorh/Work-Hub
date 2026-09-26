# Work Hub

## Folder structure

```
src/
  App.jsx                    Wires everything together: holds shared state
                              (which screen is active, client list, invoice
                              list, search text, modal visibility) and
                              renders the sidebar + topbar + active screen.
  theme.js                   Colors and the currency() formatter, shared by
                              every file below.

  data/
    seedData.js               Starting clients, invoices, activity feed, and
                              notifications.

  screens/
    SplashScreen.jsx           Launch screen with the logo mark, tagline, and
                              loading bar. Auto-advances to the dashboard.
    Dashboard.jsx              Greeting, stat cards, recent activity, weekly
                              snapshot.
    Clients.jsx                Searchable client table with edit/delete.
    Invoices.jsx                Billing stats and the invoice table with a
                              mark paid/pending toggle.
    About.jsx                  Static info screen about the app.

  components/
    Sidebar.jsx                 Left navigation, shared by all screens.
    Topbar.jsx                  Search bar + notifications dropdown, shared
                              by all screens.
    AddClientModal.jsx          "Add a new client" form, opened from the
                              Dashboard and Clients screens.
    Icon.jsx                    Every icon glyph the app uses.
    Badge.jsx                   Colored status pill (In progress, Paid, etc).
    StatCard.jsx                Metric card used on Dashboard and Invoices.
    NavItem.jsx                  Single sidebar link.
    Modal.jsx                   Generic overlay wrapper.
    Field.jsx                   Labeled text input used in forms.
```

## Editing a single screen

Each screen only needs the data and callbacks it's given as props from
`App.jsx` — you can open, say, `screens/Invoices.jsx` on its own and see
everything that screen does. To change what a screen shows or how it
behaves, that screen's file is the only one you need to touch. To change
shared chrome (sidebar, search bar, notifications), edit the matching file
in `components/`.

## Running it

This is a plain React component tree (no build config included). Drop the
`src/` folder into any React project (Vite, Create React App, Next.js) and
render `<App />`.
