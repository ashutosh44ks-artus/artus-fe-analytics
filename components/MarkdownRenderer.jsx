import { cn } from "@/lib/utils";
import { marked } from "marked";

const MarkdownRenderer = ({ children, className }) => {
  const renderMarkdown = (content) => {
    if (!content) return { __html: "" };
    try {
      const html = marked(content);
      return { __html: html };
    } catch (error) {
      console.error("Error parsing markdown:", error);
      return { __html: content };
    }
  };
  const htmlContent = renderMarkdown(children);
  return (
    <div
      className={cn(
        "overflow-x-auto modern-scroll markdown-renderer-container",
        className
      )}
      dangerouslySetInnerHTML={htmlContent}
    />
  );
};

export default MarkdownRenderer;
