/* popModal - 28.04.14 */
/* popModal */
(function($) {
	$.fn.popModal = function(method) {
		var elem = $(this),
		elemObj,
		isClick = checkEvent(elem, 'click'),
		isFixed = '',
		expandView = true,
		closeBut,
		elemClass = 'popModal',
		_options,
		animTime,
		effectIn = 'fadeIn',
		effectOut = 'fadeOut';
	
		var methods = {
			init : function(params) {
				var _defaults = {
					html: '',
					placement: 'bottomLeft',
					showCloseBut: true,
					onDocumentClickClose : true,
					onOkBut: function() {return true;},
					onCancelBut: function() {},
					onLoad: function() {},
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);

				if (isClick) {
					_init();
				} else {
					elem.on('click', function() {
						_init();
					});
				}
				
				function _init() {
				
					if (elem.next('div').hasClass(elemClass)) {
						popModalClose();
					} else {
						$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
						$('.' + elemClass).remove();

						if (_options.showCloseBut) {
							closeBut = $('<button type="button" class="close">&times;</button>');
						} else {
							closeBut = '';
						}

						if (elem.css('position') == 'fixed') {
							isFixed = 'position:fixed;';
						}
						var tooltipContainer = $('<div class="' + elemClass + ' ' + _options.placement + ' animated" style="' + isFixed + '"></div>');
						var tooltipContent = $('<div class="' + elemClass + '_content ' + elemClass + '_contentOverflow"></div>');
						tooltipContainer.append(closeBut, tooltipContent);
						
						if ($.isFunction(_options.html)) {
							var beforeLoadingContent = 'Please, waiting...';
							tooltipContent.append(beforeLoadingContent);
							_options.html(function(loadedContent) {
								tooltipContent.empty().append(loadedContent);
								elemObj = $('.' + elemClass);
								if (tooltipContent[0].innerHTML.search(/<form/) != -1) {
									elemObj.find('.' + elemClass + '_content').removeClass(elemClass + '_contentOverflow');
									expandView = true;
								} else {
									elemObj.find('.' + elemClass + '_content').addClass(elemClass + '_contentOverflow');
									getView();
								}
								getPlacement();
							});
						} else {
							tooltipContent.append(_options.html);
						}
						elem.after(tooltipContainer);

						elemObj = $('.' + elemClass);
						elemObj.append(elemObj.find('.' + elemClass + '_content .' + elemClass + '_footer'));
						
						if (!$.isFunction(_options.html) && _options.html.search(/<form/) != -1) {
							elemObj.find('.' + elemClass + '_content').removeClass(elemClass + '_contentOverflow');
						}

						if (_options.onLoad && $.isFunction(_options.onLoad)) {
							_options.onLoad();
						}

						elemObj.on('destroyed', function() {
							if (_options.onClose && $.isFunction(_options.onClose)) {
								_options.onClose();
							}
						});

						getView();
						getPlacement();

						if (_options.onDocumentClickClose) {
							$('html').on('click.' + elemClass + 'Event', function(event) {
								$(this).addClass(elemClass + 'Open');
								if (elemObj.is(':hidden')) {
									popModalClose();
								}
								var target = $(event.target);
								if (!target.parents().andSelf().is('.' + elemClass) && !target.parents().andSelf().is(elem)) {
								  var zIndex = parseInt(target.parents().filter(function() {
										return $(this).css('zIndex') !== 'auto';
									}).first().css('zIndex'));
									if (isNaN(zIndex)) {
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
						
						$(window).resize(function() {
							getPlacement();
						});
						
						elemObj.find('.close').bind('click', function() {
							popModalClose();
						});
						
						elemObj.find('[data-popModalBut="close"]').bind('click', function() {
							popModalClose();
						});

						elemObj.find('[data-popModalBut="ok"]').bind('click', function(event) {
							var ok;
							if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
								ok = _options.onOkBut(event);
							}
							if (ok !== false) {
								popModalClose();
							}
						});

						elemObj.find('[data-popModalBut="cancel"]').bind('click', function() {
							if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
								_options.onCancelBut();
							}
							popModalClose();
						});

						$('html').on('keydown.' + elemClass + 'Event', function(event) {
							if (event.keyCode == 27) {
								popModalClose();
							}
						});

					}
					
				}
				
			},
			hide : function() {
				popModalClose();
			}
		};
		
		function getView() {
			expandView = true;
			if (elem.parent().css('position') == 'absolute' || elem.parent().css('position') == 'fixed') {
			
			} else {
				if (elemObj.find('.' + elemClass + '_content').width() < 270) {
					expandView = false;
				}
			}
		}
		
		function getPlacement() {
			var offset = 10,
			eLeft = elem.position().left,
			eTop = elem.position().top,
			eMLeft = parseInt(elem.css('marginLeft')),
			ePLeft = parseInt(elem.css('paddingLeft')),
			eMTop = parseInt(elem.css('marginTop')),
			eHeight = elem.outerHeight(),
			eWidth = elem.outerWidth(),
			eClassMaxWidth = parseInt(elemObj.css('maxWidth')),
			eClassMinWidth = parseInt(elemObj.css('minWidth')),
			eClassWidth,
			eClassHeight = elemObj.outerHeight(),
			eClassMTop = parseInt(elemObj.css('marginTop'));
			
			if (expandView) {
				if (isNaN(eClassMaxWidth)) {
					eClassMaxWidth = 300;
				}
				eClassWidth = eClassMaxWidth;
			} else {
				if (isNaN(eClassMinWidth)) {
					eClassMinWidth = 180;
				}
				eClassWidth = eClassMinWidth;
			}
			elemObj.css({width: eClassWidth + 'px'});

			switch (_options.placement){
				case ('bottomLeft'):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + 'px'
					}).addClass('fadeInBottom');
				break;
				case ('bottomRight'):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + eWidth - eClassWidth + 'px'
					}).addClass('fadeInBottom');
				break;
				case ('bottomCenter'):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + (eWidth - eClassWidth) / 2 + 'px'
					}).addClass('fadeInBottom');
				break;
				case ('leftTop'):
					elemObj.css({
						top: eTop + eMTop + 'px',
						left: eLeft + eMLeft - eClassWidth - offset + 'px'
					}).addClass('fadeInLeft');
				break;
				case ('rightTop'):
					elemObj.css({
						top: eTop + eMTop + 'px',
						left: eLeft + eMLeft + eWidth + offset + 'px'
					}).addClass('fadeInRight');
				break;
				case ('leftCenter'):
					elemObj.css({
						top: eTop + eMTop + eHeight / 2 - eClassHeight / 2 + 'px',
						left: eLeft + eMLeft - eClassWidth - offset + 'px'
					}).addClass('fadeInLeft');
				break;
				case ('rightCenter'):
					elemObj.css({
						top: eTop + eMTop + eHeight / 2 - eClassHeight / 2 + 'px',
						left: eLeft + eMLeft + eWidth + offset + 'px'
					}).addClass('fadeInRight');
				break;
			}
		}
		
		function popModalClose() {
			elemObj = $('.' + elemClass);
			reverseEffect();
			getAnimTime();
			setTimeout(function () {
				elemObj.remove();
				$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
			}, animTime);
		}
		
		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('animationDuration');
				if (animTime != undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
			}
		}
		
		function reverseEffect() {
			var animClassOld = elemObj.attr('class'),
			animClassNew = animClassOld.replace(effectIn, effectOut);
			elemObj.removeClass(animClassOld).addClass(animClassNew);
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
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}

	}

	$('* [data-popModalBind]').bind('click', function() {
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
    remove: function(o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery);


/* notifyModal */
(function($) {
	$.fn.notifyModal = function(method) {
		var elem = $(this),
		elemObj,
		notifyModal = 'notifyModal',
		onTopClass,
		_options,
		animTime;
		
		var methods = {
			init : function(params) {
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
				getAnimTime();
				
				setTimeout(function() {
					elemObj.addClass('open');
				}, animTime);

				elemObj.click(function() {
					notifyModalClose();
				});
				if (_options.duration != -1) {
					notifDur = setTimeout(notifyModalClose, _options.duration);
				}

			},
			hide : function() {
				notifyModalClose();
			}
		};
		
		function notifyModalClose() {
			var elemObj = $('.' + notifyModal);
			setTimeout(function() {
				elemObj.removeClass('open');
				setTimeout(function() {
					elemObj.remove();
					if (_options.duration != -1) {
						clearTimeout(notifDur);
					}
				}, animTime);
			}, animTime);

		}

		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('transitionDuration');
				if (animTime != undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
			}
		}
		
		$('html').keydown(function(event) {
			if (event.keyCode == 27) {
				notifyModalClose();
			}
		});

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}

	}
	
	$('* [data-notifyModalBind]').bind('click', function() {
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
(function($) {
	$.fn.hintModal = function(method){
		var hintModal = 'hintModal',
		elem = $('.' + hintModal + '_container'),
		elemObj = $('.' + hintModal),
		animTime,
		effectIn = 'fadeIn',
		effectOut = 'fadeOut';				
		elem.addClass('animated ' + effectIn +'Bottom');
	
		var methods = {
			init : function(params) {

				elemObj.mouseenter(function() {
					var elemCur = $(this).find('.' + hintModal + '_container');
					elem.css({display: 'none'});
					var animClassOld = elemCur.attr('class');
					var animClassNew = animClassOld.replace(effectOut, effectIn);
					elemCur.removeClass(animClassOld).addClass(animClassNew).css({display: 'block'});
				});

				elemObj.mouseleave(function() {
					var animClassOld = elem.attr('class');
					var animClassNew = animClassOld.replace(effectIn, effectOut);
					elem.removeClass(animClassOld).addClass(animClassNew);
					getAnimTime();
					setTimeout(function() {
						elem.css({display: 'none'});
					}, animTime);
				});
			
				function getAnimTime() {
					if (!animTime) {
						animTime = elem.css('animationDuration');
						if (animTime != undefined) {
							animTime = animTime.replace('s', '') * 1000;
						} else {
							animTime = 0;
						}
					}
				}
			
			}
		};

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		
	}();
})(jQuery);


/* dialogModal */
(function($) {
	$.fn.dialogModal = function(method) {
		var elem = $(this),
		elemObj,
		elemContObj,
		elemClass = 'dialogModal',
		_options,
		animTime;
	
		var methods = {
			init : function(params) {
				var _defaults = {
					onOkBut: function() {return true;},
					onCancelBut: function() {},
					onLoad: function() {},
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);

				_init();
				function _init() {
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
					$('body').append(dialogMain);
					elemObj = $('.' + elemClass);
					elemContObj = $('.' + elemClass + '_container');
					getAnimTime();

					if (_options.onLoad && $.isFunction(_options.onLoad)) {
						_options.onLoad();
					}

					elemObj.on('destroyed', function() {
						if (_options.onClose && $.isFunction(_options.onClose)) {
							_options.onClose();
						}
					});
					
					centerDialog();
					
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
						
						$('body').addClass(elemClass + 'Open');
						elemObj.addClass('open');

						setTimeout(function() {
							elemObj.addClass('open');
							elemContObj.css({
								marginTop: parseInt(elemContObj.css('marginTop')) - 20 + 'px'
							});	
						}, animTime);
						
						bindFooterButtons();
					}
					
					function bindFooterButtons() {
						elemObj.find('[data-dialogModalBut="close"]').bind('click', function() {
							dialogModalClose();
						});

						elemObj.find('[data-dialogModalBut="ok"]').bind('click', function(event) {
							var ok;
							if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
								ok = _options.onOkBut(event);
							}
							if (ok !== false) {
								dialogModalClose();
							}
						});

						elemObj.find('[data-dialogModalBut="cancel"]').bind('click', function() {
							if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
								_options.onCancelBut();
							}
							dialogModalClose();
						});
					}

					elemObj.find('.dialogPrev').bind('click', function() {
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
					
					elemObj.find('.dialogNext').bind('click', function() {
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

					elemObj.find('.close').bind('click', function() {
						dialogModalClose();
					});
					
					$('html').on('keydown.' + elemClass + 'Event', function(event) {
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
			hide : function() {
				dialogModalClose();
			}
		};
		
		function dialogModalClose() {
		var elemObj = $('.' + elemClass);
			setTimeout(function() {
				elemObj.removeClass('open');
				setTimeout(function() {
					elemObj.remove();
					$('body').removeClass(elemClass + 'Open');
					$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
					elemObj.find('.dialogPrev').off('click');
					elemObj.find('.dialogNext').off('click');
				}, animTime);
			}, animTime);
		}
		
		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('transitionDuration');
				if (animTime != undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
			}
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
		
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		}

	}
	
	$('* [data-dialogModalBind]').bind('click', function() {
		var elemBind = $(this).attr('data-dialogModalBind');
		$(elemBind).dialogModal();
	});

  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery);


/* titleModal */
(function($) {
	$.fn.titleModal = function(method) {
		var methods = {
			init : function(params) {
				var getElem = $('*[data-titleModal]'),
				elem,
				elemObj,
				animTime,
				effectIn = 'fadeIn',
				effectOut = 'fadeOut';
				
				getElem.mouseenter(function() {
					elem = $(this);
					titleAttr =	elem.attr('title');
					elem.removeAttr('title');
					elem.attr('data-title', titleAttr);
					titleModal = $('<div class="titleModal animated"></div>');
					elemObj = $('.titleModal');
					placement = elem.attr('data-placement');
					if (placement == undefined) {
						placement = 'bottom';
					}
					if (elemObj) {
						elemObj.remove();
					}
					elem.after(titleModal.append(titleAttr));
					getPlacement();
				});

				getElem.mouseleave(function() {
					elem = $(this);
					titleAttr =	elem.attr('data-title');
					elem.removeAttr('data-title');
					elem.attr('title', titleAttr);
					reverseEffect();
					getAnimTime();
					setTimeout(function() {
						elemObj.remove();
					},animTime);
				});
				
				function getPlacement() {
					elemObj = $('.titleModal');
					var eLeft = elem.position().left,
					eTop = elem.position().top,
					eMLeft = elem.css('marginLeft'),
					eMTop = elem.css('marginTop'),
					eMBottom = elem.css('marginBottom'),
					eHeight = elem.outerHeight(),
					eWidth = elem.outerWidth(),
					eClassMTop = elemObj.css('marginTop'),
					eClassWidth = elemObj.outerWidth(),
					eClassHeight = elemObj.outerHeight();
					switch (placement) {
						case 'bottom':
							elemObj.css({
								marginTop: parseInt(eClassMTop) - parseInt(eMBottom) + 'px',
								left: eLeft + parseInt(eMLeft) + (eWidth - eClassWidth) / 2 + 'px'
							}).addClass(effectIn + 'Bottom');	
						break;
						case 'top':
							elemObj.css({
								top: eTop + parseInt(eMTop) - eClassHeight + 'px',
								left: eLeft + parseInt(eMLeft) + (eWidth - eClassWidth) / 2 + 'px'
							}).addClass('top ' + effectIn + 'Top');	
						break;
						case 'left':
							elemObj.css({
								top: eTop + parseInt(eMTop) + eHeight / 2 - eClassHeight / 2 + 'px',
								left: eLeft + parseInt(eMLeft) - eClassWidth - 10 + 'px'
							}).addClass('left ' + effectIn + 'Left');	
						break;
						case 'right':
							elemObj.css({
								top: eTop + parseInt(eMTop) + eHeight / 2 - eClassHeight / 2 + 'px',
								left: eLeft + parseInt(eMLeft) + eWidth + 10 + 'px'
							}).addClass('right ' + effectIn + 'Right');	
						break;
					
					}
				}
				
				function getAnimTime() {
					if (!animTime) {
						animTime = elemObj.css('animationDuration');
						if (animTime != undefined) {
							animTime = animTime.replace('s', '') * 1000;
						} else {
							animTime = 0;
						}
					}
				}
				
				function reverseEffect() {
					var animClassOld = elemObj.attr('class'),
					animClassNew = animClassOld.replace(effectIn, effectOut);
					elemObj.removeClass(animClassOld).addClass(animClassNew);
				}

			}
		};

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		}
		
	}();
})(jQuery);
