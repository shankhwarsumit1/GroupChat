"use strict";

window.addEventListener('DOMContentLoaded', function () {
  var messageInput = document.getElementById('message');
  var sendMessageBtn = document.getElementById('send-btn');
  var token = localStorage.getItem('token');
  var chatlist = document.getElementById('chatlist');
  var chatblock = document.getElementById("chatblock");
  var loadOlderBtn = document.getElementById("load-older-btn");
  var logoutBtn = document.getElementById("logout-btn");
  var grouplist = document.getElementById("group-list");
  var createGroupBtn = document.getElementById('create-group-btn');
  var groupModal = document.getElementById('group-modal');
  var closeModal = document.getElementById('close-modal');
  var allUsersList = document.getElementById('all-users-list');
  var groupNameInput = document.getElementById('group-name-input');
  var createGroupFinal = document.getElementById('create-group-final');
  var groupHeading = document.getElementById('group-heading');
  var currentUser;
  var selectedUserIds = [];
  var localmessages = [];
  var readmessages = {};
  var sendBtnClick = false;
  var currentGroup;

  if (!token || token === null) {
    window.location.href = '../login/login.html';
  }

  ;

  function getCurrentUser() {
    var response;
    return regeneratorRuntime.async(function getCurrentUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(axios.get('http://localhost:5000/user/getUserData', {
              headers: {
                'token': token
              }
            }));

          case 3:
            response = _context.sent;
            currentUser = response.data.res;
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }

  getCurrentUser();
  logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '../login/login.html';
  });

  function scrollToBottom() {
    chatblock.scrollTop = chatblock.scrollHeight;
  }

  function loadGroups() {
    var _res;

    return regeneratorRuntime.async(function loadGroups$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(axios.get('http://localhost:5000/getGroups', {
              headers: {
                token: token
              }
            }));

          case 3:
            _res = _context2.sent;

            _res.data.groups.forEach(function (grp) {
              displayGroup(grp);
            });

            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            console.log(_context2.t0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }

  loadGroups(); // Show modal

  createGroupBtn.addEventListener('click', function _callee() {
    var _res2;

    return regeneratorRuntime.async(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            groupModal.classList.remove('hidden');
            selectedUserIds = [];
            _context3.prev = 2;
            _context3.next = 5;
            return regeneratorRuntime.awrap(axios.get('http://localhost:5000/user/getAllUsers', {
              headers: {
                token: token
              }
            }));

          case 5:
            _res2 = _context3.sent;
            allUsersList.innerHTML = '';

            _res2.data.res.forEach(function (user) {
              if (currentUser.id != user.id) {
                var li = document.createElement('li');
                li.innerHTML = "\n        <span>".concat(user.name, "</span>\n        <span>").concat(user.email, "</span>\n        <button class=\"add-user-btn\" data-id=\"").concat(user.id, "\">Add</button>\n      ");
                allUsersList.appendChild(li);
              }
            });

            document.querySelectorAll('.add-user-btn').forEach(function (btn) {
              btn.addEventListener('click', function (e) {
                var userId = e.target.getAttribute('data-id');

                if (!selectedUserIds.includes(userId)) {
                  selectedUserIds.push(userId);
                  e.target.innerText = 'Added';
                  e.target.disabled = true;
                }
              });
            });
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3["catch"](2);
            console.error('Failed to fetch users', _context3.t0);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[2, 11]]);
  }); // Close modal

  closeModal.addEventListener('click', function () {
    groupModal.classList.add('hidden');
    groupNameInput.value = '';
    allUsersList.innerHTML = '';
  }); // Final group creation

  createGroupFinal.addEventListener('click', function _callee2() {
    var groupName, _res3, group;

    return regeneratorRuntime.async(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            groupName = groupNameInput.value.trim();

            if (!(!groupName || selectedUserIds.length === 0)) {
              _context4.next = 4;
              break;
            }

            alert("Enter group name and select users.");
            return _context4.abrupt("return");

          case 4:
            _context4.prev = 4;
            _context4.next = 7;
            return regeneratorRuntime.awrap(axios.post('http://localhost:5000/createGroup', {
              groupName: groupName,
              members: selectedUserIds
            }, {
              headers: {
                token: token
              }
            }));

          case 7:
            _res3 = _context4.sent;
            group = _res3.data.group;
            displayGroup(group);
            alert('Group created!');
            window.location.reload();
            _context4.next = 18;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](4);
            console.error('Error creating group:', _context4.t0);
            alert('Failed to create group');

          case 18:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[4, 14]]);
  });

  function displayGroup(group) {
    var groupli = document.createElement('li');
    groupli.innerHTML = "<button class=\"group-button\" data-group-id=\"".concat(group.id, "\" data-admin-id=\"").concat(group.adminId, "\">").concat(group.groupName, "</button>");
    grouplist.appendChild(groupli);
    var groupName = group.groupName,
        id = group.id;
    var groupId = id;
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

    var groupBtn = groupli.querySelector('.group-button');
    groupBtn.addEventListener('click', function (e) {
      e.preventDefault();
      chatlist.innerHTML = ''; // console.log(e.target.getAttribute('data-group-id'));
      // console.log(e.target.getAttribute('data-admin-id'));

      groupHeading.innerHTML = "".concat(groupName);
      loadOlderBtn.hidden = false;
      implementChatSection(group);
    });
  }

  function implementChatSection(group) {
    return regeneratorRuntime.async(function implementChatSection$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            try {
              currentGroup = group;
              loadChats(group);
            } catch (err) {
              console.log(err);
            }

          case 1:
          case "end":
            return _context5.stop();
        }
      }
    });
  }

  function loadChats(group) {
    var groupId, _res4, lastChat, lastChatId, arr;

    return regeneratorRuntime.async(function loadChats$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            groupId = group.id;
            _context6.prev = 1;

            if (localStorage.getItem('localmessages')) {
              readmessages = JSON.parse(localStorage.getItem('localmessages')) || {};
              readmessages[groupId] = readmessages[groupId].filter(function (chat) {
                return chat.groupId == groupId;
              });
            }

            if (sendBtnClick) {
              _context6.next = 9;
              break;
            }

            _context6.next = 6;
            return regeneratorRuntime.awrap(axios.post("http://localhost:5000/chat/getMessages/".concat(undefined), {
              groupId: groupId
            }, {
              headers: {
                'token': token
              }
            }));

          case 6:
            _res4 = _context6.sent;
            _context6.next = 22;
            break;

          case 9:
            if (!(readmessages != null && readmessages[groupId].length != 0)) {
              _context6.next = 18;
              break;
            }

            sendBtnClick = false;
            lastChat = readmessages[groupId][readmessages[groupId].length - 1];
            lastChatId = lastChat.id;
            _context6.next = 15;
            return regeneratorRuntime.awrap(axios.post("http://localhost:5000/chat/getMessages/".concat(lastChatId), {
              groupId: groupId
            }, {
              headers: {
                'token': token
              }
            }));

          case 15:
            _res4 = _context6.sent;
            _context6.next = 22;
            break;

          case 18:
            sendBtnClick = false;
            _context6.next = 21;
            return regeneratorRuntime.awrap(axios.post("http://localhost:5000/chat/getMessages/".concat(undefined), {
              groupId: groupId
            }, {
              headers: {
                'token': token
              }
            }));

          case 21:
            _res4 = _context6.sent;

          case 22:
            arr = _res4.data.chats;

            if (readmessages[groupId].length != 0) {
              arr.forEach(function (chat) {
                if (!readmessages[groupId].some(function (mi) {
                  return mi.id == chat.id;
                })) {
                  if (readmessages[groupId].length > 100) {
                    readmessages[groupId].shift();
                  }

                  readmessages[groupId].push(chat);
                }
              });
              localStorage.setItem('localmessages', JSON.stringify(readmessages));
            } else {
              readmessages[groupId] = arr;
              localStorage.setItem('localmessages', JSON.stringify(readmessages));
            }

            chatlist.innerHTML = '';
            readmessages[groupId].forEach(function (i) {
              if (i.groupId == groupId) displayChat(i);
            });
            _context6.next = 31;
            break;

          case 28:
            _context6.prev = 28;
            _context6.t0 = _context6["catch"](1);
            console.log(_context6.t0.message);

          case 31:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[1, 28]]);
  }

  ;
  loadOlderBtn.addEventListener('click', function _callee3(e) {
    var groupId, localOldestarr, localOldest, arr;
    return regeneratorRuntime.async(function _callee3$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            e.preventDefault();
            _context7.prev = 1;
            groupId = currentGroup.id;
            console.log(groupId);

            if (localStorage.getItem('localmessages')) {
              readmessages = JSON.parse(localStorage.getItem('localmessages')) || {};
            }

            if (!(readmessages[groupId].length != 0)) {
              _context7.next = 17;
              break;
            }

            localOldestarr = readmessages[groupId].filter(function (chat) {
              return chat.groupId == groupId;
            });
            localOldest = localOldestarr[0];
            console.log(localOldest);
            _context7.next = 11;
            return regeneratorRuntime.awrap(axios.post("http://localhost:5000/chat/getMessages/".concat(localOldest.id), {
              groupId: groupId
            }, {
              headers: {
                'token': token
              }
            }));

          case 11:
            res = _context7.sent;
            arr = res.data.chats;
            arr.pop();
            readmessages[groupId] = arr.concat(readmessages[groupId]);
            localStorage.setItem('localmessages', JSON.stringify(readmessages));
            console.log(arr);

          case 17:
            _context7.next = 22;
            break;

          case 19:
            _context7.prev = 19;
            _context7.t0 = _context7["catch"](1);
            console.log(_context7.t0);

          case 22:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[1, 19]]);
  });
  setInterval(function () {
    loadChats(currentGroup);
  }, 1000);

  function displayChat(chat) {
    var chatElement = document.createElement('li');
    chatElement.className = 'chat-element';
    chatElement.innerHTML = "<span class=\"user\">".concat(chat.userName, ":</span><span class=\"chat\">").concat(chat.message, "</span>");
    chatlist.appendChild(chatElement);
  }

  sendMessageBtn.addEventListener('click', function _callee4(e) {
    var groupId, message, response, data;
    return regeneratorRuntime.async(function _callee4$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            e.preventDefault();
            _context8.prev = 1;
            groupId = currentGroup.id;
            sendBtnClick = true;
            message = messageInput.value;
            _context8.next = 7;
            return regeneratorRuntime.awrap(axios.post('http://localhost:5000/chat/send', {
              message: message,
              groupId: groupId
            }, {
              headers: {
                'token': token
              }
            }));

          case 7:
            response = _context8.sent;
            data = {
              id: response.data.chat.id,
              message: message,
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
            displayChat(data);
            localStorage.setItem('localmessages', JSON.stringify(localmessages));
            scrollToBottom();
            _context8.next = 20;
            break;

          case 17:
            _context8.prev = 17;
            _context8.t0 = _context8["catch"](1);
            console.log(_context8.t0);

          case 20:
          case "end":
            return _context8.stop();
        }
      }
    }, null, null, [[1, 17]]);
  });
});