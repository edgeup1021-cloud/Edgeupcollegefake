"use client";

import { useState } from "react";
import { ArrowLeft, CalendarPlus, Phone, User, Envelope, Clock, MapPin, CheckCircle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

type ServiceType = "counseling" | "academic" | null;

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"select" | "form" | "confirmation">("select");
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    reason: "",
    urgency: "routine",
    counselorPreference: "",
  });

  const services = [
    {
      id: "counseling" as const,
      name: "Mental Health Counseling",
      description: "Schedule a session with a professional counselor",
      icon: Phone,
      color: "from-blue-500 to-cyan-500",
      availability: "Mon-Fri, 9 AM - 5 PM",
      duration: "50 minutes",
    },
    {
      id: "academic" as const,
      name: "Academic Counseling",
      description: "Get help with study skills, time management, and academic stress",
      icon: CalendarPlus,
      color: "from-purple-500 to-pink-500",
      availability: "Mon-Fri, 10 AM - 4 PM",
      duration: "30-45 minutes",
    },
  ];

  const handleServiceSelect = (service: ServiceType) => {
    setServiceType(service);
    setStep("form");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Booking submitted:", { serviceType, ...formData });
    setStep("confirmation");
  };

  const handleBackToSupport = () => {
    router.push("/student/wellness/support");
  };

  // Service Selection Screen
  if (step === "select") {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackToSupport}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" weight="bold" />
          <span>Back to Support</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-secondary to-brand-primary">
              <CalendarPlus className="w-8 h-8 text-white" weight="duotone" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Book an Appointment
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choose the type of support you need
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleServiceSelect(service.id)}
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} w-fit mb-4`}>
                  <Icon className="w-6 h-6 text-white" weight="duotone" />
                </div>
                <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" weight="duotone" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" weight="duotone" />
                    <span>{service.availability}</span>
                  </div>
                </div>
                <button className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-brand-secondary to-brand-primary text-white font-medium hover:shadow-lg transition-all">
                  Book Now
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
            What to Expect
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" weight="fill" />
              <span>Initial appointments typically scheduled within 3-5 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" weight="fill" />
              <span>All sessions are completely confidential</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" weight="fill" />
              <span>Free for all enrolled students</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" weight="fill" />
              <span>You'll receive a confirmation email within 24 hours</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Booking Form
  if (step === "form") {
    const selectedService = services.find((s) => s.id === serviceType);

    return (
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setStep("select")}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" weight="bold" />
          <span>Back to Service Selection</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
            Book {selectedService?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill out the form below to schedule your appointment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" weight="duotone" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" weight="duotone" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    placeholder="your.email@college.edu"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" weight="duotone" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  placeholder="+91-XXX-XXX-XXXX"
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
              Appointment Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  required
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Time *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  required
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Urgency Level
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              >
                <option value="routine">Routine - Within 1 week</option>
                <option value="soon">Soon - Within 2-3 days</option>
                <option value="urgent">Urgent - Within 24 hours</option>
              </select>
            </div>

            {serviceType === "counseling" && (
              <div className="mt-4">
                <label htmlFor="counselorPreference" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Counselor Preference (Optional)
                </label>
                <select
                  id="counselorPreference"
                  name="counselorPreference"
                  value={formData.counselorPreference}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                >
                  <option value="">No preference</option>
                  <option value="male">Male counselor</option>
                  <option value="female">Female counselor</option>
                  <option value="experienced">Most experienced available</option>
                </select>
              </div>
            )}

            <div className="mt-4">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Appointment *
              </label>
              <textarea
                id="reason"
                name="reason"
                required
                value={formData.reason}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                placeholder="Briefly describe what you'd like to discuss (this helps us match you with the right counselor)"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Your information is completely confidential
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setStep("select")}
              className="flex-1 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-brand-secondary to-brand-primary text-white font-semibold hover:shadow-lg transition-all"
            >
              Submit Booking Request
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
          For urgent mental health concerns, please call our crisis line at <strong>9820466726</strong>
        </p>
      </div>
    );
  }

  // Confirmation Screen
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 mb-6">
          <CheckCircle className="w-12 h-12 text-white" weight="fill" />
        </div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
          Booking Request Submitted!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your appointment request has been received
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="font-semibold text-xl text-gray-900 dark:text-white mb-4">
          What Happens Next?
        </h2>
        <div className="space-y-4 text-left">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Confirmation Email
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You'll receive a confirmation email at <strong>{formData.email}</strong> within 24 hours with your appointment details.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Appointment Scheduled
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Our team will review your request and schedule your appointment for your preferred date and time (or suggest alternatives if unavailable).
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Attend Your Session
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visit the counseling center at Building A, Room 205. Bring your student ID.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleBackToSupport}
          className="px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back to Support
        </button>
        <button
          onClick={() => router.push("/student/wellness/dashboard")}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-secondary to-brand-primary text-white font-semibold hover:shadow-lg transition-all"
        >
          Go to Wellness Dashboard
        </button>
      </div>
    </div>
  );
}
