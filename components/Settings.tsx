
import React, { useState } from 'react';
import { SyncConfig, FarmContext } from '../types';
import { exportToCSV, syncToGoogleSheets, exportToPDF } from '../services/exportService';

interface SettingsProps {
  config: SyncConfig;
  setConfig: (config: SyncConfig) => void;
  context: FarmContext;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig, context }) => {
  const [syncUrl, setSyncUrl] = useState(config.googleSheetUrl);
  const [isSyncing, setIsSyncing] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSaveConfig = () => {
    setConfig({ ...config, googleSheetUrl: syncUrl });
    setMsg({ type: 'success', text: 'Cloud configuration updated!' });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleSyncNow = async () => {
    if (!syncUrl) {
      setMsg({ type: 'error', text: 'No Web App URL provided.' });
      return;
    }
    setIsSyncing(true);
    try {
      await syncToGoogleSheets(syncUrl, context);
      const now = new Date().toISOString();
      setConfig({ ...config, lastSync: now });
      setMsg({ type: 'success', text: 'Database synchronized with WEERA Cloud.' });
    } catch (e) {
      setMsg({ type: 'error', text: 'Sync connection lost. Check your internet.' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const betterAppsScript = `function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  function syncSheet(name, collection) {
    if (!collection || collection.length === 0) return;
    var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    sheet.clear();
    var keys = Object.keys(collection[0]);
    sheet.appendRow(keys);
    var rows = collection.map(function(item) {
      return keys.map(function(key) { return item[key]; });
    });
    sheet.getRange(2, 1, rows.length, keys.length).setValues(rows);
    sheet.getRange(1, 1, 1, keys.length).setFontWeight("bold").setBackground("#3d634d").setFontColor("white");
  }

  syncSheet("Orders", data.orders);
  syncSheet("Harvests", data.harvests);
  syncSheet("Expenses", data.expenses);
  syncSheet("WorkRecords", data.workRecords);

  return ContentService.createTextOutput("Success");
}`;

  return (
    <div className="animate-fadeIn max-w-5xl">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900">System Configuration</h2>
        <p className="text-gray-500 mt-1">Manage cloud synchronization and data exports for WEERA AGRICULTURE (PVT) LTD.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Google Sheets Sync Card */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <i className="fa-brands fa-google-drive text-2xl"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900">Enterprise Cloud Sync</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Google Drive Integration</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-4">
              <p className="text-xs text-blue-800 font-bold leading-relaxed">
                <i className="fa-solid fa-bolt mr-2"></i>
                Auto-sync is enabled. The system will backup your data hourly to the configured endpoint.
              </p>
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Sync Endpoint URL</label>
              <input 
                type="text" 
                placeholder="https://script.google.com/macros/s/..."
                value={syncUrl}
                onChange={(e) => setSyncUrl(e.target.value)}
                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-medium text-sm focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {config.lastSync && (
              <p className="text-[10px] font-bold text-green-600 flex items-center gap-2">
                <i className="fa-solid fa-check-circle"></i> Last successful sync: {new Date(config.lastSync).toLocaleString()}
              </p>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={handleSaveConfig}
              className="flex-1 py-4 bg-gray-100 rounded-2xl text-xs font-black text-gray-600 hover:bg-gray-200 transition-all uppercase tracking-widest"
            >
              Update Link
            </button>
            <button 
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="flex-[2] py-4 bg-[#3d634d] rounded-2xl text-xs font-black text-white hover:bg-[#2d4d3a] transition-all shadow-lg shadow-green-100 disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {isSyncing ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
              Sync Now
            </button>
          </div>
        </div>

        {/* Professional Export Suite */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
              <i className="fa-solid fa-file-pdf text-2xl"></i>
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900">Document Export Suite</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Print-Ready Reports</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Download professional, branded documents for auditing and record-keeping.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-green-100 transition-all">
                <span className="text-sm font-bold text-gray-700">Marketplace Orders</span>
                <div className="flex gap-2">
                  <button onClick={() => exportToCSV(context.orders, 'Weera_Orders')} className="p-2 text-gray-400 hover:text-green-600"><i className="fa-solid fa-file-csv"></i></button>
                  <button onClick={() => exportToPDF(context.orders, 'Full Sales History', 'Weera_Orders_PDF')} className="p-2 text-gray-400 hover:text-red-600"><i className="fa-solid fa-file-pdf"></i></button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-green-100 transition-all">
                <span className="text-sm font-bold text-gray-700">Harvest Yields</span>
                <div className="flex gap-2">
                  <button onClick={() => exportToCSV(context.harvests, 'Weera_Harvests')} className="p-2 text-gray-400 hover:text-green-600"><i className="fa-solid fa-file-csv"></i></button>
                  <button onClick={() => exportToPDF(context.harvests, 'Production Yield History', 'Weera_Harvests_PDF')} className="p-2 text-gray-400 hover:text-red-600"><i className="fa-solid fa-file-pdf"></i></button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-green-100 transition-all">
                <span className="text-sm font-bold text-gray-700">Expense Logs</span>
                <div className="flex gap-2">
                  <button onClick={() => exportToCSV(context.expenses, 'Weera_Expenses')} className="p-2 text-gray-400 hover:text-green-600"><i className="fa-solid fa-file-csv"></i></button>
                  <button onClick={() => exportToPDF(context.expenses, 'Operational Expenditure Report', 'Weera_Expenses_PDF')} className="p-2 text-gray-400 hover:text-red-600"><i className="fa-solid fa-file-pdf"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {msg && (
        <div className={`mt-8 p-4 rounded-2xl border flex items-center gap-3 animate-slideUp ${
          msg.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          <i className={`fa-solid ${msg.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          <span className="text-sm font-bold">{msg.text}</span>
        </div>
      )}

      {/* Instructional Note */}
      <div className="mt-12 p-8 bg-[#3d634d]/5 rounded-[2rem] border border-[#3d634d]/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-extrabold text-[#3d634d] flex items-center gap-2">
            <i className="fa-solid fa-code"></i> Cloud Script Deployment
          </h4>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(betterAppsScript);
              alert("Pro Cloud Script copied to clipboard!");
            }}
            className="text-[10px] font-black bg-[#3d634d] text-white px-4 py-2 rounded-xl hover:bg-[#2d4d3a] transition-colors uppercase tracking-widest"
          >
            Copy Professional Script
          </button>
        </div>
        <p className="text-xs text-gray-600 mb-4 font-medium leading-relaxed">
          Ensure your Google Sheet is optimized for multi-tab management by using our professional sync script.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
           <div className="flex gap-3">
              <span className="w-5 h-5 bg-white rounded flex items-center justify-center border border-gray-100">1</span>
              <span>Open Google Sheet & Extensions > Apps Script</span>
           </div>
           <div className="flex gap-3">
              <span className="w-5 h-5 bg-white rounded flex items-center justify-center border border-gray-100">2</span>
              <span>Paste script & Deploy as Web App</span>
           </div>
           <div className="flex gap-3">
              <span className="w-5 h-5 bg-white rounded flex items-center justify-center border border-gray-100">3</span>
              <span>Set access to "Anyone" & Copy URL</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
