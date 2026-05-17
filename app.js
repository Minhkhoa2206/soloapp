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

const db =
firebase.database();



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

const imageInput =
document.getElementById("imageInput");

const imageViewer =
document.getElementById("imageViewer");

const viewerImage =
document.getElementById("viewerImage");



let username =
localStorage.getItem(
    "mk_username"
);



const room =
"WorkspaceGlobal";



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



/* INIT */

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

        type:"text",

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

    ()=>{

        const file =
        imageInput.files[0];

        if(!file) return;



        if(
            file.size >
            1024 * 300
        ){

            alert("Ảnh quá lớn 😭");

            return;
        }



        const reader =
        new FileReader();



        reader.onload =

        function(e){

            db.ref(
                "rooms/" + room
            ).push({

                type:"image",

                name:username,

                image:e.target.result,

                user:userId,

                time:Date.now()
            });

        };



        reader.readAsDataURL(
            file
        );

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

                        onclick="
                            openImageViewer(
                                '${data.image}'
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



        messages.appendChild(row);

        messages.scrollTop =
        messages.scrollHeight;
    }

);



/* IMAGE VIEWER */

window.openImageViewer =

function(src){

    viewerImage.src = src;

    imageViewer.style.display =
    "flex";
};



imageViewer.addEventListener(

    "click",

    ()=>{

        imageViewer.style.display =
        "none";
    }

);



function safe(text){

    return String(text)

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;");
}
