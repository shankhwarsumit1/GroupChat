window.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message');
    const sendMessageBtn = document.getElementById('send-btn');
    const token = localStorage.getItem('token');
    const chatlist = document.getElementById('chatlist');
    const chatblock = document.getElementById("chatblock");
    const loadOlderBtn = document.getElementById("load-older-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const grouplist = document.getElementById("group-list");
    const createGroupBtn = document.getElementById('create-group-btn');
    const groupModal = document.getElementById('group-modal');
    const closeModal = document.getElementById('close-modal');
    const allUsersList = document.getElementById('all-users-list');
    const groupNameInput = document.getElementById('group-name-input');
    const createGroupFinal = document.getElementById('create-group-final');
    const groupHeading = document.getElementById('group-heading');
    const settingsBtn = document.getElementById('open-settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const settingsDoneBtn = document.getElementById('settings-done-btn');
    const settingsUserList = document.getElementById('settings-users-list');
    let currentUser;
    let selectedUserIds = [];
    let localmessages = [];
    let readmessages = {};
    let sendBtnClick = false;
    let currentGroup;
    let isUserAdmin;
    if (!token || token === null) {
        window.location.href = '../login/login.html';
    };


    settingsBtn.addEventListener('click', async () => {
        settingsModal.classList.remove('hidden');
        settingsUserList.innerHTML = '';
        try {
            const isAdminResponse = await axios.get(`http://localhost:5000/isUserAmin?userId=${currentUser.id}&groupId=${currentGroup.id}`, {
                headers: {
                    token
                }
            });
            if (isAdminResponse.data.isUserAdmin) {

                const groupId = currentGroup.id;
                const res = await axios.get(`http://localhost:5000/user/getAllUsers/${groupId}`, {
                    headers: {
                        token
                    }
                });
                res.data.res.forEach(user => {
                    if (user.id != currentUser.id) {
                        const li = document.createElement('li');
                        let adminBtnHTML = '';
                        let addBtnHTML = '';
                        let removeUserBtnHTML = '';
                        if (user.isMember && user.isAdmin) {
                            addBtnHTML = `<span style="color:green;font-weight:bold">Admin</span>`;
                            removeUserBtnHTML = `<button class="remove-btn" data-id="${user.id}">Remove</button>`
                        } else if (user.isMember && !user.isAdmin) {
                            adminBtnHTML = `<button class="admin-btn" data-id="${user.id}">Make Admin</button>`;
                            removeUserBtnHTML = `<button class="remove-btn" data-id="${user.id}">Remove</button>`
                        }

                        if (!user.isMember) {
                            addBtnHTML = `<button class="add-btn" data-id="${user.id}">Add</button>`;
                        } else {
                            removeUserBtnHTML = `<button class="remove-btn" data-id="${user.id}">Remove</button>`

                        }

                        li.innerHTML = `<span>${user.name} (${user.email})</span> ${addBtnHTML} ${adminBtnHTML} ${removeUserBtnHTML}`
                        settingsUserList.appendChild(li);
                    }
                });


                document.querySelectorAll('.remove-btn').forEach(rmbtn => {
                    rmbtn.addEventListener('click', async () => {
                        const userId = rmbtn.getAttribute('data-id');

                        try {
                            const result = await axios.delete(`http://localhost:5000/removeuser`, {
                                params: {
                                    groupId: currentGroup.id,
                                    userId
                                },
                                headers: {
                                    token
                                }
                            });
                            const li = rmbtn.parentElement;
                            const nameEmail = li.querySelector('span').innerText; // e.g. "User A (a@example.com)"
                            li.innerHTML = `
        <span>${nameEmail}</span>
        <button class="add-btn" data-id="${userId}">Add</button>
      `;

                            const newAddBtn = li.querySelector('.add-btn');
                            newAddBtn.addEventListener('click', async () => {
                                await axios.post(`http://localhost:5000/addUser`, {
                                    groupId: currentGroup.id,
                                    userId
                                }, {
                                    headers: {
                                        token
                                    }
                                });
                                newAddBtn.innerText = 'Added';
                                newAddBtn.disabled = true;
                            });

                        } catch (err) {
                            console.error('Error removing user', err);
                        }
                    });
                });


                document.querySelectorAll('.add-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const userId = btn.getAttribute('data-id');
                        await axios.post(`http://localhost:5000/addUser`, {
                            groupId: currentGroup.id,
                            userId
                        }, {
                            headers: {
                                token
                            }
                        });
                        btn.innerText = 'Added';
                        btn.disabled = true;
                    });
                });


                document.querySelectorAll('.admin-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {

                        const userId = btn.getAttribute('data-id');
                        await axios.post(`http://localhost:5000/makeAdmin`, {
                            groupId: currentGroup.id,
                            userId
                        }, {
                            headers: {
                                token
                            }
                        });
                        btn.innerText = 'Admin';
                        btn.disabled = true;
                    });
                });

            } else {
                const li = document.createElement('li');
                li.innerHTML = `YOU ARE NOT ADMIN`
                settingsUserList.appendChild(li);
            }

            closeSettings.addEventListener('click', (e) => {
                e.preventDefault();
                settingsModal.classList.add('hidden');
            })

            settingsDoneBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closeSettings.click();
            })
        } catch (err) {
            console.log(err);
        }
    })


    async function getCurrentUser() {
        try {
            const response = await axios.get('http://localhost:5000/user/getUserData', {
                headers: {
                    'token': token
                }
            });
            currentUser = response.data.res;
        } catch (err) {
            console.log(err);
        }
    }
    getCurrentUser();

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '../login/login.html';

    });

    function scrollToBottom() {
        chatblock.scrollTop = chatblock.scrollHeight;
    }

   
    async function loadGroups() {
        try {
            let isGroupExists = false;
            const res = await axios.get('http://localhost:5000/getGroups', {
                headers: {
                    token
                }
            });              
            grouplist.innerHTML='';
           
            res.data.groups.forEach((grp) => {     
                 if(currentGroup){
                    if(grp.id===currentGroup.id){
                       isGroupExists=true;
                    }
               }
                displayGroup(grp);
            })                    
            if(currentGroup&&!isGroupExists){
            window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    }
    loadGroups();
    function displayGroup(group) {
        const groupli = document.createElement('li');
        groupli.innerHTML = `<button class="group-button" data-group-id="${group.id}" data-admin-id="${group.adminId}">${group.groupName}</button>`
        grouplist.appendChild(groupli);
        const {
            groupName,
            id
        } = group;
        const groupId = id;
        readmessages = JSON.parse(localStorage.getItem('localmessages')) || {};
        if (!localStorage.getItem('localmessages')) {
            readmessages[groupId] = [];
            console.log('undef');
            localStorage.setItem('localmessages', JSON.stringify(readmessages));
        } else if (readmessages[groupId] === undefined) {
            readmessages[groupId] = [];
            console.log(readmessages[groupId]);

            localStorage.setItem('localmessages', JSON.stringify(readmessages));
        }
        const groupBtn = groupli.querySelector('.group-button');


        groupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatlist.innerHTML = '';

            // console.log(e.target.getAttribute('data-group-id'));
            // console.log(e.target.getAttribute('data-admin-id'));
            groupHeading.innerHTML = `${groupName}`;

            loadOlderBtn.hidden = false;
            settingsBtn.hidden = false;
            implementChatSection(group);
        })

    }

    // Show modal
    createGroupBtn.addEventListener('click', async () => {
        groupModal.classList.remove('hidden');
        selectedUserIds = [];

        try {
            const res = await axios.get(`http://localhost:5000/user/getAllUsers`, {
                headers: {
                    token
                }
            });
            allUsersList.innerHTML = '';
            res.data.res.forEach(user => {
                if (currentUser.id != user.id) {
                    const li = document.createElement('li');
                    li.innerHTML = `
        <span>${user.name}</span>
        <span>${user.email}</span>
        <button class="add-user-btn" data-id="${user.id}">Add</button>
      `;
                    allUsersList.appendChild(li);
                }
            });

            document.querySelectorAll('.add-user-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const userId = e.target.getAttribute('data-id');
                    if (!selectedUserIds.includes(userId)) {
                        selectedUserIds.push(userId);
                        e.target.innerText = 'Added';
                        e.target.disabled = true;
                    }
                });
            });
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        groupModal.classList.add('hidden');
        groupNameInput.value = '';
        allUsersList.innerHTML = '';
    });

    // Final group creation
    createGroupFinal.addEventListener('click', async () => {
        const groupName = groupNameInput.value.trim();
        if (!groupName || selectedUserIds.length === 0) {
            alert("Enter group name and select users.");
            return;
        }

        try {


            const res = await axios.post('http://localhost:5000/createGroup', {
                groupName,
                members: selectedUserIds
            }, {
                headers: {
                    token
                }
            });
            let group = res.data.group;
            displayGroup(group);
            alert('Group created!');
            window.location.reload();
        } catch (err) {
            console.error('Error creating group:', err);
            alert('Failed to create group');
        }
    });


    async function implementChatSection(group) {
        try {
            currentGroup = group;
            loadChats(group);

        } catch (err) {
            console.log(err);

        }
    }

    async function loadChats(group) {
        let groupId = group.id;
        try {
            let res;
            if (localStorage.getItem('localmessages')) {
                readmessages = JSON.parse(localStorage.getItem('localmessages')) || {};
                readmessages[groupId] = readmessages[groupId].filter((chat) => {
                    return chat.groupId == groupId
                });
            }

            if (!sendBtnClick) {
                res = await axios.post(`http://localhost:5000/chat/getMessages/${undefined}`, {
                        groupId
                    }, {
                        headers: {
                            'token': token
                        }
                    },

                );
            } else if (readmessages != null && readmessages[groupId].length != 0) {
                sendBtnClick = false;
                const lastChat = readmessages[groupId][readmessages[groupId].length - 1];
                const lastChatId = lastChat.id;
                res = await axios.post(`http://localhost:5000/chat/getMessages/${lastChatId}`, {
                    groupId,
                }, {
                    headers: {
                        'token': token
                    }
                })
            } else {
                sendBtnClick = false;
                res = await axios.post(`http://localhost:5000/chat/getMessages/${undefined}`, {
                    groupId,
                }, {
                    headers: {
                        'token': token
                    }
                })
            }
            const arr = res.data.chats;

            if (readmessages[groupId].length != 0) {
                arr.forEach((chat) => {
                    if (!readmessages[groupId].some(mi => mi.id == chat.id)) {
                        if (readmessages[groupId].length > 100) {
                            readmessages[groupId].shift();
                        }
                        readmessages[groupId].push(chat);
                    }
                })
                localStorage.setItem('localmessages', JSON.stringify(readmessages));

            } else {
                readmessages[groupId] = arr;
                localStorage.setItem('localmessages', JSON.stringify(readmessages));
            }
            chatlist.innerHTML = '';
            readmessages[groupId].forEach((i) => {
                if (i.groupId == groupId)
                    displayChat(i);
            })
        } catch (err) {
            console.log(err.message);
        }
    };

    loadOlderBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            let groupId = currentGroup.id;
            console.log(groupId);
            if (localStorage.getItem('localmessages')) {
                readmessages = JSON.parse(localStorage.getItem('localmessages')) || {};
            }
            if (readmessages[groupId].length != 0) {
                let localOldestarr = readmessages[groupId].filter((chat) => {
                    return chat.groupId == groupId
                });
                let localOldest = localOldestarr[0];
                console.log(localOldest);
                res = await axios.post(`http://localhost:5000/chat/getMessages/${localOldest.id}`, {
                    groupId,
                }, {
                    headers: {
                        'token': token
                    }
                });
                const arr = res.data.chats;
                arr.pop();
                readmessages[groupId] = arr.concat(readmessages[groupId]);
                localStorage.setItem('localmessages', JSON.stringify(readmessages));
                console.log(arr);
            }
        } catch (err) {
            console.log(err);
        }

    });
    setInterval(() => {
        loadChats(currentGroup);
        loadGroups();
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
            const groupId = currentGroup.id;
            sendBtnClick = true;
            const message = messageInput.value;
            messageInput.value='';
            const response = await axios.post('http://localhost:5000/chat/send', {
                message,
                groupId
            }, {
                headers: {
                    'token': token
                }
            });
            const data = {
                id: response.data.chat.id,
                message,
                userName: response.data.chat.userName,
                groupId: response.data.chat.groupId
            };
            localmessages = {};
            if (localStorage.getItem('localmessages') != null) {
                localmessages = JSON.parse(localStorage.getItem('localmessages'));
                if (localmessages[groupId].length > 100) {
                    localmessages[groupId].shift();
                }
            }
            localmessages[groupId].push(data);
            displayChat(data)
            localStorage.setItem('localmessages', JSON.stringify(localmessages));
            scrollToBottom();
        } catch (err) {
            console.log(err);
        }

    })

})