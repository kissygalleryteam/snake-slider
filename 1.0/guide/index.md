动画轮播组件（SnakeSlider）
==========================

* 版本：1.0
* 作者：阿古
* Demo：[http://gallery.kissyui.com/snake-slider/1.0/demo/index.html](http://gallery.kissyui.com/snake-slider/1.0/demo/index.html)

“轮播组件”常用于滚动展示图片，例如：焦点图。

SnakeSlider是一个可定制复杂动画的轮播组件，支持在切换显示/隐藏切片时分别显示不同动画，基于[LayerAnim](http://gallery.kissyui.com/layer-anim/1.1/demo/index.html)组件实现动画效果。

## 名词术语

![](term.png)

* 切片（Slice）

   轮播组件中，切换的部分称之为“切片”。一个轮播组件由多个切片组成。当切换到当前切片时，可显示切换动画。当前切片被隐藏时，也可显示切换动画。由于动画基于LayerAnim实现，因此SnakeSlider可支持定制各种个性化的分层动画。

* 当前（Actived）切片

   当前显示的切片即为“当前切片”。

* 隐藏（Inactived）切片

   未显示的切片为“隐藏切片”。

* 指示器（Indicator）

   “指示器”用于标识每个切片在轮播组件中的顺序。

## 功能（Features）

* 支持自定义轮播切换动画，可定制任意复杂的动画效果（例如：显示一组顺序播放的动画）
* 支持自定义指示器切换动画，同样可定制任意复杂的动画效果
* 延迟渲染切片
* 动态添加、删除切片
* 即插即用的插件，扩展方便
* 兼容所有浏览器（包括IE 6）

## 依赖

* [KISSY](http://docs.kissyui.com) 1.3.0+
* [LayerAnim](http://gallery.kissyui.com/layer-anim/1.1/demo/index.html) 1.1

## 浏览器兼容性（Broswer Support）

兼容所有主流浏览器：

* Chrome
* Internet Explorer 6+
* Firefox
* Opera
* Safari

## 使用手册

### 初始化组件

```
KISSY.use('gallery/snake-slider/1.0/index', function (S, SnakeSlider)
{
     var slider = new SnakeSlider();
})
```

### 创建轮播组件

SnakeSlider可基于任意HTML结构创建，给开发者提供足够的灵活度。例如，基于以下简单的HTML：

```
<div class="slider">
    <!-- 切片列表 -->
    <ol>
        <li>  <!-- 切片1 -->
           <img src="slice1.jpg"/>
        </li>
        <li>  <!-- 切片2 -->
           <img src="slice2.jpg"/>
        </li>
    </ol>
    <!-- 指示器列表 -->
    <div>
        <span>1</span>  <!-- 切片1的指示器 -->
        <span>2</span>  <!-- 切片2的指示器 -->
    </div>
</div>
```

有两种方式来创建轮播组件：

#### 从JS创建

```javascript
KISSY.use("gallery/snake-slider/1.0/, dom", function(S, SnakeSlider, DOM)
{
    // 构造切片配置参数
    var slices = [];  // 切片列表配置参数
    var sliceNodes = DOM.query("li"), i, size;  // 切片节点列表
    var navNodes = DOM.query("span");  // 指示器节点列表
    for (i = 0, size = sliceNodes.size(); i < size; ++ i)
    {
        // 构造切片配置参数
        slices[i] =
        {
            sliceNode: sliceNodes[i],  // 切片节点
            indicatorNode: navNodes[i]  // 指示器节点
        }
    }
    // 创建Slider
    var slider = new SnakeSlider(
    {
        activeSliceStyle: "actived",  // 当前切片样式（选择符）
        activeIndicatorStyle: "actived", // 当前切片的指示器样式（选择符）
        slices: slices  // 切片配置
    });
});
```

其中，我们遍历了所有的切片DOM节点，来构造切片的配置参数，格式如下：

```javascript
{
    sliceNode: ...,  // 切片节点
    indicatorNode: ...  // 指示器节点
}
```

之后，通过配置参数```activeSliceStyle```和```activeIndicatorStyle```设置当前切片和指示器的选择符为```actived```。

然后通过```new SnakeSlider(...)```创建轮播组件，该轮播组件包含两个切片。鼠标移动到切片指示器上时，会切换到相应的切片。

#### 从DOM创建

除通过JS创建外，我们也可以直接从DOM创建轮播组件。此时，需要在HTML结构中增加一些属性（Attribute）和样式（Class），以便轮播组件能够识别所需的DOM结构。

HTML如下：

```
<div class="slider" activeSliceStyle="actived" activeIndicatorStyle="actived">
    <!-- 切片列表 -->
    <ol>
        <li class="slice">  <!-- 切片1 -->
            <img src="slice1.jpg"/>
        </li>
        <li class="slice">  <!-- 切片2 -->
            <img src="slice2.jpg"/>
        </li>
    </ol>
    <!-- 指示器列表 -->
    <div>
        <span class="slice-indicator">1</span>  <!-- 切片1的指示器 -->
        <span class="slice-indicator">2</span>  <!-- 切片2的指示器 -->
    </div>
</div>
```

其中，属性```activeSliceStyle="actived"```表示当前切片的样式（选择符），```activeIndicatorStyle="actived"```表示当前指示器的样式（选择符）。

```class="slice"```用于标识切片，```class="slice-indicator"```用于标识指示器。SnakeSlider默认查找这些选择符，生成切片和指示器。

注：指示器DOM节点必须是轮播组件DOM容器的子节点。

有了上面的HTML，创建轮播组件就非常简单了：

```javascript
KISSY.use("gallery/snake-slider/1.0/", function(S, SnakeSlider)
{
    // 从DOM节点创建轮播组件
    SnakeSlider.transform(".slider");
});
```

其中，```SnakeSlider.transform```为静态方法，参数支持选择符或DOM节点。

如果想在切片DOM中使用自定义选择符，不使用```slice```等默认选择符，也没有问题。只需在创建轮播组件时，设置第2个参数，指定自定义的选择符即可。例如：

```
<div class="my-slider" activeSliceStyle="actived" activeIndicatorStyle="actived">
    <!-- 切片列表 -->
    <ol>
        <li class="my-slice">  <!-- 切片1 -->
            <img src="slice1.jpg"/>
        </li>
        <li class="my-slice">  <!-- 切片2 -->
            <img src="slice2.jpg"/>
        </li>
    </ol>
    <!-- 指示器列表 -->
    <div>
        <span class="my-slice-indicator">1</span>  <!-- 切片1的指示器 -->
        <span class="my-slice-indicator">2</span>  <!-- 切片2的指示器 -->
    </div>
</div>
```

切片和指示器都使用了自定义选择符```my-slice```和```my-slice-indicator```，那么，创建轮播组件的方法如下：

```javascript
KISSY.use("gallery/snake-slider/1.0/", function(S, SnakeSlider)
{
    // 从DOM节点创建轮播组件
    SnakeSlider.transform(".my-slider", 
    {
        sliceSelector: "my-slice",  // 切片选择符
        indicatorSelector: "my-slice-indicator"  // 指示器选择符
    });
});
```

支持的选择符配置参数有：

* sliceSelector：切片节点选择符，默认值：slice
* indicatorSelector：指示器节点选择符，默认值：slice-indicator
* indicatorLayerSelector：指示器动画节点选择符，默认值：indicator-layer
* lazyRenderSelector：延迟加载容器节点选择符，默认值：slice-lazy
* sliceLayerSelector：切片动画节点选择符，默认值：slice-layer

### 添加切换效果

上面创建的轮播组件在切换时没有任何动画，仅仅是显示和隐藏切片。下面我们为其添加切换动画，修改HTML结构：

```
<div class="slider" activeSliceStyle="actived" activeIndicatorStyle="actived">
    <!-- 切片列表 -->
    <ol>
        <li class="slice" activeEffect="{to: {opacity: 1}, duration: 0.6}" inactiveEffect="{to: {opacity: 0}, duration: 0.6}">
            <img src="slice1.jpg"/>
        </li>
        <li class="slice" activeEffect="{to: {opacity: 1}, duration: 0.6}" inactiveEffect="{to: {opacity: 0}, duration: 0.6}">
            <img src="slice2.jpg"/>
        </li>
    </ol>
    <!-- 指示器列表 -->
    <div>
        <span class="slice-indicator">1</span>  <!-- 切片1的指示器 -->
        <span class="slice-indicator">2</span>  <!-- 切片2的指示器 -->
    </div>
</div>
```

上面每个切片节点（```<li>```）上，都增加了```activeEffect```和```inactiveEffect```属性，值为JSON字符串。

* activeEffect：定义切片被显示时的动画。

* inactiveEffect：定义切片被隐藏时的动画。

### 定时自动切换

通常，轮播组件会每隔一段时间，自动切换切片。下面，我们通过```switchInterval```配置参数来实现该功能。修改后的HTML如下：

```
<div class="slider" activeSliceStyle="actived" activeIndicatorStyle="actived" switchInterval="3">
    <!-- 切片列表 -->
    <ol>
        <li class="slice" activeEffect="{to: {opacity: 1}, duration: 0.6}" inactiveEffect="{to: {opacity: 0}, duration: 0.6}">
            <img src="slice1.jpg"/>
        </li>
        <li class="slice" activeEffect="{to: {opacity: 1}, duration: 0.6}" inactiveEffect="{to: {opacity: 0}, duration: 0.6}">
            <img src="slice2.jpg"/>
        </li>
    </ol>
    <!-- 指示器列表 -->
    <div>
        <span class="slice-indicator">1</span>  <!-- 切片1的指示器 -->
        <span class="slice-indicator">2</span>  <!-- 切片2的指示器 -->
    </div>
</div>
```

其中，```switchInterval```设置为3，表示每隔3秒切换一次。如果当前切片已经是最后一个，则会自动切换显示第一个切片，如此循环往复。

如果未设置```switchInterval```，或将```switchInterval```设置为 < 0的值，则会自动切换会被禁用。

### 延迟渲染切片

为提高页面加载的速度，可以将切片HTML放在```<xmp>```或```<textarea>```等节点中，当切换到该切片时，再渲染显示。

修改HTML如下：

```
<div class="slider" activeSliceStyle="actived" activeIndicatorStyle="actived" switchInterval="3">
    <!-- 切片列表 -->
    <ol>
        <li class="slice" activeEffect="{to: {opacity: 1}, duration: 0.6}" inactiveEffect="{to: {opacity: 0}, duration: 0.6}">
            <xmp class="slice-lazy">
                <img src="slice1.jpg"/>
            </xmp>
        </li>
        <li class="slice" activeEffect="{to: {opacity: 1}, duration: 0.6}" inactiveEffect="{to: {opacity: 0}, duration: 0.6}">
            <xmp class="slice-lazy">
                <img src="slice2.jpg"/>
            </xmp>
        </li>
    </ol>
    <!-- 指示器列表 -->
    <div>
        <span class="slice-indicator">1</span>  <!-- 切片1的指示器 -->
        <span class="slice-indicator">2</span>  <!-- 切片2的指示器 -->
    </div>
</div>
```

其中，```class="slice-lazy"```用于标识延迟渲染的容器节点，该节点包含切片HTML，必须是切片节点的子节点。

延迟渲染的HTML中可包含JS脚本，该部分脚本会在延迟渲染后被执行。

## 开发接口（API）

一个轮播组件对象由两类JS对象组成：

* 轮播组件对象：表示一个轮播组件。
* 切片对象：表示轮播组件中的一个切片，每个切片都是一个JS对象，有自己的配置参数、方法和事件。

轮播组件支持两种创建方式：

- JS方式创建

```javascript
KISSY.use("gallery/snake-slider/1.0/", function(S, SnakeSlider)
{
    var config = /* 配置参数 */;
    new SnakeSlider(config);
});
```

- DOM方式创建

```
<轮播组件DOM activeSliceStyle="当前切片样式（全局配置）" inactiveSliceStyle="隐藏切片样式（全局配置）"
    activeIndicatorStyle="当前指示器样式（全局配置）" inactiveIndicatorStyle="隐藏指示器样式（全局配置）"
    switchOnIndicator="触发切换的时机（"mouseover"：鼠标移上时触发切换，"click"：鼠标按下时触发切换）" switchInterval="切换间隔时间（单位：秒）" hoverPause="鼠标移到切片上时，是否停止自动切换">

    <切片DOM id="切片标识" actived="初始时是否显示" activeSliceStyle="当前切片样式（覆盖全局配置）" inactiveSliceStyle="隐藏切片样式（覆盖全局配置）"
    activeIndicatorStyle="当前指示器样式（覆盖全局配置）" inactiveIndicatorStyle="隐藏指示器样式（覆盖全局配置）" switchInterval="切换间隔时间（单位：秒）"
    activeEffect="显示切片的动画" inactiveEffect="隐藏切片的动画">
        <延迟渲染DOM>
        ...  <-- 切片HTML -->
        </延迟渲染DOM>
    </切片DOM>
    <切片DOM>
        ...
    </切片DOM>

    <指示器DOM>
        ...
    </指示器DOM>
</轮播组件DOM>
```

```javascript
KISSY.use("gallery/snake-slider/1.0/", function(S, SnakeSlider)
{
    var node = "/* DOM节点 */";
    SnakeSlider.transform(node);
});
```

### 配置参数

SnakeSlider继承了KISSY Base类，因此，配置参数可通过KISSY Attr的get方法读取，通过set方法设置。例如：

```javascript
var slider = new SnakeSlider(...);
slider.get("slices");  // 获取切片列表
slider.set("switchInterval", 5);  // 设置切片自动切换间隔时间为5秒
```

#### 轮播组件配置参数

- *container* {String / HTMLNode}【可选，默认值：```<body>```节点】

   轮播组件容器节点，支持选择符或DOM节点（支持的选择符请参考[KISSY DOM选择符](http://docs.kissyui.com/docs/html/api/core/dom/selector.html)）。

   该配置参数仅在初始化组件时有效，之后设置无效。

- *slices* [Object]

   切片配置（数组），具体请参考“切片配置参数”。该配置参数仅在初始化组件时有效，之后设置无效。

- *activeSliceStyle* {String}【可选】

   当前切片样式（选择符）。当前切片切换完毕后，在切片DOM节点上添加该样式。

- *inactiveSliceStyle* {String}【可选】

   隐藏切片样式（选择符）。切片被隐藏后，在切片DOM节点上添加该样式。该参数与```activeSliceStyle```可同时设置，也可只设置其中一个。

- *activeIndicatorStyle* {String}【可选】

   当前切片的指示器样式（选择符）。当前切片切换完毕后，在指示器DOM节点上添加该样式。

- *inactiveIndicatorStyle* {String}【可选】

   隐藏切片的指示器样式（选择符）。切片被隐藏后，在指示器DOM节点上添加该样式。

- *switchOnIndicator* {String}【可选】

   触发切换的时机。取值如下：

   * "mouseover"：鼠标移上指示器时，触发切换。【默认值】
   * "click"：鼠标单击指示器时，触发切换。

   该配置参数仅在初始化组件时有效，之后设置无效。

- *switchInterval* {Number}【可选，默认值：0】

   自动切换间隔时间（单位：秒）。如果该值≤0，则不自动切换。

- *hoverPause* {Boolean}【可选】

   鼠标移到切片上时，是否停止自动切换。【默认值：true】

#### 切片对象配置参数

- *id* {String}【可选】

   切片标识，用于查找切片对象。该配置参数仅在初始化组件时有效，之后设置无效。

- *index* {String}【只读】

   切片显示索引，从0开始。该参数为只读参数，设置无效。

- *sliceNode* {String / HTMLNode}【可选】

   切片DOM节点（选择符 / DOM节点）。该配置参数仅在初始化组件时有效，之后设置无效。

- *actived* {Boolean}【可选，默认值：false】

   初始时，该切片是否为当前切片。该配置参数仅在初始化组件时有效，之后设置无效。

- *activeSliceStyle* {String}【可选】

   当前切片样式（选择符）。如果设置，该参数会覆盖轮播组件配置参数```activeSliceStyle```。

- *inactiveSliceStyle* {String}【可选】

   隐藏切片样式（选择符）。如果设置，该参数会覆盖轮播组件配置参数```inactiveSliceStyle```。

- *indicatorNode* {String / HTMLNode}【可选】

   指示器DOM节点（选择符 / DOM节点）。该配置参数仅在初始化组件时有效，之后设置无效。

- *activeIndicatorStyle* {String}【可选】

   当前切片的指示器样式（选择符）。如果设置，该参数会覆盖轮播组件配置参数```activeIndicatorStyle```。

- *inactiveIndicatorStyle* {String}【可选】

   隐藏切片的指示器样式（选择符）。如果设置，该参数会覆盖轮播组件配置参数```inactiveIndicatorStyle```。

- *switchInterval* {Number}【可选，默认值：0】

   自动切换间隔时间（单位：秒）。如果设置，该参数会覆盖轮播组件配置参数```switchInterval```。

- *activeEffect* {Object}【可选】

   切片被显示时的动画，其值请参考[LayerAnim开发手册](http://gallery.kissyui.com/layer-anim/1.1/guide/index.html)。
   
   该配置参数仅在初始化组件时有效，之后设置无效。

- *inactiveEffect* {Object}【可选】

   切片被隐藏时的动画，其值请参考[LayerAnim开发手册](http://gallery.kissyui.com/layer-anim/1.1/guide/index.html)。

   该配置参数仅在初始化组件时有效，之后设置无效。

- *activeIndicatorEffect* {Object}【可选】

   当前切片的指示器动画，其值请参考[LayerAnim开发手册](http://gallery.kissyui.com/layer-anim/1.1/guide/index.html)。
   
   该配置参数仅在初始化组件时有效，之后设置无效。

- *inactiveIndicatorEffect* {Object}【可选】

   被隐藏切片的指示器动画，其值请参考[LayerAnim开发手册](http://gallery.kissyui.com/layer-anim/1.1/guide/index.html)。

   该配置参数仅在初始化组件时有效，之后设置无效。

- *lazyRenderNode* {String / HTMLNode}【可选】

   延迟渲染的容器节点（选择符 / DOM节点）。该配置参数仅在初始化组件时有效，之后设置无效。

### 方法

#### 轮播组件方法

- *switchTo(slice)*

   切换到指定切片，同时触发```beforeswitch```事件。

   * 参数：

      slice {Number / 切片对象}：要切换到的切片索引或切片对象。

- *nextSlice(recurring)*

   获取当前切片的下一切片。

   * 参数：

      recurring {Boolean}：是否循环（如果循环，则最后一个切片的下一个为第一个切片）。【可选参数，默认：false】

   * 返回值：

      {Slice} 下一切片对象。

- *previousSlice(recurring)*

   获取当前切片的上一切片。

   * 参数：

      recurring {Boolean}：是否循环（如果循环，则第一个切片的上一个为最后一个切片）。【可选参数，默认：false】

   * 返回值：

      {Slice} 上一切片对象。

- *getActiveSlice()*

   获取当前切片。

   * 返回值：

      {Slice} 当前切片对象。

- *getSliceByIndex(index)*

   按索引查找切片。

   * 参数：

      index {Number}：切片索引。

   * 返回值：

      {Slice} 找到的切片对象。

- *getSliceById(id)*

   按标识查找切片。

   * 参数：

      id {String}：切片标识。

   * 返回值：

      {Slice} 找到的切片对象。

- *bindSliceEvent(name, listener, context)*

   在所有切片上，绑定DOM事件。

   * 参数：

      * name {String}：事件名称。
      * listener {Function}：事件监听方法。
      * context {Object}：事件监听方法所属对象。【可选参数，默认：window】

- *bindIndicatorEvent(name, listener, context)*

   在所有切片指示器上，绑定DOM事件。

   * 参数：

      - name {String}：事件名称。
      - listener {Function}：事件监听方法。
      - context {Object}：事件监听方法所属对象。【可选参数，默认：window】

- *startAutoSwitch(switchInterval)*

   启动定时切换。

   * 参数：

      switchInterval {Number}：定时切换间隔时间。【可选参数，默认：轮播组件配置参数```switchInterval```】

- *stopAutoSwitch()*

   停止定时切换。

- *pauseAutoSwitch()*

   暂停定时切换。如果之后用户手工切换到其它切片，则定时切换会重新启动。

- *resumeAutoSwitch()*

   如果已暂停定时切换，则调用该方法可继续定时切换。

- *isAutoSwitchStarted()*

   定时切换是否已启动。

   * 返回值：

      {Boolean} 定时切换是否已启动。

- *appendSlice(slice)*

   添加切片。切片添加后，触发```sliceadd```事件。

   * 参数：

      slice {Object / Slice}：要添加的切片（配置参数或切片对象）。

   * 返回值：

      {Slice} 已添加的切片对象。

- *insertSlice(slice, index)*

   插入切片。插入后，会触发```sliceadd```事件。

   * 参数：

      - slice {Object / Slice}：要插入的切片（配置参数或切片对象）。
      - index {Number}：插入的索引位置。【可选参数，默认：插入到最后】

   * 返回值：

      {Slice} 已插入的切片对象。

- *removeSlice(index)*

   删除切片。如果被删除的切片为当前切片，则删除后会自动显示下一个切片。如果没有下一个切片，则会显示上一切片。切片删除后，触发```sliceremove```事件。

   * 参数：

      index {Number}：被删除的切片索引。

   * 返回值：

      {Slice} 已删除的切片对象。

- *clearSlices()*

   删除所有切片。每删除一个切片，都会触发一次```sliceremove```事件。

#### 切片对象方法

- *activate()*

   切换到该切片。

- *deactivate()*

   隐藏该切片。调用该方法仅仅隐藏切片，并不会显示其它切片。

- *bindSliceEvent(name, listener, context)*

   在该切片上，绑定DOM事件。

   * 参数：

      * name {String}：事件名称。
      * listener {Function}：事件监听方法。
      * context {Object}：事件监听方法所属对象。【可选参数，默认：window】

- *displayActiveSliceStyle()*

   显示当前切片样式，将切片样式设为配置参数```activeSliceStyle```值。

- *displayInactiveSliceStyle()*

   显示隐藏切片样式，将切片样式设为配置参数```inactiveSliceStyle```值。

- *bindIndicatorEvent(name, listener, context)*

   在该切片的指示器上，绑定DOM事件。

   * 参数：

      - name {String}：事件名称。
      - listener {Function}：事件监听方法。
      - context {Object}：事件监听方法所属对象。【可选参数，默认：window】

- *displayActiveIndicatorStyle()*

   显示当前指示器样式，将指示器的样式设为配置参数```activeIndicatorStyle```值。

- *displayInactiveIndicatorStyle()*

   显示隐藏指示器样式，将指示器的样式设为配置参数```inactiveIndicatorStyle```值。

- *renderLazily()*

   延迟渲染该切片。

- *appendTo(slider)*

   将该切片添加到轮播组件。

   * 参数：

      slider {SnakeSlider}：轮播组件。

   * 返回值：

      {Slice} 该切片对象。

- *insertTo(slider, index)*

   将该切片插入到轮播组件。

   * 参数：

      - slider {SnakeSlider}：轮播组件。
      - index {Number}：插入的索引位置。【默认值：插入到最后】

   * 返回值：

      {Slice} 该切片对象。

- *remove()*

   删除该切片，同时删除相应的切片节点和指示器节点。

### 事件

#### 轮播组件事件

- *beforeswitch(e)*【事件可取消（e.preventDefault）】

   切片切换前，触发该事件。

   * 参数

      e.slice {Slice}：将要显示的切片对象。

- *afterswitch(e)*

   切片切换后，触发该事件。该事件将在```beforeswitch```事件后立即被触发，如果配置了切换动画，则该事件在动画播放前被触发。

   * 参数

      - e.slice {Slice}：当前切片对象。
      - e.sliceInactived {Slice}：被隐藏的切片对象。

- *switchnext()*【事件可取消（e.preventDefault）】

   自动切换时，切换到下个切片前，触发该事件。

- *switchprevious()*【事件可取消（e.preventDefault）】

   自动切换时，切换到上个切片前，触发该事件。

- *sliceadd(e)*

   添加切片后，触发该事件。

   * 参数

      - e.slice {Slice}：添加的切片对象。
      - e.index {Number}：插入的索引位置。

- *sliceremove(e)*

   删除切片后，触发该事件。

   * 参数

      - e.slice {Slice}：被删除的切片对象。
      - e.index {Number}：被删除的切片索引。
      - e.actived {Boolean}：被删除的切片是否为当前切片。

#### 切片对象事件

- *activeslicestyledisplay(e)*【事件可取消（e.preventDefault）】

   添加当前切片的样式前，触发该事件。

   * 参数

      e.sliceInactived {Slice}：隐藏的切片对象。

- *inactiveslicestyledisplay(e)*【事件可取消（e.preventDefault）】

   添加隐藏切片的样式前，触发该事件。

   * 参数

      e.sliceActived {Slice}：当前切片对象。

- *activeindicatorstyledisplay(e)*【事件可取消（e.preventDefault）】

   显示当前指示器的样式前，触发该事件。

   * 参数

      e.sliceInactived {Slice}：隐藏切片对象。

- *inactiveindicatorstyledisplay(e)*【事件可取消（e.preventDefault）】

   显示隐藏指示器的样式前，触发该事件。

   * 参数

      e.sliceActived {Slice}：当前切片对象。

- *lazyrender()*

   延迟渲染切片后，触发该事件。
