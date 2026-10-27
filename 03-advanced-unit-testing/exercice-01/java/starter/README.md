# Starter Java — JUnit 5 + Mockito

## Prérequis

- JDK 17 ou plus récent : `java -version`
- Maven 3.9 ou plus récent : `mvn -v` (ou utilisez le Maven intégré à IntelliJ IDEA / Eclipse / VS Code)

## Structure

```
starter
├── pom.xml                                  # Dépendances (JUnit 5, Mockito) et plugins Maven
└── src
    ├── main/java/tp
    │   ├── Category.java                    # Énumération des catégories
    │   ├── Payment.java                     # Paiement (objet valeur)
    │   ├── Email.java                       # Contenu d'un email (objet valeur)
    │   ├── PaymentRepository.java           # Contrat : récupérer les paiements
    │   ├── EmailSender.java                 # Contrat : envoyer un email
    │   └── UnusualSpendingService.java      # Classe à implémenter
    └── test/java/tp                         # Vos tests (à créer)
```

## Restaurer le projet

```bash
mvn install -DskipTests
```

## Exécuter les tests

```bash
mvn test
```

Créez votre classe de test dans `src/test/java/tp/UnusualSpendingServiceTest.java`.

> Dans un IDE, vous pouvez aussi cliquer sur l'icône ▶ à côté d'une classe ou d'une méthode de test.

## Cheat sheet Mockito

```java
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
```

### Créer une doublure

```java
PaymentRepository paymentRepository = mock(PaymentRepository.class);
EmailSender emailSender = mock(EmailSender.class);

UnusualSpendingService service = new UnusualSpendingService(paymentRepository, emailSender);
```

> Une doublure créée avec `mock(...)` ne fait rien et retourne des valeurs par défaut : `null`, `0`, `false` ou une **liste vide**.

### Stub : définir une valeur de retour

```java
// Retourne cette liste quand fetchPayments est appelé avec ces arguments précis
when(paymentRepository.fetchPayments("user-42", YearMonth.of(2026, 10)))
        .thenReturn(List.of(new Payment(148, "Supermarché", Category.GROCERIES)));

// Quels que soient les arguments
when(paymentRepository.fetchPayments(any(), any())).thenReturn(List.of());
```

### Mock : vérifier un appel

```java
verify(emailSender).sendEmail("user-42", new Email("sujet", "corps"));  // appelé une fois avec ces arguments
verify(emailSender).sendEmail(eq("user-42"), any(Email.class));         // peu importe l'email
verify(emailSender, never()).sendEmail(any(), any());                   // jamais appelé
verify(emailSender, times(2)).sendEmail(any(), any());                  // appelé 2 fois
```

> ⚠️ Si un argument utilise un *matcher* (`any()`, `eq()`…), **tous** les arguments doivent en utiliser un.

### Capturer un argument pour l'inspecter

```java
import org.mockito.ArgumentCaptor;

ArgumentCaptor<Email> captor = ArgumentCaptor.forClass(Email.class);
verify(emailSender).sendEmail(eq("user-42"), captor.capture());
Email email = captor.getValue();
assertEquals("Dépenses inhabituelles de 148 $ détectées !", email.subject());
```

### Préparer les doublures avant chaque test

```java
@BeforeEach
void setUp() {
    paymentRepository = mock(PaymentRepository.class);
    emailSender = mock(EmailSender.class);
    service = new UnusualSpendingService(paymentRepository, emailSender);
}
```

### Comparer des objets valeur

`Payment` et `Email` sont des `record` : deux instances avec les mêmes valeurs sont **égales** (`equals`). On peut donc les utiliser directement dans `assertEquals` et `verify`.

### Écrire un texte sur plusieurs lignes (Java 15+)

```java
String body = """
        Première ligne

        Troisième ligne""";   // pas de retour à la ligne final
```
