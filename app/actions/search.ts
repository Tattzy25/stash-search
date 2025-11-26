/** biome-ignore-all lint/suspicious/noConsole: "Handy for debugging" */

"use server";

import { Search } from "@upstash/search";
import type { PutBlobResult } from "@vercel/blob";

const upstash = Search.fromEnv();
const index = upstash.index("images");

type SearchResponse =
  | {
      data: PutBlobResult[];
    }
  | {
      error: string;
    };

type SearchParams = {
  query: string;
  visibility?: "public" | "private";
  userId?: string;
};

export const search = async (
  _prevState: SearchResponse | undefined,
  formData: FormData
): Promise<SearchResponse> => {
  const query = formData.get("search");
  const visibilityFilter = formData.get("visibility") as "public" | "private";
  const userIdFilter = formData.get("userId") as string;

  if (!query || typeof query !== "string") {
    return { error: "Please enter a search query" };
  }

  try {
    console.log(
      "Searching index for query:",
      query
    );
    const results = await index.search({
      query,
    });

    console.log("Results:", results);
    const data = results
      .sort((a, b) => b.score - a.score)
      .map((result) => result.metadata)
      .filter(Boolean) as unknown as PutBlobResult[];

    console.log("Images found:", data);
    return { data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return { error: message };
  }
};
