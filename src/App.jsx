import "./App.css";
//import * as THREE from "three";
import React, { useState, useContext } from "react";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import ReactTooltip from "react-tooltip";
import { BrowserRouter as Router } from "react-router-dom";
import Map from "./components/Map";
import Menus from "./components/Menus";
const { useEffect, useRef } = React;

function App() {
  return (
    <Router>
      <Map opacity={100} />
      <ReactTooltip
        effect="solid"
        type="dark"
        scrollHide="true"
        event="mousemove"
        eventOff="mouseleave"
        delayHide={1000}
      />
    </Router>
  );
}
export default App;
