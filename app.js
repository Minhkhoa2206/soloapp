/* =========================
NỘI BỘ CHAT v4.0
TEXT + IMAGE BASE64
KHÔNG CẦN STORAGE
========================= */



/* =========================
FIREBASE CONFIG
========================= */

firebase.initializeApp({

    apiKey:
    "AIzaSyBkRFn4i_tPSFKUMhC_xVWrL2u43gBPLqM",

    authDomain:
    "vercel-mk.firebaseapp.com",

    databaseURL:
    "https://vercel-mk-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
    "vercel-mk",

    storageBucket:
    "vercel-mk.firebasestorage.app",

    messagingSenderId:
    "1041836554984",

    appId:
    "1:1041836554984:web:da8011543b29b8f47ae75d"

});



/* =========================
DATABASE
========================= */

const db =
firebase.database();



/* =========================
ELEMENT
========================= */

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



/* =========================
DATA
========================= */

let username =
localStorage.getItem(
    "mk_username"
);

let room =
localStorage.getItem(
    "mk_room"
)
|| "NoiBo";



/* =========================
FIX USER ID RELOAD
========================= */

let userId =
localStorage.getItem(
    "mk_user_id"
);

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



/* =========================
INIT
========================= */

groupSelect.value =
room;

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



/* =========================
LOGIN
========================= */

loginBtn.addEventListener(

    "click",

    ()=>{

        const name =
        nameInput.value.trim();

        if(!name){

            alert(
                "Nhập tên 😭"
            );

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



/* =========================
LOGOUT
========================= */

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



/* =========================
CHANGE GROUP
========================= */

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



/* =========================
SEND TEXT
========================= */

function sendMessage(){

    if(!username){

        alert(
            "Đăng nhập 😭"
        );

        return;
    }

    const text =
    messageInput.value.trim();

    if(!text) return;



    db.ref(
        "rooms/" + room
    ).push({

        type:"text",

        name:username,

        text:text,

        user:userId,

        time:Date.now()
    });



    messageInput.value = "";
}



/* =========================
SEND BUTTON
========================= */

sendBtn.addEventListener(
    "click",
    sendMessage
);



/* =========================
ENTER SEND
========================= */

messageInput.addEventListener(

    "keydown",

    (e)=>{

        if(
            e.key === "Enter"
        ){

            sendMessage();
        }

    }

);



/* =========================
UPLOAD IMAGE BASE64
========================= */

imageInput.addEventListener(

    "change",

    ()=>{

        const file =
        imageInput.files[0];

        if(!file) return;



        if(!username){

            alert(
                "Đăng nhập 😭"
            );

            return;
        }



        /* LIMIT 300KB */

        if(
            file.size >
            1024 * 300
        ){

            alert(
                "Ảnh quá lớn 😭"
            );

            return;
        }



        const reader =
        new FileReader();



        reader.onload =

        function(e){

            const base64 =

                e.target.result;



            db.ref(
                "rooms/" + room
            ).push({

                type:"image",

                name:username,

                image:base64,

                user:userId,

                time:Date.now()
            });

        };



        reader.readAsDataURL(
            file
        );

    }

);



/* =========================
RECEIVE MESSAGE
========================= */

db.ref(
    "rooms/" + room
).on(

    "child_added",

    (snapshot)=>{

        const data =
        snapshot.val();



        const row =
        document.createElement(
            "div"
        );



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

                        onclick="
                            window.open(
                                '${data.image}',
                                '_blank'
                            )
                        "
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



        messages.appendChild(
            row
        );



        messages.scrollTop =

            messages.scrollHeight;
    }

);



/* =========================
SAFE HTML
========================= */

function safe(text){

    return String(text)

    .replace(/&/g,"&amp;")

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;")

    .replace(/"/g,"&quot;");
}



/* =========================
AUTO SCROLL
========================= */

function scrollBottom(){

    messages.scrollTop =

        messages.scrollHeight;
}



/* =========================
RUNNING
========================= */

console.log(

    "⚡ Nội Bộ Chat v4.0 Running"

);
