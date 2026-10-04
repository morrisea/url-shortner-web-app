import NavBar from '../components/NavBar';
import MFAForm from '../components/MFAForm';

export default function MultiFactor() {
  return (
    <>
      <NavBar title='Short' svg='/icons.svg#url-icon' />
      <MFAForm />
    </>
  );
}
