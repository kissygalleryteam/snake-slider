/**
 * @ignore  =====================================================================================
 * @fileoverview vc-slider组件
 * @author  yangren.ry@taobao.com
 * @version 1.0.0
 * @ignore  created in 2015-01-20
 * @ignore  =====================================================================================
 */
var $ = require('node').all;
var Base = require('base');
var DD = require('dd');

var Util = {
    typeOf: function (value) {
        return toString.apply(value).replace(/^\[\w*\s*|\]$/ig, '');
    },
    isPercent: function (value) {
        return /^\d{1,3}%$/.test(value);
    },
    emptyEventFunc: function (e) { }
};

(function draggableDelegate() {
    var DDM = DD.DDM;
    var _left;
    var _right;
    var _top;
    var _bottom;
    var self = null;
    var $slider = null;
    var $slider_handle = null;
    var slider_width;
    var slider_height;
    var track_width;
    var track_height;
    var handle_width;
    var handle_height;
    var slider_offsetLeft;
    var slider_offsetTop;
    var readOnly;
    var disabled;
    var orientation;
    var type;
    var step;
    var min;
    var max;

    var g;
    var d;
    var s;
    var l;
    var r;
    var t;
    var b;

    DDM.on('dragstart', function (e) {
        e.halt();
        $slider_handle = e.drag.get('node');
        self = $slider_handle.__self__;
        $slider = self.$slider;
        readOnly = self.readOnly_;
        disabled = self.disabled_;
        if (readOnly || disabled) return;
        orientation = self.orientation_;
        slider_width = self.$slider.outerWidth();
        slider_height = self.$slider.outerHeight();
        track_width = self.$slider_track.outerWidth();
        track_height = self.$slider_track.outerHeight();
        handle_width = $slider_handle.outerWidth();
        handle_height = $slider_handle.outerHeight();
        slider_offsetLeft = self.$slider.offset().left;
        slider_offsetTop = self.$slider.offset().top;
        type = self.type_;
        step = self.step_;
        min = self.min_;
        max = self.max_;

        //触发start事件
        self.fire('start');
    }).on('drag', function (e) {
        if (readOnly || disabled) return;
        e.halt();
        _left = parseInt(e.pageX - slider_offsetLeft - handle_width / 2);
        _right = track_width - _left;
        _top = parseInt(e.pageY - slider_offsetTop - handle_height / 2);
        _bottom = track_height - _top;

        switch (orientation) {
            case 'horizontal':
                if (step === 0) {
                    switch (type) {
                        case 'value':
                        case 'min':
                            self._pos(_left);
                            break;
                        case 'max':
                            self._pos(_right);
                            break;
                    }
                } else {
                    g = Math.abs((max - min) / track_width);
                    d = Math.abs(min / g);
                    s = parseInt(step / g + d);
                    switch (type) {
                        case 'value':
                        case 'min':
                            l = parseInt($slider_handle.css('left'));
                            if (_left < l - s) {
                                self._pos(l - s);
                            }
                            if (_left > l + s) {
                                self._pos(l + s);
                            }
                            break;
                        case 'max':
                            r = parseInt($slider_handle.css('right'));
                            if (_right < r - s) {
                                self._pos(r - s);
                            }
                            if (_right > r + s) {
                                self._pos(r + s);
                            }
                            break;
                    }
                }
                break;
            case 'vertical':
                if (step === 0) {
                    switch (type) {
                        case 'value':
                        case 'min':
                            self._pos(_bottom);
                            break;
                        case 'max':
                            self._pos(_top);
                            break;
                    }
                } else {
                    g = Math.abs((max - min) / track_height);
                    d = Math.abs(min / g);
                    s = parseInt(step / g + d);
                    switch (type) {
                        case 'value':
                        case 'min':
                            b = parseInt($slider_handle.css('bottom'));
                            if (_bottom < b - s) {
                                self._pos(b - s);
                            }
                            if (_bottom > b + s) {
                                self._pos(b + s);
                            }
                            break;
                        case 'max':
                            t = parseInt($slider_handle.css('top'));
                            if (_top < t - s) {
                                self._pos(t - s);
                            }
                            if (_top > t + s) {
                                self._pos(t + s);
                            }
                            break;
                    }
                }
                break;
        }

        //触发slide事件
        self.fire('slide');

    }).on('dragend', function (e) {
        if (readOnly || disabled) return;
        e.halt();
        //触发stop事件
        self.fire('stop');

        self = $slider = $slider_handle = null;
    });
})();

var Slider = Base.extend({
    initializer: function () {
        var self = this;
        // 配置
        var selector = self.selector_ = self.get('selector');
        var cssClass = self.cssClass_ = self.get('cssClass');
        var orientation = self.orientation_ = self.get('orientation');
        var min = self.min_ = self.get('min');
        var max = self.max_ = self.get('max');
        var value = self.value_ = self.get('value');
        var type = self.type_ = self.get('type');
        var step = self.step_ = Math.abs(self.get('step'));
        var animate = self.animate_ = self.get('animate');
        var readOnly = self.readOnly_ = self.get('readOnly');
        var disabled = self.disabled_ = self.get('disabled');
        var hidden = self.hidden_ = false;
        // 事件
        var slide = self.slide_ = self.get('slide') || Util.emptyEventFunc;
        var start = self.start_ = self.get('start') || Util.emptyEventFunc;
        var stop = self.stop_ = self.get('stop') || Util.emptyEventFunc;
        var change = self.change_ = self.get('change') || Util.emptyEventFunc;
        var create = self.create_ = self.get('create') || Util.emptyEventFunc;
        var destroy = self.destroy_ = self.get('destroy') || Util.emptyEventFunc;

        // 对象
        var $slider = self.$slider = self.get('$target');
        var $slider_handle = self.$slider_handle = $(selector.handle, self.$slider);
        self.$slider_handle.__self__ = self;
        var $slider_track = self.$slider_track = $(selector.track, self.$slider);
        var $slider_range = self.$slider_range = $(selector.range, self.$slider);

        switch (orientation) {
            case 'horizontal':
                $slider.addClass(cssClass.horizontal);
                switch (type) {
                    case 'value':
                        $slider.addClass(cssClass.horizontal_value);
                        break;
                    case 'min':
                        $slider.addClass(cssClass.horizontal_min);
                        break;
                    case 'max':
                        $slider.addClass(cssClass.horizontal_max);
                        break;
                }
                break;
            case 'vertical':
                $slider.addClass(cssClass.vertical);
                switch (type) {
                    case 'value':
                        $slider.addClass(cssClass.vertical_value);
                        break;
                    case 'min':
                        $slider.addClass(cssClass.vertical_min);
                        break;
                    case 'max':
                        $slider.addClass(cssClass.vertical_max);
                        break;
                }
                break;
        }

        self.percent_ = parseInt(value / (max - min) * 100);

        // 组件交互初始化
        (function init(self) {
            new DD.Draggable({
                node: $slider_handle,
                move: false
            });
            var keyHandle = function (self, key) {
                var value = self.value_;
                var min = self.min_;
                var max = self.max_;
                var step = self.step_ > 0 ? self.step_ : 1;
                var type = self.type_;
                switch (key) {
                    case 37:
                    case 40:
                        switch (type) {
                            case 'value':
                            case 'min':
                                if (value > min) {
                                    value = value - step;
                                }
                                break;
                            case 'max':
                                if (value < max) {
                                    value = value + step;
                                }
                                break;
                        }
                        break
                    case 38:
                    case 39:
                        switch (type) {
                            case 'value':
                            case 'min':
                                if (value < max) {
                                    value = value + step;
                                }
                                break;
                            case 'max':
                                if (value > min) {
                                    value = value - step;
                                }
                                break;
                        }
                        break;
                }
                return value;
            };
            $slider.on('keydown', function (e) {
                var readOnly = self.readOnly_;
                var disabled = self.disabled_;
                if (readOnly || disabled) return;
                var key = e.which;
                var orientation = self.orientation_;
                switch (key) {
                    case 37:
                        // left
                        if (orientation === 'horizontal') {
                            self.value_ = keyHandle(self, key);
                        }
                        break;
                    case 38:
                        // up
                        if (orientation === 'vertical') {
                            self.value_ = keyHandle(self, key);
                        }
                        break;
                    case 39:
                        // right
                        if (orientation === 'horizontal') {
                            self.value_ = keyHandle(self, key);
                        }
                        break;
                    case 40:
                        // down
                        if (orientation === 'vertical') {
                            self.value_ = keyHandle(self, key);
                        }
                        break;
                }
                self._value(self.value_);
            });
            self._accessible();
            self._value(value);
            self._disabled(disabled);
        })(self);

        self.on('create', function (e) {
            e.halt();
            create.call(this, e);
        }).on('start', function (e) {
            e.halt();
            start.call(this, e);
        }).on('slide', function (e) {
            e.halt();
            slide.call(this, e);
        }).on('stop', function (e) {
            e.halt();
            stop.call(this, e);
        }).on('change', function (e) {
            e.halt();
            change.call(this, e);
        }).on('destroy', function (e) {
            e.halt();
            destroy.call(this, e);
        });

        //触发create事件
        self.fire('create');

    },
    _accessible: function (scope) {
        var self = this;
        var $slider = self.$slider;
        var $slider_handle = self.$slider_handle;
        var readOnly = self.readOnly_;
        var disabled = self.disabled_;
        var step = self.step_;
        var hidden = self.hidden_;
        if (scope === undefined) {
            // 无障碍属性
            $slider.attr({
                'role': 'slider',
//                'tabindex': 0,
                'aria-readOnly': readOnly,
                'aria-disabled': disabled,
                'aria-step': step,
                'aria-hidden': hidden
            });
            $slider_handle.attr('tabindex', 1);
            return;
        }
        var min = self.min_;
        var max = self.max_;
        var percent = self.percent_;
        var value = self.value_;

        if (percent >= 0 && percent <= 100) {

            // 无障碍属性
            switch (scope) {
                case 'value':
                    $slider.attr({
                        'aria-valuemin': min,
                        'aria-valuemax': max,
                        'aria-valuenow': value,
                        'aria-valuetext': value,
                        'data-percent': percent
                    });
                    break;
                case 'readOnly':
                    $slider.attr({
                        'aria-readOnly': readOnly
                    });
                    break;
                case 'disabled':
                    $slider.attr({
                        'aria-disabled': disabled
                    });
                    break;
                case 'step':
                    $slider.attr({
                        'aria-step': step
                    });
                    break;
                case 'hidden':
                    $slider.attr({
                        'aria-hidden': hidden
                    });
                    break;
            }
        }
    },
    _step: function (step) {
        var self = this;
        if (Util.typeOf(step) !== 'Number') return;
        self.step_ = Math.abs(step);
        self._accessible('step');
    },
    _readOnly: function (value) {
        var self = this;
        switch (value) {
            case true:
                self.readOnly_ = true;
                break;
            case false:
                self.readOnly_ = false;
                break;
        }
        self._accessible('readOnly');
    },
    _disabled: function (value) {
        var self = this;
        var $slider = self.$slider;
        var cssClass = self.cssClass_;
        switch (value) {
            case true:
                $slider.addClass(cssClass.disabled);
                self.disabled_ = true;
                break;
            case false:
                $slider.removeClass(cssClass.disabled);
                self.disabled_ = false;
                break;
        }
        self._accessible('disabled');
    },
    _pos: function (pos) {
        var self = this;
        var orientation = self.orientation_;
        var type = self.type_;
        var $slider = self.$slider;
        var $slider_handle = self.$slider_handle;
        var $slider_range = self.$slider_range;
        var max = self.max_;
        var min = self.min_;

        var g;
        var d;

        var direction;
        var track;
        var scope;
        var diff;

        switch (orientation) {
            case 'horizontal':
                track = self.$slider_track.outerWidth();
                scope = 'width';
                diff = $slider.outerWidth() - $slider_handle.outerWidth();
                switch (type) {
                    case 'value':
                    case 'min':
                        direction = 'left';
                        break;
                    case 'max':
                        direction = 'right';
                        break;
                }
                break;
            case 'vertical':
                track = self.$slider_track.outerHeight();
                scope = 'height';
                diff = $slider.outerHeight() - $slider_handle.outerHeight();
                switch (type) {
                    case 'value':
                    case 'min':
                        direction = 'bottom';
                        break;
                    case 'max':
                        direction = 'top';
                        break;
                }
                break;
        }

        g = Math.abs((max - min) / track);
        d = Math.abs(min / g);
        $slider_handle.css(direction, pos);
        $slider_range.css(scope, pos);
        self.percent_ = parseInt(pos / track * 100);
        self.value_ = parseInt((pos - d) * g);

        self._accessible('value');

        if (pos < 0) {
            self._pos(0);
        }
        if (pos > diff) {
            self._pos(diff);
        }
    },
    _value: function (value) {
        var self = this;
        var percent;
        var track_width = self.$slider_track.outerWidth();
        var track_height = self.$slider_track.outerHeight();
        var orientation = self.orientation_;
        var type = self.type_;
        var $slider_handle = self.$slider_handle;
        var $slider_range = self.$slider_range;
        var max = self.max_;
        var min = self.min_;
        var typeOfValue;

        var g;
        var d;
        var pos;

        var direction;
        var track;
        var scope;

        switch (true) {
            case Util.typeOf(value) === 'String':
                if (Util.isPercent(value)) {
                    percent = parseInt(value.split('%')[0]);
                    percent = percent > 100 ? 100 : percent;
                    typeOfValue = 1;
                } else return;
                break;
            case Util.typeOf(value) === 'Number':
                if (value < min) value = min;
                if (value > max) value = max;
                typeOfValue = 0;
                break;
            case Util.typeOf(value) === 'Array':
                typeOfValue = 2;
                break;
        }

        switch (orientation) {
            case 'horizontal':
                track = track_width;
                scope = 'width';
                switch (type) {
                    case 'value':
                    case 'min':
                        direction = 'left';
                        break;
                    case 'max':
                        direction = 'right';
                        break;
                }
                break;
            case 'vertical':
                track = track_height;
                scope = 'height';
                switch (type) {
                    case 'value':
                    case 'min':
                        direction = 'bottom';
                        break;
                    case 'max':
                        direction = 'top';
                        break;
                }
                break;
        }

        g = Math.abs((max - min) / track);
        d = Math.abs(min / g);

        switch (typeOfValue) {
            case 0:
                pos = parseInt(value / g + d);
                self.value_ = value;
                self.percent_ = parseInt(pos / track * 100);
                break;
            case 1:
                pos = percent / 100 * track;
                self.value_ = parseInt((pos - d) * g);
                self.percent_ = percent;
                break;
            case 2:
                break;
        }

        $slider_handle.css(direction, pos);
        $slider_range.css(scope, pos);

        self._accessible('value');

        //触发change事件
        self.fire('change');
    },
    hide: function () {
        var self = this;
        self.hidden_ = true;
        self._accessible('hidden');
        self.$slider.hide();
    },
    show: function () {
        var self = this;
        self.hidden_ = false;
        self._accessible('hidden');
        self.$slider.show();
    },
    setter: function (prop, value) {
        var self = this;
        switch (prop) {
            case 'value':
                if (self.readOnly_) return;
                self._value(value);
                break;
            case 'readOnly':
                self._readOnly(value);
                break;
            case 'disabled':
                self._disabled(value);
                break;
            case 'step':
                self._step(value);
                break;
        }
    },
    getter: function (prop) {
        var self = this;
        var result;
        switch (prop) {
            case 'value':
                result = self.value_;
                break;
            case 'readOnly':
                result = self.readOnly_;
                break;
            case 'disabled':
                result = self.disabled_;
                break;
        }
        return result;
    },
    destroy: function () {
        var self = this;
        var $slider = self.$slider;
        self.fire('destroy');

        // 删除DOM节点
        $slider.remove();
        // 深度清空
        for (var p in self) {
            if (self.hasOwnProperty(p)) {
                delete self[p];
            }
        }
        self.__proto__ = null;
    }
},{
    ATTRS:{
        $target: {
            value: '',
            getter: function (v) {
                return $(v);
            }
        },
        selector: {
            value: {
                handle: '.vc-slider-handle',
                track: '.vc-slider-track',
                range: '.vc-slider-range'
            }
        },
        cssClass: {
            value: {
                horizontal_value: 'vc-slider-horizontal-value',
                horizontal_min: 'vc-slider-horizontal-min',
                horizontal_max: 'vc-slider-horizontal-max',
                horizontal: 'vc-slider-horizontal',
                vertical_value: 'vc-slider-vertical-value',
                vertical_min: 'vc-slider-vertical-min',
                vertical_max: 'vc-slider-vertical-max',
                vertical: 'vc-slider-vertical',
                disabled: 'vc-slider-disabled'
            }
        },
        orientation: {
            value: 'horizontal'
        },
        min: {
            value: 0
        },
        max: {
            value: 100
        },
        value: {
            value: 0
        },
        type: {
            value: 'value'
        },
        step: {
            value: 0
        },
        animate: {
            value: false
        },
        readOnly: {
            value: false
        },
        disabled: {
            value: false
        }
    }
});

module.exports = Slider;




