// Определим свои функции добавления/удаления класса, так как те, что в jQuery не работают для SVG
jQuery.fn.myAddClass = function (classTitle) {
  return this.each(function() {
    var oldClass = jQuery(this).attr("class");
    oldClass = oldClass ? oldClass : '';
    jQuery(this).attr("class", (oldClass+" "+classTitle).trim());
  });
}
jQuery.fn.myRemoveClass = function (classTitle) {
  return this.each(function() {
      var oldClassString = ' '+jQuery(this).attr("class")+' ';
      var newClassString = oldClassString.replace(new RegExp(' '+classTitle+' ','g'), ' ').trim()
      if (!newClassString)
        jQuery(this).removeAttr("class");
      else
        jQuery(this).attr("class", newClassString);
  });
}

// Начинаем работу когда страница полностью загружена (включая графику)
$(window).load(function () {
  // Получаем доступ к SVG DOM
  var svgobject = document.getElementById('imap'); 
  if ('contentDocument' in svgobject)
    var svgdom = svgobject.contentDocument;

  // Хак для WebKit (чтобы правильно масштабировал нашу карту)
  var viewBox = svgdom.rootElement.getAttribute("viewBox").split(" ");
  var aspectRatio = viewBox[2] / viewBox[3];
  svgobject.height = parseInt(svgobject.offsetWidth / aspectRatio);

  // Взаимодействие карты и таблички регионов
  $("#areas input[type=checkbox]").change(function() {
    var row = $(this).parent().parent();
    var id = row.attr("id");
    if (this.checked) {
      row.addClass("selected");
      $("#"+id, svgdom).myAddClass("selected");
    } else {
      row.removeClass("selected");
      $("#"+id, svgdom).myRemoveClass("selected");
    }
  });

  // Скрытие названий по чекбоксу
  $("#titleswitch").change(function () {
    var elements = $(svgdom.getElementsByClassName("areatitle"))
      .add($(svgdom.getElementsByClassName("citytitle")))
      .add($(svgdom.getElementsByClassName("titlebox")))
      .add($(svgdom.getElementsByClassName("titleline")));
    if (this.checked) {
      elements.myAddClass("hidden");
    } else {
      elements.myRemoveClass("hidden");
    }
  });

  // Подсвечиваем регион на карте при наведении мыши на соотв. строку таблицы.
  $("#areas tr").hover(
    function () {
      var id = $(this).attr("id");
      $("#"+id, svgdom).myAddClass("highlight");
    }, 
    function () {
      var id = $(this).attr("id");
      $("#"+id, svgdom).myRemoveClass("highlight");
    }
  );  
  // Подсвечиваем строку в таблице при наведении мыши на соотв. регион на карте
  $(svgdom.getElementsByClassName("area")).hover(
    function () {
      var id = $(this).attr("id");
      $("#areas #"+id).addClass("highlight");
    }, 
    function () {
      var id = $(this).attr("id");
      $("#areas #"+id).removeClass("highlight");
    }
  );

  // Меняем значения на карте значениями из таблицы
  $("input[name=tabledata]").change(function () {
    var descnum = $(this).parent().prevAll().length+1;
    $("#areas tbody tr").each(function() {
      var id = $(this).attr("id").substring(4);
      var value = $(this).children(":nth-child("+descnum+")").text();
      $("#text"+id, svgdom).text(value);
    });
  });
  $("#resetswitch").change(function () {
    $("#areas tbody tr").each(function() {
      var id = $(this).attr("id").substring(4);
      $("#text"+id, svgdom).text("");
    });
  });

  // Всплывающие подсказки
  $(svgdom.getElementsByClassName("area")).tooltip({ 
    track: true, 
    delay: 0, 
    showURL: false, 
    fade: 250,
    bodyHandler: function() {
      var id     = $(this).attr("id");
      var area   = $("#areas #"+id+" td:nth-child(2)").text();
      var result = $("<p>").append($("<strong>").text(area));
      $("#areas #"+id+" td:nth-child(2)").nextAll().each(function(){
        var pos = $(this).prevAll().length+1;
        var title = $("#areas thead th:nth-child("+pos+")").text();
        var value = $(this).text();
        result.append($("<p>").text(title + ": " + value));
      });
      return result;
    }
  });
});
