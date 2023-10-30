import Router from "./route/Index";

import ThemeProvider from "./layout/provider/Theme";
import {useSelector} from "react-redux"
import { Navigate, useLocation} from "react-router";
import { ToastContainer } from "react-toastify";

const App = () => {
  const info = useSelector(state => state.account.info)
  const { pathname } = useLocation()

  if(!info && (pathname !== "/auth-login"&& pathname !== "/auth-register")) return <Navigate to="/auth-login" replace />
  return (
    <ThemeProvider>
      <ToastContainer />
      <Router />
    </ThemeProvider>
  );
};
export default App;