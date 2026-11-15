/*
  Preguntes dels MODES FRIKI del Sabotrivial.
  Format de cada línia:  Pregunta | Resposta correcta | Incorrecta 1 | Incorrecta 2 | Incorrecta 3
  Nivells: 1 = Petit, 2 = Mitjà, 3 = Expert
  Temàtiques: vid = Videojocs, cin = Cinema, sag = Sagues i superherois, mus = Música
*/
(function (root) {
  const FRIKI = {
    vid: {
      1: `
Com es diu el germà d'en Mario, que va vestit de verd?|Luigi|Wario|Toad|Yoshi
Quin Pokémon és el company inseparable de l'Ash?|Pikachu|Charmander|Eevee|Squirtle
Com es diu la princesa que en Mario sol rescatar?|Peach|Zelda|Daisy|Rosalina
Qui és el gran enemic d'en Mario, una tortuga gegant amb punxes?|Bowser|Ganon|Dr. Eggman|King K. Rool
A Minecraft, què fa un creeper quan se t'acosta?|Explota|Et roba objectes|Et congela|Es posa a ballar
Com es diu el dinosaure verd amic d'en Mario?|Yoshi|Rex|Dino|Koopa
A Mario Kart, quin objecte persegueix el jugador que va primer?|La closca blava|La closca verda|La pell de plàtan|El bolet
Quin animal és en Sonic?|Un eriçó|Un gat|Una guineu|Un conill
Com es diu la guineu de dues cues amiga d'en Sonic?|Tails|Knuckles|Shadow|Amy
A Pokémon, amb què es capturen els Pokémon?|Amb Poké Balls|Amb xarxes|Amb gàbies|Amb cartes
De quin tipus és en Charmander?|Foc|Aigua|Planta|Elèctric
A Minecraft, quin material fa les eines més resistents, sense comptar la netherita?|El diamant|El ferro|L'or|La pedra
En quin joc uns ocells enfadats es llancen amb un tirador contra uns porcs verds?|Angry Birds|Flappy Bird|Crossy Road|Cut the Rope
Quin goril·la amb corbata vermella és una estrella de Nintendo?|Donkey Kong|King Kong|Diddy Kong|Winston
A Among Us, on passa la partida del mapa original?|En una nau espacial|En un castell|En una escola|En un vaixell pirata
A Roblox, com es diu la moneda del joc?|Robux|PaVos|Maragdes|Gemmes
A Minecraft, a quina dimensió de foc i lava s'arriba amb un portal d'obsidiana?|El Nether|L'End|L'Aether|El Subsòl
A The Legend of Zelda, com es diu l'heroi que controles?|Link|Zelda|Ganon|Epona
En quin joc es juga a futbol amb cotxes?|Rocket League|Mario Kart|Fall Guys|Hot Wheels Unleashed
A Animal Crossing, qui et ven la casa i et fa pagar la hipoteca?|Tom Nook|Canela|Totakeke|Sócrates
De quin tipus és en Squirtle?|Aigua|Foc|Planta|Roca
A Fortnite, què s'ha d'evitar que et vagi tancant durant la partida?|La tempesta|La lava|La boira|El tsunami
`,
      2: `
Quina empresa va crear Fortnite?|Epic Games|Riot Games|Valve|Activision
Quin estudi suec va crear Minecraft?|Mojang|DICE|Paradox|King
A The Legend of Zelda, com es diu el regne on passen la majoria de jocs?|Hyrule|Midgard|Tamriel|Azeroth
Com es diu el protagonista de la saga God of War?|Kratos|Atreus|Zeus|Ares
A quin joc pertanyen les agents Jett i Sage?|Valorant|Overwatch|Apex Legends|League of Legends
Quin joc de futbol va substituir la saga FIFA el 2023?|EA Sports FC|eFootball|Pro Evolution Soccer|Football Manager
Com es diu el rival d'en Mario que va vestit de groc i lila?|Wario|Waluigi|Luigi|Bowser Jr.
Quants Pokémon hi havia a la primera generació?|151|100|150|251
En quin joc l'Aloy caça màquines amb forma d'animal?|Horizon Zero Dawn|The Last of Us|Tomb Raider|Monster Hunter
Com es diu l'arqueòloga protagonista de Tomb Raider?|Lara Croft|Jill Valentine|Samus Aran|Ellie
A Minecraft, quin drac cal vèncer per veure els crèdits del joc?|L'Ender Dragon|El Wither|El Warden|L'Elder Guardian
Quina consola de Nintendo va sortir el 2017?|La Switch|La Wii U|La 3DS|La Wii
Com es diu la caçadora de recompenses protagonista de Metroid?|Samus Aran|Zelda|Bayonetta|Lara Croft
A League of Legends, quants jugadors té cada equip?|5|3|4|6
A quin joc cal sobreviure cinc nits en una pizzeria amb animatrònics?|Five Nights at Freddy's|Poppy Playtime|Bendy and the Ink Machine|Hello Neighbor
Quina mascota de PlayStation és un petit robot blanc i blau?|Astro Bot|Sackboy|Ratchet|Crash
A Splatoon, amb què es disparen els jugadors?|Amb tinta|Amb aigua|Amb escuma|Amb confeti
Quin estudi japonès va crear Dark Souls i Elden Ring?|FromSoftware|Capcom|Square Enix|Konami
Quin personatge de Capcom és un robot blau que dispara amb el braç?|Mega Man|Astro Boy|Bomberman|Rayman
En quina saga de lluita apareixen en Ryu i la Chun-Li?|Street Fighter|Tekken|Mortal Kombat|Soulcalibur
A Pokémon, en què evoluciona en Pikachu?|En Raichu|En Pichu|En Jolteon|En Electabuzz
Quina saga de Nintendo reuneix personatges de molts jocs per lluitar entre ells?|Super Smash Bros.|Mario Party|Mario Kart|Kirby Air Ride
`,
      3: `
Qui és el creador de Mario i de Zelda?|Shigeru Miyamoto|Hideo Kojima|Satoru Iwata|Masahiro Sakurai
Quin any va sortir el primer Super Mario Bros.?|1985|1981|1989|1991
Qui va crear la saga Metal Gear?|Hideo Kojima|Shinji Mikami|Hironobu Sakaguchi|Yu Suzuki
Quin joc d'Atari de 1972 es considera el primer gran èxit comercial dels videojocs?|Pong|Space Invaders|Pac-Man|Asteroids
En quin joc apareix la frase "The cake is a lie"?|Portal|Half-Life 2|BioShock|Fallout 3
Com es diu el protagonista de Half-Life?|Gordon Freeman|Adrian Shephard|Isaac Clarke|JC Denton
A Final Fantasy VII, com es diu l'antagonista de cabells platejats?|Sephiroth|Kefka|Ganondorf|Ansem
A quina ciutat submarina passa el primer BioShock?|Rapture|Columbia|Atlantis|Zion
Quina empresa polonesa va desenvolupar The Witcher 3?|CD Projekt Red|Techland|11 bit studios|Bethesda
Quin joc de 1980 es deia originalment "Puck Man" al Japó?|Pac-Man|Dig Dug|Q*bert|Frogger
Qui va crear el Tetris?|Aleksei Pàjitnov|Nolan Bushnell|Gunpei Yokoi|John Carmack
Com es diu la intel·ligència artificial que acompanya el Master Chief a Halo?|Cortana|GLaDOS|SHODAN|EDI
Quina va ser l'última consola de sobretaula de Sega?|La Dreamcast|La Saturn|La Mega Drive|La Master System
En quin joc el protagonista es diu Guybrush Threepwood i vol ser pirata?|The Secret of Monkey Island|Day of the Tentacle|Grim Fandango|Maniac Mansion
Quin joc d'id Software de 1993 va popularitzar els shooters en primera persona?|Doom|Quake|Duke Nukem 3D|Unreal
A Street Fighter, què crida en Ryu quan llança una bola d'energia?|Hadouken|Shoryuken|Kamehameha|Sonic Boom
Quin joc va guanyar el premi a joc de l'any als Game Awards del 2023?|Baldur's Gate 3|Tears of the Kingdom|Alan Wake 2|Spider-Man 2
Quin joc de granja va crear una sola persona, Eric Barone?|Stardew Valley|Terraria|Undertale|Celeste
A la saga Zelda, com es diu la relíquia formada per tres triangles daurats?|La Triforce|L'Espasa Mestra|L'Ocarina del Temps|El Mirall del Crepuscle
Quin joc de rol en línia de Blizzard va sortir el 2004?|World of Warcraft|Diablo II|EverQuest|Guild Wars
Quin marsupial taronja creat per Naughty Dog va ser mascota no oficial de la primera PlayStation?|Crash Bandicoot|Spyro|Jak|Sly Cooper
A Dark Souls, què s'encén per descansar i recuperar-se?|Una foguera|Una espelma|Un altar|Un fanal
Com es diu el bruixot protagonista de The Witcher?|Geralt de Rívia|Jaskier|Vesemir|Eredin
`
    },
    cin: {
      1: `
A "Toy Story", quin joguet és un guardià espacial?|Buzz Lightyear|Woody|Rex|Slinky
A "Buscant en Nemo", què li passa a la Dory?|Que s'oblida de tot de seguida|Que no sap nedar|Que té por de l'aigua|Que no hi veu
A "Up", amb què fa volar la casa el senyor Fredricksen?|Amb globus|Amb coets|Amb un helicòpter|Amb unes ales
A "Ratatouille", quin animal és en Remy?|Una rata|Un gat|Un conill|Un esquirol
Com es diu el ninot de neu de "Frozen"?|Olaf|Sven|Kristoff|Hans
A "El Rei Lleó", qui és el pare d'en Simba?|Mufasa|Scar|Rafiki|Timó
A "Coco", quin instrument toca en Miguel?|La guitarra|El violí|La trompeta|El piano
Com es diu l'ogre verd que viu en un pantà?|Shrek|Hulk|Grinch|Mike
A "Monstres, S.A.", com es diu el monstre verd amb un sol ull?|Mike Wazowski|Sulley|Randall|Boo
A "Vaiana", com es diu el semidéu que té un ham màgic?|Maui|Tamatoa|Tui|Pua
A "Els Increïbles", quin poder té en Dash?|Córrer molt de pressa|Fer-se invisible|Estirar-se|Volar
A "Madagascar", quin animal és l'Alex?|Un lleó|Una zebra|Una girafa|Un hipopòtam
Com es diu el protagonista de "Kung Fu Panda"?|Po|Shifu|Tai Lung|Bao
A "Encanto", de qui no es parla?|D'en Bruno|De la Mirabel|De l'àvia|De la Luisa
A "Aladdin", què surt de la llàntia meravellosa?|Un geni|Un drac|Un fantasma|Un mico
A "La Sireneta", com es diu la sirena?|Ariel|Úrsula|Vaiana|Aurora
A "Peter Pan", com es diu la fada?|Campaneta|Wendy|Flora|Primavera
A "Zootròpolis", quin animal és la policia Judy Hopps?|Una conilla|Una guineu|Una ovella|Una ratolina
A "Wall-E", què és en Wall-E?|Un robot que recull escombraries|Un astronauta|Un extraterrestre|Un cotxe
A "Dumbo", què fa servir l'elefant per volar?|Les orelles|Unes ales|Un globus|Una capa
A "La Bella i la Bèstia", en què es converteix la Bèstia al final?|En un príncep|En un lleó|En un rei vell|En un cavall
A "Bambi", quin animal és en Bambi?|Un cérvol|Un conill|Una mofeta|Un cavall
`,
      2: `
A "Jurassic Park", quin dinosaure ataca els cotxes sota la pluja?|El tiranosaure|El velociraptor|El triceratops|El braquiosaure
A "Titanic", com es diuen els dos protagonistes?|Jack i Rose|Tom i Kate|Leo i Ella|Sam i Molly
Qui va dirigir "Avatar"?|James Cameron|Steven Spielberg|Peter Jackson|Christopher Nolan
A "Matrix", quina pastilla tria en Neo?|La vermella|La blava|La verda|La groga
Quin actor fa de Harry Potter al cinema?|Daniel Radcliffe|Rupert Grint|Tom Felton|Elijah Wood
A "Sol a casa", com es diu el nen que es queda sol?|Kevin|Max|Tommy|Billy
De quin animal té pànic l'Indiana Jones?|De les serps|De les aranyes|De les rates|Dels cocodrils
A "Els Goonies", què busquen els nens?|El tresor d'un pirata|Un extraterrestre|Un gos perdut|Una nau espacial
A "Retorn al futur", com es diu el científic amic d'en Marty?|Doc Brown|Doc Ock|Doctor No|Professor X
Qui va dirigir "Tauró" i "E.T."?|Steven Spielberg|George Lucas|Ridley Scott|Robert Zemeckis
Quin estudi japonès va fer "El viatge de Chihiro" i "El meu veí Totoro"?|Studio Ghibli|Toei Animation|Pixar|Madhouse
A "Gladiator", com es diu el general romà protagonista?|Màxim|Espàrtac|Còmmode|Marc Antoni
Quina pel·lícula del 2023 té de protagonista una nina de Mattel?|Barbie|Bratz|Polly Pocket|Trolls
A "Pirates del Carib", com es diu el vaixell d'en Jack Sparrow?|La Perla Negra|L'Holandès Errant|La Venjança de la Reina Anna|L'Interceptor
A "Men in Black", què fan servir per esborrar la memòria de la gent?|Un neuralitzador|Una vareta|Un xiulet|Un esprai
A "E.T.", amb què volen l'Elliott i l'E.T. per davant de la lluna?|Amb una bicicleta|Amb una escombra|Amb un monopatí|Amb un globus
A "Jumanji", què és Jumanji?|Un joc màgic|Una selva de veritat|Un zoo|Un llibre
Quin director va fer "Oppenheimer", "Origen" i "Interstellar"?|Christopher Nolan|Denis Villeneuve|Quentin Tarantino|David Fincher
A "Karate Kid", qui és el mestre d'en Daniel?|El senyor Miyagi|El mestre Splinter|El mestre Shifu|Pai Mei
A "Forrest Gump", a què compara la vida la mare d'en Forrest?|A una capsa de bombons|A una muntanya russa|A un partit de futbol|A un riu
A "Els caçafantasmes", quin monstre gegant passeja per Nova York?|Un ninot de núvol de sucre|Un goril·la|Un llangardaix|Un robot
Quin actor fa de Jack a "Titanic"?|Leonardo DiCaprio|Brad Pitt|Matt Damon|Johnny Depp
`,
      3: `
Qui va dirigir "Psicosi"?|Alfred Hitchcock|Orson Welles|Stanley Kubrick|Billy Wilder
Quin actor fa de Rick a "Casablanca"?|Humphrey Bogart|Cary Grant|Clark Gable|James Stewart
Quina va ser la primera pel·lícula de parla no anglesa a guanyar l'Oscar a millor pel·lícula, el 2020?|Paràsits|Roma|Amour|La vida és bella
Qui va dirigir "Pulp Fiction"?|Quentin Tarantino|Martin Scorsese|Guy Ritchie|Joel Coen
A "El Padrí", quin actor fa de Vito Corleone?|Marlon Brando|Al Pacino|Robert De Niro|James Caan
Qui va dirigir "2001: una odissea de l'espai"?|Stanley Kubrick|Ridley Scott|Andrei Tarkovski|George Lucas
A "Blade Runner", què són els replicants?|Androides gairebé idèntics als humans|Extraterrestres infiltrats|Clons de dinosaures|Hologrames
Quina pel·lícula de 1994 basada en un relat de Stephen King passa a la presó de Shawshank?|Cadena perpètua|La milla verda|Misery|Compta amb mi
Quina directora catalana va guanyar l'Os d'Or de Berlín el 2022 amb "Alcarràs"?|Carla Simón|Isabel Coixet|Neus Ballús|Elena Martín
Qui va compondre la música de "Star Wars", "Tauró" i "Indiana Jones"?|John Williams|Hans Zimmer|Ennio Morricone|Danny Elfman
A "El resplendor", com es diu l'hotel?|Overlook|Bates|Continental|Grand Budapest
Quina pel·lícula de fantasia va guanyar 11 Oscars el 2004?|El retorn del rei|Avatar|Harry Potter i la pedra filosofal|Gladiator
Qui va dirigir "El laberint del faune"?|Guillermo del Toro|Alfonso Cuarón|Alejandro González Iñárritu|J. A. Bayona
Quin director barceloní va fer "L'orfenat" i "Un monstre em ve a veure"?|J. A. Bayona|Jaume Balagueró|Cesc Gay|Kike Maíllo
A "Alien", com es diu la nau de càrrega?|Nostromo|Sulaco|Discovery One|Event Horizon
Quin actor va fer de Joker a "El cavaller fosc"?|Heath Ledger|Joaquin Phoenix|Jack Nicholson|Jared Leto
Quin festival de cinema fantàstic es fa cada octubre a la costa catalana?|El Festival de Sitges|El Festival de Sant Sebastià|La Seminci|El Festival de Màlaga
A "Ciutadà Kane", quina paraula diu Kane abans de morir?|Rosebud|Xanadu|Susan|Mother
Qui va dirigir "El bo, el lleig i el dolent"?|Sergio Leone|John Ford|Sam Peckinpah|Clint Eastwood
Com es diu l'ordinador de "2001: una odissea de l'espai"?|HAL 9000|Skynet|WOPR|MU-TH-UR
A "Terminator", com es diu la intel·ligència artificial que es rebel·la?|Skynet|HAL 9000|VIKI|Ultron
Quina pel·lícula va guanyar el primer Oscar a millor film d'animació, el 2002?|Shrek|Monstres, S.A.|Toy Story 2|El viatge de Chihiro
Quina pel·lícula de multiversos va guanyar 7 Oscars el 2023?|Tot a la vegada a tot arreu|Doctor Strange 2|Spider-Man: No Way Home|Dune
`
    },
    sag: {
      1: `
De quin color és l'espasa làser d'en Darth Vader?|Vermella|Blava|Verda|Lila
Com es diu el petit mestre Jedi verd de les orelles punxegudes?|Yoda|Chewbacca|Jabba|Ewok
A quina casa de Hogwarts va en Harry Potter?|Gryffindor|Slytherin|Hufflepuff|Ravenclaw
Com es diu l'òliba blanca d'en Harry Potter?|Hedwig|Errol|Scabbers|Crookshanks
Quin superheroi es torna verd i enorme quan s'enfada?|Hulk|Thor|Flash|Aquaman
Quina arma fa servir en Thor?|Un martell|Un escut|Un arc|Una llança
De quina ciutat és en Batman?|Gotham|Metròpolis|Nova York|Wakanda
Quin superheroi ve del planeta Krypton?|Superman|Batman|Iron Man|Spider-Man
A quin esport es juga amb escombres voladores a Hogwarts?|Quidditch|Futbol aeri|Escombrabol|Voleibol màgic
Qui són els dos millors amics d'en Harry Potter?|Ron i Hermione|Draco i Neville|Fred i George|Luna i Ginny
Com es diu el robot daurat de Star Wars que parla molt?|C-3PO|R2-D2|BB-8|Wall-E
Què va picar en Peter Parker abans de ser Spider-Man?|Una aranya|Un escorpí|Una abella|Una serp
Quin superheroi porta un escut rodó amb una estrella?|El Capità Amèrica|Iron Man|Ull de Falcó|Ant-Man
Com es diu el hòbbit protagonista d'"El Hòbbit"?|Bilbo|Frodo|Sam|Pippin
Com es diu el bruixot malvat sense nas de Harry Potter?|Voldemort|Snape|Draco|Dumbledore
A "The Mandalorian", com es diu de debò el "Baby Yoda"?|Grogu|Yaddle|Din|Ezra
Com es diu la nau d'en Han Solo?|El Falcó Mil·lenari|L'Enterprise|L'Estrella de la Mort|L'X-Wing
A "Guardians de la Galàxia", què és en Groot?|Un arbre|Un os rentador|Un robot|Un gos
Quin heroi de Wakanda porta un vestit negre de pantera?|Black Panther|Batman|Venom|Daredevil
Com es diu el director de Hogwarts de la barba blanca?|Dumbledore|Gàndalf|Merlí|Hagrid
Quin superheroi de DC és l'home més ràpid del món?|Flash|Superman|Cíborg|Shazam
Quina marca té en Harry Potter al front?|Una cicatriu en forma de llamp|Una estrella|Un tatuatge de serp|Una piga rodona
`,
      2: `
De quina andana surt el Hogwarts Express?|De la 9 i 3/4|De la 7 i 1/2|De la 13|De la 10 i 1/4
Quantes Gemmes de l'Infinit hi ha a Marvel?|6|4|5|7
Com es diu la criatura obsessionada amb l'Anell, que en diu "el meu tresor"?|Gòl·lum|Smaug|Sàuron|Grima
Quin és el nom real d'Iron Man?|Tony Stark|Bruce Wayne|Steve Rogers|Bruce Banner
Com es diu el planeta desèrtic on creix en Luke Skywalker?|Tatooine|Hoth|Endor|Naboo
Quin encanteri de Harry Potter serveix per desarmar?|Expelliarmus|Lumos|Accio|Wingardium Leviosa
Quants membres té la Comunitat de l'Anell?|9|7|8|12
Com es diu el martell d'en Thor?|Mjölnir|Gungnir|Excalibur|Andúril
Qui és el germà adoptiu d'en Thor?|Loki|Odín|Heimdall|Balder
On s'ha de destruir l'Anell Únic?|Al Mont del Fat|A Rivendell|A les Mines de Mòria|A Isengard
Quin metall de Wakanda forma l'escut del Capità Amèrica?|El vibranium|L'adamantium|El mithril|L'acer valyri
De quin metall són les urpes d'en Wolverine?|D'adamantium|De vibranium|De titani|De plata
Com es diu el mag gris d'"El Senyor dels Anells"?|Gàndalf|Sàruman|Ràdagast|Èlrond
Quina és la identitat secreta d'en Batman?|Bruce Wayne|Clark Kent|Peter Parker|Barry Allen
Quina frase repeteixen els mandalorians?|Aquest és el camí|Que la Força t'acompanyi|L'hivern s'acosta|Fins a l'infinit i més enllà
Quin dolent de Marvel elimina mig univers fent petar els dits?|Thanos|Ultron|Loki|Galactus
A Harry Potter, com s'anomena la gent que no té màgia?|Muggles|Goblins|Hòbbits|Mortífags
En quin animal es transforma en Sirius Black?|En un gos negre|En un cérvol|En una rata|En un llop
Qui és l'arxienemic d'en Superman?|Lex Luthor|El Joker|Thanos|Magneto
Qui va ser la padawan de l'Anakin Skywalker?|Ahsoka Tano|Rey|Padmé Amidala|Sabine Wren
Com es diu el guardabosc gegant de Hogwarts?|Hagrid|Filch|Dobby|Lupin
Quin superheroi es fa petit com una formiga?|Ant-Man|Spider-Man|Flash|Doctor Strange
`,
      3: `
Com es diu l'espasa reforjada de l'Àragorn?|Andúril|Glamdring|Fibló|Orcrist
Qui va crear Spider-Man juntament amb el dibuixant Steve Ditko?|Stan Lee|Jack Kirby|Bob Kane|Frank Miller
Quin any es va estrenar la primera pel·lícula de Star Wars?|1977|1975|1980|1983
A Star Wars, què mana l'Ordre 66?|Exterminar els Jedi|Construir l'Estrella de la Mort|Envair Naboo|Dissoldre el Senat
Qui va dirigir la trilogia cinematogràfica d'"El Senyor dels Anells"?|Peter Jackson|Guillermo del Toro|Ridley Scott|Sam Raimi
A "Dune", com es diu el planeta desèrtic de l'espècia?|Arrakis|Caladan|Giedi Prime|Kaitain
Qui va escriure la novel·la "Dune"?|Frank Herbert|Isaac Asimov|Arthur C. Clarke|Philip K. Dick
De quin planeta és el senyor Spock de Star Trek?|De Vulcà|De Klingon|De Romulus|De Tatooine
A "Joc de Trons", quin és el lema de la casa Stark?|L'hivern s'acosta|Escolteu el meu rugit|Foc i sang|Creixem forts
Qui va escriure la saga "Cançó de gel i foc"?|George R. R. Martin|Brandon Sanderson|Patrick Rothfuss|Terry Pratchett
Quina va ser la primera pel·lícula de l'Univers Cinematogràfic de Marvel, el 2008?|Iron Man|L'increïble Hulk|Thor|Capità Amèrica: el primer venjador
Qui va ser el mestre Jedi de l'Obi-Wan Kenobi?|Qui-Gon Jinn|Mace Windu|El comte Dooku|Yoda
Qui va crear Batman juntament amb Bill Finger?|Bob Kane|Stan Lee|Jerry Siegel|Jack Kirby
Com es diu el drac d'"El Hòbbit"?|Smaug|Glàurung|Drogon|Fàfnir
De què és el nucli de la vareta d'en Harry Potter?|De ploma de fènix|De pèl d'unicorn|De nervi de drac|De pèl de thestral
A "Doctor Who", com es diu la màquina del temps en forma de cabina de policia?|TARDIS|DeLorean|Nostromo|Heart of Gold
De quina espècie és en Chewbacca?|Wookiee|Ewok|Gungan|Jawa
Quin còmic d'Alan Moore pregunta "Qui vigila els vigilants?"|Watchmen|V de Vendetta|From Hell|La broma assassina
A "Stranger Things", com anomenen els nens el monstre de la primera temporada?|Demogorgon|Vecna|Balrog|Beholder
Quina és la capital del regne de Góndor?|Minas Tirith|Edoras|Minas Morgul|Osgiliath
Quin planeta destrueix la primera Estrella de la Mort?|Alderaan|Naboo|Coruscant|Dantooine
A "La guia de l'autoestopista galàctic", quina és la resposta a la vida, l'univers i tot plegat?|42|7|Zero|Infinit
Quin actor ha fet de Wolverine al cinema durant més de vint anys?|Hugh Jackman|Chris Hemsworth|Ryan Reynolds|Christian Bale
`
    },
    mus: {
      1: `
Quin instrument té tecles blanques i negres?|El piano|El violí|La flauta|El tambor
Quin instrument es toca amb baquetes?|La bateria|La guitarra|La trompeta|L'arpa
Quantes cordes té un violí?|4|3|6|8
Quantes notes musicals hi ha, del do al si?|7|5|6|8
Quina nota ve just després del do?|El re|El mi|El fa|El si
Com es diu qui dirigeix una orquestra amb una batuta?|Director o directora|Solista|Tenor|Compositor
Quina cantant colombiana va cantar "Waka Waka"?|Shakira|Rosalía|Karol G|Aitana
Quin cantant va fer famós el pas de ball "moonwalk"?|Michael Jackson|Elvis Presley|Justin Bieber|Bruno Mars
Quin instrument escocès té una bossa d'aire?|La gaita|L'acordió|L'harmònica|El clarinet
Quin instrument de corda molt gran es toca dret?|El contrabaix|El violí|La viola|L'ukelele
Quin concurs europeu de cançons es fa cada mes de maig?|Eurovisió|Els Grammy|La Champions|Els Oscars
Quin instrument toca la Lisa Simpson?|El saxo|El violí|La flauta|El piano
Quin instrument petit de quatre cordes s'associa amb Hawaii?|L'ukelele|El banjo|La mandolina|El llaüt
Com es diu el text que es canta en una cançó?|La lletra|La partitura|El compàs|La tornada
Quin grup de K-pop formen set nois com RM, Jungkook i Jimin?|BTS|Blackpink|Stray Kids|Seventeen
Quants músics formen un duo?|2|3|4|5
Què vol dir "forte" en una partitura?|Que s'ha de tocar fort|Que s'ha de tocar a poc a poc|Que s'ha de repetir|Que s'ha de callar
Quin instrument de metall té una vara que es fa lliscar endavant i enrere?|El trombó|La trompeta|La tuba|La trompa
Quina cantant canta "Shake It Off"?|Taylor Swift|Dua Lipa|Adele|Lady Gaga
Com es diu un grup molt gran de gent que canta junta?|Un cor|Una orquestra|Una banda|Un quartet
Quin instrument de percussió es fa sonar picant dues peces de fusta amb els dits, típic del flamenc?|Les castanyoles|Les maraques|El triangle|El bombo
Quin instrument de vent i teclat es troba a moltes esglésies?|L'orgue|El saxo|L'acordió|El xilòfon
`,
      2: `
De quina ciutat anglesa eren els Beatles?|De Liverpool|De Londres|De Manchester|De Birmingham
Qui era el cantant de Queen?|Freddie Mercury|Mick Jagger|David Bowie|Elton John
Quants membres tenien els Beatles?|4|3|5|6
Quina cantant va fer famosa la cançó "Bad Guy"?|Billie Eilish|Olivia Rodrigo|Dua Lipa|Ariana Grande
Qui canta "Happy", de la pel·lícula "Gru 2"?|Pharrell Williams|Bruno Mars|Justin Timberlake|The Weeknd
Quina cantant de Sant Esteve Sesrovires va triomfar amb "Despechá"?|Rosalía|Aitana|Bad Gyal|Lola Índigo
Quin cantant britànic pèl-roig canta "Shape of You"?|Ed Sheeran|Harry Styles|Lewis Capaldi|Sam Smith
Quin grup britànic canta "Viva la Vida"?|Coldplay|Oasis|Muse|Imagine Dragons
Quin grup català canta "Jenifer"?|Els Catarres|Txarango|Oques Grasses|Buhos
Quin grup d'Osona canta "La gent que estimo"?|Oques Grasses|Els Catarres|Manel|Doctor Prats
Quin estil musical va néixer al Bronx als anys setanta amb DJ i MC?|El hip-hop|El reggae|El punk|El techno
Quin instrument va fer llegendari en Jimi Hendrix?|La guitarra elèctrica|La bateria|El baix|El piano
Com es diu la veu més aguda de dona en un cor?|Soprano|Contralt|Tenor|Baríton
Quina cantant britànica canta "Rolling in the Deep"?|Adele|Amy Winehouse|Dua Lipa|Jessie J
Qui va compondre l'òpera "La flauta màgica"?|Mozart|Beethoven|Verdi|Wagner
Quin cantant canadenc canta "Blinding Lights"?|The Weeknd|Drake|Justin Bieber|Shawn Mendes
Quina cantant va triomfar el 2023 amb "Flowers"?|Miley Cyrus|Selena Gomez|Katy Perry|Rihanna
Quin duet francès de música electrònica actuava amb cascos de robot?|Daft Punk|Justice|Air|Phoenix
A quin grup pertanyia en Harry Styles?|One Direction|Jonas Brothers|BTS|Take That
Quants temps té el compàs d'un vals?|3|2|4|6
Quin cantant porto-riqueny va publicar "Un Verano Sin Ti"?|Bad Bunny|Daddy Yankee|Ozuna|Rauw Alejandro
Quina cantant és coneguda com "la Reina del Pop"?|Madonna|Beyoncé|Britney Spears|Cher
`,
      3: `
Quin àlbum de Pink Floyd té un prisma a la portada?|The Dark Side of the Moon|The Wall|Wish You Were Here|Animals
Qui era el cantant de Nirvana?|Kurt Cobain|Eddie Vedder|Chris Cornell|Dave Grohl
Quin àlbum de Michael Jackson és el més venut de la història?|Thriller|Bad|Dangerous|Off the Wall
Quin guitarrista de Queen és doctor en astrofísica?|Brian May|Roger Taylor|John Deacon|Freddie Mercury
Qui va compondre el ballet "El llac dels cignes"?|Txaikovski|Stravinski|Prokófiev|Rakhmàninov
Quin festival llegendari es va fer l'agost de 1969 en una granja de l'estat de Nova York?|Woodstock|Glastonbury|Live Aid|Monterey Pop
Qui va cantar "Space Oddity"?|David Bowie|Elton John|Lou Reed|Bryan Ferry
Quin grup va gravar "Stairway to Heaven"?|Led Zeppelin|Deep Purple|Black Sabbath|The Who
Quin any va rebre Bob Dylan el Nobel de Literatura?|2016|2008|2012|2019
De quin país és el grup AC/DC?|D'Austràlia|Dels Estats Units|D'Anglaterra|D'Escòcia
Qui és el cantant dels Rolling Stones?|Mick Jagger|Keith Richards|Roger Daltrey|Robert Plant
Quin cantautor de Xàtiva va fer un himne d'"Al vent"?|Raimon|Lluís Llach|Ovidi Montllor|Pi de la Serra
Quin cantautor del Poble-sec va cantar "Mediterráneo"?|Joan Manuel Serrat|Lluís Llach|Raimon|Joaquín Sabina
Quin grup irlandès lidera en Bono?|U2|The Cranberries|The Pogues|Thin Lizzy
Quin àlbum dels Beatles mostra el grup creuant un pas de vianants?|Abbey Road|Let It Be|Revolver|Help!
Qui va compondre les "Variacions Goldberg"?|Johann Sebastian Bach|Händel|Haydn|Schubert
Quina cantant londinenca de "Rehab" va morir el 2011?|Amy Winehouse|Adele|Dusty Springfield|Sinéad O'Connor
Quin raper va guanyar un Oscar amb "Lose Yourself"?|Eminem|Jay-Z|Dr. Dre|50 Cent
Quin grup va publicar "OK Computer" el 1997?|Radiohead|Blur|Oasis|Pulp
Quin músic nord-americà és conegut com "The Boss"?|Bruce Springsteen|Bob Dylan|Tom Petty|Billy Joel
Quin grup mallorquí canta "Alegria"?|Antònia Font|Manel|Els Amics de les Arts|Mishima
Quina soprano barcelonina va cantar "Barcelona" amb Freddie Mercury?|Montserrat Caballé|Victòria dels Àngels|Ainhoa Arteta|Maria Callas
Quin instrument tocava Miles Davis?|La trompeta|El saxo|El piano|El contrabaix
`
    }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = FRIKI;
  else root.FRIKI = FRIKI;
})(typeof window !== 'undefined' ? window : globalThis);
