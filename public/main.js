   let fly_msg = document.getElementById('fly_message');
  fly_msg.classList.add('hide');
  
  function flyMSG(info, msg) {
    if (info==='err') { 
      fly_msg.style.color='red'; 
    }
    else {
      fly_msg.style.color='white'; 
    }
      fly_msg.classList.remove('hide');
      fly_msg.classList.add('show');
      fly_msg.textContent = msg;
    
      setTimeout(()=>{
        fly_msg.classList.add('hide')
        fly_msg.classList.remove('show')
      }, 3000);
      setTimeout(()=>{
        fly_msg.textContent = '';
      }, 6000);
    }