window.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const loginBtn = document.querySelector('#login-btn');
    const REST_API = `http://127.0.0.1:5000/user/login`;

    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const user = {
            email: emailInput.value,
            password: passwordInput.value
        };
        try {
            const response = await axios.post(REST_API, user);
            if(response.data.success){         
                emailInput.value='';
                passwordInput.value='';
                localStorage.setItem('token',response.data.token);
   
            }else{
            alert(response.data.errror);
            }
        } catch (err) {
            if (err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert('An error occurred');
            }
            console.log(err);
     
        }
    });

});