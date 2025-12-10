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
import {AuthForm} from "./components/AuthForm.jsx";
import {useAuth} from "./contexts/AuthContext.jsx";
import {Dashboard} from "./components/Dashboard.jsx";

function App() {
    const [user, setUser] = useState(null);

    const {user1, loading } = useAuth();
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
                <div className="text-gray-600 text-lg">Loading...</div>
            </div>
        );
    }

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
                <Route path="/products/invoice" element={user1 ? (<Dashboard />) : (<AuthForm />)}
                />
            </Routes>
        </>
    );
}

export default App;


// import { useAuth } from './contexts/AuthContext';
// import { AuthForm } from './components/AuthForm';
// import { Dashboard } from './components/Dashboard';
//
// function App() {
//     const { user, loading } = useAuth();
//
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center">
//                 <div className="text-gray-600 text-lg">Loading...</div>
//             </div>
//         );
//     }
//
//     return user ? <Dashboard /> : <AuthForm />;
// }
//
// export default App;