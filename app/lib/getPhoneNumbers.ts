type PhoneRecord = {
  telefono_comercial_1?: string | undefined;
  telefono_comercial_2?: string | undefined;
  telefono_comercial_3?: string | undefined;
  telefono_comercial_4?: string | undefined;
  telefono_comercial_5?: string | undefined;
};

export function getPhoneNumbers(record: PhoneRecord) {
  return Object.entries(record)
    .filter(
      ([key, value]) =>
        key.startsWith("telefono_comercial") &&
        typeof value === "string" &&
        value.trim() !== "" &&
        value.length >= 7,
    )
    .map(([, value]) => String(value));
}
