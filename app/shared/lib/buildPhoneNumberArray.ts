export function buildPhoneNumberArray(
  phoneNumber1?: string | number | null,
  phoneNumber2?: string | number | null,
) {
  const phoneNumbers: string[] = [];
  if (typeof phoneNumber1 === "string" && phoneNumber1 !== "") {
    phoneNumbers.push(phoneNumber1);
  }
  if (typeof phoneNumber2 === "string" && phoneNumber2 !== "") {
    phoneNumbers.push(phoneNumber2);
  }
  return phoneNumbers;
}
