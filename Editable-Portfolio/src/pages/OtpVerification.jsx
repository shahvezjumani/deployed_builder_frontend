import React from "react";
import { OtpVerificationComponent } from "../components";
import { useParams } from "react-router-dom";

const OtpVerification = () => {
  const { path, data } = useParams();
  console.log("in optVerificaton path", path);
  console.log("in optVerificaton payload", data);

  return <OtpVerificationComponent path={path} data={data} />;
};

export default OtpVerification;
