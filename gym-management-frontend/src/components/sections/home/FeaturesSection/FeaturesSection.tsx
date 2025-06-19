import React from "react";
import { motion } from "framer-motion";
import { GiWeightLiftingUp, GiMuscleUp, GiHeartBeats } from "react-icons/gi";
import {
  MdSportsGymnastics,
  MdSportsMartialArts,
  MdFoodBank,
} from "react-icons/md";
import SectionTitle from "~/components/common/SectionTitle";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <GiWeightLiftingUp size={48} />,
    title: "Trang thiết bị hiện đại",
    description:
      "Sử dụng đầy đủ các trang thiết bị hiện đại, từ cơ bản đến khu vực VIP, đáp ứng mọi nhu cầu luyện tập của bạn.",
  },
  {
    icon: <GiMuscleUp size={48} />,
    title: "Huấn luyện cá nhân",
    description:
      "Tập cùng huấn luyện viên cá nhân (PT) từ 2 đến 8 buổi mỗi tháng giúp bạn đạt hiệu quả tối ưu.",
  },
  {
    icon: <MdFoodBank size={48} />,
    title: "Tư vấn dinh dưỡng",
    description:
      "Tư vấn và xây dựng kế hoạch dinh dưỡng cá nhân hóa theo từng mục tiêu cụ thể của bạn.",
  },
  {
    icon: <MdSportsGymnastics size={48} />,
    title: "Lớp học nhóm cardio",
    description:
      "Tham gia không giới hạn các lớp cardio nhóm để cải thiện sức khỏe tim mạch và giảm cân hiệu quả.",
  },
  {
    icon: <GiHeartBeats size={48} />,
    title: "Đánh giá thể chất định kỳ",
    description:
      "Theo dõi tình trạng sức khỏe và hiệu quả luyện tập qua các buổi đánh giá thể chất định kỳ và chuyên sâu.",
  },
  {
    icon: <MdSportsMartialArts size={48} />,
    title: "Dịch vụ cao cấp",
    description:
      "Trải nghiệm dịch vụ spa định kỳ, ưu tiên đặt lịch PT và hỗ trợ riêng 24/7 cho các gói cao cấp.",
  },
];

const FeaturesSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Chúng Tôi Cung Cấp Gì"
          subtitle="CÁC ĐẶC ĐIỂM NỔI BẬT"
          description="Khám phá các dịch vụ thể hình toàn diện giúp bạn đạt được mục tiêu sức khỏe và thể chất một cách hiệu quả."
          centered
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="rounded-lg bg-white p-8 shadow-lg transition-transform hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40"
            >
              <div className="mb-4 text-[#0CC6F0] dark:text-[#0CC6F0]">
                {feature.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#0D2E4B] dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;