import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

const canvasToBlob = (canvas, type = "image/jpeg", quality = 0.82) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to convert PDF page to image"));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
};

export const extractTextFromPdf = async (file, onProgress) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const pages = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");

    pages.push(pageText);

    if (onProgress) {
      onProgress(Math.round((pageNum / pdf.numPages) * 100));
    }
  }

  return {
    text: pages.join("\n\n"),
    pageCount: pdf.numPages,
  };
};

export const rasterizePdfToImageBlobs = async (file, onProgress) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const pageImages = [];

  const baseScale = file.size > 1024 * 1024 ? 1 : 1.25;
  const scaleAttempts = [baseScale, baseScale * 0.8, baseScale * 0.65, 0.55];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    let blob = null;

    for (const scale of scaleAttempts) {
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) {
        throw new Error("Canvas context is unavailable for OCR rendering");
      }

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport }).promise;
      blob = await canvasToBlob(canvas, "image/jpeg", scale > 1 ? 0.86 : 0.8);

      if (blob.size <= 900 * 1024 || scale === scaleAttempts[scaleAttempts.length - 1]) {
        break;
      }
    }

    const pageBaseName = file.name.replace(/\.pdf$/i, "") || "page";
    pageImages.push({
      blob,
      filename: `${pageBaseName}-page-${pageNum}.jpg`,
      pageNumber: pageNum,
    });

    if (onProgress) {
      onProgress(Math.round((pageNum / pdf.numPages) * 100));
    }
  }

  return pageImages;
};
