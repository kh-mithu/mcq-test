const ADMIN_PASSWORD = 'admin123'; // change this to your desired password

const loginOverlay = document.getElementById('adminLogin');
const adminContent = document.getElementById('adminContent');
const adminPassword = document.getElementById('adminPassword');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginError = document.getElementById('adminLoginError');
const adminLogout = document.getElementById('adminLogout');

// Check if already logged in this session
if (sessionStorage.getItem('mcq_admin_logged') === 'true') {
  loginOverlay.style.display = 'none';
  adminContent.style.display = 'block';
  render();
} else {
  loginOverlay.style.display = 'block';
  adminContent.style.display = 'none';
}

adminLoginBtn.addEventListener('click', function () {
  if (adminPassword.value === ADMIN_PASSWORD) {
    sessionStorage.setItem('mcq_admin_logged', 'true');
    loginOverlay.style.display = 'none';
    adminContent.style.display = 'block';
    render();
  } else {
    adminLoginError.style.display = 'block';
    adminPassword.value = '';
  }
});

adminPassword.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') adminLoginBtn.click();
});

adminLogout.addEventListener('click', function () {
  sessionStorage.removeItem('mcq_admin_logged');
  location.reload();
});

const results = JSON.parse(localStorage.getItem('mcq_all_results') || '[]');
const tbody = document.getElementById('resultsBody');
const noResults = document.getElementById('noResults');
const tableWrap = document.getElementById('resultsTableWrap');

function render() {
  tbody.innerHTML = '';
  if (results.length === 0) {
    tableWrap.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }
  tableWrap.style.display = 'block';
  noResults.style.display = 'none';
  results.slice().reverse().forEach(function (r, i) {
    const tr = document.createElement('tr');
    const mins = Math.floor(r.timeTaken / 60);
    const secs = r.timeTaken % 60;
    const timeTaken = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    const submitted = new Date(r.submittedAt).toLocaleString();
    tr.innerHTML =
      '<td>' + (results.length - i) + '</td>' +
      '<td>' + escapeHtml(r.name) + '</td>' +
      '<td>' + escapeHtml(r.email) + '</td>' +
      '<td>' + r.score + '</td>' +
      '<td>' + r.total + '</td>' +
      '<td>' + r.percentage + '%</td>' +
      '<td>' + timeTaken + '</td>' +
      '<td>' + submitted + '</td>';
    tbody.appendChild(tr);
  });
}

document.getElementById('clearResults').addEventListener('click', function () {
  if (!confirm('Clear all stored results?')) return;
  localStorage.removeItem('mcq_all_results');
  location.reload();
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

render();
