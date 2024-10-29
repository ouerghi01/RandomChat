import Link from 'next/link';
import styles from './Nav.module.css';
export default function Navbar(): JSX.Element {
  return (
    <nav className={styles.navbar}>
       <Link href="/" style={{ textDecoration: 'none',}} >
      <span className={styles.link}>Synco</span>
      </Link> 
      <ul className={styles.navLinks}>
        <li>
          <Link  style={{
        textDecoration: 'none',
      }}   href="/Authentication/login" passHref>
            <span className={styles.link}>Sign In</span>
          </Link>
        </li>
        <li>
          <Link  style={{
        textDecoration: 'none',
      }}  href="/Authentication/register" passHref>
            <span className={styles.link}>Sign Up</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
