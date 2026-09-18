import './NavBar.css'

export default function NavBar({ title, svg }) {
    return (
        <>
            <div className="nav-container">
                <nav>
                    <ul>
                        <li><a href="/">
                            <span className="icon">{title}</span>

                            <svg
                                className="url-icon"
                                role="presentation"
                                aria-hidden="true"
                            >
                                <use href={svg}></use>
                            </svg>
                        </a></li>
                        <li><a className="login-button" href="/login">Login</a></li>
                    </ul>
                </nav>
            </div>
        </>
    )
}