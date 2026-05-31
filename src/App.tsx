import React, { useEffect, useState } from "react";
import { 
  Milk, 
  Users, 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Info, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Layers, 
  Truck, 
  Settings,
  X,
  PhoneCall,
  Search,
  CheckCircle,
  Thermometer,
  CloudLightning
} from "lucide-react";

import { InventoryItem, Transaction, Employee, DailyLog, DairyState } from "./types";
import { MetricCards } from "./components/MetricCards";
import { AiForecastCockpit } from "./components/AiForecastCockpit";
import { MobileAppMockup } from "./components/MobileAppMockup";
import { GoogleDriveSync } from "./components/GoogleDriveSync";

export default function App() {
  const [dairyState, setDairyState] = useState<DairyState>({
    inventory: [],
    transactions: [],
    employees: [],
    logs: []
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "ledger" | "roster" | "logs" | "drive">("dashboard");
  
  // Search and Filter states
  const [invSearch, setInvSearch] = useState("");
  const [invCategoryFilter, setInvCategoryFilter] = useState("All");
  const [txTypeFilter, setTxTypeFilter] = useState("All");
  const [empStatusFilter, setEmpStatusFilter] = useState("All");

  // State triggers for forms
  const [showInvModal, setShowInvModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showEmpModal, setShowEmpModal] = useState(false);

  // Form payload inputs
  const [editingItem, setEditingItem] = useState<Partial<InventoryItem> | null>(null);
  const [newItemPay, setNewItemPay] = useState({
    name: "",
    category: "Raw Milk" as InventoryItem["category"],
    quantity: 0,
    unit: "liters",
    minimumRequired: 100,
    temperature: 3.4,
    batchNo: "",
    location: ""
  });

  const [newTxPay, setNewTxPay] = useState({
    type: "Sale" as "Sale" | "Expense",
    item: "",
    category: "Processed Milk",
    quantity: 0,
    unit: "liters",
    amount: 0,
    customerOrSupplier: "",
    operator: "",
    status: "Completed" as "Completed" | "Pending" | "Refunded"
  });

  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);
  const [newEmpPay, setNewEmpPay] = useState({
    name: "",
    role: "Farm Hand" as Employee["role"],
    shift: "Morning (06:00 - 14:00)" as Employee["shift"],
    wageRate: 15.0,
    status: "Active" as Employee["status"],
    contact: "",
    assignedTasks: [] as string[]
  });
  const [tempTaskInput, setTempTaskInput] = useState("");

  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load backend state
  const loadState = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dairy");
      const data = await res.json();
      setDairyState(data);
    } catch (err) {
      console.error("Failed to load dairy register state: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // State actions
  const resetDatabase = async () => {
    if (!confirm("Are you sure you want to reset the core database back to default factory records? This will overwrite manual changes.")) return;
    try {
      const res = await fetch("/api/dairy/reset", { method: "POST" });
      const data = await res.json();
      setDairyState(data.state);
      triggerToast("System metrics and databases restored successfully.");
    } catch (err) {
      alert("Failed database restoration request");
    }
  };

  // Submit Inventory Form
  const triggerInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = editingItem ? { ...editingItem } : { ...newItemPay };
    
    if (!payload.name) {
      alert("Name is required");
      return;
    }

    try {
      const res = await fetch("/api/dairy/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(editingItem ? "Inventory details saved successfully." : "Asset created within logistics.");
        setShowInvModal(false);
        setEditingItem(null);
        // Clear inputs
        setNewItemPay({
          name: "",
          category: "Raw Milk",
          quantity: 0,
          unit: "liters",
          minimumRequired: 100,
          temperature: 3.4,
          batchNo: "",
          location: ""
        });
        loadState();
      }
    } catch (eNum) {
      console.error(eNum);
    }
  };

  // Submit Transaction Form
  const triggerTxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxPay.item || newTxPay.quantity <= 0 || newTxPay.amount <= 0) {
      alert("Please ensure valid item, positive quantity, and positive price amount.");
      return;
    }

    try {
      const res = await fetch("/api/dairy/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTxPay)
      });
      const data = await res.json();
      if (data.success) {
        triggerToast("Ledger statement stored & stock automated.");
        setShowTxModal(false);
        setNewTxPay({
          type: "Sale",
          item: "",
          category: "Processed Milk",
          quantity: 0,
          unit: "liters",
          amount: 0,
          customerOrSupplier: "",
          operator: "",
          status: "Completed"
        });
        loadState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Employee Form
  const triggerEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = editingEmployee ? { ...editingEmployee } : { ...newEmpPay };

    if (!payload.name) {
      alert("Employee name is required.");
      return;
    }

    try {
      const res = await fetch("/api/dairy/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(editingEmployee ? "Personnel portfolio updated." : "Staff registered on payroll roster.");
        setShowEmpModal(false);
        setEditingEmployee(null);
        setNewEmpPay({
          name: "",
          role: "Farm Hand",
          shift: "Morning (06:00 - 14:00)",
          wageRate: 15.0,
          status: "Active",
          contact: "",
          assignedTasks: []
        });
        setTempTaskInput("");
        loadState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete inventory shortcut
  const removeInventoryItem = async (id: string) => {
    if (!confirm("Are you sure you want to retire this inventory asset?")) return;
    try {
      // Retiring stock to 0 to simulate deletion safely
      const matched = dairyState.inventory.find(i => i.id === id);
      if (matched) {
        await fetch("/api/dairy/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...matched, quantity: 0 })
        });
        triggerToast("Asset catalog retired to zero levels.");
        loadState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add task into form checklist
  const appendFormTask = () => {
    if (!tempTaskInput.trim()) return;
    if (editingEmployee) {
      const updatedTasks = [...(editingEmployee.assignedTasks || []), tempTaskInput.trim()];
      setEditingEmployee({ ...editingEmployee, assignedTasks: updatedTasks });
    } else {
      setNewEmpPay({ ...newEmpPay, assignedTasks: [...newEmpPay.assignedTasks, tempTaskInput.trim()] });
    }
    setTempTaskInput("");
  };

  const removeFormTask = (idx: number) => {
    if (editingEmployee) {
      const updatedTasks = [...(editingEmployee.assignedTasks || [])];
      updatedTasks.splice(idx, 1);
      setEditingEmployee({ ...editingEmployee, assignedTasks: updatedTasks });
    } else {
      const updatedTasks = [...newEmpPay.assignedTasks];
      updatedTasks.splice(idx, 1);
      setNewEmpPay({ ...newEmpPay, assignedTasks: updatedTasks });
    }
  };

  // Calculated state for graphs
  const totalInvoicedSales = dairyState.transactions
    .filter(t => t.type === "Sale" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalCostsUsed = dairyState.transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Search filter collections
  const filteredInventory = dairyState.inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(invSearch.toLowerCase()) || 
                          (item.batchNo && item.batchNo.toLowerCase().includes(invSearch.toLowerCase()));
    const matchesCategory = invCategoryFilter === "All" || item.category === invCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredTransactions = dairyState.transactions.filter(t => {
    if (txTypeFilter === "All") return true;
    return t.type === txTypeFilter;
  });

  const filteredEmployees = dairyState.employees.filter(e => {
    if (empStatusFilter === "All") return true;
    return e.status === empStatusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* Toast Alert Banner */}
      {successToast && (
        <div id="toast-success" className="fixed top-5 right-5 bg-emerald-800 text-white font-medium py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 z-50 animate-fade-in border border-emerald-700/80">
          <CheckCircle className="h-5 w-5 text-emerald-300" />
          <span className="text-sm">{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sticky top-0 z-10 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <Milk className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">Dairy Management Suite</h1>
            <p className="text-xs text-slate-500 font-medium">Responsive Web Console & Simulated Mobile Client</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetDatabase}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restore Default Logs
          </button>

          <span className="h-6 w-px bg-slate-200 hidden sm:inline-block" />

          <div className="text-right text-[11px] font-medium text-slate-500 bg-slate-50 rounded-lg p-2 border border-slate-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Cloud Sync Active Target</span>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Desktop Web Administration Console Column (Size 8 of 12) */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6">
          
          {/* Real-time Metric Cards Panel */}
          <MetricCards 
            state={dairyState} 
            onNavigateToAI={() => {
              setActiveTab("dashboard");
              setTimeout(() => {
                const element = document.getElementById("ai-cockpit-widget");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }, 100);
            }} 
          />

          {/* Tab Navigation Menu */}
          <div className="bg-white border border-slate-200 p-1.5 rounded-xl flex items-center space-x-1 shadow-xs ring-1 ring-black/5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
            >
              📊 Performance Dashboard
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "inventory" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
            >
              📦 Milk & Feed Logistics
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "roster" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
            >
              💼 Labor Roster
            </button>
            <button
              onClick={() => setActiveTab("ledger")}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "ledger" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
            >
              🧾 Cashflow Ledger
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "logs" ? "bg-slate-900 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"}`}
            >
              📋 Activity Logs
            </button>
            <button
              id="tab-gdrive-sync"
              onClick={() => setActiveTab("drive")}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "drive" ? "bg-indigo-600 text-white shadow-xs" : "text-indigo-600 hover:bg-indigo-50"}`}
            >
              💾 Google Drive
            </button>
          </div>

          {/* TAB 1: Dashboard Analytics & Charts */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Dynamic Ledger Breakdown Visualization */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Operational Financial Balance</h3>
                    <p className="text-xs text-slate-400">Comparing complete bulk milk sales against raw input expenses</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {totalCostsUsed > 0 ? `Margin Ratio: ${(totalInvoicedSales / totalCostsUsed).toFixed(1)}x` : "No Costs Grounded"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Gross Sales</span>
                    <h4 className="text-xl font-extrabold text-emerald-900">${totalInvoicedSales.toLocaleString()}</h4>
                  </div>
                  <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100/50">
                    <span className="text-[10px] uppercase font-bold text-rose-750 tracking-wider">Consolidated Expenses</span>
                    <h4 className="text-xl font-extrabold text-rose-900">${totalCostsUsed.toLocaleString()}</h4>
                  </div>
                </div>

                {/* Inline HTML5 Ratio Visualization bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                    <span>Expenses budget (costs allocation)</span>
                    <span>Income stream</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      style={{ width: `${Math.min(90, Math.max(10, (totalCostsUsed / (totalCostsUsed + totalInvoicedSales || 1)) * 100))}%` }} 
                      className="bg-rose-500 h-full transition-all"
                    />
                    <div 
                      style={{ width: `${Math.min(90, Math.max(10, (totalInvoicedSales / (totalCostsUsed + totalInvoicedSales || 1)) * 100))}%` }} 
                      className="bg-emerald-500 h-full transition-all"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>${totalCostsUsed} ({((totalCostsUsed / (totalCostsUsed + totalInvoicedSales || 1)) * 100).toFixed(0)}%)</span>
                    <span>${totalInvoicedSales} ({((totalInvoicedSales / (totalCostsUsed + totalInvoicedSales || 1)) * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              </div>

              {/* Inventory Safe Threshold Warnings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Cold Chain Thermometer Checklist */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Thermometer className="h-4.5 w-4.5 text-blue-500" />
                    Cold Room Store Thermals
                  </h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    {dairyState.inventory.filter(i => i.temperature !== undefined).map((i, idx) => (
                      <div key={idx} className="flex justify-between py-2.5 items-center">
                        <div>
                          <p className="font-semibold text-slate-700">{i.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{i.location || "Vault Base"}</span>
                        </div>
                        <span className={`font-mono font-bold px-2 py-1 rounded-md text-[11px] ${Number(i.temperature) > 4.0 ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
                          {i.temperature}°C
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Shortages Alert Widget */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers className="h-4.5 w-4.5 text-amber-500" />
                    Critical Stock Threshold Warnings
                  </h3>
                  <div className="space-y-3">
                    {dairyState.inventory.map((item) => {
                      const isLow = item.quantity < item.minimumRequired;
                      const percentage = Math.min(100, Math.round((item.quantity / item.minimumRequired) * 100));
                      return (
                        <div key={item.id} className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="font-semibold text-slate-700">{item.name}</span>
                            <span className={`font-semibold ${isLow ? "text-rose-600 animate-pulse" : "text-slate-500"}`}>
                              {item.quantity} / {item.minimumRequired} {item.unit}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              style={{ width: `${percentage}%` }} 
                              className={`h-full ${isLow ? "bg-rose-500" : "bg-slate-700"}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Live Gemini AI Forecast Container Widget */}
              <div id="ai-cockpit-widget">
                <AiForecastCockpit onRefreshDatabase={loadState} />
              </div>

            </div>
          )}

          {/* TAB 2: Inventory Tracking Table */}
          {activeTab === "inventory" && (
            <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Milk, Cheese, and Cattle Feed Registers</h3>
                  <p className="text-xs text-slate-500">Track raw bulk capacities, safe cooling temperatures, and aging cellar codes</p>
                </div>
                
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowInvModal(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Define Stock Asset
                </button>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 pt-2">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs by name or batch code..."
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">Category Filter</span>
                  <select
                    value={invCategoryFilter}
                    onChange={(e) => setInvCategoryFilter(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg py-1.5 px-3 bg-white"
                  >
                    <option value="All">All Categories</option>
                    <option value="Raw Milk">Raw Milk</option>
                    <option value="Processed Milk">Processed Milk</option>
                    <option value="Cheese">Cheese</option>
                    <option value="Yogurt">Yogurt</option>
                    <option value="Butter">Butter</option>
                    <option value="Cattle Feed">Cattle Feed</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
              </div>

              {/* Inventory Grid Table with Temperature Metrics */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Logistics Category</th>
                      <th className="py-2.5 px-3">Item Catalog Description</th>
                      <th className="py-2.5 px-3">Batch & Vault</th>
                      <th className="py-2.5 px-3">Stock Levels</th>
                      <th className="py-2.5 px-3">Thermals</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-450 text-xs">
                          No matching inventory accounts registered. Use &quot;Define Stock Asset&quot; to begin.
                        </td>
                      </tr>
                    ) : (
                      filteredInventory.map((item) => {
                        const isWarningQty = item.quantity < item.minimumRequired;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-3">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold font-mono text-[9px]">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <p className="font-bold text-slate-800">{item.name}</p>
                              <p className="text-[10px] text-slate-400">ID: {item.id}</p>
                            </td>
                            <td className="py-3 px-3 text-slate-500">
                              <p className="font-semibold text-slate-600">{item.batchNo || "N/A"}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{item.location || "Farm Silo Zone"}</p>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5 font-bold">
                                <span className={isWarningQty ? "text-rose-600" : "text-slate-800"}>
                                  {item.quantity.toLocaleString()} {item.unit}
                                </span>
                                {isWarningQty && (
                                  <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[9px] px-1.5 py-0.2 rounded-md animate-pulse">
                                    Low Limit
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-blue-600">
                              {item.temperature !== undefined ? `${item.temperature}°C` : "-"}
                            </td>
                            <td className="py-3 px-3 text-right space-x-1.5">
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setShowInvModal(true);
                                }}
                                className="inline-flex text-indigo-650 hover:text-indigo-800 font-semibold cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeInventoryItem(item.id)}
                                className="inline-flex text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                              >
                                Retire
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Labor Roster Director */}
          {activeTab === "roster" && (
            <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Workforce & Dairy Shift Director</h3>
                  <p className="text-xs text-slate-500">Coordinate milking staff, vet certified agents, shift status loggers, and hourly wages</p>
                </div>
                
                <button
                  onClick={() => {
                    setEditingEmployee(null);
                    setNewEmpPay({
                      name: "",
                      role: "Farm Hand",
                      shift: "Morning (06:00 - 14:00)",
                      wageRate: 15.0,
                      status: "Active",
                      contact: "",
                      assignedTasks: []
                    });
                    setShowEmpModal(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Roster Employee
                </button>
              </div>

              {/* Staff Filtering Options */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Operational Shift Status</span>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Active", "Off Shift", "On Leave"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setEmpStatusFilter(status)}
                      className={`text-xs px-3 py-1 rounded-full border cursor-pointer font-semibold transition-all ${empStatusFilter === status ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-650 border-slate-250 hover:bg-slate-50"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Roster Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {filteredEmployees.map((emp) => (
                  <div key={emp.id} className="border border-slate-150 rounded-xl p-4.5 space-y-3.5 hover:shadow-xs transition-shadow bg-linear-to-b from-white to-slate-50/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{emp.name}</h4>
                        <span className="text-[10px] text-indigo-750 font-bold uppercase tracking-wider">{emp.role}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${emp.status === "Active" ? "bg-emerald-50 text-emerald-800" : emp.status === "Off Shift" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-800"}`}>
                        {emp.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Shift</p>
                        <p className="font-semibold text-slate-700">{emp.shift.split(" ")[0]} Shift</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Contact / Mobile</p>
                        <p className="font-semibold text-slate-705">{emp.contact || "N/A"}</p>
                      </div>
                    </div>

                    <div className="bg-white/80 border border-slate-150/40 rounded-lg p-3 space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Console tasks</p>
                      {emp.assignedTasks.length === 0 ? (
                        <p className="text-[11px] text-slate-450 italic">No tasks currently assigned</p>
                      ) : (
                        <ul className="text-[11px] text-slate-600 list-disc list-inside space-y-0.5">
                          {emp.assignedTasks.map((t, idx) => (
                            <li key={idx} className="truncate">{t}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-mono text-slate-500">Rate: <strong>${emp.wageRate}/hr</strong></span>
                      <button
                        onClick={() => {
                          setEditingEmployee(emp);
                          setShowEmpModal(true);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-indigo-650 hover:text-indigo-850 cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Modify Portfolio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Ledger cashflow balance sheet */}
          {activeTab === "ledger" && (
            <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Doubleentry Transaction Ledger</h3>
                  <p className="text-xs text-slate-500 font-medium">Record dairy item sales, feedstock purchases, dynamic animal medication or transport costs</p>
                </div>
                
                <button
                  onClick={() => setShowTxModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Record Transaction
                </button>
              </div>

              {/* Type Filtering */}
              <div className="flex items-center gap-2 pt-1 border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Flow Direction</span>
                <div className="flex gap-1">
                  {["All", "Sale", "Expense"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setTxTypeFilter(type)}
                      className={`text-xs px-3 py-1 rounded-md cursor-pointer transition-colors ${txTypeFilter === type ? "bg-slate-100 text-slate-850 font-bold" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                      {type}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Flow Type</th>
                      <th className="py-2 px-3">Registered Activity & Party</th>
                      <th className="py-2 px-3">Quantity</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3 text-right">Value Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-slate-450 font-mono text-[10px]">
                          {new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${tx.type === "Sale" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-800">{tx.item}</p>
                          <p className="text-[10px] text-slate-400">
                            Partner: <strong>{tx.customerOrSupplier || "N/A"}</strong> | Operator: {tx.operator}
                          </p>
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {tx.quantity} {tx.unit}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-medium ${tx.status === "Completed" ? "text-emerald-600" : tx.status === "Pending" ? "text-amber-600 animate-pulse" : "text-rose-500"}`}>
                            ● {tx.status}
                          </span>
                        </td>
                        <td className={`py-3 px-3 text-right font-bold text-sm ${tx.type === "Sale" ? "text-emerald-700" : "text-rose-700"}`}>
                          {tx.type === "Sale" ? "+" : "-"}${tx.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Log History View */}
          {activeTab === "logs" && (
            <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div>
                <h3 className="text-base font-bold text-slate-800">Historic Safety & Delivery Audits</h3>
                <p className="text-xs text-slate-500 font-medium">Real-time log stream showing operator shifts on the mobile applications</p>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                {dairyState.logs.length === 0 ? (
                  <p className="text-center py-10 text-slate-400 italic">No activity logs caught.</p>
                ) : (
                  dairyState.logs.map((log) => (
                    <div key={log.id} className="p-4 space-y-2 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs">{log.employeeName}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-semibold text-[9px] uppercase tracking-wider">
                            {log.activityType}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-405 font-mono">
                          {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-1 border-l-2 border-indigo-200">
                        {log.details}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Google Drive Sync Center */}
          {activeTab === "drive" && (
            <GoogleDriveSync 
              dairyState={dairyState} 
              onRefreshDatabase={loadState} 
              triggerToast={triggerToast} 
            />
          )}

        </div>

        {/* Right Side: Responsive Virtual Ionic Mobile Client Simulator (Size 4 of 12) */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col items-center">
            <div className="text-center space-y-1 mb-5">
              <h3 className="text-sm font-bold text-slate-800">Bi-directional Worker Testbed</h3>
              <p className="text-[11px] text-slate-400">
                Simulated <strong>Ionic Angular Worker App</strong>. Any transaction, quantity harvest, or checkoff recorded below immediately updates the primary web dashboard.
              </p>
            </div>

            {/* Mobile App View with sync capability */}
            <MobileAppMockup state={dairyState} onRefreshDatabase={loadState} />

            <div className="mt-4 text-center bg-blue-50/60 p-3 rounded-lg border border-blue-100/50 w-full max-w-[340px]">
              <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1.5">Simulation Instructions</h4>
              <ul className="text-[10px] text-blue-600/90 text-left space-y-1 list-disc list-inside">
                <li>Under <strong>Collection</strong>, add milk quantities and watch dashboard levels respond.</li>
                <li>Under <strong>Tasks</strong>, tick off chores and observe worker productivity signals.</li>
                <li>Submit simulated cooperative wholesale orders under <strong>Dispatch</strong>.</li>
              </ul>
            </div>
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-150 py-6 text-center text-xs text-slate-400 mt-12">
        <p>© 2026 Dairy Management Suite. Integrated Google AI Studio System.</p>
      </footer>

      {/* Modal 1: Asset Asset Inventory Add/Edit */}
      {showInvModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-slide-up space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingItem ? "Edit Asset Logistics Details" : "Define New Dairy/Feed Asset"}
              </h3>
              <button onClick={() => setShowInvModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={triggerInventorySubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Asset Name Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pasteur Pasteur Pack Lot"
                  value={editingItem ? (editingItem.name || "") : newItemPay.name}
                  onChange={(e) => {
                    if (editingItem) setEditingItem({ ...editingItem, name: e.target.value });
                    else setNewItemPay({ ...newItemPay, name: e.target.value });
                  }}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Category</label>
                  <select
                    value={editingItem ? (editingItem.category || "Raw Milk") : newItemPay.category}
                    onChange={(e) => {
                      const category = e.target.value as InventoryItem["category"];
                      if (editingItem) setEditingItem({ ...editingItem, category });
                      else setNewItemPay({ ...newItemPay, category });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Raw Milk">Raw Milk</option>
                    <option value="Processed Milk">Processed Milk</option>
                    <option value="Cheese">Cheese</option>
                    <option value="Yogurt">Yogurt</option>
                    <option value="Butter">Butter</option>
                    <option value="Cattle Feed">Cattle Feed</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Volume Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="liters, kg, vials"
                    value={editingItem ? (editingItem.unit || "") : newItemPay.unit}
                    onChange={(e) => {
                      if (editingItem) setEditingItem({ ...editingItem, unit: e.target.value });
                      else setNewItemPay({ ...newItemPay, unit: e.target.value });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Current Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingItem ? (editingItem.quantity || 0) : newItemPay.quantity}
                    onChange={(e) => {
                      const quantity = Number(e.target.value);
                      if (editingItem) setEditingItem({ ...editingItem, quantity });
                      else setNewItemPay({ ...newItemPay, quantity });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Min Target (Critical limit)</label>
                  <input
                    type="number"
                    required
                    value={editingItem ? (editingItem.minimumRequired || 0) : newItemPay.minimumRequired}
                    onChange={(e) => {
                      const minimumRequired = Number(e.target.value);
                      if (editingItem) setEditingItem({ ...editingItem, minimumRequired });
                      else setNewItemPay({ ...newItemPay, minimumRequired });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Temperature (°C) - Optional</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 3.4"
                    value={editingItem ? (editingItem.temperature ?? "") : (newItemPay.temperature ?? "")}
                    onChange={(e) => {
                      const temperature = e.target.value === "" ? undefined : Number(e.target.value);
                      if (editingItem) setEditingItem({ ...editingItem, temperature });
                      else setNewItemPay({ ...newItemPay, temperature });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Batch Code Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. RAW-2026-X4"
                    value={editingItem ? (editingItem.batchNo || "") : newItemPay.batchNo}
                    onChange={(e) => {
                      if (editingItem) setEditingItem({ ...editingItem, batchNo: e.target.value });
                      else setNewItemPay({ ...newItemPay, batchNo: e.target.value });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Vault Storage Location</label>
                <input
                  type="text"
                  placeholder="e.g. Cold Store Unit B Drawer #3"
                  value={editingItem ? (editingItem.location || "") : newItemPay.location}
                  onChange={(e) => {
                    if (editingItem) setEditingItem({ ...editingItem, location: e.target.value });
                    else setNewItemPay({ ...newItemPay, location: e.target.value });
                  }}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
              >
                {editingItem ? "Update Changes" : "Commit Stock Record"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Cashflow Transaction Add */}
      {showTxModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-slide-up space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Post Ledger Entry</h3>
              <button onClick={() => setShowTxModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={triggerTxSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Ledger Classification</label>
                  <select
                    value={newTxPay.type}
                    onChange={(e) => setNewTxPay({ ...newTxPay, type: e.target.value as "Sale" | "Expense" })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white font-semibold"
                  >
                    <option value="Sale">Sale (Income Flow)</option>
                    <option value="Expense">Expense (Outgoing Cost)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Class Category</label>
                  <select
                    value={newTxPay.category}
                    onChange={(e) => setNewTxPay({ ...newTxPay, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Raw Milk">Raw Milk</option>
                    <option value="Processed Milk">Processed Milk</option>
                    <option value="Cheese">Cheese</option>
                    <option value="Yogurt">Yogurt</option>
                    <option value="Butter">Butter</option>
                    <option value="Cattle Feed">Cattle Feed</option>
                    <option value="Veterinary">Veterinary Checks</option>
                    <option value="Equipment">Equipment Supply</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Transaction Item Text</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alfalfa forage bundles wholesale"
                  value={newTxPay.item}
                  onChange={(e) => setNewTxPay({ ...newTxPay, item: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-1">
                  <label className="font-bold text-slate-600 block">Quantity</label>
                  <input
                    type="number"
                    required
                    value={newTxPay.quantity}
                    onChange={(e) => setNewTxPay({ ...newTxPay, quantity: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="font-bold text-slate-600 block">Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="liters"
                    value={newTxPay.unit}
                    onChange={(e) => setNewTxPay({ ...newTxPay, unit: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div className="col-span-1 space-y-1">
                  <label className="font-bold text-slate-600 block">Value ($)</label>
                  <input
                    type="number"
                    required
                    value={newTxPay.amount}
                    onChange={(e) => setNewTxPay({ ...newTxPay, amount: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-lg p-2 font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Supplier / Cooperative Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. Western Harvest Distributors"
                    value={newTxPay.customerOrSupplier}
                    onChange={(e) => setNewTxPay({ ...newTxPay, customerOrSupplier: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Logging Officer/Agent</label>
                  <input
                    type="text"
                    placeholder="Manager"
                    value={newTxPay.operator}
                    onChange={(e) => setNewTxPay({ ...newTxPay, operator: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
              >
                Commit Cashflow Allocation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Roster Employee Add/Edit */}
      {showEmpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-slide-up space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingEmployee ? "Modify Employee Portfolio" : "Roster New Employee"}
              </h3>
              <button onClick={() => setShowEmpModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={triggerEmployeeSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Personnel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marilyn Vance"
                  value={editingEmployee ? (editingEmployee.name || "") : newEmpPay.name}
                  onChange={(e) => {
                    if (editingEmployee) setEditingEmployee({ ...editingEmployee, name: e.target.value });
                    else setNewEmpPay({ ...newEmpPay, name: e.target.value });
                  }}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Staff Role Profile</label>
                  <select
                    value={editingEmployee ? (editingEmployee.role || "Farm Hand") : newEmpPay.role}
                    onChange={(e) => {
                      const role = e.target.value as Employee["role"];
                      if (editingEmployee) setEditingEmployee({ ...editingEmployee, role });
                      else setNewEmpPay({ ...newEmpPay, role });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Farm Hand">Farm Hand</option>
                    <option value="Milking Operator">Milking Operator</option>
                    <option value="Quality Inspector">Quality Inspector</option>
                    <option value="Delivery Driver">Delivery Driver</option>
                    <option value="Vet Expert">Vet Expert</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Active Shift Frame</label>
                  <select
                    value={editingEmployee ? (editingEmployee.shift || "Morning (06:00 - 14:00)") : newEmpPay.shift}
                    onChange={(e) => {
                      const shift = e.target.value as Employee["shift"];
                      if (editingEmployee) setEditingEmployee({ ...editingEmployee, shift });
                      else setNewEmpPay({ ...newEmpPay, shift });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                  >
                    <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
                    <option value="Evening (14:00 - 22:00)">Evening (14:00 - 22:00)</option>
                    <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Hourly Rate ($)</label>
                  <input
                    type="number"
                    required
                    value={editingEmployee ? (editingEmployee.wageRate || 15) : newEmpPay.wageRate}
                    onChange={(e) => {
                      const wageRate = Number(e.target.value);
                      if (editingEmployee) setEditingEmployee({ ...editingEmployee, wageRate });
                      else setNewEmpPay({ ...newEmpPay, wageRate });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 block">Contact Mobile No.</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={editingEmployee ? (editingEmployee.contact || "") : newEmpPay.contact}
                    onChange={(e) => {
                      if (editingEmployee) setEditingEmployee({ ...editingEmployee, contact: e.target.value });
                      else setNewEmpPay({ ...newEmpPay, contact: e.target.value });
                    }}
                    className="w-full border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 block">Shift Status State</label>
                <select
                  value={editingEmployee ? (editingEmployee.status || "Active") : newEmpPay.status}
                  onChange={(e) => {
                    const status = e.target.value as Employee["status"];
                    if (editingEmployee) setEditingEmployee({ ...editingEmployee, status });
                    else setNewEmpPay({ ...newEmpPay, status });
                  }}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white"
                >
                  <option value="Active">Active Duty</option>
                  <option value="Off Shift">Off Shift</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              {/* Assignments / Task Editor Block inside modal */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <label className="font-bold text-slate-700 block text-[11px]">Edit Assigned Console Tasks Or Chores</label>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Scrape yard #4, feed heifers bundle"
                    value={tempTaskInput}
                    onChange={(e) => setTempTaskInput(e.target.value)}
                    className="flex-1 border border-slate-200 rounded-lg p-1.5 text-xs bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={appendFormTask}
                    className="bg-slate-900 text-white px-2.5 rounded-lg hover:bg-slate-800 transition-colors font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Task Checklist Items inside Modal */}
                <div className="space-y-1 pt-1 scrollbar-thin max-h-24 overflow-y-auto">
                  {((editingEmployee ? editingEmployee.assignedTasks : newEmpPay.assignedTasks) || []).map((task, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] bg-white border border-slate-100 rounded-md py-1 px-2">
                      <span className="truncate text-slate-600 font-medium">{task}</span>
                      <button
                        type="button"
                        onClick={() => removeFormTask(idx)}
                        className="text-rose-500 hover:text-rose-700 font-bold ml-1 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {((editingEmployee ? editingEmployee.assignedTasks : newEmpPay.assignedTasks) || []).length === 0 && (
                    <p className="text-[10px] text-slate-400 italic text-center py-1">No custom instructions defined</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg cursor-pointer"
              >
                {editingEmployee ? "Confirm Updates" : "Roster Payroll Item"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
