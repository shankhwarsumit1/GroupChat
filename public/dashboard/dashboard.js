window.addEventListener('DOMContentLoaded',()=>{

const messageInput = document.getElementById('message');
const sendMessageBtn = document.getElementById('send-btn');
const token = localStorage.getItem('token');
const chatlist = document.getElementById('chatlist');
const chatblock = document.getElementById("chatblock");
const onlineUsersList = document.getElementById("user-list");




async function addOnline(){
    const response = await axios.get('http://localhost:5000/user/getUserData',{
    headers:{'token':token}
   });
 const onlineUser = document.createElement('li');
 onlineUser.className='user-list-element';
 onlineUser.innerHTML=`🟢${response.data.res.name}`;
 onlineUsersList.appendChild(onlineUser);
}
addOnline();

function scrollToBottom() {
    chatblock.scrollTop = chatblock.scrollHeight;
  }

if(!token){
    window.location.href = '../login/login.html'
}

async function loadChats(){
   const response = await axios.get('http://localhost:5000/chat/getAllChats',{
    headers:{'token':token}
   });
   chatlist.innerHTML='';
   response.data.chats.forEach((chat)=>{
    displayChat(chat);
   })
};

setInterval(() => {
    loadChats();
},500);

function displayChat(chat){
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
        });   scrollToBottom();
   }
   catch(err){
    console.log(err);
   }

})

})