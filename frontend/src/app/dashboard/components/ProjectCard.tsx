"use client";

import React from "react";
import { Edit, Trash2, Users } from "lucide-react";

export default function ProjectCard({ job }: { job: any }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <span className="text-sm text-gray-500">{job.category}</span>
      </div>
      <p className="text-gray-600">{job.description}</p>
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Budget: Rp{job.budget.toLocaleString()}</span>
        <span>{job.location}</span>
      </div>
      <div className="flex justify-end gap-2">
        <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
          <Users size={16} /> See Applicants
        </button>
        <button className="text-green-600 hover:underline text-sm flex items-center gap-1">
          <Edit size={16} /> Edit
        </button>
        <button className="text-red-600 hover:underline text-sm flex items-center gap-1">
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}
