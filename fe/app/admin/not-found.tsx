import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-3xl font-bold">404 - Không tìm thấy dữ liệu</h1>
      <p className="text-gray-600 mt-2">
        Dữ liệu bạn tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link
        href="/admin"
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Quay lại trang quản lý
      </Link>
    </div>
  );
}
