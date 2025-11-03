"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import axios from "axios";

export default function NewProjectModal({ companyId, onSuccess }: { companyId: number; onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    specialty: "",
    minSalary: 0,
    maxSalary: 0,
    location: "",
    type: "JOB",
    paymentAmount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post("/api/projects", { ...form, companyId });
    onSuccess();
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className="bg-blue-600 text-white px-4 py-2 rounded-xl">+ New Project</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-6 rounded-2xl w-96 -translate-x-1/2 -translate-y-1/2">
          <Dialog.Title className="font-semibold text-lg mb-4">Create Project</Dialog.Title>
          <input className="border p-2 mb-2 w-full" name="title" placeholder="Title" onChange={handleChange} />
          <input className="border p-2 mb-2 w-full" name="description" placeholder="Description" onChange={handleChange} />
          <select className="border p-2 mb-2 w-full" name="type" onChange={handleChange}>
            <option value="JOB">JOB</option>
            <option value="COURSE">COURSE</option>
          </select>
          <input className="border p-2 mb-2 w-full" name="location" placeholder="Location" onChange={handleChange} />
          <input className="border p-2 mb-2 w-full" name="paymentAmount" placeholder="Payment" type="number" onChange={handleChange} />
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded-xl w-full">
            Submit
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
