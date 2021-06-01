(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/BlockController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e74a8E4HD5K97D/9d6IOq3s', 'BlockController', __filename);
// Scripts/BlockController.js

'use strict';

var colors = require("Colors");

cc.Class({
    extends: cc.Component,

    properties: {
        titleBlock: {
            default: null,
            type: cc.Label
        }
    },

    onLoad: function onLoad() {},
    setNumber: function setNumber(number) {
        if (number === 0) {
            this.titleBlock.node.active = false;
            this.node.color = colors[0];
        } else {
            this.titleBlock.string = number;
            this.titleBlock.node.active = true;
            this.titleBlock.node.color = cc.Color.WHITE;
            if (number in colors) {
                this.node.color = colors[number];
            }
            if (number == 2) {
                this.titleBlock.node.color = cc.color('#635B52');
            }
            if (number == 4) {
                this.titleBlock.node.color = cc.color('#635B52');
            }
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=BlockController.js.map
        