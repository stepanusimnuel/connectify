"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PopularService from "@/components/landing/PopularService";
import AboutUs from "@/components/landing/AboutUs";
import Freelancing from "@/components/landing/Freelancing";
import TopWorkers from "@/components/landing/TopWorkers";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import Blog from "@/components/landing/Blog";
import Footer from "@/components/landing/Footer";

const LandingPage: React.FC = () => {
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
