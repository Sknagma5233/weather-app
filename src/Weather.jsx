"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  MapPin,
  Search,
  Loader2,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
} from "lucide-react"

const Weather = () => {
  const [city, setCity] = useState("")
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [backgroundImage, setBackgroundImage] = useState("")

  const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY

  // Set background based on weather condition
  useEffect(() => {
    if (!weatherData) {
      setBackgroundImage(
        "url(https://images.unsplash.com/photo-1499002238440-d264edd596ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)",
      )
      return
    }

    const weatherCondition = weatherData.weather[0].main.toLowerCase()

    const backgrounds = {
      clear:
        "https://images.unsplash.com/photo-1560258018-c7db7645254e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      clouds:
        "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      rain: "https://images.unsplash.com/photo-1438449805896-28a666819a20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      drizzle:
        "https://images.unsplash.com/photo-1438449805896-28a666819a20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      snow: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      default:
        "https://images.unsplash.com/photo-1499002238440-d264edd596ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    }

    const selectedBackground = backgrounds[weatherCondition] || backgrounds["default"]
    setBackgroundImage(`url(${selectedBackground})`)
  }, [weatherData])

  const fetchWeatherByCity = async () => {
    if (!city.trim()) return

    setLoading(true)
    setError("")
    setWeatherData(null)

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      const { data } = await axios.get(url)
      setTimeout(() => {
        setWeatherData(data)
        setLoading(false)
      }, 800)
    } catch {
      setError("City not found. Please try again.")
      setLoading(false)
    }
  }

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setLoading(true)
    setError("")
    setWeatherData(null)

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          const { data } = await axios.get(url)
          setTimeout(() => {
            setWeatherData(data)
            setLoading(false)
          }, 800)
        } catch {
          setError("Failed to fetch weather for your location.")
          setLoading(false)
        }
      },
      () => {
        setLoading(false)
        setError("Location access denied or unavailable.")
      },
    )
  }

  const getWeatherIcon = (main, size = "w-8 h-8") => {
    switch (main?.toLowerCase()) {
      case "clear":
        return <Sun className={`${size} text-yellow-500`} />
      case "clouds":
        return <Cloud className={`${size} text-gray-400`} />
      case "rain":
      case "drizzle":
        return <CloudRain className={`${size} text-blue-500`} />
      case "snow":
        return <Snowflake className={`${size} text-blue-200`} />
      default:
        return <Sun className={`${size} text-yellow-500`} />
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeatherByCity()
    }
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side - Background Image */}
      <div className="w-full lg:w-[60%] h-[50vh] lg:h-full relative overflow-hidden lg:rounded-r-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `${backgroundImage}, linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))`,
            backgroundBlendMode: "overlay",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-4 lg:mb-8">
              <h1 className="text-white text-xl sm:text-2xl font-light tracking-wide">forecast</h1>
              {weatherData && (
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-3 sm:px-4 py-2 border border-white/20">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <div className="text-white text-xs sm:text-sm">
                    <div className="font-medium">Current Location</div>
                    <div className="text-xs opacity-90">
                      {weatherData.name}, {weatherData.sys.country}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-white text-2xl sm:text-3xl lg:text-5xl font-light mb-4 lg:mb-8 max-w-lg leading-tight">
              The Only Weather Forecast You Need
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-white/60 mb-4 lg:mb-8"></div>
          </div>

          {/* Search*/}
          <div className="p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Enter location"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all text-sm sm:text-base"
                />
              </div>
              <button
                onClick={fetchWeatherByCity}
                disabled={loading}
                className="bg-white/15 backdrop-blur-sm border border-white/30 rounded-xl p-2 sm:p-3 hover:bg-white/25 transition-all disabled:opacity-50"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>

            {/* Get My Location Button */}
            <button
              onClick={fetchWeatherByLocation}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white hover:bg-white/20 transition-all disabled:opacity-50 text-sm sm:text-base"
            >
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              Get My Location
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Weather Panel */}
      <div className="w-full lg:w-[40%] bg-white flex flex-col h-[50vh] lg:h-full">
        {/* Header for Weather */}
        <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-6 flex-shrink-0">
          <div className="py-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Weather</h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="mt-4 text-gray-600 text-sm sm:text-base">Fetching weather data...</p>
            </div>
          )}

          {error && (
            <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200 mb-4 sm:mb-6">
              <p className="text-center text-red-600 font-medium text-sm sm:text-base">{error}</p>
            </div>
          )}

          {!loading && !error && !weatherData && (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Search for Weather</h3>
              <p className="text-gray-500 max-w-sm text-sm sm:text-base">
                Enter a city name or use your current location to get detailed weather information.
              </p>
            </div>
          )}

          {!loading && !error && weatherData && (
            <>
              {/* Today Section */}
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Today</h3>

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3">
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900">
                        {Math.round(weatherData.main.temp)}°
                      </span>
                      {getWeatherIcon(weatherData.weather[0].main, "w-10 h-10 sm:w-12 sm:h-12")}
                    </div>
                    <p className="text-lg sm:text-xl text-gray-700 mb-2 capitalize">
                      {weatherData.weather[0].description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Weather details cards */}
                  <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 sm:ml-8">
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 min-w-[100px] sm:min-w-[130px] flex-1 sm:flex-none">
                      <p className="text-xs text-gray-500 mb-1">Feels like</p>
                      <p className="text-sm sm:text-lg font-medium text-gray-900">
                        {Math.round(weatherData.main.feels_like)}°
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex-1 sm:flex-none">
                      <p className="text-xs text-gray-500 mb-1">Humidity</p>
                      <p className="text-sm sm:text-lg font-medium text-gray-900">{weatherData.main.humidity}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 flex-1 sm:flex-none">
                      <p className="text-xs text-gray-500 mb-1">Wind</p>
                      <p className="text-sm sm:text-lg font-medium text-gray-900">
                        {Math.round(weatherData.wind.speed * 3.6)} km/h
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weather Insights Section */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Weather Insights</h3>

                <div className="space-y-4">
                  {/* Additional Weather Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-xs sm:text-sm font-medium text-blue-900">Pressure</span>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-blue-900">{weatherData.main.pressure} hPa</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        <span className="text-xs sm:text-sm font-medium text-green-900">Visibility</span>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-green-900">
                        {weatherData.visibility ? Math.round(weatherData.visibility / 1000) : "N/A"} km
                      </p>
                    </div>
                  </div>

                  {/* Sun Times */}
                  {weatherData.sys.sunrise && weatherData.sys.sunset && (
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 sm:p-4 mt-4">
                      <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Sun Times</h4>
                      <div className="flex justify-between">
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Sunrise</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 mb-1">Sunset</p>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Weather
