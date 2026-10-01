export function Button({ text = 'Submit', className }) {
  return (
    <button className={className} type='submit'>
      {text}
    </button>
  );
}
