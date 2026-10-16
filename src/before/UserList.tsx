/**
 * REFERENCE: boolean soup. Leave this file alone during the talk;
 * it stays on the left so the audience can compare.
 */
import { useState } from 'react';
import { fetchUsers, type User } from '../api';
import { Inspector } from '../components/Inspector';
import { EmptyState, ErrorBanner, Spinner, UserRows } from '../components/ui';

export function UserList() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState<User[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      setData(await fetchUsers());
      setIsSuccess(true);
    } catch (e) {
      setError(e as Error);
      setIsError(true);
    }
    setIsLoading(false);
  }

  // More than one flag on at once is a screen nobody designed.
  const impossible = [isLoading, isError, isSuccess].filter(Boolean).length > 1;

  return (
    <div className="demo">
      <div className="screen">
        <header className="screen-head">
          <h3>Team members</h3>
          <button onClick={load}>Load team</button>
        </header>
        {!isLoading && !isError && !isSuccess && (
          <EmptyState>No team loaded yet. Select Load team to fetch it.</EmptyState>
        )}
        {isLoading && <Spinner label="Loading team…" />}
        {isError && <ErrorBanner message={error?.message} onRetry={load} />}
        {isSuccess && data && <UserRows users={data} />}
      </div>
      <Inspector
        values={{
          isLoading,
          isError,
          isSuccess,
          data: data ? `${data.length} users` : null,
          error: error?.message ?? null,
        }}
        impossible={impossible}
      />
    </div>
  );
}
