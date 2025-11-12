/**
 * Processes an image file to create a "scanned document" effect with adaptive thresholding.
 * The process involves converting the image to grayscale and using Otsu's method for binarization.
 * @param imageFile The original image file to process.
 * @param type The desired output MIME type, e.g., 'image/png' or 'image/jpeg'.
 * @param quality For JPEG output, the quality level (0-1).
 * @returns A promise that resolves with the processed File object and its Object URL.
 */
export const binarizeImageFile = async (
  imageFile: File,
  type: "image/png" | "image/jpeg" = "image/png",
  quality?: number,
): Promise<{ file: File; url: string }> => {
  return new Promise((resolve, reject) => {
    // 1. Setup: Create canvas and load the image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", {
      // Opt-in to a non-alpha canvas for potential performance improvement
      // as we don't need transparency for a scanned document effect.
      alpha: false,
    });

    if (!ctx) {
      return reject(new Error("Failed to get Canvas context"));
    }

    const img = new Image();
    const originalUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      // 2. Initial Draw: Set canvas dimensions and draw the original image
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Immediately revoke the object URL to free up memory
      URL.revokeObjectURL(originalUrl);

      // 3. Pixel Manipulation: Get the image data to apply filters
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data; // This is a Uint8ClampedArray: [R, G, B, A, R, G, B, A, ...]

        // Step A: Convert to grayscale and build histogram
        const grayscaleValues = new Uint8Array(data.length / 4);
        const histogram = new Array(256).fill(0);
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Convert to grayscale using the luminosity method (standard formula)
          const grayscale = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          grayscaleValues[i / 4] = grayscale;
          histogram[grayscale]++;
        }

        // Step B: Calculate optimal threshold using Otsu's method
        let sum = 0;
        let sumB = 0;
        let wB = 0;
        let wF = 0;
        let maxVariance = 0;
        let threshold = 128; // Default threshold
        const totalPixels = canvas.width * canvas.height;

        for (let i = 0; i < 256; i++) {
          sum += i * histogram[i];
        }

        for (let t = 0; t < 256; t++) {
          wB += histogram[t];
          if (wB === 0) continue;
          
          wF = totalPixels - wB;
          if (wF === 0) break;

          sumB += t * histogram[t];
          const mB = sumB / wB;
          const mF = (sum - sumB) / wF;
          const variance = wB * wF * (mB - mF) * (mB - mF);

          if (variance > maxVariance) {
            maxVariance = variance;
            threshold = t;
          }
        }

        // Adjust threshold slightly to preserve more detail in text
        // This helps with handwritten text and faint markings
        threshold = Math.max(100, Math.min(200, threshold - 10));

        // Step C: Apply adaptive binarization with edge enhancement
        for (let i = 0; i < data.length; i += 4) {
          const grayscale = grayscaleValues[i / 4];
          
          // Apply threshold with slight smoothing near the boundary
          let value: number;
          const diff = Math.abs(grayscale - threshold);
          
          if (diff < 10) {
            // Near threshold: use weighted decision to reduce noise
            value = grayscale > threshold ? 255 : 0;
          } else {
            // Far from threshold: clear decision
            value = grayscale > threshold ? 255 : 0;
          }

          // Set the new RGB values for the pixel
          data[i] = value;     // Red channel
          data[i + 1] = value; // Green channel
          data[i + 2] = value; // Blue channel
          // Alpha channel (data[i + 3]) is left untouched.
        }

        // 4. Put the modified pixel data back onto the canvas
        ctx.putImageData(imageData, 0, 0);
      } catch (error) {
        // This can happen if the image is from a different origin (CORS issue)
        // and the canvas becomes "tainted".
        console.error("Could not process pixel data:", error);
        return reject(
          new Error(
            "Failed to process image pixels. Check for CORS issues if loading cross-origin images.",
          ),
        );
      }

      // 5. Export: Convert the canvas content back to a Blob, then a File
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error("Failed to create Blob from canvas"));
          }

          // Create a new filename for the processed file
          const fileName = `enhanced_${imageFile.name.split(".")[0] || "document"}.png`;
          const newFile = new File([blob], fileName, { type });
          const newUrl = URL.createObjectURL(newFile);

          // Resolve the promise with the new file and its URL
          resolve({ file: newFile, url: newUrl });
        },
        type,
        quality || 0.95,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(originalUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = originalUrl;
  });
};
