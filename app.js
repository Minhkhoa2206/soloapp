firebase.initializeApp({

    apiKey:
    "YOUR_API_KEY",

    authDomain:
    "YOUR_DOMAIN",

    databaseURL:
    "YOUR_DATABASE_URL",

    projectId:
    "YOUR_PROJECT_ID",

    storageBucket:
    "YOUR_STORAGE_BUCKET",

    messagingSenderId:
    "YOUR_SENDER_ID",

    appId:
    "YOUR_APP_ID"

});

const db =
firebase.database();

const storage =
firebase.storage();



const loginPage =
document.getElementById("loginPage");

const loginBtn =
document.getElementById("loginBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const sendBtn =
document.getElementById("sendBtn");

const nameInput =
document.getElementById("nameInput");

const userBox =
document.getElementById("userBox");

const messages =
document.getElementById("messages");

const messageInput =
document.getElementById("messageInput");

const groupSelect =
document.getElementById("groupSelect");

const groupTitle =
document.getElementById("groupTitle");

const imageInput =
document.getElementById("imageInput");



let username =
localStorage.getItem("mk_username");

let room =
localStorage.getItem("mk_room")
|| "NoiBo";



let userId =
localStorage.getItem("mk_user_id");

if(!userId){

    userId =
    Math.random()
    .toString(36)
    .slice(2);

    localStorage.setItem(
        "mk_user_id",
        userId
    );
}



/* INIT */

groupSelect.value = room;

groupTitle.innerHTML =
"● " +
groupSelect.options[
groupSelect.selectedIndex
].text;

if(username){

    loginPage.style.display =
    "none";

    userBox.innerText =
    username;
}



/* LOGIN */

loginBtn.addEventListener(

    "click",

    ()=>{

        const name =
        nameInput.value.trim();

        if(!name){

            alert("Nhập tên 😭");

            return;
        }

        username = name;

        localStorage.setItem(
            "mk_username",
            username
        );

        userBox.innerText =
        username;

        loginPage.style.display =
        "none";
    }

);



/* LOGOUT */

logoutBtn.addEventListener(

    "click",

    ()=>{

        localStorage.removeItem(
            "mk_username"
        );

        localStorage.removeItem(
            "mk_user_id"
        );

        location.reload();
    }

);



/* GROUP */

groupSelect.addEventListener(

    "change",

    ()=>{

        localStorage.setItem(
            "mk_room",
            groupSelect.value
        );

        location.reload();
    }

);



/* SEND */

function sendMessage(){

    if(!username){

        alert("Đăng nhập 😭");

        return;
    }

    const text =
    messageInput.value.trim();

    if(!text) return;

    db.ref(
        "rooms/" + room
    ).push({

        name:username,

        text:text,

        user:userId,

        time:Date.now()
    });

    messageInput.value = "";
}

sendBtn.addEventListener(
    "click",
    sendMessage
);

messageInput.addEventListener(

    "keydown",

    (e)=>{

        if(e.key === "Enter"){

            sendMessage();
        }

    }

);



/* IMAGE */

imageInput.addEventListener(

    "change",

    async ()=>{

        const file =
        imageInput.files[0];

        if(!file) return;

        const fileName =
        Date.now() +
        "_" +
        file.name;

        const storageRef =
        storage.ref(
            "chat_images/" +
            fileName
        );

        await storageRef.put(file);

        const imageUrl =
        await storageRef.getDownloadURL();

        db.ref(
            "rooms/" + room
        ).push({

            name:username,

            image:imageUrl,

            user:userId,

            time:Date.now()
        });

    }

);



/* RECEIVE */

db.ref(
    "rooms/" + room
).on(

    "child_added",

    (snapshot)=>{

        const data =
        snapshot.val();

        const row =
        document.createElement("div");

        row.className =
        "row " +
        (
            data.user === userId
            ? "me"
            : ""
        );

        const date =
        new Date(data.time);

        row.innerHTML = `

            <div class="msg">

                <div class="name">
                    ${safe(data.name)}
                </div>

                ${
                    data.text
                    ?
                    `
                    <div class="text">
                        ${safe(data.text)}
                    </div>
                    `
                    :
                    ""
                }

                ${
                    data.image
                    ?
                    `
                    <img
                        src="${data.image}"
                        class="chat-image"
                    >
                    `
                    :
                    ""
                }

                <div class="time">

                    ${date.getHours()}:
                    ${String(
                        date.getMinutes()
                    ).padStart(2,'0')}

                </div>

            </div>

        `;

        messages.appendChild(row);

        messages.scrollTop =
        messages.scrollHeight;
    }

);



function safe(text){

    return text

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;");
}
