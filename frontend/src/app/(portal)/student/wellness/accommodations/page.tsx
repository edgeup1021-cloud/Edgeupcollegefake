"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle, ClipboardText, FileText, Question, CaretDown, CaretUp, Envelope } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function AccommodationsPage() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const accommodationTypes = [
    {
      category: "Testing Accommodations",
      icon: ClipboardText,
      color: "from-blue-500 to-cyan-500",
      items: [
        {
          name: "Extended Time",
          description: "Additional time (typically 1.5x or 2x) for exams and quizzes",
          eligibility: "Documented anxiety, ADHD, learning disabilities, or other conditions that affect test-taking speed",
        },
        {
          name: "Reduced Distraction Environment",
          description: "Take exams in a quiet, separate room away from other students",
          eligibility: "Anxiety disorders, ADHD, sensory processing issues, or autism spectrum",
        },
        {
          name: "Flexible Exam Scheduling",
          description: "Take exams at different times or over multiple days if needed",
          eligibility: "Severe anxiety, chronic health conditions, or conflicting accommodations",
        },
        {
          name: "Use of Assistive Technology",
          description: "Screen readers, speech-to-text software, or calculators during exams",
          eligibility: "Visual impairments, dyslexia, dyscalculia, or motor impairments",
        },
      ],
    },
    {
      category: "Attendance & Participation",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      items: [
        {
          name: "Flexible Attendance Policy",
          description: "Excused absences for mental health episodes or treatment appointments",
          eligibility: "Chronic mental health conditions, ongoing therapy, or episodic conditions",
        },
        {
          name: "Alternative Participation Methods",
          description: "Written submissions instead of in-class presentations or verbal participation",
          eligibility: "Social anxiety, selective mutism, or speech disorders",
        },
        {
          name: "Recorded Lectures",
          description: "Access to lecture recordings to review or catch up on missed classes",
          eligibility: "Attention deficits, memory issues, or frequent medical appointments",
        },
      ],
    },
    {
      category: "Assignment Accommodations",
      icon: FileText,
      color: "from-emerald-500 to-teal-500",
      items: [
        {
          name: "Extended Deadlines",
          description: "Additional time to complete assignments when experiencing mental health challenges",
          eligibility: "Depression, anxiety, PTSD, or other episodic conditions",
        },
        {
          name: "Note-Taking Assistance",
          description: "Access to class notes from a peer note-taker or recording device",
          eligibility: "ADHD, learning disabilities, or conditions affecting concentration",
        },
        {
          name: "Alternative Assignment Formats",
          description: "Options to complete assignments in different formats (audio, video, written)",
          eligibility: "Learning disabilities, anxiety, or creative expression difficulties",
        },
      ],
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Get Documentation",
      description: "Obtain documentation from a licensed mental health professional (therapist, psychiatrist, or counselor) that describes your condition and recommended accommodations.",
      tip: "Campus counseling can provide this documentation if you're receiving treatment through them.",
    },
    {
      step: 2,
      title: "Submit Request",
      description: "Fill out the accommodation request form and submit it along with your documentation to the Office of Disability Services.",
      tip: "You can submit your request online or schedule an in-person appointment.",
    },
    {
      step: 3,
      title: "Meet with Coordinator",
      description: "You'll meet with an accommodation coordinator to discuss your needs and determine appropriate accommodations.",
      tip: "Be honest about your challenges and what helps you succeed academically.",
    },
    {
      step: 4,
      title: "Receive Accommodation Letter",
      description: "Once approved, you'll receive an official accommodation letter to share with your professors each semester.",
      tip: "You control who sees your accommodation letter - it's your choice to use it.",
    },
  ];

  const faqs = [
    {
      question: "Will my professors know my diagnosis?",
      answer: "No. Your accommodation letter only states what accommodations you're entitled to, not your specific diagnosis or medical details. Your privacy is protected.",
    },
    {
      question: "What if I'm not officially diagnosed?",
      answer: "You'll need documentation from a licensed professional. If you don't have a formal diagnosis yet, campus counseling can help with assessment and documentation.",
    },
    {
      question: "Can I get accommodations mid-semester?",
      answer: "Yes! While it's better to register early, you can apply for accommodations at any time. However, they typically won't apply retroactively to past assignments.",
    },
    {
      question: "Will accommodations appear on my transcript?",
      answer: "No. Accommodations are completely confidential and will never appear on your transcript or academic record.",
    },
    {
      question: "Do I need to use all my accommodations every time?",
      answer: "No. You can choose when and how to use your accommodations. They're tools available to you when you need them.",
    },
    {
      question: "What if a professor refuses my accommodations?",
      answer: "Accommodations are legally required under the ADA. Contact the Office of Disability Services immediately, and they will work with your professor to ensure compliance.",
    },
  ];

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
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
            <BookOpen className="w-8 h-8 text-white" weight="duotone" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Academic Accommodations
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Support for students with mental health conditions
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
        <h2 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
          Your Right to Accommodations
        </h2>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
          Under the Americans with Disabilities Act (ADA) and Section 504, students with documented mental health conditions are entitled to reasonable academic accommodations. These are designed to provide equal access to education, not to give you an unfair advantage.
        </p>
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Remember:</strong> Using accommodations is not "cheating" or "taking the easy way out" - it's leveling the playing field so you can demonstrate your true academic abilities.
        </p>
      </div>

      {/* Types of Accommodations */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Types of Accommodations
        </h2>
        <div className="space-y-6">
          {accommodationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.category}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${type.color}`}>
                    <Icon className="w-6 h-6 text-white" weight="duotone" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {type.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {type.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" weight="fill" />
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        <strong>Common eligibility:</strong> {item.eligibility}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How to Apply */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          How to Apply for Accommodations
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {processSteps.map((step) => (
            <div
              key={step.step}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {step.description}
                  </p>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                      <strong>Tip:</strong> {step.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Question className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" weight="duotone" />
                  <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                </div>
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

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Apply?</h2>
          <p className="text-white/90 mb-6">
            Contact the Office of Disability Services to start the accommodation process. They're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:disability-services@college.edu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-primary rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <Envelope className="w-5 h-5" weight="bold" />
              Email Disability Services
            </a>
            <button
              onClick={() => router.push("/student/wellness/booking")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              Schedule Appointment
            </button>
          </div>
          <p className="mt-6 text-sm text-white/80">
            Office Hours: Monday-Friday, 9 AM - 5 PM • Building B, Room 104 • (XXX) XXX-XXXX
          </p>
        </div>
      </div>
    </div>
  );
}
