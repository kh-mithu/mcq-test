const studentName = localStorage.getItem('mcq_student_name') || 'Student';
const studentEmail = localStorage.getItem('mcq_student_email') || '';

document.getElementById('studentInfo').textContent = studentName + ' (' + studentEmail + ')';

let currentIndex = 0;
let answers = {}; // questionIndex -> selected option index
let timerInterval = null;
let timeLeft = EXAM_TIME_MINUTES * 60;
let examSubmitted = false;
let startTime = Date.now();

const questionContainer = document.getElementById('questionContainer');
const nextBtn = document.getElementById('nextBtn');
const navControls = document.getElementById('navControls');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');
const timeUpAlert = document.getElementById('timeUp');

function renderQuestion() {
  if (examSubmitted) return;
  const q = QUESTIONS[currentIndex];
  const selected = answers[currentIndex] !== undefined ? answers[currentIndex] : null;

  let html = '';
  html += '<div class="question-meta">Question <b>' + (currentIndex + 1) + '</b> of <b>' + QUESTIONS.length + '</b></div>';
  html += '<div class="question-text">' + escapeHtml(q.q) + '</div>';
  html += '<ul class="options">';
  q.options.forEach(function (opt, i) {
    const checked = selected === i ? 'checked' : '';
    const disabled = answers[currentIndex] !== undefined ? 'disabled' : '';
    html += '<li><label><input type="radio" name="option" value="' + i + '" ' + checked + ' ' + disabled + '>' + escapeHtml(opt) + '</label></li>';
  });
  html += '</ul>';

  questionContainer.innerHTML = html;

  // Wire up option selection (locks the answer)
  const radios = questionContainer.querySelectorAll('input[name="option"]');
  radios.forEach(function (r) {
    r.addEventListener('change', function () {
      answers[currentIndex] = parseInt(r.value, 10);
      // disable all radios after selection so user cannot change
      radios.forEach(function (x) { x.disabled = true; });
      updateNav();
    });
  });

  updateProgress();
  updateNav();
}

function updateProgress() {
  const pct = ((currentIndex + 1) / QUESTIONS.length) * 100;
  progressBar.style.width = pct + '%';
}

function updateNav() {
  navControls.style.display = 'flex';
  if (currentIndex >= QUESTIONS.length - 1) {
    nextBtn.textContent = 'Finish Exam';
  } else {
    nextBtn.innerHTML = 'Next &rarr;';
  }
  // enable next only if current question answered (except last allowed finish too)
  const answered = answers[currentIndex] !== undefined;
  nextBtn.disabled = !answered;
}

function goNext() {
  if (currentIndex >= QUESTIONS.length - 1) {
    submitExam();
  } else {
    currentIndex++;
    renderQuestion();
  }
}

nextBtn.addEventListener('click', function (e) {
  e.preventDefault();
  goNext();
});

function startTimer() {
  timerInterval = setInterval(function () {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUpAlert.style.display = 'block';
      submitExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  timeDisplay.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  document.title = '(' + timeDisplay.textContent + ') MCQ Test - Exam';
}

function submitExam() {
  if (examSubmitted) return;
  examSubmitted = true;
  clearInterval(timerInterval);

  let correct = 0;
  QUESTIONS.forEach(function (q, i) {
    if (answers[i] === q.answer) correct++;
  });

  const endTime = Date.now();
  const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);
  const now = new Date();

  const result = {
    name: studentName,
    email: studentEmail,
    score: correct,
    total: QUESTIONS.length,
    percentage: Math.round((correct / QUESTIONS.length) * 100),
    timeTaken: timeTakenSeconds,
    submittedAt: now.toISOString()
  };

  localStorage.setItem('mcq_result', JSON.stringify(result));

  // Append to admin results list
  const all = JSON.parse(localStorage.getItem('mcq_all_results') || '[]');
  all.push(result);
  localStorage.setItem('mcq_all_results', JSON.stringify(all));

  window.location.href = 'result.html';
}

// Prevent going back via browser back after start? Keep simple: warn on unload
window.addEventListener('beforeunload', function (e) {
  if (!examSubmitted && currentIndex < QUESTIONS.length - 1) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Init
renderQuestion();
startTimer();

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
