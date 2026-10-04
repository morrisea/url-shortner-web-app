import './Input.css';

export function Input({ type, name, value, svg, onChange, disabled }) {
  return (
    <>
      <div className='input'>
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
        />
      </div>
    </>
  );
}
