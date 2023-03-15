import dayjs from "dayjs";

export class BudgetRepo {
  constructor() {
    this.data = [
      new Budget('202303', 3100),
      new Budget('202304', 300)
    ]
  }
  getAll() {
    return this.data;
  }
}

export class Budget {
  constructor(_yearMonth, _amount) {
    this.YearMonth = _yearMonth
    this.Amount = _amount
  }
  YearMonth;
  Amount;
  getSingleBudgetOfMonth() {
    return this.Amount / this.getDaysInMonth( 'YYYYMM');
  }

  getDaysInMonth( format) {
    return dayjs(this.YearMonth, format).daysInMonth();
  }
}
