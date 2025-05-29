import React from "react";
import SectionTitle from "../../common/SectionTitle";

const OurStorySection: React.FC = () => {
  return (
    <section className="bg-white py-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <img
              src="/images/about/story-main.jpg"
              alt="Câu chuyện phòng gym của chúng tôi"
              className="h-auto w-full rounded-lg object-cover shadow-lg"
            />
            <div className="absolute -bottom-8 -right-8 hidden md:block">
              <img
                src="/images/about/story-accent.jpg"
                alt="Huấn luyện thể hình"
                className="h-48 w-48 rounded-lg border-4 border-white object-cover shadow-lg"
              />
            </div>
          </div>
          <div>
            <SectionTitle
              subtitle="CÂU CHUYỆN CỦA CHÚNG TÔI"
              title="Trải nghiệm sự xuất sắc trong thể hình từ năm 2010"
              alignment="left"
            />
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Tại FittLife, hành trình của chúng tôi bắt đầu với một sứ mệnh đơn
              giản: tạo ra một môi trường thể hình nơi mọi người đều cảm thấy
              được chào đón và được truyền cảm hứng để đạt được mục tiêu sức
              khỏe của mình. Được thành lập từ năm 2010, chúng tôi đã phát triển
              từ một phòng gym nhỏ địa phương thành một trung tâm thể hình hướng
              đến cộng đồng, đặt con người lên hàng đầu.
            </p>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Đội ngũ huấn luyện viên được chứng nhận của chúng tôi mang đến
              hàng thập kỷ kinh nghiệm kết hợp, giúp bạn thay đổi cuộc sống
              thông qua thể hình. Chúng tôi tin vào một phương pháp tiếp cận cân
              bằng, kết hợp giữa luyện tập hiệu quả, dinh dưỡng hợp lý và sức
              khỏe tinh thần.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center">
                <div className="bg-primary-600 mr-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white">
                  14+
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                    Năm kinh nghiệm
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Trong ngành thể hình
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary-600 mr-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white">
                  25+
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                    HLV chuyên nghiệp
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    Chuyên gia được chứng nhận
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;
