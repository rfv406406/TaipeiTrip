 // 文字資料匯入
    const attractionId = window.location.pathname.split("/").pop();
    function getData(){
        fetch("http://127.0.0.1:3000/api/attraction/" + attractionId)
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
        console.log(attractionId)
        fetch("http://127.0.0.1:3000/api/attraction/" + attractionId)
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
    document.getElementById("morning").addEventListener("click", function () {
        event.preventDefault();
        this.classList.toggle("timeButton1-filled");
        document.getElementById("afternoon").classList.remove("timeButton2-filled");
        document.getElementById("price").textContent = "新台幣 2000 元";
        const morning = document.querySelector('.timeButton1-filled');
        const afternoon = document.querySelector('.timeButton2-filled');
        const price = document.getElementById('price').textContent;
        console.log(morning)
        console.log(afternoon)
        console.log(price)
    });

    document.getElementById('afternoon').addEventListener('click', function () {
        event.preventDefault();
        this.classList.toggle('timeButton2-filled');
        document.getElementById('morning').classList.remove('timeButton1-filled');
        document.getElementById('price').textContent = '新台幣 2500 元';
        const morning = document.querySelector('.timeButton1-filled');
        const afternoon = document.querySelector('.timeButton2-filled');
        const price = document.getElementById('price').textContent;
        console.log(afternoon)
        console.log(morning)
        console.log(price)
    });


//返回首頁
    document.getElementById('Title').addEventListener('click', function () {
        event.preventDefault();
        window.location.href = "http://127.0.0.1:3000";
    });

//===================================================================================
const button_plan = document.querySelector('#button_plan');
const button_submit = document.querySelector('#button_submit');

button_plan.addEventListener('click', init_2);
button_submit.addEventListener('click', init_2);
//使用者登入狀態確認
function init_2(event){
    const buttonId = event.target.id;
    const token = localStorage.getItem('Token');
    console.log(token)
    if (token !== null){
        fetch("http://127.0.0.1:3000/api/user/auth", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Get null from backend');
        }
        return response.json();
    })
    .then(data => {
        switch(buttonId) {
            case 'button_plan':
                loginCheck_2();
                break;
            case 'button_submit':
                booking();
                break;
        }
    })
    .catch(error => {
        console.error('Backend could got problems');
    })
    }else{
        executeButtonsignin();
}
}

// function init_2(){
//     const token = localStorage.getItem('Token');
//     console.log(token)
//     if (token !== null){
//         fetch("http://127.0.0.1:3000/api/user/auth", {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Get null from backend');
//         }
//         return response.json();
//     })
//     .then(data => {
//         booking();
//     })
//     .catch(error => {
//         console.error('Backend could get problems');
//     })
//     }else{
//         executeButtonsignin();
// }
// }
//確認登入狀態後之事件處理
function loginCheck_2(){
    window.location.href = "/booking";
}

function executeButtonsignin(){
    modal.style.display = "block";
    memberSignincontainer.style.display = "block";
}

const morning = document.querySelector('.timeButton1-filled');
const afternoon = document.querySelector('.timeButton2-filled');
// const price = document.getElementById('price').textContent
const datePicker = document.querySelector('#datePicker');
console.log(attractionId,morning,afternoon,price,datePicker)

datePicker.addEventListener('input', datePickerclick);

function datePickerclick(){
    let selectedDate = datePicker.value; // 获取日期输入框的值
    console.log(selectedDate); // 打印选中的日期
    datePicker.setAttribute('data-selected-date', selectedDate);
}

function booking(){
    const attractionId = window.location.pathname.split("/").pop();
    const selectedDate = datePicker.getAttribute('data-selected-date');
    console.log(selectedDate);
}