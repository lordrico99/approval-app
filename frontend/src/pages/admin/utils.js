// utils.js (or inside your component file)
export const BUDGET_PER_DEPARTMENT = 1000000;

export function calculateBudgetAndExpenditure(requests, departments) {
  const expenditureMap = {};
  departments.forEach(dep => {
    expenditureMap[dep] = 0;
  });

  requests.forEach(req => {
    if (req.status === "approved" && expenditureMap.hasOwnProperty(req.department)) {
      expenditureMap[req.department] += req.amount;
    }
  });

  const graphData = departments.map(dep => ({
    department: dep,
    budget: BUDGET_PER_DEPARTMENT,
    expenditure: expenditureMap[dep],
    remaining: BUDGET_PER_DEPARTMENT - expenditureMap[dep],
  }));

  return graphData;
}
