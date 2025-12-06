"use client";

import { useState } from "react";
import { ArrowLeft, User, Heart, GraduationCap, ChatCircleDots, Star, CheckCircle, Envelope } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface Mentor {
  id: string;
  name: string;
  year: string;
  major: string;
  bio: string;
  specialties: string[];
  availability: string;
  rating: number;
  totalSessions: number;
  image: string;
}

export default function MentorsPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const mentors: Mentor[] = [
    {
      id: "1",
      name: "Priya S.",
      year: "3rd Year",
      major: "Psychology",
      bio: "I've been through anxiety and academic stress. I'm here to listen without judgment and help you find your path.",
      specialties: ["Anxiety", "Academic Stress", "Time Management"],
      availability: "Evenings (6-9 PM)",
      rating: 4.9,
      totalSessions: 45,
      image: "PS",
    },
    {
      id: "2",
      name: "Rahul M.",
      year: "4th Year",
      major: "Computer Science",
      bio: "Struggled with imposter syndrome and burnout. I understand the pressure and can help you balance studies and wellbeing.",
      specialties: ["Burnout", "Imposter Syndrome", "Work-Life Balance"],
      availability: "Weekends (2-6 PM)",
      rating: 4.8,
      totalSessions: 38,
      image: "RM",
    },
    {
      id: "3",
      name: "Ananya K.",
      year: "2nd Year",
      major: "Literature",
      bio: "Experienced with social anxiety and finding your place in college. Happy to talk about friendships and self-confidence.",
      specialties: ["Social Anxiety", "Self-Esteem", "Relationships"],
      availability: "Afternoons (2-5 PM)",
      rating: 5.0,
      totalSessions: 52,
      image: "AK",
    },
    {
      id: "4",
      name: "Arjun P.",
      year: "3rd Year",
      major: "Engineering",
      bio: "Dealt with depression and found healthy coping strategies. I can help you navigate tough times and find support.",
      specialties: ["Depression", "Coping Skills", "Stress Management"],
      availability: "Mornings (9-12 PM)",
      rating: 4.7,
      totalSessions: 31,
      image: "AP",
    },
    {
      id: "5",
      name: "Meera T.",
      year: "4th Year",
      major: "Business",
      bio: "Overcame academic pressure and perfectionism. Let's talk about setting healthy boundaries and realistic goals.",
      specialties: ["Perfectionism", "Goal Setting", "Academic Pressure"],
      availability: "Evenings (7-10 PM)",
      rating: 4.9,
      totalSessions: 42,
      image: "MT",
    },
    {
      id: "6",
      name: "Karan D.",
      year: "2nd Year",
      major: "Medicine",
      bio: "Experienced with exam anxiety and sleep issues. I can share strategies that helped me succeed while staying healthy.",
      specialties: ["Exam Anxiety", "Sleep Problems", "Study Techniques"],
      availability: "Late Nights (9-11 PM)",
      rating: 4.6,
      totalSessions: 28,
      image: "KD",
    },
  ];

  const specialtyFilters = [
    "all",
    "Anxiety",
    "Depression",
    "Academic Stress",
    "Social Anxiety",
    "Burnout",
    "Relationships",
  ];

  const filteredMentors =
    selectedFilter === "all"
      ? mentors
      : mentors.filter((mentor) => mentor.specialties.includes(selectedFilter));

  const handleRequestMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleSendRequest = () => {
    // Here you would typically send the request to your backend
    alert(`Mentorship request sent to ${selectedMentor?.name}! They'll get back to you within 24 hours.`);
    setSelectedMentor(null);
  };

  // Request Modal
  if (selectedMentor) {
    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setSelectedMentor(null)}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" weight="bold" />
          <span>Back to Mentors</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-2xl font-bold mb-4">
              {selectedMentor.image}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Request Mentorship from {selectedMentor.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedMentor.year} • {selectedMentor.major}
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                What to Expect
              </h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Your mentor will reach out within 24 hours to schedule an initial meeting</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" weight="fill" />
                  <span>Sessions are typically 30-45 minutes and can be in-person or virtual</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" weight="fill" />
                  <span>All conversations are confidential and peer-to-peer</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" weight="fill" />
                  <span>You can meet as often as you both agree (typically weekly or bi-weekly)</span>
                </li>
              </ul>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Introduce Yourself (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                placeholder="Let your mentor know a bit about yourself and what you'd like support with..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedMentor(null)}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg text-white font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Envelope className="w-5 h-5" weight="bold" />
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Mentors Page
  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => router.push("/student/wellness/support")}
        className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" weight="bold" />
        <span>Back to Support</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <User className="w-8 h-8 text-white" weight="duotone" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Find a Peer Mentor
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with students who've been through similar experiences
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 mb-8 border border-emerald-200 dark:border-emerald-800">
        <h2 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5" weight="duotone" />
          About Peer Mentorship
        </h2>
        <p className="text-sm text-emerald-800 dark:text-emerald-300 mb-3">
          Our peer mentors are trained students who have personal experience with mental health challenges. They're here to offer support, understanding, and guidance from a peer perspective.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-emerald-800 dark:text-emerald-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" weight="fill" />
            <span>All mentors completed mental health training</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" weight="fill" />
            <span>Completely free and voluntary</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0" weight="fill" />
            <span>Flexible meeting times and formats</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Filter by Specialty:
        </h3>
        <div className="flex flex-wrap gap-2">
          {specialtyFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFilter === filter
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {filter === "all" ? "All Mentors" : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
          >
            {/* Mentor Avatar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {mentor.image}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {mentor.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {mentor.year} • {mentor.major}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(mentor.rating)
                        ? "text-yellow-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    weight="fill"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {mentor.rating}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({mentor.totalSessions} sessions)
              </span>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {mentor.bio}
            </p>

            {/* Specialties */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Specialties:
              </p>
              <div className="flex flex-wrap gap-2">
                {mentor.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <GraduationCap className="w-4 h-4" weight="duotone" />
              <span>{mentor.availability}</span>
            </div>

            {/* Connect Button */}
            <button
              onClick={() => handleRequestMentor(mentor)}
              className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg text-white font-medium transition-all flex items-center justify-center gap-2"
            >
              <ChatCircleDots className="w-5 h-5" weight="duotone" />
              Request as Mentor
            </button>
          </div>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No mentors found for this specialty. Try a different filter.
          </p>
        </div>
      )}

      {/* Become a Mentor CTA */}
      <div className="mt-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Want to Become a Peer Mentor?</h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          If you've overcome mental health challenges and want to help others, consider joining our peer mentor program. Training provided!
        </p>
        <button className="px-8 py-3 bg-white text-brand-primary rounded-xl font-semibold hover:shadow-lg transition-all">
          Learn More About Mentorship
        </button>
      </div>
    </div>
  );
}
