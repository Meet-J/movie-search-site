import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-[#0F0D23] p-5 rounded-2xl border border-white/5 animate-pulse">
      <div className="w-full h-[270px] bg-[#1a1124] rounded-lg mb-4" />
      <div className="h-5 bg-[#1a1124] rounded w-3/4 mb-3" />
      <div className="flex items-center gap-2">
        <div className="h-4 bg-[#1a1124] rounded w-10" />
        <div className="h-3 w-3 bg-[#1a1124] rounded-full" />
        <div className="h-4 bg-[#1a1124] rounded w-8" />
        <div className="h-3 w-3 bg-[#1a1124] rounded-full" />
        <div className="h-4 bg-[#1a1124] rounded w-12" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export const SkeletonRow = ({ count = 5 }) => {
  return (
    <div className="flex flex-row overflow-x-auto gap-6 hide-scrollbar py-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="min-w-[200px] h-[260px] bg-[#0F0D23] rounded-xl p-4 border border-white/5 animate-pulse flex flex-col justify-between">
          <div className="w-full h-[190px] bg-[#1a1124] rounded-lg mb-2" />
          <div className="h-4 bg-[#1a1124] rounded w-2/3" />
        </div>
      ))}
    </div>
  );
};
