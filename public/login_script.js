let errorMsg = document.getElementById('err');
let send_btn = document.getElementById('send');
errorMsg.style.visibility = 'hidden';
document.getElementById('login_form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  send_btn.disabled = true;
  send_btn.value = 'Logging In';
  const username = e.target.username.value;
  const password = e.target.password.value;

  const res = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  const data = await res.json();
  if (data.success) {
    window.location.href = '/account';
  }
  else {
    showError(data.message);
    send_btn.disabled = false;
    send_btn.value='Log In'
  }
})
function showError(msg) {
  errorMsg.style.visibility = 'visible';
  errorMsg.textContent = msg;
  setTimeout(()=>{
    errorMsg.style.visibility='hidden';
    errorMsg.textContent = '';
  }, 3000);
}