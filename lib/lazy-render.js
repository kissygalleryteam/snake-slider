/**
 * @fileoverview 轮播组件 - 切片延迟渲染模块
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
        init: function(config)
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
        init: function(config)
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
