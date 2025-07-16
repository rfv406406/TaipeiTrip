//listbar scroll
let buttonRight = document.getElementById('frame3-right-button');
let buttonLeft = document.getElementById('frame3-left-button');

buttonRight.onclick = function () {
    document.getElementById('frame3-listbar').scrollLeft += 100;
};
buttonLeft.onclick = function () {
    document.getElementById('frame3-listbar').scrollLeft -= 100;
};


//listbar功能
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
            console.error("error: ", error.message);
        });
}

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
        }
    })  
}

//Intersection Observer
let nextPage = 1
let Container = document.querySelector('.frame4')
let loadingObserver = document.querySelector('.loadingObserver')
let isLoading = false;
let keyword = "";  

document.querySelector(".slogan-item-3").addEventListener("submit", function(event) {
    event.preventDefault();
    const inputData = document.querySelector("input[name=keyword]").value;
    if(inputData !== ""){
        keyword = inputData;
        nextPage = 0;
        Container.innerHTML = '';
        fetchDatas();
    }else{
        location.reload();
    }
});

const fetchDatas = () => {
    if (isLoading) return null;
    isLoading = true;
    fetch("/api/attractions?page=" + nextPage + "&keyword=" + keyword)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        if (data.message === 'no spot') {
            Container.textContent = '查無資料';
            isLoading = false;
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
            console.error('error:', error);
            isLoading = false;
        });
}

const callback = ([entry]) => {
    if (entry && entry.isIntersecting) {
        fetchDatas();
    }
}

const options = {
    threshold: 0.05
}

let observer = new IntersectionObserver(callback, options)
observer.observe(loadingObserver)