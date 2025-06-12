import { cookies } from "next/headers";
import Avatar from "./avatar";
import Notification from "./notification";
import { Input } from "./ui/input";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const HeaderUser = async () => {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;

  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-800 shadow-lg">
      <div className="flex h-20 items-center px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-tight text-white mr-10">
          <Link href={"/"} className="hover:text-blue-400 transition-colors duration-200">
            Shop<span className="text-blue-400">ĐiệnTử</span>
          </Link>
        </div>
        {/* Search + Categories */}
        <div className="flex-1 flex flex-col">
          <Input
            className="w-full bg-white text-black border-none rounded-full px-5 py-2 shadow focus:ring-2 focus:ring-blue-500 transition"
            type="text"
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
          />
          <nav className="flex space-x-6 pt-3 text-sm font-medium text-gray-300">
            <Link href="/mobiles" className="hover:text-blue-400 transition">Điện thoại</Link>
            <Link href="/headphones" className="hover:text-blue-400 transition">Tai nghe</Link>
            <Link href="/laptop" className="hover:text-blue-400 transition">Laptop</Link>
            <span className="hover:text-blue-400 cursor-pointer transition">Máy tính bảng</span>
            <span className="hover:text-blue-400 cursor-pointer transition">Máy tính</span>
          </nav>
        </div>
        {/* User Actions */}
        <div className="flex items-center space-x-6 ml-10">
          {accessToken ? (
            <>
              <Link href="/cart" className="relative group">
                <ShoppingCart className="w-6 h-6 text-white group-hover:text-blue-400 transition" />
                {/* Badge example */}
                {/* <span className="absolute -top-2 -right-2 bg-blue-500 text-xs text-white rounded-full px-1">3</span> */}
              </Link>
              <Notification />
              <Avatar />
            </>
          ) : (
            <>
              <Link href="/register" className="px-4 py-2 rounded-full border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition font-semibold">Đăng ký</Link>
              <Link href="/login" className="px-4 py-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition font-semibold">Đăng nhập</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderUser;
