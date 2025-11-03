"use client";
import React from "react";

interface ProjectCardProps {
  project: any;
  isCompany: boolean;
}

export default function ProjectCard({ project, isCompany }: ProjectCardProps) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {project.title} ({project.type})
        </h2>
        <span className="text-sm font-medium">{project.status}</span>
      </div>
      <p className="text-sm text-gray-600">{project.description}</p>
      <p className="text-sm text-gray-500">Created at: {new Date(project.createdAt).toLocaleDateString()}</p>

      {/* Applicant List (Company only) */}
      {isCompany && project.applications?.length > 0 && (
        <div className="mt-2">
          <h3 className="font-medium">Applicants:</h3>
          <ul className="text-sm">
            {project.applications.map((a: any) => (
              <li key={a.id}>
                {a.freelancer?.name || "Unknown"} - {a.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
