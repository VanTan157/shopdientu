import { cookies } from "next/headers";
import Avatar from "./avatar";
import Notification from "./notification";
import { Input } from "./ui/input";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import SearchProduct from "./search-product";
import CartIcon from "./cart-icon";

const HeaderUser = async () => {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;

  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-800 shadow-lg w-full pb-2 pt-5 px-5">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="font-bold tracking-tight text-white">
          <Link
            href="/"
            className="hover:text-blue-400 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl transition-colors duration-200"
          >
            Shop<span className="text-blue-400">ĐiệnTử</span>
          </Link>
        </div>
        {/* Search + User Actions */}
        <div className="flex flex-1 items-center space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-6 mx-2 xs:mx-3 sm:mx-4 md:mx-6 lg:mx-8">
          {/* Search */}
          <div className="flex-1 flex items-center justify-center ">
            <SearchProduct />
          </div>
          {/* User Actions */}
          <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3 md:space-x-4">
            {accessToken ? (
              <>
                <Link href="/cart" className="relative group">
                  <CartIcon />
                </Link>
                <Notification />
                <Avatar />
              </>
            ) : (
              <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-3">
                <Link
                  href="/register"
                  className="px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 text-xs xs:text-sm sm:text-base rounded-full font-bold bg-green-400 hover:bg-green-500 hover:text-white transition"
                >
                  Đăng ký
                </Link>
                <Link
                  href="/login"
                  className="px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 text-xs xs:text-sm sm:text-base rounded-full bg-blue-400 text-white hover:bg-blue-500 transition font-medium"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <nav className="flex justify-center flex-wrap gap-x-2 xs:gap-x-3 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-2 text-xs xs:text-sm sm:text-base font-medium text-gray-300">
        <Link href="/mobiles" className="hover:text-blue-400 transition">
          Điện thoại
        </Link>
        <Link href="/headphones" className="hover:text-blue-400 transition">
          Tai nghe
        </Link>
        <Link href="/laptop" className="hover:text-blue-400 transition">
          Laptop
        </Link>
        <span className="hover:text-blue-400 cursor-pointer transition">
          Máy tính bảng
        </span>
        <span className="hover:text-blue-400 cursor-pointer transition">
          Máy tính
        </span>
      </nav>
    </header>
  );
};

export default HeaderUser;
