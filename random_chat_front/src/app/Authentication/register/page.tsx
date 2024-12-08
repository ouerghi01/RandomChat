'use client'
import { useState } from 'react';
import styles from './styles.module.css';
import { FormEvent } from 'react';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
export default function Register(): JSX.Element {

  const [name,setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [age,setAge] = useState(0)
  const [gender, setGender] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  async function onSubmit(event :FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(password!==confirmPassword){
      alert("Passwords don't match")
      return;
    }
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        age,
        password,
        gender,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    console.log(data);
    alert("Registered Successfully!")
    setName("")
    setEmail("")
    setPassword("")
    setAge(0)
    setGender("")
    setConfirmPassword("")
    window.location.href="/Authentication/login"

  }
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Register</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <input type="text" placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}  required/>
        <input
          type="text"
          placeholder="Name"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select 
          className={styles.select}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          aria-label="Gender selection"
        >
          <option value="" disabled>Select Gender</option>
          <option value="m">Male</option>
          <option value="f">Female</option>
        </select>

        <input type="number" placeholder="Age" className={styles.input} value={age} onChange={(e) => setAge(parseInt(e.target.value))}  required/>
        <input 
        type="password" 
        placeholder="Password" 
        className={styles.input} 
        value={password}
        onChange= {(e)=> setPassword(e.target.value)} required />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className={styles.input}required />
        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div>
  );
}
