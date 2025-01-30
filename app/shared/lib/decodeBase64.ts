import jschardet from "jschardet";
import iconv from "iconv-lite";

export function decodeBase64(base64Text?: string) {
  if (!base64Text) {
    return null;
  }
  const buffer = Buffer.from(base64Text, "base64");
  const { encoding } = jschardet.detect(buffer) ?? "ISO-8859-1";
  return iconv.decode(buffer, encoding).trim();
}
