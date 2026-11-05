"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MinaFloatingTrigger } from "./MinaFloatingTrigger";
import { MinaChatModal, ChatMessage } from "./MinaChatModal";
import { detectLanguage, stopMinaSpeaking } from "./mina-speech";

const STORAGE_KEY_MESSAGES = "mina_chat_messages_v1";
const STORAGE_KEY_LANG = "mina_chat_language_v1";

export const MinaAssistant: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load persisted history and preferences from storage
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === "bn" || savedLang === "en") {
        setLanguage(savedLang);
      }
      const savedMessages = sessionStorage.getItem(STORAGE_KEY_MESSAGES);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (e) {
      console.warn("Could not load stored Mina assistant data", e);
    }
  }, []);

  // Sync messages to sessionStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (messages.length > 0) {
        sessionStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
      } else {
        sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
      }
    } catch {}
  }, [messages, isMounted]);

  // Handle language switch
  const handleLanguageChange = (newLang: "bn" | "en") => {
    setLanguage(newLang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, newLang);
    } catch {}
  };

  // Add message to chat history
  const addMessage = useCallback(
    (role: "user" | "assistant", content: string) => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        role,
        content,
        timestamp: timeStr,
      };

      setMessages((prev) => [...prev, newMsg]);
    },
    []
  );

  // Send message in text chat mode
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Detect language and auto-switch
    const activeLang = detectLanguage(text);
    if (activeLang !== language) {
      setLanguage(activeLang);
    }

    // Append user message
    addMessage("user", text);
    setIsLoading(true);

    try {
      // Gather last 8 messages context
      const chatContext = [
        ...messages.slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user", content: text },
      ];

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: chatContext,
          language: activeLang,
          mode: "chat",
        }),
      });

      const data = await res.json();
      const reply =
        data.reply ||
        (activeLang === "bn"
          ? "দুঃখিত, উত্তর তৈরি করতে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন।"
          : "Sorry, I am having trouble preparing a reply. Please try again.");

      addMessage("assistant", reply);
    } catch (error) {
      console.error("Mina assistant send error:", error);
      const fallbackError =
        activeLang === "bn"
          ? "নেটওয়ার্ক সংক্রান্ত সমস্যার কারণে উত্তর দিতে বিলম্ব হচ্ছে। আপনি চাইলে সরাসরি [ডাক্তারদের পাতা](/doctors) থেকে সাহায্য নিতে পারেন।"
          : "There was a network delay. You can also directly explore our [Doctors Page](/doctors) for help.";
      addMessage("assistant", fallbackError);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const handleClearHistory = () => {
    stopMinaSpeaking();
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch {}
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Floating launcher trigger */}
      <MinaFloatingTrigger
        isOpen={isChatOpen}
        onOpenChat={() => setIsChatOpen(true)}
        language={language}
      />

      {/* Interactive Text Chat Modal */}
      <MinaChatModal
        isOpen={isChatOpen}
        onClose={() => {
          stopMinaSpeaking();
          setIsChatOpen(false);
        }}
        language={language}
        onLanguageChange={handleLanguageChange}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onClearHistory={handleClearHistory}
      />
    </>
  );
};
