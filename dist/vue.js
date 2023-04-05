(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
    const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
    const startTagOpen = new RegExp(`^<${qnameCapture}`);
    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    const startTagClose = /^\s*(\/?)>/;
    function parseHTML(html) {
      //  console.log(html.match(attribut1));

      function advance(n) {
        html = html.substring(n);
      }
      function parseStartTag() {
        const start = html.match(startTagOpen);
        // console.log(start);
        if (start) {
          const match = {
            tagName: start[1],
            // 标签名
            attrs: []
          };
          advance(start[0].length);

          // 如果不是开始标签就一直匹配下去
          let attr, end;
          while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            advance(attr[0].length);
            console.log("attr", attr);
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5] || true
            });
          }
          if (end) {
            advance(end[0].length);
          }

          // console.log("endhtml",html);
        }

        return false;
      }
      while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd == 0) {
          parseStartTag();
          break;
        }
      }
    }
    function compilerToFunction(template) {
      let ast = parseHTML(template);
      console.log("template", ast);
    }

    let oldArrayProto = Array.prototype;
    let newArrayProto = Object.create(oldArrayProto);
    let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
    methods.forEach(method => {
      newArrayProto[method] = function (...args) {
        const result = oldArrayProto[method].call(this, ...args);
        let inserted;
        let ob = this.__ob__;
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.splice(2);
            break;
        }
        if (inserted) {
          ob.observerArray(inserted);
        }
        return result;
      };
    });

    class Observer {
      constructor(data) {
        //  data.__ob__ = this; 
        Object.defineProperty(data, '__ob__', {
          value: this,
          enumerable: false
        });
        if (Array.isArray(data)) {
          data.__proto__ = newArrayProto;
          this.obeserveArray(data);
        } else {
          this.walk(data);
        }
      }
      walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
      }
      obeserveArray(data) {
        data.forEach(item => {
          obeserve(item);
        });
      }
    }
    function defineReactive(target, key, value) {
      obeserve(value);
      Object.defineProperty(target, key, {
        get() {
          return value;
        },
        set(newvalue) {
          if (newvalue === value) return;
          value = newvalue;
        }
      });
    }
    function obeserve(data) {
      if (typeof data !== 'object' || data == null) {
        return;
      }
      if (data.__ob__ instanceof Observer) {
        return data.__ob__;
      }
      return new Observer(data);
    }

    function initState(vm) {
      const opts = vm.$options;
      if (!opts.render) {
        initData(vm);
      }
    }
    function proxy(vm, target, key) {
      Object.defineProperty(vm, key, {
        get() {
          return vm[target][key];
        },
        set(newvalue) {
          if (vm[target][key] === newvalue) return;
          vm[target][key] = newvalue;
        }
      });
    }
    function initData(vm) {
      let data = vm.$options.data;
      data = typeof data === 'function' ? data.call(vm) : data;
      vm._data = data;

      // 数据劫持
      obeserve(data);
      for (let key in data) {
        proxy(vm, "_data", key);
      }
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        const vm = this;
        vm.$options = options;
        initState(vm);
        if (options.el) {
          vm.$mount(options.el);
        }
      };
      Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);
        let ops = vm.$options;
        if (!ops.render) {
          let template;
          if (!ops.template && el) {
            template = el.outerHTML;
          } else {
            if (el) {
              template = ops.template;
            }
          }
          if (template) {
            const render = compilerToFunction(template);
            ops.render = render;
          }
          console.log("template", template);
        }
        ops.render;
      };
    }

    function Vue(options) {
      this._init(options);
    }
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
