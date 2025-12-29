
import React, { useState, useEffect, useCallback } from 'react';
import { Expense, AppTab } from './types';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import SmsImporter from './components/SmsImporter';
import ManualEntry from './components/ManualEntry';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [showManualModal, setShowManualModal] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('sms_expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('sms_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = useCallback((expense: Expense) => {
    setExpenses(prev => [expense, ...prev].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 max-w-md mx-auto shadow-xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">SmsSpend Tracker</h1>
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'dashboard' && <Dashboard expenses={expenses} />}
        {activeTab === 'expenses' && <ExpenseList expenses={expenses} onDelete={deleteExpense} />}
        {activeTab === 'import' && <SmsImporter onImport={addExpense} />}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowManualModal(true)}
        className="fixed bottom-20 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all z-40 lg:right-[calc(50%-13rem)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Manual Entry Modal */}
      {showManualModal && (
        <ManualEntry onAdd={addExpense} onClose={() => setShowManualModal(false)} />
      )}

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 safe-bottom">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'expenses' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-xs mt-1">History</span>
          </button>

          <button 
            onClick={() => setActiveTab('import')}
            className={`flex flex-col items-center flex-1 transition-colors ${activeTab === 'import' ? 'text-indigo-600' : 'text-gray-400'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs mt-1">Sms Import</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
