/*
  Preguntes d'ACTUALITAT del Sabotrivial. S'actualitzen cada mes.
  Clau = mes (AAAA-MM) en què s'han afegit. El joc només fa servir les dels últims 6 mesos.
  Format de cada línia:  Pregunta | Resposta correcta | Incorrecta 1 | Incorrecta 2 | Incorrecta 3
  Nivells: 1 = Petit, 2 = Mitjà, 3 = Expert
*/
(function (root) {
  const NEWS = {
    '2026-11': {
      1: `
Quina selecció va guanyar el Mundial de futbol del 2026?|Espanya|Argentina|França|Brasil
Contra quina selecció va jugar Espanya la final del Mundial del 2026?|Argentina|Alemanya|Portugal|Anglaterra
En quins tres països es va jugar el Mundial de futbol del 2026?|Estats Units, Canadà i Mèxic|Espanya, Portugal i el Marroc|Brasil, Argentina i Xile|Alemanya, França i Itàlia
Quina futbolista catalana va guanyar la Pilota d'Or femenina del 2026?|Alèxia Putellas|Aitana Bonmatí|Cata Coll|Vicky López
Quin joc clàssic de Zelda ha tornat renovat a la Switch 2 el novembre del 2026?|Ocarina of Time|Breath of the Wild|Link's Awakening|Majora's Mask
Quin personatge del Dr. Seuss té una pel·lícula d'animació nova als cinemes el novembre del 2026?|El gat amb barret|El Grinch|El Lorax|L'elefant Horton
`,
      2: `
Qui va marcar el gol d'Espanya a la final del Mundial del 2026?|Ferran Torres|Lamine Yamal|Nico Williams|Dani Olmo
Com va acabar la final del Mundial del 2026 entre Espanya i l'Argentina?|1-0 a la pròrroga|2-1 als 90 minuts|0-0 i penals|3-2 a la pròrroga
Qui va ser escollit millor jugador del Mundial del 2026?|Rodri|Lamine Yamal|Leo Messi|Pedri
Quin davanter anglès va guanyar la Pilota d'Or masculina del 2026?|Harry Kane|Jude Bellingham|Bukayo Saka|Phil Foden
En quin país s'ha fet la cimera del clima COP31, el novembre del 2026?|Turquia|Brasil|Austràlia|Egipte
Quants Mundials de futbol masculí té Espanya després de guanyar el del 2026?|2|1|3|4
`,
      3: `
Qui va guanyar el premi Nobel de Literatura del 2026?|Anne Carson|Margaret Atwood|Haruki Murakami|Salman Rushdie
Quina jurista sud-africana va rebre el Nobel de la Pau del 2026?|Navi Pillay|Graça Machel|Thuli Madonsela|Fatou Bensouda
En quina ciutat turca s'ha celebrat la COP31?|Antalya|Istanbul|Ankara|Esmirna
El Nobel de Física del 2026 va premiar Francis Halzen per l'estudi de quines partícules?|Els neutrins|Els quarks|Els fotons|Els bosons de Higgs
Quin equip va guanyar les Sèries Mundials de beisbol per primera vegada el 2026?|Milwaukee Brewers|Tampa Bay Rays|Los Angeles Dodgers|New York Yankees
En quin estadi es va jugar la final del Mundial de futbol del 2026?|MetLife Stadium (Nova Jersey)|Estadi Azteca (Ciutat de Mèxic)|SoFi Stadium (Los Angeles)|AT&T Stadium (Dallas)
`
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = NEWS;
  else root.NEWS = NEWS;
})(typeof window !== 'undefined' ? window : globalThis);
