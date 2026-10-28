AGED_BRIE = "Aged Brie"
SULFURAS = "Sulfuras, Hand of Ragnaros"
BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert"
CONJURED = "Conjured Mana Cake"

MAX_QUALITY = 50
MIN_QUALITY = 0


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
        for item in self.items:
            _update_item(item)


def _update_item(item):
    if item.name == SULFURAS:
        return  # Objet légendaire : ne change jamais
    if item.name == AGED_BRIE:
        _update_aged_brie(item)
    elif item.name == BACKSTAGE_PASSES:
        _update_backstage_passes(item)
    elif item.name == CONJURED:
        _degrade(item, 2)
    else:
        _degrade(item, 1)


def _update_aged_brie(item):
    item.sell_in -= 1
    _increase_quality(item, 2 if _is_expired(item) else 1)


def _update_backstage_passes(item):
    item.sell_in -= 1
    if _is_expired(item):
        item.quality = MIN_QUALITY
    elif item.sell_in < 5:
        _increase_quality(item, 3)
    elif item.sell_in < 10:
        _increase_quality(item, 2)
    else:
        _increase_quality(item, 1)


def _degrade(item, degradation_rate):
    item.sell_in -= 1
    degradation = 2 * degradation_rate if _is_expired(item) else degradation_rate
    item.quality = max(MIN_QUALITY, item.quality - degradation)


def _increase_quality(item, amount):
    item.quality = min(MAX_QUALITY, item.quality + amount)


def _is_expired(item):
    return item.sell_in < 0
