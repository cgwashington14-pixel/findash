interface MetricBadgeProps {
  label: string;
  value: string | null;
  positive?: boolean | null;
  neutral?: boolean;
}

export default function MetricBadge({ label, value, positive, neutral }: MetricBadgeProps) {
  const color = neutral ? 'var(--text-1)' : positive === true ? 'var(--pos)' : positive === false ? 'var(--neg)' : 'var(--text-1)';
  return (
    <div className="flex flex-col gap-1">
      <span className="label">{label}</span>
      <span className="mono text-sm font-medium" style={{ color }}>{value ?? '—'}</span>
    </div>
  );
}
