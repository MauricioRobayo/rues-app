import { Flex, Link } from "@radix-ui/themes";

export default function PhoneNumbers({
  phoneNumbers,
}: {
  phoneNumbers: string[];
}) {
  if (phoneNumbers.length === 0) {
    return null;
  }
  return (
    <Flex direction="column" gap="2" asChild>
      <ul>
        {phoneNumbers?.map((phoneNumber, index) => {
          if (phoneNumber.trim()) {
            return (
              <li key={index}>
                <Link href={`tel:${phoneNumber}`}>{phoneNumber}</Link>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </Flex>
  );
}
