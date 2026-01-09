import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Core Components (Imported statically as they are needed immediately)
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import FullPageLoader from "./components/ui/FullPageLoader";

// 🔹 Lazy Loaded Auth Pages
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ChangePassword = lazy(() => import("./pages/auth/ChangePassword"));

// 🔹 Lazy Loaded Customer Pages
const Customers = lazy(() => import("./components/customers/Customers"));
const AddCustomer = lazy(() => import("./components/customers/AddCustomer"));
const EditCustomer = lazy(() => import("./components/customers/EditCustomer"));
const CustomerDetails = lazy(() => import("./components/customers/CustomerDetails"));
const TrashCustomers = lazy(() => import("./components/customers/TrashCustomers"));

// 🔹 Other
const NotFound = lazy(() => import("./components/NotFound"));

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            maxWidth: '550px',
            borderRadius: '16px',
            background: '#0f172a',
            color: '#fff',
            fontSize: '14px'
          }
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
            </Route>

            {/* Account Settings */}
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          {/* ❌ 404 - Global Catch */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}