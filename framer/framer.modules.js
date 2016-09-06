require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Pointer":[function(require,module,exports){
exports.Pointer = (function() {
  var clientCoords, coords, offsetArgumentError, offsetCoords, screenArgumentError;

  function Pointer() {}

  Pointer.screen = function(event, layer) {
    var e, screenCoords;
    if (!((event != null) && (layer != null))) {
      screenArgumentError();
    }
    e = offsetCoords(event);
    if (e.x && e.y) {
      screenCoords = layer.screenFrame;
      e.x += screenCoords.x;
      e.y += screenCoords.y;
    } else {
      e = clientCoords(event);
    }
    return e;
  };

  Pointer.offset = function(event, layer) {
    var e, targetScreenCoords;
    if (!((event != null) && (layer != null))) {
      offsetArgumentError();
    }
    e = offsetCoords(event);
    if (!((e.x != null) && (e.y != null))) {
      e = clientCoords(event);
      targetScreenCoords = layer.screenFrame;
      e.x -= targetScreenCoords.x;
      e.y -= targetScreenCoords.y;
    }
    return e;
  };

  offsetCoords = function(ev) {
    var e;
    e = Events.touchEvent(ev);
    return coords(e.offsetX, e.offsetY);
  };

  clientCoords = function(ev) {
    var e;
    e = Events.touchEvent(ev);
    return coords(e.clientX, e.clientY);
  };

  coords = function(x, y) {
    return {
      x: x,
      y: y
    };
  };

  screenArgumentError = function() {
    error(null);
    return console.error("Pointer.screen() Error: You must pass event & layer arguments. \n\nExample: layer.on Events.TouchStart,(event,layer) -> Pointer.screen(event, layer)");
  };

  offsetArgumentError = function() {
    error(null);
    return console.error("Pointer.offset() Error: You must pass event & layer arguments. \n\nExample: layer.on Events.TouchStart,(event,layer) -> Pointer.offset(event, layer)");
  };

  return Pointer;

})();


},{}],"TextLayer":[function(require,module,exports){
var TextLayer, convertTextLayers, convertToTextLayer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

TextLayer = (function(superClass) {
  extend(TextLayer, superClass);

  function TextLayer(options) {
    if (options == null) {
      options = {};
    }
    this.doAutoSize = false;
    this.doAutoSizeHeight = false;
    if (options.backgroundColor == null) {
      options.backgroundColor = options.setup ? "hsla(60, 90%, 47%, .4)" : "transparent";
    }
    if (options.color == null) {
      options.color = "red";
    }
    if (options.lineHeight == null) {
      options.lineHeight = 1.25;
    }
    if (options.fontFamily == null) {
      options.fontFamily = "Helvetica";
    }
    if (options.fontSize == null) {
      options.fontSize = 20;
    }
    if (options.text == null) {
      options.text = "Use layer.text to add text";
    }
    TextLayer.__super__.constructor.call(this, options);
    this.style.whiteSpace = "pre-line";
    this.style.outline = "none";
  }

  TextLayer.prototype.setStyle = function(property, value, pxSuffix) {
    if (pxSuffix == null) {
      pxSuffix = false;
    }
    this.style[property] = pxSuffix ? value + "px" : value;
    this.emit("change:" + property, value);
    if (this.doAutoSize) {
      return this.calcSize();
    }
  };

  TextLayer.prototype.calcSize = function() {
    var constraints, size, sizeAffectingStyles;
    sizeAffectingStyles = {
      lineHeight: this.style["line-height"],
      fontSize: this.style["font-size"],
      fontWeight: this.style["font-weight"],
      paddingTop: this.style["padding-top"],
      paddingRight: this.style["padding-right"],
      paddingBottom: this.style["padding-bottom"],
      paddingLeft: this.style["padding-left"],
      textTransform: this.style["text-transform"],
      borderWidth: this.style["border-width"],
      letterSpacing: this.style["letter-spacing"],
      fontFamily: this.style["font-family"],
      fontStyle: this.style["font-style"],
      fontVariant: this.style["font-variant"]
    };
    constraints = {};
    if (this.doAutoSizeHeight) {
      constraints.width = this.width;
    }
    size = Utils.textSize(this.text, sizeAffectingStyles, constraints);
    if (this.style.textAlign === "right") {
      this.width = size.width;
      this.x = this.x - this.width;
    } else {
      this.width = size.width;
    }
    return this.height = size.height;
  };

  TextLayer.define("autoSize", {
    get: function() {
      return this.doAutoSize;
    },
    set: function(value) {
      this.doAutoSize = value;
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("autoSizeHeight", {
    set: function(value) {
      this.doAutoSize = value;
      this.doAutoSizeHeight = value;
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("contentEditable", {
    set: function(boolean) {
      this._element.contentEditable = boolean;
      this.ignoreEvents = !boolean;
      return this.on("input", function() {
        if (this.doAutoSize) {
          return this.calcSize();
        }
      });
    }
  });

  TextLayer.define("text", {
    get: function() {
      return this._element.textContent;
    },
    set: function(value) {
      this._element.textContent = value;
      this.emit("change:text", value);
      if (this.doAutoSize) {
        return this.calcSize();
      }
    }
  });

  TextLayer.define("fontFamily", {
    get: function() {
      return this.style.fontFamily;
    },
    set: function(value) {
      return this.setStyle("fontFamily", value);
    }
  });

  TextLayer.define("fontSize", {
    get: function() {
      return this.style.fontSize.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("fontSize", value, true);
    }
  });

  TextLayer.define("lineHeight", {
    get: function() {
      return this.style.lineHeight;
    },
    set: function(value) {
      return this.setStyle("lineHeight", value);
    }
  });

  TextLayer.define("fontWeight", {
    get: function() {
      return this.style.fontWeight;
    },
    set: function(value) {
      return this.setStyle("fontWeight", value);
    }
  });

  TextLayer.define("fontStyle", {
    get: function() {
      return this.style.fontStyle;
    },
    set: function(value) {
      return this.setStyle("fontStyle", value);
    }
  });

  TextLayer.define("fontVariant", {
    get: function() {
      return this.style.fontVariant;
    },
    set: function(value) {
      return this.setStyle("fontVariant", value);
    }
  });

  TextLayer.define("padding", {
    set: function(value) {
      this.setStyle("paddingTop", value, true);
      this.setStyle("paddingRight", value, true);
      this.setStyle("paddingBottom", value, true);
      return this.setStyle("paddingLeft", value, true);
    }
  });

  TextLayer.define("paddingTop", {
    get: function() {
      return this.style.paddingTop.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingTop", value, true);
    }
  });

  TextLayer.define("paddingRight", {
    get: function() {
      return this.style.paddingRight.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingRight", value, true);
    }
  });

  TextLayer.define("paddingBottom", {
    get: function() {
      return this.style.paddingBottom.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingBottom", value, true);
    }
  });

  TextLayer.define("paddingLeft", {
    get: function() {
      return this.style.paddingLeft.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("paddingLeft", value, true);
    }
  });

  TextLayer.define("textAlign", {
    set: function(value) {
      return this.setStyle("textAlign", value);
    }
  });

  TextLayer.define("textTransform", {
    get: function() {
      return this.style.textTransform;
    },
    set: function(value) {
      return this.setStyle("textTransform", value);
    }
  });

  TextLayer.define("letterSpacing", {
    get: function() {
      return this.style.letterSpacing.replace("px", "");
    },
    set: function(value) {
      return this.setStyle("letterSpacing", value, true);
    }
  });

  TextLayer.define("length", {
    get: function() {
      return this.text.length;
    }
  });

  return TextLayer;

})(Layer);

convertToTextLayer = function(layer) {
  var css, cssObj, importPath, t;
  t = new TextLayer({
    name: layer.name,
    frame: layer.frame,
    parent: layer.parent
  });
  cssObj = {};
  css = layer._info.metadata.css;
  css.forEach(function(rule) {
    var arr;
    if (_.includes(rule, '/*')) {
      return;
    }
    arr = rule.split(': ');
    return cssObj[arr[0]] = arr[1].replace(';', '');
  });
  t.style = cssObj;
  importPath = layer.__framerImportedFromPath;
  if (_.includes(importPath, '@2x')) {
    t.fontSize *= 2;
    t.lineHeight = (parseInt(t.lineHeight) * 2) + 'px';
    t.letterSpacing *= 2;
  }
  t.y -= (parseInt(t.lineHeight) - t.fontSize) / 2;
  t.y -= t.fontSize * 0.1;
  t.x -= t.fontSize * 0.08;
  t.width += t.fontSize * 0.5;
  t.text = layer._info.metadata.string;
  layer.destroy();
  return t;
};

Layer.prototype.convertToTextLayer = function() {
  return convertToTextLayer(this);
};

convertTextLayers = function(obj) {
  var layer, prop, results;
  results = [];
  for (prop in obj) {
    layer = obj[prop];
    if (layer._info.kind === "text") {
      results.push(obj[prop] = convertToTextLayer(layer));
    } else {
      results.push(void 0);
    }
  }
  return results;
};

Layer.prototype.frameAsTextLayer = function(properties) {
  var t;
  t = new TextLayer;
  t.frame = this.frame;
  t.superLayer = this.superLayer;
  _.extend(t, properties);
  this.destroy();
  return t;
};

exports.TextLayer = TextLayer;

exports.convertTextLayers = convertTextLayers;


},{}],"ViewController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = (function(superClass) {
  extend(exports, superClass);

  function exports(options) {
    var autoInitial, backButtons, btn, i, len, transitions;
    if (options == null) {
      options = {};
    }
    if (options.width == null) {
      options.width = Screen.width;
    }
    if (options.height == null) {
      options.height = Screen.height;
    }
    if (options.clip == null) {
      options.clip = true;
    }
    if (options.initialViewName == null) {
      options.initialViewName = 'initialView';
    }
    if (options.backButtonName == null) {
      options.backButtonName = 'backButton';
    }
    if (options.animationOptions == null) {
      options.animationOptions = {
        curve: "cubic-bezier(0.19, 1, 0.22, 1)",
        time: .7
      };
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = "black";
    }
    if (options.scroll == null) {
      options.scroll = false;
    }
    if (options.autoLink == null) {
      options.autoLink = true;
    }
    exports.__super__.constructor.call(this, options);
    this.history = [];
    this.onChange("subLayers", (function(_this) {
      return function(changeList) {
        var c, children, i, len, scrollComponent, view;
        view = changeList.added[0];
        if (view != null) {
          view.clip = true;
          view.on(Events.Click, function() {});
          if (_this.scroll) {
            children = view.children;
            scrollComponent = new ScrollComponent({
              name: "scrollComponent",
              width: _this.width,
              height: _this.height,
              parent: view
            });
            scrollComponent.content.backgroundColor = "";
            if (view.width <= _this.width) {
              scrollComponent.scrollHorizontal = false;
            }
            if (view.height <= _this.height) {
              scrollComponent.scrollVertical = false;
            }
            for (i = 0, len = children.length; i < len; i++) {
              c = children[i];
              c.parent = scrollComponent.content;
            }
            view.scrollComponent = scrollComponent;
            return view.size = {
              width: _this.width,
              height: _this.height
            };
          }
        }
      };
    })(this));
    transitions = {
      switchInstant: {
        newView: {
          to: {
            x: 0,
            y: 0
          }
        }
      },
      fadeIn: {
        newView: {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        }
      },
      zoomIn: {
        newView: {
          from: {
            scale: 0.8,
            opacity: 0
          },
          to: {
            scale: 1,
            opacity: 1
          }
        }
      },
      zoomOut: {
        oldView: {
          to: {
            scale: 0.8,
            opacity: 0
          }
        },
        newView: {
          to: {}
        }
      },
      slideInUp: {
        newView: {
          from: {
            y: this.height
          },
          to: {
            y: 0
          }
        }
      },
      slideInRight: {
        newView: {
          from: {
            x: this.width
          },
          to: {
            x: 0
          }
        }
      },
      slideInDown: {
        newView: {
          from: {
            maxY: 0
          },
          to: {
            y: 0
          }
        }
      },
      moveInRight: {
        oldView: {
          to: {
            maxX: 0
          }
        },
        newView: {
          from: {
            x: this.width
          },
          to: {
            x: 0
          }
        }
      },
      moveInLeft: {
        oldView: {
          to: {
            x: this.width
          }
        },
        newView: {
          from: {
            maxX: 0
          },
          to: {
            x: 0
          }
        }
      },
      slideInLeft: {
        newView: {
          from: {
            maxX: 0
          },
          to: {
            maxX: this.width
          }
        }
      },
      pushInRight: {
        oldView: {
          to: {
            x: -(this.width / 5),
            brightness: 70
          }
        },
        newView: {
          from: {
            x: this.width
          },
          to: {
            x: 0
          }
        }
      },
      pushInLeft: {
        oldView: {
          to: {
            x: this.width / 5,
            brightness: 70
          }
        },
        newView: {
          from: {
            x: -this.width
          },
          to: {
            x: 0
          }
        }
      },
      pushOutRight: {
        oldView: {
          to: {
            x: this.width
          }
        },
        newView: {
          from: {
            x: -(this.width / 5),
            brightness: 70
          },
          to: {
            x: 0,
            brightness: 100
          }
        }
      },
      pushOutLeft: {
        oldView: {
          to: {
            maxX: 0
          }
        },
        newView: {
          from: {
            x: this.width / 5,
            brightness: 70
          },
          to: {
            x: 0,
            brightness: 100
          }
        }
      },
      slideOutUp: {
        oldView: {
          to: {
            maxY: 0
          }
        },
        newView: {
          to: {}
        }
      },
      slideOutRight: {
        oldView: {
          to: {
            x: this.width
          }
        },
        newView: {
          to: {}
        }
      },
      slideOutDown: {
        oldView: {
          to: {
            y: this.height
          }
        },
        newView: {
          to: {}
        }
      },
      slideOutLeft: {
        oldView: {
          to: {
            maxX: 0
          }
        },
        newView: {
          to: {}
        }
      },
      androidPushIn: {
        newView: {
          from: {
            y: this.height / 5,
            opacity: 0
          },
          to: {
            y: 0,
            opacity: 1
          }
        }
      }
    };
    transitions.slideIn = transitions.slideInRight;
    transitions.slideOut = transitions.slideOutRight;
    transitions.pushIn = transitions.pushInRight;
    transitions.pushOut = transitions.pushOutRight;
    Events.ViewWillSwitch = "viewWillSwitch";
    Events.ViewDidSwitch = "viewDidSwitch";
    Layer.prototype.onViewWillSwitch = function(cb) {
      return this.on(Events.ViewWillSwitch, cb);
    };
    Layer.prototype.onViewDidSwitch = function(cb) {
      return this.on(Events.ViewDidSwitch, cb);
    };
    _.each(transitions, (function(_this) {
      return function(animProps, name) {
        var btn, i, layers, len, viewController;
        if (options.autoLink) {
          layers = Framer.CurrentContext.getLayers();
          for (i = 0, len = layers.length; i < len; i++) {
            btn = layers[i];
            if (_.includes(btn.name, name)) {
              viewController = _this;
              btn.onClick(function() {
                var anim, linkName;
                anim = this.name.split('_')[0];
                linkName = this.name.replace(anim + '_', '');
                linkName = linkName.replace(/\d+/g, '');
                return viewController[anim](_.find(layers, function(l) {
                  return l.name === linkName;
                }));
              });
            }
          }
        }
        return _this[name] = function(newView, animationOptions) {
          var animObj, hook, incoming, outgoing, ref, ref1, ref2, ref3, ref4, ref5, ref6;
          if (animationOptions == null) {
            animationOptions = _this.animationOptions;
          }
          if (newView === _this.currentView) {
            return;
          }
          newView.parent = _this;
          newView.sendToBack();
          newView.point = {
            x: 0,
            y: 0
          };
          newView.opacity = 1;
          newView.scale = 1;
          newView.brightness = 100;
          if ((ref = _this.currentView) != null) {
            ref.point = {
              x: 0,
              y: 0
            };
          }
          if ((ref1 = _this.currentView) != null) {
            ref1.props = (ref2 = animProps.oldView) != null ? ref2.from : void 0;
          }
          animObj = _.extend({
            properties: (ref3 = animProps.oldView) != null ? ref3.to : void 0
          }, animationOptions);
          _.defaults(animObj, {
            properties: {}
          });
          outgoing = (ref4 = _this.currentView) != null ? ref4.animate(animObj) : void 0;
          newView.props = (ref5 = animProps.newView) != null ? ref5.from : void 0;
          incoming = newView.animate(_.extend({
            properties: (ref6 = animProps.newView) != null ? ref6.to : void 0
          }, animationOptions));
          if (_.includes(name, 'Out')) {
            newView.placeBehind(_this.currentView);
            outgoing.on(Events.AnimationEnd, function() {
              return _this.currentView.bringToFront();
            });
          } else {
            newView.placeBefore(_this.currentView);
          }
          _this.emit(Events.ViewWillSwitch, _this.currentView, newView);
          _this.saveCurrentViewToHistory(name, outgoing, incoming);
          _this.currentView = newView;
          _this.emit("change:previousView", _this.previousView);
          _this.emit("change:currentView", _this.currentView);
          if (incoming.isAnimating) {
            hook = incoming;
          } else {
            hook = outgoing;
          }
          return hook.on(Events.AnimationEnd, function() {
            return _this.emit(Events.ViewDidSwitch, _this.previousView, _this.currentView);
          });
        };
      };
    })(this));
    if (options.initialViewName != null) {
      autoInitial = _.find(Framer.CurrentContext.getLayers(), function(l) {
        return l.name === options.initialViewName;
      });
      if (autoInitial != null) {
        this.switchInstant(autoInitial);
      }
    }
    if (options.initialView != null) {
      this.switchInstant(options.initialView);
    }
    if (options.backButtonName != null) {
      backButtons = _.filter(Framer.CurrentContext.getLayers(), function(l) {
        return _.includes(l.name, options.backButtonName);
      });
      for (i = 0, len = backButtons.length; i < len; i++) {
        btn = backButtons[i];
        btn.onClick((function(_this) {
          return function() {
            return _this.back();
          };
        })(this));
      }
    }
  }

  exports.define("previousView", {
    get: function() {
      return this.history[0].view;
    }
  });

  exports.prototype.saveCurrentViewToHistory = function(name, outgoingAnimation, incomingAnimation) {
    return this.history.unshift({
      view: this.currentView,
      animationName: name,
      incomingAnimation: incomingAnimation,
      outgoingAnimation: outgoingAnimation
    });
  };

  exports.prototype.back = function() {
    var backIn, moveOut, previous;
    previous = this.history[0];
    if (previous.view != null) {
      if (_.includes(previous.animationName, 'Out')) {
        previous.view.bringToFront();
      }
      backIn = previous.outgoingAnimation.reverse();
      moveOut = previous.incomingAnimation.reverse();
      backIn.start();
      moveOut.start();
      this.currentView = previous.view;
      this.history.shift();
      return moveOut.on(Events.AnimationEnd, (function(_this) {
        return function() {
          return _this.currentView.bringToFront();
        };
      })(this));
    }
  };

  return exports;

})(Layer);


},{}],"androidRipple":[function(require,module,exports){
var Pointer;

Pointer = require("Pointer").Pointer;

exports.Ripple = function(event, layer) {
  var animation, color, eventCoords, pressFeedback, rippleCircle, rippleColor;
  eventCoords = Pointer.offset(event, layer);
  rippleColor = layer.rippleColor ? layer.rippleColor : "black";
  color = rippleColor;
  animation = {
    curve: "ease-out",
    time: .4
  };
  pressFeedback = new Layer({
    superLayer: this,
    name: "pressFeedback",
    width: layer.width,
    height: layer.height,
    opacity: 0,
    backgroundColor: rippleColor
  });
  pressFeedback.states.add({
    pressed: {
      opacity: .04
    }
  });
  pressFeedback.states["switch"]("pressed", animation);
  rippleCircle = new Layer({
    superLayer: this,
    name: "rippleCircle",
    borderRadius: "50%",
    midX: eventCoords.x,
    midY: eventCoords.y,
    opacity: .16,
    backgroundColor: rippleColor
  });
  rippleCircle.states.add({
    pressed: {
      scale: layer.width / 60,
      opacity: 0
    }
  });
  rippleCircle.states["switch"]("pressed", animation);
  return Utils.delay(0.3, function() {
    pressFeedback.states.next("default", animation);
    return pressFeedback.on(Events.AnimationEnd, function() {
      rippleCircle.destroy();
      return pressFeedback.destroy();
    });
  });
};


},{"Pointer":"Pointer"}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvVGhlTWFudXovQ29kZVByb2plY3RzL0ZyYW1lckpTL0ZyYW1lckpTX0Ryb3BQYXkgLSBNZXJjaGFudCBQYXltZW50IFVzZXIgRmVlZGJhY2suZnJhbWVyL21vZHVsZXMvUG9pbnRlci5jb2ZmZWUiLCIvVXNlcnMvVGhlTWFudXovQ29kZVByb2plY3RzL0ZyYW1lckpTL0ZyYW1lckpTX0Ryb3BQYXkgLSBNZXJjaGFudCBQYXltZW50IFVzZXIgRmVlZGJhY2suZnJhbWVyL21vZHVsZXMvVGV4dExheWVyLmNvZmZlZSIsIi9Vc2Vycy9UaGVNYW51ei9Db2RlUHJvamVjdHMvRnJhbWVySlMvRnJhbWVySlNfRHJvcFBheSAtIE1lcmNoYW50IFBheW1lbnQgVXNlciBGZWVkYmFjay5mcmFtZXIvbW9kdWxlcy9WaWV3Q29udHJvbGxlci5jb2ZmZWUiLCIvVXNlcnMvVGhlTWFudXovQ29kZVByb2plY3RzL0ZyYW1lckpTL0ZyYW1lckpTX0Ryb3BQYXkgLSBNZXJjaGFudCBQYXltZW50IFVzZXIgRmVlZGJhY2suZnJhbWVyL21vZHVsZXMvYW5kcm9pZFJpcHBsZS5jb2ZmZWUiLCIvVXNlcnMvVGhlTWFudXovQ29kZVByb2plY3RzL0ZyYW1lckpTL0ZyYW1lckpTX0Ryb3BQYXkgLSBNZXJjaGFudCBQYXltZW50IFVzZXIgRmVlZGJhY2suZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDb0JNLE9BQU8sQ0FBQztBQUtiLE1BQUE7Ozs7RUFBQSxPQUFDLENBQUEsTUFBRCxHQUFVLFNBQUMsS0FBRCxFQUFRLEtBQVI7QUFDVCxRQUFBO0lBQUEsSUFBQSxDQUFBLENBQTZCLGVBQUEsSUFBVyxlQUF4QyxDQUFBO01BQUEsbUJBQUEsQ0FBQSxFQUFBOztJQUNBLENBQUEsR0FBSSxZQUFBLENBQWEsS0FBYjtJQUNKLElBQUcsQ0FBQyxDQUFDLENBQUYsSUFBUSxDQUFDLENBQUMsQ0FBYjtNQUVDLFlBQUEsR0FBZSxLQUFLLENBQUM7TUFDckIsQ0FBQyxDQUFDLENBQUYsSUFBTyxZQUFZLENBQUM7TUFDcEIsQ0FBQyxDQUFDLENBQUYsSUFBTyxZQUFZLENBQUMsRUFKckI7S0FBQSxNQUFBO01BT0MsQ0FBQSxHQUFJLFlBQUEsQ0FBYSxLQUFiLEVBUEw7O0FBUUEsV0FBTztFQVhFOztFQWFWLE9BQUMsQ0FBQSxNQUFELEdBQVUsU0FBQyxLQUFELEVBQVEsS0FBUjtBQUNULFFBQUE7SUFBQSxJQUFBLENBQUEsQ0FBNkIsZUFBQSxJQUFXLGVBQXhDLENBQUE7TUFBQSxtQkFBQSxDQUFBLEVBQUE7O0lBQ0EsQ0FBQSxHQUFJLFlBQUEsQ0FBYSxLQUFiO0lBQ0osSUFBQSxDQUFBLENBQU8sYUFBQSxJQUFTLGFBQWhCLENBQUE7TUFFQyxDQUFBLEdBQUksWUFBQSxDQUFhLEtBQWI7TUFDSixrQkFBQSxHQUFxQixLQUFLLENBQUM7TUFDM0IsQ0FBQyxDQUFDLENBQUYsSUFBTyxrQkFBa0IsQ0FBQztNQUMxQixDQUFDLENBQUMsQ0FBRixJQUFPLGtCQUFrQixDQUFDLEVBTDNCOztBQU1BLFdBQU87RUFURTs7RUFjVixZQUFBLEdBQWUsU0FBQyxFQUFEO0FBQVMsUUFBQTtJQUFBLENBQUEsR0FBSSxNQUFNLENBQUMsVUFBUCxDQUFrQixFQUFsQjtBQUFzQixXQUFPLE1BQUEsQ0FBTyxDQUFDLENBQUMsT0FBVCxFQUFrQixDQUFDLENBQUMsT0FBcEI7RUFBMUM7O0VBQ2YsWUFBQSxHQUFlLFNBQUMsRUFBRDtBQUFTLFFBQUE7SUFBQSxDQUFBLEdBQUksTUFBTSxDQUFDLFVBQVAsQ0FBa0IsRUFBbEI7QUFBc0IsV0FBTyxNQUFBLENBQU8sQ0FBQyxDQUFDLE9BQVQsRUFBa0IsQ0FBQyxDQUFDLE9BQXBCO0VBQTFDOztFQUNmLE1BQUEsR0FBZSxTQUFDLENBQUQsRUFBRyxDQUFIO0FBQVMsV0FBTztNQUFBLENBQUEsRUFBRSxDQUFGO01BQUssQ0FBQSxFQUFFLENBQVA7O0VBQWhCOztFQUtmLG1CQUFBLEdBQXNCLFNBQUE7SUFDckIsS0FBQSxDQUFNLElBQU47V0FDQSxPQUFPLENBQUMsS0FBUixDQUFjLHNKQUFkO0VBRnFCOztFQU10QixtQkFBQSxHQUFzQixTQUFBO0lBQ3JCLEtBQUEsQ0FBTSxJQUFOO1dBQ0EsT0FBTyxDQUFDLEtBQVIsQ0FBYyxzSkFBZDtFQUZxQjs7Ozs7Ozs7QUNqRXZCLElBQUEsZ0RBQUE7RUFBQTs7O0FBQU07OztFQUVRLG1CQUFDLE9BQUQ7O01BQUMsVUFBUTs7SUFDckIsSUFBQyxDQUFBLFVBQUQsR0FBYztJQUNkLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjs7TUFDcEIsT0FBTyxDQUFDLGtCQUFzQixPQUFPLENBQUMsS0FBWCxHQUFzQix3QkFBdEIsR0FBb0Q7OztNQUMvRSxPQUFPLENBQUMsUUFBUzs7O01BQ2pCLE9BQU8sQ0FBQyxhQUFjOzs7TUFDdEIsT0FBTyxDQUFDLGFBQWM7OztNQUN0QixPQUFPLENBQUMsV0FBWTs7O01BQ3BCLE9BQU8sQ0FBQyxPQUFROztJQUNoQiwyQ0FBTSxPQUFOO0lBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLEdBQW9CO0lBQ3BCLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxHQUFpQjtFQVhMOztzQkFhYixRQUFBLEdBQVUsU0FBQyxRQUFELEVBQVcsS0FBWCxFQUFrQixRQUFsQjs7TUFBa0IsV0FBVzs7SUFDdEMsSUFBQyxDQUFBLEtBQU0sQ0FBQSxRQUFBLENBQVAsR0FBc0IsUUFBSCxHQUFpQixLQUFBLEdBQU0sSUFBdkIsR0FBaUM7SUFDcEQsSUFBQyxDQUFBLElBQUQsQ0FBTSxTQUFBLEdBQVUsUUFBaEIsRUFBNEIsS0FBNUI7SUFDQSxJQUFHLElBQUMsQ0FBQSxVQUFKO2FBQW9CLElBQUMsQ0FBQSxRQUFELENBQUEsRUFBcEI7O0VBSFM7O3NCQUtWLFFBQUEsR0FBVSxTQUFBO0FBQ1QsUUFBQTtJQUFBLG1CQUFBLEdBQ0M7TUFBQSxVQUFBLEVBQVksSUFBQyxDQUFBLEtBQU0sQ0FBQSxhQUFBLENBQW5CO01BQ0EsUUFBQSxFQUFVLElBQUMsQ0FBQSxLQUFNLENBQUEsV0FBQSxDQURqQjtNQUVBLFVBQUEsRUFBWSxJQUFDLENBQUEsS0FBTSxDQUFBLGFBQUEsQ0FGbkI7TUFHQSxVQUFBLEVBQVksSUFBQyxDQUFBLEtBQU0sQ0FBQSxhQUFBLENBSG5CO01BSUEsWUFBQSxFQUFjLElBQUMsQ0FBQSxLQUFNLENBQUEsZUFBQSxDQUpyQjtNQUtBLGFBQUEsRUFBZSxJQUFDLENBQUEsS0FBTSxDQUFBLGdCQUFBLENBTHRCO01BTUEsV0FBQSxFQUFhLElBQUMsQ0FBQSxLQUFNLENBQUEsY0FBQSxDQU5wQjtNQU9BLGFBQUEsRUFBZSxJQUFDLENBQUEsS0FBTSxDQUFBLGdCQUFBLENBUHRCO01BUUEsV0FBQSxFQUFhLElBQUMsQ0FBQSxLQUFNLENBQUEsY0FBQSxDQVJwQjtNQVNBLGFBQUEsRUFBZSxJQUFDLENBQUEsS0FBTSxDQUFBLGdCQUFBLENBVHRCO01BVUEsVUFBQSxFQUFZLElBQUMsQ0FBQSxLQUFNLENBQUEsYUFBQSxDQVZuQjtNQVdBLFNBQUEsRUFBVyxJQUFDLENBQUEsS0FBTSxDQUFBLFlBQUEsQ0FYbEI7TUFZQSxXQUFBLEVBQWEsSUFBQyxDQUFBLEtBQU0sQ0FBQSxjQUFBLENBWnBCOztJQWFELFdBQUEsR0FBYztJQUNkLElBQUcsSUFBQyxDQUFBLGdCQUFKO01BQTBCLFdBQVcsQ0FBQyxLQUFaLEdBQW9CLElBQUMsQ0FBQSxNQUEvQzs7SUFDQSxJQUFBLEdBQU8sS0FBSyxDQUFDLFFBQU4sQ0FBZSxJQUFDLENBQUEsSUFBaEIsRUFBc0IsbUJBQXRCLEVBQTJDLFdBQTNDO0lBQ1AsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsS0FBb0IsT0FBdkI7TUFDQyxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQztNQUNkLElBQUMsQ0FBQSxDQUFELEdBQUssSUFBQyxDQUFBLENBQUQsR0FBRyxJQUFDLENBQUEsTUFGVjtLQUFBLE1BQUE7TUFJQyxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUksQ0FBQyxNQUpmOztXQUtBLElBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDO0VBdkJOOztFQXlCVixTQUFDLENBQUEsTUFBRCxDQUFRLFVBQVIsRUFDQztJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBO0lBQUosQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7TUFDSixJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBRyxJQUFDLENBQUEsVUFBSjtlQUFvQixJQUFDLENBQUEsUUFBRCxDQUFBLEVBQXBCOztJQUZJLENBREw7R0FERDs7RUFLQSxTQUFDLENBQUEsTUFBRCxDQUFRLGdCQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQyxLQUFEO01BQ0osSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtNQUNwQixJQUFHLElBQUMsQ0FBQSxVQUFKO2VBQW9CLElBQUMsQ0FBQSxRQUFELENBQUEsRUFBcEI7O0lBSEksQ0FBTDtHQUREOztFQUtBLFNBQUMsQ0FBQSxNQUFELENBQVEsaUJBQVIsRUFDQztJQUFBLEdBQUEsRUFBSyxTQUFDLE9BQUQ7TUFDSixJQUFDLENBQUEsUUFBUSxDQUFDLGVBQVYsR0FBNEI7TUFDNUIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsQ0FBQzthQUNqQixJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxTQUFBO1FBQUcsSUFBZSxJQUFDLENBQUEsVUFBaEI7aUJBQUEsSUFBQyxDQUFBLFFBQUQsQ0FBQSxFQUFBOztNQUFILENBQWI7SUFISSxDQUFMO0dBREQ7O0VBS0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxNQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUM7SUFBYixDQUFMO0lBQ0EsR0FBQSxFQUFLLFNBQUMsS0FBRDtNQUNKLElBQUMsQ0FBQSxRQUFRLENBQUMsV0FBVixHQUF3QjtNQUN4QixJQUFDLENBQUEsSUFBRCxDQUFNLGFBQU4sRUFBcUIsS0FBckI7TUFDQSxJQUFHLElBQUMsQ0FBQSxVQUFKO2VBQW9CLElBQUMsQ0FBQSxRQUFELENBQUEsRUFBcEI7O0lBSEksQ0FETDtHQUREOztFQU1BLFNBQUMsQ0FBQSxNQUFELENBQVEsWUFBUixFQUNDO0lBQUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDO0lBQVYsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLFlBQVYsRUFBd0IsS0FBeEI7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxVQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQWhCLENBQXdCLElBQXhCLEVBQTZCLEVBQTdCO0lBQUgsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLFVBQVYsRUFBc0IsS0FBdEIsRUFBNkIsSUFBN0I7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxZQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxLQUFLLENBQUM7SUFBVixDQUFMO0lBQ0EsR0FBQSxFQUFLLFNBQUMsS0FBRDthQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsWUFBVixFQUF3QixLQUF4QjtJQUFYLENBREw7R0FERDs7RUFHQSxTQUFDLENBQUEsTUFBRCxDQUFRLFlBQVIsRUFDQztJQUFBLEdBQUEsRUFBSyxTQUFBO2FBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQztJQUFWLENBQUw7SUFDQSxHQUFBLEVBQUssU0FBQyxLQUFEO2FBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxZQUFWLEVBQXdCLEtBQXhCO0lBQVgsQ0FETDtHQUREOztFQUdBLFNBQUMsQ0FBQSxNQUFELENBQVEsV0FBUixFQUNDO0lBQUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDO0lBQVYsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLFdBQVYsRUFBdUIsS0FBdkI7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxhQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxLQUFLLENBQUM7SUFBVixDQUFMO0lBQ0EsR0FBQSxFQUFLLFNBQUMsS0FBRDthQUFXLElBQUMsQ0FBQSxRQUFELENBQVUsYUFBVixFQUF5QixLQUF6QjtJQUFYLENBREw7R0FERDs7RUFHQSxTQUFDLENBQUEsTUFBRCxDQUFRLFNBQVIsRUFDQztJQUFBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7TUFDSixJQUFDLENBQUEsUUFBRCxDQUFVLFlBQVYsRUFBd0IsS0FBeEIsRUFBK0IsSUFBL0I7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGNBQVYsRUFBMEIsS0FBMUIsRUFBaUMsSUFBakM7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGVBQVYsRUFBMkIsS0FBM0IsRUFBa0MsSUFBbEM7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVYsRUFBeUIsS0FBekIsRUFBZ0MsSUFBaEM7SUFKSSxDQUFMO0dBREQ7O0VBTUEsU0FBQyxDQUFBLE1BQUQsQ0FBUSxZQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBVSxDQUFDLE9BQWxCLENBQTBCLElBQTFCLEVBQStCLEVBQS9CO0lBQUgsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLFlBQVYsRUFBd0IsS0FBeEIsRUFBK0IsSUFBL0I7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxjQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQXBCLENBQTRCLElBQTVCLEVBQWlDLEVBQWpDO0lBQUgsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLGNBQVYsRUFBMEIsS0FBMUIsRUFBaUMsSUFBakM7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxlQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQXJCLENBQTZCLElBQTdCLEVBQWtDLEVBQWxDO0lBQUgsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLGVBQVYsRUFBMkIsS0FBM0IsRUFBa0MsSUFBbEM7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxhQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQW5CLENBQTJCLElBQTNCLEVBQWdDLEVBQWhDO0lBQUgsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVYsRUFBeUIsS0FBekIsRUFBZ0MsSUFBaEM7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxXQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQyxLQUFEO2FBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxXQUFWLEVBQXVCLEtBQXZCO0lBQVgsQ0FBTDtHQUREOztFQUVBLFNBQUMsQ0FBQSxNQUFELENBQVEsZUFBUixFQUNDO0lBQUEsR0FBQSxFQUFLLFNBQUE7YUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDO0lBQVYsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLGVBQVYsRUFBMkIsS0FBM0I7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxlQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQXJCLENBQTZCLElBQTdCLEVBQWtDLEVBQWxDO0lBQUgsQ0FBTDtJQUNBLEdBQUEsRUFBSyxTQUFDLEtBQUQ7YUFBVyxJQUFDLENBQUEsUUFBRCxDQUFVLGVBQVYsRUFBMkIsS0FBM0IsRUFBa0MsSUFBbEM7SUFBWCxDQURMO0dBREQ7O0VBR0EsU0FBQyxDQUFBLE1BQUQsQ0FBUSxRQUFSLEVBQ0M7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFJLENBQUM7SUFBVCxDQUFMO0dBREQ7Ozs7R0E5R3VCOztBQWlIeEIsa0JBQUEsR0FBcUIsU0FBQyxLQUFEO0FBQ3BCLE1BQUE7RUFBQSxDQUFBLEdBQVEsSUFBQSxTQUFBLENBQ1A7SUFBQSxJQUFBLEVBQU0sS0FBSyxDQUFDLElBQVo7SUFDQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBRGI7SUFFQSxNQUFBLEVBQVEsS0FBSyxDQUFDLE1BRmQ7R0FETztFQUtSLE1BQUEsR0FBUztFQUNULEdBQUEsR0FBTSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztFQUMzQixHQUFHLENBQUMsT0FBSixDQUFZLFNBQUMsSUFBRDtBQUNYLFFBQUE7SUFBQSxJQUFVLENBQUMsQ0FBQyxRQUFGLENBQVcsSUFBWCxFQUFpQixJQUFqQixDQUFWO0FBQUEsYUFBQTs7SUFDQSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYO1dBQ04sTUFBTyxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQUosQ0FBUCxHQUFpQixHQUFJLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBUCxDQUFlLEdBQWYsRUFBbUIsRUFBbkI7RUFITixDQUFaO0VBSUEsQ0FBQyxDQUFDLEtBQUYsR0FBVTtFQUVWLFVBQUEsR0FBYSxLQUFLLENBQUM7RUFDbkIsSUFBRyxDQUFDLENBQUMsUUFBRixDQUFXLFVBQVgsRUFBdUIsS0FBdkIsQ0FBSDtJQUNDLENBQUMsQ0FBQyxRQUFGLElBQWM7SUFDZCxDQUFDLENBQUMsVUFBRixHQUFlLENBQUMsUUFBQSxDQUFTLENBQUMsQ0FBQyxVQUFYLENBQUEsR0FBdUIsQ0FBeEIsQ0FBQSxHQUEyQjtJQUMxQyxDQUFDLENBQUMsYUFBRixJQUFtQixFQUhwQjs7RUFLQSxDQUFDLENBQUMsQ0FBRixJQUFPLENBQUMsUUFBQSxDQUFTLENBQUMsQ0FBQyxVQUFYLENBQUEsR0FBdUIsQ0FBQyxDQUFDLFFBQTFCLENBQUEsR0FBb0M7RUFDM0MsQ0FBQyxDQUFDLENBQUYsSUFBTyxDQUFDLENBQUMsUUFBRixHQUFhO0VBQ3BCLENBQUMsQ0FBQyxDQUFGLElBQU8sQ0FBQyxDQUFDLFFBQUYsR0FBYTtFQUNwQixDQUFDLENBQUMsS0FBRixJQUFXLENBQUMsQ0FBQyxRQUFGLEdBQWE7RUFFeEIsQ0FBQyxDQUFDLElBQUYsR0FBUyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztFQUM5QixLQUFLLENBQUMsT0FBTixDQUFBO0FBQ0EsU0FBTztBQTNCYTs7QUE2QnJCLEtBQUssQ0FBQSxTQUFFLENBQUEsa0JBQVAsR0FBNEIsU0FBQTtTQUFHLGtCQUFBLENBQW1CLElBQW5CO0FBQUg7O0FBRTVCLGlCQUFBLEdBQW9CLFNBQUMsR0FBRDtBQUNuQixNQUFBO0FBQUE7T0FBQSxXQUFBOztJQUNDLElBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFaLEtBQW9CLE1BQXZCO21CQUNDLEdBQUksQ0FBQSxJQUFBLENBQUosR0FBWSxrQkFBQSxDQUFtQixLQUFuQixHQURiO0tBQUEsTUFBQTsyQkFBQTs7QUFERDs7QUFEbUI7O0FBTXBCLEtBQUssQ0FBQSxTQUFFLENBQUEsZ0JBQVAsR0FBMEIsU0FBQyxVQUFEO0FBQ3RCLE1BQUE7RUFBQSxDQUFBLEdBQUksSUFBSTtFQUNSLENBQUMsQ0FBQyxLQUFGLEdBQVUsSUFBQyxDQUFBO0VBQ1gsQ0FBQyxDQUFDLFVBQUYsR0FBZSxJQUFDLENBQUE7RUFDaEIsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxDQUFULEVBQVcsVUFBWDtFQUNBLElBQUMsQ0FBQSxPQUFELENBQUE7U0FDQTtBQU5zQjs7QUFRMUIsT0FBTyxDQUFDLFNBQVIsR0FBb0I7O0FBQ3BCLE9BQU8sQ0FBQyxpQkFBUixHQUE0Qjs7OztBQy9KNUIsSUFBQTs7O0FBQU0sTUFBTSxDQUFDOzs7RUFFQyxpQkFBQyxPQUFEO0FBQ1osUUFBQTs7TUFEYSxVQUFROzs7TUFDckIsT0FBTyxDQUFDLFFBQVMsTUFBTSxDQUFDOzs7TUFDeEIsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDOzs7TUFDekIsT0FBTyxDQUFDLE9BQVE7OztNQUNoQixPQUFPLENBQUMsa0JBQW1COzs7TUFDM0IsT0FBTyxDQUFDLGlCQUFrQjs7O01BQzFCLE9BQU8sQ0FBQyxtQkFBb0I7UUFBRSxLQUFBLEVBQU8sZ0NBQVQ7UUFBMkMsSUFBQSxFQUFNLEVBQWpEOzs7O01BQzVCLE9BQU8sQ0FBQyxrQkFBbUI7OztNQUMzQixPQUFPLENBQUMsU0FBVTs7O01BQ2xCLE9BQU8sQ0FBQyxXQUFZOztJQUVwQix5Q0FBTSxPQUFOO0lBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUVYLElBQUMsQ0FBQSxRQUFELENBQVUsV0FBVixFQUF1QixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsVUFBRDtBQUN0QixZQUFBO1FBQUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQTtRQUN4QixJQUFHLFlBQUg7VUFFQyxJQUFJLENBQUMsSUFBTCxHQUFZO1VBQ1osSUFBSSxDQUFDLEVBQUwsQ0FBUSxNQUFNLENBQUMsS0FBZixFQUFzQixTQUFBLEdBQUEsQ0FBdEI7VUFFQSxJQUFHLEtBQUMsQ0FBQSxNQUFKO1lBQ0MsUUFBQSxHQUFXLElBQUksQ0FBQztZQUNoQixlQUFBLEdBQXNCLElBQUEsZUFBQSxDQUNyQjtjQUFBLElBQUEsRUFBTSxpQkFBTjtjQUNBLEtBQUEsRUFBTyxLQUFDLENBQUEsS0FEUjtjQUVBLE1BQUEsRUFBUSxLQUFDLENBQUEsTUFGVDtjQUdBLE1BQUEsRUFBUSxJQUhSO2FBRHFCO1lBS3RCLGVBQWUsQ0FBQyxPQUFPLENBQUMsZUFBeEIsR0FBMEM7WUFDMUMsSUFBRyxJQUFJLENBQUMsS0FBTCxJQUFjLEtBQUMsQ0FBQSxLQUFsQjtjQUNDLGVBQWUsQ0FBQyxnQkFBaEIsR0FBbUMsTUFEcEM7O1lBRUEsSUFBRyxJQUFJLENBQUMsTUFBTCxJQUFlLEtBQUMsQ0FBQSxNQUFuQjtjQUNDLGVBQWUsQ0FBQyxjQUFoQixHQUFpQyxNQURsQzs7QUFFQSxpQkFBQSwwQ0FBQTs7Y0FDQyxDQUFDLENBQUMsTUFBRixHQUFXLGVBQWUsQ0FBQztBQUQ1QjtZQUVBLElBQUksQ0FBQyxlQUFMLEdBQXVCO21CQUV2QixJQUFJLENBQUMsSUFBTCxHQUFZO2NBQUMsS0FBQSxFQUFPLEtBQUMsQ0FBQSxLQUFUO2NBQWdCLE1BQUEsRUFBUSxLQUFDLENBQUEsTUFBekI7Y0FoQmI7V0FMRDs7TUFGc0I7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO0lBeUJBLFdBQUEsR0FDQztNQUFBLGFBQUEsRUFDQztRQUFBLE9BQUEsRUFDQztVQUFBLEVBQUEsRUFBSTtZQUFDLENBQUEsRUFBRyxDQUFKO1lBQU8sQ0FBQSxFQUFHLENBQVY7V0FBSjtTQUREO09BREQ7TUFHQSxNQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxJQUFBLEVBQU07WUFBQyxPQUFBLEVBQVMsQ0FBVjtXQUFOO1VBQ0EsRUFBQSxFQUFJO1lBQUMsT0FBQSxFQUFTLENBQVY7V0FESjtTQUREO09BSkQ7TUFPQSxNQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxJQUFBLEVBQU07WUFBQyxLQUFBLEVBQU8sR0FBUjtZQUFhLE9BQUEsRUFBUyxDQUF0QjtXQUFOO1VBQ0EsRUFBQSxFQUFJO1lBQUMsS0FBQSxFQUFPLENBQVI7WUFBVyxPQUFBLEVBQVMsQ0FBcEI7V0FESjtTQUREO09BUkQ7TUFXQSxPQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxFQUFBLEVBQUk7WUFBQyxLQUFBLEVBQU8sR0FBUjtZQUFhLE9BQUEsRUFBUyxDQUF0QjtXQUFKO1NBREQ7UUFFQSxPQUFBLEVBQ0M7VUFBQSxFQUFBLEVBQUksRUFBSjtTQUhEO09BWkQ7TUFnQkEsU0FBQSxFQUNDO1FBQUEsT0FBQSxFQUNDO1VBQUEsSUFBQSxFQUFNO1lBQUMsQ0FBQSxFQUFHLElBQUMsQ0FBQSxNQUFMO1dBQU47VUFDQSxFQUFBLEVBQUk7WUFBQyxDQUFBLEVBQUcsQ0FBSjtXQURKO1NBREQ7T0FqQkQ7TUFvQkEsWUFBQSxFQUNDO1FBQUEsT0FBQSxFQUNDO1VBQUEsSUFBQSxFQUFNO1lBQUMsQ0FBQSxFQUFHLElBQUMsQ0FBQSxLQUFMO1dBQU47VUFDQSxFQUFBLEVBQUk7WUFBQyxDQUFBLEVBQUcsQ0FBSjtXQURKO1NBREQ7T0FyQkQ7TUF3QkEsV0FBQSxFQUNDO1FBQUEsT0FBQSxFQUNDO1VBQUEsSUFBQSxFQUFNO1lBQUMsSUFBQSxFQUFNLENBQVA7V0FBTjtVQUNBLEVBQUEsRUFBSTtZQUFDLENBQUEsRUFBRyxDQUFKO1dBREo7U0FERDtPQXpCRDtNQTRCQSxXQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxFQUFBLEVBQUk7WUFBQyxJQUFBLEVBQU0sQ0FBUDtXQUFKO1NBREQ7UUFFQSxPQUFBLEVBQ0M7VUFBQSxJQUFBLEVBQU07WUFBQyxDQUFBLEVBQUcsSUFBQyxDQUFBLEtBQUw7V0FBTjtVQUNBLEVBQUEsRUFBSTtZQUFDLENBQUEsRUFBRyxDQUFKO1dBREo7U0FIRDtPQTdCRDtNQWtDQSxVQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxFQUFBLEVBQUk7WUFBQyxDQUFBLEVBQUcsSUFBQyxDQUFBLEtBQUw7V0FBSjtTQUREO1FBRUEsT0FBQSxFQUNDO1VBQUEsSUFBQSxFQUFNO1lBQUMsSUFBQSxFQUFNLENBQVA7V0FBTjtVQUNBLEVBQUEsRUFBSTtZQUFDLENBQUEsRUFBRyxDQUFKO1dBREo7U0FIRDtPQW5DRDtNQXdDQSxXQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxJQUFBLEVBQU07WUFBQyxJQUFBLEVBQU0sQ0FBUDtXQUFOO1VBQ0EsRUFBQSxFQUFJO1lBQUMsSUFBQSxFQUFNLElBQUMsQ0FBQSxLQUFSO1dBREo7U0FERDtPQXpDRDtNQTRDQSxXQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxFQUFBLEVBQUk7WUFBQyxDQUFBLEVBQUcsQ0FBQyxDQUFDLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBUixDQUFMO1lBQWlCLFVBQUEsRUFBWSxFQUE3QjtXQUFKO1NBREQ7UUFFQSxPQUFBLEVBQ0M7VUFBQSxJQUFBLEVBQU07WUFBQyxDQUFBLEVBQUcsSUFBQyxDQUFBLEtBQUw7V0FBTjtVQUNBLEVBQUEsRUFBSTtZQUFDLENBQUEsRUFBRyxDQUFKO1dBREo7U0FIRDtPQTdDRDtNQWtEQSxVQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxFQUFBLEVBQUk7WUFBQyxDQUFBLEVBQUcsSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUFYO1lBQWMsVUFBQSxFQUFZLEVBQTFCO1dBQUo7U0FERDtRQUVBLE9BQUEsRUFDQztVQUFBLElBQUEsRUFBTTtZQUFDLENBQUEsRUFBRyxDQUFDLElBQUMsQ0FBQSxLQUFOO1dBQU47VUFDQSxFQUFBLEVBQUk7WUFBQyxDQUFBLEVBQUcsQ0FBSjtXQURKO1NBSEQ7T0FuREQ7TUF3REEsWUFBQSxFQUNDO1FBQUEsT0FBQSxFQUNDO1VBQUEsRUFBQSxFQUFJO1lBQUMsQ0FBQSxFQUFHLElBQUMsQ0FBQSxLQUFMO1dBQUo7U0FERDtRQUVBLE9BQUEsRUFDQztVQUFBLElBQUEsRUFBTTtZQUFDLENBQUEsRUFBRyxDQUFDLENBQUMsSUFBQyxDQUFBLEtBQUQsR0FBTyxDQUFSLENBQUw7WUFBaUIsVUFBQSxFQUFZLEVBQTdCO1dBQU47VUFDQSxFQUFBLEVBQUk7WUFBQyxDQUFBLEVBQUcsQ0FBSjtZQUFPLFVBQUEsRUFBWSxHQUFuQjtXQURKO1NBSEQ7T0F6REQ7TUE4REEsV0FBQSxFQUNDO1FBQUEsT0FBQSxFQUNDO1VBQUEsRUFBQSxFQUFJO1lBQUMsSUFBQSxFQUFNLENBQVA7V0FBSjtTQUREO1FBRUEsT0FBQSxFQUNDO1VBQUEsSUFBQSxFQUFNO1lBQUMsQ0FBQSxFQUFHLElBQUMsQ0FBQSxLQUFELEdBQU8sQ0FBWDtZQUFjLFVBQUEsRUFBWSxFQUExQjtXQUFOO1VBQ0EsRUFBQSxFQUFJO1lBQUMsQ0FBQSxFQUFHLENBQUo7WUFBTyxVQUFBLEVBQVksR0FBbkI7V0FESjtTQUhEO09BL0REO01Bb0VBLFVBQUEsRUFDQztRQUFBLE9BQUEsRUFDQztVQUFBLEVBQUEsRUFBSTtZQUFDLElBQUEsRUFBTSxDQUFQO1dBQUo7U0FERDtRQUVBLE9BQUEsRUFDQztVQUFBLEVBQUEsRUFBSSxFQUFKO1NBSEQ7T0FyRUQ7TUF5RUEsYUFBQSxFQUNDO1FBQUEsT0FBQSxFQUNDO1VBQUEsRUFBQSxFQUFJO1lBQUMsQ0FBQSxFQUFHLElBQUMsQ0FBQSxLQUFMO1dBQUo7U0FERDtRQUVBLE9BQUEsRUFDQztVQUFBLEVBQUEsRUFBSSxFQUFKO1NBSEQ7T0ExRUQ7TUE4RUEsWUFBQSxFQUNDO1FBQUEsT0FBQSxFQUNDO1VBQUEsRUFBQSxFQUFJO1lBQUMsQ0FBQSxFQUFHLElBQUMsQ0FBQSxNQUFMO1dBQUo7U0FERDtRQUVBLE9BQUEsRUFDQztVQUFBLEVBQUEsRUFBSSxFQUFKO1NBSEQ7T0EvRUQ7TUFtRkEsWUFBQSxFQUNDO1FBQUEsT0FBQSxFQUNDO1VBQUEsRUFBQSxFQUFJO1lBQUMsSUFBQSxFQUFNLENBQVA7V0FBSjtTQUREO1FBRUEsT0FBQSxFQUNDO1VBQUEsRUFBQSxFQUFJLEVBQUo7U0FIRDtPQXBGRDtNQXdGQSxhQUFBLEVBQ0M7UUFBQSxPQUFBLEVBQ0M7VUFBQSxJQUFBLEVBQU07WUFBQyxDQUFBLEVBQUcsSUFBQyxDQUFBLE1BQUQsR0FBUSxDQUFaO1lBQWUsT0FBQSxFQUFTLENBQXhCO1dBQU47VUFDQSxFQUFBLEVBQUk7WUFBQyxDQUFBLEVBQUcsQ0FBSjtZQUFPLE9BQUEsRUFBUyxDQUFoQjtXQURKO1NBREQ7T0F6RkQ7O0lBOEZELFdBQVcsQ0FBQyxPQUFaLEdBQXNCLFdBQVcsQ0FBQztJQUNsQyxXQUFXLENBQUMsUUFBWixHQUF1QixXQUFXLENBQUM7SUFDbkMsV0FBVyxDQUFDLE1BQVosR0FBcUIsV0FBVyxDQUFDO0lBQ2pDLFdBQVcsQ0FBQyxPQUFaLEdBQXNCLFdBQVcsQ0FBQztJQUdsQyxNQUFNLENBQUMsY0FBUCxHQUF3QjtJQUN4QixNQUFNLENBQUMsYUFBUCxHQUF1QjtJQUN2QixLQUFLLENBQUEsU0FBRSxDQUFBLGdCQUFQLEdBQTBCLFNBQUMsRUFBRDthQUFRLElBQUMsQ0FBQSxFQUFELENBQUksTUFBTSxDQUFDLGNBQVgsRUFBMkIsRUFBM0I7SUFBUjtJQUMxQixLQUFLLENBQUEsU0FBRSxDQUFBLGVBQVAsR0FBeUIsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxNQUFNLENBQUMsYUFBWCxFQUEwQixFQUExQjtJQUFSO0lBRXpCLENBQUMsQ0FBQyxJQUFGLENBQU8sV0FBUCxFQUFvQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsU0FBRCxFQUFZLElBQVo7QUFFbkIsWUFBQTtRQUFBLElBQUcsT0FBTyxDQUFDLFFBQVg7VUFDQyxNQUFBLEdBQVMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUF0QixDQUFBO0FBQ1QsZUFBQSx3Q0FBQTs7WUFDQyxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsR0FBRyxDQUFDLElBQWYsRUFBcUIsSUFBckIsQ0FBSDtjQUNDLGNBQUEsR0FBaUI7Y0FDakIsR0FBRyxDQUFDLE9BQUosQ0FBWSxTQUFBO0FBQ1gsb0JBQUE7Z0JBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBaUIsQ0FBQSxDQUFBO2dCQUN4QixRQUFBLEdBQVcsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQWMsSUFBQSxHQUFLLEdBQW5CLEVBQXVCLEVBQXZCO2dCQUNYLFFBQUEsR0FBVyxRQUFRLENBQUMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixFQUF6Qjt1QkFDWCxjQUFlLENBQUEsSUFBQSxDQUFmLENBQXFCLENBQUMsQ0FBQyxJQUFGLENBQU8sTUFBUCxFQUFlLFNBQUMsQ0FBRDt5QkFBTyxDQUFDLENBQUMsSUFBRixLQUFVO2dCQUFqQixDQUFmLENBQXJCO2NBSlcsQ0FBWixFQUZEOztBQURELFdBRkQ7O2VBV0EsS0FBRSxDQUFBLElBQUEsQ0FBRixHQUFVLFNBQUMsT0FBRCxFQUFVLGdCQUFWO0FBRVQsY0FBQTs7WUFGbUIsbUJBQW1CLEtBQUMsQ0FBQTs7VUFFdkMsSUFBVSxPQUFBLEtBQVcsS0FBQyxDQUFBLFdBQXRCO0FBQUEsbUJBQUE7O1VBS0EsT0FBTyxDQUFDLE1BQVIsR0FBaUI7VUFDakIsT0FBTyxDQUFDLFVBQVIsQ0FBQTtVQUdBLE9BQU8sQ0FBQyxLQUFSLEdBQWdCO1lBQUMsQ0FBQSxFQUFFLENBQUg7WUFBTSxDQUFBLEVBQUcsQ0FBVDs7VUFDaEIsT0FBTyxDQUFDLE9BQVIsR0FBa0I7VUFDbEIsT0FBTyxDQUFDLEtBQVIsR0FBZ0I7VUFDaEIsT0FBTyxDQUFDLFVBQVIsR0FBcUI7O2VBR1QsQ0FBRSxLQUFkLEdBQXNCO2NBQUMsQ0FBQSxFQUFHLENBQUo7Y0FBTyxDQUFBLEVBQUcsQ0FBVjs7OztnQkFDVixDQUFFLEtBQWQsNENBQXVDLENBQUU7O1VBQ3pDLE9BQUEsR0FBVSxDQUFDLENBQUMsTUFBRixDQUFTO1lBQUMsVUFBQSwyQ0FBNkIsQ0FBRSxXQUFoQztXQUFULEVBQThDLGdCQUE5QztVQUNWLENBQUMsQ0FBQyxRQUFGLENBQVcsT0FBWCxFQUFvQjtZQUFFLFVBQUEsRUFBWSxFQUFkO1dBQXBCO1VBQ0EsUUFBQSw0Q0FBdUIsQ0FBRSxPQUFkLENBQXNCLE9BQXRCO1VBR1gsT0FBTyxDQUFDLEtBQVIsNENBQWlDLENBQUU7VUFDbkMsUUFBQSxHQUFXLE9BQU8sQ0FBQyxPQUFSLENBQWdCLENBQUMsQ0FBQyxNQUFGLENBQVM7WUFBQyxVQUFBLDJDQUE2QixDQUFFLFdBQWhDO1dBQVQsRUFBOEMsZ0JBQTlDLENBQWhCO1VBR1gsSUFBRyxDQUFDLENBQUMsUUFBRixDQUFXLElBQVgsRUFBaUIsS0FBakIsQ0FBSDtZQUNDLE9BQU8sQ0FBQyxXQUFSLENBQW9CLEtBQUMsQ0FBQSxXQUFyQjtZQUNBLFFBQVEsQ0FBQyxFQUFULENBQVksTUFBTSxDQUFDLFlBQW5CLEVBQWlDLFNBQUE7cUJBQUcsS0FBQyxDQUFBLFdBQVcsQ0FBQyxZQUFiLENBQUE7WUFBSCxDQUFqQyxFQUZEO1dBQUEsTUFBQTtZQUlDLE9BQU8sQ0FBQyxXQUFSLENBQW9CLEtBQUMsQ0FBQSxXQUFyQixFQUpEOztVQU1BLEtBQUMsQ0FBQSxJQUFELENBQU0sTUFBTSxDQUFDLGNBQWIsRUFBNkIsS0FBQyxDQUFBLFdBQTlCLEVBQTJDLE9BQTNDO1VBSUEsS0FBQyxDQUFBLHdCQUFELENBQTBCLElBQTFCLEVBQWdDLFFBQWhDLEVBQTBDLFFBQTFDO1VBQ0EsS0FBQyxDQUFBLFdBQUQsR0FBZTtVQUNmLEtBQUMsQ0FBQSxJQUFELENBQU0scUJBQU4sRUFBNkIsS0FBQyxDQUFBLFlBQTlCO1VBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxvQkFBTixFQUE0QixLQUFDLENBQUEsV0FBN0I7VUFFQSxJQUFHLFFBQVEsQ0FBQyxXQUFaO1lBQ0MsSUFBQSxHQUFPLFNBRFI7V0FBQSxNQUFBO1lBR0MsSUFBQSxHQUFPLFNBSFI7O2lCQUlBLElBQUksQ0FBQyxFQUFMLENBQVEsTUFBTSxDQUFDLFlBQWYsRUFBNkIsU0FBQTttQkFDNUIsS0FBQyxDQUFBLElBQUQsQ0FBTSxNQUFNLENBQUMsYUFBYixFQUE0QixLQUFDLENBQUEsWUFBN0IsRUFBMkMsS0FBQyxDQUFBLFdBQTVDO1VBRDRCLENBQTdCO1FBL0NTO01BYlM7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBCO0lBZ0VBLElBQUcsK0JBQUg7TUFDQyxXQUFBLEdBQWMsQ0FBQyxDQUFDLElBQUYsQ0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQXRCLENBQUEsQ0FBUCxFQUEwQyxTQUFDLENBQUQ7ZUFBTyxDQUFDLENBQUMsSUFBRixLQUFVLE9BQU8sQ0FBQztNQUF6QixDQUExQztNQUNkLElBQUcsbUJBQUg7UUFBcUIsSUFBQyxDQUFBLGFBQUQsQ0FBZSxXQUFmLEVBQXJCO09BRkQ7O0lBSUEsSUFBRywyQkFBSDtNQUNDLElBQUMsQ0FBQSxhQUFELENBQWUsT0FBTyxDQUFDLFdBQXZCLEVBREQ7O0lBR0EsSUFBRyw4QkFBSDtNQUNDLFdBQUEsR0FBYyxDQUFDLENBQUMsTUFBRixDQUFTLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBdEIsQ0FBQSxDQUFULEVBQTRDLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQyxRQUFGLENBQVcsQ0FBQyxDQUFDLElBQWIsRUFBbUIsT0FBTyxDQUFDLGNBQTNCO01BQVAsQ0FBNUM7QUFDZCxXQUFBLDZDQUFBOztRQUNDLEdBQUcsQ0FBQyxPQUFKLENBQVksQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFBO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVo7QUFERCxPQUZEOztFQXhOWTs7RUE2TmIsT0FBQyxDQUFBLE1BQUQsQ0FBUSxjQUFSLEVBQ0U7SUFBQSxHQUFBLEVBQUssU0FBQTthQUFHLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUM7SUFBZixDQUFMO0dBREY7O29CQUdBLHdCQUFBLEdBQTBCLFNBQUMsSUFBRCxFQUFNLGlCQUFOLEVBQXdCLGlCQUF4QjtXQUN6QixJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FDQztNQUFBLElBQUEsRUFBTSxJQUFDLENBQUEsV0FBUDtNQUNBLGFBQUEsRUFBZSxJQURmO01BRUEsaUJBQUEsRUFBbUIsaUJBRm5CO01BR0EsaUJBQUEsRUFBbUIsaUJBSG5CO0tBREQ7RUFEeUI7O29CQU8xQixJQUFBLEdBQU0sU0FBQTtBQUNMLFFBQUE7SUFBQSxRQUFBLEdBQVcsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBO0lBQ3BCLElBQUcscUJBQUg7TUFFQyxJQUFHLENBQUMsQ0FBQyxRQUFGLENBQVcsUUFBUSxDQUFDLGFBQXBCLEVBQW1DLEtBQW5DLENBQUg7UUFDQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQWQsQ0FBQSxFQUREOztNQUdBLE1BQUEsR0FBUyxRQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBM0IsQ0FBQTtNQUNULE9BQUEsR0FBVSxRQUFRLENBQUMsaUJBQWlCLENBQUMsT0FBM0IsQ0FBQTtNQUVWLE1BQU0sQ0FBQyxLQUFQLENBQUE7TUFDQSxPQUFPLENBQUMsS0FBUixDQUFBO01BRUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxRQUFRLENBQUM7TUFDeEIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQUE7YUFDQSxPQUFPLENBQUMsRUFBUixDQUFXLE1BQU0sQ0FBQyxZQUFsQixFQUFnQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLFdBQVcsQ0FBQyxZQUFiLENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsRUFiRDs7RUFGSzs7OztHQXpPc0I7Ozs7QUNlN0IsSUFBQTs7QUFBQyxVQUFXLE9BQUEsQ0FBUSxTQUFSLEVBQVg7O0FBR0QsT0FBTyxDQUFDLE1BQVIsR0FBaUIsU0FBQyxLQUFELEVBQVEsS0FBUjtBQUNoQixNQUFBO0VBQUEsV0FBQSxHQUFjLE9BQU8sQ0FBQyxNQUFSLENBQWUsS0FBZixFQUFzQixLQUF0QjtFQUVkLFdBQUEsR0FBaUIsS0FBSyxDQUFDLFdBQVQsR0FBMEIsS0FBSyxDQUFDLFdBQWhDLEdBQWlEO0VBRy9ELEtBQUEsR0FBUTtFQUNSLFNBQUEsR0FBWTtJQUFBLEtBQUEsRUFBTyxVQUFQO0lBQW1CLElBQUEsRUFBTSxFQUF6Qjs7RUFHWixhQUFBLEdBQW9CLElBQUEsS0FBQSxDQUNuQjtJQUFBLFVBQUEsRUFBWSxJQUFaO0lBQ0EsSUFBQSxFQUFNLGVBRE47SUFFQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBRmI7SUFHQSxNQUFBLEVBQVEsS0FBSyxDQUFDLE1BSGQ7SUFJQSxPQUFBLEVBQVMsQ0FKVDtJQUtBLGVBQUEsRUFBaUIsV0FMakI7R0FEbUI7RUFPcEIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFyQixDQUNDO0lBQUEsT0FBQSxFQUFTO01BQUEsT0FBQSxFQUFTLEdBQVQ7S0FBVDtHQUREO0VBRUEsYUFBYSxDQUFDLE1BQU0sQ0FBQyxRQUFELENBQXBCLENBQTRCLFNBQTVCLEVBQXVDLFNBQXZDO0VBRUEsWUFBQSxHQUFtQixJQUFBLEtBQUEsQ0FDbEI7SUFBQSxVQUFBLEVBQVksSUFBWjtJQUNBLElBQUEsRUFBTSxjQUROO0lBRUEsWUFBQSxFQUFjLEtBRmQ7SUFHQSxJQUFBLEVBQU0sV0FBVyxDQUFDLENBSGxCO0lBSUEsSUFBQSxFQUFNLFdBQVcsQ0FBQyxDQUpsQjtJQUtBLE9BQUEsRUFBUyxHQUxUO0lBTUEsZUFBQSxFQUFpQixXQU5qQjtHQURrQjtFQVFuQixZQUFZLENBQUMsTUFBTSxDQUFDLEdBQXBCLENBQ0M7SUFBQSxPQUFBLEVBQVM7TUFBQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBQU4sR0FBYyxFQUFyQjtNQUF5QixPQUFBLEVBQVMsQ0FBbEM7S0FBVDtHQUREO0VBRUEsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFELENBQW5CLENBQTJCLFNBQTNCLEVBQXNDLFNBQXRDO1NBR0EsS0FBSyxDQUFDLEtBQU4sQ0FBWSxHQUFaLEVBQWlCLFNBQUE7SUFDaEIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFyQixDQUEwQixTQUExQixFQUFxQyxTQUFyQztXQUNBLGFBQWEsQ0FBQyxFQUFkLENBQWlCLE1BQU0sQ0FBQyxZQUF4QixFQUFzQyxTQUFBO01BQ3JDLFlBQVksQ0FBQyxPQUFiLENBQUE7YUFDQSxhQUFhLENBQUMsT0FBZCxDQUFBO0lBRnFDLENBQXRDO0VBRmdCLENBQWpCO0FBbENnQjs7OztBQ2RqQixPQUFPLENBQUMsS0FBUixHQUFnQjs7QUFFaEIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsU0FBQTtTQUNwQixLQUFBLENBQU0sdUJBQU47QUFEb0I7O0FBR3JCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBDcmVhdGVkIGJ5IEpvcmRhbiBSb2JlcnQgRG9ic29uIG9uIDE0IEF1Z3VzdCAyMDE1XG4jIFxuIyBVc2UgdG8gbm9ybWFsaXplIHNjcmVlbiAmIG9mZnNldCB4LHkgdmFsdWVzIGZyb20gY2xpY2sgb3IgdG91Y2ggZXZlbnRzLlxuI1xuIyBUbyBHZXQgU3RhcnRlZC4uLlxuI1xuIyAxLiBQbGFjZSB0aGlzIGZpbGUgaW4gRnJhbWVyIFN0dWRpbyBtb2R1bGVzIGRpcmVjdG9yeVxuI1xuIyAyLiBJbiB5b3VyIHByb2plY3QgaW5jbHVkZTpcbiMgICAgIHtQb2ludGVyfSA9IHJlcXVpcmUgXCJQb2ludGVyXCJcbiNcbiMgMy4gRm9yIHNjcmVlbiBjb29yZGluYXRlczogXG4jICAgICBidG4ub24gRXZlbnRzLkNsaWNrLCAoZXZlbnQsIGxheWVyKSAtPiBwcmludCBQb2ludGVyLnNjcmVlbihldmVudCwgbGF5ZXIpXG4jIFxuIyA0LiBGb3IgbGF5ZXIgb2Zmc2V0IGNvb3JkaW5hdGVzOiBcbiMgICAgIGJ0bi5vbiBFdmVudHMuQ2xpY2ssIChldmVudCwgbGF5ZXIpIC0+IHByaW50IFBvaW50ZXIub2Zmc2V0KGV2ZW50LCBsYXllcilcbiNcbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG5jbGFzcyBleHBvcnRzLlBvaW50ZXJcblxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBQdWJsaWMgTWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cblx0QHNjcmVlbiA9IChldmVudCwgbGF5ZXIpIC0+XG5cdFx0c2NyZWVuQXJndW1lbnRFcnJvcigpIHVubGVzcyBldmVudD8gYW5kIGxheWVyP1xuXHRcdGUgPSBvZmZzZXRDb29yZHMgZXZlbnRcblx0XHRpZiBlLnggYW5kIGUueVxuXHRcdFx0IyBNb3VzZSBFdmVudFxuXHRcdFx0c2NyZWVuQ29vcmRzID0gbGF5ZXIuc2NyZWVuRnJhbWVcblx0XHRcdGUueCArPSBzY3JlZW5Db29yZHMueFxuXHRcdFx0ZS55ICs9IHNjcmVlbkNvb3Jkcy55XG5cdFx0ZWxzZVxuXHRcdFx0IyBUb3VjaCBFdmVudFxuXHRcdFx0ZSA9IGNsaWVudENvb3JkcyBldmVudFxuXHRcdHJldHVybiBlXG5cdFx0XHRcblx0QG9mZnNldCA9IChldmVudCwgbGF5ZXIpIC0+XG5cdFx0b2Zmc2V0QXJndW1lbnRFcnJvcigpIHVubGVzcyBldmVudD8gYW5kIGxheWVyP1xuXHRcdGUgPSBvZmZzZXRDb29yZHMgZXZlbnRcblx0XHR1bmxlc3MgZS54PyBhbmQgZS55P1xuXHRcdFx0IyBUb3VjaCBFdmVudFxuXHRcdFx0ZSA9IGNsaWVudENvb3JkcyBldmVudFxuXHRcdFx0dGFyZ2V0U2NyZWVuQ29vcmRzID0gbGF5ZXIuc2NyZWVuRnJhbWVcblx0XHRcdGUueCAtPSB0YXJnZXRTY3JlZW5Db29yZHMueFxuXHRcdFx0ZS55IC09IHRhcmdldFNjcmVlbkNvb3Jkcy55XG5cdFx0cmV0dXJuIGVcblx0XG5cdCMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXHQjIFByaXZhdGUgSGVscGVyIE1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0XG5cdG9mZnNldENvb3JkcyA9IChldikgIC0+IGUgPSBFdmVudHMudG91Y2hFdmVudCBldjsgcmV0dXJuIGNvb3JkcyBlLm9mZnNldFgsIGUub2Zmc2V0WVxuXHRjbGllbnRDb29yZHMgPSAoZXYpICAtPiBlID0gRXZlbnRzLnRvdWNoRXZlbnQgZXY7IHJldHVybiBjb29yZHMgZS5jbGllbnRYLCBlLmNsaWVudFlcblx0Y29vcmRzICAgICAgID0gKHgseSkgLT4gcmV0dXJuIHg6eCwgeTp5XG5cdFxuXHQjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblx0IyBFcnJvciBIYW5kbGVyIE1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cdFxuXHRzY3JlZW5Bcmd1bWVudEVycm9yID0gLT5cblx0XHRlcnJvciBudWxsXG5cdFx0Y29uc29sZS5lcnJvciBcIlwiXCJcblx0XHRcdFBvaW50ZXIuc2NyZWVuKCkgRXJyb3I6IFlvdSBtdXN0IHBhc3MgZXZlbnQgJiBsYXllciBhcmd1bWVudHMuIFxcblxuXHRcdFx0RXhhbXBsZTogbGF5ZXIub24gRXZlbnRzLlRvdWNoU3RhcnQsKGV2ZW50LGxheWVyKSAtPiBQb2ludGVyLnNjcmVlbihldmVudCwgbGF5ZXIpXCJcIlwiXG5cdFx0XHRcblx0b2Zmc2V0QXJndW1lbnRFcnJvciA9IC0+XG5cdFx0ZXJyb3IgbnVsbFxuXHRcdGNvbnNvbGUuZXJyb3IgXCJcIlwiXG5cdFx0XHRQb2ludGVyLm9mZnNldCgpIEVycm9yOiBZb3UgbXVzdCBwYXNzIGV2ZW50ICYgbGF5ZXIgYXJndW1lbnRzLiBcXG5cblx0XHRcdEV4YW1wbGU6IGxheWVyLm9uIEV2ZW50cy5Ub3VjaFN0YXJ0LChldmVudCxsYXllcikgLT4gUG9pbnRlci5vZmZzZXQoZXZlbnQsIGxheWVyKVwiXCJcIiIsImNsYXNzIFRleHRMYXllciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRAZG9BdXRvU2l6ZSA9IGZhbHNlXG5cdFx0QGRvQXV0b1NpemVIZWlnaHQgPSBmYWxzZVxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IGlmIG9wdGlvbnMuc2V0dXAgdGhlbiBcImhzbGEoNjAsIDkwJSwgNDclLCAuNClcIiBlbHNlIFwidHJhbnNwYXJlbnRcIlxuXHRcdG9wdGlvbnMuY29sb3IgPz0gXCJyZWRcIlxuXHRcdG9wdGlvbnMubGluZUhlaWdodCA/PSAxLjI1XG5cdFx0b3B0aW9ucy5mb250RmFtaWx5ID89IFwiSGVsdmV0aWNhXCJcblx0XHRvcHRpb25zLmZvbnRTaXplID89IDIwXG5cdFx0b3B0aW9ucy50ZXh0ID89IFwiVXNlIGxheWVyLnRleHQgdG8gYWRkIHRleHRcIlxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAc3R5bGUud2hpdGVTcGFjZSA9IFwicHJlLWxpbmVcIiAjIGFsbG93IFxcbiBpbiAudGV4dFxuXHRcdEBzdHlsZS5vdXRsaW5lID0gXCJub25lXCIgIyBubyBib3JkZXIgd2hlbiBzZWxlY3RlZFxuXHRcdFxuXHRzZXRTdHlsZTogKHByb3BlcnR5LCB2YWx1ZSwgcHhTdWZmaXggPSBmYWxzZSkgLT5cblx0XHRAc3R5bGVbcHJvcGVydHldID0gaWYgcHhTdWZmaXggdGhlbiB2YWx1ZStcInB4XCIgZWxzZSB2YWx1ZVxuXHRcdEBlbWl0KFwiY2hhbmdlOiN7cHJvcGVydHl9XCIsIHZhbHVlKVxuXHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0XHRcblx0Y2FsY1NpemU6IC0+XG5cdFx0c2l6ZUFmZmVjdGluZ1N0eWxlcyA9XG5cdFx0XHRsaW5lSGVpZ2h0OiBAc3R5bGVbXCJsaW5lLWhlaWdodFwiXVxuXHRcdFx0Zm9udFNpemU6IEBzdHlsZVtcImZvbnQtc2l6ZVwiXVxuXHRcdFx0Zm9udFdlaWdodDogQHN0eWxlW1wiZm9udC13ZWlnaHRcIl1cblx0XHRcdHBhZGRpbmdUb3A6IEBzdHlsZVtcInBhZGRpbmctdG9wXCJdXG5cdFx0XHRwYWRkaW5nUmlnaHQ6IEBzdHlsZVtcInBhZGRpbmctcmlnaHRcIl1cblx0XHRcdHBhZGRpbmdCb3R0b206IEBzdHlsZVtcInBhZGRpbmctYm90dG9tXCJdXG5cdFx0XHRwYWRkaW5nTGVmdDogQHN0eWxlW1wicGFkZGluZy1sZWZ0XCJdXG5cdFx0XHR0ZXh0VHJhbnNmb3JtOiBAc3R5bGVbXCJ0ZXh0LXRyYW5zZm9ybVwiXVxuXHRcdFx0Ym9yZGVyV2lkdGg6IEBzdHlsZVtcImJvcmRlci13aWR0aFwiXVxuXHRcdFx0bGV0dGVyU3BhY2luZzogQHN0eWxlW1wibGV0dGVyLXNwYWNpbmdcIl1cblx0XHRcdGZvbnRGYW1pbHk6IEBzdHlsZVtcImZvbnQtZmFtaWx5XCJdXG5cdFx0XHRmb250U3R5bGU6IEBzdHlsZVtcImZvbnQtc3R5bGVcIl1cblx0XHRcdGZvbnRWYXJpYW50OiBAc3R5bGVbXCJmb250LXZhcmlhbnRcIl1cblx0XHRjb25zdHJhaW50cyA9IHt9XG5cdFx0aWYgQGRvQXV0b1NpemVIZWlnaHQgdGhlbiBjb25zdHJhaW50cy53aWR0aCA9IEB3aWR0aFxuXHRcdHNpemUgPSBVdGlscy50ZXh0U2l6ZSBAdGV4dCwgc2l6ZUFmZmVjdGluZ1N0eWxlcywgY29uc3RyYWludHNcblx0XHRpZiBAc3R5bGUudGV4dEFsaWduIGlzIFwicmlnaHRcIlxuXHRcdFx0QHdpZHRoID0gc2l6ZS53aWR0aFxuXHRcdFx0QHggPSBAeC1Ad2lkdGhcblx0XHRlbHNlXG5cdFx0XHRAd2lkdGggPSBzaXplLndpZHRoXG5cdFx0QGhlaWdodCA9IHNpemUuaGVpZ2h0XG5cblx0QGRlZmluZSBcImF1dG9TaXplXCIsXG5cdFx0Z2V0OiAtPiBAZG9BdXRvU2l6ZVxuXHRcdHNldDogKHZhbHVlKSAtPiBcblx0XHRcdEBkb0F1dG9TaXplID0gdmFsdWVcblx0XHRcdGlmIEBkb0F1dG9TaXplIHRoZW4gQGNhbGNTaXplKClcblx0QGRlZmluZSBcImF1dG9TaXplSGVpZ2h0XCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QGRvQXV0b1NpemUgPSB2YWx1ZVxuXHRcdFx0QGRvQXV0b1NpemVIZWlnaHQgPSB2YWx1ZVxuXHRcdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRAZGVmaW5lIFwiY29udGVudEVkaXRhYmxlXCIsXG5cdFx0c2V0OiAoYm9vbGVhbikgLT5cblx0XHRcdEBfZWxlbWVudC5jb250ZW50RWRpdGFibGUgPSBib29sZWFuXG5cdFx0XHRAaWdub3JlRXZlbnRzID0gIWJvb2xlYW5cblx0XHRcdEBvbiBcImlucHV0XCIsIC0+IEBjYWxjU2l6ZSgpIGlmIEBkb0F1dG9TaXplXG5cdEBkZWZpbmUgXCJ0ZXh0XCIsXG5cdFx0Z2V0OiAtPiBAX2VsZW1lbnQudGV4dENvbnRlbnRcblx0XHRzZXQ6ICh2YWx1ZSkgLT5cblx0XHRcdEBfZWxlbWVudC50ZXh0Q29udGVudCA9IHZhbHVlXG5cdFx0XHRAZW1pdChcImNoYW5nZTp0ZXh0XCIsIHZhbHVlKVxuXHRcdFx0aWYgQGRvQXV0b1NpemUgdGhlbiBAY2FsY1NpemUoKVxuXHRAZGVmaW5lIFwiZm9udEZhbWlseVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250RmFtaWx5XG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImZvbnRGYW1pbHlcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJmb250U2l6ZVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250U2l6ZS5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJmb250U2l6ZVwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcImxpbmVIZWlnaHRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUubGluZUhlaWdodCBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwibGluZUhlaWdodFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRXZWlnaHRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFdlaWdodCBcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFdlaWdodFwiLCB2YWx1ZSlcblx0QGRlZmluZSBcImZvbnRTdHlsZVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5mb250U3R5bGVcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFN0eWxlXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwiZm9udFZhcmlhbnRcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUuZm9udFZhcmlhbnRcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwiZm9udFZhcmlhbnRcIiwgdmFsdWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nXCIsXG5cdFx0c2V0OiAodmFsdWUpIC0+IFxuXHRcdFx0QHNldFN0eWxlKFwicGFkZGluZ1RvcFwiLCB2YWx1ZSwgdHJ1ZSlcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdSaWdodFwiLCB2YWx1ZSwgdHJ1ZSlcblx0XHRcdEBzZXRTdHlsZShcInBhZGRpbmdCb3R0b21cIiwgdmFsdWUsIHRydWUpXG5cdFx0XHRAc2V0U3R5bGUoXCJwYWRkaW5nTGVmdFwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdUb3BcIiwgXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ1RvcC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nVG9wXCIsIHZhbHVlLCB0cnVlKVxuXHRAZGVmaW5lIFwicGFkZGluZ1JpZ2h0XCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdSaWdodC5yZXBsYWNlKFwicHhcIixcIlwiKVxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJwYWRkaW5nUmlnaHRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJwYWRkaW5nQm90dG9tXCIsIFxuXHRcdGdldDogLT4gQHN0eWxlLnBhZGRpbmdCb3R0b20ucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ0JvdHRvbVwiLCB2YWx1ZSwgdHJ1ZSlcblx0QGRlZmluZSBcInBhZGRpbmdMZWZ0XCIsXG5cdFx0Z2V0OiAtPiBAc3R5bGUucGFkZGluZ0xlZnQucmVwbGFjZShcInB4XCIsXCJcIilcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwicGFkZGluZ0xlZnRcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJ0ZXh0QWxpZ25cIixcblx0XHRzZXQ6ICh2YWx1ZSkgLT4gQHNldFN0eWxlKFwidGV4dEFsaWduXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwidGV4dFRyYW5zZm9ybVwiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS50ZXh0VHJhbnNmb3JtIFxuXHRcdHNldDogKHZhbHVlKSAtPiBAc2V0U3R5bGUoXCJ0ZXh0VHJhbnNmb3JtXCIsIHZhbHVlKVxuXHRAZGVmaW5lIFwibGV0dGVyU3BhY2luZ1wiLCBcblx0XHRnZXQ6IC0+IEBzdHlsZS5sZXR0ZXJTcGFjaW5nLnJlcGxhY2UoXCJweFwiLFwiXCIpXG5cdFx0c2V0OiAodmFsdWUpIC0+IEBzZXRTdHlsZShcImxldHRlclNwYWNpbmdcIiwgdmFsdWUsIHRydWUpXG5cdEBkZWZpbmUgXCJsZW5ndGhcIiwgXG5cdFx0Z2V0OiAtPiBAdGV4dC5sZW5ndGhcblxuY29udmVydFRvVGV4dExheWVyID0gKGxheWVyKSAtPlxuXHR0ID0gbmV3IFRleHRMYXllclxuXHRcdG5hbWU6IGxheWVyLm5hbWVcblx0XHRmcmFtZTogbGF5ZXIuZnJhbWVcblx0XHRwYXJlbnQ6IGxheWVyLnBhcmVudFxuXHRcblx0Y3NzT2JqID0ge31cblx0Y3NzID0gbGF5ZXIuX2luZm8ubWV0YWRhdGEuY3NzXG5cdGNzcy5mb3JFYWNoIChydWxlKSAtPlxuXHRcdHJldHVybiBpZiBfLmluY2x1ZGVzIHJ1bGUsICcvKidcblx0XHRhcnIgPSBydWxlLnNwbGl0KCc6ICcpXG5cdFx0Y3NzT2JqW2FyclswXV0gPSBhcnJbMV0ucmVwbGFjZSgnOycsJycpXG5cdHQuc3R5bGUgPSBjc3NPYmpcblx0XG5cdGltcG9ydFBhdGggPSBsYXllci5fX2ZyYW1lckltcG9ydGVkRnJvbVBhdGhcblx0aWYgXy5pbmNsdWRlcyBpbXBvcnRQYXRoLCAnQDJ4J1xuXHRcdHQuZm9udFNpemUgKj0gMlxuXHRcdHQubGluZUhlaWdodCA9IChwYXJzZUludCh0LmxpbmVIZWlnaHQpKjIpKydweCdcblx0XHR0LmxldHRlclNwYWNpbmcgKj0gMlxuXHRcdFx0XHRcdFxuXHR0LnkgLT0gKHBhcnNlSW50KHQubGluZUhlaWdodCktdC5mb250U2l6ZSkvMiAjIGNvbXBlbnNhdGUgZm9yIGhvdyBDU1MgaGFuZGxlcyBsaW5lIGhlaWdodFxuXHR0LnkgLT0gdC5mb250U2l6ZSAqIDAuMSAjIHNrZXRjaCBwYWRkaW5nXG5cdHQueCAtPSB0LmZvbnRTaXplICogMC4wOCAjIHNrZXRjaCBwYWRkaW5nXG5cdHQud2lkdGggKz0gdC5mb250U2l6ZSAqIDAuNSAjIHNrZXRjaCBwYWRkaW5nXG5cblx0dC50ZXh0ID0gbGF5ZXIuX2luZm8ubWV0YWRhdGEuc3RyaW5nXG5cdGxheWVyLmRlc3Ryb3koKVxuXHRyZXR1cm4gdFxuXG5MYXllcjo6Y29udmVydFRvVGV4dExheWVyID0gLT4gY29udmVydFRvVGV4dExheWVyKEApXG5cbmNvbnZlcnRUZXh0TGF5ZXJzID0gKG9iaikgLT5cblx0Zm9yIHByb3AsbGF5ZXIgb2Ygb2JqXG5cdFx0aWYgbGF5ZXIuX2luZm8ua2luZCBpcyBcInRleHRcIlxuXHRcdFx0b2JqW3Byb3BdID0gY29udmVydFRvVGV4dExheWVyKGxheWVyKVxuXG4jIEJhY2t3YXJkcyBjb21wYWJpbGl0eS4gUmVwbGFjZWQgYnkgY29udmVydFRvVGV4dExheWVyKClcbkxheWVyOjpmcmFtZUFzVGV4dExheWVyID0gKHByb3BlcnRpZXMpIC0+XG4gICAgdCA9IG5ldyBUZXh0TGF5ZXJcbiAgICB0LmZyYW1lID0gQGZyYW1lXG4gICAgdC5zdXBlckxheWVyID0gQHN1cGVyTGF5ZXJcbiAgICBfLmV4dGVuZCB0LHByb3BlcnRpZXNcbiAgICBAZGVzdHJveSgpXG4gICAgdFxuXG5leHBvcnRzLlRleHRMYXllciA9IFRleHRMYXllclxuZXhwb3J0cy5jb252ZXJ0VGV4dExheWVycyA9IGNvbnZlcnRUZXh0TGF5ZXJzXG4iLCJjbGFzcyBtb2R1bGUuZXhwb3J0cyBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmJhY2tCdXR0b25OYW1lID89ICdiYWNrQnV0dG9uJ1xuXHRcdG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyA/PSB7IGN1cnZlOiBcImN1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKVwiLCB0aW1lOiAuNyB9XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5zY3JvbGwgPz0gZmFsc2Vcblx0XHRvcHRpb25zLmF1dG9MaW5rID89IHRydWVcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cblx0XHRAb25DaGFuZ2UgXCJzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpID0+XG5cdFx0XHR2aWV3ID0gY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0aWYgdmlldz9cblx0XHRcdFx0IyBkZWZhdWx0IGJlaGF2aW9ycyBmb3Igdmlld3Ncblx0XHRcdFx0dmlldy5jbGlwID0gdHJ1ZVxuXHRcdFx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0XHRcdCMgYWRkIHNjcm9sbGNvbXBvbmVudFxuXHRcdFx0XHRpZiBAc2Nyb2xsXG5cdFx0XHRcdFx0Y2hpbGRyZW4gPSB2aWV3LmNoaWxkcmVuXG5cdFx0XHRcdFx0c2Nyb2xsQ29tcG9uZW50ID0gbmV3IFNjcm9sbENvbXBvbmVudFxuXHRcdFx0XHRcdFx0bmFtZTogXCJzY3JvbGxDb21wb25lbnRcIlxuXHRcdFx0XHRcdFx0d2lkdGg6IEB3aWR0aFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBAaGVpZ2h0XG5cdFx0XHRcdFx0XHRwYXJlbnQ6IHZpZXdcblx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuY29udGVudC5iYWNrZ3JvdW5kQ29sb3IgPSBcIlwiXG5cdFx0XHRcdFx0aWYgdmlldy53aWR0aCA8PSBAd2lkdGhcblx0XHRcdFx0XHRcdHNjcm9sbENvbXBvbmVudC5zY3JvbGxIb3Jpem9udGFsID0gZmFsc2Vcblx0XHRcdFx0XHRpZiB2aWV3LmhlaWdodCA8PSBAaGVpZ2h0XG5cdFx0XHRcdFx0XHRzY3JvbGxDb21wb25lbnQuc2Nyb2xsVmVydGljYWwgPSBmYWxzZVxuXHRcdFx0XHRcdGZvciBjIGluIGNoaWxkcmVuXG5cdFx0XHRcdFx0XHRjLnBhcmVudCA9IHNjcm9sbENvbXBvbmVudC5jb250ZW50XG5cdFx0XHRcdFx0dmlldy5zY3JvbGxDb21wb25lbnQgPSBzY3JvbGxDb21wb25lbnQgIyBtYWtlIGl0IGFjY2Vzc2libGUgYXMgYSBwcm9wZXJ0eVxuXHRcdFx0XHRcdCMgcmVzZXQgc2l6ZSBzaW5jZSBjb250ZW50IG1vdmVkIHRvIHNjcm9sbENvbXBvbmVudC4gcHJldmVudHMgc2Nyb2xsIGJ1ZyB3aGVuIGRyYWdnaW5nIG91dHNpZGUuXG5cdFx0XHRcdFx0dmlldy5zaXplID0ge3dpZHRoOiBAd2lkdGgsIGhlaWdodDogQGhlaWdodH1cblxuXHRcdHRyYW5zaXRpb25zID1cblx0XHRcdHN3aXRjaEluc3RhbnQ6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiAwLCB5OiAwfVxuXHRcdFx0ZmFkZUluOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHtvcGFjaXR5OiAwfVxuXHRcdFx0XHRcdHRvOiB7b3BhY2l0eTogMX1cblx0XHRcdHpvb21Jbjpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7c2NhbGU6IDAuOCwgb3BhY2l0eTogMH1cblx0XHRcdFx0XHR0bzoge3NjYWxlOiAxLCBvcGFjaXR5OiAxfVxuXHRcdFx0em9vbU91dDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3NjYWxlOiAwLjgsIG9wYWNpdHk6IDB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0dG86IHt9XG5cdFx0XHRzbGlkZUluVXA6XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3k6IEBoZWlnaHR9XG5cdFx0XHRcdFx0dG86IHt5OiAwfVxuXHRcdFx0c2xpZGVJblJpZ2h0OlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0c2xpZGVJbkRvd246XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge21heFk6IDB9XG5cdFx0XHRcdFx0dG86IHt5OiAwfVxuXHRcdFx0bW92ZUluUmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHttYXhYOiAwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0bW92ZUluTGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WDogMH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRzbGlkZUluTGVmdDpcblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7bWF4WDogMH1cblx0XHRcdFx0XHR0bzoge21heFg6IEB3aWR0aH1cblx0XHRcdHB1c2hJblJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogLShAd2lkdGgvNSksIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt4OiBAd2lkdGh9XG5cdFx0XHRcdFx0dG86IHt4OiAwfVxuXHRcdFx0cHVzaEluTGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge3g6IEB3aWR0aC81LCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogLUB3aWR0aH1cblx0XHRcdFx0XHR0bzoge3g6IDB9XG5cdFx0XHRwdXNoT3V0UmlnaHQ6XG5cdFx0XHRcdG9sZFZpZXc6XG5cdFx0XHRcdFx0dG86IHt4OiBAd2lkdGh9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0ZnJvbToge3g6IC0oQHdpZHRoLzUpLCBicmlnaHRuZXNzOiA3MH1cblx0XHRcdFx0XHR0bzoge3g6IDAsIGJyaWdodG5lc3M6IDEwMH1cblx0XHRcdHB1c2hPdXRMZWZ0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7bWF4WDogMH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHRmcm9tOiB7eDogQHdpZHRoLzUsIGJyaWdodG5lc3M6IDcwfVxuXHRcdFx0XHRcdHRvOiB7eDogMCwgYnJpZ2h0bmVzczogMTAwfVxuXHRcdFx0c2xpZGVPdXRVcDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFk6IDB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0dG86IHt9XG5cdFx0XHRzbGlkZU91dFJpZ2h0OlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eDogQHdpZHRofVxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdHRvOiB7fVxuXHRcdFx0c2xpZGVPdXREb3duOlxuXHRcdFx0XHRvbGRWaWV3OlxuXHRcdFx0XHRcdHRvOiB7eTogQGhlaWdodH1cblx0XHRcdFx0bmV3Vmlldzpcblx0XHRcdFx0XHR0bzoge31cblx0XHRcdHNsaWRlT3V0TGVmdDpcblx0XHRcdFx0b2xkVmlldzpcblx0XHRcdFx0XHR0bzoge21heFg6IDB9XG5cdFx0XHRcdG5ld1ZpZXc6XG5cdFx0XHRcdFx0dG86IHt9XG5cdFx0XHRhbmRyb2lkUHVzaEluOlxuXHRcdFx0XHRuZXdWaWV3OlxuXHRcdFx0XHRcdGZyb206IHt5OiBAaGVpZ2h0LzUsIG9wYWNpdHk6IDB9XG5cdFx0XHRcdFx0dG86IHt5OiAwLCBvcGFjaXR5OiAxfVxuXG5cdFx0IyBzaG9ydGN1dHNcblx0XHR0cmFuc2l0aW9ucy5zbGlkZUluID0gdHJhbnNpdGlvbnMuc2xpZGVJblJpZ2h0XG5cdFx0dHJhbnNpdGlvbnMuc2xpZGVPdXQgPSB0cmFuc2l0aW9ucy5zbGlkZU91dFJpZ2h0XG5cdFx0dHJhbnNpdGlvbnMucHVzaEluID0gdHJhbnNpdGlvbnMucHVzaEluUmlnaHRcblx0XHR0cmFuc2l0aW9ucy5wdXNoT3V0ID0gdHJhbnNpdGlvbnMucHVzaE91dFJpZ2h0XG5cblx0XHQjIGV2ZW50c1xuXHRcdEV2ZW50cy5WaWV3V2lsbFN3aXRjaCA9IFwidmlld1dpbGxTd2l0Y2hcIlxuXHRcdEV2ZW50cy5WaWV3RGlkU3dpdGNoID0gXCJ2aWV3RGlkU3dpdGNoXCJcblx0XHRMYXllcjo6b25WaWV3V2lsbFN3aXRjaCA9IChjYikgLT4gQG9uKEV2ZW50cy5WaWV3V2lsbFN3aXRjaCwgY2IpXG5cdFx0TGF5ZXI6Om9uVmlld0RpZFN3aXRjaCA9IChjYikgLT4gQG9uKEV2ZW50cy5WaWV3RGlkU3dpdGNoLCBjYilcdFx0XG5cblx0XHRfLmVhY2ggdHJhbnNpdGlvbnMsIChhbmltUHJvcHMsIG5hbWUpID0+XG5cblx0XHRcdGlmIG9wdGlvbnMuYXV0b0xpbmtcblx0XHRcdFx0bGF5ZXJzID0gRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpXG5cdFx0XHRcdGZvciBidG4gaW4gbGF5ZXJzXG5cdFx0XHRcdFx0aWYgXy5pbmNsdWRlcyBidG4ubmFtZSwgbmFtZVxuXHRcdFx0XHRcdFx0dmlld0NvbnRyb2xsZXIgPSBAXG5cdFx0XHRcdFx0XHRidG4ub25DbGljayAtPlxuXHRcdFx0XHRcdFx0XHRhbmltID0gQG5hbWUuc3BsaXQoJ18nKVswXVxuXHRcdFx0XHRcdFx0XHRsaW5rTmFtZSA9IEBuYW1lLnJlcGxhY2UoYW5pbSsnXycsJycpXG5cdFx0XHRcdFx0XHRcdGxpbmtOYW1lID0gbGlua05hbWUucmVwbGFjZSgvXFxkKy9nLCAnJykgIyByZW1vdmUgbnVtYmVyc1xuXHRcdFx0XHRcdFx0XHR2aWV3Q29udHJvbGxlclthbmltXSBfLmZpbmQobGF5ZXJzLCAobCkgLT4gbC5uYW1lIGlzIGxpbmtOYW1lKVxuXG5cdFx0XHRAW25hbWVdID0gKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgPT5cblxuXHRcdFx0XHRyZXR1cm4gaWYgbmV3VmlldyBpcyBAY3VycmVudFZpZXdcblxuXG5cblx0XHRcdFx0IyBtYWtlIHN1cmUgdGhlIG5ldyBsYXllciBpcyBpbnNpZGUgdGhlIHZpZXdjb250cm9sbGVyXG5cdFx0XHRcdG5ld1ZpZXcucGFyZW50ID0gQFxuXHRcdFx0XHRuZXdWaWV3LnNlbmRUb0JhY2soKVxuXG5cdFx0XHRcdCMgcmVzZXQgcHJvcHMgaW4gY2FzZSB0aGV5IHdlcmUgY2hhbmdlZCBieSBhIHByZXYgYW5pbWF0aW9uXG5cdFx0XHRcdG5ld1ZpZXcucG9pbnQgPSB7eDowLCB5OiAwfVxuXHRcdFx0XHRuZXdWaWV3Lm9wYWNpdHkgPSAxXG5cdFx0XHRcdG5ld1ZpZXcuc2NhbGUgPSAxXG5cdFx0XHRcdG5ld1ZpZXcuYnJpZ2h0bmVzcyA9IDEwMFxuXHRcdFx0XHRcblx0XHRcdFx0IyBvbGRWaWV3XG5cdFx0XHRcdEBjdXJyZW50Vmlldz8ucG9pbnQgPSB7eDogMCwgeTogMH0gIyBmaXhlcyBvZmZzZXQgaXNzdWUgd2hlbiBtb3ZpbmcgdG9vIGZhc3QgYmV0d2VlbiBzY3JlZW5zXG5cdFx0XHRcdEBjdXJyZW50Vmlldz8ucHJvcHMgPSBhbmltUHJvcHMub2xkVmlldz8uZnJvbVxuXHRcdFx0XHRhbmltT2JqID0gXy5leHRlbmQge3Byb3BlcnRpZXM6IGFuaW1Qcm9wcy5vbGRWaWV3Py50b30sIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdFx0Xy5kZWZhdWx0cyhhbmltT2JqLCB7IHByb3BlcnRpZXM6IHt9IH0pXG5cdFx0XHRcdG91dGdvaW5nID0gQGN1cnJlbnRWaWV3Py5hbmltYXRlIGFuaW1PYmpcblxuXHRcdFx0XHQjIG5ld1ZpZXdcblx0XHRcdFx0bmV3Vmlldy5wcm9wcyA9IGFuaW1Qcm9wcy5uZXdWaWV3Py5mcm9tXG5cdFx0XHRcdGluY29taW5nID0gbmV3Vmlldy5hbmltYXRlIF8uZXh0ZW5kIHtwcm9wZXJ0aWVzOiBhbmltUHJvcHMubmV3Vmlldz8udG99LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRcdFxuXHRcdFx0XHQjIGxheWVyIG9yZGVyXG5cdFx0XHRcdGlmIF8uaW5jbHVkZXMgbmFtZSwgJ091dCdcblx0XHRcdFx0XHRuZXdWaWV3LnBsYWNlQmVoaW5kKEBjdXJyZW50Vmlldylcblx0XHRcdFx0XHRvdXRnb2luZy5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PiBAY3VycmVudFZpZXcuYnJpbmdUb0Zyb250KClcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG5ld1ZpZXcucGxhY2VCZWZvcmUoQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRAZW1pdChFdmVudHMuVmlld1dpbGxTd2l0Y2gsIEBjdXJyZW50VmlldywgbmV3Vmlldylcblx0XHRcdFx0XG5cdFx0XHRcdCMgY2hhbmdlIEN1cnJlbnRWaWV3IGJlZm9yZSBhbmltYXRpb24gaGFzIGZpbmlzaGVkIHNvIG9uZSBjb3VsZCBnbyBiYWNrIGluIGhpc3Rvcnlcblx0XHRcdFx0IyB3aXRob3V0IGhhdmluZyB0byB3YWl0IGZvciB0aGUgdHJhbnNpdGlvbiB0byBmaW5pc2hcblx0XHRcdFx0QHNhdmVDdXJyZW50Vmlld1RvSGlzdG9yeSBuYW1lLCBvdXRnb2luZywgaW5jb21pbmdcblx0XHRcdFx0QGN1cnJlbnRWaWV3ID0gbmV3Vmlld1xuXHRcdFx0XHRAZW1pdChcImNoYW5nZTpwcmV2aW91c1ZpZXdcIiwgQHByZXZpb3VzVmlldylcblx0XHRcdFx0QGVtaXQoXCJjaGFuZ2U6Y3VycmVudFZpZXdcIiwgQGN1cnJlbnRWaWV3KVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgaW5jb21pbmcuaXNBbmltYXRpbmdcblx0XHRcdFx0XHRob29rID0gaW5jb21pbmcgXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRob29rID0gb3V0Z29pbmdcblx0XHRcdFx0aG9vay5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0XHRcdEBlbWl0KEV2ZW50cy5WaWV3RGlkU3dpdGNoLCBAcHJldmlvdXNWaWV3LCBAY3VycmVudFZpZXcpXG5cdFx0XHRcdFxuXG5cdFx0aWYgb3B0aW9ucy5pbml0aWFsVmlld05hbWU/XG5cdFx0XHRhdXRvSW5pdGlhbCA9IF8uZmluZCBGcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKCksIChsKSAtPiBsLm5hbWUgaXMgb3B0aW9ucy5pbml0aWFsVmlld05hbWVcblx0XHRcdGlmIGF1dG9Jbml0aWFsPyB0aGVuIEBzd2l0Y2hJbnN0YW50IGF1dG9Jbml0aWFsXG5cblx0XHRpZiBvcHRpb25zLmluaXRpYWxWaWV3P1xuXHRcdFx0QHN3aXRjaEluc3RhbnQgb3B0aW9ucy5pbml0aWFsVmlld1xuXG5cdFx0aWYgb3B0aW9ucy5iYWNrQnV0dG9uTmFtZT9cblx0XHRcdGJhY2tCdXR0b25zID0gXy5maWx0ZXIgRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpLCAobCkgLT4gXy5pbmNsdWRlcyBsLm5hbWUsIG9wdGlvbnMuYmFja0J1dHRvbk5hbWVcblx0XHRcdGZvciBidG4gaW4gYmFja0J1dHRvbnNcblx0XHRcdFx0YnRuLm9uQ2xpY2sgPT4gQGJhY2soKVxuXG5cdEBkZWZpbmUgXCJwcmV2aW91c1ZpZXdcIixcblx0XHRcdGdldDogLT4gQGhpc3RvcnlbMF0udmlld1xuXG5cdHNhdmVDdXJyZW50Vmlld1RvSGlzdG9yeTogKG5hbWUsb3V0Z29pbmdBbmltYXRpb24saW5jb21pbmdBbmltYXRpb24pIC0+XG5cdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0dmlldzogQGN1cnJlbnRWaWV3XG5cdFx0XHRhbmltYXRpb25OYW1lOiBuYW1lXG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbjogaW5jb21pbmdBbmltYXRpb25cblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uOiBvdXRnb2luZ0FuaW1hdGlvblxuXG5cdGJhY2s6IC0+XG5cdFx0cHJldmlvdXMgPSBAaGlzdG9yeVswXVxuXHRcdGlmIHByZXZpb3VzLnZpZXc/XG5cblx0XHRcdGlmIF8uaW5jbHVkZXMgcHJldmlvdXMuYW5pbWF0aW9uTmFtZSwgJ091dCdcblx0XHRcdFx0cHJldmlvdXMudmlldy5icmluZ1RvRnJvbnQoKVxuXG5cdFx0XHRiYWNrSW4gPSBwcmV2aW91cy5vdXRnb2luZ0FuaW1hdGlvbi5yZXZlcnNlKClcblx0XHRcdG1vdmVPdXQgPSBwcmV2aW91cy5pbmNvbWluZ0FuaW1hdGlvbi5yZXZlcnNlKClcblxuXHRcdFx0YmFja0luLnN0YXJ0KClcblx0XHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0XHRAY3VycmVudFZpZXcgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0XHRtb3ZlT3V0Lm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+IEBjdXJyZW50Vmlldy5icmluZ1RvRnJvbnQoKVxuIiwiIyBNb2R1bGUgY3JlYXRlZCBieSBBYXJvbiBKYW1lcyB8IEFwcmlsIDE2dGgsIDIwMTZcbiNcbiMgUG9pbnRlciBNb2R1bGUgYnkgSm9yZGFuIERvYnNvbiBpcyByZXF1aXJlZCBmb3IgdGhpcyBtb2R1bGVcbiMgSW5zdGFsbCB0aGlzIG1vZHVsZSBmaXJzdCBoZXJlOiBodHRwOi8vYml0Lmx5LzFsZ21OcFRcbiNcbiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSBhdCB0aGUgdG9wIG9mIHlvdXIgcHJvamVjdCB0byBhY2Nlc3MgdGhpcyBtb2R1bGU6XG4jIGFuZHJvaWQgPSByZXF1aXJlIFwiYW5kcm9pZFJpcHBsZVwiXG4jXG4jIFRvIGFkZCByaXBwbGUgdG8gbGF5ZXIsIHVzZSB0aGlzIGxpbmUgb2YgY29kZTpcbiMgbGF5ZXJOYW1lLm9uKEV2ZW50cy5DbGljaywgYW5kcm9pZC5yaXBwbGUpXG4jIFJlcGxhY2UgbGF5ZXJOYW1lIHdpdGggdGhlIG5hbWUgb2YgeW91ciBsYXllclxuI1xuIyBBdmFpbGFibGUgb3B0aW9uczpcbiMgWW91IGNhbiB1c2UgYW55IEV2ZW50IHdpdGggdGhpcyBtb2R1bGVcblxue1BvaW50ZXJ9ID0gcmVxdWlyZSBcIlBvaW50ZXJcIlxuXG4jIGNyZWF0ZSByaXBwbGUgZnVuY3Rpb25cbmV4cG9ydHMuUmlwcGxlID0gKGV2ZW50LCBsYXllcikgLT5cblx0ZXZlbnRDb29yZHMgPSBQb2ludGVyLm9mZnNldChldmVudCwgbGF5ZXIpXG5cdCMgU2V0IFJpcHBsZSBDb2xvclxuXHRyaXBwbGVDb2xvciA9IGlmIGxheWVyLnJpcHBsZUNvbG9yIHRoZW4gbGF5ZXIucmlwcGxlQ29sb3IgZWxzZSBcImJsYWNrXCJcblxuXHQjIENoYW5nZSBjb2xvciBvZiByaXBwbGVcblx0Y29sb3IgPSByaXBwbGVDb2xvclxuXHRhbmltYXRpb24gPSBjdXJ2ZTogXCJlYXNlLW91dFwiLCB0aW1lOiAuNFxuXG5cdCMgQ3JlYXRlIGxheWVycyBvbiBDbGlja1xuXHRwcmVzc0ZlZWRiYWNrID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogQFxuXHRcdG5hbWU6IFwicHJlc3NGZWVkYmFja1wiXG5cdFx0d2lkdGg6IGxheWVyLndpZHRoXG5cdFx0aGVpZ2h0OiBsYXllci5oZWlnaHRcblx0XHRvcGFjaXR5OiAwXG5cdFx0YmFja2dyb3VuZENvbG9yOiByaXBwbGVDb2xvclxuXHRwcmVzc0ZlZWRiYWNrLnN0YXRlcy5hZGRcblx0XHRwcmVzc2VkOiBvcGFjaXR5OiAuMDRcblx0cHJlc3NGZWVkYmFjay5zdGF0ZXMuc3dpdGNoKFwicHJlc3NlZFwiLCBhbmltYXRpb24pXG5cblx0cmlwcGxlQ2lyY2xlID0gbmV3IExheWVyXG5cdFx0c3VwZXJMYXllcjogQFxuXHRcdG5hbWU6IFwicmlwcGxlQ2lyY2xlXCJcblx0XHRib3JkZXJSYWRpdXM6IFwiNTAlXCJcblx0XHRtaWRYOiBldmVudENvb3Jkcy54XG5cdFx0bWlkWTogZXZlbnRDb29yZHMueVxuXHRcdG9wYWNpdHk6IC4xNlxuXHRcdGJhY2tncm91bmRDb2xvcjogcmlwcGxlQ29sb3Jcblx0cmlwcGxlQ2lyY2xlLnN0YXRlcy5hZGRcblx0XHRwcmVzc2VkOiBzY2FsZTogbGF5ZXIud2lkdGggLyA2MCwgb3BhY2l0eTogMCxcblx0cmlwcGxlQ2lyY2xlLnN0YXRlcy5zd2l0Y2goXCJwcmVzc2VkXCIsIGFuaW1hdGlvbilcblxuXHQjIERlc3Ryb3kgbGF5ZXJzIGFmdGVyIENsaWNrXG5cdFV0aWxzLmRlbGF5IDAuMywgLT5cblx0XHRwcmVzc0ZlZWRiYWNrLnN0YXRlcy5uZXh0KFwiZGVmYXVsdFwiLCBhbmltYXRpb24pXG5cdFx0cHJlc3NGZWVkYmFjay5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCAtPlxuXHRcdFx0cmlwcGxlQ2lyY2xlLmRlc3Ryb3koKVxuXHRcdFx0cHJlc3NGZWVkYmFjay5kZXN0cm95KClcbiIsIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iXX0=
