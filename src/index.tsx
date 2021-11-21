import { StrictMode, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
const rootElement = document.getElementById("root");

const ThemeProvider = () => {
  return (
    <div className="height100 BGblack" >
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </div>
  );
};

ReactDOM.render(<StrictMode><ThemeProvider /></StrictMode>, rootElement);
