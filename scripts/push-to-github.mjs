#!/usr/bin/env node
/**
 * Push tailored README.md files and short repo descriptions to a fixed list
 * of GitHub repositories.
 *
 * Run from the project root:
 *
 *   node scripts/push-to-github.mjs                       (all repos)
 *   node scripts/push-to-github.mjs github-branch-manager (only this one)
 *   node scripts/push-to-github.mjs Skinet HiddenVilla    (any subset)
 *
 * Prerequisites:
 *   - .env.local must contain GITHUB_WRITE_TOKEN — a classic Personal Access
 *     Token with the public_repo scope (only). Create one at:
 *     https://github.com/settings/tokens?type=classic
 *   - Drafts must exist under portfolio/_drafts/<repo>/README.md
 *
 * Idempotent: if a README already exists at the destination it is updated
 * (the script first reads the SHA, then PUTs the new content).
 */

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DRAFTS = path.join(ROOT, "_drafts");

const OWNER = "ipelengmekgwe";

const REPOS = [
  {
    repo: "Carsties",
    description:
      "An online car-auction platform built with .NET 8 microservices, RabbitMQ + MassTransit, gRPC, SignalR, and a Next.js client.",
  },
  {
    repo: "Skinet",
    description:
      "A full-stack e-commerce store — .NET 8 API, Angular 18 client, Stripe checkout, ASP.NET Identity, and a Redis-backed basket.",
  },
  {
    repo: "github-branch-manager",
    description:
      "A small .NET console utility for keeping a GitHub repo's branch list tidy — list, audit, and bulk-prune branches without clicking through the GitHub UI.",
  },
  {
    repo: "HiddenVilla",
    description:
      "A villa booking and reservations platform with Stripe checkout, role-based admin, and PDF confirmations — .NET 6 MVC + Razor.",
  },
  {
    repo: "AzureServiceBusDemo",
    description:
      "Hands-on .NET 8 samples for Azure Service Bus — queues, topics + filtered subscriptions, sessions, dead-letter handling, and scheduled messages.",
  },
  {
    repo: "meditation-expo-react-native",
    description:
      "A guided meditation timer for iOS & Android — Expo SDK 51, React Native, TypeScript, NativeWind, Expo Router, and expo-av.",
  },
];

async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\r\n]*)"?\s*$/i);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  } catch {
    /* no .env.local — fall through */
  }
}

await loadEnv();

const TOKEN = process.env.GITHUB_WRITE_TOKEN;
if (!TOKEN) {
  console.error(
    "GITHUB_WRITE_TOKEN is not set.\n" +
      "Create a classic PAT with the public_repo scope at\n" +
      "https://github.com/settings/tokens?type=classic and add it to .env.local.",
  );
  process.exit(1);
}

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  Authorization: "Bearer " + TOKEN,
  "User-Agent": OWNER + "-portfolio-push-script",
  "Content-Type": "application/json",
};

async function existingReadmeSha(repo) {
  const res = await fetch(
    "https://api.github.com/repos/" + OWNER + "/" + repo + "/contents/README.md",
    { headers },
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      "GET README for " + repo + ": " + res.status + " " + res.statusText + " — " + (await res.text()),
    );
  }
  const body = await res.json();
  return body.sha;
}

async function patchRepoMetadata(entry) {
  const res = await fetch("https://api.github.com/repos/" + OWNER + "/" + entry.repo, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ description: entry.description }),
  });
  if (!res.ok) {
    throw new Error(
      "PATCH " + entry.repo + ": " + res.status + " " + res.statusText + " — " + (await res.text()),
    );
  }
}

async function putReadme(entry) {
  const draftPath = path.join(DRAFTS, entry.repo, "README.md");
  const content = await readFile(draftPath, "utf8");
  const sha = await existingReadmeSha(entry.repo);
  const res = await fetch(
    "https://api.github.com/repos/" + OWNER + "/" + entry.repo + "/contents/README.md",
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: sha ? "docs: refresh README" : "docs: add README",
        content: Buffer.from(content, "utf8").toString("base64"),
        ...(sha ? { sha } : {}),
      }),
    },
  );
  if (!res.ok) {
    throw new Error(
      "PUT README " + entry.repo + ": " + res.status + " " + res.statusText + " — " + (await res.text()),
    );
  }
}

const requested = process.argv.slice(2).map((s) => s.toLowerCase());
const targets = requested.length
  ? REPOS.filter((r) => requested.includes(r.repo.toLowerCase()))
  : REPOS;

if (requested.length && targets.length === 0) {
  console.error(
    "None of the requested repos matched. Known: " + REPOS.map((r) => r.repo).join(", "),
  );
  process.exit(1);
}

let ok = 0;
let fail = 0;
for (const entry of targets) {
  const label = OWNER + "/" + entry.repo;
  try {
    process.stdout.write("-> " + label.padEnd(50) + " ");
    await patchRepoMetadata(entry);
    await putReadme(entry);
    console.log("OK  description + README updated");
    ok++;
  } catch (err) {
    console.log("FAILED");
    console.error("  " + err.message + "\n");
    fail++;
  }
}

console.log("\nDone. " + ok + " succeeded, " + fail + " failed.");
process.exit(fail === 0 ? 0 : 1);
