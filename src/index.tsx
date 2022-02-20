import { StrictMode, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
const rootElement = document.getElementById("root");

const ThemeProvider = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

ReactDOM.render(<StrictMode><ThemeProvider /></StrictMode>, rootElement);
