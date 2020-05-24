window.onload = function() {
    //
    initMap();




}


var mymap;
var markers = [];
var infoWindow;

//it wiill start the map
function initMap() {

    mymap = L.map('map').setView([-23.5453, -46.3116], 11);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoidmlubnkzODAiLCJhIjoiY2s5OHhvZHA3MW04czNubjFoOXE5dWppbyJ9.F0QnNYT1zs8ZCGnwSwXLDg'
    }).addTo(mymap);

    searchStores();

}



function seyOnClickListener() {
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index) {
        elem.addEventListener('click', function() {
            new markers[index].on('click', markers[index].openPopup());
        })
    })
}



function searchStores() {
    var foundStores = [];
    var zipcode = document.getElementById('zip-code-input').value;
    if (zipcode) {
        for (var store of stores) {
            var postal = store['address']['postalCode'].substring(0, 5);
            if (postal == zipcode) {
                foundStores.push(store);
            }
        }
    } else {
        foundStores = stores
    }
    clearLocatios();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    seyOnClickListener();
}



function clearLocatios() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].remove();
    }
    markers.length = 0;

}


function displayStores(stores) {
    storesHtml = '';
    for (var [index, store] of stores.entries()) {
        var address = store['addressLines']
        var phone = store['phoneNumber']
        storesHtml += `
        
           
                <div class="store-container">
                  <div class="store-container-background">
                    <div class="store-info-container">
                         <div class="store-address">
                            <span> ${address[0]} </span>
                            <span> ${address[1]} </span>
                         </div>
                         <div class="store-phone-number">${phone}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                        ${index += 1}
                        </div>
                    </div>
                  </div>
                </div>
            
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}

function showStoresMarkers(stores) {
    var bounds = L.latLngBounds();
    for (var [index, store] of stores.entries()) {

        var latlng = L.latLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);


        var name = store["name"];
        var address = store["addressLines"][0];
        var phone = store['phoneNumber']
        var openStatusText = store['openStatusText']
        bounds.extend(latlng)
        var str = latlng.toString()
        createMarker(latlng, name, address, index + 1, phone, openStatusText, str);

    }
    mymap.fitBounds(bounds)


}



function createMarker(latlng, name, address, index, phone, openStatusText, str) {

    var html = `
    <div class="store-info-window">
      <div class="store-info-name">
        ${name}
      </div>
      <div class ="store-info-status">
        ${openStatusText}
      </div>
      <div class="store-info-address">
        <div class="circle">
          <i class="fas fa-location-arrow"></i>  
        </div>
        ${address}
      </div>
      <div class="store-info-number">
        <div class="circle">
          <i class="fas fa-phone-alt"></i>
        </div>
        ${phone}
        
      </div>
     
      <div class="directions">
        Directions to store
        <a href="https://www.google.com/maps/dir/home/${str.substring(6)}" target="_blank">
        <i class="fas fa-arrow-circle-right"></i>
        </a>
      </div>
    
    </div>

    `;



    var marker = new L.marker(latlng).addTo(mymap)
        .bindPopup(html)


    .openPopup();


    markers.push(marker);



}