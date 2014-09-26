/**
 * @fileoverview 轮播组件 - 切片切换效果模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY, DOM, LayerAnim)
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
    requires: ["dom", "kg/layer-anim/2.0.0/"]
});
