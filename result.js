const result = JSON.parse(localStorage.getItem('mcq_result'));

if (!result) {
  window.location.href = 'index.html';
}

const studentInfoEl = document.getElementById('resultStudentInfo');
const scoreCircleEl = document.getElementById('scoreCircle');
const scoreLabelEl = document.getElementById('scoreLabel');
const resultDetailsEl = document.getElementById('resultDetails');

if (studentInfoEl) studentInfoEl.textContent = (result.name || 'Student') + ' - ' + (result.email || '');
if (scoreCircleEl) {
  scoreCircleEl.textContent = (result.percentage || 0) + '%';
  scoreCircleEl.style.color = (result.percentage >= 60) ? '#16a34a' : '#dc2626';
}
if (scoreLabelEl) scoreLabelEl.textContent = 'Your Score';

const minutes = Math.floor((result.timeTaken || 0) / 60);
const seconds = (result.timeTaken || 0) % 60;
const timeTaken = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

const submitted = result.submittedAt ? new Date(result.submittedAt).toLocaleString() : '—';

if (resultDetailsEl) {
  resultDetailsEl.innerHTML =
    '<p><strong>Correct Answers:</strong> ' + (result.score || 0) + ' / ' + (result.total || 0) + '</p>' +
    '<p><strong>Percentage:</strong> ' + (result.percentage || 0) + '%</p>' +
    '<p><strong>Time Taken:</strong> ' + timeTaken + '</p>' +
    '<p><strong>Submitted At:</strong> ' + submitted + '</p>' +
    ((result.percentage || 0) >= 60 ? '<p style="color:#16a34a;font-weight:700;">Result: Passed</p>' : '<p style="color:#dc2626;font-weight:700;">Result: Failed</p>');
}
