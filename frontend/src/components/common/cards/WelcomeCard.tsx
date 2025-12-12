"use client";

import { GraduationCap } from "@phosphor-icons/react";

interface WelcomeCardProps {
  name: string;
  course: string;
  college: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function WelcomeCard({ name, course, college }: WelcomeCardProps) {
  const greeting = getGreeting();
  const firstName = name.split(" ")[0];

  return (
    <div className="bg-gradient-to-br from-brand-primary via-brand-dark to-brand-accent rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-brand-primary/20">
      {/* Animated background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-secondary/30 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10">
        {/* Greeting */}
        <p className="text-white/70 text-sm font-medium tracking-wide uppercase mb-1">
          {greeting}
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-white/80 text-base mb-8 max-w-md">
          Continue your learning journey with personalized resources and AI-powered assistance.
        </p>

        {/* Course info */}
        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6" weight="duotone" />
          </div>
          <div>
            <div className="font-semibold text-base">{course}</div>
            <div className="text-sm text-white/70">{college}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
