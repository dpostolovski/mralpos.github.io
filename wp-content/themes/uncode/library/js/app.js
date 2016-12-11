

/* ----------------------------------------------------------
 * Uncode App
 * ---------------------------------------------------------- */

(function($) {
	"use strict";
	var UNCODE = window.UNCODE || {};
	window.UNCODE = UNCODE;

UNCODE.utils = function() {
	$('.btn-tooltip').tooltip();
	$('a').hover(function() {
		$(this).attr('data-title', $(this).attr('title'));
		$(this).removeAttr('title');
	}, function() {
		$(this).attr('title', $(this).attr('data-title'));
	});
	$('.counter').counterUp({
		delay: 10,
		time: 1500
	});
	$('[data-countdown]').each(function() {
		var $this = $(this),
			finalDate = $(this).data('countdown');
		$this.countdown(finalDate, function(event) {
			$this.html(event.strftime('%D <small>days</small> %H <small>hours</small> %M <small>minutes</small> %S <small>seconds</small>'));
		});
	});
	var share_button_top = new Share(".share-button", {
		ui: {
			flyout: "top center",
			button_font: false,
			button_text: '',
			icon_font: false
		},
	});
	$(document).off('click', '.dot-irecommendthis');
	$(document).on('click', '.dot-irecommendthis', function() {
		var link = $(this),
			linkCounter = link.find('span');
		if (link.hasClass('active')) return false;
		var id = $(this).attr('id'),
			suffix = link.find('.dot-irecommendthis-suffix').text();
		$.post(dot_irecommendthis.ajaxurl, {
			action: 'dot-irecommendthis',
			recommend_id: id,
			suffix: suffix
		}, function(data) {
			var counter = $(data).text();
			linkCounter.html(counter);
			link.addClass('active').attr('title', 'You already recommended this');
		});
		return false;
	});
	$('a').on('click', function(e) {
		var hash = (e.currentTarget).hash,
		is_scrolltop = $(e.currentTarget).hasClass('scroll-top') ? true : false,
		anchor = '';
		if (hash != undefined) anchor = hash.replace(/^#/, "");
		if (is_scrolltop || anchor != '') {
			if (is_scrolltop) {
				e.preventDefault();
				var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
				scrollSpeed = Math.abs(bodyTop) / 2;
				if (scrollSpeed < 1000) scrollSpeed = 1000;
				$('html, body').animate({
					scrollTop: 0
				}, scrollSpeed, 'easeInOutCubic', function() {
				});
			} else {
				var scrollSection = $('[data-name=' + anchor + ']');
				$.each($('.menu-container .menu-item > a'), function(index, val) {
					if ($(val).attr('href') == '#' + anchor) $(val).parent().addClass('active');
					else $(val).parent().removeClass('active');
				});
				if (scrollSection.length) {
					e.preventDefault();
					UNCODE.scrolling = true;
					var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
						delta = bodyTop - scrollSection.offset().top,
						scrollSpeed = Math.abs(delta) / 2;
					if (scrollSpeed < 1000) scrollSpeed = 1000;
					$('html, body').animate({
						scrollTop: scrollSection.offset().top
					}, scrollSpeed, 'easeInOutCubic', function() {
						UNCODE.scrolling = false;
					});
				}
			}
		}
	});
	$('.header-scrolldown').on('click', function(event) {
		event.preventDefault();
		var pageHeader = $(event.target).closest('#page-header'),
			pageHeaderTop = pageHeader.offset().top,
			pageHeaderHeight = pageHeader.outerHeight(),
			scrollSpeed = Math.abs(pageHeaderTop + pageHeaderHeight) / 2;
		if (scrollSpeed < 1000) scrollSpeed = 1000;
		$('html, body').animate({
			scrollTop: pageHeaderTop + pageHeaderHeight
		}, scrollSpeed, 'easeInOutCubic');

	});
	// TAB DATA-API
	// ============
	$(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
		e.preventDefault()
		$(this).tab('show');
		setTimeout(function() {
			window.dispatchEvent(UNCODE.boxEvent);
		}, 300);
	});
	// COLLAPSE DATA-API
	// =================
	$(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function(e) {
		var $this = $(this),
			href
		var target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
		var $target = $(target)
		var data = $target.data('bs.collapse')
		var option = data ? 'toggle' : $this.data()
		var parent = $this.attr('data-parent')
		var $parent = parent && $(parent)
		var $title = $(this).parent()
		if ($parent) {
			$parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
			$parent.find('.panel-title').removeClass('active')
			$title[!$target.hasClass('in') ? 'addClass' : 'removeClass']('active')
		}
		$this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
			// }
		$target.collapse(option)
	});
	// FitText
	// =================
	window.uncode_textfill = function(el, loaded) {
		if (el == undefined) el = $('body');
		$.each($('.bigtext', el), function(index, val) {
			$(val).bigtext({
				minfontsize: 24
			});
			if (!$(val).parent().hasClass('blocks-animation') && !$(val).hasClass('animate_when_almost_visible')) $(val).css({
				opacity: 1
			});
		});
	}
	window.uncode_textfill();

	// Colomun hover effect
	// =================
	$(document).on('mouseenter', '.col-link', function(e) {
		var uncol = $(e.target).prev('.uncol'),
		el = uncol.find('.column-background');
		if (el) {
			$('.btn-container .btn', uncol).toggleClass('active');
			var elOverlay = $(el[0]).find('.block-bg-overlay');
			if (elOverlay.length) {
				var getOpacity = $(elOverlay).css('opacity');
				if (getOpacity != 1) {
					getOpacity = Math.round(getOpacity * 100) / 100;
					var newOpacity = getOpacity + .1;
					$(elOverlay).data('data-opacity', getOpacity);
					$(elOverlay).css('opacity', newOpacity);
				}
			}
		}
	}).on('mouseleave', '.col-link', function(e) {
		var uncol = $(e.target).prev('.uncol'),
		el = uncol.find('.column-background');
		$('.btn-container .btn', uncol).toggleClass('active');
		if (el) {
			var elOverlay = $(el[0]).find('.block-bg-overlay');
			if (elOverlay.length) {
				var getOpacity = $(elOverlay).data('data-opacity');
				$(elOverlay).css('opacity', getOpacity);
			}
		}
	});

	// REVSLIDER API
	// ============
	$(window).load(function() {
		$('.rev_slider_wrapper').each(function(){
			var $this = jQuery(this),
   		id_array = $this.attr("id").split("_"),
   		id = id_array[2];
   		if (id != undefined && id != '') {
				$.globalEval('revapi'+id+'.bind("revolution.slide.onloaded",function (e, data) { if (jQuery(e.currentTarget).closest(".header-revslider").length) { var style = jQuery(e.currentTarget).find("li").eq(0).attr("data-skin"), scrolltop = jQuery(document).scrollTop(); if (style != undefined) UNCODE.switchColorsMenu(scrolltop, style);}})');
				$.globalEval('revapi'+id+'.bind("revolution.slide.onchange",function (e,data) { if (jQuery(e.currentTarget).closest(".header-revslider").length) { var style = jQuery(e.currentTarget).find("li").eq(data.slideIndex - 1).attr("data-skin"), scrolltop = jQuery(document).scrollTop(); if (style != undefined) UNCODE.switchColorsMenu(scrolltop, style);}})');
   		}
		});
	});
}

UNCODE.menuSystem = function() {
	function menuMobileButton() {
		var $mobileToggleButton = $('.mobile-menu-button')
		var open = false;
		$mobileToggleButton.on('click', function(event) {
			event.preventDefault();
			if ($(window).width() < 960) {
				if (!open) {
					this.classList.add('close');
					open = true;
				} else {
					this.classList.remove('close');
					open = false;
				}
			}
		});
	};

	function menuMobile() {
		var $mobileToggleButton = $('.mobile-menu-button'),
			$box,
			$el,
			elHeight,
			check,
			animating = false;
		$mobileToggleButton.on('click', function(event) {
			event.preventDefault();
			if ($(window).width() < UNCODE.mediaQuery) {
				$box = $(this).closest('.box-container').find('.main-menu-container'),
					$el = $(this).closest('.box-container').find('.menu-horizontal-inner, .menu-sidebar-inner');
				elHeight = 0;
				$.each($el, function(index, val) {
					elHeight += $(val).outerHeight();
				});
				var open = function() {
					if (!animating) {
						animating = true;
						$box.animate({
							height: elHeight
						}, 400, "easeInOutCirc", function() {
							$box.css('height', 'auto');
						});
					}
				};

				var close = function() {
					$box.animate({
						height: 0
					}, {
						duration: 400,
						easing: "easeInOutCirc",
						complete: function(elements) {
							$(elements).css('height', '');
							animating = false;
						}
					});
				};

				check = ($box.height() == 0) ? open() : close();
			}
		});
	};

	function menuOffCanvas() {
		$('.menu-primary .menu-button-offcanvas').click(function(event) {
			if ($(window).width() > UNCODE.mediaQuery) {
				if ($(event.currentTarget).hasClass('overlay-close')) $(event.currentTarget).removeClass('overlay-close');
				else $(event.currentTarget).addClass('overlay-close');
			}
			$('body').toggleClass('off-opened');
		});
	};
	function menuSmart() {
		if ($('[class*="menu-smart"]').length > 0) {
			$('[class*="menu-smart"]').smartmenus({
				subIndicators: false,
				subIndicatorsPos: 'append',
				subMenusMinWidth: '13em',
				subIndicatorsText: '',
				showTimeout: 50,
				hideTimeout: 50,
				showFunction: function($ul, complete) {
					$ul.fadeIn(0, 'linear', complete);
				},
				hideFunction: function($ul, complete) {
					var fixIE = $('html.ie').length;
					if (fixIE) {
						var $rowParent = $($ul).closest('.main-menu-container');
						$rowParent.height('auto');
					}
					$ul.fadeOut(0, 'linear', complete);
				},
				collapsibleShowFunction: function($ul, complete) {
					$ul.slideDown(400, 'easeInOutCirc', function() {
					});
				},
				collapsibleHideFunction: function($ul, complete) {
					$ul.slideUp(200, 'easeInOutCirc', complete);
				},
				hideOnClick: false
			});
		}
	};
	menuMobileButton();
	menuMobile();
	menuOffCanvas();
	menuSmart();
};

UNCODE.okvideo = function() {
	var BLANK_GIF = "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw%3D%3D";
	$.okvideo = function(options) {
		// if the option var was just a string, turn it into an object
		if (typeof options !== 'object') options = {
			'video': options
		};
		var base = this;
		// kick things off
		base.init = function() {
			base.options = $.extend({}, $.okvideo.options, options);
			// support older versions of okvideo
			if (base.options.video === null) base.options.video = base.options.source;
			base.setOptions();
			var target = base.options.target || $('body');
			var position = target[0] == $('body')[0] ? 'fixed' : 'absolute';
			var zIndex = base.options.controls === 3 ? -999 : "auto";
			if ($('#okplayer-' + base.options.id).length == 0) { //base.options.id = String(Math.round(Math.random() * 100000));
				var mask = '<div id="okplayer-mask-' + base.options.id + '" style="position:' + position + ';left:0;top:0;overflow:hidden;z-index:-998;height:100%;width:100%;"></div>';
				if (OKEvents.utils.isMobile()) {
					target.append('<div id="okplayer-' + base.options.id + '" style="position:' + position + ';left:0;top:0;overflow:hidden;z-index:' + zIndex + ';height:100%;width:100%;"></div>');
				} else {
					if (base.options.controls === 3) {
						target.append(mask)
					}
					if (base.options.adproof === 1) {
						target.append('<div id="okplayer-' + base.options.id + '" style="position:' + position + ';left:-10%;top:-10%;overflow:hidden;z-index:' + zIndex + ';height:120%;width:120%;"></div>');
					} else {
						target.append('<div id="okplayer-' + base.options.id + '" style="position:' + position + ';left:0;top:0;overflow:hidden;z-index:' + zIndex + ';height:100%;width:100%;"></div>');
					}
				}
				$("#okplayer-mask-" + base.options.id).css("background-image", "url(" + BLANK_GIF + ")");
				if (base.options.playlist.list === null) {
					if (base.options.video.provider === 'youtube') {
						base.loadYouTubeAPI();
					} else if (base.options.video.provider === 'vimeo') {
						base.options.volume /= 100;
						base.loadVimeoAPI();
					}
				} else {
					base.loadYouTubeAPI();
				}
			}
		};
		// clean the options
		base.setOptions = function() {
			// exchange 'true' for '1' and 'false' for 3
			for (var key in this.options) {
				if (this.options[key] === true) this.options[key] = 1;
				if (this.options[key] === false) this.options[key] = 3;
			}
			if (base.options.playlist.list === null) {
				base.options.video = base.determineProvider();
			}
			// pass options to the window
			$(window).data('okoptions-' + base.options.id, base.options);
		};
		// insert js into the head and exectue a callback function
		base.insertJS = function(src, callback){
      var tag = document.createElement('script');
      if (callback){
        if (tag.readyState){  //IE
          tag.onreadystatechange = function(){
            if (tag.readyState === "loaded" ||
                tag.readyState === "complete"){
              tag.onreadystatechange = null;
              callback();
            }
          };
        } else {
          tag.onload = function() {
            callback();
          };
        }
      }
      tag.src = src;
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    };
		// load the youtube api
		base.loadYouTubeAPI = function(callback) {
			base.insertJS('https://www.youtube.com/player_api');
		};
		base.loadYouTubePlaylist = function() {
			player.loadPlaylist(base.options.playlist.list, base.options.playlist.index, base.options.playlist.startSeconds, base.options.playlist.suggestedQuality);
		};
		// load the vimeo api by replacing the div with an iframe and loading js
		base.loadVimeoAPI = function() {
			var source = '//player.vimeo.com/video/' + base.options.video.id + '?api=1&title=0&byline=0&portrait=0&playbar=0&loop=' + base.options.loop + '&autoplay=' + (base.options.autoplay === 1 ? 1 : 0) + '&player_id=okplayer-' + base.options.id,
			jIframe = $('<iframe data-src="'+source+'" frameborder="0" id="okplayer-' + base.options.id +'" style="visibility: hidden;" class="vimeo-background" />');
			$(window).data('okoptions-' + base.options.id).jobject = jIframe;
			$('#okplayer-' + base.options.id).replaceWith(jIframe[0]);
			base.insertJS('//origin-assets.vimeo.com/js/froogaloop2.min.js', function() {
				vimeoPlayerReady(base.options.id);
			});
		};
		// is it from youtube or vimeo?
		base.determineProvider = function() {
			var a = document.createElement('a');
			a.href = base.options.video;
			if (/youtube.com/.test(base.options.video) || /youtu.be/.test(base.options.video)) {
				var videoid = a.href.split('/')[3].toString();
				var query = videoid.substring(videoid.indexOf('?') + 1);
				if (query != '') {
					var vars = query.split('&');
					for (var i = 0; i < vars.length; i++) {
						var pair = vars[i].split('=');
						if (pair[0] == 'v') {
							videoid = pair[1];
						}
					}
				}
				return {
					"provider": "youtube",
					"id": videoid
				};
			} else if (/vimeo.com/.test(base.options.video)) {
				return {
					"provider": "vimeo",
					"id": (a.href.split('/')[3].toString()).split('#')[0],
				};
			} else if (/[-A-Za-z0-9_]+/.test(base.options.video)) {
				var id = new String(base.options.video.match(/[-A-Za-z0-9_]+/));
				if (id.length == 11) {
					return {
						"provider": "youtube",
						"id": id.toString()
					};
				} else {
					for (var i = 0; i < base.options.video.length; i++) {
						if (typeof parseInt(base.options.video[i]) !== "number") {
							throw 'not vimeo but thought it was for a sec';
						}
					}
					return {
						"provider": "vimeo",
						"id": base.options.video
					};
				}
			} else {
				throw "OKVideo: Invalid video source";
			}
		};
		base.init();
	};
	$.okvideo.options = {
		id: null,
		source: null, // Deprecate dis l8r
		video: null,
		playlist: { // eat ur heart out @brokyo
			list: null,
			index: 0,
			startSeconds: 0,
			suggestedQuality: "default" // options: small, medium, large, hd720, hd1080, highres, default
		},
		disableKeyControl: 1,
		captions: 0,
		loop: 1,
		hd: 1,
		volume: 0,
		adproof: false,
		unstarted: null,
		onFinished: null,
		onReady: null,
		onPlay: null,
		onPause: null,
		buffering: null,
		controls: false,
		autoplay: true,
		annotations: true,
		cued: null
	};
	$.fn.okvideo = function(options) {
		options.target = this;
		return this.each(function() {
			(new $.okvideo(options));
		});
	};

	$(".no-touch .uncode-video-container.video").each(function(index, el) {
		var $this = $(this),
			url = $this.attr('data-video'),
			id = $this.attr('data-id'),
			cloned = $this.closest('.owl-item');
		if (!cloned.hasClass('cloned') || cloned.length == 0) {
			$this.okvideo({
				id: id,
				source: url.split('#')[0],
				time: ((url).indexOf("#") > -1) ? (url).substring((url).indexOf('#') + 1) : null,
				autoplay: 1,
				controls: 0,
				volume: 0,
				adproof: 0,
				caller: $this,
				hd: 1,
				onReady: function(player) {
					var getPlayer = player.f || player,
					getContainer = $(getPlayer).closest('.background-element');
					if (getContainer.length) {
						UNCODE.initVideoComponent(getContainer[0], '.uncode-video-container.video');
					}
				}
			});
		}
	});
	$(".no-touch .background-video-shortcode").each(function(index, el) {
		var video_id = $(this).attr('id');
		new MediaElement(video_id, {
			startVolume: 0,
			loop: true,
			success: function(mediaElement, domObject) {
				domObject.volume = 0;
				$(mediaElement).data('started', false);
				mediaElement.addEventListener('timeupdate', function(e) {
					if (!$(e.target).data('started')) {
						$(mediaElement).data('started', true);
						$(mediaElement).closest('.uncode-video-container').css('opacity', '1');
					}
				});
				mediaElement.play();
			},
			// fires when a problem is detected
			error: function() {}
		});
	});
};

UNCODE.disableHoverScroll = function() {

    if (!UNCODE.isMobile) {
        var body = document.body,
        timer;

        window.addEventListener('scroll', function() {
            clearTimeout(timer);
            if (body.classList)  {
                if (!body.classList.contains('disable-hover')) {
                    body.classList.add('disable-hover')
                }

                timer = setTimeout(function() {
                    body.classList.remove('disable-hover')
                }, 300);
            }
        }, false);
    }
};


UNCODE.isotopeLayout = function() {
	if ($('.isotope-layout').length > 0) {
		var isotopeContainersArray = [],
			typeGridArray = [],
			layoutGridArray = [],
			screenLgArray = [],
			screenMdArray = [],
			screenSmArray = [],
			transitionDuration = [],
			$filterItems = [],
			$filters = $('.isotope-filters'),
			$itemSelector = '.tmb',
			$items,
			itemMargin,
			correctionFactor = 0,
			firstLoad = true,
			isOriginLeft = $('body').hasClass('rtl') ? false : true;
		$('[class*="isotope-container"]').each(function() {
			var isoData = $(this).data(),
			$data_lg,
			$data_md,
			$data_sm;
			if (isoData.lg !== undefined) $data_lg = $(this).attr('data-lg');
			else $data_lg = '1000';
			if (isoData.md !== undefined) $data_md = $(this).attr('data-md');
			else $data_md = '600';
			if (isoData.sm !== undefined) $data_sm = $(this).attr('data-sm');
			else $data_sm = '480';
			screenLgArray.push($data_lg);
			screenMdArray.push($data_md);
			screenSmArray.push($data_sm);
			transitionDuration.push($('.t-inside.animate_when_almost_visible', this).length > 0 ? 0 : '0.5s');
			if (isoData.type == 'metro') typeGridArray.push(true);
			else typeGridArray.push(false);
			if (isoData.layout !== undefined) layoutGridArray.push(isoData.layout);
			else layoutGridArray.push('masonry');
			isotopeContainersArray.push($(this));
		});
		var colWidth = function(index) {
				$(isotopeContainersArray[index]).width('');
				var isPx = $(isotopeContainersArray[index]).parent().hasClass('px-gutter'),
					widthAvailable = $(isotopeContainersArray[index]).width(),
					columnNum = 12,
					columnWidth = 0;

				if (isPx) {
					columnWidth = Math.ceil(widthAvailable / columnNum);
					$(isotopeContainersArray[index]).width(columnNum * Math.ceil(columnWidth));
				} else {
					columnWidth = ($('html.firefox').length) ? Math.floor(widthAvailable / columnNum) : widthAvailable / columnNum;
				}
				$items = $(isotopeContainersArray[index]).find('.tmb:not(.tmb-carousel)');
				itemMargin = parseInt($(isotopeContainersArray[index]).find('.t-inside').css("margin-top"));
				for (var i = 0, len = $items.length; i < len; i++) {
					var $item = $($items[i]),
						multiplier_w = $item.attr('class').match(/tmb-iso-w(\d{0,2})/),
						multiplier_h = $item.attr('class').match(/tmb-iso-h(\d{0,2})/);
					if (widthAvailable >= screenMdArray[index] && widthAvailable < screenLgArray[index]) {
						if (multiplier_w[1] !== undefined) {
							switch (parseInt(multiplier_w[1])) {
								case (5):
								case (4):
								case (3):
									if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 6;
									break;
								case (2):
								case (1):
									if (typeGridArray[index]) multiplier_h[1] = (3 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 3;
									break;
								default:
									if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 12;
									break;
							}
						}
					} else if (widthAvailable >= screenSmArray[index] && widthAvailable < screenMdArray[index]) {
						if (multiplier_w[1] !== undefined) {
							switch (parseInt(multiplier_w[1])) {
								case (5):
								case (4):
								case (3):
								case (2):
								case (1):
									if (typeGridArray[index]) multiplier_h[1] = (6 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 6;
									break;
								default:
									if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
									multiplier_w[1] = 12;
									break;
							}
						}
					} else if (widthAvailable < screenSmArray[index]) {
						if (multiplier_w[1] !== undefined) {
							//if (typeGridArray[index]) multiplier_h[1] = (12 * multiplier_h[1]) / multiplier_w[1];
							multiplier_w[1] = 12;
							if (typeGridArray[index]) multiplier_h[1] = 12;
						}
					}
					var width = multiplier_w ? (columnWidth * multiplier_w[1]) : columnWidth,
						height = multiplier_h ? Math['ceil']((2 * Math.ceil(columnWidth / 2)) * multiplier_h[1]) - itemMargin : columnWidth;

					if (width >= widthAvailable) {
						$item.css({
							width: widthAvailable
						});
						if (typeGridArray[index]) {
							$item.children().add($item.find('.backimg')).css({
								height: height
							});
						}
					} else {
						$item.css({
							width: width
						});
						if (typeGridArray[index]) {
							$item.children().add($item.find('.backimg')).css({
								height: height
							});
						}
					}
				}
				return columnWidth;
			},
			init_isotope = function() {
				for (var i = 0, len = isotopeContainersArray.length; i < len; i++) {
					var isotopeSystem = $(isotopeContainersArray[i]).closest($('.isotope-system')),
						isotopeId = isotopeSystem.attr('id'),
						$layoutMode = layoutGridArray[i];
					$(isotopeContainersArray[i]).isotope({
						//resizable: true,
						itemSelector: $itemSelector,
						layoutMode: $layoutMode,
						transitionDuration: transitionDuration[i],
						masonry: {
							columnWidth: colWidth(i)
						},
						vertical: {
							horizontalAlignment: 0.5,
						},
						sortBy: 'original-order',
						isOriginLeft: isOriginLeft
					}).on('layoutComplete', onLayout($(isotopeContainersArray[i]), 0));
					if ($(isotopeContainersArray[i]).hasClass('isotope-infinite')) {
						$(isotopeContainersArray[i]).infinitescroll({
								navSelector: '#' + isotopeId + ' .loadmore-button', // selector for the pagination container
								nextSelector: '#' + isotopeId + ' .loadmore-button a', // selector for the NEXT link (to page 2)
								itemSelector: '#' + isotopeId + ' .isotope-layout .tmb, #' + isotopeId + ' .isotope-filters li', // selector for all items you'll retrieve
								animate: false,
								behavior: 'local',
								debug: false,
								loading: {
									selector: '#' + isotopeId + '.isotope-system .isotope-footer-inner',
									speed: 0,
									finished: undefined,
									msg: $('#' + isotopeId + ' .loadmore-button'),
								},
								errorCallback: function() {
									var isotope_system = $(this).closest('.isotope-system');
									$('.loading-button', isotope_system).hide();
									$('.loadmore-button', isotope_system).attr('style', 'display:none !important');
								}
							},
							// append the new items to isotope on the infinitescroll callback function.
							function(newElements) {
								var $isotope = $(this),
									isotopeId = $isotope.closest('.isotope-system').attr('id'),
									filters = new Array(),
									$loading_button = $isotope.closest('.isotope-system').find('.loading-button'),
									$infinite_button = $isotope.closest('.isotope-system').find('.loadmore-button'),
									delay = 300;
								$('a', $infinite_button).html($('a', $infinite_button).data('label'));
								$infinite_button.show();
								$loading_button.hide();
								$('> li', $isotope).remove();
								$.each($(newElements), function(index, val) {
									if ($(val).is("li")) {
										filters.push($(val)[0]);
									}
								});
								newElements = newElements.filter(function(x) {
									return filters.indexOf(x) < 0
								});
								$.each($(filters), function(index, val) {
									if ($('#' + isotopeId + ' a[data-filter="' + $('a', val).attr('data-filter') + '"]').length == 0) $('#' + isotopeId + ' .isotope-filters ul').append($(val));
								});
								$isotope.isotope('reloadItems', onLayout($isotope, newElements.length));
							});
						if ($(isotopeContainersArray[i]).hasClass('isotope-infinite-button')) {
							var $infinite_isotope = $(isotopeContainersArray[i]),
								$infinite_button = $infinite_isotope.closest('.isotope-system').find('.loadmore-button a');
							$infinite_isotope.infinitescroll('pause');
							$infinite_button.on('click', function(event) {
								event.preventDefault();
								var $infinite_system = $(event.target).closest('.isotope-system'),
								$infinite_isotope = $infinite_system.find('.isotope-container'),
								isotopeId = $infinite_system.attr('id');
								$(event.currentTarget).html('Loading…');
								$infinite_isotope.infinitescroll('resume');
								$infinite_isotope.infinitescroll('retrieve');
								$infinite_isotope.infinitescroll('pause');
							});
						}
					}
				}
			},
			onLayout = function(isotopeObj, startIndex) {
				isotopeObj.css('opacity', 1);
				isotopeObj.closest('.isotope-system').find('.isotope-footer').css('opacity', 1);
				setTimeout(function() {
					window.dispatchEvent(UNCODE.boxEvent);
					$(isotopeObj).find('audio,video').each(function() {
						$(this).mediaelementplayer();
					});
					if ($(isotopeObj).find('.nested-carousel').length) {
						UNCODE.carousel($(isotopeObj).find('.nested-carousel'));
						setTimeout(function() {
							boxAnimation($('.tmb', isotopeObj), startIndex, true, isotopeObj);
						}, 200);
					} else {
						boxAnimation($('.tmb', isotopeObj), startIndex, true, isotopeObj);
					}
				}, 100);
			},
			boxAnimation = function(items, startIndex, sequential, container) {
				var $allItems = items.length - startIndex,
					showed = 0,
					index = 0;
				if (container.closest('.owl-item').length == 1) return false;
				$.each(items, function(index, val) {
					var elInner = $('> .t-inside', val);
					if (val[0]) val = val[0];
					if (elInner.hasClass('animate_when_almost_visible') && !elInner.hasClass('force-anim') && !UNCODE.isMobile) {
						new Waypoint({
							element: val,
							handler: function() {
								var element = $('> .t-inside', this.element),
									parent = $(this.element),
									currentIndex = parent.index();
								var delay = (!sequential) ? index : ((startIndex !== 0) ? currentIndex - $allItems : currentIndex),
									delayAttr = parseInt(element.attr('data-delay'));
								if (isNaN(delayAttr)) delayAttr = 100;
								delay -= showed;
								var objTimeout = setTimeout(function() {
									element.removeClass('zoom-reverse').addClass('start_animation');
									showed = parent.index();
								}, delay * delayAttr)
								parent.data('objTimeout', objTimeout);
								this.destroy();
							},
							offset: '100%'
						})
					} else {
						if (elInner.hasClass('force-anim')) {
							elInner.addClass('start_animation');
						} else {
							elInner.css('opacity', 1);
						}
					}
					index++;
				});
			};
		if ($('.isotope-pagination').length > 0) {
			var filterHeight = ($filters != undefined) ? $filters.outerHeight(true) - $('a', $filters).first().height() : 0;
			$('.isotope-system').on('click', '.pagination a', function(evt) {
				evt.preventDefault();
				var container = $(this).closest('.isotope-system');
				$('html, body').animate({
					scrollTop: container.offset().top - filterHeight
				}, 1000, 'easeInOutQuad');
				loadIsotope($(this));
				evt.preventDefault();
			});
		}
		$filters.on('click', 'a', function(evt) {
			var $filter = $(this),
				filterContainer = $filter.closest('.isotope-filters'),
				filterValue = $filter.attr('data-filter'),
				container = $filter.closest('.isotope-system').find($('.isotope-layout')),
				transitionDuration = container.data().isotope.options.transitionDuration,
				delay = 300,
				filterItems = [];
			if (!$filter.hasClass('active')) {
				/** Scroll top with filtering */
				if (filterContainer.hasClass('filter-scroll')) {
					$('html, body').animate({
						scrollTop: container.closest('.uncol').offset().top - (!filterContainer.hasClass('with-bg') ? filterContainer.outerHeight(true) - $filter.height() : 0)
					}, 1000, 'easeInOutQuad');
				}
				if (filterValue !== undefined) {
					$.each($('> .tmb > .t-inside', container), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse').removeClass('start_animation')
							clearTimeout(objTimeout);
						}
						if (transitionDuration == 0) {
							if ($(val).hasClass('animate_when_almost_visible')) {
								$(val).addClass('zoom-reverse').removeClass('start_animation');
							} else {
								$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
							}
						}
					});
					setTimeout(function() {
						container.isotope({
							filter: function() {
								var block = $(this),
								filterable = (filterValue == '*') || block.hasClass(filterValue);
								if (filterable) {
									filterItems.push(block);
								}
								return filterable;
							}
						});
						$('.t-inside.zoom-reverse', container).removeClass('zoom-reverse');
					}, delay);
					/** once filtered - start **/
					if (transitionDuration == 0) {
						container.isotope('once', 'arrangeComplete', function() {
							setTimeout(function() {
								boxAnimation(filterItems, 0, false, container);
							}, 100);
						});
					}
					/** once filtered - end **/
				} else {
					$.each($('> .tmb > .t-inside', container), function(index, val) {
						var parent = $(val).parent(),
							objTimeout = parent.data('objTimeout');
						if (objTimeout) {
							$(val).removeClass('zoom-reverse').removeClass('start_animation')
							clearTimeout(objTimeout);
						}
						if (transitionDuration == 0) {
							if ($(val).hasClass('animate_when_almost_visible')) {
								$(val).addClass('zoom-reverse').removeClass('start_animation');
							} else {
								$(val).addClass('animate_when_almost_visible zoom-reverse zoom-anim force-anim');
							}
						}
					});
					container.parent().addClass('isotope-loading');
					loadIsotope($filter);
				}
			}
			evt.preventDefault();
		});
		$(window).on("popstate", function(e) {
			if (e.originalEvent.state === null) return;
			var params = {};
			if (location.search) {
				var parts = location.search.substring(1).split('&');
				for (var i = 0; i < parts.length; i++) {
					var nv = parts[i].split('=');
					if (!nv[0]) continue;
					params[nv[0]] = nv[1] || true;
				}
			}
			if (params.id === undefined) {
				$.each($('.isotope-system'), function(index, val) {
					loadIsotope($(val));
				});
			} else loadIsotope($('#' + params.id));
		});

		var loadIsotope = function($href) {
			var href = ($href.is("a") ? $href.attr('href') : location),
				isotopeSystem = ($href.is("a") ? $href.closest($('.isotope-system')) : $href),
				isotopeWrapper = isotopeSystem.find($('.isotope-wrapper')),
				isotopeFooter = isotopeSystem.find($('.isotope-footer-inner')),
				isotopeContainer = isotopeSystem.find($('.isotope-layout')),
				isotopeId = isotopeSystem.attr('id');
			if ($href.is("a")) history.pushState({
				myIsotope: true
			}, document.title, href);
			$.ajax({
				url: href
			}).done(function(data) {
				var $resultItems = $(data).find('#' + isotopeId + ' .isotope-layout').html(),
					$resultPagination = $(data).find('#' + isotopeId + ' .pagination');
				isotopeWrapper.addClass('isotope-reloaded');
				setTimeout(function() {
					isotopeWrapper.removeClass('isotope-loading');
					isotopeWrapper.removeClass('isotope-reloaded');
				}, 500);
				$.each($('> .tmb > .t-inside', isotopeContainer), function(index, val) {
					var parent = $(val).parent(),
						objTimeout = parent.data('objTimeout');
					if (objTimeout) {
						$(val).removeClass('zoom-reverse').removeClass('start_animation')
						clearTimeout(objTimeout);
					}
					if ($(val).hasClass('animate_when_almost_visible')) {
						$(val).addClass('zoom-reverse').removeClass('start_animation');
					} else {
						$(val).addClass('animate_when_almost_visible zoom-reverse zoom-in force-anim');
					}
				});
				setTimeout(function() {
					if (isotopeContainer.data('isotope')) {
						isotopeContainer.html($resultItems).isotope('reloadItems', onLayout(isotopeContainer, 0));
					}
				}, 300);
				$('.pagination', isotopeFooter).remove();
				isotopeFooter.append($resultPagination);
			});
		};
		$filters.each(function(i, buttonGroup) {
			var $buttonGroup = $(buttonGroup);
			$buttonGroup.on('click', 'a', function() {
				$buttonGroup.find('.active').removeClass('active');
				$(this).addClass('active');
			});
		});
		window.addEventListener('boxResized', function(e) {
			$.each($('.isotope-layout'), function(index, val) {
				var $layoutMode = ($(this).data('layout'));
				if ($layoutMode === undefined) $layoutMode = 'masonry';
				if ($(this).data('isotope')) {
					$(this).isotope({
						itemSelector: $itemSelector,
						layoutMode: $layoutMode,
						transitionDuration: transitionDuration[index],
						masonry: {
							columnWidth: colWidth(index)
						},
						vertical: {
							horizontalAlignment: 0.5,
						},
						sortBy: 'original-order',
						isOriginLeft: isOriginLeft
					});
					$(this).isotope('unbindResize');
				}
				$(this).find('.mejs-video,.mejs-audio').each(function() {
					$(this).trigger('resize');
				});
			});
		}, false);
		init_isotope();
	};
}

UNCODE.lightbox = function() {
	setTimeout(function() {
		var groupsArr = {};
		$('[data-lbox^=ilightbox]').each(function() {
			var group = this.getAttribute("data-lbox"),
				values = $(this).data();
			groupsArr[group] = values;
		});
		for (var i in groupsArr) {
			var skin = groupsArr[i].skin || 'black',
				path = groupsArr[i].dir || 'horizontal',
				thumbs = !groupsArr[i].notmb || false,
				arrows = !groupsArr[i].noarr || false,
				social = groupsArr[i].social || false,
				deeplink = groupsArr[i].deep || false,
				counter = $('[data-lbox="' + i + '"]').length;
			if (social) social = {
				facebook: true,
				twitter: true,
				googleplus: true,
				reddit: true,
				digg: true,
				delicious: true
			};
			$('[data-lbox="' + i + '"]').iLightBox({
				skin: skin,
				path: path,
				linkId: deeplink,
				infinite: false,
				//fullViewPort: 'fit',
				smartRecognition: false,
				fullAlone: false,
				//fullStretchTypes: 'flash, video',
				overlay: {
					opacity: .94
				},
				controls: {
					arrows: (counter > 1 ? arrows : false),
					fullscreen: true,
					thumbnail: thumbs,
					slideshow: (counter > 1 ? true : false)
				},
				show: {
					speed: 200
				},
				hide: {
					speed: 200
				},
				social: {
					start: false,
					buttons: social
				},
				caption: {
					start: false
				},
				styles: {
					nextOpacity: 1,
					nextScale: 1,
					prevOpacity: 1,
					prevScale: 1
				},
				effects: {
					switchSpeed: 400
				},
				slideshow: {
					pauseTime: 5000
				},
				thumbnails: {
					maxWidth: 60,
					maxHeight: 60,
					activeOpacity: .2
				},
				html5video: {
					preload: true
				}
			});
		};
	}, 100);
};

UNCODE.backVideo = function() {
	$(function() {
		$.each($('.background-video-shortcode'), function() {
			var video_id = $(this).attr('id');
			new MediaElement(video_id, {
				startVolume: 0,
				loop: true,
				success: function(mediaElement, domObject) {
					mediaElement.play();
					$(mediaElement).closest('.uncode-video-container').css('opacity','1');
					domObject.volume = 0;
				},
				// fires when a problem is detected
				error: function() {}
			});
		});
	});
};

UNCODE.carousel = function(container) {
	var $owlSelector = $('.owl-carousel-container > [class*="owl-carousel"]', container),
		values = {},
		tempTimeStamp,
		currentIndex,
		$owlInsideEqual = [];
	$owlSelector.each(function() {
		var itemID = $(this).attr('id'),
			$elSelector = $(('#' + itemID).toString());
		values['id'] = itemID;
		values['items'] = 1;
		values['columns'] = 3;
		values['fade'] = false;
		values['nav'] = false;
		values['navmobile'] = false;
		values['navskin'] = 'light';
		values['navspeed'] = 400;
		values['dots'] = false;
		values['dotsmobile'] = false;
		values['loop'] = false;
		values['autoplay'] = false;
		values['timeout'] = 3000;
		values['autoheight'] = false;
		values['margin'] = 0;
		values['lg'] = 1;
		values['md'] = 1;
		values['sm'] = 1;
		$.each($(this).data(), function(i, v) {
			values[i] = v;
		});

		if ($(this).closest('.uncode-slider').length) {
			values['navskin'] = '';
			values['navmobile'] = false;
			values['dotsmobile'] = true;
		} else {
			values['navskin'] = ' style-'+values['navskin']+' style-override';
		}

		/** Initialized */
		$elSelector.on('initialized.owl.carousel', function(event) {

			var thiis = $(event.currentTarget),
				// get the time from the data method
				time = thiis.data("timer-id");
			if (time) {
				clearTimeout(time);
			}
			thiis.addClass('showControls');
			var new_time = setTimeout(function() {
				thiis.closest('.owl-carousel-container').removeClass('owl-carousel-loading');
				if (thiis.hasClass('owl-height-equal')) setItemsHeight(event.currentTarget);
				if (!UNCODE.isMobile && !$elSelector.closest('.header-wrapper').length) navHover($elSelector.parent());
			}, 350);
			// save the new time
			thiis.data("timer-id", new_time);

			var scrolltop = $(document).scrollTop();
			//navAdjust(event);
			$(event.currentTarget).closest('.uncode-slider').find('video').removeAttr('poster');

			if (!UNCODE.isMobile) {
				/** fix autoplay when visible **/
				if ($(event.currentTarget).data('autoplay')) {
					$(event.currentTarget).trigger('stop.autoplay.owl');
				}
				var carouselInView = new Waypoint.Inview({
				  element: $(event.currentTarget)[0],
				  enter: function(direction) {
				    var el = $(this.element);
						if (el.data('autoplay')) {
							setTimeout(function() {
								el.trigger('play.owl.autoplay');
							}, values['timeout']);
						}
				  },
				  exited: function() {
				    if ($(this.element).data('autoplay')) {
							$(this.element).trigger('stop.owl.autoplay');
						}
				  }
				});
			}

			if (!UNCODE.isMobile && !$(event.currentTarget).closest('.isotope-system').length) {
				setTimeout(function() {
					animate_thumb($('.t-inside', el));
				}, 400);
			}

			var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[event.item.index],
			currentIndex = $(currentItem).attr('data-index');
			$.each($('.owl-item:not(.active)', event.currentTarget), function(index, val) {
				if ($(val).attr('data-index') != currentIndex) {
					$('.start_animation:not(.t-inside)', val).removeClass('start_animation');
				}
				if ($(val).attr('data-index') == currentIndex) {
					$('.animate_when_almost_visible:not(.t-inside)', val).addClass('start_animation');
				}
			});
			$.each($('.owl-item:not(.active) .start_animation', $(event.target)), function(index, val) {
				if ($(val).closest('.uncode-slider').length) {
					$(val).removeClass('start_animation');
				}
			});

			if ($(event.currentTarget).closest('.uncode-slider').length) {
				var el = $(event.currentTarget).closest('.row-parent')[0];
				if ($(el).data('imgready')) {
					firstLoaded(el);
				} else {
					el.addEventListener("imgLoaded", function(el) {
						firstLoaded(el.target);
					}, false);
				}
				var transHeight = $('.hmenu .menu-transparent.menu-primary .menu-container').height();
				if (transHeight != null) {
					setTimeout(function() {
						$(event.currentTarget).closest('.uncode-slider').find('.owl-prev, .owl-next').css('paddingTop', transHeight / 2 + 'px');
					}, 100);
				}
			} else {
				var el = $(event.currentTarget);
				el.closest('.uncode-slider').addClass('slider-loaded');
			}

			setTimeout(function() {
				window.uncode_textfill(thiis);
				if ($(event.currentTarget).closest('.uncode-slider').length) {
					if ($(event.currentTarget).data('autoplay') == true) pauseOnHover(event.currentTarget);
				}
			}, 500);

			if ($(event.currentTarget).closest('.unequal').length) {
				$owlInsideEqual.push($(event.currentTarget).closest('.row-parent'));
			}

		});

		/** Resizing */
		$elSelector.on('resized.owl.carousel', function(event) {
			if ($(this).closest('.nested-carousel').length) {
				setTimeout(function() {
					window.dispatchEvent(UNCODE.boxEvent);
				}, 200);
			}
			if ($(event.currentTarget).hasClass('owl-height-equal')) setItemsHeight(event.currentTarget);
		});

		/** Change */
		$elSelector.on('change.owl.carousel', function(event) {
			if (!UNCODE.isMobile) UNCODE.owlStopVideo(event.currentTarget);
		});

		/** Changed */
		$elSelector.on('changed.owl.carousel', function(event) {
			if (tempTimeStamp != event.timeStamp) {
				var scrolltop = $(document).scrollTop();
				var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[(event.item.index != null) ? event.item.index : 0];
				if ($(event.currentTarget).closest('.row-slider').length) {
					if (currentItem == undefined) {
						currentItem = $(event.currentTarget).children()[0];
					}
					if ($('.row-container > .row > .row-inner > div > .style-dark', currentItem).closest('.uncode-slider').length) {
						UNCODE.switchColorsMenu(scrolltop, 'dark');
					} else if ($('.row-container > .row > .row-inner > div > .style-light', currentItem).closest('.uncode-slider').length) {
						UNCODE.switchColorsMenu(scrolltop, 'light');
					}
				}
			}
			tempTimeStamp = event.timeStamp;
		});

		$elSelector.on('translate.owl.carousel', function(event) {
			if (UNCODE.isMobile) {
				$(event.currentTarget).addClass('owl-translating');
			}
		});

		/** Translated */
		$elSelector.on('translated.owl.carousel', function(event) {

			var currentItem = $(event.currentTarget).find("> .owl-stage-outer > .owl-stage > .owl-item")[event.item.index],
				currentIndex = $(currentItem).attr('data-index');

			if (!UNCODE.isMobile) {
				UNCODE.owlPlayVideo(event.currentTarget);

				setTimeout(function() {
					var lastDelayElems = animate_elems($('.owl-item.active', event.currentTarget));
					var lastDelayThumb = animate_thumb($('.owl-item.active .t-inside', event.currentTarget));
					if ($(event.currentTarget).closest('.uncode-slider').length) {
						if (lastDelayElems == undefined) lastDelayElems = 0;
						if (lastDelayThumb == undefined) lastDelayThumb = 0;
						var maxDelay = Math.max(lastDelayElems, lastDelayThumb);
						if (maxDelay > 0) {
							$(event.currentTarget).trigger('stop.owl.autoplay');
							setTimeout(function() {
								if (!$(event.currentTarget).hasClass('owl-mouseenter')) $(event.currentTarget).trigger('play.owl.autoplay');
							}, maxDelay);
						}
					}
				}, 200);

				$.each($('.owl-item:not(.active)', event.currentTarget), function(index, val) {
					if ($(val).attr('data-index') != currentIndex) {
						$('.start_animation:not(.t-inside)', val).removeClass('start_animation');
					}
					if ($(val).attr('data-index') == currentIndex) {
						$('.animate_when_almost_visible:not(.t-inside)', val).addClass('start_animation');
					}
				});
				$.each($('.owl-item:not(.active) .start_animation', $(event.target)), function(index, val) {
					if ($(val).closest('.uncode-slider').length) {
						$(val).removeClass('start_animation');
					}
				});
			} else {
				$(event.currentTarget).removeClass('owl-translating');
			}
		});

		/** Init carousel */
		$elSelector.owlCarousel({
			items: values['items'],
			animateOut: (values['fade'] == true) ? 'fadeOut' : null,
			nav: values['nav'],
			dots: values['dots'],
			loop: values['loop'],
			margin: 0,
			video: true,
			autoWidth: false,
			autoplay: false,
			autoplayTimeout: values['timeout'],
			autoplaySpeed: values['navspeed'],
			autoplayHoverPause: $(this).closest('.uncode-slider') ? false : true,
			autoHeight: $(this).hasClass('owl-height-equal') ? true : values['autoheight'],
			rtl: $('body').hasClass('rtl') ? true : false,
			fluidSpeed: true,
			navSpeed: values['navspeed'],
			navClass: [ 'owl-prev'+values['navskin'], 'owl-next'+values['navskin'] ],
			navText: ['<div class="owl-nav-container btn-default btn-hover-nobg"><i class="fa fa-fw fa-angle-left"></i></div>', '<div class="owl-nav-container btn-default btn-hover-nobg"><i class="fa fa-fw fa-angle-right"></i></div>'],
			navContainer: values['nav'] ? $elSelector : false,
			responsiveClass: true,
			responsiveBaseElement: '.box-container',
			responsive: {
				0: {
					items: values['sm'],
					nav: values['navmobile'],
					dots: values['dotsmobile']
				},
				480: {
					items: values['sm'],
					nav: values['navmobile'],
					dots: values['dotsmobile']
				},
				570: {
					items: values['md'],
					nav: values['navmobile'],
					dots: values['dotsmobile']
				},
				960: {
					items: values['lg']
				}
			},
		});

		setTimeout(function() {
			for (var i = $owlInsideEqual.length - 1; i >= 0; i--) {
				UNCODE.setRowHeight($owlInsideEqual[i]);
			};
		}, 300);
	});

	function firstLoaded(el) {
		var el = $(el);
		el.find('.owl-carousel').css('opacity', 1);
		el.find('.uncode-slider').addClass('slider-loaded');
		window.uncode_textfill(el.find('.owl-item.active'));

		if (!UNCODE.isMobile) {
			setTimeout(function() {
				var lastDelayElems = animate_elems(el.find('.owl-item.active'));
				var lastDelayThumb = animate_thumb(el.find('.owl-item.active .t-inside'));
				if (el.closest('.uncode-slider').length) {
					if (lastDelayElems == undefined) lastDelayElems = 0;
					if (lastDelayThumb == undefined) lastDelayThumb = 0;
					var maxDelay = Math.max(lastDelayElems, lastDelayThumb);
					if (maxDelay > 0) {
						el.trigger('stop.owl.autoplay');
						setTimeout(function() {
							if (!el.hasClass('owl-mouseenter')) el.trigger('play.owl.autoplay');
						}, maxDelay);
					}
				}
			}, 400);
		}
	}

	function navHover(el) {
		var $owlCont = el,
			$owlPrev = $owlCont.find('.owl-prev'),
			$owlNext = $owlCont.find('.owl-next'),
			$owlDots = $owlCont.find('.owl-dots-inside .owl-dots'),
			$owlPagination = $owlCont.next(),
			owlPrevW = $owlPrev.outerWidth(),
			owlNextW = $owlNext.outerWidth(),
			owlDotsH = $owlDots.innerHeight(),
			owlTime = 400,
			owlNested = $owlCont.parent().parent().hasClass('nested-carousel');
		$owlPrev.css("margin-left", -owlPrevW);
		$owlNext.css("margin-right", -owlNextW);
		if (!owlNested) $owlDots.css("bottom", -owlDotsH);
		$owlCont.mouseenter(function() {
			owlNested = $owlCont.parent().parent().hasClass('nested-carousel');
			$owlPrev.css({
				marginLeft: 0
			});
			$owlNext.css({
				marginRight: 0
			});
			if (!owlNested) {
				$owlDots.css({
					opacity: 1,
					bottom: 0
				});
			}
		}).mouseleave(function() {
			owlNested = $owlCont.parent().parent().hasClass('nested-carousel');
			$owlPrev.css({
				marginLeft: -owlPrevW
			});
			$owlNext.css({
				marginRight: -owlNextW
			});
			if (!owlNested) {
				$owlDots.css({
					opacity: 1,
					bottom: -owlDotsH
				});
			}
		});
	};

	function animate_elems($this) {
		var lastDelay;
		$.each($('.animate_when_almost_visible:not(.t-inside)', $this), function(index, val) {
			var element = $(val),
				delayAttr = element.attr('data-delay');
			if (delayAttr == undefined) delayAttr = 0;
			setTimeout(function() {
				element.addClass('start_animation');
			}, delayAttr);
			lastDelay = delayAttr;
		});
		return lastDelay;
	}

	function animate_thumb(items) {
		var currentIndex = 0,
			lastDelay;
			$.each(items, function(index, val) {
				var parent = $(val).closest('.owl-item');
				if (!$(val).hasClass('start_animation')) {
					if (parent.hasClass('active')) {
						var thumbInView = new Waypoint.Inview({
						  element: val,
						  enter: function(direction) {
						    var element = $(this.element),
									delayAttr = parseInt(element.attr('data-delay'));
								if (isNaN(delayAttr)) delayAttr = 100;
								var objTimeout = setTimeout(function() {
									element.addClass('start_animation');
								}, currentIndex * delayAttr);
								lastDelay = currentIndex * delayAttr;
								currentIndex++;
								parent.data('objTimeout', objTimeout);
								this.destroy();
						  }
						});
					}
				}
			});
			return lastDelay;
		}

	function setItemsHeight(item) {
		$.each($('.owl-item', item), function(index, val) {
			var availableThumbHeight = $('.t-inside', $(val)).height(),
			innerThumbHeight = $('.t-entry-text-tc', $(val)).outerHeight(),
			difference = availableThumbHeight - innerThumbHeight;
			if ($('.tmb-content-under', val).length) {
				var visualPart = $('.t-entry-visual', val);
				if (visualPart.length) {
					difference -= $('.t-entry-visual', val).height();
				}
			}
			$('.t-entry > *:last-child', val).css( 'transform', 'translateY('+difference+'px)' );
		});
	}

	function pauseOnHover(slider) {
		$('.owl-dots, .owl-prev, .owl-next', slider).on({
	    mouseenter: function () {
	    	$(slider).addClass('owl-mouseenter');
	    	$(slider).trigger('stop.owl.autoplay');
	    },
	    mouseleave: function () {
	    	$(slider).removeClass('owl-mouseenter')
	      $(slider).trigger('play.owl.autoplay');
	    }
		});
	}
};

UNCODE.owlPlayVideo = function(carousel) {
	var player, iframe;
	$('.owl-item.active .uncode-video-container', carousel).each(function(index, val) {
		var content = $(val).html();
		if (content == '') {
			var getCloned = $('.owl-item:not(.active) .uncode-video-container[data-id="'+$(this).attr('data-id')+'"]').children().first().clone();
			$(val).append(getCloned);
		}
		if ($(this).attr('data-provider') == 'vimeo') {
			iframe = $(this).find('iframe');
			player = $f(iframe[0]);
			player.api('play');
		} else if ($(this).attr('data-provider') == 'youtube') {
			youtubePlayers[$(this).attr('data-id')].playVideo();
		} else {
			var player = $(this).find('video');
			if (player.length) {
				$(this).find('video')[0].volume = 0;
				$(this).find('video')[0].play();
				$(val).css('opacity', 1);
			}
		}
	});
};

UNCODE.owlStopVideo = function(carousel) {
	$('.owl-item .uncode-video-container', carousel).each(function(index, val) {
		var player, iframe;
		if ($(this).attr('data-provider') == 'vimeo') {
			iframe = $(this).find('iframe');
			player = $f(iframe[0]);
			player.api('pause');
		} else if ($(this).attr('data-provider') == 'youtube') {
			youtubePlayers[$(this).attr('data-id')].pauseVideo();
		} else {
			var player = $(this).find('video');
			if (player.length) {
				$(this).find('video')[0].volume = 0;
				$(this).find('video')[0].play();
			}
		}
	});
};

UNCODE.animations = function() {
	if (!UNCODE.isMobile) {
		$.each($('.header-content-inner'), function(index, val) {
			var element = $(val),
				transition = '';
			if (element.hasClass('top-t-bottom')) transition = 'top-t-bottom';
			if (element.hasClass('bottom-t-top')) transition = 'bottom-t-top';
			if (element.hasClass('left-t-right')) transition = 'left-t-right';
			if (element.hasClass('right-t-left')) transition = 'right-t-left';
			if (element.hasClass('zoom-in')) transition = 'zoom-in';
			if (element.hasClass('zoom-out')) transition = 'zoom-out';
			if (element.hasClass('alpha-anim')) transition = 'alpha-anim';
			if (transition != '') {
				$(val).removeClass(transition);
				var container = element,
					containerDelay = container.attr('data-delay'),
					containerSpeed = container.attr('data-speed'),
					items = $('.header-title > *, .post-info', container);
				$.each(items, function(index, val) {
					var element = $(val),
						//speedAttr = (containerSpeed == undefined) ? containerSpeed : '',
						delayAttr = (containerDelay != undefined) ? containerDelay : 400;
					if (!element.hasClass('animate_when_almost_visible')) {
						delayAttr = Number(delayAttr) + (400 * index);
						if (containerSpeed != undefined) element.attr('data-speed', containerSpeed);
						element.addClass(transition + ' animate_when_almost_visible').attr('data-delay', delayAttr);
					}
				});
				container.css('opacity', 1);
			}
		});
	}

	if (!window.waypoint_animation) {
		window.waypoint_animation = function() {
			$.each($('.animate_when_almost_visible:not(.start_animation):not(.t-inside), .tmb-media .animate_when_almost_visible:not(.start_animation)'), function(index, val) {
				var run = true;
				if ($(val).closest('.owl-carousel').length > 0) run = false;
				if (run) {
					new Waypoint({
						element: val,
						handler: function() {
							var element = $(this.element),
								index = element.index(),
								delayAttr = element.attr('data-delay');
							if (delayAttr == undefined) delayAttr = 0;
							setTimeout(function() {
								element.addClass('start_animation');
							}, delayAttr);
							this.destroy();
						},
						offset: '90%'
					});
				}
			});
		}
	}
	setTimeout(function() {
		if (!UNCODE.isMobile) window.waypoint_animation();
	}, 100);
}

UNCODE.tapHover = function() {

    var $el = $('html.touch .t-entry-visual-cont > a'), //.length //html.touch a.btn
        elClass = "hover";

    $el.on("click", function(e) { // cambia click con touch start 'touchstart'
        var link = $(this);
        if (link.hasClass(elClass)) {
            return true;
        } else {
            link.addClass("hover");
            $el.not(this).removeClass(elClass);
            e.preventDefault();
            return false;
        }
    });
};


UNCODE.onePage = function() {
	var current = 0,
		last = 0,
		lastScrollTop = 0,
		forceScroll = false,
		lastScrolled = 0,
		isSectionscroller = ($('.main-onepage').length) ? true : false;

	function init_onepage() {
		if (isSectionscroller) {
			$("<ul class='onepage-pagination'></ul>").prependTo("body");
		}
		last = $('.onepage-section').length - 1;
		$.each($('div[data-parent=true]'), function(index, val) {
			$(this).attr('data-section', index);
			new Waypoint({
				element: val,
				handler: function() {
					current = lastScrolled = parseInt($(this.element).attr('data-section'));
					if (isSectionscroller) {
						$('ul.onepage-pagination li a').removeClass('is-selected');
						$('.onepage-pagination li a[data-index=' + index + ']').addClass('is-selected');
					}
					var getName = $('[data-section=' + index + ']').attr('data-name');
					if (getName != undefined) {
						$.each($('.menu-container .menu-item > a'), function(i, val) {
							if ($(val).attr('href') == '#' + getName) {
								$(val).closest('ul').find('.active').removeClass('active');
								$(val).parent().addClass('active');
							}
						});
					}
				},
			});

			if (isSectionscroller) {
				var label;
				if ($(this).attr('data-label') != undefined) label = $(this).attr('data-label');
				else label = '';
				var getName = $(this).attr('data-name');
				if (getName == undefined) getName = index;
				if (label != '') {
					label = '<span class="cd-label style-accent-bg border-accent-color">' + label + '</span>';
					$('ul.onepage-pagination').append("<li><a data-index='" + (index) + "' href='#" + (getName) + "'><span class='cd-dot-cont'><span class='cd-dot'></span></span>"+label+"</a></li>");
				}
			}
		});

		if (isSectionscroller) {
			$.each($('ul.onepage-pagination li'), function(index, val) {
				var $this = $(val);
				$this.on('click', function(evt) {
					var el = $('a', evt.currentTarget);
					current = lastScrolled = parseInt(el.attr('data-index'));
					lastScrolled += 1;
					scrollBody(current);
				});
			});
			var goToSection = parseInt((window.location.hash).replace(/[^\d.]/g, ''));
			if (isNaN(goToSection) && window.location.hash != undefined && window.location.hash != '') {
				goToSection = String(window.location.hash).replace(/^#/, "");
				goToSection = Number($('[data-name=' + goToSection + ']').attr('data-section'));
			}
			if (typeof goToSection === 'number' && !isNaN(goToSection)) {
				current = lastScrolled = goToSection;
				setTimeout(function() {
					scrollBody(goToSection);
				}, 500);
			}
		}
	}

	if (isSectionscroller) {
		$(window).on('scroll', function() {
			var bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'];
			if (bodyTop == 0) {
				$('ul.onepage-pagination li a').removeClass('is-selected');
				$('.onepage-pagination li a[data-index=0]').addClass('is-selected');
				var getName = $('[data-section=0]').attr('data-name');
				if (getName != undefined) {
					$.each($('.menu-container .menu-item > a'), function(i, val) {
						if ($(val).attr('href') == '#' + getName) {
							$(val).closest('ul').find('.active').removeClass('active');
							$(val).parent().addClass('active');
						}
					});
				}
			} else if ((window.innerHeight + bodyTop) >= $('.box-container').height()) {
				$('ul.onepage-pagination li a').removeClass('is-selected');
				$('.onepage-pagination li a[data-index="' + last +'"]').addClass('is-selected');
			}
		});

		var scrollBody = function(index) {
			$('ul.onepage-pagination li a').removeClass('is-selected');
			$('.onepage-pagination li a[data-index=' + index + ']').addClass('is-selected');
			var body = $("html, body"),
			bodyTop = document.documentElement['scrollTop'] || document.body['scrollTop'],
			delta = bodyTop - $('[data-section=' + index + ']').offset().top,
			scrollTo = $('[data-section=' + index + ']').offset().top;
			if (index != 0) {
				UNCODE.scrolling = true;
			}
			body.animate({
				scrollTop: (delta > 0) ? scrollTo - 0.1 : scrollTo
			}, Math.abs(delta) / 2, 'easeInOutQuad', function() {
				setTimeout(function(){
					UNCODE.scrolling = false;
				}, 100);
			});
		};
	}

	init_onepage();
};

UNCODE.stickyElements = function() {
	setTimeout(function() {
		if ($('.sticky-sidebar').length) {
			var sideOffset = parseInt($('.sticky-sidebar').closest('.row-parent').css("padding-top").replace("px", ""));
			if ($('.menu-sticky').length) {
				if ($('.menu-shrink').length) {
					sideOffset += $('.navbar-brand').data('minheight') + 36;
				} else sideOffset += parseInt(UNCODE.menuHeight);
			}

			if ($(window).width() > UNCODE.mediaQuery) {
				$(".sticky-sidebar").stick_in_parent({
					sticky_class: 'is_stucked',
					offset_top: sideOffset,
					bottoming: true,
					inner_scrolling: false
				});
			}
			$(window).on('resize', function(event) {
				if ($(window).width() > UNCODE.mediaQuery) {
					$(".sticky-sidebar").stick_in_parent({
						sticky_class: 'is_stucked',
						offset_top: sideOffset,
						bottoming: true,
						inner_scrolling: false
					});
				} else {
					$(".sticky-sidebar").trigger("sticky_kit:detach");
				}
			});
		}
	}, 1000);
};

UNCODE.scrollEnance = function() {
  /*!
   * Shim for MutationObserver interface
   * Author: Graeme Yeates (github.com/megawac)
   * Repository: https://github.com/megawac/MutationObserver.js
   * License: WTFPL V2, 2004 (wtfpl.net).
   * Though credit and staring the repo will make me feel pretty, you can modify and redistribute as you please.
   * Attempts to follow spec (http:// www.w3.org/TR/dom/#mutation-observers) as closely as possible for native javascript
   * See https://github.com/WebKit/webkit/blob/master/Source/WebCore/dom/MutationObserver.cpp for current webkit source c++ implementation
   */
  /**
   * prefix bugs:
      - https://bugs.webkit.org/show_bug.cgi?id=85161
      - https://bugzilla.mozilla.org/show_bug.cgi?id=749920
   * Don't use WebKitMutationObserver as Safari (6.0.5-6.1) use a buggy implementation
  */
  window.MutationObserver = window.MutationObserver || (function(undefined) {
    "use strict";
    /**
     * @param {function(Array.<MutationRecord>, MutationObserver)} listener
     * @constructor
     */
    function MutationObserver(listener) {
        /**
         * @type {Array.<Object>}
         * @private
         */
        this._watched = [];
        /** @private */
        this._listener = listener;
      }
      /**
       * Start a recursive timeout function to check all items being observed for mutations
       * @type {MutationObserver} observer
       * @private
       */
    function startMutationChecker(observer) {
        (function check() {
          var mutations = observer.takeRecords();
          if (mutations.length) { // fire away
            // calling the listener with context is not spec but currently consistent with FF and WebKit
            observer._listener(mutations, observer);
          }
          /** @private */
          observer._timeout = setTimeout(check, MutationObserver._period);
        })();
      }
      /**
       * Period to check for mutations (~32 times/sec)
       * @type {number}
       * @expose
       */
    MutationObserver._period = 30 /*ms+runtime*/ ;
    /**
     * Exposed API
     * @expose
     * @final
     */
    MutationObserver.prototype = {
      /**
       * see http:// dom.spec.whatwg.org/#dom-mutationobserver-observe
       * not going to throw here but going to follow the current spec config sets
       * @param {Node|null} $target
       * @param {Object|null} config : MutationObserverInit configuration dictionary
       * @expose
       * @return undefined
       */
      observe: function($target, config) {
        /**
         * Using slightly different names so closure can go ham
         * @type {!Object} : A custom mutation config
         */
        var settings = {
          attr: !!(config.attributes || config.attributeFilter || config.attributeOldValue),
          // some browsers are strict in their implementation that config.subtree and childList must be set together. We don't care - spec doesn't specify
          kids: !!config.childList,
          descendents: !!config.subtree,
          charData: !!(config.characterData || config.characterDataOldValue)
        };
        var watched = this._watched;
        // remove already observed target element from pool
        for (var i = 0; i < watched.length; i++) {
          if (watched[i].tar === $target) watched.splice(i, 1);
        }
        if (config.attributeFilter) {
          /**
           * converts to a {key: true} dict for faster lookup
           * @type {Object.<String,Boolean>}
           */
          settings.afilter = reduce(config.attributeFilter, function(a, b) {
            a[b] = true;
            return a;
          }, {});
        }
        watched.push({
          tar: $target,
          fn: createMutationSearcher($target, settings)
        });
        // reconnect if not connected
        if (!this._timeout) {
          startMutationChecker(this);
        }
      },
      /**
       * Finds mutations since last check and empties the "record queue" i.e. mutations will only be found once
       * @expose
       * @return {Array.<MutationRecord>}
       */
      takeRecords: function() {
        var mutations = [];
        var watched = this._watched;
        for (var i = 0; i < watched.length; i++) {
          watched[i].fn(mutations);
        }
        return mutations;
      },
      /**
       * @expose
       * @return undefined
       */
      disconnect: function() {
        this._watched = []; // clear the stuff being observed
        clearTimeout(this._timeout); // ready for garbage collection
        /** @private */
        this._timeout = null;
      }
    };
    /**
     * Simple MutationRecord pseudoclass. No longer exposing as its not fully compliant
     * @param {Object} data
     * @return {Object} a MutationRecord
     */
    function MutationRecord(data) {
        var settings = { // technically these should be on proto so hasOwnProperty will return false for non explicitly props
          type: null,
          target: null,
          addedNodes: [],
          removedNodes: [],
          previousSibling: null,
          nextSibling: null,
          attributeName: null,
          attributeNamespace: null,
          oldValue: null
        };
        for (var prop in data) {
          if (has(settings, prop) && data[prop] !== undefined) settings[prop] = data[prop];
        }
        return settings;
      }
      /**
       * Creates a func to find all the mutations
       *
       * @param {Node} $target
       * @param {!Object} config : A custom mutation config
       */
    function createMutationSearcher($target, config) {
        /** type {Elestuct} */
        var $oldstate = clone($target, config); // create the cloned datastructure
        /**
         * consumes array of mutations we can push to
         *
         * @param {Array.<MutationRecord>} mutations
         */
        return function(mutations) {
          var olen = mutations.length,
            dirty;
          // Alright we check base level changes in attributes... easy
          if (config.attr && $oldstate.attr) {
            findAttributeMutations(mutations, $target, $oldstate.attr, config.afilter);
          }
          // check childlist or subtree for mutations
          if (config.kids || config.descendents) {
            dirty = searchSubtree(mutations, $target, $oldstate, config);
          }
          // reclone data structure if theres changes
          if (dirty || mutations.length !== olen) {
            /** type {Elestuct} */
            $oldstate = clone($target, config);
          }
        };
      }
      /* attributes + attributeFilter helpers */
      /**
       * fast helper to check to see if attributes object of an element has changed
       * doesnt handle the textnode case
       *
       * @param {Array.<MutationRecord>} mutations
       * @param {Node} $target
       * @param {Object.<string, string>} $oldstate : Custom attribute clone data structure from clone
       * @param {Object} filter
       */
    function findAttributeMutations(mutations, $target, $oldstate, filter) {
        var checked = {};
        var attributes = $target.attributes;
        var attr;
        var name;
        var i = attributes.length;
        while (i--) {
          attr = attributes[i];
          name = attr.name;
          if (!filter || has(filter, name)) {
            if (attr.value !== $oldstate[name]) {
              // The pushing is redundant but gzips very nicely
              mutations.push(MutationRecord({
                type: "attributes",
                target: $target,
                attributeName: name,
                oldValue: $oldstate[name],
                attributeNamespace: attr.namespaceURI // in ie<8 it incorrectly will return undefined
              }));
            }
            checked[name] = true;
          }
        }
        for (name in $oldstate) {
          if (!(checked[name])) {
            mutations.push(MutationRecord({
              target: $target,
              type: "attributes",
              attributeName: name,
              oldValue: $oldstate[name]
            }));
          }
        }
      }
      /**
       * searchSubtree: array of mutations so far, element, element clone, bool
       * synchronous dfs comparision of two nodes
       * This function is applied to any observed element with childList or subtree specified
       * Sorry this is kind of confusing as shit, tried to comment it a bit...
       * codereview.stackexchange.com/questions/38351 discussion of an earlier version of this func
       *
       * @param {Array} mutations
       * @param {Node} $target
       * @param {!Object} $oldstate : A custom cloned node from clone()
       * @param {!Object} config : A custom mutation config
       */
    function searchSubtree(mutations, $target, $oldstate, config) {
        // Track if the tree is dirty and has to be recomputed (#14).
        var dirty;
        /*
         * Helper to identify node rearrangment and stuff...
         * There is no gaurentee that the same node will be identified for both added and removed nodes
         * if the positions have been shuffled.
         * conflicts array will be emptied by end of operation
         */
        function resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes) {
            // the distance between the first conflicting node and the last
            var distance = conflicts.length - 1;
            // prevents same conflict being resolved twice consider when two nodes switch places.
            // only one should be given a mutation event (note -~ is used as a math.ceil shorthand)
            var counter = -~((distance - numAddedNodes) / 2);
            var $cur;
            var oldstruct;
            var conflict;
            while ((conflict = conflicts.pop())) {
              $cur = $kids[conflict.i];
              oldstruct = $oldkids[conflict.j];
              // attempt to determine if there was node rearrangement... won't gaurentee all matches
              // also handles case where added/removed nodes cause nodes to be identified as conflicts
              if (config.kids && counter && Math.abs(conflict.i - conflict.j) >= distance) {
                mutations.push(MutationRecord({
                  type: "childList",
                  target: node,
                  addedNodes: [$cur],
                  removedNodes: [$cur],
                  // haha don't rely on this please
                  nextSibling: $cur.nextSibling,
                  previousSibling: $cur.previousSibling
                }));
                counter--; // found conflict
              }
              // Alright we found the resorted nodes now check for other types of mutations
              if (config.attr && oldstruct.attr) findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
              if (config.charData && $cur.nodeType === 3 && $cur.nodeValue !== oldstruct.charData) {
                mutations.push(MutationRecord({
                  type: "characterData",
                  target: $cur
                }));
              }
              // now look @ subtree
              if (config.descendents) findMutations($cur, oldstruct);
            }
          }
          /**
           * Main worker. Finds and adds mutations if there are any
           * @param {Node} node
           * @param {!Object} old : A cloned data structure using internal clone
           */
        function findMutations(node, old) {
          var $kids = node.childNodes;
          var $oldkids = old.kids;
          var klen = $kids.length;
          // $oldkids will be undefined for text and comment nodes
          var olen = $oldkids ? $oldkids.length : 0;
          // if (!olen && !klen) return; // both empty; clearly no changes
          // we delay the intialization of these for marginal performance in the expected case (actually quite signficant on large subtrees when these would be otherwise unused)
          // map of checked element of ids to prevent registering the same conflict twice
          var map;
          // array of potential conflicts (ie nodes that may have been re arranged)
          var conflicts;
          var id; // element id from getElementId helper
          var idx; // index of a moved or inserted element
          var oldstruct;
          // current and old nodes
          var $cur;
          var $old;
          // track the number of added nodes so we can resolve conflicts more accurately
          var numAddedNodes = 0;
          // iterate over both old and current child nodes at the same time
          var i = 0,
            j = 0;
          // while there is still anything left in $kids or $oldkids (same as i < $kids.length || j < $oldkids.length;)
          while (i < klen || j < olen) {
            // current and old nodes at the indexs
            $cur = $kids[i];
            oldstruct = $oldkids[j];
            $old = oldstruct && oldstruct.node;
            if ($cur === $old) { // expected case - optimized for this case
              // check attributes as specified by config
              if (config.attr && oldstruct.attr) /* oldstruct.attr instead of textnode check */ findAttributeMutations(mutations, $cur, oldstruct.attr, config.afilter);
              // check character data if node is a comment or textNode and it's being observed
              if (config.charData && oldstruct.charData !== undefined && $cur.nodeValue !== oldstruct.charData) {
                mutations.push(MutationRecord({
                  type: "characterData",
                  target: $cur
                }));
              }
              // resolve conflicts; it will be undefined if there are no conflicts - otherwise an array
              if (conflicts) resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
              // recurse on next level of children. Avoids the recursive call when there are no children left to iterate
              if (config.descendents && ($cur.childNodes.length || oldstruct.kids && oldstruct.kids.length)) findMutations($cur, oldstruct);
              i++;
              j++;
            } else { // (uncommon case) lookahead until they are the same again or the end of children
              dirty = true;
              if (!map) { // delayed initalization (big perf benefit)
                map = {};
                conflicts = [];
              }
              if ($cur) {
                // check id is in the location map otherwise do a indexOf search
                if (!(map[id = getElementId($cur)])) { // to prevent double checking
                  // mark id as found
                  map[id] = true;
                  // custom indexOf using comparitor checking oldkids[i].node === $cur
                  if ((idx = indexOfCustomNode($oldkids, $cur, j)) === -1) {
                    if (config.kids) {
                      mutations.push(MutationRecord({
                        type: "childList",
                        target: node,
                        addedNodes: [$cur], // $cur is a new node
                        nextSibling: $cur.nextSibling,
                        previousSibling: $cur.previousSibling
                      }));
                      numAddedNodes++;
                    }
                  } else {
                    conflicts.push({ // add conflict
                      i: i,
                      j: idx
                    });
                  }
                }
                i++;
              }
              if ($old &&
                // special case: the changes may have been resolved: i and j appear congurent so we can continue using the expected case
                $old !== $kids[i]) {
                if (!(map[id = getElementId($old)])) {
                  map[id] = true;
                  if ((idx = indexOf($kids, $old, i)) === -1) {
                    if (config.kids) {
                      mutations.push(MutationRecord({
                        type: "childList",
                        target: old.node,
                        removedNodes: [$old],
                        nextSibling: $oldkids[j + 1], // praise no indexoutofbounds exception
                        previousSibling: $oldkids[j - 1]
                      }));
                      numAddedNodes--;
                    }
                  } else {
                    conflicts.push({
                      i: idx,
                      j: j
                    });
                  }
                }
                j++;
              }
            } // end uncommon case
          } // end loop
          // resolve any remaining conflicts
          if (conflicts) resolveConflicts(conflicts, node, $kids, $oldkids, numAddedNodes);
        }
        findMutations($target, $oldstate);
        return dirty;
      }
      /**
       * Utility
       * Cones a element into a custom data structure designed for comparision. https://gist.github.com/megawac/8201012
       *
       * @param {Node} $target
       * @param {!Object} config : A custom mutation config
       * @return {!Object} : Cloned data structure
       */
    function clone($target, config) {
        var recurse = true; // set true so childList we'll always check the first level
        return (function copy($target) {
          var elestruct = {
            /** @type {Node} */
            node: $target
          };
          // Store current character data of target text or comment node if the config requests
          // those properties to be observed.
          if (config.charData && ($target.nodeType === 3 || $target.nodeType === 8)) {
            elestruct.charData = $target.nodeValue;
          }
          // its either a element, comment, doc frag or document node
          else {
            // Add attr only if subtree is specified or top level and avoid if
            // attributes is a document object (#13).
            if (config.attr && recurse && $target.nodeType === 1) {
              /**
               * clone live attribute list to an object structure {name: val}
               * @type {Object.<string, string>}
               */
              elestruct.attr = reduce($target.attributes, function(memo, attr) {
                if (!config.afilter || config.afilter[attr.name]) {
                  memo[attr.name] = attr.value;
                }
                return memo;
              }, {});
            }
            // whether we should iterate the children of $target node
            if (recurse && ((config.kids || config.charData) || (config.attr && config.descendents))) {
              /** @type {Array.<!Object>} : Array of custom clone */
              elestruct.kids = map($target.childNodes, copy);
            }
            recurse = config.descendents;
          }
          return elestruct;
        })($target);
      }
      /**
       * indexOf an element in a collection of custom nodes
       *
       * @param {NodeList} set
       * @param {!Object} $node : A custom cloned node
       * @param {number} idx : index to start the loop
       * @return {number}
       */
    function indexOfCustomNode(set, $node, idx) {
        return indexOf(set, $node, idx, JSCompiler_renameProperty("node"));
      }
      // using a non id (eg outerHTML or nodeValue) is extremely naive and will run into issues with nodes that may appear the same like <li></li>
    var counter = 1; // don't use 0 as id (falsy)
    /** @const */
    var expando = "mo_id";
    /**
     * Attempt to uniquely id an element for hashing. We could optimize this for legacy browsers but it hopefully wont be called enough to be a concern
     *
     * @param {Node} $ele
     * @return {(string|number)}
     */
    function getElementId($ele) {
        try {
          return $ele.id || ($ele[expando] = $ele[expando] || counter++);
        } catch (o_O) { // ie <8 will throw if you set an unknown property on a text node
          try {
            return $ele.nodeValue; // naive
          } catch (shitie) { // when text node is removed: https://gist.github.com/megawac/8355978 :(
            return counter++;
          }
        }
      }
      /**
       * **map** Apply a mapping function to each item of a set
       * @param {Array|NodeList} set
       * @param {Function} iterator
       */
    function map(set, iterator) {
        var results = [];
        for (var index = 0; index < set.length; index++) {
          results[index] = iterator(set[index], index, set);
        }
        return results;
      }
      /**
       * **Reduce** builds up a single result from a list of values
       * @param {Array|NodeList|NamedNodeMap} set
       * @param {Function} iterator
       * @param {*} [memo] Initial value of the memo.
       */
    function reduce(set, iterator, memo) {
        for (var index = 0; index < set.length; index++) {
          memo = iterator(memo, set[index], index, set);
        }
        return memo;
      }
      /**
       * **indexOf** find index of item in collection.
       * @param {Array|NodeList} set
       * @param {Object} item
       * @param {number} idx
       * @param {string} [prop] Property on set item to compare to item
       */
    function indexOf(set, item, idx, prop) {
        for ( /*idx = ~~idx*/ ; idx < set.length; idx++) { // start idx is always given as this is internal
          if ((prop ? set[idx][prop] : set[idx]) === item) return idx;
        }
        return -1;
      }
      /**
       * @param {Object} obj
       * @param {(string|number)} prop
       * @return {boolean}
       */
    function has(obj, prop) {
        return obj[prop] !== undefined; // will be nicely inlined by gcc
      }
      // GCC hack see http:// stackoverflow.com/a/23202438/1517919
    function JSCompiler_renameProperty(a) {
      return a;
    }
    return MutationObserver;
  })(void 0);
  //
  // SmoothScroll for websites v1.4.0 (Balazs Galambosi)
  // http://www.smoothscroll.net/
  //
  // Licensed under the terms of the MIT license.
  //
  // You may use it in your theme if you credit me. 
  // It is also free to use on any individual website.
  //
  // Exception:
  // The only restriction is to not publish any  
  // extension for browsers or native application
  // without getting a written permission first.
  //
  (function() {
    // Scroll Variables (tweakable)
    var defaultOptions = {
      // Scrolling Core
      frameRate: 150, // [Hz]
      animationTime: 500, // [ms]
      stepSize: 100, // [px]
      // Pulse (less tweakable)
      // ratio of "tail" to "acceleration"
      pulseAlgorithm: true,
      pulseScale: 4,
      pulseNormalize: 1,
      // Acceleration
      accelerationDelta: 50, // 50
      accelerationMax: 3, // 3
      // Keyboard Settings
      keyboardSupport: true, // option
      arrowScroll: 50, // [px]
      // Other
      touchpadSupport: false, // ignore touchpad by default
      fixedBackground: true,
      excluded: ''
    };
    var options = defaultOptions;
    // Other Variables
    var isExcluded = false;
    var isFrame = false;
    var direction = {
      x: 0,
      y: 0
    };
    var initDone = false;
    var root = document.documentElement;
    var activeElement;
    var observer;
    var refreshSize;
    var deltaBuffer = [];
    var isMac = /^Mac/.test(navigator.platform);
    var key = {
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      spacebar: 32,
      pageup: 33,
      pagedown: 34,
      end: 35,
      home: 36
    };
    /***********************************************
     * INITIALIZE
     ***********************************************/
    /**
     * Tests if smooth scrolling is allowed. Shuts down everything if not.
     */
    function initTest() {
        if (options.keyboardSupport) {
          addEvent('keydown', keydown);
        }
      }
      /**
       * Sets up scrolls array, determines if frames are involved.
       */
    function init() {
        if (initDone || !document.body) return;
        initDone = true;
        var body = document.body;
        var html = document.documentElement;
        var windowHeight = window.innerHeight;
        var scrollHeight = body.scrollHeight;
        // check compat mode for root element
        root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
        activeElement = body;
        initTest();
        // Checks if this script is running in a frame
        if (top != self) {
          isFrame = true;
        }
        /**
         * Please duplicate this radar for a Safari fix!
         * rdar://22376037
         * https://openradar.appspot.com/radar?id=4965070979203072
         *
         * Only applies to Safari now, Chrome fixed it in v45:
         * This fixes a bug where the areas left and right to
         * the content does not trigger the onmousewheel event
         * on some pages. e.g.: html, body { height: 100% }
         */
        else if (scrollHeight > windowHeight && (body.offsetHeight <= windowHeight || html.offsetHeight <= windowHeight)) {
          var fullPageElem = document.createElement('div');
          fullPageElem.style.cssText = 'position:absolute; z-index:-10000; ' + 'top:0; left:0; right:0; height:' + root.scrollHeight + 'px';
          document.body.appendChild(fullPageElem);
          // DOM changed (throttled) to fix height
          var pendingRefresh;
          refreshSize = function() {
            if (pendingRefresh) return; // could also be: clearTimeout(pendingRefresh);
            pendingRefresh = setTimeout(function() {
              if (isExcluded) return; // could be running after cleanup
              fullPageElem.style.height = '0';
              fullPageElem.style.height = root.scrollHeight + 'px';
              pendingRefresh = null;
            }, 500); // act rarely to stay fast
          };
          setTimeout(refreshSize, 10);
          addEvent('resize', refreshSize);
          // TODO: attributeFilter?
          var config = {
            attributes: true,
            childList: true,
            characterData: false
              // subtree: true
          };
          observer = new MutationObserver(refreshSize);
          observer.observe(body, config);
          if (root.offsetHeight <= windowHeight) {
            var clearfix = document.createElement('div');
            clearfix.style.clear = 'both';
            body.appendChild(clearfix);
          }
        }
        // disable fixed background
        if (!options.fixedBackground && !isExcluded) {
          body.style.backgroundAttachment = 'scroll';
          html.style.backgroundAttachment = 'scroll';
        }
      }
      /**
       * Removes event listeners and other traces left on the page.
       */
    function cleanup() {
        observer && observer.disconnect();
        removeEvent(wheelEvent, wheel);
        removeEvent('mousedown', mousedown);
        removeEvent('keydown', keydown);
        removeEvent('resize', refreshSize);
        removeEvent('load', init);
      }
      /************************************************
       * SCROLLING
       ************************************************/
    var que = [];
    var pending = false;
    var lastScroll = Date.now();
    /**
     * Pushes scroll actions to the scrolling queue.
     */
    function scrollArray(elem, left, top) {
        directionCheck(left, top);
        if (options.accelerationMax != 1) {
          var now = Date.now();
          var elapsed = now - lastScroll;
          if (elapsed < options.accelerationDelta) {
            var factor = (1 + (50 / elapsed)) / 2;
            if (factor > 1) {
              factor = Math.min(factor, options.accelerationMax);
              left *= factor;
              top *= factor;
            }
          }
          lastScroll = Date.now();
        }
        // push a scroll command
        que.push({
          x: left,
          y: top,
          lastX: (left < 0) ? 0.99 : -0.99,
          lastY: (top < 0) ? 0.99 : -0.99,
          start: Date.now()
        });
        // don't act if there's a pending queue
        if (pending) {
          return;
        }
        var scrollWindow = (elem === document.body);
        var step = function(time) {
          var now = Date.now();
          var scrollX = 0;
          var scrollY = 0;
          for (var i = 0; i < que.length; i++) {
            var item = que[i];
            var elapsed = now - item.start;
            var finished = (elapsed >= options.animationTime);
            // scroll position: [0, 1]
            var position = (finished) ? 1 : elapsed / options.animationTime;
            // easing [optional]
            if (options.pulseAlgorithm) {
              position = pulse(position);
            }
            // only need the difference
            var x = (item.x * position - item.lastX) >> 0;
            var y = (item.y * position - item.lastY) >> 0;
            // add this to the total scrolling
            scrollX += x;
            scrollY += y;
            // update last values
            item.lastX += x;
            item.lastY += y;
            // delete and step back if it's over
            if (finished) {
              que.splice(i, 1);
              i--;
            }
          }
          // scroll left and top
          if (scrollWindow) {
            window.scrollBy(scrollX, scrollY);
          } else {
            if (scrollX) elem.scrollLeft += scrollX;
            if (scrollY) elem.scrollTop += scrollY;
          }
          // clean up if there's nothing left to do
          if (!left && !top) {
            que = [];
          }
          if (que.length) {
            requestFrame(step, elem, (1000 / options.frameRate + 1));
          } else {
            pending = false;
          }
        };
        // start a new queue of actions
        requestFrame(step, elem, 0);
        pending = true;
      }
      /***********************************************
       * EVENTS
       ***********************************************/
      /**
       * Mouse wheel handler.
       * @param {Object} event
       */
    function wheel(event) {
        if (!initDone) {
          init();
        }
        var target = event.target;
        var overflowing = overflowingAncestor(target);
        // use default if there's no overflowing
        // element or default action is prevented   
        // or it's a zooming event with CTRL 
        if (!overflowing || event.defaultPrevented || event.ctrlKey) {
          return true;
        }
        // leave embedded content alone (flash & pdf)
        if (isNodeName(activeElement, 'embed') || (isNodeName(target, 'embed') && /\.pdf/i.test(target.src)) || isNodeName(activeElement, 'object')) {
          return true;
        }
        var deltaX = -event.wheelDeltaX || event.deltaX || 0;
        var deltaY = -event.wheelDeltaY || event.deltaY || 0;
        if (isMac) {
          if (event.wheelDeltaX && isDivisible(event.wheelDeltaX, 120)) {
            deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
          }
          if (event.wheelDeltaY && isDivisible(event.wheelDeltaY, 120)) {
            deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
          }
        }
        // use wheelDelta if deltaX/Y is not available
        if (!deltaX && !deltaY) {
          deltaY = -event.wheelDelta || 0;
        }
        // line based scrolling (Firefox mostly)
        if (event.deltaMode === 1) {
          deltaX *= 40;
          deltaY *= 40;
        }
        // check if it's a touchpad scroll that should be ignored
        if (!options.touchpadSupport && isTouchpad(deltaY)) {
          return true;
        }
        // scale by step size
        // delta is 120 most of the time
        // synaptics seems to send 1 sometimes
        if (Math.abs(deltaX) > 1.2) {
          deltaX *= options.stepSize / 120;
        }
        if (Math.abs(deltaY) > 1.2) {
          deltaY *= options.stepSize / 120;
        }
        scrollArray(overflowing, deltaX, deltaY);
        event.preventDefault();
        scheduleClearCache();
      }
      /**
       * Keydown event handler.
       * @param {Object} event
       */
    function keydown(event) {
        var target = event.target;
        var modifier = event.ctrlKey || event.altKey || event.metaKey || (event.shiftKey && event.keyCode !== key.spacebar);
        // our own tracked active element could've been removed from the DOM
        if (!document.contains(activeElement)) {
          activeElement = document.activeElement;
        }
        // do nothing if user is editing text
        // or using a modifier key (except shift)
        // or in a dropdown
        // or inside interactive elements
        var inputNodeNames = /^(textarea|select|embed|object)$/i;
        var buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
        if (inputNodeNames.test(target.nodeName) || isNodeName(target, 'input') && !buttonTypes.test(target.type) || isNodeName(activeElement, 'video') || isInsideYoutubeVideo(event) || target.isContentEditable || event.defaultPrevented || modifier) {
          return true;
        }
        // spacebar should trigger button press
        if ((isNodeName(target, 'button') || isNodeName(target, 'input') && buttonTypes.test(target.type)) && event.keyCode === key.spacebar) {
          return true;
        }
        var shift, x = 0,
          y = 0;
        var elem = overflowingAncestor(activeElement);
        var clientHeight = elem.clientHeight;
        if (elem == document.body) {
          clientHeight = window.innerHeight;
        }
        switch (event.keyCode) {
          case key.up:
            y = -options.arrowScroll;
            break;
          case key.down:
            y = options.arrowScroll;
            break;
          case key.spacebar: // (+ shift)
            shift = event.shiftKey ? 1 : -1;
            y = -shift * clientHeight * 0.9;
            break;
          case key.pageup:
            y = -clientHeight * 0.9;
            break;
          case key.pagedown:
            y = clientHeight * 0.9;
            break;
          case key.home:
            y = -elem.scrollTop;
            break;
          case key.end:
            var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
            y = (damt > 0) ? damt + 10 : 0;
            break;
          case key.left:
            x = -options.arrowScroll;
            break;
          case key.right:
            x = options.arrowScroll;
            break;
          default:
            return true; // a key we don't care about
        }
        scrollArray(elem, x, y);
        event.preventDefault();
        scheduleClearCache();
      }
      /**
       * Mousedown event only for updating activeElement
       */
    function mousedown(event) {
        activeElement = event.target;
      }
      /***********************************************
       * OVERFLOW
       ***********************************************/
    var uniqueID = (function() {
      var i = 0;
      return function(el) {
        return el.uniqueID || (el.uniqueID = i++);
      };
    })();
    var cache = {}; // cleared out after a scrolling session
    var clearCacheTimer;
    //setInterval(function () { cache = {}; }, 10 * 1000);
    function scheduleClearCache() {
      clearTimeout(clearCacheTimer);
      clearCacheTimer = setInterval(function() {
        cache = {};
      }, 1 * 1000);
    }

    function setCache(elems, overflowing) {
        for (var i = elems.length; i--;) cache[uniqueID(elems[i])] = overflowing;
        return overflowing;
      }
      //  (body)                (root)
      //         | hidden | visible | scroll |  auto  |
      // hidden  |   no   |    no   |   YES  |   YES  |
      // visible |   no   |   YES   |   YES  |   YES  |
      // scroll  |   no   |   YES   |   YES  |   YES  |
      // auto    |   no   |   YES   |   YES  |   YES  |
    function overflowingAncestor(el) {
      var elems = [];
      var body = document.body;
      var rootScrollHeight = root.scrollHeight;
      do {
        var cached = cache[uniqueID(el)];
        if (cached) {
          return setCache(elems, cached);
        }
        elems.push(el);
        if (rootScrollHeight === el.scrollHeight) {
          var topOverflowsNotHidden = overflowNotHidden(root) && overflowNotHidden(body);
          var isOverflowCSS = topOverflowsNotHidden || overflowAutoOrScroll(root);
          if (isFrame && isContentOverflowing(root) || !isFrame && isOverflowCSS) {
            return setCache(elems, getScrollRoot());
          }
        } else if (isContentOverflowing(el) && overflowAutoOrScroll(el)) {
          return setCache(elems, el);
        }
      } while (el = el.parentElement);
    }

    function isContentOverflowing(el) {
        return (el.clientHeight + 10 < el.scrollHeight);
      }
      // typically for <body> and <html>
    function overflowNotHidden(el) {
        var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
        return (overflow !== 'hidden');
      }
      // for all other elements
    function overflowAutoOrScroll(el) {
        var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
        return (overflow === 'scroll' || overflow === 'auto');
      }
      /***********************************************
       * HELPERS
       ***********************************************/
    function addEvent(type, fn) {
      window.addEventListener(type, fn, false);
    }

    function removeEvent(type, fn) {
      window.removeEventListener(type, fn, false);
    }

    function isNodeName(el, tag) {
      return (el.nodeName || '').toLowerCase() === tag.toLowerCase();
    }

    function directionCheck(x, y) {
      x = (x > 0) ? 1 : -1;
      y = (y > 0) ? 1 : -1;
      if (direction.x !== x || direction.y !== y) {
        direction.x = x;
        direction.y = y;
        que = [];
        lastScroll = 0;
      }
    }
    var deltaBufferTimer;
    if (window.localStorage && localStorage.SS_deltaBuffer) {
      deltaBuffer = localStorage.SS_deltaBuffer.split(',');
    }

    function isTouchpad(deltaY) {
      if (!deltaY) return;
      if (!deltaBuffer.length) {
        deltaBuffer = [deltaY, deltaY, deltaY];
      }
      deltaY = Math.abs(deltaY)
      deltaBuffer.push(deltaY);
      deltaBuffer.shift();
      clearTimeout(deltaBufferTimer);
      deltaBufferTimer = setTimeout(function() {
        if (window.localStorage) {
          localStorage.SS_deltaBuffer = deltaBuffer.join(',');
        }
      }, 1000);
      return !allDeltasDivisableBy(120) && !allDeltasDivisableBy(100);
    }

    function isDivisible(n, divisor) {
      return (Math.floor(n / divisor) == n / divisor);
    }

    function allDeltasDivisableBy(divisor) {
      return (isDivisible(deltaBuffer[0], divisor) && isDivisible(deltaBuffer[1], divisor) && isDivisible(deltaBuffer[2], divisor));
    }

    function isInsideYoutubeVideo(event) {
      var elem = event.target;
      var isControl = false;
      if (document.URL.indexOf('www.youtube.com/watch') != -1) {
        do {
          isControl = (elem.classList && elem.classList.contains('html5-video-controls'));
          if (isControl) break;
        } while (elem = elem.parentNode);
      }
      return isControl;
    }
    var requestFrame = (function() {
      return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback, element, delay) {
        window.setTimeout(callback, delay || (1000 / 60));
      });
    })();
    var MutationObserver = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver);
    var getScrollRoot = (function() {
      var SCROLL_ROOT;
      return function() {
        if (!SCROLL_ROOT) {
          var dummy = document.createElement('div');
          dummy.style.cssText = 'height:10000px;width:1px;';
          document.body.appendChild(dummy);
          var bodyScrollTop = document.body.scrollTop;
          var docElScrollTop = document.documentElement.scrollTop;
          window.scrollBy(0, 1);
          if (document.body.scrollTop != bodyScrollTop)
            (SCROLL_ROOT = document.body);
          else(SCROLL_ROOT = document.documentElement);
          window.scrollBy(0, -1);
          document.body.removeChild(dummy);
        }
        return SCROLL_ROOT;
      };
    })();
    /***********************************************
     * PULSE (by Michael Herf)
     ***********************************************/
    /**
     * Viscous fluid with a pulse for part and decay for the rest.
     * - Applies a fixed force over an interval (a damped acceleration), and
     * - Lets the exponential bleed away the velocity over a longer interval
     * - Michael Herf, http://stereopsis.com/stopping/
     */
    function pulse_(x) {
      var val, start, expx;
      // test
      x = x * options.pulseScale;
      if (x < 1) { // acceleartion
        val = x - (1 - Math.exp(-x));
      } else { // tail
        // the previous animation ended here:
        start = Math.exp(-1);
        // simple viscous drag
        x -= 1;
        expx = 1 - Math.exp(-x);
        val = start + (expx * (1 - start));
      }
      return val * options.pulseNormalize;
    }

    function pulse(x) {
        if (x >= 1) return 1;
        if (x <= 0) return 0;
        if (options.pulseNormalize == 1) {
          options.pulseNormalize /= pulse_(1);
        }
        return pulse_(x);
      }
      /***********************************************
       * FIRST RUN
       ***********************************************/
    var userAgent = window.navigator.userAgent;
    var isEdge = /Edge/.test(userAgent); // thank you MS
    var isChrome = /chrome/i.test(userAgent) && !isEdge;
    var isSafari = /safari/i.test(userAgent) && !isEdge;
    var isMobile = /mobile/i.test(userAgent);
    var isEnabledForBrowser = (isChrome || isSafari) && !isMobile;
    var wheelEvent;
    if ('onwheel' in document.createElement('div')) wheelEvent = 'wheel';
    else if ('onmousewheel' in document.createElement('div')) wheelEvent = 'mousewheel';
    if (wheelEvent && isEnabledForBrowser) {
      addEvent(wheelEvent, wheel);
      addEvent('mousedown', mousedown);
      addEvent('load', init);
    }
    /***********************************************
     * PUBLIC INTERFACE
     ***********************************************/
    function SmoothScroll(optionsToSet) {
      for (var key in optionsToSet)
        if (defaultOptions.hasOwnProperty(key)) options[key] = optionsToSet[key];
    }
    SmoothScroll.destroy = cleanup;
    if (window.SmoothScrollOptions) // async API
      SmoothScroll(window.SmoothScrollOptions)
    if ('object' == typeof exports) module.exports = SmoothScroll;
    else window.SmoothScroll = SmoothScroll;
  })();
};

	UNCODE.init = function() {
		UNCODE.utils();
		UNCODE.menuSystem();
		UNCODE.okvideo();
		UNCODE.tapHover();
		UNCODE.isotopeLayout();
		UNCODE.lightbox();
		UNCODE.backVideo();
		UNCODE.carousel($('body'));
		UNCODE.animations();
		UNCODE.stickyElements();
		UNCODE.disableHoverScroll();
		if (!UNCODE.isMobile) {
			UNCODE.onePage();
		}
		if ($('body.smooth-scroller').length) {
			setTimeout(function(){
				UNCODE.scrollEnance();
			}, 300);
		}
	}
	UNCODE.init();
})(jQuery);

