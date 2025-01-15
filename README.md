# TaipeiTrip

TaipeiTrip is an e-commerce travel website. 
The backend is designed using a Restful API architecture, connecting to government open resources APIs to get information about attractions. It offers a travel booking service and payments through the TapPay SDK as a third-party payment solution.

<img src=readmefile/img1.png width=100% />

## Test Account

Guests could preview information about attractions without logging in. 
To book a travel date and time slot, you need to log in to use this feature. Below are the test account and password.

| Account | Password |
|-----|--------|
| test@test.com | test |

| Card Number | Valid Date | CVV |
|-----|--------|--------|
| 4242 4242 4242 4242 | 12/24 | 123 |

## Website architecture

<img src=readmefile/TaipeitripST.png width=100% />

The front-end pages are created using basic HTML, CSS, and JavaScript. The backend framework is ```Python Flask```. The website adopts a ```front-end and back-end separation design```. Based on the Request sent by the front-end, data in ```JSON format``` is returned through the ```RESTful API```.

Version control is managed using ```Git/GitHub```. After completing periodic missions, a Pull Request is sent to the Reviewer. Once approved, the develop branch is merged into the main branch, and the code is synchronized to ```AWS EC2``` to update the website.

## Database

Adopting a MySQL relational database design that conforms to the third normal form.

<img src=readmefile/DB.png width=100% />

## Features

### Infinite Scroll & Lazy Loading

Using the Intersection Observer API to achieve the loading of attractions.

![Alt text](<readmefile/lazy loading.gif>)
<br/>

### Keyword Search

Conducting attraction searches using keyword matching.

![Alt text](<readmefile/keyword search.gif>)
<br/>

### Attraction
![Alt text](readmefile/%E6%99%AF%E9%BB%9E%E9%A0%81%E9%9D%A2%E8%BC%AA%E6%92%AD%E5%9C%96.gif)
<br/>

### Booking & TapPay 

Booking service and payments through the TapPay SDK as a third-party payment solution.

![Alt text](<readmefile/booking ordering.gif>)
<br/>

## Contact

康智偉 Chih-Wei, KANG

rfv406406@gmail.com

***

