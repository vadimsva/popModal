(function ($) {
	$.fn.popModal = function(method){
		var elem = $(this);
		var isClick = checkEvent(elem, 'click');
		var isFixed, overflowContentClass, closeBut; 
		var modalClass = 'popModal';
		var popModalOpen = 'popModalOpen';
		var _options;
	
		var methods = {
			init : function( params ) {
				var _defaults = {
					html: '',
					placement: 'bottomLeft',
					showCloseBut: true,
					overflowContent: true,
					okFun: function() {return true;},
					cancelFun: function() {},
					onLoad: function() {},
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);
				
				
				if (_options.showCloseBut) {
					closeBut = $('<button type="button" class="close">&times;</button>');
				} else {
					closeBut = '';
				}
				if (_options.overflowContent) {
					overflowContentClass = 'popModal_contentOverflow';
				} else {
					overflowContentClass = '';
				}
				
				if (isClick) {
					_init();
				} else {
					elem.on('click',function(){
						_init();
					});
				}
				
				function _init(){
					if (elem.next('div').hasClass(modalClass)) {
						popModalClose();
					} else {
						$('html.' + popModalOpen).off('click').removeClass(popModalOpen);
						$('.' + modalClass).remove();

						if (elem.css('position') == 'fixed') {
							isFixed = 'position:fixed;';
						} else {
							isFixed = '';
						}
						var getTop = 'top:' + eval(elem.position().top + parseInt(elem.css('marginTop')) + elem.outerHeight() + 10) + 'px';

						var tooltipContainer = $('<div class="' + modalClass + ' ' + _options.placement + '" style="' + isFixed + getTop + '"></div>');
						var tooltipContent = $('<div class="' + modalClass + '_content ' + overflowContentClass + '"></div>');
						tooltipContainer.append(closeBut, tooltipContent);
						
						if ($.isFunction(_options.html)) {
							var beforeLoadingContent = 'Please, waiting...';
							tooltipContent.append(beforeLoadingContent);
							_options.html(function (loadedContent) {
								tooltipContent.empty().append(loadedContent);
							});
						} else {
							tooltipContent.append(_options.html);
						}
						elem.after(tooltipContainer);

						animTime = $('.' + modalClass + '_container').css('transitionDuration');
						if (animTime != undefined) {
							animTime = animTime.replace('s', '') * 1000;
						} else {
							animTime = 200;
						}

						if (_options.onLoad && $.isFunction(_options.onLoad)) {
							_options.onLoad();
						}

						$('.' + modalClass).on('destroyed', function () {
							if (_options.onClose && $.isFunction(_options.onClose)) {
								_options.onClose();
							}
						});

						getPlacement();
						
						if (_options.overflowContent) {
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
						
						$(window).resize(function(){
							getPlacement();
						});
						
						$('.popModal [data-popmodal="close"]').bind('click', function () {
							popModalClose();
						});

						$('.popModal [data-popmodal="ok"]').bind('click', function (event) {
							var ok;
							if (_options.okFun && $.isFunction(_options.okFun)) {
								ok = _options.okFun(event);
							}
							if (ok !== false) {
								popModalClose();
							}
						});

						$('.popModal [data-popmodal="cancel"]').bind('click', function () {
							if (_options.cancelFun && $.isFunction(_options.cancelFun)) {
								_options.cancelFun();
							}
							popModalClose();
						});

						$('html').keydown(function (event) {
							if (event.keyCode == 27) {
								popModalClose();
							}
						});

					}
					
				}
				
				function getPlacement(){
					switch (_options.placement){
						case ('bottomLeft'):
							$('.' + modalClass).css({
								left: elem.position().left + parseInt(elem.css('marginLeft')) + 'px'
							});
							break;
						case ('bottomRight'):
							$('.' + modalClass).css({
								left: elem.position().left + parseInt(elem.css('marginLeft')) + elem.outerWidth() - $('.' + modalClass).outerWidth() + 'px',
								width: $('.' + modalClass).outerWidth() + 'px'
							});
							break;
						case ('bottomCenter'):
							$('.' + modalClass).css({
								left: elem.position().left + parseInt(elem.css('marginLeft')) + (elem.outerWidth() - $('.' + modalClass).outerWidth()) / 2 + 'px',
								width: $('.' + modalClass).outerWidth() + 'px'
							});
							break;
						case ('leftTop'):
							$('.' + modalClass).css({
								top: eval(elem.position().top + parseInt(elem.css('marginTop'))) + 'px',
								left: elem.position().left + parseInt(elem.css('marginLeft')) - $('.' + modalClass).outerWidth() - 10 + 'px',
								width: $('.' + modalClass).outerWidth() + 'px'
							});
							break;
						case ('rightTop'):
							$('.' + modalClass).css({
								top: eval(elem.position().top + parseInt(elem.css('marginTop'))) + 'px',
								left: elem.position().left + parseInt(elem.css('marginLeft')) + elem.outerWidth() + 10 + 'px',
								width: $('.' + modalClass).outerWidth() + 'px'
							});
							break;
						case ('leftCenter'):
							$('.' + modalClass).css({
								top: eval(elem.position().top + parseInt(elem.css('marginTop')) + elem.outerHeight() / 2 - $('.' + modalClass).outerHeight() / 2) + 'px',
								left: elem.position().left + parseInt(elem.css('marginLeft')) - $('.' + modalClass).outerWidth() - 10 + 'px',
								width: $('.' + modalClass).outerWidth() + 'px'
							});
							break;
						case ('rightCenter'):
							$('.' + modalClass).css({
								top: eval(elem.position().top + parseInt(elem.css('marginTop')) + elem.outerHeight() / 2 - $('.' + modalClass).outerHeight() / 2) + 'px',
								left: elem.position().left + parseInt(elem.css('marginLeft')) + elem.outerWidth() + 10 + 'px',
								width: $('.' + modalClass).outerWidth() + 'px'
							});
							break;
					}
				}
				
			},
			hide : function( ) {
				popModalClose();
			}
		};
		
		function popModalClose() {
			setTimeout(function () {
				$('.' + modalClass).removeClass('open');
				setTimeout(function () {
					$('.' + modalClass).remove();
					$('html.' + popModalOpen).off('click').removeClass(popModalOpen);
				}, animTime);
			}, animTime);
		}
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			
		}	

	};
})(jQuery);
function checkEvent(element, eventname) {
	var events,
	ret = false;

	events = $._data(element[0], 'events');
	if (events) {
		$.each(events, function(evName, e) {
			if (evName == eventname) {
				ret = true;
			}
		});
	}

	return ret;
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



function notifyModal(params) {
  var notifyModal = 'notifyModal';
	var _defaults = {
		html: '',
		duration: 2500,
		placement: 'center'
	};
	_options = $.extend(_defaults, params);
	
	if (_options.placement == '') {
		_options.placement = 'center';
	}
	
  $('.' + notifyModal).remove();
  var notifyContainer = $('<div class="' + notifyModal + '"></div>');
  var notifyContent = $('<div class="' + notifyModal + '_content ' + _options.placement + '"></div>');
  var closeBut = $('<button type="button" class="close">&times;</button>');
  notifyContent.append(closeBut, _options.html);
  notifyContainer.append(notifyContent);
  $('body').append(notifyContainer);

	animTime = $('.' + notifyModal + '_container').css('transitionDuration');
	if (animTime != undefined) {
		animTime = animTime.replace('s', '') * 1000;
	} else {
		animTime = 200;
	}

  setTimeout(function () {
    $('.' + notifyModal).addClass('open');
  }, animTime);

  $('.' + notifyModal).click(function () {
    notifyModalClose();
  });
  if (_options.duration != -1) {
    notifDur = setTimeout(notifyModalClose, _options.duration);
  }

  function notifyModalClose() {
    setTimeout(function () {
      $('.' + notifyModal).removeClass('open');
      setTimeout(function () {
        $('.' + notifyModal).remove();
        if (_options.duration != -1) {
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
		animTime = $('.' + hintModal + '_container').css('transitionDuration');
		if (animTime != undefined) {
			animTime = animTime.replace('s', '') * 1000;
		} else {
			animTime = 200;
		}
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



function dialogModal(){
//preview
}
