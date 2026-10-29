# Schaakspel — Projectweek 1 2026

Een compleet speelbaar schaakspel voor in de browser, gemaakt door Redouan, Mikolaj, Wiktoria en Grantas. Gebouwd met HTML, CSS en vanilla JavaScript — zonder frameworks of installatie.

## Functies

- Daag iemand uit voor een lokaal potje: speel om de beurt met wit en zwart.
- Kies hoe je speelt: klik op de stukken of sleep ze naar een gemarkeerde zet.
- Speel met de belangrijkste schaakregels, inclusief legaal slaan en het beschermen van je eigen koning.
- Voer rokade uit wanneer koning en toren daarvoor in aanmerking komen.
- Promoveer pionnen tot dame, toren, loper of paard.
- Speel door tot schaakmat en ontdek wie de winnaar is.
- Volg de partij met de zettenlijst, de geslagen stukken en de score.
- Personaliseer je bord met verschillende kleurthema's en draai het bord wanneer je wilt.
- Wissel van speelstijl: kies op elk moment tussen de unieke handgetekende stukken en strakke klassieke vector-SVG's.
- Leer het spel in het pop-up dashboard: raadpleeg op elk moment de complete uitleg over alle stukken, regels en spelbediening.
- Schakel eenvoudig van taal: wissel direct tussen Nederlands en Engels met de vlag-switcher in de header.
- Geniet van een geluidseffect bij iedere geldige zet.

We blijven het spel uitbreiden: en passant slaan en remiseherkenning, zoals pat, zijn ideeën voor toekomstige verbeteringen.

## Het spel starten

Klaar om te spelen? Er is geen buildstap, pakketinstallatie of framework nodig. Start vanuit de hoofdmap van de repository een lokale webserver met Python:

```sh
python -m http.server 8000
```

Open daarna [http://localhost:8000/client/](http://localhost:8000/client/) in een browser. Stop de server met `Ctrl+C`.

Je kunt ook `client/index.html` rechtstreeks openen in een moderne browser.

## Projectstructuur

De code is per verantwoordelijkheid ingedeeld. `index.html` brengt de pagina en scripts samen, `style.css` verzorgt de vormgeving en de JavaScript-bestanden verdelen de spelregels en interactie over aparte onderdelen: stukdefinities en -wissel, bordopbouw, beweging, schaakcontrole, bediening, promotie, score en meertaligheid. De speelstukafbeeldingen staan bij de client-assets.

```text
client/
  index.html         Spelpagina en spelregeldashboard
  style.css          Stijlen voor het bord, dialoogvensters en de interface
  main.js            Bordopbouw, thema's, draaien, dashboard en meertaligheid
  piece.js           Stukdefinities (handgetekende afbeeldingen en vector-SVG's)
  movement.js        Bewegingsregels voor stukken en rokade
  check.js           Schaak- en legale-zettencontrole
  drag.js            Zetbediening, slaan, zettenlijst en schaakmat
  promotion.js       Pionpromotie
  pieceHighlight.js  Selectie en markering van legale zetten
  scoreboard.js      Scoreweergave
  imgs/              Speelstukafbeeldingen en oorspronkelijke ontwerpen
```

## Voortgang

De voortgang en het werk aan het project zijn bijgehouden via GitHub en Trello:

- [GitHub-repository](https://github.com/chessgamescorro/chess-game/)
- [Trello-bord](https://trello.com/b/Ugf1CuMq/chess)
