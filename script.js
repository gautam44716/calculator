/* =====================================================
   Calculator logic
   No eval() is used - calculation is done step by step.
   ===================================================== */

const screen = document.getElementById("screen");
const history = document.getElementById("history");

let currentValue = "0";     // number currently being typed
let previousValue = null;   // first number of the calculation
let operator = null;        // + - * /
let justCalculated = false; // true right after pressing "="

/* ---------- Helpers ---------- */

// Show the current value (and history line) on the screen
function updateScreen() {
  screen.textContent = currentValue;

  if (operator !== null && previousValue !== null) {
    history.textContent = previousValue + " " + symbolOf(operator);
  } else {
    history.textContent = "";
  }
}

// Convert * and / into the symbols we show to the user
function symbolOf(op) {
  if (op === "*") return "×";
  if (op === "/") return "÷";
  if (op === "-") return "−";
  return op;
}

// Do the actual maths for two numbers
function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);

  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") {
    if (b === 0) return "Error";
    return a / b;
  }
  return b;
}

// Round long decimals such as 0.1 + 0.2 = 0.30000000000000004
function format(result) {
  if (result === "Error") return result;
  return String(parseFloat(result.toFixed(10)));
}

/* ---------- Button actions ---------- */

function inputNumber(digit) {
  if (currentValue === "Error" || justCalculated) {
    currentValue = "0";
    justCalculated = false;
  }

  if (currentValue === "0") {
    currentValue = digit;
  } else if (currentValue.length < 14) {
    currentValue += digit;
  }
}

function inputDecimal() {
  if (currentValue === "Error" || justCalculated) {
    currentValue = "0";
    justCalculated = false;
  }

  if (!currentValue.includes(".")) {
    currentValue += ".";
  }
}

function inputOperator(op) {
  if (currentValue === "Error") return;

  // If an operator is already waiting, finish that calculation first
  if (operator !== null && !justCalculated && previousValue !== null) {
    const result = format(calculate(previousValue, currentValue, operator));
    previousValue = result;
    currentValue = result;
    if (result === "Error") {
      previousValue = null;
      operator = null;
      return;
    }
  } else {
    previousValue = currentValue;
  }

  operator = op;
  justCalculated = false;
  currentValue = "0";
}

function pressEquals() {
  if (operator === null || previousValue === null) return;

  const result = format(calculate(previousValue, currentValue, operator));
  currentValue = result;
  previousValue = null;
  operator = null;
  justCalculated = true;
}

function pressPercent() {
  if (currentValue === "Error") return;
  currentValue = format(parseFloat(currentValue) / 100);
}

function clearAll() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  justCalculated = false;
}

function deleteLast() {
  if (currentValue === "Error" || justCalculated) {
    clearAll();
    return;
  }

  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
}

/* ---------- Mouse / touch clicks ---------- */

document.querySelector(".keys").addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  if (action === "number") inputNumber(value);
  else if (action === "decimal") inputDecimal();
  else if (action === "operator") inputOperator(value);
  else if (action === "equals") pressEquals();
  else if (action === "percent") pressPercent();
  else if (action === "clear") clearAll();
  else if (action === "delete") deleteLast();

  updateScreen();
});

/* ---------- Keyboard support ---------- */

document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (key >= "0" && key <= "9") inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (["+", "-", "*", "/"].includes(key)) inputOperator(key);
  else if (key === "Enter" || key === "=") {
    event.preventDefault();
    pressEquals();
  }
  else if (key === "%") pressPercent();
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
  else return;

  updateScreen();
});

updateScreen();
