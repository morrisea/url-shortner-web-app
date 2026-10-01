import './Button.css';

export function Button({ text = 'Submit', className = 'form-button' }) {
  return (
    <button className={className} type='submit'>
      {text}
    </button>
  );
}
