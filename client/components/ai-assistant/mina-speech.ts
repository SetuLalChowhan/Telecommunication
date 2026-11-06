// Pure Human Neural Audio Engine for Mina AI (Zero synthetic/robot voice conflicts)

export interface SpeechRecognitionController {
  start: () => void;
  stop: () => void;
  abort: () => void;
  setLanguage: (lang: "bn" | "en") => void;
  isSupported: boolean;
}

let currentAudio: HTMLAudioElement | null = null;

export function unlockAudio(): void {
  if (typeof window !== "undefined") {
    try {
      const a = new Audio();
      a.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
      a.volume = 0.01;
      a.play().catch(() => {});
    } catch {}
  }
}

export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return "";
  return rawText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#`~>]/g, "")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectLanguage(text: string): "bn" | "en" {
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (
    /\b(amar|amake|kemon|achen|daktar|apnar|somossa|jor|matha|pet|betha|korte|parbo|ki|keno|bolun|shunchen)\b/i.test(
      text
    )
  ) {
    return "bn";
  }
  return "en";
}

/**
 * Hard cut of any currently playing audio.
 * Immediately pauses and disconnects audio buffer.
 */
export function stopMinaSpeaking(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.src = "";
    } catch {}
    currentAudio = null;
  }
}

/**
 * Single, clean Human Neural Voice Player.
 * ONLY uses the high-fidelity neural voice from /api/ai/tts.
 * Completely eliminates any conflicting second robotic voice!
 */
export function speakMinaText(
  text: string,
  language: "bn" | "en" | "auto" = "auto",
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: any) => void;
  }
): { cancel: () => void } {
  if (typeof window === "undefined") {
    callbacks?.onEnd?.();
    return { cancel: () => {} };
  }

  // Stop any previous speech immediately
  stopMinaSpeaking();

  const cleanText = cleanTextForSpeech(text);
  if (!cleanText) {
    callbacks?.onEnd?.();
    return { cancel: () => {} };
  }

  const targetLang = language === "auto" ? detectLanguage(cleanText) : language;
  const audioUrl = `/api/ai/tts?text=${encodeURIComponent(
    cleanText.slice(0, 320)
  )}&lang=${targetLang}`;

  try {
    const audio = new Audio(audioUrl);
    audio.preload = "auto";
    currentAudio = audio;

    audio.onplay = () => {
      callbacks?.onStart?.();
    };

    audio.onended = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
      callbacks?.onEnd?.();
    };

    audio.onerror = () => {
      if (currentAudio === audio) {
        currentAudio = null;
      }
      callbacks?.onEnd?.();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // If autoplay policy intervened, notify end gracefully
        if (currentAudio === audio) {
          currentAudio = null;
        }
        callbacks?.onEnd?.();
      });
    }

    return {
      cancel: () => stopMinaSpeaking(),
    };
  } catch (err) {
    callbacks?.onEnd?.();
    return {
      cancel: () => stopMinaSpeaking(),
    };
  }
}

/**
 * Speech Recognition controller with continuous dictation in Bangla or English.
 */
export function initSpeechRecognition(
  initialLanguage: "bn" | "en" = "bn",
  handlers: {
    onResult: (transcript: string, isFinal: boolean, detectedLang: "bn" | "en") => void;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: any) => void;
  }
): SpeechRecognitionController {
  if (typeof window === "undefined") {
    return {
      start: () => {},
      stop: () => {},
      abort: () => {},
      setLanguage: () => {},
      isSupported: false,
    };
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      start: () => {},
      stop: () => {},
      abort: () => {},
      setLanguage: () => {},
      isSupported: false,
    };
  }

  let currentLang = initialLanguage;
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = currentLang === "bn" ? "bn-BD" : "en-US";

  recognition.onstart = () => {
    handlers.onStart?.();
  };

  recognition.onend = () => {
    handlers.onEnd?.();
  };

  recognition.onerror = (event: any) => {
    if (event.error === "no-speech") return;
    handlers.onError?.(event.error);
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const transcript = (finalTranscript || interimTranscript).trim();
    const isFinal = Boolean(finalTranscript);
    const detected = detectLanguage(transcript);

    handlers.onResult(transcript, isFinal, detected);
  };

  return {
    start: () => {
      try {
        recognition.lang = currentLang === "bn" ? "bn-BD" : "en-US";
        recognition.start();
      } catch (e) {}
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {}
    },
    abort: () => {
      try {
        recognition.abort();
      } catch (e) {}
    },
    setLanguage: (lang: "bn" | "en") => {
      currentLang = lang;
      recognition.lang = lang === "bn" ? "bn-BD" : "en-US";
    },
    isSupported: true,
  };
}
