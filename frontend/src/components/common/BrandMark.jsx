const BrandMark = ({ className = '', markClassName = '', subtitle = 'Issue Tracker' }) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <span
      aria-hidden="true"
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-base font-extrabold text-white shadow-lg shadow-brand-600/25 ${markClassName}`}
    >
      X
    </span>
    <span className="leading-tight">
      <span className="block text-base font-semibold tracking-tight text-slate-950">Xelon</span>
      <span className="block text-[11px] font-semibold uppercase tracking-widest text-brand-600">{subtitle}</span>
    </span>
  </span>
);

export default BrandMark;