/**
 * Article language type - Valid article language codes (ISO 639-1)
 */
export type ArticleLanguage =
  | 'en' // English
  | 'fr' // French
  | 'de' // German
  | 'es' // Spanish
  | 'it' // Italian
  | 'ru' // Russian
  | 'ja' // Japanese
  | 'zh' // Chinese
  | 'ko' // Korean
  | 'pt' // Portuguese
  | 'ar' // Arabic
  | 'tr' // Turkish
  | 'pl' // Polish
  | 'nl' // Dutch
  | 'sv' // Swedish
  | 'fi' // Finnish
  | 'no' // Norwegian
  | 'el' // Greek
  | 'cs' // Czech
  | 'ro' // Romanian
  | 'uk' // Ukrainian
  | 'bg' // Bulgarian
  | 'vi' // Vietnamese
  | 'th' // Thai
  | 'id' // Indonesian
  | 'fa' // Persian
  | 'he' // Hebrew
  | 'ms' // Malay
  | 'ca' // Catalan
  | 'et' // Estonian
  | 'lt' // Lithuanian
  | 'lv' // Latvian
  | 'sk' // Slovak
  | 'sl' // Slovenian
  | 'hr' // Croatian
  | 'sr' // Serbian
  | 'bs' // Bosnian
  | 'mk' // Macedonian
  | 'hi' // Hindi
  | 'bn' // Bengali
  | 'ur' // Urdu
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'pa' // Punjabi
  | 'da' // Danish
  | 'hu' // Hungarian
  | 'sq' // Albanian
  | 'mt' // Maltese
  | 'is' // Icelandic
  | 'ka' // Georgian
  | 'hy' // Armenian
  | 'az' // Azerbaijani
  | 'kk' // Kazakh
  | 'uz' // Uzbek
  | 'mn' // Mongolian
  | 'ne' // Nepali
  | 'si' // Sinhala
  | 'my' // Burmese
  | 'km' // Khmer
  | 'lo' // Lao
  | 'sw' // Swahili
  | 'am' // Amharic
  | 'ha' // Hausa
  | 'yo' // Yoruba
  | 'ig' // Igbo
  | 'zu' // Zulu
  | 'af' // Afrikaans
  | 'fil' // Filipino
  | 'eu' // Basque
  | 'gl' // Galician
  | 'cy' // Welsh
  | 'ga' // Irish
  | 'gd' // Scottish Gaelic
  | 'be'; // Belarusian

/**
 * Article category type - Valid article categories
 */
export type ArticleCategory =
  | 'news'
  | 'guide'
  | 'stats'
  | 'economy'
  | 'politics'
  | 'military'
  | 'begging'
  | 'entertainment'
  | 'election'
  | 'other'
  | 'official';

/**
 * Ranking entry interface - Represents the ranking in a specific category
 */
export interface RankingEntryDTO {
    value: number;
    rank: number;
    tier: string;
}

/**
 * Country code type - Valid country codes (ISO 3166-1 alpha-2) 
 * Need to test against actual outputs to confirm
 */
export type CountryCode =
    | "af" // Afghanistan
    | "al" // Albania
 | "dz" // Algeria
 |"ad" // Andorra
 |"ao" // Angola|
 |"ag" // Antigua and Barbuda 
 |"ar" // Argentina 
 |"am" // Armenia 
 |"au" // Australia 
 |"at" // Austria 
 |"az" // Azerbaijan
 |"bs" // Bahamas 
 |"bh" // Bahrain 
 |"bd" // Bangladesh 
 |"bb" // Barbados 
 |"by" // Belarus 
 |"be" // Belgium 
 |"bz" // Belize 
 |"bj" // Benin 
 |"bt" // Bhutan 
 |"bo" // Bolivia, Plurinational State of 
 |"ba" // Bosnia and Herzegovina 
 |"bw" // Botswana 
 |"br" // Brazil 
 |"bn" // Brunei Darussalam 
 |"bg" // Bulgaria 
 |"bf" // Burkina Faso 
 |"bi" // Burundi 
 |"cv" // Cabo Verde 
 |"kh" // Cambodia 
 |"cm" // Cameroon 
 |"ca" // Canada 
 |"cf" // Central African Republic 
 |"td" // Chad 
 |"cl" // Chile 
 |"cn" // China 
 |"co" // Colombia 
 |"km" // Comoros 
 |"cg" // Congo 
 |"cd" // Congo, Democratic Republic of the 
 |"cr" // Costa Rica 
 |"ci" // Côte d'Ivoire 
 |"hr" // Croatia 
 |"cu" // Cuba 
 |"cy" // Cyprus 
 |"cz" // Czechia 
 |"dk" // Denmark 
 |"dj" // Djibouti 
 |"dm" // Dominica 
 |"do" // Dominican Republic 
 |"ec" // Ecuador 
 |"eg" // Egypt 
 |"sv" // El Salvador 
 |"gq" // Equatorial Guinea 
 |"er" // Eritrea 
 |"ee" // Estonia 
 |"sz" // Eswatini 
 |"et" // Ethiopia 
 |"fj" // Fiji 
 |"fi" // Finland 
 |"fr" // France 
 |"ga" // Gabon 
 |"gm" // Gambia 
 |"ge" // Georgia 
 |"de" // Germany 
 |"gh" // Ghana 
 |"gr" // Greece 
 |"gd" // Grenada 
 |"gt" // Guatemala 
 |"gn" // Guinea 
 |"gw" // Guinea-Bissau 
 |"gy" // Guyana 
 |"ht" // Haiti 
 |"hn" // Honduras 
 |"hu" // Hungary 
 |"is" // Iceland 
 |"in" // India 
 |"id" // Indonesia 
 |"ir" // Iran, Islamic Republic of 
 |"iq" // Iraq 
 |"ie" // Ireland 
 |"il" // Israel 
 |"it" // Italy 
 |"jm" // Jamaica 
 |"jp" // Japan 
 |"jo" // Jordan 
 |"kz" // Kazakhstan 
 |"ke" // Kenya 
 |"ki" // Kiribati 
 |"kp" // Korea, Democratic People's Republic of 
 |"kr" // Korea, Republic of 
 |"kw" // Kuwait 
 |"kg" // Kyrgyzstan 
 |"la" // Lao People's Democratic Republic 
 |"lv" // Latvia 
 |"lb" // Lebanon 
 |"ls" // Lesotho 
 |"lr" // Liberia 
 |"ly" // Libya 
 |"li" // Liechtenstein 
 |"lt" // Lithuania 
 |"lu" // Luxembourg 
 |"mg" // Madagascar 
 |"mw" // Malawi 
 |"my" // Malaysia 
 |"mv" // Maldives 
 |"ml" // Mali 
 |"mt" // Malta 
 |"mh" // Marshall Islands 
 |"mr" // Mauritania 
 |"mu" // Mauritius
 |"mx" // Mexico 
 |"fm" // Micronesia, Federated States of 
 |"md" // Moldova, Republic of 
 |"mc" // Monaco 
 |"mn" // Mongolia 
 |"me" // Montenegro 
 |"ma" // Morocco 
 |"mz" // Mozambique 
 |"mm" // Myanmar 
 |"na" // Namibia 
 |"nr" // Nauru 
 |"np" // Nepal 
 |"nl" // Netherlands 
 |"nz" // New Zealand 
 |"ni" // Nicaragua 
 |"ne" // Niger 
 |"ng" // Nigeria 
 |"mk" // North Macedonia 
 |"no" // Norway 
 |"om" // Oman 
 |"pk" // Pakistan 
 |"pw" // Palau 
 |"pa" // Panama 
 |"pg" // Papua New Guinea 
 |"py" // Paraguay 
 |"pe" // Peru 
 |"ph" // Philippines 
 |"pl" // Poland 
 |"pt" // Portugal 
 |"qa" // Qatar 
 |"ro" // Romania 
 |"ru" // Russian Federation 
 |"rw" // Rwanda 
 |"kn" // Saint Kitts and Nevis 
 |"lc" // Saint Lucia 
 |"vc" // Saint Vincent and the Grenadines 
 |"ws" // Samoa 
 |"sm" // San Marino 
 |"st" // Sao Tome and Principe 
 |"sa" // Saudi Arabia 
 |"sn" // Senegal 
 |"rs" // Serbia 
 |"sc" // Seychelles 
 |"sl" // Sierra Leone 
 |"sg" // Singapore 
 |"sk" // Slovakia 
 |"si" // Slovenia 
 |"sb" // Solomon Islands 
 |"so" // Somalia 
 |"za" // South Africa 
 |"ss" // South Sudan 
 |"es" // Spain 
 |"lk" // Sri Lanka 
 |"sd" // Sudan 
 |"sr" // Suriname 
 |"se" // Sweden 
 |"ch" // Switzerland 
 |"sy" // Syrian Arab Republic 
 |"tj" // Tajikistan 
 |"tz" // Tanzania, United Republic of 
 |"th" // Thailand 
 |"tl" // Timor-Leste 
 |"tg" // Togo 
 |"to" // Tonga 
 |"tt" // Trinidad and Tobago 
 |"tn" // Tunisia 
 |"tr" // Türkiye 
 |"tm" // Turkmenistan 
 |"tv" // Tuvalu 
 |"ug" // Uganda 
 |"ua" // Ukraine 
 |"ae" // United Arab Emirates 
 |"gb" // United Kingdom of Great Britain and Northern Ireland 
 |"us" // United States of America 
 |"uy" // Uruguay 
 |"uz" // Uzbekistan
 |"vu" // Vanuatu 
 |"ve" // Venezuela, Bolivarian Republic of 
 |"vn" // Viet Nam 
 |"ye" // Yemen 
 |"zm" // Zambia 
 |"zw" ;// Zimbabwe 


/**
 * Country name type - These might differ from in-game names
 * Need to test against actual outputs to confirm
 */
export type CountryName =
  | "Afghanistan"
  | "Albania"
  | "Algeria"
  | "Andorra"
  | "Angola"
  | "Antigua and Barbuda"
  | "Argentina"
  | "Armenia"
  | "Australia"
  | "Austria"
  | "Azerbaijan"
  | "Bahamas"
  | "Bahrain"
  | "Bangladesh"
  | "Barbados"
  | "Belarus"
  | "Belgium"
  | "Belize"
  | "Benin"
  | "Bhutan"
  | "Bolivia, Plurinational State of"
  | "Bosnia and Herzegovina"
  | "Botswana"
  | "Brazil"
  | "Brunei Darussalam"
  | "Bulgaria"
  | "Burkina Faso"
  | "Burundi"
  | "Cabo Verde"
  | "Cambodia"
  | "Cameroon"
  | "Canada"
  | "Central African Republic"
  | "Chad"
  | "Chile"
  | "China"
  | "Colombia"
  | "Comoros"
  | "Congo"
  | "Congo, Democratic Republic of the"
  | "Costa Rica"
  | "Côte d'Ivoire"
  | "Croatia"
  | "Cuba"
  | "Cyprus"
  | "Czechia"
  | "Denmark"
  | "Djibouti"
  | "Dominica"
  | "Dominican Republic"
  | "Ecuador"
  | "Egypt"
  | "El Salvador"
  | "Equatorial Guinea"
  | "Eritrea"
  | "Estonia"
  | "Eswatini"
  | "Ethiopia"
  | "Fiji"
  | "Finland"
  | "France"
  | "Gabon"
  | "Gambia"
  | "Georgia"
  | "Germany"
  | "Ghana"
  | "Greece"
  | "Grenada"
  | "Guatemala"
  | "Guinea"
  | "Guinea-Bissau"
  | "Guyana"
  | "Haiti"
  | "Honduras"
  | "Hungary"
  | "Iceland"
  | "India"
  | "Indonesia"
  | "Iran, Islamic Republic of"
  | "Iraq"
  | "Ireland"
  | "Israel"
  | "Italy"
  | "Jamaica"
  | "Japan"
  | "Jordan"
  | "Kazakhstan"
  | "Kenya"
  | "Kiribati"
  | "Korea, Democratic People's Republic of"
  | "Korea, Republic of"
  | "Kuwait"
  | "Kyrgyzstan"
  | "Lao People's Democratic Republic"
  | "Latvia"
  | "Lebanon"
  | "Lesotho"
  | "Liberia"
  | "Libya"
  | "Liechtenstein"
  | "Lithuania"
  | "Luxembourg"
  | "Madagascar"
  | "Malawi"
  | "Malaysia"
  | "Maldives"
  | "Mali"
  | "Malta"
  | "Marshall Islands"
  | "Mauritania"
  | "Mauritius"
  | "Mexico"
  | "Micronesia, Federated States of"
  | "Moldova, Republic of"
  | "Monaco"
  | "Mongolia"
  | "Montenegro"
  | "Morocco"
  | "Mozambique"
  | "Myanmar"
  | "Namibia"
  | "Nauru"
  | "Nepal"
  | "Netherlands"
  | "New Zealand"
  | "Nicaragua"
  | "Niger"
  | "Nigeria"
  | "North Macedonia"
  | "Norway"
  | "Oman"
  | "Pakistan"
  | "Palau"
  | "Panama"
  | "Papua New Guinea"
  | "Paraguay"
  | "Peru"
  | "Philippines"
  | "Poland"
  | "Portugal"
  | "Qatar"
  | "Romania"
  | "Russian Federation"
  | "Rwanda"
  | "Saint Kitts and Nevis"
  | "Saint Lucia"
  | "Saint Vincent and the Grenadines"
  | "Samoa"
  | "San Marino"
  | "Sao Tome and Principe"
  | "Saudi Arabia"
  | "Senegal"
  | "Serbia"
  | "Seychelles"
  | "Sierra Leone"
  | "Singapore"
  | "Slovakia"
  | "Slovenia"
  | "Solomon Islands"
  | "Somalia"
  | "South Africa"
  | "South Sudan"
  | "Spain"
  | "Sri Lanka"
  | "Sudan"
  | "Suriname"
  | "Sweden"
  | "Switzerland"
  | "Syrian Arab Republic"
  | "Tajikistan"
  | "Tanzania, United Republic of"
  | "Thailand"
  | "Timor-Leste"
  | "Togo"
  | "Tonga"
  | "Trinidad and Tobago"
  | "Tunisia"
  | "Türkiye"
  | "Turkmenistan"
  | "Tuvalu"
  | "Uganda"
  | "Ukraine"
  | "United Arab Emirates"
  | "United Kingdom of Great Britain and Northern Ireland"
  | "United States of America"
  | "Uruguay"
  | "Uzbekistan"
  | "Vanuatu"
  | "Venezuela, Bolivarian Republic of"
  | "Viet Nam"
  | "Yemen"
  | "Zambia"
  | "Zimbabwe";
    
// Not sure if the below needs to be in this file
/**
 * Strategic Resource List DTO - Represents lists of strategic resources
 */


export interface StrategicResourceListDTO {
    uranium: string[];
    lithium: string[];
    coal: string[];
    diamonds: string[];
    gold: string[];
    rareEarths: string[];
}
/**
 * Strategic Resource Bonuses DTO - Represents bonuses from strategic resources
 */
export interface StrategicResourceBonusesDTO {
    productionPercent: number;
    developmentPercent: number;
}
/**
 * Strategic Resources DTO - Represents strategic resources and their bonuses
 */
export interface StrategicResourcesDTO {
    resources: StrategicResourceListDTO;
    bonuses: StrategicResourceBonusesDTO;
}
