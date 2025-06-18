window.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const loginBtn = document.querySelector('#login-btn');
    const REST_API = `${API_BASE}/user/login`;

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
            }else{
            alert(response.data.message);
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