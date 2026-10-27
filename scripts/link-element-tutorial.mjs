#!/usr/bin/env node
/**
 * Link a video tutorial to an element, so <documentation-player> shows it in
 * the element's Video tab with captions and a link to the full tutorial.
 *
 * usage:
 *   node scripts/link-element-tutorial.mjs <element> --video <url>
 *     [--title "<video title>"] [--captions <transcript.vtt>]
 *     [--tutorial <url of the published tutorial page>] [--topic <topic>]
 *
 * --topic links the video to one topic of the element (lowercase letters,
 * digits and dashes), for elements with several walkthroughs such as the HAX
 * editor: --topic add-blocks writes <tag>.add-blocks.video.json. Without it the
 * video is the element's main one.
 *
 * Writes, inside elements/<element>/lib/:
 *   <tag>[.<topic>].video.json     { source, title, captions, tutorial }
 *   <tag>[.<topic>].captions.vtt   a copy of --captions, when given
 * then refreshes <tag>.docs.json so the video ships with the package.
 *
 * Running it again replaces the earlier link; options left out keep their
 * earlier values. The hax-tutorial-site skill runs this when a tutorial is
 * about an element.
 *
 * Node built-ins only.
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const USAGE =
  'usage: link-element-tutorial.mjs <element> --video <url> [--title "..."] [--captions <file.vtt>] [--tutorial <url>] [--topic <topic>]';

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function parse(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) fail(`${a} needs a value\n${USAGE}`);
      out[key] = next;
      i++;
    } else {
      out._.push(a);
    }
  }
  return out;
}

const isHttp = (u) => /^https?:\/\/\S+$/.test(String(u || ""));

function main() {
  const args = parse(process.argv.slice(2));
  const name = args._[0];
  if (!name) fail(USAGE);
  const dir = path.join(ROOT, "elements", name);
  if (!fs.existsSync(path.join(dir, "package.json"))) fail(`no element folder at elements/${name}`);

  // the tag, from the element source (packages can differ from folder names)
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
  const main = pkg.main || `${name}.js`;
  const src = fs.existsSync(path.join(dir, main)) ? fs.readFileSync(path.join(dir, main), "utf8") : "";
  const tag = (src.match(/static get tag\(\)\s*\{\s*return\s*["'`]([\w-]+)["'`]/) || [])[1] || name;

  if (args.topic !== undefined && !/^[a-z0-9][a-z0-9-]*$/.test(args.topic)) {
    fail("--topic takes lowercase letters, digits and dashes, for example add-blocks");
  }
  const stem = args.topic ? `${tag}.${args.topic}` : tag;
  const lib = path.join(dir, "lib");
  const file = path.join(lib, `${stem}.video.json`);
  let prev = {};
  if (fs.existsSync(file)) {
    try {
      prev = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      prev = {};
    }
  }

  const video = args.video || prev.source;
  if (!isHttp(video)) fail(`--video must be a full http(s) URL\n${USAGE}`);
  if (args.tutorial && !isHttp(args.tutorial)) fail("--tutorial must be a full http(s) URL");

  fs.mkdirSync(lib, { recursive: true });
  let captions = prev.captions || "";
  if (args.captions) {
    const from = path.resolve(args.captions);
    if (!fs.existsSync(from)) fail(`captions file not found: ${args.captions}`);
    const text = fs.readFileSync(from, "utf8");
    if (!/^﻿?WEBVTT/.test(text)) fail(`${args.captions} is not a WebVTT file`);
    captions = `${stem}.captions.vtt`;
    fs.writeFileSync(path.join(lib, captions), text);
  }

  const data = {
    source: video,
    title: args.title !== undefined ? args.title : prev.title || "",
    captions,
    tutorial: args.tutorial !== undefined ? args.tutorial : prev.tutorial || "",
  };
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");

  // refresh the docs data so the published package carries the video
  execFileSync(process.execPath, [path.join(ROOT, "scripts", "extract-element-docs.mjs"), "--write", name], {
    stdio: "inherit",
  });
  console.log(`linked ${data.source} to <${tag}>${args.topic ? ` (${args.topic})` : ""} (elements/${name}/lib/${stem}.video.json)`);
}

main();
