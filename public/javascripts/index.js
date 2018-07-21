var lights ;
var doors  ;
var room ;
$(document).ready(function(){
   $('.sidenav').sidenav();
    $('.modal').modal();
    $('.collapsible').collapsible();
    $('#rgbDiv').hide();
    $('#lightLevelDiv').hide();
    $('.fixed-action-btn').floatingActionButton();
    $('.dropdown-trigger').dropdown();
    $('.scrollspy').scrollSpy();
    $('#removeFilter').hide();
    $('select').formSelect({
        isMultiple: false
    });
    $('#datepicker1').datepicker({
        autoClose: true,
        format: "dd mmm yy",
        defaultDate: new Date(),
        setDefaultDate: true,
        onSelect:( date)=>{
            getJsonRoom({date: date});
                        },
    });
    $('#datepicker2').datepicker({
        autoClose: true,
        format: "dd mmm yy",
        defaultDate: new Date(),
        setDefaultDate: true,
        onSelect:( date)=>{
            $('#removeFilter').hide();
            getJsonDoors({date: date});
        },
    });

    $('#datepicker3').datepicker({
        autoClose: true,
        format: "dd mmm yy",
        defaultDate: new Date(),
        setDefaultDate: true,
        onSelect:( date)=>{
            getJsonLights({date: date});
        },
    });
    getJsonOptions()
    d=new Date();
    d.setHours(0);
    d.setSeconds(0)
    d.setMinutes(0)
    d.setMilliseconds(0);

    getJsonDoors({date: d});
    getJsonLights({date: d});
    getJsonRoom({date: d})
});


function getJsonDoors(date){
    $.getJSON('./doors',date, function(data) {

        var template = $('#template_door').html();
        doors=data.doors;
        var text = Mustache.render(template, data);

        $('#mydoor').html(text);
    }).fail(function(){
        var toastText='<span class=" badge red lighten-1">error server communication </span>';
        M.toast({
            html:toastText ,
            classes: 'myToast rounded',
            displayLength: 3000
        });
    });

}
function getJsonLights(date){
    $.getJSON('./light',date, function(data) {

        var template = $('#template_light').html();
        lights=data.lights;
        var text = Mustache.render(template, data);

        $('#mylight').html(text);
    }).fail(function(){
        var toastText='<span class=" badge red lighten-1">error server communication </span>';
        M.toast({
            html:toastText ,
            classes: 'myToast rounded',
            displayLength: 3000
        });
    });
}
function getJsonRoom(date){
    $.getJSON('./room',date, function(data) {

        var template = $('#template_room').html();
        room=data.room;
        var text = Mustache.render(template, data);

        $('#myroom').html(text);
    }).fail(function(){
        var toastText='<span class=" badge red lighten-1">error server communication </span>';
        M.toast({
            html:toastText ,
            classes: 'myToast rounded',
            displayLength: 3000
        });
    });
}
function getJsonOptions(){
    $.getJSON('./options', function(data) {
        $('#roomIntervalUpdate').val((Number(data.Items[0].roomIntervalUpdate.S))/60);
        $('#doorControl').prop('checked',data.Items[0].doorControl.S === 'on');
        $('#lightControl').prop('checked',data.Items[0].lightControl.S === 'on');
        $('#lightAutotune').prop('checked',data.Items[0].lightAutotune.S === 'on');
        $('#lightAutotuneLevel').val(data.Items[0].lightAutotuneLevel.S)

    }).fail(function(){
        var toastText='<span class=" badge red lighten-1">error server communication </span>';
        M.toast({
            html:toastText ,
            classes: 'myToast rounded',
            displayLength: 3000
        });
    });
}
$("#removeFilter").on('click', function(state) {

    var template = $("#template_door").html();
    var filteredDoors = doors;
    var text = Mustache.render(template, {doors: filteredDoors });

    $("#mydoor").html(text);
    $('#removeFilter').hide();

});
$("#doorOpen").on('click', function(state) {

            var template = $("#template_door").html();
            var filteredDoors = doors.filter((l)=>{
                return l.state === 'open'
            });
            var text = Mustache.render(template, {doors: filteredDoors });

            $("#mydoor").html(text);
            $('#removeFilter').show();


});
$("#doorClosed").on('click', function() {

        var template = $("#template_door").html();
        var filteredDoors = doors.filter((l)=>{
            return l.state === 'closed'
        });
        var text = Mustache.render(template, {doors: filteredDoors });

        $("#mydoor").html(text);
        $('#removeFilter').show();
});
function onSelectMode(){

   var selVal=  Number($('#lightMode').val());

   if(selVal === 4){

        $('#rgbDiv').show();
        $('#lightLevelDiv').show();
       $('#lightLevelDiv').val(0);
   }
   else{

       if(selVal==1 || selVal == 3){
           $('#rgbDiv').hide();
           $('#lightLevelDiv').hide();
           $('#lightLevelDiv').val(0);
       }
       else {
           $('#rgbDiv').hide();
           $('#lightLevelDiv').show();
       }
   }
}
function lightsLuxFilter(luxType) {
    var template = $("#template_light").html();

    var filteredLights = lights;
    if (luxType !== 'ALL') {
        filteredLights = lights.filter((l) => {
            return l.lux === luxType;
        });
    }
    var text = Mustache.render(template, {lights: filteredLights });

    $("#mylight").html(text);
}
function roomFilter() {
  var tempFilter=$('#tempFilter').val();
  var humFilter=$('#humFilter').val();
  var luxFilter=$('#luxFilter').val();
  var filteredRoom=room;
  if(tempFilter >0 && tempFilter<80){
      filteredRoom = filteredRoom.filter((r) => {
          return r.temperature > tempFilter;
      });
  }
    if(humFilter >0 && humFilter<=100){
        filteredRoom = filteredRoom.filter((r) => {
            return r.humidity> humFilter;
        });
    }
    if(luxFilter >0 && luxFilter<80){
        filteredRoom = filteredRoom.filter((r) => {
            return r.lux > luxFilter;
        });
    }
  var template = $("#template_room").html();
  var text = Mustache.render(template, {room: filteredRoom });
  $("#myroom").html(text);
}

$('#optionsUpdate').on('click',function(){
    var roomIntervalUpdate= $('#roomIntervalUpdate').val();
    var doorControl=$('#doorControl:checked').val() || 'off';
    var lightControl = $('#lightControl:checked').val() || 'off';
    var lightAutotune=$('#lightAutotune:checked').val() || 'off';
    var lightAutotuneLevel=$('#lightAutotuneLevel').val();
    if(roomIntervalUpdate < 1 || roomIntervalUpdate > 240 || lightAutotuneLevel <0 || lightAutotuneLevel > 60){
        var toastText='<span class=" badge red lighten-1">respect room update interval range 1-240 and light autotune range 0-60 </span>';
        M.toast({
            html:toastText ,
            classes: 'myToast rounded',
            displayLength: 3000
        });
        return;
    }

    $.post("./options/modify", {roomIntervalUpdate : (roomIntervalUpdate*60),doorControl:doorControl,
        lightAutotune:lightAutotune,lightAutotuneLevel:lightAutotuneLevel,lightControl:lightControl}, function (data) {
        var toastText='<span class=" badge green lighten-1">options correctly updated</span>';
        M.toast({html:toastText ,
            classes: 'myToast rounded',
            displayLength: 3000
        });
    }).fail(function(){
        var toastText='<span class=" badge red lighten-1">error server communication </span>';
        M.toast({
            html:toastText ,
            classes: 'myToast rounded',
            displayLength: 3000
        });
    });

});
$('#lightUpdate').on('click',function onUploadLights(){
    var selVal=  Number($('#lightMode').val());

    var bright = $('#lightLevel').val();
    var sendIt=true;

   var option=null;
    if(selVal === 4){

        var red=$('#red').val();
        var green =$('#green').val();
        var blue = $('#blue').val();


        option={mode: "CUSTOM",bright:bright,red:red,green:green,blue:blue};
        if(red < 0 || red > 255 || green <0 || green > 255 || blue <0 || blue > 255 || bright < 0 || bright >255){
            var toastText='<span class=" badge red lighten-1">red , green ,blue and bright values should  be  in range 0-255</span>';
            M.toast({
                html:toastText ,
                classes: 'myToast rounded',
                displayLength: 3000
            });

           sendIt=false;
        }
    }
    else{

      switch (selVal){
          case 1:{
              option={mode: "OFF"};
              break;
          }
          case 2:{

              option={mode: "ON",bright: bright};

              if( bright < 0 || bright >255){
                  var toastText='<span class=" badge red lighten-1">bright value should  be  in range 0-255</span>';
                  M.toast({
                      html:toastText ,
                      classes: 'myToast rounded',
                      displayLength: 3000
                  });

                  sendIt=false;
              }
              break;
          }
          case 3:{
              option={mode: "ALARM"};
              break;
          }
      }

    }
    if(sendIt) {
        $.post("./lights/modify", option, function (data) {
        var toastText='<span class=" badge green lighten-1">data successfully sent</span>';
            M.toast({html:toastText ,
                classes: 'myToast rounded',
                displayLength: 3000
            });
        }).fail(function(){
            var toastText='<span class=" badge red lighten-1">error server communication </span>';
            M.toast({
                html:toastText ,
                classes: 'myToast rounded',
                displayLength: 3000
            });
        });
    }
    $('#red').val(0);
    $('#green').val(0);
    $('#blue').val(0);
    $('#lightLevel').val(0);
});