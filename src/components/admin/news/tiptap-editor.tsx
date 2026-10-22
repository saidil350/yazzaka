"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import type { SetImageOptions } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  Link2Off,
  ImagePlus,
  Trash2,
  Undo2,
  Redo2,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MediaPickerModal } from "./media-picker-modal";
import type { TiptapDoc } from "@/lib/news/types";

/**
 * Rich text editor Tiptap (pengolah kata sederhana) untuk isi berita.
 * Menyimpan konten sebagai Tiptap JSON (articles.content_doc).
 * Gambar inline diunggah ke object storage terlebih dahulu — unggahan
 * yang gagal TIDAK menyisipkan node gambar.
 */

const NewsImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      mediaId: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-media-id"),
        renderHTML: (attributes: Record<string, unknown>) =>
          attributes.mediaId ? { "data-media-id": attributes.mediaId } : {},
      },
      caption: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute("data-caption"),
        renderHTML: (attributes: Record<string, unknown>) =>
          attributes.caption ? { "data-caption": attributes.caption } : {},
      },
    };
  },
});

function ToolButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={active ? "bg-muted text-foreground" : undefined}
    >
      {children}
    </Button>
  );
}

export function TiptapEditor({
  content,
  onChange,
  disabled = false,
}: {
  content: TiptapDoc | null;
  onChange: (doc: TiptapDoc) => void;
  disabled?: boolean;
}) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [linkModalOpen, setLinkModalOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [imageAlt, setImageAlt] = React.useState("");
  const [imageCaption, setImageCaption] = React.useState("");
  // Baseline dokumen + penanda transaksi inisialisasi (lihat onUpdate).
  const lastDocRef = React.useRef<string>(JSON.stringify(
    content ?? { type: "doc", content: [] }
  ));
  const armedRef = React.useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      NewsImage.configure({ allowBase64: false }),
      Placeholder.configure({
        placeholder: "Tuliskan isi berita di sini… Gunakan toolbar untuk format teks.",
      }),
    ],
    content: (content ?? { type: "doc", content: [] }) as Record<string, unknown>,
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] p-4 text-sm leading-relaxed [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_img]:my-3 [&_img]:rounded-md",
        "aria-label": "Isi artikel",
      },
    },
    onUpdate: ({ editor: instance }) => {
      const serialized = JSON.stringify(instance.getJSON());
      // Transaksi pertama setelah editor dibuat adalah inisialisasi/normalisasi
      // Tiptap — jadikan baseline, jangan dianggap hasil suntingan.
      if (!armedRef.current) {
        armedRef.current = true;
        lastDocRef.current = serialized;
        return;
      }
      if (serialized === lastDocRef.current) return;
      lastDocRef.current = serialized;
      const json = instance.getJSON() as unknown as TiptapDoc;
      if (json?.type === "doc") onChange(json);
    },
  });

  React.useEffect(() => {
    if (editor) editor.setEditable(!disabled);
  }, [editor, disabled]);

  const openLinkModal = () => {
    if (!editor) return;
    setLinkUrl((editor.getAttributes("link").href as string) ?? "");
    setLinkModalOpen(true);
  };

  const applyLink = () => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setLinkModalOpen(false);
  };

  const openImageModal = () => {
    if (!editor) return;
    const attrs = editor.getAttributes("image");
    setImageAlt((attrs.alt as string) ?? "");
    setImageCaption((attrs.caption as string) ?? "");
    setImageModalOpen(true);
  };

  const applyImageMeta = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        alt: imageAlt.trim() || null,
        caption: imageCaption.trim() || null,
      })
      .run();
    setImageModalOpen(false);
  };

  const insertImage = (media: { fileUrl: string; fileName: string; altText: string | null; id: string }) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .setImage({
        src: media.fileUrl,
        alt: media.altText ?? media.fileName,
        // Atribut kustom NewsImage — disertakan agar referensi media stabil.
        mediaId: media.id,
      } as SetImageOptions)
      .run();
  };

  const btnDisabled = !editor || disabled;

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-card">
      <div
        role="toolbar"
        aria-label="Toolbar format teks"
        className="flex flex-wrap items-center gap-1 border-b border-border p-2"
      >
        <ToolButton
          label="Paragraf biasa (Hapus judul)"
          disabled={btnDisabled}
          active={editor?.isActive("paragraph") && !editor?.isActive("heading")}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          <span className="text-xs font-semibold">P</span>
        </ToolButton>
        <ToolButton
          label="Judul bagian (H2)"
          disabled={btnDisabled}
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Sub-judul (H3)"
          disabled={btnDisabled}
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="size-4" aria-hidden="true" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolButton
          label="Tebal (Ctrl+B)"
          disabled={btnDisabled}
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Miring (Ctrl+I)"
          disabled={btnDisabled}
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" aria-hidden="true" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolButton
          label="Daftar berbutir"
          disabled={btnDisabled}
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Daftar bernomor"
          disabled={btnDisabled}
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Kutipan"
          disabled={btnDisabled}
          active={editor?.isActive("blockquote")}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" aria-hidden="true" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolButton
          label="Sisipkan / ubah tautan"
          disabled={btnDisabled}
          active={editor?.isActive("link")}
          onClick={openLinkModal}
        >
          <Link2 className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Hapus tautan"
          disabled={btnDisabled || !editor?.isActive("link")}
          onClick={() => editor?.chain().focus().unsetLink().run()}
        >
          <Link2Off className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Sisipkan gambar"
          disabled={btnDisabled}
          onClick={() => setPickerOpen(true)}
        >
          <ImagePlus className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Atur alt/caption gambar terpilih"
          disabled={btnDisabled || !editor?.isActive("image")}
          onClick={openImageModal}
        >
          <Settings2 className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Hapus gambar terpilih"
          disabled={btnDisabled || !editor?.isActive("image")}
          onClick={() => editor?.chain().focus().deleteSelection().run()}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </ToolButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolButton
          label="Urungkan (Ctrl+Z)"
          disabled={btnDisabled || !editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" aria-hidden="true" />
        </ToolButton>
        <ToolButton
          label="Ulangi (Ctrl+Shift+Z)"
          disabled={btnDisabled || !editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" aria-hidden="true" />
        </ToolButton>
      </div>

      <EditorContent editor={editor} />

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={insertImage}
        title="Sisipkan Gambar Inline"
      />

      <Modal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        title="Tautan"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setLinkModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={applyLink}>Terapkan</Button>
          </>
        }
      >
        <div className="space-y-2">
          <Input
            label="URL tautan"
            type="url"
            placeholder="https://…"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            helperText="Kosongkan lalu Terapkan untuk menghapus tautan."
          />
        </div>
      </Modal>

      <Modal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        title="Atur Gambar"
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setImageModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={applyImageMeta}>Simpan</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input
            label="Teks alternatif (alt)"
            placeholder="Jelaskan isi gambar"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
          <Input
            label="Caption (opsional)"
            placeholder="Keterangan singkat di bawah gambar"
            value={imageCaption}
            onChange={(e) => setImageCaption(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
