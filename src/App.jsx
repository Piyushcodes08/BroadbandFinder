import { QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProvidersResult from "./Pages/ProvidersResult.jsx";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
// Pages
import AdminDashboard from "../Admin/Admin.jsx";
import AdminLogin from "../Admin/AdminLogin.jsx";
import CreateAdminForm from "../Admin/CreateAdminForm.jsx";
import CustomerBookings from "../Admin/CustomerBookings.jsx";
import TopZipcodeChart from "../Admin/TopZipcodeChart.jsx";
import ZipcodeManager from "../Admin/ZipcodeManager.jsx";
import Footer from "./Components/Footer.jsx";
import Header from "./Components/Header.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import CsvUploader from "./Components/Uploadcsv.jsx";
import AttBusiness from "./Pages/AttBusiness.jsx";
import ComcastBusiness from "./Pages/ComcastBusiness.jsx";
import SpectrumBusiness from "./Pages/Spectrumbusiness.jsx";
import SpectrumPricing from "./Pages/SpectrumPricing.jsx";
import OrderBooking from "./Pages/OrderBooking.jsx";
import ContactUs from "./Pages/ContactUs.jsx";
import Offers from "./Pages/SpecialOffersPopup.jsx";
import AgentChat from "../Admin/AgentChat.jsx";
import CustomerBookingForm from "./Components/CustomerBookingForm.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import CustomerBookingDetails from "../Admin/CustomerBookingDetails.jsx";
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx";
import SpectrumVoip from "./Pages/SpectrumVoip.jsx";
import RingcentralVoip from "./Pages/RingcentralVoip.jsx";
import AccBusiness from "./Pages/AccBusiness.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import Home from "./Pages/HomePage.jsx";
import SpectrumBusinessCheckout from "./Checkout/SpectrumBusinessCheckout.jsx";
import AttBusinessCheckout from "./Checkout/AttBusinessCheckout.jsx";
import AccBusinessCheckout from "./Checkout/AccBusinessCheckout.jsx";
import ComcastBusinessCheckout from "./Checkout/ComcastBusinessCheckout.jsx";
import RingCentralCheckout from "./Checkout/RingCentralCheckout.jsx";
import SpectrumVoipCheckout from "./Checkout/SpectrumVoipCheckout.jsx";
import SpectrumOrdersAdmin from "../Admin/SpectrumOrdersAdmin.jsx";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const queryClient = new QueryClient();

export default function App() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 80,
      disableMutationObserver: false,
    });
  }, []);

  useEffect(() => {
    // Small delay allows new page content to mount before AOS scans
    const timer = setTimeout(() => AOS.refresh(), 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <Header />

      <Offers variant="modal" defaultOpen />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/internet/SpectrumBusiness"
          element={<SpectrumBusiness />}
        />
        <Route path="/internet/AttBusiness" element={<AttBusiness />} />
        <Route path="/internet/ComcastBusiness" element={<ComcastBusiness />} />
        <Route
          path="/internet/cloudsevices/spectrumvoip"
          element={<SpectrumVoip />}
        />
        <Route
          path="/internet/cloudsevices/ringcentralvoip"
          element={<RingcentralVoip />}
        />
        <Route path="/internet/AccBusiness" element={<AccBusiness />} />
        <Route
          path="/internet/SpectrumBusiness/SpectrumPricing"
          element={<SpectrumPricing />}
        />
        <Route
          path="/internet/SpectrumBusiness/OrderBooking"
          element={<OrderBooking />}
        />

        <Route path="/contact-us" element={<ContactUs />} />

        <Route path="/providers/:zip" element={<ProvidersResult />} />
        <Route path="/customerbookingfrom" element={<CustomerBookingForm />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />

        <Route
          path="/checkout/spectrum-business"
          element={<SpectrumBusinessCheckout />}
        />
        <Route
          path="/checkout/att-business"
          element={<AttBusinessCheckout />}
        />
        <Route
          path="/checkout/acc-business"
          element={<AccBusinessCheckout />}
        />
        <Route
          path="/checkout/comcast-business"
          element={<ComcastBusinessCheckout />}
        />
        <Route path="/checkout/ringcentral" element={<RingCentralCheckout />} />
        <Route
          path="/checkout/spectrum-voip"
          element={<SpectrumVoipCheckout />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/zipcodes"
          element={
            <ProtectedRoute>
              <ZipcodeManager />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/upload"
          element={
            <ProtectedRoute>
              <CsvUploader />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/top-zipcodes"
          element={
            <ProtectedRoute>
              <TopZipcodeChart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <CustomerBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customer-bookings/:id"
          element={
            <ProtectedRoute>
              <CustomerBookingDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/spectrum-orders"
          element={
            <ProtectedRoute>
              <SpectrumOrdersAdmin />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/create"
          element={
            <ProtectedRoute>
              <CreateAdminForm />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}
