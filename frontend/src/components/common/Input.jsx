const Input = ({ label, error, id, className = '', ...props }) => (
  <label className="block" htmlFor={id}>
    {label ? <span className="field-label">{label}</span> : null}
    <input id={id} className={`field-input ${error ? 'border-rose-400 ring-2 ring-rose-100 focus:border-rose-500 focus:ring-rose-100' : ''} ${className}`} {...props} />
    {error ? <span className="mt-1 block text-xs text-rose-600">{error}</span> : null}
  </label>
);

export default Input;