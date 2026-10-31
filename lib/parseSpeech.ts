// Mengubah ucapan angka (Indonesia/Inggris, atau digit) menjadi jumlah orang.
// Contoh: "delapan koma dua miliar" -> 8.2e9, "8,2 miliar" -> 8.2e9,
// "delapan miliar dua ratus juta" -> 8.2e9, "8.200.000.000" -> 8.2e9

const UNITS: Record<string, number> = {
    ribu: 1e3, juta: 1e6, miliar: 1e9, milyar: 1e9, triliun: 1e12,
    thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12,
  };
  const DIGITS: Record<string, number> = {
    nol: 0, kosong: 0, satu: 1, dua: 2, tiga: 3, empat: 4, lima: 5, enam: 6, tujuh: 7, delapan: 8, sembilan: 9,
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  };
  const SPECIAL: Record<string, number> = { sepuluh: 10, sebelas: 11, seratus: 100, seribu: 1000, ten: 10, eleven: 11 };
  const DECIMAL = new Set(["koma", "titik", "point", "dot"]);
  
  export function parsePeople(input: string): number | null {
    const toks = input
      .toLowerCase()
      .replace(/[^\p{L}\p{N}.,\s]/gu, " ")
      .split(/\s+/)
      .filter(Boolean);
  
    let total = 0;
    let group = 0;
    let last = 0;
    let frac: string | null = null;
    let any = false;
    let hasUnit = false;
    const fracVal = () => (frac ? parseFloat("0." + frac) : 0);
  
    for (const t of toks) {
      // angka berupa digit
      if (/^\d{1,3}(\.\d{3}){2,}$/.test(t) || /^\d+([.,]\d+)?$/.test(t)) {
        if (frac !== null && /^\d+$/.test(t)) {
          frac += t;
          any = true;
          continue;
        }
        const val = /^\d{1,3}(\.\d{3}){2,}$/.test(t) ? Number(t.replace(/\./g, "")) : parseFloat(t.replace(",", "."));
        group += val;
        last = val;
        any = true;
        continue;
      }
      if (DECIMAL.has(t)) {
        frac = "";
        continue;
      }
      if (t in DIGITS) {
        if (frac !== null) frac += String(DIGITS[t]);
        else {
          group += DIGITS[t];
          last = DIGITS[t];
        }
        any = true;
        continue;
      }
      if (t in SPECIAL) {
        group += SPECIAL[t];
        last = SPECIAL[t];
        any = true;
        continue;
      }
      if (t === "belas") {
        group += 10;
        continue;
      }
      if (t === "puluh") {
        group = group - last + last * 10;
        last *= 10;
        continue;
      }
      if (t === "ratus" || t === "hundred") {
        const base = last || 1;
        group = group - last + base * 100;
        last = base * 100;
        continue;
      }
      if (t in UNITS) {
        total += (group + fracVal() || 1) * UNITS[t];
        group = 0;
        last = 0;
        frac = null;
        hasUnit = true;
        any = true;
        continue;
      }
      // kata lain (sekitar, orang, tahun, dll.) diabaikan
    }
    if (!any) return null;
    total += group + fracVal();
    if (!hasUnit && total < 1000) total *= 1e9; // "delapan koma dua" -> dianggap miliar
    return total;
  }
  
  export type Verdict = { kind: "right" | "wrong" | "unclear"; heardB: number | null };
  
  /** Cek beberapa alternatif hasil pengenalan suara terhadap jawaban (dalam miliar). */
  export function judge(alts: string[], answerB: number, tolB: number): Verdict {
    let firstB: number | null = null;
    for (const a of alts) {
      const v = parsePeople(a);
      if (v == null) continue;
      const b = v / 1e9;
      if (Math.abs(b - answerB) <= tolB) return { kind: "right", heardB: b };
      if (firstB == null) firstB = b;
    }
    return firstB == null ? { kind: "unclear", heardB: null } : { kind: "wrong", heardB: firstB };
  }
  
  export const fmtB = (b: number) => (Math.round(b * 100) / 100).toString().replace(".", ",");