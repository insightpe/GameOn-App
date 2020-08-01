var app = {
  tagifyDeporte: null,
  applyBlockUI: true,
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },

  twoDigits: function(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  },

  addYears(years){
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + years, month, day);
    return c;
  },

  dateToDMYString: function(date){
    var dd = date.getDate();

    var mm = date.getMonth()+1; 
    var yyyy = date.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    return dd + '-' + mm + '-' + yyyy;
  },

  dateToString: function(date){
    var dd = date.getDate();

    var mm = date.getMonth()+1; 
    var yyyy = date.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    return yyyy + '-' + mm + '-' + dd;
  },

  datetimeToString: function(date){
    var dd = date.getDate();

    var mm = date.getMonth()+1; 
    var yyyy = date.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    }

    var hh = date.getHours();
    var mins = date.getMinutes();
    var ss = date.getSeconds();

    if(hh<10) 
    {
      hh='0'+hh;
    }
    if(mins<10) 
    {
      mins='0'+mins;
    }
    if(ss<10) 
    {
      ss='0'+ss;
    }
    return yyyy + '-' + mm + '-' + dd + " " + hh + ":" + mins + ":" + ss;
  },

  getUrlVars: function ()
  {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
      }
      return vars;
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
    Date.prototype.toMysqlFormat = function() {
        return this.getFullYear() + "-" + app.twoDigits(1 + this.getMonth()) + "-" + app.twoDigits(this.getDate()) + " " + app.twoDigits(this.getHours()) + ":" + app.twoDigits(this.getMinutes()) + ":" + app.twoDigits(this.getSeconds());
    };

    $.fn.serializeFormJSON = function () {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function () {
          if (o[this.name]) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
    };
    $.blockUI.defaults.baseZ = 9000;
    $.blockUI.defaults.css.backgroundColor = "transparent";
    $.blockUI.defaults.css.border = "0px";
    $.blockUI.defaults.message = '  <img class="responsive-img" src="img/loading.gif" width="128px" />';
    $(document).ajaxStart(
      function(e) {
        if($(e.currentTarget.activeElement).attr("id") != "btnSend"){
          if(app.applyBlockUI){
            $.blockUI();
            
          }
        }
      }
      
      ).ajaxStop(function(e){$.unblockUI(); app.applyBlockUI = true;});

    $(document).bind("ajaxError", function (evt, jqXHR, settings, err, arguments) {
      if (jqXHR.status == 200) {
          //location.reload();
          return;
      }
      /*if (jqXHR.status == 500 && settings.url) {
          swal({
              title: 'Error!',
              html: 'No se puede eliminar este registro ya que tiene dependencias. Elimine las dependencias e intente nuevamente',
              type: 'error',
              confirmButtonClass: "btn btn-success",
              buttonsStyling: false
          });
          return;
      }*/
      if (jqXHR.status == 401){
        window.localStorage.clear();
        Toast.fire({
          icon: 'error',
          title: 'Su sesión ha expirado, por favor inicie sesión nuevamente.',
          onClose: () => {
            window.location = "login.html";
          }
        }).then((result) => {
          window.location = "login.html";
        });  
      }else{
        Toast.fire({
          icon: 'error',
          title: 'Ha ocurrido un error, por favor intente de nuevo más tarde o comuníquese con el administrador del sistema.'
        });
      }
    });
    $("#btnFiltrar").click(app.filtrar);
    this.loadFilters();

    setInterval(function(){
      if(!window.location.toString().includes("grupo-chat.html") && !window.location.toString().includes("login.html")
        && !window.location.toString().includes("registro.html") && !window.location.toString().includes("recuperar-correo.html")
        && !window.location.toString().includes("recuperar-codigo.html") && !window.location.toString().includes("recuperar-contrasena.html")){
        app.chatMensajesNuevos();
      }
    }, 60000);
    
    if(window.localStorage.getItem("token") != null && window.localStorage.getItem("token") != ""){
      if($("#notificaciones .contador-numero").length > 0){
        app.notificacionesNuevas();
      }
  
      setInterval(function(){
        if($("#notificaciones .contador-numero").length > 0){
          app.notificacionesNuevas();
        }
      }, 60000);
    }
  },

  notificacionesNuevas: function(){
    app.applyBlockUI = false;
    $.ajax({
      url: constants.end_point + "/notificacionesapi/list_nuevos?fecha_hora=" + (new Date(new Date().getTime() - 60000)).toMysqlFormat(),
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $("#notificaciones .contador-numero").text(data.data.conteo);
        }else{
          $("#notificaciones .contador-numero").text(0);
        }
        if ($('#notificaciones .contador-numero').text() == '0') {
          $('#notificaciones').removeClass('gameon-pulso');
        } else {
          $('#notificaciones').addClass('gameon-pulso');
        }
      }
    });
  },

  chatMensajesNuevos: function(){
    app.applyBlockUI = false;
    $.ajax({
      url: constants.end_point + "/partidoapi/chat_mensajes_nuevos?fecha_hora=" + (new Date(new Date().getTime() - 60000)).toMysqlFormat(),
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(data.data != null){
            Toast.fire({
              icon: 'info',
              html: "Tienes un nuevo mensaje de chat recibido en el partido <a href='grupo-chat.html?partido_id=" + data.data.partido_id + "'>" + data.data.nombre + "</a>."
            });
            return;
          }
        }        
      }
    });
  },

  listarProvincias: function(){
    $.ajax({
      url: constants.end_point + "/campoapi/get_by_provincias",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(data.data != null){
            $("#provincia").empty();
            $("#provincia").append(
              $("<option selected value=''>").text("TODOS")
            );
            data.data.forEach(row => {
              $("#provincia").append(
                $("<option value='" + row.id + "'>").text(row.name)
              );
            });
          }
        }        
      }
    });
  },

  listarDistritos: function(){
    $.ajax({
      url: constants.end_point + "/campoapi/get_by_distritos?provincia_id=" + $("#provincia").val(),
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          if(data.data != null){
            $("#distrito").empty();
            $("#distrito").append(
              $("<option selected value=''>").text("TODOS")
            );
            var parser = new DOMParser;
            data.data.forEach(row => {
              var dom = parser.parseFromString(row.name,
                'text/html');
              $("#distrito").append(
                $("<option value='" + row.id + "'>").text(dom.body.textContent)
              );
            });
          }
        }      
      }
    });
  },

  filtrar: function(){
    var filters = {
      "categoria": $("#categoria").val(),
      "desde": $("#desde").val(),
      "hasta": $("#hasta").val(),
      "deporte": $("#deporte").val(),
      "provincia": $("#provincia").val(),
      "distrito": $("#distrito").val(),
      "reservado": $("#filtro-reserva").prop("checked"),
    };

    window.localStorage.setItem("filters", JSON.stringify(filters));
    if(filters.categoria == "1"){
      window.location = "campo.html";
    }else{
      window.location = "grupo.html?fromFilter=1";
    }
  },

  loadFilters: function(){
    if($("#deporte").length == 0){return;}

    if($("#provincia").length > 0){
      app.listarProvincias();
      $("#provincia").change(app.listarDistritos);
    }

    $.ajax({
      url: constants.end_point + "/deporteapi/list",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          data.data.forEach(row => {
            $("#deporte").append(
              $("<option value='" + row.deporte_id + "'>").text(row.nombre)
            );
          });

          /*var filters = JSON.parse(window.localStorage.getItem("filters"));
          if(filters != null){
            $("#categoria").val(filters.categoria);
            $("#desde").val(filters.desde);
            $("#hasta").val(filters.hasta);
            $("#deporte").val(filters.deporte);
            $("#filtro-reserva").prop("checked", filters.reservado == 1);
            $("#provincia").val(filters.provincia);
            $("#distrito").val(filters.distrito);
          }else{
            $("#categoria").val("1");
            $("#deporte").val(window.localStorage.getItem("deporte_id_default"));

            var filtersDefault = {
              "categoria": $("#categoria").val(),
              "desde": $("#desde").val(),
              "hasta": $("#hasta").val(),
              "deporte": $("#deporte").val(),
              "provincia": $("#provincia").val(),
              "distrito": $("#distrito").val(),
              "reservado": $("#filtro-reserva").prop("checked"),
            };
        
            window.localStorage.setItem("filters", JSON.stringify(filtersDefault));
          }*/
/*
          if($("#filtro-reserva").prop("checked") == true){
            $("#label-filtro-reserva").html("Reservado");
            $('.filtro-mostrar-lugar').addClass('activo');
            $('.filtro-mostrar-fechas').addClass('activo');
          }
          else if($("#filtro-reserva").prop("checked") == false){
            $("#label-filtro-reserva").html("No reservado");
            $('.filtro-mostrar-lugar').removeClass('activo');
            $('.filtro-mostrar-fechas').removeClass('activo');
            $("#lugar").val("");
          }*/
        }        
      }
    });

    /*$("#desde").attr('min', app.dateToString(new Date()));
    $("#hasta").attr('min', app.dateToString(new Date()));*/
    $("#desde").val(app.dateToString(new Date()));
    $("#hasta").val(app.dateToString(new Date()));
  },

  getFilters: function(){
    return JSON.parse(window.localStorage.getItem("filters"));
  },

  getUserSession: function(){
    var userSession = {
      deporte_id_default: window.localStorage.getItem("deporte_id_default"),
      user_id: window.localStorage.getItem("user_id"),
      user_name: window.localStorage.getItem("user_name"),
      nickname: window.localStorage.getItem("nickname"),
      user_email: window.localStorage.getItem("user_email"),
      user_role: window.localStorage.getItem("user_role"),
      user_img: window.localStorage.getItem("user_img"),
      es_google_login: window.localStorage.getItem("es_google_login"),
      es_facebook_login: window.localStorage.getItem("es_facebook_login"),
      token: window.localStorage.getItem("token"),
    };

    return userSession;
  }
};



app.initialize();