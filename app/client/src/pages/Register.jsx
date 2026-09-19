import NavBar from '../components/NavBar'
import RegisterForm from '../components/RegisterForm';

export default function Register() {
    return (
        <>
            <NavBar title="Short" svg="/icons.svg#url-icon" />
            <RegisterForm />
        </>
    );
}