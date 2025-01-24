import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from 'react-query';
import { saveKiraiDetails, getAllRiceMills, getAllDhalariDetails } from '../services/api';
import toast from 'react-hot-toast';
import { KiraiDetails, RiceMill, DhalariDetails } from '../types';

export default function KiraiForm() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<KiraiDetails>();
  const navigate = useNavigate();
  const [riceMillSearch, setRiceMillSearch] = useState('');
  const [dhalariSearch, setDhalariSearch] = useState('');
  const [showRiceMillDropdown, setShowRiceMillDropdown] = useState(false);
  const [showDhalariDropdown, setShowDhalariDropdown] = useState(false);
  const riceMillRef = useRef<HTMLDivElement>(null);
  const dhalariRef = useRef<HTMLDivElement>(null);

  // Fetch rice mills and dhalari details
  const { data: riceMills } = useQuery(['riceMills'], getAllRiceMills, { enabled: showRiceMillDropdown });
  const { data: dhalariList } = useQuery(['dhalari'], getAllDhalariDetails, { enabled: showDhalariDropdown });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (riceMillRef.current && !riceMillRef.current.contains(event.target as Node)) {
        setShowRiceMillDropdown(false);
      }
      if (dhalariRef.current && !dhalariRef.current.contains(event.target as Node)) {
        setShowDhalariDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRiceMillSelect = (riceMill: RiceMill) => {
    setValue('riceMill', riceMill);
    setShowRiceMillDropdown(false);
    setRiceMillSearch(riceMill.name);
  };

  const handleDhalariSelect = (dhalari: DhalariDetails) => {
    setValue('dhalariDetails', dhalari);
    setShowDhalariDropdown(false);
    setDhalariSearch(dhalari.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'riceMill' | 'dhalari') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'riceMill') {
        setShowRiceMillDropdown(false);
      } else {
        setShowDhalariDropdown(false);
      }
    }
  };

  const onSubmit = async (data: KiraiDetails) => {
    try {
      await saveKiraiDetails(data);
      toast.success('Kirai details saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to save kirai details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate('/dashboard')} className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900">Kirai Registration</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* KL Number */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">KL Number *</label>
                  <input
                    {...register('klno', { required: 'Required' })}
                    type="text"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>
                {errors.klno && <p className="mt-1 text-xs text-red-600">{errors.klno.message}</p>}
              </div>

              {/* Basic Details */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-700">Loading Date</label>
                    <input
                      {...register('loadingDate')}
                      type="date"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      defaultValue={new Date().toISOString().split('T')[0]} // Set default value to current date
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-700">Reached Date</label>
                    <input {...register('reachedDate')} type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  </div>
                </div>
              </div>

              {/* Rice Mill Details */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3" ref={riceMillRef}>
  <h3 className="text-sm font-medium text-gray-900">Rice Mill Details</h3>
  <div className="space-y-2">
    <div className="relative">
      <input
        type="text"
        value={riceMillSearch}
        onChange={(e) => {
          setRiceMillSearch(e.target.value);
          setValue('riceMill.name', e.target.value);
        }}
        onFocus={() => setShowRiceMillDropdown(true)}
        onKeyDown={(e) => handleKeyDown(e, 'riceMill')}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        placeholder="Search or enter mill name"
      />
      {showRiceMillDropdown && riceMills && riceMills.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 max-h-48 overflow-auto">
          {riceMills
            .filter(mill => 
              // Ensure mill.name exists before calling toLowerCase
              mill.name?.toLowerCase().includes(riceMillSearch.toLowerCase())
            )
            .map((mill) => (
              <div 
                key={mill.id} 
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer" 
                onClick={() => handleRiceMillSelect(mill)}
              >
                {mill.name || "Unnamed Mill"} {/* Fallback for null or undefined names */}
              </div>
            ))
          }
        </div>
      )}
    </div>
    <div className="grid grid-cols-2 gap-2">
      <input 
        {...register('riceMill.phone')} 
        placeholder="Phone" 
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
      />
      <input 
        {...register('riceMill.contactPerson')} 
        placeholder="Contact Person" 
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
      />
      <input 
        {...register('riceMill.location')} 
        placeholder="Location" 
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
      />
      <input 
        {...register('riceMill.gst')} 
        placeholder="GST" 
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
      />
    </div>
  </div>
</div>


              {/* Loading Details */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Loading Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input {...register('loadingDetails.perBag')} type="number" placeholder="Per Bag" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('loadingDetails.deliveryType')} placeholder="Delivery Type" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('loadingDetails.riceType')} placeholder="Rice Type" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('loadingDetails.bagCount')} type="number" placeholder="Bag Count" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('loadingDetails.waymentType')} placeholder="Wayment Type" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('loadingDetails.loadingRate')} type="number" placeholder="Loading Rate" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('loadingDetails.commission')} type="number" placeholder="Commission" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('loadingDetails.totalRate')} type="number" placeholder="Total Rate" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
              </div>

              {/* Weightage Details */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Weightage Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input {...register('weightageDetails.billNumber')} placeholder="Bill Number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('weightageDetails.type')} placeholder="Type" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('weightageDetails.total')} type="number" placeholder="Total" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('weightageDetails.empty')} type="number" placeholder="Empty" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('weightageDetails.itemWeight')} type="number" placeholder="Item Weight" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Dhalari Details */}
  {/* Dhalari Details */}
  <div className="bg-white p-4 rounded-lg shadow-sm space-y-3" ref={dhalariRef}>
    <h3 className="text-sm font-medium text-gray-900">Dhalari Details</h3>
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={dhalariSearch}
          onChange={(e) => {
            setDhalariSearch(e.target.value);
            setValue('dhalariDetails.name', e.target.value);
          }}
          onFocus={() => setShowDhalariDropdown(true)}
          onKeyDown={(e) => handleKeyDown(e, 'dhalari')}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
          placeholder="Search or enter dhalari name"
        />
        {showDhalariDropdown && dhalariList && dhalariList.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-sm ring-1 ring-black ring-opacity-5 max-h-48 overflow-auto">
            {dhalariList
              .filter(dhalari => 
                // Ensure the name is not null or undefined before calling toLowerCase
                dhalari.name?.toLowerCase().includes(dhalariSearch.toLowerCase())
              )
              .map((dhalari) => (
                <div 
                  key={dhalari.id} 
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer" 
                  onClick={() => handleDhalariSelect(dhalari)}
                >
                  {dhalari.name || "Unnamed"} {/* Fallback for null or undefined names */}
                </div>
              ))
            }
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input 
          {...register('dhalariDetails.rythuName')} 
          placeholder="Rythu Name" 
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
        />
        <input 
          {...register('dhalariDetails.location')} 
          placeholder="Location" 
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" 
        />
      </div>
    </div>
  </div>


              {/* Lorry Details */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Lorry Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input {...register('lorryDetails.driverName')} placeholder="Driver Name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('lorryDetails.driverLocation')} placeholder="Driver Location" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('lorryDetails.ownerName')} placeholder="Owner Name" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('lorryDetails.ownerLocation')} placeholder="Owner Location" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('lorryDetails.lorryNumber')} placeholder="Lorry Number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('lorryDetails.driverNumber')} placeholder="Driver Number" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
              </div>

              {/* Kirai Details */}
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
                <h3 className="text-sm font-medium text-gray-900">Kirai Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input {...register('kiraiDetails.type')} placeholder="Type" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('kiraiDetails.perTon')} type="number" placeholder="Per Ton" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('kiraiDetails.advance')} type="number" placeholder="Advance" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('kiraiDetails.balance')} placeholder="Balance" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                  <input {...register('kiraiDetails.driverAllowances')} type="number" placeholder="Driver Allowances" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" />
                </div>
              </div>



              {/* Notes & Instructions */}

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Notes :</label>
                <input
                  {...register('notes')}
                  type="text"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Instructions :</label>
                <input
                  {...register('instructions')}
                  type="text"
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button type="button" onClick={() => navigate('/dashboard')} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div >
    </div >
  );
}