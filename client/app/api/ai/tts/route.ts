import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

function cleanText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_#`~>]/g, "")
    .replace(/^[-*•]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Fallback to Google TTS if Neural TTS has a network timeout
async function fetchGoogleTTSFallback(text: string, targetLang: string): Promise<Uint8Array | null> {
  try {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${targetLang}&q=${encodeURIComponent(
      text.slice(0, 160)
    )}`;
    const res = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawText = searchParams.get("text") || "";
    let lang = searchParams.get("lang") || "auto";

    if (!rawText.trim()) {
      return new NextResponse("Text parameter is required", { status: 400 });
    }

    const cleaned = cleanText(rawText);
    const isBangla =
      lang === "bn" ||
      (lang === "auto" && /[\u0980-\u09FF]/.test(cleaned));

    // Neural Human Voice selection (same studio-grade voices used by LiveAvatar / HeyGen)
    // bn-BD-NabanitaNeural: natural empathetic Bengali female doctor voice
    // en-US-JennyNeural: natural articulate English female physician voice
    const voiceName = isBangla ? "bn-BD-NabanitaNeural" : "en-US-JennyNeural";
    const targetLang = isBangla ? "bn" : "en";

    try {
      const tts = new MsEdgeTTS();
      await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

      const readableText = cleaned.slice(0, 240);
      const { audioStream } = tts.toStream(readableText);

      const chunks: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          resolve(); // Resolve to fallback if stream stalls
        }, 5000);

        audioStream.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        audioStream.on("end", () => {
          clearTimeout(timeout);
          resolve();
        });

        audioStream.on("error", (err: any) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      if (chunks.length > 0) {
        const combined = Buffer.concat(chunks);
        return new NextResponse(combined, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Accept-Ranges": "bytes",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
            "Content-Length": combined.length.toString(),
          },
        });
      }
    } catch (edgeErr) {
      console.warn("Neural TTS error, switching to fallback:", edgeErr);
    }

    // Secondary fallback
    const fallbackBuf = await fetchGoogleTTSFallback(cleaned, targetLang);
    if (fallbackBuf) {
      return new NextResponse(fallbackBuf as unknown as BodyInit, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Accept-Ranges": "bytes",
          "Cache-Control": "public, max-age=86400",
          "Content-Length": fallbackBuf.length.toString(),
        },
      });
    }

    return new NextResponse("TTS audio generation failed", { status: 500 });
  } catch (error) {
    console.error("TTS endpoint error:", error);
    return new NextResponse("TTS server error", { status: 500 });
  }
}
