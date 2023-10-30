import React, { useLayoutEffect } from "react";
import { Routes,Route, useLocation } from "react-router-dom";
import { CustomerProvider } from "../pages/panel/e-commerce/customer/CustomerContext";


import EcomOrder from "../pages/panel/e-commerce/order/OrderDefault";
import EcomSupport from "../pages/panel/e-commerce/support/Messages";
import EcomProducts from "../pages/panel/e-commerce/product/ProductList";
import EcomCategory from "../pages/panel/e-commerce/category/CategoryList";
import EcomCustomer from "../pages/panel/e-commerce/customer/CustomerList";
import EcomCustomerDetails from "../pages/panel/e-commerce/customer/CustomerDetails";
import EcomIntegration from "../pages/panel/e-commerce/integration/Integration";
import EcomSettings from "../pages/panel/e-commerce/settings/Settings";
import EcomDashboard from "../pages/panel/e-commerce/index";



import InvoicePrint from "../pages/pre-built/invoice/InvoicePrint";


import Error404Classic from "../pages/error/404-classic";
import Error404Modern from "../pages/error/404-modern";
import Error504Modern from "../pages/error/504-modern";
import Error504Classic from "../pages/error/504-classic";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Success from "../pages/auth/Success";

import Layout from "../layout/Index";
import LayoutNoSidebar from "../layout/Index-nosidebar";
import ContentContextProvider from "../contexts/ContentContext";

const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
          <Route path="/">
            <Route index element={<EcomDashboard />}></Route>
            <Route path="orders" element={<EcomOrder />}></Route>
            <Route path="products" element={
              <ContentContextProvider>
                <EcomProducts />
              </ContentContextProvider>
            }></Route>
            <Route path="categories" element={
              <ContentContextProvider>
                <EcomCategory />
              </ContentContextProvider>
            }></Route>
            <Route path="support" element={<EcomSupport />}></Route>
            <Route path="settings" element={<EcomSettings />}></Route>
            <Route path="integration" element={<EcomIntegration />}></Route>
            <Route element={<CustomerProvider />} >
              <Route path="customer" element={<EcomCustomer />}></Route>
              <Route path="customer-details/:customerId" element={<EcomCustomerDetails />}></Route>
            </Route>
          </Route>
        </Route>

        <Route path={`${process.env.PUBLIC_URL}`} element={<LayoutNoSidebar />}>
          <Route path="auth-success" element={<Success />}></Route>
            <Route path="auth-reset" element={<ForgotPassword />}></Route>
            <Route path="auth-register" element={<Register />}></Route>
            <Route path="auth-login" element={<Login />}></Route>

            <Route path="errors">
              <Route path="404-modern" element={<Error404Modern />}></Route>
              <Route path="404-classic" element={<Error404Classic />}></Route>
              <Route path="504-modern" element={<Error504Modern />}></Route>
              <Route path="504-classic" element={<Error504Classic />}></Route>
            </Route>
            <Route path="*" element={<Error404Modern />}></Route>
            
            <Route path="invoice-print/:invoiceId" element={<InvoicePrint />}></Route>
        </Route>
      </Routes>
  );
};
export default Router;
