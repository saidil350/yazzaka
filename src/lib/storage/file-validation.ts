/**
 * Validasi berkas unggahan di server: allowlist ekstensi + pemeriksaan
 * magic bytes. MIME type dari browser tidak dipercaya.
 */

export type UploadKind = "image" | "document";

interface AllowedType {
  extensions: string[];
  mimeType: string;
  kind: UploadKind;
  /** magic bytes di awal berkas (null = tidak dapat dibedakan, andalkan ekstensi). */
  magic?: number[][];
}

const ALLOWED: AllowedType[] = [
  { extensions: ["jpg", "jpeg"], mimeType: "image/jpeg", kind: "image", magic: [[0xff, 0xd8, 0xff]] },
  { extensions: ["png"], mimeType: "image/png", kind: "image", magic: [[0x89, 0x50, 0x4e, 0x47]] },
  { extensions: ["webp"], mimeType: "image/webp", kind: "image", magic: [[0x52, 0x49, 0x46, 0x46]] }, // RIFF…WEBP
  { extensions: ["gif"], mimeType: "image/gif", kind: "image", magic: [[0x47, 0x49, 0x46, 0x38]] },
  { extensions: ["pdf"], mimeType: "application/pdf", kind: "document", magic: [[0x25, 0x50, 0x44, 0x46]] }, // %PDF
  // DOCX adalah ZIP (PK..) — magic tidak unik, kombinasi ekstensi + PK.
  {
    extensions: ["docx"],
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    kind: "document",
    magic: [[0x50, 0x4b, 0x03, 0x04]],
  },
];

export interface FileValidationResult {
  ok: true;
  mimeType: string;
  kind: UploadKind;
}

export function extensionOf(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot > 0 ? fileName.slice(dot + 1).toLowerCase() : "";
}

export function validateUploadedFile(
  fileName: string,
  head: Uint8Array
): FileValidationResult | { ok: false; error: string } {
  const ext = extensionOf(fileName);
  const allowed = ALLOWED.find((t) => t.extensions.includes(ext));
  if (!allowed) {
    return {
      ok: false,
      error:
        "Jenis berkas tidak diizinkan. Gunakan JPG, PNG, WEBP, GIF (gambar) atau PDF, DOCX (dokumen).",
    };
  }

  if (allowed.magic) {
    const matched = allowed.magic.some((magic) =>
      magic.every((byte, i) => head[i] === byte)
    );
    if (!matched) {
      return {
        ok: false,
        error:
          "Isi berkas tidak sesuai dengan ekstensinya. Unggahan ditolak.",
      };
    }
    // WEBP perlu verifikasi lanjutan "WEBP" pada byte 8-11.
    if (ext === "webp") {
      const sig = String.fromCharCode(...head.slice(8, 12));
      if (sig !== "WEBP") {
        return { ok: false, error: "Isi berkas bukan WEBP yang valid." };
      }
    }
  }

  return { ok: true, mimeType: allowed.mimeType, kind: allowed.kind };
}
