from gilded_rose import GildedRose, Item

NORMAL_ITEM = "Elixir of the Mongoose"
AGED_BRIE = "Aged Brie"
SULFURAS = "Sulfuras, Hand of Ragnaros"
BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert"
CONJURED = "Conjured Mana Cake"


def update_once(name, sell_in, quality):
    app = GildedRose([Item(name, sell_in, quality)])
    app.update_quality()
    return app.items[0]


def assert_item(item, sell_in, quality):
    assert (item.sell_in, item.quality) == (sell_in, quality)


def test_all_items_are_updated():
    app = GildedRose([Item(CONJURED, 3, 6), Item(NORMAL_ITEM, 5, 7), Item(AGED_BRIE, 2, 0)])

    app.update_quality()

    assert_item(app.items[0], 2, 4)
    assert_item(app.items[1], 4, 6)
    assert_item(app.items[2], 1, 1)


# Objet normal

def test_normal_item_quality_and_sell_in_decrease_by_one():
    assert_item(update_once(NORMAL_ITEM, 5, 7), 4, 6)


def test_normal_item_degrades_by_one_on_last_day_before_sell_date():
    assert_item(update_once(NORMAL_ITEM, 1, 10), 0, 9)


def test_normal_item_degrades_twice_as_fast_after_sell_date():
    assert_item(update_once(NORMAL_ITEM, 0, 10), -1, 8)


def test_normal_item_quality_can_reach_zero():
    assert_item(update_once(NORMAL_ITEM, 5, 1), 4, 0)


def test_normal_item_quality_can_reach_zero_after_sell_date():
    assert_item(update_once(NORMAL_ITEM, 0, 2), -1, 0)


def test_normal_item_quality_is_never_negative():
    assert_item(update_once(NORMAL_ITEM, 5, 0), 4, 0)


def test_normal_item_quality_is_never_negative_after_sell_date():
    assert_item(update_once(NORMAL_ITEM, 0, 1), -1, 0)


# Aged Brie

def test_aged_brie_increases_in_quality():
    assert_item(update_once(AGED_BRIE, 2, 0), 1, 1)


def test_aged_brie_increases_by_one_on_last_day_before_sell_date():
    assert_item(update_once(AGED_BRIE, 1, 10), 0, 11)


def test_aged_brie_increases_twice_as_fast_after_sell_date():
    assert_item(update_once(AGED_BRIE, 0, 10), -1, 12)


def test_aged_brie_quality_is_never_more_than_50():
    assert_item(update_once(AGED_BRIE, 5, 50), 4, 50)


def test_aged_brie_quality_is_never_more_than_50_after_sell_date():
    assert_item(update_once(AGED_BRIE, 0, 49), -1, 50)


# Sulfuras

def test_sulfuras_never_changes():
    assert_item(update_once(SULFURAS, 0, 80), 0, 80)


def test_sulfuras_never_changes_after_sell_date():
    assert_item(update_once(SULFURAS, -1, 80), -1, 80)


# Backstage passes

def test_backstage_passes_increase_by_one_when_concert_is_more_than_10_days_away():
    assert_item(update_once(BACKSTAGE_PASSES, 11, 20), 10, 21)


def test_backstage_passes_increase_by_two_when_concert_is_10_days_away():
    assert_item(update_once(BACKSTAGE_PASSES, 10, 20), 9, 22)


def test_backstage_passes_increase_by_two_when_concert_is_6_days_away():
    assert_item(update_once(BACKSTAGE_PASSES, 6, 20), 5, 22)


def test_backstage_passes_increase_by_three_when_concert_is_5_days_away():
    assert_item(update_once(BACKSTAGE_PASSES, 5, 20), 4, 23)


def test_backstage_passes_increase_by_three_on_concert_eve():
    assert_item(update_once(BACKSTAGE_PASSES, 1, 20), 0, 23)


def test_backstage_passes_drop_to_zero_after_concert():
    assert_item(update_once(BACKSTAGE_PASSES, 0, 20), -1, 0)


def test_backstage_passes_quality_is_never_more_than_50():
    assert_item(update_once(BACKSTAGE_PASSES, 5, 49), 4, 50)


def test_backstage_passes_quality_is_never_more_than_50_when_concert_is_10_days_away():
    assert_item(update_once(BACKSTAGE_PASSES, 10, 49), 9, 50)


# Conjured

def test_conjured_item_degrades_twice_as_fast():
    assert_item(update_once(CONJURED, 3, 6), 2, 4)


def test_conjured_item_degrades_twice_as_fast_on_last_day_before_sell_date():
    assert_item(update_once(CONJURED, 1, 6), 0, 4)


def test_conjured_item_degrades_four_times_as_fast_after_sell_date():
    assert_item(update_once(CONJURED, 0, 6), -1, 2)


def test_conjured_item_quality_is_never_negative():
    assert_item(update_once(CONJURED, 3, 1), 2, 0)


# Affichage

def test_item_is_displayed_with_name_sell_in_and_quality():
    assert repr(Item(AGED_BRIE, 2, 0)) == "Aged Brie, 2, 0"
