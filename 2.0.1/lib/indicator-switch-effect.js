/**
 * @fileoverview 轮播组件 - 指示器切换效果模块
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
        init: function(config)
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
    requires: ["dom", "kg/layer-anim/2.0.0/"]
});
