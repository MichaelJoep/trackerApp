export interface CurrencyOption {
    code: string;
    name: string;
    symbol: string;
  }
  
  export const DEFAULT_CURRENCY = "NGN";
  
  export const CURRENCIES: CurrencyOption[] = [
    // ------------------------------------------------
    // AFRICA
    // ------------------------------------------------
  
    {
      code: "NGN",
      name: "Nigerian Naira",
      symbol: "₦",
    },
    {
      code: "GHS",
      name: "Ghanaian Cedi",
      symbol: "₵",
    },
    {
      code: "KES",
      name: "Kenyan Shilling",
      symbol: "KSh",
    },
    {
      code: "ZAR",
      name: "South African Rand",
      symbol: "R",
    },
    {
      code: "UGX",
      name: "Ugandan Shilling",
      symbol: "USh",
    },
    {
      code: "TZS",
      name: "Tanzanian Shilling",
      symbol: "TSh",
    },
    {
      code: "RWF",
      name: "Rwandan Franc",
      symbol: "FRw",
    },
    {
      code: "ETB",
      name: "Ethiopian Birr",
      symbol: "Br",
    },
    {
      code: "EGP",
      name: "Egyptian Pound",
      symbol: "E£",
    },
    {
      code: "MAD",
      name: "Moroccan Dirham",
      symbol: "د.م.",
    },
    {
      code: "DZD",
      name: "Algerian Dinar",
      symbol: "دج",
    },
    {
      code: "TND",
      name: "Tunisian Dinar",
      symbol: "د.ت",
    },
    {
      code: "LYD",
      name: "Libyan Dinar",
      symbol: "ل.د",
    },
    {
      code: "SDG",
      name: "Sudanese Pound",
      symbol: "ج.س.",
    },
    {
      code: "SSP",
      name: "South Sudanese Pound",
      symbol: "£",
    },
    {
      code: "BWP",
      name: "Botswana Pula",
      symbol: "P",
    },
    {
      code: "NAD",
      name: "Namibian Dollar",
      symbol: "N$",
    },
    {
      code: "ZMW",
      name: "Zambian Kwacha",
      symbol: "ZK",
    },
    {
      code: "MWK",
      name: "Malawian Kwacha",
      symbol: "MK",
    },
    {
      code: "MZN",
      name: "Mozambican Metical",
      symbol: "MT",
    },
    {
      code: "MUR",
      name: "Mauritian Rupee",
      symbol: "₨",
    },
    {
      code: "SCR",
      name: "Seychellois Rupee",
      symbol: "₨",
    },
    {
      code: "KMF",
      name: "Comorian Franc",
      symbol: "CF",
    },
    {
      code: "BIF",
      name: "Burundian Franc",
      symbol: "FBu",
    },
    {
      code: "CDF",
      name: "Congolese Franc",
      symbol: "FC",
    },
    {
      code: "DJF",
      name: "Djiboutian Franc",
      symbol: "Fdj",
    },
    {
      code: "ERN",
      name: "Eritrean Nakfa",
      symbol: "Nfk",
    },
    {
      code: "GMD",
      name: "Gambian Dalasi",
      symbol: "D",
    },
    {
      code: "GNF",
      name: "Guinean Franc",
      symbol: "FG",
    },
    {
      code: "LRD",
      name: "Liberian Dollar",
      symbol: "L$",
    },
    {
      code: "SLE",
      name: "Sierra Leonean Leone",
      symbol: "Le",
    },
    {
      code: "STN",
      name: "São Tomé and Príncipe Dobra",
      symbol: "Db",
    },
    {
      code: "CVE",
      name: "Cape Verdean Escudo",
      symbol: "$",
    },
    {
      code: "AOA",
      name: "Angolan Kwanza",
      symbol: "Kz",
    },
    {
      code: "MGA",
      name: "Malagasy Ariary",
      symbol: "Ar",
    },
    {
      code: "SZL",
      name: "Eswatini Lilangeni",
      symbol: "E",
    },
    {
      code: "LSL",
      name: "Lesotho Loti",
      symbol: "L",
    },
    {
      code: "SOS",
      name: "Somali Shilling",
      symbol: "S",
    },
    {
      code: "ZWL",
      name: "Zimbabwe Dollar",
      symbol: "Z$",
    },
  
    // ------------------------------------------------
    // NORTH AMERICA / CENTRAL AMERICA / CARIBBEAN
    // ------------------------------------------------
  
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
    },
    {
      code: "CAD",
      name: "Canadian Dollar",
      symbol: "C$",
    },
    {
      code: "MXN",
      name: "Mexican Peso",
      symbol: "$",
    },
    {
      code: "BZD",
      name: "Belize Dollar",
      symbol: "BZ$",
    },
    {
      code: "BMD",
      name: "Bermudian Dollar",
      symbol: "$",
    },
    {
      code: "BSD",
      name: "Bahamian Dollar",
      symbol: "B$",
    },
    {
      code: "BBD",
      name: "Barbadian Dollar",
      symbol: "Bds$",
    },
    {
      code: "JMD",
      name: "Jamaican Dollar",
      symbol: "J$",
    },
    {
      code: "TTD",
      name: "Trinidad and Tobago Dollar",
      symbol: "TT$",
    },
    {
      code: "XCD",
      name: "East Caribbean Dollar",
      symbol: "EC$",
    },
    {
      code: "HTG",
      name: "Haitian Gourde",
      symbol: "G",
    },
    {
      code: "DOP",
      name: "Dominican Peso",
      symbol: "RD$",
    },
    {
      code: "GTQ",
      name: "Guatemalan Quetzal",
      symbol: "Q",
    },
    {
      code: "HNL",
      name: "Honduran Lempira",
      symbol: "L",
    },
    {
      code: "NIO",
      name: "Nicaraguan Córdoba",
      symbol: "C$",
    },
    {
      code: "CRC",
      name: "Costa Rican Colón",
      symbol: "₡",
    },
    {
      code: "CUP",
      name: "Cuban Peso",
      symbol: "$",
    },
  
    // ------------------------------------------------
    // SOUTH AMERICA
    // ------------------------------------------------
  
    {
      code: "BRL",
      name: "Brazilian Real",
      symbol: "R$",
    },
    {
      code: "ARS",
      name: "Argentine Peso",
      symbol: "$",
    },
    {
      code: "CLP",
      name: "Chilean Peso",
      symbol: "$",
    },
    {
      code: "COP",
      name: "Colombian Peso",
      symbol: "$",
    },
    {
      code: "PEN",
      name: "Peruvian Sol",
      symbol: "S/",
    },
    {
      code: "UYU",
      name: "Uruguayan Peso",
      symbol: "$U",
    },
    {
      code: "PYG",
      name: "Paraguayan Guaraní",
      symbol: "₲",
    },
    {
      code: "BOB",
      name: "Bolivian Boliviano",
      symbol: "Bs.",
    },
    {
      code: "VES",
      name: "Venezuelan Bolívar",
      symbol: "Bs.S",
    },
    {
      code: "GYD",
      name: "Guyanese Dollar",
      symbol: "G$",
    },
    {
      code: "SRD",
      name: "Surinamese Dollar",
      symbol: "$",
    },
    {
      code: "PAB",
      name: "Panamanian Balboa",
      symbol: "B/.",
    },
  
    // ------------------------------------------------
    // EUROPE
    // ------------------------------------------------
  
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
    },
    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
    },
    {
      code: "CHF",
      name: "Swiss Franc",
      symbol: "CHF",
    },
    {
      code: "NOK",
      name: "Norwegian Krone",
      symbol: "kr",
    },
    {
      code: "SEK",
      name: "Swedish Krona",
      symbol: "kr",
    },
    {
      code: "DKK",
      name: "Danish Krone",
      symbol: "kr",
    },
    {
      code: "ISK",
      name: "Icelandic Króna",
      symbol: "kr",
    },
    {
      code: "PLN",
      name: "Polish Złoty",
      symbol: "zł",
    },
    {
      code: "CZK",
      name: "Czech Koruna",
      symbol: "Kč",
    },
    {
      code: "HUF",
      name: "Hungarian Forint",
      symbol: "Ft",
    },
    {
      code: "RON",
      name: "Romanian Leu",
      symbol: "lei",
    },
    {
      code: "BGN",
      name: "Bulgarian Lev",
      symbol: "лв",
    },
    {
      code: "RSD",
      name: "Serbian Dinar",
      symbol: "дин.",
    },
    {
      code: "MKD",
      name: "Macedonian Denar",
      symbol: "ден",
    },
    {
      code: "ALL",
      name: "Albanian Lek",
      symbol: "Lek",
    },
    {
      code: "BAM",
      name: "Bosnia-Herzegovina Convertible Mark",
      symbol: "KM",
    },
    {
      code: "MDL",
      name: "Moldovan Leu",
      symbol: "L",
    },
    {
      code: "UAH",
      name: "Ukrainian Hryvnia",
      symbol: "₴",
    },
    {
      code: "GEL",
      name: "Georgian Lari",
      symbol: "₾",
    },
    {
      code: "AMD",
      name: "Armenian Dram",
      symbol: "֏",
    },
    {
      code: "AZN",
      name: "Azerbaijani Manat",
      symbol: "₼",
    },
    {
      code: "TRY",
      name: "Turkish Lira",
      symbol: "₺",
    },
    {
      code: "RUB",
      name: "Russian Ruble",
      symbol: "₽",
    },
    {
      code: "BYN",
      name: "Belarusian Ruble",
      symbol: "Br",
    },
  
    // ------------------------------------------------
    // MIDDLE EAST
    // ------------------------------------------------
  
    {
      code: "AED",
      name: "United Arab Emirates Dirham",
      symbol: "د.إ",
    },
    {
      code: "SAR",
      name: "Saudi Riyal",
      symbol: "﷼",
    },
    {
      code: "QAR",
      name: "Qatari Riyal",
      symbol: "﷼",
    },
    {
      code: "KWD",
      name: "Kuwaiti Dinar",
      symbol: "د.ك",
    },
    {
      code: "BHD",
      name: "Bahraini Dinar",
      symbol: ".د.ب",
    },
    {
      code: "OMR",
      name: "Omani Rial",
      symbol: "﷼",
    },
    {
      code: "JOD",
      name: "Jordanian Dinar",
      symbol: "د.ا",
    },
    {
      code: "ILS",
      name: "Israeli New Shekel",
      symbol: "₪",
    },
    {
      code: "IQD",
      name: "Iraqi Dinar",
      symbol: "ع.د",
    },
    {
      code: "IRR",
      name: "Iranian Rial",
      symbol: "﷼",
    },
    {
      code: "LBP",
      name: "Lebanese Pound",
      symbol: "ل.ل",
    },
    {
      code: "SYP",
      name: "Syrian Pound",
      symbol: "£",
    },
    {
      code: "YER",
      name: "Yemeni Rial",
      symbol: "﷼",
    },
  
    // ------------------------------------------------
    // ASIA
    // ------------------------------------------------
  
    {
      code: "JPY",
      name: "Japanese Yen",
      symbol: "¥",
    },
    {
      code: "CNY",
      name: "Chinese Yuan",
      symbol: "¥",
    },
    {
      code: "HKD",
      name: "Hong Kong Dollar",
      symbol: "HK$",
    },
    {
      code: "TWD",
      name: "New Taiwan Dollar",
      symbol: "NT$",
    },
    {
      code: "KRW",
      name: "South Korean Won",
      symbol: "₩",
    },
    {
      code: "INR",
      name: "Indian Rupee",
      symbol: "₹",
    },
    {
      code: "PKR",
      name: "Pakistani Rupee",
      symbol: "₨",
    },
    {
      code: "BDT",
      name: "Bangladeshi Taka",
      symbol: "৳",
    },
    {
      code: "NPR",
      name: "Nepalese Rupee",
      symbol: "₨",
    },
    {
      code: "LKR",
      name: "Sri Lankan Rupee",
      symbol: "Rs",
    },
    {
      code: "AFN",
      name: "Afghan Afghani",
      symbol: "؋",
    },
    {
      code: "THB",
      name: "Thai Baht",
      symbol: "฿",
    },
    {
      code: "MYR",
      name: "Malaysian Ringgit",
      symbol: "RM",
    },
    {
      code: "SGD",
      name: "Singapore Dollar",
      symbol: "S$",
    },
    {
      code: "IDR",
      name: "Indonesian Rupiah",
      symbol: "Rp",
    },
    {
      code: "PHP",
      name: "Philippine Peso",
      symbol: "₱",
    },
    {
      code: "VND",
      name: "Vietnamese Dong",
      symbol: "₫",
    },
    {
      code: "KHR",
      name: "Cambodian Riel",
      symbol: "៛",
    },
    {
      code: "LAK",
      name: "Lao Kip",
      symbol: "₭",
    },
    {
      code: "MMK",
      name: "Myanmar Kyat",
      symbol: "K",
    },
    {
      code: "BND",
      name: "Brunei Dollar",
      symbol: "B$",
    },
    {
      code: "MVR",
      name: "Maldivian Rufiyaa",
      symbol: "Rf",
    },
    {
      code: "MNT",
      name: "Mongolian Tögrög",
      symbol: "₮",
    },
    {
      code: "KZT",
      name: "Kazakhstani Tenge",
      symbol: "₸",
    },
    {
      code: "UZS",
      name: "Uzbekistani Som",
      symbol: "лв",
    },
    {
      code: "KGS",
      name: "Kyrgyzstani Som",
      symbol: "лв",
    },
    {
      code: "TJS",
      name: "Tajikistani Somoni",
      symbol: "SM",
    },
    {
      code: "TMT",
      name: "Turkmenistani Manat",
      symbol: "T",
    },
  
    // ------------------------------------------------
    // OCEANIA
    // ------------------------------------------------
  
    {
      code: "AUD",
      name: "Australian Dollar",
      symbol: "A$",
    },
    {
      code: "NZD",
      name: "New Zealand Dollar",
      symbol: "NZ$",
    },
    {
      code: "FJD",
      name: "Fijian Dollar",
      symbol: "FJ$",
    },
    {
      code: "PGK",
      name: "Papua New Guinean Kina",
      symbol: "K",
    },
    {
      code: "WST",
      name: "Samoan Tālā",
      symbol: "WS$",
    },
    {
      code: "TOP",
      name: "Tongan Paʻanga",
      symbol: "T$",
    },
    {
      code: "VUV",
      name: "Vanuatu Vatu",
      symbol: "VT",
    },
    {
      code: "SBD",
      name: "Solomon Islands Dollar",
      symbol: "SI$",
    },
  
    // ------------------------------------------------
    // SPECIAL / MULTI-COUNTRY CURRENCIES
    // ------------------------------------------------
  
    {
      code: "XAF",
      name: "Central African CFA Franc",
      symbol: "FCFA",
    },
    {
      code: "XOF",
      name: "West African CFA Franc",
      symbol: "CFA",
    },
    {
      code: "XPF",
      name: "CFP Franc",
      symbol: "₣",
    },
  ];