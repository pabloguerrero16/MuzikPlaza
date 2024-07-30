import { Link } from "react-router-dom";
import { IoMenu, IoCartOutline, IoLogInOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import clsx from "clsx";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

interface HeaderProps {
  isSideMenuOpen: boolean;
  setMenu: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isSideMenuOpen, setMenu }) => {
  const { isLoggedIn } = useAppContext();

  return (
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
        <Link
          to="#"
          className="hidden lg:block md:block font-bold text-gray-400 hover:text-black"
        >
          Store
        </Link>
        {isLoggedIn ? (
          <Link
            to="#"
            className="hidden lg:block md:block font-bold text-gray-400 hover:text-black"
          >
            Profile
          </Link>
        ) : (
          <></>
        )}
        <Link
          to="#"
          className="hidden lg:block md:block font-bold text-gray-400 hover:text-black"
        >
          Contact
        </Link>
        <Link
          to="#"
          className="hidden lg:block md:block font-bold text-gray-400 hover:text-black"
        >
          About Us
        </Link>
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
          <Link to="#" className="font-bold">
            Store
          </Link>
          {isLoggedIn ? (
            <Link to="#" className="font-bold">
              Profile
            </Link>
          ) : (
            <Link to="/sign-in" className="font-bold">
              Login
            </Link>
          )}
          <Link to="#" className="font-bold">
            Contact
          </Link>
          <Link to="#" className="font-bold">
            About Us
          </Link>
        </section>
      </div>
      <section className="flex flex-row items-center gap-2">
        {isLoggedIn ? (
          <div className="flex flex-row">
            <IoCartOutline className="text-3xl lg:text-4xl" />
            <SignOutButton></SignOutButton>
          </div>
        ) : (
          <div className="flex flex-row">
            <Link to="/sign-in" className="flex flex-row">
              <p className="lg:text-2xl">Login</p>
              <IoLogInOutline className="lg:text-4xl text-3xl" />
            </Link>
          </div>
        )}
      </section>
    </nav>
  );
};

export default Header;
