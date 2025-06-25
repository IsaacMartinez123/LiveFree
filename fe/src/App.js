import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/login';
import ProtectedRoute from './Components/ProtectedRoute';
import Home from './pages/home/Home';
import Layout from './Components/layout/Layout';
import Users from './pages/users/Users';
import Products from './pages/products/Products';
import Sellers from './pages/users/Sellers';
import Clients from './pages/users/Clients';

function App() {

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
                <Products />
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
      </Routes>
    </div>
  );
}

export default App;
