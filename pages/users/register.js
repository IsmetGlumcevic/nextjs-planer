import { useState, useContext } from "react";
import Head from "next/head";
import fire from "../../config/fire-config";
import { useRouter } from "next/router";
import { UserContext } from "../../context/UserContext";
import styles from "../../styles/Auth.module.scss";

const Register = () => {
  const { setUserInfo } = useContext(UserContext);
  const router = useRouter();
  const [userName, setUsername] = useState("");
  const [profilName, setProfilname] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [passConf, setPassConf] = useState("");
  const [notification, setNotification] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password !== passConf) {
      setNotification("Password and password confirmation does not   match");
      setTimeout(() => {
        setNotification("");
      }, 2000);
      setPassword("");
      setPassConf("");
      return null;
    }
    fire
      .auth()
      .createUserWithEmailAndPassword(userName, password)
      .then((cred) => {
        cred.user.sendEmailVerification();
        cred.user.updateProfile({
          displayName: profilName,
        });
        const addDefaultRole = fire.functions().httpsCallable("addDefaultRole");
        addDefaultRole({ email: cred.user.email }).then((result) => {
          console.log(result);
        });
        return fire
          .firestore()
          .collection("users")
          .doc(cred.user.uid)
          .set({
            displayName: profilName,
            city: bio,
          })
          .then(() => {
            router.push("/");
          });
      })
      .catch((err) => {
        setNotification(err.message);
      });
  };

  return (
    <div>
      <Head>
        <title>Registracija</title>
      </Head>
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <h1>Registracija</h1>
          {notification}
          <form onSubmit={handleLogin}>
            <div className={styles.input}>
              <span>Naziv profila </span>
              <input
                type="text"
                value={profilName}
                onChange={({ target }) => setProfilname(target.value)}
              />
            </div>
            <div className={styles.input}>
              <span>Bio </span>
              <input
                type="text"
                value={bio}
                onChange={({ target }) => setBio(target.value)}
              />
            </div>
            <div className={styles.input}>
              <span> E-mail: </span>
              <input
                type="text"
                value={userName}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div className={styles.input}>
              <span>Šifra: </span>
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <div className={styles.input}>
              <span>Potvrdi šifru: </span>
              <input
                type="password"
                value={passConf}
                onChange={({ target }) => setPassConf(target.value)}
              />
            </div>
            <button className={styles.submit} type="submit">Registruj se</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
