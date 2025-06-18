

window.addEventListener('DOMContentLoaded',()=>{
    const form = document.querySelector('form');
    const REST_API = `http://localhost:5000/user/signup`
    form.addEventListener('submit',async(event)=>{
        event.preventDefault()
        try{
          const user = {
               name:event.target.name.value,
               email:event.target.email.value,
               password:event.target.password.value,
               phonenumber:event.target.phonenumber.value
          };
          const res = await axios.post(REST_API,user);
          if(res.data.success===true){
          alert('Successfuly signed up')
          window.location.href='../login/login.html';
          }
      
        }
        catch(err){
        console.log(err);
         alert(err.response.data.error);
        }
    })


})