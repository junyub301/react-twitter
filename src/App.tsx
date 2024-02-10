import Layout from "components/Layout";
import Router from "components/Router";
import Loader from "components/loader/Loader";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const auth = getAuth(app);
    const [init, setInit] = useState<boolean>(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth.currentUser);
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
            setInit(true);
        });
    }, [auth]);
    return (
        <Layout>
            <ToastContainer theme="dark" autoClose={1000} hideProgressBar newestOnTop />
            {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
        </Layout>
    );
}

export default App;
