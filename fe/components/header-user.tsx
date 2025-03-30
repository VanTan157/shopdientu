import { cookies } from "next/headers";
import Avatar from "./avatar";
import Notification from "./notification";
import { Input } from "./ui/input";
import Link from "next/link";

const HeaderUser = async () => {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;

  return (
    <div className="flex h-20 bg-black text-white items-center space-x-8 px-5">
      <div>
        <Link href={"/"}>Logo</Link>
      </div>
      <div className="flex-1 pl-12">
        <div>
          <Input
            className="w-full bg-white text-black border-gray-600 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Tìm kiếm..."
          />
        </div>
        <div className="flex space-x-3 pt-3 text-xs">
          <div className="hover:opacity-70 cursor-pointer">Điện thoại</div>
          <div className="hover:opacity-70 cursor-pointer">Tai nghe</div>
          <div className="hover:opacity-70 cursor-pointer">Laptop</div>
          <div className="hover:opacity-70 cursor-pointer">Máy tính bảng</div>
          <div className="hover:text-blue-400 cursor-pointer">Máy tính</div>
        </div>
      </div>
      {accessToken ? (
        <>
          <div className="hover:opacity-70 cursor-pointer">Giỏ hàng</div>
          <div className="hover:opacity-70 cursor-pointer">
            <Notification />
          </div>
          <div className="hover:opacity-70 cursor-pointer">
            <Avatar />
          </div>
        </>
      ) : (
        <>
          <div className="hover:opacity-70 cursor-pointer">Đăng ký</div>
          <div className="hover:opacity-70 cursor-pointer">
            <Link href={"/login"}>Đăng nhập</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderUser;
