const Input = ({ label, error, id, className = '', ...props }) => (
  <label className="block" htmlFor={id}>
    {label ? <span className="field-label">{label}</span> : null}
    <input id={id} className={`field-input ${className}`} {...props} />
    {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
  </label>
);

export default Input;
