const BASE_URL = 'https://swapi.dev/api/planets/';
const planetList = [];

// function to fetch planet data and add to planetList array
async function fetchPlanets(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    data.results.forEach(planet => {
      const { name, diameter, gravity, climate, population } = planet;
      planetList.push({ name, diameter, gravity, climate, population });
    });

    if (data.next) {
      await fetchPlanets(data.next);
    } else {
      const csvData = planetList.map(planet => Object.values(planet).join(','));
      csvData.unshift('Name,Diameter,Gravity,Climate,Population');
      const csvContent = csvData.join('\n');
      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(csvBlob);
      link.setAttribute('download', 'planets.csv');
      document.body.appendChild(link);
      link.click();
    }
  } catch (error) {
    console.error(error);
  }
}

// fetch planet data and handle errors using the catch method
fetch(BASE_URL)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    return res.json();
  })
  .then(data => fetchPlanets(data.next))
  .catch(error => console.error(error));
