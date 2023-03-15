import { BudgetService } from "../src/budgetService";

describe('BudgetService', () => {
  let budgetService = new BudgetService();
  beforeEach(async () => {
    budgetService = new BudgetService();
  });

  it('partial month 2023/03/01 ~ 2023/03/01', async () => {
    expect(budgetService.query('2023/03/01', '2023/03/01')).toEqual(100)
  })

  it('partial month 2023/03/01 ~ 2023/03/02', async () => {
    expect(budgetService.query('2023/03/01', '2023/03/02')).toEqual(200)
  })

  it('whole month 2023/03/01 ~ 2023/03/31', async () => {
    expect(budgetService.query('2023/03/01', '2023/03/31')).toEqual(3100)
  })


  it('cross month 2023/03/30 ~ 2023/04/05', async () => {
    expect(budgetService.query('2023/03/30', '2023/04/05')).toEqual(100 * 2 + 10 * 5)
  })

  it('month not found 2023/02/28 ~ 2023/03/05', async () => {
    expect(budgetService.query('2023/02/28', '2023/03/05')).toEqual(100 * 5)
  })

  it('Invalid input found 2023/03/05 ~ 2023/02/20', async () => {
    expect(budgetService.query('2023/03/05', '2023/02/20')).toEqual(0)
  })

});
