import React from "react";
import ButtonPrimary from "../Buttons/Button";
import useUserContext from "../contexts/UserContext";
import axios from "axios";

export default function Footer() {
  const { users, updateUser } = useUserContext();
  const [response, setResponse] = React.useState(null);
  const [error, setError] = React.useState(null);
  console.log(users);

  const handleSave = async () => {
    // TODO: implement your actual save logic here
    try {
      const {
        bannerUrl,
        availabilityIconUrl,
        logoUrl,
        aboutMeIconUrl,
        projects,
        ...remainingUser
      } = users;

      const { imgUrl, ...remainingProject } = projects;
      console.log(users, "Hello I am user");
      console.log(remainingProject, "Hello project");

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/update`,
        remainingUser,
        {
          withCredentials: true, // Send cookies if using sessions
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      for (const project of projects) {
        const formData = new FormData();

        // Add text fields to form data
        formData.append("title", project.title);

        // Handle keywords array
        if (Array.isArray(project.keywords)) {
          project.keywords.forEach((keyword) => {
            formData.append("keywords", keyword);
          });
        }

        if (project.url) formData.append("url", project.url);

        // Add file to form data if it exists
        if (project.imgUrlFile) {
          console.log(project.imgUrlFile);

          formData.append("imgUrlFile", project.imgUrlFile);
        }

        // Send the properly formatted FormData
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/project/create-project`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data", // This is set automatically by FormData
            },
          }
        );
      }
      setResponse(response.data);
      setError(null);
    } catch (err) {
      let errorMessage = "Something went wrong Shahvez";
      if (err.response?.data) {
        // Try to extract the error message from the HTML response
        const match = err.response.data.match(/<pre>(.*?)<\/pre>/);

        if (match && match[1]) {
          errorMessage = match[1].trim().replace("Error: ", "");
        }
      }

      setError(errorMessage);
      // setShowErrorPopup(true);
      setResponse(null);
    }
  };

  const sitemap = [
    { id: 1, label: "Home", href: "#home" },
    { id: 2, label: "About", href: "#about" },
    { id: 3, label: "Work", href: "#work" },
    { id: 4, label: "Skills", href: "#skills" },
    { id: 5, label: "Contact me", href: "#contact" },
  ];

  const socials = [
    { id: 1, label: "GitHub", name: "github" },
    { id: 2, label: "LinkedIn", name: "linkedin" },
    { id: 3, label: "Twitter X", name: "twitter" },
    { id: 4, label: "Instagram", name: "instagram" },
  ];

  return (
    <footer className="section">
      <div className="container">
        <div className="lg:grid lg:grid-cols-2">
          <div className="mb-10">
            <h2 className="headline-1 mb-8 lg:max-w-[12ch]">
              Let&apos;s work together today!
            </h2>
            <ButtonPrimary
              href={`mailto:${users.email}`}
              label={"Start Project"}
              icon="chevron_right"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:pl-20">
            <div>
              <p className="mb-2">Sitemap</p>
              <ul>
                {sitemap.map(({ label, href, id }) => (
                  <li key={id}>
                    <a
                      href={href}
                      className="block text-sm text-skin-secondary py-1 transition-colors hover:text-skin-base"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2">Socials</p>
              <ul>
                {socials.map(({ label, id, name }) => (
                  <li key={id}>
                    <a
                      href={users.contactLinks[name]}
                      target="_blank"
                      className="block text-sm text-skin-secondary py-1 transition-colors hover:text-skin-base"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-10 pb-8">
          <a href="/">
            <img
              src={users.logoUrl}
              alt="logo"
              width={40}
              height={40}
              className="rounded-2xl w-[45px] h-[45px] object-cover object-top"
            />
          </a>
          <p className="text-skin-secondary text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-skin-base tracking-wide">ShahvezJumani</span>
          </p>
        </div>

        {users.isAppEditable && (
          <div className="flex justify-center mt-4 mb-3">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
