package tp;

class GildedRose {

    private static final String AGED_BRIE = "Aged Brie";
    private static final String SULFURAS = "Sulfuras, Hand of Ragnaros";
    private static final String BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert";
    private static final String CONJURED = "Conjured Mana Cake";

    private static final int MAX_QUALITY = 50;
    private static final int MIN_QUALITY = 0;

    Item[] items;

    public GildedRose(Item[] items) {
        this.items = items;
    }

    public void updateQuality() {
        for (Item item : items) {
            updateItem(item);
        }
    }

    private void updateItem(Item item) {
        switch (item.name) {
            case SULFURAS -> {
                // Objet légendaire : ne change jamais
            }
            case AGED_BRIE -> updateAgedBrie(item);
            case BACKSTAGE_PASSES -> updateBackstagePasses(item);
            case CONJURED -> degrade(item, 2);
            default -> degrade(item, 1);
        }
    }

    private void updateAgedBrie(Item item) {
        item.sellIn--;
        increaseQuality(item, isExpired(item) ? 2 : 1);
    }

    private void updateBackstagePasses(Item item) {
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

    private void degrade(Item item, int degradationRate) {
        item.sellIn--;
        int degradation = isExpired(item) ? 2 * degradationRate : degradationRate;
        item.quality = Math.max(MIN_QUALITY, item.quality - degradation);
    }

    private void increaseQuality(Item item, int amount) {
        item.quality = Math.min(MAX_QUALITY, item.quality + amount);
    }

    private boolean isExpired(Item item) {
        return item.sellIn < 0;
    }
}
