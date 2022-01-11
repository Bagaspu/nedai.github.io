const BtnStart = document.querySelector("#start");
const BtnEnd = document.querySelector("#end");
const BtnSpeak = document.querySelector("#speak");
const time = document.querySelector("#time");
const battery = document.querySelector("#baterai");
const internet = document.querySelector("#wifi");
const turn_on = document.querySelector("#turn_on");
document.querySelector("#start_ned_btn").addEventListener("click",()=>{
    recognition.start();
});

function weather(location) {
    const weatherCont = document.querySelector(".temp").querySelectorAll("*");

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=304e642ba97ab19f9e9bcdabfee8cbb0`;
    const xhr = new XMLHttpRequest();
    xhr.open("GET",url,true);
    xhr.onload = function() {
        if (this.status === 200) {
            let data = JSON.parse(this.responseText);
            weatherCont[0].textContent = `Lokasi : ${data.name}`;
            weatherCont[1].textContent = `Negara : ${data.sys.country} `;
            weatherCont[2].textContent = `Tipe cuaca : ${data.weather[0].main}`;
            weatherCont[3].textContent = `Deskripsi Cuaca : ${data.weather[0].description}`;
            weatherCont[4].src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png `;
            weatherCont[5].textContent = `Original temperature : ${ktc(
                data.main.temp
            )}`;
            weatherCont[6].textContent = `feels like ${ktc(data.main.feels_like)}`;
            weatherCont[7].textContent = `Min temperature ${ktc(data.main.temp_min)}`;
            weatherCont[8].textContent = `Max temperature ${ktc(data.main.temp_max)}`;
            weatherStatement = `master... cuaca di ${data.name} saat ini adalah ${
                data.weather[0].description
            }... dan temperatur saat ini adalah ${ktc(data.main.feels_like)}`;
        } else {
            weatherCont[0].textContent = "weather info not found";
        };
    };

    xhr.send();
};

function ktc(k) {
    k = k - 273.15;
    return k.toFixed(2);
};

//time setup
//onload(window)
//autoNedAi
function autoNed(){
    setTimeout(() =>{
        recognition.start();
    },1000);
}

let date = new Date();
let hrs = date.getHours();
let mins = date.getMinutes();
let secs = date.getSeconds();

let stopingR = false;

let weatherStatement = "";
let charge,chargeStatus,connect,currentTime
chargeStatus = "unplugged"

window.onload = () => {
    //onstartup
    turn_on.play();
    turn_on.addEventListener("ended", () => {
        setTimeout(() => {
            autoNed();
            readOut("on start");
            if (localStorage.getItem("ned_setup")===null) {
                readOut("Master, tolong isi informasi");
            };
        },200);
    });
    /*setInterval(() => {
        let date = new Date();
        let hrs = date.getHours();
        let mins = date.getMinutes();
        let sec = date.getSeconds();
        time.textContent = `${hrs} : ${mins} : ${sec}`;
    },1000);
    */
    //battery setup
    let batteryPromise = navigator.getBattery();
    batteryPromise.then(batteryCallback);

    if (navigator.onLine) {
        document.querySelector("#wifi").textContent = "online"
        connect = "online"
    } else {
        document.querySelector("#wifi").textContent = "offline"
        connect = "offline"
    };

    setInterval(() => {
        if (navigator.onLine) {
            document.querySelector("#wifi").textContent = "online"
            connect = "online"
        } else {
            document.querySelector("#wifi").textContent = "offline"
            connect = "offline"
        }
    }, );

    function batteryCallback(batteryObject) {
        printBatteryStatus(batteryObject);
        setInterval(() =>{
            printBatteryStatus(batteryObject);
        },5000);
    };

    function printBatteryStatus(batteryObject) {
        document.querySelector("#baterai").textContent = `${
            (batteryObject.level * 100).toFixed(2)
        }%`;
        charge = batteryObject.level * 100;
        if (batteryObject.charging === true) {
            document.querySelector(".battery").style.width = "100px";
            document.querySelector("#baterai").textContent = `${
                (batteryObject.level * 100).toFixed(2)
            } % Charging`;
            chargeStatus = "plugged in";
        };
    };

    //internet setup
    navigator.onLine ? (internet.textContent = "online") : (internet.textContent = "offline")
};

function formatAMPM(date){
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0"+ minutes : minutes;
    var strTime = hours + ":" + minutes+ " " + ampm;
    currentTime = strTime;
    time.textContent = strTime;

};

formatAMPM(date);
setInterval(() => {
    formatAMPM(date);
}, 60000);


//calling weather function
//weather("bekasi");

//NedAi Setup
if (localStorage.getItem("ned_setup") !== null) {
    weather(JSON.parse(localStorage.getItem("ned_setup")).lokasi);
}

//NedAI informasi setup
const setup = document.querySelector(".ned_setup");
setup.style.display = "none";
if (localStorage.getItem("ned_setup") === null) {
    setup.style.display = "block";
    setup.querySelector("button").addEventListener("click", userInfo);
};

//userinfo fungsi
function userInfo() {
    let setupInfo = {
        name : setup.querySelectorAll("input")[0].value,
        lokasi : setup.querySelectorAll("input")[1].value,
        instagram : setup.querySelectorAll("input")[2].value,
        facebook : setup.querySelectorAll("input")[3].value,
        Gmail : setup.querySelectorAll("input")[4].value,
    
    };
    let testArr = [];
    
    setup.querySelectorAll("input").forEach((e) => {
        testArr.push(e.value);
    });

    if (testArr.includes("")) {
        readOut("master, silahkan menyelesaikan informasi tentang anda");
    } else {
        localStorage.clear();
        localStorage.setItem("ned_setup", JSON.stringify(setupInfo));
        setup.style.display = "none";
        weather(JSON.parse(localStorage.getItem("ned_setup")).lokasi);
    };
};



//speech recogmnition setup
const SpeechRecognition = 
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

//sr mulai
recognition.onstart = function(event){
   
    console.log("vr active");
};

//arr of window
let windowsB = [];
//sr hasil
recognition.onresult = function(event){
    console.log(event)
    let current = event.resultIndex;
    let transcript = event.results[current][0].transcript;
    transcript = transcript.toLowerCase();
    let userdata = localStorage.getItem("ned_setup");

    console.log(`my words : ${transcript} ` );
    if(transcript.includes("nida")) {
        readOut("hi master bagas");
    };
    if(transcript.includes("buka kalkulator")) {
        readOut("membuka kalkulator");
        window.open("https://www.advernesia.com/kalkulator/");
    };
    if(transcript.includes("putar musik")) {
        readOut("memutar musik");
        window.open("https://www.joox.com/id/mymusic/1548398362");
    };
    if(transcript.includes("gimana kabarnya")) {
        readOut("Biasa saja");
    };
    if (transcript.includes("siapa master kamu")) {
        readOut(`master saya adalah... yang ciptain saya.. yaitu master ${JSON.parse(userdata).name}`)
    }
    if (transcript.includes("jam berapa")) {
        readOut(`sekarang jam ${currentTime}`);
    };
    if (transcript.includes("cek jaringan")) {
        readOut(`saat ini master sedang ${connect}`);
    };
    if (transcript.includes("baterai")) {
        readOut(`saat ini master sedang ${charge}`);
    };
    if (transcript.includes("matikan diri")) {
        readOut("mematikan diri");
        stopingR =true;
        recognition.stop();
    };
    if (transcript.includes("suhu saat ini")) {
        readOut(weatherStatement);
    };
    if (transcript.includes("buka tokopedia")) {
        readOut("membuka tokopedia untuk master");
        window.open("https://www.tokopedia.com/");
    };
    if (transcript.includes("laporan cuaca")) {
        readOut("laporan cuaca saat ini");
        let a = window.open(`https://www.google.com/search?q=cuaca+di+${
            JSON.parse(localStorage.getItem("ned_setup")).lokasi
        }`);
        windowsB.push(a);
    };
    if (transcript.includes("buka brainly")) {
        readOut("membuka brainly");
        let a = window.open("https://www.brainly.com");
        windowsB.push(a);
    };
    if (transcript.includes("komik")) {
        readOut("membuka web komik");
        let a = window.open("https://www.komikcast.com");
        windowsB.push(a);
    };
    if (transcript.includes("film")) {
        readOut("master ingin menonton film.., membuka situs");
        let a = window.open("http://95.168.173.89/");
        windowsB.push(a);
    };
    if(transcript.includes("buka youtube")) {
        readOut("membuka youtube untuk master");
        let a = window.open("https://www.youtube.com/");
        windowsB.push(a);
    };
    if (transcript.includes("buka instagram")) {
        readOut("membuka instagram  untuk master");
        let a = window.open("https://www.instagram.com/");
        windowsB.push(a);
    };
    if (transcript.includes("buka google")) {
        readOut("membuka google untuk master");
        let a = window.open("https://www.google.com/");
        windowsB.push(a);
        
    };
    if (transcript.includes("tutup")) {
        readOut("menutup");
        windowsB.forEach((e) =>{
            e.close();
        });
    };

    //berita
    if (transcript.includes("berita hari ini")) {
        readOut("berita hari ini adalah");
        getNews();
    };

    //Pencarian youtube
    if (transcript.includes("tolong cari")) {
        readOut("ini hasil yang saya dapat master..");
        let input = transcript.split("");
        input.splice(0, 11);
        input.pop();
        input = input.join("").split(" ").join("+");
        console.log(input);
        let a = window.open(`https://www.google.com/search?q=${input}`);
        windowsB.push(a);
    };

    if (transcript.includes("putar")) {
        let playStr = transcript.split("");
        playStr.splice(0, 5);
        let videoName = playStr.join("");
        playStr = playStr.join("").split("").join("+");
        readOut(`mencari ${videoName}`);
        window.open(`https://www.youtube.com/results?search_query=${playStr}`);
    };
    if (transcript.includes("buka facebook")) {
        readOut("membuka facebook untuk master");
        let a = window.open("https://www.facebook.com/");
        windowsB.push(a);
    };
    if (transcript.includes("marketcrypto")) {
        readOut("membuka market");
        let a = window.open("https://coinmarketcap.com/id/");
        windowsB.push(a);
    };
    if (transcript.includes("buka whatsapp")) {
        readOut("membuka whatsapp untuk master");
        let a = window.open("https://web.whatsapp.com/");
        windowsB.push(a);
    };
    if (transcript.includes("buka gmail")) {
        readOut("membuka gmail untuk master");
        let a = window.open("https://mail.google.com/mail/u/2/#inbox");
        windowsB.push(a);
    };
    if (transcript.includes("buka terjemahan")) {
        readOut("membuka terjemahan google");
        let a = window.open("https://translate.google.cn/?hl=id&ie=UTF-8&sl=en&tl=ja&op=translate");
        windowsB.push(a);
    };
    if (transcript.includes("buka play store")) {
        readOut("membuka play store untuk master");
        let a = window.open("https://play.google.com/store/apps");
        windowsB.push(a);
    };
    if (transcript.includes("buka binomo")) {
        readOut("membuka binomo untuk master");
        let a = window.open("https://binomo-web.com/trading");
        windowsB.push(a);
    };
};

//sr akhir
recognition.onend = function(){
    console.log("vr deactive");
};
//sr
recognition.continuous = true;

BtnStart.addEventListener("click", () => {
    recognition.start();
});

BtnEnd.addEventListener("click", () => {
    recognition.stop();
});

recognition.onend = function () {
    if (stopingR === false) {
        setTimeout(() => {
            recognition.start();
        }, 500);
    } else if (stopingR === true) {
        recognition.stop();
    };
}

//NedAI Berbicara
function readOut(message) {
    const speech = new SpeechSynthesisUtterance();

    const allVoices = speechSynthesis.getVoices()
    speech.text = message;
    speech.voice = allVoices[9];
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
    console.log("Speaking...")
};

BtnSpeak.addEventListener("click",() => {
    readOut("Hi, Bagas Onii-chan..");
});

// kalender
const lang = navigator.language;
let datex = new Date();
let dayNumber = date.getDate();
let monthx = date.getMonth();

let dayName = date.toLocaleString(lang,{weekday: 'long'});
let monthName = date.toLocaleString(lang, {month: 'long'});
let year = date.getFullYear();

document.querySelector("#month").innerHTML = monthName;
document.querySelector("#day").innerHTML = dayName;
document.querySelector("#date").innerHTML = dayNumber;
document.querySelector("#year").innerHTML = year;

document.querySelector(".kalender").addEventListener("click",()=>{
    window.open("https://calendar.google.com/");
});

//news setup
async function getNews() {
    var url = "https://newsapi.org/v2/top-headlines?country=id&apiKey=06a3d1346aec4e01b2bedef8e53e8ca7";
    var req = new Request(url);
    await fetch(req).then((response) => response.json())
    .then((data)=>{
        console.log(data);
        let arrNews = data.articles;
        arrNews.length = 10;
        let a = [];
        arrNews.forEach((e,index)=>{
            a.push(e.content);
        });
        readOut(a)
    });
};

