var UiPrincipal = {
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
    $(".gameon-ultimo").click(this.irUltimoPartido);
    $(".gameon-proximo").click(this.irProximoPartido);
    $(".gameon-estrella").click(this.irCampoFrecuente);
    this.load();
  },

  irUltimoPartido: function () {
    $.ajax({
      url: constants.end_point + "/partidoapi/get_ultimo_partido",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(data.data == null){
            Toast.fire({
              icon: 'info',
              title: "Aún no has asistido a un partido. Qué esperas para unirte!!"
            });
          }else{
            window.location = "grupo-item.html?partido_id=" + data.data.partido_id;
          }
          
        }        
      }
    });
  },

  irProximoPartido: function () {
    $.ajax({
      url: constants.end_point + "/partidoapi/get_proximo_partido",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(data.data == null){
            Toast.fire({
              icon: 'info',
              title: "No tienes partido definido. Qué esperas para reservar el próximo!!"
            });
          }else{
            window.location = "grupo-item.html?partido_id=" + data.data.partido_id;
          }
        }        
      }
    });
  },

  irCampoFrecuente: function () {
    $.ajax({
      url: constants.end_point + "/campoapi/get_campo_frecuente",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(data.data != null){
            window.location = "campo-item.html?campo_id=" + data.data.campo_id;
          }else{
            Toast.fire({
              icon: 'info',
              title: "Aún no haz hecho una reserva. Qué esperas para hacerlo!!"
            });
          }
        }        
      }
    });
  },

  load: function () {
    $.ajax({
      url: constants.end_point + "/promocionapi/get",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          UiPrincipal.buildCarousel(data.data);
        }        
      }
    });
  },

  buildCarousel: function(data){
    var index = 0;
    data.forEach(img => {
      $("#slider-avisos .carousel-inner").append(
        $("<li data-target=0#slider-avisos' data-slide-to='" + index + "' " + (index == 0 ? "class='active'" : "") + ">")
      );
      $("#slider-avisos .carousel-inner").append(
        $("<div class='carousel-item " + (UiPrincipal.isFirstImg ? "active" : "") + "'>").append(
          $("<div class='container align-text-bottom' style='background-image: url(" + constants.assets_external + "/img/promociones_img/" + img.imagen + ");'>").append(
            $("<div class='row'>").append($("<div class='col'>").append($("<h2>").text(img.subtitulo)).append($("<h1>").text(img.titulo)))
          )
        )
      );
      UiPrincipal.isFirstImg = false;
      index++;
    });
  },
};

UiPrincipal.initialize();