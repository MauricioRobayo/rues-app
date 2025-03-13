"use client";

import { getRecaptchaToken } from "@/app/lib/getRecapchaToken";
import { Button, Callout, Flex, Text, TextArea } from "@radix-ui/themes";
import { useActionState, useId, useState } from "react";
import { Action } from "@/app/lib/getRecapchaToken";
import { userReportAction } from "@/app/[company]/actions";
import { CheckCircledIcon } from "@radix-ui/react-icons";

type UserReportState = { status: "idle" | "success" | "error" };

export function UserReport({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Flex direction="column" gap="2" align="center">
      <Text size="4" weight="medium" color="gray">
        ¿Algo no está bien?
      </Text>
      {isOpen ? (
        <UserReportForm slug={slug} />
      ) : (
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Ayúdenos a mejorar esta página
        </Button>
      )}
    </Flex>
  );
}

function UserReportForm({ slug }: { slug: string }) {
  const [userReportState, formAction, isPending] = useActionState<
    UserReportState,
    FormData
  >(
    async (_, formData): Promise<UserReportState> => {
      const description = formData.get(descriptionId)?.toString();
      if (!description?.trim()) {
        return {
          status: "idle",
        };
      }
      try {
        const recaptchaToken = await getRecaptchaToken(Action.USER_REPORT);
        return userReportAction({ description, slug, recaptchaToken });
      } catch (err) {
        console.error(err);
        return {
          status: "error",
        };
      }
    },
    { status: "idle" },
  );
  const formId = useId();
  const descriptionId = `${formId}-description`;
  if (userReportState.status === "success") {
    return (
      <Callout.Root color="green">
        <Callout.Icon>
          <CheckCircledIcon />
        </Callout.Icon>
        <Callout.Text>
          Hemos recibido su mensaje. Estamos trabajando en ello.
        </Callout.Text>
      </Callout.Root>
    );
  }

  if (userReportState.status === "error") {
    return (
      <Text color="red" className="contents">
        <p>Algo ha salido mal.</p>
        <p>Por favor, vuelva a intentarlo más tarde.</p>
      </Text>
    );
  }
  return (
    <form action={formAction} className="contents">
      <Text asChild color="gray" align="center" wrap="pretty">
        <label htmlFor={descriptionId}>
          Denos una descripción detallada del problema:
        </label>
      </Text>
      <TextArea
        autoFocus
        resize="both"
        className="w-full max-w-96"
        name={descriptionId}
        id={descriptionId}
        required
        minLength={4}
        disabled={isPending}
      />
      <Button type="submit" loading={isPending}>
        Enviar
      </Button>
    </form>
  );
}
