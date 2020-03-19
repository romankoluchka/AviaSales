const formSearch = document.querySelector('.form-search'),
inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
inputCitiesTo = formSearch.querySelector('.input__cities-to'),
dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to');

const city = ['Львів', 'Київ', 'Одеса', 'Миколаїв', 'Харків', 'Донецьк', 'Житомир', 'Хмельницький', 'Дрогобич', 'Стрий', 'Самбір'];

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value === '') return;
    const filterSity = city.filter((item) => {
        const fixItem = item.toLowerCase();
        return fixItem.includes(input.value.toLowerCase());
    });

    filterSity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item;
        list.append(li)
    });
};

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesFrom.value = target.textContent;
        dropdownCitiesFrom.textContent = '';
    }
});

inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        inputCitiesTo.value = target.textContent;
        dropdownCitiesTo.textContent = '';
    }
});