
var UiUsuarioGrupos = {
  isFirstImg: true,
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
    this.load();
  },

  load: function () {
    $.ajax({
      url: constants.end_point + "/partidoapi/mis_partidos",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          for(var xI=0;xI<data.data.length;xI++){
            var row = data.data[xI];
            var campo = $("#tmpl-campo").clone();
            var html = campo.html();
            if(row.imagen == null){
              html = html.replace("[campo_img]",  "img/no-reservado-34.png");
            }else{
              html = html.replace("[campo_img]",  constants.assets_external + "/img/partidos_img/" + row.imagen);
            }
            html = html.replace("[partido_id]",  row.partido_id);
            html = html.replace("[nombre]",  row.nombre);
            html = html.replace("[deporte]",  row.deporte_nombre);
            html = html.replace("[fecha]",  row.fecha_desde == null ? "" : row.fecha_desde);
            html = html.replace("[organizador]",  row.usuario_nombre);
            html = html.replace("[reservado]",  row.cancha_reservada_id == 0 ? "" : "activo");
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-campos").append(campo);
          }
        }        
      }
    });
  },
};

UiUsuarioGrupos.initialize();