# Starter JavaScript — Jest

## Prérequis

- Node.js 18 ou plus récent : `node --version`

## Structure

```
starter
├── package.json                     # Dépendances (jest) et scripts
├── src
│   ├── models.js                    # Category, Payment, Email, YearMonth (objets valeur)
│   ├── contracts.js                 # Contrats (JSDoc) : PaymentRepository, EmailSender
│   └── unusualSpendingService.js    # Classe à implémenter
└── tests                            # Vos tests (à créer)
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

Créez votre fichier de test dans `tests/unusualSpendingService.test.js`.

## Cheat sheet des mocks Jest

Jest fournit ses propres doublures avec `jest.fn()` : rien à installer.

### Créer une doublure

JavaScript n'a pas d'interfaces : les contrats sont décrits en JSDoc dans `src/contracts.js`. On crée un objet qui respecte le **contrat**, dont chaque méthode est une fonction doublure `jest.fn()`.

```javascript
const paymentRepository = { fetchPayments: jest.fn() };
const emailSender = { sendEmail: jest.fn() };

const service = new UnusualSpendingService(paymentRepository, emailSender);
```

> Une fonction `jest.fn()` sans configuration ne fait rien et retourne `undefined`.

### Stub : définir une valeur de retour

```javascript
// Toujours la même valeur, quels que soient les arguments
paymentRepository.fetchPayments.mockReturnValue([
  { price: 148, description: "Supermarché", category: Category.GROCERIES },
]);

// Une valeur qui dépend des arguments
paymentRepository.fetchPayments.mockImplementation((userId, month) =>
  month.equals(new YearMonth(2026, 10)) ? [/* ... */] : [],
);
```

### Mock : vérifier un appel

```javascript
expect(emailSender.sendEmail).toHaveBeenCalledWith("user-42", { subject: "sujet", body: "corps" });
expect(emailSender.sendEmail).toHaveBeenCalledWith("user-42", expect.anything()); // peu importe l'email
expect(emailSender.sendEmail).not.toHaveBeenCalled();                             // jamais appelé
expect(emailSender.sendEmail).toHaveBeenCalledTimes(1);                           // appelé 1 fois
```

> `toHaveBeenCalledWith` compare les arguments par **contenu** (comme `toEqual`) : deux objets avec les mêmes valeurs sont égaux.

### Récupérer les arguments d'un appel pour les inspecter

```javascript
const [userId, email] = emailSender.sendEmail.mock.calls[0]; // arguments du 1er appel
expect(email.subject).toBe("Dépenses inhabituelles de 148 $ détectées !");
```

### Préparer les doublures avant chaque test

```javascript
let emailSender;

beforeEach(() => {
  emailSender = { sendEmail: jest.fn() };
});
```

### Assertions utiles sur du texte

```javascript
expect(email.body).toContain("courses");
expect(email.body).not.toContain("voyages");
```
