jQuery(function ($) {
    $(document).ready( function (){
        (function () {
            $('#contact_form').on('submit', function () {
                var tg_bot_token = '684465255:AAGRUirMRIvRsDsjebVArsp_3zkc-Ub7m-g';
                var tg_chat_id   = '424017035';
                var user_phone   = 'Заказ на номер:' + $(this).find('#user_phone').val();

                $.ajax({
                    url         : 'https://api.telegram.org/bot' + tg_bot_token + '/sendMessage?chat_id=' + tg_chat_id + '&text=' + user_phone,
                    dataType    : 'json',
                    method      : 'POST',
                    crossDomain : true,
                    beforeSend  : function(){
                        var instance = $('body');

                        $('.popup-open').each(function (item) {
                            instance.removeClass('popup-active-'+$(item).data('popup'));
                        });

                        instance.removeClass('popup-active')

                    },
                    success     : function (response) {
                        var instance = $('body');

                        if(response.ok === true) {
                            setTimeout(function () {
                                $('.form-wrap').hide();
                                $('.success-message').show();
                                instance.addClass('popup-active popup-active-order');
                            }, 500);

                        } else {
                            setTimeout(function () {
                                $('.form-wrap').hide();
                                $('.error-message').show();
                                instance.addClass('popup-active popup-active-order');
                            }, 500);
                        }
                    },
                    error       : function () {

                        var instance = $('body');

                        setTimeout(function () {
                            $('.form-wrap').hide();
                            $('.error-message').show();
                            instance.addClass('popup-active popup-active-order');
                        }, 500);
                    }
                });
                return false;
            })
        })();
        // ================= Slider ================================ //
        (function () {
            try {
                $('.owl-carousel').owlCarousel({
                    dots       : 0,
                    items      : 1,
                    nav        : 0,
                    autoplay   : 1,
                    loop       : 1,
                    mouseDrag  : 0,
                    touchDrag  : 0,
                    freeDrag   : 0,
                    pullDrag   : 0,
                    smartSpeed : 50000,
                    navText    : 0,
                    animateOut : 'animated fadeOut',
                    animateIn  : 'animated fadeIn'
                });
            } catch (e) {
                console.log(e.message);
            }
        })();
        // ================= !Slider ================================ //

        // ================= Hover ================================ //
        (function() {
            if($(window).width() >= 768) {
                // Init
                var container = document.getElementById("main-content"),
                    inner = document.getElementById("main-content-m-side");

                // Mouse
                var mouse = {
                    _x: 0,
                    _y: 0,
                    x: 0,
                    y: 0,
                    updatePosition: function (event) {
                        var e = event || window.event;
                        this.x = e.clientX - this._x;
                        this.y = (e.clientY - this._y) * -1;
                    },
                    setOrigin: function (e) {
                        this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
                        this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
                    },
                    show: function () {
                        return "(" + this.x + ", " + this.y + ")";
                    }
                };

                // Track the mouse position relative to the center of the container.
                mouse.setOrigin(container);

                //-----------------------------------------

                var counter = 0;
                var updateRate = 3;
                var isTimeToUpdate = function () {
                    return counter++ % updateRate === 0;
                };

                //-----------------------------------------

                var onMouseEnterHandler = function (event) {
                    update(event);
                };

                var onMouseLeaveHandler = function () {
                    inner.style = "";
                };

                var onMouseMoveHandler = function (event) {
                    if (isTimeToUpdate()) {
                        update(event);
                    }
                };

                //-----------------------------------------

                var update = function (event) {
                    mouse.updatePosition(event);
                    updateTransformStyle(
                        (mouse.y / inner.offsetHeight / 2).toFixed(2),
                        (mouse.x / inner.offsetWidth / 2).toFixed(2)
                    );
                };

                var updateTransformStyle = function (x, y) {
                    var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
                    inner.style.transform = style;
                    inner.style.webkitTransform = style;
                    inner.style.mozTransform = style;
                    inner.style.msTransform = style;
                    inner.style.oTransform = style;
                };

                //-----------------------------------------

                container.onmouseenter = onMouseEnterHandler;
                container.onmouseleave = onMouseLeaveHandler;
                container.onmousemove = onMouseMoveHandler;
            }
        })();
        // ================= !Hover ================================ //

        // ================= Scramble ================= //
        (function () {
            try {
                function Descramble(holder,opt){
                    var that               = this;
                    var time               = 0;
                    this.then              = Date.now();
                    this.currentTimeOffset = 0;
                    this.currentWord       = null;
                    this.currentCharacter  = 0;
                    this.currentWordLength = 0;

                    var options = {
                        fps                : 60,
                        timeOffset         : 50,
                        textColor          : '#000000',
                        mixCapital         : true,
                        mixBlockCharacters : true,
                        needUpdate         : true
                    }

                    if(typeof opt !== "undefined"){
                        for(var key in opt){
                            options[key] = opt[key];
                        }
                    }

                    this.fps                = options.fps;
                    this.interval           = 1000/this.fps;
                    this.timeOffset         = options.timeOffset;
                    this.textColor          = options.textColor;
                    this.mixCapital         = options.mixCapital;
                    this.mixBlockCharacters = options.mixBlockCharacters;
                    this.needUpdate         = true;

                    this.chars = [
                        'A','B','C','D','E','F','G','H',
                    ];

                    // hex character codes for: ░ ▒ ▓ █ ▖ ▗ ▘ ▙ ▚ ▛ ▜ ▝ ▞ ▟
                    this.blockCharacters = [
                        '&#x2591;','&#x2592;','&#x2593;','&#x2588;',
                        '&#x2596;','&#x2597;','&#x2598;','&#x2599;',
                        '&#x259A;','&#x259B;','&#x259C;','&#x259D;',
                        '&#x259E;','&#x259F;'
                    ];

                    if(this.mixBlockCharacters){
                        this.chars = this.chars.concat(this.blockCharacters);
                    }

                    //if DOM
                    if(typeof holder !== "undefined"){
                        this.holder = holder;
                    }

                    this.getRandCharacter = function(charToReplace){
                        if(charToReplace === " "){
                            return ' ';
                        }
                        var randNum = Math.floor(Math.random() * this.chars.length);
                        var lowChoice =  -.5 + Math.random();
                        var pickedChar = this.chars[randNum];
                        var chosen = pickedChar.toLowerCase();
                        if(this.mixCapital){
                            chosen = lowChoice < 0 ? pickedChar.toLowerCase() : pickedChar;
                        }
                        return chosen;
                    };

                    this.writeWord = function(word){
                        this.word = word;
                        this.currentWord = word.split('');
                        this.currentWordLength = this.currentWord.length;

                    };

                    this.generateSingleCharacter = function (color,character) {
                        var span = document.createElement('span');
                        span.style.color = color;
                        span.innerHTML = character;
                        return span;
                    };

                    this.updateCharacter = function (time) {

                        this.now = Date.now();
                        this.delta = this.now - this.then - 20;

                        if (this.delta > this.interval) {
                            this.currentTimeOffset++;

                            var word = [];

                            if(this.currentTimeOffset === this.timeOffset && this.currentCharacter !== this.currentWordLength){
                                this.currentCharacter++;
                                this.currentTimeOffset = 0;
                            }
                            for(var x=0;x<this.currentCharacter;x++){
                                word.push(this.currentWord[x]);
                            }

                            for(var x=0;x<this.currentWordLength - this.currentCharacter;x++){
                                word.push(this.getRandCharacter(this.currentWord[this.currentCharacter+x]));
                            }

                            if(that.currentCharacter === that.currentWordLength){
                                that.needUpdate = false;
                            }
                            this.holder.innerHTML = '';
                            word.forEach(function (w,index) {
                                var color = null
                                if(index > that.currentCharacter){
                                    color = that.textColor;
                                }
                                that.holder.appendChild(that.generateSingleCharacter(color, w));
                            });
                            this.then = this.now - (this.delta % this.interval);
                        }
                    };

                    this.restart = function () {
                        this.currentCharacter = 0;
                        this.needUpdate = true;
                    };

                    function update(time) {
                        time++;
                        if(that.needUpdate){
                            that.updateCharacter(time);
                        }
                        requestAnimationFrame(update);
                    }

                    this.writeWord(this.holder.innerHTML);
                    update(time);
                }

                var scrambledText_1 = document.getElementById('scrumble_1');
                var scrambledText_2 = document.getElementById('scrumble_2');
                var scrambledText_3 = document.getElementById('scrumble_3');

                var descrambledText_1 = new Descramble(scrambledText_1,{
                    timeOffset         : 10,
                    mixCapital         : true,
                    mixBlockCharacters : false
                });
                var descrambledText_2 = new Descramble(scrambledText_2,{
                    timeOffset         : 10,
                    mixCapital         : true,
                    mixBlockCharacters : false
                });
                var descrambledText_3 = new Descramble(scrambledText_3,{
                    timeOffset         : 10,
                    mixCapital         : true,
                    mixBlockCharacters : false
                });
            } catch (e) {
                console.log(e.message);
            }
        })();
        // ================= !Scramble ================= //

        // ================= Background Stars =============== //
        (function () {
            // if($(window).width() >= 768) {
            if(1) {
                try {
                    function fn() {
                        window.requestAnimFrame = (function () {
                            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                                window.setTimeout(callback, 1000 / 60);
                            }
                        })();
                        var canvas     = document.getElementById('canvas'), ctx = canvas.getContext('2d'), w = canvas.width = window.innerWidth, h = canvas.height = window.innerHeight, hue = 217, stars = [], count = 0, maxStars = 1200; // 353
                        var canvas2    = document.createElement('canvas'), ctx2 = canvas2.getContext('2d');
                        canvas2.width  = 100;
                        canvas2.height = 100;
                        var half = canvas2.width / 2, gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
                        gradient2.addColorStop(0.025, '#fff');
                        gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
                        gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
                        gradient2.addColorStop(1, 'transparent');
                        ctx2.fillStyle = gradient2;
                        ctx2.beginPath();
                        ctx2.arc(half, half, half, 0, Math.PI * 2);
                        ctx2.fill();
                        function random(min, max) {
                            if (arguments.length < 2) {
                                max = min;
                                min = 0
                            }
                            if (min > max) {
                                var hold = max;
                                max = min;
                                min = hold
                            }
                            return Math.floor(Math.random() * (max - min + 1)) + min
                        }

                        function maxOrbit(x, y) {
                            var max = Math.max(x, y), diameter = Math.round(Math.sqrt(max * max + max * max));
                            return diameter / 2
                        }

                        var Star = function () {
                            this.orbitRadius = random(maxOrbit(w, h));
                            this.radius      = random(60, this.orbitRadius) / 12;
                            this.orbitX      = w / 2;
                            this.orbitY      = h / 2;
                            this.timePassed  = random(0, maxStars);
                            this.speed       = random(this.orbitRadius) / 900000;
                            this.alpha       = random(2, 10) / 10;
                            count++;
                            stars[count] = this
                        };
                        Star.prototype.draw = function () {
                            var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX, y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY, twinkle = random(10);
                            if (twinkle === 1 && this.alpha > 0) {
                                this.alpha -= 0.05
                            } else if (twinkle === 2 && this.alpha < 1) {
                                this.alpha += 0.05
                            }
                            ctx.globalAlpha = this.alpha;
                            ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
                            this.timePassed += this.speed
                        };
                        for (var i = 0; i < maxStars; i++) {
                            new Star()
                        }
                        function animation() {
                            ctx.globalCompositeOperation = 'source-over';
                            ctx.globalAlpha = 0.8;
                            ctx.fillStyle = '#000';
                            ctx.fillRect(0, 0, w, h);
                            ctx.globalCompositeOperation = 'lighter';
                            for (var i = 1, l = stars.length; i < l; i++) {
                                stars[i].draw()
                            }

                            window.requestAnimationFrame(animation)
                        }

                        animation();
                    }
                    fn();
                } catch (e) {
                    console.log(e.message);
                }
            }
        })();
        // ================= !Background Stars =============== //

        // ================= Popup Button ================== //
        (function () {
            try {
                $('.popup-open').on('click', function (e) {
                    e.preventDefault();
                    var instance = $('body');
                    var popup_id = $(this).data('popup');

                    $('.popup-open').each(function () {
                        instance.removeClass('popup-active-' + $(this).data('popup'));
                    });

                    instance.removeClass('popup-active');
                    instance.addClass('popup-active ' + 'popup-active-'+ popup_id);
                });
                $('.popup-close').on('click', function (e) {
                    e.preventDefault();

                    var instance = $('body');

                    $('.popup-open').each(function () {
                        instance.removeClass('popup-active-'+$(this).data('popup'));
                    });

                    instance.removeClass('popup-active');
                });
            } catch (e) {
                console.log(e.message);
            }
        })();
        // ================= !Popup Button ================== //

        // ================= Other ==================== //
        (function () {
            try {
                $('.tel').mask("+38(999)999-99-99", {placeholder:" "});

                $('#logo-inner, .hamburger').on('click', function () {
                    $('body').addClass('bars-open');
                });

                $('.cross-l, .cross-r').on('click', function () {
                    $('body').removeClass('bars-open');
                });

                $('.price-tab-link').on('click', function (e) {
                    e.preventDefault();

                    $('.price-tab-link').removeClass('price-tab-link--active');
                    $('.price-tab').removeClass('price-tab--active');

                    var tab_id = $(this).data('tab');
                    $(this).addClass('price-tab-link--active');
                    $(tab_id).addClass('price-tab--active price-row--wb');

                });
            } catch (e) {
                console.log(e.message);
            }
        })();
        // ================= !Other ==================== //
    });

    // $(window).on('load', function () {
    //     $('.pre-loader-wrapper').fadeOut();
    // });

});