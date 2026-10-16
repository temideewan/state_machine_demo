/**
 * REFERENCE: boolean soup. Leave this file alone during the talk;
 * it stays on the left so the audience can compare.
 */
import { useState } from 'react';
import { subscribe } from '../api';
import { Inspector } from '../components/Inspector';
import { ErrorBanner } from '../components/ui';

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
