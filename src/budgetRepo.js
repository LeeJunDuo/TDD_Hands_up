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
  YearMonth;
  Amount;

  constructor(_yearMonth, _amount) {
    this.YearMonth = _yearMonth
    this.Amount = _amount

    const month = dayjs(this.YearMonth)
    this.start = dayjs(this.YearMonth).startOf('month')
    this.end = month.endOf('month')
  }

  getSingleBudgetOfMonth() {
    return this.Amount / this.getDaysInMonth('YYYYMM');
  }

  getDaysInMonth(format) {
    return dayjs(this.YearMonth, format).daysInMonth();
  }

  calculate(start, end) {
    const s = dayjs(start).startOf('day')
    const e = dayjs(end).endOf('day')
    if (this.matchRange(s, e)) {
      return this.Amount
    } else if (this.outOfRange(s, e)) {
      return 0
    } else {
      return this.partialMatchRange(e, s);
    }
    return 0
  }

  partialMatchRange(e, s) {
    const endBoundary = e < this.end ? e : this.end
    const startBoundary = this.start < s ? s : this.start
    return this.getSingleBudgetOfMonth() * (endBoundary.diff(startBoundary, 'd') + 1)
  }

  outOfRange(s, e) {
    return (s < this.start && e < this.start) || (this.end < s && this.end < e);
  }

  matchRange(s, e) {
    return s <= this.start && this.end <= e;
  }
}
