const newPassword = document.querySelector('#newPassword');
const confirmPassword = document.querySelector('#confirmPassword');
const correction = document.querySelector('#correction');
const submit = document.querySelector('#submit');


if(newPassword.innerHTML =="" && confirmPassword.innerHTML =="" ){
    submit.style.cursor='not-allowed'
     submit.disabled =true
}

confirmPassword.addEventListener('keyup',()=>{
  if(newPassword.value == confirmPassword.value){
    correction.innerHTML = 'Correct Password'
    submit.style.cursor='pointer'
    correction.style.color = 'green'
    
    submit.disabled=false
  }else{
      correction.innerHTML ='Wrong Password'
      correction.style.color = 'red'
      submit.style.cursor='not-allowed'
     submit.disabled =true
  }
})


newPassword.addEventListener('keyup',()=>{
    if(newPassword.value == confirmPassword.value){
      correction.innerHTML = 'Correct Password'
      submit.style.cursor='pointer'
      correction.style.color = 'green'
      
      submit.disabled=false
    }else{
        correction.innerHTML ='Wrong Password'
        correction.style.color = 'red'
        submit.style.cursor='not-allowed'
       submit.disabled =true
    }
  })