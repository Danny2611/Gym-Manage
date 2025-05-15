import React from "react";
import OurStorySection from "~/components/sections/about/OurStorySection";
import MissionValuesSection from "~/components/sections/about/MissionValuesSection";
import TeamSection from "~/components/sections/about/TeamSection";
import PageHeader from "~/components/common/PageHeader";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Page Header */}
      <PageHeader 
        title="Về Chúng Tôi" 
        subtitle="Khám phá câu chuyện, sứ mệnh và đội ngũ của FittLife"
        backgroundImage="/images/about/header-bg.jpg"
      />
      
      {/* Our Story Section - Zigzag Item 1 */}
      <OurStorySection />
      
      {/* Mission & Values Section - Zigzag Item 2 */}
      <MissionValuesSection />
      
      {/* Team Section - Zigzag Item 3 */}
      <TeamSection />
      
      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Sẵn sàng bắt đầu hành trình của bạn?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-100">
            Tham gia cùng FittLife ngay hôm nay và khám phá sức mạnh thực sự của bạn với sự hỗ trợ từ đội ngũ chuyên gia hàng đầu của chúng tôi.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button className="rounded-lg bg-white px-8 py-3 font-semibold text-primary-600 transition-all hover:bg-gray-100">
              Tham quan phòng gym
            </button>
            <button className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-primary-600">
              Đăng ký tư vấn miễn phí
            </button>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary-600">CÂU HỎI THƯỜNG GẶP</h2>
            <h3 className="mb-12 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Mọi điều bạn cần biết về FittLife
            </h3>
          </div>
          
          <div className="mx-auto max-w-3xl divide-y divide-gray-200 dark:divide-gray-700">
            {faqItems.map((item, index) => (
              <div key={index} className="py-5">
                <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {item.question}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// FAQ data
const faqItems = [
  {
    question: "Phòng gym của bạn có phù hợp cho người mới bắt đầu không?",
    answer: "Hoàn toàn phù hợp! Chúng tôi đặc biệt tự hào về môi trường thân thiện và hòa nhập. Mỗi thành viên mới đều được buổi đánh giá và định hướng miễn phí để đảm bảo bạn cảm thấy tự tin khi bắt đầu hành trình của mình."
  },
  {
    question: "FittLife cung cấp những loại hình huấn luyện nào?",
    answer: "Chúng tôi cung cấp nhiều dịch vụ bao gồm huấn luyện cá nhân, các lớp học nhóm (yoga, spinning, HIIT, v.v.), tư vấn dinh dưỡng, và các chương trình tập luyện được cá nhân hóa để đáp ứng mục tiêu cụ thể của bạn."
  },
  {
    question: "Làm thế nào để đăng ký trở thành thành viên?",
    answer: "Bạn có thể đăng ký trực tiếp tại quầy lễ tân của phòng gym hoặc trực tuyến thông qua trang web của chúng tôi. Chúng tôi cung cấp nhiều gói thành viên linh hoạt, từ thẻ ngày đến thành viên dài hạn với nhiều ưu đãi."
  },
  {
    question: "Tôi có thể hủy tư cách thành viên của mình không?",
    answer: "Tất nhiên là có! Chúng tôi hiểu rằng hoàn cảnh có thể thay đổi. Thành viên có thể tạm dừng hoặc hủy tư cách thành viên của họ với thông báo trước 30 ngày. Nhóm dịch vụ khách hàng của chúng tôi sẽ hướng dẫn bạn qua quy trình này."
  },
  {
    question: "FittLife có cung cấp các buổi dùng thử miễn phí không?",
    answer: "Có! Chúng tôi cung cấp buổi dùng thử miễn phí 1 ngày cho khách mới để bạn có thể trải nghiệm cơ sở vật chất và dịch vụ của chúng tôi. Chỉ cần ghé qua và đăng ký với đội ngũ tiếp tân của chúng tôi."
  }
];

export default AboutPage;