import React from "react";
import { 
  Milk, 
  Users, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Thermometer, 
  Wheat, 
  Briefcase 
} from "lucide-react";
import { DairyState } from "../types";

interface MetricCardsProps {
  state: DairyState;
  onNavigateToAI: () => void;
}

export function MetricCards({ state, onNavigateToAI }: MetricCardsProps) {
  // Aggregate statistics
  const totalRawMilk = state.inventory
    .filter((item) => item.category === "Raw Milk")
    .reduce((sum, item) => sum + item.quantity, 0);

  const milkTemp = state.inventory.find((i) => i.category === "Raw Milk")?.temperature ?? 3.4;

  const totalFeed = state.inventory
    .filter((item) => item.category === "Cattle Feed")
    .reduce((sum, item) => sum + item.quantity, 0);

  const activeEmployees = state.employees.filter((e) => e.status === "Active").length;

  const totalSales = state.transactions
    .filter((t) => t.type === "Sale" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingSalesCount = state.transactions
    .filter((t) => t.type === "Sale" && t.status === "Pending").length;

  const totalExpenses = state.transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const financialBalance = totalSales - totalExpenses;

  // Warning calculations
  const lowFeedWarning = totalFeed < 1200;
  const tempWarning = milkTemp > 4.0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-1">
      {/* Milk Storage Metric Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
            <Milk className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <Thermometer className="h-3.5 w-3.5" />
            <span>{milkTemp}°C</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">Raw Milk Inventory</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
            {totalRawMilk.toLocaleString()} <span className="text-sm font-normal text-slate-400">liters</span>
          </h3>
        </div>
        {tempWarning ? (
          <div className="flex items-center gap-1.5 mt-3 text-amber-600 bg-amber-50 px-2.5 py-1.5 rounded-lg text-xs font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Temperature spike alert! Keep below 4°C.</span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            Cold-chain status optimal
          </p>
        )}
      </div>

      {/* Feed Silo Level Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
            <Wheat className="h-6 w-6" />
          </div>
          <span className="text-xs font-medium text-slate-400">Granary Silo</span>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">Cattle Feed Reserves</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
            {totalFeed.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
          </h3>
        </div>
        {lowFeedWarning ? (
          <div className="flex items-center gap-1.5 mt-3 text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg text-xs font-medium animate-pulse">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Refill needed (Minimum 1000kg target)</span>
          </div>
        ) : (
          <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
            ✓ Reserves comfortable for 14 days
          </p>
        )}
      </div>

      {/* Financial Statement Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          {pendingSalesCount > 0 && (
            <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {pendingSalesCount} PND
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">Net Ledger Balance</p>
          <h3 className={`text-2xl font-bold tracking-tight ${financialBalance >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
            ${financialBalance.toLocaleString()}
          </h3>
        </div>
        <div className="flex justify-between items-center mt-3 text-xs text-slate-400 border-t border-slate-50 pt-2">
          <span>Sales: <strong className="text-slate-600">${totalSales}</strong></span>
          <span>Costs: <strong className="text-slate-600">${totalExpenses}</strong></span>
        </div>
      </div>

      {/* Workforce Summary Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg">
            <Users className="h-6 w-6" />
          </div>
          <button 
            onClick={onNavigateToAI}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 transition-colors px-2 py-1 rounded-md cursor-pointer"
          >
            <Sparkles className="h-3 w-3 text-indigo-500" />
            AI Optimized
          </button>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">Active Roster Shifts</p>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
            {activeEmployees} <span className="text-sm font-normal text-slate-400">on duty</span>
          </h3>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
          <span>Total team of {state.employees.length} registers</span>
        </p>
      </div>
    </div>
  );
}
