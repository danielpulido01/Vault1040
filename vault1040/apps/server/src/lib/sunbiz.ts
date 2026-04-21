import * as cheerio from 'cheerio';

export interface SunbizAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SunbizPerson {
  id: string;
  name: string;
  title: string;
  address: SunbizAddress;
}

export interface SunbizLookupResult {
  entityName: string;
  documentNumber: string;
  fein: string;
  entityType: string;
  status: string;
  principalAddress: SunbizAddress;
  mailingAddress: SunbizAddress;
  registeredAgent: {
    name: string;
    address: SunbizAddress;
  };
  persons: SunbizPerson[];
}

export function sunbizUrl(_documentNumber: string): string {
  return 'https://search.sunbiz.org/Inquiry/CorporationSearch/ByDocumentNumber';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type $Type = cheerio.CheerioAPI;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CheerioEl = cheerio.Cheerio<any>;

function parseSunbizHtml(html: string): SunbizLookupResult {
  const $ = cheerio.load(html);

  // ── Entity name ────────────────────────────────────────────────────────────
  const entityName =
    $('.corporationName').first().text().trim() ||
    $('p[style*="text-align:center"]').first().text().trim() ||
    $('h1').first().text().trim() ||
    '';

  // ── Key/value pairs ────────────────────────────────────────────────────────
  const kvMap: Record<string, string> = {};

  $('span').each((_i, el) => {
    const label = $(el).text().trim();
    const value = $(el).next('span').text().trim();
    if (label && value) kvMap[label.toLowerCase()] = value;
  });

  $('.label, .filingLabel').each((_i, el) => {
    const label = $(el).text().trim();
    const value =
      $(el).next('.value, .filingValue').text().trim() || $(el).next().text().trim();
    if (label && value) kvMap[label.toLowerCase()] = value;
  });

  const documentNumber = kvMap['document number'] || '';
  const fein = kvMap['fei/ein number'] || kvMap['ein number'] || kvMap['fein'] || '';
  const status = kvMap['status'] || '';

  const rawType = (
    kvMap['entity type'] ||
    kvMap['filing type'] ||
    kvMap['corporation type'] ||
    ''
  ).toLowerCase();
  const entityType = normalizeEntityType(rawType);

  // ── Addresses ───────────────────────────────────────────────────────────────
  const principalAddress = extractAddress($, 'principal address');
  const mailingAddress = extractAddress($, 'mailing address');

  // ── Registered agent ────────────────────────────────────────────────────────
  const agentSection = findSection($, 'registered agent');
  const registeredAgent = {
    name: extractAgentName($, agentSection),
    address: extractAddress($, 'registered agent', agentSection),
  };

  // ── Persons ─────────────────────────────────────────────────────────────────
  const persons = extractPersons($);

  return {
    entityName,
    documentNumber,
    fein,
    entityType,
    status,
    principalAddress,
    mailingAddress,
    registeredAgent,
    persons,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalizeEntityType(raw: string): string {
  if (raw.includes('limited liability')) return 'llc';
  if (raw.includes('profit corp') || raw.includes('profit corporation')) {
    if (raw.includes('non') || raw.includes('not-for')) return 'non-profit-corp';
    return 'profit-corp';
  }
  if (raw.includes('limited partnership') && raw.includes('limited liability')) return 'lllp';
  if (raw.includes('limited partnership')) return 'lp';
  return 'llc';
}

function findSection($: $Type, headerText: string): CheerioEl | null {
  let found: CheerioEl | null = null;
  const lower = headerText.toLowerCase();

  $('.detailSection, .searchResultSection, div[class*="section"]').each((_i, el) => {
    if ($(el).text().toLowerCase().includes(lower)) {
      found = $(el);
      return false;
    }
  });

  if (!found) {
    $('span, div, p, h2, h3').each((_i, el) => {
      if ($(el).children().length === 0) {
        const t = $(el).text().trim().toLowerCase();
        if (t === lower || t.startsWith(lower)) {
          found = $(el).closest('.detailSection, div');
          return false;
        }
      }
    });
  }

  return found;
}

function extractAddress(
  $: $Type,
  sectionName: string,
  section?: CheerioEl | null
): SunbizAddress {
  const el = section ?? findSection($, sectionName);
  if (!el) return emptyAddress();

  const lines: string[] = [];
  el.find('span, p').each((_i, node) => {
    const text = $(node).text().trim();
    if (text && !text.toLowerCase().includes(sectionName.toLowerCase())) {
      lines.push(text);
    }
  });

  if (lines.length === 0) {
    el.contents().each((_i, node) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((node as any).type === 'text') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const t = ((node as any).data as string).trim();
        if (t) lines.push(t);
      }
    });
  }

  return parseAddressLines(lines);
}

function extractAgentName($: $Type, section: CheerioEl | null): string {
  if (!section) return '';
  const spans = section.find('span').toArray();
  for (const s of spans) {
    const t = $(s).text().trim();
    if (t && !t.toLowerCase().includes('registered agent')) return t;
  }
  return '';
}

function parseAddressLines(lines: string[]): SunbizAddress {
  const addr = emptyAddress();
  if (lines.length === 0) return addr;

  addr.street = lines[0];

  for (const line of lines.slice(1)) {
    const m = /^(.+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/i.exec(line.trim());
    if (m) {
      addr.city = m[1].trim();
      addr.state = m[2].trim().toUpperCase();
      addr.zipCode = m[3].trim();
      continue;
    }
    if (/^(US|USA|UNITED STATES)$/i.test(line.trim())) {
      addr.country = 'United States';
    }
  }

  if (!addr.country) addr.country = 'United States';
  return addr;
}

function emptyAddress(): SunbizAddress {
  return { street: '', city: '', state: '', zipCode: '', country: 'United States' };
}

function extractPersons($: $Type): SunbizPerson[] {
  const persons: SunbizPerson[] = [];

  for (const table of $('table').toArray()) {
    const rows = $(table).find('tr').toArray();
    if (rows.length < 2) continue;

    const headerRow = $(rows[0]).text().toLowerCase();
    if (
      !headerRow.includes('name') &&
      !headerRow.includes('title') &&
      !headerRow.includes('officer') &&
      !headerRow.includes('authorized')
    ) {
      continue;
    }

    for (const row of rows.slice(1)) {
      const cells = $(row).find('td').toArray();
      if (cells.length < 2) continue;

      const name = $(cells[0]).text().trim();
      const title = $(cells[1]).text().trim();
      if (!name) continue;

      const addrLines = cells
        .slice(2)
        .map((c) => $(c).text().trim())
        .join('\n')
        .split(/\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      persons.push({
        id: `person-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        title: normalizeTitle(title),
        address: parseAddressLines(addrLines),
      });
    }
  }

  return persons;
}

function normalizeTitle(raw: string): string {
  const t = raw.trim().toUpperCase();
  if (t === 'P' || t === 'PRES' || t === 'PRESIDENT') return 'president';
  if (t === 'VP' || t.includes('VICE')) return 'vice-president';
  if (t === 'S' || t === 'SEC' || t === 'SECRETARY') return 'secretary';
  if (t === 'T' || t === 'TREAS' || t === 'TREASURER') return 'treasurer';
  if (t === 'D' || t === 'DIR' || t === 'DIRECTOR') return 'director';
  if (t === 'MGR' || t === 'MANAGER') return 'manager';
  if (t === 'MBR' || t === 'MEMBER') return 'member';
  return raw.toLowerCase();
}
