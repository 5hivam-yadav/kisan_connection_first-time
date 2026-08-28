import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';
import { MapPin, Search, Navigation, Filter, CheckCircle2, Send, Eye } from 'lucide-react';
import { InquiryModal } from '../components/common/InquiryModal';

// Fix Leaflet Default Marker Icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Colored Pin Icons
const createCustomIcon = (color) => {
  return new L.DivIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">🌾</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const farmerIcon = createCustomIcon('#16a34a');
const mandiIcon = createCustomIcon('#f59e0b');
const buyerIcon = createCustomIcon('#2563eb');

export const MapDiscoveryPage = () => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [inquiryModalListing, setInquiryModalListing] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [showFarmers, setShowFarmers] = useState(true);
  const [showMandis, setShowMandis] = useState(true);
  const [userCenter, setUserCenter] = useState([20.1983, 73.8344]); // Default Nashik/Pune region

  const mandis = [
    { name: "Lasalgaon APMC Mandi", lat: 20.1472, lng: 74.2256, state: "Maharashtra", crop: "Onion & Tomato" },
    { name: "Azadpur APMC Mandi", lat: 28.7183, lng: 77.1758, state: "Delhi", crop: "All Fruits & Veg" },
    { name: "Khanna Grain Market", lat: 30.7046, lng: 76.2163, state: "Punjab", crop: "Basmati & Wheat" },
    { name: "Guntur Mirchi Yard", lat: 16.2437, lng: 80.6400, state: "Andhra Pradesh", crop: "Red Chilli" },
    { name: "Vashi Agricultural Market", lat: 19.0760, lng: 72.9986, state: "Mumbai", crop: "Wholesale Hub" },
    { name: "Indore Mandi", lat: 22.9774, lng: 75.8239, state: "Madhya Pradesh", crop: "Soybean & Wheat" }
  ];

  useEffect(() => {
    const fetchMapListings = async () => {
      try {
        const res = await api.get('/listings');
        if (res.success) {
          setListings(res.listings);
        }
      } catch (err) {
        console.log('Error loading map listings:', err.message);
      }
    };
    fetchMapListings();
  }, []);

  const filteredListings = listings.filter(l => 
    !searchFilter || 
    l.cropName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    l.location.district.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Map Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <MapPin className="w-7 h-7 text-emerald-600" />
            <span>Map-Based Regional Discovery</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Locate nearby farmers, fresh harvest clusters, and major APMC mandis
          </p>
        </div>

        {/* Quick Search on Map */}
        <div className="w-full md:w-80 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by crop (Tomato, Onion...)"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Layer Filters */}
      <div className="flex items-center space-x-3 text-xs font-semibold">
        <label className="flex items-center space-x-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border">
          <input
            type="checkbox"
            checked={showFarmers}
            onChange={(e) => setShowFarmers(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded"
          />
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Farmer Listings ({filteredListings.length})</span>
          </span>
        </label>

        <label className="flex items-center space-x-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border">
          <input
            type="checkbox"
            checked={showMandis}
            onChange={(e) => setShowMandis(e.target.checked)}
            className="w-4 h-4 text-amber-600 rounded"
          />
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>APMC Mandis ({mandis.length})</span>
          </span>
        </label>
      </div>

      {/* Interactive Leaflet Map Box */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg h-[550px] relative z-10">
        <MapContainer
          center={userCenter}
          zoom={6}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Farmer Listings Markers */}
          {showFarmers && filteredListings.map((l) => (
            <Marker
              key={l._id}
              position={[
                l.location.coordinates?.lat || 20.0, 
                l.location.coordinates?.lng || 73.8
              ]}
              icon={farmerIcon}
            >
              <Popup>
                <div className="p-1 space-y-2 min-w-[180px]">
                  <img
                    src={l.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200'}
                    alt={l.cropName}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{l.cropName}</h4>
                    <p className="text-[11px] font-bold text-emerald-700">₹{l.price.toLocaleString()} / {l.unit}</p>
                    <p className="text-[10px] text-slate-500">Farmer: {l.farmerName} • {l.location.district}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <Link
                      to={`/listings/${l._id}`}
                      className="py-1 px-2 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-lg"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => setInquiryModalListing(l)}
                      className="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Mandi Hubs Markers */}
          {showMandis && mandis.map((m, idx) => (
            <Marker
              key={idx}
              position={[m.lat, m.lng]}
              icon={mandiIcon}
            >
              <Popup>
                <div className="p-1 space-y-1">
                  <h4 className="font-bold text-xs text-amber-900">🏛️ {m.name}</h4>
                  <p className="text-[11px] text-slate-600">{m.state} • Key: {m.crop}</p>
                  <Link
                    to="/price-discovery"
                    className="text-[10px] font-bold text-emerald-600 hover:underline block pt-1"
                  >
                    View Mandi Price Trends →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>

      {/* Inquiry Modal */}
      {inquiryModalListing && (
        <InquiryModal
          listing={inquiryModalListing}
          isOpen={!!inquiryModalListing}
          onClose={() => setInquiryModalListing(null)}
        />
      )}

    </div>
  );
};
