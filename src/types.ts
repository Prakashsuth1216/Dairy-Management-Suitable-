export interface InventoryItem {
  id: string;
  name: string;
  category: "Raw Milk" | "Processed Milk" | "Cheese" | "Yogurt" | "Butter" | "Cattle Feed" | "Veterinary" | "Equipment";
  quantity: number;
  unit: string;
  minimumRequired: number;
  lastUpdated: string;
  temperature?: number; // Crucial for milk storage health!
  batchNo?: string;
  location?: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  type: "Sale" | "Expense";
  item: string;
  category: string;
  quantity: number;
  unit: string;
  amount: number;
  customerOrSupplier: string;
  operator: string;
  status: "Completed" | "Pending" | "Refunded";
}

export interface Employee {
  id: string;
  name: string;
  role: "Farm Hand" | "Milking Operator" | "Quality Inspector" | "Delivery Driver" | "Vet Expert" | "Manager";
  shift: "Morning (06:00 - 14:00)" | "Evening (14:00 - 22:00)" | "Night (22:00 - 06:00)";
  wageRate: number; // Hourly wage rate
  status: "Active" | "On Leave" | "Off Shift";
  contact: string;
  assignedTasks: string[];
  performanceScore?: number; // 1 to 5 stars
}

export interface DailyLog {
  id: string;
  timestamp: string;
  employeeId: string;
  employeeName: string;
  activityType: "Milk Harvesting" | "Feeding Session" | "Quality Check" | "Sterilization" | "Delivery" | "Vet Check";
  details: string;
  status: "Success" | "Issue Encountered" | "In Progress";
}

export interface DairyState {
  inventory: InventoryItem[];
  transactions: Transaction[];
  employees: Employee[];
  logs: DailyLog[];
}
