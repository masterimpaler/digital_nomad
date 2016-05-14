$(function() {

  // globals
  var bookingAPIData = {};
  var availableHotels = [];

  const dollarShillingRate = 100.70;

  var popularListing = $('.popular-property').parent();
  $('#popular-properties .row').append( popularListing.clone() );
  $('#popular-properties .row').append( popularListing.clone() );

  var $availableRoom = $('.avialable-room-details');
  for (var i = 0; i < 5; i++)
    $('#available-rooms>ul').append( $availableRoom.clone() );

  // $('#view-rooms-modal').modal();
  // handlebars helpers for hotels and rooms
  Handlebars.registerHelper('getHotelPhoto', function(hotelPhotosArray) {
    return hotelPhotosArray[0].url_max300;
  });

  Handlebars.registerHelper('getNumberOfRooms', function(room) {
    return room.length;
  });

  Handlebars.registerHelper('getRoomBedNumber', function(roomBedding) {
    return roomBedding.beds.length;
  });

  Handlebars.registerHelper('getPriceInShillings', function(priceInDollars) {
    var priceInShillings = priceInDollars * dollarShillingRate;
    return priceInShillings.toLocaleString();
  });

  // hotel template
  var hotelSource = $('#hotel-template').html();
  var hotelTemplate = Handlebars.compile(hotelSource);

  // rooms template
  var roomSource = $('#available-room-template').html();
  var roomTemplate = Handlebars.compile(roomSource);

  // View Rooms
  $('#listed-properties').on('click', '.view-rooms', function() {
    var hotelId = $(this).data('hotel-id');
    var hotelData = availableHotels.filter(function(element) { return element.hotel_id == hotelId })[0];
    var roomsData = hotelData.rooms;
    roomsData.forEach(function(room) {
      room.beddingDetails = room.bedding.beds;
      room.hotelImage = hotelData.photos[0].url_original;
    });
    console.log(roomsData);
    var html = roomTemplate({ rooms: roomsData });
    $('#available-rooms>ul').html( html );
    $('#view-rooms-modal').modal();
  });

  // get the hotels in the trip location
  // $.getJSON('http://10.62.0.180:3000/hotels\?city\=Nairobi\&checkin\=2016-08-04\&checkout\=2016-08-15', function(data) {
  // $.getJSON('http://localhost/digital_nomad/data/hotels.json', function(data) {
  $.getJSON('http://localhost:8000/digital_nomad/data/hotels.json', function(data) {
    bookingAPIData = data;
    availableHotels = bookingAPIData.hotels;

    var html = hotelTemplate({ hotels : availableHotels });
    $('#listed-properties ul').html(html);
  });
});
