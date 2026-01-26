import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Core Components (Imported statically as they are needed immediately)
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import FullPageLoader from "./components/ui/FullPageLoader";
import { NotificationProvider } from "./components/context/NotificationContext";

// 🔹 Lazy Loaded Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));
const ChangeEmail = lazy(() => import("./pages/auth/ChangeEmail"));

// 🔹 Lazy Loaded Customer Pages
const Customers = lazy(() => import("./components/customers/Customers"));
const AddCustomer = lazy(() => import("./components/customers/AddCustomer"));
const EditCustomer = lazy(() => import("./components/customers/EditCustomer"));
const CustomerDetails = lazy(() => import("./components/customers/CustomerDetails"));
const TrashCustomers = lazy(() => import("./components/customers/TrashCustomers"));
const BrokerManagement = lazy(() => import("./pages/broker/BrokerManagement"));
const NotificationCenter = lazy(() => import("./pages/notifications/NotificationCenter"));
const AllPolicies = lazy(() => import("./pages/policy/AllPolicies"));
const GSTVault = lazy(() => import("./pages/gst/GSTVault"));
const ITRVault = lazy(() => import("./pages/itr/ITRVault"));

// 🔹 Other
const NotFound = lazy(() => import("./components/NotFound"));

export default function App() {
  return (
    <>
      <NotificationProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#0f172a', // Slate 900 for text
              borderRadius: '12px',
              border: '1px border-slate-200',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '13px',
              fontWeight: '600',
              padding: '12px 20px',
              maxWidth: '500px',
            },
            success: {
              iconTheme: {
                primary: '#6366f1', // Indigo 500
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444', // Red 500
                secondary: '#fff',
              },
            },
          }}
        />

        {/* 🔹 Suspense catches the 'lazy' components while they download */}
        <Suspense fallback={<FullPageLoader message="Synchronizing Environment..." />}>
          <Routes>
            {/* 🔓 Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* 🔐 Protected Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/customers" replace />} />

              {/* Customers Resource Group */}
              <Route path="customers">
                <Route index element={<Customers />} />
                <Route path="add" element={<AddCustomer />} />
                <Route path="trash" element={<TrashCustomers />} />
                <Route path="edit/:id" element={<EditCustomer />} />
                <Route path=":id" element={<CustomerDetails />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Account Settings */}
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="change-email" element={<ChangeEmail />} />
              <Route path="agent" element={<BrokerManagement />} />
              <Route path="notifications" element={<NotificationCenter />} />
              <Route path="policy" element={<AllPolicies />} />
              <Route path="gst" element={<GSTVault />} />
              <Route path="itr" element={<ITRVault />} />

            </Route>

            {/* ❌ 404 - Global Catch */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </NotificationProvider>
    </>
  );
}