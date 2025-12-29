
import React, { useState } from 'react';
import { parseSmsToExpense } from '../geminiService';
import { Expense } from '../types';

interface SmsImporterProps {
  onImport: (expense: Expense) => void;
}

const SmsImporter: React.FC<SmsImporterProps> = ({ onImport }) => {
  const [smsText, setSmsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleImport = async (textToProcess: string = smsText) => {
    if (!textToProcess.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const parsed = await parseSmsToExpense(textToProcess);
      if (parsed.amount && parsed.merchant) {
        onImport(parsed as Expense);
        setSmsText('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("AI couldn't find an amount or merchant in that text. Try copying the full SMS.");
      }
    } catch (err) {
      setError("Failed to connect to AI service. Ensure you have internet.");
    } finally {
      setLoading(false);
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSmsText(text);
        handleImport(text);
      }
    } catch (err) {
      setError("Couldn't access clipboard. Please paste manually.");
    }
  };

  const sampleMessages = [
    "Debit Card Transaction of USD 24.50 at STARBUCKS NY on 2024-05-12.",
    "Order #1234 confirmed. You spent $55.00 at Amazon.com today.",
    "BILLS: Your utility payment of $142.10 was processed successfully."
  ];

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Sync SMS Data</h3>
        <p className="text-sm text-gray-500 mb-4">
          In a native app, this would happen automatically. Here, simply copy a transaction SMS and click the button below to parse it instantly.
        </p>
        
        <div className="relative mb-4">
          <textarea
            value={smsText}
            onChange={(e) => setSmsText(e.target.value)}
            placeholder="Paste your transaction SMS here..."
            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
          />
          <button 
            onClick={pasteFromClipboard}
            className="absolute right-3 bottom-3 bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            Paste Clipboard
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl mb-4 border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1-1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-xl mb-4 border border-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-xs font-medium">Expense added successfully!</p>
          </div>
        )}

        <button
          onClick={() => handleImport()}
          disabled={loading || !smsText}
          className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            loading || !smsText 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 active:scale-95'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Gemini is reading...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Analyze Text</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Try common bank formats</h4>
        <div className="space-y-3">
          {sampleMessages.map((msg, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSmsText(msg);
                handleImport(msg);
              }}
              className="w-full text-left p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 hover:border-indigo-200 hover:bg-white transition-all shadow-sm"
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmsImporter;
