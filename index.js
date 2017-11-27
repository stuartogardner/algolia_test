$(document).ready(function(){

// start of geolocation

  let userLat;
  let userLong;
  let userCoords;

  function getLocation() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
      } 
  }
  
  function showPosition(position) {
      userLat = position.coords.latitude;
      userLong = position.coords.longitude;
      userCoords = `${userLat}, ${userLong}`
  }

  getLocation();

// end of geolocation

const client = algoliasearch("QTIVVA2CJJ", "2ca63924ae5968139f31034a5710e827");
const helper = algoliasearchHelper(client, "restaurant-list-combined", {
    facets: ['price_range', 'food_type', 'stars_count', 'stars_count_rounded']
});

helper.on('result', function(content) {
    renderFacetList(content);    
    renderHits(content);
  });
  
// show restaurant results

  function renderHits(content) {
    $('.results').html(function() {
      $('.results').before(`<h3 class="num-results"><span class="underline-background">${content.nbHits} results found<span class="search-time"> in ${content.processingTimeMS/1000} seconds &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span></span></h3>`);
        return $.map(content.hits, function(hit) {
          return `</br><div class="result-card">
            <div>
                <img class="result-card-image" src="${hit.image_url}">
            </div>
            <div class="result-card-text">
                <h3 class="restaurant-name"> ${hit.name} </h3>
                <p class="restaurant-stars"><span class="restaurant-stars1">${hit.stars_count ? hit.stars_count : ''} &nbsp</span>${Math.round(hit.stars_count)===1 ?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'>`:
                Math.round(hit.stars_count)===2 ?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'>`:
                Math.round(hit.stars_count)===3 ?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'>`:
                Math.round(hit.stars_count)===4 ?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/star-empty.png'>`:
                Math.round(hit.stars_count)===5 ?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'>`:''        
              } <span class="restaurant-stars2"> &nbsp(${hit.reviews_count ? hit.reviews_count : ''} reviews)</span></p>
                <p class="restaurant-info">${hit.food_type ? hit.food_type + ' |' : ''} ${hit.neighborhood ? hit.neighborhood + ' |' : ''} ${hit.price_range ? hit.price_range : ''}</p>
            </div>
        </div>`;
        });
      });
  }

// toggle based on facets

  $('#filter').on('click', 'input[type=checkbox]', function(e) {
    $('.num-results').remove();
    let facetValue = $(this).data('facet');
    helper
    .toggleFacetRefinement('food_type', facetValue)
          .search();
  });

  $('#filter2').on('click', 'input[type=checkbox]', function(e) {
    $('.num-results').remove();
    let facetValue = $(this).data('facet');
    helper
    .toggleFacetRefinement('price_range', facetValue)
          .search();
  });

  $('#filter3').on('click', 'input[type=checkbox]', function(e) {
    $('.num-results').remove();
    let facetValue = $(this).data('facet');
    helper
    .toggleFacetRefinement('stars_count_rounded', facetValue)
          .search();
  });

// render facet lists

  function renderFacetList(content) {
      $('#filter').html(function() {

        return $.map(content.getFacetValues('food_type'), function(facet) {
          let checkbox = $('<input type=checkbox>')
            .data('facet', facet.name)
            .attr('id', 'fl-' + facet.name);
          if(facet.isRefined) checkbox.attr('checked', 'checked');
          let labelLeft = $('<label>').html(facet.name)
                                  .attr('for', 'fl-' + facet.name)
                                  .attr('class','left-label');
          let labelRight = $('<label>').html('(' + facet.count + ')')
                                  .attr('for', 'fl-' + facet.name)
                                  .attr('class','right-label');

          let labels = $(`<div class="click-label" for="fl-${facet.name}">`).append(labelLeft).append(labelRight);
        
        return $('<li class="food-li">').append(checkbox).append(labels);
        });
      });

      $('#filter2').html(function() {

        return $.map(content.getFacetValues('price_range'), function(facet) {
          let checkbox = $('<input type=checkbox>')
            .data('facet', facet.name)
            .attr('id', 'fl-' + facet.name);
          if(facet.isRefined) checkbox.attr('checked', 'checked');
          let labelLeft = $('<label>').html(facet.name)
                                  .attr('for', 'fl-' + facet.name)
                                  .attr('class','left-label');
          let labelRight = $('<label>').html('(' + facet.count + ')')
                                  .attr('for', 'fl-' + facet.name)
                                  .attr('class','right-label');

          let labels = $('<div>').append(labelLeft).append(labelRight);
        
        return $('<li class="price-li">').append(checkbox).append(labels);
        });
      });
      

  $('#filter3').html(function() {
    let starCount = content.getFacetValues('stars_count_rounded');
    let sortedStars = starCount.map((el)=>el.name).sort();
  return $.map(sortedStars, function(facet) {
    let checkbox = $('<input type=checkbox>')
      .data('facet', facet)
      .attr('id', 'fl-' + facet);
    if(facet.isRefined) checkbox.attr('checked', 'checked');
    let label = $('<label>').html(
      `${facet==='1'?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'>`:
        facet==='2'?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'>`:
        facet==='3'?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/star-empty.png'><img class="star" src='resources/graphics/star-empty.png'>`:
        facet==='4'?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/star-empty.png'>`:
        facet==='5'?`<img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'><img class="star" src='resources/graphics/stars-plain.png'>`:''        
      }`)
                            .attr('for', 'fl-' + facet);
    return $('<li class="star-li">').append(checkbox).append(label);
    });
  });

}
  
// when typing, edit search

  $('.searchbar').on('keyup', function() {
    $('.num-results').remove();
    helper.setQueryParameter('aroundLatLng', userCoords);    
    helper.setQuery($(this).val())
          .search();
  });

  helper.search();
  
});