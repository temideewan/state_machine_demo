import { useState, type ReactNode } from 'react';
import { network, useNetwork, type ResponseMode } from './api';
import { UserList as BeforeUserList } from './before/UserList';
import { Signup as BeforeSignup } from './before/Signup';
import { UserList as AfterUserList } from './after/UserList';
import { Signup as AfterSignup } from './after/Signup';

type DemoId = 'team' | 'signup';

const DEMOS: Record<
  DemoId,
  { label: string; file: string; Before: () => ReactNode; After: () => ReactNode; steps: string[] }
> = {
  team: {
    label: 'Team list',
    file: 'UserList.tsx',
    Before: BeforeUserList,
    After: AfterUserList,
    steps: [
      'Set responses to Fail, then select Load team.',
      'Switch to Succeed and select Retry. The old error stays next to the results.',
      'Select Reset, load once with Succeed, then switch to Fail and load again. Success and error are both true.',
      'Select Load team twice quickly. Two requests go out and the spinner vanishes early.',
    ],
  },
  signup: {
    label: 'Signup form',
    file: 'Signup.tsx',
    Before: BeforeSignup,
    After: AfterSignup,
    steps: [
      'Set responses to Fail, then select Subscribe.',
      'Switch to Succeed and subscribe again. The error message stays under the success message.',
      'Select Subscribe once more. The form sends another request after you are already subscribed.',
      'Double-click Subscribe. Two requests go out for one signup.',
    ],
  },
};

const MODES: { value: ResponseMode; label: string }[] = [
  { value: 'succeed', label: 'Succeed' },
  { value: 'fail', label: 'Fail' },
  { value: 'random', label: 'Random' },
];

const DELAYS = [
  { value: 400, label: 'Fast' },
  { value: 1200, label: 'Normal' },
  { value: 3000, label: 'Slow' },
];

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="control" role="group" aria-label={label}>
      <span className="control-label">{label}</span>
      <div className="segmented">
        {options.map((option) => (
          <button
            key={String(option.value)}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [demo, setDemo] = useState<DemoId>('team');
  const [afterOnly, setAfterOnly] = useState(false);
  const [run, setRun] = useState(0);
  const net = useNetwork();
  const { label, file, Before, After, steps } = DEMOS[demo];

  function reset() {
    network.resetCount();
    setRun((n) => n + 1);
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Boolean soup vs. state machine</h1>
        <div className="controls">
          <Segmented label="Responses" value={net.mode} options={MODES} onChange={network.setMode} />
          <Segmented label="Speed" value={net.delayMs} options={DELAYS} onChange={network.setDelay} />
          <p className="meter" aria-live="polite">
            <span>
              <b>{net.sent}</b> sent
            </span>
            <span className={net.inFlight > 1 ? 'hot' : undefined}>
              <b>{net.inFlight}</b> in flight
            </span>
          </p>
          <button className="ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </header>

      <nav className="subbar">
        <div className="tabs" role="tablist" aria-label="Demo">
          {(Object.keys(DEMOS) as DemoId[]).map((id) => (
            <button
              key={id}
              role="tab"
              aria-selected={id === demo}
              onClick={() => {
                setDemo(id);
                reset();
              }}
            >
              {DEMOS[id].label}
            </button>
          ))}
        </div>
        <label className="toggle">
          <input type="checkbox" checked={afterOnly} onChange={(e) => setAfterOnly(e.target.checked)} />
          Show only the live file
        </label>
      </nav>

      <main className={afterOnly ? 'stage single' : 'stage'}>
        {!afterOnly && (
          <section className="panel" aria-label={`${label}, before`}>
            <header>
              <h2>Before</h2>
              <code>src/before/{file}</code>
            </header>
            <Before key={`before-${demo}-${run}`} />
          </section>
        )}
        <section className="panel live" aria-label={`${label}, live file`}>
          <header>
            <h2>Live</h2>
            <code>src/after/{file}</code>
          </header>
          <After key={`after-${demo}-${run}`} />
        </section>
      </main>

      <footer className="script">
        <h2>Reproduce the bugs</h2>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </footer>
    </div>
  );
}
