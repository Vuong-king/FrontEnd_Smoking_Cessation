import {
  Code,
  Layers,
  Smartphone,
  Globe,
  Rocket,
  LineChart,
} from "lucide-react";

export function Services() {
  const services = [
    {
      icon: <Smartphone className="w-10 h-10 text-purple-500" />,
      title: "Ứng Dụng Cai Thuốc",
      description:
        "Theo dõi tiến trình, đặt mục tiêu và nhận động lực mỗi ngày với ứng dụng di động dễ sử dụng.",
    },
    {
      icon: <Globe className="w-10 h-10 text-cyan-500" />,
      title: "Tư Vấn Trực Tuyến",
      description:
        "Kết nối với chuyên gia được chứng nhận để nhận kế hoạch và hỗ trợ cai thuốc cá nhân hóa.",
    },
    {
      icon: <Layers className="w-10 h-10 text-purple-500" />,
      title: "Liệu Pháp Hành Vi",
      description:
        "Tiếp cận các chiến lược khoa học giúp kiểm soát cơn thèm thuốc và thay đổi hành vi bền vững.",
    },
    {
      icon: <Rocket className="w-10 h-10 text-cyan-500" />,
      title: "Tạo Động Lực Hằng Ngày",
      description:
        "Nhận mẹo, câu chuyện truyền cảm hứng và lời khích lệ để luôn giữ vững quyết tâm.",
    },
    {
      icon: <LineChart className="w-10 h-10 text-purple-500" />,
      title: "Theo Dõi Tiến Trình",
      description:
        "Xem cột mốc sức khỏe và số tiền tiết kiệm rõ ràng trong bảng điều khiển trực quan.",
    },
    {
      icon: <Code className="w-10 h-10 text-cyan-500" />,
      title: "Cộng Đồng Hỗ Trợ",
      description:
        "Tham gia nhóm người cùng hành trình để chia sẻ kinh nghiệm và nhận hỗ trợ tích cực.",
    },
  ];

  return (
    <section id="services" className="py-20 relative">
      {/* Background blur effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Dịch Vụ
            </span>{" "}
            của Chúng Tôi
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Hành trình cai thuốc hiệu quả với các dịch vụ cá nhân hóa và hỗ trợ
            chuyên sâu từ đội ngũ chuyên gia.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(128,0,255,0.4)] hover:scale-[1.03] transition-all duration-300 ease-in-out group"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-black/70">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
