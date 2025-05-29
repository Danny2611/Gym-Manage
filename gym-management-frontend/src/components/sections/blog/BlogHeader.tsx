import React from "react";
import SectionTitle from "../../common/SectionTitle";

interface BlogHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: string;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  title,
  subtitle,
  alignment,
}) => {
  return (
    <div className="mt-36 bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={title}
          subtitle={
            subtitle ||
            "Cập nhật những mẹo thể hình, tin tức và câu chuyện mới nhất từ chúng tôi"
          }
          alignment={"center"}
        />
      </div>
    </div>
  );
};

export default BlogHeader;
