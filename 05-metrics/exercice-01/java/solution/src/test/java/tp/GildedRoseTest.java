package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class GildedRoseTest {

    private static final String NORMAL_ITEM = "Elixir of the Mongoose";
    private static final String AGED_BRIE = "Aged Brie";
    private static final String SULFURAS = "Sulfuras, Hand of Ragnaros";
    private static final String BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert";
    private static final String CONJURED = "Conjured Mana Cake";

    private Item updateOnce(String name, int sellIn, int quality) {
        GildedRose app = new GildedRose(new Item[] {new Item(name, sellIn, quality)});
        app.updateQuality();
        return app.items[0];
    }

    private void assertItem(Item item, int expectedSellIn, int expectedQuality) {
        assertEquals(expectedSellIn, item.sellIn, "sellIn");
        assertEquals(expectedQuality, item.quality, "quality");
    }

    @Test
    void allItemsAreUpdated() {
        GildedRose app = new GildedRose(new Item[] {
            new Item(CONJURED, 3, 6), new Item(NORMAL_ITEM, 5, 7), new Item(AGED_BRIE, 2, 0)});

        app.updateQuality();

        assertItem(app.items[0], 2, 4);
        assertItem(app.items[1], 4, 6);
        assertItem(app.items[2], 1, 1);
    }

    // Objet normal

    @Test
    void normalItem_qualityAndSellInDecreaseByOne() {
        assertItem(updateOnce(NORMAL_ITEM, 5, 7), 4, 6);
    }

    @Test
    void normalItem_degradesByOneOnLastDayBeforeSellDate() {
        assertItem(updateOnce(NORMAL_ITEM, 1, 10), 0, 9);
    }

    @Test
    void normalItem_degradesTwiceAsFastAfterSellDate() {
        assertItem(updateOnce(NORMAL_ITEM, 0, 10), -1, 8);
    }

    @Test
    void normalItem_qualityCanReachZero() {
        assertItem(updateOnce(NORMAL_ITEM, 5, 1), 4, 0);
    }

    @Test
    void normalItem_qualityCanReachZeroAfterSellDate() {
        assertItem(updateOnce(NORMAL_ITEM, 0, 2), -1, 0);
    }

    @Test
    void normalItem_qualityIsNeverNegative() {
        assertItem(updateOnce(NORMAL_ITEM, 5, 0), 4, 0);
    }

    @Test
    void normalItem_qualityIsNeverNegativeAfterSellDate() {
        assertItem(updateOnce(NORMAL_ITEM, 0, 1), -1, 0);
    }

    // Aged Brie

    @Test
    void agedBrie_increasesInQuality() {
        assertItem(updateOnce(AGED_BRIE, 2, 0), 1, 1);
    }

    @Test
    void agedBrie_increasesByOneOnLastDayBeforeSellDate() {
        assertItem(updateOnce(AGED_BRIE, 1, 10), 0, 11);
    }

    @Test
    void agedBrie_increasesTwiceAsFastAfterSellDate() {
        assertItem(updateOnce(AGED_BRIE, 0, 10), -1, 12);
    }

    @Test
    void agedBrie_qualityIsNeverMoreThan50() {
        assertItem(updateOnce(AGED_BRIE, 5, 50), 4, 50);
    }

    @Test
    void agedBrie_qualityIsNeverMoreThan50AfterSellDate() {
        assertItem(updateOnce(AGED_BRIE, 0, 49), -1, 50);
    }

    // Sulfuras

    @Test
    void sulfuras_neverChanges() {
        assertItem(updateOnce(SULFURAS, 0, 80), 0, 80);
    }

    @Test
    void sulfuras_neverChangesAfterSellDate() {
        assertItem(updateOnce(SULFURAS, -1, 80), -1, 80);
    }

    // Backstage passes

    @Test
    void backstagePasses_increaseByOneWhenConcertIsMoreThan10DaysAway() {
        assertItem(updateOnce(BACKSTAGE_PASSES, 11, 20), 10, 21);
    }

    @Test
    void backstagePasses_increaseByTwoWhenConcertIs10DaysAway() {
        assertItem(updateOnce(BACKSTAGE_PASSES, 10, 20), 9, 22);
    }

    @Test
    void backstagePasses_increaseByTwoWhenConcertIs6DaysAway() {
        assertItem(updateOnce(BACKSTAGE_PASSES, 6, 20), 5, 22);
    }

    @Test
    void backstagePasses_increaseByThreeWhenConcertIs5DaysAway() {
        assertItem(updateOnce(BACKSTAGE_PASSES, 5, 20), 4, 23);
    }

    @Test
    void backstagePasses_increaseByThreeOnConcertEve() {
        assertItem(updateOnce(BACKSTAGE_PASSES, 1, 20), 0, 23);
    }

    @Test
    void backstagePasses_dropToZeroAfterConcert() {
        assertItem(updateOnce(BACKSTAGE_PASSES, 0, 20), -1, 0);
    }

    @Test
    void backstagePasses_qualityIsNeverMoreThan50() {
        assertItem(updateOnce(BACKSTAGE_PASSES, 5, 49), 4, 50);
    }

    @Test
    void backstagePasses_qualityIsNeverMoreThan50WhenConcertIs10DaysAway() {
        assertItem(updateOnce(BACKSTAGE_PASSES, 10, 49), 9, 50);
    }

    // Conjured

    @Test
    void conjuredItem_degradesTwiceAsFast() {
        assertItem(updateOnce(CONJURED, 3, 6), 2, 4);
    }

    @Test
    void conjuredItem_degradesTwiceAsFastOnLastDayBeforeSellDate() {
        assertItem(updateOnce(CONJURED, 1, 6), 0, 4);
    }

    @Test
    void conjuredItem_degradesFourTimesAsFastAfterSellDate() {
        assertItem(updateOnce(CONJURED, 0, 6), -1, 2);
    }

    @Test
    void conjuredItem_qualityIsNeverNegative() {
        assertItem(updateOnce(CONJURED, 3, 1), 2, 0);
    }

    // Affichage

    @Test
    void itemIsDisplayedWithNameSellInAndQuality() {
        assertEquals("Aged Brie, 2, 0", new Item(AGED_BRIE, 2, 0).toString());
    }
}
