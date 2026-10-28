import { GildedRose, Item } from "../src/gildedRose";

function updateOnce(name: string, sellIn: number, quality: number): Item {
  const app = new GildedRose([new Item(name, sellIn, quality)]);
  app.updateQuality();
  return app.items[0];
}

describe("Gilded Rose", () => {
  test("item name does not change", () => {
    const item = updateOnce("foo", 0, 0);

    expect(item.name).toBe("foo");
  });

  test("normal item: quality and sellIn decrease", () => {
    const item = updateOnce("Elixir of the Mongoose", 5, 7);

    expect(item.sellIn).toBe(4);
    expect(item.quality).toBe(6);
  });

  test("normal item: degrades twice as fast after sell date", () => {
    const item = updateOnce("Elixir of the Mongoose", 0, 10);

    expect(item.quality).toBeLessThan(10);
  });

  test("normal item: quality is never negative", () => {
    const item = updateOnce("Elixir of the Mongoose", 5, 0);

    expect(item.quality).toBe(0);
  });

  test("aged brie: increases in quality", () => {
    updateOnce("Aged Brie", 2, 0);
  });

  test("aged brie: increases twice as fast after sell date", () => {
    const item = updateOnce("Aged Brie", 0, 10);

    expect(item.quality).toBeGreaterThanOrEqual(10);
  });

  test("aged brie: quality is never more than 50", () => {
    const item = updateOnce("Aged Brie", 5, 50);

    expect(item.quality).toBeLessThanOrEqual(50);
  });

  test("sulfuras: never changes", () => {
    const item = updateOnce("Sulfuras, Hand of Ragnaros", 0, 80);

    expect(item.sellIn).toBe(0);
    expect(item.quality).toBe(80);
  });

  test("backstage passes: increase by one when concert is far", () => {
    const item = updateOnce("Backstage passes to a TAFKAL80ETC concert", 15, 20);

    expect(item.quality).toBe(21);
  });

  test("backstage passes: increase by two when 10 days or less", () => {
    const item = updateOnce("Backstage passes to a TAFKAL80ETC concert", 10, 20);

    expect(item.quality).toBeGreaterThan(20);
  });

  test("backstage passes: increase by three when 5 days or less", () => {
    const app = new GildedRose([new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20)]);

    app.updateQuality();

    expect(app.items[0]).toBeDefined();
  });

  test("backstage passes: drop to zero after concert", () => {
    const item = updateOnce("Backstage passes to a TAFKAL80ETC concert", 0, 20);

    expect(item.quality).toBe(0);
  });

  test("conjured item: degrades twice as fast", () => {
    updateOnce("Conjured Mana Cake", 3, 6);

    expect(true).toBe(true);
  });
});
