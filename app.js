const form = document.querySelector("form")
const input = document.querySelector("form input")
const warning = document.querySelector("span.warning")
const list = document.querySelector(".result-area .cities")


// localStorage.setItem("tokenKey", "x0IQvRF7sPoJ6j5IYOTss7xdyNbmvz9sXL+jN97DzZMlMrUHadY6Qr8DXjytMUWD")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    getWeather()
})

const getWeather = async () => {
    // const tokenKey = DecryptStringAES(localStorage.getItem("tokenKey"))
    const tokenKey = "226b643ce59aeeeb00e4b2bb779743ab"
    const inputValue = input.value
    const units = "metric"
    const lang = "tr"

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`
    console.log(url)

    try {
        const response = await axios(url)
        console.log(response)

        const {
            main,
            sys,
            weather,
            name
        } = response.data

        const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

        const cityNameSpans = list.querySelectorAll(".city span")
        const cityNameSpansArray = Array.from(cityNameSpans)
        if (cityNameSpansArray.length > 0) {
            const filteredArray = cityNameSpansArray.filter(span => span.innerText == name)
            if (filteredArray.length > 0) {
                warning.innerText = `You already know the weather for ${name}, Please search for another city😉`
                setTimeout(() => {
                    warning.innerText = ""
                }, 4000)
                form.reset()
                return
            }
        }

        const createdLi = document.createElement("li")
        createdLi.classList.add("city")
        createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${sys.country}">
  <span>${name}</span>
  <sup>${sys.country}</sup>
 </h2>
 <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
 <figure>
  <img class="city-icon" src="${iconUrl}">
  <figcaption>${weather[0].description}</figcaption>
 </figure>`;

        list.prepend(createdLi)

    } catch (error) {
        console.log(error)
        warning.innerText = `404 (City Not Found)`
        setTimeout(() => {
            warning.innerText = ""
        }, 5000)

    }
    form.reset()

}