import { useRef, useState, useContext } from "react";
import Navbar from "./Navbar";
import SettingsBar from "../SettingsBar/SettingsBar";
import useUserContext from "../contexts/UserContext";
// import { UserAuthContext } from "../contexts/userAuthProvider";
import useUserAuthContext from "../contexts/userAuthContext";
import LogoutBtn from "./LogoutBtn";

function Header() {
  const { users, updateUser } = useUserContext();
  const [navOpen, setNavOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const name = useRef();
  const { status } = useUserAuthContext();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleUpdate(e.target.result);
      };
      reader.readAsDataURL(file);
      console.log(name.current);

      updateUser(`${name.current}File`, file);
    }
  };

  const handleImageDoubleClick = (keyName) => {
    name.current = keyName;
    console.log(name.current);

    document.getElementById("fileInput").click();
  };

  const handleUpdate = (value) => {
    updateUser(name.current, value);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-20 flex items-center z-40 bg-gradient-to-b from-skin-navbarBgColor to-skin-navbarBlur">
        <div className="max-w-screen-2xl w-full mx-auto px-4 flex justify-between items-center md:px-6 md:grid md:grid-cols-[1fr,3fr,1fr]">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <h1>
            {/* <a href="/" className="logo"> */}
            <figure
              className={`w-12 h-12 rounded-lg navbar-logo ${
                users.isAppEditable ? "cursor-pointer" : ""
              }`}
            >
              <img
                name="logoUrl"
                src={users.logoUrl}
                // width={50}
                // height={50}
                className=""
                alt="Logo"
                onDoubleClick={
                  users.isAppEditable
                    ? (e) => handleImageDoubleClick(e.target.name)
                    : undefined
                }
              />
            </figure>
          </h1>

          <div className="relative md:justify-self-center">
            <button
              className="action-btn menu-btn md:hidden"
              onClick={() => setNavOpen((prev) => !prev)}
            >
              <span className="material-symbols-rounded">
                {navOpen ? "close" : "menu"}
              </span>
            </button>

            <Navbar navOpen={navOpen} />
          </div>
          <a
            href="#contact"
            className="btn btn-secondary max-md:hidden md:justify-self-end"
          >
            Contact Me
          </a>
        </div>
        {/* <div className="px-4 md:px-6 relative md:justify-self-center">
          <button
            className="action-btn edit-btn"
            onClick={() => setSettingsOpen((prev) => !prev)}
          >
            <span className="material-symbols-rounded">settings</span>
          </button>
          <SettingsBar settingsOpen={settingsOpen} />
        </div> */}
        {status && (
          <div className="px-4 md:px-6 relative md:justify-self-center flex gap-4 items-center">
            {/* Settings Button */}
            {/* <button
              className="btn btn-secondary"
              onClick={() => {
                // You can add a logout function in context and call it here
                // updateUser("login", false);
              }}
            >
              Logout
            </button> */}
            <LogoutBtn />
            <button
              className="action-btn edit-btn"
              onClick={() => setSettingsOpen((prev) => !prev)}
            >
              <span className="material-symbols-rounded">settings</span>
            </button>

            {/* Logout Button */}

            {/* Settings Sidebar */}
            <SettingsBar settingsOpen={settingsOpen} />
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
