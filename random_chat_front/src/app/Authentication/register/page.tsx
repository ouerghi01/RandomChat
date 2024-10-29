import styles from './styles.module.css';

export default function Register(): JSX.Element {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Register</h1>
      <form className={styles.form}>
        <input type="text" placeholder="Email" className={styles.input} />
        <input type="text" placeholder="Name" className={styles.input} />
        <select className={styles.select}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="password" placeholder="Password" className={styles.input} />
        <input type="password" placeholder="Confirm Password" className={styles.input} />
        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div>
  );
}
