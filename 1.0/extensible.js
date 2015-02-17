/**
 * @fileoverview 轮播组件 - 扩展能力模块（支持添加静态扩展模块/插件模块，所有扩展模块/插件模块必须为类（Function），其构造函数为空，如需初始化，必须定义在初始化方法init中）
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY, Base)
{
    var Extensible =
    {
        /**
         * 创建组合类
         * @public
         * @param extentions {Function / [Function]} 扩展类（其静态属性和原型属性将被复制到新创建的组合类中）
         * @param init {Function} 初始化方法（可选，组合类初始化后，才调用该方法）
         * @returns {Function} 组合类
         */
        combine: function(extentions, init)
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
            this._addInitializer(result, init);  // 添加初始化回调方法
            return result;
        },

        /**
         * 添加插件模块
         * @param plugins {Function / [Function]} 插件类（其静态属性和原型属性将被复制到基类中）
         * @param init {Function} 初始化方法（可选参数，插件初始化后，才调用该方法）
         * @returns {Function} 基类（其中包含插件的属性和方法）
         */
        plug: function(plugins, init)
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
                this._addInitializer(result, init);  // 添加初始化回调方法
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
                            // 创建新构造函数，调用初始化方法init
                            result = src._zoo_cloned_flag = function()
                            {
                                var constructor = this.constructor, args = arguments, init = this.init, size, i;
                                if (constructor && (constructor = constructor.superclass))  // 调用父类构造函数
                                {
                                    constructor.constructor.apply(this, args);
                                }
                                if (init)  // 执行初始化方法
                                {
                                    init = init instanceof Array ? init : [init];
                                    for (size = init.length, i = 0; i < size;)
                                    {
                                        init[i ++].apply(this, args);
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
         * @param init 初始化方法
         */
        _addInitializer: function(cls, init)
        {
            if (init)
            {
                var handler = function()
                {
                    this.on("zooinstanceinitialized", function(e)  // 实例化后，调用初始化回调方法
                    {
                        init.apply(this, e.args);
                    });
                }, type, handlers;
                if (type = cls.prototype)  // 原型对象
                {
                    if (handlers = type.init)  // 原型对象中的init
                    {
                        if (handlers instanceof Array)
                        {
                            handlers.push(handler);
                        }
                        else  // 非数组
                        {
                            type.init = [handlers, handler];
                        }
                    }
                    else  // 无初始化方法
                    {
                        type.init = handler;
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
