/**
 * LIVE DEMO FILE: src/after/Signup.tsx
 *
 * The Signup component below starts as an exact copy of src/before/Signup.tsx.
 * The state machine refactor sits underneath it, commented out.
 *
 * To swap during the talk:
 *   1. Select everything between the BEFORE markers and toggle comments (Cmd+/ or Ctrl+/).
 *   2. Select everything between the AFTER markers and toggle comments again.
 *   3. Save. Vite hot-reloads the right-hand panel.
 * Toggle both blocks back to return to the bug.
 */
// Imports cover both versions, so swapping never needs an import change.
import { useReducer, useState } from 'react';
import { subscribe } from '../api';
import { Inspector } from '../components/Inspector';
import { ErrorBanner } from '../components/ui';

// ──────────────────────────────────────────────────────────────
// BEFORE: boolean soup (active)
// ──────────────────────────────────────────────────────────────

export function Signup() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDone, setIsDone] = useState(false);

  async function submit() {
    setIsSubmitting(true);
    setHasError(false);
    try {
      await subscribe(email);
      setIsDone(true);
    } catch (e) {
      setHasError(true);
      setErrorMessage((e as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const impossible =
    [isSubmitting, hasError, isDone].filter(Boolean).length > 1 ||
    (errorMessage !== '' && !hasError);

  return (
    <div className="demo">
      <div className="screen">
        <header className="screen-head">
          <h3>Get the monthly digest</h3>
        </header>
        {isDone && <p className="notice success">You're subscribed. Check your inbox to confirm.</p>}
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button onClick={submit}>{isSubmitting ? 'Subscribing…' : 'Subscribe'}</button>
        {errorMessage && <ErrorBanner message={errorMessage} />}
      </div>
      <Inspector values={{ isSubmitting, hasError, isDone, errorMessage }} impossible={impossible} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// END BEFORE
// ──────────────────────────────────────────────────────────────

// ──────────────────────────────────────────────────────────────
// AFTER: state machine (commented out)
// ──────────────────────────────────────────────────────────────

// type State =
//   | { status: 'editing' }
//   | { status: 'submitting' }
//   | { status: 'error'; message: string }
//   | { status: 'done' };
//
// type Event =
//   | { type: 'SUBMIT' }
//   | { type: 'RESOLVE' }
//   | { type: 'REJECT'; message: string };
//
// function machine(state: State, event: Event): State {
//   switch (state.status) {
//     case 'editing':
//     case 'error':
//       return event.type === 'SUBMIT' ? { status: 'submitting' } : state;
//     case 'submitting':
//       if (event.type === 'RESOLVE') return { status: 'done' };
//       if (event.type === 'REJECT') return { status: 'error', message: event.message };
//       return state; // SUBMIT while submitting: ignored
//     case 'done':
//       return state; // nothing leaves done
//   }
// }
//
// export function Signup() {
//   const [email, setEmail] = useState('');
//   const [state, send] = useReducer(machine, { status: 'editing' });
//   const isSubmitting = state.status === 'submitting'; // derived, not stored
//
//   async function submit() {
//     if (isSubmitting) return; // the machine already answers "can I submit?"
//     send({ type: 'SUBMIT' });
//     try {
//       await subscribe(email);
//       send({ type: 'RESOLVE' });
//     } catch (e) {
//       send({ type: 'REJECT', message: (e as Error).message });
//     }
//   }
//
//   return (
//     <div className="demo">
//       <div className="screen">
//         <header className="screen-head">
//           <h3>Get the monthly digest</h3>
//         </header>
//         {state.status === 'done' ? (
//           <p className="notice success">You're subscribed. Check your inbox to confirm.</p>
//         ) : (
//           <>
//             <label className="field">
//               <span>Email</span>
//               <input
//                 type="email"
//                 value={email}
//                 placeholder="you@example.com"
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </label>
//             <button onClick={submit} disabled={isSubmitting}>
//               {isSubmitting ? 'Subscribing…' : 'Subscribe'}
//             </button>
//             {state.status === 'error' && <ErrorBanner message={state.message} />}
//           </>
//         )}
//       </div>
//       <Inspector
//         values={{
//           status: state.status,
//           message: state.status === 'error' ? state.message : null,
//         }}
//         impossible={false}
//       />
//     </div>
//   );
// }

// ──────────────────────────────────────────────────────────────
// END AFTER
// ──────────────────────────────────────────────────────────────
