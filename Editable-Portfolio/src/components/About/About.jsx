import { useState, useRef } from "react";
import useUserContext from "../contexts/UserContext";
function About() {
  const aboutItems = [
    {
      id: 1,
      label: "Project done",
      keyName: "numberOfProjects",
    },
    {
      id: 2,
      label: "Years of experience",
      keyName: "yearOfExperience",
    },
  ];
  // const [aboutFigureUrl, setAboutFigureUrl] = useState("/images/avatar-1.png");
  const { users, updateUser } = useUserContext();
  const name = useRef();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleUpdate(e.target.result);
      };
      reader.readAsDataURL(file);
      updateUser(`${name.current}File`, file);
    }
  };

  const handleImageDoubleClick = (keyName) => {
    name.current = keyName;
    console.log(name.current);

    document.getElementById("aboutMeIconInput").click();
  };

  const handleUpdate = (value) => {
    console.log("I am in the handle uodare");

    updateUser(name.current, value);
  };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setAboutFigureUrl(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleImageDoubleClick = (event) => {
  //   event.preventDefault();
  //   document.getElementById("aboutFigureInput").click();
  // };
  return (
    <section id="about" className="section">
      <div className="container ">
        <div className="bg-skin-secondaryBackgroundColor p-7 rounded-2xl md:pb-12">
          {/* <p className="text-zinc-300 mb-4 md:mb-8 md:text-xl md:max-w-[60ch] text-justify">
            Welcome! I&apos;m Henry, a professional web developer with a knack
            for crafting visually stunning and highly functional websites.
            Combining creativity and technical expertise. I transform your
            vision into digital masterpiece that excels in both appearance and
            performance.
          </p> */}
          <p className="text-skin-textColor mb-4 md:mb-8 md:text-xl md:max-w-[60ch] text-justify">
            <textarea
              name=""
              id=""
              readOnly={!users.isAppEditable}
              onChange={(e) => updateUser("aboutMe", e.target.value)}
              value={users.aboutMe}
              className="bg-transparent border-none lg:h-[9.5rem] h-[9.5rem] w-full max-w-inherit resize-none overflow-hidden outline-none text-inherit text-justify font-inherit"
              style={{ maxWidth: "inherit" }}
            ></textarea>
          </p>
          <div className="flex flex-wrap items-center gap-4 md:gap-7">
            {aboutItems.map(({ id, label, keyName }) => (
              <div key={id}>
                <div className="flex items-center md:mb-2">
                  <span className="text-2xl font-semibold md:text-4xl">
                    <input
                      type="text"
                      value={users[keyName]}
                      readOnly={!users.isAppEditable}
                      onChange={(e) => updateUser(keyName, e.target.value)}
                      className="w-14 bg-transparent outline-none"
                    />
                  </span>
                  <span className="text-skin-sky font-semibold md:text-3xl">
                    +
                  </span>
                </div>
                <p className="text-skin-secondary text-sm">{label}</p>
              </div>
            ))}
            <input
              id="aboutMeIconInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <img
              name="aboutMeIconUrl"
              src={users.aboutMeIconUrl}
              alt=""
              width={30}
              height={30}
              className={`md:w-[40px] md:h-[40px] ml-auto ${
                users.isAppEditable ? "cursor-pointer" : ""
              }`}
              onDoubleClick={
                users.isAppEditable
                  ? (e) => handleImageDoubleClick(e.target.name)
                  : undefined
              }
            />
            {/* <div>
                <input
                id="aboutFigureInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <figure className="img-box w-9 h-9 rounded-lg cursor-pointer">
                <img
                  src={aboutFigureUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="img-cover"
                  onDoubleClick={handleImageDoubleClick}
                />
              </figure>
                </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
