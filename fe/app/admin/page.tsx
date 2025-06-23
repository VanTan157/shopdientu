import { FaUsers, FaBoxOpen, FaChartLine, FaDollarSign } from "react-icons/fa";

const stats = [
  {
    title: "Người dùng",
    value: "1,250",
    icon: <FaUsers />,
    change: "+5%",
    desc: "So với tháng trước",
  },
  {
    title: "Sản phẩm",
    value: "320",
    icon: <FaBoxOpen />,
    change: "+2%",
    desc: "So với tháng trước",
  },
  {
    title: "Doanh thu",
    value: "₫120,000,000",
    icon: <FaDollarSign />,
    change: "+10%",
    desc: "So với tháng trước",
  },
  {
    title: "Đơn hàng",
    value: "980",
    icon: <FaChartLine />,
    change: "-1%",
    desc: "So với tháng trước",
  },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 animate-fade-in-down">
        Bảng điều khiển quản trị
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 hover:scale-105 transition-transform duration-300 ease-out group"
          >
            <div className="bg-gray-100 rounded-full p-4 group-hover:rotate-12 transition-transform duration-300">
              {stat.icon}
            </div>
            <div>
              <div className="text-gray-500 text-sm">{stat.title}</div>
              <div className="text-2xl font-semibold text-gray-800">
                {stat.value}
              </div>
              <div
                className={`text-xs mt-1 ${
                  stat.change.startsWith("+")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change} <span className="text-gray-400">{stat.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Biểu đồ doanh thu (Demo)
        </h2>
        <div className="w-full h-48 flex items-center justify-center text-gray-400">
          {/* Placeholder for chart */}
          <svg width="100%" height="100%" viewBox="0 0 400 150">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              points="0,120 50,80 100,100 150,60 200,90 250,40 300,70 350,30 400,60"
              className="animate-pulse"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Page;
