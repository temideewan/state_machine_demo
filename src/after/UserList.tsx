/**
 * LIVE DEMO FILE: src/after/UserList.tsx
 *
 * The UserList component below starts as an exact copy of src/before/UserList.tsx.
 * The state machine refactor sits underneath it, commented out.
 *
 * To swap during the talk:
 *   1. Select everything between the BEFORE markers and toggle comments (Cmd+/ or Ctrl+/).
 *   2. Select everything between the AFTER markers and toggle comments again.
 *   3. Save. Vite hot-reloads the right-hand panel.
 * Toggle both blocks back to return to the bug.
 */
// Imports cover both versions, so swapping never needs an import change.
import { useReducer, } from 'react';
import { fetchUsers, type User } from '../api';
import { Inspector } from '../components/Inspector';
import { EmptyState, ErrorBanner, Spinner, UserRows } from '../components/ui';

// ──────────────────────────────────────────────────────────────
// BEFORE: boolean soup (active)
// ──────────────────────────────────────────────────────────────

// export function UserList() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [data, setData] = useState<User[] | null>(null);
//   const [error, setError] = useState<Error | null>(null);

//   async function load() {
//     setIsLoading(true);
//     try {
//       setData(await fetchUsers());
//       setIsSuccess(true);
//     } catch (e) {
//       setError(e as Error);
//       setIsError(true);
//     }
//     setIsLoading(false);
//   }

//   // More than one flag on at once is a screen nobody designed.
//   const impossible = [isLoading, isError, isSuccess].filter(Boolean).length > 1;

//   return (
//     <div className="demo">
//       <div className="screen">
//         <header className="screen-head">
//           <h3>Team members</h3>
//           <button onClick={load}>Load team</button>
//         </header>
//         {!isLoading && !isError && !isSuccess && (
//           <EmptyState>No team loaded yet. Select Load team to fetch it.</EmptyState>
//         )}
//         {isLoading && <Spinner label="Loading team…" />}
//         {isError && <ErrorBanner message={error?.message} onRetry={load} />}
//         {isSuccess && data && <UserRows users={data} />}
//       </div>
//       <Inspector
//         values={{
//           isLoading,
//           isError,
//           isSuccess,
//           data: data ? `${data.length} users` : null,
//           error: error?.message ?? null,
//         }}
//         impossible={impossible}
//       />
//     </div>
//   );
// }

// ──────────────────────────────────────────────────────────────
// END BEFORE
// ──────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────
// AFTER: state machine (commented out)
// ──────────────────────────────────────────────────────────────

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: Error };

type Event =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; data: User[] }
  | { type: 'REJECT'; error: Error }
  | { type: 'RETRY' }
  | { type: 'REFRESH' };

function machine(state: State, event: Event): State {
  switch (state.status) {
    case 'idle':
      return event.type === 'FETCH' ? { status: 'loading' } : state;
    case 'loading':
      if (event.type === 'RESOLVE') return { status: 'success', data: event.data };
      if (event.type === 'REJECT') return { status: 'error', error: event.error };
      return state; // FETCH while loading: ignored
    case 'error':
      return event.type === 'RETRY' ? { status: 'loading' } : state;
    case 'success':
      return event.type === 'REFRESH' ? { status: 'loading' } : state;
  }
}

export function UserList() {
  const [state, send] = useReducer(machine, { status: 'idle' });

  async function load() {
    if (state.status === 'loading') return; // the machine already says no
    if (state.status === 'idle') send({ type: 'FETCH' });
    if (state.status === 'error') send({ type: 'RETRY' });
    if (state.status === 'success') send({ type: 'REFRESH' });
    try {
      send({ type: 'RESOLVE', data: await fetchUsers() });
    } catch (e) {
      send({ type: 'REJECT', error: e as Error });
    }
  }

  // Nothing to flag: one status field can only hold one value.
  return (
    <div className="demo">
      <div className="screen">
        <header className="screen-head">
          <h3>Team members</h3>
          <button onClick={load} disabled={state.status === 'loading'}>
            Load team
          </button>
        </header>
        {state.status === 'idle' && (
          <EmptyState>No team loaded yet. Select Load team to fetch it.</EmptyState>
        )}
        {state.status === 'loading' && <Spinner label="Loading team…" />}
        {state.status === 'error' && <ErrorBanner message={state.error.message} onRetry={load} />}
        {state.status === 'success' && <UserRows users={state.data} />}
      </div>
      <Inspector
        values={{
          status: state.status,
          data: state.status === 'success' ? `${state.data.length} users` : null,
          error: state.status === 'error' ? state.error.message : null,
        }}
        impossible={false}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// END AFTER
// ──────────────────────────────────────────────────────────────
