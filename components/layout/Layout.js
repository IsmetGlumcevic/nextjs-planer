import { useContext } from 'react';
import Footer from "./Footer"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Notification from '../notification/Notification';
import NotificationContext from '../../context/NotificationContext';

const Layout = ({ children }) => {
  const notificationCtx = useContext(NotificationContext);

  const activeNotification = notificationCtx.notification;
  
  return (
    <div className="content">
      <Header />
      <Sidebar />
      { children }
      <Footer />
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
    </div>
  );
}
 
export default Layout;