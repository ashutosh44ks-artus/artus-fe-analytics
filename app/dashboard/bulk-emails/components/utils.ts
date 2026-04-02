/**
 * Format a metric name for display (remove parentheses and shorten)
 */
export const formatFilterLabel = (metric: string): string => {
  return metric
    .replace(/\s*\([^)]*\)/g, "") // Remove parentheses and content
    .trim();
};

/**
 * Get allowed operators for a specific metric
 */
export const getOperatorOptions = (): string[] => {
  // Most metrics support all operators
  return ["=", "!=", ">", ">=", "<", "<="];
};

/**
 * Validate a conditional rule
 */
export const validateConditional = (
  metric: string,
  operator: string,
  value: string | number | string[],
): boolean => {
  if (!metric || !operator) return false;

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return !isNaN(value);
  }

  return false;
};

export const supportedTemplateModelFieldValuePairs = {
  plan_comparison_link: "https://app.artusai.co/account/plans",
  upgrade_link: "https://app.artusai.co/account/plans",
  billing_link: "https://app.artusai.co/account/plans",
  support_email: "admin@artusai.co",
  recommended_plan: "Pro Plan",
  faq_link: "https://artusai.co",
};
