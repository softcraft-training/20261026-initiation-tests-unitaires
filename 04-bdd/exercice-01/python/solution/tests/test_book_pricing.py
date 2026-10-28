"""Prix d'un panier de livres."""

from pytest import approx

from book_pricing import price


class TestUnLivreCoute8Euros:
    def test_panier_vide_0_euro(self):
        assert price([]) == approx(0)

    def test_un_tome_8_euros(self):
        assert price([1]) == approx(8)

    def test_le_tome_1_en_deux_exemplaires_16_euros(self):
        assert price([1, 1]) == approx(16)


class TestDesTitresDifferentsDonnentUneRemiseDe5A25Pourcent:
    def test_tomes_1_et_2_15_euros_20(self):
        assert price([1, 2]) == approx(15.20)

    def test_tomes_1_2_et_3_21_euros_60(self):
        assert price([1, 2, 3]) == approx(21.60)

    # Exemple ajouté à l'étape 1 : la remise de 20 % n'était pas illustrée
    def test_tomes_1_a_4_25_euros_60(self):
        assert price([1, 2, 3, 4]) == approx(25.60)

    def test_les_5_tomes_30_euros(self):
        assert price([1, 2, 3, 4, 5]) == approx(30)


class TestLesDoublonsSontAuPrixPlein:
    def test_tomes_1_1_et_2_23_euros_20(self):
        assert price([1, 1, 2]) == approx(23.20)

    def test_tomes_1_2_3_et_3_29_euros_60(self):
        assert price([1, 2, 3, 3]) == approx(29.60)


class TestLeRegroupementLeMoinsCherEstRetenu:
    def test_tomes_1_a_3_en_double_tomes_4_et_5_51_euros_20(self):
        assert price([1, 1, 2, 2, 3, 3, 4, 5]) == approx(51.20)
