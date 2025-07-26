import { Image } from "antd";
import { Marquee } from "../../ui/Marquee";
import useFeedbacks from "../../../hook/useFeedbacks";

const Testimonials = () => {
  const { feedbacks, loading, error } = useFeedbacks();

  const fallbackTestimonials = [
    {
      quote: "Nhờ chương trình tư vấn cai thuốc lá này, tôi đã bỏ thuốc sau 15 năm. Sự hỗ trợ và hướng dẫn thực sự tuyệt vời.",
      author: "John Nguyen",
      position: "Người đã thành công",
      avatar: "/default-avatar.png",
      rating: 5
    },
    {
      quote: "Các chuyên gia tư vấn rất tận tâm và thực sự thấu hiểu những khó khăn khi cai thuốc. Chương trình này đã thay đổi cuộc đời tôi.",
      author: "Anna Tran",
      position: "Khách hàng",
      avatar: "/default-avatar.png",
      rating: 5
    },
    {
      quote: "Chương trình hỗ trợ cai thuốc này không chỉ giúp tôi bỏ thuốc mà còn cải thiện sức khỏe và tinh thần.",
      author: "Michael Lee",
      position: "Người đã cai thành công",
      avatar: "/default-avatar.png",
      rating: 5
    },
  ];

  const testimonials = feedbacks.length > 0 ? feedbacks : fallbackTestimonials;

  return (
    <section id="testimonials" className="py-20 bg-white">
  <div className="container mx-auto px-4 text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
      Khách Hàng{" "}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-cyan-500">
        Nói Gì
      </span>
    </h2>
    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
      Cộng đồng của chúng tôi là minh chứng rõ ràng — đọc chia sẻ từ những người đã cai thuốc thành công.
    </p>
  </div>

  {loading ? (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
    </div>
  ) : error ? (
    <div className="text-center py-12">
      <p className="text-gray-500">Không thể tải lời nhận xét vào lúc này.</p>
    </div>
  ) : (
    <Marquee pauseOnHover className="max-w-6xl mx-auto">
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="min-w-[300px] max-w-sm mx-4 bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
        >
          <div className="mb-6">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-gray-700 mb-6 italic">"{testimonial.content || testimonial.quote}"</p>
          <div className="flex items-center">
            <Image
              src={testimonial.user_id?.avatar_url || testimonial.avatar}
              alt={testimonial.user_id?.name || testimonial.author}
              width={48}
              height={48}
              className="rounded-full mr-4"
              fallback="/default-avatar.png"
            />
            <div className="ml-2">
              <h4 className="font-medium text-gray-900">{testimonial.user_id?.name || testimonial.author}</h4>
              <p className="text-gray-500 text-sm">
                {testimonial.feedback_type === 'user_to_coach'
                  ? 'Khách hàng gửi huấn luyện viên'
                  : testimonial.position || 'Khách hàng'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Marquee>
  )}
</section>

  );
};

export default Testimonials;
