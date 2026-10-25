import './Button.css';

export function Button({
  text = 'Submit',
  type = 'submit',
  className = 'form-button',
  onClick,
  disabled,
}) {
  return (
    <button
      className={className}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}
