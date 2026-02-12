export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
  options?: string[];
}

export interface RoadmapStep {
  month: string;
  title: string;
  focus: string;
  actions: string[];
}

export interface FinalReportData {
  // Contact Info
  userName: string;
  userWhatsapp: string;
  userEmail: string;

  // Financial Data (New)
  currentIncome: string;
  financialGoal: string;
  ticketPrice?: string; // Optional (only for advanced)

  // Report Data
  stage: string;
  executiveSummary: string;
  strengths: string[];
  weaknesses: string[]; // New
  blindSpots: string[]; // Keeping for backward compatibility or mapping to "Pontos de Atenção"
  correctionPlan: string[]; // New

  // Visual Data (New)
  pillarScores: {
    traffic: number;
    sales: number;
    product: number;
    management: number;
  };

  // New 4-Month Roadmap
  roadmap: RoadmapStep[];

  // Specific deliverables
  implementationList: string[];
}

export enum AppState {
  CHAT = 'CHAT',
  FINAL_REPORT = 'FINAL_REPORT'
}

export interface FinancialData {
  userMonthlyRevenue: number;
  benchmarkMonthlyRevenue: number;
  userSales: number;
  userTicket: number;
  benchmarkSales: number;
  benchmarkTicket: number;
}

export interface ChartDataPoint {
  month: string;
  userRevenue: number;
  mentorFlowRevenue: number;
}