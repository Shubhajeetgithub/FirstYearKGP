import React from "react";

interface LoaderProps {
  /** Spinner width and height in px. */
  size?: number;
  text?: string;
}

export default function Loader({ size = 48, text = "Loading..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`animate-spin rounded-full border-4 border-t-transparent border-blue-500`}
        style={{ width: size, height: size }}
      />
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  );
}
