import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Trao quyền cuộc sống
            </span>{" "}
            để từ bỏ thuốc lá
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Chúng tôi cung cấp giải pháp tư vấn và hỗ trợ toàn diện để giúp bạn
            bỏ thuốc, cải thiện sức khỏe và kiểm soát cuộc sống của mình.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="#contact"
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 transition-all text-white font-medium"
            >
              Bắt đầu ngay
            </Link>
            <Link
              to="#services"
              className="px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-all text-gray-800 font-medium flex items-center justify-center gap-2"
            >
              Dịch vụ của chúng tôi <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
