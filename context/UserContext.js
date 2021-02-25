import React, { useState, createContext, useEffect } from "react";
import fire from "../config/fire-config";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userAdminInfo, setUserAdminInfo] = useState({});

  useEffect(() => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdTokenResult().then(idTokenResult => {
          user.admin = idTokenResult.claims.admin;
          setUserAdminInfo(user);
          // console.log('user1', idTokenResult.claims)
          // console.log('user2', idTokenResult.claims.admin)
          // console.log('user3', idTokenResult.claims.paid)
        });
        setUserInfo(user)
        setLoggedIn(true)
        // fire.firestore().collection('users').doc(user.uid).get().then(doc => {
        //  return setUserInfo(doc.data());
        // }).then(() => {
        //   setLoggedIn(true);
        //  });
      } else {
        setLoggedIn(false);
        setUserInfo(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={{ loggedIn, userInfo, setUserInfo, userAdminInfo }}>
      {props.children}
    </UserContext.Provider>
  );
};
export default UserContextProvider;
