import React from "react";

import FeaturesSection from "~/components/sections/home/FeaturesSection";
import AboutSection from "~/components/sections/home/AboutSection";
import ServicesSection from "~/components/sections/home/ServicesSection";
import TestimonialsSection from "~/components/sections/home/TestimonialsSection";
import BlogPreviewSection from "~/components/sections/home/BlogPreviewSection";
import CallToActionSection from "~/components/sections/home/CallToActionSection";

import HomeSlider from "~/components/sections/home/HomeSlider";
import { Helmet } from "react-helmet-async";
const Home: React.FC = () => {
  return (
    <div>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <HomeSlider />
      <FeaturesSection />
      <AboutSection />
      <ServicesSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <CallToActionSection />
    </div>
  );
};

export default Home;
