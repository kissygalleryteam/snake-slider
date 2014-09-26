/**
 * @fileoverview 轮播组件 - 基础切换模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY, DOM, Event, Extensible, DOMTransform, EventConfigurable)
{
    /**
     * 配置参数
     * {
     *     container: HTMLNode,  // 容器节点
     *     activeSliceStyle: "",  // 当前激活的切片样式（选择符）
     *     inactiveSliceStyle: "",  // 未激活的切片样式（选择符）
     *     slices:  // 切片列表
     *     [
     *         {
     *             id: "",  // 切片标识
     *             sliceNode: HTMLNode,  // 切换的节点
     *             actived: false,  // 是否激活
     *             activeSliceStyle: "",  // 当前激活的切片样式（选择符）
     *             inactiveSliceStyle: "",  // 未激活的切片样式（选择符）
     *             data: {},  // 自定义数据
     *         },
     *         ...
     *     ]
     * }
     * 事件:
     * beforeswitch  // 切换前触发
     * afterswitch   // 切换后触发
     */
    var Switching = function()
    {
    };
    KISSY.mix(Switching, Extensible);  // 支持扩展能力
    KISSY.mix(Switching, DOMTransform);  // 支持DOM转换为组件

    // 属性
    Switching.ATTRS =
    {
        container:  // 容器节点
        {
            value: DOM.get("body"),
            setter: function(value)
            {
                var node = DOM.get(value);
                return node ? node : undefined;
            }
        },
        activeSliceStyle:  // 当前激活的切片样式（选择符）
        {
            value: "",
            validator: KISSY.isString
        },
        inactiveSliceStyle:  // 未激活的切片样式（选择符）
        {
            value: "",
            validator: KISSY.isString
        },
        slices:  // 切片列表
        {
            value: [],
            validator: KISSY.isArray
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数（{sliceSelector: 切片节点选择符，默认：".slice"}）
     */
    Switching._domTransformer = function(config, node, param)
    {
        config.container = node;  // 容器节点
        var slices = config.slices = [], value;  // 切片列表
        if (value = DOM.attr(node, "activeSliceStyle"))  // 当前激活的切片样式（选择符）
        {
            config.activeSliceStyle = value;
        }
        if (value = DOM.attr(node, "inactiveSliceStyle"))  // 未激活的切片样式（选择符）
        {
            config.inactiveSliceStyle = value;
        }
        // 解析切片配置参数
        param = param || {};
        var SliceClass = this.CHILD_WIDGET, nodes = DOM.query(param.sliceSelector || ".slice", node), i = 0, size = nodes.length;
        for (; i < size; ++ i)
        {
            slices[i] = SliceClass.dom2config(nodes[i], KISSY.merge(param,
            {
                index: i,  // 切片索引
                nodeContainer: node  // 切换组件容器节点
            }));
        }
    };

    var switchingType = Switching.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            this._sliceMap = {};  // 切片映射 <切片id, Slice>
            this.bindEventConfiguration(["beforeswitch", "afterswitch"], config);  // 绑定初始化事件配置
            var slices = this.get("slices");
            this.set("slices", []);
            this._addSlices(slices);  // 添加多个切片
        },

        /**
         * 绑定切片DOM事件
         * @public
         * @param name 事件名称
         * @param listener 事件监听器
         * @param context 上下文（可选，默认：this）
         */
        bindSliceEvent: function(name, listener, context)
        {
            if (name && listener)
            {
                var slices = this.get("slices"), i = slices.length;
                for (; -- i > -1;)
                {
                    slices[i].bindSliceEvent(name, listener, context);
                }
            }
        },

        /**
         * 切换到指定切片
         * @public
         * @param slice 切片/索引
         */
        switchTo: function(slice)
        {
            slice = typeof slice == "number" ? this.get("slices")[slice] : slice;
            if (slice && ! slice.get("actived") && this.fire("beforeswitch", {slice: slice}) !== false)  // 切片未激活
            {
                this.fire("afterswitch", {sliceInactived: this._switchSlice(slice), slice: slice});  // 切换切片并触发切换后事件
            }
        },

        /**
         * 切换切片
         * @private
         * @param activeSlice 被激活的切片
         * @returns 闲置切片
         */
        _switchSlice: function(activeSlice)
        {
            var inactiveSlice = this._sliceActived;
            if (inactiveSlice == activeSlice)  // 闲置切片=激活切片时，为首次切换，不进行闲置
            {
                inactiveSlice = null;
            }
            if (inactiveSlice)
            {
                inactiveSlice._deactivateSlice(activeSlice);  // 将切片闲置
            }
            this._sliceActived = activeSlice;  // 当前激活的切片索引
            if (activeSlice)
            {
                activeSlice._activateSlice(inactiveSlice);  // 将切片激活
            }
            return inactiveSlice;
        },

        /**
         * 按索引查找切片
         * @public
         * @param index 切片索引
         * @returns 切片
         */
        getSliceByIndex: function(index)
        {
            return this.get("slices")[index];
        },

        /**
         * 按标识查找切片
         * @public
         * @param id 切片标识
         * @returns 切片
         */
        getSliceById: function(id)
        {
            return this._sliceMap[id];
        },

        /**
         * 获取所有切片
         * @public
         * @returns [Slice] 切片列表
         */
        getSlices: function()
        {
            return this.get("slices");
        },
        
        /**
         * 获取当前激活的切片
         * @public
         */
        getActiveSlice: function()
        {
            return this._sliceActived;
        },

        /**
         * 添加多个切片
         * @private
         * @param slices 多个切片
         */
        _addSlices: function(slices)
        {
            if (slices)
            {
                var SliceClass = this.constructor.CHILD_WIDGET, i = 0, size = slices.length, slice;
                for (; i < size; ++ i)
                {
                    slice = slices[i];
                    this._addSlice(slice instanceof SliceClass ? slice : new SliceClass(slice), i);  // 添加切片
                }
            }
        },

        /**
         * 增加切片
         * @private
         * @param slice 切片
         * @param index 插入位置索引
         */
        _addSlice: function(slice, index)
        {
            var slices = this.get("slices"), sliceMap = this._sliceMap, id = slice.get("id"), i = slices.length;
            slices.splice(index, 0, slice);
            // 调整其后所有切片的索引
            while (i > index)
            {
                slices[i].set("index", i --);
            }
            slice._attachToParent(this, index);  // 添加到切换组件
            if (id)
            {
                sliceMap[id] = slice;  // 切片标识映射
            }
            // 只能有一个切片被激活
            if (slice.get("actived"))  // 切片被激活
            {
                if (! this._sliceActived)  // 尚未有切片被激活
                {
                    this._sliceActived = slice;  // 保存激活切片
                }
                slice.set("actived", false);  // 切片状态临时设为闲置，以便后续切换
            }
            else  // 闲置切片
            {
                slice.displayInactiveSliceStyle();  // 显示切片闲置样式
            }
            return slice;
        },

        /**
         * 获取下一切片
         * @public
         * @param recurring 是否循环（如果循环，则最后一个切片的下一个为第一个切片）
         * @returns 切片
         */
        nextSlice: function(recurring)
        {
            var sliceActived = this._sliceActived, slices = this.get("slices"), index = 0;
            if (sliceActived)
            {
                index = sliceActived.get("index") + 1;  // 下一切片索引
                if (recurring)
                {
                    index = index % slices.length;  // 循环索引
                }
            }
            return slices[index];
        },

        /**
         * 获取上一切片
         * @public
         * @param recurring 是否循环（如果循环，则第一个切片的上一个为最后一个切片）
         * @returns 切片
         */
        previousSlice: function(recurring)
        {
            var sliceActived = this._sliceActived, slices = this.get("slices"), index = 0;
            if (sliceActived)
            {
                index = sliceActived.get("index");  // 当前激活切片索引
                index = (! recurring || index > 0 ? index : slices.length) - 1;  // 上一切片索引（区分是否循环索引）
            }
            return slices[index];
        }
    };
    KISSY.mix(switchingType, EventConfigurable);  // 支持事件绑定能力

    /**
     * 轮播组件 - 切片
     * 事件:
     * activeslicestyledisplay  // 显示激活样式前触发
     * inactiveslicestyledisplay  // 显示闲置样式前触发
     */
    var Slice = Switching.CHILD_WIDGET = function()
    {
    };
    KISSY.mix(Slice, DOMTransform);  // 支持DOM转换为组件

    // 属性
    Slice.ATTRS =
    {
        id:  // 切片标识
        {
            validator: KISSY.isString
        },
        sliceNode:  // 切片节点
        {
            setter: function(value)
            {
                var node = DOM.get(value);
                return node ? node : undefined;
            }
        },
        actived:  // 是否被激活
        {
            value: false,
            setter: function(value)
            {
                return Boolean(value);
            }
        },
        activeSliceStyle:  // 当前激活的切片样式（选择符）
        {
            validator: KISSY.isString
        },
        inactiveSliceStyle:  // 未激活的切片样式（选择符）
        {
            validator: KISSY.isString
        },
        data:  // 自定义数据
        {
        },
        index:  // 切片索引位置
        {
            value: -1
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数（{index: 切片索引, nodeContainer: 切换组件容器节点}）
     */
    Slice._domTransformer = function(config, node, param)
    {
        if (node)  // 切片节点
        {
            config.sliceNode = node;
        }
        var value;
        if (value = DOM.attr(node, "id"))  // 切片标识
        {
            config.id = value;
        }
        if (value = DOM.attr(node, "actived"))  // 是否被激活
        {
            config.actived = value;
        }
        if (value = DOM.attr(node, "activeSliceStyle"))  // 当前激活的切片样式（选择符）
        {
            config.activeSliceStyle = value;
        }
        if (value = DOM.attr(node, "inactiveSliceStyle"))  // 未激活的切片样式（选择符）
        {
            config.inactiveSliceStyle = value;
        }
    };

    var sliceType = Slice.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            //console.log("Slice.initializer");
            this.bindEventConfiguration(["activeslicestyledisplay", "inactiveslicestyledisplay"], config);  // 绑定初始化事件配置
        },

        /**
         * 绑定切片DOM事件
         * @public
         * @param name 事件名称
         * @param listener 事件监听器
         * @param context 上下文（可选，默认：this）
         */
        bindSliceEvent: function(name, listener, context)
        {
            var sliceNode = this.get("sliceNode"), self = this;
            if (sliceNode && name && listener)  // 切片节点
            {
                context = context || this;
                // 绑定事件
                Event.on(sliceNode, name, function(e)
                {
                    listener.call(context, e, self._parent, self);
                });
            }
        },

        /**
         * 添加到切换组件
         * @private
         * @param slider 切换组件
         * @param index 索引位置
         */
        _attachToParent: function(slider, index)
        {
            this._parent = slider;  // 轮播组件
            this.set("index", index);  // 索引位置
        },

        /**
         * 从切换组件分离
         */
        _detachFromParent: function()
        {
            var _parent = this._parent, node;
            if (_parent)
            {
                this._parent = null;
            }
            this.set("index", -1);  // 索引位置设为无效
            if (node = this.get("sliceNode"))  // 删除切片节点
            {
                node.remove();
            }
        },

        /**
         * 激活该切片
         * @public
         */
        activate: function()
        {
            var _parent = this._parent;
            if (_parent)
            {
                _parent.switchTo(this);  // 切换到该切片
            }
            else  // 未添加到切换组件
            {
                this._activateSlice();  // 将该切片激活
            }
        },

        /**
         * 将该切片激活
         * @private
         * @param inactiveSlice 被闲置的切片
         */
        _activateSlice: function(inactiveSlice)
        {
            this.set("actived", true);  // 设置激活标志
            if (this.fire("activeslicestyledisplay", {sliceInactived: inactiveSlice}) !== false)  // 触发显示激活样式事件
            {
                this.displayActiveSliceStyle();  // 显示切片激活样式
            }
        },

        /**
         * 显示切片激活样式
         * @public
         */
        displayActiveSliceStyle: function()
        {
            var sliceNode = this.get("sliceNode"), _parent = this._parent, activeSliceStyle = this.get("activeSliceStyle") || (_parent ? _parent.get("activeSliceStyle") : ""), inactiveSliceStyle = this.get("inactiveSliceStyle") || (_parent ? _parent.get("inactiveSliceStyle") : "");
            if (sliceNode)
            {
                DOM.replaceClass(sliceNode, inactiveSliceStyle, activeSliceStyle);
            }
        },

        /**
         * 闲置该切片
         * @public
         */
        deactivate: function()
        {
            var _parent = this._parent;
            if (this.get("actived"))  // 该切片已激活
            {
                if (_parent)
                {
                    _parent._switchSlice();  // 切换到空切片
                }
                else  // 未添加到切换组件
                {
                    this._deactivateSlice();  // 将该切片闲置
                }
            }
        },

        /**
         * 将该切片闲置
         * @private
         * @param activeSlice 被激活的切片（可选）
         */
        _deactivateSlice: function(activeSlice)
        {
            this.set("actived", false);  // 设置闲置标志
            if (this.fire("inactiveslicestyledisplay", {sliceActived: activeSlice}) !== false)  // 触发显示闲置样式事件
            {
                this.displayInactiveSliceStyle();  // 显示切片闲置样式
            }
        },

        /**
         * 显示切片闲置样式
         * @public
         */
        displayInactiveSliceStyle: function()
        {
            var sliceNode = this.get("sliceNode"), _parent = this._parent, activeSliceStyle = this.get("activeSliceStyle") || (_parent ? _parent.get("activeSliceStyle") : ""), inactiveSliceStyle = this.get("inactiveSliceStyle") || (_parent ? _parent.get("inactiveSliceStyle") : "");
            if (sliceNode)
            {
                DOM.replaceClass(sliceNode, activeSliceStyle, inactiveSliceStyle);
            }
        }
    };
    KISSY.mix(sliceType, EventConfigurable);  // 支持事件绑定能力
    return Switching;
},
{
    requires: ["dom", "event", "./extensible", "./dom-transform", "./event-configurable"]
});
