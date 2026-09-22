// src/routes/womenRoutes.jsx
// All Women Fashion routes — lazy loaded and grouped by category
import { lazy } from "react";



/* ── Top level ── */
const Clothing          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/Clothing"));
const EthnicWear        = lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/EthnicWear"));
const WesternWear       = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/WesternWear"));
const LingerieNightwear = lazy(() => import("../pages/womenfashion/womenClothing/LingerieAndNightwear/LingerieNightwear"));
const TopBrands         = lazy(() => import("../pages/womenfashion/womenClothing/TopBrands/TopBrands"));

/* ── Ethnic Wear ── */
const Blouses        = lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/Blouses"));
const BottomWear     = lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/BottomWear"));
const ChunnisDupattas= lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/ChunnisDupattas"));
const DressMaterial  = lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/DressMaterial"));
const Gowns          = lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/Gowns"));
const KurtasKurtis   = lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/KurtasKurtis"));
const LehengaCholis  = lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/LehengaCholis"));
const Sarees         = lazy(() => import("../pages/womenfashion/womenClothing/ethinicWear/Sarees"));

/* ── Western Wear ── */
const TopsTshirts    = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/topsTshirts/TopsTshirts"));
const Tshirts        = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/topsTshirts/Tshirts"));
const Shirts         = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/topsTshirts/Shirts"));
const Polos          = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/topsTshirts/Polos"));
const ButtonDownshirt= lazy(() => import("../pages/womenfashion/womenClothing/westernWear/topsTshirts/ButtonDownshirt"));
const DressesJumpsuits=lazy(() => import("../pages/womenfashion/womenClothing/westernWear/dressesJumpsuits/DressesJumpsuits"));
const Dresses        = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/dressesJumpsuits/Dresses"));
const Jumpsuits      = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/dressesJumpsuits/Jumpsuits"));
const Trousers       = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/Trousers"));
const JeansJeggings  = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/JeansJeggings"));
const SkirtsShorts   = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/skirtsShorts/SkirtsShorts"));
const Skirts         = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/skirtsShorts/Skirts"));
const Shorts         = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/skirtsShorts/Shorts"));
const Shrugs         = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/Shrugs"));
const Leggings       = lazy(() => import("../pages/womenfashion/womenClothing/westernWear/skirtsShorts/Leggings"));

/* ── Sportswear ── */
const Sportswear          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/Sportswear"));
const ActiveDresses       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/ActiveDresses"));
const AthleticSocks       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/athleticSocks/AthleticSocks"));
const AnkleSocks          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/athleticSocks/AnkleSocks"));
const CrewSocks           = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/athleticSocks/CrewSocks"));
const KneeHighSock        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/athleticSocks/KneeHighSock"));
const Vests               = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/Vests"));
const SportShorts         = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/SportShorts"));
const Innerwear           = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/innerwear/Innerwear"));
const Briefs              = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/innerwear/Briefs"));
const SportsBras          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/innerwear/SportsBras"));
const ProtectiveSportsBras= lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/innerwear/ProtectiveSportsBras"));
const Sets                = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/sets/Sets"));
const Tracksuits          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/sets/Tracksuits"));
const Sweatsuits          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/sets/Sweatsuits"));
const WorkoutBottom       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/sets/WorkoutBottom"));
const SportLeggings       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/SportLeggings"));
const ShirtTees           = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/shirtsTees/ShirtTees"));
const ButtonDownShirts    = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/shirtsTees/ButtonDownShirts"));
const TankTops            = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/shirtsTees/TankTops"));
const SportTshirts        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/shirtsTees/SportTshirts"));
const SweatshirtsHoodies  = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/SweatshirtsHoodies"));
const TrackJackets        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/TrackJackets"));
const SportTrousers       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/SportTrousers"));
const BaseLayersCompression=lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/BaseLayersCompression"));
const ArmWarmers          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/ArmWarmers"));
const CompressionSocks    = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/CompressionSocks"));
const LegWarmers          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/LegWarmers"));
const Pants               = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/Pants"));
const BaseShirts          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/BaseShirts"));
const BaseShorts          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/BaseShorts"));
const ThermalUnderwear    = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/baseLayersCompression/ThermalUnderwear"));
const SkirtsSkorts        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/skirtsSkorts/SkirtsSkorts"));
const Skorts              = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/skirtsSkorts/Skorts"));
const Skirt               = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sportswear/skirtsSkorts/Skirt"));

/* ── Lingerie ── */
const Lingerie            = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/Lingerie"));
const Bras                = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/bras/Bras"));
const AdhesiveBras        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/bras/AdhesiveBras"));
const EverydayBras        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/bras/EverydayBras"));
const MastectomyBras      = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/bras/MastectomyBras"));
const Panties             = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/panties/Panties"));
const Bikinis             = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/panties/Bikinis"));
const Boyshorts           = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/panties/Boyshorts"));
const GstringThongs       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/panties/GstringThongs"));
const Hipsters            = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/panties/Hipsters"));
const PanBriefs           = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/panties/PanBriefs"));
const PeriodPanties       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/panties/PeriodPanties"));
const Shapwear            = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/shapewear/Shapwear"));
const ControlPanties      = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/shapewear/ControlPanties"));
const ShapeLeggings       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/shapewear/ShapeLeggings"));
const ShapingBodysuits    = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/shapewear/ShapingBodysuits"));
const ThighSlimmers       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/shapewear/ThighSlimmers"));
const ShapewearTops       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/shapewear/Tops"));
const WaistShapers        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/shapewear/WaistShapers"));
const CamisolesTank       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/CamisolesTank"));
const LingerieSets        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/LingerieSets"));
const Accessories         = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/accessories/Accessories"));
const BraExtenders        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/accessories/BraExtenders"));
const BreastLiftTape      = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/accessories/BreastLiftTape"));
const BreastPetals        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/accessories/BreastPetals"));
const LingerieBags        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/accessories/LingerieBags"));
const LingerieTape        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/accessories/LingerieTape"));
const PadsEnhancers       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/accessories/PadsEnhancers"));
const Strap               = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/accessories/Strap"));
const PantyhoseStockings  = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/PantyhoseStockings"));
const Thermals            = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/thermals/Thermals"));
const ThermalBottoms      = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/thermals/Bottoms"));
const ThermalTop          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/thermals/Top"));
const TSets               = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/thermals/TSets"));
const Bodysuits           = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/Bodysuits"));
const BustiersCorsets     = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/BustiersCorsets"));
const GartersSuspenders   = lazy(() => import("../pages/womenfashion/womenClothing/clothing/lingerie/GartersSuspenders"));

/* ── Sleep & Lounge Wear ── */
const SleepLoungeWear     = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/SleepLoungeWear"));
const Babydolls           = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/Babydolls"));
const LoungeShorts        = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/LoungeShorts"));
const NightiesNightdresses= lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/NightiesNightdresses"));
const NightwearSets       = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/NightwearSets"));
const Onesies             = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/Onesies"));
const PajamaTops          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/PajamaTops"));
const PyjamaSets          = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/PyjamaSets"));
const PyjamasLoungePants  = lazy(() => import("../pages/womenfashion/womenClothing/clothing/sleepLoungeWear/PyjamasLoungePants"));

/* ── Accessories ── */
const Accessoriess         = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/Accessoriess"));
const BeltBuckles = lazy(() =>import("../pages/womenfashion/womenClothing/clothing/accessories/BeltBuckles"));
const Belts = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/Belts"));
const CapsHats = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/CapsHats"));
const ColdWeatherSets = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/ColdWeatherSets"));
const Earmuffs = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/Earmuffs"));
const FashionHeadbands = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/FashionHeadbands"));
const GlovesArmWarmers = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/GlovesArmWarmers"));
const Handkerchiefs = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/Handkerchiefs"));
const KidneyWarmers = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/KidneyWarmers"));
const ScarvesStolesWraps = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/ScarvesStolesWraps"));
const Shawls = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/Shawls"));
const SocksStockings = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/SocksStockings"));
const SportHeadbands = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/SportHeadbands"));
const Suspenders = lazy(() => import("../pages/womenfashion/womenClothing/clothing/accessories/Suspenders"));

/* swimBeachwear */
const SwimBeachwear = lazy(() => import("../pages/womenfashion/womenClothing/clothing/maternity/SwimBeachwear"));
const BeachCoverupsKaftansSarongs = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/BeachCoverupsKaftansSarongs"));
const Monokinis = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/Monokinis"));
const OnePieceSwimsuits = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/OnePieceSwimsuits"));
const RashGuardSets = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/RashGuardSets"));
const RashGuardShirts = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/RashGuardShirts"));
const Shortsbeach = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/Shortsbeach"));
const SwimPants = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/SwimPants"));
const Tankinis = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/Tankinis/Tankinis"));
const BottomsTankinis = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/Tankinis/BottomsTankinis"));
const TopsTankinis = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/Tankinis/TopsTankinis"));
const SetsTankinis = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/Tankinis/SetsTankinis"));
const BottomBikinis = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/bikinis/BottomBikinis"));
const TopsBikinis = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/bikinis/TopsBikinis"));
const SetsBikinis = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/bikinis/SetsBikinis"));
const Bikiniss = lazy(() => import("../pages/womenfashion/womenClothing/clothing/swimbeachwear/bikinis/Bikiniss"));
/* ═══════════════════════════════════════════
   ROUTE DEFINITIONS — grouped by section
═══════════════════════════════════════════ */
export const womenRoutes = [

  // ── Top-level Women ──
  { path: "women/clothing",             element: <Clothing />         },
  { path: "women/ethnic-wear",          element: <EthnicWear />       },
  { path: "women/westernwear",          element: <WesternWear />      },
  { path: "women/lingere&nightwear",    element: <LingerieNightwear/> },
  { path: "women/topbrands",            element: <TopBrands />        },

  // ── Ethnic Wear ──
  { path: "womenfashion/womenClothing/ethinicWear/blouses",           element: <Blouses />         },
  { path: "womenfashion/womenClothing/ethinicWear/Bottoms-wear",       element: <BottomWear />      },
  { path: "womenfashion/womenClothing/ethinicWear/Chunnis-Dupattas",   element: <ChunnisDupattas /> },
  { path: "womenfashion/womenClothing/ethinicWear/Dress-Material",     element: <DressMaterial />   },
  { path: "womenfashion/womenClothing/ethinicWear/Gowns",              element: <Gowns />           },
  { path: "womenfashion/womenClothing/ethinicWear/Kurtas-Suits",       element: <KurtasKurtis />    },
  { path: "womenfashion/womenClothing/ethinicWear/Lehenga-Cholis",     element: <LehengaCholis />   },
  { path: "womenfashion/womenClothing/ethinicWear/Sarees",             element: <Sarees />          },

  // ── Western Wear ──
  { path: "western-wear/tops-t-shirts-shirts",              element: <TopsTshirts />     },
  { path: "women/western-wear/tshirts",                     element: <Tshirts />         },
  { path: "women/western-wear/shirts",                      element: <Shirts />          },
  { path: "women/western-wear/polos",                       element: <Polos />           },
  { path: "western-wear/tops-t-shirts-shirts/button-down",  element: <ButtonDownshirt /> },
  { path: "western-wear/dresses-jumpsuits",                 element: <DressesJumpsuits />},
  { path: "western-wear/dresses-jumpsuits/dresses",         element: <Dresses />         },
  { path: "western-wear/dresses-jumpsuits/jumpsuits",       element: <Jumpsuits />       },
  { path: "western-wear/trousers",                          element: <Trousers />        },
  { path: "western-wear/jeans-jeggings",                    element: <JeansJeggings />   },
  { path: "western-wear/skirts-shorts",                     element: <SkirtsShorts />    },
  { path: "western-wear/skirts-shorts/skirts",              element: <Skirts />          },
  { path: "western-wear/skirts-shorts/shorts",              element: <Shorts />          },
  { path: "western-wear/shrugs",                            element: <Shrugs />          },
  { path: "western-wear/leggings",                          element: <Leggings />        },

  // ── Sportswear ──
  { path: "women/clothing/sports-wear",                                        element: <Sportswear />           },
  { path: "women/clothing/sports-wear/active-dresses",                         element: <ActiveDresses />        },
  { path: "women/clothing/sports-wear/athletic-socks",                         element: <AthleticSocks />        },
  { path: "women/clothing/sports-wear/athletic-socks/ankle",                   element: <AnkleSocks />           },
  { path: "women/clothing/sports-wear/athletic-socks/crew",                    element: <CrewSocks />            },
  { path: "women/clothing/sports-wear/athletic-socks/knee-high",               element: <KneeHighSock />         },
  { path: "women/clothing/sports-wear/vests",                                  element: <Vests />                },
  { path: "women/clothing/sports-wear/shorts",                                 element: <SportShorts />          },
  { path: "women/clothing/sports-wear/leggings",                               element: <SportLeggings />        },
  { path: "women/clothing/sports-wear/trousers",                               element: <SportTrousers />        },
  { path: "women/clothing/sports-wear/innerwear",                              element: <Innerwear />            },
  { path: "women/clothing/sports-wear/innerwear/briefs",                       element: <Briefs />               },
  { path: "women/clothing/sports-wear/innerwear/sports-bras",                  element: <SportsBras />           },
  { path: "women/clothing/sports-wear/innerwear/protective-sports-bras",       element: <ProtectiveSportsBras /> },
  { path: "women/clothing/sports-wear/sets",                                   element: <Sets />                 },
  { path: "women/clothing/sports-wear/sets/tracksuits",                        element: <Tracksuits />           },
  { path: "women/clothing/sports-wear/sets/sweatsuits",                        element: <Sweatsuits />           },
  { path: "women/clothing/sports-wear/sets/workout",                           element: <WorkoutBottom />        },
  { path: "women/clothing/sports-wear/shirts-tees",                            element: <ShirtTees />            },
  { path: "women/clothing/sports-wear/shirts-tees/button-down",                element: <ButtonDownShirts />     },
  { path: "women/clothing/sports-wear/shirts-tees/tank-tops",                  element: <TankTops />             },
  { path: "women/clothing/sports-wear/shirts-tees/t-shirts",                   element: <SportTshirts />         },
  { path: "women/clothing/sports-wear/sweatshirts-hoodies",                    element: <SweatshirtsHoodies />   },
  { path: "women/clothing/sports-wear/track-jackets",                          element: <TrackJackets />         },
  { path: "women/clothing/sports-wear/base-layers-compression",                element: <BaseLayersCompression />},
  { path: "women/clothing/sports-wear/base-layers-compression/arm-warmers",    element: <ArmWarmers />           },
  { path: "women/clothing/sports-wear/base-layers-compression/compression-socks",element:<CompressionSocks />   },
  { path: "women/clothing/sports-wear/base-layers-compression/leg-warmers",    element: <LegWarmers />           },
  { path: "women/clothing/sports-wear/base-layers-compression/pants",          element: <Pants />                },
  { path: "women/clothing/sports-wear/base-layers-compression/shirts",         element: <BaseShirts />           },
  { path: "women/clothing/sports-wear/base-layers-compression/shorts",         element: <BaseShorts />           },
  { path: "women/clothing/sports-wear/base-layers-compression/thermal-underwear",element:<ThermalUnderwear />    },
  { path: "women/clothing/sports-wear/skirts-skorts",                          element: <SkirtsSkorts />         },
  { path: "women/clothing/sports-wear/skirts-skorts/skorts",                   element: <Skorts />               },
  { path: "women/clothing/sports-wear/skirts-skorts/skirts",                   element: <Skirt />                },

  // ── Lingerie ──
  { path: "women/clothing/lingerie",                                  element: <Lingerie />         },
  { path: "women/lingerie/bras",                                      element: <Bras />             },
  { path: "women/lingerie/bras/adhesive",                             element: <AdhesiveBras />     },
  { path: "women/lingerie/bras/everyday",                             element: <EverydayBras />     },
  { path: "women/lingerie/bras/mastectomy",                           element: <MastectomyBras />   },
  { path: "women/lingerie/panties",                                   element: <Panties />          },
  { path: "women/lingerie/panties/bikinis",                           element: <Bikinis />          },
  { path: "women/lingerie/panties/boyshorts",                         element: <Boyshorts />        },
  { path: "women/lingerie/panties/gstring-thongs",                    element: <GstringThongs />    },
  { path: "women/lingerie/panties/hipsters",                          element: <Hipsters />         },
  { path: "women/lingerie/panties/briefs",                            element: <PanBriefs />        },
  { path: "women/lingerie/panties/period-panties",                    element: <PeriodPanties />    },
  { path: "women/lingerie/shapewear",                                 element: <Shapwear />         },
  { path: "women/lingerie/shapewear/control-panties",                 element: <ControlPanties />   },
  { path: "women/lingerie/shapewear/shape-leggings",                  element: <ShapeLeggings />    },
  { path: "women/lingerie/shapewear/shaping-bodysuits",               element: <ShapingBodysuits /> },
  { path: "women/lingerie/shapewear/thigh-slimmers",                  element: <ThighSlimmers />    },
  { path: "women/lingerie/shapewear/tops",                            element: <ShapewearTops />    },
  { path: "women/lingerie/shapewear/waist-shapers",                   element: <WaistShapers />     },
  { path: "women/lingerie/camisoles-tanks",                           element: <CamisolesTank />    },
  { path: "women/lingerie/sets",                                      element: <LingerieSets />     },
  { path: "women/lingerie/accessories",                               element: <Accessories />      },
  { path: "women/lingerie/accessories/bra-extenders",                 element: <BraExtenders />     },
  { path: "women/lingerie/accessories/breast-lift-tape",              element: <BreastLiftTape />   },
  { path: "women/lingerie/accessories/breast-petals",                 element: <BreastPetals />     },
  { path: "women/lingerie/accessories/lingerie-bags",                 element: <LingerieBags />     },
  { path: "women/lingerie/accessories/lingerie-tape",                 element: <LingerieTape />     },
  { path: "women/lingerie/accessories/pads-enhancers",                element: <PadsEnhancers />    },
  { path: "women/lingerie/accessories/strap",                         element: <Strap />            },
  { path: "women/lingerie/pantyhose",                                 element: <PantyhoseStockings/>},
  { path: "women/lingerie/thermals",                                  element: <Thermals />         },
  { path: "women/lingerie/thermals/bottoms",                          element: <ThermalBottoms />   },
  { path: "women/lingerie/thermals/tops",                             element: <ThermalTop />       },
  { path: "women/lingerie/thermals/sets",                             element: <TSets />            },
  { path: "women/lingerie/bodysuits",                                 element: <Bodysuits />        },
  { path: "women/lingerie/bustiers",                                  element: <BustiersCorsets />  },
  { path: "women/lingerie/garters-suspenders",                        element: <GartersSuspenders />},

  // ── Sleep & Lounge Wear ──
  { path: "women/clothing/sleep-lounge-wear",                         element: <SleepLoungeWear />       },
  { path: "women/clothing/sleep-lounge-wear/babydolls",               element: <Babydolls />             },
  { path: "women/clothing/sleep-lounge-wear/lounge-shorts",           element: <LoungeShorts />          },
  { path: "women/clothing/sleep-lounge-wear/nighties-nightdresses",   element: <NightiesNightdresses />  },
  { path: "women/clothing/sleep-lounge-wear/nightwear-sets",          element: <NightwearSets />         },
  { path: "women/clothing/sleep-lounge-wear/onesies",                 element: <Onesies />               },
  { path: "women/clothing/sleep-lounge-wear/pajama-tops",             element: <PajamaTops />            },
  { path: "women/clothing/sleep-lounge-wear/pyjama-sets",             element: <PyjamaSets />            },
  { path: "women/clothing/sleep-lounge-wear/pyjamas-lounge-pants",    element: <PyjamasLoungePants />    },
  { path: "women/clothing/accessories",    element: <Accessoriess />    },
  { path: "women/clothing/accessories/belt-buckles",    element: <BeltBuckles />    },
  { path: "women/clothing/accessories/belts",    element: <Belts />    },
  { path: "women/clothing/accessories/caps-hats",    element: <CapsHats />    },
  { path: "women/clothing/accessories/cold-weather-sets",    element: <ColdWeatherSets />    },
  { path: "women/clothing/accessories/earmuffs",    element: <Earmuffs />    },
  { path: "women/clothing/accessories/fashion-headbands",    element: <FashionHeadbands />    },
  { path: "women/clothing/accessories/gloves-arm-warmers",    element: <GlovesArmWarmers />    },
  { path: "women/clothing/accessories/handkerchiefs",    element: <Handkerchiefs />    },
  { path: "women/clothing/accessories/kidney-warmers",    element: <KidneyWarmers />    },
  { path: "women/clothing/accessories/scarves-stoles-wraps",    element: <ScarvesStolesWraps />    },
  { path: "women/clothing/accessories/shawls",    element: <Shawls />    },
  { path: "women/clothing/accessories/socks-stockings",    element: <SocksStockings />    },
  { path: "women/clothing/accessories/sport-headbands",    element: <SportHeadbands />    },
  { path: "women/clothing/accessories/suspenders",    element: <Suspenders />    },
  { path: "women/clothing/swim-beachwear",    element: <SwimBeachwear />    },
  { path: "women/clothing/swim-beachwear/beach-coverups-kaftans-sarongs",    element: <BeachCoverupsKaftansSarongs />    },
  { path: "women/clothing/swim-beachwear/monokinis",    element: <Monokinis />    },
  { path: "women/clothing/swim-beachwear/one-piece-swimsuits",    element: <OnePieceSwimsuits />    },
  { path: "women/clothing/swim-beachwear/rash-guard-sets",    element: <RashGuardSets />    },
  { path: "women/clothing/swim-beachwear/rash-guard-shirts",    element: <RashGuardShirts />    },
  { path: "women/clothing/swim-beachwear/shorts-beach",    element: <Shortsbeach />    },
  { path: "women/clothing/swim-beachwear/swim-pants",    element: <SwimPants />    },
  { path: "women/clothing/swim-beachwear/tankinis",    element: <Tankinis />    },
  { path: "women/clothing/swim-beachwear/bottoms-tankinis",    element: <BottomsTankinis />    },
  { path: "women/clothing/swim-beachwear/tops-tankinis",    element: <TopsTankinis />    },
  { path: "women/clothing/swim-beachwear/sets-tankinis",    element: <SetsTankinis />    },
  { path: "women/clothing/swim-beachwear/bikinis",    element: <Bikiniss />    },
  { path: "women/clothing/swim-beachwear/bikinis/bottoms-bikinis",    element: <BottomBikinis />    },
  { path: "women/clothing/swim-beachwear/bikinis/tops-bikinis",    element: <TopsBikinis />    },
  { path: "women/clothing/swim-beachwear/bikinis/sets-bikinis",    element: <SetsBikinis />    },
];