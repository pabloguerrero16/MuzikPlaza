import { Link } from "react-router-dom";
import { IoMenu, IoCartOutline } from "react-icons/io5";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import clsx from "clsx";

const Header = () => {
  const [isSideMenuOpen, setMenu] = useState(false);
  const navLinks = [
    { label: "Store", to: "#" },
    { label: "Contact", to: "#" },
    { label: "About Us", to: "#" },
  ];

  return (
    <main>
      <nav className="flex justify-between px-8 items-center py-6 lg:px-24 md:px-24">
        <div className="flex items-center gap-8">
          <section className="flex items-center gap-2">
            <IoMenu
              onClick={() => setMenu(true)}
              className="text-3xl cursor-pointer lg:hidden md:hidden"
            />
            <Link to="/" className="text-2xl font-bold">
              MuzikPlaza
            </Link>
          </section>
          {navLinks.map((link) => (
            <Link
              to={link.to}
              className="hidden lg:block md:block font-bold text-gray-400 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Sidebar Mobile Menu */}
        <div
          className={clsx(
            "fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 -translate-x-full transition-all",
            isSideMenuOpen && "translate-x-0"
          )}
        >
          <section className="text-black bg-white flex-col absolute left-0 top-0 h-screen p-8 gap-8 z-50 flex w-56">
            <IoMdClose
              onClick={() => setMenu(false)}
              className="mt-0 mb-8 text-3xl cursor-pointer"
            />
            {navLinks.map((link) => (
              <Link to={link.to} className="font-bold">
                {link.label}
              </Link>
            ))}
          </section>
        </div>
        <section className="flex items-center gap-2">
          <IoCartOutline className="text-3xl" />
          <img
            className="h-8 w-8 rounded-full"
            src="https://i.pravatar.cc/150?img=31"
            alt="https://i.pravatar.cc/150?img=31"
          />
        </section>
      </nav>
    </main>
  );
};

export default Header;
