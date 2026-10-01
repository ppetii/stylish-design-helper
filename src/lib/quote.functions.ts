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
    const photo = data.get("photo");
    console.log("[quote-debug] photo entry:", photo?.constructor?.name, photo instanceof File ? photo.size : String(photo).slice(0, 50));
    const hasPhoto = photo instanceof File && photo.size > 0;
    return { ...parsed, photo: hasPhoto ? photo : null };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let photoPath: string | null = null;
    if (data.photo) {
      if (data.photo.size > MAX_PHOTO_BYTES) {
        throw new Error("A fotó mérete legfeljebb 10 MB lehet.");
      }
      const ext = ALLOWED_PHOTO_TYPES[data.photo.type];
      if (!ext) throw new Error("Csak JPG, PNG vagy WEBP formátumú fotó tölthető fel.");
      photoPath = `requests/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("quote-photos")
        .upload(photoPath, data.photo, { contentType: data.photo.type });
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
