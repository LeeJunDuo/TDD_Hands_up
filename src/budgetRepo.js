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
}
