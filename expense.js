let members = [];

function addMember() {
    const input = document.getElementById("memberInput");
    const name = input.value.trim();

    if (!name) {
        alert("Please enter a member name");
        return;
    }

    members.push(name);
    input.value = "";

    const list = document.getElementById("memberList");
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
}

function addExpense() {
    const description = document.getElementById("description").value.trim();
    const payer = document.getElementById("payer").value.trim();
    const amount = Number(document.getElementById("amt").value);
    const splitType = document.getElementById("split").value;
    const manualContainer = document.getElementById("manualsplit");
    const summaryDiv = document.getElementById("summary");

    summaryDiv.innerHTML = "";

    if (!description || !payer || isNaN(amount) || amount <= 0) {
        alert("Invalid details");
        return;
    }

    if (!members.includes(payer)) {
        alert("Payer is not in the group");
        return;
    }

    if (splitType === "equal") {
        const split = amount / members.length;

        members.forEach(member => {
            if (member !== payer) {
                summaryDiv.innerHTML += `<p>${member} pays $${split.toFixed(2)} to ${payer}</p>`;
            }
        });
        return;
    }

    const inputs = manualContainer.querySelectorAll("input");

    if (inputs.length === 0) {
        manualContainer.innerHTML = "";
        members.forEach(member => {
            const row = document.createElement("div");

            const label = document.createElement("span");
            label.textContent = member + ": ";

            const input = document.createElement("input");
            input.type = "number";
            input.min = "0";
            input.dataset.member = member;

            row.appendChild(label);
            row.appendChild(input);
            manualContainer.appendChild(row);
        });
        return;
    }

    let total = 0;
    const splits = {};

    inputs.forEach(input => {
        const val = Number(input.value);
        if (isNaN(val) || val < 0) {
            alert("Please enter valid amounts");
            return;
        }
        splits[input.dataset.member] = val;
        total += val;
    });

    if (total !== amount) {
        alert(`Total must equal ${amount}`);
        return;
    }

    const balances = {};

    members.forEach(member => {
        balances[member] = 0;
    });

    balances[payer] += amount;

    for (const member in splits) {
        balances[member] -= splits[member];
    }

    for (const member in balances) {
        if (balances[member] < 0) {
            summaryDiv.innerHTML += `<p>${member} pays $${Math.abs(balances[member])} to ${payer}</p>`;
        }
    }

    manualContainer.innerHTML = "";
}
