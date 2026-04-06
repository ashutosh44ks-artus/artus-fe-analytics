"use client";

import { useEffect, useRef } from "react";
import { TemplatesApiResponse } from "@/services/postmark";

interface EmailTemplateBodyProps {
  selectedTemplate: TemplatesApiResponse | null;
  isLoading: boolean;
  error: Error | null;
}

const EMAIL_PREVIEW_BASE_STYLES = `
  :host {
    display: block;
    color-scheme: light;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

const ShadowEmailPreview = ({ html }: { html: string }) => {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    const parsedDocument = new DOMParser().parseFromString(html, "text/html");

    parsedDocument.querySelectorAll("script").forEach((node) => node.remove());
    parsedDocument.querySelectorAll("*").forEach((element) => {
      Array.from(element.attributes).forEach((attribute) => {
        if (attribute.name.toLowerCase().startsWith("on")) {
          element.removeAttribute(attribute.name);
        }
      });
    });

    const fragment = document.createDocumentFragment();
    const baseStyles = document.createElement("style");
    baseStyles.textContent = EMAIL_PREVIEW_BASE_STYLES;
    fragment.appendChild(baseStyles);

    parsedDocument
      .querySelectorAll("style, link[rel='stylesheet']")
      .forEach((node) => {
        fragment.appendChild(node.cloneNode(true));
      });

    const content = document.createElement("div");
    content.setAttribute("part", "email-preview-content");
    content.append(
      ...Array.from(parsedDocument.body.childNodes).map((node) =>
        node.cloneNode(true)
      )
    );

    fragment.appendChild(content);
    shadowRoot.replaceChildren(fragment);

    return () => {
      shadowRoot.replaceChildren();
    };
  }, [html]);

  return (
    <div
      ref={hostRef}
      aria-label="Email template preview"
      className="min-h-30 w-full overflow-auto"
    />
  );
};

const EmailTemplateBody = ({
  selectedTemplate,
  isLoading,
  error,
}: EmailTemplateBodyProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-red-400">
          Error loading templates: {error.message}
        </p>
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="text-center py-12">
        <p className="text-sm">No template selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Subject Line */}
      <div>
        <p className="text-xs font-semibold mb-1">Subject:</p>
        <p className="text-sm bg-slate-900 px-3 py-2 rounded-md border">
          {selectedTemplate.subject}
        </p>
      </div>

      {/* Email Preview */}
      <div>
        <p className="text-xs font-semibold mb-2">Email Preview:</p>
        <div className="border rounded-xl p-4 bg-slate-900">
          <ShadowEmailPreview html={selectedTemplate.body} />
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateBody;
