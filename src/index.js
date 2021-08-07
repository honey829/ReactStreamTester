import { StrictMode, useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
const rootElement = document.getElementById("root");

const ThemeProvider = () => {
  const [AppTheme, setAppTheme] = useState("light");
  let styleClass;

  console.log(AppTheme);

  if (AppTheme === "light") {
    styleClass = "light";
  } else {
    styleClass = "dark";
  }

  return (
    <div className={styleClass}>
      <App theme={AppTheme} setAppThemeProp={setAppTheme} />
    </div>
  );
};

ReactDOM.render(
  <StrictMode>
    <ThemeProvider />
  </StrictMode>,
  rootElement
);
