config({
    'gallery/snake-slider/index': {requires: ["dom", "./switching", "./auto-switch", "./indicator", "./lazy-render", "./slice-switch-effect", "./indicator-switch-effect", "./slice-management"]},
    'gallery/snake-slider/auto-switch': {requires: ["dom"]},
    'gallery/snake-slider/dom-transform': {requires: ["dom"]},
    'gallery/snake-slider/extensible': {requires: ["base"]},
    'gallery/snake-slider/indicator-switch-effect': {requires: ["dom", "gallery/layer-anim/1.1/"]},
    'gallery/snake-slider/indicator': {requires: ["dom", "event"]},
    'gallery/snake-slider/lazy-render': {requires: ["dom"]},
    'gallery/snake-slider/slice-switch-effect': {requires: ["dom", "gallery/layer-anim/1.1/"]},
    'gallery/snake-slider/switching': {requires: ["dom", "event", "./extensible", "./dom-transform", "./event-configurable"]}
});