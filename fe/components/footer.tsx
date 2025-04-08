// components/Footer.tsx
import { Facebook, Instagram, Youtube, Phone, Mail } from "lucide-react"; // Icon từ lucide-react
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-10">
      <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Liên hệ với chúng tôi</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>Hotline: 0123 456 789</span>
            </li>
            <li className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              <span>Email: support@example.com</span>
            </li>
            <li>Địa chỉ: 123 Đường XYZ, TP. HN</li>
          </ul>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-blue-400 transition-colors"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                href="/policy"
                className="hover:text-blue-400 transition-colors"
              >
                Chính sách bảo hành
              </Link>
            </li>
          </ul>
        </div>

        {/* Mạng xã hội */}
        <div>
          <h3 className="text-xl font-bold mb-4">Theo dõi chúng tôi</h3>
          <div className="flex space-x-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="hover:text-blue-400 transition-colors"
            >
              <Facebook className="w-6 h-6" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="hover:text-blue-400 transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </Link>
            <Link
              href="https://youtube.com"
              target="_blank"
              className="hover:text-blue-400 transition-colors"
            >
              <Youtube className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Công ty Công Nghệ XYZ. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
