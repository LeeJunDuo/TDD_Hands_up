const dayjs = require('dayjs')

export class BudgetService {
  monthMap = {}
  budget = 0

  constructor(budgetRepo) {
    this.budgetRepo = budgetRepo;
  }


  queryDB() {
    const data = this.budgetRepo.getAll();
    return data;
  }

  query(start, end) {
    const allBudget = this.queryDB();

    allBudget.forEach((_budget) => {
      this.monthMap[_budget.YearMonth] = _budget.getSingleBudgetOfMonth()
    })

    let loop = new Date(start)
    while (loop <= new Date(end)) {
      let curr = dayjs(loop).format('YYYYMM')
      const budget = this.monthMap[curr] || 0
      this.budget += budget
      loop = dayjs(loop).add(1, 'd')
    }
    return this.budget
  }

}
