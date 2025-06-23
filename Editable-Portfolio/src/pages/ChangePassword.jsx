import React from "react";
import { ChangePasswordComponent } from "../components";
import { useParams } from "react-router-dom";

const ChangePassword = () => {
  const { userId } = useParams();
  return <ChangePasswordComponent userId={userId} />;
};

export default ChangePassword;
