/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Character codes: one short string that recalls every visual choice of an
 * rpg-character, for saving, sharing and regenerating a character exactly.
 *
 *   1-0103090205...~PSU
 *   | |             '- optional flag text, URI encoded
 *   | '- two base-36 characters per slot, trailing default slots trimmed
 *   '- format version
 *
 * THE REGISTRY BELOW IS APPEND-ONLY. Codes are positional, so reordering or
 * removing a slot or an option changes what every saved code means. To add
 * an option, push it onto the END of its slot's list. To add a slot, push a
 * new entry onto the END of codeSlots. Never delete; a retired option keeps
 * its place. An index a reader does not know falls back to the slot default,
 * so newer codes still render (without the new piece) on older versions.
 */
export const CODE_VERSION = "1";

const digits = (n) => Array.from({ length: n }, (_, i) => i);

export const codeSlots = [
  { name: "base", values: [0, 1] },
  { name: "skin", values: digits(10) },
  { name: "hair", values: digits(10) },
  { name: "hatColor", values: digits(10) },
  { name: "face", values: digits(6) },
  { name: "faceItem", values: digits(10) },
  { name: "accessories", values: digits(10) },
  { name: "shirt", values: digits(10) },
  { name: "pants", values: digits(10) },
  {
    name: "preset",
    values: [
      "none",
      "hockey",
      "football",
      "firefighter",
      "police",
      "veteran",
      "nurse",
      "it",
      "doctor",
      "soda",
      "knight",
      "pirate",
      "graduate",
      "basketball",
      "baseball",
      "soccer",
      "tennis",
      "golf",
      "cycling",
      "teacher",
      "scientist",
      "chef",
      "farmer",
      "artist",
      "musician",
      "mail",
      "pilot",
      "astronaut",
      "construction",
      "wizard",
      "superhero",
      "robot",
      "dinosaur",
      "ninja",
      "witch",
      "vampire",
      "mummy",
      "skeleton",
      "ghost",
      "pumpkin",
      "zombie",
      "santa",
      "elf",
      "reindeer",
      "snowman",
      "easter-bunny",
      "colonial",
    ],
  },
  {
    name: "hat",
    values: [
      "none",
      "random",
      "bunny",
      "coffee",
      "construction",
      "cowboy",
      "education",
      "knight",
      "ninja",
      "party",
      "pirate",
      "watermelon",
      "edit",
      "error",
      "good",
      "warning",
      "apple",
      "banana",
      "orange",
      "pineapple",
      "strawberry",
      "hockey",
      "football",
      "firefighter",
      "police",
      "military",
      "nurse",
      "soda",
      "doctor",
      "helmet",
      "headband",
      "baseball",
      "visor",
      "bike-helmet",
      "goggles",
      "chef",
      "straw",
      "beret",
      "mail",
      "pilot",
      "astronaut",
      "wizard",
      "witch",
      "robot",
      "dino",
      "santa",
      "elf",
      "antlers",
      "top-hat",
      "tricorn",
      "wig",
    ],
  },
  {
    name: "mask",
    values: ["none", "lion", "plague", "theater", "pumpkin", "ghost", "mummy"],
  },
  {
    name: "makeup",
    values: [
      "none",
      "red-lipstick",
      "pink-lipstick",
      "berry-lipstick",
      "clown",
      "fangs",
      "skull",
      "zombie",
      "red-nose",
      "white-beard",
      "domino",
      "carrot",
      "bunny",
    ],
  },
  {
    name: "item",
    values: [
      "none",
      "football",
      "hockey-stick",
      "sword",
      "flag",
      "milkshake",
      "phone",
      "trophy",
      "basketball",
      "baseball-bat",
      "soccer-ball",
      "tennis-racket",
      "golf-club",
      "book",
      "apple",
      "flask",
      "spatula",
      "pitchfork",
      "paintbrush",
      "guitar",
      "envelope",
      "hammer",
      "wand",
      "broom",
      "candy-cane",
      "gift",
      "basket",
      "candy-bucket",
      "sack",
      "balloon",
    ],
  },
  { name: "offhand", values: ["none", "shield", "palette"] },
  { name: "feet", values: ["none", "skates", "skateboard"] },
  {
    name: "pet",
    values: [
      "none",
      "cat",
      "dog",
      "bunny",
      "goldfish",
      "slime",
      "squirrel",
      "dragon",
      "parrot",
      "owl",
      "bat",
    ],
  },
  { name: "shaved", values: [false, true] },
  { name: "fire", values: [false, true] },
  { name: "circle", values: [false, true] },
  {
    name: "expression",
    values: ["none", "happy", "sad", "surprised", "angry", "sleepy", "wink"],
  },
  { name: "pose", values: ["none", "wave", "cheer"] },
];

const SLOT_WIDTH = 2;
const MAX_INDEX = 36 ** SLOT_WIDTH - 1;

/**
 * Encode a character description (an object with any of the slot names, plus
 * an optional flagText) into a code. Unknown or missing values encode as the
 * slot default.
 */
export function encodeCharacter(character = {}) {
  const indexes = codeSlots.map((slot) => {
    let value = character[slot.name];
    // numeric traits may arrive as digit strings from attributes
    if (typeof slot.values[0] === "number" && typeof value === "string") {
      value = Number.parseInt(value, 10);
    }
    if (typeof slot.values[0] === "boolean") {
      value = Boolean(value);
    }
    const index = slot.values.indexOf(value);
    return index > 0 && index <= MAX_INDEX ? index : 0;
  });
  while (indexes.length && indexes[indexes.length - 1] === 0) {
    indexes.pop();
  }
  const payload = indexes
    .map((index) => index.toString(36).padStart(SLOT_WIDTH, "0"))
    .join("");
  let code = `${CODE_VERSION}-${payload}`;
  if (character.flagText) {
    code += `~${encodeURIComponent(String(character.flagText).substring(0, 4))}`;
  }
  return code;
}

/**
 * Decode a code into a full character description: every slot gets a value
 * (its default when the code is shorter or the index is unknown) plus
 * flagText. Returns null for anything that is not a code of a known version.
 */
export function decodeCharacter(code) {
  if (typeof code !== "string") {
    return null;
  }
  const match = code.trim().match(/^(\d+)-([0-9a-z]*)(?:~(.*))?$/i);
  if (!match || match[1] !== CODE_VERSION) {
    return null;
  }
  const payload = match[2].toLowerCase();
  if (payload.length % SLOT_WIDTH !== 0) {
    return null;
  }
  const character = {};
  codeSlots.forEach((slot, i) => {
    const chunk = payload.substring(i * SLOT_WIDTH, (i + 1) * SLOT_WIDTH);
    const index = chunk ? Number.parseInt(chunk, 36) : 0;
    character[slot.name] =
      index < slot.values.length ? slot.values[index] : slot.values[0];
  });
  let flagText = "";
  if (match[3]) {
    try {
      flagText = decodeURIComponent(match[3]).substring(0, 4);
    } catch {
      flagText = "";
    }
  }
  character.flagText = flagText;
  return character;
}
