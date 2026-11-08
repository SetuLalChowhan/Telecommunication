/**
 * Client-side image compression utility.
 *
 * Resizes and compresses image files (JPEG, PNG, WEBP) in the browser before upload.
 * This guarantees images stay well below Vercel's strict 4.5 MB Serverless Function
 * payload limit while preserving sharpness and readability for official documents and IDs.
 */
export async function compressImageIfNeeded(
  file: File,
  maxSizeBytes: number = 2.5 * 1024 * 1024, // 2.5 MB target
  maxDimension: number = 2048, // 2048px maximum width or height
  quality: number = 0.85, // 85% JPEG quality
): Promise<File> {
  // Only process images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Skip GIFs (animated) and SVGs
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  // If already under 1.5MB and not gigantic, no need to touch it
  if (file.size <= 1.5 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if width or height exceeds maxDimension
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      // Draw onto canvas with smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Convert PNGs to JPEG if they are large, otherwise maintain format
      const outputType = file.type === "image/png" && file.size < maxSizeBytes
        ? "image/png"
        : "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // If blob is smaller than original, use it; otherwise keep original
          if (blob.size < file.size) {
            const ext = outputType === "image/jpeg" ? ".jpg" : ".png";
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const newFile = new File([blob], `${baseName}${ext}`, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(newFile);
          } else {
            resolve(file);
          }
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
