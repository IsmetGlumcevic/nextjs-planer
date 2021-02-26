import "../styles/globals.scss";
import UserContextProvider from "../context/UserContext";
import StoreContextProvider from "../context/StoreContext";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <StoreContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </StoreContextProvider>
    </UserContextProvider>
  );
}

export default MyApp;
