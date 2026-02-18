let balance = 0;

const balanceEl = document.getElementById("balance");
const amountEl = document.getElementById("amount");
const noteEl = document.getElementById("note");
const incomeBtn = document.getElementById("incomeBtn");
const expenseBtn = document.getElementById("expenseBtn");
const historyEl = document.getElementById("history");

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
    return now.toLocaleString("de-DE");
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
    }
});

expenseBtn.addEventListener("click", () => {
    const amount = Number(amountEl.value);
    const note = noteEl.value;

    if (!isNaN(amount) && amount !== 0) {
        balance -= amount;
        updateBalance();
        addHistory(-amount, note, "expense");
    }
});
