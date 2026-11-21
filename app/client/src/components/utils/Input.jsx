import './Input.css';

export function Input({
  type,
  name,
  value,
  svg,
  onChange,
  disabled,
  error,
  invalid,
  placeholder,
  label,
}) {
  return (
    <div className='input-group'>
      {error && <div className='input-error-message'>{error}</div>}

      <div className={`input ${invalid ? 'input-error' : ''}`}>
        <svg role='presentation' aria-hidden='true'>
          <use href={svg}></use>
        </svg>

        <label className='sr-only' forHtml={name}>
          {label}
        </label>

        <input
          id={name}
          aria-invalid={invalid}
          aria-describedby={error ? `${name}-error` : undefined}
          placeholder={placeholder}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
}
