
import React, { useState, useEffect } from 'react';
import { ViewState, HarvestRecord, WorkRecord, Order, ExpenseRecord, SyncConfig } from './types';
import { CORRECT_PIN, INITIAL_ORDERS, DEFAULT_SYNC_URL } from './constants';
import { syncToGoogleSheets } from './services/exportService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Harvest from './components/Harvest';
import WorkRecords from './components/WorkRecords';
import Orders from './components/Orders';
import Reports from './components/Reports';
import Expenses from './components/Expenses';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import GeminiAssistant from './components/GeminiAssistant';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  
  const [harvests, setHarvests] = useState<HarvestRecord[]>(() => {
    const saved = localStorage.getItem('harvests');
    return saved ? JSON.parse(saved) : [];
  });
  const [workRecords, setWorkRecords] = useState<WorkRecord[]>(() => {
    const saved = localStorage.getItem('workRecords');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [syncConfig, setSyncConfig] = useState<SyncConfig>(() => {
    const saved = localStorage.getItem('syncConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.googleSheetUrl) parsed.googleSheetUrl = DEFAULT_SYNC_URL;
      return parsed;
    }
    return { googleSheetUrl: DEFAULT_SYNC_URL, lastSync: null };
  });

  useEffect(() => {
    localStorage.setItem('harvests', JSON.stringify(harvests));
    localStorage.setItem('workRecords', JSON.stringify(workRecords));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('syncConfig', JSON.stringify(syncConfig));
  }, [harvests, workRecords, orders, expenses, syncConfig]);

  // Hourly Auto-Sync Logic
  useEffect(() => {
    if (isLoggedIn && syncConfig.googleSheetUrl) {
      const checkAndSync = async () => {
        const now = Date.now();
        const lastSyncTime = syncConfig.lastSync ? new Date(syncConfig.lastSync).getTime() : 0;
        const ONE_HOUR = 3600000;

        // If never synced or last sync was more than an hour ago
        if (now - lastSyncTime >= ONE_HOUR) {
          console.log("Triggering Hourly Auto-Sync...");
          try {
            const context = { harvests, workRecords, orders, expenses };
            await syncToGoogleSheets(syncConfig.googleSheetUrl, context);
            setSyncConfig(prev => ({ ...prev, lastSync: new Date().toISOString() }));
          } catch (e) {
            console.warn("Auto-sync failed, will retry later.");
          }
        }
      };

      // Check on mount/login
      checkAndSync();

      // Also set an interval to check every 15 minutes while the app is open
      const interval = setInterval(checkAndSync, 900000); 
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, syncConfig.googleSheetUrl, syncConfig.lastSync, harvests, workRecords, orders, expenses]);

  const handleLogin = (pin: string) => {
    if (pin === CORRECT_PIN) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      throw new Error("Invalid PIN");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setCurrentView('HOME');
  };

  const navigateTo = (view: ViewState) => setCurrentView(view);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    const context = { harvests, workRecords, orders, expenses };
    switch (currentView) {
      case 'HOME': return <Dashboard onNavigate={navigateTo} harvests={harvests} orders={orders} expenses={expenses} workRecords={workRecords} />;
      case 'HARVEST': return <Harvest harvests={harvests} setHarvests={setHarvests} onBack={() => navigateTo('HOME')} />;
      case 'WORK': return <WorkRecords records={workRecords} setRecords={setWorkRecords} onBack={() => navigateTo('HOME')} />;
      case 'ORDERS': return <Orders orders={orders} setOrders={setOrders} onBack={() => navigateTo('HOME')} />;
      case 'EXPENSES': return <Expenses expenses={expenses} setExpenses={setExpenses} onBack={() => navigateTo('HOME')} />;
      case 'REPORTS': return <Reports orders={orders} expenses={expenses} onBack={() => navigateTo('HOME')} />;
      case 'SETTINGS': return <Settings config={syncConfig} setConfig={setSyncConfig} context={context} />;
      default: return <Dashboard onNavigate={navigateTo} harvests={harvests} orders={orders} expenses={expenses} workRecords={workRecords} />;
    }
  };

  return (
    <div className="flex bg-[#f3f5f4] min-h-screen">
      <Sidebar currentView={currentView} onNavigate={navigateTo} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <TopBar onLogout={handleLogout} />
        <main className="flex-1 px-8 pb-8 animate-fadeIn">
          {renderView()}
        </main>
      </div>
      <GeminiAssistant context={{ harvests, workRecords, orders, expenses }} />
    </div>
  );
};

export default App;
