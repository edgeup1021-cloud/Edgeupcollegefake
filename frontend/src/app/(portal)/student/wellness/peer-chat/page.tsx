"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, PaperPlaneRight, Smiley, User, ChatCircleDots, Warning, Shield } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  sender: "me" | "peer";
  text: string;
  timestamp: Date;
}

export default function PeerChatPage() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConnect = () => {
    setIsSearching(true);
    // Simulate finding a peer
    setTimeout(() => {
      setIsSearching(false);
      setIsConnected(true);
      setMessages([
        {
          id: "1",
          sender: "peer",
          text: "Hi! Thanks for connecting. I'm here to listen and support you. How are you feeling today?",
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !isConnected) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // Simulate peer response
    setTimeout(() => {
      const responses = [
        "I hear you. That sounds really difficult. Can you tell me more about that?",
        "Thank you for sharing that with me. You're not alone in feeling this way.",
        "I understand. It takes courage to talk about these things. How long have you been feeling this way?",
        "That makes sense. What do you think would help you feel better right now?",
        "I'm glad you're opening up about this. Have you talked to anyone else about how you're feeling?",
      ];

      const peerMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "peer",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, peerMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const handleEndChat = () => {
    if (confirm("Are you sure you want to end this chat session?")) {
      setIsConnected(false);
      setMessages([]);
    }
  };

  // Welcome Screen
  if (!isConnected && !isSearching) {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/student/wellness/support")}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" weight="bold" />
          <span>Back to Support</span>
        </button>

        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-6">
            <ChatCircleDots className="w-10 h-10 text-white" weight="duotone" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
            Anonymous Peer Support Chat
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect with a trained peer supporter for confidential, judgment-free conversation
          </p>
        </div>

        {/* Safety & Privacy Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" weight="duotone" />
            <h2 className="font-semibold text-lg text-blue-900 dark:text-blue-300">
              Your Privacy & Safety
            </h2>
          </div>
          <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Completely Anonymous:</strong> Neither you nor the peer supporter will see each other's names or identities</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Confidential:</strong> Your conversation is private and will not be recorded or shared</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Trained Supporters:</strong> All peer supporters have completed mental health first aid training</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <span><strong>Not a Crisis Service:</strong> For emergencies, please call our crisis line at 9820466726</span>
            </li>
          </ul>
        </div>

        {/* Guidelines */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Chat Guidelines
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                ✓ Please Do:
              </h3>
              <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
                <li>• Be honest about your feelings</li>
                <li>• Ask for support when you need it</li>
                <li>• Respect the peer supporter's time</li>
                <li>• Share at your own pace</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                ✗ Please Don't:
              </h3>
              <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
                <li>• Share personal identifying information</li>
                <li>• Use abusive or threatening language</li>
                <li>• Discuss self-harm in detail</li>
                <li>• Expect medical or professional advice</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Start Chat Button */}
        <div className="text-center">
          <button
            onClick={handleConnect}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg text-white font-semibold text-lg transition-all flex items-center gap-3 mx-auto"
          >
            <ChatCircleDots className="w-6 h-6" weight="duotone" />
            Connect with Peer Supporter
          </button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Average wait time: less than 2 minutes
          </p>
        </div>

        {/* Emergency Notice */}
        <div className="mt-8 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <Warning className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" weight="fill" />
            <div className="text-sm text-red-800 dark:text-red-300">
              <strong>In Crisis?</strong> If you're experiencing thoughts of self-harm or suicide, please contact our crisis line immediately at <strong>9820466726</strong> or call emergency services at <strong>112</strong>.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Searching for Peer
  if (isSearching) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center animate-pulse">
              <ChatCircleDots className="w-16 h-16 text-white" weight="duotone" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-300 dark:border-emerald-700 animate-ping" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Connecting you with a peer supporter...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This usually takes less than a minute
          </p>
        </div>
      </div>
    );
  }

  // Chat Interface
  return (
    <div className="max-w-5xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 border-b-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" weight="duotone" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Anonymous Peer Supporter
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleEndChat}
            className="px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium transition-colors"
          >
            End Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="bg-gray-50 dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700 p-6 h-[500px] overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === "me"
                    ? "bg-gradient-to-r from-brand-secondary to-brand-primary text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === "me" ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white dark:bg-gray-800 rounded-b-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 border-t-0"
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent pr-12"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Smiley className="w-6 h-6" weight="duotone" />
            </button>
          </div>
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              inputText.trim()
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>Send</span>
            <PaperPlaneRight className="w-5 h-5" weight="fill" />
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          This is a peer support chat. For professional help, please contact campus counseling.
        </p>
      </form>
    </div>
  );
}
