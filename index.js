document.getElementById('studentForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!name || !email) return;
  localStorage.setItem('mcq_student_name', name);
  localStorage.setItem('mcq_student_email', email);
  localStorage.removeItem('mcq_result');
  window.location.href = 'exam.html';
});
