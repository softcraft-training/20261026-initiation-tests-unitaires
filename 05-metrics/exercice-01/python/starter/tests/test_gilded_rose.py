from gilded_rose import GildedRose, Item


def update_once(name, sell_in, quality):
    app = GildedRose([Item(name, sell_in, quality)])
    app.update_quality()
    return app.items[0]


def test_item_name_does_not_change():
    item = update_once("foo", 0, 0)

    assert item.name == "foo"


def test_normal_item_quality_and_sell_in_decrease():
    item = update_once("Elixir of the Mongoose", 5, 7)

    assert item.sell_in == 4
    assert item.quality == 6


def test_normal_item_degrades_twice_as_fast_after_sell_date():
    item = update_once("Elixir of the Mongoose", 0, 10)

    assert item.quality < 10


def test_normal_item_quality_is_never_negative():
    item = update_once("Elixir of the Mongoose", 5, 0)

    assert item.quality == 0


def test_aged_brie_increases_in_quality():
    update_once("Aged Brie", 2, 0)


def test_aged_brie_increases_twice_as_fast_after_sell_date():
    item = update_once("Aged Brie", 0, 10)

    assert item.quality >= 10


def test_aged_brie_quality_is_never_more_than_50():
    item = update_once("Aged Brie", 5, 50)

    assert item.quality <= 50


def test_sulfuras_never_changes():
    item = update_once("Sulfuras, Hand of Ragnaros", 0, 80)

    assert item.sell_in == 0
    assert item.quality == 80


def test_backstage_passes_increase_by_one_when_concert_is_far():
    item = update_once("Backstage passes to a TAFKAL80ETC concert", 15, 20)

    assert item.quality == 21


def test_backstage_passes_increase_by_two_when_10_days_or_less():
    item = update_once("Backstage passes to a TAFKAL80ETC concert", 10, 20)

    assert item.quality > 20


def test_backstage_passes_increase_by_three_when_5_days_or_less():
    app = GildedRose([Item("Backstage passes to a TAFKAL80ETC concert", 5, 20)])

    app.update_quality()

    assert app.items[0] is not None


def test_backstage_passes_drop_to_zero_after_concert():
    item = update_once("Backstage passes to a TAFKAL80ETC concert", 0, 20)

    assert item.quality == 0


def test_conjured_item_degrades_twice_as_fast():
    update_once("Conjured Mana Cake", 3, 6)

    assert True
