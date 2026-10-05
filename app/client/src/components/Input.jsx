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
}) {
  return (
    <>
      <div className='input-group'>
        {error && <div className='input-error-message'>{error}</div>}
        <div className={`input ${invalid ? 'input-error' : ''}`}>
          <svg role='presentation' aria-hidden='true'>
            <use href={svg}></use>
          </svg>

          <input
            placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required
            disabled={disabled}
            invalid={invalid}
          />
        </div>
      </div>
    </>
  );
}
