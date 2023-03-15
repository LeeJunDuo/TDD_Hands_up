import { BudgetService } from "../src/budgetService";
import { Budget, BudgetRepo } from '../src/budgetRepo'

describe('Budget', () => {
  let budget = new Budget();

  function initBudget(yearMonth, amount) {
    budget = new Budget(yearMonth, amount);
  }

  describe('calculate', () => {

    it('should overlap completely', async () => {
      initBudget('202303', 3100);
      expect(budget.calculate('2023/03/01', '2023/03/31')).toEqual(3100)
    });

    it('should out of range before', async () => {
      initBudget('202303', 3100);
      expect(budget.calculate('2023/02/01', '2023/02/11')).toEqual(0)
    });

    it('should out of range after', async () => {
      initBudget('202303', 3100);
      expect(budget.calculate('2023/04/01', '2023/04/11')).toEqual(0)
    });

    it('should in range', async () => {
      initBudget('202303', 3100);
      expect(budget.calculate('2023/03/11', '2023/03/15')).toEqual(500)
    });

    it('should startTime in Budget month ranger only', async () => {
      initBudget('202303', 3100);
      expect(budget.calculate('2023/03/29', '2023/04/31')).toEqual(300)
    });

    it('should endTime in Budget month ranger only', async () => {
      initBudget('202303', 3100);
      expect(budget.calculate('2023/03/01', '2023/03/10')).toEqual(1000)
    });
  });
});
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


  describe('Iterate by days', () => {

    it('partial month 2023/03/01 ~ 2023/03/01', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopDay('2023/03/01', '2023/03/01')).toEqual(100)
    })

    it('partial month 2023/03/01 ~ 2023/03/02', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopDay('2023/03/01', '2023/03/02')).toEqual(200)
    })

    it('whole month 2023/03/01 ~ 2023/03/31', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopDay('2023/03/01', '2023/03/31')).toEqual(3100)
    })

    it('cross month 2023/03/30 ~ 2023/04/05', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopDay('2023/03/30', '2023/04/05')).toEqual(100 * 2 + 10 * 5)
    })

    it('month not found 2023/02/28 ~ 2023/03/05', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopDay('2023/02/28', '2023/03/05')).toEqual(100 * 5)
    })

    it('Invalid input found 2023/03/05 ~ 2023/02/20', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopDay('2023/03/05', '2023/02/20')).toEqual(0)
    })

  });

  describe('Iterate by Budget', () => {
    it('partial month 2023/03/01 ~ 2023/03/01', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopBudget('2023/03/01', '2023/03/01')).toEqual(100)
    })

    it('cross month 2023/03/01 ~ 2023/4/30', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopBudget('2023/03/01', '2023/04/30')).toEqual(3400)
    })


    it('month not found 2023/02/01 ~ 2023/03/31', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopBudget('2023/02/01', '2023/03/31')).toEqual(3100)
    })


    it('cross month 2023/02/01 ~ 2023/05/31', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopBudget('2023/02/01', '2023/05/31')).toEqual(3400)
    })


    it('Invalid input 2023/06/01 ~ 2023/05/31', async () => {
      setDB([
        new Budget('202303', 3100),
        new Budget('202304', 300)
      ])
      expect(budgetService.queryWithLoopBudget('2023/06/01', '2023/05/31')).toEqual(0)
    })
  });
});
