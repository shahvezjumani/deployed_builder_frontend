import { ReactLenis } from "lenis/react";
// import axios from "axios";
import { getUserBySlug } from "../services/api.js";
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
import { THEMES } from "../constants";

import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { slug } = useParams();

  // const html = document.querySelector("html");
  const html = document.documentElement;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserBySlug(slug);
        html.classList.remove(...THEMES);
        html.classList.add(response.data?.data?.theme);

        setError(null);
        setUsers(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        setLoading(false);
        navigate("/");
      }
    };

    fetchUser();
  }, [slug, navigate]);

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
