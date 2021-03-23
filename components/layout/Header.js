import { useState, useEffect, useContext } from "react";
import fire from "../../config/fire-config";
import styles from "../../styles/Home.module.scss";
import Link from "next/link";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "next/router";
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

const Header = () => {
  const { loggedIn, userInfo } = useContext(UserContext);
  const [notification, setNotification] = useState("");
  const router = useRouter();
  const [value, setValue] = useState(new Date());

  const handleLogout = () => {
    fire
      .auth()
      .signOut()
      .then(() => {
        setNotification("Logged out");
        setTimeout(() => {
          setNotification("");
        }, 2000);
      });
    router.push("/");
  };

  useEffect(() => {
    const interval = setInterval(
      () => setValue(new Date()),
      1000
    );

    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerBox}>
          <div className={styles.headerLogo}>
            <Link href="/">
              <a>Moj Planer</a>
            </Link>
          </div>
          <div className={styles.headerContact}>
            <Link href="/contact">
              <a>Kontakt</a>
            </Link>
          </div>
          <div className="authBtn">
            {!loggedIn ? (
              <div className={styles.loginBtn}>
                <Link href="/users/register">
                  <a>Register</a>
                </Link>
                <Link href="/users/login">
                  <a> Login</a>
                </Link>
              </div>
            ) : (
              <div className={styles.profile}>
                <div className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </div>
                <div>
                  <Link href="/users/profil">
                    <a>{userInfo.displayName}</a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.clock}>
        <Clock renderNumbers secondHandLength={80} value={value} />
      </div>
    </header>
  );
};

export default Header;
