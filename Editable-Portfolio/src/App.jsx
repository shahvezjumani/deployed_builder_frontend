import { ReactLenis } from "lenis/react";
import { useState, useEffect } from "react";
import axios from "axios";
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

const App = () => {
  const [users, setUsers] = useState({});
  // const [status, setStatus] = useState(false);
  const themes = ["theme-dark", "theme-light", "theme-golden", "theme-sky"];
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { login, logout } = useUserAuthContext();
  const html = document.querySelector("html");

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`,
          {
            withCredentials: true,
          }
        );
        html.classList.remove(...themes);
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

  // write code for update user here
  // useEffect(() => {
  //   try {
  //     localStorage.setItem("users", JSON.stringify(users));
  //   } catch (error) {
  //     if (error.name === "QuotaExceededError") {
  //       console.error(
  //         "LocalStorage quota exceeded. Consider clearing unused data."
  //       );
  //     } else {
  //       throw error;
  //     }
  //   }
  // }, [users]);

  useEffect(() => {
    themes.forEach((theme) => html.classList.remove(theme));
    if (users.theme) html.classList.add(users.theme);
  }, [users?.theme]);

  const updateUser = (key, value) => {
    setUsers((prevUsers) => ({
      ...prevUsers,
      [key]: value,
    }));
  };

  // const updateUserProfile = (userData) => {
  //   setUsers((prevUsers) => ({
  //     ...prevUsers,
  //     ...userData,
  //   }));
  // };

  // const login = () => {
  //   setStatus(true);
  // };

  // const logout = () => {
  //   setStatus(false);
  // };
  console.log(users?.Projects, "projects");

  console.log(users, "user");
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
