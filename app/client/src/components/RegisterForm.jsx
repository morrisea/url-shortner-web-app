import { useState } from 'react'
import { Button, Header } from './AuthForm'
import './RegisterForm.css'

function RegisterInput({ type, name, value, svg, placeholder, onChange, error, minLength, maxLength }) {
    return (
        <>
            <div className={`input ${error ? "input-error" : ""}`}>
                <svg
                    className="button-icon"
                    role="presentation"
                    aria-hidden="true"
                >
                    <use href={svg}></use>
                </svg>

                <input placeholder={placeholder}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    minLength={minLength}
                    maxLength={maxLength}
                />
            </div>
        </>
    );
}

export default function RegisterForm() {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [passwordConfirm, setConfirm] = useState("");

const handleChange = event => {
    const { name, value } = event.target;

    setUserData({
        ...userData,
        [name]: value
    });

    if (name === "confirmPassword") {
        setConfirm(value);
    }

    let password = userData.password;
    let confirmPassword = passwordConfirm;

    if (name === "password") {
        password = value;
    }

    if (name === "confirmPassword") {
        confirmPassword = value;
    }

    setErrors({
        ...errors,
        [name]: false,
        confirmPassword: password !== confirmPassword
    });
};

    const [errors, setErrors] = useState({});

    const handleSubmit = async event => {
        event.preventDefault();

        const valueErrors = {};

        if (!userData.firstName) {
            valueErrors.firstName = true;
        }

        if (!userData.lastName) {
            valueErrors.lastName = true;
        }

        if (!userData.email) {
            valueErrors.email = true;
        }

        if (!userData.password) {
            valueErrors.password = true;
        }

        if (userData.password !== passwordConfirm) {
            valueErrors.confirmPassword = true;
        }

        setErrors(valueErrors);

        if (Object.keys(valueErrors).length > 0) {
            return;
        }

        const res = await fetch('api/login', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await res.json();

    };


    return (
        <>
            <div className="container">
                <Header title='Sign Up'/>
                <form className="inputs" onSubmit={handleSubmit}>
                    <div className="name">
                        <RegisterInput type="text"
                                name="firstName"
                                placeholder="First Name"
                                svg=""
                                value={userData.firstName}
                                onChange={handleChange}
                                minLength={1}
                                maxLength={32}
                                error={errors.firstName}
                        />

                        <RegisterInput type="text"
                                name="lastName"
                                placeholder="Last Name"
                                svg=" "
                                value={userData.lastName}
                                onChange={handleChange}
                                minLength={1}
                                maxLength={32}
                                error={errors.lastName}
                        />
                    </div>
                    <RegisterInput type="email"
                            name="email"
                            placeholder="Email"
                            svg="/icons.svg#email-icon"
                            value={userData.email}
                            onChange={handleChange}
                            error={errors.email}

                    />

                    <RegisterInput type="password"
                            name="password"
                            placeholder="Password"
                            svg="/icons.svg#lock-icon"
                            value={userData.password}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={16}
                            error={errors.password}
                    />

                    <RegisterInput type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            svg={`/icons.svg#${errors.confirmPassword? "close" : "check"}-icon`}
                            value={passwordConfirm}
                            onChange={handleChange}
                            minLength={8}
                            maxLength={16}
                            error={errors.confirmPassword}
                    />
                    <div>
                        <Button className="submit" />
                    </div>
                </form>
            </div>
        </>
    );
}