
var UiUsuarioCampo = {
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
      url: constants.end_point + "/canchareservadaapi/get_mis_canchas",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          for(var xI=0;xI<data.data.length;xI++){
            var row = data.data[xI];
            var campo = $("#tmpl-campo").clone();
            var html = campo.html();
            html = html.replace("[campo_img]",  constants.assets_external + "/img/campos_img/" + row.imagen);
            html = html.replace("[nombre]",  row.nombre);
            html = html.replace("[deporte_nombre]",  (row.deporte_nombre == null ? "" : row.deporte_nombre));
            html = html.replace("[ubicacion]",  row.ubicacion);
            html = html.replace("[campo_id]",  row.campo_id);
            html = html.replace("[precio]",  row.precio);
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-campos").append(campo);
          }
        }        
      }
    });
  },
};

UiUsuarioCampo.initialize();