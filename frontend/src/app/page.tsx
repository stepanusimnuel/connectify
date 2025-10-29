// app/landing/page.tsx atau src/pages/landing.tsx
"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PopularService from "@/components/PopularService";
import AboutUs from "@/components/AboutUs";
import Freelancing from "@/components/Freelancing";
import TopWorkers from "@/components/TopWorkers";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Blog from "@/components/Blog";
import Footer from "@/components/Footer";

const LandingPage: React.FC = () => {
  const isLoggedIn = true; // nanti bisa diganti berdasarkan auth state
  const user = {
    name: "John Doe",
    image: "/client-icon.png",
  };
  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <Hero
        title="Find Your Freelancer!"
        subtitle="Connect with top talent from around the world in just a few clicks. Whether you need a designer, developer, or writer, our platform makes it easy to find skilled freelancers who bring your ideas to life—quickly, affordably, and professionally."
        imageSet={["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"]}
      />
      {/* Popular Services */}
      <PopularService
        title="Popular Services"
        services={[
          { name: "Website Development", image: "/popular-services/1.png" },
          { name: "Logo Design", image: "/popular-services/1.png" },
          { name: "Video Editing", image: "/popular-services/1.png" },
        ]}
      />
      {/* About Section */}
      <AboutUs title="Why Choose Connectify?" image="/about-us/1.png" />
      {/* Freelancing Section */}
      <Freelancing />
      {/* Top Workers */}
      <TopWorkers />
      {/* Testimonials */}
      <Testimonials title="See the review of our clients!" subtitle="Connectify is trusted by 10.000 users! Try them!" />
      {/* FAQ Section */}
      <FAQ title="Frequently Asked Questions" subtitle="Got more questions to ask? Contact us at connectify@gmail.com" />
      {/* Blog Section */}
      <Blog />
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default LandingPage;
