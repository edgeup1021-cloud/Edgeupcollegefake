"use client";

import { useState, useRef, useEffect } from "react";
import {
  Robot,
  PaperPlaneRight,
  Microphone,
  MicrophoneSlash,
  Plus,
  ChatCircle,
  CaretDown,
  List,
  X,
} from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data
const subjects = [
  {
    id: 1,
    name: "Mathematics",
    topics: ["Calculus", "Linear Algebra", "Statistics"],
  },
  {
    id: 2,
    name: "Physics",
    topics: ["Mechanics", "Thermodynamics", "Optics"],
  },
  {
    id: 3,
    name: "Computer Science",
    topics: ["Data Structures", "Algorithms", "DBMS"],
  },
];

const mockClasses = [
  {
    id: 1,
    subject: "Mathematics",
    topic: "Calculus",
    date: "Today",
    time: "10:00 AM",
    label: "Today, 10:00 AM - Calculus",
  },
  {
    id: 2,
    subject: "Mathematics",
    topic: "Linear Algebra",
    date: "Yesterday",
    time: "2:00 PM",
    label: "Yesterday, 2:00 PM - Linear Algebra",
  },
  {
    id: 3,
    subject: "Physics",
    topic: "Mechanics",
    date: "Today",
    time: "11:30 AM",
    label: "Today, 11:30 AM - Mechanics",
  },
  {
    id: 4,
    subject: "Physics",
    topic: "Thermodynamics",
    date: "Yesterday",
    time: "9:00 AM",
    label: "Yesterday, 9:00 AM - Thermodynamics",
  },
  {
    id: 5,
    subject: "Computer Science",
    topic: "Data Structures",
    date: "Today",
    time: "3:00 PM",
    label: "Today, 3:00 PM - Data Structures",
  },
];

const mockConversations = [
  {
    id: 1,
    title: "Calculus Integration",
    date: "Today, 10:30 AM",
    preview: "How to solve integration by parts?",
  },
  {
    id: 2,
    title: "Physics Mechanics",
    date: "Today, 11:45 AM",
    preview: "Newton's laws explanation",
  },
  {
    id: 3,
    title: "Data Structures",
    date: "Yesterday, 3:30 PM",
    preview: "Binary tree traversal methods",
  },
];

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Custom Select Component
function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center justify-between w-full px-4 py-3 text-base rounded-xl border transition-all",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
          "border-gray-200 dark:border-gray-600",
          "hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isOpen && "ring-2 ring-brand-primary/20 border-brand-primary"
        )}
      >
        <span className={cn(!selectedOption && "text-gray-500 dark:text-gray-400")}>
          {selectedOption?.label || placeholder}
        </span>
        <CaretDown
          className={cn(
            "w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 py-1 rounded-xl border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-base text-gray-500 dark:text-gray-400">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-4 py-3 text-base text-left transition-colors",
                  "text-gray-900 dark:text-white",
                  "hover:bg-gray-100 dark:hover:bg-gray-700",
                  value === option.value && "bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary"
                )}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-4 mb-5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          isUser
            ? "bg-brand-primary text-white"
            : "bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 text-brand-secondary"
        )}
      >
        {isUser ? (
          <span className="text-sm font-semibold">You</span>
        ) : (
          <Robot className="w-6 h-6" />
        )}
      </div>
      <div
        className={cn(
          "max-w-[75%] px-5 py-4 rounded-2xl",
          isUser
            ? "bg-brand-primary text-white rounded-br-md"
            : "bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-bl-md"
        )}
      >
        <p className="text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <span
          className={cn(
            "text-sm mt-2 block",
            isUser ? "text-white/70" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}

// Conversation Item Component
function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: (typeof mockConversations)[0];
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl text-left transition-all",
        "border border-transparent",
        "hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-200 dark:hover:border-gray-600",
        isActive
          ? "bg-brand-primary/10 dark:bg-brand-primary/20 border-l-2 border-l-brand-primary"
          : "bg-gray-50/80 dark:bg-gray-700/30"
      )}
    >
      <div className="flex items-start gap-3">
        <ChatCircle className="w-5 h-5 mt-0.5 text-brand-secondary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
            {conversation.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {conversation.preview}
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {conversation.date}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function eUstadPage() {
  // Filter states
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  // Chat states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm eUstad, your AI class assistant. Select a class from the filters above to start asking questions about your recent lectures.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get available topics based on selected subject
  const availableTopics =
    subjects.find((s) => s.name === selectedSubject)?.topics || [];

  // Get available classes based on selected subject and topic
  const availableClasses = mockClasses.filter((c) => {
    if (selectedSubject && c.subject !== selectedSubject) return false;
    if (selectedTopic && c.topic !== selectedTopic) return false;
    return true;
  });

  // Reset dependent filters
  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    setSelectedTopic("");
    setSelectedClass("");
  };

  const handleTopicChange = (value: string) => {
    setSelectedTopic(value);
    setSelectedClass("");
  };

  // Send message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Mock bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: getMockResponse(inputValue.trim()),
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  // Mock response generator
  const getMockResponse = (question: string): string => {
    const responses = [
      `That's a great question about "${question.slice(0, 30)}...". Based on your recent class, here's what I found:\n\nThe concept you're asking about was covered in detail during the lecture. The key points are:\n\n1. First, understand the fundamental principles\n2. Apply the formula step by step\n3. Practice with similar problems\n\nWould you like me to explain any specific part in more detail?`,
      `From your ${selectedTopic || "recent"} class, I can help explain this:\n\nThe topic relates to core concepts discussed by your instructor. Remember that understanding the basics is crucial before moving to advanced applications.\n\nIs there a specific aspect you'd like me to elaborate on?`,
      `Based on the lecture content, here's a simplified explanation:\n\nThis concept is fundamental to ${selectedSubject || "the subject"}. Your instructor emphasized its importance in practical applications.\n\nWould you like me to provide some examples?`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Toggle recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real implementation, this would handle voice recording
    if (!isRecording) {
      // Start recording simulation
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("What are the key concepts from today's lecture?");
      }, 2000);
    }
  };

  // Handle new conversation
  const handleNewConversation = () => {
    setActiveConversation(null);
    setMessages([
      {
        id: 1,
        role: "assistant",
        content:
          "Hello! I'm eUstad, your AI class assistant. Select a class from the filters above to start asking questions about your recent lectures.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setSelectedSubject("");
    setSelectedTopic("");
    setSelectedClass("");
    setIsSidebarOpen(false);
  };

  // Handle conversation click
  const handleConversationClick = (id: number) => {
    setActiveConversation(id);
    // In real implementation, load conversation messages from backend
    const conv = mockConversations.find((c) => c.id === id);
    if (conv) {
      setMessages([
        {
          id: 1,
          role: "user",
          content: conv.preview,
          timestamp: conv.date.split(", ")[1] || "10:00 AM",
        },
        {
          id: 2,
          role: "assistant",
          content: `Here's my response about "${conv.title}". This was discussed in your recent class...`,
          timestamp: conv.date.split(", ")[1] || "10:01 AM",
        },
      ]);
    }
    setIsSidebarOpen(false);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 flex items-center justify-center">
            <Robot className="w-7 h-7 text-brand-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">eUstad</h1>
            <p className="text-base text-gray-500 dark:text-gray-400">
              AI Class Assistant - Ask about your recent classes
            </p>
          </div>
        </div>
        {/* Mobile menu button */}
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 w-12 h-12"
          onClick={() => setIsSidebarOpen(true)}
        >
          <List className="w-6 h-6" />
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm py-4">
        <CardContent className="p-0 px-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CustomSelect
              value={selectedSubject}
              onChange={handleSubjectChange}
              options={subjects.map((s) => ({ value: s.name, label: s.name }))}
              placeholder="Select Subject"
            />
            <CustomSelect
              value={selectedTopic}
              onChange={handleTopicChange}
              options={availableTopics.map((t) => ({ value: t, label: t }))}
              placeholder="Select Topic"
              disabled={!selectedSubject}
            />
            <CustomSelect
              value={selectedClass}
              onChange={setSelectedClass}
              options={availableClasses.map((c) => ({
                value: c.id.toString(),
                label: c.label,
              }))}
              placeholder="Select Class"
              disabled={!selectedSubject}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Sidebar - Past Conversations (Desktop) */}
        <Card className="hidden lg:flex w-80 flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader className="py-4 px-5 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                Past Conversations
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewConversation}
                className="h-9 px-3 text-sm text-gray-600 dark:text-gray-400 hover:text-brand-primary hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Plus className="w-5 h-5 mr-1" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-3 space-y-2">
            {mockConversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isActive={activeConversation === conv.id}
                onClick={() => handleConversationClick(conv.id)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-xl">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Past Conversations</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 w-10 h-10"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-3">
                <Button
                  variant="outline"
                  className="w-full mb-3 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-base py-3"
                  onClick={handleNewConversation}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  New Conversation
                </Button>
                <div className="space-y-2">
                  {mockConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conversation={conv}
                      isActive={activeConversation === conv.id}
                      onClick={() => handleConversationClick(conv.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          {/* Messages */}
          <CardContent className="flex-1 overflow-auto p-5">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={chatEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-5 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your question..."
                  className={cn(
                    "w-full px-5 py-4 pr-12 rounded-xl text-base transition-all",
                    "bg-gray-50 dark:bg-gray-700/30 text-gray-900 dark:text-white",
                    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    "border border-gray-200 dark:border-gray-600",
                    "focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  )}
                />
              </div>

              {/* Mic Button */}
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={toggleRecording}
                className={cn(
                  "flex-shrink-0 rounded-xl h-14 w-14",
                  !isRecording && "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-brand-primary",
                  isRecording && "animate-pulse"
                )}
              >
                {isRecording ? (
                  <MicrophoneSlash className="w-6 h-6" />
                ) : (
                  <Microphone className="w-6 h-6" />
                )}
              </Button>

              {/* Send Button */}
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="flex-shrink-0 rounded-xl h-14 w-14 bg-brand-primary hover:bg-brand-primary/90 text-white disabled:opacity-50"
              >
                <PaperPlaneRight className="w-6 h-6" />
              </Button>
            </div>

            {isRecording && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-3 animate-pulse">
                Recording... Click mic to stop
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
