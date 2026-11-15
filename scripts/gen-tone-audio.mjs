// Generates the Vietnamese tone clips with ElevenLabs. FREE PLAN ONLY:
// every run that spends credits first checks the account is on the free tier
// with enough credits left, and refuses otherwise.
//
//   node scripts/gen-tone-audio.mjs --dry-run
//   node scripts/gen-tone-audio.mjs --list-voices
//   node scripts/gen-tone-audio.mjs --add <public_owner_id>:<voice_id>
//   node scripts/gen-tone-audio.mjs --samples <voice_id>,<voice_id>
//   node scripts/gen-tone-audio.mjs --generate
//
// The API key is read from ELEVENLABS_API_KEY and never printed or stored.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadBrowserScripts, repoRoot } from './lib/load-scripts.mjs';

export const VOICE_ID = '';
export const MODEL_ID = 'eleven_flash_v2_5';
const API = 'https://api.elevenlabs.io';
const SAMPLE_TEXT = 'ma, mà, má, mả, mã, mạ.';
const SAMPLES_DIR = 'audio/vi/tones/_samples';
const MARGIN = 1.5;

export function planClips(tones) {
  return tones.map(t => ({ file: t.audio, text: `${t.example}. ${t.example}.` }));
}

export function creditsNeeded(clips) {
  return clips.reduce((n, c) => n + c.text.normalize('NFC').length, 0);
}

export function checkBudget(sub, needed) {
  const remaining = (sub.character_limit || 0) - (sub.character_count || 0);
  if (sub.tier !== 'free') {
    return { ok: false, remaining, reason: `account tier is "${sub.tier}", not free — refusing so nothing can be billed` };
  }
  const want = Math.ceil(needed * MARGIN);
  if (remaining < want) {
    return { ok: false, remaining, reason: `this run needs ${want} credits including margin, only ${remaining} left` };
  }
  return { ok: true, remaining };
}

function apiKey() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    console.error('Set ELEVENLABS_API_KEY in your environment first.');
    process.exit(1);
  }
  return key;
}

async function api(pathname, options = {}) {
  const res = await fetch(API + pathname, {
    ...options,
    headers: { 'xi-api-key': apiKey(), 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  if (!res.ok) throw new Error(`${options.method || 'GET'} ${pathname} failed: ${res.status} ${await res.text()}`);
  return res;
}

async function subscription() {
  return (await api('/v1/user/subscription')).json();
}

async function guard(needed) {
  const sub = await subscription();
  const r = checkBudget(sub, needed);
  console.log(`Plan: ${sub.tier}. Credits used ${sub.character_count} of ${sub.character_limit} (${r.remaining} left). This run needs about ${needed}.`);
  if (!r.ok) {
    console.error(`Refusing: ${r.reason}`);
    process.exit(2);
  }
}

async function tts(voiceId, text) {
  const res = await api(`/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`, {
    method: 'POST',
    body: JSON.stringify({ text, model_id: MODEL_ID, language_code: 'vi' })
  });
  return Buffer.from(await res.arrayBuffer());
}

function write(rel, buf) {
  const file = path.join(repoRoot, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
  console.log(`  wrote ${rel} (${buf.length} bytes)`);
}

async function reportAfter() {
  const sub = await subscription();
  console.log(`Credits now used ${sub.character_count} of ${sub.character_limit}.`);
}

function tones() {
  return loadBrowserScripts(['langs/vi/tones.js']).TONES.tones;
}

async function listVoices() {
  const own = await (await api('/v2/voices?page_size=100')).json();
  console.log('Your voices:');
  for (const v of own.voices || []) {
    const langs = (v.verified_languages || []).map(l => l.language + (l.accent ? `/${l.accent}` : '')).join(', ');
    console.log(`  ${v.voice_id}  ${v.name}  [${v.category || ''}]  ${langs}`);
  }
  const shared = await (await api('/v1/shared-voices?language=vi&page_size=50')).json();
  console.log('Shared library voices (Vietnamese):');
  for (const v of shared.voices || []) {
    const desc = (v.description || '').replace(/\s+/g, ' ').slice(0, 90);
    console.log(`  ${v.public_owner_id}:${v.voice_id}  ${v.name}  accent=${v.accent || '?'}  ${desc}`);
  }
}

async function addVoice(arg) {
  const [owner, voice] = String(arg || '').split(':');
  if (!owner || !voice) throw new Error('Use --add <public_owner_id>:<voice_id>');
  const res = await api(`/v1/voices/add/${encodeURIComponent(owner)}/${encodeURIComponent(voice)}`, {
    method: 'POST',
    body: JSON.stringify({ new_name: `vi-tones-${voice.slice(0, 6)}` })
  });
  console.log('Added:', JSON.stringify(await res.json()));
}

async function samples(arg) {
  const ids = String(arg || '').split(',').filter(Boolean);
  if (!ids.length) throw new Error('Use --samples <voice_id>,<voice_id>');
  await guard(SAMPLE_TEXT.length * ids.length);
  for (const id of ids) write(`${SAMPLES_DIR}/${id}.mp3`, await tts(id, SAMPLE_TEXT));
  await reportAfter();
}

async function generate() {
  if (!VOICE_ID) {
    console.error('Set VOICE_ID in scripts/gen-tone-audio.mjs first (pick one with --samples).');
    process.exit(1);
  }
  const todo = planClips(tones()).filter(c => !fs.existsSync(path.join(repoRoot, c.file)));
  if (!todo.length) { console.log('All clips already exist. Delete a clip to regenerate it.'); return; }
  await guard(creditsNeeded(todo));
  for (const c of todo) write(c.file, await tts(VOICE_ID, c.text));
  await reportAfter();
}

function dryRun() {
  const clips = planClips(tones());
  clips.forEach(c => console.log(`  ${c.file}  "${c.text}"`));
  console.log(`${clips.length} clips, about ${creditsNeeded(clips)} credits (a free-plan run needs ${Math.ceil(creditsNeeded(clips) * MARGIN)} left).`);
}

async function main(argv) {
  const [flag, arg] = argv;
  if (flag === '--dry-run') return dryRun();
  if (flag === '--list-voices') return listVoices();
  if (flag === '--add') return addVoice(arg);
  if (flag === '--samples') return samples(arg);
  if (flag === '--generate') return generate();
  console.log('Flags: --dry-run | --list-voices | --add <owner>:<voice> | --samples <id,id> | --generate');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
