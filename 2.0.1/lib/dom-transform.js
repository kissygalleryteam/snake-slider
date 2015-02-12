/**
 * @fileoverview 轮播组件 - DOM转换模块（支持将DOM结构转换为类实例）
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY, DOM)
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
