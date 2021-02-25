import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import fire from "../../config/fire-config";
import styles from "../../styles/Auth.module.scss";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [emailHasBeenSent, setEmailHasBeenSent] = useState(false);
  const [error, setError] = useState(null);

  const onChangeHandler = (event) => {
    const { name, value } = event.currentTarget;
    if (name === "userEmail") {
      setEmail(value);
    }
  };
  const sendResetEmail = (event) => {
    event.preventDefault();
    fire
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmailHasBeenSent(true);
        setTimeout(() => {
          setEmailHasBeenSent(false);
        }, 3000);
      })
      .catch(() => {
        setError("Error resetting password");
      });
  };
  return (
    <div>
      <Head>
        <title>Prijava</title>
      </Head>
      <div className={styles.loginWrapper}>
        <div className={styles.loginBox}>
          <h1 className="text-xl text-center font-bold mb-3">
            Resetuj Šifru
          </h1>
          <div className="border border-blue-300 mx-auto w-11/12 md:w-2/4 rounded py-8 px-4 md:px-8">
            <form onSubmit={sendResetEmail}>
              {emailHasBeenSent && (
                <div className="py-3 bg-green-400 w-full text-white text-center mb-3">
                  Mail je poslan!
                </div>
              )}
              {error !== null && (
                <div className="py-3 bg-red-600 w-full text-white text-center mb-3">
                  {error}
                </div>
              )}
              <div className={styles.input}>
                <span htmlFor="userEmail" className="w-full block">
                  Email:
                </span>
                <input
                  type="email"
                  name="userEmail"
                  id="userEmail"
                  value={email}
                  placeholder="Input your email"
                  onChange={onChangeHandler}
                  className="mb-3 w-full px-1 py-2"
                />
              </div>
              <button
                type="submit"
                className={styles.submit}
              >
                Pošalji reset link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PasswordReset;
