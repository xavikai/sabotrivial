# 🎲😈 Sabotrivial

*Saber + sabotatge: el trivial familiar on encertar no és suficient.*

Un trivial familiar en català per jugar en línia d'1 a 6 persones, cadascú des del seu mòbil, o tots junts en un sol dispositiu.

**▶️ Jugar:** https://xavikai.github.io/sabotrivial/

## Com funciona

- Una persona prem **Crear una partida en línia** i rep un codi de 4 lletres.
- Els altres entren a la mateixa web, premen **Unir-me a una partida** i escriuen el codi (o obren l'enllaç que es pot compartir).
- Cada jugador tria el seu **nivell**: 🐣 Petit (fins a 11 anys), 🦊 Mitjà (12-15) o 🧠 Expert (adults). Les preguntes s'adapten al nivell de cadascú.

### 🎲 Taulell del Sabotatge
Joc per torns: tires el dau, respons una pregunta de la categoria de la casella i, si l'encertes, hi avances. Hi ha caselles trampa (relliscades, terratrèmols, remolins, duels…) i **cartes de sabotatge** per fer la guitza als altres: pell de plàtan, congelador, pregunta bomba, mareig (la pregunta surt cap per avall), tinta de calamar, imant, escut, mirall… Guanya qui arriba primer a la meta.

### ⚡ Repte individual
Tothom respon alhora la seva pregunta. Punts per encert i per rapidesa, bonus per ratxa i l'última pregunta val doble. Al final es veu qui n'ha encertat més.

## Detalls tècnics

- Web estàtica (HTML + CSS + JavaScript, sense compilació), allotjada a GitHub Pages.
- El joc en línia funciona amb [PeerJS](https://peerjs.com/) (WebRTC): els mòbils es connecten directament al dispositiu de l'amfitrió. No cal cap servidor propi.
- L'amfitrió guarda la partida: ha de mantenir la pantalla oberta (millor un ordinador o una tauleta). Si es recarrega la pàgina, la partida es pot reprendre des de l'inici.
- Les preguntes dels modes friki (🎮 videojocs, 🍿 cinema, 🦸 sagues i superherois, 🎸 música) són a `js/friki.js`.
- Les preguntes d'actualitat (categoria 📰) són a `js/news.js`, agrupades per mes; s'hi afegeixen cada mes i el joc només fa servir les dels últims 6 mesos.
- Les preguntes són a `js/questions.js`, una per línia: `Pregunta|Correcta|Incorrecta|Incorrecta|Incorrecta`. Afegir-ne és tan fàcil com escriure línies noves.

## Proves

```
node test/sim.js        # simula centenars de partides amb el motor del joc
```
