import React from "react";
import { Link } from "react-router-dom";
import { BlogPost, BlogCategory } from "../../../types/blog";
import { formatDate } from "~/utils/formatters";

interface BlogSidebarProps {
  categories: BlogCategory[];
  recentPosts: BlogPost[];
  tags?: string[];
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  categories,
  recentPosts,
  tags = [],
}) => {
  return (
    <div className="space-y-8">
   

      {/* Categories */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-xl font-bold">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category._id}>
              <Link
                to={`/blog/category/${category.slug}`}
                className="hover:text-primary-500 flex items-center justify-between transition-colors"
              >
                <span>{category.name}</span>
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {category.postCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Posts */}
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-xl font-bold">Recent Posts</h3>
        <ul className="space-y-4">
          {recentPosts.map((post) => (
            <li key={post._id} className="flex space-x-3">
              <div className="h-16 w-16 flex-shrink-0">
                <img
                  src={`http://localhost:5000/public/${post.coverImage}` || "/images/blog/default.jpg"}

                  alt={post.title}
                  className="h-full w-full rounded object-cover"
                />
              </div>
              <div className="flex-1">
                <Link
                  to={`/blog/${post.slug}`}
                  className="hover:text-primary-500 line-clamp-2 font-medium transition-colors"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500">{ formatDate(post.publishDate)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog/tag/${tag}`}
                className="hover:bg-primary-100 hover:text-primary-600 rounded-full bg-gray-100 px-3 py-1 text-sm transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSidebar;
