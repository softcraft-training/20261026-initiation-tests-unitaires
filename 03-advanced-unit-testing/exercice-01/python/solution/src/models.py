from dataclasses import dataclass
from enum import Enum


class Category(Enum):
    ENTERTAINMENT = "divertissement"
    RESTAURANTS = "restaurants"
    GOLF = "golf"
    GROCERIES = "courses"
    TRAVEL = "voyages"

    @property
    def label(self):
        return self.value


@dataclass(frozen=True)
class Payment:
    price: int
    description: str
    category: Category


@dataclass(frozen=True)
class Email:
    subject: str
    body: str


@dataclass(frozen=True)
class YearMonth:
    year: int
    month: int  # de 1 (janvier) à 12 (décembre)

    def previous(self):
        if self.month == 1:
            return YearMonth(self.year - 1, 12)
        return YearMonth(self.year, self.month - 1)
