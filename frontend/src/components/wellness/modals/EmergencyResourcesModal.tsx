"use client";

import { X, Warning, Phone, ChatCircleDots, FirstAid, Globe } from "@phosphor-icons/react";

interface EmergencyResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyResourcesModal({ isOpen, onClose }: EmergencyResourcesModalProps) {
  if (!isOpen) return null;

  const emergencyResources = [
    {
      category: "Immediate Crisis Support",
      icon: Warning,
      color: "red",
      resources: [
        {
          name: "National Emergency Number",
          number: "112",
          description: "Single emergency number for all emergencies in India",
          action: "Call 112",
        },
        {
          name: "AASRA Suicide Prevention",
          number: "9820466726",
          description: "24/7 crisis support and suicide prevention (Mumbai)",
          action: "Call Now",
        },
        {
          name: "Vandrevala Foundation",
          number: "1860 2662 345 / 1800 2333 330",
          description: "Free 24/7 mental health support and crisis helpline",
          action: "Call Now",
        },
        {
          name: "Police Emergency",
          number: "100",
          description: "Immediate police assistance",
          action: "Call 100",
        },
        {
          name: "Ambulance Service",
          number: "102 / 108",
          description: "Emergency medical services",
          action: "Call Now",
        },
      ],
    },
    {
      category: "Mental Health Support",
      icon: FirstAid,
      color: "blue",
      resources: [
        {
          name: "iCall - TISS",
          number: "9152987821",
          description: "Psychosocial helpline (Mon-Sat, 8 AM - 10 PM)",
          action: "Call Now",
        },
        {
          name: "NIMHANS",
          number: "080-46110007",
          description: "Mental health helpline (10 AM - 8 PM)",
          action: "Call Now",
        },
        {
          name: "Sneha Foundation",
          number: "044-24640050",
          description: "24/7 emotional support helpline (Chennai)",
          action: "Call or Chat",
        },
        {
          name: "Mann Talks",
          number: "8686139139",
          description: "Mental health support (10 AM - 6 PM)",
          action: "Call or Text",
        },
      ],
    },
    {
      category: "Specialized Support",
      icon: Phone,
      color: "emerald",
      resources: [
        {
          name: "Women's Helpline",
          number: "181",
          description: "Support for women in distress",
          action: "Call 181",
        },
        {
          name: "Child Helpline",
          number: "1098",
          description: "Support for children in need",
          action: "Call 1098",
        },
        {
          name: "Senior Citizen Helpline",
          number: "14567",
          description: "Support for senior citizens",
          action: "Call Now",
        },
        {
          name: "iCALL Email Support",
          number: "icall@tiss.edu",
          description: "Email counseling support",
          action: "Send Email",
        },
      ],
    },
  ];

  const colorClasses = {
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      icon: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white",
    },
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full pointer-events-auto transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" weight="bold" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-red-100 dark:bg-red-900/50">
                <Warning className="w-6 h-6 text-red-600 dark:text-red-400" weight="fill" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                Emergency Resources
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If you're in crisis, help is available 24/7. You're not alone.
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {emergencyResources.map((category) => {
              const Icon = category.icon;
              const colors = colorClasses[category.color as keyof typeof colorClasses];

              return (
                <div key={category.category}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} weight="duotone" />
                    </div>
                    <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {category.resources.map((resource) => (
                      <div
                        key={resource.name}
                        className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {resource.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {resource.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Phone className={`w-4 h-4 ${colors.icon}`} weight="bold" />
                              <span className={`font-mono font-semibold ${colors.icon}`}>
                                {resource.number}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              // In a real app, this would initiate a call or open SMS
                              window.open(
                                resource.number.includes("988") || resource.number.includes("911")
                                  ? `tel:${resource.number.replace(/[^0-9]/g, "")}`
                                  : resource.number.startsWith("Text")
                                  ? `sms:741741&body=HOME`
                                  : `tel:${resource.number.replace(/[^0-9]/g, "")}`,
                                "_blank"
                              );
                            }}
                            className={`px-4 py-2 rounded-lg ${colors.button} font-medium text-sm transition-colors whitespace-nowrap`}
                          >
                            {resource.action}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Additional Resources */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-brand-primary" weight="duotone" />
                <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                  Online Resources
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href="https://www.nimhans.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-brand-primary transition-all"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    NIMHANS
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    National Institute of Mental Health and Neurosciences
                  </p>
                </a>
                <a
                  href="https://www.tiss.edu/view/11/projects/icall/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-brand-primary transition-all"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    iCall - TISS
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Psychosocial counseling and support
                  </p>
                </a>
                <a
                  href="https://www.mpowerminds.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-brand-primary transition-all"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    MPower Minds
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mental health awareness and support
                  </p>
                </a>
                <a
                  href="https://www.whiteswanfoundation.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 hover:border-brand-primary transition-all"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    White Swan Foundation
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mental health information and resources
                  </p>
                </a>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-semibold">Your privacy matters:</span> All calls and texts are confidential and free of charge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
