"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lifebuoy,
  Phone,
  ChatCircleDots,
  Warning,
  CalendarPlus,
  Lightbulb,
  Heart,
  Users,
  BookOpen,
  Headphones,
  Brain,
  FirstAid,
  Question,
  CaretDown,
  CaretUp,
  ArrowRight,
  CheckCircle,
} from "@phosphor-icons/react";

export default function SupportPage() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Handler functions for button actions
  const handleCallCounseling = () => {
    // Try to open phone dialer if on mobile
    if (typeof window !== 'undefined') {
      const phone = '+919820466726'; // Campus counseling number
      window.location.href = `tel:${phone}`;
    }
  };

  const handleBookAppointment = () => {
    router.push('/student/wellness/booking');
  };

  const handleStartChat = () => {
    router.push('/student/wellness/peer-chat');
  };

  const handleFindMentor = () => {
    router.push('/student/wellness/mentors');
  };

  const handleJoinGroup = () => {
    router.push('/student/wellness/groups');
  };

  const handleVisitForum = () => {
    router.push('/student/wellness/forum');
  };

  const handleLearnAccommodations = () => {
    router.push('/student/wellness/accommodations');
  };

  const handleScheduleAcademicCounseling = () => {
    router.push('/student/wellness/booking');
  };

  const faqs = [
    {
      question: "Is counseling completely confidential?",
      answer: "Yes! All counseling sessions are completely confidential. Information shared with your counselor will not be disclosed to anyone without your explicit consent, except in rare cases where there's a risk of harm to yourself or others. Your privacy and trust are our top priorities."
    },
    {
      question: "How much does counseling cost?",
      answer: "Campus counseling services are completely free for all enrolled students. There are no charges for individual sessions, group therapy, or crisis support. We believe mental health support should be accessible to everyone."
    },
    {
      question: "What if I'm not sure I need counseling?",
      answer: "You don't need to be in crisis to seek support! Many students talk to counselors about everyday stress, academic pressure, relationship issues, or just need someone to listen. If you're unsure, you can always book an initial consultation to explore what counseling can offer you."
    },
    {
      question: "Can I bring a friend to my first appointment?",
      answer: "Absolutely! If having a trusted friend nearby makes you more comfortable, you can bring them to your first appointment. They can wait in the reception area or join you for the initial introduction if you'd like. After that, sessions are typically one-on-one."
    },
    {
      question: "What happens in the first counseling session?",
      answer: "Your first session is about getting to know each other. Your counselor will ask about what brought you in, your goals, and your background. You'll discuss confidentiality, ask any questions you have, and together decide on next steps. There's no pressure to share more than you're comfortable with."
    },
    {
      question: "What if I'm worried about stigma?",
      answer: "Taking care of your mental health is a sign of strength, not weakness. Just like you'd see a doctor for a physical illness, seeing a counselor for mental health is normal and healthy. Many successful students and professionals work with counselors. Your decision to seek support shows self-awareness and courage."
    },
    {
      question: "How quickly can I get an appointment?",
      answer: "We strive to schedule initial appointments within 3-5 business days. For urgent situations, same-day or next-day crisis appointments are available. If you're in immediate distress, please call our crisis hotline or visit the counseling center during walk-in hours."
    },
    {
      question: "Can I choose my counselor?",
      answer: "Yes! If you have a preference based on gender, cultural background, or areas of specialization, let us know when booking. While we can't always guarantee a specific counselor, we'll do our best to match you with someone who suits your needs."
    },
  ];

  const selfHelpResources = [
    {
      title: "Mood Tracker",
      description: "Track your daily mood patterns and identify triggers",
      icon: Heart,
      link: "/student/wellness/dashboard",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Breathing Exercises",
      description: "Guided relaxation and stress-relief techniques",
      icon: Brain,
      link: "/student/wellness/mood-booster",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Wellness Assessments",
      description: "Take validated mental health screenings",
      icon: FirstAid,
      link: "/student/wellness/self-assessment",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Mental Health Apps",
      description: "Recommended apps for mindfulness and wellbeing",
      icon: Headphones,
      link: "#apps",
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const externalResources = [
    {
      name: "AASRA (All Ages Suicide Prevention Helpline)",
      phone: "9820466726",
      description: "24/7 crisis support and suicide prevention",
      timing: "24/7",
    },
    {
      name: "Vandrevala Foundation",
      phone: "1860 2662 345 / 1800 2333 330",
      description: "Free mental health support and counseling",
      timing: "24/7",
    },
    {
      name: "iCall Psychosocial Helpline",
      phone: "9152987821",
      description: "Professional counseling by trained psychologists",
      timing: "Mon-Sat, 8 AM - 10 PM",
    },
    {
      name: "NIMHANS Helpline (Bangalore)",
      phone: "080-46110007",
      description: "Psychiatric and psychological support",
      timing: "Mon-Sat, 9 AM - 5:30 PM",
    },
  ];

  const recommendedApps = [
    {
      name: "Headspace",
      description: "Meditation and mindfulness for stress relief",
      category: "Meditation",
    },
    {
      name: "Calm",
      description: "Sleep stories, meditation, and relaxation",
      category: "Sleep & Relaxation",
    },
    {
      name: "Wysa",
      description: "AI chatbot for emotional support and CBT techniques",
      category: "Mental Health",
    },
    {
      name: "Youper",
      description: "Mood tracking and personalized therapy exercises",
      category: "Therapy",
    },
    {
      name: "Sanvello",
      description: "Tools for stress, anxiety, and depression",
      category: "Mental Health",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Emergency Banner - Always Visible */}
      <div className="sticky top-0 z-20 bg-red-600 dark:bg-red-700 text-white p-4 rounded-2xl shadow-lg border-2 border-red-700 dark:border-red-600">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Warning className="w-6 h-6 flex-shrink-0" weight="fill" />
            <div>
              <h3 className="font-bold text-lg">In Crisis? Get Immediate Help</h3>
              <p className="text-sm text-red-100">
                AASRA 24/7: <a href="tel:9820466726" className="font-bold hover:underline">9820466726</a> • Vandrevala: <a href="tel:18602662345" className="font-bold hover:underline">1860 2662 345</a>
              </p>
            </div>
          </div>
          <a
            href="#crisis-resources"
            className="px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors whitespace-nowrap"
          >
            Emergency Resources
          </a>
        </div>
      </div>

      {/* Page Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 mb-4">
          <Lifebuoy className="w-8 h-8 text-white" weight="duotone" />
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Support & Resources
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          You're not alone. Explore our comprehensive support options and find the help that's right for you.
        </p>
      </div>

      {/* Quick Actions - Mirror Dashboard */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Campus Counseling */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 w-fit mb-4">
            <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" weight="duotone" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Campus Counseling
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Professional counselors available Mon-Fri, 9 AM - 5 PM
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCallCounseling}
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Call Now
            </button>
            <button
              onClick={handleBookAppointment}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <CalendarPlus className="w-4 h-4" weight="bold" />
              Book
            </button>
          </div>
        </div>

        {/* Peer Support */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 w-fit mb-4">
            <ChatCircleDots className="w-6 h-6 text-emerald-600 dark:text-emerald-400" weight="duotone" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Peer Support Chat
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Anonymous chat with trained peer supporters
          </p>
          <button
            onClick={handleStartChat}
            className="w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
          >
            Start Chat
          </button>
        </div>

        {/* Crisis Support */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 shadow-sm border-2 border-red-200 dark:border-red-800 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 w-fit mb-4">
            <Warning className="w-6 h-6 text-red-600 dark:text-red-400" weight="fill" />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Crisis Resources
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            24/7 emergency support and hotlines
          </p>
          <a
            href="#crisis-resources"
            className="block w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors text-center"
          >
            View Resources
          </a>
        </div>
      </div>

      {/* Campus Counseling Services - Detailed */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <Phone className="w-6 h-6 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Campus Counseling Services
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Professional, confidential support from trained counselors
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
              What We Offer
            </h3>
            <ul className="space-y-2">
              {[
                "Individual counseling sessions",
                "Group therapy and support groups",
                "Crisis intervention and support",
                "Academic stress management",
                "Relationship and family counseling",
                "Anxiety and depression support",
                "Stress and coping skills workshops",
                "Referrals to specialized services",
              ].map((service, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" weight="fill" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
              How to Book an Appointment
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Call or Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Contact counseling services at <span className="font-medium">+91-XXX-XXXX-XXX</span> or <span className="font-medium">counseling@college.edu</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Schedule Your Visit</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose a time that works for you. Initial appointments typically within 3-5 days
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Attend Your Session</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Visit our counseling center at Building A, Room 205. Bring your student ID
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Walk-in Hours
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Monday - Friday:</strong> 9:00 AM - 12:00 PM<br />
                No appointment needed for brief consultations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Resources Section */}
      <div id="crisis-resources" className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-3xl p-8 shadow-sm border-2 border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
            <Warning className="w-6 h-6 text-white" weight="fill" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              24/7 Crisis Support
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Immediate help available anytime, day or night
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {externalResources.map((resource, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {resource.name}
              </h3>
              <a
                href={`tel:${resource.phone.replace(/\s/g, '')}`}
                className="text-2xl font-bold text-red-600 dark:text-red-400 hover:underline mb-2 block"
              >
                {resource.phone}
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {resource.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                {resource.timing}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-5 border border-red-300 dark:border-red-700">
          <h3 className="font-semibold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
            <Warning className="w-5 h-5" weight="fill" />
            When to Seek Emergency Help
          </h3>
          <ul className="text-sm text-red-800 dark:text-red-300 space-y-1">
            <li>• Thoughts of suicide or self-harm</li>
            <li>• Plans to hurt yourself or others</li>
            <li>• Severe panic attacks or anxiety</li>
            <li>• Feeling unable to cope or function</li>
            <li>• Experiencing psychotic symptoms (hallucinations, delusions)</li>
          </ul>
          <p className="text-xs text-red-700 dark:text-red-400 mt-3 font-medium">
            In life-threatening emergencies, call 112 (Emergency Services) or visit the nearest hospital emergency room.
          </p>
        </div>
      </div>

      {/* Peer Support Network */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
            <Users className="w-6 h-6 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Peer Support Network
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with fellow students who understand
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              Peer Mentors
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Trained student mentors who provide support, guidance, and a listening ear
            </p>
            <button
              onClick={handleFindMentor}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Find a Mentor →
            </button>
          </div>

          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              Support Groups
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Weekly group sessions for anxiety, depression, stress management, and more
            </p>
            <button
              onClick={handleJoinGroup}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Join a Group →
            </button>
          </div>

          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
              Online Community
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Anonymous forum to share experiences, ask questions, and find support
            </p>
            <button
              onClick={handleVisitForum}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Visit Forum →
            </button>
          </div>
        </div>
      </div>

      {/* Self-Help Resources */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
            <Lightbulb className="w-6 h-6 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Self-Help Tools & Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Take control of your wellbeing with these tools
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {selfHelpResources.map((resource, idx) => {
            const Icon = resource.icon;
            return (
              <a
                key={idx}
                href={resource.link}
                className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all group"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${resource.color} w-fit mb-3`}>
                  <Icon className="w-6 h-6 text-white" weight="duotone" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-brand-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resource.description}
                </p>
              </a>
            );
          })}
        </div>

        <div id="apps">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Recommended Mental Health Apps
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedApps.map((app, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {app.name}
                  </h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    {app.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {app.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Academic Support Integration */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-3xl p-8 shadow-sm border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <BookOpen className="w-6 h-6 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Academic & Wellness Support
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Mental health and academic success go hand in hand
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
              Academic Accommodations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              If you're struggling with mental health, you may be eligible for academic accommodations such as:
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Extended time on exams</li>
              <li>• Flexible attendance policies</li>
              <li>• Assignment deadline extensions</li>
              <li>• Note-taking assistance</li>
            </ul>
            <button
              onClick={handleLearnAccommodations}
              className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Learn About Accommodations →
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">
              Academic Counseling
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Get help with:
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Time management and study skills</li>
              <li>• Balancing academics with wellbeing</li>
              <li>• Test anxiety and exam stress</li>
              <li>• Academic goal setting</li>
            </ul>
            <button
              onClick={handleScheduleAcademicCounseling}
              className="mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Schedule Academic Counseling →
            </button>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
            <Question className="w-6 h-6 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Get answers to common questions about counseling
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                {expandedFAQ === idx ? (
                  <CaretUp className="w-5 h-5 text-gray-500 flex-shrink-0" weight="bold" />
                ) : (
                  <CaretDown className="w-5 h-5 text-gray-500 flex-shrink-0" weight="bold" />
                )}
              </button>
              {expandedFAQ === idx && (
                <div className="px-5 pb-5 text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl p-8 text-white text-center">
        <h2 className="font-display text-3xl font-bold mb-3">
          Not Sure Where to Start?
        </h2>
        <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
          Take our wellness assessment to get personalized recommendations and insights about your mental health.
        </p>
        <a
          href="/student/wellness/self-assessment"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-primary rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <span>Take Wellness Assessment</span>
          <ArrowRight className="w-5 h-5" weight="bold" />
        </a>
      </div>
    </div>
  );
}
