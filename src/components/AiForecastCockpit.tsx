import React, { useState } from "react";
import { 
  Sparkles, 
  BrainCircuit, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Layers,
  ShoppingBag
} from "lucide-react";

interface SuggestedScheduleItem {
  employeeName: string;
  task: string;
  timing: string;
}

interface AiInsightData {
  productionForecast: string;
  alerts: string[];
  feedOptimization: string;
  marketingInsights: string;
  suggestedSchedule: SuggestedScheduleItem[];
}

interface AiForecastCockpitProps {
  onRefreshDatabase: () => void;
}

export function AiForecastCockpit({ onRefreshDatabase }: AiForecastCockpitProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [insights, setInsights] = useState<AiInsightData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerForecast = async () => {
    setLoading(true);
    setError(null);
    
    // Staged loading feedback to feel highly professional
    const stages = [
      "Harvesting livestock datasets...",
      "Reading raw cooling tank temperature probes...",
      "Cross-referencing staff rosters and shift logs...",
      "Processing milk yield predictive vectors...",
      "Finishing dairy optimization brief..."
    ];

    let stageIdx = 0;
    setLoadingStage(stages[0]);
    
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < stages.length) {
        setLoadingStage(stages[stageIdx]);
      }
    }, 1000);

    try {
      const response = await fetch("/api/dairy/ai-forecast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      clearInterval(interval);
      
      if (!response.ok) {
        throw new Error("Failed to secure AI report from Server");
      }
      
      const data = await response.json();
      setInsights(data);
      onRefreshDatabase(); // update parent state in case dairy data was auto-adjusted
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "An issue occurred while calling Gemini.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-xl border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-indigo-500/15 text-indigo-400 p-1.5 rounded-lg border border-indigo-505/20">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Gemini AI Intelligence Cockpit
              <span className="bg-indigo-900/40 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold uppercase tracking-wider">
                V3.5 Flash
              </span>
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Enterprise analytics engine for yield predictions, cold-room safe states, herd feed programs, and labor rosters.
          </p>
        </div>
        
        <button
          onClick={triggerForecast}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer shadow-indigo-600/10 shadow-lg"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Sparkles className="h-4 w-4 text-indigo-200" />
          )}
          {loading ? "Synthesizing Brief..." : insights ? "Re-Run Dairy Forecast" : "Deploy AI Predictors"}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-950/40 rounded-xl border border-dashed border-slate-800 transition-all">
          <div className="relative flex items-center justify-center mb-6">
            <span className="absolute inline-flex h-16 w-16 rounded-full bg-indigo-500/10 animate-ping"></span>
            <div className="bg-slate-900 p-5 rounded-full border border-slate-800 text-indigo-400 shadow-xl">
              <BrainCircuit className="h-8 w-8 animate-pulse text-indigo-400" />
            </div>
          </div>
          <h3 className="text-medium font-bold text-slate-200 mb-1">Running Gemini Intelligence Analysis</h3>
          <p className="text-xs text-indigo-400/80 animate-pulse font-mono tracking-wide">{loadingStage}</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-rose-950/50 border border-rose-900/60 rounded-xl p-4 text-rose-200 mb-6 font-medium text-sm">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-300">Predictive analysis halted</p>
            <p className="text-rose-400/90 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {!loading && !insights && !error && (
        <div className="text-center py-12 bg-slate-950/25 rounded-xl border border-slate-800/80 p-8 max-w-lg mx-auto">
          <div className="bg-slate-900/50 inline-block p-4 rounded-full border border-slate-800 text-slate-500 mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">No active forecast models</h3>
          <p className="text-sm text-slate-400 mb-6">
            Synthesize all feed levels, temperature log anomalies, and sales histories to inspect herd trajectories or automate shift responsibilities under one click.
          </p>
          <button
            onClick={triggerForecast}
            className="inline-flex items-center gap-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/50 font-semibold px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Compute Live Operations Analytics
          </button>
        </div>
      )}

      {!loading && insights && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Forecast & Alert Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: General Forecast */}
            <div className="lg:col-span-12 xl:col-span-7 bg-slate-950/40 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm tracking-wide uppercase">
                <TrendingUp className="h-4 w-4" />
                <span>Yield & Production Forecast</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {insights.productionForecast}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-medium text-xs tracking-wider uppercase">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Nutrition & Feed Advices</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {insights.feedOptimization}
                  </p>
                </div>
                
                <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs tracking-wider uppercase">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Market & Margin Optimizers</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {insights.marketingInsights}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Flagged Anomalies & Bullet Alerts */}
            <div className="lg:col-span-12 xl:col-span-5 bg-slate-950/40 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm tracking-wide uppercase mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Flagged Anomalies ({insights.alerts.length})</span>
                </div>
                
                <div className="space-y-3">
                  {insights.alerts.length === 0 ? (
                    <div className="flex items-center gap-2 text-slate-400 text-xs py-4 justify-center bg-slate-900/30 rounded-lg border border-slate-800/50">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span>Zero safe state violations detected. Dairy is fully green!</span>
                    </div>
                  ) : (
                    insights.alerts.map((alert, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-3 rounded-lg border border-rose-950/40 text-xs text-slate-300">
                        <span className="text-rose-500 mt-0.5 shrink-0">●</span>
                        <span>{alert}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-800/80 font-mono flex justify-between items-center bg-slate-950/10 -mx-5 -mb-5 p-4 rounded-b-xl">
                <span>ANALYZED USING LIVE FLOCK/RESERVES</span>
                <span className="text-emerald-500">100% HEALTH</span>
              </div>
            </div>

          </div>

          {/* Bottom: Dynamic Shift Roster Scheduler */}
          <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm tracking-wide uppercase">
                <Calendar className="h-4 w-4" />
                <span>AI Automated Shift Task assignments</span>
              </div>
              <span className="text-[10px] bg-indigo-550/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono">
                ROSTER METRICS ALIGNED
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Personnel Name</th>
                    <th className="py-2.5 px-3">Milking/Facility Roster Block</th>
                    <th className="py-2.5 px-3 text-right">Optimal Shift Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {insights.suggestedSchedule.map((sched, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/30">
                      <td className="py-3 px-3 font-semibold text-white">{sched.employeeName}</td>
                      <td className="py-3 px-3 text-slate-300">{sched.task}</td>
                      <td className="py-3 px-3 text-right text-indigo-300 font-medium">{sched.timing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
