import { useState } from 'react'
import not_found from './assets/not_found.png'
import loading_img from './assets/loading.png'
import './App.css'


const api = {
  key: "88a952a953cd8a64b098c5a97d4fc367",
  key2: "8f0afb83cdd2450faf3ed3a5835e03d7",
  base: "https://api.openweathermap.org/data/2.5/",
  worldTime: 'http://worldtimeapi.org/api/timezone/'
}


function App() {
  //const [count, setCount] = useState(0)
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);


  // const getTime = ()=> {
  //   try{
  //     //do something
  //     fetch(`${api.worldTime}${query}`).
  //     then(response => response.json())
  //     .then(data => {
  //       var currentTime = data.datetime;
  //       console.log(currentTime)
  //       return currentTime;
  //     })
  //   }catch(error){
  //     setLoading(false)
  //     console.log('Something went wrong!')
  //   }
  // }

  function getCurrentTime(cityOrCountry) {
    var geocodingApiUrl = "https://api.opencagedata.com/geocode/v1/json";
    var geocodingApiKey = "8f0afb83cdd2450faf3ed3a5835e03d7"; // Replace with your OpenCage Geocoding API key
  
    // Perform a geocoding request to convert the city or country name into coordinates
    var geocodingUrl = `${geocodingApiUrl}?q=${encodeURIComponent(cityOrCountry)}&key=${geocodingApiKey}`;
  
    return fetch(geocodingUrl)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results.length > 0) {
          var latitude = data.results[0].geometry.lat;
          var longitude = data.results[0].geometry.lng;
  
          // Retrieve the current time zone based on the coordinates
          var timezoneApiUrl = "http://worldtimeapi.org/api/timezone";
          var timezoneUrl = `${timezoneApiUrl}?lat=${latitude}&lng=${longitude}`;
  
          return fetch(timezoneUrl)
            .then(response => response.json())
            .then(timezoneData => {
              var currentTime = timezoneData.datetime;
              return currentTime;
            });
        } else {
          throw new Error("No matching location found for the provided city or country.");
        }
      });
  }

  const search = evt => {
    if (evt.key === "Enter") {
      setLoading(true)
      try{
        fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
          setQuery('');
          setLoading(false)
          console.log(result);
        }) 
      }catch(error){
        setLoading(false)
        console.log('Something went wrong!')
      }
       
    }
  }
  const getResults = ()=>{
    // Usage example
  var location = query; // Replace with the desired city or country name
  getCurrentTime(location)
    .then(currentTime => {
      console.log("Current time in " + location + ": " + currentTime);
    })
    .catch(error => {
      console.log("Error retrieving current time:", error);
    });
    try{
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery('');
        setLoading(false)
        console.log(result);
      }) 
    }catch(error){
      setLoading(false)
      console.log('Something went wrong!')
    }
  }

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`
  }
  return (
    <>
      <div className={(typeof weather.main != "undefined") ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'free'}>
        <div className='main'>
          <div className="search-box  relative w-[90%] sm:w-[80%] md:w-[70%] lg:w-1/2 mx-auto my-10 flex justify-center">
            <input
              type="text"
              className="search-bar rounded-[50px]"
              placeholder="Search..."
              onChange={e => setQuery(e.target.value)}
              value={query}
              onKeyDown={search}
            />
            <button onClick={getResults} className="hidden md:block absolute -right-16 bottom-0 text-white text-2xl px-3 p-2 rounded-full bg-[#ffffffbf]"><i className='bx bx-search text-4xl text-white'></i></button>
          </div>
          {typeof weather.main != "undefined" && <div>
              <div className="text-3xl text-black location-box">
                <div className="location">{weather.name}, {weather.sys.country}</div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temp">
                {Math.round(weather.main.temp)}°c
                </div>
                <div className="weather flex flex-col justify-center space-x-3">
                  <div className="mx-auto">
                    <i className='bx bx-wind mx-2 text-[4rem] text-white'></i>
                    <p className=" flex items-center">
                      {Math.round(weather.wind.speed)* 10} Km/h
                    </p>
                  </div>
                  <p className=" px-2">{weather.weather[0].main}</p>
                </div>
              </div>
            </div>}
            {typeof weather.main == "undefined" && loading && <div className=" mx-auto w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/5">
              <h1 className=" text-center text-3xl font-semibold text-white my-5">Getting Results...</h1>
              <div className='w-auto bg-[#ffffff80] shadow-md appearance-none rounded-md h-60'>
                <img className=" h-full mx-auto animate-spin" src={loading_img} alt={"loading"}/>
              </div>
            </div>}
            {typeof weather.main == "undefined" && !loading && <div className=" mx-auto w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/5">
              <h1 className=" text-center text-3xl font-semibold text-white my-5">No Results</h1>
              <h1 className=" text-center text-2xl font-semibold text-white my-5">Search above</h1>
              <div className='w-auto bg-[#ffffff80] shadow-md appearance-none rounded-md h-60'>
                <img className=" h-full mx-auto" src={not_found} alt={"not found"}/>
              </div>
            </div>}
          {/* {(typeof weather.main != "undefined") ? (
            <div>
              <div className="text-3xl text-black location-box">
                <div className="location">{weather.name}, {weather.sys.country}</div>
                <div className="date">{dateBuilder(new Date())}</div>
              </div>
              <div className="weather-box">
                <div className="temp">
                {Math.round(weather.main.temp)}°c
                </div>
                <div className="weather">{weather.weather[0].main}</div>
              </div>
            </div>
          ): (
            <div className=" mx-auto w-1/5">
              <h1 className=" text-center text-3xl font-semibold text-white my-5">No Results</h1>
              <h1 className=" text-center text-2xl font-semibold text-white my-5">Search above</h1>
              <div className='w-auto bg-[#ffffff80] shadow-md appearance-none rounded-md h-60'>
                <img className=" h-full mx-auto" src={not_found} alt={"not found"}/>
              </div>
            </div>)} */}
          
        </div>
        
      </div>

    </>
  )
}

export default App
