var UiCampoItem = {
  campo_id: 0,
  isFirstImg: true,
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
    UiCampoItem.campo_id = app.getUrlVars().campo_id;
    this.loadCampo(UiCampoItem.campo_id);
    this.listCanchas();
    $("#fecha-disponible").attr('min', app.dateToString(new Date()));
    $("#fecha-disponible").val(app.dateToString(new Date()));
    this.listHoras();
    $("#campos-disponible").change(this.onchangeCampo);
    $("#fecha-disponible").change(this.onchangeFecha);
    $("#horas-disponible").change(this.onchangeHora);
    $("#btnReservar").click(this.onclickReservar);
    $("#btnUbicanos").click(this.ubicanos);
  },

  ubicanos: function(e){
    e.preventDefault();
    var ref = cordova.InAppBrowser.open("https://www.google.com/maps/search/?api=1&query=" + UiCampoItem.campoData.lat + "," + UiCampoItem.campoData.lng);
  },

  onchangeHora: function(){
    var precio = $("#horas-disponible option:selected").attr("precio");
    if(precio == null){
      $(".precio-campo h3").text("");
    }else{
      $(".precio-campo h3").text("S/ " + $("#horas-disponible option:selected").attr("precio"));
      Culqi.close();
      Culqi.getSettings.amount = $("#horas-disponible option:selected").attr("precio") * 100;
    }
  },

  execReserva: function(token){
    var data = {
      "fecha" : $("#fecha-disponible").val(),
      "horas" : $("#horas-disponible option:selected").text(),
      "precio" : $("#horas-disponible option:selected").attr("precio").replace("S/ ", ""),
      "campo_cancha_id" : $("#campos-disponible").val(),
      "cancha_horario_dia_horas_id" : $("#horas-disponible").val(),
      "culqi_token": token
    };

    $.ajax({
      url: constants.end_point + "/canchareservadaapi/add",
      type:'POST',
      headers: { 'Authorization': window.localStorage.getItem("token") },
      dataType: "json",
      data: data,
      success: function(data) {
          console.log(data);
        if(!$.isEmptyObject(data.error)){
          Toast.fire({
            icon: 'error',
            title: data.error
          });
        }else{
          window.location = "campo-confirmacion.html?cancha_reservada_id=" + data.data.cancha_reservada_id;
        }
      }
    });
  },

  onclickReservar: function(event){
    
    if(UiCampoItem.validarReserva()){
      /*Culqi.settings({
        title: 'GameOn',
        currency: 'PEN',
        description: 'Reserva de Campo',
        amount: 125 //$("#horas-disponible option:selected").attr("precio")
      });*/
      //Culqi.getSettings.amount = $("#horas-disponible option:selected").attr("precio");
      Culqi.open();
      event.preventDefault();
      
    }
  },

  validarReserva: function(){
    if($("#campos-disponible").val() == ""){
      Toast.fire({
        icon: 'error',
        title: 'Por favor seleccionar un campo.'
      });
      return false;
    }

    if($("#fecha-disponible").val() == ""){
      Toast.fire({
        icon: 'error',
        title: 'Por favor seleccionar una fecha.'
      });
      return false;
    }

    if($("#horas-disponible").val() == ""){
      Toast.fire({
        icon: 'error',
        title: 'Por favor seleccionar una hora.'
      });
      return false;
    }

    return true;
  },

  onchangeCampo: function(event){
    UiCampoItem.listHoras();
  },

  onchangeFecha: function(event){
    UiCampoItem.listHoras();
  },
  
  listCanchas: function(){
    $.ajax({
      url: constants.end_point + "/campocanchaapi/list_by_campo?campo_id=" + UiCampoItem.campo_id + "&deporte_id=" + 
      (
        app.getFilters() == null 
        ? (app.getUserSession().deporte_id_default == null || app.getUserSession().deporte_id_default == "" ? $("#deporte").val() : app.getUserSession().deporte_id_default) 
        : app.getFilters().deporte
      ),
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $("#campos-disponible").empty();
          /*$("#campos-disponible").append(
            $("<option value=''>").text("")
          );*/
          data.data.forEach(row => {
            $("#campos-disponible").append(
              $("<option value='" + row.campo_cancha_id + "'>").text(row.nombre)
            );
          });

          $("#campos-disponible").change();
        }        
      }
    });
  },

  listHoras: function(){
    $.ajax({
      url: constants.end_point + "/canchahorariodiahoraapi/list_by_campo_cancha_fecha?campo_cancha_id=" + $("#campos-disponible").val() +
      "&fecha=" + $("#fecha-disponible").val(),
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $("#horas-disponible").empty();
          /*$("#horas-disponible").append(
            $("<option value=''>").text("")
          );*/
          data.data.forEach(row => {
            $("#horas-disponible").append(
              $("<option precio='" + row.precio + "' value='" + row.cancha_horario_dia_horas_id + "'>").text(row.rango_hora)
            );
          });

          $("#horas-disponible").change();
        }        
      }
    });
  },

  applyCulqiSettings: function(){
    Culqi.settings({
        title: 'GameOn',
        currency: 'PEN',
        description: 'Reserva de Campo',
        amount: 125 //$("#horas-disponible option:selected").attr("precio")
    });
  },

  setCulqiApiKey: function(){
    Culqi.publicKey = 'pk_test_e28a176cb619e2b8';//sk_test_c789df4a4aea8719
  },

  loadCampo: function (id) {
    $.ajax({
      url: constants.end_point + "/campoapi/get?id=" + id + "&deporte_id=" + 
      (
        app.getFilters() == null 
        ? (app.getUserSession().deporte_id_default == null || app.getUserSession().deporte_id_default == "" ? $("#deporte").val() : app.getUserSession().deporte_id_default) 
        : app.getFilters().deporte
      ),
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          UiCampoItem.campoData = data.data;
          $(".texto-adicional-campo").html(data.data.datos_adicionales.replace(/\n/g, "<br/>"));
          $(".nombre-campo h1").text(data.data.nombre);
          $(".deporte-campo h3").text(data.data.deporte_nombre);
          $(".ubicacion-campo h3").text(data.data.distrito_name);
          $(".precio-campo h3").text("");
          UiCampoItem.setCulqiApiKey();
          UiCampoItem.applyCulqiSettings();
        }        
      }
    });

    $.ajax({
      url: constants.end_point + "/campoapi/get_imagenes?id=" + id,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          UiCampoItem.buildCarousel(data.data);
        }        
      }
    });
  },

  buildCarousel: function(data){
    data.forEach(img => {
      $("#slider-campo .carousel-inner").append(
        $("<div class='carousel-item " + (UiCampoItem.isFirstImg ? "active" : "") + "'>").append(
          $("<div class='container align-text-bottom' style='background-image: url(" + constants.assets_external + "/img/campos_img/" + img.imagen + ");'>")
        )
      );
      UiCampoItem.isFirstImg = false;
    });
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

UiCampoItem.initialize();

function culqi() {
  if (Culqi.token) { // ¡Objeto Token creado exitosamente!
    UiCampoItem.execReserva(Culqi.token.id);
  } else { // ¡Hubo algún problema!
    Toast.fire({
      icon: 'error',
      title: Culqi.error.user_message
    });
  }
};