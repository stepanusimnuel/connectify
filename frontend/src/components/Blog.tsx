"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogs } from "@/data/blogs";

const Blog: React.FC = () => {
  return (
    <section className="w-full px-8 md:px-16 py-20 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-semibold text-[#282938]">Blog & Event</h2>
        <button className="flex items-center gap-2 text-[#282938] font-medium hover:underline transition-all">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Blog Cards */}
      <div className="flex flex-wrap justify-between gap-8">
        {blogs.slice(0, 3).map((blog, index) => (
          <div key={index} className="flex flex-col bg-white hover:scale-105 transition-transform w-[90%] sm:w-[45%] md:w-[30%] overflow-hidden rounded-t-md">
            {/* Image */}
            <div className="relative w-full h-48">
              <Image src={blog.image} alt={blog.title} fill className="object-cover" />
            </div>

            {/* Content */}
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-light text-[#282938] mb-3 pt-8">{blog.date}</span>
              <h3 className="text-lg font-medium text-[#282938] mb-4 line-clamp-2">{blog.title}</h3>

              <p className="text-xs text-[#282938] mb-8">{blog.description && blog.description.length > 100 ? `${blog.description.slice(0, 150)}...` : blog.description}</p>

              {/* Tombol View */}
              <Link href={blog.url} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center text-sm font-medium text-[#282938] hover:underline transition-colors">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Blog;
