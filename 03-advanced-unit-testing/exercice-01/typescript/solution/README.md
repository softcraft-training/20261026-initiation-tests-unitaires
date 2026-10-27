# Solution TypeScript — Jest

## Prérequis

- Node.js 18 ou plus récent : `node --version`

## Structure

```
solution
├── package.json                     # Dépendances (jest, ts-jest, typescript) et scripts
├── jest.config.js                   # Configuration de Jest (ts-jest)
├── tsconfig.json                    # Configuration de TypeScript
├── src
│   ├── models.ts                    # Category, Payment, Email, YearMonth (objets valeur)
│   ├── contracts.ts                 # Contrats : PaymentRepository, EmailSender, Clock
│   └── unusualSpendingService.ts    # Service d'alerte (implémenté)
└── tests
    └── unusualSpendingService.test.ts  # Tests unitaires
```

## Restaurer le projet

```bash
npm install
```

## Exécuter les tests

```bash
npm test                    # tous les tests
npm test -- --verbose       # affichage détaillé (un test par ligne)
npm test -- --watchAll      # relance les tests à chaque sauvegarde
```


## Cheat sheet des mocks Jest

Jest fournit ses propres doublures avec `jest.fn()` : rien à installer.

### Créer une doublure

On crée un objet qui respecte le **contrat**, dont chaque méthode est une fonction doublure `jest.fn()`. Le type `jest.Mocked<...>` donne accès aux méthodes de configuration et de vérification.

```typescript
import { EmailSender, PaymentRepository } from "../src/contracts";

const paymentRepository: jest.Mocked<PaymentRepository> = { fetchPayments: jest.fn() };
const emailSender: jest.Mocked<EmailSender> = { sendEmail: jest.fn() };

const service = new UnusualSpendingService(paymentRepository, emailSender);
```

> Une fonction `jest.fn()` sans configuration ne fait rien et retourne `undefined`.

### Stub : définir une valeur de retour

```typescript
// Toujours la même valeur, quels que soient les arguments
paymentRepository.fetchPayments.mockReturnValue([
  { price: 148, description: "Supermarché", category: Category.Groceries },
]);

// Une valeur qui dépend des arguments
paymentRepository.fetchPayments.mockImplementation((userId, month) =>
  month.equals(new YearMonth(2026, 10)) ? [/* ... */] : [],
);
```

### Mock : vérifier un appel

```typescript
expect(emailSender.sendEmail).toHaveBeenCalledWith("user-42", { subject: "sujet", body: "corps" });
expect(emailSender.sendEmail).toHaveBeenCalledWith("user-42", expect.anything()); // peu importe l'email
expect(emailSender.sendEmail).not.toHaveBeenCalled();                             // jamais appelé
expect(emailSender.sendEmail).toHaveBeenCalledTimes(1);                           // appelé 1 fois
```

> `toHaveBeenCalledWith` compare les arguments par **contenu** (comme `toEqual`) : deux objets avec les mêmes valeurs sont égaux.

### Récupérer les arguments d'un appel pour les inspecter

```typescript
const [userId, email] = emailSender.sendEmail.mock.calls[0]; // arguments du 1er appel
expect(email.subject).toBe("Dépenses inhabituelles de 148 $ détectées !");
```

### Préparer les doublures avant chaque test

```typescript
let emailSender: jest.Mocked<EmailSender>;

beforeEach(() => {
  emailSender = { sendEmail: jest.fn() };
});
```

### Assertions utiles sur du texte

```typescript
expect(email.body).toContain("courses");
expect(email.body).not.toContain("voyages");
```

## Remarque sur la solution : le mois courant

Le service doit connaître le **mois courant**. Le lire directement dans le code (`new Date()`) rend les tests dépendants du jour où ils sont exécutés : impossible de vérifier les mois récupérés, ni le cas de janvier.

La solution ajoute donc une **troisième dépendance**, le contrat `Clock` (méthode `currentMonth()`), injectée dans le constructeur et remplacée par un **stub** dans les tests.
