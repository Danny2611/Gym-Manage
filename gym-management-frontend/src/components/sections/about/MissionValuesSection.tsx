import React from "react";
import SectionTitle from "../../common/SectionTitle";

const MissionValuesSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <SectionTitle
              subtitle="SỨ MỆNH & GIÁ TRỊ"
              title="Tạo động lực cho hành trình sức khỏe của bạn mỗi ngày"
              alignment="left"
            />
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Sứ mệnh của FittLife là trao quyền cho mọi người thông qua thể dục
              và dinh dưỡng. Chúng tôi tin rằng mỗi người đều xứng đáng có một
              cuộc sống khỏe mạnh, tràn đầy năng lượng và chúng tôi cam kết cung
              cấp hướng dẫn, hỗ trợ và nguồn lực cần thiết để đạt được điều đó.
            </p>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Các giá trị cốt lõi của chúng tôi bao gồm sự hòa nhập, cộng đồng,
              chuyên môn và sự xuất sắc liên tục. Chúng tôi tạo ra không gian
              nơi mọi người, bất kể trình độ thể lực hiện tại, đều được chào đón
              và hỗ trợ trong hành trình sức khỏe độc đáo của họ.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
                <h4 className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
                  Sức khỏe toàn diện
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Chúng tôi chú trọng đến cả thể chất và tinh thần của bạn
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
                <h4 className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
                  Sự tiến bộ bền vững
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Kết quả lâu dài hơn là giải pháp tạm thời
                </p>
              </div>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <img
              src="/images/about/mission-main.JPG"
              alt="Sứ mệnh và giá trị của chúng tôi"
              className="h-auto w-full rounded-lg object-cover shadow-lg"
            />
            <div className="absolute -bottom-8 -left-8 hidden md:block">
              <img
                src="/images/about/mission-accent.JPG"
                alt="Tập luyện nhóm"
                className="h-48 w-48 rounded-lg border-4 border-white object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionValuesSection;
