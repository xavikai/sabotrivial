/*
  Banc de preguntes del Sabotrivial.
  Format de cada línia:  Pregunta | Resposta correcta | Incorrecta 1 | Incorrecta 2 | Incorrecta 3
  Nivells: 1 = Petit (fins a ~11 anys), 2 = Mitjà (12-15 anys), 3 = Expert (adults)
  Per afegir preguntes, només cal afegir línies al bloc corresponent.
*/
(function (root) {
  const RAW = {
    geo: {
      1: `
Quina és la capital de França?|París|Lió|Marsella|Niça
Quin és l'oceà més gran del món?|Pacífic|Atlàntic|Índic|Àrtic
En quin continent hi ha Egipte?|Àfrica|Àsia|Europa|Amèrica
Quin riu travessa el centre de Girona amb cases de colors a banda i banda?|L'Onyar|L'Ebre|El Llobregat|El Segre
Quina és la capital de Catalunya?|Barcelona|Girona|Tarragona|Lleida
Quin és el país més gran del món?|Rússia|Xina|Estats Units|Canadà
Quantes províncies té Catalunya?|4|3|5|6
Quina és la muntanya més alta del món?|L'Everest|El K2|El Kilimanjaro|L'Aneto
En quina ciutat hi ha la Torre Eiffel?|París|Londres|Roma|Berlín
Quin és el desert càlid més gran del món?|El Sàhara|El Gobi|El Kalahari|L'Atacama
Quin país té forma de bota?|Itàlia|Espanya|Grècia|Portugal
Quina muntanya catalana té forma de serra i un monestir famós?|Montserrat|El Montseny|El Canigó|El Pedraforca
En quin país hi ha les piràmides de Gizeh?|Egipte|Mèxic|Perú|Marroc
Quin és el continent més fred?|L'Antàrtida|Europa|Àsia|Amèrica
Quin mar banya les costes de Catalunya?|El Mediterrani|El Cantàbric|El Bàltic|El mar Roig
Quina és la capital d'Espanya?|Madrid|Barcelona|Sevilla|València
En quin país viuen els cangurs en llibertat?|Austràlia|Brasil|Índia|Sud-àfrica
Quina ciutat té el sobrenom de "la Gran Poma"?|Nova York|Los Angeles|Chicago|Londres
Quina és la capital del Regne Unit?|Londres|Manchester|Dublín|Edimburg
`,
      2: `
Quina és la capital d'Austràlia?|Canberra|Sydney|Melbourne|Perth
Quin és el riu més llarg d'Europa?|El Volga|El Danubi|El Rin|El Loira
Quina és la muntanya més alta dels Pirineus?|L'Aneto|La Pica d'Estats|El Mont Perdut|El Canigó
Quin és el cim més alt de Catalunya?|La Pica d'Estats|L'Aneto|El Puigmal|El Pedraforca
Quin és el país amb més habitants del món?|L'Índia|La Xina|Els Estats Units|Indonèsia
Quina és la capital del Canadà?|Ottawa|Toronto|Mont-real|Vancouver
Quina és la capital del Japó?|Tòquio|Kyoto|Osaka|Pequín
Quin estret separa Europa d'Àfrica?|L'estret de Gibraltar|El Bòsfor|L'estret de Magallanes|L'estret de Bering
Quin és el país més petit del món?|El Vaticà|Mònaco|Andorra|San Marino
Quina és la capital d'Andorra?|Andorra la Vella|Escaldes-Engordany|Encamp|Sant Julià de Lòria
A quina comarca hi ha Figueres?|L'Alt Empordà|El Baix Empordà|El Gironès|La Garrotxa
Quina és la capital de la Garrotxa?|Olot|Banyoles|Ripoll|Vic
Quin és l'estany més gran de Catalunya?|L'estany de Banyoles|L'estany de Sant Maurici|L'estany d'Ivars|L'estany Gento
En quin país hi ha Machu Picchu?|Perú|Bolívia|Xile|Mèxic
Quina és la capital del Brasil?|Brasília|Rio de Janeiro|São Paulo|Salvador
Per quina ciutat passa el riu Tàmesi?|Londres|París|Dublín|Amsterdam
Quants estats tenen els Estats Units?|50|48|51|52
Quin volcà va sepultar Pompeia?|El Vesuvi|L'Etna|L'Stromboli|El Teide
Quina és l'illa més gran de les Balears?|Mallorca|Menorca|Eivissa|Formentera
`,
      3: `
Quina és la capital de Mongòlia?|Ulan Bator|Astanà|Bixkek|Taixkent
Quin és el llac més profund del món?|El Baikal|El Titicaca|El Tanganyika|El llac Superior
Quina és la capital de Nova Zelanda?|Wellington|Auckland|Christchurch|Queenstown
Quina és la capital del Marroc?|Rabat|Casablanca|Marràqueix|Fes
Quin riu forma el delta més gran de Catalunya?|L'Ebre|El Llobregat|El Ter|El Fluvià
Quin és el punt més baix de la superfície terrestre emergida?|La vora del mar Mort|La vora del mar Caspi|La Vall de la Mort|La depressió de Qattara
Quina és la capital de Turquia?|Ankara|Istanbul|Esmirna|Antalya
Quin país té més fusos horaris, comptant els seus territoris d'ultramar?|França|Rússia|Estats Units|Xina
Quin és l'estat més gran dels EUA per superfície?|Alaska|Texas|Califòrnia|Montana
Com es diu el vent fred i fort del nord que bufa a l'Empordà?|La tramuntana|El mestral|El garbí|El llevant
Quina és la capital de Suïssa?|Berna|Zúric|Ginebra|Basilea
Quin país té Hanoi com a capital?|Vietnam|Tailàndia|Cambodja|Laos
Quin és el riu més cabalós del món?|L'Amazones|El Nil|El Iangtsé|El Mississipí
Quina és la capital d'Islàndia?|Reykjavík|Oslo|Hèlsinki|Nuuk
En quin país hi ha el desert d'Atacama?|Xile|Argentina|Mèxic|Namíbia
Quin és el país amb més habitants d'Àfrica?|Nigèria|Egipte|Etiòpia|Sud-àfrica
Quina serralada russa es considera frontera entre Europa i Àsia?|Els Urals|Els Alps|Els Carpats|L'Atles
Quina és la capital de Noruega?|Oslo|Bergen|Estocolm|Copenhaguen
Per quantes capitals europees passa el Danubi?|4|2|3|6
`
    },
    his: {
      1: `
Qui va arribar a Amèrica el 1492 amb tres caravel·les?|Cristòfor Colom|Marco Polo|Fernão de Magalhães|Napoleó
Què construïen els antics egipcis per enterrar els faraons?|Piràmides|Castells|Catedrals|Gratacels
Quins animals gegants es van extingir fa uns 66 milions d'anys?|Els dinosaures|Els mamuts|Els dodos|Els tigres de dents de sabre
Quin dia és Sant Jordi?|El 23 d'abril|El 24 de juny|L'11 de setembre|El 6 de gener
Qui va ser el primer home a trepitjar la Lluna?|Neil Armstrong|Buzz Aldrin|Iuri Gagarin|Elon Musk
Com es deien els guerrers del nord d'Europa que navegaven en drakkars?|Víkings|Romans|Samurais|Espartans
Quina festa es fa l'11 de setembre a Catalunya?|La Diada|Sant Joan|La Mercè|Tots Sants
Quin imperi va construir el Colosseu?|L'Imperi romà|L'antiga Grècia|L'antic Egipte|L'Imperi persa
Com es deien els guerrers nobles del Japó antic?|Samurais|Víkings|Gladiadors|Templers
Quin vaixell es va enfonsar el 1912 en xocar amb un iceberg?|El Titanic|La Santa Maria|El Queen Mary|La Perla Negra
En quina època vivien els cavallers i es construïen castells?|L'edat mitjana|La prehistòria|L'edat antiga|L'edat contemporània
Quin invent de Gutenberg va permetre fer llibres molt més de pressa?|La impremta|El bolígraf|La màquina d'escriure|La fotocopiadora
Qui era Cleòpatra?|Una reina d'Egipte|Una emperadriu romana|Una deessa grega|Una reina d'Anglaterra
Segons la llegenda, quina ciutat van conquerir els grecs amagats dins un cavall de fusta?|Troia|Roma|Atenes|Esparta
Segons la llegenda de Sant Jordi, què va néixer de la sang del drac?|Un roser|Un arbre|Un llibre|Una font
Com s'anomena l'escriptura amb dibuixos dels antics egipcis?|Jeroglífics|Runes|Grafits|Emojis
Quin país va regalar l'Estàtua de la Llibertat als Estats Units?|França|Anglaterra|Espanya|Itàlia
Qui porta regals als nens catalans la nit del 5 al 6 de gener?|Els Reis d'Orient|El Tió|El Pare Noel|L'Home del Sac
`,
      2: `
En quin any va començar la Guerra Civil espanyola?|1936|1931|1939|1914
Quin any va caure el Mur de Berlín?|1989|1991|1985|1979
Qui va ser el primer president dels Estats Units?|George Washington|Abraham Lincoln|Thomas Jefferson|John F. Kennedy
En quin any l'ésser humà va arribar a la Lluna?|1969|1959|1972|1981
Quin emperador francès va perdre la batalla de Waterloo?|Napoleó Bonaparte|Lluís XIV|Carlemany|Juli Cèsar
Quin any va acabar la Segona Guerra Mundial?|1945|1939|1944|1950
Quina civilització va construir Machu Picchu?|Els inques|Els asteques|Els maies|Els olmeques
Què commemora la Diada de l'11 de setembre?|La caiguda de Barcelona el 1714|La fundació de Barcelona|El naixement de Jaume I|La fi de la Guerra Civil
Quin rei va conquerir Mallorca el 1229?|Jaume I|Pere el Gran|Ramon Berenguer IV|Martí l'Humà
Quin comte de Barcelona protagonitza la llegenda de les quatre barres?|Guifré el Pilós|Ramon Berenguer I|Borrell II|Jaume I
Qui va escriure un diari famós mentre s'amagava a Amsterdam durant la Segona Guerra Mundial?|Anne Frank|Marie Curie|Frida Kahlo|Rosa Parks
Quina antiga ciutat grega i romana es troba a l'Empordà?|Empúries|Tàrraco|Bàrcino|Ilerda
Com es deia Barcelona en època romana?|Bàrcino|Tàrraco|Gerunda|Ilerda
Com es deia Girona en època romana?|Gerunda|Bàrcino|Emporion|Tàrraco
Quin líder va lluitar de manera pacífica per la independència de l'Índia?|Mahatma Gandhi|Jawaharlal Nehru|Nelson Mandela|Martin Luther King
Qui va ser president de Sud-àfrica després de passar 27 anys a la presó?|Nelson Mandela|Desmond Tutu|Kofi Annan|Barack Obama
En quin segle va esclatar la Revolució Francesa?|Al segle XVIII|Al segle XVII|Al segle XIX|Al segle XVI
Quina ciutat va estar dividida per un mur entre 1961 i 1989?|Berlín|Viena|Praga|Moscou
`,
      3: `
En quin any es va signar el Tractat dels Pirineus, que va partir Catalunya en dos?|1659|1714|1640|1492
Quin president de la Generalitat va ser afusellat el 1940?|Lluís Companys|Francesc Macià|Josep Tarradellas|Josep Irla
Qui va dir "Ciutadans de Catalunya, ja sóc aquí!" el 1977?|Josep Tarradellas|Jordi Pujol|Francesc Macià|Adolfo Suárez
Quin any es va aprovar la Constitució espanyola actual?|1978|1975|1981|1977
Què va passar el 23 de febrer de 1981?|Un intent de cop d'estat|Les primeres eleccions democràtiques|La mort de Franco|L'entrada a la CEE
Quin any va entrar Espanya a la Comunitat Econòmica Europea?|1986|1982|1992|1977
Quin any va morir Franco?|1975|1973|1977|1978
Com es diu la revolta catalana contra Felip IV que va començar el 1640?|La Guerra dels Segadors|La Guerra de Successió|La Guerra del Francès|La Primera Guerra Carlina
Durant quina dinastia xinesa es va construir la major part de la Gran Muralla que veiem avui?|Ming|Han|Qing|Tang
Qui va ser l'últim tsar de Rússia?|Nicolau II|Alexandre III|Pere el Gran|Ivan el Terrible
On va explotar el reactor nuclear el 1986?|Txernòbil|Fukushima|Three Mile Island|Hiroshima
Sobre quina ciutat es va llançar la primera bomba atòmica en una guerra?|Hiroshima|Nagasaki|Tòquio|Osaka
Quina reina va finançar el primer viatge de Colom?|Isabel la Catòlica|Joana la Boja|Isabel II|Elionor d'Aquitània
Qui era el president dels EUA durant la crisi dels míssils de Cuba?|John F. Kennedy|Dwight Eisenhower|Richard Nixon|Lyndon B. Johnson
Qui va ser la primera dona a guanyar un premi Nobel?|Marie Curie|Rosalind Franklin|Ada Lovelace|Florence Nightingale
Quin imperi va conquerir Constantinoble el 1453?|L'Imperi otomà|L'Imperi mongol|L'Imperi persa|El Sacre Imperi Romanogermànic
Quin rei va morir a la batalla de Muret el 1213?|Pere el Catòlic|Jaume I|Alfons el Cast|Pere el Gran
Quin any van començar a circular les monedes i els bitllets d'euro?|2002|1999|2000|2004
Quin estat es va dissoldre el desembre de 1991?|La Unió Soviètica|Iugoslàvia|Txecoslovàquia|La RDA
`
    },
    cie: {
      1: `
Quantes potes té una aranya?|8|6|10|4
Quin és el planeta més gran del sistema solar?|Júpiter|Saturn|La Terra|Neptú
Quin és l'animal terrestre més ràpid?|El guepard|El lleó|El cavall|L'antílop
Quin gas de l'aire necessitem per viure?|L'oxigen|El diòxid de carboni|L'heli|El fum
Quin és el planeta més proper al Sol?|Mercuri|Venus|Mart|La Terra
Què fabriquen les abelles?|Mel|Llet|Seda|Xocolata
Quin és l'animal més gran del món?|La balena blava|L'elefant africà|El tauró balena|La girafa
En què es converteix un capgròs?|En una granota|En un peix|En una papallona|En una sargantana
A quina temperatura bull l'aigua al nivell del mar?|100 °C|50 °C|80 °C|200 °C
Quants colors té l'arc de Sant Martí, tradicionalment?|7|5|6|8
Quin òrgan bombeja la sang per tot el cos?|El cor|Els pulmons|El fetge|L'estómac
Què menja principalment el panda gegant?|Bambú|Peix|Fruita|Carn
Quin d'aquests animals és un mamífer?|El dofí|El tauró|El pingüí|El cocodril
Com es diu el satèl·lit natural de la Terra?|La Lluna|El Sol|Mart|L'Estrella Polar
Quin planeta és conegut com el planeta vermell?|Mart|Venus|Júpiter|Urà
De quin color és la sang dels pops?|Blava|Vermella|Verda|Groga
Quin d'aquests ocells no pot volar?|El pingüí|L'àguila|La gavina|El colom
En quin estat està l'aigua quan és gel?|Sòlid|Líquid|Gasós|Plasma
Quantes ales té una papallona?|4|2|6|8
`,
      2: `
Quants ossos té el cos d'una persona adulta?|206|106|256|312
Com es diu el procés amb què les plantes fabriquen aliment amb la llum del sol?|Fotosíntesi|Respiració|Digestió|Evaporació
Quina és la fórmula química de l'aigua?|H₂O|CO₂|O₂|NaCl
Quin planeta té els anells més visibles?|Saturn|Júpiter|Mart|Venus
Quin és l'òrgan més gran del cos humà?|La pell|El fetge|El cervell|Els pulmons
A quina velocitat aproximada viatja la llum?|300.000 km/s|3.000 km/s|30.000 km/s|3.000.000 km/s
Qui va formular la teoria de l'evolució per selecció natural?|Charles Darwin|Isaac Newton|Gregor Mendel|Louis Pasteur
Quin element químic té el símbol O?|L'oxigen|L'or|L'osmi|L'ozó
Quantes cavitats té el cor humà?|4|2|3|6
Qui va formular la llei de la gravitació universal?|Isaac Newton|Albert Einstein|Galileo Galilei|Nikola Tesla
Quin metall és líquid a temperatura ambient?|El mercuri|El plom|L'alumini|El ferro
Quin és el planeta més calent del sistema solar?|Venus|Mercuri|Mart|Júpiter
Quin òrgan fabrica la insulina?|El pàncrees|El fetge|Els ronyons|L'estómac
En quina part de la cèl·lula hi ha la major part de l'ADN?|El nucli|La membrana|El citoplasma|El ribosoma
Quants planetes té el sistema solar?|8|9|7|10
Quina vitamina fabrica la nostra pell amb la llum del sol?|La vitamina D|La vitamina C|La vitamina A|La vitamina B12
Com s'anomenen els animals que només mengen plantes?|Herbívors|Carnívors|Omnívors|Insectívors
Quin és el satèl·lit més gran del sistema solar?|Ganimedes|La Lluna|Tità|Europa
Quina força ens manté enganxats a terra?|La gravetat|El magnetisme|La fricció|L'electricitat estàtica
`,
      3: `
Quin és l'element químic més abundant de l'univers?|L'hidrogen|L'heli|L'oxigen|El carboni
Quin és el símbol químic de l'or?|Au|Ag|Or|Go
Quina equació va fer famosa Albert Einstein?|E = mc²|F = m·a|a² + b² = c²|PV = nRT
Quants cromosomes té una cèl·lula humana normal?|46|23|44|48
Quina partícula de l'àtom té càrrega negativa?|L'electró|El protó|El neutró|El fotó
Qui va descobrir la penicil·lina?|Alexander Fleming|Louis Pasteur|Robert Koch|Edward Jenner
Quin planeta gira gairebé tombat de costat?|Urà|Neptú|Saturn|Mart
Quin pH té l'aigua pura a 25 °C?|7|0|5|14
Quin és el gas més abundant de l'atmosfera terrestre?|El nitrogen|L'oxigen|El diòxid de carboni|L'argó
Com s'anomena la unitat de mesura de la força?|El newton|El joule|El watt|El pascal
Qui va crear la taula periòdica dels elements?|Dmitri Mendeléiev|Antoine Lavoisier|John Dalton|Niels Bohr
Quina és l'estrella més propera a la Terra?|El Sol|Pròxima del Centaure|Sírius|L'Estrella Polar
Quins òrgans filtren la sang i fabriquen l'orina?|Els ronyons|El fetge|La melsa|La bufeta
Qui va crear la primera vacuna, contra la verola?|Edward Jenner|Louis Pasteur|Alexander Fleming|Jonas Salk
Quin és l'os més llarg del cos humà?|El fèmur|L'húmer|La tíbia|El peroné
Quina missió va portar els primers humans a la Lluna?|Apollo 11|Apollo 13|Gemini 4|Vostok 1
A quina velocitat aproximada viatja el so per l'aire?|343 m/s|34 m/s|3.430 m/s|300.000 km/s
Quin d'aquests animals té tres cors?|El pop|L'estrella de mar|La medusa|El cranc
Quin telescopi espacial, llançat el 2021, és el successor del Hubble?|El James Webb|El Kepler|L'Spitzer|El Galileo
`
    },
    art: {
      1: `
Quin color surt de barrejar blau i groc?|Verd|Lila|Taronja|Marró
Quin color surt de barrejar vermell i groc?|Taronja|Verd|Lila|Rosa
Quantes lletres té l'alfabet català?|26|24|27|30
Qui va pintar la Gioconda (la Mona Lisa)?|Leonardo da Vinci|Pablo Picasso|Vincent van Gogh|Salvador Dalí
Quin és el plural de "peix"?|Peixos|Peixs|Peixes|Peixets
A quin personatge li creix el nas quan diu mentides?|Pinotxo|Peter Pan|En Patufet|En Polzet
Quin personatge de conte català era tan petit que es va amagar sota una col?|En Patufet|Pinotxo|En Polzet|En Jan
Quin d'aquests instruments és de corda?|El violí|La flauta|El timbal|La trompeta
Com s'anomena la persona que escriu poemes?|Poeta|Pintor|Escultor|Director
Quin petit instrument de vent obre la sardana a la cobla?|El flabiol|La guitarra|El piano|La bateria
A quin conte una nena amb caputxa vermella es troba un llop?|La Caputxeta Vermella|La Ventafocs|La Blancaneu|La Bella Dorment
A quin conte una noia perd una sabata de vidre?|La Ventafocs|La Blancaneu|La Rínxols d'Or|La Bella i la Bèstia
Quin és el contrari d'"alt"?|Baix|Gran|Llarg|Gros
Quina d'aquestes paraules és un verb?|Córrer|Taula|Feliç|Ràpidament
Quin arquitecte va dissenyar la Sagrada Família?|Antoni Gaudí|Pablo Picasso|Joan Miró|Salvador Dalí
Quantes síl·labes té la paraula "papallona"?|4|3|5|2
Quina d'aquestes paraules porta accent?|Cançó|Casa|Gat|Pilota
Com acaben els contes catalans tradicionalment?|I conte contat, conte acabat|Colorín colorado|Fi del capítol|I tots a dormir
Quants nans acompanyen la Blancaneu?|7|5|6|9
`,
      2: `
Qui va escriure "Don Quixot de la Manxa"?|Miguel de Cervantes|Lope de Vega|Federico García Lorca|Francisco de Quevedo
Quin pintor es va tallar un tros d'orella?|Vincent van Gogh|Pablo Picasso|Claude Monet|Salvador Dalí
Quin pintor surrealista català tenia un bigoti molt famós?|Salvador Dalí|Joan Miró|Pablo Picasso|Antoni Tàpies
En quina ciutat hi ha el Teatre-Museu Dalí?|Figueres|Cadaqués|Girona|Barcelona
Qui va escriure "Romeu i Julieta"?|William Shakespeare|Molière|Dante Alighieri|Miguel de Cervantes
Qui va pintar el "Guernica"?|Pablo Picasso|Salvador Dalí|Joan Miró|Francisco de Goya
Qui va escriure els llibres de Harry Potter?|J. K. Rowling|J. R. R. Tolkien|Roald Dahl|Suzanne Collins
Qui va escriure "El Senyor dels Anells"?|J. R. R. Tolkien|C. S. Lewis|J. K. Rowling|George R. R. Martin
Qui va escriure "Charlie i la fàbrica de xocolata"?|Roald Dahl|Michael Ende|Jules Verne|Mark Twain
Quin és el femení d'"actor"?|Actriu|Actora|Actressa|Actriça
Com s'anomena una paraula que vol dir el mateix que una altra?|Sinònim|Antònim|Homòfon|Pronom
Com s'anomena popularment la Casa Milà de Gaudí?|La Pedrera|La Catedral|El Drac|La Rosa
Quin compositor alemany va compondre la Novena Simfonia quan ja era sord?|Ludwig van Beethoven|Wolfgang Amadeus Mozart|Johann Sebastian Bach|Antonio Vivaldi
Qui va escriure "La volta al món en vuitanta dies"?|Jules Verne|H. G. Wells|Charles Dickens|Robert L. Stevenson
En quin museu es pot veure la Gioconda?|El Louvre|El Prado|El British Museum|El MoMA
Quantes cordes té una guitarra clàssica?|6|4|5|8
Quin artista català pintava estrelles, ocells i taques de colors primaris?|Joan Miró|Salvador Dalí|Antoni Tàpies|Antoni Gaudí
Qui va escriure "Pippi Calcesllargues"?|Astrid Lindgren|Roald Dahl|Enid Blyton|Michael Ende
Qui va escriure "Mecanoscrit del segon origen"?|Manuel de Pedrolo|Mercè Rodoreda|Jaume Cabré|Josep Pla
Com s'anomena una paraula que vol dir el contrari d'una altra?|Antònim|Sinònim|Adverbi|Diminutiu
`,
      3: `
Qui va escriure "La plaça del Diamant"?|Mercè Rodoreda|Caterina Albert|Montserrat Roig|Maria Aurèlia Capmany
Qui va escriure "Terra baixa"?|Àngel Guimerà|Jacint Verdaguer|Narcís Oller|Santiago Rusiñol
Quin poeta va escriure "Canigó" i "L'Atlàntida"?|Jacint Verdaguer|Joan Maragall|Salvador Espriu|J. V. Foix
Quin escriptor empordanès va escriure "El quadern gris"?|Josep Pla|Carles Riba|Salvador Espriu|Joan Vinyoli
Quin moviment artístic van iniciar Picasso i Braque?|El cubisme|El surrealisme|L'impressionisme|El fauvisme
Qui va pintar "Les Menines"?|Diego Velázquez|Francisco de Goya|El Greco|Bartolomé Esteban Murillo
Qui va esculpir el "David" de Florència?|Miquel Àngel|Donatello|Gian Lorenzo Bernini|Auguste Rodin
Qui va pintar "El crit"?|Edvard Munch|Gustav Klimt|Egon Schiele|Vassili Kandinsky
Quin arquitecte va dissenyar el Palau de la Música Catalana?|Lluís Domènech i Montaner|Antoni Gaudí|Josep Puig i Cadafalch|Josep Maria Jujol
Qui va escriure "Cent anys de solitud"?|Gabriel García Márquez|Mario Vargas Llosa|Jorge Luis Borges|Julio Cortázar
Qui va escriure "1984"?|George Orwell|Aldous Huxley|Ray Bradbury|H. G. Wells
Qui va escriure "Jo confesso"?|Jaume Cabré|Albert Sánchez Piñol|Quim Monzó|Baltasar Porcel
Quina escriptora va publicar "Solitud" amb el pseudònim de Víctor Català?|Caterina Albert|Mercè Rodoreda|Dolors Monserdà|Maria Antònia Salvà
Qui va compondre "Les quatre estacions"?|Antonio Vivaldi|Johann Sebastian Bach|Georg Friedrich Händel|Joseph Haydn
Quin violoncel·lista català va convertir "El cant dels ocells" en un himne de pau?|Pau Casals|Enric Granados|Isaac Albéniz|Jordi Savall
Quina obra de Leonardo da Vinci representa Jesús amb els apòstols?|El Sant Sopar|La Gioconda|L'home de Vitruvi|La dama de l'ermini
Qui va escriure "La Divina Comèdia"?|Dante Alighieri|Francesco Petrarca|Giovanni Boccaccio|Virgili
Quin pintor impressionista va pintar una sèrie famosa de nenúfars?|Claude Monet|Pierre-Auguste Renoir|Edgar Degas|Édouard Manet
Quin escriptor va crear el detectiu Pepe Carvalho?|Manuel Vázquez Montalbán|Eduardo Mendoza|Andreu Martín|Juan Marsé
`
    },
    ent: {
      1: `
Com es diu el ratolí més famós de Disney?|Mickey|Jerry|Stuart Little|Speedy
A "Frozen", com es diu la germana de l'Anna que té poders de gel?|Elsa|Ariel|Rapunzel|Vaiana
En quin videojoc es construeix amb blocs i cal vigilar amb els creepers?|Minecraft|Fortnite|Roblox|Tetris
A "Toy Story", com es diu el vaquer?|Woody|Buzz|Rex|Andy
De quin color és en Pikachu?|Groc|Vermell|Blau|Verd
Quin personatge de videojoc és un lampista amb gorra vermella i bigoti?|Mario|Luigi|Sonic|Link
Com es diu el peix pallasso que es perd a l'oceà en una pel·lícula de Pixar?|Nemo|Dory|Marlin|Gill
Com es diu el lleó protagonista d'"El Rei Lleó"?|Simba|Mufasa|Scar|Nala
Quin animal és el millor amic de Shrek?|Un ase|Un gat|Un drac|Un cavall
Quina nena cau per un forat i arriba al País de les Meravelles?|Alícia|Dorothy|Wendy|Heidi
En quina pel·lícula apareixen per primer cop els Minions?|Gru, el meu dolent preferit|Shrek|Cars|Up
Com es diu el cotxe vermell protagonista de "Cars"?|Llamp McQueen|Mate|Sally|Doc Hudson
Com es diu el porc senglar amic d'en Timó a "El Rei Lleó"?|Pumba|Rafiki|Zazu|Banzai
Qui viu en una pinya sota el mar?|Bob Esponja|Patricio|Calamard|Nemo
En quin videojoc 100 jugadors salten d'un autobús volador i l'últim que queda guanya?|Fortnite|Minecraft|Among Us|Mario Kart
A "Among Us", com es diu qui intenta eliminar els altres en secret?|L'impostor|El tripulant|El capità|El fantasma
Quina princesa té els cabells llarguíssims i viu tancada en una torre?|Rapunzel|La Ventafocs|Mulan|Aurora
Quin personatge de Nintendo és una bola rosa que s'empassa els enemics?|Kirby|Yoshi|Jigglypuff|Toad
A "Del revés" (Inside Out), de quin color és l'Alegria?|Groc|Blau|Vermell|Verd
`,
      2: `
Quin grup va cantar "Bohemian Rhapsody"?|Queen|The Beatles|ABBA|U2
Com es diu l'escola de màgia de Harry Potter?|Hogwarts|Beauxbatons|Ilvermorny|Mordor
A "Star Wars", qui és el pare d'en Luke Skywalker?|Darth Vader|Obi-Wan Kenobi|Han Solo|Yoda
Quin grup català va cantar "Boig per tu"?|Sau|Els Pets|Txarango|Manel
En quina pel·lícula un extraterrestre vol "telefonar a casa"?|E.T., l'extraterrestre|Alien|Superman|Encontres a la tercera fase
Quina empresa va crear la PlayStation?|Sony|Nintendo|Microsoft|Sega
En quina saga apareix la Katniss Everdeen?|Els jocs de la fam|Divergent|El corredor del laberint|Crepuscle
Quina cantant va fer la gira mundial "The Eras Tour"?|Taylor Swift|Beyoncé|Rosalía|Ariana Grande
Quina cantant catalana va publicar el disc "Motomami"?|Rosalía|Aitana|Lola Índigo|Bad Gyal
Quin superheroi és en realitat en Peter Parker?|Spider-Man|Batman|Iron Man|Superman
Quin superheroi de Marvel porta una armadura que s'ha construït ell mateix?|Iron Man|Thor|Capità Amèrica|Hulk
En quin videojoc clàssic cal encaixar peces que cauen?|Tetris|Pac-Man|Candy Crush|Pong
Quin personatge groc es menja fantasmes en un laberint?|Pac-Man|Mario|Kirby|Sonic
De quin color és en Sonic?|Blau|Vermell|Verd|Groc
En quin país passa la pel·lícula "Coco" de Pixar?|Mèxic|Espanya|Brasil|Colòmbia
A "Del revés" (Inside Out), quina emoció és de color blau?|La Tristesa|La Ira|L'Alegria|La Por
Quina sèrie de Netflix passa al poble de Hawkins i té un "món del revés"?|Stranger Things|Dark|The Witcher|Wednesday
Quin actor fa de Jack Sparrow a "Pirates del Carib"?|Johnny Depp|Orlando Bloom|Brad Pitt|Tom Cruise
Quina empresa va crear la consola Switch?|Nintendo|Sony|Microsoft|Sega
`,
      3: `
Qui era conegut com "el Rei del Pop"?|Michael Jackson|Prince|Elvis Presley|George Michael
Quin any va arribar la primera PlayStation a Europa?|1995|1990|1998|2000
Quin grup de Manchester va cantar "Wonderwall"?|Oasis|Blur|Radiohead|The Verve
Quina sèrie de TV3 protagonitzaven Joel Joan i Jordi Sánchez com a companys de pis?|Plats bruts|Ventdelplà|Porca misèria|Poble Nou
En quina sèrie d'anime surt en Son Goku?|Bola de Drac|Doraemon|Naruto|Els cavallers del Zodíac
A "Retorn al futur", quin cotxe era la màquina del temps?|Un DeLorean|Un Ferrari Testarossa|Un Ford Mustang|Un Seat Panda
Quina pel·lícula de 1997 amb Leonardo DiCaprio va guanyar 11 Oscars?|Titanic|Gladiator|Forrest Gump|Romeu + Julieta
Qui va dirigir "Parc Juràssic"?|Steven Spielberg|George Lucas|James Cameron|Ridley Scott
Qui va cantar "L'estaca"?|Lluís Llach|Raimon|Joan Manuel Serrat|Marina Rossell
Quin grup suec va guanyar Eurovisió el 1974 amb "Waterloo"?|ABBA|Roxette|Europe|Ace of Base
Com es diu el gat robot blau que treu invents d'una butxaca?|Doraemon|Shin-chan|Pikachu|Totoro
Quin grup de Constantí va cantar "Bon dia"?|Els Pets|Sopa de Cabra|Sau|Lax'n'Busto
Quin grup gironí va cantar "L'Empordà"?|Sopa de Cabra|Els Pets|Sau|Umpah-pah
A "Friends", com es diu la cafeteria on es troben?|Central Perk|Monk's Café|Paddy's Pub|The Max
Quina consola portàtil de Nintendo de 1989 venia amb el Tetris?|La Game Boy|La Game Gear|La PSP|La Nintendo DS
Quin actor va interpretar Terminator?|Arnold Schwarzenegger|Sylvester Stallone|Bruce Willis|Jean-Claude Van Damme
Com es diu la família groga que viu a Springfield?|Els Simpson|Els Griffin|Els Picapedra|Els Addams
Qui va cantar "Like a Virgin"?|Madonna|Cyndi Lauper|Whitney Houston|Kylie Minogue
Quin trencaclosques en forma de cub de colors va arrasar als anys vuitanta?|El cub de Rubik|El Tamagotchi|El Tangram|El Simon
Com es deia la mascota virtual dins un ou de plàstic que va triomfar als noranta?|Tamagotchi|Furby|Pokédex|Game & Watch
Quina va ser la primera pel·lícula feta completament per ordinador, el 1995?|Toy Story|Shrek|Bichos|Buscant en Nemo
`
    },
    esp: {
      1: `
Quants jugadors té cada equip de futbol al camp?|11|9|10|12
Amb quina part del cos no pot tocar la pilota un jugador de futbol que no és porter?|Les mans|Els peus|El cap|El pit
En quin esport es pot fer un triple?|Bàsquet|Futbol|Tennis|Natació
Quin esport es juga amb raqueta i una pilota groga per sobre d'una xarxa?|Tennis|Golf|Hoquei|Ping-pong
Quants anells té la bandera olímpica?|5|4|6|7
Quants punts val una cistella normal feta dins la línia de triple?|2|1|3|4
Com es diuen les torres humanes catalanes?|Castells|Sardanes|Gegants|Correfocs
Quin ball tradicional català es balla fent una rotllana agafats de les mans?|La sardana|La jota|El flamenc|El vals
En quin esport es juga amb estic, bola i patins?|Hoquei patins|Golf|Beisbol|Criquet
Quantes peces té cada jugador d'escacs al començament?|16|8|12|20
Quantes cares té un dau normal?|6|4|8|12
Com es diu el jugador que para les pilotes a la porteria?|Porter|Defensa|Àrbitre|Davanter
De quins colors és la samarreta del Barça?|Blau i grana|Blanc|Vermell i blanc|Blau i blanc
En quin joc de cartes cal cridar el nom del joc quan et queda una sola carta?|UNO|Pòquer|Solitari|Botifarra
Quina peça d'escacs es mou fent una L?|El cavall|L'alfil|La torre|El rei
Què fa l'enxaneta en un castell?|Puja dalt de tot i fa l'aleta|Aguanta la pinya|Toca la gralla|Fa de cap de colla
Quants jugadors té cada equip de bàsquet a la pista?|5|6|7|4
Quin estil de natació s'assembla al moviment d'una granota?|Braça|Crol|Esquena|Papallona
`,
      2: `
En quina ciutat es van fer els Jocs Olímpics de 1992?|Barcelona|Madrid|Sevilla|Atlanta
Com es deia la mascota dels Jocs Olímpics de Barcelona 92?|Cobi|Naranjito|Curro|Petra
Quin tenista té més títols de Roland Garros?|Rafa Nadal|Novak Djokovic|Roger Federer|Carlos Alcaraz
Quin país ha guanyat més Mundials de futbol?|Brasil|Alemanya|Itàlia|Argentina
Quina selecció va guanyar el Mundial de futbol del 2010?|Espanya|Països Baixos|Alemanya|Brasil
Quina selecció va guanyar el Mundial de futbol del 2022?|Argentina|França|Brasil|Croàcia
Cada quants anys es fan els Jocs Olímpics d'estiu?|4|2|3|5
Quants minuts dura un partit de futbol sense el temps afegit?|90|80|100|120
En quin esport va destacar Pau Gasol?|Bàsquet|Futbol|Handbol|Tennis
Quin jugador argentí ha guanyat vuit Pilotes d'Or?|Leo Messi|Diego Maradona|Sergio Agüero|Ángel Di María
A quin esport juga l'Aitana Bonmatí?|Futbol|Bàsquet|Handbol|Tennis
Quina és la puntuació màxima en una partida de bitlles americanes (bowling)?|300|100|200|500
Quina distància té una marató?|42,195 km|40 km|21 km|50 km
Quin pilot de MotoGP de Cervera ha guanyat diversos campionats del món?|Marc Márquez|Jorge Lorenzo|Àlex Crivillé|Dani Pedrosa
En quin esport es fa servir un volant de plomes?|Bàdminton|Tennis|Pàdel|Esquaix
Quantes caselles té un tauler d'escacs?|64|36|49|100
Quin esport es practica al Tour de França?|Ciclisme|Atletisme|Automobilisme|Motociclisme
Com s'anomena la jugada d'escacs que acaba la partida?|Escac i mat|Enroc|Taules|Gambit
Quina selecció va guanyar l'Eurocopa de futbol del 2024?|Espanya|Anglaterra|França|Alemanya
`,
      3: `
En quin any es van fer els primers Jocs Olímpics moderns?|1896|1900|1912|1924
Qui va encendre el peveter olímpic de Barcelona 92 amb una fletxa?|Antonio Rebollo|Fermín Cacho|Miguel Induráin|Carles Puyol
Quin atleta va guanyar l'or dels 1.500 metres als Jocs de Barcelona 92?|Fermín Cacho|Abel Antón|Martín Fiz|Reyes Estévez
Quants Tours de França seguits va guanyar Miguel Induráin?|5|3|4|7
Qui va marcar el gol de la final del Mundial 2010?|Andrés Iniesta|David Villa|Fernando Torres|Xavi Hernández
Qui va marcar el gol del Barça a la final de la Copa d'Europa de 1992 a Wembley?|Ronald Koeman|Hristo Stoichkov|Michael Laudrup|Txiki Begiristain
Quants campionats del món de Fórmula 1 va guanyar Michael Schumacher?|7|5|6|4
Quin pilot asturià va guanyar el Mundial de Fórmula 1 el 2005 i el 2006?|Fernando Alonso|Carlos Sainz|Pedro de la Rosa|Jaime Alguersuari
En quin esport es disputa la Ryder Cup?|Golf|Tennis|Vela|Rugbi
Quin tennista suís va guanyar vuit vegades Wimbledon?|Roger Federer|Stan Wawrinka|Novak Djokovic|Pete Sampras
Quin corredor de muntanya català és famós per pujar l'Everest sense oxigen?|Kilian Jornet|Pau Capell|Ferran Latorre|Marc Pinsach
Amb quin equip va guanyar sis anells de l'NBA Michael Jordan?|Chicago Bulls|Los Angeles Lakers|Boston Celtics|Utah Jazz
Quin equip es va guanyar el sobrenom de "Dream Team" a la competició olímpica de Barcelona 92?|La selecció de bàsquet dels EUA|La selecció de waterpolo d'Espanya|La selecció d'handbol de França|La selecció d'atletisme de Kenya
En quines competicions ha destacat la pilot catalana Laia Sanz?|Trial, enduro i el Dakar|Natació sincronitzada|Bàsquet|Waterpolo
Quin escaquista noruec ha estat número 1 del món durant més d'una dècada?|Magnus Carlsen|Garri Kaspàrov|Hikaru Nakamura|Viswanathan Anand
A quin club de la Lliga va jugar Ronaldo "el Fenomen" la temporada 1996-97?|FC Barcelona|Atlètic de Madrid|València CF|Sevilla FC
Quants jugadors té un equip d'hoquei patins a la pista, comptant el porter?|5|6|7|4
Quina colla castellera de camisa verda és de Vilafranca del Penedès?|Castellers de Vilafranca|Minyons de Terrassa|Capgrossos de Mataró|Castellers de Barcelona
Quina tennista catalana va guanyar Roland Garros el 1989?|Arantxa Sánchez Vicario|Conchita Martínez|Garbiñe Muguruza|Carla Suárez
`
    }
  };

  const BANK = {};
  for (const cat in RAW) {
    BANK[cat] = {};
    for (const lvl in RAW[cat]) {
      BANK[cat][lvl] = RAW[cat][lvl]
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean)
        .map((line, i) => {
          const parts = line.split('|').map(s => s.trim());
          return { id: `${cat}${lvl}-${i}`, q: parts[0], a: parts[1], w: parts.slice(2) };
        });
    }
  }

  // Actualitat: només els últims 6 mesos, i només si hi ha prou preguntes a cada nivell
  let NEWS = null;
  try { NEWS = (typeof module !== 'undefined' && module.exports) ? require('./news.js') : root.NEWS; } catch (e) { }
  if (NEWS) {
    const d = new Date(); d.setMonth(d.getMonth() - 6);
    const cutoff = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    const act = { 1: [], 2: [], 3: [] };
    for (const month of Object.keys(NEWS).sort()) {
      if (month < cutoff) continue;
      for (const lvl of [1, 2, 3]) {
        String(NEWS[month][lvl] || '').split('\n').map(l => l.trim()).filter(Boolean).forEach((line, i) => {
          const parts = line.split('|').map(s => s.trim());
          if (parts.length === 5) act[lvl].push({ id: `act${lvl}-${month}-${i}`, q: parts[0], a: parts[1], w: parts.slice(2) });
        });
      }
    }
    if ([1, 2, 3].every(l => act[l].length >= 4)) BANK.act = act;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = BANK;
  else root.QUESTIONS = BANK;
})(typeof window !== 'undefined' ? window : globalThis);
