const languages={af:"afr",sq:"sqi",am:"amh",ar:"ara",as:"asm",az:"aze",eu:"eus",be:"bel",bn:"ben",bs:"bos",bg:"bul",my:"mya",ca:"cat",hr:"hrv",cs:"ces",da:"dan",nl:"nld",dz:"dzo",en:"eng",eo:"epo",et:"est",fi:"fin",fr:"fra",gl:"glg",ka:"kat",de:"deu",el:"ell",gu:"guj",ht:"hat",he:"heb",hi:"hin",hu:"hun",id:"ind",ga:"gle",is:"isl",it:"ita",iu:"iku",ja:"jpn",jv:"jav",kn:"kan",kk:"kaz",km:"khm",ky:"kir",ko:"kor",ku:"kur",la:"lat",lo:"lao",lt:"lit",lv:"lav",mk:"mkd",ms:"msa",ml:"mal",mt:"mlt",mr:"mar",ne:"nep",no:"nor",or:"ori",pa:"pan",fa:"fas",pl:"pol",ps:"pus",pt:"por",ro:"ron",ru:"rus",sa:"san",sr:"srp",si:"sin",sk:"slk",sl:"slv",es:"spa",sw:"swa",sv:"swe",ta:"tam",te:"tel",tg:"tgk",th:"tha",ti:"tir",bo:"bod",tl:"tgl",tr:"tur",ug:"uig",uk:"ukr",ur:"urd",uz:"uzb",vi:"vie",cy:"cym",yi:"yid"}

export const i18nToTessLang=(i18nLang)=>{
    return languages[i18nLang]??"eng"
}

export const navToi18nLang=()=>{
    return Object.keys(languages).find(lang => 
        navigator.language.includes(lang)
    )??"en";
}