import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
export  default function NavBar_new () : JSX.Element {
  return(
    <>
    <Navbar isBordered>
      <NavbarBrand>
      <p className="font-bold text-inherit">Synco</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="/Authentication/login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="/Authentication/register" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </>
  )
}
/*
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
*/