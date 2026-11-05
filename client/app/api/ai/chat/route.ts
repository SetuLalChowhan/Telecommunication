import { NextRequest, NextResponse } from "next/server";

interface MessageItem {
  role: "user" | "assistant" | "model";
  content: string;
}

const SYSTEM_INSTRUCTION = `You are "Dr. Mina" (মীনাহ/মিনা), a professional, empathetic, and highly knowledgeable Telehealth Medical Consultant and Guide for "TeleHealth" (Care Anytime, Anywhere).

CONVERSATIONAL CONTINUITY & GREETING RULES (VERY IMPORTANT):
- INITIAL GREETING ONLY: Use "Assalamu Alaikum" (or "আসসালামু আলাইকুম") ONLY in the very first turn of a conversation if the user has not greeted yet.
- NEVER REPEAT GREETINGS: In subsequent turns or ongoing conversation, NEVER repeat "Assalamu Alaikum", NEVER say "Hello again", and NEVER re-introduce yourself ("I am Mina...").
- BEHAVE LIKE A REAL HUMAN DOCTOR: Act as an attentive, professional physician in a live ongoing consultation. Directly address the patient's exact words, ask clarifying medical questions, provide clear actionable guidance, and build seamlessly on everything said earlier in the conversation memory.
- NO REPETITIVE ROBOTIC LANGUAGE: Do not repeat standard disclaimers on every single line or use boilerplate robotic phrases. Keep tone warm, natural, empathetic, and human.

LANGUAGE AUTO-DETECTION & RESPECT:
- If the patient speaks/writes in Bangla (বাংলা) or uses Bengali script, answer in fluent, respectful, and professional Bangla.
- If the patient speaks/writes in English, answer in polite, articulate, professional English.
- If the patient speaks in Banglish (e.g. "amar matha betha"), understand and respond in warm, clear Bangla (or English if requested).

SUMMARY CAPABILITY:
- If the user asks for a summary ("summary", "summarize", "সারাংশ", "রিপোর্ট"), provide a neat, structured bulleted summary of their symptoms, guidance, and recommended specialist so the patient can save it as their consultation record.

YOUR ROLES & CAPABILITIES:
1. Medical Triage & Health Guide:
   - Provide medically sound, evidence-based, compassionate health advice for symptoms (fever, cold, headache, digestion, skin issues, hypertension, diabetes, maternal & child care, wellness, nutrition, stress).
   - Ask helpful clarifying questions (duration, severity, accompanying symptoms).
   - Offer safe, non-medicinal home care, hydration, rest, and lifestyle tips.
   - Clarify which medical specialist the user should see (e.g., General Physician, Cardiologist, Dermatologist, Gynecologist, Pediatrician, Neurologist, Psychiatrist).
   - Medical Safety Disclaimer: When addressing symptoms, gently remind the patient that your advice is for guidance and educational purposes and not a substitute for in-person clinical diagnosis or prescription.
   - Emergency Red Flags: If severe warning signs are detected (e.g. crushing chest pain, severe shortness of breath, sudden facial drooping/weakness, uncontrolled bleeding, severe head trauma, poisoning), urgently advise immediate physical hospital emergency care or dialing emergency services (such as 999 in Bangladesh).

2. TeleHealth Platform A to Z Guide:
   - You know everything about the TeleHealth website and assist users step-by-step:
     * Find Doctors: [Browse Doctors](/doctors) - filter by specialty, rating, consultation fees, and read doctor profiles.
     * Online Consultations: [Consult Online](/consult) - instant and scheduled video/audio doctor visits.
     * Appointments: Patients can book slots, pay fees, and view their appointments in the [Patient Portal](/patient).
     * Prescriptions & Medical Reports: Access digital prescriptions and test reports securely inside [Patient Dashboard](/patient).
     * Doctor Registration & Verification: Qualified physicians can apply at [Register as Doctor](/register) and verify credentials at [Doctor Verification](/doctor-verification).
     * Health Articles: Read expert medical articles and lifestyle tips at [Health Blogs](/blogs).
     * Support & Assistance: Connect with support at [Contact Us](/contact) or learn about the platform at [About TeleHealth](/about).

3. Formatting Guidelines:
   - In Text Chat Mode: Use clean formatting, bold key takeaways, bullet points, and markdown links (e.g., [ডাক্তারদের তালিকা দেখুন](/doctors) or [Find a Specialist](/doctors)).
   - In Voice Call Mode: Keep replies concise (2 to 3 sentences maximum), spoken in a warm conversational tone, without markdown formatting, bullet symbols, or URLs, so it sounds like a real, natural doctor on a telephone call.
`;

function getIntelligentFallback(userMessage: string, language: string, isCallMode: boolean): string {
  const text = (userMessage || "").toLowerCase();
  const isBangla = language === "bn" || /[\u0980-\u09FF]/.test(userMessage) || text.includes("kemon") || text.includes("daktar") || text.includes("apnar") || text.includes("amar") || text.includes("somossa");

  if (isCallMode) {
    if (isBangla) {
      if (text.includes("ডাক্তার") || text.includes("booking") || text.includes("অ্যাপয়েন্টমেন্ট")) {
        return "আমাদের টেলিহেলথ প্ল্যাটফর্মে অভিজ্ঞ ডাক্তারদের সাথে সরাসরি ভিডিও বা অডিও কলে পরামর্শ নিতে পারেন। ডক্টরস অপশন থেকে আপনার পছন্দের বিশেষজ্ঞ বেছে নিন।";
      }
      if (text.includes("মাথা") || text.includes("জ্বর") || text.includes("ব্যথা") || text.includes("অসুস্থ")) {
        return "আপনার লক্ষণগুলো শুনলাম। পর্যাপ্ত বিশ্রাম নিন ও প্রচুর পানি পান করুন। লক্ষণ তীব্র হলে অবিলম্বে একজন চিকিৎসকের সাথে পরামর্শ করার অনুরোধ করছি।";
      }
      return "আসসালামু আলাইকুম! আমি টেলিহেলথের এআই পরামর্শক মিনা। আপনার স্বাস্থ্য সম্পর্কিত যেকোনো জিজ্ঞাসা বা ওয়েবসাইট ব্যবহারে সাহায্য করতে আমি প্রস্তুত।";
    } else {
      if (text.includes("doctor") || text.includes("appointment") || text.includes("book")) {
        return "You can easily find and book verified specialists on our platform. Head over to the Doctors page to select your physician and schedule a consultation.";
      }
      if (text.includes("fever") || text.includes("headache") || text.includes("pain") || text.includes("sick")) {
        return "I understand your symptoms. Please ensure you stay hydrated and well-rested. If symptoms persist or worsen, please consult a certified doctor on our platform.";
      }
      return "Assalamu Alaikum! I am Mina, your TeleHealth AI medical consultant and guide. How may I assist you today?";
    }
  }

  // Text Mode Fallback
  if (isBangla) {
    if (text.includes("সারাংশ") || text.includes("summary")) {
      return `**পরামর্শের সারাংশ (Consultation Summary):**

- **আলোচিত বিষয়:** স্বাস্থ্য জিজ্ঞাসা ও টেলিহেলথ সেবা নির্দেশিকা
- **পরামর্শ:** পর্যাপ্ত বিশ্রাম, সুষম খাবার ও চিকিৎসকের তত্ত্বাবধান গ্রহণ করুন
- **পরবর্তী পদক্ষেপ:** প্রয়োজনে সরাসরি [অভিজ্ঞ ডাক্তার বুক করুন](/doctors) বা জরুরি প্রয়োজনে ৯৯৯ নম্বরে যোগাযোগ করুন।`;
    }

    if (text.includes("ডাক্তার") || text.includes("বুকিং") || text.includes("booking") || text.includes("অ্যাপয়েন্টমেন্ট")) {
      return `**ডাক্তার দেখানো ও বুকিং নির্দেশিকা:**

১. **ডাক্তার খুঁজুন:** [এখানে ক্লিক করে ডাক্তারদের তালিকা দেখুন](/doctors)। আপনি স্পেশালিটি, ফি ও রেটিং অনুযায়ী ফিল্টার করতে পারবেন।
২. **অ্যাপয়েন্টমেন্ট নির্ধারণ:** ডাক্তারের প্রোফাইল থেকে সুবিধাজনক তারিখ ও সময় নির্বাচন করুন।
৩. **অনলাইন কনসাল্টেশন:** [সরাসরি কনসাল্টেশনে যান](/consult) ভিডিও বা অডিও কলের মাধ্যমে ডাক্তারের পরামর্শ গ্রহণ করতে।

আপনার কি কোনো নির্দিষ্ট বিষয়ের বিশেষজ্ঞ ডাক্তার প্রয়োজন? আমাকে জানাতে পারেন!`;
    }

    if (text.includes("জ্বর") || text.includes("মাথা") || text.includes("ঠান্ডা") || text.includes("কাশি") || text.includes("ব্যথা")) {
      return `আপনার লক্ষণটি লক্ষ্য করলাম। প্রাথমিক নির্দেশিকা:

- **বিশ্রাম ও হাইড্রেশন:** পর্যাপ্ত পরিমাণে পানি, স্যুপ বা তরল খাবার গ্রহণ করুন এবং বিশ্রাম নিন।
- **পর্যবেক্ষণ:** শরীরের তাপমাত্রা ও লক্ষণগুলোর তীব্রতা খেয়াল রাখুন।
- **সতর্কতা:** যদি তীব্র জ্বর, শ্বাসকষ্ট বা অসহ্য ব্যথা থাকে, তবে কোনো দেরি না করে দ্রুত হাসপাতালে যোগাযোগ করুন।

আমাদের প্ল্যাটফর্মে সাধারণ মেডিসিন ও অন্যান্য বিশেষজ্ঞ ডাক্তাররা সরাসরি অনলাইনে রোগী দেখছেন। আপনি চাইলে [অনলাইনে ডাক্তার বুকিং করতে পারেন](/doctors)।`;
    }

    return `আসসালামু আলাইকুম! আমি **মিনা (Mina)**, আপনার ডিজিটাল টেলিহেলথ সহকারী।

আমি আপনাকে যেভাবে সাহায্য করতে পারি:
- 🩺 **স্বাস্থ্য পরামর্শ ও লক্ষণ বিশ্লেষণ**
- 👨‍⚕️ **উপযুক্ত বিশেষজ্ঞ ডাক্তার ও [বুকিং নির্দেশিকা](/doctors)**
- 💻 **টেলিহেলথ ওয়েবসাইটের এ টু জেড ব্যবহার প্রণালী**
- 📄 **প্রেসক্রিপশন ও মেডিকেল রিপোর্ট সংক্রান্ত তথ্য**

আপনার শারীরিক কোনো সমস্যা বা ওয়েবসাইট সম্পর্কে কী জানতে চান?`;
  }

  // English fallback
  if (text.includes("summary") || text.includes("summarize")) {
    return `**Consultation Summary:**

- **Key Topic:** Health inquiry & TeleHealth platform navigation
- **Guidance:** Rest, proper hydration, and consult verified physicians for formal prescriptions
- **Next Step:** Explore our [Verified Doctors](/doctors) or connect via [Instant Consult](/consult).`;
  }

  if (text.includes("doctor") || text.includes("appointment") || text.includes("book")) {
    return `**How to Book an Appointment on TeleHealth:**

1. **Find a Specialist:** Visit our [Doctors Directory](/doctors) to filter by specialty, experience, and fee.
2. **Select Slot:** Choose an available date and time that fits your schedule.
3. **Teleconsultation:** Join your secure audio/video appointment via the [Consult Section](/consult).
4. **Prescription:** Receive digital prescriptions directly in your [Patient Portal](/patient).

Would you like a recommendation for a specific medical condition?`;
  }

  if (text.includes("fever") || text.includes("headache") || text.includes("cold") || text.includes("cough") || text.includes("pain")) {
    return `I hear you regarding your symptoms. Here is initial health guidance:

- **Rest & Hydration:** Ensure plenty of fluids (water, electrolytes) and restorative rest.
- **Monitoring:** Track your temperature and note when symptoms started or if they intensify.
- **When to Seek Immediate Care:** If you experience shortness of breath, severe chest discomfort, or stiff neck, visit emergency services immediately.

For a reliable diagnosis and tailored prescription, you can quickly consult a verified physician on TeleHealth: [Find a Doctor Now](/doctors).`;
  }

  return `Assalamu Alaikum! I'm **Mina**, your dedicated TeleHealth AI Medical Consultant and Platform Navigator.

Here is what I can help you with:
- 🩺 **Symptom guidance & health triage**
- 👨‍⚕️ **Finding the right specialist & [Booking Appointments](/doctors)**
- 💻 **Navigating all features of TeleHealth A to Z**
- 🚑 **Emergency guidelines & 24/7 care support**

Feel free to ask a medical question or inquire about how to use any part of the website!`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages = [], language = "auto", mode = "chat" } = body;

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.gemini_api_key ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      "";

    const lastMessage =
      messages.length > 0 ? messages[messages.length - 1].content : "";

    // If no API key is available, return intelligent triage response
    if (!apiKey) {
      const fallbackReply = getIntelligentFallback(lastMessage, language, mode === "call");
      return NextResponse.json({ reply: fallbackReply, source: "fallback" });
    }

    // Format Gemini contents payload
    const formattedContents = messages.map((m: MessageItem) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // If call mode, enhance system instruction for ultra-fast, natural spoken output
    const modeInstruction =
      mode === "call"
        ? "\n\nCRITICAL LIVE VOICE CALL RULE (FAST & HUMAN): You are on a phone call. Speak in strictly 1 to 2 short, warm, and natural sentences (maximum 20 to 25 words). Answer immediately and directly without any introductory filler. NEVER use markdown asterisks (**), bullets, or URLs. Speak with natural human flow."
        : "\n\nFormat your responses neatly with markdown, bold points, and relevant links when referencing pages like /doctors, /consult, /blogs, /contact, /patient.";

    // Detect actual language of user's last message to honor dynamic switching
    const isUserMessageBangla =
      /[\u0980-\u09FF]/.test(lastMessage) ||
      /\b(amar|amake|kemon|achen|daktar|apnar|somossa|jor|matha|pet|betha|korte|parbo|ki|keno)\b/i.test(
        lastMessage
      );

    let languageInstruction = "";
    if (isUserMessageBangla) {
      languageInstruction =
        "\n\nCRITICAL LANGUAGE DIRECTIVE: The user communicated in Bangla. You MUST respond completely, naturally, and warmly in polite, professional Bangla (বাংলা).";
    } else if (language === "bn") {
      languageInstruction =
        "\n\nPlease respond in polite, professional, and empathetic Bangla (বাংলা).";
    } else {
      languageInstruction =
        "\n\nCRITICAL LANGUAGE DIRECTIVE: The user communicated in English. You MUST respond in polite, articulate, professional English.";
    }

    const continuityInstruction =
      messages.length > 1
        ? "\n\nCRITICAL: This is an ongoing conversation (Turn #" +
          messages.length +
          "). DO NOT say 'Assalamu Alaikum' again. DO NOT say 'I am Mina'. Respond directly, naturally, and warmly to their statement like a real human doctor."
        : "";

    const fullSystemInstruction =
      SYSTEM_INSTRUCTION +
      modeInstruction +
      languageInstruction +
      continuityInstruction;

    // Call Gemini 2.5 Flash API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: fullSystemInstruction }],
        },
        contents: formattedContents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: mode === "call" ? 95 : 800,
        },
      }),
    });

    if (!geminiResponse.ok) {
      console.warn("Gemini API error status:", geminiResponse.status);
      const fallbackReply = getIntelligentFallback(lastMessage, language, mode === "call");
      return NextResponse.json({ reply: fallbackReply, source: "fallback" });
    }

    const data = await geminiResponse.json();
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!candidateText) {
      const fallbackReply = getIntelligentFallback(lastMessage, language, mode === "call");
      return NextResponse.json({ reply: fallbackReply, source: "fallback" });
    }

    return NextResponse.json({ reply: candidateText, source: "gemini" });
  } catch (error) {
    console.error("Mina AI Chat API error:", error);
    const fallbackReply = getIntelligentFallback("", "auto", false);
    return NextResponse.json({ reply: fallbackReply, source: "fallback" });
  }
}
