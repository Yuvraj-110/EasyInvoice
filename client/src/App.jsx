import { Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/ContactUs';
import Dashboard from "./pages/Dashboard";
import AddBusiness from "./pages/AddBusiness";
import AuthPage from "./components/AuthPage";
import VerifyPage from './pages/VerifyPage';
import Welcome from './pages/Welcome';
import CreateInvoice from './components/CreateInvoice';
import ProtectedRoute from "./components/ProtectedRoute";
import SelectTemplate from "./pages/SelectTemplate";
import InvoicePreviewPage from './pages/InvoicePreviewPage';
// import EditInvoice from "./components/EditInvoice";
import EditInvoicePage from './pages/EditInvoicePage';

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import SidebarLayout from "./components/dashboard/SidebarLayout/SidebarLayout";
import ContactUs from "./pages/ContactUs";

function App() {
  const { loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/welcome" element={<Welcome />} />

          <Route path="/business/:id/dashboard" element={<SidebarLayout />} />

          <Route path="/invoice/:id" element={<InvoicePreviewPage />} />

         <Route path="/invoices/edit/:id" element={<EditInvoicePage />} />


          <Route
            path="/business/:businessId/create-invoice"
            element={
              <ProtectedRoute>
                <CreateInvoice />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-business"
            element={
              <ProtectedRoute>
                <AddBusiness />
              </ProtectedRoute>
            }
          />

          <Route
            path="/business/:businessId/select-template"
            element={
              <ProtectedRoute>
                <SelectTemplate />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
