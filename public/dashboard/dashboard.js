window.addEventListener('DOMContentLoaded', () => {

    const messageInput = document.getElementById('message');
    const sendMessageBtn = document.getElementById('send-btn');
    const token = localStorage.getItem('token');
    const chatlist = document.getElementById('chatlist');
    const chatblock = document.getElementById("chatblock");
    const onlineUsersList = document.getElementById("user-list");
    const loadOlderBtn = document.getElementById("load-older-btn");
    let localmessages = [];
    let readmessages = [];
    let sendBtnClick = false;
    if (!token) {
        window.location.href = '../login/login.html';
    }


    loadOlderBtn.addEventListener('click',async(e)=>{
       e.preventDefault();
       try{
            if (localStorage.getItem('localmessages')) {
            readmessages = JSON.parse(localStorage.getItem('localmessages')) || [];
            }
            if(readmessages.length!=0){
            localOldest = readmessages[0];
            res = await axios.get(`http://localhost:5000/chat/getMessages/${localOldest.id}`, {
                headers: {
                    'token': token
                }
            });
           const arr = res.data.chats;
           arr.pop();
           readmessages=arr.concat(readmessages);
           localStorage.setItem('localmessages', JSON.stringify(readmessages));
           console.log(arr);
            }
       }catch(err){
        console.log(err);
       }
       
    });
    async function addOnline() {
    try{
        const response = await axios.get('http://localhost:5000/user/getUserData', {
            headers: {
                'token': token
            }
        });
        const onlineUser = document.createElement('li');
        onlineUser.className = 'user-list-element';
        onlineUser.innerHTML = `🟢${response.data.res.name}`;
        onlineUsersList.appendChild(onlineUser);
    }
    catch(err){
        console.log(err);
    }
    }
    addOnline();

    function scrollToBottom() {
        chatblock.scrollTop = chatblock.scrollHeight;
    }



    async function loadChats() {
        try{
        let res;
        if (localStorage.getItem('localmessages')) {
            readmessages = JSON.parse(localStorage.getItem('localmessages')) || [];
        }

        if (!sendBtnClick) {
            res = await axios.get(`http://localhost:5000/chat/getMessages/${undefined}`, {
                headers: {
                    'token': token
                }
            });

        } else if (readmessages != null && readmessages.length != 0) {
            sendBtnClick = false;
            const lastChat = readmessages[readmessages.length - 1];
            const lastChatId = lastChat.id;
            res = await axios.get(`http://localhost:5000/chat/getMessages/${lastChatId}`, {
                headers: {
                    'token': token
                }
            })
        } else {
            sendBtnClick = false;
            res = await axios.get(`http://localhost:5000/chat/getMessages/${undefined}`, {
                headers: {
                    'token': token
                }
            })
        }
        const arr = res.data.chats;
        
        if (readmessages.length != 0) {
            arr.forEach((chat) => {
                if (!readmessages.some(mi => mi.id == chat.id)) {
                    if (readmessages.length > 1000) {
                        readmessages.shift();
                    }
                    readmessages.push(chat);
                }
            })
            localStorage.setItem('localmessages', JSON.stringify(readmessages));

        } else {
            readmessages = arr;
            localStorage.setItem('localmessages', JSON.stringify(readmessages));
        }
        chatlist.innerHTML = '';
        readmessages.forEach((i) => {
            displayChat(i);
        })
    }
    catch(err){
        console.log(err);
    }
    };
    

    setInterval(() => {
        loadChats();
    }, 1000);



    function displayChat(chat) {
        const chatElement = document.createElement('li');
        chatElement.className = 'chat-element';
        chatElement.innerHTML = `<span class="user">${chat.userName}:</span><span class="chat">${chat.message}</span>`
        chatlist.appendChild(chatElement);

    }

    sendMessageBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            sendBtnClick = true;
            const message = messageInput.value;
            const response = await axios.post('http://localhost:5000/chat/send', {
                message
            }, {
                headers: {
                    'token': token
                }
            });
            const data = {
                id: response.data.chat.id,
                message,
                userName: response.data.chat.userName
            };
            localmessages = [];
            if (localStorage.getItem('localmessages') != null) {
                localmessages = JSON.parse(localStorage.getItem('localmessages'));
                if (localmessages.length > 120) {
                    localmessages.shift();
                }
            }
            localmessages.push(data);
            displayChat(data)
            localStorage.setItem('localmessages', JSON.stringify(localmessages));
            scrollToBottom();
        } catch (err) {
            console.log(err);
        }

    })

})