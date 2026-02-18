let balance = 0;

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

function addHistory(amount, note, type) {
    const li = document.createElement("li");
    li.classList.add(type);

    const text = document.createElement("span");
    text.textContent = `${amount} € - ${note || "No description"} - (${getDate()})`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
        if (type === "income") {
            balance -= amount;
        } else {
            balance += Math.abs(amount);
        }
        updateBalance();
        li.remove();
    });

    li.appendChild(text);
    li.appendChild(deleteBtn);
    historyEl.appendChild(li);
}

incomeBtn.addEventListener("click", () => {
    const amount = Number(amountEl.value);
    const note = noteEl.value;

    if (!isNaN(amount) && amount !== 0) {
        balance += amount;
        updateBalance();
        addHistory(amount, note, "income");

        chartData.labels.push(getDate());
        chartData.income.push(amount);
        chartData.expense.push(0);
        updateChart();
    }
});

expenseBtn.addEventListener("click", () => {
    const amount = Number(amountEl.value);
    const note = noteEl.value;

    if (!isNaN(amount) && amount !== 0) {
        balance -= amount;
        updateBalance();
        addHistory(-amount, note, "expense");

        chartData.labels.push(getDate());
        chartData.income.push(0);
        chartData.expense.push(amount);
        updateChart();
    }
});
