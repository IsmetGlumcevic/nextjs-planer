import { useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import fire from "../../config/fire-config";
import { useRouter } from "next/router";
import { UserContext } from "../../context/UserContext";
import styles from "../../styles/Auth.module.scss";

const Login = () => {
  const { setUserInfo } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notify, setNotification] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    fire
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then((user) => {
        setUserInfo(user);
        router.push("/");
      })
      .catch((err) => {
        setNotification(err.message);
        setTimeout(() => {
          setNotification("");
        }, 10000);
      });
  };

  return (
    <div>
      <Head>
        <title>Prijava</title>
      </Head>
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <h1>Prijava</h1>
          {notify}
          <form onSubmit={handleLogin}>
            <div className={styles.input}>
              <span>Email</span>
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <br />
            <div className={styles.input}>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <br />
            <button className={styles.submit} type="submit">
              Prijavi se
            </button>
            <div className={styles.authLinks}>
              <Link href="/users/register">
                <a>Registracija</a>
              </Link>
              <Link href="/users/passwordReset">
                <a>Zaboravili šifru?</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
