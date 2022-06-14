const products = [
];

//validaciones connstantes 
const DateTime = luxon.DateTime;
const Interval = luxon.Interval;

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

let renderDetails = (products) => {

    const template = document.querySelector('#template-products').content
    const fragment = document.createDocumentFragment();

    for (const product of products) {

        template.querySelector('.finalbill__container__div__details__room__h3').textContent = product.name
        template.querySelector('.finalbill__container__div__details__room__p').textContent = product.room;
        template.querySelector('.finalbill__container__div__details__p').textContent = product.price;
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
    }

    DETAILS_PRODUCTS.appendChild(fragment)

}

let templateRender = (rooms) => {

    const template = document.querySelector('#template-room').content;
    const fragment = document.createDocumentFragment();
    // LOCAL STORAGE FUNCTION
    const SAVEROOM = (key, value) => localStorage.setItem(key, value)
    // GET ITEM STORAGE 
    const TAKEROOM = (key) => JSON.parse(localStorage.getItem(key))


/*     const SERVICES_REGULAR = services.filter((services) => services.servCategory.includes('regular'))
 */
    for (const room of rooms) {

       /*  if (room.category === "regular") {

            
            for (const SERVICES of SERVICES_REGULAR) {
                
                const service_container = template.querySelector('.rooms__item__specs__grid')
                const serviceImage = document.createElement('img')
                serviceImage.src = SERVICES.img
                const serviceDesc = document.createElement('p')
                serviceDesc.textContent = SERVICES.desc
                service_container.appendChild(serviceImage,serviceDesc);
                const clone = template.cloneNode(true);
                fragment.appendChild(clone)
            }

        } */

        template.querySelector(".rooms__item__img").style.backgroundImage = 'url(' + room.img + ')';
        template.querySelector('h3').textContent = room.name;
        template.querySelector('p').textContent = room.room;
        template.querySelector('span').textContent = room.price;
        template.querySelector('.bookBtn--shop').dataset.id = room.id
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


let renderRooms = (roomArray) => {


    peopleAmount = parseInt(adultsSelector.value) + parseInt(childrenSelector.value);

    const SERVICES = roomArray.filter((service) => service.clasificacion.includes('servicio'))

    if (adultsSelector.value == 0) {

        PEOPLE_VALIDATION.style.display = 'block'

    }

    if (peopleAmount < 3) {

        const SMALL1_ROOMS = roomArray.filter((room) => room.size.includes('room-1small'))

        templateRender(SMALL1_ROOMS, SERVICES)

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


bookingBtn.addEventListener("click", () => {

    FETCH_DATA()

    if ((ARRIVAL_INPUT.value && DEPARTURE_INPUT.value) === "") {

        ARRIVAL_SPAN.style.display = 'block'
        DEPARTURE_SPAN.style.display = 'block'

    } else if ((ARRIVAL_INPUT.value && DEPARTURE_INPUT.value) !== "") {

        const ARRIVAL_DATE = DateTime.fromISO(ARRIVAL_INPUT.value)
        const DEPARTURE_DATE = DateTime.fromISO(DEPARTURE_INPUT.value)
        const BOOKING_DAYS = Interval.fromDateTimes(ARRIVAL_DATE, DEPARTURE_DATE);
        console.log(BOOKING_DAYS.length('days'));

    }


});

const INPUT_VALIDATION = (input, span) => {

    input.addEventListener("change", () => {

        if ((input.value) !== "") {

            span.style.display = 'none'

        }

    })

}

INPUT_VALIDATION(ARRIVAL_INPUT, ARRIVAL_SPAN)
INPUT_VALIDATION(DEPARTURE_INPUT, DEPARTURE_SPAN)


/*  ARRIVAL_INPUT.addEventListener("change", () => {
   
   
   if ((ARRIVAL_INPUT.value ) !== "" ){

       ARRIVAL_SPAN.style.display = 'none'

   }

}) 

DEPARTURE_INPUT.addEventListener("change", () => {
   
   
   if ((ARRIVAL_INPUT.value ) !== "" ){

       DEPARTURE_SPAN.style.display = 'none'

   }

})  

*/



