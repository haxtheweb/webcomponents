/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */

/**
 * vCard (RFC 6350, and the 2.1/3.0 files still exported by phones and mail
 * clients) reader, in the spirit of `CSVtoArray` in csv-render: small,
 * dependency free, and run client side so a contact card renders offline.
 *
 * The line reading here is deliberately a copy of the one in ics-render rather
 * than a shared import. The two formats share RFC 2425 line syntax but nothing
 * else, the elements are published separately, and an element should not take a
 * dependency on another element for forty lines of string handling.
 */

/**
 * Undo line folding. A folded line is a CRLF followed by exactly one space or
 * tab, and both the break and that one character go away.
 *
 * Doing this first is what makes a nested card work. A vCard embeds another
 * card by folding the whole thing into one AGENT property, so unfolding turns
 * those lines back into a single value and the only BEGIN:VCARD left at line
 * level is the outer card's.
 */
export function unfoldLines(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n[ \t]/g, "");
}

/**
 * Split on a delimiter, ignoring delimiters that were escaped with a backslash.
 */
function splitUnescaped(value, delimiter) {
  const out = [];
  let current = "";
  for (let i = 0; i < value.length; i++) {
    const character = value[i];
    if (character === "\\" && i + 1 < value.length) {
      current += character + value[i + 1];
      i++;
    } else if (character === delimiter) {
      out.push(current);
      current = "";
    } else {
      current += character;
    }
  }
  out.push(current);
  return out;
}

/**
 * RFC 6350 section 3.4 text unescaping.
 */
export function unescapeText(value) {
  return String(value == null ? "" : value)
    .replace(/\\([nN])/g, "\n")
    .replace(/\\([,;\\])/g, "$1");
}

/**
 * Read one content line into its name, its parameters and its raw value. The
 * separator is the first colon outside a quoted parameter, which keeps the
 * colon in `URL:https://...` from splitting the line in the wrong place.
 */
export function parseContentLine(line) {
  let cut = -1;
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const character = line[i];
    if (character === '"') {
      quoted = !quoted;
    } else if (character === ":" && !quoted) {
      cut = i;
      break;
    }
  }
  if (cut === -1) {
    return null;
  }
  const pieces = splitUnescaped(line.slice(0, cut), ";");
  // Apple and others prefix properties with a group ("item1.TEL"); the group
  // is not part of the name and nothing here needs it
  const name = pieces.shift().split(".").pop().toUpperCase();
  if (!name) {
    return null;
  }
  const params = {};
  pieces.forEach((piece) => {
    const equals = piece.indexOf("=");
    // vCard 2.1 writes a bare value where later versions write TYPE=value,
    // as in `TEL;WORK;VOICE:...`
    const key = (equals === -1 ? "TYPE" : piece.slice(0, equals)).toUpperCase();
    const raw = equals === -1 ? piece : piece.slice(equals + 1);
    const clean = raw.replace(/^"/, "").replace(/"$/, "");
    params[key] = params[key] ? `${params[key]},${clean}` : clean;
  });
  return { name, params, value: line.slice(cut + 1) };
}

/**
 * Parameter types as a lowercase list. A type may arrive repeated
 * (`TYPE=HOME;TYPE=VOICE`), comma joined (`TYPE=WORK,VOICE`), quoted
 * (`TYPE="work,voice"`) or repeated inside one parameter
 * (`TYPE=HOME,TYPE=VOICE`, which is what the sample card on
 * haxtheweb/issues#2941 does), and all of those mean the same thing.
 */
function typeList(params) {
  return String(params.TYPE || "")
    .split(",")
    .map((entry) =>
      entry
        .trim()
        .toLowerCase()
        .replace(/^type=/, ""),
    )
    .filter(Boolean);
}

function isPreferred(params) {
  return typeList(params).includes("pref") || String(params.PREF) === "1";
}

/**
 * Only allow image sources a browser can safely render, so a hostile card
 * cannot smuggle a script URL into an `img` element.
 */
export function safePhotoSource(value, params = {}) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (/^data:image\//i.test(raw) || /^https?:\/\//i.test(raw)) {
    return raw;
  }
  // a base64 photo carries no scheme of its own, so build the data URI from
  // the declared image type
  const encoding = String(params.ENCODING || "").toLowerCase();
  if (encoding === "b" || encoding === "base64") {
    const type = String(params.TYPE || "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .find((entry) => entry && entry !== "pref");
    if (
      type &&
      /^[a-z0-9+.-]+$/.test(type) &&
      /^[A-Za-z0-9+/=\s]+$/.test(raw)
    ) {
      return `data:image/${type === "jpg" ? "jpeg" : type};base64,${raw.replace(/\s+/g, "")}`;
    }
  }
  return "";
}

function formatAddress(parts) {
  return [
    parts.street,
    parts.locality,
    parts.region,
    parts.postalCode,
    parts.country,
  ]
    .map((entry) => String(entry || "").trim())
    .filter(Boolean)
    .join(", ");
}

/**
 * True when a card carried nothing worth displaying, which is what an empty
 * BEGIN/END pair or a card of properties this reader ignores comes to.
 */
function isEmptyCard(card) {
  return (
    !card.displayName &&
    !card.email &&
    !card.tel &&
    !card.photo &&
    !card.note &&
    !card.address
  );
}

function readCard(lines) {
  const card = {
    fn: "",
    name: { family: "", given: "", additional: "", prefix: "", suffix: "" },
    org: "",
    orgUnits: [],
    title: "",
    role: "",
    tels: [],
    emails: [],
    addresses: [],
    urls: [],
    photo: "",
    note: "",
    categories: [],
    kind: "",
    nickname: "",
    birthday: "",
    hasAgent: false,
  };
  lines.forEach((prop) => {
    const text = unescapeText(prop.value).trim();
    switch (prop.name) {
      case "FN":
        if (!card.fn) {
          card.fn = text;
        }
        break;
      case "N": {
        const parts = splitUnescaped(prop.value, ";").map((entry) =>
          unescapeText(entry).trim(),
        );
        card.name = {
          family: parts[0] || "",
          given: parts[1] || "",
          additional: parts[2] || "",
          prefix: parts[3] || "",
          suffix: parts[4] || "",
        };
        break;
      }
      case "ORG": {
        const parts = splitUnescaped(prop.value, ";").map((entry) =>
          unescapeText(entry).trim(),
        );
        card.org = parts.shift() || "";
        card.orgUnits = parts.filter(Boolean);
        break;
      }
      case "TITLE":
        card.title = card.title || text;
        break;
      case "ROLE":
        card.role = card.role || text;
        break;
      case "TEL":
        card.tels.push({
          value: text,
          types: typeList(prop.params),
          preferred: isPreferred(prop.params),
        });
        break;
      case "EMAIL":
        card.emails.push({
          value: text,
          types: typeList(prop.params),
          preferred: isPreferred(prop.params),
        });
        break;
      case "ADR": {
        const parts = splitUnescaped(prop.value, ";").map((entry) =>
          unescapeText(entry).trim(),
        );
        const address = {
          poBox: parts[0] || "",
          extended: parts[1] || "",
          street: parts[2] || "",
          locality: parts[3] || "",
          region: parts[4] || "",
          postalCode: parts[5] || "",
          country: parts[6] || "",
          types: typeList(prop.params),
          preferred: isPreferred(prop.params),
        };
        address.label = formatAddress(address);
        card.addresses.push(address);
        break;
      }
      case "URL":
        if (/^https?:\/\//i.test(text)) {
          card.urls.push(text);
        }
        break;
      case "PHOTO":
        if (!card.photo) {
          card.photo = safePhotoSource(prop.value.trim(), prop.params);
        }
        break;
      case "NOTE":
        card.note = card.note || text;
        break;
      case "NICKNAME":
        card.nickname = card.nickname || text;
        break;
      case "BDAY":
        card.birthday = card.birthday || text;
        break;
      case "KIND":
        card.kind = card.kind || text.toLowerCase();
        break;
      case "CATEGORIES":
        splitUnescaped(prop.value, ",")
          .map((entry) => unescapeText(entry).trim())
          .filter(Boolean)
          .forEach((entry) => card.categories.push(entry));
        break;
      case "AGENT":
        // an embedded card; recorded so a renderer can say it exists without
        // pretending the agent is a contact of its own
        card.hasAgent = true;
        break;
      default:
        break;
    }
  });
  // FN is required by the spec but missing often enough in the wild to be
  // worth assembling from the structured name
  const assembled = [card.name.given, card.name.additional, card.name.family]
    .map((entry) => entry.trim())
    .filter(Boolean)
    .join(" ");
  card.displayName =
    card.fn ||
    assembled ||
    card.org ||
    (card.emails.length ? card.emails[0].value : "");
  card.position = card.title || card.role || "";
  const primaryEmail =
    card.emails.find((entry) => entry.preferred) || card.emails[0] || null;
  const primaryTel =
    card.tels.find((entry) => entry.preferred) || card.tels[0] || null;
  card.email = primaryEmail ? primaryEmail.value : "";
  card.tel = primaryTel ? primaryTel.value : "";
  card.address = card.addresses.length ? card.addresses[0].label : "";
  card.url = card.urls.length ? card.urls[0] : "";
  // what a person-testimonial or media-quote puts in its quote slot
  card.summary =
    card.note || [card.position, card.org].filter(Boolean).join(", ");
  return card;
}

/**
 * Parse a .vcf file into its contacts, in file order.
 *
 * @param {string} text contents of a .vcf file
 */
export function parseVcf(text) {
  const contacts = [];
  let current = null;
  unfoldLines(text)
    .split("\n")
    .forEach((line) => {
      if (!line.trim()) {
        return;
      }
      const prop = parseContentLine(line);
      if (!prop) {
        return;
      }
      const value = prop.value.trim().toUpperCase();
      if (prop.name === "BEGIN" && value === "VCARD") {
        current = [];
        return;
      }
      if (prop.name === "END" && value === "VCARD") {
        if (current) {
          const card = readCard(current);
          if (!isEmptyCard(card)) {
            contacts.push(card);
          }
        }
        current = null;
        return;
      }
      if (current) {
        current.push(prop);
      }
    });
  // a file that never closed its last card is still worth reading
  if (current && current.length) {
    const card = readCard(current);
    if (!isEmptyCard(card)) {
      contacts.push(card);
    }
  }
  return { contacts };
}
