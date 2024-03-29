

app.post('/newArtist', async (req, res) => {
  res.type('json');
  if(!req.query.index) {
    res.status(CLIENT_ERROR);
    res.send("NO INDEX SPECIFIED");
  } else if(!req.query.ticker || !req.query.name) {
    res.status(CLIENT_ERROR);
    res.send("INSUFFICIENT ARTIST DATA");
  }
  let index = req.query.index;
  let ticker = req.query.ticker;
  let name = req.query.name;
  try {
    addArtist(index, ticker, name);
  } catch (error) {
    res.status(SERVER_ERROR);
    res.send("COULD NOT ADD ENTRY: " + error);
  }
});

app.post('/buildArtists', async (req, res) => {
  res.type('json');
  let tickers = {
    AAJ: "ALY & AJ",
    AAL: "AALIYAH",
    ABA: "ABBA",
    ADE: "ADELE",
    ALS: "ALESSIA CARA",
    ALV: "ALVVAYS",
    ALX: "ALLIE X",
    ANG: "ANGEL OLSEN",
    ANI: "ANITTA",
    ARC: "ARCA",
    ARI: "ARIANA GRANDE",
    AWH: "AMY WINEHOUSE",
    AVA: "AVA MAX",
    AZB: "AZEALIA BANKS",
    BAD: "BAD BUNNY",
    BAN: "BANKS",
    BEB: "BEBE REXHA",
    BEY: "BEYONCÉ",
    BIG: "BIG THIEF",
    BIL: "BILLIE EILISH",
    BJK: "BJÖRK",
    BLA: "BLACKPINK",
    BLE: "BLEACHERS",
    BRK: "BROCKHAMPTON",
    BRM: "BRIDGIT MENDLER",
    BRO: "BRUNO MARS",
    BRT: "BRITNEY SPEARS",
    BTL: "THE BEATLES",
    BTS: "BTS",
    CAC: "CAMILA CABELLO",
    CAG: "CHRISTINA AGUILERA",
    CAL: "CALVIN HARRIS",
    CDB: "CARDI B",
    CHI: "CHILDISH GAMBINO",
    CHP: "CHIP SKYLARK",
    CHR: "CHRISTINA AGUILERA",
    CHV: "CHVRCHES",
    CLA: "CLAIRO",
    COB: "COBRAH",
    COL: "COLDPLAY",
    CON: "CONAN GRAY",
    CPO: "CAROLINE POLACHEK",
    CPU: "CHARLIE PUTH",
    CRJ: "CARLY RAE JEPSEN",
    CSK: "THE CHAINSMOKERS",
    CUW: "CARRIE UNDERWOOD",
    DAG: "DAGNY",
    DBO: "DAVID BOWIE",
    DEL: "DELTA GOODREM",
    DEM: "DEMI LOVATO",
    DES: "DESTINY'S CHILD",
    DJK: "DJ KHALED",
    DOJ: "DOJA CAT",
    DRA: "DRAKE",
    DUA: "DUA LIPA",
    EDS: "ED SHEERAN",
    ELL: "ELLIE GOULDING",
    ELT: "ELTON JOHN",
    ETH: "ETHEL CAIN",
    FEX: "F(X)",
    FIO: "FIONA APPLE",
    FKA: "FKA TWIGS",
    FLO: "FLORENCE + THE MACHINE",
    FRA: "FRANK OCEAN",
    GJO: "GRACE JONES",
    GOR: "GORILLAZ",
    GRI: "GRIMES",
    HAI: "HAIM",
    HAL: "HALSEY",
    HAN: "HANNAH DIAMOND",
    HAR: "HARRY STYLES",
    HEY: "HEY VIOLET",
    HLS: "HAILEE STEINFELD",
    HMO: "HANNAH MONTANA",
    ICO: "ICONA POP",
    IGG: "IGGY AZALEA",
    IMD: "IMAGINE DRAGONS",
    ITZ: "ITZY",
    JHE: "JHENÉ AIKO",
    JJK: "JANET JACKSON",
    JNM: "JANELLE MONÁE",
    JOJ: "JOJI",
    JUB: "JUSTIN BIEBER",
    JUL: "JULIA MICHAELS",
    JUT: "JUSTIN TIMBERLAKE",
    JYZ: "JAY-Z",
    KAC: "KACY HILL",
    KAL: "KALI UCHIS",
    KBU: "KATE BUSH",
    KCK: "KELLY CLARKSON",
    KCM: "KACEY MUSGRAVES",
    KEN: "KENDRICK LAMAR",
    KHA: "KHALID",
    KII: "KIIARA",
    KIL: "THE KILLERS",
    KIM: "KIM PETRAS",
    KKB: "KERO KERO BONITO",
    KMB: "KIMBRA",
    KPY: "KATY PERRY",
    KSH: "KESHA",
    KYE: "KANYE WEST",
    KYL: "KYLIE MINOGUE",
    LDR: "LANA DEL REY",
    LGA: "LADY GAGA",
    LIG: "LIGHTS",
    LLB: "LIL B",
    LMX: "LITTLE MIX",
    LNX: "LIL NAS X",
    LOR: "LORDE",
    LUV: "LIL UZI VERT",
    LZO: "LIZZO",
    MAD: "MADONNA",
    MAG: "MAGDALENA BAY",
    MAR: "MARINA",
    MCA: "MARIAH CAREY",
    MEG: "MEGHAN TRAINOR",
    MEL: "MELANIE MARTINEZ",
    MIA: "MIA",
    MIL: "MILEY CYRUS",
    MIR: "MIRANDA COSGROVE",
    MIS: "MISSY ELLIOT",
    MJC: "MICHAEL JACKSON",
    MKA: "MIKA",
    MOE: "MØ",
    MOO: "MAROON 5",
    MRO: "MAGGIE ROGERS",
    MSK: "MITSKI",
    MTH: "MOTHICA",
    MTS: "MEGAN THEE STALLION",
    MUN: "MUNA",
    NIK: "NICKI MINAJ",
    NIR: "NIRVANA",
    NJO: "NICK JONAS",
    NSY: "*NSYNC",
    OCA: "ORANGE CARAMEL",
    ODR: "ONE DIRECTION",
    OLI: "OLIVIA RODRIGO",
    PAN: "PANIC! AT THE DISCO",
    PAR: "PARAMORE",
    PHO: "PHOEBE BRIDGERS",
    PIT: "PITBULL",
    PNK: "P!NK",
    POP: "POPPY",
    PRI: "PRINCE",
    PUR: "PURITY RING",
    REG: "REGINA SPEKTOR",
    RIH: "RIHANNA",
    RIN: "RINA SAWAYAMA",
    ROS: "ROSALÍA",
    SAB: "SABRINA CARPENTER",
    SCM: "SOCCER MOMMY",
    SEB: "SOPHIE ELLIS-BEXTOR",
    SEL: "SELENA GOMEZ",
    SHA: "SHAKIRA",
    SHM: "SHAWN MENDES",
    SHU: "SHURA",
    SHY: "SHYGIRL",
    SIA: "SIA",
    SKY: "SKY FERREIRA",
    SNM: "SNAIL MAIL",
    SOL: "SOLANGE",
    SOP: "SOPHIE",
    SOS: "5 SECONDS OF SUMMER",
    SRM: "STROMAE",
    SUF: "SUFJAN STEVENS",
    SZA: "SZA",
    TAS: "TEGAN AND SARA",
    THE: "THE 1975",
    TIN: "TINASHE",
    TLC: "TLC",
    TOP: "TWENTY-ONE PILOTS",
    TOR: "TORI KELLY",
    TOV: "TOVE LO",
    TRY: "TROYE SIVAN",
    TSG: "THE SPICE GIRLS",
    TSW: "TAYLOR SWIFT",
    TYC: "TYLER, THE CREATOR",
    WAL: "WEIRD AL",
    WHI: "WHITNEY HOUSTON",
    WIL: "WILLOW",
    WKD: "THE WEEKND",
    XCX: "CHARLI XCX",
    ZAR: "ZARA LARSSON",
    ZAY: "ZAYN MALIK"
  };
  try {
    for(let w = 236; w >= 180; w--) {
      ChartModel.findOne({index: w}, async (err, docs) => {
        let artistArray = Object.entries(tickers);
        artistArray.forEach(async (entry) => {
          let ticker = entry[0];
          let name = entry[1];
          if(docs && docs.fullChart) {
            storeArtist(docs.fullChart, ticker, name, w);
          }
        });
      });
    }
    //res.status(RESPONSE_OK);
    //res.send("SUCCESSFULLY ADDED ARTISTS");
  } catch(error) {
    res.status(SERVER_ERROR);
    res.send("SMTH BAD HAPPENED");
  }
});