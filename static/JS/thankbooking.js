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

//返回首頁
document.getElementById('Title').addEventListener('click', function () {
    event.preventDefault();
    window.location.href = '/';
});

// =============================================================================

const currentURL = window.location.href;
// 使用split方法根据问号（?）分割URL
const parts = currentURL.split('?');
// 获取参数部分
const paramsPart = parts[1];
// 使用split方法再次分割参数部分，以获取参数名和参数值
const params = paramsPart.split('=');
// 获取参数名和参数值
const order_Number = params[1];
console.log(order_Number)

function fetchOrderingData() {
    const token = localStorage.getItem('Token');
    fetch(`/api/orders/${order_Number}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(handleResponse)
    .then(data => appendOrderingData(data))
    .catch(handleError);
}
fetchOrderingData()

function appendOrderingData(data){
   
    const nameData = data.data.contact.name;
    const attractionNameData = data.data.trip.attraction.name;
  
    const orderNumber = document.querySelector('#order_number');
    const name = document.querySelector('#name');
    const attractionName = document.querySelector('#attraction_name');

    name.textContent = nameData;
    attractionName.textContent = attractionNameData;
    orderNumber.textContent = order_Number;
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error('Get null from backend');
    }
    return response.json();
}

function handleError(error) {
    console.error('Backend could got problems', error);
}