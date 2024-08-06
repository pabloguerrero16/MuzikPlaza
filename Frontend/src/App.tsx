import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddProduct from "./pages/AddProduct";
import { useAppContext } from "./contexts/AppContext";

function App() {
  const { isLoggedIn } = useAppContext();
  const [isSideMenuOpen] = useState(false);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <p>Search Page</p>
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register isSideMenuOpen={isSideMenuOpen}></Register>
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <SignIn isSideMenuOpen={isSideMenuOpen}></SignIn>
            </Layout>
          }
        />

        {isLoggedIn && (
          <Route
            path="/add-product"
            element={
              <Layout>
                <AddProduct />
              </Layout>
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
