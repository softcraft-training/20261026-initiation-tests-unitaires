class Item:
    def __init__(self, name, sell_in, quality):
        self.name = name
        self.sell_in = sell_in
        self.quality = quality

    def __repr__(self):
        return f"{self.name}, {self.sell_in}, {self.quality}"


class GildedRose:
    def __init__(self, items):
        self.items = items

    def update_quality(self):
        for i in range(len(self.items)):
            if self.items[i].name == "Conjured Mana Cake":
                self._update_conjured_quality(i)
                continue

            if (self.items[i].name != "Aged Brie"
                    and self.items[i].name != "Backstage passes to a TAFKAL80ETC concert"):
                if self.items[i].quality > 0:
                    if self.items[i].name != "Sulfuras, Hand of Ragnaros":
                        self.items[i].quality = self.items[i].quality - 1
            else:
                if self.items[i].quality < 50:
                    self.items[i].quality = self.items[i].quality + 1

                    if self.items[i].name == "Backstage passes to a TAFKAL80ETC concert":
                        if self.items[i].sell_in < 11:
                            if self.items[i].quality < 50:
                                self.items[i].quality = self.items[i].quality + 1

                        if self.items[i].sell_in < 6:
                            if self.items[i].quality < 50:
                                self.items[i].quality = self.items[i].quality + 1

            if self.items[i].name != "Sulfuras, Hand of Ragnaros":
                self.items[i].sell_in = self.items[i].sell_in - 1

            if self.items[i].sell_in < 0:
                if self.items[i].name != "Aged Brie":
                    if self.items[i].name != "Backstage passes to a TAFKAL80ETC concert":
                        if self.items[i].quality > 0:
                            if self.items[i].name != "Sulfuras, Hand of Ragnaros":
                                self.items[i].quality = self.items[i].quality - 1
                    else:
                        self.items[i].quality = self.items[i].quality - self.items[i].quality
                else:
                    if self.items[i].quality < 50:
                        self.items[i].quality = self.items[i].quality + 1

    # Copié depuis update_quality pour aller vite : les objets "Conjured" se dégradent deux fois plus vite
    def _update_conjured_quality(self, i):
        if (self.items[i].name != "Aged Brie"
                and self.items[i].name != "Backstage passes to a TAFKAL80ETC concert"):
            if self.items[i].quality > 0:
                if self.items[i].name != "Sulfuras, Hand of Ragnaros":
                    self.items[i].quality = max(self.items[i].quality - 2, 0)
        else:
            if self.items[i].quality < 50:
                self.items[i].quality = self.items[i].quality + 1

                if self.items[i].name == "Backstage passes to a TAFKAL80ETC concert":
                    if self.items[i].sell_in < 11:
                        if self.items[i].quality < 50:
                            self.items[i].quality = self.items[i].quality + 1

                    if self.items[i].sell_in < 6:
                        if self.items[i].quality < 50:
                            self.items[i].quality = self.items[i].quality + 1

        if self.items[i].name != "Sulfuras, Hand of Ragnaros":
            self.items[i].sell_in = self.items[i].sell_in - 1

        if self.items[i].sell_in < 0:
            if self.items[i].name != "Aged Brie":
                if self.items[i].name != "Backstage passes to a TAFKAL80ETC concert":
                    if self.items[i].quality > 0:
                        if self.items[i].name != "Sulfuras, Hand of Ragnaros":
                            self.items[i].quality = max(self.items[i].quality - 2, 0)
                else:
                    self.items[i].quality = self.items[i].quality - self.items[i].quality
            else:
                if self.items[i].quality < 50:
                    self.items[i].quality = self.items[i].quality + 1
