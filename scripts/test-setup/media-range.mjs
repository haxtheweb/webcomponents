/**
 * Byte-range support for media files served by the test runner's dev server.
 *
 * Browsers only let a page seek audio or video when the server answers HTTP
 * Range requests (any real host does). Without them Chromium reports the
 * media's seekable range as [0, 0] and quietly keeps currentTime at 0, so a
 * player test that seeks only "passes" until the next timeupdate snaps the
 * player back. This middleware advertises `Accept-Ranges: bytes` on media
 * responses and answers `Range: bytes=start-end` with a 206 partial body, so
 * seeking in tests works the way it does on a deployed site.
 */
import { Buffer } from "node:buffer";

const MEDIA = /\.(mp3|mp4|m4a|m4v|webm|ogg|oga|ogv|wav|flac|aac)$/i;

async function toBuffer(body) {
  if (Buffer.isBuffer(body)) return body;
  if (typeof body === "string") return Buffer.from(body);
  if (body && typeof body.pipe === "function") {
    const chunks = [];
    for await (const chunk of body) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks);
  }
  return null;
}

/**
 * Parse a single `bytes=` range against a body length.
 * @returns {[number, number] | null} inclusive [start, end], or null when the
 *   header is missing, malformed, multi-range or unsatisfiable
 */
export function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(header || "").trim());
  if (!m || (m[1] === "" && m[2] === "")) return null;
  let start;
  let end;
  if (m[1] === "") {
    // suffix range: the last N bytes
    const n = Number(m[2]);
    if (n === 0) return null;
    start = Math.max(0, size - n);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start > end || start >= size) return null;
  return [start, end];
}

export async function mediaRangeMiddleware(ctx, next) {
  await next();
  if (ctx.status !== 200 || !MEDIA.test(ctx.path)) return;
  ctx.set("Accept-Ranges", "bytes");
  const header = ctx.get("range");
  if (!header) return;
  const buf = await toBuffer(ctx.body);
  if (!buf) return;
  const range = parseRange(header, buf.length);
  if (!range) {
    ctx.status = 416;
    ctx.set("Content-Range", `bytes */${buf.length}`);
    ctx.body = "";
    return;
  }
  const [start, end] = range;
  ctx.status = 206;
  ctx.set("Content-Range", `bytes ${start}-${end}/${buf.length}`);
  ctx.body = buf.subarray(start, end + 1);
}
