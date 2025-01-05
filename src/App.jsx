import React, { useEffect, useState } from "react";
import TopBar from "./pages/top_bar";
import ClockView from "./pages/clock_view";
import MainNotUser from "./pages/non_user_page";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseConfig } from "./components/firebase_project";

function App() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setUser(auth.currentUser && auth.currentUser.email ? auth.currentUser.email.split("@")[0] : "");
    }, 500);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const localAuth = localStorage.getItem("auth");
        if (localAuth && localAuth === user.uid) {
          setToken(user.uid);
        }
      } else {
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser.email.split("@")[0]);
    }
  }, [auth]);

  return (
    <>
      {token ? <TopBar isLogged username={user} /> : <TopBar />}
      {token ? <ClockView user={user} /> : <MainNotUser />}
    </>
  );
}

export default App;
