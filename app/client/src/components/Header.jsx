export function Header({ title }) {
  return (
    <>
      <div className='header'>
        <div className='text'>{title}</div>
        <div className='underline'></div>
      </div>
    </>
  );
}
