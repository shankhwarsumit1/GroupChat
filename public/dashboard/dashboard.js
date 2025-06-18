window.addEventListener('DOMContentLoaded',()=>{

const messageInput = document.getElementById('message');
const sendMessageBtn = document.getElementById('send-btn');
const token = localStorage.getItem('token');

sendMessageBtn.addEventListener('click',async(e)=>{
   e.preventDefault();
   try{
        const message = messageInput.value;
        const response = axios.post('http://localhost:5000/chat/send',{message},{
            headers:{
                'token':token
            }
        });
    console.log(response);
   }
   catch(err){
    console.log(err);
   }

})

})