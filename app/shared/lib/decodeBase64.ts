import jschardet from "jschardet";
import iconv from "iconv-lite";

export function decodeBase64(base64Text?: string) {
  if (!base64Text) {
    return null;
  }
  const buffer = Buffer.from(base64Text, "base64");
  const encodings = jschardet.detectAll(buffer) ?? "ISO-8859-1";

  for (const { encoding, confidence } of encodings) {
    if (confidence < 0.75) {
      return "";
    }
    try {
      const decoded = iconv.decode(buffer, encoding).trim();
      return decoded;
    } catch {}
  }
}
