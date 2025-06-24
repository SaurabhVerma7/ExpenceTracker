const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const chartCanvas = document.getElementById('expense-chart');
const exportBtn = document.getElementById('export-pdf');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderExpenses() {
  expenseList.innerHTML = '';
  expenses.forEach((exp, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${exp.description} - ₹${exp.amount} (${exp.category}) <button onclick="removeExpense(${index})">X</button>`;
    expenseList.appendChild(li);
  });
  renderChart();
}

function removeExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;

  if (!amount || !description) return;

  expenses.push({ amount, description, category });
  saveExpenses();
  renderExpenses();
  form.reset();
});

let chart;
function renderChart() {
  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses',
        data: data,
        backgroundColor: ['#3498db', '#e67e22', '#2ecc71', '#9b59b6', '#f1c40f']
      }]
    }
  });
}

exportBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Expense Report", 20, 10);
  expenses.forEach((e, i) => {
    doc.text(`${i + 1}. ₹${e.amount} - ${e.description} (${e.category})`, 20, 20 + i * 10);
  });

  doc.save('expense-report.pdf');
});

renderExpenses();