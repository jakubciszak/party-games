# Party Games

Aplikacja webowa do gier towarzyskich - Kalambury i Gra na P.

## Funkcje

### Kalambury
- Pokazuj hasło gestami, niech inni zgadną!
- Różne poziomy trudności dopasowane do wieku graczy

### Gra na P
- Opisuj hasło używając tylko słów zaczynających się na literę P
- Sam wymyślasz podpowiedzi!

## Ustawienia gry

- **Gracze**: Dodaj dowolną liczbę graczy z imionami i wiekiem
- **Poziom trudności**: Automatycznie dopasowany do najmłodszego gracza
  - Łatwy: dla graczy poniżej 12 lat
  - Średni: dla graczy 12-17 lat
  - Trudny: dla dorosłych (18+)
- **Czas na rundę**: 30s, 45s, 60s, 90s, 120s lub bez limitu

## Instalacja

```bash
npm install
```

## Uruchomienie (development)

```bash
npm run dev
```

## Testy

```bash
npm test          # tryb watch
npm run test:run  # jednorazowe uruchomienie
```

## Budowanie

```bash
npm run build
```

## Technologie

- React 18
- TypeScript
- Vite
- Vitest + React Testing Library
- GitHub Actions (CI/CD)
- GitHub Pages (hosting)

## Licencja

MIT
