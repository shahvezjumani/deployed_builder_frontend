import { ReactLenis } from "lenis/react";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Footer,
  Header,
  Hero,
  About,
  Skill,
  Project,
  Contact,
  Loader,
} from "../components";
import { UserProvider } from "../components/contexts/UserContext";

import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const [users, setUsers] = useState({});
  // const [status, setStatus] = useState(false);
  const themes = ["theme-dark", "theme-light", "theme-golden", "theme-sky"];
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { slug } = useParams();

  const html = document.querySelector("html");
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/u/${slug}`,
          {
            withCredentials: true,
          }
        );
        html.classList.remove(...themes);
        html.classList.add(response.data?.data?.theme);

        setError(null);
        setUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
        navigate("/");
      }
    })();
  }, [slug, navigate]);

  // useEffect(() => {
  //   const html = document.querySelector("html");
  //   themes.forEach((theme) => html.classList.remove(theme));
  //   if (users?.theme) html.classList.add(users.theme);
  // }, [users?.theme]);

  console.log(users);

  // Return the loader while loading is true
  if (loading) {
    return <Loader />;
  }

  // Show main content once loading is complete
  return (
    <ReactLenis root>
      <UserProvider value={{ users }}>
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

export default Profile;
