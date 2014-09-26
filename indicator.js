/**
 * @fileoverview 轮播组件 - 切换指示器模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY, DOM, Event)
{
    /**
     * 配置参数:
     * {
     *     ...
     *     activeIndicatorStyle: "",  // 当前激活的指示节点样式（选择符）
     *     inactiveIndicatorStyle: "",  // 闲置的指示节点样式（选择符）
     *     slices:  // 切片列表
     *     [
     *         {
     *             ...
     *             indicatorNode: HTMLNode,  // 指示器节点
     *             activeIndicatorStyle: "",  // 当前激活的指示节点样式（选择符）
     *             inactiveIndicatorStyle: "",  // 闲置的指示节点样式（选择符）
     *         },
     *         ...
     *     ]
     * }
     */
    var Indicator = function()
    {
    };

    // 属性
    Indicator.ATTRS =
    {
        activeIndicatorStyle:  // 当前激活的指示节点样式（选择符）
        {
            value: "",
            validator: KISSY.isString
        },
        inactiveIndicatorStyle:  // 未激活的指示节点样式（选择符）
        {
            value: "",
            validator: KISSY.isString
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数
     */
    Indicator._domTransformer = function(config, node, param)
    {
        var value;
        if (value = DOM.attr(node, "activeIndicatorStyle"))  // 当前激活的指示节点样式（选择符）
        {
            config.activeIndicatorStyle = value;
        }
        if (value = DOM.attr(node, "inactiveIndicatorStyle"))  // 未激活的指示节点样式（选择符）
        {
            config.inactiveIndicatorStyle = value;
        }
    };

    Indicator.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            this.on("afterswitch", this._switchIndicator);  // 切换后，激活指示器
        },

        /**
         * 绑定指示器DOM事件
         * @public
         * @param name
         * @param listener
         * @param context 上下文（可选，默认：window）
         */
        bindIndicatorEvent: function(name, listener, context)
        {
            if (name && listener)
            {
                var slices = this.get("slices"), i = slices.length;
                for (; -- i > -1;)
                {
                    slices[i].bindIndicatorEvent(name, listener, context);
                }
            }
        },
        
        /**
         * 切换指示器
         * @private
         * @param e 事件
         */
        _switchIndicator: function(e)
        {
            var sliceInactived = e.sliceInactived, sliceActived = e.slice;  // 闲置的切片
            if (sliceInactived == sliceActived)  // 闲置切片=激活切片时，为首次切换，不进行闲置
            {
                sliceInactived = null;
            }
            if (sliceInactived)
            {
                sliceInactived._deactivateIndicator(sliceActived);  // 闲置指示器
            }
            if (sliceActived)  // 激活的切片
            {
                sliceActived._activateIndicator(sliceInactived);  // 激活指示器
            }
        }
    };

    /**
     * 轮播组件 - 切片指示器
     * 事件:
     * activeindicatorstyledisplay  // 显示指示器激活样式前触发
     * inactiveindicatorstyledisplay  // 显示指示器闲置样式前触发
     */
    var SliceIndicator = Indicator.CHILD_WIDGET = function()
    {
    };

    // 属性
    SliceIndicator.ATTRS =
    {
        indicatorNode:  // 指示节点
        {
            setter: function(value)
            {
                var node = DOM.get(value);
                return node ? node : undefined;
            }
        },
        activeIndicatorStyle:  // 当前激活的指示节点样式（选择符）
        {
            validator: KISSY.isString
        },
        inactiveIndicatorStyle:  // 未激活的指示节点样式（选择符）
        {
            validator: KISSY.isString
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数（{indicatorSelector: 指示器节点选择符，默认：".slice-indicator", index: 切片索引, nodeContainer: 切换组件容器节点}）
     */
    SliceIndicator._domTransformer = function(config, node, param)
    {
        param = param || {};
        var nodeContainer = param.nodeContainer, value;
        if (nodeContainer && (value = DOM.query(param.indicatorSelector || ".slice-indicator", nodeContainer)[param.index]))  // 指示节点
        {
            config.indicatorNode = value;
        }
        if (value = DOM.attr(node, "activeIndicatorStyle"))  // 当前激活的指示节点样式（选择符）
        {
            config.activeIndicatorStyle = value;
        }
        if (value = DOM.attr(node, "inactiveIndicatorStyle"))  // 未激活的指示节点样式（选择符）
        {
            config.inactiveIndicatorStyle = value;
        }
    };

    SliceIndicator.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            this.bindEventConfiguration(["activeindicatorstyledisplay", "inactiveindicatorstyledisplay"], config);  // 绑定初始化事件配置
        },

        /**
         * 绑定指示器DOM事件
         * @public
         * @param name 事件名称
         * @param listener 事件监听器
         * @param context 上下文（可选，默认：window）
         */
        bindIndicatorEvent: function(name, listener, context)
        {
            var indicatorNode = this.get("indicatorNode"), self = this;
            if (indicatorNode && name && listener)  // 切片节点
            {
                context = context || window;
                // 绑定事件
                Event.on(indicatorNode, name, function(e)
                {
                    listener.call(context, e, self._parent, self);
                });
            }
        },

        /**
         * 激活指示器
         * @private
         * @param inactiveSlice 被闲置的切片
         */
        _activateIndicator: function(inactiveSlice)
        {
            if (this.fire("activeindicatorstyledisplay", {sliceInactived: inactiveSlice}) !== false)  // 触发显示激活样式事件
            {
                this.displayActiveIndicatorStyle();  // 设置指示器激活样式
            }
        },

        /**
         * 设置指示器激活样式
         * @public
         */
        displayActiveIndicatorStyle: function()
        {
            var indicatorNode = this.get("indicatorNode"), _parent = this._parent, activeIndicatorStyle = this.get("activeIndicatorStyle") || (_parent ? _parent.get("activeIndicatorStyle") : ""), inactiveIndicatorStyle = this.get("inactiveIndicatorStyle") || (_parent ? _parent.get("inactiveIndicatorStyle") : "");
            if (indicatorNode)
            {
                DOM.replaceClass(indicatorNode, inactiveIndicatorStyle, activeIndicatorStyle);
            }
        },

        /**
         * 闲置指示器
         * @private
         * @param activeSlice 被激活的切片（可选）
         */
        _deactivateIndicator: function(activeSlice)
        {
            if (this.fire("inactiveindicatorstyledisplay", {sliceActived: activeSlice}) !== false)  // 触发显示闲置样式事件
            {
                this.displayInactiveIndicatorStyle();  // 设置指示器闲置样式
            }
        },

        /**
         * 设置指示器闲置样式
         * @public
         */
        displayInactiveIndicatorStyle: function()
        {
            var indicatorNode = this.get("indicatorNode"), _parent = this._parent, activeIndicatorStyle = this.get("activeIndicatorStyle") || (_parent ? _parent.get("activeIndicatorStyle") : ""), inactiveIndicatorStyle = this.get("inactiveIndicatorStyle") || (_parent ? _parent.get("inactiveIndicatorStyle") : "");
            if (indicatorNode)
            {
                DOM.replaceClass(indicatorNode, activeIndicatorStyle, inactiveIndicatorStyle);
            }
        },
        
        /**
         * 删除指示器
         * @public
         */
        removeIndicator: function()
        {
            var indicatorNode = this.get("indicatorNode");
            if (indicatorNode)
            {
                DOM.remove(indicatorNode);
            }
        }
    };
    return Indicator;
},
{
    requires: ["dom", "event"]
});
