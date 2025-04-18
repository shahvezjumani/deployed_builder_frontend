import { useState, useRef } from "react";
import ButtonPrimary from "../Buttons/Button";
import useUserContext from "../contexts/UserContext";

function Hero() {
  // const [figureUrl, setFigureUrl] = useState("/images/avatar-1.png");
  // const [heroBannersUrl, setHeroBannersUrl] = useState(
  //   "/images/Untitled-a.png"
  // );
  const [color, setColor] = useState("#38bdf8");
  const { users, updateUser } = useUserContext();

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setFigureUrl(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // const handleImageDoubleClick = (event) => {
  //   event.preventDefault();
  //   document.getElementById("figureInput").click();
  // };
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

    document.getElementById("figureInput" + name.current).click();
  };

  function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  const handleUpdate = (value) => {
    updateUser(name.current, value);
  };
  return (
    <>
      <section id="home" className="pt-[7.5rem] lg:pt-[9rem]">
        <div className="container items-center lg:grid lg:grid-cols-2 lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <input
                id={"figureInput" + "availabilityIconUrl"}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <figure
                className={`img-box w-9 h-9 rounded-lg ${
                  users.isAppEditable ? "cursor-pointer" : ""
                }`}
              >
                <img
                  name="availabilityIconUrl"
                  src={users.availabilityIconUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="img-cover"
                  onDoubleClick={
                    users.isAppEditable
                      ? (e) => handleImageDoubleClick(e.target.name)
                      : undefined
                  }
                />
              </figure>
              <div className="flex items-center gap-1.5 tracking-wide text-sm text-zinc-400">
                <span className="relative w-2 h-2 rounded-full bg-emerald-400">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping"></span>
                </span>
                {/* Available for work */}

                <input
                  name="availabilityHeading"
                  type="text"
                  // className="text-[32px] text-black outline-none"
                  value={users.availabilityHeading}
                  readOnly={!users.isAppEditable}
                  className="bg-transparent border-none outline-none p-0 m-0 text-inherit font-inherit max-w-inherit"
                  onChange={(e) =>
                    updateUser("availabilityHeading", e.target.value)
                  }
                />
              </div>
            </div>
            {/* <h2 className="headline-1 max-w-[15ch] sm:max-w-[20ch] lg:max-w-[15ch] mt-5 mb-8 lg:mb-10">
              Building Scalable Modern Websites for the Future
            </h2> */}
            <h2 className="headline-1 headline max-w-[15ch] sm:max-w-[20ch] lg:max-w-[15ch] mt-5 mb-8 lg:mb-10">
              <textarea
                name=""
                id=""
                readOnly={!users.isAppEditable}
                onChange={(e) => updateUser("topHeading", e.target.value)}
                value={users.topHeading}
                className="bg-transparent border-none lg:h-[9.8rem] h-[8.5rem] w-full max-w-inherit resize-none overflow-hidden outline-none text-inherit font-inherit"
                style={{ maxWidth: "inherit" }}
              ></textarea>
            </h2>
            {/* <h2 className="headline-1 max-w-[15ch] sm:max-w-[20ch] lg:max-w-[15ch] mt-5 mb-8 lg:mb-10"> */}
            {/* <input
    type="text"
    value={users.topHeading}
    readOnly={!users.isAppEditable}
    className="bg-transparent border-none outline-none headline-1 max-w-[15ch] break-words"
    className="bg-transparent border-none outline-none text-inherit font-inherit headline-1 max-w-[15ch] sm:max-w-[20ch] lg:max-w-9 mt-5 mb-8 lg:mb-10"
    onChange={(e) => updateUser("topHeading", e.target.value)}
  />
        <textarea
        className="w-64 p-2 text-base border rounded resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="Start typing..."
      /> */}
            {/* </h2> */}

            <div className="flex items-center gap-3">
              <ButtonPrimary
                label="Download CV"
                icon="download"
                href={"/resume.pdf"}
              />
            </div>
          </div>
          <div className="hidden lg:block">
            <input
              id={"figureInput" + "bannerUrl"}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <figure
              className={`w-full max-w-[430px] ml-auto rounded-[60px] ${
                users.isAppEditable ? "cursor-pointer" : ""
              } overflow-hidden`}
              style={{
                background: `linear-gradient(to top, ${
                  users.bannerColor
                }, ${hexToRgba(users.bannerColor, 0.4)} 25%, ${hexToRgba(
                  users.bannerColor,
                  0.0
                )} 67%)`, // Applying the dynamic color with opacity in gradient
              }}
              // className="w-full max-w-[480px] ml-auto bg-gradient-to-t via-25% via-opacity-40 to-65% rounded-[60px] overflow-hidden"
              // style={{
              //   backgroundImage: `linear-gradient(to top, ${color}, ${color}40 25%, ${color}65% 65%)`,
              // }}
            >
              <img
                name="bannerUrl"
                src={users.bannerUrl}
                alt=""
                className="w-full"
                width={656}
                height={800}
                onDoubleClick={
                  users.isAppEditable
                    ? (e) => handleImageDoubleClick(e.target.name)
                    : undefined
                }
              />
            </figure>
            {/* <input
              type="color"
              onChange={(e) => setColor(e.target.value)}
              value={color}
            /> */}
            <div
              className={`flex justify-center items-center p-2 ${
                users.isAppEditable ? "visible" : "invisible"
              } `}
            >
              <div className="relative w-80 h-2 rounded-md shadow-[0_4px_6px_-1px_rgba(113,113,113,0.5)] hidden lg:block">
                <input
                  type="color"
                  disabled={!users.isAppEditable}
                  value={users.bannerColor}
                  onChange={(e) => updateUser("bannerColor", e.target.value)}
                  className={`absolute inset-0 w-full h-full opacity-0 cursor-pointer`}
                />
                <div
                  className="w-full h-full rounded-md"
                  style={{
                    background:
                      "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
