import { StrictMode, useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
const rootElement = document.getElementById("root");

const ThemeProvider = () => {
  return (
    <div className="height100 BGblack" >
      <App />
    </div>
  );
};

ReactDOM.render(<StrictMode><ThemeProvider /></StrictMode>, rootElement);
