/**
 * @fileoverview 轮播组件 - 定时切换模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY, DOM)
{
    /**
     * 配置参数:
     * {
     *     ...
     *     switchInterval: 0,  // 切换间隔时间（单位：秒，全局设置）
     *     reverse: false,  // 是否反向切换（默认：false，顺序切换）
     *     hoverPause: true,  // 鼠标移动到切片上时，是否停止切换
     *     slices:  // 切片列表
     *     [
     *         {
     *             switchInterval: 0,  // 每个切片的切换间隔时间（覆盖全局设置）
     *             ...
     *         },
     *         ...
     *     ]
     * }
     * 事件
     * switchnext  // 切换到下个切片时触发
     * switchprevious  // 切换到上个切片时触发
     */
    var AutoSwitch = function()
    {
    };

    // 属性
    AutoSwitch.ATTRS =
    {
        switchInterval:  // 切换间隔时间（单位：秒）
        {
            value: 0,
            setter: function(value)
            {
                value = Number(value);
                return isNaN(value) || value <= 0 ? undefined : value;
            }
        },
        hoverPause:  // 鼠标移到切片上时，是否停止切换
        {
            value: true,  // 默认停止切换
            setter: function(value)
            {
                return Boolean(value);
            }
        },
        reverse:  // 是否反向切换
        {
            value: false,  // 默认顺序
            setter: function(value)
            {
                return Boolean(value);
            }
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数
     */
    AutoSwitch._domTransformer = function(config, node, param)
    {
        var value = DOM.attr(node, "switchInterval");
        if (value > 0)  // 切换间隔时间（单位：秒）
        {
            config.switchInterval = value;
        }
        if (value = DOM.attr(node, "hoverPause"))  // 鼠标移到切片上时，是否停止切换
        {
            config.hoverPause = value;
        }
    };

    AutoSwitch.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        init: function(config)
        {
            this.on("afterswitch", this.resumeAutoSwitch);  // 切换后，继续自动切换
            if (this.get("hoverPause"))  // 鼠标移到切片上时，是否停止切换
            {
                this.bindSliceEvent("mouseover", this.pauseAutoSwitch, this);  // 暂停切换
                this.bindSliceEvent("mouseout", this.resumeAutoSwitch, this);  // 继续切换
            }
            this.bindEventConfiguration(["switchnext", "switchprevious"], config);  // 绑定初始化事件配置
        },

        /**
         * 自动切换是否已启动
         * @public
         * @returns {Boolean} 是否启动
         */
        isAutoSwitchStarted: function()
        {
            return this._autoSwitchEnabled;
        },

        /**
         * 启动定时切换
         * @public
         * @param switchInterval 切换间隔时间
         */
        startAutoSwitch: function(switchInterval)
        {
            if (switchInterval > 0)
            {
                this.set("switchInterval", switchInterval);
            }
            else  // 使用默认时间
            {
                switchInterval = this.get("switchInterval");
            }
            var handler = this.switchTimerHandler, self = this;
            if (! handler)
            {
                handler = this.switchTimerHandler = function()  // 定时切换任务
                {
                    var reverse = self.get("reverse");
                    if (self.fire(reverse ? "switchprevious" : "switchnext") !== false)  // 触发向前/向后切换事件
                    {
                        self[reverse ? "switchPrevious" : "switchNext"].call(self);  // 切换到下一切片
                    }
                };
            }
            this._startSwitchTimer();  // 启动切换定时器
            this._autoSwitchEnabled = true;  // 启用定时切换
        },

        /**
         * 启动切换定时器
         * @private
         */
        _startSwitchTimer: function()
        {
            this._stopSwitchTimer();  // 停止切换定时器
            var sliceActived = this.getActiveSlice(), switchInterval;
            if (sliceActived)
            {
                switchInterval = sliceActived.get("switchInterval");  // 切片的切换间隔
            }
            switchInterval = switchInterval || this.get("switchInterval");
            if (switchInterval > 0)
            {
                this.switchTimer = setTimeout(this.switchTimerHandler, switchInterval * 1000);  // 定时调用
            }
        },

        /**
         * 停止切换定时器
         * @private
         */
        _stopSwitchTimer: function()
        {
            clearTimeout(this.switchTimer);
        },

        /**
         * 切换到下一切片
         * @public
         */
        switchNext: function()
        {
            var slice = this.nextSlice(true);  // 循环取切片
            if (slice)
            {
                slice.activate();  // 激活下一切片
            }
        },

        /**
         * 切换到上一切片
         * @public
         */
        switchPrevious: function()
        {
            var slice = this.previousSlice(true);  // 循环取切片
            if (slice)
            {
                slice.activate();  // 激活上一切片
            }
        },

        /**
         * 暂停定时切换（如果之后切换到其它切片，则定时切换会自动启动）
         * @public
         */
        pauseAutoSwitch: function()
        {
            this._stopSwitchTimer();  // 停止切换定时器
        },

        /**
         * 继续定时切换
         * @public
         */
        resumeAutoSwitch: function()
        {
            if (this._autoSwitchEnabled)  // 启用定时切换
            {
                this._startSwitchTimer();  // 启动切换定时器
            }
        },

        /**
         * 停止定时切换
         * @public
         */
        stopAutoSwitch: function()
        {
            this._stopSwitchTimer();  // 停止切换定时器
            this._autoSwitchEnabled = false;  // 禁用定时切换
        }
    };

    /**
     * 轮播组件 - 切片定时切换
     */
    var SliceAutoSwitch = AutoSwitch.CHILD_WIDGET = function()
    {
    };
    
    // 属性
    SliceAutoSwitch.ATTRS =
    {
        switchInterval:  // 切换间隔时间（单位：秒）
        {
            setter: function(value)
            {
                value = Number(value);
                return isNaN(value) || value <= 0 ? undefined : value;
            }
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数
     */
    SliceAutoSwitch._domTransformer = function(config, node, param)
    {
        var value = DOM.attr(node, "switchInterval");
        if (value > 0)  // 切换间隔时间（单位：秒）
        {
            config.switchInterval = value;
        }
    };
    return AutoSwitch;
},
{
    requires: ["dom"]
});
