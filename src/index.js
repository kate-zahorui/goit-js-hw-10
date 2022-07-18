import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const onCountrySearch = function () {
  let name = refs.input.value.trim();
  clearCountryMarkup();
  if (name === '') {
    return;
  }

  fetchCountries(name).then(result => {
    const countryArray = result;
    if (countryArray.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
    } else if (countryArray.length <= 10 && countryArray.length >= 2) {
      createCountryListMarkup(countryArray);
    } else if (countryArray.length === 1) {
      createCountryInfoMarkup(countryArray);
    }
  });
};

const createCountryListMarkup = function (countryArray) {
  const countryMarkup = countryArray
    .map(country => {
      return `<li class="country-list__item">
      <img class="country-list__image" src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" />
      <span class="country-list__name">${country.name.official}</span></li>`;
    })
    .join('');
  refs.countryList.insertAdjacentHTML('beforeend', countryMarkup);
};

const createCountryInfoMarkup = function (countryArray) {
  const {
    name: { official },
    capital,
    population,
    flags: { svg },
    languages,
  } = countryArray[0];

  const countryLanguages = Object.values(languages).join(', ');

  const countryInfoMarkup = `<div class="country-info__title"><img class="country-info__image" src="${svg}" alt="Flag of ${official}" width="50" />
      <h1 class="country-info__name">${official}</h1></div>
      <ul class="country-info__list">
      <li class="country-info__item"><b>Capital: </b>${capital}</li>
      <li class="country-info__item"><b>Population: </b>${population}</li>
      <li class="country-info__item"><b>Languages: </b>${countryLanguages}</li>
      </ul>`;
  refs.countryInfo.insertAdjacentHTML('beforeend', countryInfoMarkup);
};

const clearCountryMarkup = function () {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
};

refs.input.addEventListener('input', debounce(onCountrySearch, DEBOUNCE_DELAY));
