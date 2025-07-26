export function WorkProcess() {
  const steps = [
    {
      number: "01",
      title: "Đánh Giá",
      description:
        "Chúng tôi bắt đầu bằng việc đánh giá thói quen hút thuốc, tác nhân gây nghiện và mức độ sẵn sàng cai thuốc của bạn để xây dựng kế hoạch phù hợp.",
    },
    {
      number: "02",
      title: "Đặt Mục Tiêu",
      description:
        "Cùng nhau, chúng ta xác định mục tiêu rõ ràng, thực tế và chọn ngày bắt đầu cai thuốc phù hợp với lối sống của bạn.",
    },
    {
      number: "03",
      title: "Chuẩn Bị",
      description:
        "Chúng tôi hướng dẫn bạn chuẩn bị về tinh thần, cảm xúc và môi trường sống để tăng khả năng thành công.",
    },
    {
      number: "04",
      title: "Hành Động",
      description:
        "Vào ngày bắt đầu cai thuốc, bạn sẽ làm theo kế hoạch cá nhân hóa với công cụ, sự hỗ trợ và động lực cần thiết.",
    },
    {
      number: "05",
      title: "Hỗ Trợ",
      description:
        "Bạn sẽ nhận được hỗ trợ liên tục từ chuyên gia và cộng đồng để vượt qua cơn thèm thuốc và tránh tái nghiện.",
    },
    {
      number: "06",
      title: "Duy Trì",
      description:
        "Chúng tôi giúp bạn xây dựng chiến lược dài hạn để giữ vững lối sống không thuốc lá và ăn mừng từng cột mốc bạn đạt được.",
    },
  ];

  return (
    <section
      id="process"
      className="py-20 bg-white-to-b from-black to-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Quy Trình{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
              Hỗ Trợ
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Chiến lược cá nhân hóa, đã được kiểm chứng để đồng hành cùng bạn
            trong hành trình bỏ thuốc lá.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(128,0,255,0.3)] hover:scale-[1.03] transition-all duration-300 ease-in-out group"
            >
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500 mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
