import React from "react";
import { Navigate, Route } from "react-router-dom";

const withPublicRoute = (props, index) => {
  const accessToken = localStorage.getItem('__token__');
  if (!accessToken) {
    return <Route key={index} {...props} />;
  }
  return <Route path="*" element={<Navigate to="/" />} />;
};

export default withPublicRoute;
