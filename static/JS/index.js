//listbar scroll
let buttonRight = document.getElementById('frame3-right-button');
let buttonLeft = document.getElementById('frame3-left-button');

buttonRight.onclick = function () {
    document.getElementById('frame3-listbar').scrollLeft += 100;
};
buttonLeft.onclick = function () {
    document.getElementById('frame3-listbar').scrollLeft -= 100;
};


//listbarn功能
function getDatas() {
    fetch("/api/mrts")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let frame3 = document.querySelectorAll(".frame3-listbar-item");
            for (let i = 0; i < data.data.length; i++) {
                let mrt = data.data[i];
                frame3[i].innerText = mrt;
                frame3[i].dataset.mrt = mrt;
            }
            frame3.forEach(item => {
                item.addEventListener("click", function() {
                    let selectedMrt = this.dataset.mrt;
                    let inputMrt = document.querySelector('.slogan-item-3-text');
                    inputMrt.value = selectedMrt;
                    // 模擬按鈕的點擊行為
                    document.querySelector('.slogan-item-3-button').click();
                });
            });
        })
        .catch(error => {
            console.error("發生錯誤", error.message);
        });
}

// 阻止表單的預設提交行為，這裡只需要做一次
document.querySelector(".slogan-item-3").addEventListener("submit", function(event) {
    event.preventDefault();
});

getDatas();

// 自動生成
function getData(){
    fetch("/api/attractions?page=0")
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        let frame4Items = document.querySelectorAll(".frame4-item");
        
        for(let i = 0; i < data.data.length; i++){
            
            let imageURL = data.data[i].images;
            let nameData = data.data[i].name;
            let mrtData = data.data[i].mrt;
            let categoryData = data.data[i].category;
            let idData = data.data[i].id;

            let frame4ItemImgContainer = frame4Items[i].querySelector(".frame4-item-img");
            let frame4ItemName = frame4Items[i].querySelector(".frame4-item-name");
            let frame4ItemMrt = frame4Items[i].querySelector(".frame4-item2-mrt");
            let frame4ItemCategory = frame4Items[i].querySelector(".frame4-item2-category");

            frame4ItemName.textContent = nameData;
            frame4ItemMrt.textContent = mrtData;
            frame4ItemCategory.textContent = categoryData;
        
            let image = document.createElement("img");
            image.src = imageURL[0];
            frame4ItemImgContainer.appendChild(image);

            frame4Items[i].addEventListener("click", function(event) {
                event.preventDefault();
                window.location = "/attraction/" + idData;
                    })
                }})  
            }
getData();


//Intersection Observer
let nextPage = 1
let Container = document.querySelector('.frame4')
let loadingObserver = document.querySelector('.loadingObserver')
let isLoading = false;
let keyword = "";  // Declare keyword as a global variable

document.querySelector(".slogan-item-3").addEventListener("submit", function(event) {
    event.preventDefault();
    let inputData = document.querySelector("input[name=keyword]").value;
    if(inputData !== ""){
        keyword = inputData;
        nextPage = 0;
        Container.innerHTML = '';
        observer.observe(loadingObserver); // Re-attach the observer when searching again
        fetchData();
    }else{
        location.reload();
    }
    });

    const options = {
    threshold: 0.05
    }

const fetchDatas = () => {
    if (isLoading) return; // 如果正在加載，則直接返回
        isLoading = true;
        fetch("/api/attractions?page=" + nextPage + "&keyword=" + keyword)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
        if (data.message === 'no spot') {
            // 如果收到 {error: true, message: 'no spot'} 這條消息
            Container.textContent = '查無資料';
            observer.observe(loadingObserver);
        }else {
            if (data.nextPage !== null) {
                nextPage = data.nextPage;
            } else {
                observer.disconnect(); // Stop the observer if there's no next page
            }

            for (let i = 0; i < data.data.length; i++) {
                let imageURL = data.data[i].images;
                let nameData = data.data[i].name;
                let mrtData = data.data[i].mrt;
                let categoryData = data.data[i].category;
                let idData = data.data[i].id;

                let frame4Item = document.createElement("div");
                frame4Item.classList.add("frame4-item");

                frame4Item.addEventListener("click", function(event) {
                    event.preventDefault();
                    window.location = "/attraction/" + idData;
                });

                let frame4ItemContent = document.createElement("div");
                frame4ItemContent.classList.add("frame4-item-content");
                frame4Item.appendChild(frame4ItemContent);

                let newDiv = document.createElement("div");
                newDiv.classList.add("frame4-item-img");
                let image = document.createElement("img");
                image.src = imageURL[0];
                newDiv.prepend(image);
                frame4ItemContent.appendChild(newDiv);

                let frame4Name = document.createElement("div");
                frame4Name.classList.add("frame4-item-name");
                frame4Name.textContent = nameData;
                frame4ItemContent.appendChild(frame4Name);

                let frame4Item2 = document.createElement("div");
                frame4Item2.classList.add("frame4-item2");
                frame4Item.appendChild(frame4Item2);

                let frame4Mrt = document.createElement("div");
                frame4Mrt.classList.add("frame4-item2-mrt");
                frame4Mrt.textContent = mrtData;
                frame4Item2.appendChild(frame4Mrt);

                let frame4Category = document.createElement("div");
                frame4Category.classList.add("frame4-item2-category");
                frame4Category.textContent = categoryData;
                frame4Item2.appendChild(frame4Category);

                Container.appendChild(frame4Item);
            }
            isLoading = false;
        }    
    })
    .catch(error => {
            console.error('There was a problem with the fetch operation:', error.message);
        });
    }
    const callback = ([entry]) => {
        if (entry && entry.isIntersecting) {
            fetchDatas()
        }
    }
    let observer = new IntersectionObserver(callback, options)
    observer.observe(loadingObserver)


// ===================================================================================
const button_plan = document.querySelector('#button_plan');
// const button_submit = document.querySelector('#button_submit');

button_plan.addEventListener('click', init_2);
// button_submit.addEventListener('click', init_2);

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

function loginCheck_2(){
    window.location.href = "/booking";
}

function handleError(error) {
    console.error('Backend could got problems', error);
}

function executeButtonsignin(){
    modal.style.display = "block";
    memberSignincontainer.style.display = "block";
}