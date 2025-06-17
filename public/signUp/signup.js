window.addEventListener('DOMContentLoaded',()=>{
   console.log(API_BASE);
    const form = document.querySelector('form');
    const REST_API = `${API_BASE}/signup`
    form.addEventListener('submit',async(event)=>{
        event.preventDefault()
        try{
          const user = {
               name:event.target.name.value,
               email:event.target.email.value,
               password:event.target.password.value
          };
          await axios.post(REST_API,user);
          window.location.href = '../login/login.html';
          form.reset();
        }
        catch(err){
            console.log(user);
            alert(err.message);
        }
    })


})