export function drawImageWithYOffset(
  file: File,
  yOffset: number,
  cwidth: number,
  cheight: number,
  trimSides: number = 0,
  trimTop: number = 0,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event: ProgressEvent<FileReader>) {
      if (!event.target?.result || typeof event.target.result !== "string") {
        return reject(new Error("Invalid image data."));
      }

      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          return reject(new Error("Could not get canvas context."));
        }

        // Set canvas size to image dimensions plus offset
        canvas.width = cwidth;
        canvas.height = cheight;

        // Clear with transparent background
        // ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image with given Y offset
        const yPos = yOffset > 0 ? yOffset : 0;

        const sy = trimTop;
        const sx = trimSides;
        const sw = img.width - trimSides * 2;
        const sh = img.height - trimSides;

        ctx.drawImage(img, sx, sy, sw, sh, 0, yPos, cwidth, cwidth);

        // Return base64 data
        const base64Image: string = canvas.toDataURL("image/png");
        resolve(base64Image);
      };

      img.onerror = function () {
        reject(new Error("Failed to load image."));
      };

      img.src = event.target.result;
    };

    reader.onerror = function () {
      reject(new Error("Failed to read file."));
    };

    reader.readAsDataURL(file);
  });
}
