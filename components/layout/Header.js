import { useState, useEffect, useContext } from "react";
import fire from "../../config/fire-config";
import styles from "../../styles/Home.module.scss";
import Link from "next/link";
import { UserContext } from "../../context/UserContext";
import { useRouter } from "next/router";

const Header = () => {
  const { loggedIn, userInfo } = useContext(UserContext);
  const [notification, setNotification] = useState("");
  const router = useRouter();

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

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerBox}>
          <div className="logo">
            <Link href="/">
              <a>Moj Planer</a>
            </Link>
          </div>
          <div>{notification}</div>
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
    </header>
  );
};

export default Header;
