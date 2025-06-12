const page = () => {
  return (
    <div className="relative max-w-sm mx-auto bg-gray-800 text-white rounded-xl p-6 shadow-2xl shadow-purple-500/50 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:opacity-100 opacity-0 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
          Card Tương Tác
        </h2>
        <p className="mt-2 text-gray-300">
          Card với hiệu ứng gradient động, bóng neon, và chuyển động mượt mà.
        </p>
        <button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 active:scale-95">
          Khám phá ngay
        </button>
      </div>
    </div>
  );
};

export default page;
