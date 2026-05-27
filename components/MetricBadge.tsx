interface MetricBadgeProps {
  label: string;
  value: string | null;
  positive?: boolean | null;
  neutral?: boolean;
  size?: 'sm' | 'md';
}

export default function MetricBadge({ label, value, positive, neutral, size = 'md' }: MetricBadgeProps) {
  const valueColor = neutral
    ? 'var(--text-1)'
    : positive === true
    ? '#10b981'
    : positive === false
    ? '#ef4444'
    : 'var(--text-1)';

  return (
    <div className={`flex flex-col gap-0.5 ${size === 'sm' ? 'min-w-[70px]' : 'min-w-[90px]'}`}>
      <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-3)' }}>
        {label}
      </span>
      <span
        className={`font-semibold ${size === 'sm' ? 'text-sm' : 'text-base'}`}
        style={{ color: valueColor }}
      >
        {value ?? '—'}
      </span>
    </div>
  );
}
