import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.scss";
import { AuthContextProvider } from "context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <AuthContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthContextProvider>
);
