'use client';
import { useState, useEffect } from 'react';
import { Plus, X, ChevronDown, Loader2 } from 'lucide-react';
import LocationService from '@/services/locationService';

export default function LocationSelector({ register, setValue, watch, errors }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [newState, setNewState] = useState('');
  const [newCity, setNewCity] = useState('');
  const [showAddState, setShowAddState] = useState(false);
  const [showAddCity, setShowAddCity] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const selectedState = watch('state');

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await LocationService.getStates();
        setStates(statesData);
      } catch (error) {
        console.error('Error fetching states:', error);
        alert('Failed to load states. Please try again.');
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedState) {
      setLoadingCities(true);
      const fetchCities = async () => {
        try {
          const citiesData = await LocationService.getCities(selectedState);
          setCities(citiesData);
          setValue('city', '');
        } catch (error) {
          console.error('Error fetching cities:', error);
          alert('Failed to load cities. Please try again.');
        } finally {
          setLoadingCities(false);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedState, setValue]);

  const handleAddState = async () => {
    if (!newState || !newCity) return;
    
    setIsAdding(true);
    try {
      await LocationService.addLocation({ state: newState, city: newCity });
      const updatedStates = await LocationService.getStates();
      setStates(updatedStates);
      setNewState('');
      setNewCity('');
      setShowAddState(false);
      setValue('state', newState);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddCity = async () => {
    if (!selectedState || !newCity) return;
    
    setIsAdding(true);
    try {
      await LocationService.addLocation({ state: selectedState, city: newCity });
      const updatedCities = await LocationService.getCities(selectedState);
      setCities(updatedCities);
      setNewCity('');
      setShowAddCity(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* State Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <div className="relative">
            <select
              {...register('state', { required: 'State is required' })}
              className="input-field w-full pr-10 appearance-none"
              disabled={loadingStates}
            >
              <option value="">{loadingStates ? 'Loading states...' : 'Select State'}</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {loadingStates ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
          <button
            type="button"
            onClick={() => {
              setShowAddState(!showAddState);
              if (showAddCity) setShowAddCity(false);
            }}
            className="absolute right-2 top-8 text-primary-600 hover:text-primary-800 transition-colors"
            aria-label="Add new state"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* City Selector */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <div className="relative">
            <select
              {...register('city', { required: 'City is required' })}
              className="input-field w-full pr-10 appearance-none"
              disabled={!selectedState || loadingCities}
            >
              <option value="">{loadingCities ? 'Loading cities...' : 'Select City'}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {loadingCities ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
          {selectedState && (
            <button
              type="button"
              onClick={() => {
                setShowAddCity(!showAddCity);
                if (showAddState) setShowAddState(false);
              }}
              className="absolute right-2 top-8 text-primary-600 hover:text-primary-800 transition-colors"
              aria-label="Add new city"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Add New State Form */}
      {showAddState && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">Add New State</h4>
            <button 
              onClick={() => setShowAddState(false)} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close add state form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">State Name</label>
              <input
                type="text"
                placeholder="e.g. California"
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="input-field"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">First City</label>
              <input
                type="text"
                placeholder="e.g. Los Angeles"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex justify-end mt-3 space-x-2">
            <button
              type="button"
              onClick={() => setShowAddState(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddState}
              disabled={!newState || !newCity || isAdding}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-20"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Add State'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Add New City Form */}
      {showAddCity && selectedState && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">
              Add City to <span className="text-primary-600">{selectedState}</span>
            </h4>
            <button 
              onClick={() => setShowAddCity(false)} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close add city form"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">City Name</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. New York City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="input-field flex-1"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddCity}
                disabled={!newCity || isAdding}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-4 flex items-center justify-center min-w-20"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Add City'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}