import { useState,useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import DMCAPage from "./components/DMCAPage";
import MobileDrawer from "./components/MobileDrawer";
import ScrollTop from "./components/ScrollTop";
import Category from "./components/Category";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Advertise from "./pages/Advertise";
import USC2257 from "./pages/USC2257";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import AgeGate from "./pages/AgeGate";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { disableBasicInspect, detectDevTools } from "./utils/security";
import PopunderScript from "./components/exoclick/mobile/PopunderScript";


function App() {

  useEffect(() => {
    // 1️⃣ Disable right click + inspect
    const cleanupInspect = disableBasicInspect();

    // 2️⃣ Detect DevTools
    const cleanupDevTools = detectDevTools(() => {
      // OPTION 1: Blank page
      document.body.innerHTML = "";

      // OPTION 2 (better): redirect
      // window.location.href = "/blocked";
    });

    return () => {
      cleanupInspect();
      cleanupDevTools();
    };
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <BrowserRouter>

      <PopunderScript />
      
      <AgeGate />
      <ToastContainer position="top-right" autoClose={3000} />

      <Header openMenu={() => setMenuOpen(true)} />

      <MobileDrawer
        open={menuOpen}
        close={() => setMenuOpen(false)}
      />

      <Routes>
       
        <Route path="/" element={<Home />} />
        {/* FIXED */}
        <Route path="/watch/:slug" element={<Watch />} />
        
        <Route path="/category/:category" element={<Category />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/2257" element={<USC2257 />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dmca" element={<DMCAPage />} />
        <Route path="/search" element={<Search />} />

      </Routes>

      <Footer />
      <ScrollTop />

    </BrowserRouter>

  );

}

export default App;