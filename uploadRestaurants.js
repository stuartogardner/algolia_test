const algoliasearch = require('algoliasearch');

const client = algoliasearch("QTIVVA2CJJ", "2ca63924ae5968139f31034a5710e827");
const index = client.initIndex('restaurant-list');

const objects = require('./resources/dataset/restaurants_list.json');

index.addObjects(objects, function(err, content) {
    console.log(content);
    console.log('success');
    
  });

  