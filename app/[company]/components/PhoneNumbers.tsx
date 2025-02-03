import { Link } from "@radix-ui/themes";

export default function PhoneNumbers({
  phoneNumbers,
}: {
  phoneNumbers: string[];
}) {
  if (phoneNumbers.length === 0) {
    return null;
  }
  return (
    <ul>
      {phoneNumbers?.map((phoneNumber) => (
        <li key={phoneNumber}>
          <Link href={`tel:${phoneNumber}`}>{phoneNumber}</Link>
        </li>
      ))}
    </ul>
  );
}
