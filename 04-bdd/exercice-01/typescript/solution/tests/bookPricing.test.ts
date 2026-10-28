import { price } from "../src/bookPricing";

describe("Prix d'un panier de livres", () => {
  describe("un livre coûte 8 €", () => {
    it("panier vide : 0 €", () => {
      expect(price([])).toBeCloseTo(0, 2);
    });

    it("un tome : 8 €", () => {
      expect(price([1])).toBeCloseTo(8, 2);
    });

    it("le tome 1 en deux exemplaires : 16 €", () => {
      expect(price([1, 1])).toBeCloseTo(16, 2);
    });
  });

  describe("des titres différents donnent une remise de 5 à 25 %", () => {
    it("tomes 1 et 2 : 15,20 €", () => {
      expect(price([1, 2])).toBeCloseTo(15.2, 2);
    });

    it("tomes 1, 2 et 3 : 21,60 €", () => {
      expect(price([1, 2, 3])).toBeCloseTo(21.6, 2);
    });

    // Exemple ajouté à l'étape 1 : la remise de 20 % n'était pas illustrée
    it("tomes 1 à 4 : 25,60 €", () => {
      expect(price([1, 2, 3, 4])).toBeCloseTo(25.6, 2);
    });

    it("les 5 tomes : 30 €", () => {
      expect(price([1, 2, 3, 4, 5])).toBeCloseTo(30, 2);
    });
  });

  describe("les doublons sont au prix plein", () => {
    it("tomes 1, 1 et 2 : 23,20 €", () => {
      expect(price([1, 1, 2])).toBeCloseTo(23.2, 2);
    });

    it("tomes 1, 2, 3 et 3 : 29,60 €", () => {
      expect(price([1, 2, 3, 3])).toBeCloseTo(29.6, 2);
    });
  });

  describe("le regroupement le moins cher est retenu", () => {
    it("tomes 1 à 3 en double, tomes 4 et 5 : 51,20 €", () => {
      expect(price([1, 1, 2, 2, 3, 3, 4, 5])).toBeCloseTo(51.2, 2);
    });
  });
});
