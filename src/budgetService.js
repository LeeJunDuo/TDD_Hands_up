const dayjs = require('dayjs')

export class BudgetService {
  monthMap = {}
  totalAmount = 0

  constructor(budgetRepo) {
    this.budgetRepo = budgetRepo;
  }


  queryDB() {
    const data = this.budgetRepo.getAll();
    return data;
  }

  queryWithLoopDay(start, end) {
    const allBudget = this.queryDB();

    allBudget.forEach((_budget) => {
      this.monthMap[_budget.YearMonth] = _budget.getSingleBudgetOfMonth()
    })

    let loop = new Date(start)
    while (loop <= new Date(end)) {
      let curr = dayjs(loop).format('YYYYMM')
      this.totalAmount += this.monthMap[curr] || 0
      loop = dayjs(loop).add(1, 'd')
    }
    return this.totalAmount
  }

  queryWithLoopBudget(start, end) {
    if (dayjs(start) > dayjs(end)) {
      return 0
    }

    const allBudget = this.queryDB()
    let totalBudget = allBudget.reduce((val, _budget) => {
      return _budget.calculate(start, end) + val
    }, 0)
    return totalBudget;
  }
}
