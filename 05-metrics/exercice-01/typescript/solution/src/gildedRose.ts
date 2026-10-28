export class Item {
  constructor(
    public name: string,
    public sellIn: number,
    public quality: number,
  ) {}

  toString(): string {
    return `${this.name}, ${this.sellIn}, ${this.quality}`;
  }
}

const AGED_BRIE = "Aged Brie";
const SULFURAS = "Sulfuras, Hand of Ragnaros";
const BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert";
const CONJURED = "Conjured Mana Cake";

const MAX_QUALITY = 50;
const MIN_QUALITY = 0;

export class GildedRose {
  constructor(public items: Item[]) {}

  updateQuality(): void {
    for (const item of this.items) {
      updateItem(item);
    }
  }
}

function updateItem(item: Item): void {
  switch (item.name) {
    case SULFURAS:
      // Objet légendaire : ne change jamais
      return;
    case AGED_BRIE:
      return updateAgedBrie(item);
    case BACKSTAGE_PASSES:
      return updateBackstagePasses(item);
    case CONJURED:
      return degrade(item, 2);
    default:
      return degrade(item, 1);
  }
}

function updateAgedBrie(item: Item): void {
  item.sellIn--;
  increaseQuality(item, isExpired(item) ? 2 : 1);
}

function updateBackstagePasses(item: Item): void {
  item.sellIn--;
  if (isExpired(item)) {
    item.quality = MIN_QUALITY;
  } else if (item.sellIn < 5) {
    increaseQuality(item, 3);
  } else if (item.sellIn < 10) {
    increaseQuality(item, 2);
  } else {
    increaseQuality(item, 1);
  }
}

function degrade(item: Item, degradationRate: number): void {
  item.sellIn--;
  const degradation = isExpired(item) ? 2 * degradationRate : degradationRate;
  item.quality = Math.max(MIN_QUALITY, item.quality - degradation);
}

function increaseQuality(item: Item, amount: number): void {
  item.quality = Math.min(MAX_QUALITY, item.quality + amount);
}

function isExpired(item: Item): boolean {
  return item.sellIn < 0;
}
