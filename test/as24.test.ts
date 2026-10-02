import { describe, it, expect } from "vitest";
import { as24fr, as24es, as24de, colorFromSlug } from "../src/sources/as24";

const page = (listings: unknown[]) => `<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify({ props: { pageProps: { listings, numberOfResults: 152, numberOfPages: 8 } } })}</script></html>`;
const fr = {
  id: "85116298", url: "/offres/bmw-m3-f80-3-0-431-ch-essence-noir-cat_ma13mo1646-f99cbfb5", price: { priceRaw: 41790 }, seller: { type: "Dealer" },
  tracking: { firstRegistration: "07-2016", mileage: "38082" },
  vehicle: { model: "M3", modelVersionInput: "F80 3.0 431 CH", variant: "Berline", subtitle: "* AUTOMATIQUE * HUD * HARMAN KARD", transmission: "Boîte automatique", isCurrentlyDamaged: false },
  vehicleDetails: [{ iconName: "calendar", data: "07/2016" }, { iconName: "speedometer", data: "317 kW (431 Ch)" }],
};
const es = {
  id: "3e957b3e", url: "/anuncios/bmw-m3-touring-mxdrive-competition-gasolina-blanco-cat_ma13mo1646-3e957b3e", price: { priceRaw: 87000 },
  tracking: { firstRegistration: "03-2024", mileage: "19000" },
  vehicle: { model: "M3", variant: "Touring", subtitle: "4WD", transmission: "Automático", isCurrentlyDamaged: true },
  vehicleDetails: [{ iconName: "speedometer", data: "390 kW (530 CV)" }],
};
describe("AutoScout24 FR / ES / DE", () => {
  it("France", () => {
    const r = as24fr.parseResults(page([fr]));
    expect(r.total).toBe(152); expect(r.pages).toBe(8);
    const it = r.items[0];
    expect(it).toMatchObject({ country: "FR", currency: "EUR", price: 41790, year: 2016, month: 7, km: 38082, powerPs: 431, source: "autoscout24_fr" });
    expect(it.url).toBe("https://www.autoscout24.fr" + fr.url);
    expect(it.color).toBe("Noir");
    expect(it.title).toContain("M3");
  });
  it("Espagne : couleur dans l'adresse, véhicule endommagé", () => {
    const it = as24es.parseResults(page([es])).items[0];
    expect(it).toMatchObject({ country: "ES", price: 87000, powerPs: 530, color: "Blanc" });
    expect(it.extraFlags).toContain("damaged");
  });
  it("URL de liste par pays", () => {
    expect(as24fr.pageUrl("m3", 1)).toContain("autoscout24.fr/lst/bmw/m3");
    expect(as24fr.pageUrl("m3", 1)).toContain("cy=F");
    expect(as24es.pageUrl("m3", 2)).toContain("cy=E");
    expect(as24de.pageUrl("m3", 2)).toContain("cy=D");
  });
  it("couleur depuis l'adresse", () => {
    expect(colorFromSlug("/angebote/bmw-m3-competition-benzin-weiss-cat_ma13")).toBe("Blanc");
    expect(colorFromSlug("/anuncios/bmw-m4-gasolina-azul-cat_x")).toBe("Bleu");
    expect(colorFromSlug("/angebote/bmw-m3-benzin-grau-cat_x")).toBe("Gris");
  });
});
