import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProvidersResult from "./Pages/ProvidersResult.jsx";

// Pages
import Home from "./Pages/HomePage.jsx";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";

const queryClient = new QueryClient();

export default function App() {
  return (

      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/providers/:zip"
            element={<ProvidersResult />}
          />
        </Routes>
        <Footer />
      </BrowserRouter>

  );
}
