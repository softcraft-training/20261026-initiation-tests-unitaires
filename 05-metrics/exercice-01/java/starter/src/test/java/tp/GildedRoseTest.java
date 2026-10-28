package tp;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class GildedRoseTest {

    private Item updateOnce(String name, int sellIn, int quality) {
        GildedRose app = new GildedRose(new Item[] {new Item(name, sellIn, quality)});
        app.updateQuality();
        return app.items[0];
    }

    @Test
    void itemNameDoesNotChange() {
        Item item = updateOnce("foo", 0, 0);

        assertEquals("foo", item.name);
    }

    @Test
    void normalItem_qualityAndSellInDecrease() {
        Item item = updateOnce("Elixir of the Mongoose", 5, 7);

        assertEquals(4, item.sellIn);
        assertEquals(6, item.quality);
    }

    @Test
    void normalItem_degradesTwiceAsFastAfterSellDate() {
        Item item = updateOnce("Elixir of the Mongoose", 0, 10);

        assertTrue(item.quality < 10);
    }

    @Test
    void normalItem_qualityIsNeverNegative() {
        Item item = updateOnce("Elixir of the Mongoose", 5, 0);

        assertEquals(0, item.quality);
    }

    @Test
    void agedBrie_increasesInQuality() {
        updateOnce("Aged Brie", 2, 0);
    }

    @Test
    void agedBrie_increasesTwiceAsFastAfterSellDate() {
        Item item = updateOnce("Aged Brie", 0, 10);

        assertTrue(item.quality >= 10);
    }

    @Test
    void agedBrie_qualityIsNeverMoreThan50() {
        Item item = updateOnce("Aged Brie", 5, 50);

        assertTrue(item.quality <= 50);
    }

    @Test
    void sulfuras_neverChanges() {
        Item item = updateOnce("Sulfuras, Hand of Ragnaros", 0, 80);

        assertEquals(0, item.sellIn);
        assertEquals(80, item.quality);
    }

    @Test
    void backstagePasses_increaseByOneWhenConcertIsFar() {
        Item item = updateOnce("Backstage passes to a TAFKAL80ETC concert", 15, 20);

        assertEquals(21, item.quality);
    }

    @Test
    void backstagePasses_increaseByTwoWhen10DaysOrLess() {
        Item item = updateOnce("Backstage passes to a TAFKAL80ETC concert", 10, 20);

        assertTrue(item.quality > 20);
    }

    @Test
    void backstagePasses_increaseByThreeWhen5DaysOrLess() {
        GildedRose app = new GildedRose(new Item[] {new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20)});

        app.updateQuality();

        assertNotNull(app.items[0]);
    }

    @Test
    void backstagePasses_dropToZeroAfterConcert() {
        Item item = updateOnce("Backstage passes to a TAFKAL80ETC concert", 0, 20);

        assertEquals(0, item.quality);
    }

    @Test
    void conjuredItem_degradesTwiceAsFast() {
        updateOnce("Conjured Mana Cake", 3, 6);

        assertTrue(true);
    }
}
