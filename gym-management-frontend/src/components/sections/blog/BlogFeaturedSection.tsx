import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SectionTitle from "../../common/SectionTitle";
import { FaCalendarAlt, FaUserAlt } from "react-icons/fa";
import { blogService } from "~/services/blogService";
import { BlogPost } from "~/types/blog";

const BlogFeaturedSection: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      const response = await blogService.getFeaturedPosts(3);
      if (response.success && response.data) {
        setFeaturedPosts(response.data);
      } else {
        console.error("Lỗi khi lấy bài viết nổi bật:", response.message);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (featuredPosts.length === 0) return null;

  const mainPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1);

  return (
    <section className="bg-white py-16 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <SectionTitle
          title="Bài Viết Nổi Bật"
          subtitle="Những chia sẻ & mẹo thể hình mới nhất"
          alignment="center"
        />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Bài viết nổi bật chính */}
          <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900 lg:col-span-2"
          >
            <div className="relative h-96 overflow-hidden">
              <img
                src={
                  `http://localhost:5000/public/${mainPost.coverImage}` ||
                  "/images/blog/default.jpg"
                }
                alt={mainPost.title}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                {mainPost.category.name}
              </div>
            </div>

            <div className="p-6">
              <div className="mb-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  <span>
                    {new Date(mainPost.publishDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaUserAlt className="mr-1" />
                  <span>{mainPost.author?.name}</span>
                </div>
              </div>

              <h3 className="mb-3 text-2xl font-bold text-gray-800 transition duration-300 hover:text-red-600 dark:text-white">
                <Link to={`/blog/${mainPost.slug}`}>{mainPost.title}</Link>
              </h3>

              <p className="mb-4 text-gray-600 dark:text-gray-300">
                {mainPost.excerpt}
              </p>

              <Link
                to={`/blog/${mainPost.slug}`}
                className="inline-block font-semibold text-red-600 hover:underline"
              >
                Đọc tiếp →
              </Link>
            </div>
          </motion.div>

          {/* Bài viết phụ */}
          <div className="space-y-8 lg:col-span-1">
            {secondaryPosts.map((post) => (
              <motion.div
                key={post._id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900 sm:flex-row lg:flex-col"
              >
                <div className="h-48 overflow-hidden sm:w-2/5 lg:w-full">
                  <img
                    src={
                      `http://localhost:5000/public/${post.coverImage}` ||
                      "/images/blog/default.jpg"
                    }
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-4 sm:w-3/5 lg:w-full">
                  <div className="mb-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-600 dark:bg-red-200">
                      {post.category.name}
                    </span>
                    <span className="flex items-center">
                      <FaCalendarAlt className="mr-1" size={10} />
                      {new Date(post.publishDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-gray-800 transition duration-300 hover:text-red-600 dark:text-white">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-block text-sm font-semibold text-red-600 hover:underline"
                  >
                    Đọc tiếp →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogFeaturedSection;
