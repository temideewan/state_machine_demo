# Boolean soup vs. state machine: live demo

A small React + TypeScript app for the talk *State Machines: A Different Way to Think About UI State*. Each screen shows the app UI next to an inspector of its raw state, which turns orange whenever the flags describe a screen nobody designed.

## Run it

```bash
npm install
npm run dev
```

Requires Node 18 or newer.

## What's where

| File | Role |
| --- | --- |
| `src/before/UserList.tsx`, `src/before/Signup.tsx` | Reference boolean-soup versions. Stay on the left panel; don't edit them on stage. |
| `src/after/UserList.tsx`, `src/after/Signup.tsx` | The live files. They start as copies of the before code, with the state machine refactor commented out underneath. |
| `src/api.ts` | Fake backend. The toolbar controls whether responses succeed or fail and how slow they are. |
| `src/components/Inspector.tsx` | The state panel next to each screen. |

## Swapping during the talk

In either `src/after/` file:

1. Select everything between the `BEFORE` markers and toggle line comments (Cmd+/ on macOS, Ctrl+/ on Windows and Linux).
2. Select everything between the `AFTER` markers and toggle line comments again.
3. Save. Vite hot-reloads the right-hand panel.

Toggle both blocks back to return to the buggy version. Both versions type-check, and the imports at the top already cover both, so nothing else needs to change.

## Reproducing the bugs

The steps are listed at the bottom of the app for each tab. Use the **Slow** speed setting when showing double-submits, and **Reset** between runs. The request meter turns orange when more than one request is in flight.

Tick **Show only the live file** when you want the right-hand panel full width on a projector.
