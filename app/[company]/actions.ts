"use server";

import { Action } from "@/app/lib/getRecapchaToken";
import { verifyRecaptcha } from "@/app/lib/verifyRecaptcha";
import { revalidatePath, revalidateTag } from "next/cache";
import { BASE_URL } from "@/app/lib/constants";
import { Octokit } from "@octokit/rest";
import { z } from "zod";
import { ccbService } from "@/app/services/ccb/service";

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
  status: "success" | "error";
  message: string;
};

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
}): Promise<CreateUserReportStatus> {
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
      };
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
    };
  } catch (error) {
    console.error(error);
    return { status: "error", message: "Failed to create the issue." };
  }
}

export async function getBidderRecords({
  bidderId,
  recaptchaToken,
}: {
  bidderId: string;
  recaptchaToken: string;
}) {
  if (
    !(await verifyRecaptcha({
      token: recaptchaToken,
      action: Action.BIDDER_RECORDS,
    }))
  ) {
    return {
      status: "error",
    } as const;
  }
  return ccbService.getBidderRecords(bidderId);
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
