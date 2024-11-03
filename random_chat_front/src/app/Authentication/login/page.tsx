'use client'
import styles from './styles.module.css';
import { FormEvent, useState } from 'react';
export default function Login() :JSX.Element {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    async function onSubmit(event :FormEvent<HTMLFormElement>){
        event.preventDefault();
        const response = await fetch('http://localhost:3006/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_email', data.user_email);

        alert("Logged In Successfully!")
        window.location.href="/Messenger"
    }
    return (
        <div className={styles.container}>

        <h1 className={styles.header}>Login</h1>

        <form className={styles.form} onSubmit={onSubmit}>
        <input type="text" placeholder="Email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)}/>
        
        <input type="password" placeholder="Password" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className={styles.button}>Login</button>
      </form>
        </div>
    )

        
}