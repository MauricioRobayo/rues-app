"use server";

import { Action } from "@/app/lib/getRecapchaToken";
import { verifyRecaptcha } from "@/app/lib/verifyRecaptcha";
import { revalidatePath, revalidateTag } from "next/cache";
import { BASE_URL } from "@/app/lib/constants";
import { Octokit } from "@octokit/rest";
import { z } from "zod";

const token = process.env.GITHUB_TOKEN ?? "";
const owner = process.env.GITHUB_OWNER ?? "";
const repo = process.env.GITHUB_REPO ?? "";
const label = "user report";

export async function revalidatePathAction({
  path,
  recaptchaToken,
}: {
  path: string;
  recaptchaToken: string;
}) {
  if (
    !(await verifyRecaptcha({
      token: recaptchaToken,
      action: Action.REVALIDATE_PATH,
    }))
  ) {
    return null;
  }

  revalidatePath(path);
}

export async function revalidateTagAction({
  tag,
  recaptchaToken,
}: {
  tag: string;
  recaptchaToken: string;
}) {
  if (
    !(await verifyRecaptcha({
      token: recaptchaToken,
      action: Action.REVALIDATE_TAG,
    }))
  ) {
    return null;
  }

  revalidateTag(tag);
}

const octokit = new Octokit({
  auth: token,
});

export type CreateUserReportStatus = {
  status: "success" | "error" | "idle";
  message: string;
};

const schema = z.object({
  description: z.string().trim().min(4),
  nit: z.number(),
  recaptchaToken: z.string(),
});

export async function userReportAction(
  _initialState: CreateUserReportStatus,
  formData: FormData,
): Promise<CreateUserReportStatus> {
  const validatedFields = schema.safeParse({
    description: formData.get("description"),
    page: formData.get("page"),
    recaptchaToken: formData.get("token"),
  });

  if (validatedFields.error) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      status: "error",
      message: "Invalid data",
    };
  }

  const title = `UR: ${validatedFields.data.nit}`;
  const url = new URL(String(validatedFields.data.nit), BASE_URL);
  if (
    !(await verifyRecaptcha({
      token: validatedFields.data.recaptchaToken,
      action: Action.USER_REPORT,
    }))
  ) {
    return {
      status: "error",
      message: "Recaptcha verification failed",
    };
  }

  try {
    const existingIssue = await findOpenIssue(title);

    if (existingIssue) {
      await octokit.issues.createComment({
        body: validatedFields.data.description,
        issue_number: existingIssue.number,
        owner,
        repo,
      });
      return {
        status: "success",
        message: "Comment added successfully.",
      } as const;
    }

    await octokit.issues.create({
      owner,
      repo,
      title,
      assignee: owner,
      body: `${validatedFields.data.description}\n\n${url}`,
      labels: [label],
    });

    return {
      status: "success",
      message: "Issue created successfully.",
    } as const;
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create the issue." } as const;
  }
}

async function findOpenIssue(title: string) {
  const issues = await octokit.issues.listForRepo({
    owner,
    repo,
    assignee: owner,
    creator: owner,
    label,
    state: "open",
  });

  const issue = issues.data.find((issue) => issue.title === title);

  if (issue) {
    return issue;
  } else {
    return null;
  }
}
