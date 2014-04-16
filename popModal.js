/* popModal - 15.04.14 */
/* popModal */
(function ($) {
	$.fn.popModal = function(method){
		var elem = $(this),
		elemObj,
		isClick = checkEvent(elem, 'click'),
		isFixed,
		overflowContentClass,
		closeBut,
		elemClass = 'popModal',
		_options,
		animTime;
	
		var methods = {
			init : function( params ) {
				var _defaults = {
					html: '',
					placement: 'bottomLeft',
					showCloseBut: true,
					overflowContent: true,
					onDocumentClickClose : true,
					onOkBut: function() {return true;},
					onCancelBut: function() {},
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
					overflowContentClass = elemClass + '_contentOverflow';
				} else {
					overflowContentClass = '';
				}

				if (isClick) {
					_init();
				} else {
					elem.on('click', function() {
						_init();
					});
				}
				
				function _init(){
				
					if (elem.next('div').hasClass(elemClass)) {
						popModalClose();
					} else {
						$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
						$('.' + elemClass).remove();

						if(!$.isFunction(_options.html) && _options.html.search(/<form/) != -1){
							overflowContentClass = '';
						}
						if (elem.css('position') == 'fixed') {
							isFixed = 'position:fixed;';
						} else {
							isFixed = '';
						}
						var getTop = 'top:' + eval(elem.position().top + parseInt(elem.css('marginTop')) + elem.outerHeight() + 10) + 'px';

						var tooltipContainer = $('<div class="' + elemClass + ' ' + _options.placement + ' animated" style="' + isFixed + getTop + '"></div>');
						var tooltipContent = $('<div class="' + elemClass + '_content ' + overflowContentClass + '"></div>');
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

						elemObj = $('.' + elemClass);
						animTime = elemObj.css('animationDuration');
						if (animTime != undefined) {
							animTime = animTime.replace('s', '') * 1000;
						} else {
							animTime = 0;
						}
						
						if (_options.onLoad && $.isFunction(_options.onLoad)) {
							_options.onLoad();
						}

						elemObj.on('destroyed', function () {
							if (_options.onClose && $.isFunction(_options.onClose)) {
								_options.onClose();
							}
						});

						getPlacement();
						
						if (_options.overflowContent) {
							elemObj.append(elemObj.find('.' + elemClass + '_content .' + elemClass + '_footer'));
						}

						if (_options.onDocumentClickClose) {
							$('html').on('click.' + elemClass + 'Event', function (event) {
								$(this).addClass(elemClass + 'Open');
								if (elemObj.is(':hidden')) {
									popModalClose();
								}
								var target = $(event.target);
								if (!target.parents().andSelf().is('.' + elemClass) && !target.parents().andSelf().is(elem)) {
								  var zIndex = parseInt(target.parents().filter(function(){
										return $(this).css('zIndex') !== 'auto';
									}).first().css('zIndex'));
									if (zIndex !== NaN) {
										zIndex = 0;
									}
									var target_zIndex = target.css('zIndex');
									if (target_zIndex == 'auto') {
										target_zIndex = 0;
									}
									if (zIndex < target_zIndex) {
										zIndex = target_zIndex;
									}
									if (zIndex <= elemObj.css('zIndex')) {
										popModalClose();
									}
								}
							});
						}
						
						$(window).resize(function(){
							getPlacement();
						});
						
						elemObj.find('.close').bind('click', function () {
							popModalClose();
						});
						
						elemObj.find('[data-popModalBut="close"]').bind('click', function () {
							popModalClose();
						});

						elemObj.find('[data-popModalBut="ok"]').bind('click', function (event) {
							var ok;
							if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
								ok = _options.onOkBut(event);
							}
							if (ok !== false) {
								popModalClose();
							}
						});

						elemObj.find('[data-popModalBut="cancel"]').bind('click', function () {
							if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
								_options.onCancelBut();
							}
							popModalClose();
						});

						$('html').on('keydown.' + elemClass + 'Event', function (event) {
							if (event.keyCode == 27) {
								popModalClose();
							}
						});

					}
					
				}
				
				function getPlacement() {
					var eLeft = elem.position().left,
					eTop = elem.position().top,
					eMLeft = elem.css('marginLeft'),
					eMTop = elem.css('marginTop'),
					eHeight = elem.outerHeight(),
					eWidth = elem.outerWidth(),
					eClassWidth = elemObj.outerWidth(),
					eClassHeight = elemObj.outerHeight()

					switch (_options.placement){
						case ('bottomLeft'):
							elemObj.css({
								left: eLeft + parseInt(eMLeft) + 'px'
							}).addClass('fadeInBottom');
						break;
						case ('bottomRight'):
							elemObj.css({
								left: eLeft + parseInt(eMLeft) + eWidth - eClassWidth + 'px'
							}).addClass('fadeInBottom');
						break;
						case ('bottomCenter'):
							elemObj.css({
								left: eLeft + parseInt(eMLeft) + (eWidth - eClassWidth) / 2 + 'px'
							}).addClass('fadeInBottom');
						break;
						case ('leftTop'):
							elemObj.css({
								top: eTop + parseInt(eMTop) + 'px',
								left: eLeft + parseInt(eMLeft) - eClassWidth - 10 + 'px'
							}).addClass('fadeInLeft');
						break;
						case ('rightTop'):
							elemObj.css({
								top: eTop + parseInt(eMTop) + 'px',
								left: eLeft + parseInt(eMLeft) + eWidth + 10 + 'px'
							}).addClass('fadeInRight');
						break;
						case ('leftCenter'):
							elemObj.css({
								top: eTop + parseInt(eMTop) + eHeight / 2 - eClassHeight / 2 + 'px',
								left: eLeft + parseInt(eMLeft) - eClassWidth - 10 + 'px'
							}).addClass('fadeInLeft');
						break;
						case ('rightCenter'):
							elemObj.css({
								top: eTop + parseInt(eMTop) + eHeight / 2 - eClassHeight / 2 + 'px',
								left: eLeft + parseInt(eMLeft) + eWidth + 10 + 'px'
							}).addClass('fadeInRight');
						break;
					}
					elemObj.width(eClassWidth);
				}
				
			},
			hide : function( ) {
				popModalClose();
			}
		};
		
		function popModalClose() {
			var elemObj = $('.' + elemClass),
			animClassOld = elemObj.attr('class'),
			animClassNew = animClassOld.replace('fadeIn', 'fadeOut');
			elemObj.removeClass(animClassOld).addClass(animClassNew);
			setTimeout(function () {
				elemObj.remove();
				$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
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

	$('* [data-popModalBind]').bind('click', function () {
		var elemBind = $(this).attr('data-popModalBind');
		var params = {html: $(elemBind).html()};
		if ($(this).attr('data-placement') != undefined) {
			params['placement'] = $(this).attr('data-placement');
		}
		if ($(this).attr('data-showCloseBut') != undefined) {
			params['showCloseBut'] = (/^true$/i).test($(this).attr('data-showCloseBut'));
		}
		if ($(this).attr('data-overflowContent') != undefined) {
			params['overflowContent'] = (/^true$/i).test($(this).attr('data-overflowContent'));
		}
		if ($(this).attr('data-onDocumentClickClose') != undefined) {
			params['onDocumentClickClose'] = (/^true$/i).test($(this).attr('data-onDocumentClickClose'));
		}
		$(this).popModal(params);
	});
	
  $.event.special.destroyed = {
    remove: function (o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery);


/* notifyModal */
(function ($) {
	$.fn.notifyModal = function(method){
		var elem = $(this),
		elemObj,
		notifyModal = 'notifyModal',
		onTopClass,
		_options,
		animTime;
		
		var methods = {
			init : function( params ) {
				var _defaults = {
					duration: 2500,
					placement: 'center',
					onTop : true
				};
				_options = $.extend(_defaults, params);
				
				if (_options.placement == '') {
					_options.placement = 'center';
				}
				if (_options.onTop) {
					onTopClass = 'onTop';
				} else {
					onTopClass = '';
				}
				
				$('.' + notifyModal).remove();
				var notifyContainer = $('<div class="' + notifyModal + ' ' + _options.placement + ' ' + onTopClass + '"></div>');
				var notifyContent = $('<div class="' + notifyModal + '_content"></div>');
				var closeBut = $('<button type="button" class="close">&times;</button>');
				notifyContent.append(closeBut, elem[0].innerHTML);
				notifyContainer.append(notifyContent);
				$('body').append(notifyContainer);

				elemObj = $('.' + notifyModal);
				animTime = elemObj.css('transitionDuration');
				if (animTime != undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
				
				setTimeout(function () {
					elemObj.addClass('open');
				}, animTime);

				elemObj.click(function () {
					notifyModalClose();
				});
				if (_options.duration != -1) {
					notifDur = setTimeout(notifyModalClose, _options.duration);
				}

			},
			hide : function( ) {
				notifyModalClose();
			}
		};
		
		function notifyModalClose() {
			var elemObj = $('.' + notifyModal);
			setTimeout(function () {
				elemObj.removeClass('open');
				setTimeout(function () {
					elemObj.remove();
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

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			
		}

	}
	
	$('* [data-notifyModalBind]').bind('click', function () {
		var elemBind = $(this).attr('data-notifyModalBind');
		var params = {};
		if ($(this).attr('data-duration') != undefined) {
			params['duration'] = parseInt($(this).attr('data-duration'));
		}
		if ($(this).attr('data-placement') != undefined) {
			params['placement'] = $(this).attr('data-placement');
		}
		if ($(this).attr('data-onTop') != undefined) {
			params['onTop'] = (/^true$/i).test($(this).attr('data-onTop'));
		}
		$(elemBind).notifyModal(params);
	});
	
})(jQuery);


/* hintModal */
(function ($) {
	$.fn.hintModal = function(method){
		var methods = {
			init : function( params ) {
		
				var hintModal = 'hintModal',
				el = $('.' + hintModal + '_container'),
				elObj = $('.' + hintModal);
				el.addClass('animated fadeInBottom');

				elObj.mouseenter(function () {
					var elCur = $(this).find('.' + hintModal + '_container');
					el.css({display: 'none'});
					var animClassOld = elCur.attr('class');
					var animClassNew = animClassOld.replace('fadeOut', 'fadeIn');
					elCur.removeClass(animClassOld).addClass(animClassNew).css({display: 'block'});
				});

				elObj.mouseleave(function () {
					var animClassOld = el.attr('class');
					var animClassNew = animClassOld.replace('fadeIn', 'fadeOut');
					el.removeClass(animClassOld).addClass(animClassNew).css({display: 'none'});
				});	
			
			}
		};

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			
		}
		
	}();
})(jQuery);


/* dialogModal */
(function ($) {
	$.fn.dialogModal = function(method){
		var elem = $(this),
		elemObj,
		elemContObj,
		elemClass = 'dialogModal',
		_options,
		animTime;
	
		var methods = {
			init : function( params ) {
				var _defaults = {
					onOkBut: function() {return true;},
					onCancelBut: function() {},
					onLoad: function() {},
					onClose: function() {},
				};
				_options = $.extend(_defaults, params);

				_init();
				function _init(){
					$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
					$('.dialogModal .dialogPrev, .dialogModal .dialogNext').off('click');
					$('.' + elemClass).remove();

					var currentDialog = 0,
					maxDialog = elem.length - 1,
					dialogMain = $('<div class="' + elemClass + '"></div>'),
					dialogContainer = $('<div class="' + elemClass + '_container"></div>'),
					dialogCloseBut = $('<button type="button" class="close">&times;</button>'),
					dialogBody = $('<div class="' + elemClass + '_body"></div>');
					dialogMain.append(dialogContainer);
					dialogContainer.append(dialogCloseBut, dialogBody);
					dialogBody.append(elem[currentDialog].innerHTML);
					
					if (maxDialog > 0) {
						dialogContainer.prepend($('<div class="dialogPrev notactive"></div><div class="dialogNext"></div>'));
					}
					$('html').append(dialogMain);
					elemObj = $('.' + elemClass);
					elemContObj = $('.' + elemClass + '_container');
					
					animTime = elemContObj.css('transitionDuration');
					if (animTime != undefined) {
						animTime = animTime.replace('s', '') * 1000;
					} else {
						animTime = 0;
					}

					if (_options.onLoad && $.isFunction(_options.onLoad)) {
						_options.onLoad();
					}

					elemObj.on('destroyed', function () {
						if (_options.onClose && $.isFunction(_options.onClose)) {
							_options.onClose();
						}
					});

					function centerDialog() {
						var dialogHeight = elemContObj.outerHeight(),
						windowHeight = $(window).height();
						if (windowHeight > dialogHeight + 80) {
							elemContObj.css({
								marginTop: ($(window).height() - dialogHeight) / 2 + 'px'
							});	
						} else {
							elemContObj.css({
								marginTop: '60px'
							});						
						}
						
						setTimeout(function () {
							elemObj.addClass('open');
							elemContObj.css({
								marginTop: parseInt(elemContObj.css('marginTop')) - 20 + 'px'
							});	
						}, animTime);
						
						bindFooterButtons();
					}
					
					function bindFooterButtons() {
						elemObj.find('[data-dialogModalBut="close"]').bind('click', function () {
							dialogModalClose();
						});

						elemObj.find('[data-dialogModalBut="ok"]').bind('click', function (event) {
							var ok;
							if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
								ok = _options.onOkBut(event);
							}
							if (ok !== false) {
								dialogModalClose();
							}
						});

						elemObj.find('[data-dialogModalBut="cancel"]').bind('click', function () {
							if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
								_options.onCancelBut();
							}
							dialogModalClose();
						});
					}
					
					centerDialog();

					elemObj.find('.dialogPrev').bind('click', function () {
						if (currentDialog > 0) {
							--currentDialog;
							if (currentDialog < maxDialog) {
								elemObj.find('.dialogNext').removeClass('notactive');
							}
							if (currentDialog == 0) {
								elemObj.find('.dialogPrev').addClass('notactive');
							}
							dialogBody.empty().append(elem[currentDialog].innerHTML);
							centerDialog();
						}
					});
					
					elemObj.find('.dialogNext').bind('click', function () {
						if (currentDialog < maxDialog) {
							++currentDialog;
							if (currentDialog > 0) {
								elemObj.find('.dialogPrev').removeClass('notactive');
							}
							if (currentDialog == maxDialog) {
								elemObj.find('.dialogNext').addClass('notactive');
							}
							dialogBody.empty().append(elem[currentDialog].innerHTML);
							centerDialog();
						}
					});

					elemObj.find('.close').bind('click', function () {
						dialogModalClose();
					});
					
					$('html').on('keydown.' + elemClass + 'Event', function (event) {
						if (event.keyCode == 27) {
							dialogModalClose();
						} else if (event.keyCode == 37) {
							elemObj.find('.dialogPrev').click();
						} else if (event.keyCode == 39) {
							elemObj.find('.dialogNext').click();
						}
					});
					
				}
					
			},
			hide : function( ) {
				dialogModalClose();
			}
		};
		
		function dialogModalClose() {
		var elemObj = $('.' + elemClass);
			setTimeout(function () {
				elemObj.removeClass('open');
				setTimeout(function () {
					elemObj.remove();
					$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
					elemObj.find('.dialogPrev').off('click');
					elemObj.find('.dialogNext').off('click');
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
	
	$('* [data-dialogModalBind]').bind('click', function () {
		var elemBind = $(this).attr('data-dialogModalBind');
		$(elemBind).dialogModal();
	});

  $.event.special.destroyed = {
    remove: function (o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery);
