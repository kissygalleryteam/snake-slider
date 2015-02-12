## 综述

Slider。

![http://gtms02.alicdn.com/tps/i2/TB1DApgHXXXXXbOXXXXFvIM3VXX-434-180.png](http://gtms02.alicdn.com/tps/i2/TB1DApgHXXXXXbOXXXXFvIM3VXX-434-180.png)

## 初始化组件
	//皮肤文件建议直接拿源码的less文件根据自己业务定制化使用
    S.use('kg/slider/1.0.0/index', function (S, Slider) {
         var vc-slider = new Slider({
            $target: '#slider'
         });
    })
    
    //DOM结构
    <div id="slider" class="vc-slider">
        <div class="vc-slider-track">
            <div class="vc-slider-range"></div>
            <div class="vc-slider-handle"></div>
        </div>
    </div>

## API说明

### 属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|$target|String/NodeList|''|容器|
|orientation|String|'horizontal'|方向，*'horizontal'* / *'vertical'*|
|min|Number|0|最小值|
|max|Number|100|最大值|
|value|Number|0|当前值|
|type|String|'value'|类型，*'value'* / *'min'* / *'max'*|
|step|Number|0|梯级，正整数|
|readOnly|Boolean|false|只读，值不能修改，除非**readOnly = false**|
|disabled|Boolean|false|禁用，值可以修改，但不能与用户交互，除非**disabled = false**|

### 方法

|名称|参数|返回值|描述|
|:---------------|:--------|:----|:----------|
|show|/|/|显示组件|
|hide|/|/|隐藏组件|
|destroy|/|/|析构|
|setter|*'value'* / *'readOnly'* / *'disabled'* / *'step'*|/|设置参数对应的属性值|
|getter|*'value'* / *'readOnly'* / *'disabled'* / *'step'*|返回参数对应的属性值|返回参数对应的属性值|

### 事件

|名称|参数|描述|
|:---------------|:--------|:----------|
|create|外抛的CustomEventObject|组件创建后触发|
|start|外抛的CustomEventObject|组件开始滑动时触发|
|slide|外抛的CustomEventObject|组件滑动进行中触发|
|stop|外抛的CustomEventObject|组件停止滑动时触发|
|change|外抛的CustomEventObject|通过*setter('value', xxx)*改变组件当前值后触发|
|destroy|外抛的CustomEventObject|组件析构后触发|