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
          <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
        </li>
      ))}
    </ul>
  );
}
