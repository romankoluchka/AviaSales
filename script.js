const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputCitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets')

const citiesApi = 'dataBase/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = '4998514e3c09d116463c19831c5c1073',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUNT = 10;

let city = [];


const getData = (url, callback, reject = console.error) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            reject(request.status);
        }
    });

    request.send();
};

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value === '') return;
    const filterCity = city.filter((item) => {
        const fixItem = item.name.toLowerCase();
        return fixItem.startsWith(input.value.toLowerCase());
    });

    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li)
    });
};

const selectCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    };
};

const getNameCity = code => {
    const objCity = city.find(item => item.code === code);
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('uk', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getChanges = num => {
    if (num) {
        return num === 1 ? 'Одна пересадка' : 'Дві пересадки';
    } else {
        return 'Без пересадок'
    }
};

const getLinkAviasales = (data) => {
    let link = 'https://www.aviasales.ru/search/';

    link += data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDate();

    const month = date.getMonth() + 1;

    link += day < 10 ? '0' + day : day;

    link += month < 10 ? '0' + month : month;

    link += data.destination;

    return link + '1'
}

const createCard = (data) => {
    const ticket = document.createElement('article')
    ticket.classList.add('ticket');

    let deep = '';

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target="_blank"class="button button__buy">Купити
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Виліт з:
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                        </div
                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Призначення:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `
    } else {
        deep = '<h3> На жаль, квитки відсутні на вибрану дату</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Найдешевший квиток на вибрану дату</h2>';
    const ticket = createCard(cheapTicket[0]);
    cheapestTicket.append(ticket);
};

const renderCheapAll = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Найдешевші квитки на інші дати</h2>';
    cheapTickets.sort((a, b) => a.value - b.value);

    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }
};

const renderChip = (data, date) => {
    const cheapTicketAll = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicketAll.filter(item => item.depart_date === date);

    renderCheapDay(cheapTicketDay);

    renderCheapAll(cheapTicketAll);

};

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesFrom.addEventListener('click', () => {
    selectCity(event, inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesTo.addEventListener('click', () => {
    selectCity(event, inputCitiesTo, dropdownCitiesTo)
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name),
        to: city.find((item) => inputCitiesTo.value === item.name),
        when: inputDateDepart.value,
    };

    if (formData.from && formData.to) {
        const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}` +
            `&destination=${formData.to.code}&one_way=true&token=${API_KEY}`

        getData(calendar + requestData, (response) => {
            renderChip(response, formData.when)
        }, (e) => {
            alert('В цьому напрямку немає рейсів');
            console.error('Помилка', e);

        });
    } else {
        alert('Місто не знайдене!')
    };
});

getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item => item.name);
    city.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
}); 