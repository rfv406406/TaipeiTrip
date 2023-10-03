const APP_ID = 137033;
const APP_KEY = app_g5H5hXkKSIHANVJsYh99hPcebudiWGo3YokDL3zG8kxYMZT4bX4bQoKJbi7V;

TPDirect.setupSDK(APP_ID, APP_KEY, 'sandbox')

TPDirect.card.setup({
    // Display ccv field
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv'
        }
    },

    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
});

let payButton = document.querySelector('.pay_button')

// payButton.addEventListener('click', onClick);

// function onClick() {
//     // 讓 payButton 之後觸發 getPrime 方法
//     TPDirect.card.getPrime(function (result) {
//         if (result.status !== 0) {
//             console.err('getPrime 錯誤')
//             return
//         }
//         var prime = result.card.prime
//         alert('getPrime 成功: ' + prime)
//     })
// }

TPDirect.card.onUpdate(function (update) {
    if (update.canGetPrime) {
        payButton.removeAttribute('disabled');
    } else {
        payButton.setAttribute('disabled', true);
    }

    cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
    // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess()
    } else {
        setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess()
    } else {
        setNumberFormGroupToNormal()
    }

    if (update.status.ccv === 2) {
        setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        setNumberFormGroupToSuccess()
    } else {
        setNumberFormGroupToNormal()
    }
});