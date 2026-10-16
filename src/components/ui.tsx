import type { ReactNode } from 'react';
import type { User } from '../api';

export function Spinner({ label }: { label: string }) {
  return (
    <p className="spinner" role="status">
      <span className="spinner-dot" aria-hidden="true" />
      {label}
    </p>
  );
}

export function ErrorBanner({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="notice error" role="alert">
      <p>{message ?? 'Something failed.'}</p>
      {onRetry && (
        <button className="link" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}

export function UserRows({ users }: { users: User[] }) {
  return (
    <ul className="rows">
      {users.map((user) => (
        <li key={user.id}>
          <span className="avatar" aria-hidden="true">
            {user.name
              .split(' ')
              .map((part) => part[0])
              .join('')}
          </span>
          <span className="who">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
