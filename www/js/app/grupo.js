var UiGrupo = {
  isFirstImg: true,
  deporte_id: null,
  todos_deportes: null,
  fromFilter: false,
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
    UiGrupo.fromFilter = (app.getUrlVars().fromFilter == "1");
    this.load();
    $("#filtro-deportes a").click(this.filterByDeporte);
  },

  load: function () {
    $.ajax({
      url: constants.end_point + "/deporteapi/list",
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          UiGrupo.buildFiltroDeportes(data.data);
        }        
      }
    });

    if(!UiGrupo.fromFilter){
      UiGrupo.deporte_id = "";
    }

    this.getPartidos();
    
    var semana = UiGrupo.dates(new Date());
    $.each(semana, function(i){
        var diasEs = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
        let html = "<li class='calendar-by-day' id='"+semana[i].mes+"-"+semana[i].dia+"-"+semana[i].ano+"'><span class='nombre-dia'>" +diasEs[semana[i].diaNom]+"</span> <span class='numero-dia'>"+semana[i].dia+"</span></li>";
        $("#semana").append(html);
    });
    $(".calendar-by-day").click(UiGrupo.onClickCalendarByDay);
    var multiploSemana=0;

    $( "#semana-adelante" ).click(function() {

        multiploSemana +=1;
        stop(multiploSemana);

        var semana = UiGrupo.dates(new Date(),7*multiploSemana);
        $("#semana").html('');
        $.each(semana, function(i){
            var diasEs = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
            let html = "<li class='calendar-by-day' id='"+semana[i].mes+"-"+semana[i].dia+"-"+semana[i].ano+"'><span class='nombre-dia'>" +diasEs[semana[i].diaNom]+"</span> <span class='numero-dia'>"+semana[i].dia+"</span></li>";
            $("#semana").append(html);
        });

        $(".calendar-by-day").click(UiGrupo.onClickCalendarByDay);
    });

    $( "#semana-atras" ).click(function() {

        multiploSemana -=1;
        stop(multiploSemana);

        var semana = UiGrupo.dates(new Date(),7*multiploSemana);
        $("#semana").html('');
        $.each(semana, function(i){
            var diasEs = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
            let html = "<li class='calendar-by-day' id='"+semana[i].mes+"-"+semana[i].dia+"-"+semana[i].ano+"'><span class='nombre-dia'>" +diasEs[semana[i].diaNom]+"</span> <span class='numero-dia'>"+semana[i].dia+"</span></li>";
            $("#semana").append(html);
        });

        $(".calendar-by-day").click(UiGrupo.onClickCalendarByDay);
    });

  },

  onClickCalendarByDay: function(e){
    $(".calendar-by-day").each(function(x,i){
      $(this).removeClass("activo");
    });
    $(this).addClass("activo");

    var filters = app.getFilters();
    filters.desde = app.dateToString(new Date($(this).attr("id")));
    filters.hasta = app.dateToString(new Date($(this).attr("id")));
    filters.categoria = 2;
    UiGrupo.fromFilter = true;
    filters.reservado = true;
    window.localStorage.setItem("filters", JSON.stringify(filters));
    UiGrupo.getPartidos();
  },

  dates: function(current, alternar) {
    var week= new Array();

    if (alternar) {
        current.setDate((current.getDate() - current.getDay() +1*1+(alternar)));
    } else{
        // Empezar Lunes
        current.setDate((current.getDate() - current.getDay() +1));
    }

    for (var i = 0; i < 7; i++) {    
        week.push(
            {
                full: new Date(current), 
                dia: new Date(current).getDate(),
                mes: new Date(current).getMonth()+1,
                ano: new Date(current).getFullYear(),
                diaNom: new Date(current).getDay(),
            }
        ); 
        current.setDate(current.getDate() +1);
    }

    return week; 
  },

  getPartidos: function(){
    var deporte = (UiGrupo.deporte_id == null ? window.localStorage.getItem("deporte_id_default") : UiGrupo.deporte_id);
    var provincia = "";
    var distrito = "";
    var fecha_desde = app.dateToString(new Date());
    var fecha_hasta = app.dateToString(new Date());
    var reservado = false;

    if(UiGrupo.fromFilter){
      if(app.getFilters() != null && app.getFilters().categoria == "2"){
        deporte = (app.getFilters().deporte == "0" ? "" : app.getFilters().deporte);
        provincia = app.getFilters().provincia;
        distrito = app.getFilters().distrito;
        fecha_desde = app.getFilters().desde;
        fecha_hasta = app.getFilters().hasta;
        reservado = app.getFilters().reservado;
      }
    }else{
      deporte = (UiGrupo.deporte_id== "0" ? "" : UiGrupo.deporte_id);
      fecha_desde = app.datetimeToString(new Date());
      fecha_hasta = app.dateToString(app.addYears(1));
      reservado = true;
    }

    $.ajax({
      url: constants.end_point + "/partidoapi/list?deporte=" + deporte + "&fecha_desde=" + fecha_desde + 
      "&fecha_hasta=" + fecha_hasta + "&reservado=" + (reservado ? 1 : 0) + "&provincia=" + provincia + "&distrito=" + distrito,
      headers: { 'Authorization': window.localStorage.getItem("token") },
      type:'GET',
      success: function(data) {
        if(data.result == "success"){
          $("#sec-campos").empty();
          for(var xI=0;xI<data.data.length;xI++){
            var row = data.data[xI];
            var campo = $("#tmpl-campo").clone();
            var html = campo.html();
            
            if(row.imagen == null){
              html = html.replace("[campo_img]",  "img/no-reservado-34.png");
            }else{
              html = html.replace("[campo_img]",  constants.assets_external + "/img/partidos_img/" + row.imagen);
            }

            html = html.replace("[nombre]",  row.nombre);
            html = html.replace("[deporte]",  row.deporte_nombre);
            html = html.replace("[fecha]",  row.fecha_desde == null ? "" : row.fecha_desde);
            html = html.replace("[organizador]",  row.usuario_nombre);
            html = html.replace("[reservado]",  row.cancha_reservada_id == 0 ? "" : "activo");
            html = html.replace("[partido_id]",  row.partido_id);
            campo.html(html);
            campo.removeClass("d-none");
            $("#sec-campos").append(campo);
          }
        }        
      }
    });

  },

  filterByDeporte:  function(e){
    e.preventDefault();
    $("#filtro-deportes li").each(function( key, value ){
      $(this).removeClass("activo");
    });
    $(e.toElement).addClass("activo");
    UiGrupo.deporte_id = $(e.toElement).attr("deporte_id");
    if(UiGrupo.fromFilter){
      var filters = app.getFilters();
      filters.deporte = UiGrupo.deporte_id;
      window.localStorage.setItem("filters", JSON.stringify(filters));
    }

    UiGrupo.getPartidos();
  },

  buildFiltroDeportes: function(data){
    UiGrupo.todos_deportes = data;
    $("#filtro-deportes").append(
      $("<li onclick='UiGrupo.filterByDeporte(event, 0)' deporte_id='0' "  + (!UiGrupo.fromFilter || (app.getFilters() != null && "0" == app.getFilters().deporte)  ? "class='activo'" : "") + " >").text("TODOS")
    );
    if(app.getFilters() != null){
      data.forEach(row => {
        $("#filtro-deportes").append(
          $("<li onclick='UiGrupo.filterByDeporte(event, " + row.deporte_id + ")' deporte_id='" + row.deporte_id + "' "  + (UiGrupo.fromFilter && app.getFilters() != null && row.deporte_id == app.getFilters().deporte ? "class='activo'" : "") + " >").text(row.nombre)
        );
      });
    }else{
      $.ajax({
        url: constants.end_point + "/userapi/list_deportes",
        headers: { 'Authorization': window.localStorage.getItem("token") },
        type:'GET',
        success: function(data) {
          if(data.result == "success"){
            UiGrupo.todos_deportes.forEach(row => {
              $("#filtro-deportes").append(
                $("<li onclick='UiGrupo.filterByDeporte(event, " + row.deporte_id + ")' deporte_id='" + row.deporte_id + "' "  + (data.data != null && data.data.deportes != null && data.data.deportes.length > 0 &&  row.deporte_id == data.data.deportes[0].deporte_id && UiGrupo.fromFilter ? "class='activo'" : "") + " >").text(row.nombre)
              );
            });
          }        
        }
      });
    }
  },
};

UiGrupo.initialize();