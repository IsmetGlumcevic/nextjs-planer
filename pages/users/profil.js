import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import fire from "../../config/fire-config";
import { useRouter } from "next/router";
import { UserContext } from "../../context/UserContext";
import styles from "../../styles/Auth.module.scss";

const Profil = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [userName, setUsername] = useState("");
  const [profilName, setProfilname] = useState("");
  const [password, setPassword] = useState("");
  const [passConf, setPassConf] = useState("");
  const [notification, setNotification] = useState("");
  const router = useRouter();

  useEffect(() => {
    setProfilname(userInfo.displayName)
    setUsername(userInfo.email)
  }, []);

  const updateProfil = (e) => {
    e.preventDefault();
    // if (password !== passConf) {
    //   setNotification("Password and password confirmation does not   match");
    //   setTimeout(() => {
    //     setNotification("");
    //   }, 2000);
    //   setPassword("");
    //   setPassConf("");
    //   return null;
    // }
    let user = fire.auth().currentUser;
    user.updateProfile({
    displayName: profilName,
    photoURL: "https://example.com/jane-q-user/profile.jpg"
    }).then(function() {
        setUserInfo(user)
    }).catch(function(error) {
    // An error happened.
    });
    router.push("/");
  };

  return (
    <div>
      <Head>
        <title>Prijava</title>
      </Head>
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <h1>Profil {userInfo.email}</h1>
          {notification}
          <form onSubmit={updateProfil}>
          <div className={styles.input}>
              <span>Naziv profila </span>
              <input
                type="text"
                value={profilName}
                onChange={({ target }) => setProfilname(target.value)}
              />
            </div>
            <div className={styles.input}>
              <span> E-mail: </span>
              <input
                type="text"
                value={userName}
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
            <button className={styles.submit} type="submit">Snimi izmjene</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profil;
