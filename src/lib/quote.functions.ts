import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const quoteSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  projectType: z.string().trim().min(1).max(80),
  dimensions: z.string().trim().max(200).optional().or(z.literal("")),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) throw new Error("Érvénytelen űrlapadatok.");
    const str = (key: string) => String(data.get(key) ?? "").slice(0, 2500);
    const photoData = String(data.get("photoBase64") ?? "");
    const photoType = String(data.get("photoType") ?? "");
    const parsed = quoteSchema.parse({
      name: str("name"),
      email: str("email"),
      phone: str("phone"),
      projectType: str("projectType"),
      dimensions: str("dimensions"),
      location: str("location"),
      message: str("message"),
    });
    if (!parsed.email && !parsed.phone) {
      throw new Error("Kérjük, adjon meg e-mail címet vagy telefonszámot.");
    }
    if (photoData) {
      const approxBytes = Math.floor((photoData.length * 3) / 4);
      if (approxBytes > MAX_PHOTO_BYTES) {
        throw new Error("A fotó mérete legfeljebb 10 MB lehet.");
      }
      if (!ALLOWED_PHOTO_TYPES[photoType]) {
        throw new Error("Csak JPG, PNG vagy WEBP formátumú fotó tölthető fel.");
      }
    }
    return {
      ...parsed,
      photoData: photoData || null,
      photoExt: photoData ? ALLOWED_PHOTO_TYPES[photoType] : null,
      photoContentType: photoData ? photoType : null,
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let photoPath: string | null = null;
    if (data.photoData && data.photoExt && data.photoContentType) {
      photoPath = `requests/${crypto.randomUUID()}.${data.photoExt}`;
      const bytes = Buffer.from(data.photoData, "base64");
      const { error: uploadError } = await supabaseAdmin.storage
        .from("quote-photos")
        .upload(photoPath, bytes, { contentType: data.photoContentType });
      if (uploadError) throw new Error("A fotó feltöltése nem sikerült. Kérjük, próbálja újra.");
    }

    const { error } = await supabaseAdmin.from("quote_requests").insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      project_type: data.projectType,
      dimensions: data.dimensions || null,
      location: data.location || null,
      message: data.message || null,
      photo_path: photoPath,
    });
    if (error) {
      if (photoPath) await supabaseAdmin.storage.from("quote-photos").remove([photoPath]);
      throw new Error("Az elküldés nem sikerült. Kérjük, próbálja újra.");
    }

    return { ok: true };
  });
