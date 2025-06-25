window.addEventListener('DOMContentLoaded', async () => {
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
    const onlineUsersList = document.getElementById('online-users-list');
    let currentUser;
    let selectedUserIds = [];
    let readmessages = {};
    let currentGroup;
    let oldmessages = {};
    let olderBtnClick = false;
    let onlineUsers = [];
    let joining = false;
    if (!token || token === null) {
        window.location.href = '/login/login.html';
    };
    async function getCurrentUser() {
        try {
            const response = await axios.get(`${BASE_URL}/user/getUserData`, {
                headers: {
                    'token': token
                }
            });
            currentUser = response.data.res;
            return currentUser;
        } catch (err) {
            console.log(err);
        }
    }
    currentUser = await getCurrentUser();

    const socket = io(`${BASE_URL}`, {
        query: {
            userId: parseInt(currentUser.id),
        },
    });

    socket.on("connect", () => {
        console.log("Connected to server", socket.id);
        loadGroups();
    });

    socket.on("getonline", (users) => {
        setOnline(users);
        onlineUsers.push(users);
    })

    socket.on("group-created-for-you", (group) => {
        
        if (group.members.includes(`${currentUser.id}`)) {
            loadGroups();
        }
    });


    socket.on("receive-message", (data) => {
        const groupId = data.groupId;
        if (!readmessages[groupId]) {
            readmessages[groupId] = [];
        }

        if (readmessages[groupId].length > 100) {
            readmessages[groupId].shift();
        }

        readmessages[groupId].push(data);
        localStorage.setItem(`localmessages`, JSON.stringify(readmessages));

        if (currentGroup && groupId === currentGroup.id) {
            displayChat(data);
            scrollToBottom();
        }
    });

    socket.on("removed-from-group", ({
        groupId
    }) => {
        if (currentGroup && currentGroup.id === groupId) {
            alert("You have been removed from this group");
        }
        loadGroups();
    });

    socket.on("user-joined", ({
        message,
        newGroupId
    }) => {
        joinMessage(message, newGroupId);
    })


    socket.on("left-chat", ({
        message,
        groupId
    }) => {
        joinMessage(message, groupId);
    })

    function joinGroupRoom(newGroupId) {
        const currentRoom = `group-${currentGroup.id}`
        if (currentGroup && currentGroup.id !== newGroupId) {
            console.log('leaving', currentRoom);
            socket.emit(`leave-group`, ({
                currentGroup,
                currentUser
            }));
        }
        socket.emit("join-group", ({
            newGroupId,
            currentUser
        }));
    }


    socket.on("added-to-group", ({
        groupId
    }) => {
        loadGroups();
    })

    socket.on("made-admin", ({
        groupId
    }) => {
        if (currentGroup && currentGroup.id === groupId) {
            alert("you are now an admin of this group");
        }
    });

    settingsBtn.addEventListener('click', async () => {
        settingsModal.classList.remove('hidden');
        settingsUserList.innerHTML = '';
        try {
            const isAdminResponse = await axios.get(`${BASE_URL}/isUserAmin?userId=${currentUser.id}&groupId=${currentGroup.id}`, {
                headers: {
                    token
                }
            });
            if (isAdminResponse.data.isUserAdmin) {

                const groupId = currentGroup.id;
                const res = await axios.get(`${BASE_URL}/user/getAllUsers/${groupId}`, {
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
                            adminBtnHTML = `<span style="color:green;font-weight:bold">Admin</span>`;
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
                            const result = await axios.delete(`${BASE_URL}/removeuser`, {
                                params: {
                                    groupId: currentGroup.id,
                                    userId
                                },
                                headers: {
                                    token
                                }
                            });
                            socket.emit("user-removed-from-group", {
                                groupId: currentGroup.id,
                                userId
                            });
                            const li = rmbtn.parentElement;
                            const nameEmail = li.querySelector('span').innerText;
                            li.innerHTML = `<span>${nameEmail}</span><button class="add-btn" data-id="${userId}">Add</button>`;

                            const newAddBtn = li.querySelector('.add-btn');
                            newAddBtn.addEventListener('click', async () => {
                                await axios.post(`${BASE_URL}/addUser`, {
                                    groupId: currentGroup.id,
                                    userId
                                }, {
                                    headers: {
                                        token
                                    }
                                });
                                socket.emit("user-added-to-group", {
                                    groupId: currentGroup.id,
                                    userId
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
                        await axios.post(`${BASE_URL}/addUser`, {
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
                        await axios.post(`${BASE_URL}/makeAdmin`, {
                            groupId: currentGroup.id,
                            userId
                        }, {
                            headers: {
                                token
                            }
                        });

                        socket.emit("user-made-admin", {
                            groupId: currentGroup.id,
                            userId
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




    async function setOnline(users) {
        try {
            const res = await axios.get(`${BASE_URL}/user/getAllUsers`, {
                headers: {
                    token
                }
            });
            const usersParse = users.map(user => parseInt(user));
            onlineUsersList.innerHTML = "";
            res.data.res.forEach((user) => {
                if (usersParse.includes(user.id)) {
                    const li = document.createElement('li');
                    li.innerHTML = `<span id="green-dot"></span> ${user.name}`;
                    onlineUsersList.appendChild(li);
                }
            });

        } catch (err) {
            console.log(err);
        }
    }


    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/login/login.html';

    });

    function scrollToBottom() {
        chatblock.scrollTop = chatblock.scrollHeight;
    }


    async function loadGroups() {
        try {

            let isGroupExists = false;
            const res = await axios.get(`${BASE_URL}/getGroups`, {
                headers: {
                    token
                }
            });
            grouplist.innerHTML = '';
            res.data.groups.forEach((grp) => {
                if (currentGroup) {
                    if (grp.id === currentGroup.id) {
                        isGroupExists = true;
                    }
                }
                displayGroup(grp);
            });

            if (currentGroup && !isGroupExists) {
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
        if (!readmessages[groupId]) {
            readmessages[groupId] = [];
            localStorage.setItem('localmessages', JSON.stringify(readmessages));
        } else if (readmessages[groupId] === undefined) {
            readmessages[groupId] = [];
            localStorage.setItem('localmessages', JSON.stringify(readmessages));
        }
        const groupBtn = groupli.querySelector('.group-button');

        groupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentGroup && currentGroup.id === group.id) {
                return;
            }
            olderBtnClick = false;
            chatlist.innerHTML = '';
            groupHeading.innerHTML = `${groupName}`;
            if (currentGroup) {
                joinGroupRoom(group.id);
                currentGroup = group;
            } else {
                currentGroup = group;
                joinGroupRoom(group.id);
            }
            loadOlderBtn.hidden = true;
            settingsBtn.hidden = false;
            implementChatSection(group);
        })

    }

    async function implementChatSection(group) {
        try {
            loadChats(group.id);
            messageInput.hidden = false;
            sendMessageBtn.hidden = false;
        } catch (err) {
            console.log(err);

        }
    }


    // Show modal
    createGroupBtn.addEventListener('click', async () => {
        groupModal.classList.remove('hidden');
        selectedUserIds = [];

        try {
            const res = await axios.get(`${BASE_URL}/user/getAllUsers`, {
                headers: {
                    token
                }
            });
            allUsersList.innerHTML = '';
            res.data.res.forEach(user => {
                if (currentUser.id != user.id) {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${user.name}</span> <span>${user.email}</span> <button class="add-user-btn" data-id="${user.id}">Add</button>`;
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


            const res = await axios.post(`${BASE_URL}/createGroup`, {
                groupName,
                members: selectedUserIds
            }, {
                headers: {
                    token
                }
            });
            let group = res.data.group;

            socket.emit("new-group-created", {
                groupId: group.id,
                groupName: group.groupName,
                members: selectedUserIds,
            })
            alert('Group created!');
            displayGroup(group);
            window.location.reload();
        } catch (err) {
            console.error('Error creating group:', err);
            alert('Failed to create group');
        }
    });

    async function loadChats(Id) {
        let groupId = Id;
        try {
            let res;
            if (localStorage.getItem('localmessages')) {
                readmessages = JSON.parse(localStorage.getItem('localmessages')) || {};
            }

            res = await axios.post(`${BASE_URL}/chat/getMessages/${undefined}`, {
                groupId,
            }, {
                headers: {
                    'token': token
                }
            });


            const arr = res.data.chats || [];

            if (readmessages[groupId].length != 0) {
                arr.forEach((chat) => {
                    if (!readmessages[groupId].some(mi => mi.id == chat.id)) {
                        if (readmessages[groupId].length > 100) {
                            readmessages[groupId].shift();
                        }
                        readmessages[groupId].push(chat);
                    }
                })
            } else {
                readmessages[groupId] = arr;
            }
            localStorage.setItem('localmessages', JSON.stringify(readmessages));
            chatlist.innerHTML = '';
            console.log(readmessages[groupId]);
            readmessages[groupId].forEach((i) => {
                displayChat(i);
            })

        } catch (err) {
            console.log(err.message);
        }
    };


    setInterval(() => {
        localStorage.setItem('oldmessages', JSON.stringify({}));
        scrollToBottom();
    }, 2 * 60 * 1000);





    chatblock.addEventListener('scroll', async () => {
        if (!olderBtnClick && chatblock.scrollTop <= 0 && currentGroup) {
            let localOldest = readmessages[currentGroup.id][0];
            res = await axios.post(`${BASE_URL}/chat/getMessages/${localOldest.id}`, {
                groupId: currentGroup.id,
            }, {
                headers: {
                    'token': token
                }
            });
            const arr = res.data.chats;
            if (arr[0].id < readmessages[currentGroup.id][0].id) {
                if (chatblock.scrollTop <= 0 && currentGroup) {
                    loadOlderBtn.hidden = false;
                } else {
                    loadOlderBtn.hidden = true;
                }
            }
        } else {
            const clientHeight = chatblock.clientHeight;
            const scrollHeight = chatblock.scrollHeight;
            const scrollTop = chatblock.scrollTop;
            if (clientHeight + scrollTop >= scrollHeight - 1) {
                olderBtnClick = false;
                loadOlderBtn.hidden = true;
            }
        }
    });




    loadOlderBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            let groupId = currentGroup.id;
            console.log(groupId);
            if (!olderBtnClick) {
                if (localStorage.getItem('localmessages')) {
                    readmessages = JSON.parse(localStorage.getItem('localmessages')) || {};
                    implement = readmessages;
                    oldmessages = readmessages;
                    localStorage.setItem('oldmessages', JSON.stringify(implement));
                }
            } else {
                oldmessages = JSON.parse(localStorage.getItem('oldmessages')) || {};
                implement = oldmessages;
            }
            olderBtnClick = true;
            if (implement[groupId].length != 0) {
                let localOldest = implement[groupId][0];
                console.log(localOldest);
                res = await axios.post(`${BASE_URL}/chat/getMessages/${localOldest.id}`, {
                    groupId,
                }, {
                    headers: {
                        'token': token
                    }
                });
                const arr = res.data.chats;
                if (arr.length < 100) {
                    loadOlderBtn.hidden = true;
                }
                arr.pop();
                implement[groupId] = arr.concat(implement[groupId]);
                localStorage.setItem('oldmessages', JSON.stringify(implement));
                chatlist.innerHTML = '';
                implement[groupId].forEach((i) => {
                    if (i.groupId == groupId)
                        displayChat(i);
                })

                chatblock.scrollTop = 0;

                console.log(arr);
            }
        } catch (err) {
            console.log(err);
        }

    });


    function displayChat(chat, last) {
        const chatElement = document.createElement('li');
        chatElement.className = 'chat-element';
        if (joining) {
            joining = false;
            chatElement.innerHTML = `<span class="chat">${chat.message}</span>`
        } else {
            chatElement.innerHTML = `<span class="user">${chat.userName}:</span><span class="chat">${chat.message}</span>`
        }

        chatlist.appendChild(chatElement);
    }


    async function joinMessage(message, newgroupId) {
        console.log(newgroupId);
        const groupId = newgroupId

        const data = {
            message,
            groupId: newgroupId
        };
        joining = true;
        displayChat(data);
        scrollToBottom();
    }

    async function sendMessageFunction() {
        try {
            const groupId = currentGroup.id;
            sendBtnClick = true;
            const message = messageInput.value;
            messageInput.value = '';
            const response = await axios.post(`${BASE_URL}/chat/send`, {
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

            socket.emit("send-group-message", data);

            if (localStorage.getItem('localmessages') != null) {
                readmessages = JSON.parse(localStorage.getItem('localmessages'));
                if (readmessages[groupId].length > 100) {
                    readmessages[groupId].shift();
                }
            }
            readmessages[groupId].push(data);
            localStorage.setItem('localmessages', JSON.stringify(readmessages));
            displayChat(data);
            scrollToBottom();
        } catch (err) {
            console.log(err);
        }

    }

    sendMessageBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        sendMessageFunction();
    })

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessageFunction();
        }
    });

})