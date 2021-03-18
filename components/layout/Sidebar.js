import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Home.module.scss";
import { UserContext } from "../../context/UserContext";
import { StoreContext } from "../../context/StoreContext";
import Link from "next/link";

const Sidebar = () => {
  const { loggedIn, userInfo } = useContext(UserContext);
  const { opModal } = useContext(StoreContext);
  const router = useRouter();

  return (
    <div>
      {loggedIn ? (
        <aside className={styles.aside}>
          <div className={styles.sidebarLinksBox}>
            <Link href="/">
              <a className={styles.sidebarLinks}>Kalendar</a>
            </Link>
            {router.pathname == "/" ? (
            <div onClick={opModal} className={styles.sidebarLink}>Napravi događaj</div>
            ) : null }
            <Link href="/todos">
              <a className={styles.sidebarLinks}>Zadaci</a>
            </Link>
            {router.pathname == "/todos" ? (
            <div onClick={opModal} className={styles.sidebarLink}>Napravi zadatak</div>
            ) : null }
            <Link href="/notes">
              <a className={styles.sidebarLinks}>Biljške</a>
            </Link>
            {router.pathname == "/notes" ? (
            <div className={styles.sidebarLink}>Napravi bilješku</div>
            ) : null }
          </div>
        </aside>
      ) : (
        <aside className={styles.aside}>
          <a href="#">nema</a>
        </aside>
      )}
    </div>
  );
};

export default Sidebar;
