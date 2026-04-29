const { PDFDocument } = require("pdf-lib");

const ONE_MB = 1024 * 1024;

const compressPdfBuffer = async (buffer) => {
  const originalSize = buffer.length;

  if (originalSize <= ONE_MB) {
    return {
      buffer,
      originalSize,
      compressedSize: originalSize,
      compressionApplied: false,
    };
  }

  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

  const compressedPrimary = Buffer.from(
    await pdfDoc.save({ useObjectStreams: true })
  );
  const compressedSecondary = Buffer.from(
    await pdfDoc.save({ useObjectStreams: false })
  );

  const bestBuffer =
    compressedPrimary.length <= compressedSecondary.length
      ? compressedPrimary
      : compressedSecondary;

  return {
    buffer: bestBuffer,
    originalSize,
    compressedSize: bestBuffer.length,
    compressionApplied: bestBuffer.length < originalSize,
  };
};

module.exports = {
  compressPdfBuffer,
};
