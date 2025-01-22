import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Printer } from 'lucide-react';
import { filterKiraiDetails, getAllKiraiDetails } from '../services/api';
import { KiraiDetails } from '../types';

const searchFields = [
  { label: 'KL Number', value: '_id' },
  { label: 'Rice Mill Name', value: 'riceMill.name' },
  { label: 'Dhalari Name', value: 'dhalariDetails.name' }
];

const PAGE_SIZE = 10;

export default function KiraiList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [selectedField, setSelectedField] = useState(searchFields[0].value);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKirai, setSelectedKirai] = useState<KiraiDetails | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Query for paginated data
  const { data: paginatedData, isLoading: isLoadingPaginated } = useQuery(
    ['kiraiDetails', page],
    () => getAllKiraiDetails({ page, size: PAGE_SIZE }),
    {
      enabled: !isSearching,
    }
  );

  // Query for search results
  const { data: searchResults, isLoading: isLoadingSearch, refetch: refetchSearchResults } = useQuery(
    ['kiraiSearch', selectedField, searchValue],
    () => filterKiraiDetails(selectedField, searchValue),
    {
      enabled: false,
    }
  );

  const handleSearch = () => {
    if (searchValue) {
      setIsSearching(true);
      refetchSearchResults();
    } else {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
    setIsSearching(false);
  };

  const handlePrint = (kirai: KiraiDetails) => {
    setSelectedKirai(kirai);
    setShowPrintModal(true);
  };

  // const printDetails = () => {
  //   const printWindow = window.open('', '_blank');
  //   if (printWindow && selectedKirai) {
  //     printWindow.document.write(`
  //       <html>
  //         <head>
  //           <title>Kirai Details - ${selectedKirai.klno}</title>
  //           <style>
  //             body { font-family: Arial, sans-serif; padding: 20px; }
  //             .header { text-align: center; margin-bottom: 30px; }
  //             .detail-row { margin: 10px 0; }
  //             .label { font-weight: bold; min-width: 150px; display: inline-block; }
  //           </style>
  //         </head>
  //         <body>
  //           <div class="header">
  //             <h1>Kirai Details</h1>
  //             <h2>KL Number: ${selectedKirai.klno}</h2>
  //           </div>
  //           ${Object.entries(selectedKirai).map(([key, value]) => {
  //             if (typeof value === 'object') {
  //               return Object.entries(value).map(([subKey, subValue]) => `
  //                 <div class="detail-row">
  //                   <span class="label">${key}.${subKey}:</span>
  //                   <span>${subValue}</span>
  //                 </div>
  //               `).join('');
  //             }
  //             return `
  //               <div class="detail-row">
  //                 <span class="label">${key}:</span>
  //                 <span>${value}</span>
  //               </div>
  //             `;
  //           }).join('')}
  //         </body>
  //       </html>
  //     `);
  //     printWindow.document.close();
  //     printWindow.print();
  //   }
  // };
 
 
  const order = {
    riceMill: [  'contactPerson','location','phone','gst'], // Subkey order for riceMill
    dhalariDetails: ['name', 'rythuName', 'location'], // Subkey order for dhalariDetails
    mediator: ['name', 'number'], 
    loadingDate: true,
    reachedDate: true,
    weightageDetails: ['type','billNo','total', 'empty', 'itemWeight'], // Subkey order for weightageDetails
    loadingDetails: ['perBag', 'deliveryType', 'riceType', 'bagsCount', 'waymentType', 'loadingRate', 'commission', 'totalRate'], // Subkey order for loadingDetails
    lorryDetails: ['driverName', 'driverLocation', 'ownerName', 'ownerLocation', 'lorryNumber', 'driverNumber'],
    transportOffices: ['name', 'phoneNumber'], // Subkey order for transportOffices
    kiraiDetails: ['type', 'perTon', 'advance', 'balance', 'driverAllowances'],
    notes: true, 
    instructions: true
  };
  
  
 
 
  const printDetails = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && selectedKirai) {
      const aliases: Record<string, any> = {
        klno: "KL NO",
        riceMill: {
          id: "Rice Mill ID",
          name: "Rice Mill Name",
          phone: "Rice Mill Phone",
          contactPerson: "Contact Person",
          location: "Location",
          gst: "GST Number"
        },
        loadingDetails: {
          perBag: "Per Bag Rate",
          deliveryType: "Delivery Type",
          riceType: "Rice Type",
          bagCount: "Bag Count",
          waymentType: "Wayment Type",
          loadingRate: "Loading Rate",
          commission: "Commission",
          totalRate: "Total Rate"
        },
        dhalariDetails: {
          id: "Dhalari ID",
          name: "Dhalari Name",
          rythuName: "Rythu Name",
          location: "Location"
        },
        lorryDetails: {
          driverName: "Driver Name",
          driverLocation: "Driver Location",
          ownerName: "Owner Name",
          ownerLocation: "Owner Location",
          lorryNumber: "Lorry Number",
          driverNumber: "Driver Number"
        },
        weightageDetails: {
          id: "Weightage ID",
          billNumber: "Bill Number",
          type: "Weightage Type",
          total: "Total Weight",
          empty: "Empty Weight",
          itemWeight: "Item Weight"
        },
        mediator: {
          name: "Mediator Name",
          number: "Mediator Number"
        },
        notes: "Notes",
        instructions: "Instructions",
        transportOffices: {
          name: "Transport Office Name",
          phoneNumber: "Transport Office Phone"
        },
        kiraiDetails: {
          type: "Kirai Type",
          perTon: "Per Ton Rate",
          advance: "Advance Amount",
          balance: "Balance Amount",
          driverAllowances: "Driver Allowances"
        }
      };
  
      const getAlias = (key: string, subKey: string | null = null): string => {
        if (subKey && aliases[key]) {
          return aliases[key][subKey] || `${key}.${subKey}`;
        }
        return aliases[key] || key;
      };
  
      printWindow.document.write(`
        <html>
          <head>
            <title>Kirai Letter - ${selectedKirai.klno}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.8; }
              .header { text-align: center; margin-bottom: 30px; }
              .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                border-bottom: 1px dashed #ccc;
                padding-bottom: 5px;
              }
              .label {
                font-weight: bold;
                width: 40%;
                text-align: left;
                padding-right: 10px;
              }
              .value {
                width: 55%;
                text-align: left;
              }
              .colon {
                padding: 0 5px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Kirai Letter</h2>
              <h3>Sri Vinayaka Commission Agency</h3>
            </div>
  
            <!-- KL Number -->
            <div class="detail-row">
              <span class="label">${getAlias('klno')}</span>
              <span class="colon">:</span>
              <span class="value">${selectedKirai.klno || 'N/A'}</span>
            </div>
  
            <!-- Rice Mill Name -->
            <div class="detail-row">
              <span class="label">${getAlias('riceMill', 'name')}</span>
              <span class="colon">:</span>
              <span class="value">${selectedKirai.riceMill?.name || 'N/A'}</span>
            </div>
  
            <!-- Additional Details -->
            <p>Below are the detailed details of the bill:</p>
            ${Object.entries(order)
              .map(([key, subkeys]) => {
                if (subkeys === true) {
                  // Top-level keys
                  return `
                    <div class="detail-row">
                      <span class="label">${getAlias(key)}</span>
                      <span class="colon">:</span>
                      <span class="value">${selectedKirai[key] || 'N/A'}</span>
                    </div>
                  `;
                } else if (Array.isArray(subkeys) && (selectedKirai as any)[key]) {
                  // Ordered subkeys
                  return subkeys
                    .map(
                      (subKey) => `
                        <div class="detail-row">
                          <span class="label">${getAlias(key, subKey)}</span>
                          <span class="colon">:</span>
                          <span class="value">${(selectedKirai as any)[key]?.[subKey] || 'N/A'}</span>
                        </div>
                      `
                    )
                    .join('');
                }
                return ''; // Ignore keys not in order
              })
              .join('')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  
  


  const displayData = isSearching ? searchResults : paginatedData;
  const isLoading = isLoadingPaginated || isLoadingSearch;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Kirai Details List</h2>
        </div>

        {/* Search Section */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Field
              </label>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {searchFields.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Value
              </label>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter search value..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-indigo-600 px-4 py-2 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Search className="h-5 w-5" />
              </button>
              {isSearching && (
                <button
                  onClick={handleClearSearch}
                  className="bg-gray-200 px-4 py-2 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Table */}
        {!isLoading && displayData && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KL Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rice Mill Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dhalari Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.klno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.riceMill.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.dhalariDetails.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handlePrint(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Printer className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isSearching && (
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">Page {page + 1}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!paginatedData || paginatedData.length < PAGE_SIZE}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Print Modal */}
        {showPrintModal && selectedKirai && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Kirai Details - {selectedKirai.klno}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={printDetails}
                    className="bg-indigo-600 px-4 py-2 text-white rounded-md hover:bg-indigo-700"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => setShowPrintModal(false)}
                    className="bg-gray-200 px-4 py-2 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedKirai).map(([key, value]) => {
                  if (typeof value === 'object') {
                    return (
                      <div key={key} className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">{key}</h4>
                        {Object.entries(value).map(([subKey, subValue]) => (
                          <div key={`${key}-${subKey}`} className="grid grid-cols-2 gap-4 mb-2">
                            <span className="text-gray-600">{subKey}:</span>
                            <span>{String(subValue)}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="grid grid-cols-2 gap-4">
                      <span className="text-gray-600">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}