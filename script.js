//جدول پویا
function createTable() {
    let r = document.getElementById("rows").value;
    let c = document.getElementById("cols").value;

    let area = document.getElementById("table-area");
    area.innerHTML = "";

    let table = document.createElement("table");

    for (let i = 0; i < r; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < c; j++) {
            let td = document.createElement("td");
            td.textContent = `(${i + 1}, ${j + 1})`;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    area.appendChild(table);
}


// فر Validation
function validateForm(event) {
    event.preventDefault();

    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    let msg = document.getElementById("form-msg");

    if (user.length < 5) {
        msg.textContent = "Username must be at least 5 characters long.";
        msg.style.color = "red";
        return;
    }

    let upper = /[A-Z]/;
    let lower = /[a-z]/;
    let digit = /[0-9]/;

    if (!upper.test(pass) || !lower.test(pass) || !digit.test(pass)) {
        msg.textContent = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
        msg.style.color = "red";
        return;
    }

    msg.textContent = "Form submitted successfully!";
    msg.style.color = "green";
}

//ماشین حساب
function press(key) {
    document.getElementById("calc-display").value += key;
}

function calculate() {
    let display = document.getElementById("calc-display");
    try {
        display.value = eval(display.value);
    } catch {
        display.value = "Error!";
    }
}

function clearCalc() {
    document.getElementById("calc-display").value = "";
}