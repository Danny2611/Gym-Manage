import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import Button from "~/components/common/Button";
import SectionTitle from "~/components/common/SectionTitle";

const AboutSection: React.FC = () => {
  const features = [
    "Trang thiết bị hiện đại và đa dạng",
    "Huấn luyện viên cá nhân chuyên nghiệp",
    "Chương trình tập luyện cá nhân hóa",
    "Tư vấn và theo dõi dinh dưỡng chuyên sâu",
    "Không gian rộng rãi, sạch sẽ, thoải mái",
    "Cộng đồng luyện tập năng động và tích cực",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="bg-white py-20 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Image side */}
          <div className="relative w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <img
                src="/images/about/story-accent.jpg"
                alt="Fitness training"
                className="h-auto w-full rounded-lg object-cover shadow-2xl dark:shadow-gray-900/40"
              />
              <div className="absolute -bottom-6 -right-6 hidden rounded-lg bg-[#0CC6F0] px-8 py-6 text-white shadow-lg md:block dark:shadow-gray-900/20">
                <div className="text-4xl font-bold">10+</div>
                <div className="text-sm">YEARS OF EXPERIENCE</div>
              </div>
            </motion.div>
          </div>

          {/* Content side */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="mb-3 text-lg font-bold tracking-wider text-[#0CC6F0] dark:text-[#0CC6F0]">
                VỀ CHÚNG TÔI
              </h3>
              <h2 className="mb-6 text-3xl font-bold text-[#0D2E4B] md:text-4xl dark:text-white">
                Chúng Tôi Ở Đây Để Giúp Bạn Đạt Thể Hình Lý Tưởng
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                FittLife là trung tâm thể hình hàng đầu, cam kết đồng hành cùng
                bạn trong hành trình nâng cao sức khỏe và vóc dáng. Với cơ sở
                vật chất hiện đại, đội ngũ huấn luyện viên chuyên nghiệp và
                phương pháp tiếp cận cá nhân hóa, chúng tôi mang đến môi trường
                luyện tập lý tưởng.
              </p>
              <p className="mb-8 text-gray-600 dark:text-gray-300">
                Dù mục tiêu của bạn là tăng cơ, giảm cân, cải thiện sức bền hay
                đơn giản là duy trì lối sống lành mạnh, đội ngũ của chúng tôi sẽ
                luôn hỗ trợ bạn một cách tận tâm và hiệu quả.
              </p>

              <motion.ul
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-2"
              >
                {features.map((feature, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    className="flex items-center"
                  >
                    <BsCheckCircleFill className="mr-2 text-[#0CC6F0] dark:text-[#0CC6F0]" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <Link to="/about">
                <Button size="large">Tìm Hiểu Thêm Về Chúng Tôi</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;