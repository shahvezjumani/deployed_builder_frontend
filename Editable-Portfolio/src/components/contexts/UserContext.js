import { createContext, useContext } from "react";

const UserContext = createContext({
  users: {
    logoUrl: "",
    isAppEditable: false,
    theme: "",
    availabilityHeading: "",
    topHeading: "",
    availabilityIconUrl: "",
    bannerUrl: "",
    bannerColor: "",
    aboutMe: "",
    numberOfProjects: 45,
    yearOfExperience: 10,
    aboutMeIconUrl: "",
  },
  status: false,
});

export const UserProvider = UserContext.Provider;

const useUserContext = () => {
  return useContext(UserContext);
};

export default useUserContext;
