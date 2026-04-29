import { FileText, Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

export const PdfDropzone = ({ onFileAccepted, disabled }) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled,
    onDropAccepted: (files) => onFileAccepted(files[0]),
  });

  return (
    <section className="card">
      <h3>Upload PDF Judgment</h3>
      <p className="field-hint">Scanned PDFs without text are sent to backend OCR automatically. Files above 1 MB are compressed before OCR.</p>
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "dragging" : ""} ${disabled ? "disabled" : ""}`}
      >
        <input {...getInputProps()} />
        <Upload size={22} />
        <p>
          {isDragActive
            ? "Drop the PDF here"
            : "Drag and drop judgment PDF, or click to browse"}
        </p>
      </div>
      {acceptedFiles[0] && (
        <p className="file-chip">
          <FileText size={14} /> {acceptedFiles[0].name}
        </p>
      )}
    </section>
  );
};
