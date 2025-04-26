// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBJrftwU-HT6UkeUkQVZekXccOQebi2Fd8",
    authDomain: "skillsswap-df801.firebaseapp.com",
    projectId: "skillsswap-df801",
    storageBucket: "skillsswap-df801.appspot.com",
    messagingSenderId: "638710357631",
    appId: "1:638710357631:web:2b0dc4a9b779eae47ae94a",
    measurementId: "G-1C3983Z2N1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Hardcoded current user (you need to replace it with real login later)
const currentUser = {
    uid: "CURRENT_USER_ID", // <-- replace with logged-in user id
    firstName: "John",
    lastName: "Doe"
};

// DOM Elements
const userList = document.getElementById('user-list');
const chatArea = document.getElementById('chat-area');

let currentChatId = null;
let currentOtherUserId = null;

// Load all users
function loadUsers() {
    db.collection('users').onSnapshot(snapshot => {
        userList.innerHTML = '';
        snapshot.forEach(doc => {
            const userData = doc.data();
            if (doc.id !== currentUser.uid) {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <div class="user-avatar">${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}</div>
                    <div class="user-info">
                        <div class="user-name">${userData.first_name} ${userData.last_name}</div>
                        <div class="user-status">${userData.bio || 'No bio'}</div>
                    </div>
                    <button class="connect-btn" data-userid="${doc.id}">Connect</button>
                `;
                userList.appendChild(userItem);
            }
        });

        document.querySelectorAll('.connect-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const otherUserId = e.target.getAttribute('data-userid');
                startChat(otherUserId);
            });
        });
    });
}

// Start or open chat
function startChat(otherUserId) {
    currentOtherUserId = otherUserId;
    db.collection('chats')
        .where('userIds', 'array-contains', currentUser.uid)
        .get()
        .then(snapshot => {
            let foundChat = null;

            snapshot.forEach(doc => {
                const chat = doc.data();
                if (chat.userIds.includes(otherUserId)) {
                    foundChat = doc;
                }
            });

            if (foundChat) {
                openChat(foundChat.id);
            } else {
                db.collection('chats').add({
                    userIds: [currentUser.uid, otherUserId],
                    messages: [],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(docRef => {
                    openChat(docRef.id);
                });
            }
        });
}

// Open chat UI
function openChat(chatId) {
    currentChatId = chatId;

    db.collection('users').doc(currentOtherUserId).get().then(doc => {
        const user = doc.data();

        chatArea.innerHTML = `
            <div class="chat-header">
                <div class="user-avatar">${user.first_name.charAt(0)}${user.last_name.charAt(0)}</div>
                <div class="user-info">
                    <div class="user-name">${user.first_name} ${user.last_name}</div>
                    <div class="user-status">Online</div>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input">
                <input type="text" id="message-input" placeholder="Type a message...">
                <button id="send-btn"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;

        document.getElementById('send-btn').addEventListener('click', sendMessage);
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        listenMessages();
    });
}

// Listen for messages
function listenMessages() {
    db.collection('chats').doc(currentChatId)
        .onSnapshot(doc => {
            if (doc.exists) {
                renderMessages(doc.data().messages || []);
            }
        });
}

// Render messages
function renderMessages(messages) {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';

    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`;
        msgDiv.innerHTML = `
            <div class="message-text">${msg.text}</div>
            <div class="message-time">${formatTime(msg.timestamp)}</div>
        `;
        messagesContainer.appendChild(msgDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send a message
function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();

    if (text && currentChatId) {
        const message = {
            text,
            senderId: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection('chats').doc(currentChatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(message)
        }).then(() => {
            input.value = '';
        });
    }
}

// Format time
function formatTime(timestamp) {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Init
loadUsers();

