(function ($) {
	$.fn.popModal = function(method){
		var elem = $(this);
		var isClick = checkEvent(elem, 'click');
		var isFixed, overflowContentClass, closeBut; 
		var modalClass = 'popModal';
		var _options;
		var animTime;
	
		var methods = {
			init : function( params ) {
				var _defaults = {
					html: '',
					placement: 'bottomLeft',
					showCloseBut: true,
					overflowContent: true,
					onDocumentClickClose : true,
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
						$('html.' + modalClass + 'Open').off('.popModalEvent').removeClass(modalClass + 'Open');
						$('.' + modalClass).remove();
					
						if(!$.isFunction(_options.html) && _options.html.search(/<form/) != -1){
							overflowContentClass = '';
						}
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

						animTime = $('.' + modalClass).css('transitionDuration');
						if (animTime != undefined && animTime != '0s') {
							animTime = animTime.replace('s', '') * 1000;
						} else {
							animTime = 0;
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

						$('.' + modalClass + ' .close').bind('click', function () {
							popModalClose();
						});

						if (_options.onDocumentClickClose) {
							$('html').on('click.popModalEvent', function (event) {
								$(this).addClass(modalClass + 'Open');
								if ($('.' + modalClass).is(':hidden')) {
									popModalClose();
								}
								var target = $(event.target);
								if (!target.parents().andSelf().is('.' + modalClass) && !target.parents().andSelf().is(elem)) {
								  var zIndex = parseInt(target.parents().filter(function(){
										return $(this).css('zIndex') !== 'auto';
									}).first().css('zIndex'));
									if (zIndex < target.css('zIndex')){
										zIndex = target.css('zIndex');
									}
									if(zIndex <= $('.' + modalClass).css('zIndex')){
										popModalClose();
									}
								}
							});
						}
						
						$(window).resize(function(){
							getPlacement();
						});
						
						$('.' + modalClass + ' [data-popmodal="close"]').bind('click', function () {
							popModalClose();
						});

						$('.' + modalClass + ' [data-popmodal="ok"]').bind('click', function (event) {
							var ok;
							if (_options.okFun && $.isFunction(_options.okFun)) {
								ok = _options.okFun(event);
							}
							if (ok !== false) {
								popModalClose();
							}
						});

						$('.' + modalClass + ' [data-popmodal="cancel"]').bind('click', function () {
							if (_options.cancelFun && $.isFunction(_options.cancelFun)) {
								_options.cancelFun();
							}
							popModalClose();
						});

						$('html').on('keydown.popModalEvent', function (event) {
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
					$('html.' + modalClass + 'Open').off('.popModalEvent').removeClass(modalClass + 'Open');
				}, animTime);
			}, animTime);
		}
		
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
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			
		}	

	}

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
	var onTop;
	var _defaults = {
		html: '',
		duration: 2500,
		placement: 'center',
		onTop : true
	};
	_options = $.extend(_defaults, params);
	
	if (_options.placement == '') {
		_options.placement = 'center';
	}
	if (_options.onTop) {
		onTop = 'onTop';
	} else {
		onTop = '';
	}
	
  $('.' + notifyModal).remove();
  var notifyContainer = $('<div class="' + notifyModal + ' ' + _options.placement + ' ' + onTop + '"></div>');
  var notifyContent = $('<div class="' + notifyModal + '_content"></div>');
  var closeBut = $('<button type="button" class="close">&times;</button>');
  notifyContent.append(closeBut, _options.html);
  notifyContainer.append(notifyContent);
  $('body').append(notifyContainer);

	var animTime = $('.' + notifyModal).css('transitionDuration');
	if (animTime != undefined && animTime != '0s') {
		animTime = animTime.replace('s', '') * 1000;
	} else {
		animTime = 0;
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
		var animTime = $('.' + hintModal + '_container').css('transitionDuration');
		if (animTime != undefined && animTime != '0s') {
			animTime = animTime.replace('s', '') * 1000;
		} else {
			animTime = 0;
		}
  }

  $('.' + hintModal).mouseenter(function () {
		var el = $(this).find('.' + hintModal + '_container');
		$('.' + hintModal + '_container').removeClass('open').css({display: 'none'});
		el.css({display: 'block'});
    setTimeout(function () {
      el.addClass('open');
      focus = true;
    }, animTime);
  });

  $('.' + hintModal).mouseleave(function () {
		var el = $('.' + hintModal + '_container');
    if (focus) {
      setTimeout(function () {
        el.removeClass('open');
        setTimeout(function () {
          el.css({display: 'none'});
          focus = false;
					animTime = 0;
        }, animTime);
      }, animTime);
    }
  });
}
(function ($) {
  hintModal();
})(jQuery);



(function ($) {
	$.fn.dialogModal = function(method){
		var elem = $(this);
		var isClick = checkEvent(elem, 'click');
		var modalClass = 'dialogModal';
		var _options;
		var animTime;
	
		var methods = {
			init : function( params ) {
				var _defaults = {
					html: '',
					okFun: function() {return true;},
					cancelFun: function() {},
					onLoad: function() {},
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);
				
				if (isClick) {
					_init();
				} else {
					elem.on('click',function(){
						_init();
					});
				}
				
				function _init(){
					$('html.' + modalClass + 'Open').off('.dialogModalEvent').removeClass(modalClass + 'Open');
					$('.dialogModal .dialogPrev, .dialogModal .dialogNext').off('click');
					$('.' + modalClass).remove();

					var dialogMain = $('<div class="' + modalClass + '"></div>');
					var dialogContainer = $('<div class="' + modalClass + '_container"></div>');
					var dialogCloseBut = $('<button type="button" class="close">&times;</button>');
					var dialogBody = $('<div class="' + modalClass + '_body"></div>');
					dialogMain.append(dialogContainer);
					dialogContainer.append(dialogCloseBut, dialogBody);
					
					if ($.isArray(_options.html)) {
						var currentDialog = 0;
						var maxDialog = _options.html.length - 1;
						dialogBody.append(_options.html[currentDialog]);
						dialogContainer.prepend($('<div class="dialogPrev notactive"></div><div class="dialogNext"></div>'));
					} else {
						dialogBody.append(_options.html);
					}

					$('html').append(dialogMain);
					
					animTime = $('.' + modalClass + '_container').css('transitionDuration');
					if (animTime != undefined && animTime != '0s') {
						animTime = animTime.replace('s', '') * 1000;
					} else {
						animTime = 0;
					}

					if (_options.onLoad && $.isFunction(_options.onLoad)) {
						_options.onLoad();
					}

					$('.' + modalClass).on('destroyed', function () {
						if (_options.onClose && $.isFunction(_options.onClose)) {
							_options.onClose();
						}
					});

					function centerDialog() {
						var modalHeight = $('.' + modalClass + '_container').outerHeight();
						var windowHeight = $(window).height();
						if (windowHeight > modalHeight + 80) {
							$('.' + modalClass + '_container').css({
								top: '50%',
								marginTop: - modalHeight/2 + 20 + 'px'
							});	
						} else {
							$('.' + modalClass + '_container').css({
								top: 0,
								marginTop: '60px'
							});						
						}
						
						setTimeout(function () {
							$('.' + modalClass).addClass('open');
							$('.' + modalClass + '_container').css({
								marginTop: parseInt($('.' + modalClass + '_container').css('marginTop')) - 20 + 'px'
							});	
						}, animTime);
						
						bindFooterButtons();
					}
					
					function bindFooterButtons() {
						$('.' + modalClass + ' [data-dialogmodal="close"]').bind('click', function () {
							dialogModalClose();
						});

						$('.' + modalClass + ' [data-dialogmodal="ok"]').bind('click', function (event) {
							var ok;
							if (_options.okFun && $.isFunction(_options.okFun)) {
								ok = _options.okFun(event);
							}
							if (ok !== false) {
								dialogModalClose();
							}
						});

						$('.' + modalClass + ' [data-dialogmodal="cancel"]').bind('click', function () {
							if (_options.cancelFun && $.isFunction(_options.cancelFun)) {
								_options.cancelFun();
							}
							dialogModalClose();
						});
					}
					
					centerDialog();

					$('.' + modalClass + ' .dialogPrev').bind('click', function () {
						if (currentDialog > 0) {
							--currentDialog;
							if (currentDialog < maxDialog) {
								$('.' + modalClass + ' .dialogNext').removeClass('notactive');
							}
							if (currentDialog == 0) {
								$('.' + modalClass + ' .dialogPrev').addClass('notactive');
							}
							dialogBody.empty().append(_options.html[currentDialog]);
							centerDialog();
						}
					});
					
					$('.' + modalClass + ' .dialogNext').bind('click', function () {
						if (currentDialog < maxDialog) {
							++currentDialog;
							if (currentDialog > 0) {
								$('.' + modalClass + ' .dialogPrev').removeClass('notactive');
							}
							if (currentDialog == maxDialog) {
								$('.' + modalClass + ' .dialogNext').addClass('notactive');
							}
							dialogBody.empty().append(_options.html[currentDialog]);
							centerDialog();
						}
					});

					$('.' + modalClass + ' .close').bind('click', function () {
						dialogModalClose();
					});

					$('html').on('click.dialogModalEvent', function (event) {
						$(this).addClass(modalClass + 'Open');
						if ($('.' + modalClass).is(':hidden')) {
							dialogModalClose();
						}
						var target = $(event.target);
						if (!target.parents().andSelf().is('.' + modalClass) && !target.parents().andSelf().is(elem)) {
							dialogModalClose();
						}
					});
					
					$('html').on('keydown.dialogModalEvent', function (event) {
						if (event.keyCode == 27) {
							dialogModalClose();
						} else if (event.keyCode == 37) {
							$('.' + modalClass + ' .dialogPrev').click();
						} else if (event.keyCode == 39) {
							$('.' + modalClass + ' .dialogNext').click();
						}
					});
					
				}
					
			},
			hide : function( ) {
				dialogModalClose();
			}
		};
		
		function dialogModalClose() {
			setTimeout(function () {
				$('.' + modalClass).removeClass('open');
				setTimeout(function () {
					$('.' + modalClass).remove();
					$('html.' + modalClass + 'Open').off('.dialogModalEvent').removeClass(modalClass + 'Open');
					$('.' + modalClass + ' .dialogPrev, .' + modalClass + ' .dialogNext').off('click');
				}, animTime);
			}, animTime);
		}
		
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
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			
		}	

	}

  $.event.special.destroyed = {
    remove: function (o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery);
