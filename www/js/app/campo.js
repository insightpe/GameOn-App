var UiCampo = {
  // Application Constructor
  map: null,
  position: null,
  marker: null,
  campos: null,
  htmlInfoWindowCurrent: null,
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
    $("#campo-mapa-tab").click(this.onclickCampoMapaTab);
    this.loadCampos();
  },

  onclickCampoMapaTab: function(event){
    navigator.geolocation.getCurrentPosition(UiCampo.onSuccessGeolocation, UiCampo.onErrorGeolocation, { enableHighAccuracy: true });

    /*setTimeout(() => {
      plugin.google.maps.environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': constants.map_api_key,
        'API_KEY_FOR_BROWSER_DEBUG': constants.map_api_key  // optional
      });
  
      var mapDiv = document.getElementById("map_canvas");
  
      var map = plugin.google.maps.Map.getMap(mapDiv);
      map.one(plugin.google.maps.event.MAP_READY, UiCampo.onMapInit);
    }, 250);*/
  },

  onErrorGeolocation: function(error){
    Toast.fire({
      icon: 'error',
      title: error.code + ": " + error.message
    });
  },

  onSuccessGeolocation: function(position){
    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    UiCampo.map = map = new google.maps.Map
    (document.getElementById("map_canvas"), mapOptions);
  
    UiCampo.position = position;
    UiCampo.onMapInit(UiCampo.map)
    /*
    UiCampo.map
    var latLong = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: latLong
    });

    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(marker.getPosition());*/


/*
    setTimeout(() => {
      plugin.google.maps.environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': constants.map_api_key,
        'API_KEY_FOR_BROWSER_DEBUG': constants.map_api_key  // optional
      });
      UiCampo.position = position;
      var mapDiv = document.getElementById("map_canvas");
  
      UiCampo.map = plugin.google.maps.Map.getMap(mapDiv);
      UiCampo.map.one(plugin.google.maps.event.MAP_READY, UiCampo.onMapInit);
    }, 250);*/

    
  },
  
  loadCampos: function () {
    var deporte = "";
    var provincia = "";
    var distrito = "";

    if(app.getFilters() != null && app.getFilters().categoria == "1"){
      deporte = app.getFilters().deporte;
      provincia = app.getFilters().provincia;
      distrito = app.getFilters().distrito;
    }

    $.ajax({
      url: constants.end_point + "/campoapi/list?deporte=" + deporte + "&provincia=" + provincia + "&distrito=" + distrito,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          UiCampo.campos = data.data;
          $("#sec-campos").empty();
          for(var xI=0;xI<data.data.length;xI++){
            var row = data.data[xI];
            var campo = $("#tmpl-campo").clone();
            var html = campo.html();
            html = html.replace("[campo_img]",  constants.assets_external + "/img/campos_img/" + row.imagen);
            html = html.replace("[nombre]",  row.nombre);
            html = html.replace("[deporte_nombre]",  (row.deporte_nombre == null ? "" : row.deporte_nombre));
            html = html.replace("[ubicacion]",  row.distrito_name);
            html = html.replace("[campo_id]",  row.campo_id);
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-campos").append(campo);
          }

          if(data.data.length == 0){
            $("#sec-campos").text("Upss aun no hay canchas disponibles para el lugar solicitado.");
          }
        }       

      }
    });
/*
    
    */
  },

  onMapInit: function(map) {
    UiCampo.marker = new google.maps.Marker({
      'position': {lat: UiCampo.position.coords.latitude, lng: UiCampo.position.coords.longitude},
      'icon': {
        url: "img/map-mi-ubicacion-40.png"
      },
      map:UiCampo.map
    });

    UiCampo.campos.forEach(row => {
      var htmlInfoWindow = new google.maps.InfoWindow();

      var iframe = document.createElement("iframe");
      iframe.setAttribute("style", "width:90vw;height:100%;border:0px");
  
      iframe.setAttribute("src", "cuadro-mapa.html?campo_id=" + row.campo_id);
      iframe.setAttribute("frameboarder", "0");

      htmlInfoWindow.setContent(iframe);

      var marker = new google.maps.Marker({
        'position': {lat: Number(row.lat), lng: Number(row.lng)},
        //'title': row.nombre,
        'icon': {
          url: "img/gameon-g-maps.png"
        },
        map: UiCampo.map
      });

      marker.addListener("click", function() {
        htmlInfoWindow.open(UiCampo.map, marker);
        UiCampo.htmlInfoWindowCurrent = htmlInfoWindow;
      });
      //marker.trigger(plugin.google.maps.event.MARKER_CLICK);
    });

    UiCampo.map.setZoom(15);
    UiCampo.map.setCenter({lat: Number(UiCampo.position.coords.latitude), lng: Number(UiCampo.position.coords.longitude)});
    
/*
    UiCampo.map.animateCamera({
      target: {lat: UiCampo.position.coords.latitude, lng: UiCampo.position.coords.longitude},
      zoom: 17,
      tilt: 60,
      bearing: 140,
      duration: 1000
    }, function() {
      //alert("Camera target has been changed");
    });*/
  },

  validateLogin: function (login) {
    if (login.usuario == null || login.usuario.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar un correo electrónico.'
      });
      return false;
    }

    if (login.contraseña == null || login.contraseña.trim() == "") {
      Toast.fire({
        icon: 'error',
        title: 'Por favor ingresar una contraseña.'
      });
      return false;
    }

    return true;
  }
};

UiCampo.initialize();