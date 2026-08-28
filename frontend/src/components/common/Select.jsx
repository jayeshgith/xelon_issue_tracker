const Select = ({ label, error, id, children, className = '', ...props }) => (
  <label className="block" htmlFor={id}>
    {label ? <span className="field-label">{label}</span> : null}
    <select id={id} className={`field-input ${className}`} {...props}>
      {children}
    </select>
    {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
  </label>
);

export default Select;