/**
 * Client-side image compression utility.
 *
 * Resizes and compresses image files (JPEG, PNG, WEBP) in the browser before upload.
 * Guarantees images stay strictly under 1.5 MB to easily comply with Vercel's 4.5 MB
 * Serverless Function request payload limit, while preserving high sharpness and
 * legibility for official medical documents, licenses, and certificates.
 */
export async function compressImageIfNeeded(
  file: File,
  maxSizeBytes: number = 1.8 * 1024 * 1024, // 1.8 MB target
  maxDimension: number = 1600, // 1600px maximum width or height
  quality: number = 0.80, // 80% JPEG quality
): Promise<File> {
  // Only process images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  // Skip GIFs (animated) and SVGs
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }

  // If already under 1MB, no need to touch it
  if (file.size <= 1024 * 1024) {
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

      // Always output JPEG for photographic and scan documents to achieve optimal compression
      const outputType = "image/jpeg";

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // If blob is smaller than original, use it; otherwise fallback
          if (blob.size < file.size) {
            const baseName = file.name.replace(/\.[^/.]+$/, "");
            const newFile = new File([blob], `${baseName}.jpg`, {
              type: outputType,
              lastModified: Date.now(),
            });

            // If still over target size, perform a secondary compression pass
            if (newFile.size > maxSizeBytes) {
              const canvas2 = document.createElement("canvas");
              const scale = 0.8;
              canvas2.width = Math.round(width * scale);
              canvas2.height = Math.round(height * scale);
              const ctx2 = canvas2.getContext("2d");
              if (ctx2) {
                ctx2.imageSmoothingEnabled = true;
                ctx2.imageSmoothingQuality = "high";
                ctx2.drawImage(canvas, 0, 0, canvas2.width, canvas2.height);
                canvas2.toBlob(
                  (blob2) => {
                    if (blob2 && blob2.size < newFile.size) {
                      resolve(
                        new File([blob2], `${baseName}.jpg`, {
                          type: outputType,
                          lastModified: Date.now(),
                        })
                      );
                    } else {
                      resolve(newFile);
                    }
                  },
                  outputType,
                  0.70
                );
                return;
              }
            }

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
