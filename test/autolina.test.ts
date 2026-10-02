import { describe, it, expect } from "vitest";
import { autolinaCh } from "../src/sources/autolina_ch";
import { newParsed } from "../src/normalize";

const card = (id: string, title: string, price: string, mid: string) => `<a class="url-wrapper tr-srp-item ng-tns is-server" id="c" href="/auto/bmw-m3/${id}"><div><img alt="x"></div>
<div class="top-row"><div class="make-model"><span translate="no" title="BMW">BMW</span><span translate="no" class="x" title="${title}">
<span class="monospace"><span class="no-monospace">M</span>3</span></span></div>
<div class="price-container"><div class="price"><span>CHF</span><span><span class="monospace"><span translate="no">${price}</span></span></span></div></div></div>
<div class="middle-row">${mid}</div></a></app-car-row>`;

const html = `<script>{"numberOfItems": 31}</script>` +
  card("5103103", "M3 Touring Competition M", `76<span class="no-monospace">'</span>900`, `<span>2024</span> <span>23<i>'</i>100 km</span> <span>530 PS</span> <span>Automatik</span> <span>Benzin</span>`) +
  card("5070234", "M3 Competition xDrive Touring", `137<span>'</span>140`, `<span>Neuwagen</span> <span>20 km</span> <span>530 PS</span> <span>Automatik</span>`);

describe("autolina", () => {
  it("lit les cartes de liste", () => {
    const r = autolinaCh.parseResults(html);
    expect(r.total).toBe(31); expect(r.pages).toBe(3); expect(r.items).toHaveLength(2);
    const a = r.items[0];
    expect(a).toMatchObject({ extId: "5103103", price: 76900, year: 2024, km: 23100, powerPs: 530, country: "CH", currency: "CHF" });
    expect(a.title).toContain("BMW M3 Touring Competition");
    expect(r.items[1].price).toBe(137140); expect(r.items[1].km).toBe(20);
  });
  it("pagination", () => {
    expect(autolinaCh.pageUrl("m3", 1)).toBe("https://www.autolina.ch/bmw/m3");
    expect(autolinaCh.pageUrl("m3", 2)).toBe("https://www.autolina.ch/bmw/m3/page/2");
  });
  it("lit le détail (options hors série, garantie, date)", () => {
    const d = `<h2>24 Monate Garantie Carbon Paket</h2><p>Erstzulassung 11 . 2024 Antrieb Allradantrieb Garantie Ja</p>
    <p>Der Händler meldet sich innerhalb</p><div>Optionale Ausstattung Assist: Parking Assistant Plus Komfortzugang Licht: Fernlicht-Assistent Mehr anzeigen Serienmässige Ausstattung Alarmanlage</div>`;
    const it = newParsed({ source: "autolina_ch", extId: "1", url: "u", country: "CH", currency: "CHF" });
    autolinaCh.parseDetail(d, it);
    expect(it.month).toBe(11); expect(it.year).toBe(2024);
    expect(it.extraFlags).toEqual(expect.arrayContaining(["warranty", "_dealer"]));
    expect(it.extraOptions).toContain("xdrive");
    expect(it.description).toContain("Parking Assistant Plus"); expect(it.description).not.toContain("Alarmanlage");
  });
});
