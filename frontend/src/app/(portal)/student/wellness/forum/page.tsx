"use client";

import { useState } from "react";
import { ArrowLeft, Chat, Heart, Fire, ThumbsUp, ChatCircle, Plus, MagnifyingGlass, Tag } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface ForumPost {
  id: string;
  title: string;
  author: string;
  content: string;
  tags: string[];
  likes: number;
  replies: number;
  timestamp: string;
  isLiked: boolean;
}

export default function ForumPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: "1",
      title: "How do you deal with exam anxiety?",
      author: "Anonymous Student",
      content: "Exams are coming up and I'm feeling really anxious. I can't focus on studying because I keep worrying about failing. Any tips on managing this?",
      tags: ["anxiety", "exams", "study-tips"],
      likes: 24,
      replies: 15,
      timestamp: "2 hours ago",
      isLiked: false,
    },
    {
      id: "2",
      title: "Feeling lonely even when surrounded by people",
      author: "Anonymous Student",
      content: "I have friends and people around me, but I still feel really alone. Does anyone else feel this way? How do you cope?",
      tags: ["loneliness", "social", "mental-health"],
      likes: 31,
      replies: 22,
      timestamp: "5 hours ago",
      isLiked: true,
    },
    {
      id: "3",
      title: "Tips for better sleep schedule?",
      author: "Anonymous Student",
      content: "My sleep schedule is completely messed up. I stay up late studying and then can't wake up for morning classes. Any advice?",
      tags: ["sleep", "lifestyle", "study-tips"],
      likes: 18,
      replies: 12,
      timestamp: "1 day ago",
      isLiked: false,
    },
    {
      id: "4",
      title: "Success story: I finally talked to a counselor",
      author: "Anonymous Student",
      content: "I was nervous for weeks, but I finally booked a counseling appointment. Just wanted to say - if you're on the fence, do it. It really helps to talk to someone.",
      tags: ["success", "counseling", "encouragement"],
      likes: 89,
      replies: 34,
      timestamp: "1 day ago",
      isLiked: true,
    },
    {
      id: "5",
      title: "Imposter syndrome in college",
      author: "Anonymous Student",
      content: "Does anyone else feel like they don't belong here? Like everyone is smarter and you just got lucky? I feel like a fraud sometimes.",
      tags: ["imposter-syndrome", "self-doubt", "academic"],
      likes: 45,
      replies: 28,
      timestamp: "2 days ago",
      isLiked: false,
    },
    {
      id: "6",
      title: "How to make friends in second year?",
      author: "Anonymous Student",
      content: "I didn't really make close friends in first year. Now everyone seems to have their groups already. Any advice for someone trying to build connections?",
      tags: ["friendship", "social", "advice-needed"],
      likes: 27,
      replies: 19,
      timestamp: "3 days ago",
      isLiked: false,
    },
  ]);

  const popularTags = [
    { name: "anxiety", count: 145 },
    { name: "depression", count: 98 },
    { name: "study-tips", count: 127 },
    { name: "sleep", count: 76 },
    { name: "social", count: 112 },
    { name: "relationships", count: 89 },
    { name: "self-care", count: 134 },
    { name: "success", count: 56 },
  ];

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    // Sort by likes for now (you can add more sorting options)
    return b.likes - a.likes;
  });

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-secondary to-brand-primary">
              <Chat className="w-8 h-8 text-white" weight="duotone" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Student Wellness Forum
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Share experiences, ask questions, and support each other
              </p>
            </div>
          </div>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary hover:shadow-lg text-white font-semibold transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" weight="bold" />
            New Post
          </button>
        </div>
      </div>

      {/* Community Guidelines Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
        <h2 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5" weight="duotone" />
          Community Guidelines
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800 dark:text-blue-300">
          <div>
            <strong>Be Kind & Respectful:</strong> Everyone's experience is valid
          </div>
          <div>
            <strong>Stay Anonymous:</strong> Don't share identifying information
          </div>
          <div>
            <strong>Support, Don't Diagnose:</strong> Share experiences, not medical advice
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search & Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" weight="bold" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent">
                <option>Most Popular</option>
                <option>Most Recent</option>
                <option>Most Replies</option>
              </select>
            </div>

            {selectedTag && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Filtered by:
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-primary text-white text-sm font-medium flex items-center gap-2">
                  #{selectedTag}
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 hover:text-brand-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Posted by {post.author} • {post.timestamp}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(tag);
                      }}
                      className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" weight="bold" />
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikePost(post.id);
                    }}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                      post.isLiked
                        ? "text-brand-primary"
                        : "text-gray-600 dark:text-gray-400 hover:text-brand-primary"
                    }`}
                  >
                    <ThumbsUp
                      className="w-5 h-5"
                      weight={post.isLiked ? "fill" : "regular"}
                    />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-primary transition-colors">
                    <ChatCircle className="w-5 h-5" weight="duotone" />
                    {post.replies} replies
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedPosts.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No posts found. Try a different search or tag.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Popular Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Fire className="w-5 h-5 text-orange-500" weight="duotone" />
              Popular Topics
            </h3>
            <div className="space-y-2">
              {popularTags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => setSelectedTag(tag.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTag === tag.name
                      ? "bg-brand-primary text-white"
                      : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Tag className="w-4 h-4" weight="bold" />
                    {tag.name}
                  </span>
                  <span className="text-xs opacity-75">{tag.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Forum Stats */}
          <div className="bg-gradient-to-br from-brand-secondary to-brand-primary rounded-2xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-4">Forum Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80">Total Posts</span>
                <span className="font-bold text-xl">2,456</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">Active Users</span>
                <span className="font-bold text-xl">892</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/80">This Week</span>
                <span className="font-bold text-xl">143</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
