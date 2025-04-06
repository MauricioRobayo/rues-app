"use server";

import { BASE_URL } from "@/app/lib/constants";
import { Action } from "@/app/lib/getRecaptchaToken";
import { verifyRecaptcha } from "@/app/lib/verifyRecaptcha";
import { Octokit } from "@octokit/rest";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

const ghToken = process.env.GITHUB_TOKEN ?? "";
const ghRepoOwner = process.env.GITHUB_OWNER ?? "";
const ghRepo = process.env.GITHUB_REPO ?? "";

const octokit = new Octokit({
  auth: ghToken,
});

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

const schema = z.object({
  description: z.string().trim().min(4),
  nit: z.string().trim().min(8),
  recaptchaToken: z.string(),
});

export async function userReportAction({
  description,
  slug,
  recaptchaToken,
}: {
  description: string;
  slug: string;
  recaptchaToken: string;
}): Promise<{
  status: "success" | "error";
  message: string;
}> {
  const label = "user report";
  const validatedFields = schema.safeParse({
    description,
    nit: slug,
    recaptchaToken,
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
    const existingIssue = await findOpenIssue({ label, title });

    if (existingIssue) {
      await octokit.issues.createComment({
        body: validatedFields.data.description,
        issue_number: existingIssue.number,
        owner: ghRepoOwner,
        repo: ghRepo,
      });
      return {
        status: "success",
        message: "Comment added successfully.",
      };
    }

    await octokit.issues.create({
      owner: ghRepoOwner,
      repo: ghRepo,
      title,
      assignee: ghRepoOwner,
      body: `${validatedFields.data.description}\n\n${url}`,
      labels: [label],
    });

    return {
      status: "success",
      message: "Issue created successfully.",
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create the issue." };
  }
}

async function findOpenIssue({
  title,
  label,
}: {
  title: string;
  label: string;
}) {
  const issues = await octokit.issues.listForRepo({
    owner: ghRepoOwner,
    repo: ghRepo,
    assignee: ghRepoOwner,
    creator: ghRepoOwner,
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
