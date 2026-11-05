"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Send,
  X,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Mic,
  MicOff,
  Sparkles,
  Globe,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";
import { MinaAvatar } from "./MinaAvatar";
import {
  speakMinaText,
  stopMinaSpeaking,
  initSpeechRecognition,
  detectLanguage,
  unlockAudio,
} from "./mina-speech";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface MinaChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "bn" | "en";
  onLanguageChange: (lang: "bn" | "en") => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onClearHistory: () => void;
}

const MINIMAL_SUGGESTIONS = {
  bn: [
    { label: "👨‍⚕️ ডাক্তার খুঁজুন", text: "টেলিহেলথে কীভাবে ভালো ডাক্তার খুঁজে বুক করব?" },
    { label: "🩺 লক্ষণ পরীক্ষা", text: "আমার গত দুই দিন ধরে জ্বর ও মাথা ব্যথা। প্রাথমিক কী পরামর্শ?" },
    { label: "📋 পরামর্শের সারাংশ", text: "আমাদের আজকের আলোচনার বিস্তারিত সারাংশ দিন যাতে আমি রেকর্ড রাখতে পারি।" },
  ],
  en: [
    { label: "👨‍⚕️ Find a Doctor", text: "How do I find and book the best doctor for my condition?" },
    { label: "🩺 Symptom Check", text: "I have a headache, mild fever, and fatigue. What should I do?" },
    { label: "📋 Get Summary", text: "Please give me a structured consultation summary of our conversation." },
  ],
};

export const MinaChatModal: React.FC<MinaChatModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  messages,
  onSendMessage,
  isLoading,
  onClearHistory,
}) => {
  const [inputText, setInputText] = useState("");
  const [isDictating, setIsDictating] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dictationControllerRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    unlockAudio();
    const detected = detectLanguage(text);
    if (detected !== language) {
      onLanguageChange(detected);
    }

    setInputText("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    await onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleDictation = () => {
    unlockAudio();
    if (isDictating) {
      dictationControllerRef.current?.stop();
      setIsDictating(false);
      return;
    }

    dictationControllerRef.current = initSpeechRecognition(language, {
      onStart: () => setIsDictating(true),
      onResult: (transcript, isFinal, detectedLang) => {
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        if (detectedLang && detectedLang !== language) {
          onLanguageChange(detectedLang);
        }
      },
      onError: () => setIsDictating(false),
      onEnd: () => setIsDictating(false),
    });

    dictationControllerRef.current.start();
  };

  const handleSpeakMessage = (id: string, text: string) => {
    unlockAudio();
    if (speakingMessageId === id) {
      stopMinaSpeaking();
      setSpeakingMessageId(null);
      return;
    }

    setSpeakingMessageId(id);
    speakMinaText(text, language, {
      onStart: () => setSpeakingMessageId(id),
      onEnd: () => setSpeakingMessageId(null),
      onError: () => setSpeakingMessageId(null),
    });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderFormattedText = (raw: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(raw)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderBoldText(raw.substring(lastIndex, match.index), `txt-${lastIndex}`));
      }

      const label = match[1];
      const href = match[2];

      parts.push(
        <Link
          key={`link-${match.index}`}
          href={href}
          className="inline-flex items-center text-primary font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {label}
        </Link>
      );

      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < raw.length) {
      parts.push(renderBoldText(raw.substring(lastIndex), `txt-${lastIndex}`));
    }

    return parts;
  };

  const renderBoldText = (text: string, keyPrefix: string) => {
    const boldRegex = /\*\*([^*]+)\*\*/g;
    const segments: React.ReactNode[] = [];
    let lastIdx = 0;
    let m;

    while ((m = boldRegex.exec(text)) !== null) {
      if (m.index > lastIdx) {
        segments.push(text.substring(lastIdx, m.index));
      }
      segments.push(
        <strong key={`${keyPrefix}-b-${m.index}`} className="font-semibold text-foreground">
          {m[1]}
        </strong>
      );
      lastIdx = boldRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      segments.push(text.substring(lastIdx));
    }

    return <span key={keyPrefix}>{segments}</span>;
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden border border-border/80 bg-card shadow-2xl transition-all duration-200",
        "bottom-3 right-3 sm:bottom-6 sm:right-6",
        "w-[calc(100vw-1.5rem)] sm:w-[400px]",
        "h-[82vh] max-h-[620px] rounded-[24px]"
      )}
    >
      {/* Minimalist, Clean Header */}
      <div className="flex items-center justify-between border-b border-border/70 bg-[#f8f7f4] dark:bg-[#201e22] px-4 py-3 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <MinaAvatar
            size="sm"
            status={speakingMessageId ? "speaking" : "online"}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Mina
              </h3>
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {language === "bn" ? "টেলিহেলথ এআই ডাক্তার" : "TeleHealth AI Doctor"}
            </p>
          </div>
        </div>

        {/* Header Minimal Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => {
              unlockAudio();
              onLanguageChange(language === "en" ? "bn" : "en");
            }}
            className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            title="Toggle Language"
          >
            <Globe size={11} />
            <span>{language === "bn" ? "বাং" : "EN"}</span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ml-0.5"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background/40">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <MinaAvatar size="lg" className="mb-2.5" />
            <h4 className="text-sm font-semibold text-foreground">
              {language === "bn" ? "আসসালামু আলাইকুম! আমি মিনা" : "Assalamu Alaikum! I'm Mina"}
            </h4>
            <p className="mt-1 max-w-[280px] text-xs text-muted-foreground leading-relaxed">
              {language === "bn"
                ? "টেলিহেলথ ডাক্তার বুকিং ও প্রাথমিক স্বাস্থ্য পরামর্শে কীভাবে সাহায্য করতে পারি?"
                : "How can I assist you with doctor booking or health guidance today?"}
            </p>

            {/* Clean Minimal Suggestions */}
            <div className="mt-4 w-full flex flex-col gap-1.5">
              {MINIMAL_SUGGESTIONS[language].map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    unlockAudio();
                    onSendMessage(sug.text);
                  }}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-card px-3 py-2 text-left text-xs text-foreground hover:border-primary/50 hover:bg-muted/40 active:scale-[0.99] transition-all"
                >
                  <span className="font-medium truncate">{sug.label}</span>
                  <Sparkles size={11} className="text-muted-foreground shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === "user";
            const isSpeakingThis = speakingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2",
                  isUser ? "flex-row-reverse" : "flex-row"
                )}
              >
                {!isUser && (
                  <MinaAvatar
                    size="sm"
                    status={isSpeakingThis ? "speaking" : "online"}
                    showBadge={false}
                    className="mt-0.5 shrink-0"
                  />
                )}

                <div
                  className={cn(
                    "group relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed transition-all",
                    isUser
                      ? "bg-[#28262a] text-white rounded-br-xs shadow-xs"
                      : "bg-card border border-border text-foreground rounded-bl-xs shadow-xs"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {isUser ? msg.content : renderFormattedText(msg.content)}
                  </div>

                  {!isUser && (
                    <div className="mt-2 flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
                      <span>{msg.timestamp}</span>

                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        {/* Audio Listen Button */}
                        <button
                          onClick={() => handleSpeakMessage(msg.id, msg.content)}
                          className={cn(
                            "flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium transition-colors",
                            isSpeakingThis
                              ? "bg-[#97cde5] text-[#28262a]"
                              : "hover:bg-muted text-muted-foreground"
                          )}
                          title={isSpeakingThis ? "Stop" : "Listen aloud"}
                        >
                          {isSpeakingThis ? (
                            <>
                              <VolumeX size={11} />
                              <span>{language === "bn" ? "থামান" : "Stop"}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={11} />
                              <span>{language === "bn" ? "শুনুন" : "Listen"}</span>
                            </>
                          )}
                        </button>

                        {/* Copy */}
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="rounded-md p-1 hover:bg-muted text-muted-foreground"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <Check size={11} className="text-emerald-500" />
                          ) : (
                            <Copy size={11} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex items-start gap-2">
            <MinaAvatar size="sm" status="listening" showBadge={false} />
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-xs border border-border bg-card px-3.5 py-2 text-xs text-muted-foreground">
              <Loader2 size={12} className="animate-spin text-primary" />
              <span>{language === "bn" ? "মিনা লিখছে..." : "Mina is typing..."}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Minimal Footer Suggestions Bar */}
      {messages.length > 0 && (
        <div className="flex items-center gap-1.5 border-t border-border/40 bg-muted/20 px-3 py-1 text-[11px]">
          <button
            onClick={() => {
              unlockAudio();
              onSendMessage(
                language === "bn"
                  ? "আমাদের আজকের আলোচনার বিস্তারিত সারাংশ (লক্ষণ, পরামর্শ ও কোন বিশেষজ্ঞ ডাক্তার দেখানো উচিত) দিন।"
                  : "Please give me a structured consultation summary of our conversation."
              );
            }}
            className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <FileText size={11} />
            <span>{language === "bn" ? "সারাংশ নিন" : "Summary"}</span>
          </button>

          <button
            onClick={onClearHistory}
            className="ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-muted-foreground hover:text-foreground hover:bg-muted text-[10px]"
            title="Clear Chat"
          >
            <RefreshCw size={10} />
            <span>{language === "bn" ? "রিসেট" : "Reset"}</span>
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="border-t border-border bg-card p-2.5">
        <div className="relative flex items-end gap-1.5 rounded-2xl border border-border bg-background p-1.5 focus-within:border-primary/80 transition-colors">
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === "bn"
                ? "মিনাকে স্বাস্থ্য বা ওয়েবসাইট নিয়ে প্রশ্ন করুন..."
                : "Ask Mina about health or platform..."
            }
            rows={1}
            className="max-h-20 flex-1 resize-none bg-transparent px-2 py-1 text-xs sm:text-sm text-foreground outline-none placeholder:text-muted-foreground font-sans"
          />

          <div className="flex items-center gap-1 pb-0.5">
            <button
              type="button"
              onClick={toggleDictation}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                isDictating
                  ? "bg-rose-500 text-white animate-pulse"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={isDictating ? "Stop listening" : "Voice dictation"}
            >
              {isDictating ? <MicOff size={13} /> : <Mic size={13} />}
            </button>

            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#28262a] dark:bg-white text-white dark:text-[#28262a] hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Send"
            >
              <Send size={12} />
            </button>
          </div>
        </div>

        <p className="mt-1 text-center text-[9px] text-muted-foreground">
          {language === "bn"
            ? "টেলিহেলথ এআই পরামর্শ নির্দেশনামূলক। জরুরি অবস্থায় ৯৯৯ এ কল করুন।"
            : "Mina provides educational triage. For emergencies, dial 999."}
        </p>
      </div>
    </div>
  );
};
