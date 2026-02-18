let balance = 0;
let transactions = [];

const balanceEl = document.getElementById("balance");
const amountEl = document.getElementById("amount");
const noteEl = document.getElementById("note");
const incomeBtn = document.getElementById("incomeBtn");
const expenseBtn = document.getElementById("expenseBtn");
const historyEl = document.getElementById("history");
const searchEl = document.getElementById("search");
const themeToggle = document.getElementById("themeToggle");

let lineChart;
let pieChart;

let chartData = {
    labels: [],
    income: [],
    expense: []
};

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function loadData() {
    const saved = localStorage.getItem("transactions");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    if (saved) {
        transactions = JSON.parse(saved);
        transactions.forEach(t => applyTransaction(t, false));
        updateCharts();
    }
}

function updateBalance() {
    balanceEl.textContent = balance;

    if (balance > 0) {
        balanceEl.classList.add("green");
        balanceEl.classList.remove("red");
    } else if (balance < 0) {
        balanceEl.classList.add("red");
        balanceEl.classList.remove("green");
    } else {
        balanceEl.classList.remove("green");
        balanceEl.classList.remove("red");
    }
}

function getDate() {
    const now = new Date();
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

function updateCharts() {
    if (lineChart) lineChart.destroy();
    if (pieChart) pieChart.destroy();

    const ctx1 = document.getElementById("chartCanvas").getContext("2d");
    const ctx2 = document.getElementById("pieCanvas").getContext("2d");

    const isDark = document.body.classList.contains("dark");

    lineChart = new Chart(ctx1, {
        type: "line",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Income",
                    data: chartData.income,
                    borderColor: isDark ? "orange" : "green",
                    fill: false
                },
                {
                    label: "Expense",
                    data: chartData.expense,
                    borderColor: isDark ? "blue" : "red",
                    fill: false
                }
            ]
        }
    });

    const totalIncome = chartData.income.reduce((a, b) => a + b, 0);
    const totalExpense = chartData.expense.reduce((a, b) => a + b, 0);

    pieChart = new Chart(ctx2, {
        type: "pie",
        data: {
            labels: ["Total Income", "Total Expense"],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: isDark
                    ? ["orange", "blue"]
                    : ["green", "red"]
            }]
        }
    });
}

function addHistoryItem(t) {
    const li = document.createElement("li");
    li.classList.add(t.type);

    const text = document.createElement("span");
    text.textContent = `${t.amount} € - ${t.note || "No description"} - (${t.date})`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        if (t.type === "income") {
            balance -= t.amount;
        } else {
            balance += Math.abs(t.amount);
        }

        transactions = transactions.filter(x => x !== t);
        saveData();

        updateBalance();
        li.remove();
        rebuildCharts();
    });

    li.appendChild(text);
    li.appendChild(deleteBtn);
    historyEl.appendChild(li);
}

function rebuildCharts() {
    chartData = { labels: [], income: [], expense: [] };

    transactions.forEach(t => {
        chartData.labels.push(t.date);
        if (t.type === "income") {
            chartData.income.push(t.amount);
            chartData.expense.push(0);
        } else {
            chartData.income.push(0);
            chartData.expense.push(Math.abs(t.amount));
        }
    });

    updateCharts();
}

function applyTransaction(t, save = true) {
    if (t.type === "income") {
        balance += t.amount;
        chartData.income.push(t.amount);
        chartData.expense.push(0);
    } else {
        balance -= Math.abs(t.amount);
        chartData.income.push(0);
        chartData.expense.push(Math.abs(t.amount));
    }

    chartData.labels.push(t.date);

    addHistoryItem(t);
    updateBalance();

    if (save) saveData();
}

incomeBtn.addEventListener("click", () => {
    const amount = Number(amountEl.value);
    const note = noteEl.value;

    if (!isNaN(amount) && amount !== 0) {
        const t = {
            amount,
            note,
            type: "income",
            date: getDate()
        };

        transactions.push(t);
        applyTransaction(t);
        updateCharts();
    }
});

expenseBtn.addEventListener("click", () => {
    const amount = Number(amountEl.value);
    const note = noteEl.value;

    if (!isNaN(amount) && amount !== 0) {
        const t = {
            amount: -amount,
            note,
            type: "expense",
            date: getDate()
        };

        transactions.push(t);
        applyTransaction(t);
        updateCharts();
    }
});

/* --- ARAMA FİLTRESİ --- */
searchEl.addEventListener("input", () => {
    const keyword = searchEl.value.toLowerCase();

    historyEl.innerHTML = "";

    transactions
        .filter(t =>
            t.note.toLowerCase().includes(keyword) ||
            t.date.toLowerCase().includes(keyword) ||
            String(t.amount).includes(keyword)
        )
        .forEach(t => addHistoryItem(t));
});

/* --- KARANLIK MOD --- */
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    saveData();
    updateCharts();
});

loadData();
