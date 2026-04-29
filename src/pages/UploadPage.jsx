import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExtractionResultPanel } from "../components/upload/ExtractionResultPanel";
import { PdfDropzone } from "../components/upload/PdfDropzone";
import { useToast } from "../hooks/useToast";
import { extractJudgmentData, ocrExtractFile } from "../services/api";
import { useAppStore } from "../store/useAppStore";
import { extractTextFromPdf, rasterizePdfToImageBlobs } from "../utils/pdfExtractor";
import { SAMPLE_JUDGMENT_TEXT } from "../utils/sampleJudgment";

export const UploadPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const addExtractedCase = useAppStore((state) => state.addExtractedCase);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [isCallingAI, setIsCallingAI] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [textLength, setTextLength] = useState(0);
  const [latestCaseId, setLatestCaseId] = useState("");
  const [sourceMode, setSourceMode] = useState("text-layer");
  const [fileMetadata, setFileMetadata] = useState({
    fileName: null,
    pageCount: null,
    extractionTimestamp: null,
  });

  const runExtractionFlow = async (judgmentText, demoMode, metadata) => {
    setIsCallingAI(true);

    try {
      const structured = await extractJudgmentData({ judgmentText, demoMode, metadata });
      setExtractedData(structured);
      setTextLength(judgmentText.length);

      const caseId = addExtractedCase({
        extractedData: structured,
        sourceText: judgmentText,
        demoMode,
      });
      setLatestCaseId(caseId);

      toast.success("Judgment extracted successfully");
      setProgress(100);
    } catch (error) {
      toast.error(error.message || "AI extraction failed");
    } finally {
      setIsCallingAI(false);
    }
  };

  const needsOcr = (judgmentText) => judgmentText.replace(/\s+/g, "").length < 120;

  const extractWithRasterOcr = async (pdfFile) => {
    const pageImages = await rasterizePdfToImageBlobs(pdfFile, (renderProgress) => {
      setProgress(Math.max(10, Math.round(renderProgress * 0.45)));
    });

    const extractedPages = [];

    for (let index = 0; index < pageImages.length; index += 1) {
      const pageImage = pageImages[index];
      const result = await ocrExtractFile(pageImage.blob, pageImage.filename);
      extractedPages.push(result.text);
      setProgress(45 + Math.round(((index + 1) / pageImages.length) * 45));
    }

    return extractedPages.join("\n\n");
  };

  const handleFileExtract = async () => {
    if (!file) {
      toast.warning("Please upload a PDF file first");
      return;
    }

    try {
      setIsExtractingPdf(true);
      setProgress(0);
      const extracted = await extractTextFromPdf(file, setProgress);
      const metadata = {
        fileName: file.name,
        pageCount: extracted.pageCount,
        extractionTimestamp: new Date().toISOString(),
      };
      setFileMetadata(metadata);

      if (needsOcr(extracted.text)) {
        toast.info("No readable text layer detected. Rasterizing pages for OCR fallback.");
        setSourceMode("ocr-raster");
        setProgress(15);
        const ocrText = await extractWithRasterOcr(file);
        await runExtractionFlow(ocrText, false, metadata);
      } else {
        setSourceMode("text-layer");
        await runExtractionFlow(extracted.text, false, metadata);
      }
    } catch (error) {
      toast.error(error.message || "Failed to read PDF");
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleDemoMode = async () => {
    setProgress(100);
    await runExtractionFlow(SAMPLE_JUDGMENT_TEXT, true, {
      fileName: "Demo_Land_Acquisition_Judgment.pdf",
      pageCount: 4,
      extractionTimestamp: new Date().toISOString(),
    });
  };

  return (
    <section className="page-content">
      <div className="page-banner">
        <div className="page-banner-top">
          <div>
            <div className="page-banner-eyebrow">Judgment intake</div>
            <h2>Judgment Intake and Structuring</h2>
            <p className="subtle-copy">
              Upload a court order PDF, use demo mode, or fall back to OCR when the document is a scanned image. PDFs above 1 MB are compressed automatically before OCR.
            </p>
          </div>
          <div className="state-card neutral">
            <strong>Current source</strong>
            <p>{sourceMode === "ocr-raster" ? "OCR raster fallback" : "Text layer extraction"}</p>
          </div>
        </div>

        <div className="workflow-strip">
          <div className="workflow-step">
            <strong>01</strong>
            <p>Drop the judgment PDF or use the demo file.</p>
          </div>
          <div className="workflow-step">
            <strong>02</strong>
            <p>Use browser text extraction first, then backend OCR if needed.</p>
          </div>
          <div className="workflow-step">
            <strong>03</strong>
            <p>Review the structured case and proceed to action planning.</p>
          </div>
        </div>
      </div>

      <div className="split-two">
        <div>
          <PdfDropzone onFileAccepted={setFile} disabled={isExtractingPdf || isCallingAI} />
          <section className="card compact-card">
            <div className="button-row">
              <button
                type="button"
                className="btn primary"
                disabled={isExtractingPdf || isCallingAI}
                onClick={handleFileExtract}
              >
                {isExtractingPdf ? "Extracting PDF..." : isCallingAI ? "Processing AI..." : "Extract and Analyze"}
              </button>
              <button
                type="button"
                className="btn secondary"
                disabled={isCallingAI}
                onClick={handleDemoMode}
              >
                Run Demo Mode
              </button>
              {latestCaseId && (
                <button
                  type="button"
                  className="btn success"
                  onClick={() => navigate(`/review/${latestCaseId}`)}
                >
                  Open Review Workspace
                </button>
              )}
            </div>
            <div className="info-strip">
              <div className="info-tile">
                <strong>Extraction mode</strong>
                <span>{sourceMode === "ocr-raster" ? "OCR raster fallback" : "Text-layer read"}</span>
              </div>
              <div className="info-tile">
                <strong>Compression</strong>
                <span>Auto-applied for oversized OCR uploads</span>
              </div>
              <div className="info-tile">
                <strong>Result readiness</strong>
                <span>{latestCaseId ? "Ready for review" : "Awaiting extraction"}</span>
              </div>
            </div>
            <div className="progress-block">
              <label>Extraction Progress</label>
              <progress max={100} value={progress} />
              <p>{progress}% complete</p>
            </div>
            {textLength > 0 && <p className="muted">Extracted text size: {textLength.toLocaleString()} characters</p>}
          </section>
        </div>
        <ExtractionResultPanel data={extractedData} caseId={latestCaseId} fileMetadata={fileMetadata} />
      </div>
    </section>
  );
};
