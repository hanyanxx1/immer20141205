import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Todos from "./Todos";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
    <Todos />
  </>,
);
