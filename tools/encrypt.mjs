// Encrypts the plain links file into links.enc.json, which is what the site loads.
// Usage: SHORTCUTS_PASSWORD=... node tools/encrypt.mjs path/to/links.json
// Keeps the existing salt when the password is unchanged, so phones that are
// already unlocked stay unlocked after an update.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const ITERATIONS = 600000;
const OUT = new URL("../links.enc.json", import.meta.url);
const b64 = (buf) => Buffer.from(buf).toString("base64");
const unb64 = (s) => new Uint8Array(Buffer.from(s, "base64"));

const password = process.env.SHORTCUTS_PASSWORD;
const src = process.argv[2];
if (!password || !src) {
  console.error("Usage: SHORTCUTS_PASSWORD=... node tools/encrypt.mjs path/to/links.json");
  process.exit(1);
}
const plain = JSON.stringify(JSON.parse(readFileSync(src, "utf8")));

async function deriveKey(salt, iterations) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
  );
}

// Reuse the salt only if this password opens the current file.
let salt = crypto.getRandomValues(new Uint8Array(16));
if (existsSync(OUT)) {
  const old = JSON.parse(readFileSync(OUT, "utf8"));
  try {
    const key = await deriveKey(unb64(old.salt), old.iterations);
    await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(old.iv) }, key, unb64(old.data));
    salt = unb64(old.salt);
  } catch {
    console.error("Password differs from the current file: using a new salt (phones will ask again).");
  }
}

const iv = crypto.getRandomValues(new Uint8Array(12));
const key = await deriveKey(salt, ITERATIONS);
const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plain));
writeFileSync(OUT, JSON.stringify({ v: 1, iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(data) }) + "\n");
console.log("Wrote links.enc.json");
