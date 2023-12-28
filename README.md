# TaipeiTrip

Taipei Day Tour is an e-commerce travel website. 
The backend is designed using a Restful API architecture, connecting to government open resources APIs to get information about attractions. It offers a travel booking service and payments through the TapPay SDK as a third-party payment solution.

<img src=readmefile/img1.png width=80% />

## DEMO URL

https://parkingabc.online:5000/

## Test Account

Guests could preview information about attractions without logging in. 
To book a travel date and time slot, you need to log in to use this feature. Below are the test account and password.

| Account | Password |
|-----|--------|
| test@test.com | test |

| Card Number | Valid Date | CVV |
|-----|--------|--------|
| 4242 4242 4242 4242 | 12/26 | 123 |

## Website architecture

<img src=readmefile/TaipeitripST.png width=80% />

The front-end pages are created using basic HTML, CSS, and JavaScript. The backend framework is ```Python Flask```. The website adopts a ```front-end and back-end separation design```. Based on the Request sent by the front-end, data in ```JSON format``` is returned through the ```RESTful API```.

Version control is managed using ```Git/GitHub```. After completing periodic missions, a Pull Request is sent to the Reviewer. Once approved, the develop branch is merged into the main branch, and the code is synchronized to ```AWS EC2``` to update the website.

## Database

<img src=readmefile/DB.png width=80% />

Adopting a MySQL relational database design that conforms to the third normal form.

## Features

### 📜 Infinite Scroll & Lazy Loading
<img src=https://user-images.githubusercontent.com/101781321/224511319-804eeb29-c602-49ab-9b64-beb61e488998.gif width=100% />
<br/>

### 🔎 Keyword Search
<img src=https://user-images.githubusercontent.com/101781321/224511341-73e4ede1-e9d2-40c4-8ff7-d19d1e8d47dc.gif width=100% />
<br/>

### 💁‍♂️ Member System
<img src=https://user-images.githubusercontent.com/101781321/224511352-2e8bda11-fb7e-4d14-9804-9ab07c439d94.gif width=100% />
<br/>

### 🎠 Carousel & Attraction Detail
<img src=https://user-images.githubusercontent.com/101781321/224511363-22d56d1a-82fa-4594-b59d-4fe55ec9c0e7.gif width=100% />
<br/>

### 💳 Booking & TapPay SDK
<img src=https://user-images.githubusercontent.com/101781321/224511369-679c2953-9104-44b1-914d-f5142904d243.gif width=100% />
<br/>

### 📋 Order History
<img src=https://user-images.githubusercontent.com/101781321/224511370-229a67ce-78d3-4c39-bd0f-f32c54bc80ce.gif width=100% />
<br/>

### 📱 Responsive Web Design (RWD)
<img src=https://user-images.githubusercontent.com/101781321/224511372-95c42881-1571-411f-9a2f-411c4c373d5d.gif width=100% />
<br/>

## Contact

🙋 李宥臻 YOU-ZHEN, LI

📧 charlie9684@gmail.com


***  