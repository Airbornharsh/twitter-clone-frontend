import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/Login/SignUp";
import ProtectedRoute from "./pages/ProtectedRoute";
import PageLoading from "./pages/PageLoading";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            Component={() => (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            )}
          />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={SignUp} />
          <Route path="page-loading" Component={PageLoading} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
