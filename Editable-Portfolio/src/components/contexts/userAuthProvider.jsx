import { useState } from "react";
import { UserAuthContext } from "./userAuthContext.js";

const UserAuthProvider = ({ children }) => {
  const [status, setStatus] = useState(false); // false = not logged in

  const login = () => setStatus(true);
  const logout = () => setStatus(false);

  return (
    <UserAuthContext.Provider value={{ status, login, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthProvider;
