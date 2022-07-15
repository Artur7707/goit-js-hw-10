// В ответе от бэкенда возвращаются объекты, большая часть свойств которых тебе не пригодится. Чтобы сократить объем передаваемых
// данных добавь строку параметров запроса - так этот бэкенд реализует фильтрацию полей.Ознакомься с документацией синтаксиса фильтров.

// Тебе нужны только следующие свойства:

// name.official - полное имя страны
// capital - столица
// population - население
// flags.svg - ссылка на изображение флага
// languages - массив языков
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './refs';

const DEBOUNCE_DELAY = 300;

function onSearch(event) {
  valueReset();
  let { value } = event.target;
  value = value.trim();
  if (!value) {
    return;
  }
  fetchCountries(value).then(renderCountry).catch(onError);
}
refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onError(error) {
  Notify.failure('Oops, there is no country with that name');
}

function valueReset() {
  refs.info.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function renderCountry(countryName) {
  if (countryName.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }

  if (countryName.length > 1) {
    refs.countryList.innerHTML = listMarkup(countryName);
  } else {
    refs.info.innerHTML = countryMarkup(countryName[0]);
  }
}

function listMarkup(countries) {
  const result = countries
    .map(
      ({ name, flags }) =>
        `<li class="item">
                <img alt = "${name.common} flag" src = "${flags.svg}" width="50"> 
                <span>${name.common}</span>
            </li>`
    )
    .join('');
  return result;
}

function countryMarkup(country) {
  const { name, flags, capital, population, languages } = country;
  const langs = Object.values(languages);
  return `<div>
                <img alt = "${name.common} flag" 
                    src = "${flags.svg}" 
                    width="50"> 
                <p>${name.common}</p>
            </div>
            <p>Official name:  
                <span>${name.official}</span>
            </p>
            <p>Capital:  
                <span>${capital}</span>
            </p>
            <p>Population:  
                <span>${population}</span>
            </p>
            <p>Langueges:  
                <span>${langs.toString().replaceAll(', ')}</span>
            </p>`;
}
