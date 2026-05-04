import { renderToStream } from "@react-pdf/renderer";
import { createElement } from "react";

import { CVDocument } from "@/lib/cv-pdf";

/**
 * GET /cv  →  the generated CV PDF.
 *
 * Renders dynamically per request so edits to content/cv.json or the layout
 * appear immediately. The HTTP Cache-Control header below still lets Vercel's
 * edge cache it for an hour in production, so this is fast in practice.
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const stream = (await renderToStream(
    createElement(CVDocument),
  )) as unknown as ReadableStream;

  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Ipeleng-Mekgwe-CV.pdf"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
