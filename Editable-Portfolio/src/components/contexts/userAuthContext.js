import { createContext, useContext } from "react";
export const UserAuthContext = createContext();

const useUserAuthContext = () => useContext(UserAuthContext);

export default useUserAuthContext;
