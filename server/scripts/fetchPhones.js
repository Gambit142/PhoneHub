const fs = require('fs');
const fetch = require('node-fetch'); // Make sure this is installed

const brands = {
  Nokia: 120,
  Samsung: 9,
  Xiaomi: 80,
  Google: 107,
  Apple: 48,
};

const headers = {
  'x-rapidapi-key': 'c9051e281bmshdc893edc46d5010p1fc4e1jsn32d5439620e7',
  'x-rapidapi-host': 'mobile-phones2.p.rapidapi.com',
};

const getPhonesByBrand = async (brandId, brandName) => {
  const url = `https://mobile-phones2.p.rapidapi.com/${brandId}/phones`;
  const res = await fetch(url, { headers });

  if (!res.ok) {
    const text = await res.text();
    console.error(`❌ API error for ${brandName}: HTTP ${res.status} - ${text}`);
    return null;
  }

  return res.json(); // Raw data
};

(async () => {
  const results = {};

  for (const [brandName, brandId] of Object.entries(brands)) {
    try {
      const data = await getPhonesByBrand(brandId, brandName);
      if (data) {
        results[brandName] = data;
      }
    } catch (error) {
      console.error(`❌ Failed to fetch data for ${brandName}:`, error.message);
    }
  }

  fs.writeFileSync('phones.json', JSON.stringify(results, null, 2));
  console.log('✅ Raw API data saved to phones.json');
})();
