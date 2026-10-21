import { useState } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import { Input } from './components/Input';
import { Button } from './components/Button';

export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [linkData, setLinkData] = useState({
    link: '',
  });

  const [errors, setErrors] = useState({
    link: false,
  });

  const handleInput = (event) => {
    setLinkData({
      ...linkData,
      [event.target.name]: event.target.value,
    });

    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const address = linkData.link.trim();

    if (!address) {
      setErrors({ link: true });
      return;
    }

    try {
      new URL(address);
    } catch {
      setErrors({ link: true });
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to shorten URL');
      }

      console.log('Shortened URL:', data);
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  return (
    <>
      <main id='center'>
        <div className='info'>
          <section className='descript-card'>
            <h1>Short URL</h1>
            <br></br>
            <p>
              Welcome to the best link shortener — Shorten long URLs into clean,
              shareable links with just a few clicks.
            </p>
            <br></br>
            <p>
              You can easily manage your links and make sharing across platforms
              simple and convenient.
            </p>
          </section>
          <section className='shortener-card'>
            <h2>Shorten a Link</h2>
            <form
              className='shortener-inputs'
              onSubmit={handleSubmit}
              noValidate
            >
              <Input
                type='text'
                name='link'
                svg='/icons.svg#link-icon'
                value={linkData.link}
                onChange={handleInput}
                placeholder='Paste long URL here '
              />

              <Button text='Shorten Link' />
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
