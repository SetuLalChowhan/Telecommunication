"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  MessageSquare,
  Globe,
  Radio,
  Loader2,
  Sparkles,
} from "lucide-react";
import { MinaAvatar } from "./MinaAvatar";
import {
  speakMinaText,
  stopMinaSpeaking,
  initSpeechRecognition,
  detectLanguage,
  SpeechRecognitionController,
} from "./mina-speech";

interface MinaVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToChat: () => void;
  language: "bn" | "en";
  onLanguageChange: (lang: "bn" | "en") => void;
  onAddMessageToHistory?: (role: "user" | "assistant", content: string) => void;
  historyMessages?: { role: string; content: string }[];
}

export const MinaVoiceCallModal: React.FC<MinaVoiceCallModalProps> = ({
  isOpen,
  onClose,
  onSwitchToChat,
  language,
  onLanguageChange,
  onAddMessageToHistory,
  historyMessages = [],
}) => {
  const [callState, setCallState] = useState<
    "speaking" | "listening" | "thinking"
  >("speaking");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");

  // Refs to hold latest values without triggering re-renders or effect re-runs
  const languageRef = useRef(language);
  const onLanguageChangeRef = useRef(onLanguageChange);
  const onAddMessageToHistoryRef = useRef(onAddMessageToHistory);
  const historyMessagesRef = useRef(historyMessages);
  const isMutedRef = useRef(isMuted);
  const isSpeakerOnRef = useRef(isSpeakerOn);

  const speechControllerRef = useRef<SpeechRecognitionController | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechCancelRef = useRef<(() => void) | null>(null);
  const accumulatedSpeechRef = useRef<string>("");

  useEffect(() => {
    languageRef.current = language;
    onLanguageChangeRef.current = onLanguageChange;
    onAddMessageToHistoryRef.current = onAddMessageToHistory;
    historyMessagesRef.current = historyMessages;
    isMutedRef.current = isMuted;
    isSpeakerOnRef.current = isSpeakerOn;
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Instant hard cut cleanup (audio stops immediately, mic cuts immediately)
  const stopAll = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (speechCancelRef.current) speechCancelRef.current();
    stopMinaSpeaking();
    if (speechControllerRef.current) {
      try {
        speechControllerRef.current.abort();
        speechControllerRef.current.stop();
      } catch {}
      speechControllerRef.current = null;
    }
  };

  // Handle Voice Query to AI backend
  const handleVoiceQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    // Stop microphone while processing & speaking
    if (speechControllerRef.current) {
      speechControllerRef.current.stop();
    }

    const detected = detectLanguage(queryText);
    if (detected !== languageRef.current) {
      onLanguageChangeRef.current?.(detected);
    }

    setCallState("thinking");
    setLiveTranscript(queryText);
    onAddMessageToHistoryRef.current?.("user", queryText);

    try {
      const conversationContext = [
        ...(historyMessagesRef.current || []).slice(-8).map((m) => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user", content: queryText },
      ];

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationContext,
          language: detected,
          mode: "call",
        }),
      });

      const data = await res.json();
      const reply =
        data.reply ||
        (detected === "bn"
          ? "আপনার কথাটি বুঝতে সমস্যা হয়েছে। দয়া করে আবার বলুন।"
          : "Could you please repeat that?");

      onAddMessageToHistoryRef.current?.("assistant", reply);
      setLiveTranscript(reply);

      if (isSpeakerOnRef.current) {
        setCallState("speaking");
        const ctrl = speakMinaText(reply, detected, {
          onStart: () => setCallState("speaking"),
          onEnd: () => {
            setCallState("listening");
            if (!isMutedRef.current && speechControllerRef.current) {
              speechControllerRef.current.start();
            }
          },
          onError: () => {
            setCallState("listening");
            if (!isMutedRef.current && speechControllerRef.current) {
              speechControllerRef.current.start();
            }
          },
        });
        speechCancelRef.current = ctrl.cancel;
      } else {
        setCallState("listening");
        if (!isMutedRef.current && speechControllerRef.current) {
          speechControllerRef.current.start();
        }
      }
    } catch {
      setCallState("listening");
      if (!isMutedRef.current && speechControllerRef.current) {
        speechControllerRef.current.start();
      }
    }
  };

  // Start speech recognition
  const beginListening = () => {
    if (isMutedRef.current) return;

    if (!speechControllerRef.current) {
      speechControllerRef.current = initSpeechRecognition(languageRef.current, {
        onStart: () => setCallState("listening"),
        onResult: (transcript, isFinal, detectedLang) => {
          setLiveTranscript(transcript);
          accumulatedSpeechRef.current = transcript;

          if (detectedLang && detectedLang !== languageRef.current) {
            onLanguageChangeRef.current?.(detectedLang);
          }

          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          // Allow natural human pause of 2.2 seconds so patient isn't cut off on single words
          silenceTimerRef.current = setTimeout(() => {
            const finalPrompt = accumulatedSpeechRef.current.trim();
            if (finalPrompt.length > 2) {
              accumulatedSpeechRef.current = "";
              handleVoiceQuery(finalPrompt);
            }
          }, 2200);
        },
        onError: () => {},
        onEnd: () => {},
      });
    }

    speechControllerRef.current.start();
  };

  // ONE-TIME CALL LIFECYCLE (Prevents infinite re-render flicker loop!)
  useEffect(() => {
    if (!isOpen) {
      stopAll();
      return;
    }

    setCallDuration(0);
    setCallState("speaking");

    // Timer
    timerIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Natural human greeting (sounds like a real clinic doctor, NOT an AI robot)
    const initialGreeting =
      languageRef.current === "bn"
        ? "আসসালামু আলাইকুম! টেলিহেলথ কেয়ারে স্বাগতম, আমি ডক্টর মিনা। আজ কীভাবে আপনাকে সাহায্য করতে পারি?"
        : "Assalamu Alaikum and welcome to TeleHealth, I'm Dr. Mina. How can I assist you today?";

    setLiveTranscript(initialGreeting);
    onAddMessageToHistoryRef.current?.("assistant", initialGreeting);

    // Speak initial greeting
    const ctrl = speakMinaText(initialGreeting, languageRef.current, {
      onStart: () => setCallState("speaking"),
      onEnd: () => {
        setCallState("listening");
        beginListening();
      },
      onError: () => {
        setCallState("listening");
        beginListening();
      },
    });
    speechCancelRef.current = ctrl.cancel;

    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        speechControllerRef.current?.stop();
      } else {
        beginListening();
      }
      return next;
    });
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => {
      const next = !prev;
      if (!next) {
        stopMinaSpeaking();
      }
      return next;
    });
  };

  const handleEnd = () => {
    stopAll();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      {/* Stable, centered card without jitter */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] mx-auto overflow-hidden rounded-[24px] border border-white/10 bg-[#1c1a1e] text-white shadow-2xl">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute -top-16 -left-16 h-44 w-44 rounded-full bg-[#97cde5]/15 blur-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs font-semibold tracking-tight text-white">
              Mina • Live Audio Call
            </h3>
          </div>

          <button
            onClick={() => {
              const nextLang = language === "en" ? "bn" : "en";
              onLanguageChange(nextLang);
              if (speechControllerRef.current) {
                speechControllerRef.current.setLanguage(nextLang);
              }
            }}
            className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/90 hover:bg-white/20 transition-colors"
          >
            <Globe size={11} />
            <span>{language === "bn" ? "বাংলা" : "EN"}</span>
          </button>
        </div>

        {/* Center Visualizer & Avatar */}
        <div className="flex flex-col items-center justify-center px-4 py-7">
          <div className="relative flex items-center justify-center">
            {callState === "speaking" && (
              <div className="absolute h-28 w-28 rounded-full border border-[#97cde5]/40 animate-pulse" />
            )}
            {callState === "listening" && (
              <div className="absolute h-28 w-28 rounded-full border border-[#c8dfaa]/40 animate-pulse" />
            )}

            <MinaAvatar
              size="lg"
              status={
                callState === "speaking"
                  ? "speaking"
                  : callState === "listening"
                  ? "listening"
                  : "online"
              }
              showBadge={false}
              className="relative z-10 shadow-lg ring-2 ring-white/10"
            />
          </div>

          <h2 className="mt-3 text-base font-bold text-white flex items-center gap-1">
            <span>Dr. Mina AI</span>
            <Sparkles size={13} className="text-[#97cde5]" />
          </h2>

          <div className="mt-1 text-xs">
            {callState === "speaking" && (
              <span className="text-[#97cde5] font-medium flex items-center gap-1">
                <Radio size={12} className="animate-pulse" />
                {language === "bn" ? "মিনা কথা বলছে..." : "Mina is speaking..."}
              </span>
            )}
            {callState === "listening" && (
              <span className="text-[#c8dfaa] font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c8dfaa] inline-block animate-ping" />
                {language === "bn" ? "আপনার কথা শুনছি, বলুন..." : "Listening to you, speak..."}
              </span>
            )}
            {callState === "thinking" && (
              <span className="text-white/80 font-medium flex items-center gap-1">
                <Loader2 size={12} className="animate-spin text-[#97cde5]" />
                {language === "bn" ? "মিনা ভাবছে..." : "Mina is thinking..."}
              </span>
            )}
          </div>

          <div className="mt-1 text-[11px] font-mono text-white/40">
            {formatTime(callDuration)}
          </div>

          {/* Live Subtitle Transcript & Send Trigger */}
          <div className="mt-3.5 w-full rounded-xl bg-white/5 p-2.5 text-center text-xs text-white/90 border border-white/10">
            <p className="italic leading-snug line-clamp-2">
              &ldquo;
              {liveTranscript ||
                (language === "bn"
                  ? "আপনার সমস্যা বা জিজ্ঞাসা বলুন..."
                  : "Tell me your symptoms or query...")}
              &rdquo;
            </p>
            {callState === "listening" && liveTranscript && liveTranscript.length > 2 && (
              <button
                onClick={() => {
                  const text = accumulatedSpeechRef.current.trim() || liveTranscript.trim();
                  if (text) {
                    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
                    accumulatedSpeechRef.current = "";
                    handleVoiceQuery(text);
                  }
                }}
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#97cde5] px-3 py-0.5 text-[11px] font-semibold text-[#28262a] hover:brightness-95 active:scale-95 transition-all shadow-xs"
                title="Send speech immediately"
              >
                <span>{language === "bn" ? "বলা শেষ (উত্তর শুনুন) ➔" : "Done Speaking ➔"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-around border-t border-white/10 bg-black/30 px-4 py-3">
          <button
            onClick={toggleMute}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95 ${
              isMuted
                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title={isMuted ? "Unmute Mic" : "Mute Mic"}
          >
            {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
          </button>

          <button
            onClick={toggleSpeaker}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform active:scale-95 ${
              !isSpeakerOn
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            title={isSpeakerOn ? "Mute Speaker" : "Unmute Speaker"}
          >
            {isSpeakerOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={() => {
              stopAll();
              onSwitchToChat();
            }}
            className="flex h-9 items-center gap-1 rounded-full bg-white/10 px-2.5 text-xs text-white hover:bg-white/20 transition-transform active:scale-95"
            title="Open Text Chat & Summary"
          >
            <MessageSquare size={13} />
            <span>{language === "bn" ? "চ্যাট" : "Chat"}</span>
          </button>

          <button
            onClick={handleEnd}
            className="flex h-9 w-11 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-transform active:scale-95"
            title="End Call"
          >
            <PhoneOff size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
