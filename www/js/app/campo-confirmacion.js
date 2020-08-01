var UiCampoConfirmacion = {
  cancha_reservada_id: 0,
  campoData: null,
  // Application Constructor
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
    $("#btnUbicanos").click(this.ubicanos);
    $("#btnCrearGrupo").click(this.crearGrupo);
    UiCampoConfirmacion.cancha_reservada_id = app.getUrlVars().cancha_reservada_id;
    this.loadReserva(UiCampoConfirmacion.cancha_reservada_id);
  },

  ubicanos: function(e){
    e.preventDefault();
    var ref = cordova.InAppBrowser.open("https://www.google.com/maps/search/?api=1&query=" + UiCampoConfirmacion.campoData.lat + "," + UiCampoConfirmacion.campoData.lng);
  },

  crearGrupo: function(e){
    window.location = "grupo-crear.html?cancha_reservada_id=" + UiCampoConfirmacion.cancha_reservada_id + "&deporte_id=" + UiCampoConfirmacion.campoData.deporte_id
  },

  loadReserva: function (id) {
    $.ajax({
      url: constants.end_point + "/canchareservadaapi/get_cancha_reservada?cancha_reservada_id=" + id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
         $(".deporte-usuario").text(data.data.deporte_nombre);
         $(".nombre-campo").text(data.data.nombre);
         $(".fecha-reserva").text(data.data.fecha);
         $(".horario-reserva").text(data.data.rango_hora);
         $(".direccion-reserva").text(data.data.ubicacion);
         UiCampoConfirmacion.campoData = data.data;
         
        }        
      }
    });
  },
};

UiCampoConfirmacion.initialize();