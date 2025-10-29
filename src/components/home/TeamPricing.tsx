"use client";

import { User } from "lucide-react";

export default function TeamPricing() {
  const plans = [
    {
      title: "Solo",
      price: "Rs 100/-",
      icon: <User size={56} className="text-gray-300" />,
    },
    {
      title: "Duo",
      price: "Rs 180/-",
      icon: (
        <div className="relative">
          <User size={56} className="text-gray-300" />
          <User
            size={56}
            className="text-gray-300 absolute -right-6 top-3 opacity-80"
          />
        </div>
      ),
    },
    {
      title: "Trio",
      price: "Rs 250/-",
      icon: (
        <div className="relative">
          <User size={56} className="text-gray-300" />
          <User
            size={56}
            className="text-gray-300 absolute -right-6 top-3 opacity-80"
          />
          <User
            size={56}
            className="text-gray-300 absolute -left-6 top-3 opacity-80"
          />
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col md:flex-row justify-center items-center gap-10 py-10">
      {plans.map(({ title, price, icon }) => (
        <div
          key={title}
          className="flex flex-col items-center justify-center w-100 h-44 px-10 py-6 
                     rounded-2xl border-2 border-orange-500 bg-[#1a1a1a] text-white 
                     hover:scale-105 transition-transform duration-200"
        >
          <div className="mb-3 flex items-center justify-center">{icon}</div>
          <h2 className="mb-1 text-3xl font-semibold">{title}</h2>
          <p className="text-orange-500 text-2xl font-bold forced-colors:">
            {price}
          </p>
        </div>
      ))}
    </section>
  );
}
