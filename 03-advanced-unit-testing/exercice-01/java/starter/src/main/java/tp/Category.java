package tp;

public enum Category {
    ENTERTAINMENT("divertissement"),
    RESTAURANTS("restaurants"),
    GOLF("golf"),
    GROCERIES("courses"),
    TRAVEL("voyages");

    private final String label;

    Category(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
