import './Button.css';

export function Button({
  text = 'Submit',
  type = 'submit',
  className = 'form-button',
  onClick,
}) {
  return (
    <button className={className} type={type} onClick={onClick}>
      {text}
    </button>
  );
}
