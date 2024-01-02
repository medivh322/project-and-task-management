import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./app";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import "./style/app.scss";
import { CookiesProvider } from "react-cookie";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
