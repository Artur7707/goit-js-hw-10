export function fetchCountries(value) {
  const name = `https://restcountries.com/v3.1/name/${value}?fields=name,capital,population,flags,languages`;
  return fetch(name).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
