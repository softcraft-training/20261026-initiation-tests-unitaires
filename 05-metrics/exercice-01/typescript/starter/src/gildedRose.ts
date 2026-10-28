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

export class GildedRose {
  constructor(public items: Item[]) {}

  updateQuality(): void {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === "Conjured Mana Cake") {
        this.updateConjuredQuality(i);
        continue;
      }

      if (this.items[i].name !== "Aged Brie"
          && this.items[i].name !== "Backstage passes to a TAFKAL80ETC concert") {
        if (this.items[i].quality > 0) {
          if (this.items[i].name !== "Sulfuras, Hand of Ragnaros") {
            this.items[i].quality = this.items[i].quality - 1;
          }
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1;

          if (this.items[i].name === "Backstage passes to a TAFKAL80ETC concert") {
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }

            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1;
              }
            }
          }
        }
      }

      if (this.items[i].name !== "Sulfuras, Hand of Ragnaros") {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }

      if (this.items[i].sellIn < 0) {
        if (this.items[i].name !== "Aged Brie") {
          if (this.items[i].name !== "Backstage passes to a TAFKAL80ETC concert") {
            if (this.items[i].quality > 0) {
              if (this.items[i].name !== "Sulfuras, Hand of Ragnaros") {
                this.items[i].quality = this.items[i].quality - 1;
              }
            }
          } else {
            this.items[i].quality = this.items[i].quality - this.items[i].quality;
          }
        } else {
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1;
          }
        }
      }
    }
  }

  // Copié depuis updateQuality pour aller vite : les objets "Conjured" se dégradent deux fois plus vite
 private updateConjuredQuality(i: number): void {
    if (this.items[i].name !== "Aged Brie"
        && this.items[i].name !== "Backstage passes to a TAFKAL80ETC concert") {
      if (this.items[i].quality > 0) {
        if (this.items[i].name !== "Sulfuras, Hand of Ragnaros") {
          this.items[i].quality = Math.max(this.items[i].quality - 2, 0);
        }
      }
    } else {
      if (this.items[i].quality < 50) {
        this.items[i].quality = this.items[i].quality + 1;

        if (this.items[i].name === "Backstage passes to a TAFKAL80ETC concert") {
          if (this.items[i].sellIn < 11) {
            if (this.items[i].quality < 50) {
              this.items[i].quality = this.items[i].quality + 1;
            }
          }

          if (this.items[i].sellIn < 6) {
            if (this.items[i].quality < 50) {
              this.items[i].quality = this.items[i].quality + 1;
            }
          }
        }
      }
    }

    if (this.items[i].name !== "Sulfuras, Hand of Ragnaros") {
      this.items[i].sellIn = this.items[i].sellIn - 1;
    }

    if (this.items[i].sellIn < 0) {
      if (this.items[i].name !== "Aged Brie") {
        if (this.items[i].name !== "Backstage passes to a TAFKAL80ETC concert") {
          if (this.items[i].quality > 0) {
            if (this.items[i].name !== "Sulfuras, Hand of Ragnaros") {
              this.items[i].quality = Math.max(this.items[i].quality - 2, 0);
            }
          }
        } else {
          this.items[i].quality = this.items[i].quality - this.items[i].quality;
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1;
        }
      }
    }
  }
}
