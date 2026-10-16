import { useSyncExternalStore } from 'react';

/**
 * A fake backend you control from the toolbar, so every bug in the talk
 * can be reproduced on demand instead of hoping the network misbehaves.
 */

export type ResponseMode = 'succeed' | 'fail' | 'random';

export type NetworkState = {
  mode: ResponseMode;
  delayMs: number;
  sent: number;
  inFlight: number;
};

let state: NetworkState = { mode: 'succeed', delayMs: 1200, sent: 0, inFlight: 0 };
const listeners = new Set<() => void>();

function update(patch: Partial<NetworkState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export const network = {
  get: () => state,
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setMode: (mode: ResponseMode) => update({ mode }),
  setDelay: (delayMs: number) => update({ delayMs }),
  resetCount: () => update({ sent: 0 }),
};

export function useNetwork() {
  return useSyncExternalStore(network.subscribe, network.get);
}

async function request<T>(onSuccess: () => T, failureMessage: string): Promise<T> {
  update({ sent: state.sent + 1, inFlight: state.inFlight + 1 });
  try {
    await new Promise((resolve) => setTimeout(resolve, state.delayMs));
    // The mode is read when the response arrives, so you can flip it mid-request.
    const fails = state.mode === 'fail' || (state.mode === 'random' && Math.random() < 0.5);
    if (fails) throw new Error(failureMessage);
    return onSuccess();
  } finally {
    update({ inFlight: state.inFlight - 1 });
  }
}

export type User = { id: number; name: string; role: string };

const TEAM: User[] = [
  { id: 1, name: 'Priya Shah', role: 'Design lead' },
  { id: 2, name: 'Tom Becker', role: 'Frontend engineer' },
  { id: 3, name: 'Lena Ortiz', role: 'Product manager' },
  { id: 4, name: 'Sam Okafor', role: 'Backend engineer' },
];

export function fetchUsers(): Promise<User[]> {
  return request(() => TEAM, "Couldn't load the team. The server didn't respond.");
}

export function subscribe(email: string): Promise<void> {
  return request(
    () => undefined,
    `Couldn't subscribe ${email || 'that address'}. The mailing list service timed out.`,
  );
}
