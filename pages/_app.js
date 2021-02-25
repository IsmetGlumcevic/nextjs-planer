import "../styles/globals.scss";
import UserContextProvider from "../context/UserContext";
import Layout from "../components/layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <UserContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserContextProvider>
  );
}

export default MyApp;
