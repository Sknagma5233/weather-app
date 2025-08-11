import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Loader2, Thermometer, Droplets, Wind, Gauge } from 'lucide-react';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');

  const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  // Set background based on weather condition
  useEffect(() => {
    if (!weatherData) {
      setBackgroundImage('url(https://images.unsplash.com/photo-1499002238440-d264edd596ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80)');
      return;
    }

    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    let query = 'weather';

    switch (weatherCondition) {
      case 'clear':
        query = 'sunny+sky';
        break;
      case 'clouds':
        query = 'cloudy+sky';
        break;
      case 'rain':
      case 'drizzle':
        query = 'rainy+city';
        break;
      case 'thunderstorm':
        query = 'storm+lightning';
        break;
      case 'snow':
        query = 'winter+snow';
        break;
      case 'mist':
      case 'fog':
      case 'haze':
        query = 'foggy+landscape';
        break;
      default:
        query = 'weather';
    }

    const backgrounds = {
      'clear': 'https://images.unsplash.com/photo-1560258018-c7db7645254e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'clouds': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'rain': 'https://images.unsplash.com/photo-1438449805896-28a666819a20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'thunderstorm': 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'snow': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'mist': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      'default': 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'
    };

    setBackgroundImage(`url(${backgrounds[weatherCondition] || backgrounds['default']})`);
  }, [weatherData]);

  const fetchWeatherByCity = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setWeatherData(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const { data } = await axios.get(url);
      setTimeout(() => {
        setWeatherData(data);
        setLoading(false);
      }, 800);
    } catch {
      setError('City not found. Please try again.');
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError('');
    setWeatherData(null);

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
          const { data } = await axios.get(url);
          setTimeout(() => {
            setWeatherData(data);
            setLoading(false);
          }, 800);
        } catch {
          setError('Failed to fetch weather for your location.');
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError('Location access denied or unavailable.');
      }
    );
  };

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain': case 'drizzle': return '🌧️';
      case 'thunderstorm': return '⛈️';
      case 'snow': return '❄️';
      case 'mist':
      case 'fog':
      case 'haze': return '🌫️';
      default: return '🌈';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeatherByCity();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 text-white transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `${backgroundImage}, linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden bg-black/30 backdrop-blur-md">
        <div className="p-6">
          {/* Header with week and date */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">W4</h2>
            </div>
            <div className="text-right">
              <p className="text-lg">{weatherData ? `${Math.round(weatherData.main.temp)}° ${weatherData.name}` : '16° London'}</p>
              <p className="text-sm text-white/80">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search Location..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full rounded-full bg-white/20 px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={fetchWeatherByCity}
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Weather details */}
          {weatherData && !error && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Weather Details...</h3>
                <span className="text-2xl">{getWeatherIcon(weatherData.weather[0].main)}</span>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <p className="text-xl font-bold mb-2">{weatherData.weather[0].main.toUpperCase()} {weatherData.weather[0].description.includes('drizzle') && 'WITH LIGHT DRIZZLE'}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/70">Temp max</p>
                    <p className="text-lg">{Math.round(weatherData.main.temp_max)}°</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Temp min</p>
                    <p className="text-lg">{Math.round(weatherData.main.temp_min)}°</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Humidity</p>
                    <p className="text-lg">{weatherData.main.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Cloudy</p>
                    <p className="text-lg">{weatherData.clouds.all}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Wind</p>
                    <p className="text-lg">{weatherData.wind.speed}km/h</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Today's forecast */}
          <div>
            <h3 className="text-lg font-medium mb-3">Today's Weather Forecast...</h3>
            <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between">
              <span>09:00</span>
              <span className="text-xl">{weatherData?.weather[0].main === 'Snow' ? '❄️ Snow' : `${Math.round(weatherData?.main.temp || 19)}°`}</span>
            </div>
          </div>

          {loading && (
            <div className="mt-8 flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin text-white" size={40} />
              <p className="mt-4 text-white/80">Fetching weather data...</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-400/20 rounded-xl border border-red-400/30">
              <p className="text-center text-red-100 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Current location button */}
        <button
          onClick={fetchWeatherByLocation}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-3 transition"
        >
          <MapPin size={18} />
          Use Current Location
        </button>
      </div>
    </div>
  );
};

export default Weather;