
var UiCuadroMapa = {
  campo_id: 0,
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
    UiCuadroMapa.campo_id = app.getUrlVars().campo_id;
    this.loadCampo(UiCuadroMapa.campo_id);
    $("#btnReservar").click(UiCuadroMapa.reservar);
    $("#btnCerrar").click(UiCuadroMapa.cerrar);
  },

  reservar: function(){
    window.parent.window.location = "campo-item.html?campo_id=" + UiCuadroMapa.campo_id;
  },

  cerrar: function(){
    window.parent.UiCampo.htmlInfoWindowCurrent.close();
  },

  loadCampo: function (id) {
    $.ajax({
      url: constants.end_point + "/campoapi/get?id=" + id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(data.data.imagen == null){
            $(".imagen-campo").css("background-image", "none");
          }else{
            $(".imagen-campo").css("background-image", "url('" + constants.assets_external + "/img/campos_img/" + data.data.imagen + "')");
          }
          $(".info-campo .nombre").text(data.data.nombre);
          $(".info-campo .deportes").text(data.data.deporte_nombre);
          $(".info-campo .ubicacion").text(data.data.distrito_name);
        }        
      }
    });
  }
};

UiCuadroMapa.initialize();