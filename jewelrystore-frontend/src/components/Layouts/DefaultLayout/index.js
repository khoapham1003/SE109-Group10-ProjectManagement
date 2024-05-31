import Header from "./Header/Header";
import Footer from "../DefaultLayout/Footer/Footer";
import background_log from "../../../assets/images/background_log.jpg"

function DefaultLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor:"#f5f5f5",
        backgroundImage: background_log
      }}
    >
      <Header />
      <div className="content">{children}</div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
