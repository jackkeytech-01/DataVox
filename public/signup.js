let errorMsg = document.getElementById('err');
let send_btn = document.getElementById('send');
send_btn.disabled=false;
let form = document.getElementById('signup_form');
let usernameError = false;
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = e.target.name.value;
  const username = e.target.username.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;
  send_btn.disabled=true;
  send_btn.value='Creating Account...';
  //Checking for spaces on username....Actually not allowed
  for (var i=0; i<username.length; i++) {
    if (username[i]===' ') {
      //Space found...display error
      usernameError=true;
    }
  }
  if (usernameError) {
      showError('Username cannot contain spaces');
  }
  else {
  try {
  const res = await fetch('/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, username, email,  password })
  })
  const data = await res.json();
  if (data.success) {
    flyMSG('', 'Account Created Successfully');
    form.reset();
    setTimeout(()=>{
      window.location.href='/login';
    }, 1500);
    
  }
  else {
    showError(data.message);
  }
} catch (err) {
  console.log(err.message);
  showError('Server Error Occurred. Please try again');
}
  }
});

function showError(msg) {
  errorMsg.style.visibility = 'visible';
  errorMsg.textContent = msg;
    send_btn.disabled=false;
    send_btn.value='Create Account';
  setTimeout(()=>{
    errorMsg.style.visibility='hidden';
    errorMsg.textContent = '';
  }, 3000);
}