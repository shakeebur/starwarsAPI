const BASE_URL = 'https://swapi.dev/api/planets/';
const planetList = [];
// using try catch to avoid errors
async function Planets(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();

    data.results.forEach(planet => {
      const { name, diameter, gravity, climate, population } = planet;

      // Here im checking for the unknown fields
      if (diameter !== 'unknown' && gravity !== 'unknown' && climate !== 'unknown' && population !== 'unknown') {
        planetList.push({ name, diameter, gravity, climate, population });
      }
    });

    if (data.next) {
      await Planets(data.next);
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

Planets(BASE_URL);
