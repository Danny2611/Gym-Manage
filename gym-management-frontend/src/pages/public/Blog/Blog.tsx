import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout/Layout";
import BlogHeader from "../../../components/sections/blog/BlogHeader";
import BlogSidebar from "../../../components/sections/blog/BlogSidebar";
import BlogPagination from "../../../components/sections/blog/BlogPagination";
import { BlogPost, BlogCategory } from "../../../types/blog";
import HomeSlider from "../../../components/sections/home/HomeSlider";
import BlogFeaturedSection from "../../../components/sections/blog/BlogFeaturedSection";
import { blogService } from "../../../services/blogService";
import { categoryService } from "../../../services/categoryService";
import { Pagination } from "swiper/modules";
import { PaginationControls } from "~/components/common/PaginationControls";

// Keep mock tags as requested
const MOCK_TAGS = [
  "fitness",
  "nutrition",
  "strength",
  "cardio",
  "wellness",
  "yoga",
  "crossfit",
  "weight-loss",
];

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [tags, setTags] = useState<string[]>(MOCK_TAGS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const pageSize = 10; // Number of posts per page

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch posts with pagination
      const postsResponse = await blogService.getAllPosts(currentPage, pageSize);
      if (!postsResponse.success) {
        throw new Error(postsResponse.message || "Failed to fetch blog posts");
      }
      
      if (postsResponse.data) {
      setPosts(postsResponse.data.posts);
      setTotalPages(postsResponse.data.totalPages);
      setTotalPosts(postsResponse.data.total);
    }

      
      // Fetch categories
      const categoriesResponse = await categoryService.getAllCategories();
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
      
      // Fetch recent posts for sidebar
      const recentPostsResponse = await blogService.getLatestPosts(5);
      if (recentPostsResponse.success && recentPostsResponse.data) {
        setRecentPosts(recentPostsResponse.data);
      }
    } catch (err) {
      console.error("Error fetching blog data:", err);
      setError("Could not load blog posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <HomeSlider />
      <BlogHeader title="Blog của chúng tôi " />
      <BlogFeaturedSection />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Main content */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-xl font-semibold">Loading posts...</div>
              </div>
            ) : error ? (
              <div className="bg-red-100 p-4 rounded-lg text-red-700">
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <h3 className="font-bold text-xl mb-2">No Posts Found</h3>
                <p>There are currently no blog posts available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <img 
                       src={`http://localhost:5000/public/${post.coverImage}` || "/images/blog/default.jpg"} 
                      alt={post.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-100 rounded-full mb-2">
                        {post.category.name}
                      </span>
                      <h3 className="text-xl font-bold mb-2">
                        <a href={`/blog/${post.slug}`} className="hover:text-primary-600 transition">
                          {post.title}
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          {new Date(post.publishDate).toLocaleDateString()} • {post.readTime} min read
                        </span>
                        <a 
                          href={`/blog/${post.slug}`} 
                          className="text-primary-600 font-medium hover:underline"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && !error && totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <BlogSidebar
              categories={categories}
              recentPosts={recentPosts}
              tags={tags}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;