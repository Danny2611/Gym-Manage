import React from "react";
import OurStorySection from "~/components/sections/about/OurStorySection";
import MissionValuesSection from "~/components/sections/about/MissionValuesSection";
import TeamSection from "~/components/sections/about/TeamSection";
import { Helmet } from "react-helmet-async";
import Slider, { SlideProps } from "~/components/common/Slider";
import ContactFAQs from "~/components/sections/contact/ContactFAQs";

const homeSlides: SlideProps[] = [
  {
    id: 1,
    image: "/images/hero/slide-1.jpg",
    title: "Câu chuyện của FittLife",
    subtitle: "HÀNH TRÌNH HÌNH THÀNH VÀ PHÁT TRIỂN",
    description:
      "FittLife được thành lập với sứ mệnh giúp mọi người sống khỏe mạnh và năng động hơn mỗi ngày. Tìm hiểu hành trình của chúng tôi từ những ngày đầu cho đến hiện tại.",
    cta: {
      primary: {
        text: "Khám phá câu chuyện",
        link: "/about",
      },
      secondary: {
        text: "Xem video giới thiệu",
        link: "https://www.youtube.com/watch?v=KN3IemyqJJw",
      },
    },
  },
  {
    id: 2,
    image: "/images/hero/slide-2.jpg",
    title: "Đội ngũ huấn luyện viên",
    subtitle: "CHUYÊN NGHIỆP & TẬN TÂM",
    description:
      "Đội ngũ huấn luyện viên tại FittLife luôn đồng hành cùng bạn trong từng bước tiến. Họ là những chuyên gia có chứng chỉ, kinh nghiệm và trái tim yêu nghề.",
    cta: {
      primary: {
        text: "Gặp gỡ huấn luyện viên",
        link: "/services/personal-training",
      },
      secondary: {
        text: "Đặt lịch tư vấn",
        link: "/contact",
      },
    },
  },
  {
    id: 3,
    image: "/images/hero/slide-3.jpg",
    title: "Cơ sở vật chất hiện đại",
    subtitle: "KHÔNG GIAN TẬP LUYỆN ĐẲNG CẤP",
    description:
      "FittLife tự hào mang đến môi trường tập luyện chuyên nghiệp với thiết bị hiện đại, không gian rộng rãi, sạch sẽ và đầy cảm hứng.",
    cta: {
      primary: {
        text: "Xem cơ sở vật chất",
        link: "/services",
      },
      secondary: {
        text: "Dùng thử miễn phí",
        link: "/contact",
      },
    },
  },
];

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Về Chúng Tôi</title>
      </Helmet>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Slider slides={homeSlides} />

        {/* Our Story Section - Zigzag Item 1 */}
        <OurStorySection />

        {/* Mission & Values Section - Zigzag Item 2 */}
        <MissionValuesSection />

        {/* Team Section - Zigzag Item 3 */}
        <TeamSection />

      {/* CTA Section */}
    <section className="bg-[#0D2E4B] py-16 dark:bg-gray-800">
  <div className="container mx-auto px-4 text-center">
    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
      Sẵn sàng bắt đầu hành trình của bạn?
    </h2>
    <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 dark:text-gray-300">
      Tham gia cùng FittLife ngay hôm nay và khám phá sức mạnh thực sự
      của bạn với sự hỗ trợ từ đội ngũ chuyên gia hàng đầu của chúng
      tôi.
    </p>
    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
      <button className="rounded-lg bg-white px-8 py-3 font-semibold text-[#0D2E4B] transition-all hover:bg-gray-100 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white">
        Tham quan phòng gym
      </button>
      <button className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white hover:text-[#0D2E4B] dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-gray-800">
        Đăng ký tư vấn miễn phí
      </button>
    </div>
  </div>
</section>
        {/* FAQ Section */}
     
         <ContactFAQs
        title="Câu hỏi thường gặp"
        subtitle="Giải đáp thắc mắc về dịch vụ và phòng tập của chúng tôi"
        faqs={faqItems}
      />
      </div>
    </>
  );
};

// FAQ data
const faqItems = [
  {
    question: "Phòng gym của bạn có phù hợp cho người mới bắt đầu không?",
    answer:
      "Hoàn toàn phù hợp! Chúng tôi đặc biệt tự hào về môi trường thân thiện và hòa nhập. Mỗi thành viên mới đều được buổi đánh giá và định hướng miễn phí để đảm bảo bạn cảm thấy tự tin khi bắt đầu hành trình của mình.",
  },
  {
    question: "FittLife cung cấp những loại hình huấn luyện nào?",
    answer:
      "Chúng tôi cung cấp nhiều dịch vụ bao gồm huấn luyện cá nhân, các lớp học nhóm (yoga, spinning, HIIT, v.v.), tư vấn dinh dưỡng, và các chương trình tập luyện được cá nhân hóa để đáp ứng mục tiêu cụ thể của bạn.",
  },
  {
    question: "Làm thế nào để đăng ký trở thành thành viên?",
    answer:
      "Bạn có thể đăng ký trực tiếp tại quầy lễ tân của phòng gym hoặc trực tuyến thông qua trang web của chúng tôi. Chúng tôi cung cấp nhiều gói thành viên linh hoạt, từ thẻ ngày đến thành viên dài hạn với nhiều ưu đãi.",
  },
  {
    question: "Tôi có thể hủy tư cách thành viên của mình không?",
    answer:
      "Tất nhiên là có! Chúng tôi hiểu rằng hoàn cảnh có thể thay đổi. Thành viên có thể tạm dừng hoặc hủy tư cách thành viên của họ với thông báo trước 30 ngày. Nhóm dịch vụ khách hàng của chúng tôi sẽ hướng dẫn bạn qua quy trình này.",
  },
  {
    question: "FittLife có cung cấp các buổi dùng thử miễn phí không?",
    answer:
      "Có! Chúng tôi cung cấp buổi dùng thử miễn phí 1 ngày cho khách mới để bạn có thể trải nghiệm cơ sở vật chất và dịch vụ của chúng tôi. Chỉ cần ghé qua và đăng ký với đội ngũ tiếp tân của chúng tôi.",
  },
];

export default AboutPage;