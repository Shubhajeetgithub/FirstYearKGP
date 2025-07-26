import React from "react";

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
};

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-4',
  lg: 'w-12 h-12 border-[6px]',
};

export default function Loader({ size = 'md', text = 'Loading...' }: Readonly<LoaderProps>) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeMap[size]}`}
      />
      <span className="text-gray-600 text-sm">{text}</span>
    </div>
  );
}
