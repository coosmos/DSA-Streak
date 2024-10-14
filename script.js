const totalDays = 75;
const questionsPerDay = 4;

// Arrays to hold required questions and solved questions for each day
const requiredQuestions = Array(totalDays).fill(questionsPerDay);
const questionsSolved = new Array(totalDays).fill(0);

// Generate the table dynamically
const daysTable = document.getElementById("daysTable");
let debtArray = new Array(totalDays).fill(0);
const today = new Date(); // Get today's date

for (let day = 1; day <= totalDays; day++) {
  const row = document.createElement("tr");

  // Day column
  const dayCell = document.createElement("td");
  dayCell.textContent = `Day ${day} (${new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + day - 1
  ).toLocaleDateString()})`;
  row.appendChild(dayCell);

  // Questions solved input
  const questionsSolvedCell = document.createElement("td");
  const input = document.createElement("input");
  input.type = "number";
  input.value = 0;
  input.min = 0; // You can solve 0 or more questions
  input.disabled = day > 1; // Disable input for all days except today (Day 1)
  input.addEventListener("change", () =>
    updateDebtAndCredit(day, parseInt(input.value))
  );
  questionsSolvedCell.appendChild(input);
  row.appendChild(questionsSolvedCell);

  // Debt column
  const debtCell = document.createElement("td");
  debtCell.classList.add("debt");
  debtCell.textContent = 0;
  row.appendChild(debtCell);

  // Completed column
  const completedCell = document.createElement("td");
  completedCell.textContent = "❌"; // Default as not completed
  row.appendChild(completedCell);

  daysTable.appendChild(row);
}

// Update function to manage the logic
function updateDebtAndCredit(day, solved) {
  // Update questions solved for that day
  questionsSolved[day - 1] = solved;

  // Calculate cumulative questions solved and required
  const cumulativeSolved = questionsSolved
    .slice(0, day)
    .reduce((a, b) => a + b, 0);
  const cumulativeRequired = requiredQuestions
    .slice(0, day)
    .reduce((a, b) => a + b, 0);

  // Calculate debt for the current day
  const debt = cumulativeRequired - cumulativeSolved;
  debtArray[day - 1] = debt > 0 ? debt : 0;

  // Update the debt column
  const row = daysTable.rows[day - 1];
  const debtCell = row.cells[2];
  debtCell.textContent = debtArray[day - 1];

  // Update the completed status for the current day
  const completedCell = row.cells[3];
  if (cumulativeSolved >= cumulativeRequired) {
    completedCell.textContent = "✔️";

    // Mark all previous days as completed if current day is completed
    for (let i = 0; i < day; i++) {
      const prevRow = daysTable.rows[i];
      const prevCompletedCell = prevRow.cells[3];
      prevCompletedCell.textContent = "✔️";
    }
  } else {
    completedCell.textContent = "❌";
  }
}

// Function to disable past inputs and enable only the current day input
function disablePastInputs() {
  const currentDay = Math.floor((new Date() - today) / (1000 * 60 * 60 * 24)); // Calculate the current day index

  for (let day = 1; day <= totalDays; day++) {
    const row = daysTable.rows[day - 1];
    const input = row.cells[1].querySelector("input");

    if (day < currentDay + 1) {
      input.disabled = true; // Disable input for past days
    } else if (day === currentDay + 1) {
      input.disabled = false; // Enable input for the current day
    } else {
      input.disabled = true; // Disable input for future days
    }
  }
}

// Call the function on page load to set the correct input states
disablePastInputs();
