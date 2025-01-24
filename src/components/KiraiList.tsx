import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Printer, Eye } from 'lucide-react';
import { filterKiraiDetails, getAllKiraiDetails } from '../services/api';
import { KiraiDetails } from '../types';


const searchFields = [
  { label: 'KL Number', value: '_id' },
  { label: 'Rice Mill Name', value: 'ricemill.name' },
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
  const [showViewModal, setShowViewModal] = useState(false);



  const handleView = (kirai: KiraiDetails) => {
    setSelectedKirai(kirai);
    setShowViewModal(true);
  };

  // Query for paginated data
  const { data: paginatedData, isLoading: isLoadingPaginated } = useQuery(
    ['kiraiDetails', page],
    () => getAllKiraiDetails({ page, size: PAGE_SIZE }),
    {
      enabled: !isSearching,
    }
  );

  // Query for search results
  const { data: searchResults, isLoading: isLoadingSearch } = useQuery(
    ['kiraiSearch', selectedField, searchValue],
    () => filterKiraiDetails(selectedField, searchValue),
    {
      enabled: isSearching,
    }
  );

  const handleSearch = () => {
    if (searchValue) {
      setIsSearching(true);
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

  

  const printDetails = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && selectedKirai) {
   

      printWindow.document.write(`
        <html>
          <head>
            <title>Kirai Details - ${selectedKirai.klno}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { margin-bottom: 30px; }
              .header-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .detail-section { margin-bottom: 20px; }
              .columns { display: flex; justify-content: space-between; }
              .column { width: 48%; }
              .detail-row { margin: 8px 0; }
              .label { font-weight: bold; }
              @media print {
                body { padding: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="header-row">
                <div>
                  <div class="detail-row">
                    <span class="label">KL No:</span>
                    <span>${selectedKirai.klno}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Rice Mill Name:</span>
                    <span>${selectedKirai.riceMill.name}</span>
                  </div>
                </div>
                <div>
                  <div class="detail-row">
                    <span class="label">Date:</span>
                    <span>${selectedKirai.loadingDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="columns">
              <div class="column">
                <div class="detail-row">
                  <span class="label">1. Waybill No:</span>
                  <span>10</span>
                </div>
                <div class="detail-row">
                  <span class="label">2. Asami Name:</span>
                  <span>${selectedKirai.dhalariDetails.rythuName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">3. Dhalari Details:</span>
                  <span>${selectedKirai.dhalariDetails.name}, ${selectedKirai.dhalariDetails.location}</span>
                </div>
                <div class="detail-row">
                  <span class="label">4. Rice Type:</span>
                  <span>${selectedKirai.loadingDetails.riceType}</span>
                </div>
                <div class="detail-row">
                  <span class="label">5. Bag Count:</span>
                  <span>${selectedKirai.loadingDetails.bagCount}</span>
                </div>
                <div class="detail-row">
                  <span class="label">6. Wayment Type:</span>
                  <span>${selectedKirai.loadingDetails.waymentType}</span>
                </div>
                <div class="detail-row">
                  <span class="label">7. Lorry No:</span>
                  <span>${selectedKirai.lorryDetails.lorryNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">8. Lorry Owner:</span>
                  <span>${selectedKirai.lorryDetails.ownerName}, ${selectedKirai.lorryDetails.ownerLocation}</span>
                </div>
                <div class="detail-row">
                  <span class="label">9. Lorry Driver:</span>
                  <span>${selectedKirai.lorryDetails.driverName}, ${selectedKirai.lorryDetails.driverLocation}, ${selectedKirai.lorryDetails.driverNumber}</span>
                </div>
                <div class="detail-row">
                  <span class="label">10. Per Ton:</span>
                  <span>${selectedKirai.kiraiDetails.perTon}</span>
                </div>
                <div class="detail-row">
                  <span class="label">11. Advance:</span>
                  <span>${selectedKirai.kiraiDetails.advance}</span>
                </div>
                <div class="detail-row">
                  <span class="label">12. Balance:</span>
                  <span>${selectedKirai.kiraiDetails.balance}</span>
                </div>
                <div class="detail-row">
                  <span class="label">13. Total:</span>
                  <span>${selectedKirai.weightageDetails.total}</span>
                </div>
                <div class="detail-row">
                  <span class="label">14. Empty:</span>
                  <span>${selectedKirai.weightageDetails.empty}</span>
                </div>
                <div class="detail-row">
                  <span class="label">15. Item Weight:</span>
                  <span>${selectedKirai.weightageDetails.itemWeight}</span>
                </div>
              </div>

              <div class="column">
                <div class="detail-row">
                  <span class="label">Per Bag:</span>
                  <span>${selectedKirai.loadingDetails.perBag}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Commission:</span>
                  <span>${selectedKirai.loadingDetails.commission}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Rate:</span>
                  <span>${selectedKirai.loadingDetails.totalRate}</span>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // const KiraiDetailsView = ({ selectedKirai }: { selectedKirai: any }) => {
  //   return (
  //     <div className="p-6 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
  //       {/* Header Section */}
  //       <div className="header mb-6">
  //         <div className="flex justify-between items-center">
  //           <div>
  //             <div className="detail-row mb-2">
  //               <span className="font-bold text-gray-700">KL No:</span>
  //               <span className="ml-2">{selectedKirai.klno || 'N/A'}</span>
  //             </div>
  //             <div className="detail-row">
  //               <span className="font-bold text-gray-700">Rice Mill Name:</span>
  //               <span className="ml-2">{selectedKirai.riceMill.name || 'N/A'}</span>
  //             </div>
  //           </div>
  //           <div>
  //             <div className="detail-row">
  //               <span className="font-bold text-gray-700">Date:</span>
  //               <span className="ml-2">{selectedKirai.loadingDate || 'N/A'}</span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  
  //       {/* Details Section */}
  //       <div className="flex">
  //         {/* Left Column */}
  //         <div className="w-1/2 pr-8">
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">1. Waybill No:</span>
  //             <span className="ml-2">10</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">2. Asami Name:</span>
  //             <span className="ml-2">{selectedKirai.dhalariDetails.rythuName || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">3. Dhalari Details:</span>
  //             <span className="ml-2">
  //               {selectedKirai.dhalariDetails.name || 'N/A'}, {selectedKirai.dhalariDetails.location || 'N/A'}
  //             </span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">4. Rice Type:</span>
  //             <span className="ml-2">{selectedKirai.loadingDetails.riceType || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">5. Bag Count:</span>
  //             <span className="ml-2">{selectedKirai.loadingDetails.bagCount || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">6. Wayment Type:</span>
  //             <span className="ml-2">{selectedKirai.loadingDetails.waymentType || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">7. Lorry No:</span>
  //             <span className="ml-2">{selectedKirai.lorryDetails.lorryNumber || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">8. Lorry Owner:</span>
  //             <span className="ml-2">
  //               {selectedKirai.lorryDetails.ownerName || 'N/A'}, {selectedKirai.lorryDetails.ownerLocation || 'N/A'}
  //             </span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">9. Lorry Driver:</span>
  //             <span className="ml-2">
  //               {selectedKirai.lorryDetails.driverName || 'N/A'}, {selectedKirai.lorryDetails.driverLocation || 'N/A'},{' '}
  //               {selectedKirai.lorryDetails.driverNumber || 'N/A'}
  //             </span>
  //           </div>
  //         </div>
  
  //         {/* Right Column */}
  //         <div className="w-1/2 pl-8">
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">10. Per Ton:</span>
  //             <span className="ml-2">{selectedKirai.kiraiDetails.perTon || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">11. Advance:</span>
  //             <span className="ml-2">{selectedKirai.kiraiDetails.advance || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">12. Balance:</span>
  //             <span className="ml-2">{selectedKirai.kiraiDetails.balance || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">13. Total:</span>
  //             <span className="ml-2">{selectedKirai.weightageDetails.total || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">14. Empty:</span>
  //             <span className="ml-2">{selectedKirai.weightageDetails.empty || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">15. Item Weight:</span>
  //             <span className="ml-2">{selectedKirai.weightageDetails.itemWeight || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">16. Commission:</span>
  //             <span className="ml-2">{selectedKirai.loadingDetails.commission || 'N/A'}</span>
  //           </div>
  //           <div className="detail-row mb-2">
  //             <span className="font-bold text-gray-700">17. Total Rate:</span>
  //             <span className="ml-2">{selectedKirai.loadingDetails.totalRate || 'N/A'}</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };
  const KiraiDetailsLayout = ({ selectedKirai }: { selectedKirai: any }) => {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', lineHeight: '1.6' }}>
        {/* Header Section */}
        <div className="header mb-6">
          <div className="flex justify-between">
            <div>
              <div className="font-bold text-lg">
                KL No: <span className="font-normal">{selectedKirai.klno || 'N/A'}</span>
              </div>
              <div className="font-bold text-lg">
                Rice Mill Name: <span className="font-normal">{selectedKirai.riceMill?.name || 'N/A'}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">
                Date: <span className="font-normal">{selectedKirai.loadingDate || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* Details Section */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            {[
              ['1. Waybill No', '10'],
              ['2. Asami Name', selectedKirai.dhalariDetails?.rythuName || 'N/A'],
              [
                '3. Dhalari Details',
                `${selectedKirai.dhalariDetails?.name || 'N/A'}, ${selectedKirai.dhalariDetails?.location || 'N/A'}`,
              ],
              ['4. Rice Type', selectedKirai.loadingDetails?.riceType || 'N/A'],
              ['5. Bag Count', selectedKirai.loadingDetails?.bagCount || 'N/A'],
              ['6. Wayment Type', selectedKirai.loadingDetails?.waymentType || 'N/A'],
              ['7. Lorry No', selectedKirai.lorryDetails?.lorryNumber || 'N/A'],
              [
                '8. Lorry Owner',
                `${selectedKirai.lorryDetails?.ownerName || 'N/A'}, ${selectedKirai.lorryDetails?.ownerLocation || 'N/A'}`,
              ],
              [
                '9. Lorry Driver',
                `${selectedKirai.lorryDetails?.driverName || 'N/A'}, ${selectedKirai.lorryDetails?.driverLocation || 'N/A'}, ${selectedKirai.lorryDetails?.driverNumber || 'N/A'}`,
              ],
            ].map(([label, value], index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{label}:</span> <span>{value}</span>
              </div>
            ))}
          </div>
  
          {/* Right Column */}
          <div>
            {[
              ['10. Per Ton', selectedKirai.kiraiDetails?.perTon || 'N/A'],
              ['11. Advance', selectedKirai.kiraiDetails?.advance || 'N/A'],
              ['12. Balance', selectedKirai.kiraiDetails?.balance || 'N/A'],
              ['13. Total', selectedKirai.weightageDetails?.total || 'N/A'],
              ['14. Empty', selectedKirai.weightageDetails?.empty || 'N/A'],
              ['15. Item Weight', selectedKirai.weightageDetails?.itemWeight || 'N/A'],
              ['16. Commission', selectedKirai.loadingDetails?.commission || 'N/A'],
              ['17. Total Rate', selectedKirai.loadingDetails?.totalRate || 'N/A'],
            ].map(([label, value], index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{label}:</span> <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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
                        onClick={() => handleView(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
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
                <h3 className="text-lg font-medium text-gray-900">Print Preview - {selectedKirai.klno}</h3>
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
            </div>
          </div>
        )}

        {/*View Modle*/}
        {showViewModal && selectedKirai && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  View Details - {selectedKirai.klno}
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="bg-gray-200 px-4 py-2 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
             
                <KiraiDetailsLayout selectedKirai={selectedKirai} />
              
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

