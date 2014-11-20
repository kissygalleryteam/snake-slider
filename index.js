/**
 * @fileoverview 轮播组件
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY, DOM, Switching, AutoSwitch, Indicator, LazyRender, SliceSwitchEffect, IndicatorSwitchEffect, SliceManagement)
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
    requires: ["dom", "./lib/switching", "./lib/auto-switch", "./lib/indicator", "./lib/lazy-render", "./lib/slice-switch-effect", "./lib/indicator-switch-effect", "./lib/slice-management"]
});
