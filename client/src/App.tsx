import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Dealers from "@/pages/dealers";
import Resources from "@/pages/resources";
import ResourceDetail from "@/pages/resource-detail";
import FarmingGuides from "@/pages/FarmingGuides";
import WeatherUpdates from "@/pages/WeatherUpdates";
import WordPressPosts from "@/pages/wordpress-posts";
import WordPressPostDetail from "@/pages/wordpress-post-detail";
import TerritoryHub from "@/pages/TerritoryHub";
import LocationPage from "@/pages/LocationPage";
import ServicePage from "@/pages/ServicePage";
import CropPage from "@/pages/CropPage";
import FieldDemo from "@/pages/FieldDemo";
import NewsArticlePage from "@/pages/news-article";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/product/:slug" component={ProductDetail} />
      <Route path="/dealers" component={Dealers} />
      <Route path="/resources" component={Resources} />
      <Route path="/resources/:id" component={ResourceDetail} />
      <Route path="/farming-guides" component={FarmingGuides} />
      <Route path="/weather-updates" component={WeatherUpdates} />
      <Route path="/wordpress/posts" component={WordPressPosts} />
      <Route path="/wordpress/post/:slug" component={WordPressPostDetail} />
      <Route path="/news/:slug" component={NewsArticlePage} />
      
      {/* Field Demo - before other dynamic routes */}
      <Route path="/schedule-field-demo" component={FieldDemo} />
      
      {/* Service Pages */}
      <Route path="/services/:slug" component={ServicePage} />
      
      {/* Crop Pages */}
      <Route path="/crops/:slug" component={CropPage} />
      
      {/* County and City Pages - unified location handler */}
      <Route path="/alabama/:location/precision-agriculture" component={LocationPage} />
      <Route path="/mississippi/:location/precision-agriculture" component={LocationPage} />
      <Route path="/florida/:location/precision-agriculture" component={LocationPage} />
      <Route path="/tennessee/:location/precision-agriculture" component={LocationPage} />
      
      {/* Territory Hub Pages - specific routes */}
      <Route path="/alabama-precision-agriculture" component={TerritoryHub} />
      <Route path="/mississippi-precision-agriculture" component={TerritoryHub} />
      <Route path="/northwest-florida-precision-agriculture" component={TerritoryHub} />
      <Route path="/central-tennessee-precision-agriculture" component={TerritoryHub} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
