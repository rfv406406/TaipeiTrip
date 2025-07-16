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
            throw new Error('No booking data available'); 
        }
        return data; 
    }).catch(error => {
        console.error('Error during processing response:', error);
        throw error; 
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

