const BASE_URL = 'https://swapi.dev/api/planets/';
const planetList = [];

async function fetchPlanets(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();

    data.results.forEach(planet => {
      const { name, diameter, gravity, climate, population } = planet;

      // Check if any of the relevant data fields are missing or unknown
      if (diameter !== 'unknown' && gravity !== 'unknown' && climate !== 'unknown' && population !== 'unknown') {
        planetList.push({ name, diameter, gravity, climate, population });
      }
    });

    if (data.next) {
      await fetchPlanets(data.next);
    } else {
      const csv = convertToCSV(planetList);
      downloadCSV(csv);
    }
  } catch (error) {
    console.error('Error fetching planet data:', error);
  }
}

function convertToCSV(arr) {
  const header = Object.keys(arr[0]).join(',');
  const rows = arr.map(obj => Object.values(obj).join(','));
  return [header, ...rows].join('\n');
}

function downloadCSV(csv) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', 'planet-data.csv');
  a.click();
}

fetchPlanets(BASE_URL);
