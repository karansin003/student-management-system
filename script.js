const STORAGE_KEY = "student_management_system_data_v2";

const form = document.getElementById("studentForm");
const rollNumberInput = document.getElementById("rollNumber");
const studentNameInput = document.getElementById("studentName");
const courseInput = document.getElementById("course");
const editIndexInput = document.getElementById("editIndex");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("studentTableBody");
const emptyState = document.getElementById("emptyState");

let students = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function renderStudents() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = students
    .map((student, originalIndex) => ({ ...student, originalIndex }))
    .filter(student =>
      student.rollNumber.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query) ||
      student.course.toLowerCase().includes(query)
    );

  tableBody.innerHTML = "";

  filtered.forEach((student, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHTML(student.rollNumber)}</td>
      <td>${escapeHTML(student.name)}</td>
      <td>${escapeHTML(student.course)}</td>
      <td>
        <div class="action-buttons">
          <button class="edit-btn" onclick="editStudent(${student.originalIndex})">Edit</button>
          <button class="delete-btn" onclick="deleteStudent(${student.originalIndex})">Delete</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  emptyState.classList.toggle("hidden", filtered.length > 0);
}

function resetForm() {
  form.reset();
  editIndexInput.value = "";
  formTitle.textContent = "Add New Student";
  submitBtn.textContent = "Add Student";
  cancelEditBtn.classList.add("hidden");
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const rollNumber = rollNumberInput.value.trim();
  const name = studentNameInput.value.trim();
  const course = courseInput.value.trim();
  const editIndex = editIndexInput.value;

  if (!rollNumber || !name || !course) return;

  const duplicate = students.findIndex((student, index) =>
    student.rollNumber.toLowerCase() === rollNumber.toLowerCase() &&
    String(index) !== String(editIndex)
  );

  if (duplicate !== -1) {
    alert("This Roll Number already exists.");
    return;
  }

  const studentData = {
    rollNumber,
    name,
    course
  };

  if (editIndex === "") {
    students.push(studentData);
  } else {
    students[Number(editIndex)] = studentData;
  }

  saveStudents();
  resetForm();
  renderStudents();
});

function editStudent(index) {
  const student = students[index];

  rollNumberInput.value = student.rollNumber;
  studentNameInput.value = student.name;
  courseInput.value = student.course;
  editIndexInput.value = index;

  formTitle.textContent = "Edit Student";
  submitBtn.textContent = "Update Student";
  cancelEditBtn.classList.remove("hidden");

  document.querySelector(".form-card").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteStudent(index) {
  const student = students[index];

  if (!confirm(`Delete ${student.name}?`)) return;

  students.splice(index, 1);
  saveStudents();
  renderStudents();

  if (editIndexInput.value === String(index)) {
    resetForm();
  }
}

cancelEditBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", renderStudents);

renderStudents();
