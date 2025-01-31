import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLoading from "./pages/auth/authLoading";
import { RootState } from "./store";
import SignIn from "./pages/auth/signin";
import Home from "./pages/index";
import SnackbarComponent from "./components/snackbar";
import Header from "./components/header";

function App() {
  const { admin, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <AuthLoading />;
  }

  if (!admin) {
    return (
      <BrowserRouter>
        <SnackbarComponent />
        <Routes>
          <Route path='/signin' element={<SignIn />} />
          <Route path='*' element={<Navigate to='/signin' />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <div className='pt-16'>
      <Header />
      <BrowserRouter>
        <SnackbarComponent />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
