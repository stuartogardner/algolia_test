const algoliasearch = require('algoliasearch');

const client = algoliasearch("QTIVVA2CJJ", "2ca63924ae5968139f31034a5710e827");
const index = client.initIndex('restaurant-list-combined');

const originalList = require('./resources/dataset/restaurants_list.json');
const additionalInfo = require('./resources/dataset/extra_restaurant_info.json');

function join(lookupTable, mainTable, lookupKey, mainKey, select) {
  let l = lookupTable.length,
      m = mainTable.length,
      lookupIndex = [],
      output = [];
  for (let i = 0; i < l; i++) { // loop through l items
      let row = lookupTable[i];
      lookupIndex[row[lookupKey]] = row; // create an index for lookup table
  }
  for (let j = 0; j < m; j++) { // loop through m items
      let y = mainTable[j];
      let x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
      output.push(select(y, x)); // select only the columns you need
  }
  return output;
};

const objects = join(additionalInfo, originalList, "objectID", "objectID", function(original, additional) {
  return {
      objectID: original.objectID,
      name: original.name,
      address: original.address,
      area: original.area,
      city: original.city,
      country: original.country,
      dining_style: additional.dining_style,
      food_type: additional.food_type,
      image_url: original.image_url,
      mobile_reserve_url: original.mobile_reserve_url,
      neighborhood: additional.neighborhood,
      payment_options: original.payment_options,
      phone: original.phone,
      postal_code: original.postal_code,
      price: original.price,
      price_range: additional.price_range,
      reserve_url: original.reserve_url,
      reviews_count: additional.reviews_count,
      stars_count: additional.stars_count,
      stars_count_rounded: Math.floor(additional.stars_count),
      state: original.state,
      _geoloc: original._geoloc
  };
});


index.addObjects(objects, function(err, content) {
    console.log(content);
    console.log('success');
  });

  