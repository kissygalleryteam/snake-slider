/**
 * @fileoverview 轮播组件 - 事件绑定能力模块（支持批量绑定事件）
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY)
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
