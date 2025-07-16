//返回首頁
document.getElementById('Title').addEventListener('click', function () {
    event.preventDefault();
    window.location.href = '/';
});

// =============================================================================

const currentURL = window.location.href;
const parts = currentURL.split('?');
const paramsPart = parts[1];
const params = paramsPart.split('=');
const order_Number = params[1];

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