import AuthForm from '../components/AuthForm'
import NavBar from '../components/NavBar'

export default function Login() {
    return (
        <>
            <NavBar title="Short" svg="/icons.svg#url-icon" />
            <AuthForm />
        </>
    );
}