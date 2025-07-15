TPDirect.setupSDK(137033, 'app_g5H5hXkKSIHANVJsYh99hPcebudiWGo3YokDL3zG8kxYMZT4bX4bQoKJbi7V', 'sandbox')
let fields = {
    number: {
        // css selector
        element: document.getElementById('card-number'),
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: document.getElementById('card-ccv'),
        placeholder: 'CCV'
    }
};
TPDirect.card.setup({
    styles: {
        // Style all elements
        'input': {
            'color': 'gray',
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    fields: fields,
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
});

document.querySelector('.pay_button').addEventListener('click', function (event) {
    event.preventDefault();

    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    if (tappayStatus.canGetPrime === false) {
        // alert('can not get prime');
        return;
    }

    // Get prime
    TPDirect.card.getPrime(function (result) {
        let connectionName = document.querySelector("input[name=connection_name]").value;
        let connectionEmail = document.querySelector("input[name=connection_email]").value;
        let connectionPhone = document.querySelector("input[name=connection_phone]").value;

        if (result.status !== 0) {
            // alert('get prime error ' + result.msg)
            return;
        }
        if (connectionName==""||connectionEmail==""||connectionPhone==""){
            alert('please fill all informations')
            return;
        }
        // alert('get prime 成功，prime: ' + result.card.prime);
        
        
        fetchbookingdata(result.card.prime, connectionName, connectionEmail, connectionPhone);
    });
});

function fetchbookingdata(prime, connectionName, connectionEmail, connectionPhone) {
    const token = localStorage.getItem('Token');
        
    fetch("/api/booking", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(checkResponse) 
    .then(data => {
        const bookingData = getBookingData(data); 

        const json = {
            "prime": prime,
            "order": {
                "price": bookingData.price,
                "trip": {
                    "attraction": {
                        "id": bookingData.attractionId,
                        "name": bookingData.name,
                        "address": bookingData.address,
                        "image": bookingData.imageURL
                    },
                    "date": bookingData.date,
                    "time": bookingData.time
                },
                "contact": {
                    "name": connectionName,
                    "email": connectionEmail,
                    "phone": connectionPhone
                }
            }
        };
        
        return fetch("/api/orders", {
            method: 'POST',
            body: JSON.stringify(json), 
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${token}`
            }
        })
        .then(checkResponse)
        .then(data => {
            if(data.data.payment.message === "付款成功"){
                let orderNumber = data.data.number;
                window.location.href = `/thankyou?number=${orderNumber}`;
            }else{
                alert('付款失敗')
            }
        })
    });

function getBookingData(data){
   
    const nameData = data.data.attraction.name;
    const attractionIdData = data.data.attraction.attractionId;
    const addressData = data.data.attraction.address;
    const imageData = data.data.attraction.URL_image;
    const dateData = data.data.date;
    const timeData = data.data.time;
    const priceData = data.data.price;
    return {
        name: nameData,
        attractionId: attractionIdData,
        address: addressData,
        imageURL: imageData,
        date: dateData,
        time: timeData,
        price: priceData
    };
}
}
