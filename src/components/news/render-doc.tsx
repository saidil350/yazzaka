import React from "react";
import type { TiptapDoc, TiptapNode } from "@/lib/news/types";

/**
 * Renderer aman untuk dokumen Tiptap pada halaman publik.
 * Tidak memakai dangerouslySetInnerHTML — setiap node dipetakan ke
 * elemen React. Protokol tautan divalidasi (http/https/mailto/relatif);
 * atribut asing diabaikan.
 */

const SAFE_HREF = /^(https?:\/\/|mailto:|\/)/i;

function SafeLink({
  href,
  children,
}: {
  href: unknown;
  children: React.ReactNode;
}) {
  if (typeof href !== "string" || !SAFE_HREF.test(href.trim())) {
    return <>{children}</>;
  }
  const url = href.trim();
  const isExternal = /^https?:\/\//i.test(url);
  return (
    <a
      href={url}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="text-primary underline underline-offset-2 hover:underline"
    >
      {children}
    </a>
  );
}

function ImageNode({ node }: { node: TiptapNode }) {
  const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
  const safeSrc = src.startsWith("/") || /^https?:\/\//i.test(src) ? src : "";
  if (!safeSrc) return null;
  const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
  const caption = typeof node.attrs?.caption === "string" ? node.attrs.caption : "";

  return (
    <figure className="my-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={safeSrc}
        alt={alt}
        className="w-full rounded-lg border border-border object-cover"
        loading="lazy"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function renderNode(node: TiptapNode, key: number): React.ReactNode {
  const children = node.content ?? [];

  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="leading-relaxed">
          {children.map((c, i) => renderNode(c, i))}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const Tag = level === 3 ? "h3" : "h2";
      return (
        <Tag
          key={key}
          className={
            level === 3
              ? "pt-2 text-lg font-bold tracking-tight"
              : "pt-2 text-xl font-bold tracking-tight"
          }
        >
          {children.map((c, i) => renderNode(c, i))}
        </Tag>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="list-disc space-y-1 pl-6">
          {children.map((c, i) => renderNode(c, i))}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal space-y-1 pl-6">
          {children.map((c, i) => renderNode(c, i))}
        </ol>
      );
    case "listItem":
      return <li key={key}>{children.map((c, i) => renderNode(c, i))}</li>;
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-2 border-primary/40 pl-4 text-muted-foreground italic"
        >
          {children.map((c, i) => renderNode(c, i))}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre
          key={key}
          className="overflow-x-auto rounded-md bg-muted p-4 text-sm"
        >
          <code>{children.map((c, i) => renderNode(c, i))}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} className="border-border" />;
    case "hardBreak":
      return <br key={key} />;
    case "image":
      return <ImageNode key={key} node={node} />;
    case "text": {
      let content: React.ReactNode = node.text ?? "";
      for (const mark of node.marks ?? []) {
        if (mark.type === "bold") {
          content = <strong key={`b-${key}`}>{content}</strong>;
        } else if (mark.type === "italic") {
          content = <em key={`i-${key}`}>{content}</em>;
        } else if (mark.type === "strike") {
          content = <s key={`s-${key}`}>{content}</s>;
        } else if (mark.type === "underline") {
          content = <u key={`u-${key}`}>{content}</u>;
        } else if (mark.type === "code") {
          content = (
            <code key={`c-${key}`} className="rounded bg-muted px-1 py-0.5 text-sm">
              {content}
            </code>
          );
        } else if (mark.type === "link") {
          content = (
            <SafeLink key={`l-${key}`} href={mark.attrs?.href}>
              {content}
            </SafeLink>
          );
        }
      }
      return <React.Fragment key={key}>{content}</React.Fragment>;
    }
    default:
      // Node tak dikenal: render isinya saja (jangan pernah HTML mentah).
      return (
        <React.Fragment key={key}>
          {children.map((c, i) => renderNode(c, i))}
        </React.Fragment>
      );
  }
}

export function RenderDoc({ doc }: { doc: TiptapDoc }) {
  if (doc.type !== "doc" || !Array.isArray(doc.content)) return null;
  return (
    <div className="space-y-4">
      {doc.content.map((node, i) => renderNode(node, i))}
    </div>
  );
}
