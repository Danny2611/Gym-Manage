import React from "react";
import SectionTitle from "../../common/SectionTitle";

const TeamSection: React.FC = () => {
  return (
    <section className="bg-white py-16 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <img
              src="/images/about/team-main.JPG"
              alt="Đội ngũ chuyên gia của chúng tôi"
              className="h-auto w-full rounded-lg object-cover shadow-lg"
            />
            <div className="absolute -bottom-8 -right-8 hidden md:block">
              <img
                src="/images/about/team-accent.JPG"
                alt="Huấn luyện viên cá nhân"
                className="h-48 w-48 rounded-lg border-4 border-white object-cover shadow-lg"
              />
            </div>
          </div>
          <div>
            <SectionTitle
              subtitle="ĐỘI NGŨ CHUYÊN GIA"
              title="Những chuyên gia tận tâm phía sau thành công của bạn"
              alignment="left"
            />
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Đội ngũ FittLife bao gồm những huấn luyện viên thể hình chuyên
              nghiệp, chuyên gia dinh dưỡng và nhân viên hỗ trợ tận tâm, tất cả
              đều cam kết giúp bạn đạt được mục tiêu sức khỏe và sự khỏe mạnh.
              Mỗi thành viên của đội ngũ chúng tôi đều có chứng chỉ đầy đủ trong
              lĩnh vực chuyên môn của họ và luôn cập nhật các phương pháp tập
              luyện hiện đại nhất.
            </p>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Chúng tôi tin rằng mối quan hệ giữa huấn luyện viên và hội viên
              cũng quan trọng như chính chương trình tập luyện. Đó là lý do tại
              sao chúng tôi đầu tư vào việc hiểu nhu cầu cụ thể của từng hội
              viên, điều chỉnh chương trình tập luyện và dinh dưỡng để tối đa
              hóa kết quả và đảm bảo trải nghiệm tập luyện thú vị.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="bg-primary-600 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                  Đội ngũ tận tâm
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Luôn sẵn sàng hỗ trợ bạn
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary-600 mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-white">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                  Lịch trình linh hoạt
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Phù hợp với cuộc sống bận rộn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
