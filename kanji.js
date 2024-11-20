const STATES = {
    "STARTED": 0,
    "GUESSING": 1,
    "CHECKING": 2,
    "ENDED": 3
}

const shuffle_fy = (array) => {
    // See this fascinating visualisation: https://bost.ocks.org/mike/shuffle/compare.html
    let arrayCopy = [...array];
    let ci = arrayCopy.length;
  
    while (ci != 0) {
      let ri = Math.floor(Math.random() * ci);
      ci--;
  
      [arrayCopy[ci], arrayCopy[ri]] = [arrayCopy[ri], arrayCopy[ci]];
    }

    return arrayCopy;
}

document.addEventListener("DOMContentLoaded", () => {
    const showButtonContainer = document.getElementById("show-button-container");
    const showButton = document.getElementById("show-button");
    
    const voteButtonsContainer = document.getElementById("vote-buttons-container");
    const rememberButton = document.getElementById("remember-button");
    const forgotButton = document.getElementById("forgot-button");
    const copyButton = document.getElementById("copy-results");
    
    const wordBox = document.getElementById("word");
    const kanjiBox = document.getElementById("kanji");
    const progressBox = document.getElementById("progress");

    const minKanji = document.getElementById("min");
    const maxKanji = document.getElementById("max");
    const numberToTest = document.getElementById("number-to-test");
    const darkMode = document.getElementById("dark-mode");
    
    const setUpInputs = document.getElementById("set-up");

    const forgottenList = document.getElementById("forgotten-list");
    const statsBox = document.getElementById("stats");
    const resultsBox = document.getElementById("results");
    resultsBox.style.display = "none";

    let allKanjiToTest = [];
    let forgotten = [];

    let currentIndex = 0;
    let started = false;


    const pageSetUp = () => {
        storageMin = localStorage.getItem("minKanji");
        storageMax = localStorage.getItem("maxKanji");
        storageDarkModeString = localStorage.getItem("darkMode");
        let storageDarkMode;

        if (storageDarkModeString === null) {
            storageDarkMode = null;
        } else {
            storageDarkMode = storageDarkModeString === "true";
        }

        console.log("storage variables", storageMin, storageMax, storageDarkMode);

        if (storageMin !== null) {
            minKanji.value = storageMin
        }

        if (storageMax !== null) {
            maxKanji.value = storageMax
        }

        if (storageDarkMode !== null) {
            darkMode.checked = storageDarkMode;
            updateDarkMode(storageDarkMode);
        } else {
            localStorage.setItem("darkMode", false);
        }
    }

    const updateDarkMode = (isDarkModeOn) => {
        const backgroundColour = isDarkModeOn === true ? "var(--black)" : "var(--white)";
        const textColour = isDarkModeOn === true ? "var(--white)" : "var(--black)";
        document.documentElement.style.setProperty('--background', backgroundColour);
        document.documentElement.style.setProperty('--text', textColour);
    }

    pageSetUp();

    const setKanjiLimitsStorage = () => {
        localStorage.setItem("minKanji", minKanji.value)
        localStorage.setItem("maxKanji", maxKanji.value)
    }

    const onStartSetUp = () => {
        const min = Number(minKanji.value)
        const max = Number(maxKanji.value)
        const count = Number(numberToTest.value)
        const number = count === 0 ? max - min + 1 : count;

        forgotten = [];
        forgottenList.innerHTML = "";
        currentIndex = 0;
        started = false;

        const filteredKanji = allKanji.filter(x => x.id <= max && x.id >= min);
        const shuffledKanji = shuffle_fy(filteredKanji);
        allKanjiToTest = shuffledKanji.slice(0, number);

        newWord(allKanjiToTest[currentIndex]);

        setUpInputs.style.display = "none";
        resultsBox.style.display = "none";

        setKanjiLimitsStorage();
    }
    
    const newWord = (kanji) => {
        wordBox.textContent = kanji.word;
        kanjiBox.textContent = kanji.kanji;
        kanjiBox.style.color = "var(--background)";
        showingKanji = false;
        progressBox.textContent = `${currentIndex + 1}/${allKanjiToTest.length}`
        showMainButton();
    }

    function showVoteButtons() {
        voteButtonsContainer.style.display = "flex";
        showButtonContainer.style.display = "none";
    }

    function showMainButton() {
        voteButtonsContainer.style.display = "none";
        showButtonContainer.style.display = "flex";
    }

    showButton.onclick = () => {
        if (!started) {
            onStartSetUp();
            started = true;
            showButton.textContent = "SHOW"
            return
        }

        showVoteButtons();
        kanjiBox.style.color = "var(--text)";
    };

    const handleNewKanji = () => {
        currentIndex += 1;
        if (currentIndex >= allKanjiToTest.length) {
            showResults();
            setUpInputs.style.display = "flex";
            kanjiBox.style.color = "var(--background)";;
            wordBox.textContent = "";
            progressBox.textContent = "";
            started = false;

            showMainButton();
            return
        }
        newWord(allKanjiToTest[currentIndex]);
    }
    
    rememberButton.onclick = () => {
        handleNewKanji();
    };
    
    forgotButton.onclick = () => {
        forgotten.push(allKanjiToTest[currentIndex])

        handleNewKanji();
    }

    
    darkMode.onchange = (event) => {
        const isDarkModeOn = event.currentTarget.checked;
        localStorage.setItem("darkMode", isDarkModeOn);
        updateDarkMode(isDarkModeOn);
    }

    const showResults = () => {
        const total = allKanjiToTest.length;
        const missedCount = forgotten.length;
        const correctCount = total - missedCount;
        statsBox.textContent = `${correctCount}/${total} (${Math.round(correctCount/total * 100)}%)`

        for (kanji of forgotten.sort((a, b) => Number(a.id) - Number(b.id))) {
            var newItem = document.createElement("div");
            newItem.textContent = `${kanji.kanji}  ${kanji.word}`;
            forgottenList.appendChild(newItem);
        }

        resultsBox.style.display = "block";
        showButton.textContent = "START"
    }

    copyButton.onclick = () => {
        navigator.clipboard.writeText(forgotten.map(x => `${x.kanji} ${x.word}`).join('\n'))
        alert("Copied to clipboard")
    }

    showMainButton();
})

const allKanji = [
    {
        "id": "1",
        "kanji": "一",
        "word": "one"
    },
    {
        "id": "2",
        "kanji": "二",
        "word": "two"
    },
    {
        "id": "3",
        "kanji": "三",
        "word": "three"
    },
    {
        "id": "4",
        "kanji": "四",
        "word": "four"
    },
    {
        "id": "5",
        "kanji": "五",
        "word": "five"
    },
    {
        "id": "6",
        "kanji": "六",
        "word": "six"
    },
    {
        "id": "7",
        "kanji": "七",
        "word": "seven"
    },
    {
        "id": "8",
        "kanji": "八",
        "word": "eight"
    },
    {
        "id": "9",
        "kanji": "九",
        "word": "nine"
    },
    {
        "id": "10",
        "kanji": "十",
        "word": "ten"
    },
    {
        "id": "11",
        "kanji": "口",
        "word": "mouth"
    },
    {
        "id": "12",
        "kanji": "日",
        "word": "day"
    },
    {
        "id": "13",
        "kanji": "月",
        "word": "month"
    },
    {
        "id": "14",
        "kanji": "田",
        "word": "rice field"
    },
    {
        "id": "15",
        "kanji": "目",
        "word": "eye"
    },
    {
        "id": "16",
        "kanji": "古",
        "word": "old"
    },
    {
        "id": "17",
        "kanji": "吾",
        "word": "I"
    },
    {
        "id": "18",
        "kanji": "冒",
        "word": "risk"
    },
    {
        "id": "19",
        "kanji": "朋",
        "word": "companion"
    },
    {
        "id": "20",
        "kanji": "明",
        "word": "bright"
    },
    {
        "id": "21",
        "kanji": "唱",
        "word": "chant"
    },
    {
        "id": "22",
        "kanji": "晶",
        "word": "sparkle"
    },
    {
        "id": "23",
        "kanji": "品",
        "word": "goods"
    },
    {
        "id": "24",
        "kanji": "呂",
        "word": "spine"
    },
    {
        "id": "25",
        "kanji": "昌",
        "word": "prosperous"
    },
    {
        "id": "26",
        "kanji": "早",
        "word": "early"
    },
    {
        "id": "27",
        "kanji": "旭",
        "word": "rising sun"
    },
    {
        "id": "28",
        "kanji": "世",
        "word": "generation"
    },
    {
        "id": "29",
        "kanji": "胃",
        "word": "stomach"
    },
    {
        "id": "30",
        "kanji": "旦",
        "word": "nightbreak"
    },
    {
        "id": "31",
        "kanji": "胆",
        "word": "gall bladder"
    },
    {
        "id": "32",
        "kanji": "亘",
        "word": "span"
    },
    {
        "id": "33",
        "kanji": "凹",
        "word": "concave"
    },
    {
        "id": "34",
        "kanji": "凸",
        "word": "convex"
    },
    {
        "id": "35",
        "kanji": "旧",
        "word": "olden times"
    },
    {
        "id": "36",
        "kanji": "自",
        "word": "oneself"
    },
    {
        "id": "37",
        "kanji": "白",
        "word": "white"
    },
    {
        "id": "38",
        "kanji": "百",
        "word": "hundred"
    },
    {
        "id": "39",
        "kanji": "中",
        "word": "in"
    },
    {
        "id": "40",
        "kanji": "千",
        "word": "thousand"
    },
    {
        "id": "41",
        "kanji": "舌",
        "word": "tongue"
    },
    {
        "id": "42",
        "kanji": "升",
        "word": "measuring box"
    },
    {
        "id": "43",
        "kanji": "昇",
        "word": "rise up"
    },
    {
        "id": "44",
        "kanji": "丸",
        "word": "round"
    },
    {
        "id": "45",
        "kanji": "寸",
        "word": "measurement"
    },
    {
        "id": "46",
        "kanji": "肘",
        "word": "elbow"
    },
    {
        "id": "47",
        "kanji": "専",
        "word": "specialty"
    },
    {
        "id": "48",
        "kanji": "博",
        "word": "Dr."
    },
    {
        "id": "49",
        "kanji": "占",
        "word": "fortune-telling"
    },
    {
        "id": "50",
        "kanji": "上",
        "word": "above"
    },
    {
        "id": "51",
        "kanji": "下",
        "word": "below"
    },
    {
        "id": "52",
        "kanji": "卓",
        "word": "eminent"
    },
    {
        "id": "53",
        "kanji": "朝",
        "word": "morning"
    },
    {
        "id": "54",
        "kanji": "嘲",
        "word": "derision"
    },
    {
        "id": "55",
        "kanji": "只",
        "word": "only"
    },
    {
        "id": "56",
        "kanji": "貝",
        "word": "shellfish"
    },
    {
        "id": "57",
        "kanji": "唄",
        "word": "pop song"
    },
    {
        "id": "58",
        "kanji": "貞",
        "word": "upright"
    },
    {
        "id": "59",
        "kanji": "員",
        "word": "employee"
    },
    {
        "id": "60",
        "kanji": "貼",
        "word": "post a bill"
    },
    {
        "id": "61",
        "kanji": "見",
        "word": "see"
    },
    {
        "id": "62",
        "kanji": "児",
        "word": "newborn babe"
    },
    {
        "id": "63",
        "kanji": "元",
        "word": "beginning"
    },
    {
        "id": "64",
        "kanji": "頁",
        "word": "page"
    },
    {
        "id": "65",
        "kanji": "頑",
        "word": "stubborn"
    },
    {
        "id": "66",
        "kanji": "凡",
        "word": "mediocre"
    },
    {
        "id": "67",
        "kanji": "負",
        "word": "defeat"
    },
    {
        "id": "68",
        "kanji": "万",
        "word": "ten thousand"
    },
    {
        "id": "69",
        "kanji": "句",
        "word": "phrase"
    },
    {
        "id": "70",
        "kanji": "肌",
        "word": "texture"
    },
    {
        "id": "71",
        "kanji": "旬",
        "word": "decameron"
    },
    {
        "id": "72",
        "kanji": "勺",
        "word": "ladle"
    },
    {
        "id": "73",
        "kanji": "的",
        "word": "bull's eye"
    },
    {
        "id": "74",
        "kanji": "首",
        "word": "neck"
    },
    {
        "id": "75",
        "kanji": "乙",
        "word": "fish guts"
    },
    {
        "id": "76",
        "kanji": "乱",
        "word": "riot"
    },
    {
        "id": "77",
        "kanji": "直",
        "word": "straightaway"
    },
    {
        "id": "78",
        "kanji": "具",
        "word": "tool"
    },
    {
        "id": "79",
        "kanji": "真",
        "word": "true"
    },
    {
        "id": "80",
        "kanji": "工",
        "word": "craft"
    },
    {
        "id": "81",
        "kanji": "左",
        "word": "left"
    },
    {
        "id": "82",
        "kanji": "右",
        "word": "right"
    },
    {
        "id": "83",
        "kanji": "有",
        "word": "possess"
    },
    {
        "id": "84",
        "kanji": "賄",
        "word": "bribe"
    },
    {
        "id": "85",
        "kanji": "貢",
        "word": "tribute"
    },
    {
        "id": "86",
        "kanji": "項",
        "word": "paragraph"
    },
    {
        "id": "87",
        "kanji": "刀",
        "word": "sword"
    },
    {
        "id": "88",
        "kanji": "刃",
        "word": "blade"
    },
    {
        "id": "89",
        "kanji": "切",
        "word": "cut"
    },
    {
        "id": "90",
        "kanji": "召",
        "word": "seduce"
    },
    {
        "id": "91",
        "kanji": "昭",
        "word": "shining"
    },
    {
        "id": "92",
        "kanji": "則",
        "word": "rule"
    },
    {
        "id": "93",
        "kanji": "副",
        "word": "vice-"
    },
    {
        "id": "94",
        "kanji": "別",
        "word": "separate"
    },
    {
        "id": "95",
        "kanji": "丁",
        "word": "street"
    },
    {
        "id": "96",
        "kanji": "町",
        "word": "village"
    },
    {
        "id": "97",
        "kanji": "可",
        "word": "can"
    },
    {
        "id": "98",
        "kanji": "頂",
        "word": "place on the head"
    },
    {
        "id": "99",
        "kanji": "子",
        "word": "child"
    },
    {
        "id": "100",
        "kanji": "孔",
        "word": "cavity"
    },
    {
        "id": "101",
        "kanji": "了",
        "word": "complete"
    },
    {
        "id": "102",
        "kanji": "女",
        "word": "woman"
    },
    {
        "id": "103",
        "kanji": "好",
        "word": "fond"
    },
    {
        "id": "104",
        "kanji": "如",
        "word": "likeness"
    },
    {
        "id": "105",
        "kanji": "母",
        "word": "mama"
    },
    {
        "id": "106",
        "kanji": "貫",
        "word": "pierce"
    },
    {
        "id": "107",
        "kanji": "兄",
        "word": "elder brother"
    },
    {
        "id": "108",
        "kanji": "呪",
        "word": "curse"
    },
    {
        "id": "109",
        "kanji": "克",
        "word": "overcome"
    },
    {
        "id": "110",
        "kanji": "小",
        "word": "little"
    },
    {
        "id": "111",
        "kanji": "少",
        "word": "few"
    },
    {
        "id": "112",
        "kanji": "大",
        "word": "large"
    },
    {
        "id": "113",
        "kanji": "多",
        "word": "many"
    },
    {
        "id": "114",
        "kanji": "夕",
        "word": "evening"
    },
    {
        "id": "115",
        "kanji": "汐",
        "word": "eventide"
    },
    {
        "id": "116",
        "kanji": "外",
        "word": "outside"
    },
    {
        "id": "117",
        "kanji": "名",
        "word": "name"
    },
    {
        "id": "118",
        "kanji": "石",
        "word": "stone"
    },
    {
        "id": "119",
        "kanji": "肖",
        "word": "resemblance"
    },
    {
        "id": "120",
        "kanji": "硝",
        "word": "nitrate"
    },
    {
        "id": "121",
        "kanji": "砕",
        "word": "smash"
    },
    {
        "id": "122",
        "kanji": "砂",
        "word": "sand"
    },
    {
        "id": "123",
        "kanji": "妬",
        "word": "jealous"
    },
    {
        "id": "124",
        "kanji": "削",
        "word": "plane"
    },
    {
        "id": "125",
        "kanji": "光",
        "word": "ray"
    },
    {
        "id": "126",
        "kanji": "太",
        "word": "plump"
    },
    {
        "id": "127",
        "kanji": "器",
        "word": "utensil"
    },
    {
        "id": "128",
        "kanji": "臭",
        "word": "stinking"
    },
    {
        "id": "129",
        "kanji": "嗅",
        "word": "sniff"
    },
    {
        "id": "130",
        "kanji": "妙",
        "word": "exquisite"
    },
    {
        "id": "131",
        "kanji": "省",
        "word": "focus"
    },
    {
        "id": "132",
        "kanji": "厚",
        "word": "thick"
    },
    {
        "id": "133",
        "kanji": "奇",
        "word": "strange"
    },
    {
        "id": "134",
        "kanji": "川",
        "word": "stream"
    },
    {
        "id": "135",
        "kanji": "州",
        "word": "state"
    },
    {
        "id": "136",
        "kanji": "順",
        "word": "obey"
    },
    {
        "id": "137",
        "kanji": "水",
        "word": "water"
    },
    {
        "id": "138",
        "kanji": "氷",
        "word": "icicle"
    },
    {
        "id": "139",
        "kanji": "永",
        "word": "eternity"
    },
    {
        "id": "140",
        "kanji": "泉",
        "word": "spring"
    },
    {
        "id": "141",
        "kanji": "腺",
        "word": "gland"
    },
    {
        "id": "142",
        "kanji": "原",
        "word": "meadow"
    },
    {
        "id": "143",
        "kanji": "願",
        "word": "petition"
    },
    {
        "id": "144",
        "kanji": "泳",
        "word": "swim"
    },
    {
        "id": "145",
        "kanji": "沼",
        "word": "marsh"
    },
    {
        "id": "146",
        "kanji": "沖",
        "word": "open sea"
    },
    {
        "id": "147",
        "kanji": "汎",
        "word": "pan-"
    },
    {
        "id": "148",
        "kanji": "江",
        "word": "creek"
    },
    {
        "id": "149",
        "kanji": "汰",
        "word": "cleanse"
    },
    {
        "id": "150",
        "kanji": "汁",
        "word": "soup"
    },
    {
        "id": "151",
        "kanji": "沙",
        "word": "grains of sand"
    },
    {
        "id": "152",
        "kanji": "潮",
        "word": "tide"
    },
    {
        "id": "153",
        "kanji": "源",
        "word": "source"
    },
    {
        "id": "154",
        "kanji": "活",
        "word": "lively"
    },
    {
        "id": "155",
        "kanji": "消",
        "word": "extinguish"
    },
    {
        "id": "156",
        "kanji": "況",
        "word": "but of course"
    },
    {
        "id": "157",
        "kanji": "河",
        "word": "river"
    },
    {
        "id": "158",
        "kanji": "泊",
        "word": "overnight"
    },
    {
        "id": "159",
        "kanji": "湖",
        "word": "lake"
    },
    {
        "id": "160",
        "kanji": "測",
        "word": "fathom"
    },
    {
        "id": "161",
        "kanji": "土",
        "word": "soil"
    },
    {
        "id": "162",
        "kanji": "吐",
        "word": "spit"
    },
    {
        "id": "163",
        "kanji": "圧",
        "word": "pressure"
    },
    {
        "id": "164",
        "kanji": "埼",
        "word": "cape"
    },
    {
        "id": "165",
        "kanji": "垣",
        "word": "hedge"
    },
    {
        "id": "166",
        "kanji": "填",
        "word": "inlay"
    },
    {
        "id": "167",
        "kanji": "圭",
        "word": "squared jewel"
    },
    {
        "id": "168",
        "kanji": "封",
        "word": "seal"
    },
    {
        "id": "169",
        "kanji": "涯",
        "word": "horizon"
    },
    {
        "id": "170",
        "kanji": "寺",
        "word": "Buddhist temple"
    },
    {
        "id": "171",
        "kanji": "時",
        "word": "time"
    },
    {
        "id": "172",
        "kanji": "均",
        "word": "level"
    },
    {
        "id": "173",
        "kanji": "火",
        "word": "fire"
    },
    {
        "id": "174",
        "kanji": "炎",
        "word": "inflammation"
    },
    {
        "id": "175",
        "kanji": "煩",
        "word": "anxiety"
    },
    {
        "id": "176",
        "kanji": "淡",
        "word": "thin"
    },
    {
        "id": "177",
        "kanji": "灯",
        "word": "lamp"
    },
    {
        "id": "178",
        "kanji": "畑",
        "word": "farm"
    },
    {
        "id": "179",
        "kanji": "災",
        "word": "disaster"
    },
    {
        "id": "180",
        "kanji": "灰",
        "word": "ashes"
    },
    {
        "id": "181",
        "kanji": "点",
        "word": "spot"
    },
    {
        "id": "182",
        "kanji": "照",
        "word": "illuminate"
    },
    {
        "id": "183",
        "kanji": "魚",
        "word": "fish"
    },
    {
        "id": "184",
        "kanji": "漁",
        "word": "fishing"
    },
    {
        "id": "185",
        "kanji": "里",
        "word": "ri"
    },
    {
        "id": "186",
        "kanji": "黒",
        "word": "black"
    },
    {
        "id": "187",
        "kanji": "墨",
        "word": "black ink"
    },
    {
        "id": "188",
        "kanji": "鯉",
        "word": "carp"
    },
    {
        "id": "189",
        "kanji": "量",
        "word": "quantity"
    },
    {
        "id": "190",
        "kanji": "厘",
        "word": "rin"
    },
    {
        "id": "191",
        "kanji": "埋",
        "word": "bury"
    },
    {
        "id": "192",
        "kanji": "同",
        "word": "same"
    },
    {
        "id": "193",
        "kanji": "洞",
        "word": "den"
    },
    {
        "id": "194",
        "kanji": "胴",
        "word": "trunk"
    },
    {
        "id": "195",
        "kanji": "向",
        "word": "yonder"
    },
    {
        "id": "196",
        "kanji": "尚",
        "word": "esteem"
    },
    {
        "id": "197",
        "kanji": "字",
        "word": "character"
    },
    {
        "id": "198",
        "kanji": "守",
        "word": "guard"
    },
    {
        "id": "199",
        "kanji": "完",
        "word": "perfect"
    },
    {
        "id": "200",
        "kanji": "宣",
        "word": "proclaim"
    },
    {
        "id": "201",
        "kanji": "宵",
        "word": "wee hours"
    },
    {
        "id": "202",
        "kanji": "安",
        "word": "relax"
    },
    {
        "id": "203",
        "kanji": "宴",
        "word": "banquet"
    },
    {
        "id": "204",
        "kanji": "寄",
        "word": "draw near"
    },
    {
        "id": "205",
        "kanji": "富",
        "word": "wealth"
    },
    {
        "id": "206",
        "kanji": "貯",
        "word": "savings"
    },
    {
        "id": "207",
        "kanji": "木",
        "word": "tree"
    },
    {
        "id": "208",
        "kanji": "林",
        "word": "grove"
    },
    {
        "id": "209",
        "kanji": "森",
        "word": "forest"
    },
    {
        "id": "210",
        "kanji": "桂",
        "word": "Japanese Judas-tree"
    },
    {
        "id": "211",
        "kanji": "柏",
        "word": "oak"
    },
    {
        "id": "212",
        "kanji": "枠",
        "word": "frame"
    },
    {
        "id": "213",
        "kanji": "梢",
        "word": "treetops"
    },
    {
        "id": "214",
        "kanji": "棚",
        "word": "shelf"
    },
    {
        "id": "215",
        "kanji": "杏",
        "word": "apricot"
    },
    {
        "id": "216",
        "kanji": "桐",
        "word": "paulownia"
    },
    {
        "id": "217",
        "kanji": "植",
        "word": "plant"
    },
    {
        "id": "218",
        "kanji": "椅",
        "word": "chair"
    },
    {
        "id": "219",
        "kanji": "枯",
        "word": "wither"
    },
    {
        "id": "220",
        "kanji": "朴",
        "word": "crude"
    },
    {
        "id": "221",
        "kanji": "村",
        "word": "town"
    },
    {
        "id": "222",
        "kanji": "相",
        "word": "inter-"
    },
    {
        "id": "223",
        "kanji": "机",
        "word": "desk"
    },
    {
        "id": "224",
        "kanji": "本",
        "word": "book"
    },
    {
        "id": "225",
        "kanji": "札",
        "word": "tag"
    },
    {
        "id": "226",
        "kanji": "暦",
        "word": "calendar"
    },
    {
        "id": "227",
        "kanji": "案",
        "word": "plan"
    },
    {
        "id": "228",
        "kanji": "燥",
        "word": "parch"
    },
    {
        "id": "229",
        "kanji": "未",
        "word": "not yet"
    },
    {
        "id": "230",
        "kanji": "末",
        "word": "extremity"
    },
    {
        "id": "231",
        "kanji": "昧",
        "word": "obscure"
    },
    {
        "id": "232",
        "kanji": "沫",
        "word": "splash"
    },
    {
        "id": "233",
        "kanji": "味",
        "word": "flavor"
    },
    {
        "id": "234",
        "kanji": "妹",
        "word": "younger sister"
    },
    {
        "id": "235",
        "kanji": "朱",
        "word": "vermilion"
    },
    {
        "id": "236",
        "kanji": "株",
        "word": "stocks"
    },
    {
        "id": "237",
        "kanji": "若",
        "word": "young"
    },
    {
        "id": "238",
        "kanji": "草",
        "word": "grass"
    },
    {
        "id": "239",
        "kanji": "苦",
        "word": "suffering"
    },
    {
        "id": "240",
        "kanji": "苛",
        "word": "bullying"
    },
    {
        "id": "241",
        "kanji": "寛",
        "word": "tolerant"
    },
    {
        "id": "242",
        "kanji": "薄",
        "word": "dilute"
    },
    {
        "id": "243",
        "kanji": "葉",
        "word": "leaf"
    },
    {
        "id": "244",
        "kanji": "模",
        "word": "imitation"
    },
    {
        "id": "245",
        "kanji": "漠",
        "word": "vague"
    },
    {
        "id": "246",
        "kanji": "墓",
        "word": "grave"
    },
    {
        "id": "247",
        "kanji": "暮",
        "word": "livelihood"
    },
    {
        "id": "248",
        "kanji": "膜",
        "word": "membrane"
    },
    {
        "id": "249",
        "kanji": "苗",
        "word": "seedling"
    },
    {
        "id": "250",
        "kanji": "兆",
        "word": "portent"
    },
    {
        "id": "251",
        "kanji": "桃",
        "word": "peach tree"
    },
    {
        "id": "252",
        "kanji": "眺",
        "word": "stare"
    },
    {
        "id": "253",
        "kanji": "犬",
        "word": "dog"
    },
    {
        "id": "254",
        "kanji": "状",
        "word": "status quo"
    },
    {
        "id": "255",
        "kanji": "黙",
        "word": "silence"
    },
    {
        "id": "256",
        "kanji": "然",
        "word": "sort of thing"
    },
    {
        "id": "257",
        "kanji": "荻",
        "word": "reed"
    },
    {
        "id": "258",
        "kanji": "狩",
        "word": "hunt"
    },
    {
        "id": "259",
        "kanji": "猫",
        "word": "cat"
    },
    {
        "id": "260",
        "kanji": "牛",
        "word": "cow"
    },
    {
        "id": "261",
        "kanji": "特",
        "word": "special"
    },
    {
        "id": "262",
        "kanji": "告",
        "word": "revelation"
    },
    {
        "id": "263",
        "kanji": "先",
        "word": "before"
    },
    {
        "id": "264",
        "kanji": "洗",
        "word": "wash"
    },
    {
        "id": "265",
        "kanji": "介",
        "word": "jammed in"
    },
    {
        "id": "266",
        "kanji": "界",
        "word": "world"
    },
    {
        "id": "267",
        "kanji": "茶",
        "word": "tea"
    },
    {
        "id": "268",
        "kanji": "脊",
        "word": "spinal column"
    },
    {
        "id": "269",
        "kanji": "合",
        "word": "fit"
    },
    {
        "id": "270",
        "kanji": "塔",
        "word": "pagoda"
    },
    {
        "id": "271",
        "kanji": "王",
        "word": "king"
    },
    {
        "id": "272",
        "kanji": "玉",
        "word": "jewel"
    },
    {
        "id": "273",
        "kanji": "宝",
        "word": "treasure"
    },
    {
        "id": "274",
        "kanji": "珠",
        "word": "pearl"
    },
    {
        "id": "275",
        "kanji": "現",
        "word": "present"
    },
    {
        "id": "276",
        "kanji": "玩",
        "word": "toy"
    },
    {
        "id": "277",
        "kanji": "狂",
        "word": "lunatic"
    },
    {
        "id": "278",
        "kanji": "旺",
        "word": "effulgent"
    },
    {
        "id": "279",
        "kanji": "皇",
        "word": "emperor"
    },
    {
        "id": "280",
        "kanji": "呈",
        "word": "display"
    },
    {
        "id": "281",
        "kanji": "全",
        "word": "whole"
    },
    {
        "id": "282",
        "kanji": "栓",
        "word": "plug"
    },
    {
        "id": "283",
        "kanji": "理",
        "word": "logic"
    },
    {
        "id": "284",
        "kanji": "主",
        "word": "lord"
    },
    {
        "id": "285",
        "kanji": "注",
        "word": "pour"
    },
    {
        "id": "286",
        "kanji": "柱",
        "word": "pillar"
    },
    {
        "id": "287",
        "kanji": "金",
        "word": "gold"
    },
    {
        "id": "288",
        "kanji": "銑",
        "word": "pig iron"
    },
    {
        "id": "289",
        "kanji": "鉢",
        "word": "bowl"
    },
    {
        "id": "290",
        "kanji": "銅",
        "word": "copper"
    },
    {
        "id": "291",
        "kanji": "釣",
        "word": "angling"
    },
    {
        "id": "292",
        "kanji": "針",
        "word": "needle"
    },
    {
        "id": "293",
        "kanji": "銘",
        "word": "inscription"
    },
    {
        "id": "294",
        "kanji": "鎮",
        "word": "tranquillize"
    },
    {
        "id": "295",
        "kanji": "道",
        "word": "road-way"
    },
    {
        "id": "296",
        "kanji": "導",
        "word": "guidance"
    },
    {
        "id": "297",
        "kanji": "辻",
        "word": "crossing"
    },
    {
        "id": "298",
        "kanji": "迅",
        "word": "swift"
    },
    {
        "id": "299",
        "kanji": "造",
        "word": "create"
    },
    {
        "id": "300",
        "kanji": "迫",
        "word": "urge"
    },
    {
        "id": "301",
        "kanji": "逃",
        "word": "escape"
    },
    {
        "id": "302",
        "kanji": "辺",
        "word": "environs"
    },
    {
        "id": "303",
        "kanji": "巡",
        "word": "patrol"
    },
    {
        "id": "304",
        "kanji": "車",
        "word": "car"
    },
    {
        "id": "305",
        "kanji": "連",
        "word": "take along"
    },
    {
        "id": "306",
        "kanji": "軌",
        "word": "rut"
    },
    {
        "id": "307",
        "kanji": "輸",
        "word": "transport"
    },
    {
        "id": "308",
        "kanji": "喩",
        "word": "metaphor"
    },
    {
        "id": "309",
        "kanji": "前",
        "word": "in front"
    },
    {
        "id": "310",
        "kanji": "煎",
        "word": "roast"
    },
    {
        "id": "311",
        "kanji": "各",
        "word": "each"
    },
    {
        "id": "312",
        "kanji": "格",
        "word": "status"
    },
    {
        "id": "313",
        "kanji": "賂",
        "word": "graft"
    },
    {
        "id": "314",
        "kanji": "略",
        "word": "abbreviation"
    },
    {
        "id": "315",
        "kanji": "客",
        "word": "guest"
    },
    {
        "id": "316",
        "kanji": "額",
        "word": "forehead"
    },
    {
        "id": "317",
        "kanji": "夏",
        "word": "summer"
    },
    {
        "id": "318",
        "kanji": "処",
        "word": "dispose"
    },
    {
        "id": "319",
        "kanji": "条",
        "word": "twig"
    },
    {
        "id": "320",
        "kanji": "落",
        "word": "fall"
    },
    {
        "id": "321",
        "kanji": "冗",
        "word": "superfluous"
    },
    {
        "id": "322",
        "kanji": "冥",
        "word": "Hades"
    },
    {
        "id": "323",
        "kanji": "軍",
        "word": "army"
    },
    {
        "id": "324",
        "kanji": "輝",
        "word": "radiance"
    },
    {
        "id": "325",
        "kanji": "運",
        "word": "carry"
    },
    {
        "id": "326",
        "kanji": "冠",
        "word": "crown"
    },
    {
        "id": "327",
        "kanji": "夢",
        "word": "dream"
    },
    {
        "id": "328",
        "kanji": "坑",
        "word": "pit"
    },
    {
        "id": "329",
        "kanji": "高",
        "word": "tall"
    },
    {
        "id": "330",
        "kanji": "享",
        "word": "receive"
    },
    {
        "id": "331",
        "kanji": "塾",
        "word": "cram school"
    },
    {
        "id": "332",
        "kanji": "熟",
        "word": "mellow"
    },
    {
        "id": "333",
        "kanji": "亭",
        "word": "pavilion"
    },
    {
        "id": "334",
        "kanji": "京",
        "word": "capital"
    },
    {
        "id": "335",
        "kanji": "涼",
        "word": "refreshing"
    },
    {
        "id": "336",
        "kanji": "景",
        "word": "scenery"
    },
    {
        "id": "337",
        "kanji": "鯨",
        "word": "whale"
    },
    {
        "id": "338",
        "kanji": "舎",
        "word": "cottage"
    },
    {
        "id": "339",
        "kanji": "周",
        "word": "circumference"
    },
    {
        "id": "340",
        "kanji": "週",
        "word": "week"
    },
    {
        "id": "341",
        "kanji": "士",
        "word": "gentleman"
    },
    {
        "id": "342",
        "kanji": "吉",
        "word": "good luck"
    },
    {
        "id": "343",
        "kanji": "壮",
        "word": "robust"
    },
    {
        "id": "344",
        "kanji": "荘",
        "word": "villa"
    },
    {
        "id": "345",
        "kanji": "売",
        "word": "sell"
    },
    {
        "id": "346",
        "kanji": "学",
        "word": "study"
    },
    {
        "id": "347",
        "kanji": "覚",
        "word": "memorize"
    },
    {
        "id": "348",
        "kanji": "栄",
        "word": "flourish"
    },
    {
        "id": "349",
        "kanji": "書",
        "word": "write"
    },
    {
        "id": "350",
        "kanji": "津",
        "word": "haven"
    },
    {
        "id": "351",
        "kanji": "牧",
        "word": "breed"
    },
    {
        "id": "352",
        "kanji": "攻",
        "word": "aggression"
    },
    {
        "id": "353",
        "kanji": "敗",
        "word": "failure"
    },
    {
        "id": "354",
        "kanji": "枚",
        "word": "a sheet of"
    },
    {
        "id": "355",
        "kanji": "故",
        "word": "happenstance"
    },
    {
        "id": "356",
        "kanji": "敬",
        "word": "awe"
    },
    {
        "id": "357",
        "kanji": "言",
        "word": "say"
    },
    {
        "id": "358",
        "kanji": "警",
        "word": "admonish"
    },
    {
        "id": "359",
        "kanji": "計",
        "word": "plot"
    },
    {
        "id": "360",
        "kanji": "詮",
        "word": "elucidate"
    },
    {
        "id": "361",
        "kanji": "獄",
        "word": "prison"
    },
    {
        "id": "362",
        "kanji": "訂",
        "word": "revise"
    },
    {
        "id": "363",
        "kanji": "訃",
        "word": "obituary"
    },
    {
        "id": "364",
        "kanji": "討",
        "word": "chastise"
    },
    {
        "id": "365",
        "kanji": "訓",
        "word": "instruction"
    },
    {
        "id": "366",
        "kanji": "詔",
        "word": "imperial edict"
    },
    {
        "id": "367",
        "kanji": "詰",
        "word": "packed"
    },
    {
        "id": "368",
        "kanji": "話",
        "word": "tale"
    },
    {
        "id": "369",
        "kanji": "詠",
        "word": "recitation"
    },
    {
        "id": "370",
        "kanji": "詩",
        "word": "poem"
    },
    {
        "id": "371",
        "kanji": "語",
        "word": "word"
    },
    {
        "id": "372",
        "kanji": "読",
        "word": "read"
    },
    {
        "id": "373",
        "kanji": "調",
        "word": "tune"
    },
    {
        "id": "374",
        "kanji": "談",
        "word": "discuss"
    },
    {
        "id": "375",
        "kanji": "諾",
        "word": "consent"
    },
    {
        "id": "376",
        "kanji": "諭",
        "word": "rebuke"
    },
    {
        "id": "377",
        "kanji": "式",
        "word": "style"
    },
    {
        "id": "378",
        "kanji": "試",
        "word": "test"
    },
    {
        "id": "379",
        "kanji": "弐",
        "word": "II (two)"
    },
    {
        "id": "380",
        "kanji": "域",
        "word": "range"
    },
    {
        "id": "381",
        "kanji": "賊",
        "word": "burglar"
    },
    {
        "id": "382",
        "kanji": "栽",
        "word": "plantation"
    },
    {
        "id": "383",
        "kanji": "載",
        "word": "load"
    },
    {
        "id": "384",
        "kanji": "茂",
        "word": "overgrown"
    },
    {
        "id": "385",
        "kanji": "戚",
        "word": "relatives"
    },
    {
        "id": "386",
        "kanji": "成",
        "word": "turn into"
    },
    {
        "id": "387",
        "kanji": "城",
        "word": "castle"
    },
    {
        "id": "388",
        "kanji": "誠",
        "word": "sincerity"
    },
    {
        "id": "389",
        "kanji": "威",
        "word": "intimidate"
    },
    {
        "id": "390",
        "kanji": "滅",
        "word": "destroy"
    },
    {
        "id": "391",
        "kanji": "減",
        "word": "dwindle"
    },
    {
        "id": "392",
        "kanji": "蔑",
        "word": "revile"
    },
    {
        "id": "393",
        "kanji": "桟",
        "word": "scaffold"
    },
    {
        "id": "394",
        "kanji": "銭",
        "word": "coin"
    },
    {
        "id": "395",
        "kanji": "浅",
        "word": "shallow"
    },
    {
        "id": "396",
        "kanji": "止",
        "word": "stop"
    },
    {
        "id": "397",
        "kanji": "歩",
        "word": "walk"
    },
    {
        "id": "398",
        "kanji": "渉",
        "word": "ford"
    },
    {
        "id": "399",
        "kanji": "頻",
        "word": "repeatedly"
    },
    {
        "id": "400",
        "kanji": "肯",
        "word": "agreement"
    },
    {
        "id": "401",
        "kanji": "企",
        "word": "undertake"
    },
    {
        "id": "402",
        "kanji": "歴",
        "word": "curriculum"
    },
    {
        "id": "403",
        "kanji": "武",
        "word": "warrior"
    },
    {
        "id": "404",
        "kanji": "賦",
        "word": "levy"
    },
    {
        "id": "405",
        "kanji": "正",
        "word": "correct"
    },
    {
        "id": "406",
        "kanji": "証",
        "word": "evidence"
    },
    {
        "id": "407",
        "kanji": "政",
        "word": "politics"
    },
    {
        "id": "408",
        "kanji": "定",
        "word": "determine"
    },
    {
        "id": "409",
        "kanji": "錠",
        "word": "lock"
    },
    {
        "id": "410",
        "kanji": "走",
        "word": "run"
    },
    {
        "id": "411",
        "kanji": "超",
        "word": "transcend"
    },
    {
        "id": "412",
        "kanji": "赴",
        "word": "proceed"
    },
    {
        "id": "413",
        "kanji": "越",
        "word": "surpass"
    },
    {
        "id": "414",
        "kanji": "是",
        "word": "just so"
    },
    {
        "id": "415",
        "kanji": "題",
        "word": "topic"
    },
    {
        "id": "416",
        "kanji": "堤",
        "word": "dike"
    },
    {
        "id": "417",
        "kanji": "建",
        "word": "build"
    },
    {
        "id": "418",
        "kanji": "鍵",
        "word": "key"
    },
    {
        "id": "419",
        "kanji": "延",
        "word": "prolong"
    },
    {
        "id": "420",
        "kanji": "誕",
        "word": "nativity"
    },
    {
        "id": "421",
        "kanji": "礎",
        "word": "cornerstone"
    },
    {
        "id": "422",
        "kanji": "婿",
        "word": "bridegroom"
    },
    {
        "id": "423",
        "kanji": "衣",
        "word": "garment"
    },
    {
        "id": "424",
        "kanji": "裁",
        "word": "tailor"
    },
    {
        "id": "425",
        "kanji": "装",
        "word": "attire"
    },
    {
        "id": "426",
        "kanji": "裏",
        "word": "back"
    },
    {
        "id": "427",
        "kanji": "壊",
        "word": "demolition"
    },
    {
        "id": "428",
        "kanji": "哀",
        "word": "pathetic"
    },
    {
        "id": "429",
        "kanji": "遠",
        "word": "distant"
    },
    {
        "id": "430",
        "kanji": "猿",
        "word": "monkey"
    },
    {
        "id": "431",
        "kanji": "初",
        "word": "first time"
    },
    {
        "id": "432",
        "kanji": "巾",
        "word": "towel"
    },
    {
        "id": "433",
        "kanji": "布",
        "word": "linen"
    },
    {
        "id": "434",
        "kanji": "帆",
        "word": "sail"
    },
    {
        "id": "435",
        "kanji": "幅",
        "word": "hanging scroll"
    },
    {
        "id": "436",
        "kanji": "帽",
        "word": "cap"
    },
    {
        "id": "437",
        "kanji": "幕",
        "word": "curtain"
    },
    {
        "id": "438",
        "kanji": "幌",
        "word": "canopy"
    },
    {
        "id": "439",
        "kanji": "錦",
        "word": "brocade"
    },
    {
        "id": "440",
        "kanji": "市",
        "word": "market"
    },
    {
        "id": "441",
        "kanji": "柿",
        "word": "persimmon"
    },
    {
        "id": "442",
        "kanji": "姉",
        "word": "elder sister"
    },
    {
        "id": "443",
        "kanji": "肺",
        "word": "lungs"
    },
    {
        "id": "444",
        "kanji": "帯",
        "word": "sash"
    },
    {
        "id": "445",
        "kanji": "滞",
        "word": "stagnate"
    },
    {
        "id": "446",
        "kanji": "刺",
        "word": "thorn"
    },
    {
        "id": "447",
        "kanji": "制",
        "word": "system"
    },
    {
        "id": "448",
        "kanji": "製",
        "word": "made in..."
    },
    {
        "id": "449",
        "kanji": "転",
        "word": "revolve"
    },
    {
        "id": "450",
        "kanji": "芸",
        "word": "technique"
    },
    {
        "id": "451",
        "kanji": "雨",
        "word": "rain"
    },
    {
        "id": "452",
        "kanji": "雲",
        "word": "cloud"
    },
    {
        "id": "453",
        "kanji": "曇",
        "word": "cloudy weather"
    },
    {
        "id": "454",
        "kanji": "雷",
        "word": "thunder"
    },
    {
        "id": "455",
        "kanji": "霜",
        "word": "frost"
    },
    {
        "id": "456",
        "kanji": "冬",
        "word": "winter"
    },
    {
        "id": "457",
        "kanji": "天",
        "word": "heavens"
    },
    {
        "id": "458",
        "kanji": "妖",
        "word": "bewitched"
    },
    {
        "id": "459",
        "kanji": "沃",
        "word": "irrigate"
    },
    {
        "id": "460",
        "kanji": "橋",
        "word": "bridge"
    },
    {
        "id": "461",
        "kanji": "嬌",
        "word": "attractive"
    },
    {
        "id": "462",
        "kanji": "立",
        "word": "stand up"
    },
    {
        "id": "463",
        "kanji": "泣",
        "word": "cry"
    },
    {
        "id": "464",
        "kanji": "章",
        "word": "badge"
    },
    {
        "id": "465",
        "kanji": "競",
        "word": "vie"
    },
    {
        "id": "466",
        "kanji": "帝",
        "word": "sovereign"
    },
    {
        "id": "467",
        "kanji": "諦",
        "word": "renunciation"
    },
    {
        "id": "468",
        "kanji": "童",
        "word": "juvenile"
    },
    {
        "id": "469",
        "kanji": "瞳",
        "word": "pupil"
    },
    {
        "id": "470",
        "kanji": "鐘",
        "word": "bell"
    },
    {
        "id": "471",
        "kanji": "商",
        "word": "make a deal"
    },
    {
        "id": "472",
        "kanji": "嫡",
        "word": "legitimate wife"
    },
    {
        "id": "473",
        "kanji": "適",
        "word": "suitable"
    },
    {
        "id": "474",
        "kanji": "滴",
        "word": "drip"
    },
    {
        "id": "475",
        "kanji": "敵",
        "word": "enemy"
    },
    {
        "id": "476",
        "kanji": "匕",
        "word": "spoon"
    },
    {
        "id": "477",
        "kanji": "叱",
        "word": "scold"
    },
    {
        "id": "478",
        "kanji": "匂",
        "word": "aroma"
    },
    {
        "id": "479",
        "kanji": "頃",
        "word": "about that time"
    },
    {
        "id": "480",
        "kanji": "北",
        "word": "north"
    },
    {
        "id": "481",
        "kanji": "背",
        "word": "stature"
    },
    {
        "id": "482",
        "kanji": "比",
        "word": "compare"
    },
    {
        "id": "483",
        "kanji": "昆",
        "word": "descendants"
    },
    {
        "id": "484",
        "kanji": "皆",
        "word": "all"
    },
    {
        "id": "485",
        "kanji": "楷",
        "word": "block letters"
    },
    {
        "id": "486",
        "kanji": "諧",
        "word": "orderliness"
    },
    {
        "id": "487",
        "kanji": "混",
        "word": "mix"
    },
    {
        "id": "488",
        "kanji": "渇",
        "word": "thirst"
    },
    {
        "id": "489",
        "kanji": "謁",
        "word": "audience"
    },
    {
        "id": "490",
        "kanji": "褐",
        "word": "brown"
    },
    {
        "id": "491",
        "kanji": "喝",
        "word": "hoarse"
    },
    {
        "id": "492",
        "kanji": "葛",
        "word": "kudzu"
    },
    {
        "id": "493",
        "kanji": "旨",
        "word": "delicious"
    },
    {
        "id": "494",
        "kanji": "脂",
        "word": "fat"
    },
    {
        "id": "495",
        "kanji": "詣",
        "word": "visit a shrine"
    },
    {
        "id": "496",
        "kanji": "壱",
        "word": "I (one)"
    },
    {
        "id": "497",
        "kanji": "毎",
        "word": "every"
    },
    {
        "id": "498",
        "kanji": "敏",
        "word": "cleverness"
    },
    {
        "id": "499",
        "kanji": "梅",
        "word": "plum"
    },
    {
        "id": "500",
        "kanji": "海",
        "word": "sea"
    },
    {
        "id": "501",
        "kanji": "乞",
        "word": "beg"
    },
    {
        "id": "502",
        "kanji": "乾",
        "word": "drought"
    },
    {
        "id": "503",
        "kanji": "腹",
        "word": "abdomen"
    },
    {
        "id": "504",
        "kanji": "複",
        "word": "duplicate"
    },
    {
        "id": "505",
        "kanji": "欠",
        "word": "lack"
    },
    {
        "id": "506",
        "kanji": "吹",
        "word": "blow"
    },
    {
        "id": "507",
        "kanji": "炊",
        "word": "cook"
    },
    {
        "id": "508",
        "kanji": "歌",
        "word": "song"
    },
    {
        "id": "509",
        "kanji": "軟",
        "word": "soft"
    },
    {
        "id": "510",
        "kanji": "次",
        "word": "next"
    },
    {
        "id": "511",
        "kanji": "茨",
        "word": "briar"
    },
    {
        "id": "512",
        "kanji": "資",
        "word": "assets"
    },
    {
        "id": "513",
        "kanji": "姿",
        "word": "figure"
    },
    {
        "id": "514",
        "kanji": "諮",
        "word": "consult with"
    },
    {
        "id": "515",
        "kanji": "賠",
        "word": "compensation"
    },
    {
        "id": "516",
        "kanji": "培",
        "word": "cultivate"
    },
    {
        "id": "517",
        "kanji": "剖",
        "word": "divide"
    },
    {
        "id": "518",
        "kanji": "音",
        "word": "sound"
    },
    {
        "id": "519",
        "kanji": "暗",
        "word": "darkness"
    },
    {
        "id": "520",
        "kanji": "韻",
        "word": "rhyme"
    },
    {
        "id": "521",
        "kanji": "識",
        "word": "discriminating"
    },
    {
        "id": "522",
        "kanji": "鏡",
        "word": "mirror"
    },
    {
        "id": "523",
        "kanji": "境",
        "word": "boundary"
    },
    {
        "id": "524",
        "kanji": "亡",
        "word": "deceased"
    },
    {
        "id": "525",
        "kanji": "盲",
        "word": "blind"
    },
    {
        "id": "526",
        "kanji": "妄",
        "word": "delusion"
    },
    {
        "id": "527",
        "kanji": "荒",
        "word": "laid waste"
    },
    {
        "id": "528",
        "kanji": "望",
        "word": "ambition"
    },
    {
        "id": "529",
        "kanji": "方",
        "word": "direction"
    },
    {
        "id": "530",
        "kanji": "妨",
        "word": "disturb"
    },
    {
        "id": "531",
        "kanji": "坊",
        "word": "boy"
    },
    {
        "id": "532",
        "kanji": "芳",
        "word": "perfumed"
    },
    {
        "id": "533",
        "kanji": "肪",
        "word": "obese"
    },
    {
        "id": "534",
        "kanji": "訪",
        "word": "call on"
    },
    {
        "id": "535",
        "kanji": "放",
        "word": "set free"
    },
    {
        "id": "536",
        "kanji": "激",
        "word": "violent"
    },
    {
        "id": "537",
        "kanji": "脱",
        "word": "undress"
    },
    {
        "id": "538",
        "kanji": "説",
        "word": "explanation"
    },
    {
        "id": "539",
        "kanji": "鋭",
        "word": "pointed"
    },
    {
        "id": "540",
        "kanji": "曽",
        "word": "formerly"
    },
    {
        "id": "541",
        "kanji": "増",
        "word": "increase"
    },
    {
        "id": "542",
        "kanji": "贈",
        "word": "presents"
    },
    {
        "id": "543",
        "kanji": "東",
        "word": "east"
    },
    {
        "id": "544",
        "kanji": "棟",
        "word": "ridgepole"
    },
    {
        "id": "545",
        "kanji": "凍",
        "word": "frozen"
    },
    {
        "id": "546",
        "kanji": "妊",
        "word": "pregnancy"
    },
    {
        "id": "547",
        "kanji": "廷",
        "word": "courts"
    },
    {
        "id": "548",
        "kanji": "染",
        "word": "dye"
    },
    {
        "id": "549",
        "kanji": "燃",
        "word": "burn"
    },
    {
        "id": "550",
        "kanji": "賓",
        "word": "V.I.P."
    },
    {
        "id": "551",
        "kanji": "歳",
        "word": "year-end"
    },
    {
        "id": "552",
        "kanji": "県",
        "word": "prefecture"
    },
    {
        "id": "553",
        "kanji": "栃",
        "word": "horse chestnut"
    },
    {
        "id": "554",
        "kanji": "地",
        "word": "ground"
    },
    {
        "id": "555",
        "kanji": "池",
        "word": "pond"
    },
    {
        "id": "556",
        "kanji": "虫",
        "word": "insect"
    },
    {
        "id": "557",
        "kanji": "蛍",
        "word": "lightning bug"
    },
    {
        "id": "558",
        "kanji": "蛇",
        "word": "snake"
    },
    {
        "id": "559",
        "kanji": "虹",
        "word": "rainbow"
    },
    {
        "id": "560",
        "kanji": "蝶",
        "word": "butterfly"
    },
    {
        "id": "561",
        "kanji": "独",
        "word": "single"
    },
    {
        "id": "562",
        "kanji": "蚕",
        "word": "silkworm"
    },
    {
        "id": "563",
        "kanji": "風",
        "word": "wind"
    },
    {
        "id": "564",
        "kanji": "己",
        "word": "self"
    },
    {
        "id": "565",
        "kanji": "起",
        "word": "rouse"
    },
    {
        "id": "566",
        "kanji": "妃",
        "word": "queen"
    },
    {
        "id": "567",
        "kanji": "改",
        "word": "reformation"
    },
    {
        "id": "568",
        "kanji": "記",
        "word": "scribe"
    },
    {
        "id": "569",
        "kanji": "包",
        "word": "wrap"
    },
    {
        "id": "570",
        "kanji": "胞",
        "word": "placenta"
    },
    {
        "id": "571",
        "kanji": "砲",
        "word": "cannon"
    },
    {
        "id": "572",
        "kanji": "泡",
        "word": "bubble"
    },
    {
        "id": "573",
        "kanji": "亀",
        "word": "tortoise"
    },
    {
        "id": "574",
        "kanji": "電",
        "word": "electricity"
    },
    {
        "id": "575",
        "kanji": "竜",
        "word": "dragon"
    },
    {
        "id": "576",
        "kanji": "滝",
        "word": "waterfall"
    },
    {
        "id": "577",
        "kanji": "豚",
        "word": "pork"
    },
    {
        "id": "578",
        "kanji": "逐",
        "word": "pursue"
    },
    {
        "id": "579",
        "kanji": "遂",
        "word": "consummate"
    },
    {
        "id": "580",
        "kanji": "家",
        "word": "house"
    },
    {
        "id": "581",
        "kanji": "嫁",
        "word": "marry into"
    },
    {
        "id": "582",
        "kanji": "豪",
        "word": "overpowering"
    },
    {
        "id": "583",
        "kanji": "腸",
        "word": "intestines"
    },
    {
        "id": "584",
        "kanji": "場",
        "word": "location"
    },
    {
        "id": "585",
        "kanji": "湯",
        "word": "hot water"
    },
    {
        "id": "586",
        "kanji": "羊",
        "word": "sheep"
    },
    {
        "id": "587",
        "kanji": "美",
        "word": "beauty"
    },
    {
        "id": "588",
        "kanji": "洋",
        "word": "ocean"
    },
    {
        "id": "589",
        "kanji": "詳",
        "word": "detailed"
    },
    {
        "id": "590",
        "kanji": "鮮",
        "word": "fresh"
    },
    {
        "id": "591",
        "kanji": "達",
        "word": "accomplished"
    },
    {
        "id": "592",
        "kanji": "羨",
        "word": "envious"
    },
    {
        "id": "593",
        "kanji": "差",
        "word": "distinction"
    },
    {
        "id": "594",
        "kanji": "着",
        "word": "don"
    },
    {
        "id": "595",
        "kanji": "唯",
        "word": "solely"
    },
    {
        "id": "596",
        "kanji": "堆",
        "word": "piled high"
    },
    {
        "id": "597",
        "kanji": "椎",
        "word": "sweet oak"
    },
    {
        "id": "598",
        "kanji": "誰",
        "word": "who?"
    },
    {
        "id": "599",
        "kanji": "焦",
        "word": "char"
    },
    {
        "id": "600",
        "kanji": "礁",
        "word": "reef"
    },
    {
        "id": "601",
        "kanji": "集",
        "word": "gather"
    },
    {
        "id": "602",
        "kanji": "准",
        "word": "quasi-"
    },
    {
        "id": "603",
        "kanji": "進",
        "word": "advance"
    },
    {
        "id": "604",
        "kanji": "雑",
        "word": "miscellaneous"
    },
    {
        "id": "605",
        "kanji": "雌",
        "word": "female"
    },
    {
        "id": "606",
        "kanji": "準",
        "word": "semi-"
    },
    {
        "id": "607",
        "kanji": "奮",
        "word": "stirred up"
    },
    {
        "id": "608",
        "kanji": "奪",
        "word": "rob"
    },
    {
        "id": "609",
        "kanji": "確",
        "word": "assurance"
    },
    {
        "id": "610",
        "kanji": "午",
        "word": "noon"
    },
    {
        "id": "611",
        "kanji": "許",
        "word": "permit"
    },
    {
        "id": "612",
        "kanji": "歓",
        "word": "delight"
    },
    {
        "id": "613",
        "kanji": "権",
        "word": "authority"
    },
    {
        "id": "614",
        "kanji": "観",
        "word": "outlook"
    },
    {
        "id": "615",
        "kanji": "羽",
        "word": "feathers"
    },
    {
        "id": "616",
        "kanji": "習",
        "word": "learn"
    },
    {
        "id": "617",
        "kanji": "翌",
        "word": "the following"
    },
    {
        "id": "618",
        "kanji": "曜",
        "word": "weekday"
    },
    {
        "id": "619",
        "kanji": "濯",
        "word": "laundry"
    },
    {
        "id": "620",
        "kanji": "曰",
        "word": "sayeth"
    },
    {
        "id": "621",
        "kanji": "困",
        "word": "quandary"
    },
    {
        "id": "622",
        "kanji": "固",
        "word": "harden"
    },
    {
        "id": "623",
        "kanji": "錮",
        "word": "weld"
    },
    {
        "id": "624",
        "kanji": "国",
        "word": "country"
    },
    {
        "id": "625",
        "kanji": "団",
        "word": "group"
    },
    {
        "id": "626",
        "kanji": "因",
        "word": "cause"
    },
    {
        "id": "627",
        "kanji": "姻",
        "word": "matrimony"
    },
    {
        "id": "628",
        "kanji": "咽",
        "word": "windpipe"
    },
    {
        "id": "629",
        "kanji": "園",
        "word": "park"
    },
    {
        "id": "630",
        "kanji": "回",
        "word": "-times"
    },
    {
        "id": "631",
        "kanji": "壇",
        "word": "podium"
    },
    {
        "id": "632",
        "kanji": "店",
        "word": "store"
    },
    {
        "id": "633",
        "kanji": "庫",
        "word": "warehouse"
    },
    {
        "id": "634",
        "kanji": "庭",
        "word": "courtyard"
    },
    {
        "id": "635",
        "kanji": "庁",
        "word": "government office"
    },
    {
        "id": "636",
        "kanji": "床",
        "word": "bed"
    },
    {
        "id": "637",
        "kanji": "麻",
        "word": "hemp"
    },
    {
        "id": "638",
        "kanji": "磨",
        "word": "grind"
    },
    {
        "id": "639",
        "kanji": "心",
        "word": "heart"
    },
    {
        "id": "640",
        "kanji": "忘",
        "word": "forget"
    },
    {
        "id": "641",
        "kanji": "恣",
        "word": "selfish"
    },
    {
        "id": "642",
        "kanji": "忍",
        "word": "endure"
    },
    {
        "id": "643",
        "kanji": "認",
        "word": "acknowledge"
    },
    {
        "id": "644",
        "kanji": "忌",
        "word": "mourning"
    },
    {
        "id": "645",
        "kanji": "志",
        "word": "intention"
    },
    {
        "id": "646",
        "kanji": "誌",
        "word": "document"
    },
    {
        "id": "647",
        "kanji": "芯",
        "word": "wick"
    },
    {
        "id": "648",
        "kanji": "忠",
        "word": "loyalty"
    },
    {
        "id": "649",
        "kanji": "串",
        "word": "shish kebab"
    },
    {
        "id": "650",
        "kanji": "患",
        "word": "afflicted"
    },
    {
        "id": "651",
        "kanji": "思",
        "word": "think"
    },
    {
        "id": "652",
        "kanji": "恩",
        "word": "grace"
    },
    {
        "id": "653",
        "kanji": "応",
        "word": "apply"
    },
    {
        "id": "654",
        "kanji": "意",
        "word": "idea"
    },
    {
        "id": "655",
        "kanji": "臆",
        "word": "cowardice"
    },
    {
        "id": "656",
        "kanji": "想",
        "word": "concept"
    },
    {
        "id": "657",
        "kanji": "息",
        "word": "breath"
    },
    {
        "id": "658",
        "kanji": "憩",
        "word": "recess"
    },
    {
        "id": "659",
        "kanji": "恵",
        "word": "favor"
    },
    {
        "id": "660",
        "kanji": "恐",
        "word": "fear"
    },
    {
        "id": "661",
        "kanji": "惑",
        "word": "beguile"
    },
    {
        "id": "662",
        "kanji": "感",
        "word": "emotion"
    },
    {
        "id": "663",
        "kanji": "憂",
        "word": "melancholy"
    },
    {
        "id": "664",
        "kanji": "寡",
        "word": "widow"
    },
    {
        "id": "665",
        "kanji": "忙",
        "word": "busy"
    },
    {
        "id": "666",
        "kanji": "悦",
        "word": "ecstasy"
    },
    {
        "id": "667",
        "kanji": "恒",
        "word": "constancy"
    },
    {
        "id": "668",
        "kanji": "悼",
        "word": "lament"
    },
    {
        "id": "669",
        "kanji": "悟",
        "word": "enlightenment"
    },
    {
        "id": "670",
        "kanji": "怖",
        "word": "dreadful"
    },
    {
        "id": "671",
        "kanji": "慌",
        "word": "disconcerted"
    },
    {
        "id": "672",
        "kanji": "悔",
        "word": "repent"
    },
    {
        "id": "673",
        "kanji": "憎",
        "word": "hate"
    },
    {
        "id": "674",
        "kanji": "慣",
        "word": "accustomed"
    },
    {
        "id": "675",
        "kanji": "愉",
        "word": "pleasure"
    },
    {
        "id": "676",
        "kanji": "惰",
        "word": "lazy"
    },
    {
        "id": "677",
        "kanji": "慎",
        "word": "humility"
    },
    {
        "id": "678",
        "kanji": "憾",
        "word": "remorse"
    },
    {
        "id": "679",
        "kanji": "憶",
        "word": "recollection"
    },
    {
        "id": "680",
        "kanji": "惧",
        "word": "disquieting"
    },
    {
        "id": "681",
        "kanji": "憧",
        "word": "yearn"
    },
    {
        "id": "682",
        "kanji": "憬",
        "word": "hanker"
    },
    {
        "id": "683",
        "kanji": "慕",
        "word": "pining"
    },
    {
        "id": "684",
        "kanji": "添",
        "word": "annexed"
    },
    {
        "id": "685",
        "kanji": "必",
        "word": "invariably"
    },
    {
        "id": "686",
        "kanji": "泌",
        "word": "ooze"
    },
    {
        "id": "687",
        "kanji": "手",
        "word": "hand"
    },
    {
        "id": "688",
        "kanji": "看",
        "word": "watch over"
    },
    {
        "id": "689",
        "kanji": "摩",
        "word": "chafe"
    },
    {
        "id": "690",
        "kanji": "我",
        "word": "ego"
    },
    {
        "id": "691",
        "kanji": "義",
        "word": "righteousness"
    },
    {
        "id": "692",
        "kanji": "議",
        "word": "deliberation"
    },
    {
        "id": "693",
        "kanji": "犠",
        "word": "sacrifice"
    },
    {
        "id": "694",
        "kanji": "抹",
        "word": "rub"
    },
    {
        "id": "695",
        "kanji": "拭",
        "word": "wipe"
    },
    {
        "id": "696",
        "kanji": "拉",
        "word": "yank"
    },
    {
        "id": "697",
        "kanji": "抱",
        "word": "embrace"
    },
    {
        "id": "698",
        "kanji": "搭",
        "word": "board"
    },
    {
        "id": "699",
        "kanji": "抄",
        "word": "extract"
    },
    {
        "id": "700",
        "kanji": "抗",
        "word": "confront"
    },
    {
        "id": "701",
        "kanji": "批",
        "word": "criticism"
    },
    {
        "id": "702",
        "kanji": "招",
        "word": "beckon"
    },
    {
        "id": "703",
        "kanji": "拓",
        "word": "clear the land"
    },
    {
        "id": "704",
        "kanji": "拍",
        "word": "clap"
    },
    {
        "id": "705",
        "kanji": "打",
        "word": "strike"
    },
    {
        "id": "706",
        "kanji": "拘",
        "word": "arrest"
    },
    {
        "id": "707",
        "kanji": "捨",
        "word": "discard"
    },
    {
        "id": "708",
        "kanji": "拐",
        "word": "kidnap"
    },
    {
        "id": "709",
        "kanji": "摘",
        "word": "pinch"
    },
    {
        "id": "710",
        "kanji": "挑",
        "word": "challenge"
    },
    {
        "id": "711",
        "kanji": "指",
        "word": "finger"
    },
    {
        "id": "712",
        "kanji": "持",
        "word": "hold"
    },
    {
        "id": "713",
        "kanji": "拶",
        "word": "imminent"
    },
    {
        "id": "714",
        "kanji": "括",
        "word": "fasten"
    },
    {
        "id": "715",
        "kanji": "揮",
        "word": "brandish"
    },
    {
        "id": "716",
        "kanji": "推",
        "word": "conjecture"
    },
    {
        "id": "717",
        "kanji": "揚",
        "word": "hoist"
    },
    {
        "id": "718",
        "kanji": "提",
        "word": "propose"
    },
    {
        "id": "719",
        "kanji": "損",
        "word": "damage"
    },
    {
        "id": "720",
        "kanji": "拾",
        "word": "pick up"
    },
    {
        "id": "721",
        "kanji": "担",
        "word": "shouldering"
    },
    {
        "id": "722",
        "kanji": "拠",
        "word": "foothold"
    },
    {
        "id": "723",
        "kanji": "描",
        "word": "sketch"
    },
    {
        "id": "724",
        "kanji": "操",
        "word": "maneuver"
    },
    {
        "id": "725",
        "kanji": "接",
        "word": "touch"
    },
    {
        "id": "726",
        "kanji": "掲",
        "word": "put up a notice"
    },
    {
        "id": "727",
        "kanji": "掛",
        "word": "hang"
    },
    {
        "id": "728",
        "kanji": "捗",
        "word": "make headway"
    },
    {
        "id": "729",
        "kanji": "研",
        "word": "polish"
    },
    {
        "id": "730",
        "kanji": "戒",
        "word": "commandment"
    },
    {
        "id": "731",
        "kanji": "弄",
        "word": "tinker with"
    },
    {
        "id": "732",
        "kanji": "械",
        "word": "contraption"
    },
    {
        "id": "733",
        "kanji": "鼻",
        "word": "nose"
    },
    {
        "id": "734",
        "kanji": "刑",
        "word": "punish"
    },
    {
        "id": "735",
        "kanji": "型",
        "word": "mould"
    },
    {
        "id": "736",
        "kanji": "才",
        "word": "genius"
    },
    {
        "id": "737",
        "kanji": "財",
        "word": "property"
    },
    {
        "id": "738",
        "kanji": "材",
        "word": "lumber"
    },
    {
        "id": "739",
        "kanji": "存",
        "word": "suppose"
    },
    {
        "id": "740",
        "kanji": "在",
        "word": "exist"
    },
    {
        "id": "741",
        "kanji": "乃",
        "word": "from"
    },
    {
        "id": "742",
        "kanji": "携",
        "word": "portable"
    },
    {
        "id": "743",
        "kanji": "及",
        "word": "reach out"
    },
    {
        "id": "744",
        "kanji": "吸",
        "word": "suck"
    },
    {
        "id": "745",
        "kanji": "扱",
        "word": "handle"
    },
    {
        "id": "746",
        "kanji": "丈",
        "word": "length"
    },
    {
        "id": "747",
        "kanji": "史",
        "word": "history"
    },
    {
        "id": "748",
        "kanji": "吏",
        "word": "officer"
    },
    {
        "id": "749",
        "kanji": "更",
        "word": "grow late"
    },
    {
        "id": "750",
        "kanji": "硬",
        "word": "stiff"
    },
    {
        "id": "751",
        "kanji": "梗",
        "word": "spiny"
    },
    {
        "id": "752",
        "kanji": "又",
        "word": "or again"
    },
    {
        "id": "753",
        "kanji": "双",
        "word": "pair"
    },
    {
        "id": "754",
        "kanji": "桑",
        "word": "mulberry"
    },
    {
        "id": "755",
        "kanji": "隻",
        "word": "vessels"
    },
    {
        "id": "756",
        "kanji": "護",
        "word": "safeguard"
    },
    {
        "id": "757",
        "kanji": "獲",
        "word": "seize"
    },
    {
        "id": "758",
        "kanji": "奴",
        "word": "guy"
    },
    {
        "id": "759",
        "kanji": "怒",
        "word": "angry"
    },
    {
        "id": "760",
        "kanji": "友",
        "word": "friend"
    },
    {
        "id": "761",
        "kanji": "抜",
        "word": "slip out"
    },
    {
        "id": "762",
        "kanji": "投",
        "word": "throw"
    },
    {
        "id": "763",
        "kanji": "没",
        "word": "drown"
    },
    {
        "id": "764",
        "kanji": "股",
        "word": "thigh"
    },
    {
        "id": "765",
        "kanji": "設",
        "word": "establishment"
    },
    {
        "id": "766",
        "kanji": "撃",
        "word": "beat"
    },
    {
        "id": "767",
        "kanji": "殻",
        "word": "husk"
    },
    {
        "id": "768",
        "kanji": "支",
        "word": "branch"
    },
    {
        "id": "769",
        "kanji": "技",
        "word": "skill"
    },
    {
        "id": "770",
        "kanji": "枝",
        "word": "bough"
    },
    {
        "id": "771",
        "kanji": "肢",
        "word": "limb"
    },
    {
        "id": "772",
        "kanji": "茎",
        "word": "stalk"
    },
    {
        "id": "773",
        "kanji": "怪",
        "word": "suspicious"
    },
    {
        "id": "774",
        "kanji": "軽",
        "word": "lightly"
    },
    {
        "id": "775",
        "kanji": "叔",
        "word": "uncle"
    },
    {
        "id": "776",
        "kanji": "督",
        "word": "coach"
    },
    {
        "id": "777",
        "kanji": "寂",
        "word": "loneliness"
    },
    {
        "id": "778",
        "kanji": "淑",
        "word": "graceful"
    },
    {
        "id": "779",
        "kanji": "反",
        "word": "anti-"
    },
    {
        "id": "780",
        "kanji": "坂",
        "word": "slope"
    },
    {
        "id": "781",
        "kanji": "板",
        "word": "plank"
    },
    {
        "id": "782",
        "kanji": "返",
        "word": "return"
    },
    {
        "id": "783",
        "kanji": "販",
        "word": "marketing"
    },
    {
        "id": "784",
        "kanji": "爪",
        "word": "claw"
    },
    {
        "id": "785",
        "kanji": "妥",
        "word": "gentle"
    },
    {
        "id": "786",
        "kanji": "乳",
        "word": "milk"
    },
    {
        "id": "787",
        "kanji": "浮",
        "word": "floating"
    },
    {
        "id": "788",
        "kanji": "淫",
        "word": "lewd"
    },
    {
        "id": "789",
        "kanji": "将",
        "word": "leader"
    },
    {
        "id": "790",
        "kanji": "奨",
        "word": "exhort"
    },
    {
        "id": "791",
        "kanji": "采",
        "word": "grab"
    },
    {
        "id": "792",
        "kanji": "採",
        "word": "pick"
    },
    {
        "id": "793",
        "kanji": "菜",
        "word": "vegetable"
    },
    {
        "id": "794",
        "kanji": "受",
        "word": "accept"
    },
    {
        "id": "795",
        "kanji": "授",
        "word": "impart"
    },
    {
        "id": "796",
        "kanji": "愛",
        "word": "love"
    },
    {
        "id": "797",
        "kanji": "曖",
        "word": "unclear"
    },
    {
        "id": "798",
        "kanji": "払",
        "word": "pay"
    },
    {
        "id": "799",
        "kanji": "広",
        "word": "wide"
    },
    {
        "id": "800",
        "kanji": "勾",
        "word": "hooked"
    },
    {
        "id": "801",
        "kanji": "拡",
        "word": "broaden"
    },
    {
        "id": "802",
        "kanji": "鉱",
        "word": "mineral"
    },
    {
        "id": "803",
        "kanji": "弁",
        "word": "valve"
    },
    {
        "id": "804",
        "kanji": "雄",
        "word": "male"
    },
    {
        "id": "805",
        "kanji": "台",
        "word": "pedestal"
    },
    {
        "id": "806",
        "kanji": "怠",
        "word": "neglect"
    },
    {
        "id": "807",
        "kanji": "治",
        "word": "reign"
    },
    {
        "id": "808",
        "kanji": "冶",
        "word": "metallurgy"
    },
    {
        "id": "809",
        "kanji": "始",
        "word": "commence"
    },
    {
        "id": "810",
        "kanji": "胎",
        "word": "womb"
    },
    {
        "id": "811",
        "kanji": "窓",
        "word": "window"
    },
    {
        "id": "812",
        "kanji": "去",
        "word": "gone"
    },
    {
        "id": "813",
        "kanji": "法",
        "word": "method"
    },
    {
        "id": "814",
        "kanji": "会",
        "word": "meeting"
    },
    {
        "id": "815",
        "kanji": "至",
        "word": "climax"
    },
    {
        "id": "816",
        "kanji": "室",
        "word": "room"
    },
    {
        "id": "817",
        "kanji": "到",
        "word": "arrival"
    },
    {
        "id": "818",
        "kanji": "致",
        "word": "doth"
    },
    {
        "id": "819",
        "kanji": "互",
        "word": "mutually"
    },
    {
        "id": "820",
        "kanji": "棄",
        "word": "abandon"
    },
    {
        "id": "821",
        "kanji": "育",
        "word": "bring up"
    },
    {
        "id": "822",
        "kanji": "撤",
        "word": "remove"
    },
    {
        "id": "823",
        "kanji": "充",
        "word": "allot"
    },
    {
        "id": "824",
        "kanji": "銃",
        "word": "gun"
    },
    {
        "id": "825",
        "kanji": "硫",
        "word": "sulfur"
    },
    {
        "id": "826",
        "kanji": "流",
        "word": "current"
    },
    {
        "id": "827",
        "kanji": "允",
        "word": "license"
    },
    {
        "id": "828",
        "kanji": "唆",
        "word": "tempt"
    },
    {
        "id": "829",
        "kanji": "出",
        "word": "exit"
    },
    {
        "id": "830",
        "kanji": "山",
        "word": "mountain"
    },
    {
        "id": "831",
        "kanji": "拙",
        "word": "bungling"
    },
    {
        "id": "832",
        "kanji": "岩",
        "word": "boulder"
    },
    {
        "id": "833",
        "kanji": "炭",
        "word": "charcoal"
    },
    {
        "id": "834",
        "kanji": "岐",
        "word": "branch off"
    },
    {
        "id": "835",
        "kanji": "峠",
        "word": "mountain pass"
    },
    {
        "id": "836",
        "kanji": "崩",
        "word": "crumble"
    },
    {
        "id": "837",
        "kanji": "密",
        "word": "secrecy"
    },
    {
        "id": "838",
        "kanji": "蜜",
        "word": "honey"
    },
    {
        "id": "839",
        "kanji": "嵐",
        "word": "storm"
    },
    {
        "id": "840",
        "kanji": "崎",
        "word": "promontory"
    },
    {
        "id": "841",
        "kanji": "崖",
        "word": "bluffs"
    },
    {
        "id": "842",
        "kanji": "入",
        "word": "enter"
    },
    {
        "id": "843",
        "kanji": "込",
        "word": "crowded"
    },
    {
        "id": "844",
        "kanji": "分",
        "word": "part"
    },
    {
        "id": "845",
        "kanji": "貧",
        "word": "poverty"
    },
    {
        "id": "846",
        "kanji": "頒",
        "word": "partition"
    },
    {
        "id": "847",
        "kanji": "公",
        "word": "public"
    },
    {
        "id": "848",
        "kanji": "松",
        "word": "pine tree"
    },
    {
        "id": "849",
        "kanji": "翁",
        "word": "venerable old man"
    },
    {
        "id": "850",
        "kanji": "訟",
        "word": "sue"
    },
    {
        "id": "851",
        "kanji": "谷",
        "word": "valley"
    },
    {
        "id": "852",
        "kanji": "浴",
        "word": "bathe"
    },
    {
        "id": "853",
        "kanji": "容",
        "word": "contain"
    },
    {
        "id": "854",
        "kanji": "溶",
        "word": "melt"
    },
    {
        "id": "855",
        "kanji": "欲",
        "word": "longing"
    },
    {
        "id": "856",
        "kanji": "裕",
        "word": "abundant"
    },
    {
        "id": "857",
        "kanji": "鉛",
        "word": "lead (metal)"
    },
    {
        "id": "858",
        "kanji": "沿",
        "word": "run alongside"
    },
    {
        "id": "859",
        "kanji": "賞",
        "word": "prize"
    },
    {
        "id": "860",
        "kanji": "党",
        "word": "party"
    },
    {
        "id": "861",
        "kanji": "堂",
        "word": "hall"
    },
    {
        "id": "862",
        "kanji": "常",
        "word": "usual"
    },
    {
        "id": "863",
        "kanji": "裳",
        "word": "skirt"
    },
    {
        "id": "864",
        "kanji": "掌",
        "word": "manipulate"
    },
    {
        "id": "865",
        "kanji": "皮",
        "word": "pelt"
    },
    {
        "id": "866",
        "kanji": "波",
        "word": "waves"
    },
    {
        "id": "867",
        "kanji": "婆",
        "word": "old woman"
    },
    {
        "id": "868",
        "kanji": "披",
        "word": "expose"
    },
    {
        "id": "869",
        "kanji": "破",
        "word": "rend"
    },
    {
        "id": "870",
        "kanji": "被",
        "word": "incur"
    },
    {
        "id": "871",
        "kanji": "残",
        "word": "remainder"
    },
    {
        "id": "872",
        "kanji": "殉",
        "word": "martyrdom"
    },
    {
        "id": "873",
        "kanji": "殊",
        "word": "particularly"
    },
    {
        "id": "874",
        "kanji": "殖",
        "word": "augment"
    },
    {
        "id": "875",
        "kanji": "列",
        "word": "file"
    },
    {
        "id": "876",
        "kanji": "裂",
        "word": "split"
    },
    {
        "id": "877",
        "kanji": "烈",
        "word": "ardent"
    },
    {
        "id": "878",
        "kanji": "死",
        "word": "death"
    },
    {
        "id": "879",
        "kanji": "葬",
        "word": "interment"
    },
    {
        "id": "880",
        "kanji": "瞬",
        "word": "wink"
    },
    {
        "id": "881",
        "kanji": "耳",
        "word": "ear"
    },
    {
        "id": "882",
        "kanji": "取",
        "word": "take"
    },
    {
        "id": "883",
        "kanji": "趣",
        "word": "gist"
    },
    {
        "id": "884",
        "kanji": "最",
        "word": "utmost"
    },
    {
        "id": "885",
        "kanji": "撮",
        "word": "snapshot"
    },
    {
        "id": "886",
        "kanji": "恥",
        "word": "shame"
    },
    {
        "id": "887",
        "kanji": "職",
        "word": "post"
    },
    {
        "id": "888",
        "kanji": "聖",
        "word": "holy"
    },
    {
        "id": "889",
        "kanji": "敢",
        "word": "daring"
    },
    {
        "id": "890",
        "kanji": "聴",
        "word": "listen"
    },
    {
        "id": "891",
        "kanji": "懐",
        "word": "pocket"
    },
    {
        "id": "892",
        "kanji": "慢",
        "word": "ridicule"
    },
    {
        "id": "893",
        "kanji": "漫",
        "word": "loose"
    },
    {
        "id": "894",
        "kanji": "買",
        "word": "buy"
    },
    {
        "id": "895",
        "kanji": "置",
        "word": "placement"
    },
    {
        "id": "896",
        "kanji": "罰",
        "word": "penalty"
    },
    {
        "id": "897",
        "kanji": "寧",
        "word": "rather"
    },
    {
        "id": "898",
        "kanji": "濁",
        "word": "voiced"
    },
    {
        "id": "899",
        "kanji": "環",
        "word": "ring"
    },
    {
        "id": "900",
        "kanji": "還",
        "word": "send back"
    },
    {
        "id": "901",
        "kanji": "夫",
        "word": "husband"
    },
    {
        "id": "902",
        "kanji": "扶",
        "word": "aid"
    },
    {
        "id": "903",
        "kanji": "渓",
        "word": "mountain stream"
    },
    {
        "id": "904",
        "kanji": "規",
        "word": "standard"
    },
    {
        "id": "905",
        "kanji": "替",
        "word": "exchange"
    },
    {
        "id": "906",
        "kanji": "賛",
        "word": "approve"
    },
    {
        "id": "907",
        "kanji": "潜",
        "word": "submerge"
    },
    {
        "id": "908",
        "kanji": "失",
        "word": "lose"
    },
    {
        "id": "909",
        "kanji": "鉄",
        "word": "iron"
    },
    {
        "id": "910",
        "kanji": "迭",
        "word": "alternate"
    },
    {
        "id": "911",
        "kanji": "臣",
        "word": "retainer"
    },
    {
        "id": "912",
        "kanji": "姫",
        "word": "princess"
    },
    {
        "id": "913",
        "kanji": "蔵",
        "word": "storehouse"
    },
    {
        "id": "914",
        "kanji": "臓",
        "word": "entrails"
    },
    {
        "id": "915",
        "kanji": "賢",
        "word": "intelligent"
    },
    {
        "id": "916",
        "kanji": "腎",
        "word": "kidney"
    },
    {
        "id": "917",
        "kanji": "堅",
        "word": "strict"
    },
    {
        "id": "918",
        "kanji": "臨",
        "word": "look to"
    },
    {
        "id": "919",
        "kanji": "覧",
        "word": "perusal"
    },
    {
        "id": "920",
        "kanji": "巨",
        "word": "gigantic"
    },
    {
        "id": "921",
        "kanji": "拒",
        "word": "repel"
    },
    {
        "id": "922",
        "kanji": "力",
        "word": "power"
    },
    {
        "id": "923",
        "kanji": "男",
        "word": "man"
    },
    {
        "id": "924",
        "kanji": "労",
        "word": "labor"
    },
    {
        "id": "925",
        "kanji": "募",
        "word": "recruit"
    },
    {
        "id": "926",
        "kanji": "劣",
        "word": "inferiority"
    },
    {
        "id": "927",
        "kanji": "功",
        "word": "achievement"
    },
    {
        "id": "928",
        "kanji": "勧",
        "word": "persuade"
    },
    {
        "id": "929",
        "kanji": "努",
        "word": "toil"
    },
    {
        "id": "930",
        "kanji": "勃",
        "word": "uprising"
    },
    {
        "id": "931",
        "kanji": "励",
        "word": "encourage"
    },
    {
        "id": "932",
        "kanji": "加",
        "word": "add"
    },
    {
        "id": "933",
        "kanji": "賀",
        "word": "congratulations"
    },
    {
        "id": "934",
        "kanji": "架",
        "word": "erect"
    },
    {
        "id": "935",
        "kanji": "脇",
        "word": "armpit"
    },
    {
        "id": "936",
        "kanji": "脅",
        "word": "threaten"
    },
    {
        "id": "937",
        "kanji": "協",
        "word": "co-"
    },
    {
        "id": "938",
        "kanji": "行",
        "word": "going"
    },
    {
        "id": "939",
        "kanji": "律",
        "word": "rhythm"
    },
    {
        "id": "940",
        "kanji": "復",
        "word": "restore"
    },
    {
        "id": "941",
        "kanji": "得",
        "word": "gain"
    },
    {
        "id": "942",
        "kanji": "従",
        "word": "accompany"
    },
    {
        "id": "943",
        "kanji": "徒",
        "word": "junior"
    },
    {
        "id": "944",
        "kanji": "待",
        "word": "wait"
    },
    {
        "id": "945",
        "kanji": "往",
        "word": "journey"
    },
    {
        "id": "946",
        "kanji": "征",
        "word": "subjugate"
    },
    {
        "id": "947",
        "kanji": "径",
        "word": "diameter"
    },
    {
        "id": "948",
        "kanji": "彼",
        "word": "he"
    },
    {
        "id": "949",
        "kanji": "役",
        "word": "duty"
    },
    {
        "id": "950",
        "kanji": "徳",
        "word": "benevolence"
    },
    {
        "id": "951",
        "kanji": "徹",
        "word": "penetrate"
    },
    {
        "id": "952",
        "kanji": "徴",
        "word": "indications"
    },
    {
        "id": "953",
        "kanji": "懲",
        "word": "penal"
    },
    {
        "id": "954",
        "kanji": "微",
        "word": "delicate"
    },
    {
        "id": "955",
        "kanji": "街",
        "word": "boulevard"
    },
    {
        "id": "956",
        "kanji": "桁",
        "word": "girder"
    },
    {
        "id": "957",
        "kanji": "衡",
        "word": "equilibrium"
    },
    {
        "id": "958",
        "kanji": "稿",
        "word": "draft"
    },
    {
        "id": "959",
        "kanji": "稼",
        "word": "earnings"
    },
    {
        "id": "960",
        "kanji": "程",
        "word": "extent"
    },
    {
        "id": "961",
        "kanji": "税",
        "word": "tax"
    },
    {
        "id": "962",
        "kanji": "稚",
        "word": "immature"
    },
    {
        "id": "963",
        "kanji": "和",
        "word": "harmony"
    },
    {
        "id": "964",
        "kanji": "移",
        "word": "shift"
    },
    {
        "id": "965",
        "kanji": "秒",
        "word": "second"
    },
    {
        "id": "966",
        "kanji": "秋",
        "word": "autumn"
    },
    {
        "id": "967",
        "kanji": "愁",
        "word": "distress"
    },
    {
        "id": "968",
        "kanji": "私",
        "word": "private"
    },
    {
        "id": "969",
        "kanji": "秩",
        "word": "regularity"
    },
    {
        "id": "970",
        "kanji": "秘",
        "word": "secret"
    },
    {
        "id": "971",
        "kanji": "称",
        "word": "appellation"
    },
    {
        "id": "972",
        "kanji": "利",
        "word": "profit"
    },
    {
        "id": "973",
        "kanji": "梨",
        "word": "pear tree"
    },
    {
        "id": "974",
        "kanji": "穫",
        "word": "harvest"
    },
    {
        "id": "975",
        "kanji": "穂",
        "word": "ear of a plant"
    },
    {
        "id": "976",
        "kanji": "稲",
        "word": "rice plant"
    },
    {
        "id": "977",
        "kanji": "香",
        "word": "incense"
    },
    {
        "id": "978",
        "kanji": "季",
        "word": "seasons"
    },
    {
        "id": "979",
        "kanji": "委",
        "word": "committee"
    },
    {
        "id": "980",
        "kanji": "秀",
        "word": "excel"
    },
    {
        "id": "981",
        "kanji": "透",
        "word": "transparent"
    },
    {
        "id": "982",
        "kanji": "誘",
        "word": "entice"
    },
    {
        "id": "983",
        "kanji": "稽",
        "word": "training"
    },
    {
        "id": "984",
        "kanji": "穀",
        "word": "cereals"
    },
    {
        "id": "985",
        "kanji": "菌",
        "word": "germ"
    },
    {
        "id": "986",
        "kanji": "萎",
        "word": "numb"
    },
    {
        "id": "987",
        "kanji": "米",
        "word": "rice"
    },
    {
        "id": "988",
        "kanji": "粉",
        "word": "flour"
    },
    {
        "id": "989",
        "kanji": "粘",
        "word": "sticky"
    },
    {
        "id": "990",
        "kanji": "粒",
        "word": "grains"
    },
    {
        "id": "991",
        "kanji": "粧",
        "word": "cosmetics"
    },
    {
        "id": "992",
        "kanji": "迷",
        "word": "astray"
    },
    {
        "id": "993",
        "kanji": "粋",
        "word": "chic"
    },
    {
        "id": "994",
        "kanji": "謎",
        "word": "riddle"
    },
    {
        "id": "995",
        "kanji": "糧",
        "word": "provisions"
    },
    {
        "id": "996",
        "kanji": "菊",
        "word": "chrysanthemum"
    },
    {
        "id": "997",
        "kanji": "奥",
        "word": "core"
    },
    {
        "id": "998",
        "kanji": "数",
        "word": "number"
    },
    {
        "id": "999",
        "kanji": "楼",
        "word": "watchtower"
    },
    {
        "id": "1000",
        "kanji": "類",
        "word": "sort"
    },
    {
        "id": "1001",
        "kanji": "漆",
        "word": "lacquer"
    },
    {
        "id": "1002",
        "kanji": "膝",
        "word": "knee"
    },
    {
        "id": "1003",
        "kanji": "様",
        "word": "Esq."
    },
    {
        "id": "1004",
        "kanji": "求",
        "word": "request"
    },
    {
        "id": "1005",
        "kanji": "球",
        "word": "ball"
    },
    {
        "id": "1006",
        "kanji": "救",
        "word": "salvation"
    },
    {
        "id": "1007",
        "kanji": "竹",
        "word": "bamboo"
    },
    {
        "id": "1008",
        "kanji": "笑",
        "word": "laugh"
    },
    {
        "id": "1009",
        "kanji": "笠",
        "word": "bamboo hat"
    },
    {
        "id": "1010",
        "kanji": "笹",
        "word": "bamboo grass"
    },
    {
        "id": "1011",
        "kanji": "箋",
        "word": "stationery"
    },
    {
        "id": "1012",
        "kanji": "筋",
        "word": "muscle"
    },
    {
        "id": "1013",
        "kanji": "箱",
        "word": "box"
    },
    {
        "id": "1014",
        "kanji": "筆",
        "word": "writing brush"
    },
    {
        "id": "1015",
        "kanji": "筒",
        "word": "cylinder"
    },
    {
        "id": "1016",
        "kanji": "等",
        "word": "etc."
    },
    {
        "id": "1017",
        "kanji": "算",
        "word": "calculate"
    },
    {
        "id": "1018",
        "kanji": "答",
        "word": "solution"
    },
    {
        "id": "1019",
        "kanji": "策",
        "word": "scheme"
    },
    {
        "id": "1020",
        "kanji": "簿",
        "word": "register"
    },
    {
        "id": "1021",
        "kanji": "築",
        "word": "fabricate"
    },
    {
        "id": "1022",
        "kanji": "篭",
        "word": "basket"
    },
    {
        "id": "1023",
        "kanji": "人",
        "word": "person"
    },
    {
        "id": "1024",
        "kanji": "佐",
        "word": "assistant"
    },
    {
        "id": "1025",
        "kanji": "侶",
        "word": "partner"
    },
    {
        "id": "1026",
        "kanji": "但",
        "word": "however"
    },
    {
        "id": "1027",
        "kanji": "住",
        "word": "dwell"
    },
    {
        "id": "1028",
        "kanji": "位",
        "word": "rank"
    },
    {
        "id": "1029",
        "kanji": "仲",
        "word": "go-between"
    },
    {
        "id": "1030",
        "kanji": "体",
        "word": "body"
    },
    {
        "id": "1031",
        "kanji": "悠",
        "word": "remote"
    },
    {
        "id": "1032",
        "kanji": "件",
        "word": "affair"
    },
    {
        "id": "1033",
        "kanji": "仕",
        "word": "attend"
    },
    {
        "id": "1034",
        "kanji": "他",
        "word": "other"
    },
    {
        "id": "1035",
        "kanji": "伏",
        "word": "prostrated"
    },
    {
        "id": "1036",
        "kanji": "伝",
        "word": "transmit"
    },
    {
        "id": "1037",
        "kanji": "仏",
        "word": "Buddha"
    },
    {
        "id": "1038",
        "kanji": "休",
        "word": "rest"
    },
    {
        "id": "1039",
        "kanji": "仮",
        "word": "provisional"
    },
    {
        "id": "1040",
        "kanji": "伎",
        "word": "performing artist"
    },
    {
        "id": "1041",
        "kanji": "伯",
        "word": "chief"
    },
    {
        "id": "1042",
        "kanji": "俗",
        "word": "vulgar"
    },
    {
        "id": "1043",
        "kanji": "信",
        "word": "faith"
    },
    {
        "id": "1044",
        "kanji": "佳",
        "word": "excellent"
    },
    {
        "id": "1045",
        "kanji": "依",
        "word": "reliant"
    },
    {
        "id": "1046",
        "kanji": "例",
        "word": "example"
    },
    {
        "id": "1047",
        "kanji": "個",
        "word": "individual"
    },
    {
        "id": "1048",
        "kanji": "健",
        "word": "healthy"
    },
    {
        "id": "1049",
        "kanji": "側",
        "word": "side"
    },
    {
        "id": "1050",
        "kanji": "侍",
        "word": "waiter"
    },
    {
        "id": "1051",
        "kanji": "停",
        "word": "halt"
    },
    {
        "id": "1052",
        "kanji": "値",
        "word": "price"
    },
    {
        "id": "1053",
        "kanji": "倣",
        "word": "emulate"
    },
    {
        "id": "1054",
        "kanji": "傲",
        "word": "arrogance"
    },
    {
        "id": "1055",
        "kanji": "倒",
        "word": "overthrow"
    },
    {
        "id": "1056",
        "kanji": "偵",
        "word": "spy"
    },
    {
        "id": "1057",
        "kanji": "僧",
        "word": "Buddhist priest"
    },
    {
        "id": "1058",
        "kanji": "億",
        "word": "hundred million"
    },
    {
        "id": "1059",
        "kanji": "儀",
        "word": "ceremony"
    },
    {
        "id": "1060",
        "kanji": "償",
        "word": "reparation"
    },
    {
        "id": "1061",
        "kanji": "仙",
        "word": "hermit"
    },
    {
        "id": "1062",
        "kanji": "催",
        "word": "sponsor"
    },
    {
        "id": "1063",
        "kanji": "仁",
        "word": "humanity"
    },
    {
        "id": "1064",
        "kanji": "侮",
        "word": "scorn"
    },
    {
        "id": "1065",
        "kanji": "使",
        "word": "use"
    },
    {
        "id": "1066",
        "kanji": "便",
        "word": "convenience"
    },
    {
        "id": "1067",
        "kanji": "倍",
        "word": "double"
    },
    {
        "id": "1068",
        "kanji": "優",
        "word": "tenderness"
    },
    {
        "id": "1069",
        "kanji": "伐",
        "word": "fell"
    },
    {
        "id": "1070",
        "kanji": "宿",
        "word": "inn"
    },
    {
        "id": "1071",
        "kanji": "傷",
        "word": "wound"
    },
    {
        "id": "1072",
        "kanji": "保",
        "word": "protect"
    },
    {
        "id": "1073",
        "kanji": "褒",
        "word": "praise"
    },
    {
        "id": "1074",
        "kanji": "傑",
        "word": "greatness"
    },
    {
        "id": "1075",
        "kanji": "付",
        "word": "adhere"
    },
    {
        "id": "1076",
        "kanji": "符",
        "word": "token"
    },
    {
        "id": "1077",
        "kanji": "府",
        "word": "municipality"
    },
    {
        "id": "1078",
        "kanji": "任",
        "word": "responsibility"
    },
    {
        "id": "1079",
        "kanji": "賃",
        "word": "fare"
    },
    {
        "id": "1080",
        "kanji": "代",
        "word": "substitute"
    },
    {
        "id": "1081",
        "kanji": "袋",
        "word": "sack"
    },
    {
        "id": "1082",
        "kanji": "貸",
        "word": "lend"
    },
    {
        "id": "1083",
        "kanji": "化",
        "word": "change"
    },
    {
        "id": "1084",
        "kanji": "花",
        "word": "flower"
    },
    {
        "id": "1085",
        "kanji": "貨",
        "word": "freight"
    },
    {
        "id": "1086",
        "kanji": "傾",
        "word": "lean"
    },
    {
        "id": "1087",
        "kanji": "何",
        "word": "what"
    },
    {
        "id": "1088",
        "kanji": "荷",
        "word": "baggage"
    },
    {
        "id": "1089",
        "kanji": "俊",
        "word": "sagacious"
    },
    {
        "id": "1090",
        "kanji": "傍",
        "word": "bystander"
    },
    {
        "id": "1091",
        "kanji": "俺",
        "word": "myself"
    },
    {
        "id": "1092",
        "kanji": "久",
        "word": "long time"
    },
    {
        "id": "1093",
        "kanji": "畝",
        "word": "furrow"
    },
    {
        "id": "1094",
        "kanji": "囚",
        "word": "captured"
    },
    {
        "id": "1095",
        "kanji": "内",
        "word": "inside"
    },
    {
        "id": "1096",
        "kanji": "丙",
        "word": "third class"
    },
    {
        "id": "1097",
        "kanji": "柄",
        "word": "design"
    },
    {
        "id": "1098",
        "kanji": "肉",
        "word": "meat"
    },
    {
        "id": "1099",
        "kanji": "腐",
        "word": "rot"
    },
    {
        "id": "1100",
        "kanji": "座",
        "word": "sit"
    },
    {
        "id": "1101",
        "kanji": "挫",
        "word": "sprain"
    },
    {
        "id": "1102",
        "kanji": "卒",
        "word": "graduate"
    },
    {
        "id": "1103",
        "kanji": "傘",
        "word": "umbrella"
    },
    {
        "id": "1104",
        "kanji": "匁",
        "word": "monme"
    },
    {
        "id": "1105",
        "kanji": "以",
        "word": "by means of"
    },
    {
        "id": "1106",
        "kanji": "似",
        "word": "similar"
    },
    {
        "id": "1107",
        "kanji": "併",
        "word": "join"
    },
    {
        "id": "1108",
        "kanji": "瓦",
        "word": "tile"
    },
    {
        "id": "1109",
        "kanji": "瓶",
        "word": "flower pot"
    },
    {
        "id": "1110",
        "kanji": "宮",
        "word": "Shinto shrine"
    },
    {
        "id": "1111",
        "kanji": "営",
        "word": "occupation"
    },
    {
        "id": "1112",
        "kanji": "善",
        "word": "virtuous"
    },
    {
        "id": "1113",
        "kanji": "膳",
        "word": "dining tray"
    },
    {
        "id": "1114",
        "kanji": "年",
        "word": "year"
    },
    {
        "id": "1115",
        "kanji": "夜",
        "word": "night"
    },
    {
        "id": "1116",
        "kanji": "液",
        "word": "fluid"
    },
    {
        "id": "1117",
        "kanji": "塚",
        "word": "hillock"
    },
    {
        "id": "1118",
        "kanji": "幣",
        "word": "cash"
    },
    {
        "id": "1119",
        "kanji": "蔽",
        "word": "cover over"
    },
    {
        "id": "1120",
        "kanji": "弊",
        "word": "abuse"
    },
    {
        "id": "1121",
        "kanji": "喚",
        "word": "yell"
    },
    {
        "id": "1122",
        "kanji": "換",
        "word": "interchange"
    },
    {
        "id": "1123",
        "kanji": "融",
        "word": "dissolve"
    },
    {
        "id": "1124",
        "kanji": "施",
        "word": "alms"
    },
    {
        "id": "1125",
        "kanji": "旋",
        "word": "rotation"
    },
    {
        "id": "1126",
        "kanji": "遊",
        "word": "play"
    },
    {
        "id": "1127",
        "kanji": "旅",
        "word": "trip"
    },
    {
        "id": "1128",
        "kanji": "勿",
        "word": "not"
    },
    {
        "id": "1129",
        "kanji": "物",
        "word": "thing"
    },
    {
        "id": "1130",
        "kanji": "易",
        "word": "easy"
    },
    {
        "id": "1131",
        "kanji": "賜",
        "word": "grant"
    },
    {
        "id": "1132",
        "kanji": "尿",
        "word": "urine"
    },
    {
        "id": "1133",
        "kanji": "尼",
        "word": "nun"
    },
    {
        "id": "1134",
        "kanji": "尻",
        "word": "buttocks"
    },
    {
        "id": "1135",
        "kanji": "泥",
        "word": "mud"
    },
    {
        "id": "1136",
        "kanji": "塀",
        "word": "fence"
    },
    {
        "id": "1137",
        "kanji": "履",
        "word": "footgear"
    },
    {
        "id": "1138",
        "kanji": "屋",
        "word": "roof"
    },
    {
        "id": "1139",
        "kanji": "握",
        "word": "grip"
    },
    {
        "id": "1140",
        "kanji": "屈",
        "word": "yield"
    },
    {
        "id": "1141",
        "kanji": "掘",
        "word": "dig"
    },
    {
        "id": "1142",
        "kanji": "堀",
        "word": "ditch"
    },
    {
        "id": "1143",
        "kanji": "居",
        "word": "reside"
    },
    {
        "id": "1144",
        "kanji": "据",
        "word": "set"
    },
    {
        "id": "1145",
        "kanji": "裾",
        "word": "hem"
    },
    {
        "id": "1146",
        "kanji": "層",
        "word": "stratum"
    },
    {
        "id": "1147",
        "kanji": "局",
        "word": "bureau"
    },
    {
        "id": "1148",
        "kanji": "遅",
        "word": "slow"
    },
    {
        "id": "1149",
        "kanji": "漏",
        "word": "leak"
    },
    {
        "id": "1150",
        "kanji": "刷",
        "word": "printing"
    },
    {
        "id": "1151",
        "kanji": "尺",
        "word": "shaku"
    },
    {
        "id": "1152",
        "kanji": "尽",
        "word": "exhaust"
    },
    {
        "id": "1153",
        "kanji": "沢",
        "word": "swamp"
    },
    {
        "id": "1154",
        "kanji": "訳",
        "word": "translate"
    },
    {
        "id": "1155",
        "kanji": "択",
        "word": "choose"
    },
    {
        "id": "1156",
        "kanji": "昼",
        "word": "daytime"
    },
    {
        "id": "1157",
        "kanji": "戸",
        "word": "door"
    },
    {
        "id": "1158",
        "kanji": "肩",
        "word": "shoulder"
    },
    {
        "id": "1159",
        "kanji": "房",
        "word": "tassel"
    },
    {
        "id": "1160",
        "kanji": "扇",
        "word": "fan"
    },
    {
        "id": "1161",
        "kanji": "炉",
        "word": "hearth"
    },
    {
        "id": "1162",
        "kanji": "戻",
        "word": "re-"
    },
    {
        "id": "1163",
        "kanji": "涙",
        "word": "tears"
    },
    {
        "id": "1164",
        "kanji": "雇",
        "word": "employ"
    },
    {
        "id": "1165",
        "kanji": "顧",
        "word": "look back"
    },
    {
        "id": "1166",
        "kanji": "啓",
        "word": "disclose"
    },
    {
        "id": "1167",
        "kanji": "示",
        "word": "show"
    },
    {
        "id": "1168",
        "kanji": "礼",
        "word": "salutation"
    },
    {
        "id": "1169",
        "kanji": "祥",
        "word": "auspicious"
    },
    {
        "id": "1170",
        "kanji": "祝",
        "word": "celebrate"
    },
    {
        "id": "1171",
        "kanji": "福",
        "word": "blessing"
    },
    {
        "id": "1172",
        "kanji": "祉",
        "word": "welfare"
    },
    {
        "id": "1173",
        "kanji": "社",
        "word": "company"
    },
    {
        "id": "1174",
        "kanji": "視",
        "word": "inspection"
    },
    {
        "id": "1175",
        "kanji": "奈",
        "word": "Nara"
    },
    {
        "id": "1176",
        "kanji": "尉",
        "word": "military officer"
    },
    {
        "id": "1177",
        "kanji": "慰",
        "word": "consolation"
    },
    {
        "id": "1178",
        "kanji": "款",
        "word": "goodwill"
    },
    {
        "id": "1179",
        "kanji": "禁",
        "word": "prohibition"
    },
    {
        "id": "1180",
        "kanji": "襟",
        "word": "collar"
    },
    {
        "id": "1181",
        "kanji": "宗",
        "word": "religion"
    },
    {
        "id": "1182",
        "kanji": "崇",
        "word": "adore"
    },
    {
        "id": "1183",
        "kanji": "祭",
        "word": "ritual"
    },
    {
        "id": "1184",
        "kanji": "察",
        "word": "guess"
    },
    {
        "id": "1185",
        "kanji": "擦",
        "word": "grate"
    },
    {
        "id": "1186",
        "kanji": "由",
        "word": "wherefore"
    },
    {
        "id": "1187",
        "kanji": "抽",
        "word": "pluck"
    },
    {
        "id": "1188",
        "kanji": "油",
        "word": "oil"
    },
    {
        "id": "1189",
        "kanji": "袖",
        "word": "sleeve"
    },
    {
        "id": "1190",
        "kanji": "宙",
        "word": "mid-air"
    },
    {
        "id": "1191",
        "kanji": "届",
        "word": "deliver"
    },
    {
        "id": "1192",
        "kanji": "笛",
        "word": "flute"
    },
    {
        "id": "1193",
        "kanji": "軸",
        "word": "axis"
    },
    {
        "id": "1194",
        "kanji": "甲",
        "word": "armor"
    },
    {
        "id": "1195",
        "kanji": "押",
        "word": "push"
    },
    {
        "id": "1196",
        "kanji": "岬",
        "word": "headland"
    },
    {
        "id": "1197",
        "kanji": "挿",
        "word": "insert"
    },
    {
        "id": "1198",
        "kanji": "申",
        "word": "speaketh"
    },
    {
        "id": "1199",
        "kanji": "伸",
        "word": "expand"
    },
    {
        "id": "1200",
        "kanji": "神",
        "word": "gods"
    },
    {
        "id": "1201",
        "kanji": "捜",
        "word": "search"
    },
    {
        "id": "1202",
        "kanji": "果",
        "word": "fruit"
    },
    {
        "id": "1203",
        "kanji": "菓",
        "word": "confectionary"
    },
    {
        "id": "1204",
        "kanji": "課",
        "word": "chapter"
    },
    {
        "id": "1205",
        "kanji": "裸",
        "word": "naked"
    },
    {
        "id": "1206",
        "kanji": "斤",
        "word": "ax"
    },
    {
        "id": "1207",
        "kanji": "析",
        "word": "chop"
    },
    {
        "id": "1208",
        "kanji": "所",
        "word": "place"
    },
    {
        "id": "1209",
        "kanji": "祈",
        "word": "pray"
    },
    {
        "id": "1210",
        "kanji": "近",
        "word": "near"
    },
    {
        "id": "1211",
        "kanji": "折",
        "word": "fold"
    },
    {
        "id": "1212",
        "kanji": "哲",
        "word": "philosophy"
    },
    {
        "id": "1213",
        "kanji": "逝",
        "word": "departed"
    },
    {
        "id": "1214",
        "kanji": "誓",
        "word": "vow"
    },
    {
        "id": "1215",
        "kanji": "斬",
        "word": "chop off"
    },
    {
        "id": "1216",
        "kanji": "暫",
        "word": "temporarily"
    },
    {
        "id": "1217",
        "kanji": "漸",
        "word": "steadily"
    },
    {
        "id": "1218",
        "kanji": "断",
        "word": "severance"
    },
    {
        "id": "1219",
        "kanji": "質",
        "word": "substance"
    },
    {
        "id": "1220",
        "kanji": "斥",
        "word": "reject"
    },
    {
        "id": "1221",
        "kanji": "訴",
        "word": "accusation"
    },
    {
        "id": "1222",
        "kanji": "昨",
        "word": "yesterday"
    },
    {
        "id": "1223",
        "kanji": "詐",
        "word": "lie"
    },
    {
        "id": "1224",
        "kanji": "作",
        "word": "make"
    },
    {
        "id": "1225",
        "kanji": "雪",
        "word": "snow"
    },
    {
        "id": "1226",
        "kanji": "録",
        "word": "record"
    },
    {
        "id": "1227",
        "kanji": "剥",
        "word": "peel off"
    },
    {
        "id": "1228",
        "kanji": "尋",
        "word": "inquire"
    },
    {
        "id": "1229",
        "kanji": "急",
        "word": "hurry"
    },
    {
        "id": "1230",
        "kanji": "穏",
        "word": "calm"
    },
    {
        "id": "1231",
        "kanji": "侵",
        "word": "encroach"
    },
    {
        "id": "1232",
        "kanji": "浸",
        "word": "immersed"
    },
    {
        "id": "1233",
        "kanji": "寝",
        "word": "lie down"
    },
    {
        "id": "1234",
        "kanji": "婦",
        "word": "lady"
    },
    {
        "id": "1235",
        "kanji": "掃",
        "word": "sweep"
    },
    {
        "id": "1236",
        "kanji": "当",
        "word": "hit"
    },
    {
        "id": "1237",
        "kanji": "彙",
        "word": "glossary"
    },
    {
        "id": "1238",
        "kanji": "争",
        "word": "contend"
    },
    {
        "id": "1239",
        "kanji": "浄",
        "word": "clean"
    },
    {
        "id": "1240",
        "kanji": "事",
        "word": "matter"
    },
    {
        "id": "1241",
        "kanji": "唐",
        "word": "T'ang"
    },
    {
        "id": "1242",
        "kanji": "糖",
        "word": "sugar"
    },
    {
        "id": "1243",
        "kanji": "康",
        "word": "sane"
    },
    {
        "id": "1244",
        "kanji": "逮",
        "word": "apprehend"
    },
    {
        "id": "1245",
        "kanji": "伊",
        "word": "Italy"
    },
    {
        "id": "1246",
        "kanji": "君",
        "word": "old boy"
    },
    {
        "id": "1247",
        "kanji": "群",
        "word": "flock"
    },
    {
        "id": "1248",
        "kanji": "耐",
        "word": "-proof"
    },
    {
        "id": "1249",
        "kanji": "需",
        "word": "demand"
    },
    {
        "id": "1250",
        "kanji": "儒",
        "word": "Confucian"
    },
    {
        "id": "1251",
        "kanji": "端",
        "word": "edge"
    },
    {
        "id": "1252",
        "kanji": "両",
        "word": "both"
    },
    {
        "id": "1253",
        "kanji": "満",
        "word": "full"
    },
    {
        "id": "1254",
        "kanji": "画",
        "word": "brush-stroke"
    },
    {
        "id": "1255",
        "kanji": "歯",
        "word": "tooth"
    },
    {
        "id": "1256",
        "kanji": "曲",
        "word": "bend"
    },
    {
        "id": "1257",
        "kanji": "曹",
        "word": "cadet"
    },
    {
        "id": "1258",
        "kanji": "遭",
        "word": "encounter"
    },
    {
        "id": "1259",
        "kanji": "漕",
        "word": "rowing"
    },
    {
        "id": "1260",
        "kanji": "槽",
        "word": "vat"
    },
    {
        "id": "1261",
        "kanji": "斗",
        "word": "Big Dipper"
    },
    {
        "id": "1262",
        "kanji": "料",
        "word": "fee"
    },
    {
        "id": "1263",
        "kanji": "科",
        "word": "department"
    },
    {
        "id": "1264",
        "kanji": "図",
        "word": "map"
    },
    {
        "id": "1265",
        "kanji": "用",
        "word": "utilize"
    },
    {
        "id": "1266",
        "kanji": "庸",
        "word": "comfortable"
    },
    {
        "id": "1267",
        "kanji": "備",
        "word": "equip"
    },
    {
        "id": "1268",
        "kanji": "昔",
        "word": "once upon a time"
    },
    {
        "id": "1269",
        "kanji": "錯",
        "word": "confused"
    },
    {
        "id": "1270",
        "kanji": "借",
        "word": "borrow"
    },
    {
        "id": "1271",
        "kanji": "惜",
        "word": "pity"
    },
    {
        "id": "1272",
        "kanji": "措",
        "word": "set aside"
    },
    {
        "id": "1273",
        "kanji": "散",
        "word": "scatter"
    },
    {
        "id": "1274",
        "kanji": "廿",
        "word": "twenty"
    },
    {
        "id": "1275",
        "kanji": "庶",
        "word": "commoner"
    },
    {
        "id": "1276",
        "kanji": "遮",
        "word": "intercept"
    },
    {
        "id": "1277",
        "kanji": "席",
        "word": "seat"
    },
    {
        "id": "1278",
        "kanji": "度",
        "word": "degrees"
    },
    {
        "id": "1279",
        "kanji": "渡",
        "word": "transit"
    },
    {
        "id": "1280",
        "kanji": "奔",
        "word": "bustle"
    },
    {
        "id": "1281",
        "kanji": "噴",
        "word": "erupt"
    },
    {
        "id": "1282",
        "kanji": "墳",
        "word": "tomb"
    },
    {
        "id": "1283",
        "kanji": "憤",
        "word": "aroused"
    },
    {
        "id": "1284",
        "kanji": "焼",
        "word": "bake"
    },
    {
        "id": "1285",
        "kanji": "暁",
        "word": "daybreak"
    },
    {
        "id": "1286",
        "kanji": "半",
        "word": "half"
    },
    {
        "id": "1287",
        "kanji": "伴",
        "word": "consort"
    },
    {
        "id": "1288",
        "kanji": "畔",
        "word": "paddy ridge"
    },
    {
        "id": "1289",
        "kanji": "判",
        "word": "judgment"
    },
    {
        "id": "1290",
        "kanji": "拳",
        "word": "fist"
    },
    {
        "id": "1291",
        "kanji": "券",
        "word": "ticket"
    },
    {
        "id": "1292",
        "kanji": "巻",
        "word": "scroll"
    },
    {
        "id": "1293",
        "kanji": "圏",
        "word": "sphere"
    },
    {
        "id": "1294",
        "kanji": "勝",
        "word": "victory"
    },
    {
        "id": "1295",
        "kanji": "藤",
        "word": "wisteria"
    },
    {
        "id": "1296",
        "kanji": "謄",
        "word": "facsimilie"
    },
    {
        "id": "1297",
        "kanji": "片",
        "word": "one-sided"
    },
    {
        "id": "1298",
        "kanji": "版",
        "word": "printing block"
    },
    {
        "id": "1299",
        "kanji": "之",
        "word": "of"
    },
    {
        "id": "1300",
        "kanji": "乏",
        "word": "destitution"
    },
    {
        "id": "1301",
        "kanji": "芝",
        "word": "turf"
    },
    {
        "id": "1302",
        "kanji": "不",
        "word": "negative"
    },
    {
        "id": "1303",
        "kanji": "否",
        "word": "negate"
    },
    {
        "id": "1304",
        "kanji": "杯",
        "word": "cupfuls"
    },
    {
        "id": "1305",
        "kanji": "矢",
        "word": "dart"
    },
    {
        "id": "1306",
        "kanji": "矯",
        "word": "rectify"
    },
    {
        "id": "1307",
        "kanji": "族",
        "word": "tribe"
    },
    {
        "id": "1308",
        "kanji": "知",
        "word": "know"
    },
    {
        "id": "1309",
        "kanji": "智",
        "word": "wisdom"
    },
    {
        "id": "1310",
        "kanji": "挨",
        "word": "shove"
    },
    {
        "id": "1311",
        "kanji": "矛",
        "word": "halberd"
    },
    {
        "id": "1312",
        "kanji": "柔",
        "word": "tender"
    },
    {
        "id": "1313",
        "kanji": "務",
        "word": "task"
    },
    {
        "id": "1314",
        "kanji": "霧",
        "word": "fog"
    },
    {
        "id": "1315",
        "kanji": "班",
        "word": "squad"
    },
    {
        "id": "1316",
        "kanji": "帰",
        "word": "homecoming"
    },
    {
        "id": "1317",
        "kanji": "弓",
        "word": "bow"
    },
    {
        "id": "1318",
        "kanji": "引",
        "word": "pull"
    },
    {
        "id": "1319",
        "kanji": "弔",
        "word": "condolences"
    },
    {
        "id": "1320",
        "kanji": "弘",
        "word": "vast"
    },
    {
        "id": "1321",
        "kanji": "強",
        "word": "strong"
    },
    {
        "id": "1322",
        "kanji": "弥",
        "word": "more and more"
    },
    {
        "id": "1323",
        "kanji": "弱",
        "word": "weak"
    },
    {
        "id": "1324",
        "kanji": "溺",
        "word": "drowning"
    },
    {
        "id": "1325",
        "kanji": "沸",
        "word": "seethe"
    },
    {
        "id": "1326",
        "kanji": "費",
        "word": "expense"
    },
    {
        "id": "1327",
        "kanji": "第",
        "word": "No."
    },
    {
        "id": "1328",
        "kanji": "弟",
        "word": "younger brother"
    },
    {
        "id": "1329",
        "kanji": "巧",
        "word": "adroit"
    },
    {
        "id": "1330",
        "kanji": "号",
        "word": "nickname"
    },
    {
        "id": "1331",
        "kanji": "朽",
        "word": "decay"
    },
    {
        "id": "1332",
        "kanji": "誇",
        "word": "boast"
    },
    {
        "id": "1333",
        "kanji": "顎",
        "word": "chin"
    },
    {
        "id": "1334",
        "kanji": "汚",
        "word": "dirty"
    },
    {
        "id": "1335",
        "kanji": "与",
        "word": "bestow"
    },
    {
        "id": "1336",
        "kanji": "写",
        "word": "copy"
    },
    {
        "id": "1337",
        "kanji": "身",
        "word": "somebody"
    },
    {
        "id": "1338",
        "kanji": "射",
        "word": "shoot"
    },
    {
        "id": "1339",
        "kanji": "謝",
        "word": "apologize"
    },
    {
        "id": "1340",
        "kanji": "老",
        "word": "old man"
    },
    {
        "id": "1341",
        "kanji": "考",
        "word": "consider"
    },
    {
        "id": "1342",
        "kanji": "孝",
        "word": "filial piety"
    },
    {
        "id": "1343",
        "kanji": "教",
        "word": "teach"
    },
    {
        "id": "1344",
        "kanji": "拷",
        "word": "torture"
    },
    {
        "id": "1345",
        "kanji": "者",
        "word": "someone"
    },
    {
        "id": "1346",
        "kanji": "煮",
        "word": "boil"
    },
    {
        "id": "1347",
        "kanji": "著",
        "word": "renowned"
    },
    {
        "id": "1348",
        "kanji": "箸",
        "word": "chopsticks"
    },
    {
        "id": "1349",
        "kanji": "署",
        "word": "signature"
    },
    {
        "id": "1350",
        "kanji": "暑",
        "word": "sultry"
    },
    {
        "id": "1351",
        "kanji": "諸",
        "word": "various"
    },
    {
        "id": "1352",
        "kanji": "猪",
        "word": "boar"
    },
    {
        "id": "1353",
        "kanji": "渚",
        "word": "strand"
    },
    {
        "id": "1354",
        "kanji": "賭",
        "word": "gamble"
    },
    {
        "id": "1355",
        "kanji": "峡",
        "word": "gorge"
    },
    {
        "id": "1356",
        "kanji": "狭",
        "word": "cramped"
    },
    {
        "id": "1357",
        "kanji": "挟",
        "word": "sandwiched"
    },
    {
        "id": "1358",
        "kanji": "頬",
        "word": "cheek"
    },
    {
        "id": "1359",
        "kanji": "追",
        "word": "chase"
    },
    {
        "id": "1360",
        "kanji": "阜",
        "word": "large hill"
    },
    {
        "id": "1361",
        "kanji": "師",
        "word": "expert"
    },
    {
        "id": "1362",
        "kanji": "帥",
        "word": "commander"
    },
    {
        "id": "1363",
        "kanji": "官",
        "word": "bureaucrat"
    },
    {
        "id": "1364",
        "kanji": "棺",
        "word": "coffin"
    },
    {
        "id": "1365",
        "kanji": "管",
        "word": "pipe"
    },
    {
        "id": "1366",
        "kanji": "父",
        "word": "father"
    },
    {
        "id": "1367",
        "kanji": "釜",
        "word": "cauldron"
    },
    {
        "id": "1368",
        "kanji": "交",
        "word": "mingle"
    },
    {
        "id": "1369",
        "kanji": "効",
        "word": "merit"
    },
    {
        "id": "1370",
        "kanji": "較",
        "word": "contrast"
    },
    {
        "id": "1371",
        "kanji": "校",
        "word": "exam"
    },
    {
        "id": "1372",
        "kanji": "足",
        "word": "leg"
    },
    {
        "id": "1373",
        "kanji": "促",
        "word": "stimulate"
    },
    {
        "id": "1374",
        "kanji": "捉",
        "word": "nab"
    },
    {
        "id": "1375",
        "kanji": "距",
        "word": "long-distance"
    },
    {
        "id": "1376",
        "kanji": "路",
        "word": "path"
    },
    {
        "id": "1377",
        "kanji": "露",
        "word": "dew"
    },
    {
        "id": "1378",
        "kanji": "跳",
        "word": "hop"
    },
    {
        "id": "1379",
        "kanji": "躍",
        "word": "leap"
    },
    {
        "id": "1380",
        "kanji": "践",
        "word": "tread"
    },
    {
        "id": "1381",
        "kanji": "踏",
        "word": "step"
    },
    {
        "id": "1382",
        "kanji": "踪",
        "word": "trail"
    },
    {
        "id": "1383",
        "kanji": "骨",
        "word": "skeleton"
    },
    {
        "id": "1384",
        "kanji": "滑",
        "word": "slippery"
    },
    {
        "id": "1385",
        "kanji": "髄",
        "word": "marrow"
    },
    {
        "id": "1386",
        "kanji": "禍",
        "word": "calamity"
    },
    {
        "id": "1387",
        "kanji": "渦",
        "word": "whirlpool"
    },
    {
        "id": "1388",
        "kanji": "鍋",
        "word": "pot"
    },
    {
        "id": "1389",
        "kanji": "過",
        "word": "overdo"
    },
    {
        "id": "1390",
        "kanji": "阪",
        "word": "Heights"
    },
    {
        "id": "1391",
        "kanji": "阿",
        "word": "Africa"
    },
    {
        "id": "1392",
        "kanji": "際",
        "word": "occasion"
    },
    {
        "id": "1393",
        "kanji": "障",
        "word": "hinder"
    },
    {
        "id": "1394",
        "kanji": "隙",
        "word": "chink"
    },
    {
        "id": "1395",
        "kanji": "随",
        "word": "follow"
    },
    {
        "id": "1396",
        "kanji": "陪",
        "word": "auxiliary"
    },
    {
        "id": "1397",
        "kanji": "陽",
        "word": "sunshine"
    },
    {
        "id": "1398",
        "kanji": "陳",
        "word": "line up"
    },
    {
        "id": "1399",
        "kanji": "防",
        "word": "ward off"
    },
    {
        "id": "1400",
        "kanji": "附",
        "word": "affixed"
    },
    {
        "id": "1401",
        "kanji": "院",
        "word": "Inst."
    },
    {
        "id": "1402",
        "kanji": "陣",
        "word": "camp"
    },
    {
        "id": "1403",
        "kanji": "隊",
        "word": "regiment"
    },
    {
        "id": "1404",
        "kanji": "墜",
        "word": "crash"
    },
    {
        "id": "1405",
        "kanji": "降",
        "word": "descend"
    },
    {
        "id": "1406",
        "kanji": "階",
        "word": "story"
    },
    {
        "id": "1407",
        "kanji": "陛",
        "word": "highness"
    },
    {
        "id": "1408",
        "kanji": "隣",
        "word": "neighboring"
    },
    {
        "id": "1409",
        "kanji": "隔",
        "word": "isolate"
    },
    {
        "id": "1410",
        "kanji": "隠",
        "word": "conceal"
    },
    {
        "id": "1411",
        "kanji": "堕",
        "word": "degenerate"
    },
    {
        "id": "1412",
        "kanji": "陥",
        "word": "collapse"
    },
    {
        "id": "1413",
        "kanji": "穴",
        "word": "hole"
    },
    {
        "id": "1414",
        "kanji": "空",
        "word": "empty"
    },
    {
        "id": "1415",
        "kanji": "控",
        "word": "withdraw"
    },
    {
        "id": "1416",
        "kanji": "突",
        "word": "stab"
    },
    {
        "id": "1417",
        "kanji": "究",
        "word": "research"
    },
    {
        "id": "1418",
        "kanji": "窒",
        "word": "plug up"
    },
    {
        "id": "1419",
        "kanji": "窃",
        "word": "stealth"
    },
    {
        "id": "1420",
        "kanji": "窟",
        "word": "cavern"
    },
    {
        "id": "1421",
        "kanji": "窪",
        "word": "depression"
    },
    {
        "id": "1422",
        "kanji": "搾",
        "word": "squeeze"
    },
    {
        "id": "1423",
        "kanji": "窯",
        "word": "kiln"
    },
    {
        "id": "1424",
        "kanji": "窮",
        "word": "hard up"
    },
    {
        "id": "1425",
        "kanji": "探",
        "word": "grope"
    },
    {
        "id": "1426",
        "kanji": "深",
        "word": "deep"
    },
    {
        "id": "1427",
        "kanji": "丘",
        "word": "hill"
    },
    {
        "id": "1428",
        "kanji": "岳",
        "word": "Point"
    },
    {
        "id": "1429",
        "kanji": "兵",
        "word": "soldier"
    },
    {
        "id": "1430",
        "kanji": "浜",
        "word": "seacoast"
    },
    {
        "id": "1431",
        "kanji": "糸",
        "word": "thread"
    },
    {
        "id": "1432",
        "kanji": "織",
        "word": "weave"
    },
    {
        "id": "1433",
        "kanji": "繕",
        "word": "darning"
    },
    {
        "id": "1434",
        "kanji": "縮",
        "word": "shrink"
    },
    {
        "id": "1435",
        "kanji": "繁",
        "word": "luxuriant"
    },
    {
        "id": "1436",
        "kanji": "縦",
        "word": "vertical"
    },
    {
        "id": "1437",
        "kanji": "緻",
        "word": "fine"
    },
    {
        "id": "1438",
        "kanji": "線",
        "word": "line"
    },
    {
        "id": "1439",
        "kanji": "綻",
        "word": "come apart at the seams"
    },
    {
        "id": "1440",
        "kanji": "締",
        "word": "tighten"
    },
    {
        "id": "1441",
        "kanji": "維",
        "word": "fiber"
    },
    {
        "id": "1442",
        "kanji": "羅",
        "word": "gauze"
    },
    {
        "id": "1443",
        "kanji": "練",
        "word": "practice"
    },
    {
        "id": "1444",
        "kanji": "緒",
        "word": "thong"
    },
    {
        "id": "1445",
        "kanji": "続",
        "word": "continue"
    },
    {
        "id": "1446",
        "kanji": "絵",
        "word": "picture"
    },
    {
        "id": "1447",
        "kanji": "統",
        "word": "overall"
    },
    {
        "id": "1448",
        "kanji": "絞",
        "word": "strangle"
    },
    {
        "id": "1449",
        "kanji": "給",
        "word": "salary"
    },
    {
        "id": "1450",
        "kanji": "絡",
        "word": "entwine"
    },
    {
        "id": "1451",
        "kanji": "結",
        "word": "tie"
    },
    {
        "id": "1452",
        "kanji": "終",
        "word": "end"
    },
    {
        "id": "1453",
        "kanji": "級",
        "word": "class"
    },
    {
        "id": "1454",
        "kanji": "紀",
        "word": "chronicle"
    },
    {
        "id": "1455",
        "kanji": "紅",
        "word": "crimson"
    },
    {
        "id": "1456",
        "kanji": "納",
        "word": "settlement"
    },
    {
        "id": "1457",
        "kanji": "紡",
        "word": "spinning"
    },
    {
        "id": "1458",
        "kanji": "紛",
        "word": "distract"
    },
    {
        "id": "1459",
        "kanji": "紹",
        "word": "introduce"
    },
    {
        "id": "1460",
        "kanji": "経",
        "word": "sutra"
    },
    {
        "id": "1461",
        "kanji": "紳",
        "word": "sire"
    },
    {
        "id": "1462",
        "kanji": "約",
        "word": "promise"
    },
    {
        "id": "1463",
        "kanji": "細",
        "word": "dainty"
    },
    {
        "id": "1464",
        "kanji": "累",
        "word": "accumulate"
    },
    {
        "id": "1465",
        "kanji": "索",
        "word": "cord"
    },
    {
        "id": "1466",
        "kanji": "総",
        "word": "general"
    },
    {
        "id": "1467",
        "kanji": "綿",
        "word": "cotton"
    },
    {
        "id": "1468",
        "kanji": "絹",
        "word": "silk"
    },
    {
        "id": "1469",
        "kanji": "繰",
        "word": "winding"
    },
    {
        "id": "1470",
        "kanji": "継",
        "word": "inherit"
    },
    {
        "id": "1471",
        "kanji": "緑",
        "word": "green"
    },
    {
        "id": "1472",
        "kanji": "縁",
        "word": "affinity"
    },
    {
        "id": "1473",
        "kanji": "網",
        "word": "netting"
    },
    {
        "id": "1474",
        "kanji": "緊",
        "word": "tense"
    },
    {
        "id": "1475",
        "kanji": "紫",
        "word": "purple"
    },
    {
        "id": "1476",
        "kanji": "縛",
        "word": "truss"
    },
    {
        "id": "1477",
        "kanji": "縄",
        "word": "straw rope"
    },
    {
        "id": "1478",
        "kanji": "幼",
        "word": "infancy"
    },
    {
        "id": "1479",
        "kanji": "後",
        "word": "behind"
    },
    {
        "id": "1480",
        "kanji": "幽",
        "word": "faint"
    },
    {
        "id": "1481",
        "kanji": "幾",
        "word": "how many"
    },
    {
        "id": "1482",
        "kanji": "機",
        "word": "mechanism"
    },
    {
        "id": "1483",
        "kanji": "畿",
        "word": "capital suburbs"
    },
    {
        "id": "1484",
        "kanji": "玄",
        "word": "mysterious"
    },
    {
        "id": "1485",
        "kanji": "畜",
        "word": "livestock"
    },
    {
        "id": "1486",
        "kanji": "蓄",
        "word": "amass"
    },
    {
        "id": "1487",
        "kanji": "弦",
        "word": "bowstring"
    },
    {
        "id": "1488",
        "kanji": "擁",
        "word": "hug"
    },
    {
        "id": "1489",
        "kanji": "滋",
        "word": "nourishing"
    },
    {
        "id": "1490",
        "kanji": "慈",
        "word": "mercy"
    },
    {
        "id": "1491",
        "kanji": "磁",
        "word": "magnet"
    },
    {
        "id": "1492",
        "kanji": "系",
        "word": "lineage"
    },
    {
        "id": "1493",
        "kanji": "係",
        "word": "person in charge"
    },
    {
        "id": "1494",
        "kanji": "孫",
        "word": "grandchild"
    },
    {
        "id": "1495",
        "kanji": "懸",
        "word": "suspend"
    },
    {
        "id": "1496",
        "kanji": "遜",
        "word": "modest"
    },
    {
        "id": "1497",
        "kanji": "却",
        "word": "instead"
    },
    {
        "id": "1498",
        "kanji": "脚",
        "word": "shins"
    },
    {
        "id": "1499",
        "kanji": "卸",
        "word": "wholesale"
    },
    {
        "id": "1500",
        "kanji": "御",
        "word": "honorable"
    },
    {
        "id": "1501",
        "kanji": "服",
        "word": "clothing"
    },
    {
        "id": "1502",
        "kanji": "命",
        "word": "fate"
    },
    {
        "id": "1503",
        "kanji": "令",
        "word": "orders"
    },
    {
        "id": "1504",
        "kanji": "零",
        "word": "zero"
    },
    {
        "id": "1505",
        "kanji": "齢",
        "word": "age"
    },
    {
        "id": "1506",
        "kanji": "冷",
        "word": "cool"
    },
    {
        "id": "1507",
        "kanji": "領",
        "word": "jurisdiction"
    },
    {
        "id": "1508",
        "kanji": "鈴",
        "word": "small bell"
    },
    {
        "id": "1509",
        "kanji": "勇",
        "word": "courage"
    },
    {
        "id": "1510",
        "kanji": "湧",
        "word": "bubble up"
    },
    {
        "id": "1511",
        "kanji": "通",
        "word": "traffic"
    },
    {
        "id": "1512",
        "kanji": "踊",
        "word": "jump"
    },
    {
        "id": "1513",
        "kanji": "疑",
        "word": "doubt"
    },
    {
        "id": "1514",
        "kanji": "擬",
        "word": "mimic"
    },
    {
        "id": "1515",
        "kanji": "凝",
        "word": "congeal"
    },
    {
        "id": "1516",
        "kanji": "範",
        "word": "pattern"
    },
    {
        "id": "1517",
        "kanji": "犯",
        "word": "crime"
    },
    {
        "id": "1518",
        "kanji": "氾",
        "word": "widespread"
    },
    {
        "id": "1519",
        "kanji": "厄",
        "word": "unlucky"
    },
    {
        "id": "1520",
        "kanji": "危",
        "word": "dangerous"
    },
    {
        "id": "1521",
        "kanji": "宛",
        "word": "address"
    },
    {
        "id": "1522",
        "kanji": "腕",
        "word": "arm"
    },
    {
        "id": "1523",
        "kanji": "苑",
        "word": "garden"
    },
    {
        "id": "1524",
        "kanji": "怨",
        "word": "grudge"
    },
    {
        "id": "1525",
        "kanji": "柳",
        "word": "willow"
    },
    {
        "id": "1526",
        "kanji": "卵",
        "word": "egg"
    },
    {
        "id": "1527",
        "kanji": "留",
        "word": "detain"
    },
    {
        "id": "1528",
        "kanji": "瑠",
        "word": "marine blue"
    },
    {
        "id": "1529",
        "kanji": "貿",
        "word": "trade"
    },
    {
        "id": "1530",
        "kanji": "印",
        "word": "stamp"
    },
    {
        "id": "1531",
        "kanji": "臼",
        "word": "mortar"
    },
    {
        "id": "1532",
        "kanji": "毀",
        "word": "break"
    },
    {
        "id": "1533",
        "kanji": "興",
        "word": "entertain"
    },
    {
        "id": "1534",
        "kanji": "酉",
        "word": "sign of the bird"
    },
    {
        "id": "1535",
        "kanji": "酒",
        "word": "sake"
    },
    {
        "id": "1536",
        "kanji": "酌",
        "word": "bartending"
    },
    {
        "id": "1537",
        "kanji": "酎",
        "word": "hooch"
    },
    {
        "id": "1538",
        "kanji": "酵",
        "word": "fermentation"
    },
    {
        "id": "1539",
        "kanji": "酷",
        "word": "cruel"
    },
    {
        "id": "1540",
        "kanji": "酬",
        "word": "repay"
    },
    {
        "id": "1541",
        "kanji": "酪",
        "word": "dairy products"
    },
    {
        "id": "1542",
        "kanji": "酢",
        "word": "vinegar"
    },
    {
        "id": "1543",
        "kanji": "酔",
        "word": "drunk"
    },
    {
        "id": "1544",
        "kanji": "配",
        "word": "distribute"
    },
    {
        "id": "1545",
        "kanji": "酸",
        "word": "acid"
    },
    {
        "id": "1546",
        "kanji": "猶",
        "word": "waver"
    },
    {
        "id": "1547",
        "kanji": "尊",
        "word": "revered"
    },
    {
        "id": "1548",
        "kanji": "豆",
        "word": "beans"
    },
    {
        "id": "1549",
        "kanji": "頭",
        "word": "head"
    },
    {
        "id": "1550",
        "kanji": "短",
        "word": "short"
    },
    {
        "id": "1551",
        "kanji": "豊",
        "word": "bountiful"
    },
    {
        "id": "1552",
        "kanji": "鼓",
        "word": "drum"
    },
    {
        "id": "1553",
        "kanji": "喜",
        "word": "rejoice"
    },
    {
        "id": "1554",
        "kanji": "樹",
        "word": "timber-trees"
    },
    {
        "id": "1555",
        "kanji": "皿",
        "word": "dish"
    },
    {
        "id": "1556",
        "kanji": "血",
        "word": "blood"
    },
    {
        "id": "1557",
        "kanji": "盆",
        "word": "basin"
    },
    {
        "id": "1558",
        "kanji": "盟",
        "word": "alliance"
    },
    {
        "id": "1559",
        "kanji": "盗",
        "word": "steal"
    },
    {
        "id": "1560",
        "kanji": "温",
        "word": "warm"
    },
    {
        "id": "1561",
        "kanji": "蓋",
        "word": "lid"
    },
    {
        "id": "1562",
        "kanji": "監",
        "word": "oversee"
    },
    {
        "id": "1563",
        "kanji": "濫",
        "word": "overflow"
    },
    {
        "id": "1564",
        "kanji": "鑑",
        "word": "specimen"
    },
    {
        "id": "1565",
        "kanji": "藍",
        "word": "indigo"
    },
    {
        "id": "1566",
        "kanji": "猛",
        "word": "fierce"
    },
    {
        "id": "1567",
        "kanji": "盛",
        "word": "boom"
    },
    {
        "id": "1568",
        "kanji": "塩",
        "word": "salt"
    },
    {
        "id": "1569",
        "kanji": "銀",
        "word": "silver"
    },
    {
        "id": "1570",
        "kanji": "恨",
        "word": "resentment"
    },
    {
        "id": "1571",
        "kanji": "根",
        "word": "root"
    },
    {
        "id": "1572",
        "kanji": "即",
        "word": "instant"
    },
    {
        "id": "1573",
        "kanji": "爵",
        "word": "baron"
    },
    {
        "id": "1574",
        "kanji": "節",
        "word": "node"
    },
    {
        "id": "1575",
        "kanji": "退",
        "word": "retreat"
    },
    {
        "id": "1576",
        "kanji": "限",
        "word": "limit"
    },
    {
        "id": "1577",
        "kanji": "眼",
        "word": "eyeball"
    },
    {
        "id": "1578",
        "kanji": "良",
        "word": "good"
    },
    {
        "id": "1579",
        "kanji": "朗",
        "word": "melodious"
    },
    {
        "id": "1580",
        "kanji": "浪",
        "word": "wandering"
    },
    {
        "id": "1581",
        "kanji": "娘",
        "word": "daughter"
    },
    {
        "id": "1582",
        "kanji": "食",
        "word": "eat"
    },
    {
        "id": "1583",
        "kanji": "飯",
        "word": "meal"
    },
    {
        "id": "1584",
        "kanji": "飲",
        "word": "drink"
    },
    {
        "id": "1585",
        "kanji": "飢",
        "word": "hungry"
    },
    {
        "id": "1586",
        "kanji": "餓",
        "word": "starve"
    },
    {
        "id": "1587",
        "kanji": "飾",
        "word": "decorate"
    },
    {
        "id": "1588",
        "kanji": "餌",
        "word": "feed"
    },
    {
        "id": "1589",
        "kanji": "館",
        "word": "Bldg."
    },
    {
        "id": "1590",
        "kanji": "餅",
        "word": "mochi"
    },
    {
        "id": "1591",
        "kanji": "養",
        "word": "foster"
    },
    {
        "id": "1592",
        "kanji": "飽",
        "word": "sated"
    },
    {
        "id": "1593",
        "kanji": "既",
        "word": "previously"
    },
    {
        "id": "1594",
        "kanji": "概",
        "word": "outline"
    },
    {
        "id": "1595",
        "kanji": "慨",
        "word": "rue"
    },
    {
        "id": "1596",
        "kanji": "平",
        "word": "even"
    },
    {
        "id": "1597",
        "kanji": "呼",
        "word": "call"
    },
    {
        "id": "1598",
        "kanji": "坪",
        "word": "two-mat area"
    },
    {
        "id": "1599",
        "kanji": "評",
        "word": "evaluate"
    },
    {
        "id": "1600",
        "kanji": "刈",
        "word": "reap"
    },
    {
        "id": "1601",
        "kanji": "刹",
        "word": "moment"
    },
    {
        "id": "1602",
        "kanji": "希",
        "word": "hope"
    },
    {
        "id": "1603",
        "kanji": "凶",
        "word": "villain"
    },
    {
        "id": "1604",
        "kanji": "胸",
        "word": "bosom"
    },
    {
        "id": "1605",
        "kanji": "離",
        "word": "detach"
    },
    {
        "id": "1606",
        "kanji": "璃",
        "word": "crystal"
    },
    {
        "id": "1607",
        "kanji": "殺",
        "word": "kill"
    },
    {
        "id": "1608",
        "kanji": "爽",
        "word": "bracing"
    },
    {
        "id": "1609",
        "kanji": "純",
        "word": "genuine"
    },
    {
        "id": "1610",
        "kanji": "頓",
        "word": "immediate"
    },
    {
        "id": "1611",
        "kanji": "鈍",
        "word": "dull"
    },
    {
        "id": "1612",
        "kanji": "辛",
        "word": "spicy"
    },
    {
        "id": "1613",
        "kanji": "辞",
        "word": "resign"
    },
    {
        "id": "1614",
        "kanji": "梓",
        "word": "catalpa"
    },
    {
        "id": "1615",
        "kanji": "宰",
        "word": "superintend"
    },
    {
        "id": "1616",
        "kanji": "壁",
        "word": "wall"
    },
    {
        "id": "1617",
        "kanji": "璧",
        "word": "holed gem"
    },
    {
        "id": "1618",
        "kanji": "避",
        "word": "evade"
    },
    {
        "id": "1619",
        "kanji": "新",
        "word": "new"
    },
    {
        "id": "1620",
        "kanji": "薪",
        "word": "firewood"
    },
    {
        "id": "1621",
        "kanji": "親",
        "word": "parent"
    },
    {
        "id": "1622",
        "kanji": "幸",
        "word": "happiness"
    },
    {
        "id": "1623",
        "kanji": "執",
        "word": "tenacious"
    },
    {
        "id": "1624",
        "kanji": "摯",
        "word": "clasp"
    },
    {
        "id": "1625",
        "kanji": "報",
        "word": "report"
    },
    {
        "id": "1626",
        "kanji": "叫",
        "word": "shout"
    },
    {
        "id": "1627",
        "kanji": "糾",
        "word": "twist"
    },
    {
        "id": "1628",
        "kanji": "収",
        "word": "income"
    },
    {
        "id": "1629",
        "kanji": "卑",
        "word": "lowly"
    },
    {
        "id": "1630",
        "kanji": "碑",
        "word": "tombstone"
    },
    {
        "id": "1631",
        "kanji": "陸",
        "word": "land"
    },
    {
        "id": "1632",
        "kanji": "睦",
        "word": "intimate"
    },
    {
        "id": "1633",
        "kanji": "勢",
        "word": "forces"
    },
    {
        "id": "1634",
        "kanji": "熱",
        "word": "heat"
    },
    {
        "id": "1635",
        "kanji": "菱",
        "word": "diamond"
    },
    {
        "id": "1636",
        "kanji": "陵",
        "word": "mausoleum"
    },
    {
        "id": "1637",
        "kanji": "亥",
        "word": "sign of the hog"
    },
    {
        "id": "1638",
        "kanji": "核",
        "word": "nucleus"
    },
    {
        "id": "1639",
        "kanji": "刻",
        "word": "engrave"
    },
    {
        "id": "1640",
        "kanji": "該",
        "word": "above-stated"
    },
    {
        "id": "1641",
        "kanji": "骸",
        "word": "remains"
    },
    {
        "id": "1642",
        "kanji": "劾",
        "word": "censure"
    },
    {
        "id": "1643",
        "kanji": "述",
        "word": "mention"
    },
    {
        "id": "1644",
        "kanji": "術",
        "word": "art"
    },
    {
        "id": "1645",
        "kanji": "寒",
        "word": "cold"
    },
    {
        "id": "1646",
        "kanji": "塞",
        "word": "block up"
    },
    {
        "id": "1647",
        "kanji": "醸",
        "word": "brew"
    },
    {
        "id": "1648",
        "kanji": "譲",
        "word": "defer"
    },
    {
        "id": "1649",
        "kanji": "壌",
        "word": "lot"
    },
    {
        "id": "1650",
        "kanji": "嬢",
        "word": "lass"
    },
    {
        "id": "1651",
        "kanji": "毒",
        "word": "poison"
    },
    {
        "id": "1652",
        "kanji": "素",
        "word": "elementary"
    },
    {
        "id": "1653",
        "kanji": "麦",
        "word": "barley"
    },
    {
        "id": "1654",
        "kanji": "青",
        "word": "blue"
    },
    {
        "id": "1655",
        "kanji": "精",
        "word": "refined"
    },
    {
        "id": "1656",
        "kanji": "請",
        "word": "solicit"
    },
    {
        "id": "1657",
        "kanji": "情",
        "word": "feelings"
    },
    {
        "id": "1658",
        "kanji": "晴",
        "word": "clear up"
    },
    {
        "id": "1659",
        "kanji": "清",
        "word": "pure"
    },
    {
        "id": "1660",
        "kanji": "静",
        "word": "quiet"
    },
    {
        "id": "1661",
        "kanji": "責",
        "word": "blame"
    },
    {
        "id": "1662",
        "kanji": "績",
        "word": "exploits"
    },
    {
        "id": "1663",
        "kanji": "積",
        "word": "volume"
    },
    {
        "id": "1664",
        "kanji": "債",
        "word": "bond"
    },
    {
        "id": "1665",
        "kanji": "漬",
        "word": "pickling"
    },
    {
        "id": "1666",
        "kanji": "表",
        "word": "surface"
    },
    {
        "id": "1667",
        "kanji": "俵",
        "word": "bag"
    },
    {
        "id": "1668",
        "kanji": "潔",
        "word": "undefiled"
    },
    {
        "id": "1669",
        "kanji": "契",
        "word": "pledge"
    },
    {
        "id": "1670",
        "kanji": "喫",
        "word": "consume"
    },
    {
        "id": "1671",
        "kanji": "害",
        "word": "harm"
    },
    {
        "id": "1672",
        "kanji": "轄",
        "word": "control"
    },
    {
        "id": "1673",
        "kanji": "割",
        "word": "proportion"
    },
    {
        "id": "1674",
        "kanji": "憲",
        "word": "constitution"
    },
    {
        "id": "1675",
        "kanji": "生",
        "word": "life"
    },
    {
        "id": "1676",
        "kanji": "星",
        "word": "star"
    },
    {
        "id": "1677",
        "kanji": "醒",
        "word": "awakening"
    },
    {
        "id": "1678",
        "kanji": "姓",
        "word": "surname"
    },
    {
        "id": "1679",
        "kanji": "性",
        "word": "sex"
    },
    {
        "id": "1680",
        "kanji": "牲",
        "word": "animal sacrifice"
    },
    {
        "id": "1681",
        "kanji": "産",
        "word": "products"
    },
    {
        "id": "1682",
        "kanji": "隆",
        "word": "hump"
    },
    {
        "id": "1683",
        "kanji": "峰",
        "word": "summit"
    },
    {
        "id": "1684",
        "kanji": "蜂",
        "word": "bee"
    },
    {
        "id": "1685",
        "kanji": "縫",
        "word": "sew"
    },
    {
        "id": "1686",
        "kanji": "拝",
        "word": "worship"
    },
    {
        "id": "1687",
        "kanji": "寿",
        "word": "longevity"
    },
    {
        "id": "1688",
        "kanji": "鋳",
        "word": "casting"
    },
    {
        "id": "1689",
        "kanji": "籍",
        "word": "enroll"
    },
    {
        "id": "1690",
        "kanji": "春",
        "word": "springtime"
    },
    {
        "id": "1691",
        "kanji": "椿",
        "word": "camellia"
    },
    {
        "id": "1692",
        "kanji": "泰",
        "word": "peaceful"
    },
    {
        "id": "1693",
        "kanji": "奏",
        "word": "play music"
    },
    {
        "id": "1694",
        "kanji": "実",
        "word": "reality"
    },
    {
        "id": "1695",
        "kanji": "奉",
        "word": "dedicate"
    },
    {
        "id": "1696",
        "kanji": "俸",
        "word": "stipend"
    },
    {
        "id": "1697",
        "kanji": "棒",
        "word": "rod"
    },
    {
        "id": "1698",
        "kanji": "謹",
        "word": "discreet"
    },
    {
        "id": "1699",
        "kanji": "僅",
        "word": "trifle"
    },
    {
        "id": "1700",
        "kanji": "勤",
        "word": "diligence"
    },
    {
        "id": "1701",
        "kanji": "漢",
        "word": "Sino-"
    },
    {
        "id": "1702",
        "kanji": "嘆",
        "word": "sigh"
    },
    {
        "id": "1703",
        "kanji": "難",
        "word": "difficult"
    },
    {
        "id": "1704",
        "kanji": "華",
        "word": "splendor"
    },
    {
        "id": "1705",
        "kanji": "垂",
        "word": "droop"
    },
    {
        "id": "1706",
        "kanji": "唾",
        "word": "saliva"
    },
    {
        "id": "1707",
        "kanji": "睡",
        "word": "drowsy"
    },
    {
        "id": "1708",
        "kanji": "錘",
        "word": "spindle"
    },
    {
        "id": "1709",
        "kanji": "乗",
        "word": "ride"
    },
    {
        "id": "1710",
        "kanji": "剰",
        "word": "surplus"
    },
    {
        "id": "1711",
        "kanji": "今",
        "word": "now"
    },
    {
        "id": "1712",
        "kanji": "含",
        "word": "include"
    },
    {
        "id": "1713",
        "kanji": "貪",
        "word": "covet"
    },
    {
        "id": "1714",
        "kanji": "吟",
        "word": "versify"
    },
    {
        "id": "1715",
        "kanji": "念",
        "word": "wish"
    },
    {
        "id": "1716",
        "kanji": "捻",
        "word": "wrench"
    },
    {
        "id": "1717",
        "kanji": "琴",
        "word": "harp"
    },
    {
        "id": "1718",
        "kanji": "陰",
        "word": "shade"
    },
    {
        "id": "1719",
        "kanji": "予",
        "word": "beforehand"
    },
    {
        "id": "1720",
        "kanji": "序",
        "word": "preface"
    },
    {
        "id": "1721",
        "kanji": "預",
        "word": "deposit"
    },
    {
        "id": "1722",
        "kanji": "野",
        "word": "plains"
    },
    {
        "id": "1723",
        "kanji": "兼",
        "word": "concurrently"
    },
    {
        "id": "1724",
        "kanji": "嫌",
        "word": "dislike"
    },
    {
        "id": "1725",
        "kanji": "鎌",
        "word": "sickle"
    },
    {
        "id": "1726",
        "kanji": "謙",
        "word": "self-effacing"
    },
    {
        "id": "1727",
        "kanji": "廉",
        "word": "bargain"
    },
    {
        "id": "1728",
        "kanji": "西",
        "word": "west"
    },
    {
        "id": "1729",
        "kanji": "価",
        "word": "value"
    },
    {
        "id": "1730",
        "kanji": "要",
        "word": "need"
    },
    {
        "id": "1731",
        "kanji": "腰",
        "word": "loins"
    },
    {
        "id": "1732",
        "kanji": "票",
        "word": "ballot"
    },
    {
        "id": "1733",
        "kanji": "漂",
        "word": "drift"
    },
    {
        "id": "1734",
        "kanji": "標",
        "word": "signpost"
    },
    {
        "id": "1735",
        "kanji": "栗",
        "word": "chestnut"
    },
    {
        "id": "1736",
        "kanji": "慄",
        "word": "shudder"
    },
    {
        "id": "1737",
        "kanji": "遷",
        "word": "transition"
    },
    {
        "id": "1738",
        "kanji": "覆",
        "word": "capsize"
    },
    {
        "id": "1739",
        "kanji": "煙",
        "word": "smoke"
    },
    {
        "id": "1740",
        "kanji": "南",
        "word": "south"
    },
    {
        "id": "1741",
        "kanji": "楠",
        "word": "camphor tree"
    },
    {
        "id": "1742",
        "kanji": "献",
        "word": "offering"
    },
    {
        "id": "1743",
        "kanji": "門",
        "word": "gates"
    },
    {
        "id": "1744",
        "kanji": "問",
        "word": "question"
    },
    {
        "id": "1745",
        "kanji": "閲",
        "word": "review"
    },
    {
        "id": "1746",
        "kanji": "閥",
        "word": "clique"
    },
    {
        "id": "1747",
        "kanji": "間",
        "word": "interval"
    },
    {
        "id": "1748",
        "kanji": "闇",
        "word": "pitch dark"
    },
    {
        "id": "1749",
        "kanji": "簡",
        "word": "simplicity"
    },
    {
        "id": "1750",
        "kanji": "開",
        "word": "open"
    },
    {
        "id": "1751",
        "kanji": "閉",
        "word": "closed"
    },
    {
        "id": "1752",
        "kanji": "閣",
        "word": "tower"
    },
    {
        "id": "1753",
        "kanji": "閑",
        "word": "leisure"
    },
    {
        "id": "1754",
        "kanji": "聞",
        "word": "hear"
    },
    {
        "id": "1755",
        "kanji": "潤",
        "word": "wet"
    },
    {
        "id": "1756",
        "kanji": "欄",
        "word": "column"
    },
    {
        "id": "1757",
        "kanji": "闘",
        "word": "fight"
    },
    {
        "id": "1758",
        "kanji": "倉",
        "word": "godown"
    },
    {
        "id": "1759",
        "kanji": "創",
        "word": "genesis"
    },
    {
        "id": "1760",
        "kanji": "非",
        "word": "un-"
    },
    {
        "id": "1761",
        "kanji": "俳",
        "word": "haiku"
    },
    {
        "id": "1762",
        "kanji": "排",
        "word": "repudiate"
    },
    {
        "id": "1763",
        "kanji": "悲",
        "word": "sad"
    },
    {
        "id": "1764",
        "kanji": "罪",
        "word": "guilt"
    },
    {
        "id": "1765",
        "kanji": "輩",
        "word": "comrade"
    },
    {
        "id": "1766",
        "kanji": "扉",
        "word": "front door"
    },
    {
        "id": "1767",
        "kanji": "侯",
        "word": "marquis"
    },
    {
        "id": "1768",
        "kanji": "喉",
        "word": "throat"
    },
    {
        "id": "1769",
        "kanji": "候",
        "word": "climate"
    },
    {
        "id": "1770",
        "kanji": "決",
        "word": "decide"
    },
    {
        "id": "1771",
        "kanji": "快",
        "word": "cheerful"
    },
    {
        "id": "1772",
        "kanji": "偉",
        "word": "admirable"
    },
    {
        "id": "1773",
        "kanji": "違",
        "word": "difference"
    },
    {
        "id": "1774",
        "kanji": "緯",
        "word": "horizontal"
    },
    {
        "id": "1775",
        "kanji": "衛",
        "word": "defense"
    },
    {
        "id": "1776",
        "kanji": "韓",
        "word": "Korea"
    },
    {
        "id": "1777",
        "kanji": "干",
        "word": "dry"
    },
    {
        "id": "1778",
        "kanji": "肝",
        "word": "liver"
    },
    {
        "id": "1779",
        "kanji": "刊",
        "word": "publish"
    },
    {
        "id": "1780",
        "kanji": "汗",
        "word": "sweat"
    },
    {
        "id": "1781",
        "kanji": "軒",
        "word": "flats"
    },
    {
        "id": "1782",
        "kanji": "岸",
        "word": "beach"
    },
    {
        "id": "1783",
        "kanji": "幹",
        "word": "tree trunk"
    },
    {
        "id": "1784",
        "kanji": "芋",
        "word": "potato"
    },
    {
        "id": "1785",
        "kanji": "宇",
        "word": "eaves"
    },
    {
        "id": "1786",
        "kanji": "余",
        "word": "too much"
    },
    {
        "id": "1787",
        "kanji": "除",
        "word": "exclude"
    },
    {
        "id": "1788",
        "kanji": "徐",
        "word": "gradually"
    },
    {
        "id": "1789",
        "kanji": "叙",
        "word": "confer"
    },
    {
        "id": "1790",
        "kanji": "途",
        "word": "route"
    },
    {
        "id": "1791",
        "kanji": "斜",
        "word": "diagonal"
    },
    {
        "id": "1792",
        "kanji": "塗",
        "word": "paint"
    },
    {
        "id": "1793",
        "kanji": "束",
        "word": "bundle"
    },
    {
        "id": "1794",
        "kanji": "頼",
        "word": "trust"
    },
    {
        "id": "1795",
        "kanji": "瀬",
        "word": "rapids"
    },
    {
        "id": "1796",
        "kanji": "勅",
        "word": "imperial order"
    },
    {
        "id": "1797",
        "kanji": "疎",
        "word": "alienate"
    },
    {
        "id": "1798",
        "kanji": "辣",
        "word": "bitter"
    },
    {
        "id": "1799",
        "kanji": "速",
        "word": "quick"
    },
    {
        "id": "1800",
        "kanji": "整",
        "word": "organize"
    },
    {
        "id": "1801",
        "kanji": "剣",
        "word": "saber"
    },
    {
        "id": "1802",
        "kanji": "険",
        "word": "precipitous"
    },
    {
        "id": "1803",
        "kanji": "検",
        "word": "examination"
    },
    {
        "id": "1804",
        "kanji": "倹",
        "word": "frugal"
    },
    {
        "id": "1805",
        "kanji": "重",
        "word": "heavy"
    },
    {
        "id": "1806",
        "kanji": "動",
        "word": "move"
    },
    {
        "id": "1807",
        "kanji": "腫",
        "word": "tumor"
    },
    {
        "id": "1808",
        "kanji": "勲",
        "word": "meritorious deed"
    },
    {
        "id": "1809",
        "kanji": "働",
        "word": "work"
    },
    {
        "id": "1810",
        "kanji": "種",
        "word": "species"
    },
    {
        "id": "1811",
        "kanji": "衝",
        "word": "collide"
    },
    {
        "id": "1812",
        "kanji": "薫",
        "word": "fragrant"
    },
    {
        "id": "1813",
        "kanji": "病",
        "word": "ill"
    },
    {
        "id": "1814",
        "kanji": "痴",
        "word": "stupid"
    },
    {
        "id": "1815",
        "kanji": "痘",
        "word": "pox"
    },
    {
        "id": "1816",
        "kanji": "症",
        "word": "symptoms"
    },
    {
        "id": "1817",
        "kanji": "瘍",
        "word": "carbuncle"
    },
    {
        "id": "1818",
        "kanji": "痩",
        "word": "lose weight"
    },
    {
        "id": "1819",
        "kanji": "疾",
        "word": "rapidly"
    },
    {
        "id": "1820",
        "kanji": "嫉",
        "word": "envy"
    },
    {
        "id": "1821",
        "kanji": "痢",
        "word": "diarrhea"
    },
    {
        "id": "1822",
        "kanji": "痕",
        "word": "scar"
    },
    {
        "id": "1823",
        "kanji": "疲",
        "word": "tired"
    },
    {
        "id": "1824",
        "kanji": "疫",
        "word": "epidemic"
    },
    {
        "id": "1825",
        "kanji": "痛",
        "word": "pain"
    },
    {
        "id": "1826",
        "kanji": "癖",
        "word": "mannerism"
    },
    {
        "id": "1827",
        "kanji": "匿",
        "word": "hide"
    },
    {
        "id": "1828",
        "kanji": "匠",
        "word": "artisan"
    },
    {
        "id": "1829",
        "kanji": "医",
        "word": "doctor"
    },
    {
        "id": "1830",
        "kanji": "匹",
        "word": "equal"
    },
    {
        "id": "1831",
        "kanji": "区",
        "word": "ward"
    },
    {
        "id": "1832",
        "kanji": "枢",
        "word": "hinge"
    },
    {
        "id": "1833",
        "kanji": "殴",
        "word": "assault"
    },
    {
        "id": "1834",
        "kanji": "欧",
        "word": "Europe"
    },
    {
        "id": "1835",
        "kanji": "抑",
        "word": "repress"
    },
    {
        "id": "1836",
        "kanji": "仰",
        "word": "faceup"
    },
    {
        "id": "1837",
        "kanji": "迎",
        "word": "welcome"
    },
    {
        "id": "1838",
        "kanji": "登",
        "word": "ascend"
    },
    {
        "id": "1839",
        "kanji": "澄",
        "word": "lucidity"
    },
    {
        "id": "1840",
        "kanji": "発",
        "word": "discharge"
    },
    {
        "id": "1841",
        "kanji": "廃",
        "word": "abolish"
    },
    {
        "id": "1842",
        "kanji": "僚",
        "word": "colleague"
    },
    {
        "id": "1843",
        "kanji": "瞭",
        "word": "obvious"
    },
    {
        "id": "1844",
        "kanji": "寮",
        "word": "dormitory"
    },
    {
        "id": "1845",
        "kanji": "療",
        "word": "heal"
    },
    {
        "id": "1846",
        "kanji": "彫",
        "word": "carve"
    },
    {
        "id": "1847",
        "kanji": "形",
        "word": "shape"
    },
    {
        "id": "1848",
        "kanji": "影",
        "word": "shadow"
    },
    {
        "id": "1849",
        "kanji": "杉",
        "word": "cedar"
    },
    {
        "id": "1850",
        "kanji": "彩",
        "word": "coloring"
    },
    {
        "id": "1851",
        "kanji": "彰",
        "word": "patent"
    },
    {
        "id": "1852",
        "kanji": "彦",
        "word": "lad"
    },
    {
        "id": "1853",
        "kanji": "顔",
        "word": "face"
    },
    {
        "id": "1854",
        "kanji": "須",
        "word": "ought"
    },
    {
        "id": "1855",
        "kanji": "膨",
        "word": "swell"
    },
    {
        "id": "1856",
        "kanji": "参",
        "word": "visit"
    },
    {
        "id": "1857",
        "kanji": "惨",
        "word": "wretched"
    },
    {
        "id": "1858",
        "kanji": "修",
        "word": "discipline"
    },
    {
        "id": "1859",
        "kanji": "珍",
        "word": "rare"
    },
    {
        "id": "1860",
        "kanji": "診",
        "word": "checkup"
    },
    {
        "id": "1861",
        "kanji": "文",
        "word": "sentence"
    },
    {
        "id": "1862",
        "kanji": "対",
        "word": "vis-a-vis"
    },
    {
        "id": "1863",
        "kanji": "紋",
        "word": "family crest"
    },
    {
        "id": "1864",
        "kanji": "蚊",
        "word": "mosquito"
    },
    {
        "id": "1865",
        "kanji": "斑",
        "word": "speckled"
    },
    {
        "id": "1866",
        "kanji": "斉",
        "word": "adjusted"
    },
    {
        "id": "1867",
        "kanji": "剤",
        "word": "dose"
    },
    {
        "id": "1868",
        "kanji": "済",
        "word": "finish"
    },
    {
        "id": "1869",
        "kanji": "斎",
        "word": "purification"
    },
    {
        "id": "1870",
        "kanji": "粛",
        "word": "solemn"
    },
    {
        "id": "1871",
        "kanji": "塁",
        "word": "bases"
    },
    {
        "id": "1872",
        "kanji": "楽",
        "word": "music"
    },
    {
        "id": "1873",
        "kanji": "薬",
        "word": "medicine"
    },
    {
        "id": "1874",
        "kanji": "率",
        "word": "ratio"
    },
    {
        "id": "1875",
        "kanji": "渋",
        "word": "astringent"
    },
    {
        "id": "1876",
        "kanji": "摂",
        "word": "vicarious"
    },
    {
        "id": "1877",
        "kanji": "央",
        "word": "center"
    },
    {
        "id": "1878",
        "kanji": "英",
        "word": "England"
    },
    {
        "id": "1879",
        "kanji": "映",
        "word": "reflect"
    },
    {
        "id": "1880",
        "kanji": "赤",
        "word": "red"
    },
    {
        "id": "1881",
        "kanji": "赦",
        "word": "pardon"
    },
    {
        "id": "1882",
        "kanji": "変",
        "word": "unusual"
    },
    {
        "id": "1883",
        "kanji": "跡",
        "word": "tracks"
    },
    {
        "id": "1884",
        "kanji": "蛮",
        "word": "barbarian"
    },
    {
        "id": "1885",
        "kanji": "恋",
        "word": "romance"
    },
    {
        "id": "1886",
        "kanji": "湾",
        "word": "gulf"
    },
    {
        "id": "1887",
        "kanji": "黄",
        "word": "yellow"
    },
    {
        "id": "1888",
        "kanji": "横",
        "word": "sideways"
    },
    {
        "id": "1889",
        "kanji": "把",
        "word": "grasp"
    },
    {
        "id": "1890",
        "kanji": "色",
        "word": "color"
    },
    {
        "id": "1891",
        "kanji": "絶",
        "word": "discontinue"
    },
    {
        "id": "1892",
        "kanji": "艶",
        "word": "glossy"
    },
    {
        "id": "1893",
        "kanji": "肥",
        "word": "fertilizer"
    },
    {
        "id": "1894",
        "kanji": "甘",
        "word": "sweet"
    },
    {
        "id": "1895",
        "kanji": "紺",
        "word": "navy blue"
    },
    {
        "id": "1896",
        "kanji": "某",
        "word": "so-and-so"
    },
    {
        "id": "1897",
        "kanji": "謀",
        "word": "conspire"
    },
    {
        "id": "1898",
        "kanji": "媒",
        "word": "mediator"
    },
    {
        "id": "1899",
        "kanji": "欺",
        "word": "deceit"
    },
    {
        "id": "1900",
        "kanji": "棋",
        "word": "chess piece"
    },
    {
        "id": "1901",
        "kanji": "旗",
        "word": "national flag"
    },
    {
        "id": "1902",
        "kanji": "期",
        "word": "period"
    },
    {
        "id": "1903",
        "kanji": "碁",
        "word": "Go"
    },
    {
        "id": "1904",
        "kanji": "基",
        "word": "fundamentals"
    },
    {
        "id": "1905",
        "kanji": "甚",
        "word": "tremendously"
    },
    {
        "id": "1906",
        "kanji": "勘",
        "word": "intuition"
    },
    {
        "id": "1907",
        "kanji": "堪",
        "word": "withstand"
    },
    {
        "id": "1908",
        "kanji": "貴",
        "word": "precious"
    },
    {
        "id": "1909",
        "kanji": "遺",
        "word": "bequeath"
    },
    {
        "id": "1910",
        "kanji": "遣",
        "word": "dispatch"
    },
    {
        "id": "1911",
        "kanji": "潰",
        "word": "defile"
    },
    {
        "id": "1912",
        "kanji": "舞",
        "word": "dance"
    },
    {
        "id": "1913",
        "kanji": "無",
        "word": "nothingness"
    },
    {
        "id": "1914",
        "kanji": "組",
        "word": "association"
    },
    {
        "id": "1915",
        "kanji": "粗",
        "word": "coarse"
    },
    {
        "id": "1916",
        "kanji": "租",
        "word": "tariff"
    },
    {
        "id": "1917",
        "kanji": "狙",
        "word": "aim at"
    },
    {
        "id": "1918",
        "kanji": "祖",
        "word": "ancestor"
    },
    {
        "id": "1919",
        "kanji": "阻",
        "word": "thwart"
    },
    {
        "id": "1920",
        "kanji": "査",
        "word": "investigate"
    },
    {
        "id": "1921",
        "kanji": "助",
        "word": "help"
    },
    {
        "id": "1922",
        "kanji": "宜",
        "word": "best regards"
    },
    {
        "id": "1923",
        "kanji": "畳",
        "word": "tatami mat"
    },
    {
        "id": "1924",
        "kanji": "並",
        "word": "row"
    },
    {
        "id": "1925",
        "kanji": "普",
        "word": "universal"
    },
    {
        "id": "1926",
        "kanji": "譜",
        "word": "musical score"
    },
    {
        "id": "1927",
        "kanji": "湿",
        "word": "damp"
    },
    {
        "id": "1928",
        "kanji": "顕",
        "word": "appear"
    },
    {
        "id": "1929",
        "kanji": "繊",
        "word": "slender"
    },
    {
        "id": "1930",
        "kanji": "霊",
        "word": "spirits"
    },
    {
        "id": "1931",
        "kanji": "業",
        "word": "profession"
    },
    {
        "id": "1932",
        "kanji": "撲",
        "word": "slap"
    },
    {
        "id": "1933",
        "kanji": "僕",
        "word": "me"
    },
    {
        "id": "1934",
        "kanji": "共",
        "word": "together"
    },
    {
        "id": "1935",
        "kanji": "供",
        "word": "submit"
    },
    {
        "id": "1936",
        "kanji": "異",
        "word": "uncommon"
    },
    {
        "id": "1937",
        "kanji": "翼",
        "word": "wing"
    },
    {
        "id": "1938",
        "kanji": "戴",
        "word": "accept humbly"
    },
    {
        "id": "1939",
        "kanji": "洪",
        "word": "deluge"
    },
    {
        "id": "1940",
        "kanji": "港",
        "word": "harbor"
    },
    {
        "id": "1941",
        "kanji": "暴",
        "word": "outburst"
    },
    {
        "id": "1942",
        "kanji": "爆",
        "word": "bomb"
    },
    {
        "id": "1943",
        "kanji": "恭",
        "word": "respect"
    },
    {
        "id": "1944",
        "kanji": "選",
        "word": "elect"
    },
    {
        "id": "1945",
        "kanji": "殿",
        "word": "Mr."
    },
    {
        "id": "1946",
        "kanji": "井",
        "word": "well"
    },
    {
        "id": "1947",
        "kanji": "丼",
        "word": "donburi"
    },
    {
        "id": "1948",
        "kanji": "囲",
        "word": "surround"
    },
    {
        "id": "1949",
        "kanji": "耕",
        "word": "till"
    },
    {
        "id": "1950",
        "kanji": "亜",
        "word": "Asia"
    },
    {
        "id": "1951",
        "kanji": "悪",
        "word": "bad"
    },
    {
        "id": "1952",
        "kanji": "円",
        "word": "circle"
    },
    {
        "id": "1953",
        "kanji": "角",
        "word": "angle"
    },
    {
        "id": "1954",
        "kanji": "触",
        "word": "contact"
    },
    {
        "id": "1955",
        "kanji": "解",
        "word": "unravel"
    },
    {
        "id": "1956",
        "kanji": "再",
        "word": "again"
    },
    {
        "id": "1957",
        "kanji": "講",
        "word": "lecture"
    },
    {
        "id": "1958",
        "kanji": "購",
        "word": "subscription"
    },
    {
        "id": "1959",
        "kanji": "構",
        "word": "posture"
    },
    {
        "id": "1960",
        "kanji": "溝",
        "word": "gutter"
    },
    {
        "id": "1961",
        "kanji": "論",
        "word": "argument"
    },
    {
        "id": "1962",
        "kanji": "倫",
        "word": "ethics"
    },
    {
        "id": "1963",
        "kanji": "輪",
        "word": "wheel"
    },
    {
        "id": "1964",
        "kanji": "偏",
        "word": "partial"
    },
    {
        "id": "1965",
        "kanji": "遍",
        "word": "everywhere"
    },
    {
        "id": "1966",
        "kanji": "編",
        "word": "compilation"
    },
    {
        "id": "1967",
        "kanji": "冊",
        "word": "tome"
    },
    {
        "id": "1968",
        "kanji": "柵",
        "word": "palisade"
    },
    {
        "id": "1969",
        "kanji": "典",
        "word": "code"
    },
    {
        "id": "1970",
        "kanji": "氏",
        "word": "family name"
    },
    {
        "id": "1971",
        "kanji": "紙",
        "word": "paper"
    },
    {
        "id": "1972",
        "kanji": "婚",
        "word": "marriage"
    },
    {
        "id": "1973",
        "kanji": "低",
        "word": "lower"
    },
    {
        "id": "1974",
        "kanji": "抵",
        "word": "resist"
    },
    {
        "id": "1975",
        "kanji": "底",
        "word": "bottom"
    },
    {
        "id": "1976",
        "kanji": "民",
        "word": "people"
    },
    {
        "id": "1977",
        "kanji": "眠",
        "word": "sleep"
    },
    {
        "id": "1978",
        "kanji": "捕",
        "word": "catch"
    },
    {
        "id": "1979",
        "kanji": "哺",
        "word": "suckle"
    },
    {
        "id": "1980",
        "kanji": "浦",
        "word": "bay"
    },
    {
        "id": "1981",
        "kanji": "蒲",
        "word": "bullrush"
    },
    {
        "id": "1982",
        "kanji": "舗",
        "word": "shop"
    },
    {
        "id": "1983",
        "kanji": "補",
        "word": "supplement"
    },
    {
        "id": "1984",
        "kanji": "邸",
        "word": "residence"
    },
    {
        "id": "1985",
        "kanji": "郭",
        "word": "enclosure"
    },
    {
        "id": "1986",
        "kanji": "郡",
        "word": "county"
    },
    {
        "id": "1987",
        "kanji": "郊",
        "word": "outskirts"
    },
    {
        "id": "1988",
        "kanji": "部",
        "word": "section"
    },
    {
        "id": "1989",
        "kanji": "都",
        "word": "metropolis"
    },
    {
        "id": "1990",
        "kanji": "郵",
        "word": "mail"
    },
    {
        "id": "1991",
        "kanji": "邦",
        "word": "home country"
    },
    {
        "id": "1992",
        "kanji": "那",
        "word": "interrogative"
    },
    {
        "id": "1993",
        "kanji": "郷",
        "word": "hometown"
    },
    {
        "id": "1994",
        "kanji": "響",
        "word": "echo"
    },
    {
        "id": "1995",
        "kanji": "郎",
        "word": "son"
    },
    {
        "id": "1996",
        "kanji": "廊",
        "word": "corridor"
    },
    {
        "id": "1997",
        "kanji": "盾",
        "word": "shield"
    },
    {
        "id": "1998",
        "kanji": "循",
        "word": "sequential"
    },
    {
        "id": "1999",
        "kanji": "派",
        "word": "faction"
    },
    {
        "id": "2000",
        "kanji": "脈",
        "word": "vein"
    },
    {
        "id": "2001",
        "kanji": "衆",
        "word": "masses"
    },
    {
        "id": "2002",
        "kanji": "逓",
        "word": "parcel post"
    },
    {
        "id": "2003",
        "kanji": "段",
        "word": "grade"
    },
    {
        "id": "2004",
        "kanji": "鍛",
        "word": "forge"
    },
    {
        "id": "2005",
        "kanji": "后",
        "word": "empress"
    },
    {
        "id": "2006",
        "kanji": "幻",
        "word": "phantasm"
    },
    {
        "id": "2007",
        "kanji": "司",
        "word": "director"
    },
    {
        "id": "2008",
        "kanji": "伺",
        "word": "pay respects"
    },
    {
        "id": "2009",
        "kanji": "詞",
        "word": "parts of speech"
    },
    {
        "id": "2010",
        "kanji": "飼",
        "word": "domesticate"
    },
    {
        "id": "2011",
        "kanji": "嗣",
        "word": "heir"
    },
    {
        "id": "2012",
        "kanji": "舟",
        "word": "boat"
    },
    {
        "id": "2013",
        "kanji": "舶",
        "word": "liner"
    },
    {
        "id": "2014",
        "kanji": "航",
        "word": "navigate"
    },
    {
        "id": "2015",
        "kanji": "舷",
        "word": "gunwale"
    },
    {
        "id": "2016",
        "kanji": "般",
        "word": "carrier"
    },
    {
        "id": "2017",
        "kanji": "盤",
        "word": "tray"
    },
    {
        "id": "2018",
        "kanji": "搬",
        "word": "conveyor"
    },
    {
        "id": "2019",
        "kanji": "船",
        "word": "ship"
    },
    {
        "id": "2020",
        "kanji": "艦",
        "word": "warship"
    },
    {
        "id": "2021",
        "kanji": "艇",
        "word": "rowboat"
    },
    {
        "id": "2022",
        "kanji": "瓜",
        "word": "melon"
    },
    {
        "id": "2023",
        "kanji": "弧",
        "word": "arc"
    },
    {
        "id": "2024",
        "kanji": "孤",
        "word": "orphan"
    },
    {
        "id": "2025",
        "kanji": "繭",
        "word": "cocoon"
    },
    {
        "id": "2026",
        "kanji": "益",
        "word": "benefit"
    },
    {
        "id": "2027",
        "kanji": "暇",
        "word": "spare time"
    },
    {
        "id": "2028",
        "kanji": "敷",
        "word": "spread"
    },
    {
        "id": "2029",
        "kanji": "来",
        "word": "come"
    },
    {
        "id": "2030",
        "kanji": "気",
        "word": "spirit"
    },
    {
        "id": "2031",
        "kanji": "汽",
        "word": "vapor"
    },
    {
        "id": "2032",
        "kanji": "飛",
        "word": "fly"
    },
    {
        "id": "2033",
        "kanji": "沈",
        "word": "sink"
    },
    {
        "id": "2034",
        "kanji": "枕",
        "word": "pillow"
    },
    {
        "id": "2035",
        "kanji": "妻",
        "word": "wife"
    },
    {
        "id": "2036",
        "kanji": "凄",
        "word": "nifty"
    },
    {
        "id": "2037",
        "kanji": "衰",
        "word": "decline"
    },
    {
        "id": "2038",
        "kanji": "衷",
        "word": "inmost"
    },
    {
        "id": "2039",
        "kanji": "面",
        "word": "mask"
    },
    {
        "id": "2040",
        "kanji": "麺",
        "word": "noodles"
    },
    {
        "id": "2041",
        "kanji": "革",
        "word": "leather"
    },
    {
        "id": "2042",
        "kanji": "靴",
        "word": "shoes"
    },
    {
        "id": "2043",
        "kanji": "覇",
        "word": "hegemony"
    },
    {
        "id": "2044",
        "kanji": "声",
        "word": "voice"
    },
    {
        "id": "2045",
        "kanji": "眉",
        "word": "eyebrow"
    },
    {
        "id": "2046",
        "kanji": "呉",
        "word": "give"
    },
    {
        "id": "2047",
        "kanji": "娯",
        "word": "recreation"
    },
    {
        "id": "2048",
        "kanji": "誤",
        "word": "mistake"
    },
    {
        "id": "2049",
        "kanji": "蒸",
        "word": "steam"
    },
    {
        "id": "2050",
        "kanji": "承",
        "word": "acquiesce"
    },
    {
        "id": "2051",
        "kanji": "函",
        "word": "bin"
    },
    {
        "id": "2052",
        "kanji": "極",
        "word": "poles"
    },
    {
        "id": "2053",
        "kanji": "牙",
        "word": "tusk"
    },
    {
        "id": "2054",
        "kanji": "芽",
        "word": "bud"
    },
    {
        "id": "2055",
        "kanji": "邪",
        "word": "wicked"
    },
    {
        "id": "2056",
        "kanji": "雅",
        "word": "gracious"
    },
    {
        "id": "2057",
        "kanji": "釈",
        "word": "interpretation"
    },
    {
        "id": "2058",
        "kanji": "番",
        "word": "turn"
    },
    {
        "id": "2059",
        "kanji": "審",
        "word": "hearing"
    },
    {
        "id": "2060",
        "kanji": "翻",
        "word": "flip"
    },
    {
        "id": "2061",
        "kanji": "藩",
        "word": "clan"
    },
    {
        "id": "2062",
        "kanji": "毛",
        "word": "fur"
    },
    {
        "id": "2063",
        "kanji": "耗",
        "word": "decrease"
    },
    {
        "id": "2064",
        "kanji": "尾",
        "word": "tail"
    },
    {
        "id": "2065",
        "kanji": "宅",
        "word": "home"
    },
    {
        "id": "2066",
        "kanji": "託",
        "word": "consign"
    },
    {
        "id": "2067",
        "kanji": "為",
        "word": "do"
    },
    {
        "id": "2068",
        "kanji": "偽",
        "word": "falsehood"
    },
    {
        "id": "2069",
        "kanji": "畏",
        "word": "apprehensive"
    },
    {
        "id": "2070",
        "kanji": "長",
        "word": "long"
    },
    {
        "id": "2071",
        "kanji": "張",
        "word": "lengthen"
    },
    {
        "id": "2072",
        "kanji": "帳",
        "word": "notebook"
    },
    {
        "id": "2073",
        "kanji": "脹",
        "word": "dilate"
    },
    {
        "id": "2074",
        "kanji": "髪",
        "word": "hair of the head"
    },
    {
        "id": "2075",
        "kanji": "展",
        "word": "unfold"
    },
    {
        "id": "2076",
        "kanji": "喪",
        "word": "miss"
    },
    {
        "id": "2077",
        "kanji": "巣",
        "word": "nest"
    },
    {
        "id": "2078",
        "kanji": "単",
        "word": "simple"
    },
    {
        "id": "2079",
        "kanji": "戦",
        "word": "war"
    },
    {
        "id": "2080",
        "kanji": "禅",
        "word": "Zen"
    },
    {
        "id": "2081",
        "kanji": "弾",
        "word": "bullet"
    },
    {
        "id": "2082",
        "kanji": "桜",
        "word": "cherry tree"
    },
    {
        "id": "2083",
        "kanji": "獣",
        "word": "animal"
    },
    {
        "id": "2084",
        "kanji": "脳",
        "word": "brain"
    },
    {
        "id": "2085",
        "kanji": "悩",
        "word": "trouble"
    },
    {
        "id": "2086",
        "kanji": "厳",
        "word": "stern"
    },
    {
        "id": "2087",
        "kanji": "鎖",
        "word": "chain"
    },
    {
        "id": "2088",
        "kanji": "挙",
        "word": "raise"
    },
    {
        "id": "2089",
        "kanji": "誉",
        "word": "reputation"
    },
    {
        "id": "2090",
        "kanji": "猟",
        "word": "game hunting"
    },
    {
        "id": "2091",
        "kanji": "鳥",
        "word": "bird"
    },
    {
        "id": "2092",
        "kanji": "鳴",
        "word": "chirp"
    },
    {
        "id": "2093",
        "kanji": "鶴",
        "word": "crane"
    },
    {
        "id": "2094",
        "kanji": "烏",
        "word": "crow"
    },
    {
        "id": "2095",
        "kanji": "蔦",
        "word": "vine"
    },
    {
        "id": "2096",
        "kanji": "鳩",
        "word": "pigeon"
    },
    {
        "id": "2097",
        "kanji": "鶏",
        "word": "chicken"
    },
    {
        "id": "2098",
        "kanji": "島",
        "word": "island"
    },
    {
        "id": "2099",
        "kanji": "暖",
        "word": "warmth"
    },
    {
        "id": "2100",
        "kanji": "媛",
        "word": "beautiful woman"
    },
    {
        "id": "2101",
        "kanji": "援",
        "word": "abet"
    },
    {
        "id": "2102",
        "kanji": "緩",
        "word": "slacken"
    },
    {
        "id": "2103",
        "kanji": "属",
        "word": "belong"
    },
    {
        "id": "2104",
        "kanji": "嘱",
        "word": "entrust"
    },
    {
        "id": "2105",
        "kanji": "偶",
        "word": "accidentally"
    },
    {
        "id": "2106",
        "kanji": "遇",
        "word": "interview"
    },
    {
        "id": "2107",
        "kanji": "愚",
        "word": "foolish"
    },
    {
        "id": "2108",
        "kanji": "隅",
        "word": "corner"
    },
    {
        "id": "2109",
        "kanji": "逆",
        "word": "inverted"
    },
    {
        "id": "2110",
        "kanji": "塑",
        "word": "model"
    },
    {
        "id": "2111",
        "kanji": "遡",
        "word": "go upstream"
    },
    {
        "id": "2112",
        "kanji": "岡",
        "word": "Mount"
    },
    {
        "id": "2113",
        "kanji": "鋼",
        "word": "steel"
    },
    {
        "id": "2114",
        "kanji": "綱",
        "word": "hawser"
    },
    {
        "id": "2115",
        "kanji": "剛",
        "word": "sturdy"
    },
    {
        "id": "2116",
        "kanji": "缶",
        "word": "tin can"
    },
    {
        "id": "2117",
        "kanji": "陶",
        "word": "pottery"
    },
    {
        "id": "2118",
        "kanji": "揺",
        "word": "swing"
    },
    {
        "id": "2119",
        "kanji": "謡",
        "word": "Noh chanting"
    },
    {
        "id": "2120",
        "kanji": "鬱",
        "word": "gloom"
    },
    {
        "id": "2121",
        "kanji": "就",
        "word": "concerning"
    },
    {
        "id": "2122",
        "kanji": "蹴",
        "word": "kick"
    },
    {
        "id": "2123",
        "kanji": "懇",
        "word": "sociable"
    },
    {
        "id": "2124",
        "kanji": "墾",
        "word": "groundbreaking"
    },
    {
        "id": "2125",
        "kanji": "貌",
        "word": "countenance"
    },
    {
        "id": "2126",
        "kanji": "免",
        "word": "excuse"
    },
    {
        "id": "2127",
        "kanji": "逸",
        "word": "elude"
    },
    {
        "id": "2128",
        "kanji": "晩",
        "word": "nightfall"
    },
    {
        "id": "2129",
        "kanji": "勉",
        "word": "exertion"
    },
    {
        "id": "2130",
        "kanji": "象",
        "word": "elephant"
    },
    {
        "id": "2131",
        "kanji": "像",
        "word": "statue"
    },
    {
        "id": "2132",
        "kanji": "馬",
        "word": "horse"
    },
    {
        "id": "2133",
        "kanji": "駒",
        "word": "pony"
    },
    {
        "id": "2134",
        "kanji": "験",
        "word": "verification"
    },
    {
        "id": "2135",
        "kanji": "騎",
        "word": "equestrian"
    },
    {
        "id": "2136",
        "kanji": "駐",
        "word": "parking"
    },
    {
        "id": "2137",
        "kanji": "駆",
        "word": "drive"
    },
    {
        "id": "2138",
        "kanji": "駅",
        "word": "station"
    },
    {
        "id": "2139",
        "kanji": "騒",
        "word": "boisterous"
    },
    {
        "id": "2140",
        "kanji": "駄",
        "word": "burdensome"
    },
    {
        "id": "2141",
        "kanji": "驚",
        "word": "wonder"
    },
    {
        "id": "2142",
        "kanji": "篤",
        "word": "fervent"
    },
    {
        "id": "2143",
        "kanji": "罵",
        "word": "insult"
    },
    {
        "id": "2144",
        "kanji": "騰",
        "word": "inflation"
    },
    {
        "id": "2145",
        "kanji": "虎",
        "word": "tiger"
    },
    {
        "id": "2146",
        "kanji": "虜",
        "word": "captive"
    },
    {
        "id": "2147",
        "kanji": "膚",
        "word": "skin"
    },
    {
        "id": "2148",
        "kanji": "虚",
        "word": "void"
    },
    {
        "id": "2149",
        "kanji": "戯",
        "word": "frolic"
    },
    {
        "id": "2150",
        "kanji": "虞",
        "word": "uneasiness"
    },
    {
        "id": "2151",
        "kanji": "慮",
        "word": "prudence"
    },
    {
        "id": "2152",
        "kanji": "劇",
        "word": "drama"
    },
    {
        "id": "2153",
        "kanji": "虐",
        "word": "tyrannize"
    },
    {
        "id": "2154",
        "kanji": "鹿",
        "word": "deer"
    },
    {
        "id": "2155",
        "kanji": "麓",
        "word": "foot of a mountain"
    },
    {
        "id": "2156",
        "kanji": "薦",
        "word": "recommend"
    },
    {
        "id": "2157",
        "kanji": "慶",
        "word": "jubilation"
    },
    {
        "id": "2158",
        "kanji": "麗",
        "word": "lovely"
    },
    {
        "id": "2159",
        "kanji": "熊",
        "word": "bear"
    },
    {
        "id": "2160",
        "kanji": "能",
        "word": "ability"
    },
    {
        "id": "2161",
        "kanji": "態",
        "word": "attitude"
    },
    {
        "id": "2162",
        "kanji": "寅",
        "word": "sign of the tiger"
    },
    {
        "id": "2163",
        "kanji": "演",
        "word": "performance"
    },
    {
        "id": "2164",
        "kanji": "辰",
        "word": "sign of the dragon"
    },
    {
        "id": "2165",
        "kanji": "辱",
        "word": "embarrass"
    },
    {
        "id": "2166",
        "kanji": "震",
        "word": "quake"
    },
    {
        "id": "2167",
        "kanji": "振",
        "word": "shake"
    },
    {
        "id": "2168",
        "kanji": "娠",
        "word": "with child"
    },
    {
        "id": "2169",
        "kanji": "唇",
        "word": "lips"
    },
    {
        "id": "2170",
        "kanji": "農",
        "word": "agriculture"
    },
    {
        "id": "2171",
        "kanji": "濃",
        "word": "concentrated"
    },
    {
        "id": "2172",
        "kanji": "送",
        "word": "send off"
    },
    {
        "id": "2173",
        "kanji": "関",
        "word": "connection"
    },
    {
        "id": "2174",
        "kanji": "咲",
        "word": "blossom"
    },
    {
        "id": "2175",
        "kanji": "鬼",
        "word": "ghost"
    },
    {
        "id": "2176",
        "kanji": "醜",
        "word": "ugly"
    },
    {
        "id": "2177",
        "kanji": "魂",
        "word": "soul"
    },
    {
        "id": "2178",
        "kanji": "魔",
        "word": "witch"
    },
    {
        "id": "2179",
        "kanji": "魅",
        "word": "fascination"
    },
    {
        "id": "2180",
        "kanji": "塊",
        "word": "clod"
    },
    {
        "id": "2181",
        "kanji": "襲",
        "word": "attack"
    },
    {
        "id": "2182",
        "kanji": "嚇",
        "word": "upbraid"
    },
    {
        "id": "2183",
        "kanji": "朕",
        "word": "majestic plural"
    },
    {
        "id": "2184",
        "kanji": "雰",
        "word": "atmosphere"
    },
    {
        "id": "2185",
        "kanji": "箇",
        "word": "item"
    },
    {
        "id": "2186",
        "kanji": "錬",
        "word": "tempering"
    },
    {
        "id": "2187",
        "kanji": "遵",
        "word": "abide by"
    },
    {
        "id": "2188",
        "kanji": "罷",
        "word": "quit"
    },
    {
        "id": "2189",
        "kanji": "屯",
        "word": "barracks"
    },
    {
        "id": "2190",
        "kanji": "且",
        "word": "moreover"
    },
    {
        "id": "2191",
        "kanji": "藻",
        "word": "seaweed"
    },
    {
        "id": "2192",
        "kanji": "隷",
        "word": "slave"
    },
    {
        "id": "2193",
        "kanji": "癒",
        "word": "healing"
    },
    {
        "id": "2194",
        "kanji": "璽",
        "word": "imperial seal"
    },
    {
        "id": "2195",
        "kanji": "潟",
        "word": "lagoon"
    },
    {
        "id": "2196",
        "kanji": "丹",
        "word": "cinnabar"
    },
    {
        "id": "2197",
        "kanji": "丑",
        "word": "sign of the cow"
    },
    {
        "id": "2198",
        "kanji": "羞",
        "word": "humiliate"
    },
    {
        "id": "2199",
        "kanji": "卯",
        "word": "sign of the hare"
    },
    {
        "id": "2200",
        "kanji": "巳",
        "word": "sign of the snake"
    },
    {
        "id": "2201",
        "kanji": "此",
        "word": "this here"
    },
    {
        "id": "2202",
        "kanji": "柴",
        "word": "brushwood"
    },
    {
        "id": "2203",
        "kanji": "些",
        "word": "whit"
    },
    {
        "id": "2204",
        "kanji": "砦",
        "word": "fort"
    },
    {
        "id": "2205",
        "kanji": "髭",
        "word": "beard"
    },
    {
        "id": "2206",
        "kanji": "禽",
        "word": "fowl"
    },
    {
        "id": "2207",
        "kanji": "檎",
        "word": "apple"
    },
    {
        "id": "2208",
        "kanji": "憐",
        "word": "sympathize with"
    },
    {
        "id": "2209",
        "kanji": "燐",
        "word": "phosphorus"
    },
    {
        "id": "2210",
        "kanji": "麟",
        "word": "camelopard"
    },
    {
        "id": "2211",
        "kanji": "鱗",
        "word": "scaled"
    },
    {
        "id": "2212",
        "kanji": "奄",
        "word": "encompassing"
    },
    {
        "id": "2213",
        "kanji": "庵",
        "word": "hermitage"
    },
    {
        "id": "2214",
        "kanji": "掩",
        "word": "shrouded"
    },
    {
        "id": "2215",
        "kanji": "悛",
        "word": "make amends"
    },
    {
        "id": "2216",
        "kanji": "駿",
        "word": "steed"
    },
    {
        "id": "2217",
        "kanji": "峻",
        "word": "steep"
    },
    {
        "id": "2218",
        "kanji": "竣",
        "word": "complete a job"
    },
    {
        "id": "2219",
        "kanji": "犀",
        "word": "rhinoceros"
    },
    {
        "id": "2220",
        "kanji": "皐",
        "word": "lunar month"
    },
    {
        "id": "2221",
        "kanji": "畷",
        "word": "rice-field footpath"
    },
    {
        "id": "2222",
        "kanji": "綴",
        "word": "mend"
    },
    {
        "id": "2223",
        "kanji": "鎧",
        "word": "suit of armor"
    },
    {
        "id": "2224",
        "kanji": "凱",
        "word": "triumph"
    },
    {
        "id": "2225",
        "kanji": "呑",
        "word": "quaff"
    },
    {
        "id": "2226",
        "kanji": "韮",
        "word": "leek"
    },
    {
        "id": "2227",
        "kanji": "籤",
        "word": "lottery"
    },
    {
        "id": "2228",
        "kanji": "懺",
        "word": "penitential"
    },
    {
        "id": "2229",
        "kanji": "芻",
        "word": "hay"
    },
    {
        "id": "2230",
        "kanji": "雛",
        "word": "chick"
    },
    {
        "id": "2231",
        "kanji": "趨",
        "word": "scurry"
    },
    {
        "id": "2232",
        "kanji": "尤",
        "word": "understandably"
    },
    {
        "id": "2233",
        "kanji": "厖",
        "word": "immense"
    },
    {
        "id": "2234",
        "kanji": "或",
        "word": "a  (a certain)"
    },
    {
        "id": "2235",
        "kanji": "兎",
        "word": "rabbit"
    },
    {
        "id": "2236",
        "kanji": "也",
        "word": "est"
    },
    {
        "id": "2237",
        "kanji": "巴",
        "word": "comma-design"
    },
    {
        "id": "2238",
        "kanji": "疋",
        "word": "critters"
    },
    {
        "id": "2239",
        "kanji": "菫",
        "word": "violet"
    },
    {
        "id": "2240",
        "kanji": "曼",
        "word": "mandala"
    },
    {
        "id": "2241",
        "kanji": "云",
        "word": "quote"
    },
    {
        "id": "2242",
        "kanji": "莫",
        "word": "shalt"
    },
    {
        "id": "2243",
        "kanji": "而",
        "word": "and then"
    },
    {
        "id": "2244",
        "kanji": "倭",
        "word": "Yamato"
    },
    {
        "id": "2245",
        "kanji": "侠",
        "word": "chivalry"
    },
    {
        "id": "2246",
        "kanji": "倦",
        "word": "fed up"
    },
    {
        "id": "2247",
        "kanji": "俄",
        "word": "abrupt"
    },
    {
        "id": "2248",
        "kanji": "佃",
        "word": "work a field"
    },
    {
        "id": "2249",
        "kanji": "仔",
        "word": "animal offspring"
    },
    {
        "id": "2250",
        "kanji": "仇",
        "word": "foe"
    },
    {
        "id": "2251",
        "kanji": "伽",
        "word": "look after"
    },
    {
        "id": "2252",
        "kanji": "儲",
        "word": "make a profit"
    },
    {
        "id": "2253",
        "kanji": "僑",
        "word": "emigrant"
    },
    {
        "id": "2254",
        "kanji": "倶",
        "word": "mate"
    },
    {
        "id": "2255",
        "kanji": "侃",
        "word": "forthright"
    },
    {
        "id": "2256",
        "kanji": "偲",
        "word": "memorial"
    },
    {
        "id": "2257",
        "kanji": "侭",
        "word": "as is"
    },
    {
        "id": "2258",
        "kanji": "脩",
        "word": "dried meat"
    },
    {
        "id": "2259",
        "kanji": "倅",
        "word": "my son"
    },
    {
        "id": "2260",
        "kanji": "做",
        "word": "make do"
    },
    {
        "id": "2261",
        "kanji": "冴",
        "word": "sharp"
    },
    {
        "id": "2262",
        "kanji": "凋",
        "word": "wilt"
    },
    {
        "id": "2263",
        "kanji": "凌",
        "word": "pull through"
    },
    {
        "id": "2264",
        "kanji": "凛",
        "word": "stately"
    },
    {
        "id": "2265",
        "kanji": "凧",
        "word": "kite"
    },
    {
        "id": "2266",
        "kanji": "凪",
        "word": "lull"
    },
    {
        "id": "2267",
        "kanji": "夙",
        "word": "earlybird"
    },
    {
        "id": "2268",
        "kanji": "鳳",
        "word": "phoenix"
    },
    {
        "id": "2269",
        "kanji": "剽",
        "word": "menace"
    },
    {
        "id": "2270",
        "kanji": "劉",
        "word": "slaughter"
    },
    {
        "id": "2271",
        "kanji": "剃",
        "word": "shave"
    },
    {
        "id": "2272",
        "kanji": "厭",
        "word": "despondent"
    },
    {
        "id": "2273",
        "kanji": "雁",
        "word": "wild goose"
    },
    {
        "id": "2274",
        "kanji": "贋",
        "word": "counterfeit"
    },
    {
        "id": "2275",
        "kanji": "厨",
        "word": "kitchen"
    },
    {
        "id": "2276",
        "kanji": "仄",
        "word": "insinuate"
    },
    {
        "id": "2277",
        "kanji": "哨",
        "word": "scout"
    },
    {
        "id": "2278",
        "kanji": "咎",
        "word": "reprehend"
    },
    {
        "id": "2279",
        "kanji": "囁",
        "word": "whisper"
    },
    {
        "id": "2280",
        "kanji": "喋",
        "word": "chatter"
    },
    {
        "id": "2281",
        "kanji": "嘩",
        "word": "quarrel"
    },
    {
        "id": "2282",
        "kanji": "噂",
        "word": "gossip"
    },
    {
        "id": "2283",
        "kanji": "咳",
        "word": "cough"
    },
    {
        "id": "2284",
        "kanji": "喧",
        "word": "clamor"
    },
    {
        "id": "2285",
        "kanji": "叩",
        "word": "bash"
    },
    {
        "id": "2286",
        "kanji": "嘘",
        "word": "fib"
    },
    {
        "id": "2287",
        "kanji": "啄",
        "word": "peck at"
    },
    {
        "id": "2288",
        "kanji": "吠",
        "word": "barking"
    },
    {
        "id": "2289",
        "kanji": "吊",
        "word": "dangle"
    },
    {
        "id": "2290",
        "kanji": "噛",
        "word": "chew"
    },
    {
        "id": "2291",
        "kanji": "叶",
        "word": "within my ability"
    },
    {
        "id": "2292",
        "kanji": "吻",
        "word": "sides of the mouth"
    },
    {
        "id": "2293",
        "kanji": "吃",
        "word": "stammer"
    },
    {
        "id": "2294",
        "kanji": "噺",
        "word": "spin a tale"
    },
    {
        "id": "2295",
        "kanji": "噌",
        "word": "miso"
    },
    {
        "id": "2296",
        "kanji": "邑",
        "word": "city walls"
    },
    {
        "id": "2297",
        "kanji": "呆",
        "word": "dumbfounded"
    },
    {
        "id": "2298",
        "kanji": "喰",
        "word": "ingest"
    },
    {
        "id": "2299",
        "kanji": "埴",
        "word": "clay"
    },
    {
        "id": "2300",
        "kanji": "坤",
        "word": "authochthonous"
    },
    {
        "id": "2301",
        "kanji": "壕",
        "word": "dugout"
    },
    {
        "id": "2302",
        "kanji": "垢",
        "word": "blemish"
    },
    {
        "id": "2303",
        "kanji": "坦",
        "word": "flat"
    },
    {
        "id": "2304",
        "kanji": "埠",
        "word": "wharf"
    },
    {
        "id": "2305",
        "kanji": "堰",
        "word": "dam"
    },
    {
        "id": "2306",
        "kanji": "堵",
        "word": "railing"
    },
    {
        "id": "2307",
        "kanji": "嬰",
        "word": "suckling infant"
    },
    {
        "id": "2308",
        "kanji": "姦",
        "word": "violate"
    },
    {
        "id": "2309",
        "kanji": "婢",
        "word": "handmaiden"
    },
    {
        "id": "2310",
        "kanji": "婉",
        "word": "well finished"
    },
    {
        "id": "2311",
        "kanji": "娼",
        "word": "harlot"
    },
    {
        "id": "2312",
        "kanji": "妓",
        "word": "courtesan"
    },
    {
        "id": "2313",
        "kanji": "娃",
        "word": "fair"
    },
    {
        "id": "2314",
        "kanji": "姪",
        "word": "niece"
    },
    {
        "id": "2315",
        "kanji": "嬬",
        "word": "mistress"
    },
    {
        "id": "2316",
        "kanji": "姥",
        "word": "aged woman"
    },
    {
        "id": "2317",
        "kanji": "姑",
        "word": "mother-in-law"
    },
    {
        "id": "2318",
        "kanji": "姐",
        "word": "young miss"
    },
    {
        "id": "2319",
        "kanji": "嬉",
        "word": "overjoyed"
    },
    {
        "id": "2320",
        "kanji": "孕",
        "word": "expecting"
    },
    {
        "id": "2321",
        "kanji": "孜",
        "word": "assiduous"
    },
    {
        "id": "2322",
        "kanji": "宥",
        "word": "soothe"
    },
    {
        "id": "2323",
        "kanji": "寓",
        "word": "imply"
    },
    {
        "id": "2324",
        "kanji": "宏",
        "word": "extensive"
    },
    {
        "id": "2325",
        "kanji": "牢",
        "word": "jail"
    },
    {
        "id": "2326",
        "kanji": "宋",
        "word": "Sung dynasty"
    },
    {
        "id": "2327",
        "kanji": "宍",
        "word": "venison"
    },
    {
        "id": "2328",
        "kanji": "屠",
        "word": "butchering"
    },
    {
        "id": "2329",
        "kanji": "屁",
        "word": "fart"
    },
    {
        "id": "2330",
        "kanji": "屑",
        "word": "rubbish"
    },
    {
        "id": "2331",
        "kanji": "屡",
        "word": "frequently"
    },
    {
        "id": "2332",
        "kanji": "屍",
        "word": "corpse"
    },
    {
        "id": "2333",
        "kanji": "屏",
        "word": "folding screen"
    },
    {
        "id": "2334",
        "kanji": "嵩",
        "word": "high-reaching"
    },
    {
        "id": "2335",
        "kanji": "崚",
        "word": "rugged mountains"
    },
    {
        "id": "2336",
        "kanji": "嶺",
        "word": "mountaintop"
    },
    {
        "id": "2337",
        "kanji": "嵌",
        "word": "fit into"
    },
    {
        "id": "2338",
        "kanji": "帖",
        "word": "quire"
    },
    {
        "id": "2339",
        "kanji": "幡",
        "word": "banner"
    },
    {
        "id": "2340",
        "kanji": "幟",
        "word": "pennant"
    },
    {
        "id": "2341",
        "kanji": "庖",
        "word": "cleaver"
    },
    {
        "id": "2342",
        "kanji": "廓",
        "word": "licensed quarters"
    },
    {
        "id": "2343",
        "kanji": "庇",
        "word": "overhang"
    },
    {
        "id": "2344",
        "kanji": "鷹",
        "word": "hawk"
    },
    {
        "id": "2345",
        "kanji": "庄",
        "word": "shire"
    },
    {
        "id": "2346",
        "kanji": "廟",
        "word": "tomb sanctuary"
    },
    {
        "id": "2347",
        "kanji": "彊",
        "word": "strengthen"
    },
    {
        "id": "2348",
        "kanji": "弛",
        "word": "loosen"
    },
    {
        "id": "2349",
        "kanji": "粥",
        "word": "rice gruel"
    },
    {
        "id": "2350",
        "kanji": "挽",
        "word": "lathe"
    },
    {
        "id": "2351",
        "kanji": "撞",
        "word": "bump into"
    },
    {
        "id": "2352",
        "kanji": "扮",
        "word": "disguise"
    },
    {
        "id": "2353",
        "kanji": "捏",
        "word": "fabrication"
    },
    {
        "id": "2354",
        "kanji": "掴",
        "word": "clutch"
    },
    {
        "id": "2355",
        "kanji": "捺",
        "word": "impress"
    },
    {
        "id": "2356",
        "kanji": "掻",
        "word": "scratch"
    },
    {
        "id": "2357",
        "kanji": "撰",
        "word": "assortment"
    },
    {
        "id": "2358",
        "kanji": "揃",
        "word": "muster"
    },
    {
        "id": "2359",
        "kanji": "捌",
        "word": "deal with"
    },
    {
        "id": "2360",
        "kanji": "按",
        "word": "press down on"
    },
    {
        "id": "2361",
        "kanji": "播",
        "word": "disseminate"
    },
    {
        "id": "2362",
        "kanji": "揖",
        "word": "collect"
    },
    {
        "id": "2363",
        "kanji": "托",
        "word": "receptacle"
    },
    {
        "id": "2364",
        "kanji": "捧",
        "word": "devote"
    },
    {
        "id": "2365",
        "kanji": "撚",
        "word": "twirl"
    },
    {
        "id": "2366",
        "kanji": "挺",
        "word": "counter for tools"
    },
    {
        "id": "2367",
        "kanji": "擾",
        "word": "commotion"
    },
    {
        "id": "2368",
        "kanji": "撫",
        "word": "petting"
    },
    {
        "id": "2369",
        "kanji": "撒",
        "word": "sprinkle"
    },
    {
        "id": "2370",
        "kanji": "擢",
        "word": "outstanding"
    },
    {
        "id": "2371",
        "kanji": "摺",
        "word": "rubbing"
    },
    {
        "id": "2372",
        "kanji": "捷",
        "word": "spoils"
    },
    {
        "id": "2373",
        "kanji": "抉",
        "word": "gouge out"
    },
    {
        "id": "2374",
        "kanji": "怯",
        "word": "wince"
    },
    {
        "id": "2375",
        "kanji": "惟",
        "word": "ponder"
    },
    {
        "id": "2376",
        "kanji": "惚",
        "word": "infatuation"
    },
    {
        "id": "2377",
        "kanji": "怜",
        "word": "quickwitted"
    },
    {
        "id": "2378",
        "kanji": "惇",
        "word": "considerate"
    },
    {
        "id": "2379",
        "kanji": "恰",
        "word": "as if"
    },
    {
        "id": "2380",
        "kanji": "恢",
        "word": "enlarge"
    },
    {
        "id": "2381",
        "kanji": "悌",
        "word": "respect for elders"
    },
    {
        "id": "2382",
        "kanji": "澪",
        "word": "canal"
    },
    {
        "id": "2383",
        "kanji": "洸",
        "word": "glistening"
    },
    {
        "id": "2384",
        "kanji": "滉",
        "word": "bounding main"
    },
    {
        "id": "2385",
        "kanji": "漱",
        "word": "gargle"
    },
    {
        "id": "2386",
        "kanji": "洲",
        "word": "continent"
    },
    {
        "id": "2387",
        "kanji": "洵",
        "word": "swirling waters"
    },
    {
        "id": "2388",
        "kanji": "滲",
        "word": "seep"
    },
    {
        "id": "2389",
        "kanji": "洒",
        "word": "rinse"
    },
    {
        "id": "2390",
        "kanji": "沐",
        "word": "douse"
    },
    {
        "id": "2391",
        "kanji": "泪",
        "word": "teardrops"
    },
    {
        "id": "2392",
        "kanji": "渾",
        "word": "gushing"
    },
    {
        "id": "2393",
        "kanji": "涜",
        "word": "blaspheme"
    },
    {
        "id": "2394",
        "kanji": "梁",
        "word": "roofbeam"
    },
    {
        "id": "2395",
        "kanji": "澱",
        "word": "sediment"
    },
    {
        "id": "2396",
        "kanji": "洛",
        "word": "old Kyoto"
    },
    {
        "id": "2397",
        "kanji": "汝",
        "word": "thou"
    },
    {
        "id": "2398",
        "kanji": "漉",
        "word": "filter"
    },
    {
        "id": "2399",
        "kanji": "瀕",
        "word": "on the verge of"
    },
    {
        "id": "2400",
        "kanji": "濠",
        "word": "moat"
    },
    {
        "id": "2401",
        "kanji": "溌",
        "word": "spray"
    },
    {
        "id": "2402",
        "kanji": "湊",
        "word": "port"
    },
    {
        "id": "2403",
        "kanji": "淋",
        "word": "solitude"
    },
    {
        "id": "2404",
        "kanji": "浩",
        "word": "abounding"
    },
    {
        "id": "2405",
        "kanji": "汀",
        "word": "water’s edge"
    },
    {
        "id": "2406",
        "kanji": "鴻",
        "word": "large goose"
    },
    {
        "id": "2407",
        "kanji": "潅",
        "word": "souse"
    },
    {
        "id": "2408",
        "kanji": "溢",
        "word": "brimming"
    },
    {
        "id": "2409",
        "kanji": "湛",
        "word": "inundate"
    },
    {
        "id": "2410",
        "kanji": "淳",
        "word": "immaculate"
    },
    {
        "id": "2411",
        "kanji": "渥",
        "word": "moisten"
    },
    {
        "id": "2412",
        "kanji": "灘",
        "word": "rough seas"
    },
    {
        "id": "2413",
        "kanji": "汲",
        "word": "draw water"
    },
    {
        "id": "2414",
        "kanji": "瀞",
        "word": "river pool"
    },
    {
        "id": "2415",
        "kanji": "溜",
        "word": "cumulation"
    },
    {
        "id": "2416",
        "kanji": "渕",
        "word": "abyss"
    },
    {
        "id": "2417",
        "kanji": "沌",
        "word": "chaos"
    },
    {
        "id": "2418",
        "kanji": "濾",
        "word": "strainer"
    },
    {
        "id": "2419",
        "kanji": "濡",
        "word": "drench"
    },
    {
        "id": "2420",
        "kanji": "淀",
        "word": "eddy"
    },
    {
        "id": "2421",
        "kanji": "涅",
        "word": "black soil"
    },
    {
        "id": "2422",
        "kanji": "斧",
        "word": "hatchet"
    },
    {
        "id": "2423",
        "kanji": "爺",
        "word": "grandpa"
    },
    {
        "id": "2424",
        "kanji": "猾",
        "word": "sly"
    },
    {
        "id": "2425",
        "kanji": "猥",
        "word": "indecent"
    },
    {
        "id": "2426",
        "kanji": "狡",
        "word": "cunning"
    },
    {
        "id": "2427",
        "kanji": "狸",
        "word": "racoon dog"
    },
    {
        "id": "2428",
        "kanji": "狼",
        "word": "wolf"
    },
    {
        "id": "2429",
        "kanji": "狽",
        "word": "flustered"
    },
    {
        "id": "2430",
        "kanji": "狗",
        "word": "pup"
    },
    {
        "id": "2431",
        "kanji": "狐",
        "word": "fox"
    },
    {
        "id": "2432",
        "kanji": "狛",
        "word": "a-un"
    },
    {
        "id": "2433",
        "kanji": "獅",
        "word": "lion"
    },
    {
        "id": "2434",
        "kanji": "狒",
        "word": "baboon"
    },
    {
        "id": "2435",
        "kanji": "莨",
        "word": "tobacco"
    },
    {
        "id": "2436",
        "kanji": "茉",
        "word": "jasmine"
    },
    {
        "id": "2437",
        "kanji": "莉",
        "word": "hawthorn"
    },
    {
        "id": "2438",
        "kanji": "苺",
        "word": "strawberry"
    },
    {
        "id": "2439",
        "kanji": "萩",
        "word": "bush clover"
    },
    {
        "id": "2440",
        "kanji": "藝",
        "word": "technique (old)"
    },
    {
        "id": "2441",
        "kanji": "薙",
        "word": "trim"
    },
    {
        "id": "2442",
        "kanji": "蓑",
        "word": "straw raincoat"
    },
    {
        "id": "2443",
        "kanji": "苔",
        "word": "moss"
    },
    {
        "id": "2444",
        "kanji": "蕩",
        "word": "prodigal"
    },
    {
        "id": "2445",
        "kanji": "蔓",
        "word": "tendril"
    },
    {
        "id": "2446",
        "kanji": "蓮",
        "word": "lotus"
    },
    {
        "id": "2447",
        "kanji": "芙",
        "word": "lotus flower"
    },
    {
        "id": "2448",
        "kanji": "蓉",
        "word": "lotus blossom"
    },
    {
        "id": "2449",
        "kanji": "蘭",
        "word": "orchid"
    },
    {
        "id": "2450",
        "kanji": "芦",
        "word": "hollow reed"
    },
    {
        "id": "2451",
        "kanji": "薯",
        "word": "yam"
    },
    {
        "id": "2452",
        "kanji": "菖",
        "word": "iris"
    },
    {
        "id": "2453",
        "kanji": "蕉",
        "word": "banana"
    },
    {
        "id": "2454",
        "kanji": "蕎",
        "word": "buckwheat"
    },
    {
        "id": "2455",
        "kanji": "蕗",
        "word": "butterbur"
    },
    {
        "id": "2456",
        "kanji": "茄",
        "word": "eggplant"
    },
    {
        "id": "2457",
        "kanji": "蔭",
        "word": "behind the scenes"
    },
    {
        "id": "2458",
        "kanji": "蓬",
        "word": "wormwood"
    },
    {
        "id": "2459",
        "kanji": "芥",
        "word": "mustard"
    },
    {
        "id": "2460",
        "kanji": "萌",
        "word": "germinate"
    },
    {
        "id": "2461",
        "kanji": "葡",
        "word": "grape"
    },
    {
        "id": "2462",
        "kanji": "萄",
        "word": "grape vine"
    },
    {
        "id": "2463",
        "kanji": "蘇",
        "word": "resurrect"
    },
    {
        "id": "2464",
        "kanji": "蕃",
        "word": "grow wild"
    },
    {
        "id": "2465",
        "kanji": "苓",
        "word": "cocklebur"
    },
    {
        "id": "2466",
        "kanji": "菰",
        "word": "rush mat"
    },
    {
        "id": "2467",
        "kanji": "蒙",
        "word": "darken"
    },
    {
        "id": "2468",
        "kanji": "茅",
        "word": "grassy reed"
    },
    {
        "id": "2469",
        "kanji": "芭",
        "word": "plantain"
    },
    {
        "id": "2470",
        "kanji": "苅",
        "word": "mow"
    },
    {
        "id": "2471",
        "kanji": "葱",
        "word": "onion"
    },
    {
        "id": "2472",
        "kanji": "葵",
        "word": "hollyhock"
    },
    {
        "id": "2473",
        "kanji": "葺",
        "word": "shingling"
    },
    {
        "id": "2474",
        "kanji": "蕊",
        "word": "stamen"
    },
    {
        "id": "2475",
        "kanji": "茸",
        "word": "mushroom"
    },
    {
        "id": "2476",
        "kanji": "蒔",
        "word": "sowing"
    },
    {
        "id": "2477",
        "kanji": "芹",
        "word": "parsley"
    },
    {
        "id": "2478",
        "kanji": "苫",
        "word": "thatching"
    },
    {
        "id": "2479",
        "kanji": "蒼",
        "word": "pale blue"
    },
    {
        "id": "2480",
        "kanji": "藁",
        "word": "straw"
    },
    {
        "id": "2481",
        "kanji": "蕪",
        "word": "turnip"
    },
    {
        "id": "2482",
        "kanji": "藷",
        "word": "sweet potato"
    },
    {
        "id": "2483",
        "kanji": "薮",
        "word": "quack"
    },
    {
        "id": "2484",
        "kanji": "蒜",
        "word": "garlic"
    },
    {
        "id": "2485",
        "kanji": "蕨",
        "word": "bracken"
    },
    {
        "id": "2486",
        "kanji": "蔚",
        "word": "grow plentiful"
    },
    {
        "id": "2487",
        "kanji": "茜",
        "word": "madder red"
    },
    {
        "id": "2488",
        "kanji": "莞",
        "word": "candle rush"
    },
    {
        "id": "2489",
        "kanji": "蒐",
        "word": "collector"
    },
    {
        "id": "2490",
        "kanji": "菅",
        "word": "sedge"
    },
    {
        "id": "2491",
        "kanji": "葦",
        "word": "ditch reed"
    },
    {
        "id": "2492",
        "kanji": "迪",
        "word": "Way"
    },
    {
        "id": "2493",
        "kanji": "辿",
        "word": "track down"
    },
    {
        "id": "2494",
        "kanji": "這",
        "word": "crawl"
    },
    {
        "id": "2495",
        "kanji": "迂",
        "word": "detour"
    },
    {
        "id": "2496",
        "kanji": "遁",
        "word": "shirk"
    },
    {
        "id": "2497",
        "kanji": "逢",
        "word": "tryst"
    },
    {
        "id": "2498",
        "kanji": "遥",
        "word": "far off"
    },
    {
        "id": "2499",
        "kanji": "遼",
        "word": "faraway"
    },
    {
        "id": "2500",
        "kanji": "逼",
        "word": "pressing"
    },
    {
        "id": "2501",
        "kanji": "迄",
        "word": "until"
    },
    {
        "id": "2502",
        "kanji": "逗",
        "word": "standstill"
    },
    {
        "id": "2503",
        "kanji": "鄭",
        "word": "courtesy"
    },
    {
        "id": "2504",
        "kanji": "隕",
        "word": "falling"
    },
    {
        "id": "2505",
        "kanji": "隈",
        "word": "nook"
    },
    {
        "id": "2506",
        "kanji": "憑",
        "word": "possessed"
    },
    {
        "id": "2507",
        "kanji": "惹",
        "word": "attract"
    },
    {
        "id": "2508",
        "kanji": "悉",
        "word": "without exception"
    },
    {
        "id": "2509",
        "kanji": "忽",
        "word": "instantaneously"
    },
    {
        "id": "2510",
        "kanji": "惣",
        "word": "firstborn son"
    },
    {
        "id": "2511",
        "kanji": "愈",
        "word": "in the nick of time"
    },
    {
        "id": "2512",
        "kanji": "恕",
        "word": "sensitive"
    },
    {
        "id": "2513",
        "kanji": "昴",
        "word": "overarching"
    },
    {
        "id": "2514",
        "kanji": "晋",
        "word": "progress"
    },
    {
        "id": "2515",
        "kanji": "晟",
        "word": "aglow"
    },
    {
        "id": "2516",
        "kanji": "暈",
        "word": "halo"
    },
    {
        "id": "2517",
        "kanji": "暉",
        "word": "glitter"
    },
    {
        "id": "2518",
        "kanji": "旱",
        "word": "dry weather"
    },
    {
        "id": "2519",
        "kanji": "晏",
        "word": "clear skies"
    },
    {
        "id": "2520",
        "kanji": "晨",
        "word": "morrow"
    },
    {
        "id": "2521",
        "kanji": "晒",
        "word": "bleaching"
    },
    {
        "id": "2522",
        "kanji": "晃",
        "word": "limpid"
    },
    {
        "id": "2523",
        "kanji": "曝",
        "word": "air out"
    },
    {
        "id": "2524",
        "kanji": "曙",
        "word": "dawn"
    },
    {
        "id": "2525",
        "kanji": "昂",
        "word": "elevate"
    },
    {
        "id": "2526",
        "kanji": "昏",
        "word": "dusk"
    },
    {
        "id": "2527",
        "kanji": "晦",
        "word": "last day of the month"
    },
    {
        "id": "2528",
        "kanji": "膿",
        "word": "pus"
    },
    {
        "id": "2529",
        "kanji": "腑",
        "word": "viscera"
    },
    {
        "id": "2530",
        "kanji": "胱",
        "word": "bladder"
    },
    {
        "id": "2531",
        "kanji": "胚",
        "word": "embryo"
    },
    {
        "id": "2532",
        "kanji": "肛",
        "word": "anus"
    },
    {
        "id": "2533",
        "kanji": "脆",
        "word": "fragile"
    },
    {
        "id": "2534",
        "kanji": "肋",
        "word": "rib"
    },
    {
        "id": "2535",
        "kanji": "腔",
        "word": "body cavity"
    },
    {
        "id": "2536",
        "kanji": "肱",
        "word": "armrest"
    },
    {
        "id": "2537",
        "kanji": "胡",
        "word": "uncivilized"
    },
    {
        "id": "2538",
        "kanji": "楓",
        "word": "maple tree"
    },
    {
        "id": "2539",
        "kanji": "楊",
        "word": "purple willow"
    },
    {
        "id": "2540",
        "kanji": "椋",
        "word": "Oriental elm"
    },
    {
        "id": "2541",
        "kanji": "榛",
        "word": "hazel"
    },
    {
        "id": "2542",
        "kanji": "櫛",
        "word": "comb"
    },
    {
        "id": "2543",
        "kanji": "槌",
        "word": "wooden hammer"
    },
    {
        "id": "2544",
        "kanji": "樵",
        "word": "mallet"
    },
    {
        "id": "2545",
        "kanji": "梯",
        "word": "ladder"
    },
    {
        "id": "2546",
        "kanji": "柑",
        "word": "citrus tree"
    },
    {
        "id": "2547",
        "kanji": "杭",
        "word": "picket"
    },
    {
        "id": "2548",
        "kanji": "柊",
        "word": "holly"
    },
    {
        "id": "2549",
        "kanji": "柚",
        "word": "citron"
    },
    {
        "id": "2550",
        "kanji": "椀",
        "word": "wooden bowl"
    },
    {
        "id": "2551",
        "kanji": "栂",
        "word": "hemlock"
    },
    {
        "id": "2552",
        "kanji": "柾",
        "word": "spindle tree"
    },
    {
        "id": "2553",
        "kanji": "榊",
        "word": "sacred tree"
    },
    {
        "id": "2554",
        "kanji": "樫",
        "word": "evergreen oak"
    },
    {
        "id": "2555",
        "kanji": "槙",
        "word": "black pine"
    },
    {
        "id": "2556",
        "kanji": "楢",
        "word": "Japanese oak"
    },
    {
        "id": "2557",
        "kanji": "橘",
        "word": "mandarin orange"
    },
    {
        "id": "2558",
        "kanji": "桧",
        "word": "Japanese cypress"
    },
    {
        "id": "2559",
        "kanji": "棲",
        "word": "roost"
    },
    {
        "id": "2560",
        "kanji": "栖",
        "word": "nestle"
    },
    {
        "id": "2561",
        "kanji": "桔",
        "word": "bellflower"
    },
    {
        "id": "2562",
        "kanji": "杜",
        "word": "temple grove"
    },
    {
        "id": "2563",
        "kanji": "杷",
        "word": "grain rake"
    },
    {
        "id": "2564",
        "kanji": "梶",
        "word": "oar"
    },
    {
        "id": "2565",
        "kanji": "杵",
        "word": "wooden pestle"
    },
    {
        "id": "2566",
        "kanji": "杖",
        "word": "cane"
    },
    {
        "id": "2567",
        "kanji": "樽",
        "word": "barrel"
    },
    {
        "id": "2568",
        "kanji": "櫓",
        "word": "turret"
    },
    {
        "id": "2569",
        "kanji": "橿",
        "word": "sturdy oak"
    },
    {
        "id": "2570",
        "kanji": "杓",
        "word": "wooden ladle"
    },
    {
        "id": "2571",
        "kanji": "李",
        "word": "damson"
    },
    {
        "id": "2572",
        "kanji": "棉",
        "word": "raw cotton"
    },
    {
        "id": "2573",
        "kanji": "楯",
        "word": "escutcheon"
    },
    {
        "id": "2574",
        "kanji": "榎",
        "word": "hackberry"
    },
    {
        "id": "2575",
        "kanji": "樺",
        "word": "birch"
    },
    {
        "id": "2576",
        "kanji": "槍",
        "word": "lance"
    },
    {
        "id": "2577",
        "kanji": "柘",
        "word": "wild mulberry"
    },
    {
        "id": "2578",
        "kanji": "梱",
        "word": "bale"
    },
    {
        "id": "2579",
        "kanji": "枇",
        "word": "loquat"
    },
    {
        "id": "2580",
        "kanji": "樋",
        "word": "downspout"
    },
    {
        "id": "2581",
        "kanji": "橇",
        "word": "sled"
    },
    {
        "id": "2582",
        "kanji": "槃",
        "word": "enjoyment"
    },
    {
        "id": "2583",
        "kanji": "栞",
        "word": "bookmark"
    },
    {
        "id": "2584",
        "kanji": "椰",
        "word": "coconut tree"
    },
    {
        "id": "2585",
        "kanji": "檀",
        "word": "sandalwood"
    },
    {
        "id": "2586",
        "kanji": "樗",
        "word": "sumac"
    },
    {
        "id": "2587",
        "kanji": "槻",
        "word": "zelkova"
    },
    {
        "id": "2588",
        "kanji": "椙",
        "word": "cryptomeria"
    },
    {
        "id": "2589",
        "kanji": "彬",
        "word": "copious"
    },
    {
        "id": "2590",
        "kanji": "桶",
        "word": "bucket"
    },
    {
        "id": "2591",
        "kanji": "楕",
        "word": "ellipse"
    },
    {
        "id": "2592",
        "kanji": "樒",
        "word": "star-anise"
    },
    {
        "id": "2593",
        "kanji": "毬",
        "word": "furball"
    },
    {
        "id": "2594",
        "kanji": "燿",
        "word": "twinkle"
    },
    {
        "id": "2595",
        "kanji": "燎",
        "word": "watchfire"
    },
    {
        "id": "2596",
        "kanji": "炬",
        "word": "torch"
    },
    {
        "id": "2597",
        "kanji": "焚",
        "word": "kindle"
    },
    {
        "id": "2598",
        "kanji": "灸",
        "word": "moxa"
    },
    {
        "id": "2599",
        "kanji": "煽",
        "word": "fanning"
    },
    {
        "id": "2600",
        "kanji": "煤",
        "word": "soot"
    },
    {
        "id": "2601",
        "kanji": "煉",
        "word": "firing"
    },
    {
        "id": "2602",
        "kanji": "燦",
        "word": "dazzling"
    },
    {
        "id": "2603",
        "kanji": "灼",
        "word": "refulgent"
    },
    {
        "id": "2604",
        "kanji": "烙",
        "word": "branding"
    },
    {
        "id": "2605",
        "kanji": "焔",
        "word": "flames"
    },
    {
        "id": "2606",
        "kanji": "烹",
        "word": "stew"
    },
    {
        "id": "2607",
        "kanji": "牽",
        "word": "tug"
    },
    {
        "id": "2608",
        "kanji": "牝",
        "word": "female animal"
    },
    {
        "id": "2609",
        "kanji": "牡",
        "word": "male animal"
    },
    {
        "id": "2610",
        "kanji": "琳",
        "word": "chime"
    },
    {
        "id": "2611",
        "kanji": "琉",
        "word": "lapis lazuli"
    },
    {
        "id": "2612",
        "kanji": "瑳",
        "word": "burnish"
    },
    {
        "id": "2613",
        "kanji": "琢",
        "word": "hone"
    },
    {
        "id": "2614",
        "kanji": "珊",
        "word": "coral"
    },
    {
        "id": "2615",
        "kanji": "瑚",
        "word": "coral reef"
    },
    {
        "id": "2616",
        "kanji": "瑞",
        "word": "fortunate"
    },
    {
        "id": "2617",
        "kanji": "玖",
        "word": "jet"
    },
    {
        "id": "2618",
        "kanji": "瑛",
        "word": "crystal stone"
    },
    {
        "id": "2619",
        "kanji": "玲",
        "word": "tinkling"
    },
    {
        "id": "2620",
        "kanji": "畢",
        "word": "lastly"
    },
    {
        "id": "2621",
        "kanji": "畦",
        "word": "paddy-field ridge"
    },
    {
        "id": "2622",
        "kanji": "痒",
        "word": "itch"
    },
    {
        "id": "2623",
        "kanji": "痰",
        "word": "phlegm"
    },
    {
        "id": "2624",
        "kanji": "疹",
        "word": "measles"
    },
    {
        "id": "2625",
        "kanji": "痔",
        "word": "hemorrhoids"
    },
    {
        "id": "2626",
        "kanji": "癌",
        "word": "cancer"
    },
    {
        "id": "2627",
        "kanji": "痺",
        "word": "paralysis"
    },
    {
        "id": "2628",
        "kanji": "眸",
        "word": "apple of the eye"
    },
    {
        "id": "2629",
        "kanji": "眩",
        "word": "dizzy"
    },
    {
        "id": "2630",
        "kanji": "雉",
        "word": "pheasant"
    },
    {
        "id": "2631",
        "kanji": "矩",
        "word": "carpenter’s square"
    },
    {
        "id": "2632",
        "kanji": "磐",
        "word": "crag"
    },
    {
        "id": "2633",
        "kanji": "碇",
        "word": "grapnel"
    },
    {
        "id": "2634",
        "kanji": "碧",
        "word": "blue-green"
    },
    {
        "id": "2635",
        "kanji": "硯",
        "word": "inkstone"
    },
    {
        "id": "2636",
        "kanji": "砥",
        "word": "grindstone"
    },
    {
        "id": "2637",
        "kanji": "碗",
        "word": "teacup"
    },
    {
        "id": "2638",
        "kanji": "碍",
        "word": "obstacle"
    },
    {
        "id": "2639",
        "kanji": "碩",
        "word": "illustrious"
    },
    {
        "id": "2640",
        "kanji": "磯",
        "word": "rocky beach"
    },
    {
        "id": "2641",
        "kanji": "砺",
        "word": "whetstone"
    },
    {
        "id": "2642",
        "kanji": "碓",
        "word": "mill"
    },
    {
        "id": "2643",
        "kanji": "禦",
        "word": "fend off"
    },
    {
        "id": "2644",
        "kanji": "祷",
        "word": "beseech"
    },
    {
        "id": "2645",
        "kanji": "祐",
        "word": "ancestral tablet"
    },
    {
        "id": "2646",
        "kanji": "祇",
        "word": "local god"
    },
    {
        "id": "2647",
        "kanji": "祢",
        "word": "ancestral shrine"
    },
    {
        "id": "2648",
        "kanji": "禄",
        "word": "salarium"
    },
    {
        "id": "2649",
        "kanji": "禎",
        "word": "felicitation"
    },
    {
        "id": "2650",
        "kanji": "秤",
        "word": "balancing scales"
    },
    {
        "id": "2651",
        "kanji": "黍",
        "word": "millet"
    },
    {
        "id": "2652",
        "kanji": "禿",
        "word": "bald"
    },
    {
        "id": "2653",
        "kanji": "稔",
        "word": "bear fruit"
    },
    {
        "id": "2654",
        "kanji": "稗",
        "word": "crabgrass"
    },
    {
        "id": "2655",
        "kanji": "穣",
        "word": "bumper crop"
    },
    {
        "id": "2656",
        "kanji": "稜",
        "word": "imperial authority"
    },
    {
        "id": "2657",
        "kanji": "稀",
        "word": "sparse"
    },
    {
        "id": "2658",
        "kanji": "穆",
        "word": "obeisant"
    },
    {
        "id": "2659",
        "kanji": "窺",
        "word": "peep"
    },
    {
        "id": "2660",
        "kanji": "窄",
        "word": "tight"
    },
    {
        "id": "2661",
        "kanji": "穿",
        "word": "drill"
    },
    {
        "id": "2662",
        "kanji": "竃",
        "word": "kitchen stove"
    },
    {
        "id": "2663",
        "kanji": "竪",
        "word": "longness"
    },
    {
        "id": "2664",
        "kanji": "颯",
        "word": "rustling"
    },
    {
        "id": "2665",
        "kanji": "站",
        "word": "outpost"
    },
    {
        "id": "2666",
        "kanji": "靖",
        "word": "repose"
    },
    {
        "id": "2667",
        "kanji": "妾",
        "word": "concubine"
    },
    {
        "id": "2668",
        "kanji": "衿",
        "word": "lapel"
    },
    {
        "id": "2669",
        "kanji": "袷",
        "word": "lined kimono"
    },
    {
        "id": "2670",
        "kanji": "袴",
        "word": "pleated skirt"
    },
    {
        "id": "2671",
        "kanji": "襖",
        "word": "sliding door"
    },
    {
        "id": "2672",
        "kanji": "笙",
        "word": "Chinese panpipe"
    },
    {
        "id": "2673",
        "kanji": "筏",
        "word": "raft"
    },
    {
        "id": "2674",
        "kanji": "簾",
        "word": "bamboo blinds"
    },
    {
        "id": "2675",
        "kanji": "箪",
        "word": "rattan box"
    },
    {
        "id": "2676",
        "kanji": "竿",
        "word": "pole"
    },
    {
        "id": "2677",
        "kanji": "箆",
        "word": "spatula"
    },
    {
        "id": "2678",
        "kanji": "箔",
        "word": "foil"
    },
    {
        "id": "2679",
        "kanji": "笥",
        "word": "wardrobe"
    },
    {
        "id": "2680",
        "kanji": "箭",
        "word": "arrow shaft"
    },
    {
        "id": "2681",
        "kanji": "筑",
        "word": "ancient harp"
    },
    {
        "id": "2682",
        "kanji": "篠",
        "word": "slender bamboo"
    },
    {
        "id": "2683",
        "kanji": "纂",
        "word": "redaction"
    },
    {
        "id": "2684",
        "kanji": "竺",
        "word": "bamboo cane"
    },
    {
        "id": "2685",
        "kanji": "箕",
        "word": "winnowing fan"
    },
    {
        "id": "2686",
        "kanji": "笈",
        "word": "backpack"
    },
    {
        "id": "2687",
        "kanji": "篇",
        "word": "livraison"
    },
    {
        "id": "2688",
        "kanji": "筈",
        "word": "should"
    },
    {
        "id": "2689",
        "kanji": "簸",
        "word": "winnow"
    },
    {
        "id": "2690",
        "kanji": "粕",
        "word": "settlings"
    },
    {
        "id": "2691",
        "kanji": "糟",
        "word": "lees"
    },
    {
        "id": "2692",
        "kanji": "糊",
        "word": "paste"
    },
    {
        "id": "2693",
        "kanji": "籾",
        "word": "unhulled rice"
    },
    {
        "id": "2694",
        "kanji": "糠",
        "word": "rice bran"
    },
    {
        "id": "2695",
        "kanji": "糞",
        "word": "excrement"
    },
    {
        "id": "2696",
        "kanji": "粟",
        "word": "foxtail millet"
    },
    {
        "id": "2697",
        "kanji": "繋",
        "word": "link up"
    },
    {
        "id": "2698",
        "kanji": "綸",
        "word": "twine"
    },
    {
        "id": "2699",
        "kanji": "絨",
        "word": "carpet yarn"
    },
    {
        "id": "2700",
        "kanji": "絆",
        "word": "ties"
    },
    {
        "id": "2701",
        "kanji": "緋",
        "word": "scarlet"
    },
    {
        "id": "2702",
        "kanji": "綜",
        "word": "synthesis"
    },
    {
        "id": "2703",
        "kanji": "紐",
        "word": "string"
    },
    {
        "id": "2704",
        "kanji": "紘",
        "word": "chinstrap"
    },
    {
        "id": "2705",
        "kanji": "纏",
        "word": "summarize"
    },
    {
        "id": "2706",
        "kanji": "絢",
        "word": "gorgeous"
    },
    {
        "id": "2707",
        "kanji": "繍",
        "word": "embroidery"
    },
    {
        "id": "2708",
        "kanji": "紬",
        "word": "pongee"
    },
    {
        "id": "2709",
        "kanji": "綺",
        "word": "ornate"
    },
    {
        "id": "2710",
        "kanji": "綾",
        "word": "damask"
    },
    {
        "id": "2711",
        "kanji": "絃",
        "word": "catgut"
    },
    {
        "id": "2712",
        "kanji": "縞",
        "word": "stripe"
    },
    {
        "id": "2713",
        "kanji": "綬",
        "word": "gimp"
    },
    {
        "id": "2714",
        "kanji": "紗",
        "word": "gossamer"
    },
    {
        "id": "2715",
        "kanji": "舵",
        "word": "rudder"
    },
    {
        "id": "2716",
        "kanji": "聯",
        "word": "strung together"
    },
    {
        "id": "2717",
        "kanji": "聡",
        "word": "attentive"
    },
    {
        "id": "2718",
        "kanji": "聘",
        "word": "summons"
    },
    {
        "id": "2719",
        "kanji": "耽",
        "word": "addiction"
    },
    {
        "id": "2720",
        "kanji": "耶",
        "word": "exclamation"
    },
    {
        "id": "2721",
        "kanji": "蚤",
        "word": "flea"
    },
    {
        "id": "2722",
        "kanji": "蟹",
        "word": "crab"
    },
    {
        "id": "2723",
        "kanji": "蛋",
        "word": "protein"
    },
    {
        "id": "2724",
        "kanji": "蟄",
        "word": "hibernation"
    },
    {
        "id": "2725",
        "kanji": "蝿",
        "word": "housefly"
    },
    {
        "id": "2726",
        "kanji": "蟻",
        "word": "ant"
    },
    {
        "id": "2727",
        "kanji": "蝋",
        "word": "wax"
    },
    {
        "id": "2728",
        "kanji": "蝦",
        "word": "shrimp"
    },
    {
        "id": "2729",
        "kanji": "蛸",
        "word": "octopus"
    },
    {
        "id": "2730",
        "kanji": "螺",
        "word": "screw"
    },
    {
        "id": "2731",
        "kanji": "蝉",
        "word": "cicada"
    },
    {
        "id": "2732",
        "kanji": "蛙",
        "word": "frog"
    },
    {
        "id": "2733",
        "kanji": "蛾",
        "word": "moth"
    },
    {
        "id": "2734",
        "kanji": "蛤",
        "word": "clam"
    },
    {
        "id": "2735",
        "kanji": "蛭",
        "word": "leech"
    },
    {
        "id": "2736",
        "kanji": "蛎",
        "word": "oyster"
    },
    {
        "id": "2737",
        "kanji": "罫",
        "word": "ruled lines"
    },
    {
        "id": "2738",
        "kanji": "袈",
        "word": "stole"
    },
    {
        "id": "2739",
        "kanji": "裟",
        "word": "monk’s sash"
    },
    {
        "id": "2740",
        "kanji": "截",
        "word": "incision"
    },
    {
        "id": "2741",
        "kanji": "哉",
        "word": "I wonder"
    },
    {
        "id": "2742",
        "kanji": "詢",
        "word": "counsel"
    },
    {
        "id": "2743",
        "kanji": "諄",
        "word": "polite"
    },
    {
        "id": "2744",
        "kanji": "讐",
        "word": "vendetta"
    },
    {
        "id": "2745",
        "kanji": "諌",
        "word": "remonstrate"
    },
    {
        "id": "2746",
        "kanji": "諒",
        "word": "verify"
    },
    {
        "id": "2747",
        "kanji": "讃",
        "word": "compliment"
    },
    {
        "id": "2748",
        "kanji": "訊",
        "word": "query"
    },
    {
        "id": "2749",
        "kanji": "訣",
        "word": "split up"
    },
    {
        "id": "2750",
        "kanji": "詫",
        "word": "beg another’s pardon"
    },
    {
        "id": "2751",
        "kanji": "誼",
        "word": "familiarity"
    },
    {
        "id": "2752",
        "kanji": "謬",
        "word": "fallible"
    },
    {
        "id": "2753",
        "kanji": "訝",
        "word": "wary"
    },
    {
        "id": "2754",
        "kanji": "諺",
        "word": "proverb"
    },
    {
        "id": "2755",
        "kanji": "誹",
        "word": "slander"
    },
    {
        "id": "2756",
        "kanji": "謂",
        "word": "so-called"
    },
    {
        "id": "2757",
        "kanji": "諜",
        "word": "secret agent"
    },
    {
        "id": "2758",
        "kanji": "註",
        "word": "footnote"
    },
    {
        "id": "2759",
        "kanji": "譬",
        "word": "parable"
    },
    {
        "id": "2760",
        "kanji": "轟",
        "word": "rumble"
    },
    {
        "id": "2761",
        "kanji": "輔",
        "word": "reinforce"
    },
    {
        "id": "2762",
        "kanji": "輻",
        "word": "spoke"
    },
    {
        "id": "2763",
        "kanji": "輯",
        "word": "assemble"
    },
    {
        "id": "2764",
        "kanji": "豹",
        "word": "panther"
    },
    {
        "id": "2765",
        "kanji": "賎",
        "word": "despicable"
    },
    {
        "id": "2766",
        "kanji": "貰",
        "word": "get"
    },
    {
        "id": "2767",
        "kanji": "賑",
        "word": "bustling"
    },
    {
        "id": "2768",
        "kanji": "贖",
        "word": "expiate"
    },
    {
        "id": "2769",
        "kanji": "躓",
        "word": "stumble"
    },
    {
        "id": "2770",
        "kanji": "蹄",
        "word": "hoof"
    },
    {
        "id": "2771",
        "kanji": "蹟",
        "word": "vestiges"
    },
    {
        "id": "2772",
        "kanji": "跨",
        "word": "straddle"
    },
    {
        "id": "2773",
        "kanji": "跪",
        "word": "kneel"
    },
    {
        "id": "2774",
        "kanji": "醤",
        "word": "soy sauce"
    },
    {
        "id": "2775",
        "kanji": "醍",
        "word": "whey"
    },
    {
        "id": "2776",
        "kanji": "醐",
        "word": "ghee"
    },
    {
        "id": "2777",
        "kanji": "醇",
        "word": "strong sake"
    },
    {
        "id": "2778",
        "kanji": "麹",
        "word": "malt"
    },
    {
        "id": "2779",
        "kanji": "釦",
        "word": "button"
    },
    {
        "id": "2780",
        "kanji": "銚",
        "word": "keg"
    },
    {
        "id": "2781",
        "kanji": "鋤",
        "word": "plow"
    },
    {
        "id": "2782",
        "kanji": "鋸",
        "word": "hand saw"
    },
    {
        "id": "2783",
        "kanji": "錐",
        "word": "awl"
    },
    {
        "id": "2784",
        "kanji": "鍬",
        "word": "hoe"
    },
    {
        "id": "2785",
        "kanji": "鋲",
        "word": "rivet"
    },
    {
        "id": "2786",
        "kanji": "錫",
        "word": "tin"
    },
    {
        "id": "2787",
        "kanji": "錨",
        "word": "anchor"
    },
    {
        "id": "2788",
        "kanji": "釘",
        "word": "nail"
    },
    {
        "id": "2789",
        "kanji": "鑓",
        "word": "javelin"
    },
    {
        "id": "2790",
        "kanji": "鋒",
        "word": "sword’s point"
    },
    {
        "id": "2791",
        "kanji": "鎚",
        "word": "hammer"
    },
    {
        "id": "2792",
        "kanji": "鉦",
        "word": "carillion"
    },
    {
        "id": "2793",
        "kanji": "錆",
        "word": "rust"
    },
    {
        "id": "2794",
        "kanji": "鍾",
        "word": "cluster"
    },
    {
        "id": "2795",
        "kanji": "鋏",
        "word": "scissors"
    },
    {
        "id": "2796",
        "kanji": "閃",
        "word": "flash"
    },
    {
        "id": "2797",
        "kanji": "悶",
        "word": "agony"
    },
    {
        "id": "2798",
        "kanji": "閤",
        "word": "side gate"
    },
    {
        "id": "2799",
        "kanji": "雫",
        "word": "trickle"
    },
    {
        "id": "2800",
        "kanji": "霞",
        "word": "haze"
    },
    {
        "id": "2801",
        "kanji": "翰",
        "word": "quill"
    },
    {
        "id": "2802",
        "kanji": "斡",
        "word": "auspices"
    },
    {
        "id": "2803",
        "kanji": "鞍",
        "word": "saddle"
    },
    {
        "id": "2804",
        "kanji": "鞭",
        "word": "whip"
    },
    {
        "id": "2805",
        "kanji": "鞘",
        "word": "saddle straps"
    },
    {
        "id": "2806",
        "kanji": "鞄",
        "word": "briefcase"
    },
    {
        "id": "2807",
        "kanji": "靭",
        "word": "pliable"
    },
    {
        "id": "2808",
        "kanji": "鞠",
        "word": "terminate"
    },
    {
        "id": "2809",
        "kanji": "顛",
        "word": "overturn"
    },
    {
        "id": "2810",
        "kanji": "穎",
        "word": "brush tip"
    },
    {
        "id": "2811",
        "kanji": "頗",
        "word": "exceedingly"
    },
    {
        "id": "2812",
        "kanji": "頌",
        "word": "accolade"
    },
    {
        "id": "2813",
        "kanji": "頚",
        "word": "neck and throat"
    },
    {
        "id": "2814",
        "kanji": "餐",
        "word": "repast"
    },
    {
        "id": "2815",
        "kanji": "饗",
        "word": "feast"
    },
    {
        "id": "2816",
        "kanji": "蝕",
        "word": "eclipse"
    },
    {
        "id": "2817",
        "kanji": "飴",
        "word": "sweets"
    },
    {
        "id": "2818",
        "kanji": "駕",
        "word": "stretcher"
    },
    {
        "id": "2819",
        "kanji": "騨",
        "word": "piebald"
    },
    {
        "id": "2820",
        "kanji": "馳",
        "word": "rush"
    },
    {
        "id": "2821",
        "kanji": "騙",
        "word": "cheat"
    },
    {
        "id": "2822",
        "kanji": "馴",
        "word": "tame"
    },
    {
        "id": "2823",
        "kanji": "駁",
        "word": "rebuttal"
    },
    {
        "id": "2824",
        "kanji": "駈",
        "word": "gallop"
    },
    {
        "id": "2825",
        "kanji": "驢",
        "word": "donkey"
    },
    {
        "id": "2826",
        "kanji": "鰻",
        "word": "eel"
    },
    {
        "id": "2827",
        "kanji": "鯛",
        "word": "sea bream"
    },
    {
        "id": "2828",
        "kanji": "鰯",
        "word": "sardine"
    },
    {
        "id": "2829",
        "kanji": "鱒",
        "word": "trout"
    },
    {
        "id": "2830",
        "kanji": "鮭",
        "word": "salmon"
    },
    {
        "id": "2831",
        "kanji": "鮪",
        "word": "tuna"
    },
    {
        "id": "2832",
        "kanji": "鮎",
        "word": "sweet smelt"
    },
    {
        "id": "2833",
        "kanji": "鯵",
        "word": "horse mackerel"
    },
    {
        "id": "2834",
        "kanji": "鱈",
        "word": "cod"
    },
    {
        "id": "2835",
        "kanji": "鯖",
        "word": "mackerel"
    },
    {
        "id": "2836",
        "kanji": "鮫",
        "word": "shark"
    },
    {
        "id": "2837",
        "kanji": "鰹",
        "word": "bonito"
    },
    {
        "id": "2838",
        "kanji": "鰍",
        "word": "bullhead"
    },
    {
        "id": "2839",
        "kanji": "鰐",
        "word": "alligator"
    },
    {
        "id": "2840",
        "kanji": "鮒",
        "word": "crucian carp"
    },
    {
        "id": "2841",
        "kanji": "鮨",
        "word": "sushi"
    },
    {
        "id": "2842",
        "kanji": "鰭",
        "word": "fish fin"
    },
    {
        "id": "2843",
        "kanji": "鴎",
        "word": "seagull"
    },
    {
        "id": "2844",
        "kanji": "鵬",
        "word": "roc"
    },
    {
        "id": "2845",
        "kanji": "鸚",
        "word": "parakeet"
    },
    {
        "id": "2846",
        "kanji": "鵡",
        "word": "parrot"
    },
    {
        "id": "2847",
        "kanji": "鵜",
        "word": "cormorant"
    },
    {
        "id": "2848",
        "kanji": "鷺",
        "word": "heron"
    },
    {
        "id": "2849",
        "kanji": "鷲",
        "word": "eagle"
    },
    {
        "id": "2850",
        "kanji": "鴨",
        "word": "wild duck"
    },
    {
        "id": "2851",
        "kanji": "鳶",
        "word": "black kite"
    },
    {
        "id": "2852",
        "kanji": "梟",
        "word": "owl"
    },
    {
        "id": "2853",
        "kanji": "塵",
        "word": "dust"
    },
    {
        "id": "2854",
        "kanji": "麒",
        "word": "giraffe"
    },
    {
        "id": "2855",
        "kanji": "舅",
        "word": "father-in-law"
    },
    {
        "id": "2856",
        "kanji": "鼠",
        "word": "mouse"
    },
    {
        "id": "2857",
        "kanji": "鑿",
        "word": "bore"
    },
    {
        "id": "2858",
        "kanji": "艘",
        "word": "small craft"
    },
    {
        "id": "2859",
        "kanji": "瞑",
        "word": "close the eyes"
    },
    {
        "id": "2860",
        "kanji": "暝",
        "word": "murky"
    },
    {
        "id": "2861",
        "kanji": "坐",
        "word": "sitting in meditation"
    },
    {
        "id": "2862",
        "kanji": "朔",
        "word": "first day of the month"
    },
    {
        "id": "2863",
        "kanji": "曳",
        "word": "tow"
    },
    {
        "id": "2864",
        "kanji": "洩",
        "word": "dribble out"
    },
    {
        "id": "2865",
        "kanji": "彗",
        "word": "comet"
    },
    {
        "id": "2866",
        "kanji": "慧",
        "word": "astute"
    },
    {
        "id": "2867",
        "kanji": "爾",
        "word": "let it be"
    },
    {
        "id": "2868",
        "kanji": "嘉",
        "word": "applaud"
    },
    {
        "id": "2869",
        "kanji": "兇",
        "word": "evil"
    },
    {
        "id": "2870",
        "kanji": "兜",
        "word": "helmet"
    },
    {
        "id": "2871",
        "kanji": "靄",
        "word": "mist"
    },
    {
        "id": "2872",
        "kanji": "劫",
        "word": "kalpa"
    },
    {
        "id": "2873",
        "kanji": "歎",
        "word": "bemoan"
    },
    {
        "id": "2874",
        "kanji": "輿",
        "word": "palanquin"
    },
    {
        "id": "2875",
        "kanji": "歪",
        "word": "warped"
    },
    {
        "id": "2876",
        "kanji": "翠",
        "word": "jade green"
    },
    {
        "id": "2877",
        "kanji": "黛",
        "word": "blue-black"
    },
    {
        "id": "2878",
        "kanji": "鼎",
        "word": "tripod"
    },
    {
        "id": "2879",
        "kanji": "鹵",
        "word": "rocksalt"
    },
    {
        "id": "2880",
        "kanji": "鹸",
        "word": "lye"
    },
    {
        "id": "2881",
        "kanji": "虔",
        "word": "reserved"
    },
    {
        "id": "2882",
        "kanji": "燕",
        "word": "swallow"
    },
    {
        "id": "2883",
        "kanji": "嘗",
        "word": "lick"
    },
    {
        "id": "2884",
        "kanji": "殆",
        "word": "almost"
    },
    {
        "id": "2885",
        "kanji": "牌",
        "word": "mahjong tiles"
    },
    {
        "id": "2886",
        "kanji": "覗",
        "word": "peek"
    },
    {
        "id": "2887",
        "kanji": "齟",
        "word": "disagree"
    },
    {
        "id": "2888",
        "kanji": "齬",
        "word": "discord"
    },
    {
        "id": "2889",
        "kanji": "秦",
        "word": "Manchu dynasty"
    },
    {
        "id": "2890",
        "kanji": "雀",
        "word": "sparrow"
    },
    {
        "id": "2891",
        "kanji": "隼",
        "word": "peregrine falcon"
    },
    {
        "id": "2892",
        "kanji": "耀",
        "word": "shimmering"
    },
    {
        "id": "2893",
        "kanji": "夷",
        "word": "ebisu"
    },
    {
        "id": "2894",
        "kanji": "嚢",
        "word": "cyst"
    },
    {
        "id": "2895",
        "kanji": "暢",
        "word": "carefree"
    },
    {
        "id": "2896",
        "kanji": "廻",
        "word": "circling"
    },
    {
        "id": "2897",
        "kanji": "欣",
        "word": "elation"
    },
    {
        "id": "2898",
        "kanji": "毅",
        "word": "stalwart"
    },
    {
        "id": "2899",
        "kanji": "斯",
        "word": "this"
    },
    {
        "id": "2900",
        "kanji": "匙",
        "word": "wooden spoon"
    },
    {
        "id": "2901",
        "kanji": "匡",
        "word": "set straight"
    },
    {
        "id": "2902",
        "kanji": "肇",
        "word": "founding"
    },
    {
        "id": "2903",
        "kanji": "麿",
        "word": "Utamaro"
    },
    {
        "id": "2904",
        "kanji": "叢",
        "word": "conglomerate"
    },
    {
        "id": "2905",
        "kanji": "肴",
        "word": "entreat"
    },
    {
        "id": "2906",
        "kanji": "斐",
        "word": "symmetrically patterned"
    },
    {
        "id": "2907",
        "kanji": "卿",
        "word": "magistrate"
    },
    {
        "id": "2908",
        "kanji": "翫",
        "word": "fiddle with"
    },
    {
        "id": "2909",
        "kanji": "於",
        "word": "within"
    },
    {
        "id": "2910",
        "kanji": "套",
        "word": "hackneyed"
    },
    {
        "id": "2911",
        "kanji": "叛",
        "word": "rebellion"
    },
    {
        "id": "2912",
        "kanji": "尖",
        "word": "sharp point"
    },
    {
        "id": "2913",
        "kanji": "壷",
        "word": "crock"
    },
    {
        "id": "2914",
        "kanji": "叡",
        "word": "sapience"
    },
    {
        "id": "2915",
        "kanji": "酋",
        "word": "chieftain"
    },
    {
        "id": "2916",
        "kanji": "鴬",
        "word": "nightingale"
    },
    {
        "id": "2917",
        "kanji": "赫",
        "word": "incandescent"
    },
    {
        "id": "2918",
        "kanji": "臥",
        "word": "supinate"
    },
    {
        "id": "2919",
        "kanji": "甥",
        "word": "nephew"
    },
    {
        "id": "2920",
        "kanji": "瓢",
        "word": "gourd"
    },
    {
        "id": "2921",
        "kanji": "琵",
        "word": "biwa"
    },
    {
        "id": "2922",
        "kanji": "琶",
        "word": "lute"
    },
    {
        "id": "2923",
        "kanji": "叉",
        "word": "forked"
    },
    {
        "id": "2924",
        "kanji": "乖",
        "word": "disobey"
    },
    {
        "id": "2925",
        "kanji": "畠",
        "word": "dry field"
    },
    {
        "id": "2926",
        "kanji": "圃",
        "word": "vegetable patch"
    },
    {
        "id": "2927",
        "kanji": "丞",
        "word": "helping hand"
    },
    {
        "id": "2928",
        "kanji": "亮",
        "word": "translucent"
    },
    {
        "id": "2929",
        "kanji": "胤",
        "word": "blood relative"
    },
    {
        "id": "2930",
        "kanji": "疏",
        "word": "transcription"
    },
    {
        "id": "2931",
        "kanji": "膏",
        "word": "ointment"
    },
    {
        "id": "2932",
        "kanji": "魁",
        "word": "pioneer"
    },
    {
        "id": "2933",
        "kanji": "馨",
        "word": "ambrosial"
    },
    {
        "id": "2934",
        "kanji": "牒",
        "word": "label"
    },
    {
        "id": "2935",
        "kanji": "瞥",
        "word": "glimpse"
    },
    {
        "id": "2936",
        "kanji": "睾",
        "word": "testicle"
    },
    {
        "id": "2937",
        "kanji": "巫",
        "word": "sorceress"
    },
    {
        "id": "2938",
        "kanji": "敦",
        "word": "empathetic"
    },
    {
        "id": "2939",
        "kanji": "奎",
        "word": "Andromeda"
    },
    {
        "id": "2940",
        "kanji": "翔",
        "word": "soar"
    },
    {
        "id": "2941",
        "kanji": "皓",
        "word": "beaming"
    },
    {
        "id": "2942",
        "kanji": "黎",
        "word": "tenebrous"
    },
    {
        "id": "2943",
        "kanji": "赳",
        "word": "bold"
    },
    {
        "id": "2944",
        "kanji": "已",
        "word": "stop short"
    },
    {
        "id": "2945",
        "kanji": "棘",
        "word": "thornbush"
    },
    {
        "id": "2946",
        "kanji": "祟",
        "word": "haunt"
    },
    {
        "id": "2947",
        "kanji": "甦",
        "word": "resuscitate"
    },
    {
        "id": "2948",
        "kanji": "剪",
        "word": "pruning"
    },
    {
        "id": "2949",
        "kanji": "躾",
        "word": "upbringing"
    },
    {
        "id": "2950",
        "kanji": "夥",
        "word": "plentiful"
    },
    {
        "id": "2951",
        "kanji": "鼾",
        "word": "snore"
    },
    {
        "id": "2952",
        "kanji": "陀",
        "word": "steeply inclined"
    },
    {
        "id": "2953",
        "kanji": "粁",
        "word": "kilometer"
    },
    {
        "id": "2954",
        "kanji": "糎",
        "word": "centimeter"
    },
    {
        "id": "2955",
        "kanji": "粍",
        "word": "millimeter"
    },
    {
        "id": "2956",
        "kanji": "噸",
        "word": "ton"
    },
    {
        "id": "2957",
        "kanji": "哩",
        "word": "mile"
    },
    {
        "id": "2958",
        "kanji": "浬",
        "word": "nautical mile"
    },
    {
        "id": "2959",
        "kanji": "吋",
        "word": "inch"
    },
    {
        "id": "2960",
        "kanji": "呎",
        "word": "foot"
    },
    {
        "id": "2961",
        "kanji": "梵",
        "word": "brahman"
    },
    {
        "id": "2962",
        "kanji": "薩",
        "word": "bodhisattva"
    },
    {
        "id": "2963",
        "kanji": "菩",
        "word": "bo tree"
    },
    {
        "id": "2964",
        "kanji": "唖",
        "word": "babble"
    },
    {
        "id": "2965",
        "kanji": "牟",
        "word": "moo"
    },
    {
        "id": "2966",
        "kanji": "迦",
        "word": "Sanskrit ka"
    },
    {
        "id": "2967",
        "kanji": "珈",
        "word": "jeweled hairpin"
    },
    {
        "id": "2968",
        "kanji": "琲",
        "word": "beaded hairpin"
    },
    {
        "id": "2969",
        "kanji": "檜",
        "word": "Japanese cypress (old)"
    },
    {
        "id": "2970",
        "kanji": "轡",
        "word": "tinkling bell"
    },
    {
        "id": "2971",
        "kanji": "淵",
        "word": "abyss (old)"
    },
    {
        "id": "2972",
        "kanji": "伍",
        "word": "V"
    },
    {
        "id": "2973",
        "kanji": "什",
        "word": "X"
    },
    {
        "id": "2974",
        "kanji": "萬",
        "word": "ten thousand (old)"
    },
    {
        "id": "2975",
        "kanji": "邁",
        "word": "pass through"
    },
    {
        "id": "2976",
        "kanji": "燭",
        "word": "candlelight"
    },
    {
        "id": "2977",
        "kanji": "逞",
        "word": "tough"
    },
    {
        "id": "2978",
        "kanji": "燈",
        "word": "lamp (old)"
    },
    {
        "id": "2979",
        "kanji": "裡",
        "word": "back (old)"
    },
    {
        "id": "2980",
        "kanji": "薗",
        "word": "park (alternate)"
    },
    {
        "id": "2981",
        "kanji": "鋪",
        "word": "shop (alternate)"
    },
    {
        "id": "2982",
        "kanji": "嶋",
        "word": "island (alternate)"
    },
    {
        "id": "2983",
        "kanji": "峯",
        "word": "summit (alternate)"
    },
    {
        "id": "2984",
        "kanji": "埜",
        "word": "plains (old)"
    },
    {
        "id": "2985",
        "kanji": "龍",
        "word": "dragon (old)"
    },
    {
        "id": "2986",
        "kanji": "寵",
        "word": "patronage"
    },
    {
        "id": "2987",
        "kanji": "聾",
        "word": "deafness"
    },
    {
        "id": "2988",
        "kanji": "慾",
        "word": "longing (old)"
    },
    {
        "id": "2989",
        "kanji": "嶽",
        "word": "Point (old)"
    },
    {
        "id": "2990",
        "kanji": "國",
        "word": "country (old)"
    },
    {
        "id": "2991",
        "kanji": "脛",
        "word": "shin"
    },
    {
        "id": "2992",
        "kanji": "勁",
        "word": "formidable"
    },
    {
        "id": "2993",
        "kanji": "祀",
        "word": "enshrine"
    },
    {
        "id": "2994",
        "kanji": "祓",
        "word": "exorcism"
    },
    {
        "id": "2995",
        "kanji": "躇",
        "word": "dither"
    },
    {
        "id": "2996",
        "kanji": "壽",
        "word": "longevity (old)"
    },
    {
        "id": "2997",
        "kanji": "躊",
        "word": "hesitate"
    },
    {
        "id": "2998",
        "kanji": "饅",
        "word": "bean jam"
    },
    {
        "id": "2999",
        "kanji": "嘔",
        "word": "retch"
    },
    {
        "id": "3000",
        "kanji": "鼈",
        "word": "snapping turtle"
    }
]
