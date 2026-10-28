const { GildedRose, Item } = require("../src/gildedRose");

const NORMAL_ITEM = "Elixir of the Mongoose";
const AGED_BRIE = "Aged Brie";
const SULFURAS = "Sulfuras, Hand of Ragnaros";
const BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert";
const CONJURED = "Conjured Mana Cake";

function updateOnce(name, sellIn, quality) {
  const app = new GildedRose([new Item(name, sellIn, quality)]);
  app.updateQuality();
  return app.items[0];
}

function expectItem(item, sellIn, quality) {
  expect({ sellIn: item.sellIn, quality: item.quality }).toEqual({ sellIn, quality });
}

describe("Gilded Rose", () => {
  test("all items are updated", () => {
    const app = new GildedRose([
      new Item(CONJURED, 3, 6),
      new Item(NORMAL_ITEM, 5, 7),
      new Item(AGED_BRIE, 2, 0),
    ]);

    app.updateQuality();

    expectItem(app.items[0], 2, 4);
    expectItem(app.items[1], 4, 6);
    expectItem(app.items[2], 1, 1);
  });

  describe("normal item", () => {
    test("quality and sellIn decrease by one", () => {
      expectItem(updateOnce(NORMAL_ITEM, 5, 7), 4, 6);
    });

    test("degrades by one on last day before sell date", () => {
      expectItem(updateOnce(NORMAL_ITEM, 1, 10), 0, 9);
    });

    test("degrades twice as fast after sell date", () => {
      expectItem(updateOnce(NORMAL_ITEM, 0, 10), -1, 8);
    });

    test("quality can reach zero", () => {
      expectItem(updateOnce(NORMAL_ITEM, 5, 1), 4, 0);
    });

    test("quality can reach zero after sell date", () => {
      expectItem(updateOnce(NORMAL_ITEM, 0, 2), -1, 0);
    });

    test("quality is never negative", () => {
      expectItem(updateOnce(NORMAL_ITEM, 5, 0), 4, 0);
    });

    test("quality is never negative after sell date", () => {
      expectItem(updateOnce(NORMAL_ITEM, 0, 1), -1, 0);
    });
  });

  describe("aged brie", () => {
    test("increases in quality", () => {
      expectItem(updateOnce(AGED_BRIE, 2, 0), 1, 1);
    });

    test("increases by one on last day before sell date", () => {
      expectItem(updateOnce(AGED_BRIE, 1, 10), 0, 11);
    });

    test("increases twice as fast after sell date", () => {
      expectItem(updateOnce(AGED_BRIE, 0, 10), -1, 12);
    });

    test("quality is never more than 50", () => {
      expectItem(updateOnce(AGED_BRIE, 5, 50), 4, 50);
    });

    test("quality is never more than 50 after sell date", () => {
      expectItem(updateOnce(AGED_BRIE, 0, 49), -1, 50);
    });
  });

  describe("sulfuras", () => {
    test("never changes", () => {
      expectItem(updateOnce(SULFURAS, 0, 80), 0, 80);
    });

    test("never changes after sell date", () => {
      expectItem(updateOnce(SULFURAS, -1, 80), -1, 80);
    });
  });

  describe("backstage passes", () => {
    test("increase by one when concert is more than 10 days away", () => {
      expectItem(updateOnce(BACKSTAGE_PASSES, 11, 20), 10, 21);
    });

    test("increase by two when concert is 10 days away", () => {
      expectItem(updateOnce(BACKSTAGE_PASSES, 10, 20), 9, 22);
    });

    test("increase by two when concert is 6 days away", () => {
      expectItem(updateOnce(BACKSTAGE_PASSES, 6, 20), 5, 22);
    });

    test("increase by three when concert is 5 days away", () => {
      expectItem(updateOnce(BACKSTAGE_PASSES, 5, 20), 4, 23);
    });

    test("increase by three on concert eve", () => {
      expectItem(updateOnce(BACKSTAGE_PASSES, 1, 20), 0, 23);
    });

    test("drop to zero after concert", () => {
      expectItem(updateOnce(BACKSTAGE_PASSES, 0, 20), -1, 0);
    });

    test("quality is never more than 50", () => {
      expectItem(updateOnce(BACKSTAGE_PASSES, 5, 49), 4, 50);
    });

    test("quality is never more than 50 when concert is 10 days away", () => {
      expectItem(updateOnce(BACKSTAGE_PASSES, 10, 49), 9, 50);
    });
  });

  describe("conjured item", () => {
    test("degrades twice as fast", () => {
      expectItem(updateOnce(CONJURED, 3, 6), 2, 4);
    });

    test("degrades twice as fast on last day before sell date", () => {
      expectItem(updateOnce(CONJURED, 1, 6), 0, 4);
    });

    test("degrades four times as fast after sell date", () => {
      expectItem(updateOnce(CONJURED, 0, 6), -1, 2);
    });

    test("quality is never negative", () => {
      expectItem(updateOnce(CONJURED, 3, 1), 2, 0);
    });
  });

  test("item is displayed with name, sellIn and quality", () => {
    expect(new Item(AGED_BRIE, 2, 0).toString()).toBe("Aged Brie, 2, 0");
  });
});
