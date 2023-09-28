//喚醒登入頁面
const buttonSignin = document.querySelector(".frame-item-4");
const buttonSignout = document.querySelector(".frame-item-5");
const memberSignincontainer = document.querySelector(".member_signin-container")
const memberSignoncontainer = document.querySelector(".member_signon-container")
const goSignon = document.querySelector(".go_signon");
const returnSignin = document.querySelector(".return_signin");
const formX = document.querySelectorAll(".form_x");
const modal = document.querySelector(".modal");
const signoninfor = document.querySelector(".signoninfor");
const signininfor = document.querySelector(".signininfor");

buttonSignin.addEventListener('click', (event) => {
    console.log("點點點!")
    event.preventDefault();
    modal.style.display = "block";
    memberSignincontainer.style.display = "block";
});
goSignon.addEventListener('click', (event) => {
    event.preventDefault();
    memberSignincontainer.style.display = "none";
    memberSignoncontainer.style.display = "block";
    document.getElementById("signin_form").reset();
    signininfor.style.display = "none";
});
returnSignin.addEventListener('click', (event) => {
    event.preventDefault();
    memberSignincontainer.style.display = "block";
    memberSignoncontainer.style.display = "none";
    document.getElementById("signon_form").reset();
    signoninfor.style.display = "none";
    memberSignoncontainer.style.height = "332px";
});
formX.forEach(formX => {formX.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = "none";
    memberSignincontainer.style.display = "none";
    memberSignoncontainer.style.display = "none";
})});


//登入資料
const signonSubmit = document.querySelector("#signonSubmit");
const signinSubmit = document.querySelector("#signinSubmit");
//註冊
signonSubmit.addEventListener("click", handleSignonSubmit);
//登入
signinSubmit.addEventListener("click", handleSignonSubmit);
//登入及註冊資料確認後連接對應之傳送API
function handleSignonSubmit(event) {
    const signonInput = getSignonInput();
    const inputResults = isInputEmpty(signonInput);
    event.preventDefault();

    if (inputResults[0] && inputResults[1]) {
        alert("Please fills all infors");
        console.log(inputResults[0]);
        console.log(inputResults[1]);
        return;
    } 

    if (!inputResults[0]){
        signon(signonInput)
    }else{
        signin(signonInput)
    }
}
//取得註冊及登入資料
function getSignonInput() {
    const signonName = document.querySelector("input[name=signon_name]").value;
    const signonEmail = document.querySelector("input[name=signon_email]").value;
    const signonPassword = document.querySelector("input[name=signon_password]").value;
    const email = document.querySelector("input[name=email]").value;
    const password = document.querySelector("input[name=password]").value;
    const signonInput = [signonName,signonEmail,signonPassword,email,password];
    return signonInput
}
//檢查註冊及登入資料是否有缺失
function isInputEmpty(signonInput) {
    const firstThreeEmpty = signonInput.slice(0, 3).some(value => value === "");
    const lastTwoHasEmpty = signonInput.slice(3).some(value => value === "");
    return [firstThreeEmpty,lastTwoHasEmpty];
}
//送出表單到後端
function submitForm(endpoint, method, signonInput) {
    fetch(endpoint, {
        method: method,
        body: JSON.stringify({
            "signonName": signonInput[0],
            "signonEmail": signonInput[1],
            "signonPassword": signonInput[2],
            "email": signonInput[3],
            "password": signonInput[4],
        }),
        headers: {
            "Content-type": "application/json",
        }
    })
    .then(response => response.json())
    .then(displaySignonResponse);
}
//連接後端註冊API
function signon(signonInput) {
    submitForm("http://127.0.0.1:3000/api/user", "POST", signonInput);
}
//連接後端登入API
function signin(signonInput) {
    submitForm("http://127.0.0.1:3000/api/user/auth", "PUT", signonInput);
}
//後端註冊及登入回應處理
function displaySignonResponse(data) {
    const signoninfor = document.querySelector(".signoninfor");
    const signininfor = document.querySelector(".signininfor");
    const memberSignoncontainer = document.querySelector(".member_signon-container");
    const memberSignincontainer = document.querySelector(".member_signin-container");
    
    if (data.ok) {
        signonForsuccess(signoninfor, memberSignoncontainer, data);
    }  
    
    if (data.message === "Email已經註冊帳戶") {
        signonForfailure(signoninfor, memberSignoncontainer, data);
    }

    if (data.token) {
        signinForsuccess(signininfor, memberSignincontainer, data);
        saveToken(data.token);
        // submitToken();
    } 
    
    if (data.message === "電子郵件或密碼錯誤"){
        signinForfailure(signininfor, memberSignincontainer, data);
    }

    if (data.message === "databaseError") {
        signonForfailure(signoninfor, memberSignoncontainer, data);
        signinForfailure(signininfor, memberSignincontainer, data);
    }
}
//註冊成功文字顯示
function signonForsuccess(signoninfor, memberSignoncontainer, data) {
    signoninfor.innerHTML = "<div>註冊成功，請登入系統</div>";
    signoninfor.style.display = "flex";
    memberSignoncontainer.style.height = "354px";
    signoninfor.style.color = "#489";
    console.log(data);
}
//註冊失敗文字顯示
function signonForfailure(signoninfor, memberSignoncontainer, data) {
    signoninfor.innerHTML = `<div>${data.message}</div>`;
    signoninfor.style.display = "flex";
    memberSignoncontainer.style.height = "354px";
    signoninfor.style.color = "red";
    console.log(data.message);
}
//登入成功文字顯示
function signinForsuccess(signininfor, memberSignincontainer, data) {
    signininfor.innerHTML = "<div>登入成功</div>";
    signininfor.style.display = "flex";
    memberSignincontainer.style.height = "297px";
    signininfor.style.color = "#489";
    buttonSignin.style.display = "none";
    buttonSignout.style.display = "flex";
    location.reload(); 
    console.log(data);
}
//登入失敗文字顯示
function signinForfailure(signininfor, memberSignincontainer, data) {
    signininfor.innerHTML = `<div>${data.message}</div>`;
    signininfor.style.display = "flex";
    memberSignincontainer.style.height = "297px";
    signininfor.style.color = "red";
    console.log(data);
}
//登出_監聽事件
buttonSignout.addEventListener('click', logout);
//token儲存
function saveToken(token){
    localStorage.setItem('Token', token);
}
//使用者登入狀態確認
function init(){
    const token = localStorage.getItem('Token');
    console.log(token)
    if (token == null){
        return
    }
    fetch("http://127.0.0.1:3000/api/user/auth", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())
    .then(data => loginCheck(data, buttonSignin, buttonSignout));
}
//確認登入狀態後之事件處理
function loginCheck(data, buttonSignin, buttonSignout){
    if (data !== null) {
        buttonSignin.style.display = "none";
        buttonSignout.style.display = "flex";
        buttonSignout.addEventListener('click', logout);
    } else {
        buttonSignin.style.display = "flex";
        buttonSignout.style.display = "none";
        logout();
    }
}
//登出
function logout() {
    localStorage.removeItem('Token');
    location.reload(); 
}
//F5
window.addEventListener('load', init);

