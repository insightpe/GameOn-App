

var UiUsuarioNotificaciones = {
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
      url: constants.end_point + "/notificacionesapi/list?fecha_hora=" + new Date().toMysqlFormat(),
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          for(var xI=0;xI<data.data.length;xI++){
            var row = data.data[xI];
            var campo = $("#tmpl-notificaciones").clone();
            var html = campo.html();
            html = html.replace("[mensaje]",  row.mensaje);
            html = html.replace("[fecha_hora]",  row.fecha_hora);
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-notificaciones").append(campo);
          }
        }        
      }
    });
  },
};

UiUsuarioNotificaciones.initialize();