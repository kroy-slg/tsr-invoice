import {Routes, Route, Navigate} from "react-router-dom";
import Home from "../src/components/pages/Home.jsx";
import Navbar from "../src/components/layout/Navbar.jsx";
import About from "../src/components/pages/About.jsx";
import Services from "../src/components/pages/Services.jsx";
import Contact from "../src/components/pages/Contact.jsx";
import Profile from "../src/components/pages/Profile.jsx";
import {useState} from "react";
import MainLayout from "./components/layout/MainLayout.jsx";
import GetStarted from "./components/pages/GetStarted.jsx";
import Customers from "./components/pages/Customers.jsx";
import Products from "./components/pages/Products.jsx";

function App() {
    const [user, setUser] = useState(null);
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/profile" element={user ? (
                    <Profile user={user} onLogOut={() => setUser(null)} />
                ) : (
                    <Navigate to="/" replace />
                )}
                />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/get-started" element={<GetStarted user={user} onLogin={setUser} onLogout={() => setUser(null)} />}/>
                <Route path="/customers" element={<Customers />} />
                <Route path="/products" element={<Products user={user} onLogin={setUser} onLogout={() => setUser(null)} />} />
                <Route path="/main-container" element={<MainLayout />} />
                <Route path="/products/payroll" element={null}/>
                <Route path="/products/invoice" element={null} />
            </Routes>
        </>
    );
}

export default App;
