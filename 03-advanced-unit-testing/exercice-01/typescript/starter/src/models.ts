export enum Category {
  Entertainment = "divertissement",
  Restaurants = "restaurants",
  Golf = "golf",
  Groceries = "courses",
  Travel = "voyages",
}

export interface Payment {
  price: number;
  description: string;
  category: Category;
}

export interface Email {
  subject: string;
  body: string;
}

export class YearMonth {
  constructor(
    readonly year: number,
    readonly month: number, // de 1 (janvier) à 12 (décembre)
  ) {}

  previous(): YearMonth {
    if (this.month === 1) {
      return new YearMonth(this.year - 1, 12);
    }
    return new YearMonth(this.year, this.month - 1);
  }

  equals(other: YearMonth): boolean {
    return this.year === other.year && this.month === other.month;
  }
}
