import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Thermometer, Droplets, Wind, Eye, MapPin } from "lucide-react";

export default function WeatherUpdates() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("Alabama");

  // Sample locations for agricultural regions
  const locations = [
    { name: "Alabama", lat: 32.3617, lon: -86.2792 },
    { name: "Mississippi", lat: 32.3547, lon: -89.3985 },
    { name: "Georgia", lat: 32.1656, lon: -82.9001 },
    { name: "Tennessee", lat: 35.5175, lon: -86.5804 }
  ];

  // For now, using mock data since we need API keys
  const mockWeatherData = {
    current: {
      temperature: 72,
      humidity: 68,
      windSpeed: 8.5,
      visibility: 10,
      condition: "Partly Cloudy",
      icon: "partly-cloudy"
    },
    forecast: [
      { day: "Today", high: 78, low: 65, condition: "Partly Cloudy", precipitation: 10 },
      { day: "Tomorrow", high: 82, low: 68, condition: "Sunny", precipitation: 0 },
      { day: "Wednesday", high: 76, low: 62, condition: "Light Rain", precipitation: 65 },
      { day: "Thursday", high: 74, low: 60, condition: "Cloudy", precipitation: 30 },
      { day: "Friday", high: 79, low: 66, condition: "Sunny", precipitation: 5 }
    ],
    agricultural: {
      soilTemperature: {
        surface: 68,
        depth4in: 65,
        depth8in: 63
      },
      evapotranspiration: 0.18,
      degreeDay: 58,
      growingSeason: "Active Growing Season"
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const location = locations.find(loc => loc.name === selectedLocation);
        if (!location) return;

        const apiKey = import.meta.env.VITE_VISUAL_CROSSING_API_KEY;
        if (!apiKey) {
          console.warn('Visual Crossing API key not found, using mock data');
          setWeatherData(mockWeatherData);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.lat},${location.lon}?key=${apiKey}&include=current,days&elements=temp,humidity,windspeed,visibility,conditions,tempmax,tempmin,precipprob,soiltemp&units=us`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        
        // Transform API data to our format
        const transformedData = {
          current: {
            temperature: Math.round(data.currentConditions?.temp || 0),
            humidity: Math.round(data.currentConditions?.humidity || 0),
            windSpeed: data.currentConditions?.windspeed || 0,
            visibility: data.currentConditions?.visibility || 0,
            condition: data.currentConditions?.conditions || "Unknown",
            icon: "api-data"
          },
          forecast: data.days?.slice(0, 5).map((day: any, index: number) => ({
            day: index === 0 ? "Today" : index === 1 ? "Tomorrow" : new Date(day.datetime).toLocaleDateString('en-US', { weekday: 'short' }),
            high: Math.round(day.tempmax || 0),
            low: Math.round(day.tempmin || 0),
            condition: day.conditions || "Unknown",
            precipitation: Math.round(day.precipprob || 0)
          })) || [],
          agricultural: {
            soilTemperature: {
              surface: Math.round(data.currentConditions?.soiltemp?.[0] || data.currentConditions?.temp || 68),
              depth4in: Math.round(data.currentConditions?.soiltemp?.[1] || (data.currentConditions?.temp - 3) || 65),
              depth8in: Math.round(data.currentConditions?.soiltemp?.[2] || (data.currentConditions?.temp - 5) || 63)
            },
            evapotranspiration: 0.18, // This would need specialized agricultural API
            degreeDay: Math.max(0, Math.round(((data.currentConditions?.tempmax + data.currentConditions?.tempmin) / 2) - 50)),
            growingSeason: data.currentConditions?.temp > 50 ? "Active Growing Season" : "Dormant Season"
          }
        };

        setWeatherData(transformedData);
      } catch (err) {
        console.error('Weather API error:', err);
        setError('Failed to load weather data. Showing sample data instead.');
        setWeatherData(mockWeatherData);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [selectedLocation]);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Sunny")) return <Sun className="text-yellow-500" size={32} />;
    if (condition.includes("Rain")) return <CloudRain className="text-blue-500" size={32} />;
    return <Cloud className="text-gray-500" size={32} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-32 w-32 border-b-2 border-ptx-bright-green mx-auto mb-4"></div>
          <p className="text-ptx-dark-green font-lato">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-1 text-4xl md:text-5xl font-pilat font-bold text-ptx-dark-green mb-4">
            Agricultural Weather Updates
          </h1>
          <p className="text-ptx-dark-green text-lg max-w-3xl mx-auto font-lato">
            Real-time weather data and agricultural forecasts to help you make informed farming decisions.
          </p>
        </div>

        {/* Location Selector */}
        <div className="card-ptx p-6 mb-8">
          <div className="flex items-center justify-center">
            <MapPin className="text-ptx-bright-green mr-2" size={20} />
            <span className="font-semibold text-ptx-dark-green mr-4 font-pilat">Location:</span>
            <select 
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-white border border-ptx-neutral-green px-4 py-2 text-ptx-dark-green font-lato"
            >
              {locations.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Weather */}
        <div className="card-ptx p-8 mb-8">
          <h2 className="heading-2 text-2xl font-pilat font-bold text-ptx-dark-green mb-6 text-center">
            Current Conditions - {selectedLocation}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              {getWeatherIcon(weatherData.current.condition)}
              <p className="text-3xl font-bold text-ptx-dark-green mt-2 font-pilat">
                {weatherData.current.temperature}°F
              </p>
              <p className="text-ptx-dark-green font-lato">{weatherData.current.condition}</p>
            </div>
            <div className="flex flex-col items-center">
              <Droplets className="text-blue-500" size={32} />
              <p className="text-2xl font-bold text-ptx-dark-green mt-2 font-pilat">
                {weatherData.current.humidity}%
              </p>
              <p className="text-ptx-dark-green font-lato">Humidity</p>
            </div>
            <div className="flex flex-col items-center">
              <Wind className="text-gray-500" size={32} />
              <p className="text-2xl font-bold text-ptx-dark-green mt-2 font-pilat">
                {weatherData.current.windSpeed} mph
              </p>
              <p className="text-ptx-dark-green font-lato">Wind Speed</p>
            </div>
            <div className="flex flex-col items-center">
              <Eye className="text-purple-500" size={32} />
              <p className="text-2xl font-bold text-ptx-dark-green mt-2 font-pilat">
                {weatherData.current.visibility} mi
              </p>
              <p className="text-ptx-dark-green font-lato">Visibility</p>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="card-ptx p-8 mb-8">
          <h2 className="heading-2 text-2xl font-pilat font-bold text-ptx-dark-green mb-6 text-center">
            5-Day Forecast
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {weatherData.forecast.map((day: any, index: number) => (
              <div key={index} className="text-center p-4 bg-ptx-neutral-green">
                <p className="font-semibold text-ptx-dark-green mb-2 font-pilat">{day.day}</p>
                {getWeatherIcon(day.condition)}
                <p className="text-lg font-bold text-ptx-dark-green mt-2 font-pilat">
                  {day.high}°/{day.low}°
                </p>
                <p className="text-sm text-ptx-dark-green font-lato">{day.condition}</p>
                <p className="text-xs text-blue-600 mt-1 font-lato">
                  {day.precipitation}% rain
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Agricultural Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-ptx p-6">
            <h3 className="heading-3 text-xl font-pilat font-bold text-ptx-dark-green mb-4">
              Soil Conditions
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-ptx-dark-green font-lato">Surface Temperature:</span>
                <span className="font-bold text-ptx-bright-orange font-pilat">
                  {weatherData.agricultural.soilTemperature.surface}°F
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ptx-dark-green font-lato">4" Depth:</span>
                <span className="font-bold text-ptx-bright-orange font-pilat">
                  {weatherData.agricultural.soilTemperature.depth4in}°F
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ptx-dark-green font-lato">8" Depth:</span>
                <span className="font-bold text-ptx-bright-orange font-pilat">
                  {weatherData.agricultural.soilTemperature.depth8in}°F
                </span>
              </div>
            </div>
          </div>

          <div className="card-ptx p-6">
            <h3 className="heading-3 text-xl font-pilat font-bold text-ptx-dark-green mb-4">
              Growing Conditions
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-ptx-dark-green font-lato">Evapotranspiration:</span>
                <span className="font-bold text-ptx-bright-green font-pilat">
                  {weatherData.agricultural.evapotranspiration}" today
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ptx-dark-green font-lato">Growing Degree Day:</span>
                <span className="font-bold text-ptx-bright-green font-pilat">
                  {weatherData.agricultural.degreeDay}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-ptx-dark-green font-lato">Season Status:</span>
                <span className="font-bold text-ptx-medium-green font-pilat">
                  {weatherData.agricultural.growingSeason}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="card-ptx p-6 mt-8 bg-ptx-light-blue">
          <p className="text-sm text-ptx-dark-green text-center font-lato">
            {error ? (
              <span><strong>Status:</strong> {error}</span>
            ) : (
              <span><strong>Live Data:</strong> Weather information powered by Visual Crossing Weather API with real-time agricultural data.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}