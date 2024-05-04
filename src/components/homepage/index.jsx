import React, { useState, useEffect } from "react";
import "./style.css";
import { HomePageWrapper } from "./style";

function HomePage(props) {
  const { title = "Home Component", color = "" } = props;

  return (
    <HomePageWrapper color={color}>
      {title}
      <div>Custom Component</div>
    </HomePageWrapper>
  );
}

export default HomePage;
