import { UserTeam } from "@/lib/store/userStore";

export type StreamState = "idle" | "waiting" | "streaming";

export const fixBackendResponseFormatting = (text: string) => {
  let processedValue = null;
  let processedData = text;

  if (text && typeof text === "string") {
    // 1. Try to find content inside ```json ... ``` blocks
    const jsonMatch = text.match(/```json([\s\S]*?)```/);
    let rawJsonCandidate = null;
    let fullMatchString = null;

    if (jsonMatch) {
      rawJsonCandidate = jsonMatch[1];
      fullMatchString = jsonMatch[0];
    } else {
      // 2. Fallback: Extract the first occurrence of { ... } or [ ... ]
      const rawMatch = text.match(/(\{[\s\S]*?\}|\[[\s\S]*?\])/);
      if (rawMatch) {
        rawJsonCandidate = rawMatch[0];
        fullMatchString = rawMatch[0];
      }
    }

    if (rawJsonCandidate) {
      try {
        processedValue = JSON.parse(rawJsonCandidate.trim());
        // Remove the JSON string from the original text to get clean markdown
        if (fullMatchString) {
          processedData = text
            .replace(fullMatchString, "")
            .replace("__META__", "")
            .trim();
        }
      } catch (error) {
        console.log("rawJsonCandidate:", rawJsonCandidate);
        console.error("Error parsing extracted JSON:", error);
      }
    }
  }

  // 3. UI logic: If text is empty but JSON has a message, use that
  if (
    !processedData &&
    processedValue?.message &&
    typeof processedValue.message === "string"
  ) {
    processedData = processedValue.message;
  }

  return { processedData, processedValue };
};

export const LunaChatStartShortcuts: {
  title: string;
  desc: string;
  team: UserTeam;
}[] = [
  {
    title: "Read Dashboard & Summarize",
    desc: "Get a quick overview of your key metrics, trends, and anomalies across all departments",
    team: "product",
  },
  {
    title: "Product Ideation Support",
    desc: "Brainstorm features, analyze market fit, and explore product direction with data-backed insights",
    team: "product",
  },
  {
    title: "Analyze Top Anomalies",
    desc: "Deep dive into unusual patterns, outliers, and unexpected changes in your business metrics",
    team: "product",
  },
  {
    title: "Identify Growth Opportunities",
    desc: "Analyze your data to uncover high-impact opportunities for user acquisition and revenue growth",
    team: "marketing",
  },
  {
    title: "Generate Campaign Ideas",
    desc: "Create campaign concepts, messaging angles, and content themes tailored to your audience",
    team: "marketing",
  },
  {
    title: "Suggest Marketing Experiments",
    desc: "Get data-driven ideas for experiments to improve acquisition, activation, and retention",
    team: "marketing",
  },
];
