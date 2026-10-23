import './NavInput.css';

export function NavInput({
  type,
  name,
  value,
  svg,
  onChange,
  disabled,
  error,
  invalid,
  placeholder,
  button,
  onButtonClick,
}) {
  return (
    <div className='nav-input-group'>
      {error && <div className='nav-input-error-message'>{error}</div>}

      <div className={`nav-input ${invalid ? 'nav-input-error' : ''}`}>
        <svg className='input-svg' role='presentation' aria-hidden='true'>
          <use href={svg}></use>
        </svg>

        <input
          placeholder={placeholder}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
        />

        {button && (
          <button
            type='button'
            className='nav-input-button'
            onClick={onButtonClick}
            disabled={disabled}
          >
            <svg className='btn-svg' role='presentation' aria-hidden='true'>
              <use href='/icons.svg#check-icon'></use>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
