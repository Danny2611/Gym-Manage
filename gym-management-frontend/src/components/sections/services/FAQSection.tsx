import React from "react";
import SectionTitle from "../../common/SectionTitle";
import { Disclosure, Transition } from "@headlessui/react";
import Button from "../../common/Button";

interface FAQ {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const faqs: FAQ[] = [
    {
      question: "Giờ mở cửa phòng gym như thế nào?",
      answer:
        "Chúng tôi mở cửa từ Thứ Hai đến Thứ Sáu, 5:00 sáng đến 11:00 tối. Cuối tuần mở từ 7:00 sáng đến 9:00 tối. Giờ hoạt động vào các dịp lễ sẽ được thông báo trước.",
    },
    {
      question: "Tôi có cần mang theo thiết bị tập luyện không?",
      answer:
        "Không, phòng tập đã trang bị đầy đủ thiết bị cần thiết. Chúng tôi cung cấp khăn tập, tuy nhiên bạn nên mang theo chai nước cá nhân. Chúng tôi có máy lọc nước tại chỗ.",
    },
    {
      question: "Hủy hội viên có mất phí không?",
      answer:
        "Với hội viên theo tháng, cần thông báo trước 30 ngày và không mất thêm phí. Với hội viên năm, có thể bị tính phí nếu hủy sớm trước thời hạn hợp đồng. Vui lòng xem điều khoản hợp đồng để biết chi tiết.",
    },
    {
      question: "Phòng gym có dịch vụ giữ trẻ không?",
      answer:
        "Có, chúng tôi cung cấp dịch vụ giữ trẻ vào một số khung giờ nhất định trong tuần. Có thu phí nhỏ và nên đặt trước vào giờ cao điểm.",
    },
    {
      question: "Tôi có thể tạm ngưng hội viên không?",
      answer:
        "Có thể. Hội viên được phép tạm ngưng từ 1 đến 3 tháng mỗi năm, có áp dụng phí duy trì nhỏ hàng tháng. Liên hệ bộ phận hỗ trợ để biết thêm chi tiết.",
    },
    {
      question: "Đăng ký lớp học nhóm như thế nào?",
      answer:
        "Bạn có thể đăng ký qua website, ứng dụng di động hoặc tại quầy lễ tân. Chúng tôi khuyến khích đặt chỗ sớm vì các lớp phổ biến thường hết chỗ nhanh. Hội viên cao cấp có quyền đặt chỗ ưu tiên.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="CÂU HỎI THƯỜNG GẶP"
          title="Giải đáp thắc mắc của bạn"
          description="Những câu hỏi phổ biến liên quan đến dịch vụ, gói tập và chính sách của chúng tôi."
        />

        <div className="mx-auto mt-12 max-w-3xl">
          {faqs.map((faq, index) => (
            <Disclosure key={index} as="div" className="mt-4">
              {({ open }) => (
                <>
                  <Disclosure.Button className="focus-visible:ring-primary-500 flex w-full justify-between rounded-lg bg-white px-6 py-4 text-left text-lg font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-opacity-75 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                    <span>{faq.question}</span>
                    <span
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } transition-transform duration-200`}
                    >
                      <i className="fas fa-chevron-down"></i>
                    </span>
                  </Disclosure.Button>
                  <Transition
                    show={open}
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className="rounded-b-lg border border-gray-100 bg-white px-6 py-4 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {faq.answer}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Không tìm thấy câu trả lời bạn cần?
          </p>
          <Button variant="primary" size="large">
            Liên hệ với chúng tôi
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
