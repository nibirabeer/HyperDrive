import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CarList from "../components/CarList";
import WelcomeHero from "../components/WelcomeHero";
import "../styles/Home.css";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return <div>{user ? <WelcomeHero /> : <CarList />}</div>;
};

export default Home;
