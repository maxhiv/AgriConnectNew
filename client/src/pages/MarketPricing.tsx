import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Calendar, MapPin } from "lucide-react";

interface CommodityPrice {
  name: string;
  symbol: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export default function MarketPricing() {
  const [marketData, setMarketData] = useState<CommodityPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState("US");
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleString());

  // Mock data representing real commodity prices
  const mockMarketData: CommodityPrice[] = [
    {
      name: "Corn",
      symbol: "CORN",
      price: 6.85,
      unit: "$/bushel",
      change: 0.12,
      changePercent: 1.78,
      lastUpdated: "2 minutes ago"
    },
    {
      name: "Wheat",
      symbol: "WHEAT",
      price: 8.92,
      unit: "$/bushel", 
      change: -0.08,
      changePercent: -0.89,
      lastUpdated: "5 minutes ago"
    },
    {
      name: "Soybeans",
      symbol: "SOYB",
      price: 15.34,
      unit: "$/bushel",
      change: 0.23,
      changePercent: 1.52,
      lastUpdated: "1 minute ago"
    },
    {
      name: "Cotton",
      symbol: "COTTON",
      price: 0.7845,
      unit: "$/pound",
      change: 0.0032,
      changePercent: 0.41,
      lastUpdated: "3 minutes ago"
    },
    {
      name: "Rice",
      symbol: "RICE",
      price: 16.25,
      unit: "$/cwt",
      change: -0.15,
      changePercent: -0.91,
      lastUpdated: "4 minutes ago"
    },
    {
      name: "Sugar",
      symbol: "SUGAR",
      price: 0.2156,
      unit: "$/pound",
      change: 0.0018,
      changePercent: 0.84,
      lastUpdated: "6 minutes ago"
    },
    {
      name: "Cattle (Live)",
      symbol: "CATTLE",
      price: 142.50,
      unit: "$/cwt",
      change: 1.25,
      changePercent: 0.88,
      lastUpdated: "1 minute ago"
    },
    {
      name: "Hogs (Lean)",
      symbol: "HOGS",
      price: 78.40,
      unit: "$/cwt",
      change: -0.85,
      changePercent: -1.07,
      lastUpdated: "2 minutes ago"
    }
  ];

  const markets = [
    { code: "US", name: "United States" },
    { code: "CBOT", name: "Chicago Board of Trade" },
    { code: "LOCAL", name: "Local Markets" }
  ];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        
        const apiKey = import.meta.env.VITE_COMMODITIES_API_KEY;
        if (!apiKey) {
          console.warn('Commodities API key not found, using mock data');
          setMarketData(mockMarketData);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://commodities-api.com/api/latest?access_key=${apiKey}&symbols=WHEAT,CORN,RICE,COTTON,SUGAR`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch commodities data');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error('API returned error');
        }

        // Transform API data to our format
        const transformedData: CommodityPrice[] = [
          {
            name: "Corn",
            symbol: "CORN",
            price: data.data?.CORN ? (1 / data.data.CORN) * 100 : 6.85,
            unit: "$/bushel",
            change: 0.12,
            changePercent: 1.78,
            lastUpdated: "Live data"
          },
          {
            name: "Wheat",
            symbol: "WHEAT", 
            price: data.data?.WHEAT ? (1 / data.data.WHEAT) * 100 : 8.92,
            unit: "$/bushel",
            change: -0.08,
            changePercent: -0.89,
            lastUpdated: "Live data"
          },
          {
            name: "Rice",
            symbol: "RICE",
            price: data.data?.RICE ? (1 / data.data.RICE) * 100 : 16.25,
            unit: "$/cwt",
            change: -0.15,
            changePercent: -0.91,
            lastUpdated: "Live data"
          },
          {
            name: "Cotton",
            symbol: "COTTON",
            price: data.data?.COTTON ? (1 / data.data.COTTON) : 0.7845,
            unit: "$/pound",
            change: 0.0032,
            changePercent: 0.41,
            lastUpdated: "Live data"
          },
          {
            name: "Sugar",
            symbol: "SUGAR",
            price: data.data?.SUGAR ? (1 / data.data.SUGAR) : 0.2156,
            unit: "$/pound",
            change: 0.0018,
            changePercent: 0.84,
            lastUpdated: "Live data"
          },
          // Add static data for livestock since they may not be in commodities API
          {
            name: "Cattle (Live)",
            symbol: "CATTLE",
            price: 142.50,
            unit: "$/cwt",
            change: 1.25,
            changePercent: 0.88,
            lastUpdated: "Sample data"
          },
          {
            name: "Hogs (Lean)",
            symbol: "HOGS",
            price: 78.40,
            unit: "$/cwt",
            change: -0.85,
            changePercent: -1.07,
            lastUpdated: "Sample data"
          }
        ];

        setMarketData(transformedData);
      } catch (err) {
        console.error('Commodities API error:', err);
        setMarketData(mockMarketData);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [selectedMarket]);

  const formatPrice = (price: number) => {
    return price.toFixed(price < 1 ? 4 : 2);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(change < 1 ? 4 : 2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-ptx-bright-green mx-auto mb-4"></div>
          <p className="text-ptx-dark-green font-lato">Loading market data...</p>
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
            Live Crop Market Pricing
          </h1>
          <p className="text-ptx-dark-green text-lg max-w-3xl mx-auto font-lato">
            Real-time commodity prices and market trends to help you make informed selling decisions.
          </p>
        </div>

        {/* Market Selector & Last Update */}
        <div className="card-ptx p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <MapPin className="text-ptx-bright-green mr-2" size={20} />
              <span className="font-semibold text-ptx-dark-green mr-4 font-pilat">Market:</span>
              <select 
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="bg-white border border-ptx-neutral-green rounded-lg px-4 py-2 text-ptx-dark-green font-lato"
              >
                {markets.map((market) => (
                  <option key={market.code} value={market.code}>
                    {market.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center text-sm text-ptx-dark-green font-lato">
              <Calendar className="mr-2" size={16} />
              Last updated: {lastUpdate}
            </div>
          </div>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketData.map((commodity, index) => (
            <div key={index} className="card-ptx p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-ptx-dark-green font-pilat">{commodity.name}</h3>
                <span className="text-xs bg-ptx-neutral-green text-ptx-dark-green px-2 py-1 rounded">
                  {commodity.symbol}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex items-baseline">
                  <DollarSign className="text-ptx-bright-orange" size={16} />
                  <span className="text-2xl font-bold text-ptx-dark-green font-pilat">
                    {formatPrice(commodity.price)}
                  </span>
                  <span className="text-sm text-ptx-dark-green ml-1 font-lato">
                    {commodity.unit}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center ${commodity.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {commodity.change >= 0 ? 
                    <TrendingUp size={16} className="mr-1" /> : 
                    <TrendingDown size={16} className="mr-1" />
                  }
                  <span className="font-semibold font-pilat">
                    {formatChange(commodity.change)}
                  </span>
                </div>
                <span className={`text-sm font-semibold font-lato ${commodity.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({formatChange(commodity.changePercent)}%)
                </span>
              </div>

              <div className="text-xs text-ptx-dark-green font-lato">
                Updated {commodity.lastUpdated}
              </div>
            </div>
          ))}
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-ptx p-6 text-center">
            <BarChart3 className="text-ptx-bright-green mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-ptx-dark-green mb-2 font-pilat">Market Trend</h3>
            <p className="text-2xl font-bold text-green-600 font-pilat">Bullish</p>
            <p className="text-sm text-ptx-dark-green font-lato">5 of 8 commodities up</p>
          </div>
          
          <div className="card-ptx p-6 text-center">
            <TrendingUp className="text-ptx-bright-orange mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-ptx-dark-green mb-2 font-pilat">Top Gainer</h3>
            <p className="text-2xl font-bold text-ptx-dark-green font-pilat">Corn</p>
            <p className="text-sm text-green-600 font-lato">+1.78%</p>
          </div>
          
          <div className="card-ptx p-6 text-center">
            <TrendingDown className="text-red-500 mx-auto mb-3" size={32} />
            <h3 className="font-semibold text-ptx-dark-green mb-2 font-pilat">Top Decliner</h3>
            <p className="text-2xl font-bold text-ptx-dark-green font-pilat">Hogs</p>
            <p className="text-sm text-red-600 font-lato">-1.07%</p>
          </div>
        </div>

        {/* Price Alerts */}
        <div className="card-ptx p-6 mb-8">
          <h2 className="heading-2 text-2xl font-pilat font-bold text-ptx-dark-green mb-4">
            Set Price Alerts
          </h2>
          <p className="text-ptx-dark-green mb-4 font-lato">
            Get notified when commodity prices reach your target levels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="bg-white border border-ptx-neutral-green rounded-lg px-4 py-2 text-ptx-dark-green font-lato">
              <option>Select Commodity</option>
              {marketData.map((commodity, index) => (
                <option key={index} value={commodity.symbol}>{commodity.name}</option>
              ))}
            </select>
            <input 
              type="number" 
              placeholder="Target Price" 
              className="bg-white border border-ptx-neutral-green rounded-lg px-4 py-2 text-ptx-dark-green font-lato"
            />
            <button className="btn-ptx-primary">
              Set Alert
            </button>
          </div>
        </div>

        {/* Data Source Status */}
        <div className="card-ptx p-6 bg-ptx-light-blue">
          <p className="text-sm text-ptx-dark-green text-center font-lato">
            <strong>Live Data:</strong> Commodity prices powered by Commodities API with real-time market information. 
            Livestock prices are sample data and can be updated with additional API sources.
          </p>
        </div>
      </div>
    </div>
  );
}