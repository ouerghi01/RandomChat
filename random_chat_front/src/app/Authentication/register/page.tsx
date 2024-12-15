'use client';
import { useState, FormEvent } from 'react';
import axios from 'axios';
import styles from './styles.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Register(): JSX.Element {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}auth/register`,
        { email, name, age, password, gender },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Registration response:', response.data);

      alert('Registered Successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAge(0);
      setGender('');
      window.location.href = '/Authentication/login';
    } catch (error: unknown) {
      console.error('Error during registration:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'An error occurred during registration');
      } else {
        alert('An error occurred during registration');
      }
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Register</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          required
        />
        <select
          className={styles.select}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
          aria-label="Gender selection"
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="m">Male</option>
          <option value="f">Female</option>
        </select>
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(parseInt(e.target.value, 10))}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}
