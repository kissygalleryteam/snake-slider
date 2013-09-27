/*
combined files : 

gallery/snake-slider/1.0/extensible
gallery/snake-slider/1.0/dom-transform
gallery/snake-slider/1.0/event-configurable
gallery/snake-slider/1.0/switching
gallery/snake-slider/1.0/auto-switch
gallery/snake-slider/1.0/indicator
gallery/snake-slider/1.0/lazy-render
gallery/snake-slider/1.0/slice-switch-effect
gallery/snake-slider/1.0/indicator-switch-effect
gallery/snake-slider/1.0/slice-management
gallery/snake-slider/1.0/index

*/
/**
 * @fileoverview 轮播组件 - 扩展能力模块（支持添加静态扩展模块/插件模块，所有扩展模块/插件模块必须为类（Function），其构造函数为空，如需初始化，必须定义在初始化方法initializer中）
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/extensible',function(KISSY, Base)
{
    var Extensible =
    {
        /**
         * 创建组合类
         * @public
         * @param extentions {Function / [Function]} 扩展类（其静态属性和原型属性将被复制到新创建的组合类中）
         * @param initializer {Function} 初始化方法（可选，组合类初始化后，才调用该方法）
         * @returns {Function} 组合类
         */
        combine: function(extentions, initializer)
        {
            var result = this._cloneDeeply(this), size, i;
            if (extentions)
            {
                if (extentions instanceof Array)
                {
                    for (i = 0, size = extentions.length; i < size; ++ i)
                    {
                        result = this._mergeDeeply(result, extentions[i]);  // 合并类
                    }
                }
                else  // 单个扩展类
                {
                    result = this._mergeDeeply(result, extentions);  // 合并类
                }
            }
            KISSY.extend(result, Base);  // 继承Base，支持Event和Attribute
            if (i = result.CHILD_WIDGET)  // 使子组件继承Base，支持Event和Attribute
            {
                KISSY.extend(i, Base);
            }
            this._addInitializer(result, initializer);  // 添加初始化回调方法
            return result;
        },

        /**
         * 添加插件模块
         * @param plugins {Function / [Function]} 插件类（其静态属性和原型属性将被复制到基类中）
         * @param initializer {Function} 初始化方法（可选参数，插件初始化后，才调用该方法）
         * @returns {Function} 基类（其中包含插件的属性和方法）
         */
        plug: function(plugins, initializer)
        {
            var result = this, size, i;
            if (plugins)
            {
                if (plugins instanceof Array)
                {
                    for (i = 0, size = plugins.length; i < size; ++ i)
                    {
                        result = this._mergeDeeply(result, plugins[i]);  // 合并类
                    }
                }
                else  // 单个插件
                {
                    result = this._mergeDeeply(result, plugins);  // 合并类
                }
                KISSY.extend(result, Base);  // 继承Base，支持Event和Attribute
                if (i = result.CHILD_WIDGET)  // 使子组件继承Base，支持Event和Attribute
                {
                    KISSY.extend(i, Base);
                }
                this._addInitializer(result, initializer);  // 添加初始化回调方法
            }
            return result;
        },

        /**
         * 合并对象（深度合并）
         * @private
         * @param tgt 目标对象（将源对象合并到该对象）
         * @param src 源对象
         * @param context 环境（可空，用于保存已复制对象，以便检查循环引用）
         * @return 合并后的对象
         */
        _mergeDeeply: function(tgt, src, context)
        {
            var result = tgt, srcType, tgtType, globalContext, mergeContext, flag, mergeable, type, i;
            if (tgt !== src && src != undefined)  // 非同一对象，null/undefined不合并
            {
                try
                {
                    if (! context)  // 未提供环境
                    {
                        context = globalContext = {};
                        context.clone = [];  // 复制环境（用于保存已复制对象，以便检查循环引用）
                        context.merge = [];  // 合并环境（用于保存已合并对象，以便检查循环引用）
                    }
                    mergeContext = context.merge;
                    if (tgt)
                    {
                        if ((flag = tgt._zoo_merged_flag) && KISSY.inArray(src, flag))  // 对象已合并过
                        {
                            return tgt;
                        }
                        // 判断对象类型
                        srcType = Object.prototype.toString.call(src);  // 源对象类型
                        tgtType = Object.prototype.toString.call(tgt);  // 目标对象类型
                        if (tgtType == "[object Array]")  // 合并数组
                        {
                            return tgt.concat(src);
                        }
                        else if (srcType == "[object Array]")  // 合并数组
                        {
                            return [tgt].concat(src);
                        }
                        else
                        {
                            if (tgtType == "[object Function]" && srcType == "[object Function]" && (type = tgt.prototype) && ! KISSY.isEmptyObject(type))  // 类
                            {
                                mergeable = true;
                                // 合并prototype
                                result.prototype = this._mergeDeeply(type, src.prototype, context);
                            }
                            else if (tgtType == "[object Function]" && srcType == "[object Object]")  // 将源对象合并为目标Function的静态属性
                            {
                                mergeable = true;
                            }
                            if (mergeable || (tgtType == "[object Object]" && ! tgt.nodeType && tgt.window != tgt && srcType == "[object Object]" && ! src.nodeType && src.window != src))  // 合并对象/静态方法（非DOM节点/window）
                            {
                                mergeContext.push(tgt);  // 保存已合并对象，以检查循环引用
                                if (! flag)
                                {
                                    flag = tgt._zoo_merged_flag = [];
                                }
                                flag.push(src);
                                for (i in src)
                                {
                                    if (src.hasOwnProperty(i))
                                    {
                                        tgt[i] = this._mergeDeeply(tgt[i], src[i], context);
                                    }
                                }
                            }
                            else  // 其它值合并为数组
                            {
                                result = [tgt, src];
                            }
                        }
                    }
                    else  // 未指定目标对象
                    {
                        // 从源对象复制新对象
                        return this._cloneDeeply(src, context.clone);
                    }
                }
                finally
                {
                    // 清理环境
                    if (globalContext)
                    {
                        this._cleanContext(context.clone, "_zoo_cloned_flag");
                        this._cleanContext(mergeContext, "_zoo_merged_flag");
                    }
                }
            }
            return result;
        },
        
        /**
         * 复制对象（深度复制，不复制DOM节点）
         * @private
         * @param src 源对象
         * @param context 环境（可空，用于保存已复制对象，以便检查循环引用）
         * @return 复制的对象
         */
        _cloneDeeply: function(src, context)
        {
            var result, type, value, globalContext, i;
            if (src != undefined)  // 不复制null/undefined
            {
                if (value = src._zoo_cloned_flag)  // 已复制过该对象
                {
                    return value;
                }
                if (! context)  // 未提供环境
                {
                    context = globalContext = [];
                }
                try
                {
                    // 判断对象类型
                    type = Object.prototype.toString.call(src);  // 对象类型
                    if (type == "[object Function]")
                    {
                        // 复制方法
                        if ((type = src.prototype) && ! KISSY.isEmptyObject(type))  // 类
                        {
                            context.push(src);  // 保存已复制对象，以便检查循环引用
                            // 创建新构造函数，调用初始化方法initializer
                            result = src._zoo_cloned_flag = function()
                            {
                                var constructor = this.constructor, args = arguments, initializer = this.initializer, size, i;
                                if (constructor && (constructor = constructor.superclass))  // 调用父类构造函数
                                {
                                    constructor.constructor.apply(this, args);
                                }
                                if (initializer)  // 执行初始化方法
                                {
                                    initializer = initializer instanceof Array ? initializer : [initializer];
                                    for (size = initializer.length, i = 0; i < size;)
                                    {
                                        initializer[i ++].apply(this, args);
                                    }
                                }
                                this.fire("zooinstanceinitialized", {args: args});  // 触发初始化完成事件
                            };
                            //value = src.toString();  // 方法体
                            //result = src._zoo_cloned_flag = Function(value.substring(value.indexOf("(") + 1, value.indexOf(")")), value.substring(value.indexOf("{") + 1, value.lastIndexOf("}")));  // Function("参数（如arg1, arg2）", "方法体")
                            context.push(type);
                            result.prototype = type._zoo_cloned_flag = this._cloneDeeply(type, context);
                        }
                        else  // 普通Function
                        {
                            return src;
                        }
                    }
                    else if (type == "[object Array]")
                    {
                        // 复制数组
                        result = src._zoo_cloned_flag = [];  // 设置标志，确保不会循环引用
                        context.push(src);  // 保存源对象，以便清除标志
                        for (i = src.length; -- i > -1;)
                        {
                            result[i] = this._cloneDeeply(src[i], context);
                        }
                        return result;
                    }
                    else if (type == "[object Date]" || type == "[object RegExp]" || type == "[object Error]")
                    {
                        // 复制原生对象（如：Date, RegExp, Error...）
                        return new src.constructor(src.valueOf());
                    }
                    else if (type != "[object Object]" || src.nodeType || src.window == src)  // String/Boolean/Number/DOM节点/window
                    {
                        // 直接返回源对象，不复制
                        return src;
                    }
                    if (! result)  // Object
                    {
                        src._zoo_cloned_flag = result = {};
                        context.push(src);  // 保存已复制对象，以便检查循环引用
                    }
                    // 复制Object或Function静态属性
                    for (i in src)
                    {
                        if (i != "_zoo_cloned_flag" && i != "_zoo_merged_flag")
                        {
                            result[i] = this._cloneDeeply(src[i], context);
                        }
                    }
                }
                finally
                {
                    // 清理环境
                    this._cleanContext(globalContext, "_zoo_cloned_flag");
                }
            }
            return result;
        },
        
        /**
         * 清理环境
         * @private
         * @param context 环境
         * @param name 标志名称
         */
        _cleanContext: function(context, name)
        {
            if (context)
            {
                for (var i = context.length; -- i > -1;)
                {
                    delete context[i][name];
                }
                context.length = 0;
            }
        },
        
        /**
         * 添加初始化回调方法
         * @private
         * @param cls 类
         * @param initializer 初始化方法
         */
        _addInitializer: function(cls, initializer)
        {
            if (initializer)
            {
                var handler = function()
                {
                    this.on("zooinstanceinitialized", function(e)  // 实例化后，调用初始化回调方法
                    {
                        initializer.apply(this, e.args);
                    });
                }, type, handlers;
                if (type = cls.prototype)  // 原型对象
                {
                    if (handlers = type.initializer)  // 原型对象中的initializer
                    {
                        if (handlers instanceof Array)
                        {
                            handlers.push(handler);
                        }
                        else  // 非数组
                        {
                            type.initializer = [handlers, handler];
                        }
                    }
                    else  // 无初始化方法
                    {
                        type.initializer = handler;
                    }
                }
            }
        }
    };
    return Extensible;
},
{
    requires: ["base"]
});

/**
 * @fileoverview 轮播组件 - DOM转换模块（支持将DOM结构转换为类实例）
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/dom-transform',function(KISSY, DOM)
{
    var DOMTransform =
    {
        /**
         * 将DOM结构转换为类实例
         * 类需实现_domTransformer(config, node, param)方法，返回组件配置参数
         * @public
         * @param node DOM节点
         * @param param {Object} 可选参数
         * @returns 类实例
         */
        transform: function(node, param)
        {
            return new this(this.dom2config(node, param));  // 创建类实例
        },

        /**
         * 将DOM结构转换为配置参数
         * @public
         * @param node DOM节点
         * @param param {Object} 可选参数
         * @returns 配置参数
         */
        dom2config: function(node, param)
        {
            // 保存转换参数，以便延迟加载模块使用
            var config = {transformParam: param}, transformer = this._domTransformer, size, i;
            if (transformer && (node = DOM.get(node)))
            {
                if (size = transformer.length)  // 转换方法列表
                {
                    for (i = 0; i < size; ++ i)
                    {
                        transformer[i].apply(this, [config, node, param]);  // 从DOM解析配置参数
                    }
                }
                else  // 单个转换方法
                {
                    transformer.apply(this, [config, node, param]);  // 从DOM解析配置参数
                }
            }
            return config;  // 创建类实例
        }
    };
    return DOMTransform;
},
{
    requires: ["dom"]
});

/**
 * @fileoverview 轮播组件 - 事件绑定能力模块（支持批量绑定事件）
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/event-configurable',function(KISSY)
{
    var EventConfigurable =
    {
        /**
         * 批量绑定事件配置
         * @public
         * @param events {String/[String]} 事件名称（字符串/数组）
         * @param config {Object} 配置参数（格式：{onxxx: Function}）
         */
        bindEventConfiguration: function(events, config)
        {
            if (config)
            {
                var name, handler, i;
                if (! (events instanceof Array))
                {
                    events = [events];
                }
                for (i = events.length; -- i > -1;)
                {
                    name = events[i];
                    if ((handler = config["on" + name]) && typeof handler == "function")
                    {
                        this.on(name, handler, this);
                    }
                }
            }
        }
    };
    return EventConfigurable;
});

/**
 * @fileoverview 轮播组件 - 基础切换模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/switching',function(KISSY, DOM, Event, Extensible, DOMTransform, EventConfigurable)
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

/**
 * @fileoverview 轮播组件 - 定时切换模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/auto-switch',function(KISSY, DOM)
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
        initializer: function(config)
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

/**
 * @fileoverview 轮播组件 - 切换指示器模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/indicator',function(KISSY, DOM, Event)
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

/**
 * @fileoverview 轮播组件 - 切片延迟渲染模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/lazy-render',function(KISSY, DOM)
{
    /**
     * 配置参数:
     * {
     *     slices:  // 切片列表
     *     [
     *         {
     *             lazyRenderNode: HTMLNode,  // 延迟渲染容器节点
     *             ...
     *         },
     *         ...
     *     ]
     * }
     */
    var LazyRender = function()
    {
    };

    LazyRender.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            this.on("beforeswitch", this._lazyRenderHandler);
        },

        /**
         * 延迟渲染处理
         * @private
         * @param e 事件
         */
        _lazyRenderHandler: function(e)
        {
            var slice = e.slice;
            if (slice)
            {
                slice.renderLazily();  // 延迟渲染切片
                this.detach(this._lazyRenderHandler);  // 只执行一次
            }
        }
    };

    /**
     * 轮播组件 - 切片延迟渲染
     * 事件：
     * lazyrender  // 延迟渲染后触发
     */
    var SliceLazyRender = LazyRender.CHILD_WIDGET = function()
    {
    };

    // 属性
    SliceLazyRender.ATTRS =
    {
        lazyRenderNode:  // 延迟渲染容器节点
        {
            setter: function(value)
            {
                var node = DOM.get(value);
                return node ? node : undefined;
            }
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数（{lazyRenderSelector: 延迟加载节点选择符，默认：".slice-lazy"}）
     */
    SliceLazyRender._domTransformer = function(config, node, param)
    {
        param = param || {};
        var value;
        if (value = DOM.get(param.lazyRenderSelector || ".slice-lazy", node))  // 延迟渲染容器节点
        {
            config.lazyRenderNode = value;
        }
    };

    SliceLazyRender.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            this.bindEventConfiguration(["lazyrender"], config);  // 绑定初始化事件配置
        },

        /**
         * 延迟渲染切片
         * @public
         */
        renderLazily: function()
        {
            var node = this.get("lazyRenderNode");
            if (node && ! this._lazyRendered)  // 节点未显示
            {
                DOM.style(node, "display", "none");  // 隐藏延迟渲染节点
                DOM.insertBefore(DOM.create(DOM.html(node)), node, true);  // 渲染节点（执行<script>）
                this._lazyRendered = true;
                this.fire("lazyrender");  // 触发延迟渲染事件
            }
        }
    };
    return LazyRender;
},
{
    requires: ["dom"]
});

/**
 * @fileoverview 轮播组件 - 切片切换效果模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/slice-switch-effect',function(KISSY, DOM, LayerAnim)
{
    /**
     * 配置参数:
     * {
     *     slices:  // 切片列表
     *     [
     *         {  // 切片配置
     *             activeEffect:  // 单个切片的激活切换效果（按顺序切换到该切片时）
     *             [
     *                 {  // 单个动画
     *                     node: String/HTMLNode,  // 切换节点（可选，默认：切片节点）
     *                     from:  // 动画起始样式
     *                     {
     *                         ...
     *                     },
     *                     to:  // 动画结束样式（按顺序切换到该切片时）
     *                     {
     *                         ...
     *                     },
     *                     duration: 1,  // 动画完成经过时间（单位：秒）
     *                     easing: ...,  // 运动轨迹效果
     *                     delay: 0,  // 延迟运行的时间（单位：秒）
     *                     align: "normal",  // 播放顺序（"normal"：所有动画同时开始播放，支持delay。"sequence"：上一动画播放完再播放该动画。）
     *                     overwrite: "all",  // 当多个动画的CSS属性冲突时，解决方式
     *                     degrade:  // 降级设置（当前浏览器版本高于指定版本时，动画才生效）
     *                     {
     *                         "浏览器名称": "版本"  // 例如：ie: 7
     *                     }
     *                 },
     *                 或
     *                 [  // 动画分组
     *                     {
     *                         ...  // 同上
     *                     }
     *                 ]
     *                 ...
     *             ],
     *             inactiveEffect:  // 单个切片的闲置切换效果（按顺序切换到该切片时）
     *             [
     *                 ...  // 同上
     *             ],
     *             ...
     *         },
     *         ...
     *     ]
     * }
     */
    var SwitchEffect = function()
    {
    };

    SwitchEffect.prototype =
    {
        /**
         * 暂停播放当前激活切片的所有效果（包括激活效果和闲置效果）
         * @public
         */
        pauseEffect: function()
        {
            var slice = this.getActiveSlice();
            if (slice)
            {
                slice.pauseEffect();
            }
        },

        /**
         * 继续播放当前激活切片的所有效果（包括激活效果和闲置效果）
         * @public
         */
        resumeEffect: function()
        {
            var slice = this.getActiveSlice();
            if (slice)
            {
                slice.resumeEffect();
            }
        }
    };

    /**
     * 轮播组件 - 切片切换效果
     */
    var SliceSwitchEffect = SwitchEffect.CHILD_WIDGET = function()
    {
    };

    /**
     * 属性值校验
     * @param value 属性值
     */
    var propValidator = function(value)
    {
        return value && typeof value == "object";  // 允许对象或数组
    };

    // 属性
    SliceSwitchEffect.ATTRS =
    {
        activeEffect:  // 每个切片的激活切换效果（按顺序切换到该切片时）
        {
            validator: propValidator
        },
        inactiveEffect:  // 每个切片的闲置切换效果（按顺序切换到该切片时）
        {
            validator: propValidator
        }
    };

    /**
     * 解析效果配置
     * @private
     * @param node 节点
     * @param attr 属性名称
     * @param selector 动画节点选择符
     */
    var _parseEffectCfg = function(node, attr, selector)
    {
        // 获取切片的效果配置（可空）
        var effect = DOM.attr(node, attr), effects, nodes, size, cfg, n, i;
        try
        {
            if (effect)
            {
                effect = eval('(' + effect + ')');
                if (! effect.node)  // 动画节点默认使用切片节点
                {
                    effect.node = node;
                }
                effects = [effect];  // 效果列表
            }
            else
            {
                effects = [];  // 效果列表
            }
            nodes = DOM.query(selector, node);  // 切片中的分层效果节点
            for (i = 0, size = nodes.length; i < size; ++ i)
            {
                n = nodes[i];
                if (cfg = DOM.attr(n, attr))  // 获取分层效果配置
                {
                    effects.push(effect = eval('(' + cfg + ')'));  // 增加效果配置
                    effect.node = n;  // 动画节点
                }
            }
            return effects.length ? effects : null;
        }
        catch (e)
        {
            KISSY.log("SliceSwitchEffect: invalid configuration - " + attr + ".\n" + e.message);
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数（{sliceLayerSelector: 切片分层动画节点选择符，默认：".slice-layer"}）
     */
    SliceSwitchEffect._domTransformer = function(config, node, param)
    {
        param = param || {};
        var selector = param.sliceLayerSelector || ".slice-layer";
        config.activeEffect = _parseEffectCfg(node, "activeEffect", selector);  // 切片的激活效果配置（按顺序切换到该切片时）
        config.inactiveEffect = _parseEffectCfg(node, "inactiveEffect", selector);  // 切片的闲置效果配置（按顺序切换到该切片时）
    };

    SliceSwitchEffect.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            var transformParam;
            if (config && (transformParam = config.transformParam))  // DOM方式创建组件
            {
                this.on("lazyrender", function()
                {
                    this._generateEffectConfig(transformParam);  // 延迟渲染完成后，解析DOM，并生成配置参数
                });
            }
            this.on("activeslicestyledisplay", this._runActiveEffect);  // 绑定显示激活样式事件
            this.on("inactiveslicestyledisplay", this._runInactiveEffect);  // 绑定显示闲置样式事件
        },

        /**
         * 延迟渲染完成后，解析DOM，并生成配置参数
         * @private
         * @param transformParam 转换参数
         */
        _generateEffectConfig: function(transformParam)
        {
            var config = {};
            // 延迟渲染完成后，解析DOM并生成配置参数
            SliceSwitchEffect._domTransformer(config, this.get("sliceNode"), transformParam);
            this.set("activeEffect", config.activeEffect);  // 激活效果（按顺序切换到该切片时）
            this.set("inactiveEffect", config.inactiveEffect);  // 闲置效果（按顺序切换到该切片时）
        },

        /**
         * 获取动画效果
         * @private
         * @param activing 是否激活
         * @param sliceActived 被激活的切片
         * @param sliceInactived 被闲置的切片
         * @param completeHandler 动画结束回调方法
         * @returns 动画效果
         */
        _getSliceEffect: function(activing, sliceActived, sliceInactived, completeHandler)
        {
//            console.log("inactive: " + (sliceInactived ? sliceInactived.get("index") : -1) + ", active: " + (sliceActived ? sliceActived.get("index") : -1));
            var propName = activing ? "activeEffect" : "inactiveEffect", config = this.get(propName), anim;  // 动画效果配置
            if (config)
            {
                propName += "Anim";
                // 创建动画
                anim = this[propName] = new LayerAnim(config);
                anim.on("end", completeHandler, this);  // 动画结束事件
                return anim;
            }
        },

        /**
         * 运行激活效果
         * @private
         * @param e 事件
         */
        _runActiveEffect: function(e)
        {
            var sliceInactived = e.sliceInactived, anim;
            if (anim = this._getSliceEffect(true, this, sliceInactived, this.displayActiveSliceStyle))  // 激活动画
            {
//                this.stopEffect("inactiveEffect");  // 停止播放闲置动画
                anim.run();  // 播放激活动画
                return false;  // 取消默认事件
            }
        },

        /**
         * 运行闲置效果
         * @private
         * @param e 事件
         */
        _runInactiveEffect: function(e)
        {
            var anim;
            if (anim = this._getSliceEffect(false, e.sliceActived, this, this.displayInactiveSliceStyle))  // 闲置动画
            {
//                this.stopEffect("activeEffect");  // 停止播放激活动画
                anim.run();  // 播放闲置动画
                return false;  // 取消默认事件
            }
        },

        /**
         * 停止播放切片动画效果
         * @public
         * @param effectName 效果名称（undefined: 所有效果（默认），"activeEffect": 激活效果, "inactiveEffect": 闲置效果）
         */
        stopEffect: function(effectName)
        {
            if (effectName)
            {
                var effect;
                if (effect = this[effectName + "Anim"])  // 顺序切换动画
                {
                    effect.stop();
                }
            }
            else  // 停止所有动画
            {
                this.stopEffect("activeEffect");
                this.stopEffect("inactiveEffect");
            }
        },

        /**
         * 暂停播放切片动画效果
         * @public
         * @param effectName 效果名称（undefined: 所有效果（默认），"activeEffect": 激活效果, "inactiveEffect": 闲置效果）
         */
        pauseEffect: function(effectName)
        {
            if (effectName)
            {
                var effect;
                if (effect = this[effectName + "Anim"])  // 顺序切换动画
                {
                    effect.pause();
                }
            }
            else  // 暂停所有动画
            {
                this.pauseEffect("activeEffect");
                this.pauseEffect("inactiveEffect");
            }
        },

        /**
         * 继续播放切片动画效果
         * @public
         * @param effectName 效果名称（undefined: 所有效果（默认），"activeEffect": 激活效果, "inactiveEffect": 闲置效果）
         */
        resumeEffect: function(effectName)
        {
            if (effectName)
            {
                var effect;
                if (effect = this[effectName + "Anim"])  // 顺序切换动画
                {
                    effect.resume();
                }
            }
            else  // 继续播放所有动画
            {
                this.resumeEffect("activeEffect");
                this.resumeEffect("inactiveEffect");
            }
        }
    };
    return SwitchEffect;
},
{
    requires: ["dom", "gallery/layer-anim/1.1/"]
});

/**
 * @fileoverview 轮播组件 - 指示器切换效果模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/indicator-switch-effect',function(KISSY, DOM, LayerAnim)
{
    /**
     * 配置参数:
     * {
     *     slices:  // 切片列表
     *     [
     *         {  // 切片配置
     *             activeIndicatorEffect:  // 指示器的激活切换效果
     *             [
     *                 {  // 单个动画
     *                     node: String/HTMLNode,  // 切换节点（可选，默认：指示器节点）
     *                     from:  // 起始样式
     *                     {
     *                         ...
     *                     },
     *                     to:  // 结束样式
     *                     {
     *                         ...
     *                     },
     *                     duration: 1,  // 动画完成经过时间（单位：秒）
     *                     easing: ...,  // 运动轨迹效果
     *                     delay: 0,  // 延迟运行的时间（单位：秒）
     *                     align: "normal",  // 播放顺序（"normal"：所有动画同时开始播放，支持delay。"sequence"：上一动画播放完再播放该动画。）
     *                     overwrite: "all",  // 当多个动画的CSS属性冲突时，解决方式
     *                     degrade:  // 降级设置（当前浏览器版本高于指定版本时，动画才生效）
     *                     {
     *                         "浏览器名称": "版本"  // 例如：ie: 7
     *                     }
     *                 },
     *                 或
     *                 [  // 动画分组
     *                     {
     *                         ...  // 同上
     *                     }
     *                 ]
     *                 ...
     *             ],
     *             inactiveIndicatorEffect:  // 指示器的闲置切换效果
     *             [
     *                 ...  // 同上
     *             ],
     *             ...
     *         },
     *         ...
     *     ]
     * }
     */
    var IndicatorSwitchEffect = function()
    {
    };

    /**
     * @class 指示器切换效果
     */
    var SliceIndicatorSwitchEffect = IndicatorSwitchEffect.CHILD_WIDGET = function()
    {
    };

    /**
     * 属性值校验
     * @param value 属性值
     */
    var propValidator = function(value)
    {
        return value && typeof value == "object";  // 允许对象或数组
    };

    // 属性
    SliceIndicatorSwitchEffect.ATTRS =
    {
        activeIndicatorEffect:  // 指示器的激活切换效果
        {
            validator: propValidator
        },
        inactiveIndicatorEffect:  // 指示器的闲置切换效果
        {
            validator: propValidator
        }
    };

    /**
     * 解析效果配置
     * @private
     * @param node 节点
     * @param attr 属性名称
     * @param selector 动画节点选择符
     */
    var _parseIndicatorEffectCfg = function(node, attr, selector)
    {
        // 获取指示器的效果配置（可空）
        var effect = DOM.attr(node, attr), effects, nodes, size, cfg, n, i;
        try
        {
            if (effect)
            {
                effect = eval('(' + effect + ')');
                if (! effect.node)  // 动画节点默认使用指示器节点
                {
                    effect.node = node;
                }
                effects = [effect];  // 效果列表
            }
            else
            {
                effects = [];  // 效果列表
            }
            nodes = DOM.query(selector, node);  // 指示器中的分层效果节点
            for (i = 0, size = nodes.length; i < size; ++ i)
            {
                n = nodes[i];
                if (cfg = DOM.attr(n, attr))  // 获取分层效果配置
                {
                    effects.push(effect = eval('(' + cfg + ')'));  // 增加效果配置
                    effect.node = n;  // 动画节点
                }
            }
            return effects.length ? effects : null;
        }
        catch (e)
        {
            KISSY.log("SliceIndicatorSwitchEffect: invalid configuration - " + attr + ".\n" + e.message);
        }
    };

    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param {Object} 可选参数（{indicatorLayerSelector: 动画节点选择符，默认：".indicator-layer"}）
     */
    SliceIndicatorSwitchEffect._domTransformer = function(config, node, param)
    {
        param = param || {};
        var selector = param.indicatorLayerSelector || ".indicator-layer";
        config.activeIndicatorEffect = _parseIndicatorEffectCfg(node, "activeIndicatorEffect", selector);  // 每个指示器的激活效果配置
        config.inactiveIndicatorEffect = _parseIndicatorEffectCfg(node, "inactiveIndicatorEffect", selector);  // 每个指示器的闲置效果配置
    };

    SliceIndicatorSwitchEffect.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            this.on("activeindicatorstyledisplay", this._runActiveIndicatorEffect);  // 绑定显示激活样式事件
            this.on("inactiveindicatorstyledisplay", this._runInactiveIndicatorEffect);  // 绑定显示闲置样式事件
        },

        /**
         * 获取动画效果
         * @private
         * @param activing 是否激活
         * @returns 动画效果
         */
        _getIndicatorEffect: function(activing)
        {
            var propName = activing ? "activeIndicatorEffect" : "inactiveIndicatorEffect", config = this.get(propName), anim;  // 动画效果配置
            if (config)
            {
                propName += "Anim";
                anim = this[propName];
                // 创建动画
                anim = this[propName] = new LayerAnim(config);
                return anim;
            }
        },

        /**
         * 运行激活效果
         * @private
         * @param e 事件
         */
        _runActiveIndicatorEffect: function(e)
        {
            var anim;
            if (anim = this._getIndicatorEffect(true))  // 激活动画
            {
//                this.stopIndicatorEffect("inactiveIndicatorEffect");  // 停止播放闲置动画
                anim.run();  // 播放激活动画
            }
        },

        /**
         * 运行闲置效果
         * @private
         * @param e 事件
         */
        _runInactiveIndicatorEffect: function(e)
        {
            var anim;
            if (anim = this._getIndicatorEffect(false))  // 闲置动画
            {
//                this.stopIndicatorEffect("activeIndicatorEffect");  // 停止播放激活动画
                anim.run();  // 播放闲置动画
            }
        },

        /**
         * 停止播放指示器动画效果
         * @public
         * @param effectName 效果名称（undefined: 所有效果（默认），"activeIndicatorEffect": 激活效果, "inactiveIndicatorEffect": 闲置效果）
         */
        stopIndicatorEffect: function(effectName)
        {
            if (effectName)
            {
                var effect;
                if (effect = this[effectName + "Anim"])  // 顺序切换动画
                {
                    effect.stop();
                }
            }
            else  // 停止所有动画
            {
                this.stopIndicatorEffect("activeIndicatorEffect");
                this.stopIndicatorEffect("inactiveIndicatorEffect");
            }
        }
    };
    return IndicatorSwitchEffect;
},
{
    requires: ["dom", "gallery/layer-anim/1.1/"]
});

/**
 * @fileoverview 轮播组件 - 切片管理模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/slice-management',function(KISSY)
{
    /**
     * 事件:
     * sliceadd  // 添加切片后触发
     * sliceremove  // 删除切片后触发
     */
    var Management = function()
    {
    };

    Management.prototype =
    {
        /**
         * 初始化
         * @interface Extensible
         * @param config 配置参数
         */
        initializer: function(config)
        {
            this.bindEventConfiguration(["sliceadd", "sliceremove"], config);  // 绑定初始化事件配置
        },

        /**
         * 添加切片
         * @public
         * @param slice 切片
         * @returns 添加的切片
         */
        appendSlice: function(slice)
        {
            return this.insertSlice(slice);
        },

        /**
         * 插入切片
         * @public
         * @param slice 切片（配置参数/Slice对象）
         * @param index 插入位置索引（可选，默认：插入到最后）
         * @returns 插入的切片
         */
        insertSlice: function(slice, index)
        {
            if (slice)
            {
                if (typeof slice == "string")
                {
                    slice = eval('(' + slice + ')');
                }
                if (typeof slice == "object")
                {
                    var SliceClass = this.constructor.CHILD_WIDGET, slices = this.get("slices"), size = slices.length;
                    if (! slice instanceof SliceClass)  // 切片配置参数
                    {
                        slice = new SliceClass(slice);
                    }
                    index = index == null ? size : index < 0 ? 0 : Math.min(index, size);
                    this._addSlice(slice, index);  // 增加切片
                    this.fire("sliceadd", {slice: slice, index: index});  // 触发切片添加事件
                    return slice;
                }
            }
        },

        /**
         * 删除切片
         * @public
         * @param index 切片索引
         * @returns 被删除的切片
         */
        removeSlice: function(index)
        {
            var slices = this.get("slices"), slice = slices[index], actived;
            if (slice)
            {
                actived = slice.get("actived");  // 是否激活
                if (this.getActiveSlice() == slice)  // 被删除的切片为当前激活切片
                {
                    this._switchSlice();  // 将被删除切片闲置
                }
                this._delSlice(slice);  // 删除切片
                this.fire("sliceremove", {slice: slice, index: index, actived: actived});  // 触发切片删除事件
                return slice;
            }
        },

        /**
         * 删除切片
         * @private
         * @param slice 切片
         */
        _delSlice: function(slice)
        {
            var slices = this.get("slices"), sliceMap = this.sliceMap, id = slice.id, index = slice.get("index"), i = slices.length - 1;
            slices.splice(index, 1);
            // 调整后续切片索引
            while (-- i >= index)
            {
                slices[i].set("index", i);
            }
            if (id)
            {
                delete sliceMap[id];  // 切片标识映射
            }
            slice._detachFromParent();  // 从切换组件分离
        },

        /**
         * 删除所有切片
         * @public
         */
        clearSlices: function()
        {
            var slices = this.get("slices"), i = slices.length, sliceActived = this.getActiveSlice(), slice;
            while (slice = slices[-- i])
            {
                if (slice != sliceActived)
                {
                    this.removeSlice(i);  // 删除闲置切片
                }
            }
            this.removeSlice(0);  // 删除当前激活切片
        }
    };

    /**
     * 轮播组件 - 切片管理
     */
    var SliceManagement = Management.CHILD_WIDGET = function()
    {
    };

    SliceManagement.prototype =
    {
        /**
         * 添加切片
         * @public
         * @param slider 切换组件
         * @returns 添加的切片
         */
        appendTo: function(slider)
        {
            return this.insertTo(slider);
        },

        /**
         * 增加切片
         * @public
         * @param slider 切换组件
         * @param index 插入位置索引（可选，默认：插入到最后）
         * @returns 插入的切片 
         */
        insertTo: function(slider, index)
        {
            if (slider)
            {
                return slider.insertSlice(this, index);
            }
        },

        /**
         * 删除该切片
         * @public
         */
        remove: function()
        {
            var _parent = this._parent;
            if (_parent)
            {
                return _parent.removeSlice(this.get("index"));
            }
        }
    };
    return Management;
});

/**
 * @fileoverview 轮播组件
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add('gallery/snake-slider/1.0/index',function(KISSY, DOM, Switching, AutoSwitch, Indicator, LazyRender, SliceSwitchEffect, IndicatorSwitchEffect, SliceManagement)
{
    /**
     * 配置参数
     * {
     *     ...
     *     switchOnIndicator: "mouseover",  // 切片切换时机（"mouseover"：鼠标移上时触发切换。"click"：鼠标按下时触发切换）
     * }
     */
    var SliderExt = function()
    {
    };

    // 属性
    SliderExt.ATTRS =
    {
        switchOnIndicator:  // 切片切换时机（"mouseover"：鼠标移上时触发切换。"click"：鼠标按下时触发切换）
        {
            value: "mouseover"
        }
    };

    // 静态方法
    /**
     * 从DOM解析组件配置参数
     * @private
     * @param config 组件配置参数
     * @param node DOM节点
     * @param param 可选参数
     */
    SliderExt._domTransformer = function(config, node)
    {
        var value;
        if (value = DOM.attr(node, "switchOnIndicator"))  // 切片切换时机
        {
            config.switchOnIndicator = value;
        }
    };

    /**
     * 初始化方法
     * @param config 配置参数
     */
    var initializer = function(config)
    {
        //console.log("zoo.SliderExt.initializer");
        this.bindIndicatorEvent(this.get("switchOnIndicator"), function(e, Switching, slice)  // 绑定指示器节点事件
        {
            e.preventDefault();
            slice.activate();  // 激活切片
        }, this);
        this.on("sliceremove", function(e)  // 切片删除后
        {
            if (e.actived)  // 该切片已激活
            {
                var index = e.index, slices = this.get("slices"), slice;
                // 激活相邻切片（后一切片/前一切片）
                if (slice = slices[index] || slices[index - 1])
                {
                    slice.activate();
                }
            }
            e.slice.removeIndicator();  // 删除切片指示器
        });
        var sliceActived = this._sliceActived;  // 当前激活切片
        if (! sliceActived)
        {
            sliceActived = this.getSliceByIndex(0);  // 默认激活第1个切片
        }
        this.switchTo(sliceActived);  // 切换到当前激活切片
        this.startAutoSwitch();  // 启动定时切换
    };
    // 创建轮播组件
    return Switching.combine([Indicator, AutoSwitch, LazyRender, SliceSwitchEffect, IndicatorSwitchEffect, SliceManagement, SliderExt], initializer);
},
{
    requires: ["dom", "./switching", "./auto-switch", "./indicator", "./lazy-render", "./slice-switch-effect", "./indicator-switch-effect", "./slice-management"]
});

