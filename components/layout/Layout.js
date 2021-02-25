import Footer from "./Footer"
import Header from "./Header"
import Sidebar from "./Sidebar"

const Layout = ({ children }) => {
  return (
    <div className="content">
      <Header />
      <Sidebar />
      { children }
      <Footer />
    </div>
  );
}
 
export default Layout;