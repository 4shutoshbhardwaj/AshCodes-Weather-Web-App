const timeEl=document.querySelector("#time");
const dateEL=document.querySelector("#date"); 
const currentWeatherItemsEl=document.querySelector("#current-weather-items");
const timezone=document.querySelector("#time-zone");
const countryEl=document.querySelector("#country");
const weatherForecastEl=document.querySelector("#weather-forecast");
const currentTempEl=document.querySelector("#current-temp");

const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const API_KEY=`e9a0f7d7fab15839f9e30dd0d0b159b3`;

const getData=async(url)=>{
    try {
        let res=await fetch(url);
        let data=await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

let search=document.querySelector("#search");
search.addEventListener("keypress",async(e)=>{
    try {
        if(e.key=="Enter"){
            let value=search.value;
            let userData=await getData(`https://api.openweathermap.org/data/2.5/weather?q=${value},in&appid=e9a0f7d7fab15839f9e30dd0d0b159b3`);
            let {lon,lat}=userData.coord;
            console.log(userData,lon,lat);
            getSearchData(lon,lat);
        }
    } catch (err) {
        console.log(err);
    }
})

setInterval(() => {
    const time=new Date();
    const month=time.getMonth();
    const date=time.getDate();
    const day=time.getDay();
    const hour=time.getHours();
    const hoursIn24HrFormat=hour>=13?hour%12:hour;
    const minutes=time.getMinutes();
    const ampm=hour>=12?"PM":"AM";
    const timeHr=hoursIn24HrFormat<10?"0"+hoursIn24HrFormat:hoursIn24HrFormat;
    const timeMin=minutes<10?"0"+minutes:minutes;

    timeEl.innerHTML=timeHr+":"+timeMin+" "+`<span id="am-pm">${ampm}</span>`;

    dateEL.innerHTML=days[day]+","+date+" "+months[month];
}, 1000);

getWeatherData();

function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success)=>{

        let {latitude,longitude}=success.coords;
        console.log(longitude,latitude);
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res=>res.json()).then(data=>{
            console.log(data);
            showWeatherData(data);
        })
    })
}

function getSearchData(longitude,latitude){

        console.log(longitude,latitude);
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res=>res.json()).then(data=>{
            console.log(data);
            showWeatherData(data);
        })
}

function showWeatherData(data){
    let {humidity,pressure,sunrise,sunset,wind_speed}=data.current;

    timezone.textContent=data.timezone;
    countryEl.textContent=data.lat+"N"+data.lon+"E";

    currentWeatherItemsEl.innerHTML=
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise*1000).format('hh:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('hh:mm a')}</div>
    </div>`;

    let otherDayForcast='';
    data.daily.forEach((day,ind)=>{
        if(ind==0){
            currentTempEl.innerHTML=`<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="w-icon" alt="weather-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>`;
        }else if(ind>0&&ind<7){
            otherDayForcast+=`<div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="w-icon" alt="weather-icon">
                <div class="temp">Night - ${day.temp.night}&#176; C</div>
                <div class="temp">Day - ${day.temp.day}&#176; C</div>
            </div>`;
        }
    })
    weatherForecastEl.innerHTML=otherDayForcast;
}

// Coded by 4shutosh
