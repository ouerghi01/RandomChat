
import styles from './styles.module.css';
export default function login() {
    return (
        <div className={styles.container}>

            <h1 className={styles.header}>Login</h1>

        <form className={styles.form}>
        <input type="text" placeholder="Email" className={styles.input} />
        
        <input type="password" placeholder="Password" className={styles.input} />
        <button type="submit" className={styles.button}>Login</button>
      </form>
        </div>
    )

        
}