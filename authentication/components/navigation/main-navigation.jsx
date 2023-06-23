import Link from "next/link";
import styles from "./main-navigation.module.css";
import { signOut, useSession } from "next-auth/react";

const NavigationHeader = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
 
  const handleLogout = () => {
    signOut();
  };
  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/">
        NextAuthentication
      </Link>
      <nav className={styles.header_nav}>
        <ul>
          {!session && (
            <li>
              <Link href="/login">Login</Link>
            </li>
          )}

          {session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          )}
          {session && (
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
export default NavigationHeader;
