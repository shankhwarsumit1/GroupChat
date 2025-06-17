window.addEventListener('DOMContentLoaded',()=>{
   console.log(API_BASE);
    const form = document.querySelector('form');
    const REST_API = `http://localhost:5000/signup`
    form.addEventListener('submit',async(event)=>{
        event.preventDefault()
        try{
          const user = {
               name:event.target.name.value,
               email:event.target.email.value,
               password:event.target.password.value,
               phonenumber:event.target.phonenumber.value
          };
          await axios.post(REST_API,user);
        //   window.location.href = '../login/login.html';
        }
        catch(err){
            console.log(user);
            alert(err.message);
        }
    })


})