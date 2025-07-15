 // 文字資料匯入
const attractionId = window.location.pathname.split("/").pop();
function getData(){
    fetch("/api/attraction/" + attractionId)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        let frameItems = document.querySelector(".frame");
        let inforsContaineritems = document.querySelector(".infors_container");
        let imageDiv = document.querySelector(".image_div");

        let nameData = data.data.name;
        let mrtData = data.data.mrt;
        let descriptionData = data.data.description;
        let addressData = data.data.address;
        let transportData = data.data.transport;
        let categoryData = data.data.category;
        let imageURL = data.data.images;

        let Name = frameItems.querySelector(".name");
        let Mrt = frameItems.querySelector(".mrt");
        let Category = frameItems.querySelector(".category");
        let Description = inforsContaineritems.querySelector(".introduction");
        let Address = inforsContaineritems.querySelector(".address");
        let Traffic = inforsContaineritems.querySelector(".traffic");

        // for (let i = 0;i < imageURL.length; i++){
        //     let newDiv = document.createElement("div")
        //     newDiv.classList.add("image");
        //     let img = document.createElement("img");
        //     img.src = imageURL[i];
        //     newDiv.appendChild(img);
        //     imageDiv.appendChild(newDiv);
        // }

        Name.textContent = nameData;
        Mrt.textContent = mrtData;
        Category.textContent = categoryData;
        Description.textContent = descriptionData;
        Address.textContent = addressData;
        Traffic.textContent = transportData;

    })  
}
getData()
   

 //輪播圖
function getData2() {
    let attractionId = window.location.pathname.split("/").pop();
    fetch("/api/attraction/" + attractionId)
        .then(function (response) {
            return response.json();
        })
        .then(function getData(data) {
            let buttonRight = document.getElementById("button-img-right");
            let buttonLeft = document.getElementById("button-img-left");
            let currentImageIndex = 0;
            let imageDiv = document.getElementById("image_div");
            let imageURL = data.data.images;
            let isAnimating = false;
            let potContainer = document.querySelector(".pot_container");
            let outer = document.querySelector(".img_container");


            for (let i = 0; i < imageURL.length; i++) {
                let newDiv = document.createElement("div");
                newDiv.classList.add("image");
                
                let pot = document.createElement("div");
                pot.classList.add("pot")
                
                let img = document.createElement("img");
                img.src = imageURL[i];
                newDiv.appendChild(img);
                imageDiv.appendChild(newDiv);

                potContainer.appendChild(pot)
            }

            let pot = document.querySelectorAll(".pot")
            let images = imageDiv.querySelectorAll('.image');
            let potpot = document.createElement("div");
            let potpotlength = 0
            potpot.classList.add("potpot")
            pot[potpotlength].appendChild(potpot)
            

            buttonRight.onclick = function () {


                if (currentImageIndex < images.length - 1) {
                    currentImageIndex++;
                    potpotlength++;
                    pot[potpotlength].appendChild(potpot);
                } else {
                    currentImageIndex = 0; // return first
                    potpotlength = 0;
                    pot[potpotlength].appendChild(potpot);

                }
                imageDiv.scrollLeft = images[currentImageIndex].offsetLeft;

            };

            buttonLeft.onclick = function () {

                if (currentImageIndex > 0) {
                    currentImageIndex--;
                    potpotlength--;
                    pot[potpotlength].appendChild(potpot);
                } else {
                    currentImageIndex = images.length - 1; // last pic
                    potpotlength = pot.length - 1;
                    pot[potpotlength].appendChild(potpot);
                }
                imageDiv.scrollLeft = images[currentImageIndex].offsetLeft;

            };
        })
}

getData2()

//切換$$
let getTimeandPrice = []

document.getElementById("morning").addEventListener("click", function morningDataget() {
    event.preventDefault();
    this.classList.toggle("timeButton1-filled");
    document.getElementById("afternoon").classList.remove("timeButton2-filled");
    document.getElementById("price").textContent = "新台幣 2000 元";
    getTimeandPrice = ['morning', 2000];
});

document.getElementById('afternoon').addEventListener('click', function afternoonDataget() {
    event.preventDefault();
    this.classList.toggle('timeButton2-filled');
    document.getElementById('morning').classList.remove('timeButton1-filled');
    document.getElementById('price').textContent = '新台幣 2500 元';
    getTimeandPrice = ['afternoon', 2500]
});


//返回首頁
document.getElementById('Title').addEventListener('click', function (event) {
    event.preventDefault();
    window.location.href = '/';
});

//===================================================================================
const button_plan = document.querySelector('#button_plan');
const button_submit = document.querySelector('#button_submit');

button_plan.addEventListener('click', init_2);
button_submit.addEventListener('click', init_2);

function init_2(event){
    event.preventDefault();
    const buttonId = event.target.id;
    const token = localStorage.getItem('Token');
    if (token !== null){
        fetchData(token, buttonId);
    }else{
        executeButtonsignin();
    }
}

function fetchData(token, buttonId) {
    fetch("/api/user/auth", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(handleResponse)
    .then(data => handleData(buttonId))
    .catch(handleError);
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Get null from backend');
    }
    return response.json();
}

function handleData(buttonId) {
    switch(buttonId) {
        case 'button_plan':
            loginCheck_2();
            break;
        case 'button_submit':
            booking();
            break;
    }
}

function handleError(error) {
}

//確認登入狀態後之事件處理
function loginCheck_2(){
    window.location.href = "/booking";
}

function executeButtonsignin(){
    modal.style.display = "block";
    memberSignincontainer.style.display = "block";
}

datePicker.addEventListener('input', datePickerclick);

function datePickerclick(){
    let selectedDate = datePicker.value; 
    datePicker.setAttribute('value', selectedDate);
}

function booking(){
    const attractionId = window.location.pathname.split("/").pop();
    const selectedDate = datePicker.getAttribute('value');
    const token = localStorage.getItem('Token');
    if (attractionId == null || selectedDate == null || getTimeandPrice.length == 0){
        alert('請輸入訂購資訊');
        return;
    }
    fetch("/api/booking", {
        method: 'POST',
        body: JSON.stringify({
            "attractionId": attractionId,
            "date": selectedDate,
            "time": getTimeandPrice[0],
            "price": getTimeandPrice[1],
        }),
        headers: {
            "Content-type": "application/json",
            'Authorization': `Bearer ${token}`
        }
    })
    .then(handleResponse)
    .then(data => window.location.href = "/booking")
    .catch(handleError);
}