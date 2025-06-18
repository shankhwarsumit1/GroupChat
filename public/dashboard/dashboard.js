window.addEventListener('DOMContentLoaded',()=>{

const messageInput = document.getElementById('message');
const sendMessageBtn = document.getElementById('send-btn');
const token = localStorage.getItem('token');
const chatlist = document.getElementById('chatlist');
if(!token){
    window.location.href = '../login/login.html'
}

(async()=>{
   const response = await axios.get('http://localhost:5000/chat/getAllChats',{
    headers:{'token':token}
   });
   console.log(response);
   response.data.chats.forEach((chat)=>{
    displayChat(chat);
   })
})();


function displayChat(chat){
    console.log(chat.userName,chat.message);
    const chatElement = document.createElement('li');
    chatElement.className = 'chat-element';
    chatElement.innerHTML = `<span class="user">${chat.userName}:</span><span class="chat">${chat.message}</span>`
    chatlist.appendChild(chatElement);
}

sendMessageBtn.addEventListener('click',async(e)=>{
   e.preventDefault();
   try{
        const message = messageInput.value;
        const response =await axios.post('http://localhost:5000/chat/send',{message},{
            headers:{
                'token':token
            }
        });
    window.location.reload();
    console.log(response);
   }
   catch(err){
    console.log(err);
   }

})

})