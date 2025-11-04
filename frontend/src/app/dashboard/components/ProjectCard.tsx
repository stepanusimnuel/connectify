"use client";
import React from "react";
import Link from "next/link";
import { truncateText } from "@/app/utils/helper";

interface ProjectCardProps {
  project: any;
  isCompany: boolean;
}

export default function ProjectCard({ project, isCompany }: ProjectCardProps) {
  let status_style;
  if (project.status === "OPEN") status_style = "bg-blue-400";
  else if (project.status === "ONGOING") status_style = "bg-yellow-400";
  else if (project.status === "COMPLETED") status_style = "bg-green-400";
  else if (project.status === "CLOSED") status_style = "bg-red-400";
  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-3 h-60 flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {project.title} ({project.type})
        </h2>
        <span className={`text-sm font-medium text-white  py-2 w-1/4 rounded text-center ${status_style}`}>{project.status}</span>
      </div>

      <p className="text-sm text-gray-600 grow">{truncateText(project.description, 5)}</p>

      <p className="text-sm text-gray-500 text-end">Created at: {new Date(project.createdAt).toLocaleDateString()}</p>

      <Link href={isCompany ? `/dashboard/company/my-projects/${project.id}` : `/dashboard/freelancer/my-projects/${project.id}`} className="text-white w-full py-2 text-center bg-black rounded-md mt-auto hover:bg-black/90 transition">
        View Detail
      </Link>
    </div>
  );
}
