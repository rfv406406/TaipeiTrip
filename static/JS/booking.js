const button_plan = document.querySelector('#button_plan');
// const button_submit = document.querySelector('#button_submit');

button_plan.addEventListener('click', init_2);
// button_submit.addEventListener('click', init_2);

function init_2(event){
    event.preventDefault();
    const buttonId = event.target.id;
    const token = localStorage.getItem('Token');
    console.log(token);
    fetchData(token, buttonId);
}

function fetchData(token, buttonId) {
    fetch("/api/user/auth", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(handleResponse)
    .then(data => handleData(buttonId, data))
    .catch(handleError);
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Get null from backend');
    }
    return response.json();
}

function handleData(buttonId ,data) {
    console.log(buttonId);
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
    console.error('Backend could got problems', error);
}

function loginCheck_2(){
    window.location.href = "/booking";
}

//拉取data、附加元素
function appendData(data){
   
    const nameData = data.data.attraction.name;
    const attractionIdData = data.data.attraction.attractionId;
    const addressData = data.data.attraction.address;
    const imageData = data.data.attraction.URL_image;
    const dateData = data.data.date;
    const timeData = data.data.time;
    const priceData = data.data.price;
    
    const attractionImage = document.querySelector('.attraction_image');
    const inforName = document.querySelector('#infor_name');
    const inforDate = document.querySelector('#infor_date');
    const inforTime = document.querySelector('#infor_time');
    const inforPrice = document.querySelector('#infor_price');
    const inforLocation = document.querySelector('#infor_location');
    const totalPrice = document.querySelector('#total_price');

    let img = document.createElement("img");
    img.src = imageData;
    attractionImage.appendChild(img);

    inforName.textContent = nameData;
    inforDate.textContent = dateData;
    inforPrice.textContent = priceData;
    inforLocation.textContent = addressData;
    totalPrice.textContent = priceData;

    const morning = '早上9點到下午4點'
    const afternoon = '下午4點到晚上9點'

    if(timeData == 'morning'){
        inforTime.textContent = morning;
    }else{
        inforTime.textContent = afternoon;
    } 
}
//取得訂購資料
function fetchReservedata() {
    const token = localStorage.getItem('Token');
    fetch("/api/booking", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(checkResponse)
    .then(data => appendData(data))
    .catch(handleError);
}
fetchReservedata()

//訂購資料確認
function checkResponse(response) {
    let body = document.querySelector('#body');
    return response.json().then(data => {
        if (data == null || data.data == null) {
            body.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; width: 90%; margin:auto; margin-bottom: 30px;">目前沒有任何預定行程</div>';
            throw new Error('No booking data available'); // 抛出错误
        }
        return data; // 返回实际数据以进行进一步处理
    }).catch(error => {
        console.error('Error during processing response:', error);
        throw error; // 重新抛出错误，以便于调用者也可以捕获
    });
}

//返回首頁
document.getElementById('Title').addEventListener('click', function () {
    event.preventDefault();
    window.location.href = '/';
});

//刪除按鈕
const deleteIcon1 = document.querySelector('.delete_icon_1');
const deleteIcon2 = document.querySelector('.delete_icon_2');

deleteIcon1.addEventListener('click', function () {
    event.preventDefault();
    deleteReservedata();
});

deleteIcon2.addEventListener('click', function () {
    event.preventDefault();
    deleteReservedata();
});

//刪除訂購資訊
function deleteReservedata() {
    const token = localStorage.getItem('Token');
    fetch("/api/booking", {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(handleResponse)
    .then(data => location.reload())
    .catch(handleError);
}

