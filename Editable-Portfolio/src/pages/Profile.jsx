import { ReactLenis } from "lenis/react";
import { Header } from "../components";
import { useState, useEffect } from "react";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import { UserProvider } from "../components/contexts/UserContext";
import Skill from "../components/Skill/Skill";
import Project from "../components/Project/Project";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import axios from "axios";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";

// Add a simple Loader component

const Profile = () => {
  const [users, setUsers] = useState({});
  const [status, setStatus] = useState(false);
  const themes = ["theme-dark", "theme-light", "theme-golden", "theme-sky"];
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { slug } = useParams();
  console.log(slug);

  // Save updates to localStorage whenever `users` changes
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/u/${slug}`,
          {
            withCredentials: true, // Send cookies if using sessions
          }
        );
        setError(null);
        setUsers(response.data.data);
        setLoading(false);
        console.log(response.data.data, "I am a devleper");
      } catch (err) {
        let errorMessage = "Something went wrong Shahvez";
        if (err.response?.data) {
          const match = err.response.data.match(/<pre>(.*?)<\/pre>/);
          if (match && match[1]) {
            errorMessage = match[1].trim().replace("Error: ", "");
          }
        }
        setError(errorMessage);
        setLoading(false); // Make sure to set loading to false even on error
        navigate("/");
      }
    };
    getUser();
  }, [slug, navigate]);

  useEffect(() => {
    const html = document.querySelector("html");
    themes.forEach((theme) => html.classList.remove(theme));
    if (users?.theme) html.classList.add(users.theme);
  }, [users?.theme]);

  console.log(users);

  // Return the loader while loading is true
  if (loading) {
    return <Loader />;
  }

  // Show main content once loading is complete
  return (
    <ReactLenis root>
      <UserProvider value={{ users, status }}>
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
