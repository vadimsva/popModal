function popModal(elem, html, params, okFun, cancelFun, onLoad, onClose) {
  var modal = elem.next('div');
  var modalClass = 'popModal';
  var placement = 'bottomLeft';
  var showCloseBut = true;
  var overflowContent = true;
  var popModalOpen = 'popModalOpen'; 

  if (params != undefined) {
    if (params.placement != undefined) {
      placement = params.placement;
    }
    if (params.showCloseBut != undefined) {
      showCloseBut = params.showCloseBut;
    }
    if (params.overflowContent != undefined) {
      overflowContent = params.overflowContent;
    }
  }

  if (showCloseBut) {
    var closeBut = $('<button type="button" class="close">&times;</button>');
  } else {
    var closeBut = '';
  }
  if (overflowContent) {
    var overflowContentClass = 'popModal_contentOverflow';
  } else {
    var overflowContentClass = '';
  }

  if (modal.hasClass(modalClass)) {
    popModalClose();
  } else {
    $('html.' + popModalOpen).off('click');
    $('.' + modalClass).remove();

    if (elem.css('position') == 'fixed') {
      var isFixed = 'position:fixed;';
    } else {
      var isFixed = '';
    }
    var getTop = 'top:' + eval(elem.position().top + parseInt(elem.css('marginTop')) + elem.outerHeight() + 10) + 'px';

    var tooltipContainer = $('<div class="' + modalClass + ' ' + placement + '" style="' + isFixed + getTop + '"></div>');
    var tooltipContent = $('<div class="' + modalClass + '_content ' + overflowContentClass + '"></div>');
    tooltipContainer.append(closeBut, tooltipContent);
    tooltipContent.append(html);
    elem.after(tooltipContainer);

    animTime = $('.' + modalClass).css('transitionDuration').replace('s', '') * 1000;

    if (onLoad && $.isFunction(onLoad)) {
      onLoad();
    }

    $('.' + modalClass).on('destroyed', function () {
      if (onClose && $.isFunction(onClose)) {
        onClose();
      }
    });

    if (placement == 'bottomLeft') {
      $('.' + modalClass).css({left: elem.position().left + parseInt(elem.css('marginRight')) + 'px'});
    } else if (placement == 'bottomRight') {
      $('.' + modalClass).css({left: elem.position().left + parseInt(elem.css('marginRight')) + elem.outerWidth() - $('.' + modalClass).outerWidth() + 'px', width: $('.' + modalClass).outerWidth() + 'px'});
    } else if (placement == 'bottomCenter') {
      $('.' + modalClass).css({left: elem.position().left + parseInt(elem.css('marginRight')) + (elem.outerWidth() - $('.' + modalClass).outerWidth()) / 2 + 'px', width: $('.' + modalClass).outerWidth() + 'px'});
    }
    if (overflowContent) {
      $('.' + modalClass).append($('.' + modalClass).find('.' + modalClass + '_content .' + modalClass + '_footer'));
    }

    setTimeout(function () {
      $('.' + modalClass).addClass('open');
    }, animTime);

    $('.popModal .close').bind('click', function () {
      popModalClose();
    });

    $('html').on('click', function (event) {
      $(this).addClass(popModalOpen);
      if ($('.' + modalClass).is(':hidden')) {
        popModalClose();
      }
      var target = $(event.target);
      if (!target.parents().andSelf().is('.' + modalClass) && !target.parents().andSelf().is(elem)) {
        popModalClose();
      }
    });

  }

  $('.popModal [data-popmodal="close"]').bind('click', function () {
    popModalClose();
  });

  $('.popModal [data-popmodal="ok"]').bind('click', function (event) {
    var ok = okFun ? okFun(event) : true;
    if (ok !== false) {
      popModalClose();
    }
  });

  $('.popModal [data-popmodal="cancel"]').bind('click', function () {
    if (cancelFun) {
      cancelFun();
    }
    popModalClose();
  });

  function popModalClose() {
    setTimeout(function () {
      $('.' + modalClass).removeClass('open');
      setTimeout(function () {
        $('.' + modalClass).remove();
        $('html.' + popModalOpen).off('click');
        $('html').removeClass(popModalOpen);
      }, animTime);
    }, animTime);
  }

  $('html').keydown(function (event) {
    if (event.keyCode == 27) {
      popModalClose();
    }
  });
}
(function ($) {
  $.event.special.destroyed = {
    remove: function (o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery);


function notifyModal(html, duration) {
  var notifyModal = 'notifyModal';
  duration = duration || 2500;

  $('.' + notifyModal).remove();
  var notifyContainer = $('<div class="' + notifyModal + '"></div>');
  var notifyContent = $('<div class="' + notifyModal + '_content"></div>');
  var closeBut = $('<button type="button" class="close">&times;</button>');
  notifyContent.append(closeBut, html);
  notifyContainer.append(notifyContent);
  $('body').append(notifyContainer);

  animTime = $('.' + notifyModal).css('transitionDuration').replace('s', '') * 1000;

  setTimeout(function () {
    $('.' + notifyModal).addClass('open');
  }, animTime);

  $('.' + notifyModal).click(function () {
    notifyModalClose();
  });
  if (duration != -1) {
    notifDur = setTimeout(notifyModalClose, duration);
  }

  function notifyModalClose() {
    setTimeout(function () {
      $('.' + notifyModal).removeClass('open');
      setTimeout(function () {
        $('.' + notifyModal).remove();
        if (duration != -1) {
          clearTimeout(notifDur);
        }
      }, animTime);
    }, animTime);

  }

  $('html').keydown(function (event) {
    if (event.keyCode == 27) {
      notifyModalClose();
    }
  });
}


function hintModal() {
  var hintModal = 'hintModal';
  var focus = false;

  if ($('.' + hintModal).length) {
    animTime = $('.' + hintModal + '_container').css('transitionDuration').replace('s', '') * 1000;
  }

  $('.' + hintModal).mouseenter(function () {
    $('.' + hintModal + '_container').css({display: 'block'});
    setTimeout(function () {
      $('.' + hintModal + '_container').addClass('open');
      focus = true;
    }, animTime);
  });

  $('.' + hintModal).mouseleave(function () {
    if (focus) {
      setTimeout(function () {
        $('.' + hintModal + '_container').removeClass('open');
        setTimeout(function () {
          $('.' + hintModal + '_container').css({display: 'none'});
          focus = false;
        }, animTime);
      }, animTime);
    }
  });
}
(function ($) {
  hintModal();
})(jQuery);
