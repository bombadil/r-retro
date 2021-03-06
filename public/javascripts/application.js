//global name space
var rretro = {};

function fireOnclick(objID) {
  var target = document.getElementById(objID);
  if (document.dispatchEvent) { // W3C
    var oEvent = document.createEvent("MouseEvents");
    oEvent.initMouseEvent("click", true, true, window, 1, 1, 1, 1, 1, false, false, false, false, 0, target);
    target.dispatchEvent(oEvent);
  }
  else if (document.fireEvent) { // IE
    target.fireEvent("onclick");
  }
}

rretro.init_inline_edit = function($) {
  $("[data-inline-edit]").each(function() {
    var editor_control_id = $(this).attr('data-inline-edit');
    var editor_url = $(this).attr('data-inline-edit-url');
    var editor_rows = $(this).attr('data-inline-edit-row') || 1;
    var editor_refresh_url = $(this).attr('data-inline-edit-refresh-url');
    var on_complete = function(value, settings) {
      if (editor_refresh_url) {
        $.post(editor_refresh_url, function(data) {
          rretro.init_inline_edit($);
        });
      }
    };
    $("#" + editor_control_id).editable(editor_url, {
      indicator : "<img src='img/indicator.gif'>",
      submit    : "OK",
      cancel    : "Cancel",
      tooltip   : "Doubleclick to edit...",
      event     : "dblclick",
      style  : "inherit",
      rows: editor_rows,
      callback: on_complete,
      cssclass: 'editor',
      height:'none'
    });
  });
};

rretro.init_href_click = function($) {
  $("[data-href-click]").each(function() {
    var id_to_click = $(this).attr('data-href-click');
    $(this).unbind('click').click(function() {
      $('#' + id_to_click).click();
      return false;
    });
  });
};

rretro.init_value_max_button = function($) {
  $("span.item_value").each(function() {
    var element_id = this.id;
    $("#max_" + element_id).unbind('click').click(function() {
      var bg_color = $("#" + element_id).css('background-color');
      var dialog = $('<div></div>')
          .dialog({ autoOpen: false, height:400, width:359, title: "r-retro", show: 'blind' });
      dialog.html("<p class='popup_text'>" + $("#" + element_id).html() + "</p>")
          .css('background-color', bg_color)
          .dialog('open');
      return false;
    });
  });
};

rretro.init_collapsable = function($) {
  $("a.collapse_link").unbind('click').click(function() {
    $("#" + this.id + "_span").slideToggle();
    return false;
  });
};

rretro.init_draggable = function($) {
  $("[data-draggable]").each(function() {
    $("#" + this.id).draggable({revert:true, revertDuration: 5, zIndex: 2700});
  });
};

rretro.init_droppable = function($) {
  $("[data-droppable]").each(function() {
    var drop_url = $(this).attr('data-droppable');
    $("#" + this.id).droppable({
      drop: function(event, ui) {
        $.post(drop_url, {"item_id": ui.draggable.attr('id') });
      }
    });
  });
};

rretro.initJSActions = function($) {
  rretro.init_href_click($);
  rretro.init_inline_edit($);
  rretro.init_collapsable($);
  rretro.init_value_max_button($);
  rretro.init_draggable($);
  rretro.init_droppable($);
};

$(document).ready(function($) {

  $("[data-submit='true']").change(function() {
    this.form.submit();
  });

  $("#enable_auto_refresh:checked").each(function() {
    $("[data-refresh]").each(function() {
      var refresh_url = $(this).attr('data-refresh');
      var refresh_interval = ($(this).attr('data-refresh-interval') || 20) * 1000;
      setInterval(function() {
        $.post(refresh_url);
      }, refresh_interval);
    });
  });

  rretro.initJSActions($);

});
