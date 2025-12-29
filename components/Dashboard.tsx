
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Expense, DailyTotal } from '../types';

interface DashboardProps {
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const today = new Date().toISOString().split('T')[0];
    const dailyTotal = expenses
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);

    return { total, count, dailyTotal };
  }, [expenses]);

  const chartData = useMemo(() => {
    const map = new Map<string, number>();
    // Get last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    days.forEach(day => map.set(day, 0));
    expenses.forEach(e => {
      if (map.has(e.date)) {
        map.set(e.date, (map.get(e.date) || 0) + e.amount);
      }
    });

    return Array.from(map.entries()).map(([date, amount]) => ({
      date: date.split('-').slice(1).join('/'),
      amount
    }));
  }, [expenses]);

  return (
    <div className="p-4 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Total Spent</p>
          <h3 className="text-2xl font-bold text-indigo-600">${stats.total.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-1">Spent Today</p>
          <h3 className="text-2xl font-bold text-teal-600">${stats.dailyTotal.toLocaleString()}</h3>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h4 className="text-sm font-bold text-gray-800 mb-4">Weekly Spending Trend</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#4f46e5" 
                fillOpacity={1} 
                fill="url(#colorAmt)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h5 className="text-sm font-bold text-indigo-900">AI Spending Analysis</h5>
            <p className="text-xs text-indigo-700">
              {expenses.length > 0 
                ? `You've made ${stats.count} transactions recently. Try importing more SMS messages to get a better overview of your habits.`
                : "No data yet. Tap the '+' button or go to 'Sms Import' to start tracking."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
