import { useEffect, useRef } from "react";

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
        node.cloneNode(true),
      ),
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

export default ShadowEmailPreview;