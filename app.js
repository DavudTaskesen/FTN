let balance = 0;
let transactions = [];

const balanceEl = document.getElementById("balance");
const amountEl = document.getElementById("amount");
const noteEl = document.getElementById("note");
const incomeBtn = document.getElementById("incomeBtn");
const expenseBtn = document.getElementById("expenseBtn");
const historyEl = document.getElementById("history");

let chart;
let chartData = {
    labels: [],
    income: [],
    expense: []
};

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadData() {
    const saved = localStorage.getItem("transactions");
    if (saved) {
        transactions = JSON.parse(saved);
        transactions.forEach(t => applyTransaction(t, false));
        updateChart();
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

    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    return `${day} ${month}, ${year}`;
}

function updateChart() {
    if (chart) chart.destroy();

    const ctx = document.getElementById("chartCanvas").getContext("2d");

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: chartData.labels,
            datasets: [
                {
                    label: "Income",
                    data: chartData.income,
                    borderColor: "green",
                    fill: false
                },
                {
                    label: "Expense",
                    data: chartData.expense,
                    borderColor: "red",
                    fill: false
                }
            ]
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
        updateChart();
    });

    li.appendChild(text);
    li.appendChild(deleteBtn);
    historyEl.appendChild(li);
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
        updateChart();
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
        updateChart();
    }
});

loadData();
