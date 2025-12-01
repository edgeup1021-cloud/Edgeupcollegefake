"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-dark relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-brand-primary/30" />

        {/* Geometric decoration */}
        <svg
          className="absolute bottom-0 left-0 w-full h-auto opacity-20"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Triangle outline */}
          <path
            d="M100 350 L200 150 L300 350"
            stroke="#10ac8b"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Inner triangle */}
          <path
            d="M140 320 L200 200 L260 320"
            stroke="#10ac8b"
            strokeWidth="1"
            fill="none"
          />
          {/* Circles */}
          <circle cx="200" cy="120" r="8" stroke="#10ac8b" strokeWidth="1.5" fill="none" />
          <circle cx="320" cy="280" r="12" stroke="#10ac8b" strokeWidth="1" fill="none" />
          <circle cx="80" cy="250" r="6" stroke="#10ac8b" strokeWidth="1" fill="none" />
          {/* Connecting lines */}
          <line x1="200" y1="128" x2="200" y2="150" stroke="#10ac8b" strokeWidth="1" />
          <line x1="100" y1="350" x2="60" y2="380" stroke="#10ac8b" strokeWidth="1" />
          <line x1="300" y1="350" x2="340" y2="380" stroke="#10ac8b" strokeWidth="1" />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo/Brand */}
          <div className="mb-8">
            <Image
              src={logo}
              alt="EdgeUp"
              width={200}
              height={60}
              className="mb-4"
              priority
            />
            <p className="text-xl text-white/90 max-w-md leading-relaxed">
              Access your personalized learning experience, track progress, and achieve your academic goals.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4 mt-8">
            {[
              "Smart learning assistant",
              "Career placement guidance",
              "Progress tracking & analytics",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-secondary" />
                <span className="text-white/80">{feature}</span>
              </div>
            ))}
          </div>

          {/* Dot indicators at bottom */}
          <div className="flex gap-2 mt-16">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === 0 ? "bg-brand-secondary" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-gray-900">
        {/* Mobile header - only show on small screens */}
        <div className="lg:hidden absolute top-0 left-0 right-0 p-6 bg-brand-dark">
          <Image
            src={logo}
            alt="EdgeUp"
            width={150}
            height={45}
          />
        </div>

        <div className="w-full max-w-md mt-16 lg:mt-0">{children}</div>
      </div>
    </div>
  );
}
