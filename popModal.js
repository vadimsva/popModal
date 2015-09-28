/*
popModal - 1.19 [04.09.15]
Author: vadimsva
Github: https://github.com/vadimsva/popModal
*/
/* popModal */
(function($) {
	$.fn.popModal = function(method) {
		var elem = $(this),
		elemObj,
		isFixed = '',
		closeBut = '',
		elemClass = 'popModal',
		overflowContentClass,
		_options,
		animTime,
		effectIn = 'fadeIn',
		effectOut = 'fadeOut',
		bl = 'bottomLeft',
		bc = 'bottomCenter',
		br = 'bottomRight',
		lt = 'leftTop',
		lc = 'leftCenter',
		rt = 'rightTop',
		rc = 'rightCenter';
		
		var currentID;
	
		var methods = {
			init : function(params) {
				var _defaults = {
					html: '',
					placement: bl,
					showCloseBut: true,
					onDocumentClickClose : true,
          onDocumentClickClosePrevent : '',
					overflowContent : false,
					inline : true,
					beforeLoadingContent : 'Please, wait...',
					onOkBut: function() {return true;},
					onCancelBut: function() {},
					onLoad: function() {},
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);
				
				if ( $('body').find('.' + elemClass).length !== 0 && $('body').find('.' + elemClass).attr('data-popmodal_id') == elem.attr('data-popmodal_id') ) {
					popModalClose();
				} else {
					$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
					$('.' + elemClass + '_source').replaceWith($('.' + elemClass + '_content').children());
					$('.' + elemClass).remove();

					if (_options.showCloseBut) {
						closeBut = $('<button type="button" class="close">&times;</button>');
					}
					if (elem.css('position') == 'fixed') {
						isFixed = 'position:fixed;';
					}
					if (_options.overflowContent) {
					overflowContentClass = elemClass + '_contentOverflow';
					} else {
						overflowContentClass = '';
					}
					
					currentID = new Date().getMilliseconds();
					elem.attr('data-popmodal_id', currentID);
					
					var tooltipContainer = $('<div class="' + elemClass + ' animated" style="' + isFixed + '" data-popmodal_id="' + currentID + '"></div>');
					var tooltipContent = $('<div class="' + elemClass + '_content ' + overflowContentClass + '"></div>');
					tooltipContainer.append(closeBut, tooltipContent);
					
					if ($.isFunction(_options.html)) {
						var beforeLoadingContent = _options.beforeLoadingContent;
						tooltipContent.append(beforeLoadingContent);
						_options.html(function(loadedContent) {
							tooltipContent.empty().append(loadedContent);
							elemObj = $('.' + elemClass);
							getPlacement();
						});
					} else {
						if ($.type(_options.html) == 'object') {
							_options.html.after($('<div class="popModal_source"></div>'));
						}
						tooltipContent.append(_options.html);
					}
					if($(window).width() <= 500) {
						_options.inline = true;
					}
					
					if (_options.inline) {
						elem.after(tooltipContainer);
					} else {
						$('body').append(tooltipContainer);
					}
					
					elemObj = $('.' + elemClass);
					var elemObjFooter = elemObj.find('.' + elemClass + '_footer');
					if (elemObjFooter) {
						elemObj.find('.' + elemClass + '_content').css({marginBottom: elemObjFooter.outerHeight() + 'px'});
					}
					
					if (!$.isFunction(_options.html)) {
            var htmlStr;
						if ($.type(_options.html) == 'string') {
							htmlStr = _options.html;
						} else {
							htmlStr = _options.html[0].outerHTML;
						}
					}					

					if (_options.onLoad && $.isFunction(_options.onLoad)) {
						_options.onLoad();
					}
					$(_options.html).trigger('load');

					elemObj.on('destroyed', function() {
						if (_options.onClose && $.isFunction(_options.onClose)) {
							_options.onClose();
						}
						$(_options.html).trigger('close');
					});

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
                if (_options.onDocumentClickClosePrevent !== '' && target.is(_options.onDocumentClickClosePrevent)) {
                  zIndex = 9999;
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
					
					elemObj.find('.close').on('click', function() {
						popModalClose();
						$(this).off('click');
					});
					
					elemObj.find('[data-popmodal-but="close"]').on('click', function() {
						popModalClose();
						$(this).off('click');
					});

					elemObj.find('[data-popmodal-but="ok"]').on('click', function(event) {
						var ok;
						if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
							ok = _options.onOkBut(event);
						}
						if (ok !== false) {
							popModalClose();
						}
						$(this).off('click');
						$(_options.html).trigger('okbut');
					});

					elemObj.find('[data-popmodal-but="cancel"]').on('click', function() {
						if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
							_options.onCancelBut();
						}
						popModalClose();
						$(this).off('click');
						$(_options.html).trigger('cancelbut');
					});

					$('html').on('keydown.' + elemClass + 'Event', function(event) {
						if (event.keyCode == 27) {
							popModalClose();
						}
					});

				}
				return elemObj;
			},
			hide : function() {
				popModalClose();
			}
		};
		
		function getPlacement() {
			if (_options.inline) {
				var eLeft = elem.position().left;
				var eTop = elem.position().top;
			} else {
				var eLeft = elem.offset().left;
				var eTop = elem.offset().top;
			}
			var offset = 10,
			eMLeft = parseInt(elem.css('marginLeft')),
			ePLeft = parseInt(elem.css('paddingLeft')),
			eMTop = parseInt(elem.css('marginTop')),
			eHeight = elem.outerHeight(),
			eWidth = elem.outerWidth(),
			eObjWidth = elemObj.outerWidth(),
			eObjHeight = elemObj.outerHeight();
			
			var placement,
			eOffsetLeft = elem.offset().left,
			eOffsetRight = $(window).width() - elem.offset().left - eWidth,
			eOffsetTop = elem.offset().top,
			deltaL = eOffsetLeft - offset - eObjWidth,
			deltaBL = eWidth + eOffsetLeft - eObjWidth,
			deltaR = eOffsetRight - offset - eObjWidth,
			deltaBR = eWidth + eOffsetRight - eObjWidth,
			deltaCL = eWidth / 2 + eOffsetLeft - eObjWidth / 2,
			deltaCR = eWidth / 2 + eOffsetRight - eObjWidth / 2,
			deltaC = Math.min(deltaCR, deltaCL),
			deltaCT = eOffsetTop - eObjHeight / 2;

			function optimalPosition(current) {
				var optimal;
				var maxDelta = Math.max(deltaBL, deltaBR, deltaC);
				if (isCurrentFits(current)) {
				  optimal = current;
				} else if (deltaBR > 0 && deltaBR == maxDelta) {
					optimal = bl;
				} else if (deltaBL > 0 && deltaBL == maxDelta) {
					optimal = br;
				} else if (deltaC > 0 && deltaC == maxDelta) {
					optimal = bc;
				} else {
					optimal = current;
				}
				return optimal;
			}
			
			function isCurrentFits(current) {
			  return current == bl ? deltaBR > 0 
				: current == br ? deltaBL > 0 
				: deltaC > 0;
			}
			
			if ((/^bottom/).test(_options.placement)) {
				placement = optimalPosition(_options.placement);
			} else if ((/^left/).test(_options.placement)) {
				if (deltaL > 0) {
					if (_options.placement == lc && deltaCT > 0) {
						placement = lc;
					} else {
						placement = lt;
					}
				} else {
					placement = optimalPosition(bl);
				}
			} else if ((/^right/).test(_options.placement)) {
				if (deltaR > 0) {
					if (_options.placement == rc && deltaCT > 0) {
						placement = rc;
					} else {
						placement = rt;
					}
				} else {
					placement = optimalPosition(br);
				}
			}
			
			elemObj.removeAttr('class').addClass(elemClass + ' animated ' + placement);
			switch (placement){
				case (bl):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + 'px'
					}).addClass(effectIn + 'Bottom');
				break;
				case (br):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + eWidth - eObjWidth + 'px'
					}).addClass(effectIn + 'Bottom');
				break;
				case (bc):
					elemObj.css({
						top: eTop + eMTop + eHeight + offset + 'px',
						left: eLeft + eMLeft + (eWidth - eObjWidth) / 2 + 'px'
					}).addClass(effectIn + 'Bottom');
				break;
				case (lt):
					elemObj.css({
						top: eTop + eMTop + 'px',
						left: eLeft + eMLeft - eObjWidth - offset + 'px'
					}).addClass(effectIn + 'Left');
				break;
				case (rt):
					elemObj.css({
						top: eTop + eMTop + 'px',
						left: eLeft + eMLeft + eWidth + offset + 'px'
					}).addClass(effectIn + 'Right');
				break;
				case (lc):
					elemObj.css({
						top: eTop + eMTop + eHeight / 2 - eObjHeight / 2 + 'px',
						left: eLeft + eMLeft - eObjWidth - offset + 'px'
					}).addClass(effectIn + 'Left');
				break;
				case (rc):
					elemObj.css({
						top: eTop + eMTop + eHeight / 2 - eObjHeight / 2 + 'px',
						left: eLeft + eMLeft + eWidth + offset + 'px'
					}).addClass(effectIn + 'Right');
				break;
			}
		}
		
		function popModalClose() {
			elemObj = $('.' + elemClass);
			if (elemObj.length) {
				reverseEffect();
				getAnimTime();
				setTimeout(function () {
					$('.' + elemClass + '_source').replaceWith($('.' + elemClass + '_content').children());
					elemObj.remove();
					$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
				}, animTime);
			}
		}
		
		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('animationDuration');
				if (animTime !== undefined) {
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

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}

	};

	$('* [data-popmodal-bind]').bind('click', function() {
		var elemBind = $(this).attr('data-popmodal-bind');
		var params = {html: $(elemBind)};
		if ($(this).attr('data-placement') !== undefined) {
			params['placement'] = $(this).attr('data-placement');
		}
		if ($(this).attr('data-showclose-but') !== undefined) {
			params['showCloseBut'] = (/^true$/i).test($(this).attr('data-showclose-but'));
		}
		if ($(this).attr('data-overflowcontent') !== undefined) {
			params['overflowContent'] = (/^false$/i).test($(this).attr('data-overflowcontent'));
		}
		if ($(this).attr('data-ondocumentclick-close') !== undefined) {
			params['onDocumentClickClose'] = (/^true$/i).test($(this).attr('data-ondocumentclick-close'));
		}
		if ($(this).attr('data-ondocumentclick-close-prevent') !== undefined) {
			params['onDocumentClickClosePrevent'] = $(this).attr('data-ondocumentclick-close-prevent');
		}
		if ($(this).attr('data-inline') !== undefined) {
			params['inline'] = (/^true$/i).test($(this).attr('data-inline'));
		}
		if ($(this).attr('data-beforeloading-content') !== undefined) {
			params['beforeLoadingContent'] = $(this).attr('data-beforeloading-content');
		}
		$(this).popModal(params);
	});
	
  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler();
      }
    }
  };
})(jQuery);


/* notifyModal */
(function($) {
	$.fn.notifyModal = function(method) {
		var elem = $(this),
		elemObj,
		elemClass = 'notifyModal',
		onTopClass = '',
		_options,
		animTime;
		
		var methods = {
			init : function(params) {
				var _defaults = {
					duration: 2500,
					placement: 'center',
					type: 'notify',
					overlay : true,
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);
				
				if (_options.overlay) {
					onTopClass = 'overlay';
				}
				
				$('.' + elemClass).remove();
				var notifyContainer = $('<div class="' + elemClass + ' ' + _options.placement + ' ' + onTopClass + ' ' + _options.type + '"></div>');
				var notifyContent = $('<div class="' + elemClass + '_content"></div>');
				var closeBut = $('<button type="button" class="close">&times;</button>');
				if (elem[0] === undefined) {
					elem = elem['selector'];
				} else {
					elem = elem[0].innerHTML;
				}
				notifyContent.append(closeBut, elem);
				notifyContainer.append(notifyContent);
				$('body').append(notifyContainer);

				elemObj = $('.' + elemClass);
				getAnimTime();
				
				elemObj.addClass('open');
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
			var elemObj = $('.' + elemClass);
			elemObj.removeClass('open');
			setTimeout(function() {
				elemObj.remove();
				if (_options.duration != -1) {
					clearTimeout(notifDur);
				}
				if (_options.onClose && $.isFunction(_options.onClose)) {
					_options.onClose();
				}
			}, animTime);
		}

		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('transitionDuration');
				if (animTime !== undefined) {
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

	};
	
	$('* [data-notifymodal-bind]').bind('click', function() {
		var elemBind = $(this).attr('data-notifymodal-bind');
		var params = {};
		if ($(this).attr('data-duration') !== undefined) {
			params['duration'] = parseInt($(this).attr('data-duration'));
		}
		if ($(this).attr('data-placement') !== undefined) {
			params['placement'] = $(this).attr('data-placement');
		}
		if ($(this).attr('data-ontop') !== undefined) {
			params['onTop'] = (/^true$/i).test($(this).attr('data-ontop'));
		}
		$(elemBind).notifyModal(params);
	});
	
})(jQuery);


/* hintModal */
(function($) {
	$.fn.hintModal = function(method){
		$('.hintModal').off();
	
		var methods = {
			init : function() {

				$(this).on('mouseenter', function() {
					var elem = $(this).find('> .hintModal_container');
					if(elem[0].textContent.length > 1){
						elem.addClass('animated fadeInBottom');
						getPlacement($(this), elem);
					}
				});
				
				$(this).on('mouseleave', function() {
					var elem = $(this).find('> .hintModal_container');
					if(elem[0].textContent.length > 1){
						elem.removeClass('animated fadeInBottom');
					}
				});

				function getPlacement(elemObj, elem) {
					var placementDefault,
					classDefault = elemObj.attr('class'),
					eObjWidth = elemObj.outerWidth(),
					eWidth = elem.outerWidth(),
					eOffsetLeft = elemObj.offset().left,
					eOffsetRight = $(window).width() - elemObj.offset().left - eObjWidth,
					deltaBL = eObjWidth + eOffsetLeft - eWidth,
					deltaBR = eObjWidth + eOffsetRight - eWidth,
					deltaCL = eObjWidth / 2 + eOffsetLeft - eWidth / 2,
					deltaCR = eObjWidth / 2 + eOffsetRight - eWidth / 2,
					deltaC = Math.min(deltaCR, deltaCL),
					bl = 'bottomLeft',
					bc = 'bottomCenter',
					br = 'bottomRight';
					
					if (elemObj.hasClass(bl)) {
						placementDefault = bl;
					} else if (elemObj.hasClass(bc)) {
						placementDefault = bc;
					} else if (elemObj.hasClass(br)) {
						placementDefault = br;
					} else {
						placementDefault = bl;
					}
					
					if (elemObj.data('placement') === undefined) {
						elemObj.data('placement', placementDefault);
					}

					function optimalPosition(current) {
						var optimal;
						var maxDelta = Math.max(deltaBL, deltaBR, deltaC);
						if (isCurrentFits(current)) {
							optimal = current;
						} else if (deltaBR > 0 && deltaBR == maxDelta) {
							optimal = bl;
						} else if (deltaBL > 0 && deltaBL == maxDelta) {
							optimal = br;
						} else if (deltaC > 0 && deltaC == maxDelta) {
							optimal = bc;
						} else {
							optimal = current;
						}
						return optimal;
					}
					
					function isCurrentFits(current) {
						return current == bl ? deltaBR > 0 
						: current == br ? deltaBL > 0 
						: deltaC > 0;
					}
					
					elemObj.removeAttr('class').addClass(classDefault + ' ' + optimalPosition(elemObj.data('placement')));
				}
			
			}
		};

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		}
		
	};
	$('.hintModal').hintModal();
})(jQuery);


/* dialogModal */
(function($) {
	$.fn.dialogModal = function(method) {
		var elem = $(this),
		elemObj,
		elemClass = 'dialogModal',
		prevBut = 'dialogPrev',
		nextBut = 'dialogNext',
		_options,
		animTime;
	
		var methods = {
			init : function(params) {
				var _defaults = {
					topOffset: 0,
					onOkBut: function() {return true;},
					onCancelBut: function() {},
					onLoad: function() {},
					onClose: function() {},
					onChange: function() {}
				};
				_options = $.extend(_defaults, params);

				$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
				$('.' + elemClass + ' .' + prevBut + ', .' + elemClass + ' .' + nextBut).off('click');
				$('.' + elemClass).remove();

				var currentDialog = 0,
				maxDialog = elem.length - 1,
				dialogMain = $('<div class="' + elemClass + '" style="top:' + _options.topOffset + 'px"></div>'),
				dialogTop = $('<div class="' + elemClass + '_top animated"></div>'),
				dialogHeader = $('<div class="' + elemClass + '_header"></div>'),
				dialogBody = $('<div class="' + elemClass + '_body animated"></div>'),
				dialogCloseBut = $('<button type="button" class="close">&times;</button>');
				dialogMain.append(dialogTop, dialogBody);
				dialogTop.append(dialogHeader);
				dialogHeader.append(dialogCloseBut);
				dialogBody.append(elem[currentDialog].innerHTML);

				if (maxDialog > 0) {
					dialogHeader.append($('<div class="' + nextBut + '">&rsaquo;</div><div class="' + prevBut + ' notactive">&lsaquo;</div>'));
				}
				dialogHeader.append('<span>' + elem.find('.' + elemClass + '_header')[currentDialog].innerHTML + '</span>');
				
				$('body').append(dialogMain).addClass(elemClass + 'Open');
				var getScrollBarWidth = dialogMain.outerWidth() - dialogMain[0].scrollWidth;
				dialogTop.css({right:getScrollBarWidth + 'px'});
				
				elemObj = $('.' + elemClass);
				getAnimTime();

				if (_options.onLoad && $.isFunction(_options.onLoad)) {
					_options.onLoad(elemObj, currentDialog + 1);
				}
				elem.trigger('load', {el: elemObj, current: currentDialog + 1});

				elemObj.on('destroyed', function() {
					if (_options.onClose && $.isFunction(_options.onClose)) {
						_options.onClose();
					}
					elem.trigger('close');
				});
				
				elemObj.addClass('open');
				setTimeout(function() {
					dialogTop.addClass('fadeInTopBig');
					dialogBody.addClass('fadeInTopBig');
				}, animTime + 100);
				
				bindFooterButtons();
				
				function bindFooterButtons() {
					elemObj.find('[data-dialogmodal-but="close"]').on('click', function() {
						dialogModalClose();
						$(this).off('click');
					});

					elemObj.find('[data-dialogmodal-but="ok"]').on('click', function(event) {
						var ok;
						if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
							ok = _options.onOkBut(event);
						}
						if (ok !== false) {
							dialogModalClose();
						}
						$(this).off('click');
						elem.trigger('okbut');
					});

					elemObj.find('[data-dialogmodal-but="cancel"]').on('click', function() {
						if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
							_options.onCancelBut();
						}
						dialogModalClose();
						$(this).off('click');
						elem.trigger('cancelbut');
					});
					
					elemObj.find('[data-dialogmodal-but="prev"]').on('click', function() {
						elemObj.find('.' + prevBut).click();
					});
					
					elemObj.find('[data-dialogmodal-but="next"]').on('click', function() {
						elemObj.find('.' + nextBut).click();
					});
				}

				elemObj.find('.' + prevBut).on('click', function() {
					if (currentDialog > 0) {
						--currentDialog;
						if (currentDialog < maxDialog) {
							elemObj.find('.' + nextBut).removeClass('notactive');
						}
						if (currentDialog === 0) {
							elemObj.find('.' + prevBut).addClass('notactive');
						}
						changeDialogContent();
					}
				});
				
				elemObj.find('.' + nextBut).on('click', function() {
					if (currentDialog < maxDialog) {
						++currentDialog;
						if (currentDialog > 0) {
							elemObj.find('.' + prevBut).removeClass('notactive');
						}
						if (currentDialog == maxDialog) {
							elemObj.find('.' + nextBut).addClass('notactive');
						}
						changeDialogContent();
					}
				});
				
				function changeDialogContent() {
					dialogBody.empty().append(elem[currentDialog].innerHTML);
					dialogHeader.find('span').html(elem.find('.' + elemClass + '_header')[currentDialog].innerHTML);
					bindFooterButtons();
					if (_options.onChange && $.isFunction(_options.onChange)) {
						_options.onChange(elemObj, currentDialog + 1);
					}
					elem.trigger('change', {el: elemObj, current: currentDialog + 1});
				}

				elemObj.find('.close').on('click', function() {
					dialogModalClose();
					$(this).off('click');
				});
				
				$('html').on('keydown.' + elemClass + 'Event', function(event) {
					if (event.keyCode == 27) {
						dialogModalClose();
					} else if (event.keyCode == 37) {
						elemObj.find('.' + prevBut).click();
					} else if (event.keyCode == 39) {
						elemObj.find('.' + nextBut).click();
					}
				});
					
			},
			hide : function() {
				dialogModalClose();
			}
		};
		
		function dialogModalClose() {
		var elemObj = $('.' + elemClass);
			elemObj.removeClass('open');
			setTimeout(function() {
				elemObj.remove();
				$('body').removeClass(elemClass + 'Open').css({paddingRight:''});
				$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
				elemObj.find('.' + prevBut).off('click');
				elemObj.find('.' + nextBut).off('click');
			}, animTime);
		}
		
		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('transitionDuration');
				if (animTime !== undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
			}
		}

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		}

	};
	
	$('* [data-dialogmodal-bind]').bind('click', function() {
		var elemBind = $(this).attr('data-dialogmodal-bind');
		var params = {};
		if ($(this).attr('data-topoffset') !== undefined) {
			params['topOffset'] = $(this).attr('data-topoffset');
		}
		$(elemBind).dialogModal(params);
	});

  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler();
      }
    }
  };
})(jQuery);


/* titleModal */
(function($) {
	$.fn.titleModal = function(method) {
	$('.titleModal').off();
	
		var methods = {
			init : function() {
				var elem,
				elemObj,
				elemClass = 'titleModal',
				getElem = $('.' + elemClass),
				effectIn = 'fadeIn',
				effectOut = 'fadeOut';

				getElem.on('mouseenter', function() {
					elem = $(this);
          var titleAttr;
					if(elem.attr('title') !== undefined || elem.css('textOverflow') == 'ellipsis' || elem.css('textOverflow') == 'clip') {
						if(elem.attr('title') !== undefined) {
							titleAttr =	elem.attr('title');
						} else {
							titleAttr = elem.text();
						}
						elem.removeAttr('title');
						elem.attr('data-title', titleAttr);
						var titleModal = $('<div class="' + elemClass + '_container animated"></div>');
						elemObj = $('.' + elemClass + '_container');
						var placement = elem.attr('data-placement');
						if (placement === undefined) {
							placement = 'bottom';
						}
						if (elemObj) {
							elemObj.remove();
						}
						elem.append(titleModal.append(titleAttr));
						getPlacement(placement);
					}
				});

				getElem.on('mouseleave', function() {
					elem = $(this);
          var titleAttr;
					if(elem.attr('data-title') !== undefined){
						titleAttr =	elem.attr('data-title');
						elem.removeAttr('data-title');
						elem.attr('title', titleAttr);
						reverseEffect();
						elemObj.remove();
					}
				});
				
				function getPlacement(placement) {
					elemObj = $('.' + elemClass + '_container');
					var eLeft, eTop,
					eMLeft = elem.css('marginLeft'),
					eMTop = elem.css('marginTop'),
					eMBottom = elem.css('marginBottom'),
					eHeight = elem.outerHeight(),
					eWidth = elem.outerWidth(),
					eObjMTop = elemObj.css('marginTop'),
					eObjWidth = elemObj.outerWidth(),
					eObjHeight = elemObj.outerHeight();
					if (elem.css('position') == 'fixed' || elem.css('position') == 'absolute') {
						eLeft = 0;
						eTop = 0;
					} else {
						eLeft = elem.position().left;
						eTop = elem.position().top;
					}
					switch (placement) {
						case 'bottom':
							elemObj.css({
								marginTop: parseInt(eObjMTop) - parseInt(eMBottom) + 'px',
								left: eLeft + parseInt(eMLeft) + (eWidth - eObjWidth) / 2  + 'px'
							}).addClass(effectIn + 'Bottom');	
						break;
						case 'top':
							elemObj.css({
								top: eTop + parseInt(eMTop) - eObjHeight + 'px',
								left: eLeft + parseInt(eMLeft) + (eWidth - eObjWidth) / 2 + 'px'
							}).addClass('top ' + effectIn + 'Top');	
						break;
						case 'left':
							elemObj.css({
								top: eTop + parseInt(eMTop) + eHeight / 2 - eObjHeight / 2 + 'px',
								left: eLeft + parseInt(eMLeft) - eObjWidth - 10 + 'px'
							}).addClass('left ' + effectIn + 'Left');	
						break;
						case 'right':
							elemObj.css({
								top: eTop + parseInt(eMTop) + eHeight / 2 - eObjHeight / 2 + 'px',
								left: eLeft + parseInt(eMLeft) + eWidth + 10 + 'px'
							}).addClass('right ' + effectIn + 'Right');	
						break;
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
		
	};
	$('.titleModal').titleModal();
})(jQuery);


/* confirmModal */
(function($) {
	$.fn.confirmModal = function(method) {
		var elem = $(this),
		elemObj,
		elemClass = 'confirmModal',
		_options,
		animTime;
	
		var methods = {
			init : function(params) {
				var _defaults = {
					topOffset: 0,
					onOkBut: function() {return true;},
					onCancelBut: function() {},
					onLoad: function() {},
					onClose: function() {}
				};
				_options = $.extend(_defaults, params);

				$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
				$('.' + elemClass).remove();

				var	dialogMain = $('<div class="' + elemClass + '" style="top:' + _options.topOffset + 'px"></div>'),
				dialogBody = $('<div class="' + elemClass + '_body animated"></div>');
				dialogMain.append(dialogBody);
				dialogBody.append(elem[0].innerHTML);
				
				$('body').append(dialogMain).addClass(elemClass + 'Open');
				
				elemObj = $('.' + elemClass);
				getAnimTime();

				if (_options.onLoad && $.isFunction(_options.onLoad)) {
					_options.onLoad();
				}

				elemObj.on('destroyed', function() {
					if (_options.onClose && $.isFunction(_options.onClose)) {
						_options.onClose();
					}
				});
				
				elemObj.addClass('open');
				setTimeout(function() {
					dialogBody.addClass('fadeInTopBig');
				}, animTime + 100);
				
				bindFooterButtons();
				
				function bindFooterButtons() {
					elemObj.find('[data-confirmmodal-but="close"]').on('click', function() {
						confirmModalClose();
						$(this).off('click');
					});

					elemObj.find('[data-confirmmodal-but="ok"]').on('click', function(event) {
						var ok;
						if (_options.onOkBut && $.isFunction(_options.onOkBut)) {
							ok = _options.onOkBut(event);
						}
						if (ok !== false) {
							confirmModalClose();
						}
						$(this).off('click');
					});

					elemObj.find('[data-confirmmodal-but="cancel"]').on('click', function() {
						if (_options.onCancelBut && $.isFunction(_options.onCancelBut)) {
							_options.onCancelBut();
						}
						confirmModalClose();
						$(this).off('click');
					});
				}
				
			},
			hide : function() {
				confirmModalClose();
			}
		};
		
		function confirmModalClose() {
		var elemObj = $('.' + elemClass);
			elemObj.removeClass('open');
			setTimeout(function() {
				elemObj.remove();
				$('body').removeClass(elemClass + 'Open').css({paddingRight:''});
				$('html.' + elemClass + 'Open').off('.' + elemClass + 'Event').removeClass(elemClass + 'Open');
			}, animTime);
		}
		
		function getAnimTime() {
			if (!animTime) {
				animTime = elemObj.css('transitionDuration');
				if (animTime !== undefined) {
					animTime = animTime.replace('s', '') * 1000;
				} else {
					animTime = 0;
				}
			}
		}

		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply( this, arguments );
		}

	};
	
	$('* [data-confirmmodal-bind]').bind('click', function() {
		var elemBind = $(this).attr('data-confirmmodal-bind');
		var params = {};
		if ($(this).attr('data-topoffset') !== undefined) {
			params['topOffset'] = $(this).attr('data-topoffset');
		}
		$(elemBind).confirmModal(params);
	});

  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler();
      }
    }
  };
})(jQuery);
