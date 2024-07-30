import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { useState } from "react";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const [isSideMenuOpen, setMenu] = useState(false);

  return (
    <div className="flex flex-col min-h-screen font-[Open_Sans]">
      <Header isSideMenuOpen={isSideMenuOpen} setMenu={setMenu} />
      <Hero />
      <div className="container mx-auto">{/* Search Bar */}</div>
      <div
        className={clsx(
          "mx-auto py-10 flex-1 transition-opacity duration-300",
          {
            "opacity-0 pointer-events-none": isSideMenuOpen,
          }
        )}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
