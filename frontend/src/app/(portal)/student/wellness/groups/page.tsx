"use client";

import { useState } from "react";
import { ArrowLeft, Users, CalendarBlank, Clock, MapPin, Lightning, Heart, Brain, GraduationCap, Plus, Check } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  type: "anxiety" | "depression" | "stress" | "academic" | "grief" | "identity";
  facilitator: string;
  schedule: string;
  day: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  isOnline: boolean;
  nextSession: string;
}

export default function SupportGroupsPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);

  const groups: SupportGroup[] = [
    {
      id: "1",
      name: "Managing Anxiety Together",
      description: "A safe space to discuss anxiety, share coping strategies, and support each other through anxious moments.",
      type: "anxiety",
      facilitator: "Dr. Sharma",
      schedule: "Weekly",
      day: "Tuesdays",
      time: "5:00 PM - 6:00 PM",
      location: "Counseling Center, Room 203",
      participants: 8,
      maxParticipants: 12,
      isOnline: false,
      nextSession: "Dec 5, 2025",
    },
    {
      id: "2",
      name: "Depression Support Circle",
      description: "Connect with others who understand depression. Share experiences and learn evidence-based strategies for managing symptoms.",
      type: "depression",
      facilitator: "Counselor Patel",
      schedule: "Bi-weekly",
      day: "Thursdays",
      time: "6:30 PM - 7:30 PM",
      location: "Online (Zoom)",
      participants: 6,
      maxParticipants: 10,
      isOnline: true,
      nextSession: "Dec 7, 2025",
    },
    {
      id: "3",
      name: "Stress Less, Live More",
      description: "Learn and practice stress management techniques including mindfulness, breathing exercises, and time management skills.",
      type: "stress",
      facilitator: "Prof. Kumar",
      schedule: "Weekly",
      day: "Wednesdays",
      time: "4:00 PM - 5:00 PM",
      location: "Student Center, Room 105",
      participants: 10,
      maxParticipants: 15,
      isOnline: false,
      nextSession: "Dec 6, 2025",
    },
    {
      id: "4",
      name: "Academic Success & Wellbeing",
      description: "Balance academic pressure with mental health. Discuss study stress, exam anxiety, and healthy academic habits.",
      type: "academic",
      facilitator: "Dr. Mehta",
      schedule: "Weekly",
      day: "Mondays",
      time: "7:00 PM - 8:00 PM",
      location: "Online (Zoom)",
      participants: 12,
      maxParticipants: 15,
      isOnline: true,
      nextSession: "Dec 4, 2025",
    },
    {
      id: "5",
      name: "Grief & Loss Support",
      description: "A compassionate space for students dealing with loss, whether it's the death of a loved one, relationship endings, or other significant losses.",
      type: "grief",
      facilitator: "Counselor Singh",
      schedule: "Monthly",
      day: "First Sunday",
      time: "3:00 PM - 4:30 PM",
      location: "Counseling Center, Room 201",
      participants: 5,
      maxParticipants: 8,
      isOnline: false,
      nextSession: "Dec 3, 2025",
    },
    {
      id: "6",
      name: "Identity & Belonging",
      description: "Explore questions of identity, belonging, and self-discovery in a supportive, inclusive environment.",
      type: "identity",
      facilitator: "Dr. Reddy",
      schedule: "Bi-weekly",
      day: "Saturdays",
      time: "2:00 PM - 3:30 PM",
      location: "Diversity Center, Main Hall",
      participants: 7,
      maxParticipants: 12,
      isOnline: false,
      nextSession: "Dec 9, 2025",
    },
  ];

  const typeConfig = {
    anxiety: {
      icon: Lightning,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-700 dark:text-orange-400",
    },
    depression: {
      icon: Heart,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-700 dark:text-purple-400",
    },
    stress: {
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-400",
    },
    academic: {
      icon: GraduationCap,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      textColor: "text-emerald-700 dark:text-emerald-400",
    },
    grief: {
      icon: Heart,
      color: "from-gray-500 to-slate-500",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      borderColor: "border-gray-200 dark:border-gray-800",
      textColor: "text-gray-700 dark:text-gray-400",
    },
    identity: {
      icon: Users,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50 dark:bg-pink-900/20",
      borderColor: "border-pink-200 dark:border-pink-800",
      textColor: "text-pink-700 dark:text-pink-400",
    },
  };

  const typeFilters = [
    { value: "all", label: "All Groups" },
    { value: "anxiety", label: "Anxiety" },
    { value: "depression", label: "Depression" },
    { value: "stress", label: "Stress" },
    { value: "academic", label: "Academic" },
    { value: "grief", label: "Grief & Loss" },
    { value: "identity", label: "Identity" },
  ];

  const filteredGroups =
    selectedType === "all"
      ? groups
      : groups.filter((group) => group.type === selectedType);

  const handleJoinGroup = (groupId: string) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter((id) => id !== groupId));
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
      // In a real app, you'd send this to your backend
      console.log("Joined group:", groupId);
    }
  };

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
          <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-secondary to-brand-primary">
            <Users className="w-8 h-8 text-white" weight="duotone" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Support Groups
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join a community of students who understand
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
        <h2 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" weight="duotone" />
          About Support Groups
        </h2>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-4">
          Support groups provide a safe, confidential space to connect with peers facing similar challenges. Led by trained facilitators, these groups combine peer support with evidence-based techniques.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800 dark:text-blue-300">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 flex-shrink-0 text-blue-600" weight="bold" />
            <span>Free for all students</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 flex-shrink-0 text-blue-600" weight="bold" />
            <span>Confidential & judgment-free</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 flex-shrink-0 text-blue-600" weight="bold" />
            <span>No long-term commitment required</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Filter by Topic:
        </h3>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedType(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedType === filter.value
                  ? "bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => {
          const config = typeConfig[group.type];
          const Icon = config.icon;
          const isJoined = joinedGroups.includes(group.id);
          const isFull = group.participants >= group.maxParticipants;

          return (
            <div
              key={group.id}
              className={`rounded-2xl p-6 border ${config.bgColor} ${config.borderColor} hover:shadow-md transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${config.color}`}>
                    <Icon className="w-6 h-6 text-white" weight="duotone" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {group.name}
                    </h3>
                    <p className={`text-xs font-medium ${config.textColor}`}>
                      Led by {group.facilitator}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {group.description}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CalendarBlank className="w-4 h-4 text-gray-400" weight="duotone" />
                  <span>{group.schedule} • {group.day}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-gray-400" weight="duotone" />
                  <span>{group.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-400" weight="duotone" />
                  <span>{group.location}</span>
                  {group.isOnline && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                      Online
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Participants: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {group.participants}/{group.maxParticipants}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Next: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {group.nextSession}
                  </span>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => handleJoinGroup(group.id)}
                disabled={isFull && !isJoined}
                className={`w-full px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  isJoined
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500"
                    : isFull
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : `bg-gradient-to-r ${config.color} hover:shadow-lg text-white`
                }`}
              >
                {isJoined ? (
                  <>
                    <Check className="w-5 h-5" weight="bold" />
                    Joined
                  </>
                ) : isFull ? (
                  "Group Full"
                ) : (
                  <>
                    <Plus className="w-5 h-5" weight="bold" />
                    Join Group
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No groups found for this topic. Try a different filter.
          </p>
        </div>
      )}

      {/* My Groups Section */}
      {joinedGroups.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            My Groups
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              You've joined {joinedGroups.length} {joinedGroups.length === 1 ? "group" : "groups"}. You'll receive email reminders before each session.
            </p>
            <div className="space-y-3">
              {groups
                .filter((g) => joinedGroups.includes(g.id))
                .map((group) => {
                  const config = typeConfig[group.type];
                  return (
                    <div
                      key={group.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {group.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Next session: {group.day}, {group.time}
                        </p>
                      </div>
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Leave Group
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Do I need to attend every session?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              While regular attendance helps build group cohesion, we understand life happens. Just let us know if you'll miss a session.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Will what I share be kept confidential?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Yes. All participants agree to confidentiality. What's shared in the group stays in the group.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Can I join multiple groups?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Absolutely! You can join as many groups as you find helpful, as long as they don't conflict in timing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
