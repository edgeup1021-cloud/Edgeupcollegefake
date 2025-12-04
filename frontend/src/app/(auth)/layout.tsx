"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden">
      {/* Left side - Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-dark via-brand-primary/90 to-brand-secondary relative overflow-hidden">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-60"
          animate={{
            background: [
              "linear-gradient(45deg, #0d1e2d 0%, #10ac8b 50%, #10ac8b 100%)",
              "linear-gradient(90deg, #10ac8b 0%, #0d1e2d 50%, #10ac8b 100%)",
              "linear-gradient(135deg, #10ac8b 0%, #10ac8b 50%, #0d1e2d 100%)",
              "linear-gradient(45deg, #0d1e2d 0%, #10ac8b 50%, #10ac8b 100%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-10 w-16 h-16 rounded-full bg-brand-secondary/20 backdrop-blur-sm"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Geometric decoration SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full h-auto opacity-10"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M100 350 L200 150 L300 350"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.circle
            cx="200"
            cy="120"
            r="8"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={logo}
                alt="EdgeUp"
                width={220}
                height={66}
                className="mb-6"
                priority
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.5))',
                }}
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text"
            >
              Welcome to Your Future
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-white/90 max-w-md leading-relaxed"
            >
              Access your personalized learning experience, track progress, and achieve your academic goals.
            </motion.p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 mt-8"
          >
            {[
              { text: "Smart learning assistant", icon: "🤖" },
              { text: "Career placement guidance", icon: "🎯" },
              { text: "Progress tracking & analytics", icon: "📊" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 group cursor-default"
              >
                <motion.div
                  className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-lg border border-white/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <span className="text-white/90 group-hover:text-white transition-colors">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex gap-8 mt-16"
          >
            {[
              { value: "10K+", label: "Students" },
              { value: "500+", label: "Teachers" },
              { value: "98%", label: "Success Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right side - Form area with glassmorphism */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 relative">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/10 dark:bg-brand-secondary/5 rounded-full blur-3xl" />

        {/* Mobile header - only show on small screens */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:hidden absolute top-0 left-0 right-0 p-6 bg-gradient-to-r from-brand-dark to-brand-primary shadow-lg z-50"
        >
          <Image src={logo} alt="EdgeUp" width={150} height={45} />
        </motion.div>

        {/* Glassmorphism card container */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mt-16 lg:mt-0 relative"
        >
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 sm:p-10 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 dark:from-brand-primary/10 dark:to-brand-secondary/10 pointer-events-none rounded-3xl" />

            {/* Content */}
            <div className="relative z-10">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
