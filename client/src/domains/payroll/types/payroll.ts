export interface PayrollPeriod {
    startDate: Date;
    endDate: Date;
  }
  
  export interface PayrollEntry {
    id: string;
    employeeName: string;
    role: string;
    dateTime: string;
    totalSalary: number;
    status: 'Completed' | 'Pending';
  }
  
  export interface PayrollStats {
    payrollsCost: number;
    totalExpense: number;
    pendingPayments: number;
    totalPayrolls: number;
    lastMonthComparison: {
      payrollsCost: number;
      totalExpense: number;
    };
  }
  
  export interface BonusesAndIncentives {
    bonuses: number;
    incentives: number;
    total: number;
  }