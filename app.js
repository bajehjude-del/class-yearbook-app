// ── Storage helpers ──────────────────────────────────────────────
const STORAGE_KEY = 'yearbook_students';

function loadStudents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// ── Render ───────────────────────────────────────────────────────
const grid = document.getElementById('cards-grid');

function renderCards() {
  const students = loadStudents();
  grid.innerHTML = '';

  if (students.length === 0) {
    grid.innerHTML = '<p class="empty-state">No students yet — add one above! 🎓</p>';
    return;
  }

  students.forEach((student, index) => {
    grid.appendChild(createCard(student, index));
  });
}

// Build a single card element
function createCard(student, index) {
  const card = document.createElement('div');
  card.className = 'card';

  const fallback = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.name) + '&size=300&background=667eea&color=fff';

  card.innerHTML = `
    <img src="${student.image || fallback}" alt="${student.name}" onerror="this.src='${fallback}'" />
    <div class="card-body">
      <h3>${student.name}</h3>
      <p>🍿 <span>Snack:</span> ${student.snack}</p>
      <p>💡 <span>Fun Fact:</span> ${student.fact}</p>
      <div class="card-actions">
        <button class="btn-edit"   onclick="editStudent(${index})">✏️ Edit</button>
        <button class="btn-delete" onclick="deleteStudent(${index})">🗑️ Delete</button>
      </div>
    </div>
  `;

  return card;
}

// ── Add ──────────────────────────────────────────────────────────
document.getElementById('student-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const student = {
    name:  document.getElementById('name').value.trim(),
    snack: document.getElementById('snack').value.trim(),
    fact:  document.getElementById('fact').value.trim(),
    image: document.getElementById('image').value.trim(),
  };

  const students = loadStudents();
  students.push(student);
  saveStudents(students);

  this.reset();
  renderCards();
});

// ── Delete ───────────────────────────────────────────────────────
function deleteStudent(index) {
  if (!confirm('Remove this student from the yearbook?')) return;
  const students = loadStudents();
  students.splice(index, 1);
  saveStudents(students);
  renderCards();
}

// ── Edit (prompt-based inline edit) ─────────────────────────────
function editStudent(index) {
  const students = loadStudents();
  const s = students[index];

  const name  = prompt('Name:', s.name);
  if (name === null) return; // cancelled
  const snack = prompt('Favorite Snack:', s.snack);
  if (snack === null) return;
  const fact  = prompt('Fun Fact:', s.fact);
  if (fact === null) return;
  const image = prompt('Image URL:', s.image);
  if (image === null) return;

  students[index] = {
    name:  name.trim()  || s.name,
    snack: snack.trim() || s.snack,
    fact:  fact.trim()  || s.fact,
    image: image.trim(),
  };

  saveStudents(students);
  renderCards();
}

// ── Init ─────────────────────────────────────────────────────────
renderCards();
