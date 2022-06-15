//SETTING LUXON LIBRARY

const DateTime = luxon.DateTime;
const Interval = luxon.Interval;

//validaciones connstantes 
const PEOPLE_VALIDATION = document.getElementById('peoplevalidation')
const ARRIVAL_INPUT = document.getElementById('arrivalDate')
const DEPARTURE_INPUT = document.getElementById('departureDate')
const ARRIVAL_SPAN = document.getElementById('arrivalvalidation') 
const DEPARTURE_SPAN = document.getElementById('departurevalidation')



let peopleAmount = 0;
let adultsSelector = document.getElementById("adultsNumber")
let childrenSelector = document.getElementById("childrenNumber")
let bookingBtn = document.getElementById('booking-btn');

const carrito = []
const ROOMS_CONTAINER = document.querySelector('#items')
const DETAILS_PRODUCTS = document.querySelector('#detail-container')

//Renderization of select options 

const RENDER_OPTION = (s1, s2) => {

    let optionArray = [];

    s2.innerHTML = "";

    if (s1.value < 3) {

        optionArray = ["0 0", "1 1", "2 2"]

    } else if (s1.value < 5) {

        optionArray = ["0 0", "1 1", "2 2", "3 3", "4 4"]

    } else {

        optionArray = ["0 0", "1 1", "2 2", "3 3", "4 4", "5 5", "6 6"]

    }


    for (let i = 0; i < optionArray.length; i++) {

        let pair = optionArray[i].split(" ")
        let newOption = document.createElement("option")
        newOption.value = pair[0]
        newOption.innerHTML = pair[1]
        s2.append(newOption);
    }
}

//CHECK RENDERIZATION

let renderDetails = (products) => {

    const ARRIVAL_DATE = DateTime.fromISO(ARRIVAL_INPUT.value)
    const DEPARTURE_DATE = DateTime.fromISO(DEPARTURE_INPUT.value)
    let BOOKING_DAYS = Interval.fromDateTimes(ARRIVAL_DATE, DEPARTURE_DATE);

    const StringMonth = (date) => {
        
        let month = date.toLocaleString(DateTime.DATE_FULL)
        let name = month.split(" ")
        let nameString =  name[0]
        return nameString

    }

    const MONTH_ARRIVAL_NAME = StringMonth(ARRIVAL_DATE)
    const MONTH_DEPARTURE_NAME =StringMonth(DEPARTURE_DATE)
   
    const details = document.querySelector('.finalbill');
    details.style.display = 'flex';

    const template = document.querySelector('#template-products').content
    const fragment = document.createDocumentFragment();


    for (const product of products) {

       
        template.querySelector('#daysOfStay').textContent = BOOKING_DAYS.length('days')
        template.querySelector('#roomName').textContent = product.name
        template.querySelector('#roomPrice').textContent = product.price;
        template.querySelector('#total').textContent = product.price * parseInt(BOOKING_DAYS.length('days'))
        template.querySelector('#checkInDay').textContent = ARRIVAL_DATE.day
        template.querySelector('#checkOutDay').textContent = DEPARTURE_DATE.day
        template.querySelector('#checkInMonth').textContent = MONTH_ARRIVAL_NAME
        template.querySelector('#checkOutMonth').textContent = MONTH_DEPARTURE_NAME
        
        if (BOOKING_DAYS.length('days') === 0){

            template.querySelector('#daysOfStay').textContent = 1
            template.querySelector('#total').textContent = product.price

        }
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)

    }

    DETAILS_PRODUCTS.appendChild(fragment)

    const PAYMENT_BUTTON = document.querySelector('#payment-btn')
    PAYMENT_BUTTON.addEventListener('click', () => {

        swal.fire({
            title: "HENS HOTEL", 
            text: "Thanks for trusting us!", 
            icon: 'success',
            type: "success"
        }).then(function(){ 
        location.reload();
        });
    })
}

//ROOM RENDER FUNCTION (1 ROOM EACH)

let templateRender = (rooms) => {

    const template = document.querySelector('#template-room').content;
    const fragment = document.createDocumentFragment();
    // LOCAL STORAGE FUNCTION
    const SAVEROOM = (key, value) => localStorage.setItem(key, value)
    // GET ITEM STORAGE 
    const TAKEROOM = (key) => JSON.parse(localStorage.getItem(key))

    for (const room of rooms) {

        template.querySelector(".rooms__item__img").style.backgroundImage = 'url(' + room.img + ')';
        template.querySelector('h3').textContent = room.name;
        template.querySelector('p').textContent = room.room;
        template.querySelector('span').textContent = room.price;
        template.querySelector('.bookBtn--shop').dataset.id = room.id
        template.querySelector(".serviceImg1").src = room.service1
        template.querySelector(".serviceImg2").src = room.service2
        template.querySelector(".serviceImg3").src = room.service3
        template.querySelector(".serviceImg4").src = room.service4
        template.querySelector(".serviceDesc1").textContent = room.service1desc 
        template.querySelector(".serviceDesc2").textContent = room.service2desc 
        template.querySelector(".serviceDesc3").textContent = room.service3desc 
        template.querySelector(".serviceDesc4").textContent = room.service4desc 
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)

    }

    ROOMS_CONTAINER.appendChild(fragment)

    const BUTTONS = ROOMS_CONTAINER.querySelectorAll('.bookBtn--shop')


    BUTTONS.forEach(btn => {
        btn.addEventListener('click', () => {
            const SELECTED_ROOM = rooms.find(room => room.id == btn.dataset.id)
            SAVEROOM(SELECTED_ROOM.id, JSON.stringify(SELECTED_ROOM))
            let getRoom = TAKEROOM(SELECTED_ROOM.id)
            carrito.push(getRoom)
            renderDetails(carrito)
        })
    })
}

//ROOMS FILTER WITH ROOMS RENDERIZATIONS

let renderRooms = (roomArray) => {

    const SERVICES = roomArray.filter((service) => service.clasificacion.includes('servicio'))
    console.log(SERVICES)

    peopleAmount = parseInt(adultsSelector.value) + parseInt(childrenSelector.value);
    
    if (adultsSelector.value == 0) {

        PEOPLE_VALIDATION.style.display = 'block'

    }

    if (  peopleAmount < 3) {

        const SMALL1_ROOMS = roomArray.filter((room) => room.size.includes('room-1small'))

        templateRender(SMALL1_ROOMS)

    } else if (peopleAmount < 5) {

        const SMALL2_ROOMS = roomArray.filter((room) => room.size.includes('room-2small'));

        templateRender(SMALL2_ROOMS)

    } else if (peopleAmount < 9) {

        const MEDIUM_ROOMS = roomArray.filter((room) => room.size.includes('room-medium'));

        templateRender(MEDIUM_ROOMS);

    } else if (peopleAmount < 12) {

        const BIG_ROOMS = roomArray.filter((room) => room.size.includes('room-big'));

        templateRender(BIG_ROOMS);

    } 
}

const FETCH_DATA = async () => {
    try {
        const res = await fetch('data/dataserv.json')
        const data = await res.json()
        renderRooms(data)
    } catch (error) {
        console.log(error)
    }
}

adultsSelector.addEventListener("change", () => {
    RENDER_OPTION(adultsSelector, childrenSelector) 

    if (adultsSelector.value != 0) {

        PEOPLE_VALIDATION.style.display = 'none'

    }
    
});

// INPUTS VALIDATIONS


bookingBtn.addEventListener("click", () => {
    
    
    if ((ARRIVAL_INPUT.value && DEPARTURE_INPUT.value) === "" ){
        
        ARRIVAL_SPAN.style.display = 'block'
        DEPARTURE_SPAN.style.display = 'block'
        
    } else if ((ARRIVAL_INPUT.value && DEPARTURE_INPUT.value) !== ""){
        
        FETCH_DATA()
    }
    
     
});

const INPUT_VALIDATION = (input,span) => {

    input.addEventListener("change", () => {
    
        if ((input.value ) !== "" ){
    
            span.style.display = 'none'
    
        }
    
    }) 

}

INPUT_VALIDATION(ARRIVAL_INPUT, ARRIVAL_SPAN)
INPUT_VALIDATION(DEPARTURE_INPUT, DEPARTURE_SPAN) 





