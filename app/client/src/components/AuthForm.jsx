import { useState } from 'react'
import './AuthForm.css'

function AuthInput({ type, name, value, svg, onChange }) {
    return (
        <>
            <div className="input">
                <svg
                    className="button-icon"
                    role="presentation"
                    aria-hidden="true"
                >
                    <use href={svg}></use>
                </svg>

                <input placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required
                />
            </div>
        </>
    );
}

function Header() {
    return (
        <>
                <div className="header">
                    <div className="text">Log In</div>
                    <div className="underline"></div>
                </div>
        </>
    );
}

function Button({ text = "Submit", className }) {
  return <button className={className}>{text}</button>;
}

export default function AuthForm() {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });

    const handleChange = event => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        });
    };


    return (
        <>
            <div className="container">
                <Header />
                <div className="inputs">
                    <AuthInput type="email"
                            name="email"
                            svg="/icons.svg#email-icon"
                            value={userData.email}
                            onChange={handleChange}
                    />

                    <AuthInput type="password"
                            name="password"
                            svg="/icons.svg#lock-icon"
                            value={userData.password}
                            onChange={handleChange}
                    />
                </div>
                <div className="register">New to ShortURL? <span>Sign Up</span></div>

                <Button className="login" text="Log In" />
            </div>
        </>
    );
}