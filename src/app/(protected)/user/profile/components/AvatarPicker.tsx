"use client";
import { useState } from "react";

export default function AvatarPicker() {
  const [preview, setPreview] = useState("/avatar-placeholder.png");

  return (
    <label className="relative cursor-pointer">
      <img
        src={preview}
        className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
        alt="Profile"
      />

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setPreview(URL.createObjectURL(file));
          }
        }}
      />
    </label>
  );
}
