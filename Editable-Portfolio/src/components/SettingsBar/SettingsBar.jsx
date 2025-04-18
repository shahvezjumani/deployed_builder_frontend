import { useState, useRef, useEffect } from "react";
import useUserContext from "../contexts/UserContext";


function SettingsBar({settingsOpen}) {

    const { users, updateUser } = useUserContext()
    // const [mode, setMode] = useState(true)
    const lastActiveSetting = useRef();
    const themes = ["theme-dark", "theme-light", "theme-golden", "theme-sky"];

    const settingItems = [
        {
            id: "setting1",
            icon: (users.isAppEditable ? "🔒" : "✏️"),
            className: "settings-link",
            ref: lastActiveSetting,
        },
        {
          id: "setting2",
          // icon: ((users.theme === "theme-dark") ? "🌛" : "☀️"),
          icon:"☀️",
          className: (`settings-link active ${users.isAppEditable ? "hover:scale-110 active:scale-125 transition-transform duration-200" : ""}`),

      }
    ]

    const handlerMap = {
      setting1: (e) => {
        lastActiveSetting.current?.classList.remove("active")
        e.target.classList.add("active")
        lastActiveSetting.current = e.target

        updateUser("isAppEditable", !users.isAppEditable)
      },
      setting2: (e) => {
        lastActiveSetting.current?.classList.remove("active")
        e.target.classList.add("active")
        lastActiveSetting.current = e.target
        // if(users.theme == "theme-dark") {
        //   updateUser("theme", "theme-light")
        //   console.log("I am In theme");
          
        // } else{
        //   updateUser("theme", "theme-dark")
        // }
        if(users.isAppEditable) {
          const currentIndex = themes.indexOf(users.theme);
          const nextIndex = (currentIndex + 1) % themes.length; // Cycle through themes
          updateUser("theme", themes[nextIndex]);
        }

      },

    };

  
    // const activeCurrentLink = (e) => {
    //   console.log(lastActiveSetting.current);
      

    // }

  return (
    <>
        <div className={'settings-bar ' + (settingsOpen ? " active" : "")}>
            {
                settingItems.map(({ id, icon, className, ref }) => (

                  <button key={id} className={className} ref={ref} onClick={handlerMap[id]}>
                    {icon}
                  </button>
                ))
            }
        </div>
    </>
  )
}

export default SettingsBar