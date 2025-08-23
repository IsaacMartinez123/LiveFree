import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import ProtectedRoute from './Components/ProtectedRoute';
import Home from './pages/home/Home';
import Layout from './Components/layout/Layout';
import Users from './pages/users/Users';
import Sellers from './pages/users/Sellers';
import Clients from './pages/users/Clients';
import Payments from './pages/payments/Payments';
import { useEffect, useState } from 'react';
import { useAppDispatch } from './redux/hooks';
import { loginSuccess } from './redux/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import ProductsPage from './pages/products/Products';
import SalesPage from './pages/sales/Sales';
import Returns from './pages/returns/Return';
import Reports from './pages/reports/Reports';

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-300 border-t-purple-700 rounded-full animate-spin"></div>
        <span className="text-purple-700 font-semibold">Cargando...</span>
      </div>
    </div>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      dispatch(loginSuccess(JSON.parse(user)));
    }
    setRehydrated(true);
  }, [dispatch]);

  if (!rehydrated) return <Loader />;

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Layout>
                <Users />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sellers"
          element={
            <ProtectedRoute>
              <Layout>
                <Sellers />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Layout>
                <Clients />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Layout>
                <SalesPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Layout>
                <Payments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/returns"
          element={
            <ProtectedRoute>
              <Layout>
                <Returns />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Reports />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={4000} theme='colored' />
    </div>
  );
}

export default App;