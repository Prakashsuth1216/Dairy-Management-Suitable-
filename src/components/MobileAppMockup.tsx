import React, { useState } from "react";
import { 
  Smartphone, 
  Check, 
  MapPin, 
  Trash2, 
  Plus, 
  RefreshCw, 
  BookOpen, 
  CheckSquare, 
  Truck, 
  Milk, 
  ClipboardList 
} from "lucide-react";
import { DairyState, Employee } from "../types";

interface MobileAppMockupProps {
  state: DairyState;
  onRefreshDatabase: () => void;
}

export function MobileAppMockup({ state, onRefreshDatabase }: MobileAppMockupProps) {
  const [activeTab, setActiveTab] = useState<"collection" | "tasks" | "sales" | "logs">("collection");
  const [loggingIn, setLoggingIn] = useState(false);

  // Forms states
  // 1. Milk Collection
  const [collectionQty, setCollectionQty] = useState("");
  const [cattleTemp, setCattleTemp] = useState("3.4");
  const [milkingOperator, setMilkingOperator] = useState("");
  const [coolingUnit, setCoolingUnit] = useState("Cooling Tank #1");

  // 2. Dispatch / Delivery Worker Form
  const [saleItem, setSaleItem] = useState("Fresh Raw Milk Wholesale");
  const [saleQty, setSaleQty] = useState("");
  const [saleAmount, setSaleAmount] = useState("");
  const [customer, setCustomer] = useState("");
  const [deliveryOp, setDeliveryOp] = useState("");

  // Feedbacks
  const [feedback, setFeedback] = useState<string | null>(null);

  // Completed task statuses preserved in memory
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Log Milking Collection from Phone
  const handleMilkingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionQty || isNaN(Number(collectionQty)) || Number(collectionQty) <= 0) {
      alert("Please enter a valid collection volume.");
      return;
    }

    setLoggingIn(true);
    try {
      // 1. Log activity to history logs
      const logBody = {
        employeeName: milkingOperator || "Marilyn Vance",
        activityType: "Milk Harvesting",
        details: `Milked cattle cluster. Collected ${collectionQty} liters of raw milk at cooling temp ${cattleTemp}°C in ${coolingUnit}.`,
        status: "Success"
      };
      
      await fetch("/api/dairy/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logBody)
      });

      // 2. Add raw milk to inventory
      const rawInvs = state.inventory.filter(i => i.category === "Raw Milk");
      const matchedInvItem = rawInvs[0] || {
        name: "Fresh Raw Milk",
        category: "Raw Milk",
        quantity: 0,
        unit: "liters",
        minimumRequired: 500,
        temp: 3.4
      };

      const updatedQty = Number(matchedInvItem.quantity) + Number(collectionQty);
      
      await fetch("/api/dairy/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...matchedInvItem,
          quantity: updatedQty,
          temperature: Number(cattleTemp),
          lastUpdated: new Date().toISOString()
        })
      });

      showFeedback(`Successfully logged ${collectionQty}L collection!`);
      setCollectionQty("");
      onRefreshDatabase();
    } catch (err) {
      console.error(err);
      alert("Milking submission failed.");
    } finally {
      setLoggingIn(false);
    }
  };

  // Log sale on dispatch from phone
  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleQty || !saleAmount || isNaN(Number(saleQty)) || isNaN(Number(saleAmount))) {
      alert("Please check numerical values.");
      return;
    }

    setLoggingIn(true);
    try {
      const txBody = {
        type: "Sale",
        item: saleItem,
        category: saleItem.includes("Milk") ? "Raw Milk" : "Dairy Products",
        quantity: Number(saleQty),
        unit: saleItem.includes("Milk") ? "liters" : "kg",
        amount: Number(saleAmount),
        customerOrSupplier: customer || "Local Distributor Co.",
        operator: deliveryOp || "Lucas Kane",
        status: "Completed"
      };

      await fetch("/api/dairy/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txBody)
      });

      // Create delivery dispatch log
      await fetch("/api/dairy/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeName: deliveryOp || "Lucas Kane",
          activityType: "Delivery",
          details: `Dispatched & delivered ${saleQty} units of ${saleItem} to ${customer || "Local Distributor"}. Captured $${saleAmount}.`,
          status: "Success"
        })
      });

      showFeedback(`$${saleAmount} Delivery Invoice Logged!`);
      setSaleQty("");
      setSaleAmount("");
      setCustomer("");
      onRefreshDatabase();
    } catch (err) {
      console.error(err);
      alert("Sale registration failed.");
    } finally {
      setLoggingIn(false);
    }
  };

  // Toggle tasks completetion states inside employee list
  const toggleTask = (employeeId: string, taskIdx: number) => {
    const key = `${employeeId}-${taskIdx}`;
    setCompletedTasks(prev => {
      const next = { ...prev, [key]: !prev[key] };
      showFeedback(next[key] ? "Task checked off!" : "Task marked incomplete");
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-3">
      
      {/* Smartphone Outer Housing Frame (Ionic Mockup) */}
      <div className="relative mx-auto border-[12px] border-slate-950 rounded-[44px] bg-slate-950 shadow-2xl overflow-hidden w-full max-w-[370px] h-[720px] flex flex-col">
        
        {/* Speaker ear piece and camera punch hole notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex justify-center items-center z-50">
          <div className="w-16 h-4 bg-slate-900 rounded-b-2xl flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 mr-2"></span>
            <span className="w-8 h-1 rounded-full bg-slate-800"></span>
          </div>
        </div>

        {/* Ionic UI Header Core */}
        <div className="bg-blue-600 text-white pt-7 pb-3.5 px-4 flex items-center justify-between shadow-md text-sm font-semibold shrink-0">
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-4 w-4 animate-pulse text-blue-200" />
            <span className="tracking-tight font-bold">Ionic Mobile (Worker App)</span>
          </div>
          <span className="bg-blue-800/60 text-[10px] px-2 py-0.5 rounded-full font-mono text-blue-100 uppercase tracking-widest">
            v5.4
          </span>
        </div>

        {/* Ionic Simulated Screen Viewport Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 pb-20 relative">
          
          {/* Action Prompt Toast inside preview */}
          {feedback && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-11/12 bg-slate-900 text-white text-xs py-2 px-3.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 z-40 animate-bounce">
              <span className="bg-blue-500 rounded-full p-0.5">
                <Check className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="font-semibold">{feedback}</span>
            </div>
          )}

          {/* Tab Screen 1: Milking Collection Form */}
          {activeTab === "collection" && (
            <div className="space-y-4">
              <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-4 shadow-sm space-y-1">
                <h3 className="text-sm font-bold flex items-center gap-1">
                  <Milk className="h-4 w-4" />
                  Collection Logging Point
                </h3>
                <p className="text-[11px] text-blue-100">
                  Farmhands log bulk volumes and cold storage temperatures from this terminal interface.
                </p>
              </div>

              <form onSubmit={handleMilkingSubmit} className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Milking Volume (Liters)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 250"
                    value={collectionQty}
                    onChange={(e) => setCollectionQty(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Temperature (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={cattleTemp}
                      onChange={(e) => setCattleTemp(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Cooling Unit Location</label>
                    <select
                      value={coolingUnit}
                      onChange={(e) => setCoolingUnit(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-1.5 py-2.5 focus:ring-1 focus:ring-blue-500 focus:outline-hidden bg-white"
                    >
                      <option value="Cooling Tank #1">Cooling Tank #1</option>
                      <option value="Cooling Tank #2">Cooling Tank #2</option>
                      <option value="Cold Storage Unit B">Cold Storage Unit B</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Milking Staff Driver Name</label>
                  <select
                    value={milkingOperator}
                    onChange={(e) => setMilkingOperator(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="">-- Choose Staff --</option>
                    {state.employees.map((e) => (
                      <option key={e.id} value={e.name}>{e.name} ({e.role})</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  {loggingIn ? <RefreshCw className="h-3 w-3 animate-spin text-white" /> : null}
                  Commit Collection to Ledger
                </button>
              </form>

              <div className="bg-slate-100/80 p-3 rounded-lg border border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-1">LIVE COMMITTED TANKS</span>
                <div className="space-y-1">
                  {state.inventory.filter(i => i.category === "Raw Milk").map((i, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">{i.location || "Tank #1"}</span>
                      <strong className="text-slate-800">{i.quantity} L</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Screen 2: Staff Shift & Tasks checklists */}
          {activeTab === "tasks" && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold flex items-center gap-1 mb-1">
                  <ClipboardList className="h-4 w-4 text-purple-400" />
                  My Shift Tasks Dashboard
                </h3>
                <p className="text-[10px] text-slate-300">
                  Select your name to mark off custom tasks assigned by managers in the console.
                </p>
              </div>

              <div className="space-y-3">
                {state.employees.map((emp) => (
                  <div key={emp.id} className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-xs">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{emp.name}</h4>
                        <span className="text-[9px] text-purple-600 font-semibold uppercase">{emp.role}</span>
                      </div>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${emp.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {emp.shift.split(" ")[0]}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-1.5 border-t border-slate-104/50">
                      {emp.assignedTasks.map((task, tIdx) => {
                        const taskKey = `${emp.id}-${tIdx}`;
                        const isDone = completedTasks[taskKey] || false;
                        return (
                          <div 
                            key={tIdx} 
                            onClick={() => toggleTask(emp.id, tIdx)}
                            className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-xs"
                          >
                            <span className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 ${isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white text-transparent"}`}>
                              <Check className="h-3 w-3" />
                            </span>
                            <span className={`text-[11px] leading-tight transition-all ${isDone ? "line-through text-slate-400" : "text-slate-600"}`}>
                              {task}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Screen 3: Dispatch sales point */}
          {activeTab === "sales" && (
            <div className="space-y-4">
              <div className="bg-emerald-700 text-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold flex items-center gap-1.5 mb-1">
                  <Truck className="h-4 w-4 text-emerald-200" />
                  Dispatch Delivery Sale
                </h3>
                <p className="text-[10px] text-emerald-100">
                  Drivers document deliveries and record customer collections instantly. Updates wholesale stock limits.
                </p>
              </div>

              <form onSubmit={handleSaleSubmit} className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Product Dispatch Category</label>
                  <select
                    value={saleItem}
                    onChange={(e) => setSaleItem(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="Fresh Raw Milk Wholesale">Fresh Raw Milk Wholesale</option>
                    <option value="Whole Pasteur Pasteur Pack">Whole Pasteur Processed Pack</option>
                    <option value="Farm Cheddar Special">Farm Cheddar Special (Cheese)</option>
                    <option value="Organic Greek Yogurt">Organic Greek Yogurt</option>
                    <option value="Salted Sweetcream Butter">Salted Sweetcream Butter</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Qty (Liters/Kg)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={saleQty}
                      onChange={(e) => setSaleQty(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 block">Total Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 150"
                      value={saleAmount}
                      onChange={(e) => setSaleAmount(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Buyer / Cooperative Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bakers Store"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 block">Delivery Driver Staff Agent</label>
                  <select
                    value={deliveryOp}
                    onChange={(e) => setDeliveryOp(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="">-- Choose Operator --</option>
                    {state.employees.filter(e => e.role === "Delivery Driver" || e.role === "Manager").map((e) => (
                      <option key={e.id} value={e.name}>{e.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  {loggingIn ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                  Register Cash/Coop Sale
                </button>
              </form>
            </div>
          )}

          {/* Tab Screen 4: Operational Log history view */}
          {activeTab === "logs" && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-widest">
                FARM COMMITTED ACTIVITY AUDIT
              </span>
              <div className="space-y-2">
                {state.logs.map((log) => (
                  <div key={log.id} className="bg-white border border-slate-100 rounded-lg p-3 text-xs shadow-xs space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md text-[9px] font-mono">{log.activityType}</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-[11px]">{log.employeeName}</p>
                    <p className="text-slate-500 text-[10px] leading-relaxed">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Ionic Simulated Tab Navigation Bottom Bar */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-white border-t border-slate-200/80 flex items-center justify-around text-[10px] font-semibold text-slate-400 z-50">
          
          <button 
            type="button"
            onClick={() => setActiveTab("collection")}
            className={`flex flex-col items-center justify-center gap-1 w-1/4 h-full cursor-pointer transition-colors ${activeTab === "collection" ? "text-blue-600 bg-blue-50/20" : "hover:text-slate-600"}`}
          >
            <Milk className="h-5 w-5" />
            <span>Collection</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("tasks")}
            className={`flex flex-col items-center justify-center gap-1 w-1/4 h-full cursor-pointer transition-colors ${activeTab === "tasks" ? "text-blue-600 bg-blue-50/20" : "hover:text-slate-600"}`}
          >
            <CheckSquare className="h-5 w-5" />
            <span>Tasks</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("sales")}
            className={`flex flex-col items-center justify-center gap-1 w-1/4 h-full cursor-pointer transition-colors ${activeTab === "sales" ? "text-blue-600 bg-blue-50/20" : "hover:text-slate-600"}`}
          >
            <Truck className="h-5 w-5" />
            <span>Dispatch</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab("logs")}
            className={`flex flex-col items-center justify-center gap-1 w-1/4 h-full cursor-pointer transition-colors ${activeTab === "logs" ? "text-blue-600 bg-blue-50/20" : "hover:text-slate-600"}`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Activity</span>
          </button>

        </div>

      </div>

    </div>
  );
}
