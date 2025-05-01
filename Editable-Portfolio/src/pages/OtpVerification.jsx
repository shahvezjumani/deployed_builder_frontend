import React from "react";
import { OtpVerificationComponent } from "../components";
import { useParams } from "react-router-dom";

const OtpVerification = () => {
  const { path } = useParams();
  console.log("in optVerificaton", path);

  return <OtpVerificationComponent path={path} />;
};

export default OtpVerification;
