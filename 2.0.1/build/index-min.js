KISSY.add("kg/snake-slider/2.0.1/lib/extensible",function(t,e){var i={combine:function(i,n){var c,r,a=this._cloneDeeply(this)
if(i)if(i instanceof Array)for(r=0,c=i.length;c>r;++r)a=this._mergeDeeply(a,i[r])
else a=this._mergeDeeply(a,i)
return t.extend(a,e),(r=a.CHILD_WIDGET)&&t.extend(r,e),this._addInitializer(a,n),a},plug:function(i,n){var c,r,a=this
if(i){if(i instanceof Array)for(r=0,c=i.length;c>r;++r)a=this._mergeDeeply(a,i[r])
else a=this._mergeDeeply(a,i)
t.extend(a,e),(r=a.CHILD_WIDGET)&&t.extend(r,e),this._addInitializer(a,n)}return a},_mergeDeeply:function(e,i,n){var c,r,a,s,o,l,f,d,h=e
if(e!==i&&void 0!=i)try{if(n||(n=a={},n.clone=[],n.merge=[]),s=n.merge,!e)return this._cloneDeeply(i,n.clone)
if((o=e._zoo_merged_flag)&&t.inArray(i,o))return e
if(c=Object.prototype.toString.call(i),r=Object.prototype.toString.call(e),"[object Array]"==r)return e.concat(i)
if("[object Array]"==c)return[e].concat(i)
if("[object Function]"==r&&"[object Function]"==c&&(f=e.prototype)&&!t.isEmptyObject(f)?(l=!0,h.prototype=this._mergeDeeply(f,i.prototype,n)):"[object Function]"==r&&"[object Object]"==c&&(l=!0),l||"[object Object]"==r&&!e.nodeType&&e.window!=e&&"[object Object]"==c&&!i.nodeType&&i.window!=i){s.push(e),o||(o=e._zoo_merged_flag=[]),o.push(i)
for(d in i)i.hasOwnProperty(d)&&(e[d]=this._mergeDeeply(e[d],i[d],n))}else h=[e,i]}finally{a&&(this._cleanContext(n.clone,"_zoo_cloned_flag"),this._cleanContext(s,"_zoo_merged_flag"))}return h},_cloneDeeply:function(e,i){var n,c,r,a,s
if(void 0!=e){if(r=e._zoo_cloned_flag)return r
i||(i=a=[])
try{if(c=Object.prototype.toString.call(e),"[object Function]"==c){if(!(c=e.prototype)||t.isEmptyObject(c))return e
i.push(e),n=e._zoo_cloned_flag=function(){var t,e,i=this.constructor,n=arguments,c=this.init
if(i&&(i=i.superclass)&&i.constructor.apply(this,n),c)for(c=c instanceof Array?c:[c],t=c.length,e=0;t>e;)c[e++].apply(this,n)
this.fire("zooinstanceinitialized",{args:n})},i.push(c),n.prototype=c._zoo_cloned_flag=this._cloneDeeply(c,i)}else{if("[object Array]"==c){for(n=e._zoo_cloned_flag=[],i.push(e),s=e.length;--s>-1;)n[s]=this._cloneDeeply(e[s],i)
return n}if("[object Date]"==c||"[object RegExp]"==c||"[object Error]"==c)return new e.constructor(e.valueOf())
if("[object Object]"!=c||e.nodeType||e.window==e)return e}n||(e._zoo_cloned_flag=n={},i.push(e))
for(s in e)"_zoo_cloned_flag"!=s&&"_zoo_merged_flag"!=s&&(n[s]=this._cloneDeeply(e[s],i))}finally{this._cleanContext(a,"_zoo_cloned_flag")}}return n},_cleanContext:function(t,e){if(t){for(var i=t.length;--i>-1;)delete t[i][e]
t.length=0}},_addInitializer:function(t,e){if(e){var i,n,c=function(){this.on("zooinstanceinitialized",function(t){e.apply(this,t.args)})};(i=t.prototype)&&((n=i.init)?n instanceof Array?n.push(c):i.init=[n,c]:i.init=c)}}}
return i},{requires:["base"]}),KISSY.add("kg/snake-slider/2.0.1/lib/dom-transform",function(t,e){var i={transform:function(t,e){return new this(this.dom2config(t,e))},dom2config:function(t,i){var n,c,r={transformParam:i},a=this._domTransformer
if(a&&(t=e.get(t)))if(n=a.length)for(c=0;n>c;++c)a[c].apply(this,[r,t,i])
else a.apply(this,[r,t,i])
return r}}
return i},{requires:["dom"]}),KISSY.add("kg/snake-slider/2.0.1/lib/event-configurable",function(){var t={bindEventConfiguration:function(t,e){if(e){var i,n,c
for(t instanceof Array||(t=[t]),c=t.length;--c>-1;)i=t[c],(n=e["on"+i])&&"function"==typeof n&&this.on(i,n,this)}}}
return t}),KISSY.add("kg/snake-slider/2.0.1/lib/switching",function(t,e,i,n,c,r){var a=function(){}
t.mix(a,n),t.mix(a,c),a.ATTRS={container:{value:e.get("body"),setter:function(t){var i=e.get(t)
return i?i:void 0}},activeSliceStyle:{value:"",validator:t.isString},inactiveSliceStyle:{value:"",validator:t.isString},slices:{value:[],validator:t.isArray}},a._domTransformer=function(i,n,c){i.container=n
var r,a=i.slices=[];(r=e.attr(n,"activeSliceStyle"))&&(i.activeSliceStyle=r),(r=e.attr(n,"inactiveSliceStyle"))&&(i.inactiveSliceStyle=r),c=c||{}
for(var s=this.CHILD_WIDGET,o=e.query(c.sliceSelector||".slice",n),l=0,f=o.length;f>l;++l)a[l]=s.dom2config(o[l],t.merge(c,{index:l,nodeContainer:n}))}
var s=a.prototype={init:function(t){this._sliceMap={},this.bindEventConfiguration(["beforeswitch","afterswitch"],t)
var e=this.get("slices")
this.set("slices",[]),this._addSlices(e)},bindSliceEvent:function(t,e,i){if(t&&e)for(var n=this.get("slices"),c=n.length;--c>-1;)n[c].bindSliceEvent(t,e,i)},switchTo:function(t){t="number"==typeof t?this.get("slices")[t]:t,t&&!t.get("actived")&&this.fire("beforeswitch",{slice:t})!==!1&&this.fire("afterswitch",{sliceInactived:this._switchSlice(t),slice:t})},_switchSlice:function(t){var e=this._sliceActived
return e==t&&(e=null),e&&e._deactivateSlice(t),this._sliceActived=t,t&&t._activateSlice(e),e},getSliceByIndex:function(t){return this.get("slices")[t]},getSliceById:function(t){return this._sliceMap[t]},getSlices:function(){return this.get("slices")},getActiveSlice:function(){return this._sliceActived},_addSlices:function(t){if(t)for(var e,i=this.constructor.CHILD_WIDGET,n=0,c=t.length;c>n;++n)e=t[n],this._addSlice(e instanceof i?e:new i(e),n)},_addSlice:function(t,e){var i=this.get("slices"),n=this._sliceMap,c=t.get("id"),r=i.length
for(i.splice(e,0,t);r>e;)i[r].set("index",r--)
return t._attachToParent(this,e),c&&(n[c]=t),t.get("actived")?(this._sliceActived||(this._sliceActived=t),t.set("actived",!1)):t.displayInactiveSliceStyle(),t},nextSlice:function(t){var e=this._sliceActived,i=this.get("slices"),n=0
return e&&(n=e.get("index")+1,t&&(n%=i.length)),i[n]},previousSlice:function(t){var e=this._sliceActived,i=this.get("slices"),n=0
return e&&(n=e.get("index"),n=(!t||n>0?n:i.length)-1),i[n]}}
t.mix(s,r)
var o=a.CHILD_WIDGET=function(){}
t.mix(o,c),o.ATTRS={id:{validator:t.isString},sliceNode:{setter:function(t){var i=e.get(t)
return i?i:void 0}},actived:{value:!1,setter:function(t){return!!t}},activeSliceStyle:{validator:t.isString},inactiveSliceStyle:{validator:t.isString},data:{},index:{value:-1}},o._domTransformer=function(t,i){i&&(t.sliceNode=i)
var n;(n=e.attr(i,"id"))&&(t.id=n),(n=e.attr(i,"actived"))&&(t.actived=n),(n=e.attr(i,"activeSliceStyle"))&&(t.activeSliceStyle=n),(n=e.attr(i,"inactiveSliceStyle"))&&(t.inactiveSliceStyle=n)}
var l=o.prototype={init:function(t){this.bindEventConfiguration(["activeslicestyledisplay","inactiveslicestyledisplay"],t)},bindSliceEvent:function(t,e,n){var c=this.get("sliceNode"),r=this
c&&t&&e&&(n=n||this,i.on(c,t,function(t){e.call(n,t,r._parent,r)}))},_attachToParent:function(t,e){this._parent=t,this.set("index",e)},_detachFromParent:function(){var t,e=this._parent
e&&(this._parent=null),this.set("index",-1),(t=this.get("sliceNode"))&&t.remove()},activate:function(){var t=this._parent
t?t.switchTo(this):this._activateSlice()},_activateSlice:function(t){this.set("actived",!0),this.fire("activeslicestyledisplay",{sliceInactived:t})!==!1&&this.displayActiveSliceStyle()},displayActiveSliceStyle:function(){var t=this.get("sliceNode"),i=this._parent,n=this.get("activeSliceStyle")||(i?i.get("activeSliceStyle"):""),c=this.get("inactiveSliceStyle")||(i?i.get("inactiveSliceStyle"):"")
t&&e.replaceClass(t,c,n)},deactivate:function(){var t=this._parent
this.get("actived")&&(t?t._switchSlice():this._deactivateSlice())},_deactivateSlice:function(t){this.set("actived",!1),this.fire("inactiveslicestyledisplay",{sliceActived:t})!==!1&&this.displayInactiveSliceStyle()},displayInactiveSliceStyle:function(){var t=this.get("sliceNode"),i=this._parent,n=this.get("activeSliceStyle")||(i?i.get("activeSliceStyle"):""),c=this.get("inactiveSliceStyle")||(i?i.get("inactiveSliceStyle"):"")
t&&e.replaceClass(t,n,c)}}
return t.mix(l,r),a},{requires:["dom","event","./extensible","./dom-transform","./event-configurable"]}),KISSY.add("kg/snake-slider/2.0.1/lib/auto-switch",function(t,e){var i=function(){}
i.ATTRS={switchInterval:{value:0,setter:function(t){return t=+t,isNaN(t)||0>=t?void 0:t}},hoverPause:{value:!0,setter:function(t){return!!t}},reverse:{value:!1,setter:function(t){return!!t}}},i._domTransformer=function(t,i){var n=e.attr(i,"switchInterval")
n>0&&(t.switchInterval=n),(n=e.attr(i,"hoverPause"))&&(t.hoverPause=n)},i.prototype={init:function(t){this.on("afterswitch",this.resumeAutoSwitch),this.get("hoverPause")&&(this.bindSliceEvent("mouseover",this.pauseAutoSwitch,this),this.bindSliceEvent("mouseout",this.resumeAutoSwitch,this)),this.bindEventConfiguration(["switchnext","switchprevious"],t)},isAutoSwitchStarted:function(){return this._autoSwitchEnabled},startAutoSwitch:function(t){t>0?this.set("switchInterval",t):t=this.get("switchInterval")
var e=this.switchTimerHandler,i=this
e||(e=this.switchTimerHandler=function(){var t=i.get("reverse")
i.fire(t?"switchprevious":"switchnext")!==!1&&i[t?"switchPrevious":"switchNext"].call(i)}),this._startSwitchTimer(),this._autoSwitchEnabled=!0},_startSwitchTimer:function(){this._stopSwitchTimer()
var t,e=this.getActiveSlice()
e&&(t=e.get("switchInterval")),t=t||this.get("switchInterval"),t>0&&(this.switchTimer=setTimeout(this.switchTimerHandler,1e3*t))},_stopSwitchTimer:function(){clearTimeout(this.switchTimer)},switchNext:function(){var t=this.nextSlice(!0)
t&&t.activate()},switchPrevious:function(){var t=this.previousSlice(!0)
t&&t.activate()},pauseAutoSwitch:function(){this._stopSwitchTimer()},resumeAutoSwitch:function(){this._autoSwitchEnabled&&this._startSwitchTimer()},stopAutoSwitch:function(){this._stopSwitchTimer(),this._autoSwitchEnabled=!1}}
var n=i.CHILD_WIDGET=function(){}
return n.ATTRS={switchInterval:{setter:function(t){return t=+t,isNaN(t)||0>=t?void 0:t}}},n._domTransformer=function(t,i){var n=e.attr(i,"switchInterval")
n>0&&(t.switchInterval=n)},i},{requires:["dom"]}),KISSY.add("kg/snake-slider/2.0.1/lib/indicator",function(t,e,i){var n=function(){}
n.ATTRS={activeIndicatorStyle:{value:"",validator:t.isString},inactiveIndicatorStyle:{value:"",validator:t.isString}},n._domTransformer=function(t,i){var n;(n=e.attr(i,"activeIndicatorStyle"))&&(t.activeIndicatorStyle=n),(n=e.attr(i,"inactiveIndicatorStyle"))&&(t.inactiveIndicatorStyle=n)},n.prototype={init:function(){this.on("afterswitch",this._switchIndicator)},bindIndicatorEvent:function(t,e,i){if(t&&e)for(var n=this.get("slices"),c=n.length;--c>-1;)n[c].bindIndicatorEvent(t,e,i)},_switchIndicator:function(t){var e=t.sliceInactived,i=t.slice
e==i&&(e=null),e&&e._deactivateIndicator(i),i&&i._activateIndicator(e)}}
var c=n.CHILD_WIDGET=function(){}
return c.ATTRS={indicatorNode:{setter:function(t){var i=e.get(t)
return i?i:void 0}},activeIndicatorStyle:{validator:t.isString},inactiveIndicatorStyle:{validator:t.isString}},c._domTransformer=function(t,i,n){n=n||{}
var c,r=n.nodeContainer
r&&(c=e.query(n.indicatorSelector||".slice-indicator",r)[n.index])&&(t.indicatorNode=c),(c=e.attr(i,"activeIndicatorStyle"))&&(t.activeIndicatorStyle=c),(c=e.attr(i,"inactiveIndicatorStyle"))&&(t.inactiveIndicatorStyle=c)},c.prototype={init:function(t){this.bindEventConfiguration(["activeindicatorstyledisplay","inactiveindicatorstyledisplay"],t)},bindIndicatorEvent:function(t,e,n){var c=this.get("indicatorNode"),r=this
c&&t&&e&&(n=n||window,i.on(c,t,function(t){e.call(n,t,r._parent,r)}))},_activateIndicator:function(t){this.fire("activeindicatorstyledisplay",{sliceInactived:t})!==!1&&this.displayActiveIndicatorStyle()},displayActiveIndicatorStyle:function(){var t=this.get("indicatorNode"),i=this._parent,n=this.get("activeIndicatorStyle")||(i?i.get("activeIndicatorStyle"):""),c=this.get("inactiveIndicatorStyle")||(i?i.get("inactiveIndicatorStyle"):"")
t&&e.replaceClass(t,c,n)},_deactivateIndicator:function(t){this.fire("inactiveindicatorstyledisplay",{sliceActived:t})!==!1&&this.displayInactiveIndicatorStyle()},displayInactiveIndicatorStyle:function(){var t=this.get("indicatorNode"),i=this._parent,n=this.get("activeIndicatorStyle")||(i?i.get("activeIndicatorStyle"):""),c=this.get("inactiveIndicatorStyle")||(i?i.get("inactiveIndicatorStyle"):"")
t&&e.replaceClass(t,n,c)},removeIndicator:function(){var t=this.get("indicatorNode")
t&&e.remove(t)}},n},{requires:["dom","event"]}),KISSY.add("kg/snake-slider/2.0.1/lib/lazy-render",function(t,e){var i=function(){}
i.prototype={init:function(){this.on("beforeswitch",this._lazyRenderHandler)},_lazyRenderHandler:function(t){var e=t.slice
e&&(e.renderLazily(),this.detach(this._lazyRenderHandler))}}
var n=i.CHILD_WIDGET=function(){}
return n.ATTRS={lazyRenderNode:{setter:function(t){var i=e.get(t)
return i?i:void 0}}},n._domTransformer=function(t,i,n){n=n||{}
var c;(c=e.get(n.lazyRenderSelector||".slice-lazy",i))&&(t.lazyRenderNode=c)},n.prototype={init:function(t){this.bindEventConfiguration(["lazyrender"],t)},renderLazily:function(){var t=this.get("lazyRenderNode")
t&&!this._lazyRendered&&(e.style(t,"display","none"),e.insertBefore(e.create(e.html(t)),t,!0),this._lazyRendered=!0,this.fire("lazyrender"))}},i},{requires:["dom"]}),KISSY.add("kg/snake-slider/2.0.1/lib/slice-switch-effect",function(KISSY,DOM,LayerAnim){var SwitchEffect=function(){}
SwitchEffect.prototype={pauseEffect:function(){var t=this.getActiveSlice()
t&&t.pauseEffect()},resumeEffect:function(){var t=this.getActiveSlice()
t&&t.resumeEffect()}}
var SliceSwitchEffect=SwitchEffect.CHILD_WIDGET=function(){},propValidator=function(t){return t&&"object"==typeof t}
SliceSwitchEffect.ATTRS={activeEffect:{validator:propValidator},inactiveEffect:{validator:propValidator}}
var _parseEffectCfg=function(node,attr,selector){var effect=DOM.attr(node,attr),effects,nodes,size,cfg,n,i
try{for(effect?(effect=eval("("+effect+")"),effect.node||(effect.node=node),effects=[effect]):effects=[],nodes=DOM.query(selector,node),i=0,size=nodes.length;size>i;++i)n=nodes[i],(cfg=DOM.attr(n,attr))&&(effects.push(effect=eval("("+cfg+")")),effect.node=n)
return effects.length?effects:null}catch(e){KISSY.log("SliceSwitchEffect: invalid configuration - "+attr+".\n"+e.message)}}
return SliceSwitchEffect._domTransformer=function(t,e,i){i=i||{}
var n=i.sliceLayerSelector||".slice-layer"
t.activeEffect=_parseEffectCfg(e,"activeEffect",n),t.inactiveEffect=_parseEffectCfg(e,"inactiveEffect",n)},SliceSwitchEffect.prototype={init:function(t){var e
t&&(e=t.transformParam)&&this.on("lazyrender",function(){this._generateEffectConfig(e)}),this.on("activeslicestyledisplay",this._runActiveEffect),this.on("inactiveslicestyledisplay",this._runInactiveEffect)},_generateEffectConfig:function(t){var e={}
SliceSwitchEffect._domTransformer(e,this.get("sliceNode"),t),this.set("activeEffect",e.activeEffect),this.set("inactiveEffect",e.inactiveEffect)},_getSliceEffect:function(t,e,i,n){var c,r=t?"activeEffect":"inactiveEffect",a=this.get(r)
return a?(r+="Anim",c=this[r]=new LayerAnim(a),c.on("end",n,this),c):void 0},_runActiveEffect:function(t){var e,i=t.sliceInactived
return(e=this._getSliceEffect(!0,this,i,this.displayActiveSliceStyle))?(e.run(),!1):void 0},_runInactiveEffect:function(t){var e
return(e=this._getSliceEffect(!1,t.sliceActived,this,this.displayInactiveSliceStyle))?(e.run(),!1):void 0},stopEffect:function(t){if(t){var e;(e=this[t+"Anim"])&&e.stop()}else this.stopEffect("activeEffect"),this.stopEffect("inactiveEffect")},pauseEffect:function(t){if(t){var e;(e=this[t+"Anim"])&&e.pause()}else this.pauseEffect("activeEffect"),this.pauseEffect("inactiveEffect")},resumeEffect:function(t){if(t){var e;(e=this[t+"Anim"])&&e.resume()}else this.resumeEffect("activeEffect"),this.resumeEffect("inactiveEffect")}},SwitchEffect},{requires:["dom","kg/layer-anim/2.0.0/"]}),KISSY.add("kg/snake-slider/2.0.1/lib/indicator-switch-effect",function(KISSY,DOM,LayerAnim){var IndicatorSwitchEffect=function(){},SliceIndicatorSwitchEffect=IndicatorSwitchEffect.CHILD_WIDGET=function(){},propValidator=function(t){return t&&"object"==typeof t}
SliceIndicatorSwitchEffect.ATTRS={activeIndicatorEffect:{validator:propValidator},inactiveIndicatorEffect:{validator:propValidator}}
var _parseIndicatorEffectCfg=function(node,attr,selector){var effect=DOM.attr(node,attr),effects,nodes,size,cfg,n,i
try{for(effect?(effect=eval("("+effect+")"),effect.node||(effect.node=node),effects=[effect]):effects=[],nodes=DOM.query(selector,node),i=0,size=nodes.length;size>i;++i)n=nodes[i],(cfg=DOM.attr(n,attr))&&(effects.push(effect=eval("("+cfg+")")),effect.node=n)
return effects.length?effects:null}catch(e){KISSY.log("SliceIndicatorSwitchEffect: invalid configuration - "+attr+".\n"+e.message)}}
return SliceIndicatorSwitchEffect._domTransformer=function(t,e,i){i=i||{}
var n=i.indicatorLayerSelector||".indicator-layer"
t.activeIndicatorEffect=_parseIndicatorEffectCfg(e,"activeIndicatorEffect",n),t.inactiveIndicatorEffect=_parseIndicatorEffectCfg(e,"inactiveIndicatorEffect",n)},SliceIndicatorSwitchEffect.prototype={init:function(){this.on("activeindicatorstyledisplay",this._runActiveIndicatorEffect),this.on("inactiveindicatorstyledisplay",this._runInactiveIndicatorEffect)},_getIndicatorEffect:function(t){var e,i=t?"activeIndicatorEffect":"inactiveIndicatorEffect",n=this.get(i)
return n?(i+="Anim",e=this[i],e=this[i]=new LayerAnim(n)):void 0},_runActiveIndicatorEffect:function(){var t;(t=this._getIndicatorEffect(!0))&&t.run()},_runInactiveIndicatorEffect:function(){var t;(t=this._getIndicatorEffect(!1))&&t.run()},stopIndicatorEffect:function(t){if(t){var e;(e=this[t+"Anim"])&&e.stop()}else this.stopIndicatorEffect("activeIndicatorEffect"),this.stopIndicatorEffect("inactiveIndicatorEffect")}},IndicatorSwitchEffect},{requires:["dom","kg/layer-anim/2.0.0/"]}),KISSY.add("kg/snake-slider/2.0.1/lib/slice-management",function(KISSY){var Management=function(){}
Management.prototype={init:function(t){this.bindEventConfiguration(["sliceadd","sliceremove"],t)},appendSlice:function(t){return this.insertSlice(t)},insertSlice:function(slice,index){if(slice&&("string"==typeof slice&&(slice=eval("("+slice+")")),"object"==typeof slice)){var SliceClass=this.constructor.CHILD_WIDGET,slices=this.get("slices"),size=slices.length
return slice instanceof SliceClass||(slice=new SliceClass(slice)),index=null==index?size:0>index?0:Math.min(index,size),this._addSlice(slice,index),this.fire("sliceadd",{slice:slice,index:index}),slice}},removeSlice:function(t){var e,i=this.get("slices"),n=i[t]
return n?(e=n.get("actived"),this.getActiveSlice()==n&&this._switchSlice(),this._delSlice(n),this.fire("sliceremove",{slice:n,index:t,actived:e}),n):void 0},_delSlice:function(t){var e=this.get("slices"),i=this.sliceMap,n=t.id,c=t.get("index"),r=e.length-1
for(e.splice(c,1);--r>=c;)e[r].set("index",r)
n&&delete i[n],t._detachFromParent()},clearSlices:function(){for(var t,e=this.get("slices"),i=e.length,n=this.getActiveSlice();t=e[--i];)t!=n&&this.removeSlice(i)
this.removeSlice(0)}}
var SliceManagement=Management.CHILD_WIDGET=function(){}
return SliceManagement.prototype={appendTo:function(t){return this.insertTo(t)},insertTo:function(t,e){return t?t.insertSlice(this,e):void 0},remove:function(){var t=this._parent
return t?t.removeSlice(this.get("index")):void 0}},Management}),KISSY.add("kg/snake-slider/2.0.1/index",function(t,e,i,n,c,r,a,s,o){var l=function(){}
l.ATTRS={switchOnIndicator:{value:"mouseover"}},l._domTransformer=function(t,i){var n;(n=e.attr(i,"switchOnIndicator"))&&(t.switchOnIndicator=n)}
var f=function(){this.bindIndicatorEvent(this.get("switchOnIndicator"),function(t,e,i){t.preventDefault(),i.activate()},this),this.on("sliceremove",function(t){if(t.actived){var e,i=t.index,n=this.get("slices");(e=n[i]||n[i-1])&&e.activate()}t.slice.removeIndicator()})
var t=this._sliceActived
t||(t=this.getSliceByIndex(0)),this.switchTo(t),this.startAutoSwitch()}
return i.combine([c,n,r,a,s,o,l],f)},{requires:["dom","./lib/switching","./lib/auto-switch","./lib/indicator","./lib/lazy-render","./lib/slice-switch-effect","./lib/indicator-switch-effect","./lib/slice-management"]})
