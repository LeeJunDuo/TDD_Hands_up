import { BudgetService } from "../src/budgetService";
import { Budget, BudgetRepo } from '../src/budgetRepo'

describe('BudgetService', () => {
  let budgetService = new BudgetService();

  function setDB(budgets) {
    const budgetRepo = {
      getAll: () => {
        return budgets
      }
    }
    budgetService = new BudgetService(budgetRepo);
  }

  beforeEach(async () => {
  })

  it('partial month 2023/03/01 ~ 2023/03/01', async () => {
    setDB([
      new Budget('202303', 3100),
      new Budget('202304', 300)
    ])
    expect(budgetService.query('2023/03/01', '2023/03/01')).toEqual(100)
  })

  it('partial month 2023/03/01 ~ 2023/03/02', async () => {
    setDB([
      new Budget('202303', 3100),
      new Budget('202304', 300)
    ])
    expect(budgetService.query('2023/03/01', '2023/03/02')).toEqual(200)
  })

  it('whole month 2023/03/01 ~ 2023/03/31', async () => {
    setDB([
      new Budget('202303', 3100),
      new Budget('202304', 300)
    ])
    expect(budgetService.query('2023/03/01', '2023/03/31')).toEqual(3100)
  })


  it('cross month 2023/03/30 ~ 2023/04/05', async () => {
    setDB([
      new Budget('202303', 3100),
      new Budget('202304', 300)
    ])
    expect(budgetService.query('2023/03/30', '2023/04/05')).toEqual(100 * 2 + 10 * 5)
  })

  it('month not found 2023/02/28 ~ 2023/03/05', async () => {
    setDB([
      new Budget('202303', 3100),
      new Budget('202304', 300)
    ])
    expect(budgetService.query('2023/02/28', '2023/03/05')).toEqual(100 * 5)
  })

  it('Invalid input found 2023/03/05 ~ 2023/02/20', async () => {
    setDB([
      new Budget('202303', 3100),
      new Budget('202304', 300)
    ])
    expect(budgetService.query('2023/03/05', '2023/02/20')).toEqual(0)
  })
});
