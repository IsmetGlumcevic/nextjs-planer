import "../styles/globals.scss";
import UserContextProvider from "../context/UserContext";
import StoreContextProvider from "../context/StoreContext";
import { NotificationContextProvider } from '../context/NotificationContext';
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <StoreContextProvider>
        <NotificationContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        </NotificationContextProvider>
      </StoreContextProvider>
    </UserContextProvider>
  );
}

export default MyApp;
