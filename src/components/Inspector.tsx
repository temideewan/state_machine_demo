type Value = boolean | string | number | null;

type Props = {
  values: Record<string, Value>;
  /** True when the values describe a screen nobody designed. */
  impossible: boolean;
};

function format(value: Value) {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  return String(value);
}

/** Shows a component's raw state next to its UI, and flags impossible combinations. */
export function Inspector({ values, impossible }: Props) {
  return (
    <aside className={impossible ? 'inspector impossible' : 'inspector'} aria-live="polite">
      <p className="verdict">{impossible ? 'Impossible state' : 'Valid state'}</p>
      <dl>
        {Object.entries(values).map(([key, value]) => (
          <div key={key} className={value === true ? 'on' : undefined}>
            <dt>{key}</dt>
            <dd>{format(value)}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
