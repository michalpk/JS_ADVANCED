const apiUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Praha/today?unitGroup=metric&key=KQZMXCHJS5RKNUFBNUUAB6YZ4&contentType=json'

let loading = false
let refreshed = null
let autoRefresh = setTimeout(fetchWeather, 1000 * 60 * 5)

async function fetchWeather() {
    try {
        setLoading(true)

        const res = await fetch(apiUrl)
        const data = await res.json()

        setLoading(false)
        refreshed = Date.now()

        render(data)
    
    } catch (err) {
        setLoading(false)
        
        const element = document.getElementById('refreshed')
        element.innerText = 'Error while updating data'
        element.style.color = 'red'
    }
}

function setLoading(state) {
    loading = state

    const button = document.getElementById('refresh')

    button.disabled = loading
    button.textContent = loading ? 'Loading...' : 'Refresh'
}

function updatedBefore() {
    if (!refreshed)
        return

    const now = Date.now()
    const diff = now - refreshed

    let value

    if (diff < 1000 * 60)
        value = 'Updated now'

    else {
        const minutes = Math.floor(diff / 1000 / 60)
        value = `Updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`
    }

    const element = document.getElementById('refreshed')
    element.innerText = value
}

function render(data) {
    const toRender = { ...data, ...data.currentConditions }

    for (let property in toRender) {
        const element = document.getElementById(property)

        if (element)
            element.innerText = toRender[property]
    }

    updatedBefore()

    clearTimeout(autoRefresh)
    autoRefresh = setTimeout(fetchWeather, 1000 * 60 * 5)
}

window.onload = () => {
    fetchWeather()
    setInterval(updatedBefore, 800)
}