import jschardet from "jschardet";
import iconv from "iconv-lite";

const MAX_DEPTH = 5;

export function decodeBase64(str?: string, depth = 0) {
  if (!str || depth == MAX_DEPTH) {
    return str;
  }

  const buffer = Buffer.from(str, "base64");
  const encodings = jschardet.detectAll(buffer);

  for (const { encoding, confidence } of encodings) {
    if (confidence < 0.75) {
      return str;
    }
    try {
      const decoded = iconv.decode(buffer, encoding);
      if (encoding === "ascii" && confidence > 0.85) {
        return decodeBase64(decoded, depth + 1);
      }
      return decoded.trim();
    } catch (err) {
      console.log("decodeBase64 decoding failed:", encoding, str, err);
    }
  }

  return str;
}
