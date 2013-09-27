/**
 * @fileoverview 轮播组件 - 切片管理模块
 * @author 阿古<agu.hc@taobao.com>
 * @module snake-slider
 * @version 1.0
 * @date 2013-9-24
 */
KISSY.add(function(KISSY)
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
