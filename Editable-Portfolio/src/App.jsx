import { ReactLenis } from "lenis/react";
import { useState, useEffect } from "react";
// import axios from "axios";
import { getCurrentUser } from "./services/api.js";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "./components/contexts/UserContext";
import {
  Footer,
  Header,
  Hero,
  About,
  Skill,
  Project,
  Contact,
  Loader,
} from "./components";
import useUserAuthContext from "./components/contexts/userAuthContext";
import { THEMES } from "./constants";

const App = () => {
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login, logout } = useUserAuthContext();
  const html = document.documentElement;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getCurrentUser();
        html.classList.remove(...THEMES);
        html.classList.add(response.data?.data?.theme);

        setError(null);
        setUsers(response.data.data);
        setLoading(false);
        login();
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        logout();
        setLoading(false);
        navigate("/");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    THEMES.forEach((theme) => html.classList.remove(theme));
    if (users.theme) html.classList.add(users.theme);
  }, [users?.theme]);

  const updateUser = (key, value) => {
    setUsers((prevUsers) => ({
      ...prevUsers,
      [key]: value,
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <ReactLenis root>
      <UserProvider value={{ users, updateUser }}>
        <Header />
        <main>
          <Hero />
          <About />
          <Skill />
          <Project />
          <Contact />
        </main>
        <Footer />
      </UserProvider>
    </ReactLenis>
  );
};

export default App;
