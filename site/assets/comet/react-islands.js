var hf = { exports: {} }, as = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var rg;
function ZT() {
  if (rg) return as;
  rg = 1;
  var a = Symbol.for("react.transitional.element"), l = Symbol.for("react.fragment");
  function r(u, c, h) {
    var d = null;
    if (h !== void 0 && (d = "" + h), c.key !== void 0 && (d = "" + c.key), "key" in c) {
      h = {};
      for (var m in c)
        m !== "key" && (h[m] = c[m]);
    } else h = c;
    return c = h.ref, {
      $$typeof: a,
      type: u,
      key: d,
      ref: c !== void 0 ? c : null,
      props: h
    };
  }
  return as.Fragment = l, as.jsx = r, as.jsxs = r, as;
}
var cg;
function KT() {
  return cg || (cg = 1, hf.exports = ZT()), hf.exports;
}
var Jt = KT(), mf = { exports: {} }, ls = {}, pf = { exports: {} }, yf = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fg;
function kT() {
  return fg || (fg = 1, (function(a) {
    function l(G, it) {
      var k = G.length;
      G.push(it);
      t: for (; 0 < k; ) {
        var ft = k - 1 >>> 1, q = G[ft];
        if (0 < c(q, it))
          G[ft] = it, G[k] = q, k = ft;
        else break t;
      }
    }
    function r(G) {
      return G.length === 0 ? null : G[0];
    }
    function u(G) {
      if (G.length === 0) return null;
      var it = G[0], k = G.pop();
      if (k !== it) {
        G[0] = k;
        t: for (var ft = 0, q = G.length, Kt = q >>> 1; ft < Kt; ) {
          var Me = 2 * (ft + 1) - 1, dn = G[Me], A = Me + 1, L = G[A];
          if (0 > c(dn, k))
            A < q && 0 > c(L, dn) ? (G[ft] = L, G[A] = k, ft = A) : (G[ft] = dn, G[Me] = k, ft = Me);
          else if (A < q && 0 > c(L, k))
            G[ft] = L, G[A] = k, ft = A;
          else break t;
        }
      }
      return it;
    }
    function c(G, it) {
      var k = G.sortIndex - it.sortIndex;
      return k !== 0 ? k : G.id - it.id;
    }
    if (a.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var h = performance;
      a.unstable_now = function() {
        return h.now();
      };
    } else {
      var d = Date, m = d.now();
      a.unstable_now = function() {
        return d.now() - m;
      };
    }
    var g = [], b = [], v = 1, p = null, S = 3, z = !1, w = !1, U = !1, N = !1, H = typeof setTimeout == "function" ? setTimeout : null, j = typeof clearTimeout == "function" ? clearTimeout : null, Y = typeof setImmediate < "u" ? setImmediate : null;
    function X(G) {
      for (var it = r(b); it !== null; ) {
        if (it.callback === null) u(b);
        else if (it.startTime <= G)
          u(b), it.sortIndex = it.expirationTime, l(g, it);
        else break;
        it = r(b);
      }
    }
    function P(G) {
      if (U = !1, X(G), !w)
        if (r(g) !== null)
          w = !0, st || (st = !0, Ct());
        else {
          var it = r(b);
          it !== null && At(P, it.startTime - G);
        }
    }
    var st = !1, Z = -1, V = 5, dt = -1;
    function nt() {
      return N ? !0 : !(a.unstable_now() - dt < V);
    }
    function bt() {
      if (N = !1, st) {
        var G = a.unstable_now();
        dt = G;
        var it = !0;
        try {
          t: {
            w = !1, U && (U = !1, j(Z), Z = -1), z = !0;
            var k = S;
            try {
              e: {
                for (X(G), p = r(g); p !== null && !(p.expirationTime > G && nt()); ) {
                  var ft = p.callback;
                  if (typeof ft == "function") {
                    p.callback = null, S = p.priorityLevel;
                    var q = ft(
                      p.expirationTime <= G
                    );
                    if (G = a.unstable_now(), typeof q == "function") {
                      p.callback = q, X(G), it = !0;
                      break e;
                    }
                    p === r(g) && u(g), X(G);
                  } else u(g);
                  p = r(g);
                }
                if (p !== null) it = !0;
                else {
                  var Kt = r(b);
                  Kt !== null && At(
                    P,
                    Kt.startTime - G
                  ), it = !1;
                }
              }
              break t;
            } finally {
              p = null, S = k, z = !1;
            }
            it = void 0;
          }
        } finally {
          it ? Ct() : st = !1;
        }
      }
    }
    var Ct;
    if (typeof Y == "function")
      Ct = function() {
        Y(bt);
      };
    else if (typeof MessageChannel < "u") {
      var ee = new MessageChannel(), Xt = ee.port2;
      ee.port1.onmessage = bt, Ct = function() {
        Xt.postMessage(null);
      };
    } else
      Ct = function() {
        H(bt, 0);
      };
    function At(G, it) {
      Z = H(function() {
        G(a.unstable_now());
      }, it);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(G) {
      G.callback = null;
    }, a.unstable_forceFrameRate = function(G) {
      0 > G || 125 < G ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : V = 0 < G ? Math.floor(1e3 / G) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return S;
    }, a.unstable_next = function(G) {
      switch (S) {
        case 1:
        case 2:
        case 3:
          var it = 3;
          break;
        default:
          it = S;
      }
      var k = S;
      S = it;
      try {
        return G();
      } finally {
        S = k;
      }
    }, a.unstable_requestPaint = function() {
      N = !0;
    }, a.unstable_runWithPriority = function(G, it) {
      switch (G) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          G = 3;
      }
      var k = S;
      S = G;
      try {
        return it();
      } finally {
        S = k;
      }
    }, a.unstable_scheduleCallback = function(G, it, k) {
      var ft = a.unstable_now();
      switch (typeof k == "object" && k !== null ? (k = k.delay, k = typeof k == "number" && 0 < k ? ft + k : ft) : k = ft, G) {
        case 1:
          var q = -1;
          break;
        case 2:
          q = 250;
          break;
        case 5:
          q = 1073741823;
          break;
        case 4:
          q = 1e4;
          break;
        default:
          q = 5e3;
      }
      return q = k + q, G = {
        id: v++,
        callback: it,
        priorityLevel: G,
        startTime: k,
        expirationTime: q,
        sortIndex: -1
      }, k > ft ? (G.sortIndex = k, l(b, G), r(g) === null && G === r(b) && (U ? (j(Z), Z = -1) : U = !0, At(P, k - ft))) : (G.sortIndex = q, l(g, G), w || z || (w = !0, st || (st = !0, Ct()))), G;
    }, a.unstable_shouldYield = nt, a.unstable_wrapCallback = function(G) {
      var it = S;
      return function() {
        var k = S;
        S = it;
        try {
          return G.apply(this, arguments);
        } finally {
          S = k;
        }
      };
    };
  })(yf)), yf;
}
var dg;
function JT() {
  return dg || (dg = 1, pf.exports = kT()), pf.exports;
}
var gf = { exports: {} }, ct = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hg;
function FT() {
  if (hg) return ct;
  hg = 1;
  var a = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), c = Symbol.for("react.profiler"), h = Symbol.for("react.consumer"), d = Symbol.for("react.context"), m = Symbol.for("react.forward_ref"), g = Symbol.for("react.suspense"), b = Symbol.for("react.memo"), v = Symbol.for("react.lazy"), p = Symbol.for("react.activity"), S = Symbol.for("react.view_transition"), z = Symbol.iterator;
  function w(A) {
    return A === null || typeof A != "object" ? null : (A = z && A[z] || A["@@iterator"], typeof A == "function" ? A : null);
  }
  var U = {
    isMounted: function() {
      return !1;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, N = Object.assign, H = {};
  function j(A, L, K) {
    this.props = A, this.context = L, this.refs = H, this.updater = K || U;
  }
  j.prototype.isReactComponent = {}, j.prototype.setState = function(A, L) {
    if (typeof A != "object" && typeof A != "function" && A != null)
      throw Error(
        "takes an object of state variables to update or a function which returns an object of state variables."
      );
    this.updater.enqueueSetState(this, A, L, "setState");
  }, j.prototype.forceUpdate = function(A) {
    this.updater.enqueueForceUpdate(this, A, "forceUpdate");
  };
  function Y() {
  }
  Y.prototype = j.prototype;
  function X(A, L, K) {
    this.props = A, this.context = L, this.refs = H, this.updater = K || U;
  }
  var P = X.prototype = new Y();
  P.constructor = X, N(P, j.prototype), P.isPureReactComponent = !0;
  var st = Array.isArray;
  function Z() {
  }
  var V = { H: null, A: null, T: null, S: null }, dt = Object.prototype.hasOwnProperty;
  function nt(A, L, K) {
    var et = K.ref;
    return {
      $$typeof: a,
      type: A,
      key: L,
      ref: et !== void 0 ? et : null,
      props: K
    };
  }
  function bt(A, L) {
    return nt(A.type, L, A.props);
  }
  function Ct(A) {
    return typeof A == "object" && A !== null && A.$$typeof === a;
  }
  function ee(A) {
    var L = { "=": "=0", ":": "=2" };
    return "$" + A.replace(/[=:]/g, function(K) {
      return L[K];
    });
  }
  var Xt = /\/+/g;
  function At(A, L) {
    return typeof A == "object" && A !== null && A.key != null ? ee("" + A.key) : L.toString(36);
  }
  function G(A) {
    switch (A.status) {
      case "fulfilled":
        return A.value;
      case "rejected":
        throw A.reason;
      default:
        switch (typeof A.status == "string" ? A.then(Z, Z) : (A.status = "pending", A.then(
          function(L) {
            A.status === "pending" && (A.status = "fulfilled", A.value = L);
          },
          function(L) {
            A.status === "pending" && (A.status = "rejected", A.reason = L);
          }
        )), A.status) {
          case "fulfilled":
            return A.value;
          case "rejected":
            throw A.reason;
        }
    }
    throw A;
  }
  function it(A, L, K, et, St) {
    var ot = typeof A;
    (ot === "undefined" || ot === "boolean") && (A = null);
    var xt = !1;
    if (A === null) xt = !0;
    else
      switch (ot) {
        case "bigint":
        case "string":
        case "number":
          xt = !0;
          break;
        case "object":
          switch (A.$$typeof) {
            case a:
            case l:
              xt = !0;
              break;
            case v:
              return xt = A._init, it(
                xt(A._payload),
                L,
                K,
                et,
                St
              );
          }
      }
    if (xt)
      return St = St(A), xt = et === "" ? "." + At(A, 0) : et, st(St) ? (K = "", xt != null && (K = xt.replace(Xt, "$&/") + "/"), it(St, L, K, "", function(Ve) {
        return Ve;
      })) : St != null && (Ct(St) && (St = bt(
        St,
        K + (St.key == null || A && A.key === St.key ? "" : ("" + St.key).replace(
          Xt,
          "$&/"
        ) + "/") + xt
      )), L.push(St)), 1;
    xt = 0;
    var W = et === "" ? "." : et + ":";
    if (st(A))
      for (var ut = 0; ut < A.length; ut++)
        et = A[ut], ot = W + At(et, ut), xt += it(
          et,
          L,
          K,
          ot,
          St
        );
    else if (ut = w(A), typeof ut == "function")
      for (A = ut.call(A), ut = 0; !(et = A.next()).done; )
        et = et.value, ot = W + At(et, ut++), xt += it(
          et,
          L,
          K,
          ot,
          St
        );
    else if (ot === "object") {
      if (typeof A.then == "function")
        return it(
          G(A),
          L,
          K,
          et,
          St
        );
      throw L = String(A), Error(
        "Objects are not valid as a React child (found: " + (L === "[object Object]" ? "object with keys {" + Object.keys(A).join(", ") + "}" : L) + "). If you meant to render a collection of children, use an array instead."
      );
    }
    return xt;
  }
  function k(A, L, K) {
    if (A == null) return A;
    var et = [], St = 0;
    return it(A, et, "", "", function(ot) {
      return L.call(K, ot, St++);
    }), et;
  }
  function ft(A) {
    if (A._status === -1) {
      var L = A._result, K = L();
      K.then(
        function(et) {
          (A._status === 0 || A._status === -1) && (A._status = 1, A._result = et, K.status === void 0 && (K.status = "fulfilled", K.value = et));
        },
        function(et) {
          (A._status === 0 || A._status === -1) && (A._status = 2, A._result = et, K.status === void 0 && (K.status = "rejected", K.reason = et));
        }
      ), A._status === -1 && (A._status = 0, A._result = K);
    }
    if (A._status === 1) return A._result.default;
    throw A._result;
  }
  var q = typeof reportError == "function" ? reportError : function(A) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var L = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof A == "object" && A !== null && typeof A.message == "string" ? String(A.message) : String(A),
        error: A
      });
      if (!window.dispatchEvent(L)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", A);
      return;
    }
    console.error(A);
  };
  function Kt(A) {
    var L = V.T, K = {};
    K.types = L !== null ? L.types : null, V.T = K;
    try {
      var et = A(), St = V.S;
      St !== null && St(K, et), typeof et == "object" && et !== null && typeof et.then == "function" && et.then(Z, q);
    } catch (ot) {
      q(ot);
    } finally {
      L !== null && K.types !== null && (L.types = K.types), V.T = L;
    }
  }
  function Me(A) {
    var L = V.T;
    if (L !== null) {
      var K = L.types;
      K === null ? L.types = [A] : K.indexOf(A) === -1 && K.push(A);
    } else Kt(Me.bind(null, A));
  }
  var dn = {
    map: k,
    forEach: function(A, L, K) {
      k(
        A,
        function() {
          L.apply(this, arguments);
        },
        K
      );
    },
    count: function(A) {
      var L = 0;
      return k(A, function() {
        L++;
      }), L;
    },
    toArray: function(A) {
      return k(A, function(L) {
        return L;
      }) || [];
    },
    only: function(A) {
      if (!Ct(A))
        throw Error(
          "React.Children.only expected to receive a single React element child."
        );
      return A;
    }
  };
  return ct.Activity = p, ct.Children = dn, ct.Component = j, ct.Fragment = r, ct.Profiler = c, ct.PureComponent = X, ct.StrictMode = u, ct.Suspense = g, ct.ViewTransition = S, ct.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = V, ct.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(A) {
      return V.H.useMemoCache(A);
    }
  }, ct.addTransitionType = Me, ct.cache = function(A) {
    return function() {
      return A.apply(null, arguments);
    };
  }, ct.cacheSignal = function() {
    return null;
  }, ct.cloneElement = function(A, L, K) {
    if (A == null)
      throw Error(
        "The argument must be a React element, but you passed " + A + "."
      );
    var et = N({}, A.props), St = A.key;
    if (L != null)
      for (ot in L.key !== void 0 && (St = "" + L.key), L)
        !dt.call(L, ot) || ot === "key" || ot === "__self" || ot === "__source" || ot === "ref" && L.ref === void 0 || (et[ot] = L[ot]);
    var ot = arguments.length - 2;
    if (ot === 1) et.children = K;
    else if (1 < ot) {
      for (var xt = Array(ot), W = 0; W < ot; W++)
        xt[W] = arguments[W + 2];
      et.children = xt;
    }
    return nt(A.type, St, et);
  }, ct.createContext = function(A) {
    return A = {
      $$typeof: d,
      _currentValue: A,
      _currentValue2: A,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, A.Provider = A, A.Consumer = {
      $$typeof: h,
      _context: A
    }, A;
  }, ct.createElement = function(A, L, K) {
    var et, St = {}, ot = null;
    if (L != null)
      for (et in L.key !== void 0 && (ot = "" + L.key), L)
        dt.call(L, et) && et !== "key" && et !== "__self" && et !== "__source" && (St[et] = L[et]);
    var xt = arguments.length - 2;
    if (xt === 1) St.children = K;
    else if (1 < xt) {
      for (var W = Array(xt), ut = 0; ut < xt; ut++)
        W[ut] = arguments[ut + 2];
      St.children = W;
    }
    if (A && A.defaultProps)
      for (et in xt = A.defaultProps, xt)
        St[et] === void 0 && (St[et] = xt[et]);
    return nt(A, ot, St);
  }, ct.createRef = function() {
    return { current: null };
  }, ct.forwardRef = function(A) {
    return { $$typeof: m, render: A };
  }, ct.isValidElement = Ct, ct.lazy = function(A) {
    return {
      $$typeof: v,
      _payload: { _status: -1, _result: A },
      _init: ft
    };
  }, ct.memo = function(A, L) {
    return {
      $$typeof: b,
      type: A,
      compare: L === void 0 ? null : L
    };
  }, ct.startTransition = Kt, ct.unstable_useCacheRefresh = function() {
    return V.H.useCacheRefresh();
  }, ct.use = function(A) {
    return V.H.use(A);
  }, ct.useActionState = function(A, L, K) {
    return V.H.useActionState(A, L, K);
  }, ct.useCallback = function(A, L) {
    return V.H.useCallback(A, L);
  }, ct.useContext = function(A) {
    return V.H.useContext(A);
  }, ct.useDebugValue = function() {
  }, ct.useDeferredValue = function(A, L) {
    return V.H.useDeferredValue(A, L);
  }, ct.useEffect = function(A, L) {
    return V.H.useEffect(A, L);
  }, ct.useEffectEvent = function(A) {
    return V.H.useEffectEvent(A);
  }, ct.useId = function() {
    return V.H.useId();
  }, ct.useImperativeHandle = function(A, L, K) {
    return V.H.useImperativeHandle(A, L, K);
  }, ct.useInsertionEffect = function(A, L) {
    return V.H.useInsertionEffect(A, L);
  }, ct.useLayoutEffect = function(A, L) {
    return V.H.useLayoutEffect(A, L);
  }, ct.useMemo = function(A, L) {
    return V.H.useMemo(A, L);
  }, ct.useOptimistic = function(A, L) {
    return V.H.useOptimistic(A, L);
  }, ct.useReducer = function(A, L, K) {
    return V.H.useReducer(A, L, K);
  }, ct.useRef = function(A) {
    return V.H.useRef(A);
  }, ct.useState = function(A) {
    return V.H.useState(A);
  }, ct.useSyncExternalStore = function(A, L, K) {
    return V.H.useSyncExternalStore(
      A,
      L,
      K
    );
  }, ct.useTransition = function() {
    return V.H.useTransition();
  }, ct.version = "19.3.0", ct;
}
var mg;
function ud() {
  return mg || (mg = 1, gf.exports = FT()), gf.exports;
}
var vf = { exports: {} }, ye = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var pg;
function PT() {
  if (pg) return ye;
  pg = 1;
  var a = ud();
  function l(v) {
    var p = "https://react.dev/errors/" + v;
    if (1 < arguments.length) {
      p += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var S = 2; S < arguments.length; S++)
        p += "&args[]=" + encodeURIComponent(arguments[S]);
    }
    return "Minified React error #" + v + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function r() {
  }
  var u = {
    d: {
      f: r,
      r: function() {
        throw Error(l(522));
      },
      D: r,
      C: r,
      L: r,
      m: r,
      X: r,
      S: r,
      M: r
    },
    p: 0,
    findDOMNode: null
  }, c = Symbol.for("react.portal"), h = Symbol.for("react.recoverable"), d = Symbol.for("react.optimistic_key");
  function m(v, p, S) {
    var z = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: c,
      key: z == null ? null : z === d ? d : "" + z,
      children: v,
      containerInfo: p,
      implementation: S
    };
  }
  var g = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function b(v, p) {
    if (v === "font") return "";
    if (typeof p == "string")
      return p === "use-credentials" ? p : "";
  }
  return ye.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = u, ye.browser = function(v) {
    return { $$typeof: h, _reason: v };
  }, ye.createPortal = function(v, p) {
    var S = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
      throw Error(l(299));
    return m(v, p, null, S);
  }, ye.flushSync = function(v) {
    var p = g.T, S = u.p;
    try {
      if (g.T = null, u.p = 2, v) return v();
    } finally {
      g.T = p, u.p = S, u.d.f();
    }
  }, ye.preconnect = function(v, p) {
    typeof v == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, u.d.C(v, p));
  }, ye.prefetchDNS = function(v) {
    typeof v == "string" && u.d.D(v);
  }, ye.preinit = function(v, p) {
    if (typeof v == "string" && p && typeof p.as == "string") {
      var S = p.as, z = b(S, p.crossOrigin), w = typeof p.integrity == "string" ? p.integrity : void 0, U = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
      S === "style" ? u.d.S(
        v,
        typeof p.precedence == "string" ? p.precedence : void 0,
        {
          crossOrigin: z,
          integrity: w,
          fetchPriority: U
        }
      ) : S === "script" && u.d.X(v, {
        crossOrigin: z,
        integrity: w,
        fetchPriority: U,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0
      });
    }
  }, ye.preinitModule = function(v, p) {
    if (typeof v == "string")
      if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
          var S = b(
            p.as,
            p.crossOrigin
          );
          u.d.M(v, {
            crossOrigin: S,
            integrity: typeof p.integrity == "string" ? p.integrity : void 0,
            nonce: typeof p.nonce == "string" ? p.nonce : void 0,
            fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0
          });
        }
      } else p == null && u.d.M(v);
  }, ye.preload = function(v, p) {
    if (typeof v == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
      var S = p.as, z = b(S, p.crossOrigin);
      u.d.L(v, S, {
        crossOrigin: z,
        integrity: typeof p.integrity == "string" ? p.integrity : void 0,
        nonce: typeof p.nonce == "string" ? p.nonce : void 0,
        type: typeof p.type == "string" ? p.type : void 0,
        fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0,
        referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0,
        imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0,
        imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0,
        media: typeof p.media == "string" ? p.media : void 0
      });
    }
  }, ye.preloadModule = function(v, p) {
    if (typeof v == "string")
      if (p) {
        var S = b(p.as, p.crossOrigin);
        u.d.m(v, {
          as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0,
          crossOrigin: S,
          integrity: typeof p.integrity == "string" ? p.integrity : void 0,
          nonce: typeof p.nonce == "string" ? p.nonce : void 0,
          fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0
        });
      } else u.d.m(v);
  }, ye.requestFormReset = function(v) {
    u.d.r(v);
  }, ye.unstable_batchedUpdates = function(v, p) {
    return v(p);
  }, ye.useFormState = function(v, p, S) {
    return g.H.useFormState(v, p, S);
  }, ye.useFormStatus = function() {
    return g.H.useHostTransitionStatus();
  }, ye.version = "19.3.0", ye;
}
var yg;
function IT() {
  if (yg) return vf.exports;
  yg = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (l) {
        console.error(l);
      }
  }
  return a(), vf.exports = PT(), vf.exports;
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gg;
function WT() {
  if (gg) return ls;
  gg = 1;
  var a = JT(), l = ud(), r = IT();
  function u(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++)
        e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function c(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function h(t) {
    for (var e = t, n = e; n && !n.alternate; )
      e = n, (e.flags & 4098) !== 0 && (t = e.return), n = e.return;
    for (; e.return; ) e = e.return;
    return e.tag === 3 ? t : null;
  }
  function d(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function m(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function g(t) {
    if (h(t) !== t)
      throw Error(u(188));
  }
  function b(t) {
    var e = t.alternate;
    if (!e) {
      if (e = h(t), e === null) throw Error(u(188));
      return e !== t ? null : t;
    }
    for (var n = t, i = e; ; ) {
      var s = n.return;
      if (s === null) break;
      var o = s.alternate;
      if (o === null) {
        if (i = s.return, i !== null) {
          n = i;
          continue;
        }
        break;
      }
      if (s.child === o.child) {
        for (o = s.child; o; ) {
          if (o === n) return g(s), t;
          if (o === i) return g(s), e;
          o = o.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== i.return) n = s, i = o;
      else {
        for (var f = !1, y = s.child; y; ) {
          if (y === n) {
            f = !0, n = s, i = o;
            break;
          }
          if (y === i) {
            f = !0, i = s, n = o;
            break;
          }
          y = y.sibling;
        }
        if (!f) {
          for (y = o.child; y; ) {
            if (y === n) {
              f = !0, n = o, i = s;
              break;
            }
            if (y === i) {
              f = !0, i = o, n = s;
              break;
            }
            y = y.sibling;
          }
          if (!f) throw Error(u(189));
        }
      }
      if (n.alternate !== i) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
    return n.stateNode.current === n ? t : e;
  }
  function v(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = v(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  function p(t, e, n, i, s, o) {
    for (; t !== null; ) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && n(t, i, s, o) || (t.tag !== 22 || t.memoizedState === null) && (e || t.tag !== 5 && t.tag !== 27) && p(
        t.child,
        e,
        n,
        i,
        s,
        o
      ))
        return !0;
      t = t.sibling;
    }
    return !1;
  }
  function S(t) {
    for (t = t.return; t !== null; ) {
      if (t.tag === 3 || t.tag === 5 || t.tag === 27) return t;
      t = t.return;
    }
    return null;
  }
  function z(t) {
    var e = !1;
    for (t = t.return; t !== null && (t.tag === 4 && (e = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27)); )
      t = t.return;
    return e;
  }
  function w(t) {
    var e = [null, null], n = S(t);
    return n === null || U(
      e,
      t,
      n.child,
      { foundSelf: !1 }
    ), e;
  }
  function U(t, e, n, i) {
    for (; n !== null; ) {
      if (n === e) i.foundSelf = !0;
      else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
        if (i.foundSelf) return t[1] = n, !0;
        t[0] = n;
      } else if ((n.tag !== 22 || n.memoizedState === null) && U(
        t,
        e,
        n.child,
        i
      ))
        return !0;
      n = n.sibling;
    }
    return !1;
  }
  function N(t) {
    switch (t.tag) {
      case 5:
      case 27:
      case 6:
        return t.stateNode;
      case 3:
        return t.stateNode.containerInfo;
      default:
        throw Error(u(559));
    }
  }
  var H = null, j = null;
  function Y(t, e, n) {
    return t === n ? !0 : t === e ? (H = t, !0) : !1;
  }
  function X(t, e, n) {
    return t === n ? (j = t, !1) : t === e ? (j !== null && (H = t), !0) : !1;
  }
  function P(t) {
    if (t === null) return null;
    do
      t = t === null ? null : t.return;
    while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
    return t || null;
  }
  function st(t, e, n) {
    for (var i = 0, s = t; s; s = n(s)) i++;
    s = 0;
    for (var o = e; o; o = n(o)) s++;
    for (; 0 < i - s; ) t = n(t), i--;
    for (; 0 < s - i; ) e = n(e), s--;
    for (; i--; ) {
      if (t === e || e !== null && t === e.alternate)
        return t;
      t = n(t), e = n(e);
    }
    return null;
  }
  var Z = Object.assign, V = Symbol.for("react.element"), dt = Symbol.for("react.transitional.element"), nt = Symbol.for("react.portal"), bt = Symbol.for("react.fragment"), Ct = Symbol.for("react.strict_mode"), ee = Symbol.for("react.profiler"), Xt = Symbol.for("react.consumer"), At = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), it = Symbol.for("react.suspense"), k = Symbol.for("react.suspense_list"), ft = Symbol.for("react.memo"), q = Symbol.for("react.lazy"), Kt = Symbol.for("react.activity"), Me = Symbol.for("react.legacy_hidden"), dn = Symbol.for("react.memo_cache_sentinel"), A = Symbol.for("react.view_transition"), L = Symbol.for("react.recoverable"), K = Symbol.iterator;
  function et(t) {
    return t === null || typeof t != "object" ? null : (t = K && t[K] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var St = Symbol.for("react.client.reference");
  function ot(t) {
    if (t == null) return null;
    if (typeof t == "function")
      return t.$$typeof === St ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case bt:
        return "Fragment";
      case ee:
        return "Profiler";
      case Ct:
        return "StrictMode";
      case it:
        return "Suspense";
      case k:
        return "SuspenseList";
      case Kt:
        return "Activity";
      case A:
        return "ViewTransition";
    }
    if (typeof t == "object")
      switch (t.$$typeof) {
        case nt:
          return "Portal";
        case At:
          return t.displayName || "Context";
        case Xt:
          return (t._context.displayName || "Context") + ".Consumer";
        case G:
          var e = t.render;
          return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
        case ft:
          return e = t.displayName || null, e !== null ? e : ot(t.type) || "Memo";
        case q:
          e = t._payload, t = t._init;
          try {
            return ot(t(e));
          } catch {
          }
      }
    return null;
  }
  var xt = Array.isArray, W = l.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ut = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Ve = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Fn = [], fa = -1;
  function hn(t) {
    return { current: t };
  }
  function re(t) {
    0 > fa || (t.current = Fn[fa], Fn[fa] = null, fa--);
  }
  function Lt(t, e) {
    fa++, Fn[fa] = t.current, t.current = e;
  }
  var mn = hn(null), cl = hn(null), Pn = hn(null), Ms = hn(null);
  function Cs(t, e) {
    switch (Lt(Pn, e), Lt(cl, t), Lt(mn, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? vy(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI)
          e = vy(e), t = by(e, t);
        else
          switch (t) {
            case "svg":
              t = 1;
              break;
            case "math":
              t = 2;
              break;
            default:
              t = 0;
          }
    }
    re(mn), Lt(mn, t);
  }
  function da() {
    re(mn), re(cl), re(Pn);
  }
  function Nu(t) {
    var e = t.memoizedState;
    e !== null && ($a._currentValue = e.memoizedState, Lt(Ms, t)), e = mn.current;
    var n = by(e, t.type);
    e !== n && (Lt(cl, t), Lt(mn, n));
  }
  function Ds(t) {
    cl.current === t && (re(mn), re(cl)), Ms.current === t && (re(Ms), $a._currentValue = Ve);
  }
  var Vu, jd;
  function In(t) {
    if (Vu === void 0)
      try {
        throw Error();
      } catch (n) {
        var e = n.stack.trim().match(/\n( *(at )?)/);
        Vu = e && e[1] || "", jd = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + Vu + t + jd;
  }
  var _u = !1;
  function Uu(t, e) {
    if (!t || _u) return "";
    _u = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var B = function() {
                throw Error();
              };
              if (Object.defineProperty(B.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(B, []);
                } catch (Q) {
                  var x = Q;
                }
                Reflect.construct(t, [], B);
              } else {
                try {
                  B.call();
                } catch (Q) {
                  x = Q;
                }
                B = !1;
                try {
                  var O = Object.getOwnPropertyDescriptor(
                    t.prototype,
                    "props"
                  );
                  Object.defineProperty(t.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), B = !0, new t();
                } finally {
                  B && (O !== void 0 ? Object.defineProperty(t.prototype, "props", O) : delete t.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (Q) {
                x = Q;
              }
              (B = t()) && typeof B.catch == "function" && B.catch(function() {
              });
            }
          } catch (Q) {
            if (Q && x && typeof Q.stack == "string")
              return [Q.stack, x.stack];
          }
          return [null, null];
        }
      };
      i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var s = Object.getOwnPropertyDescriptor(
        i.DetermineComponentFrameRoot,
        "name"
      );
      s && s.configurable && Object.defineProperty(
        i.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var o = i.DetermineComponentFrameRoot(), f = o[0], y = o[1];
      if (f && y) {
        var T = f.split(`
`), C = y.split(`
`);
        for (s = i = 0; i < T.length && !T[i].includes("DetermineComponentFrameRoot"); )
          i++;
        for (; s < C.length && !C[s].includes(
          "DetermineComponentFrameRoot"
        ); )
          s++;
        if (i === T.length || s === C.length)
          for (i = T.length - 1, s = C.length - 1; 1 <= i && 0 <= s && T[i] !== C[s]; )
            s--;
        for (; 1 <= i && 0 <= s; i--, s--)
          if (T[i] !== C[s]) {
            if (i !== 1 || s !== 1)
              do
                if (i--, s--, 0 > s || T[i] !== C[s]) {
                  var R = `
` + T[i].replace(" at new ", " at ");
                  return t.displayName && R.includes("<anonymous>") && (R = R.replace("<anonymous>", t.displayName)), R;
                }
              while (1 <= i && 0 <= s);
            break;
          }
      }
    } finally {
      _u = !1, Error.prepareStackTrace = n;
    }
    return (n = t ? t.displayName || t.name : "") ? In(n) : "";
  }
  function Fb(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return In(t.type);
      case 16:
        return In("Lazy");
      case 13:
        return t.child !== e && e !== null ? In("Suspense Fallback") : In("Suspense");
      case 19:
        return In("SuspenseList");
      case 0:
      case 15:
        return Uu(t.type, !1);
      case 11:
        return Uu(t.type.render, !1);
      case 1:
        return Uu(t.type, !0);
      case 31:
        return In("Activity");
      case 30:
        return In("ViewTransition");
      default:
        return "";
    }
  }
  function Gd(t) {
    try {
      var e = "", n = null;
      do
        e += Fb(t, n), n = t, t = t.return;
      while (t);
      return e;
    } catch (i) {
      return `
Error generating stack: ` + i.message + `
` + i.stack;
    }
  }
  var Bu = Object.prototype.hasOwnProperty, Lu = a.unstable_scheduleCallback, Hu = a.unstable_cancelCallback, Pb = a.unstable_shouldYield, Ib = a.unstable_requestPaint, _e = a.unstable_now, Wb = a.unstable_getCurrentPriorityLevel, Yd = a.unstable_ImmediatePriority, qd = a.unstable_UserBlockingPriority, zs = a.unstable_NormalPriority, $b = a.unstable_LowPriority, Xd = a.unstable_IdlePriority, t1 = a.log, e1 = a.unstable_setDisableYieldValue, fl = null, Ue = null;
  function Wn(t) {
    if (typeof t1 == "function" && e1(t), Ue && typeof Ue.setStrictMode == "function")
      try {
        Ue.setStrictMode(fl, t);
      } catch {
      }
  }
  var Be = Math.clz32 ? Math.clz32 : a1, n1 = Math.log, i1 = Math.LN2;
  function a1(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (n1(t) / i1 | 0) | 0;
  }
  var Os = 256, Rs = 262144, ws = 4194304;
  function Vi(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & -t;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function Ns(t, e, n) {
    var i = t.pendingLanes;
    if (i === 0) return 0;
    var s = 0, o = t.suspendedLanes, f = t.pingedLanes;
    t = t.warmLanes;
    var y = i & 134217727;
    return y !== 0 ? (i = y & ~o, i !== 0 ? s = Vi(i) : (f &= y, f !== 0 ? s = Vi(f) : n || (n = y & ~t, n !== 0 && (s = Vi(n))))) : (y = i & ~o, y !== 0 ? s = Vi(y) : f !== 0 ? s = Vi(f) : n || (n = i & ~t, n !== 0 && (s = Vi(n)))), s === 0 ? 0 : e !== 0 && e !== s && (e & o) === 0 && (o = s & -s, n = e & -e, o >= n || o === 32 && (n & 4194048) !== 0) ? e : s;
  }
  function dl(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function Qd(t, e) {
    (e & 8) !== 0 && (e |= e & 32);
    var n = t.entangledLanes;
    if (n !== 0)
      for (t = t.entanglements, n &= e; 0 < n; ) {
        var i = 31 - Be(n), s = 1 << i;
        e |= t[i], n &= ~s;
      }
    return e;
  }
  function l1(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Zd() {
    var t = ws;
    return ws <<= 1, (ws & 62914560) === 0 && (ws = 4194304), t;
  }
  function ju(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function hl(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function s1(t, e, n, i, s, o) {
    var f = t.pendingLanes;
    t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
    var y = t.entanglements, T = t.expirationTimes, C = t.hiddenUpdates;
    for (n = f & ~n; 0 < n; ) {
      var R = 31 - Be(n), B = 1 << R;
      y[R] = 0, T[R] = -1;
      var x = C[R];
      if (x !== null)
        for (C[R] = null, R = 0; R < x.length; R++) {
          var O = x[R];
          O !== null && (O.lane &= -536870913);
        }
      n &= ~B;
    }
    i !== 0 && Kd(t, i, 0), o !== 0 && s === 0 && t.tag !== 0 && (t.suspendedLanes |= o & ~(f & ~e));
  }
  function Kd(t, e, n) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var i = 31 - Be(e);
    t.entangledLanes |= e, t.entanglements[i] = t.entanglements[i] | 1073741824 | n & 261930;
  }
  function kd(t, e) {
    var n = t.entangledLanes |= e;
    for (t = t.entanglements; n; ) {
      var i = 31 - Be(n), s = 1 << i;
      s & e | t[i] & e && (t[i] |= e), n &= ~s;
    }
  }
  function Jd(t, e) {
    var n = e & -e;
    return n = (n & 42) !== 0 ? 1 : Gu(n), (n & (t.suspendedLanes | e)) !== 0 ? 0 : n;
  }
  function Gu(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function Yu(t) {
    return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function Fd() {
    var t = ut.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : ng(t.type));
  }
  function Pd(t, e) {
    var n = ut.p;
    try {
      return ut.p = t, e();
    } finally {
      ut.p = n;
    }
  }
  var wn = Math.random().toString(36).slice(2), ce = "__reactFiber$" + wn, Ce = "__reactProps$" + wn, ha = "__reactContainer$" + wn, Id = "__reactEvents$" + wn, o1 = "__reactListeners$" + wn, u1 = "__reactHandles$" + wn, Wd = "__reactResources$" + wn, ml = "__reactMarker$" + wn, Vs = "__reactLoad$" + wn;
  function _s(t) {
    delete t[ce], delete t[Ce], delete t[o1], delete t[u1];
  }
  function _i(t) {
    var e;
    if (e = t[ce]) return e;
    for (var n = t.parentNode; n; ) {
      if (e = n[ha] || n[ce]) {
        if (n = e.alternate, e.child !== null || n !== null && n.child !== null)
          for (t = By(t); t !== null; ) {
            if (n = t[ce]) return n;
            t = By(t);
          }
        return e;
      }
      t = n, n = t.parentNode;
    }
    return null;
  }
  function ma(t) {
    if (t = t[ce] || t[ha]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
        return t;
    }
    return null;
  }
  function pl(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(u(33));
  }
  function pa(t) {
    var e = t[Wd];
    return e || (e = t[Wd] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
  }
  function le(t) {
    t[ml] = !0;
  }
  function $d(t) {
    t[Vs] = void 0;
  }
  var th = /* @__PURE__ */ new Set(), eh = {};
  function Ui(t, e) {
    ya(t, e), ya(t + "Capture", e);
  }
  function ya(t, e) {
    for (eh[t] = e, t = 0; t < e.length; t++)
      th.add(e[t]);
  }
  var r1 = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), nh = {}, ih = {};
  function c1(t) {
    return Bu.call(ih, t) ? !0 : Bu.call(nh, t) ? !1 : r1.test(t) ? ih[t] = !0 : (nh[t] = !0, !1);
  }
  var Dt = !1;
  function ah() {
    var t = Dt;
    return Dt = !1, t;
  }
  function Us(t, e, n) {
    if (c1(e))
      if (n === null) t.removeAttribute(e);
      else {
        switch (typeof n) {
          case "undefined":
          case "function":
          case "symbol":
            t.removeAttribute(e);
            return;
          case "boolean":
            var i = e.toLowerCase().slice(0, 5);
            if (i !== "data-" && i !== "aria-") {
              t.removeAttribute(e);
              return;
            }
        }
        t.setAttribute(e, n);
      }
  }
  function Bs(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, n);
    }
  }
  function Nn(t, e, n, i) {
    if (i === null) t.removeAttribute(n);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, i);
    }
  }
  function Le(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function lh(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function f1(t, e, n) {
    var i = Object.getOwnPropertyDescriptor(
      t.constructor.prototype,
      e
    );
    if (!t.hasOwnProperty(e) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
      var s = i.get, o = i.set;
      return Object.defineProperty(t, e, {
        configurable: !0,
        get: function() {
          return s.call(this);
        },
        set: function(f) {
          n = "" + f, o.call(this, f);
        }
      }), Object.defineProperty(t, e, {
        enumerable: i.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(f) {
          n = "" + f;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function qu(t) {
    if (!t._valueTracker) {
      var e = lh(t) ? "checked" : "value";
      t._valueTracker = f1(
        t,
        e,
        "" + t[e]
      );
    }
  }
  function sh(t) {
    if (!t) return !1;
    var e = t._valueTracker;
    if (!e) return !0;
    var n = e.getValue(), i = "";
    return t && (i = lh(t) ? t.checked ? "true" : "false" : t.value), t = i, t !== n ? (e.setValue(t), !0) : !1;
  }
  var d1 = /[\n"\\]/g;
  function Ze(t) {
    return t.replace(
      d1,
      function(e) {
        return "\\" + e.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function Xu(t, e, n, i, s, o, f, y) {
    t.name = "", f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" ? t.type = f : t.removeAttribute("type"), e != null ? f === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Le(e)) : t.value !== "" + Le(e) && (t.value = "" + Le(e)) : f !== "submit" && f !== "reset" || t.removeAttribute("value"), e != null ? f === "number" && t.value == e ? Qu(t, Le(t.value)) : Qu(t, Le(e)) : n != null ? Qu(t, Le(n)) : i != null && t.removeAttribute("value"), s == null && o != null && (t.defaultChecked = !!o), s != null && (t.checked = s && typeof s != "function" && typeof s != "symbol"), y != null && typeof y != "function" && typeof y != "symbol" && typeof y != "boolean" ? t.name = "" + Le(y) : t.removeAttribute("name");
  }
  function oh(t, e, n, i, s, o, f, y) {
    if (o != null && typeof o != "function" && typeof o != "symbol" && typeof o != "boolean" && (t.type = o), e != null || n != null) {
      if (!(o !== "submit" && o !== "reset" || e != null)) {
        qu(t);
        return;
      }
      n = n != null ? "" + Le(n) : "", e = e != null ? "" + Le(e) : n, y || e === t.value || (t.value = e), t.defaultValue = e;
    }
    i = i ?? s, i = typeof i != "function" && typeof i != "symbol" && !!i, t.checked = y ? t.checked : !!i, t.defaultChecked = !!i, f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (t.name = f), qu(t);
  }
  function Qu(t, e) {
    t.defaultValue !== "" + e && (t.defaultValue = "" + e);
  }
  function ga(t, e, n, i) {
    if (t = t.options, e) {
      e = {};
      for (var s = 0; s < n.length; s++)
        e["$" + n[s]] = !0;
      for (n = 0; n < t.length; n++)
        s = e.hasOwnProperty("$" + t[n].value), t[n].selected !== s && (t[n].selected = s), s && i && (t[n].defaultSelected = !0);
    } else {
      for (n = "" + Le(n), e = null, s = 0; s < t.length; s++) {
        if (t[s].value === n) {
          t[s].selected = !0, i && (t[s].defaultSelected = !0);
          return;
        }
        e !== null || t[s].disabled || (e = t[s]);
      }
      e !== null && (e.selected = !0);
    }
  }
  function uh(t, e, n) {
    if (e != null && (e = "" + Le(e), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + Le(n) : "";
  }
  function rh(t, e, n, i) {
    if (e == null) {
      if (i != null) {
        if (n != null) throw Error(u(92));
        if (xt(i)) {
          if (1 < i.length) throw Error(u(93));
          i = i[0];
        }
        n = i;
      }
      n == null && (n = ""), e = n;
    }
    n = Le(e), t.defaultValue = n, i = t.textContent, i === n && i !== "" && i !== null && (t.value = i), qu(t);
  }
  function va(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var h1 = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function ch(t, e, n) {
    var i = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? i ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : i ? t.setProperty(e, n) : typeof n != "number" || n === 0 || h1.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px";
  }
  function fh(t, e, n) {
    if (e != null && typeof e != "object")
      throw Error(u(62));
    if (t = t.style, n != null) {
      for (var i in n)
        !n.hasOwnProperty(i) || e != null && e.hasOwnProperty(i) || (i.indexOf("--") === 0 ? t.setProperty(i, "") : i === "float" ? t.cssFloat = "" : t[i] = "", Dt = !0);
      for (var s in e)
        i = e[s], e.hasOwnProperty(s) && n[s] !== i && (ch(t, s, i), Dt = !0);
    } else
      for (var o in e)
        e.hasOwnProperty(o) && ch(t, o, e[o]);
  }
  function Zu(t) {
    if (t.indexOf("-") === -1) return !1;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var m1 = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), p1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function Ls(t) {
    return p1.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function pn() {
  }
  var Ku = null;
  function ku(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var ba = null, Sa = null;
  function dh(t) {
    var e = ma(t);
    if (e && (t = e.stateNode)) {
      var n = t[Ce] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (Xu(
            t,
            n.value,
            n.defaultValue,
            n.defaultValue,
            n.checked,
            n.defaultChecked,
            n.type,
            n.name
          ), e = n.name, n.type === "radio" && e != null) {
            for (n = t; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll(
              'input[name="' + Ze(
                "" + e
              ) + '"][type="radio"]'
            ), e = 0; e < n.length; e++) {
              var i = n[e];
              if (i !== t && i.form === t.form) {
                var s = i[Ce] || null;
                if (!s) throw Error(u(90));
                Xu(
                  i,
                  s.value,
                  s.defaultValue,
                  s.defaultValue,
                  s.checked,
                  s.defaultChecked,
                  s.type,
                  s.name
                );
              }
            }
            for (e = 0; e < n.length; e++)
              i = n[e], i.form === t.form && sh(i);
          }
          break t;
        case "textarea":
          uh(t, n.value, n.defaultValue);
          break t;
        case "select":
          e = n.value, e != null && ga(t, !!n.multiple, e, !1);
      }
    }
  }
  var Ju = !1;
  function hh(t, e, n) {
    if (Ju) return t(e, n);
    Ju = !0;
    try {
      var i = t(e);
      return i;
    } finally {
      if (Ju = !1, (ba !== null || Sa !== null) && (Ho(), ba && (e = ba, t = Sa, Sa = ba = null, dh(e), t)))
        for (e = 0; e < t.length; e++) dh(t[e]);
    }
  }
  function yl(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var i = n[Ce] || null;
    if (i === null) return null;
    n = i[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (i = !i.disabled) || (t = t.type, i = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !i;
        break t;
      default:
        t = !1;
    }
    if (t) return null;
    if (n && typeof n != "function")
      throw Error(
        u(231, e, typeof n)
      );
    return n;
  }
  var Vn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Fu = !1;
  if (Vn)
    try {
      var gl = {};
      Object.defineProperty(gl, "passive", {
        get: function() {
          Fu = !0;
        }
      }), window.addEventListener("test", gl, gl), window.removeEventListener("test", gl, gl);
    } catch {
      Fu = !1;
    }
  var $n = null, Pu = null, Hs = null;
  function mh() {
    if (Hs) return Hs;
    var t, e = Pu, n = e.length, i, s = "value" in $n ? $n.value : $n.textContent, o = s.length;
    for (t = 0; t < n && e[t] === s[t]; t++) ;
    var f = n - t;
    for (i = 1; i <= f && e[n - i] === s[o - i]; i++) ;
    return Hs = s.slice(t, 1 < i ? 1 - i : void 0);
  }
  function js(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Gs() {
    return !0;
  }
  function ph() {
    return !1;
  }
  function be(t) {
    function e(n, i, s, o, f) {
      this._reactName = n, this._targetInst = s, this.type = i, this.nativeEvent = o, this.target = f, this.currentTarget = null;
      for (var y in t)
        t.hasOwnProperty(y) && (n = t[y], this[y] = n ? n(o) : o[y]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Gs : ph, this.isPropagationStopped = ph, this;
    }
    return Z(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Gs);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Gs);
      },
      persist: function() {
      },
      isPersistent: Gs
    }), e;
  }
  var ti = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Ys = be(ti), vl = Z({}, ti, { view: 0, detail: 0 }), y1 = be(vl), Iu, Wu, bl, qs = Z({}, vl, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: tr,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== bl && (bl && t.type === "mousemove" ? (Iu = t.screenX - bl.screenX, Wu = t.screenY - bl.screenY) : Wu = Iu = 0, bl = t), Iu);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Wu;
    }
  }), yh = be(qs), g1 = Z({}, qs, { dataTransfer: 0 }), v1 = be(g1), b1 = Z({}, vl, { relatedTarget: 0 }), $u = be(b1), S1 = Z({}, ti, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), T1 = be(S1), E1 = Z({}, ti, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), A1 = be(E1), x1 = Z({}, ti, { data: 0 }), gh = be(x1), M1 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, C1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, D1 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function z1(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = D1[t]) ? !!e[t] : !1;
  }
  function tr() {
    return z1;
  }
  var O1 = Z({}, vl, {
    key: function(t) {
      if (t.key) {
        var e = M1[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = js(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? C1[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: tr,
    charCode: function(t) {
      return t.type === "keypress" ? js(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? js(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), R1 = be(O1), w1 = Z({}, qs, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), vh = be(w1), N1 = Z({}, ti, { submitter: 0 }), V1 = be(N1), _1 = Z({}, vl, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: tr
  }), U1 = be(_1), B1 = Z({}, ti, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), L1 = be(B1), H1 = Z({}, qs, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), j1 = be(H1), G1 = Z({}, ti, {
    newState: 0,
    oldState: 0,
    source: 0
  }), Y1 = be(G1), q1 = [9, 13, 27, 32], er = Vn && "CompositionEvent" in window, Sl = null;
  Vn && "documentMode" in document && (Sl = document.documentMode);
  var X1 = Vn && "TextEvent" in window && !Sl, bh = Vn && (!er || Sl && 8 < Sl && 11 >= Sl), Sh = " ", Th = !1;
  function Eh(t, e) {
    switch (t) {
      case "keyup":
        return q1.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Ah(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var Ta = !1;
  function Q1(t, e) {
    switch (t) {
      case "compositionend":
        return Ah(e);
      case "keypress":
        return e.which !== 32 ? null : (Th = !0, Sh);
      case "textInput":
        return t = e.data, t === Sh && Th ? null : t;
      default:
        return null;
    }
  }
  function Z1(t, e) {
    if (Ta)
      return t === "compositionend" || !er && Eh(t, e) ? (t = mh(), Hs = Pu = $n = null, Ta = !1, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length)
            return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return bh && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var K1 = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function xh(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!K1[t.type] : e === "textarea";
  }
  function Mh(t, e, n, i) {
    ba ? Sa ? Sa.push(i) : Sa = [i] : ba = i, e = Qo(e, "onChange"), 0 < e.length && (n = new Ys(
      "onChange",
      "change",
      null,
      n,
      i
    ), t.push({ event: n, listeners: e }));
  }
  var Tl = null, El = null;
  function k1(t) {
    dy(t, 0);
  }
  function Xs(t) {
    var e = pl(t);
    if (sh(e)) return t;
  }
  function Ch(t, e) {
    if (t === "change") return e;
  }
  var Dh = !1;
  if (Vn) {
    var nr;
    if (Vn) {
      var ir = "oninput" in document;
      if (!ir) {
        var zh = document.createElement("div");
        zh.setAttribute("oninput", "return;"), ir = typeof zh.oninput == "function";
      }
      nr = ir;
    } else nr = !1;
    Dh = nr && (!document.documentMode || 9 < document.documentMode);
  }
  function Oh() {
    Tl && (Tl.detachEvent("onpropertychange", Rh), El = Tl = null);
  }
  function Rh(t) {
    if (t.propertyName === "value" && Xs(El)) {
      var e = [];
      Mh(
        e,
        El,
        t,
        ku(t)
      ), hh(k1, e);
    }
  }
  function J1(t, e, n) {
    t === "focusin" ? (Oh(), Tl = e, El = n, Tl.attachEvent("onpropertychange", Rh)) : t === "focusout" && Oh();
  }
  function F1(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown")
      return Xs(El);
  }
  function P1(t, e) {
    if (t === "click") return Xs(e);
  }
  function I1(t, e) {
    if (t === "input" || t === "change")
      return Xs(e);
  }
  function W1(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var He = typeof Object.is == "function" ? Object.is : W1;
  function Al(t, e) {
    if (He(t, e)) return !0;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null)
      return !1;
    var n = Object.keys(t), i = Object.keys(e);
    if (n.length !== i.length) return !1;
    for (i = 0; i < n.length; i++) {
      var s = n[i];
      if (!Bu.call(e, s) || !He(t[s], e[s]))
        return !1;
    }
    return !0;
  }
  function ar(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  function wh(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function Nh(t, e) {
    var n = wh(t);
    t = 0;
    for (var i; n; ) {
      if (n.nodeType === 3) {
        if (i = t + n.textContent.length, t <= e && i >= e)
          return { node: n, offset: e - t };
        t = i;
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = wh(n);
    }
  }
  function Vh(t, e) {
    return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? Vh(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
  }
  function _h(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = ar(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) t = e.contentWindow;
      else break;
      e = ar(t.document);
    }
    return e;
  }
  function lr(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var $1 = Vn && "documentMode" in document && 11 >= document.documentMode, Ea = null, sr = null, xl = null, or = !1;
  function Uh(t, e, n) {
    var i = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    or || Ea == null || Ea !== ar(i) || (i = Ea, "selectionStart" in i && lr(i) ? i = { start: i.selectionStart, end: i.selectionEnd } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
      anchorNode: i.anchorNode,
      anchorOffset: i.anchorOffset,
      focusNode: i.focusNode,
      focusOffset: i.focusOffset
    }), xl && Al(xl, i) || (xl = i, i = Qo(sr, "onSelect"), 0 < i.length && (e = new Ys(
      "onSelect",
      "select",
      null,
      e,
      n
    ), t.push({ event: e, listeners: i }), e.target = Ea)));
  }
  function Bi(t, e) {
    var n = {};
    return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
  }
  var Aa = {
    animationend: Bi("Animation", "AnimationEnd"),
    animationiteration: Bi("Animation", "AnimationIteration"),
    animationstart: Bi("Animation", "AnimationStart"),
    transitionrun: Bi("Transition", "TransitionRun"),
    transitionstart: Bi("Transition", "TransitionStart"),
    transitioncancel: Bi("Transition", "TransitionCancel"),
    transitionend: Bi("Transition", "TransitionEnd")
  }, ur = {}, Bh = {};
  Vn && (Bh = document.createElement("div").style, "AnimationEvent" in window || (delete Aa.animationend.animation, delete Aa.animationiteration.animation, delete Aa.animationstart.animation), "TransitionEvent" in window || delete Aa.transitionend.transition);
  function Li(t) {
    if (ur[t]) return ur[t];
    if (!Aa[t]) return t;
    var e = Aa[t], n;
    for (n in e)
      if (e.hasOwnProperty(n) && n in Bh)
        return ur[t] = e[n];
    return t;
  }
  var Lh = Li("animationend"), Hh = Li("animationiteration"), jh = Li("animationstart"), tS = Li("transitionrun"), eS = Li("transitionstart"), nS = Li("transitioncancel"), Gh = Li("transitionend"), Yh = /* @__PURE__ */ new Map(), rr = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  rr.push("scrollEnd");
  function nn(t, e) {
    Yh.set(t, e), Ui(e, [t]);
  }
  var iS = 0;
  function _n(t, e) {
    if (t.name != null && t.name !== "auto") return t.name;
    if (e.autoName !== null) return e.autoName;
    t = on.identifierPrefix;
    var n = iS++;
    return t = "_" + t + "t_" + n.toString(32) + "_", e.autoName = t;
  }
  function qh(t) {
    if (t == null || typeof t == "string")
      return t;
    var e = null, n = Xa;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var s = t[n[i]];
        if (s != null) {
          if (s === "none") return "none";
          e = e == null ? s : e + (" " + s);
        }
      }
    return e ?? t.default;
  }
  function Un(t, e) {
    return t = qh(t), e = qh(e), e == null ? t === "auto" ? null : t : e === "auto" ? null : e;
  }
  var Qs = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, Ke = [], xa = 0, cr = 0;
  function Zs() {
    for (var t = xa, e = cr = xa = 0; e < t; ) {
      var n = Ke[e];
      Ke[e++] = null;
      var i = Ke[e];
      Ke[e++] = null;
      var s = Ke[e];
      Ke[e++] = null;
      var o = Ke[e];
      if (Ke[e++] = null, i !== null && s !== null) {
        var f = i.pending;
        f === null ? s.next = s : (s.next = f.next, f.next = s), i.pending = s;
      }
      o !== 0 && Xh(n, s, o);
    }
  }
  function Ks(t, e, n, i) {
    Ke[xa++] = t, Ke[xa++] = e, Ke[xa++] = n, Ke[xa++] = i, cr |= i, t.lanes |= i, t = t.alternate, t !== null && (t.lanes |= i);
  }
  function fr(t, e, n, i) {
    return Ks(t, e, n, i), ks(t);
  }
  function Hi(t, e) {
    return Ks(t, null, null, e), ks(t);
  }
  function Xh(t, e, n) {
    t.lanes |= n;
    var i = t.alternate;
    i !== null && (i.lanes |= n);
    for (var s = !1, o = t.return; o !== null; )
      o.childLanes |= n, i = o.alternate, i !== null && (i.childLanes |= n), o.tag === 22 && (t = o.stateNode, t === null || t._visibility & 1 || (s = !0)), t = o, o = o.return;
    return t.tag === 3 ? (o = t.stateNode, s && e !== null && (s = 31 - Be(n), t = o.hiddenUpdates, i = t[s], i === null ? t[s] = [e] : i.push(e), e.lane = n | 536870912), o) : null;
  }
  function ks(t) {
    if (50 < Kl)
      throw Kl = 0, Lo = null, Error(u(185));
    for (var e = t.return; e !== null; )
      t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var Ma = {};
  function aS(t, e, n, i) {
    this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function De(t, e, n, i) {
    return new aS(t, e, n, i);
  }
  function dr(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function Bn(t, e) {
    var n = t.alternate;
    return n === null ? (n = De(
      t.tag,
      e,
      t.key,
      t.mode
    ), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 1206910976, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n;
  }
  function Qh(t, e) {
    t.flags &= 1206910978;
    var n = t.alternate;
    return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function Js(t, e, n, i, s, o) {
    var f = 0;
    if (i = t, typeof i == "function") dr(i) && (f = 1);
    else if (typeof i == "string")
      f = NT(
        t,
        n,
        mn.current
      ) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
      t: switch (i) {
        case Kt:
          return t = De(31, n, e, s), t.elementType = Kt, t.lanes = o, t;
        case bt:
          return ji(n.children, s, o, e);
        case Ct:
          f = 8, s |= 24;
          break;
        case ee:
          return t = De(12, n, e, s | 2), t.elementType = ee, t.lanes = o, t;
        case it:
          return t = De(13, n, e, s), t.elementType = it, t.lanes = o, t;
        case k:
          return t = De(19, n, e, s), t.elementType = k, t.lanes = o, t;
        case Me:
        case A:
          return t = s | 32, t = De(30, n, e, t), t.elementType = A, t.lanes = o, t.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, t;
        default:
          if (typeof i == "object" && i !== null)
            switch (i.$$typeof) {
              case At:
                f = 10;
                break t;
              case Xt:
                f = 9;
                break t;
              case G:
                f = 11;
                break t;
              case ft:
                f = 14;
                break t;
              case q:
                f = 16, i = null;
                break t;
            }
          f = 29, n = Error(
            u(130, t === null ? "null" : typeof t, "")
          ), i = null;
      }
    return e = De(f, n, e, s), e.elementType = t, e.type = i, e.lanes = o, e;
  }
  function ji(t, e, n, i) {
    return t = De(7, t, i, e), t.lanes = n, t;
  }
  function hr(t, e, n) {
    return t = De(6, t, null, e), t.lanes = n, t;
  }
  function Zh(t) {
    var e = De(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function mr(t, e, n) {
    return e = De(
      4,
      t.children !== null ? t.children : [],
      t.key,
      e
    ), e.lanes = n, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var Kh = /* @__PURE__ */ new WeakMap();
  function ke(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = Kh.get(t);
      return n !== void 0 ? n : (e = {
        value: t,
        source: e,
        stack: Gd(e)
      }, Kh.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: Gd(e)
    };
  }
  var Ca = [], Da = 0, Fs = null, Ml = 0, Je = [], Fe = 0, ei = null, yn = 1, gn = "";
  function Ln(t, e) {
    Ca[Da++] = Ml, Ca[Da++] = Fs, Fs = t, Ml = e;
  }
  function kh(t, e, n) {
    Je[Fe++] = yn, Je[Fe++] = gn, Je[Fe++] = ei, ei = t;
    var i = yn;
    t = gn;
    var s = 32 - Be(i) - 1;
    i &= ~(1 << s), n += 1;
    var o = 32 - Be(e) + s;
    if (30 < o) {
      var f = s - s % 5;
      o = (i & (1 << f) - 1).toString(32), i >>= f, s -= f, yn = 1 << 32 - Be(e) + s | n << s | i, gn = o + t;
    } else
      yn = 1 << o | n << s | i, gn = t;
  }
  function Ps(t) {
    t.return !== null && (Ln(t, 1), kh(t, 1, 0));
  }
  function pr(t) {
    for (; t === Fs; )
      Fs = Ca[--Da], Ca[Da] = null, Ml = Ca[--Da], Ca[Da] = null;
    for (; t === ei; )
      ei = Je[--Fe], Je[Fe] = null, gn = Je[--Fe], Je[Fe] = null, yn = Je[--Fe], Je[Fe] = null;
  }
  function Jh(t, e) {
    Je[Fe++] = yn, Je[Fe++] = gn, Je[Fe++] = ei, yn = e.id, gn = e.overflow, ei = t;
  }
  var se = null, Ht = null, pt = !1, ni = null, Pe = !1, yr = Error(u(519));
  function ii(t) {
    var e = Error(
      u(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw Cl(ke(e, t)), yr;
  }
  function Fh(t) {
    var e = t.stateNode, n = t.type, i = t.memoizedProps;
    switch (e[ce] = t, e[Ce] = i, n) {
      case "dialog":
        vt("cancel", e), vt("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        vt("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Jl.length; n++)
          vt(Jl[n], e);
        break;
      case "source":
        vt("error", e);
        break;
      case "img":
      case "image":
      case "link":
        vt("error", e), vt("load", e);
        break;
      case "details":
        vt("toggle", e);
        break;
      case "input":
        vt("invalid", e), oh(
          e,
          i.value,
          i.defaultValue,
          i.checked,
          i.defaultChecked,
          i.type,
          i.name,
          !0
        );
        break;
      case "select":
        vt("invalid", e);
        break;
      case "textarea":
        vt("invalid", e), rh(e, i.value, i.defaultValue, i.children);
    }
    n = i.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || i.suppressHydrationWarning === !0 || yy(e.textContent, n) ? (i.popover != null && (vt("beforetoggle", e), vt("toggle", e)), i.onScroll != null && vt("scroll", e), i.onScrollEnd != null && vt("scrollend", e), i.onClick != null && (e.onclick = pn), e = !0) : e = !1, e || ii(t, !0);
  }
  function Is(t) {
    for (se = t.return; se; )
      switch (se.tag) {
        case 5:
        case 31:
        case 13:
          Pe = !1;
          return;
        case 27:
        case 3:
          Pe = !0;
          return;
        default:
          se = se.return;
      }
  }
  function za(t) {
    if (t !== se) return !1;
    if (!pt) return Is(t), pt = !0, !1;
    var e = t.tag, n;
    if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || Kc(t.type, t.memoizedProps)), n = !n), n && Ht && ii(t), Is(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(u(317));
      Ht = Uy(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(u(317));
      Ht = Uy(t);
    } else
      e === 27 ? (e = Ht, bi(t.type) ? (t = ef, ef = null, Ht = t) : Ht = e) : Ht = se ? We(t.stateNode.nextSibling) : null;
    return !0;
  }
  function Gi() {
    Ht = se = null, pt = !1;
  }
  function gr() {
    var t = ni;
    return t !== null && (Re === null ? Re = t : Re.push.apply(
      Re,
      t
    ), ni = null), t;
  }
  function Cl(t) {
    ni === null ? ni = [t] : ni.push(t);
  }
  var vr = hn(null), Yi = null, Hn = null;
  function ai(t, e, n) {
    Lt(vr, e._currentValue), e._currentValue = n;
  }
  function jn(t) {
    t._currentValue = vr.current, re(vr);
  }
  function Ws(t, e, n) {
    for (; t !== null; ) {
      var i = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, i !== null && (i.childLanes |= e)) : i !== null && (i.childLanes & e) !== e && (i.childLanes |= e), t === n) break;
      t = t.return;
    }
  }
  function br(t, e, n, i) {
    var s = t.child;
    for (s !== null && (s.return = t); s !== null; ) {
      var o = s.dependencies;
      if (o !== null) {
        var f = s.child;
        o = o.firstContext;
        t: for (; o !== null; ) {
          var y = o;
          o = s;
          for (var T = 0; T < e.length; T++)
            if (y.context === e[T]) {
              o.lanes |= n, y = o.alternate, y !== null && (y.lanes |= n), Ws(
                o.return,
                n,
                t
              ), i || (f = null);
              break t;
            }
          o = y.next;
        }
      } else if (s.tag === 18) {
        if (f = s.return, f === null) throw Error(u(341));
        f.lanes |= n, o = f.alternate, o !== null && (o.lanes |= n), Ws(f, n, t), f = null;
      } else
        s.tag === 13 && s.memoizedState !== null && s.memoizedState.dehydrated === null ? (s.lanes |= n, f = s.alternate, f !== null && (f.lanes |= n), Ws(
          s.return,
          n,
          t
        ), f = s.child, f = f !== null ? f.sibling : null) : f = s.child;
      if (f !== null) f.return = s;
      else
        for (f = s; f !== null; ) {
          if (f === t) {
            f = null;
            break;
          }
          if (s = f.sibling, s !== null) {
            s.return = f.return, f = s;
            break;
          }
          f = f.return;
        }
      s = f;
    }
  }
  function qi(t, e, n, i) {
    t = null;
    for (var s = e, o = !1; s !== null; ) {
      if (!o) {
        if ((s.flags & 524288) !== 0) o = !0;
        else if ((s.flags & 262144) !== 0) break;
      }
      if (s.tag === 10) {
        var f = s.alternate;
        if (f === null) throw Error(u(387));
        if (f = f.memoizedProps, f !== null) {
          var y = s.type;
          He(s.pendingProps.value, f.value) || (t !== null ? t.push(y) : t = [y]);
        }
      } else if (s === Ms.current) {
        if (f = s.alternate, f === null) throw Error(u(387));
        f.memoizedState.memoizedState !== s.memoizedState.memoizedState && (t !== null ? t.push($a) : t = [$a]);
      }
      s = s.return;
    }
    return t !== null && br(
      e,
      t,
      n,
      i
    ), e.flags |= 262144, t !== null;
  }
  function $s(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!He(
        t.context._currentValue,
        t.memoizedValue
      ))
        return !0;
      t = t.next;
    }
    return !1;
  }
  function Xi(t) {
    Yi = t, Hn = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function fe(t) {
    return Ph(Yi, t);
  }
  function to(t, e) {
    return Yi === null && Xi(t), Ph(t, e);
  }
  function Ph(t, e) {
    var n = e._currentValue;
    if (e = { context: e, memoizedValue: n, next: null }, Hn === null) {
      if (t === null) throw Error(u(308));
      Hn = e, t.dependencies = { lanes: 0, firstContext: e }, t.flags |= 524288;
    } else Hn = Hn.next = e;
    return n;
  }
  var lS = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: !1,
      addEventListener: function(n, i) {
        t.push(i);
      }
    };
    this.abort = function() {
      e.aborted = !0, t.forEach(function(n) {
        return n();
      });
    };
  }, sS = a.unstable_scheduleCallback, oS = a.unstable_NormalPriority, Pt = {
    $$typeof: At,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Sr() {
    return {
      controller: new lS(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function Dl(t) {
    t.refCount--, t.refCount === 0 && sS(oS, function() {
      t.controller.abort();
    });
  }
  function Ih(t, e) {
    if ((t.pendingLanes & 4194048) !== 0) {
      var n = t.transitionTypes;
      for (n === null && (n = t.transitionTypes = []), t = 0; t < e.length; t++) {
        var i = e[t];
        n.indexOf(i) === -1 && n.push(i);
      }
    }
  }
  var zl = null;
  function uS(t) {
    var e = t.transitionTypes;
    return t.transitionTypes = null, e;
  }
  var Ol = null, Tr = 0, Qi = 0, Oa = null;
  function rS(t, e) {
    if (Ol === null) {
      var n = Ol = [];
      Tr = 0, Qi = Lc(), Oa = {
        status: "pending",
        value: void 0,
        then: function(i) {
          n.push(i);
        }
      };
    }
    return Tr++, e.then(Wh, Wh), e;
  }
  function Wh() {
    if (--Tr === 0 && (zl = null, Ol !== null)) {
      Oa !== null && (Oa.status = "fulfilled");
      var t = Ol;
      Ol = null, Qi = 0, Oa = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function cS(t, e) {
    var n = [], i = {
      status: "pending",
      value: null,
      reason: null,
      then: function(s) {
        n.push(s);
      }
    };
    return t.then(
      function() {
        i.status = "fulfilled", i.value = e;
        for (var s = 0; s < n.length; s++) (0, n[s])(e);
      },
      function(s) {
        for (i.status = "rejected", i.reason = s, s = 0; s < n.length; s++)
          (0, n[s])(void 0);
      }
    ), i;
  }
  var $h = W.S;
  W.S = function(t, e) {
    if (Zp = _e(), typeof e == "object" && e !== null && typeof e.then == "function" && rS(t, e), zl !== null)
      for (var n = ka; n !== null; )
        Ih(n, zl), n = n.next;
    if (n = t.types, n !== null) {
      for (var i = ka; i !== null; )
        Ih(i, n), i = i.next;
      if (Qi !== 0) {
        i = zl, i === null && (i = zl = []);
        for (var s = 0; s < n.length; s++) {
          var o = n[s];
          i.indexOf(o) === -1 && i.push(o);
        }
      }
    }
    $h !== null && $h(t, e);
  };
  var Zi = hn(null);
  function Er() {
    var t = Zi.current;
    return t !== null ? t : Ut.pooledCache;
  }
  function eo(t, e) {
    e === null ? Lt(Zi, Zi.current) : Lt(Zi, e.pool);
  }
  function tm() {
    var t = Er();
    return t === null ? null : { parent: Pt._currentValue, pool: t };
  }
  var Ra = Error(u(460)), Ar = Error(u(474)), no = Error(u(542)), io = { then: function() {
  } };
  function em(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function nm(t, e, n) {
    switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(pn, pn), e = n), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, am(t), t === void 0 && !("reason" in e) ? Error(u(600)) : t;
      default:
        if (typeof e.status == "string") e.then(pn, pn);
        else {
          if (t = Ut, t !== null && 100 < t.shellSuspendCounter)
            throw Error(u(482));
          t = e, t.status = "pending", t.then(
            function(i) {
              if (e.status === "pending") {
                var s = e;
                s.status = "fulfilled", s.value = i;
              }
            },
            function(i) {
              if (e.status === "pending") {
                var s = e;
                s.status = "rejected", s.reason = i;
              }
            }
          );
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, am(t), t;
        }
        throw ki = e, Ra;
    }
  }
  function Ki(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (ki = n, Ra) : n;
    }
  }
  var ki = null;
  function im() {
    if (ki === null) throw Error(u(459));
    var t = ki;
    return ki = null, t;
  }
  function am(t) {
    if (t === Ra || t === no)
      throw Error(u(483));
  }
  var wa = null, Rl = 0;
  function ao(t) {
    var e = Rl;
    return Rl += 1, wa === null && (wa = []), nm(wa, t, e);
  }
  function li(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function lo(t, e) {
    throw e.$$typeof === V ? Error(u(525)) : (t = Object.prototype.toString.call(e), Error(
      u(
        31,
        t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t
      )
    ));
  }
  function lm(t) {
    function e(M, E) {
      if (t) {
        var D = M.deletions;
        D === null ? (M.deletions = [E], M.flags |= 16) : D.push(E);
      }
    }
    function n(M, E) {
      if (!t) return null;
      for (; E !== null; )
        e(M, E), E = E.sibling;
      return null;
    }
    function i(M) {
      for (var E = /* @__PURE__ */ new Map(); M !== null; )
        M.key === null ? E.set(M.index, M) : E.set(M.key, M), M = M.sibling;
      return E;
    }
    function s(M, E) {
      return M = Bn(M, E), M.index = 0, M.sibling = null, M;
    }
    function o(M, E, D) {
      return M.index = D, t ? (D = M.alternate, D !== null ? (D = D.index, D < E ? (M.flags |= 2, E) : D) : (M.flags |= 134217730, E)) : (M.flags |= 1048576, E);
    }
    function f(M) {
      return t && M.alternate === null && (M.flags |= 134217730), M;
    }
    function y(M, E, D, _) {
      return E === null || E.tag !== 6 ? (E = hr(D, M.mode, _), E.return = M, E) : (E = s(E, D), E.return = M, E);
    }
    function T(M, E, D, _) {
      var J = D.type;
      return J === bt ? (M = R(
        M,
        E,
        D.props.children,
        _,
        D.key
      ), li(M, D), M) : E !== null && (E.elementType === J || typeof J == "object" && J !== null && J.$$typeof === q && Ki(J) === E.type) ? (E = s(E, D.props), li(E, D), E.return = M, E) : (E = Js(
        D.type,
        D.key,
        D.props,
        null,
        M.mode,
        _
      ), li(E, D), E.return = M, E);
    }
    function C(M, E, D, _) {
      return E === null || E.tag !== 4 || E.stateNode.containerInfo !== D.containerInfo || E.stateNode.implementation !== D.implementation ? (E = mr(D, M.mode, _), E.return = M, E) : (E = s(E, D.children || []), E.return = M, E);
    }
    function R(M, E, D, _, J) {
      return E === null || E.tag !== 7 ? (E = ji(
        D,
        M.mode,
        _,
        J
      ), E.return = M, E) : (E = s(E, D), E.return = M, E);
    }
    function B(M, E, D) {
      if (typeof E == "string" && E !== "" || typeof E == "number" || typeof E == "bigint")
        return E = hr(
          "" + E,
          M.mode,
          D
        ), E.return = M, E;
      if (typeof E == "object" && E !== null) {
        switch (E.$$typeof) {
          case dt:
            return D = Js(
              E.type,
              E.key,
              E.props,
              null,
              M.mode,
              D
            ), li(D, E), D.return = M, D;
          case nt:
            return E = mr(
              E,
              M.mode,
              D
            ), E.return = M, E;
          case q:
            return E = Ki(E), B(M, E, D);
        }
        if (xt(E) || et(E))
          return E = ji(
            E,
            M.mode,
            D,
            null
          ), E.return = M, E;
        if (typeof E.then == "function")
          return B(M, ao(E), D);
        if (E.$$typeof === At)
          return B(
            M,
            to(M, E),
            D
          );
        lo(M, E);
      }
      return null;
    }
    function x(M, E, D, _) {
      var J = E !== null ? E.key : null;
      if (typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint")
        return J !== null ? null : y(M, E, "" + D, _);
      if (typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case dt:
            return D.key === J ? T(M, E, D, _) : null;
          case nt:
            return D.key === J ? C(M, E, D, _) : null;
          case q:
            return D = Ki(D), x(M, E, D, _);
        }
        if (xt(D) || et(D))
          return J !== null ? null : R(M, E, D, _, null);
        if (typeof D.then == "function")
          return x(
            M,
            E,
            ao(D),
            _
          );
        if (D.$$typeof === At)
          return x(
            M,
            E,
            to(M, D),
            _
          );
        lo(M, D);
      }
      return null;
    }
    function O(M, E, D, _, J) {
      if (typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint")
        return M = M.get(D) || null, y(E, M, "" + _, J);
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case dt:
            return M = M.get(
              _.key === null ? D : _.key
            ) || null, T(E, M, _, J);
          case nt:
            return M = M.get(
              _.key === null ? D : _.key
            ) || null, C(E, M, _, J);
          case q:
            return _ = Ki(_), O(
              M,
              E,
              D,
              _,
              J
            );
        }
        if (xt(_) || et(_))
          return M = M.get(D) || null, R(E, M, _, J, null);
        if (typeof _.then == "function")
          return O(
            M,
            E,
            D,
            ao(_),
            J
          );
        if (_.$$typeof === At)
          return O(
            M,
            E,
            D,
            to(E, _),
            J
          );
        lo(E, _);
      }
      return null;
    }
    function Q(M, E, D, _) {
      for (var J = null, Et = null, at = E, rt = E = 0, $t = null; at !== null && rt < D.length; rt++) {
        at.index > rt ? ($t = at, at = null) : $t = at.sibling;
        var Mt = x(
          M,
          at,
          D[rt],
          _
        );
        if (Mt === null) {
          at === null && (at = $t);
          break;
        }
        t && at && Mt.alternate === null && e(M, at), E = o(Mt, E, rt), Et === null ? J = Mt : Et.sibling = Mt, Et = Mt, at = $t;
      }
      if (rt === D.length)
        return n(M, at), pt && Ln(M, rt), J;
      if (at === null) {
        for (; rt < D.length; rt++)
          at = B(M, D[rt], _), at !== null && (E = o(
            at,
            E,
            rt
          ), Et === null ? J = at : Et.sibling = at, Et = at);
        return pt && Ln(M, rt), J;
      }
      for (at = i(at); rt < D.length; rt++)
        $t = O(
          at,
          M,
          rt,
          D[rt],
          _
        ), $t !== null && (t && (Mt = $t.alternate, Mt !== null && at.delete(Mt.key === null ? rt : Mt.key)), E = o(
          $t,
          E,
          rt
        ), Et === null ? J = $t : Et.sibling = $t, Et = $t);
      return t && at.forEach(function(xi) {
        return e(M, xi);
      }), pt && Ln(M, rt), J;
    }
    function $(M, E, D, _) {
      if (D == null) throw Error(u(151));
      for (var J = null, Et = null, at = E, rt = E = 0, $t = null, Mt = D.next(); at !== null && !Mt.done; rt++, Mt = D.next()) {
        at.index > rt ? ($t = at, at = null) : $t = at.sibling;
        var xi = x(M, at, Mt.value, _);
        if (xi === null) {
          at === null && (at = $t);
          break;
        }
        t && at && xi.alternate === null && e(M, at), E = o(xi, E, rt), Et === null ? J = xi : Et.sibling = xi, Et = xi, at = $t;
      }
      if (Mt.done)
        return n(M, at), pt && Ln(M, rt), J;
      if (at === null) {
        for (; !Mt.done; rt++, Mt = D.next())
          Mt = B(M, Mt.value, _), Mt !== null && (E = o(Mt, E, rt), Et === null ? J = Mt : Et.sibling = Mt, Et = Mt);
        return pt && Ln(M, rt), J;
      }
      for (at = i(at); !Mt.done; rt++, Mt = D.next())
        Mt = O(at, M, rt, Mt.value, _), Mt !== null && (t && ($t = Mt.alternate, $t !== null && at.delete(
          $t.key === null ? rt : $t.key
        )), E = o(Mt, E, rt), Et === null ? J = Mt : Et.sibling = Mt, Et = Mt);
      return t && at.forEach(function(QT) {
        return e(M, QT);
      }), pt && Ln(M, rt), J;
    }
    function mt(M, E, D, _) {
      if (typeof D == "object" && D !== null && D.type === bt && D.key === null && D.props.ref === void 0 && (D = D.props.children), typeof D == "object" && D !== null) {
        switch (D.$$typeof) {
          case dt:
            t: {
              for (var J = D.key; E !== null; ) {
                if (E.key === J) {
                  if (J = D.type, J === bt) {
                    if (E.tag === 7) {
                      n(
                        M,
                        E.sibling
                      ), _ = s(
                        E,
                        D.props.children
                      ), li(_, D), _.return = M, M = _;
                      break t;
                    }
                  } else if (E.elementType === J || typeof J == "object" && J !== null && J.$$typeof === q && Ki(J) === E.type) {
                    n(
                      M,
                      E.sibling
                    ), _ = s(E, D.props), li(_, D), _.return = M, M = _;
                    break t;
                  }
                  n(M, E);
                  break;
                } else e(M, E);
                E = E.sibling;
              }
              D.type === bt ? (_ = ji(
                D.props.children,
                M.mode,
                _,
                D.key
              ), li(_, D), _.return = M, M = _) : (_ = Js(
                D.type,
                D.key,
                D.props,
                null,
                M.mode,
                _
              ), li(_, D), _.return = M, M = _);
            }
            return f(M);
          case nt:
            t: {
              for (J = D.key; E !== null; ) {
                if (E.key === J)
                  if (E.tag === 4 && E.stateNode.containerInfo === D.containerInfo && E.stateNode.implementation === D.implementation) {
                    n(
                      M,
                      E.sibling
                    ), _ = s(E, D.children || []), _.return = M, M = _;
                    break t;
                  } else {
                    n(M, E);
                    break;
                  }
                else e(M, E);
                E = E.sibling;
              }
              _ = mr(D, M.mode, _), _.return = M, M = _;
            }
            return f(M);
          case q:
            return D = Ki(D), mt(
              M,
              E,
              D,
              _
            );
        }
        if (xt(D))
          return Q(
            M,
            E,
            D,
            _
          );
        if (et(D)) {
          if (J = et(D), typeof J != "function") throw Error(u(150));
          return D = J.call(D), $(
            M,
            E,
            D,
            _
          );
        }
        if (typeof D.then == "function")
          return mt(
            M,
            E,
            ao(D),
            _
          );
        if (D.$$typeof === At)
          return mt(
            M,
            E,
            to(M, D),
            _
          );
        lo(M, D);
      }
      return typeof D == "string" && D !== "" || typeof D == "number" || typeof D == "bigint" ? (D = "" + D, E !== null && E.tag === 6 ? (n(M, E.sibling), _ = s(E, D), _.return = M, M = _) : (n(M, E), _ = hr(D, M.mode, _), _.return = M, M = _), f(M)) : n(M, E);
    }
    return function(M, E, D, _) {
      try {
        Rl = 0;
        var J = mt(
          M,
          E,
          D,
          _
        );
        return wa = null, J;
      } catch (at) {
        if (at === Ra || at === no) throw at;
        var Et = De(29, at, null, M.mode);
        return Et.lanes = _, Et.return = M, Et;
      } finally {
      }
    };
  }
  var Ji = lm(!0), sm = lm(!1), si = !1;
  function xr(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Mr(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function oi(t) {
    return { lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function ui(t, e, n) {
    var i = t.updateQueue;
    if (i === null) return null;
    if (i = i.shared, (zt & 2) !== 0) {
      var s = i.pending;
      return s === null ? e.next = e : (e.next = s.next, s.next = e), i.pending = e, e = ks(t), Xh(t, null, n), e;
    }
    return Ks(t, i, e, n), ks(t);
  }
  function wl(t, e, n) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
      var i = e.lanes;
      i &= t.pendingLanes, n |= i, e.lanes = n, kd(t, n);
    }
  }
  function Cr(t, e) {
    var n = t.updateQueue, i = t.alternate;
    if (i !== null && (i = i.updateQueue, n === i)) {
      var s = null, o = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var f = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          o === null ? s = o = f : o = o.next = f, n = n.next;
        } while (n !== null);
        o === null ? s = o = e : o = o.next = e;
      } else s = o = e;
      n = {
        baseState: i.baseState,
        firstBaseUpdate: s,
        lastBaseUpdate: o,
        shared: i.shared,
        callbacks: i.callbacks
      }, t.updateQueue = n;
      return;
    }
    t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
  }
  var Dr = !1;
  function Nl() {
    if (Dr) {
      var t = Oa;
      if (t !== null) throw t;
    }
  }
  function Vl(t, e, n, i) {
    Dr = !1;
    var s = t.updateQueue;
    si = !1;
    var o = s.firstBaseUpdate, f = s.lastBaseUpdate, y = s.shared.pending;
    if (y !== null) {
      s.shared.pending = null;
      var T = y, C = T.next;
      T.next = null, f === null ? o = C : f.next = C, f = T;
      var R = t.alternate;
      R !== null && (R = R.updateQueue, y = R.lastBaseUpdate, y !== f && (y === null ? R.firstBaseUpdate = C : y.next = C, R.lastBaseUpdate = T));
    }
    if (o !== null) {
      var B = s.baseState;
      f = 0, R = C = T = null, y = o;
      do {
        var x = y.lane & -536870913, O = x !== y.lane;
        if (O ? (Tt & x) === x : (i & x) === x) {
          x !== 0 && x === Qi && (Dr = !0), R !== null && (R = R.next = {
            lane: 0,
            tag: y.tag,
            payload: y.payload,
            callback: null,
            next: null
          });
          t: {
            var Q = t, $ = y;
            x = e;
            var mt = n;
            switch ($.tag) {
              case 1:
                if (Q = $.payload, typeof Q == "function") {
                  B = Q.call(mt, B, x);
                  break t;
                }
                B = Q;
                break t;
              case 3:
                Q.flags = Q.flags & -65537 | 128;
              case 0:
                if (Q = $.payload, x = typeof Q == "function" ? Q.call(mt, B, x) : Q, x == null) break t;
                B = Z({}, B, x);
                break t;
              case 2:
                si = !0;
            }
          }
          x = y.callback, x !== null && (t.flags |= 64, O && (t.flags |= 8192), O = s.callbacks, O === null ? s.callbacks = [x] : O.push(x));
        } else
          O = {
            lane: x,
            tag: y.tag,
            payload: y.payload,
            callback: y.callback,
            next: null
          }, R === null ? (C = R = O, T = B) : R = R.next = O, f |= x;
        if (y = y.next, y === null) {
          if (y = s.shared.pending, y === null)
            break;
          O = y, y = O.next, O.next = null, s.lastBaseUpdate = O, s.shared.pending = null;
        }
      } while (!0);
      R === null && (T = B), s.baseState = T, s.firstBaseUpdate = C, s.lastBaseUpdate = R, o === null && (s.shared.lanes = 0), pi |= f, t.lanes = f, t.memoizedState = B;
    }
  }
  function om(t, e) {
    if (typeof t != "function")
      throw Error(u(191, t));
    t.call(e);
  }
  function um(t, e) {
    var n = t.callbacks;
    if (n !== null)
      for (t.callbacks = null, t = 0; t < n.length; t++)
        om(n[t], e);
  }
  var ri = hn(null), so = hn(0);
  function rm(t, e) {
    t = Qn, Lt(so, t), Lt(ri, e), Qn = t | e.baseLanes;
  }
  function zr() {
    Lt(so, Qn), Lt(ri, ri.current);
  }
  function Or() {
    Qn = so.current, re(ri), re(so);
  }
  var de = hn(null), ve = null;
  function ci(t) {
    var e = t.alternate;
    Lt(he, he.current & 1), Lt(de, t), ve === null && (e === null || ri.current !== null || e.memoizedState !== null) && (ve = t);
  }
  function Rr(t) {
    Lt(he, he.current), Lt(de, t), ve === null && (ve = t);
  }
  function cm(t) {
    t.tag === 22 ? (Lt(he, he.current), Lt(de, t), ve === null && (ve = t)) : fi();
  }
  function fi() {
    Lt(he, he.current), Lt(de, de.current);
  }
  function je(t) {
    re(de), ve === t && (ve = null), re(he);
  }
  var he = hn(0);
  function _l(t, e) {
    Lt(de, de.current), Lt(he, e);
  }
  function wr(t) {
    re(he), re(de), ve === t && (ve = null);
  }
  function oo(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || $c(n) || tf(n)))
          return e;
      } else if (e.tag === 19 && e.memoizedProps.revealOrder !== "independent") {
        if ((e.flags & 128) !== 0) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var Gn = 0, ht = null, _t = null, It = null, uo = !1, Na = !1, Fi = !1, ro = 0, Ul = 0, Va = null, fS = 0;
  function Qt() {
    throw Error(u(321));
  }
  function Nr(t, e) {
    if (e === null) return !1;
    for (var n = 0; n < e.length && n < t.length; n++)
      if (!He(t[n], e[n])) return !1;
    return !0;
  }
  function Vr(t, e, n, i, s, o) {
    return Gn = o, ht = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, W.H = t === null || t.memoizedState === null ? km : Jm, Fi = !1, o = n(i, s), Fi = !1, Na && (o = dm(
      e,
      n,
      i,
      s
    )), fm(t), o;
  }
  function fm(t) {
    W.H = go;
    var e = _t !== null && _t.next !== null;
    if (Gn = 0, It = _t = ht = null, uo = !1, Ul = 0, Va = null, e) throw Error(u(300));
    t === null || Wt || (t = t.dependencies, t !== null && $s(t) && (Wt = !0));
  }
  function dm(t, e, n, i) {
    ht = t;
    var s = 0;
    do {
      if (Na && (Va = null), Ul = 0, Na = !1, 25 <= s) throw Error(u(301));
      if (s += 1, It = _t = null, t.updateQueue != null) {
        var o = t.updateQueue;
        o.lastEffect = null, o.events = null, o.stores = null, o.memoCache != null && (o.memoCache.index = 0);
      }
      W.H = bS, o = e(n, i);
    } while (Na);
    return o;
  }
  function dS() {
    var t = W.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? Bl(e) : e, t = t.useState()[0], (_t !== null ? _t.memoizedState : null) !== t && (ht.flags |= 1024), e;
  }
  function _r() {
    var t = ro !== 0;
    return ro = 0, t;
  }
  function Ur(t, e, n) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n;
  }
  function Br(t) {
    if (uo) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      uo = !1;
    }
    Gn = 0, It = _t = ht = null, Na = !1, Ul = ro = 0, Va = null;
  }
  function Se() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return It === null ? ht.memoizedState = It = t : It = It.next = t, It;
  }
  function kt() {
    if (_t === null) {
      var t = ht.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = _t.next;
    var e = It === null ? ht.memoizedState : It.next;
    if (e !== null)
      It = e, _t = t;
    else {
      if (t === null)
        throw ht.alternate === null ? Error(u(467)) : Error(u(310));
      _t = t, t = {
        memoizedState: _t.memoizedState,
        baseState: _t.baseState,
        baseQueue: _t.baseQueue,
        queue: _t.queue,
        next: null
      }, It === null ? ht.memoizedState = It = t : It = It.next = t;
    }
    return It;
  }
  function co() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Bl(t) {
    var e = Ul;
    return Ul += 1, Va === null && (Va = []), t = nm(Va, t, e), e = ht, (It === null ? e.memoizedState : It.next) === null && (e = e.alternate, W.H = e === null || e.memoizedState === null ? km : Jm), t;
  }
  function fo(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return Bl(t);
      if (t.$$typeof === L) return;
      if (t.$$typeof === At) return fe(t);
    }
    throw Error(u(438, String(t)));
  }
  function Lr(t) {
    var e = null, n = ht.updateQueue;
    if (n !== null && (e = n.memoCache), e == null) {
      var i = ht.alternate;
      i !== null && (i = i.updateQueue, i !== null && (i = i.memoCache, i != null && (e = {
        data: i.data.map(function(s) {
          return s.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = { data: [], index: 0 }), n === null && (n = co(), ht.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0)
      for (n = e.data[e.index] = Array(t), i = 0; i < t; i++)
        n[i] = dn;
    return e.index++, n;
  }
  function Yn(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function ho(t) {
    var e = kt();
    return Hr(e, _t, t);
  }
  function Hr(t, e, n) {
    var i = t.queue;
    if (i === null) throw Error(u(311));
    i.lastRenderedReducer = n;
    var s = t.baseQueue, o = i.pending;
    if (o !== null) {
      if (s !== null) {
        var f = s.next;
        s.next = o.next, o.next = f;
      }
      e.baseQueue = s = o, i.pending = null;
    }
    if (o = t.baseState, s === null) t.memoizedState = o;
    else {
      e = s.next;
      var y = f = null, T = null, C = e, R = !1;
      do {
        var B = C.lane & -536870913;
        if (B !== C.lane ? (Tt & B) === B : (Gn & B) === B) {
          var x = C.revertLane;
          if (x === 0)
            T !== null && (T = T.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: C.action,
              hasEagerState: C.hasEagerState,
              eagerState: C.eagerState,
              next: null
            }), B === Qi && (R = !0);
          else if ((Gn & x) === x) {
            C = C.next, x === Qi && (R = !0);
            continue;
          } else
            B = {
              lane: 0,
              revertLane: C.revertLane,
              gesture: null,
              action: C.action,
              hasEagerState: C.hasEagerState,
              eagerState: C.eagerState,
              next: null
            }, T === null ? (y = T = B, f = o) : T = T.next = B, ht.lanes |= x, pi |= x;
          B = C.action, Fi && n(o, B), o = C.hasEagerState ? C.eagerState : n(o, B);
        } else
          x = {
            lane: B,
            revertLane: C.revertLane,
            gesture: C.gesture,
            action: C.action,
            hasEagerState: C.hasEagerState,
            eagerState: C.eagerState,
            next: null
          }, T === null ? (y = T = x, f = o) : T = T.next = x, ht.lanes |= B, pi |= B;
        C = C.next;
      } while (C !== null && C !== e);
      if (T === null ? f = o : T.next = y, !He(o, t.memoizedState) && (Wt = !0, R && (n = Oa, n !== null)))
        throw n;
      t.memoizedState = o, t.baseState = f, t.baseQueue = T, i.lastRenderedState = o;
    }
    return s === null && (i.lanes = 0), [t.memoizedState, i.dispatch];
  }
  function jr(t) {
    var e = kt(), n = e.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = t;
    var i = n.dispatch, s = n.pending, o = e.memoizedState;
    if (s !== null) {
      n.pending = null;
      var f = s = s.next;
      do
        o = t(o, f.action), f = f.next;
      while (f !== s);
      He(o, e.memoizedState) || (Wt = !0), e.memoizedState = o, e.baseQueue === null && (e.baseState = o), n.lastRenderedState = o;
    }
    return [o, i];
  }
  function hm(t, e, n) {
    var i = ht, s = kt(), o = pt;
    if (o) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else n = e();
    var f = !He(
      (_t || s).memoizedState,
      n
    );
    if (f && (s.memoizedState = n, Wt = !0), s = s.queue, qr(ym.bind(null, i, s, t), [
      t
    ]), t = s.getSnapshot !== e || f || It !== null && (It.memoizedState.tag & 1) !== 0, _a(
      t ? 9 : 8,
      { destroy: void 0 },
      pm.bind(null, i, s, n, e),
      null
    ), t) {
      if (i.flags |= 2048, Ut === null) throw Error(u(349));
      o || (Gn & 127) !== 0 || mm(i, e, n);
    }
    return n;
  }
  function mm(t, e, n) {
    t.flags |= 16384, t = { getSnapshot: e, value: n }, e = ht.updateQueue, e === null ? (e = co(), ht.updateQueue = e, e.stores = [t]) : (n = e.stores, n === null ? e.stores = [t] : n.push(t));
  }
  function pm(t, e, n, i) {
    e.value = n, e.getSnapshot = i, gm(e) && vm(t);
  }
  function ym(t, e, n) {
    return n(function() {
      gm(e) && vm(t);
    });
  }
  function gm(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !He(t, n);
    } catch {
      return !0;
    }
  }
  function vm(t) {
    var e = Hi(t, 2);
    e !== null && we(e, t, 2);
  }
  function Gr(t) {
    var e = Se();
    if (typeof t == "function") {
      var n = t;
      if (t = n(), Fi) {
        Wn(!0);
        try {
          n();
        } finally {
          Wn(!1);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Yn,
      lastRenderedState: t
    }, e;
  }
  function bm(t, e, n, i) {
    return t.baseState = n, Hr(
      t,
      _t,
      typeof i == "function" ? i : Yn
    );
  }
  function hS(t, e, n, i, s) {
    if (yo(t)) throw Error(u(485));
    if (t = e.action, t !== null) {
      var o = {
        payload: s,
        action: t,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(f) {
          o.listeners.push(f);
        }
      };
      W.T !== null ? n(!0) : o.isTransition = !1, i(o), n = e.pending, n === null ? (o.next = e.pending = o, Sm(e, o)) : (o.next = n.next, e.pending = n.next = o);
    }
  }
  function Sm(t, e) {
    var n = e.action, i = e.payload, s = t.state;
    if (e.isTransition) {
      var o = W.T, f = {};
      f.types = o !== null ? o.types : null, W.T = f;
      try {
        var y = n(s, i), T = W.S;
        T !== null && T(f, y), Tm(t, e, y);
      } catch (C) {
        Yr(t, e, C);
      } finally {
        o !== null && f.types !== null && (o.types = f.types), W.T = o;
      }
    } else
      try {
        o = n(s, i), Tm(t, e, o);
      } catch (C) {
        Yr(t, e, C);
      }
  }
  function Tm(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(
      function(i) {
        Em(t, e, i);
      },
      function(i) {
        return Yr(t, e, i);
      }
    ) : Em(t, e, n);
  }
  function Em(t, e, n) {
    e.status = "fulfilled", e.value = n, Am(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, Sm(t, n)));
  }
  function Yr(t, e, n) {
    var i = t.pending;
    if (t.pending = null, i !== null) {
      i = i.next;
      do
        e.status = "rejected", e.reason = n, Am(e), e = e.next;
      while (e !== i);
    }
    t.action = null;
  }
  function Am(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function xm(t, e) {
    return e;
  }
  function Mm(t, e) {
    if (pt) {
      var n = Ut.formState;
      if (n !== null) {
        t: {
          var i = ht;
          if (pt) {
            if (Ht) {
              e: {
                for (var s = Ht, o = Pe; s.nodeType !== 8; ) {
                  if (!o) {
                    s = null;
                    break e;
                  }
                  if (s = We(
                    s.nextSibling
                  ), s === null) {
                    s = null;
                    break e;
                  }
                }
                o = s.data, s = o === "F!" || o === "F" ? s : null;
              }
              if (s) {
                Ht = We(
                  s.nextSibling
                ), i = s.data === "F!";
                break t;
              }
            }
            ii(i);
          }
          i = !1;
        }
        i && (e = n[0]);
      }
    }
    return n = Se(), n.memoizedState = n.baseState = e, i = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: xm,
      lastRenderedState: e
    }, n.queue = i, n = Qm.bind(
      null,
      ht,
      i
    ), i.dispatch = n, i = Gr(!1), o = kr.bind(
      null,
      ht,
      !1,
      i.queue
    ), i = Se(), s = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, i.queue = s, n = hS.bind(
      null,
      ht,
      s,
      o,
      n
    ), s.dispatch = n, i.memoizedState = t, [e, n, !1];
  }
  function Cm(t) {
    var e = kt();
    return Dm(e, _t, t);
  }
  function Dm(t, e, n) {
    if (e = Hr(
      t,
      e,
      xm
    )[0], t = ho(Yn)[0], typeof e == "object" && e !== null && typeof e.then == "function")
      try {
        var i = Bl(e);
      } catch (f) {
        throw f === Ra ? no : f;
      }
    else i = e;
    e = kt();
    var s = e.queue, o = s.dispatch;
    return n !== e.memoizedState && (ht.flags |= 2048, _a(
      9,
      { destroy: void 0 },
      mS.bind(null, s, n),
      null
    )), [i, o, t];
  }
  function mS(t, e) {
    t.action = e;
  }
  function zm(t) {
    var e = kt(), n = _t;
    if (n !== null)
      return Dm(e, n, t);
    kt(), e = e.memoizedState, n = kt();
    var i = n.queue.dispatch;
    return n.memoizedState = t, [e, i, !1];
  }
  function _a(t, e, n, i) {
    return t = { tag: t, create: n, deps: i, inst: e, next: null }, e = ht.updateQueue, e === null && (e = co(), ht.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (i = n.next, n.next = t, t.next = i, e.lastEffect = t), t;
  }
  function Om() {
    return kt().memoizedState;
  }
  function mo(t, e, n, i) {
    var s = Se();
    ht.flags |= t, s.memoizedState = _a(
      1 | e,
      { destroy: void 0 },
      n,
      i === void 0 ? null : i
    );
  }
  function po(t, e, n, i) {
    var s = kt();
    i = i === void 0 ? null : i;
    var o = s.memoizedState.inst;
    _t !== null && i !== null && Nr(i, _t.memoizedState.deps) ? s.memoizedState = _a(e, o, n, i) : (ht.flags |= t, s.memoizedState = _a(
      1 | e,
      o,
      n,
      i
    ));
  }
  function Rm(t, e) {
    mo(8390656, 8, t, e);
  }
  function qr(t, e) {
    po(2048, 8, t, e);
  }
  function pS(t) {
    ht.flags |= 4;
    var e = ht.updateQueue;
    if (e === null)
      e = co(), ht.updateQueue = e, e.events = [t];
    else {
      var n = e.events;
      n === null ? e.events = [t] : n.push(t);
    }
  }
  function wm(t) {
    var e = kt().memoizedState;
    return pS({ ref: e, nextImpl: t }), function() {
      if ((zt & 2) !== 0) throw Error(u(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function Nm(t, e) {
    return po(4, 2, t, e);
  }
  function Vm(t, e) {
    return po(4, 4, t, e);
  }
  function _m(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function() {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null)
      return t = t(), e.current = t, function() {
        e.current = null;
      };
  }
  function Um(t, e, n) {
    n = n != null ? n.concat([t]) : null, po(4, 4, _m.bind(null, e, t), n);
  }
  function Xr() {
  }
  function Bm(t, e) {
    var n = kt();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    return e !== null && Nr(e, i[1]) ? i[0] : (n.memoizedState = [t, e], t);
  }
  function Lm(t, e) {
    var n = kt();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    if (e !== null && Nr(e, i[1]))
      return i[0];
    if (i = t(), Fi) {
      Wn(!0);
      try {
        t();
      } finally {
        Wn(!1);
      }
    }
    return n.memoizedState = [i, e], i;
  }
  function Qr(t, e, n) {
    return n === void 0 || (Gn & 1073741824) !== 0 && (Tt & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = n, t = kp(), ht.lanes |= t, pi |= t, n);
  }
  function Hm(t, e, n, i) {
    return He(n, e) ? n : ri.current !== null ? (t = Qr(t, n, i), He(t, e) || (Wt = !0), t) : (Gn & 106) === 0 || (Gn & 1073741824) !== 0 && (Tt & 261930) === 0 ? (Wt = !0, t.memoizedState = n) : (t = kp(), ht.lanes |= t, pi |= t, e);
  }
  function jm(t, e, n, i, s) {
    var o = ut.p;
    ut.p = o !== 0 && 8 > o ? o : 8;
    var f = W.T, y = {};
    y.types = f !== null ? f.types : null, W.T = y, kr(t, !1, e, n);
    try {
      var T = s(), C = W.S;
      if (C !== null && C(y, T), T !== null && typeof T == "object" && typeof T.then == "function") {
        var R = cS(
          T,
          i
        );
        Ll(
          t,
          e,
          R,
          Xe(t)
        );
      } else
        Ll(
          t,
          e,
          i,
          Xe(t)
        );
    } catch (B) {
      Ll(
        t,
        e,
        { then: function() {
        }, status: "rejected", reason: B },
        Xe()
      );
    } finally {
      ut.p = o, f !== null && y.types !== null && (f.types = y.types), W.T = f;
    }
  }
  function yS() {
  }
  function Zr(t, e, n, i) {
    if (t.tag !== 5) throw Error(u(476));
    var s = Gm(t).queue;
    jm(
      t,
      s,
      e,
      Ve,
      n === null ? yS : function() {
        return Ym(t), n(i);
      }
    );
  }
  function Gm(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: Ve,
      baseState: Ve,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Yn,
        lastRenderedState: Ve
      },
      next: null
    };
    var n = {};
    return e.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Yn,
        lastRenderedState: n
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function Ym(t) {
    var e = Gm(t);
    e.next === null && (e = t.alternate.memoizedState), Ll(
      t,
      e.next.queue,
      {},
      Xe()
    );
  }
  function Kr() {
    return fe($a);
  }
  function qm() {
    return kt().memoizedState;
  }
  function Xm() {
    return kt().memoizedState;
  }
  function gS(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = Xe();
          t = oi(n);
          var i = ui(e, t, n);
          i !== null && (we(i, e, n), wl(i, e, n)), e = { cache: Sr() }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function vS(t, e, n) {
    var i = Xe();
    n = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, yo(t) ? Zm(e, n) : (n = fr(t, e, n, i), n !== null && (we(n, t, i), Km(n, e, i)));
  }
  function Qm(t, e, n) {
    var i = Xe();
    Ll(t, e, n, i);
  }
  function Ll(t, e, n, i) {
    var s = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (yo(t)) Zm(e, s);
    else {
      var o = t.alternate;
      if (t.lanes === 0 && (o === null || o.lanes === 0) && (o = e.lastRenderedReducer, o !== null))
        try {
          var f = e.lastRenderedState, y = o(f, n);
          if (s.hasEagerState = !0, s.eagerState = y, He(y, f))
            return Ks(t, e, s, 0), Ut === null && Zs(), !1;
        } catch {
        } finally {
        }
      if (n = fr(t, e, s, i), n !== null)
        return we(n, t, i), Km(n, e, i), !0;
    }
    return !1;
  }
  function kr(t, e, n, i) {
    if (i = {
      lane: 2,
      revertLane: Lc(),
      gesture: null,
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, yo(t)) {
      if (e) throw Error(u(479));
    } else
      e = fr(
        t,
        n,
        i,
        2
      ), e !== null && we(e, t, 2);
  }
  function yo(t) {
    var e = t.alternate;
    return t === ht || e !== null && e === ht;
  }
  function Zm(t, e) {
    Na = uo = !0;
    var n = t.pending;
    n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
  }
  function Km(t, e, n) {
    if ((n & 4194048) !== 0) {
      var i = e.lanes;
      i &= t.pendingLanes, n |= i, e.lanes = n, kd(t, n);
    }
  }
  var go = {
    readContext: fe,
    use: fo,
    useCallback: Qt,
    useContext: Qt,
    useEffect: Qt,
    useImperativeHandle: Qt,
    useLayoutEffect: Qt,
    useInsertionEffect: Qt,
    useMemo: Qt,
    useReducer: Qt,
    useRef: Qt,
    useState: Qt,
    useDebugValue: Qt,
    useDeferredValue: Qt,
    useTransition: Qt,
    useSyncExternalStore: Qt,
    useId: Qt,
    useHostTransitionStatus: Qt,
    useFormState: Qt,
    useActionState: Qt,
    useOptimistic: Qt,
    useMemoCache: Qt,
    useCacheRefresh: Qt,
    useEffectEvent: Qt
  }, km = {
    readContext: fe,
    use: fo,
    useCallback: function(t, e) {
      return Se().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: fe,
    useEffect: Rm,
    useImperativeHandle: function(t, e, n) {
      n = n != null ? n.concat([t]) : null, mo(
        4194308,
        4,
        _m.bind(null, e, t),
        n
      );
    },
    useLayoutEffect: function(t, e) {
      return mo(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      mo(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var n = Se();
      e = e === void 0 ? null : e;
      var i = t();
      if (Fi) {
        Wn(!0);
        try {
          t();
        } finally {
          Wn(!1);
        }
      }
      return n.memoizedState = [i, e], i;
    },
    useReducer: function(t, e, n) {
      var i = Se();
      if (n !== void 0) {
        var s = n(e);
        if (Fi) {
          Wn(!0);
          try {
            n(e);
          } finally {
            Wn(!1);
          }
        }
      } else s = e;
      return i.memoizedState = i.baseState = s, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: s
      }, i.queue = t, t = t.dispatch = vS.bind(
        null,
        ht,
        t
      ), [i.memoizedState, t];
    },
    useRef: function(t) {
      var e = Se();
      return t = { current: t }, e.memoizedState = t;
    },
    useState: function(t) {
      t = Gr(t);
      var e = t.queue, n = Qm.bind(null, ht, e);
      return e.dispatch = n, [t.memoizedState, n];
    },
    useDebugValue: Xr,
    useDeferredValue: function(t, e) {
      var n = Se();
      return Qr(n, t, e);
    },
    useTransition: function() {
      var t = Gr(!1);
      return t = jm.bind(
        null,
        ht,
        t.queue,
        !0,
        !1
      ), Se().memoizedState = t, [!1, t];
    },
    useSyncExternalStore: function(t, e, n) {
      var i = ht, s = Se();
      if (pt) {
        if (n === void 0)
          throw Error(u(407));
        n = n();
      } else {
        if (n = e(), Ut === null)
          throw Error(u(349));
        (Tt & 127) !== 0 || mm(i, e, n);
      }
      s.memoizedState = n;
      var o = { value: n, getSnapshot: e };
      return s.queue = o, Rm(ym.bind(null, i, o, t), [
        t
      ]), i.flags |= 2048, _a(
        9,
        { destroy: void 0 },
        pm.bind(
          null,
          i,
          o,
          n,
          e
        ),
        null
      ), n;
    },
    useId: function() {
      var t = Se(), e = Ut.identifierPrefix;
      if (pt) {
        var n = gn, i = yn;
        n = (i & ~(1 << 32 - Be(i) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = ro++, 0 < n && (e += "H" + n.toString(32)), e += "_";
      } else
        n = fS++, e = "_" + e + "r_" + n.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Kr,
    useFormState: Mm,
    useActionState: Mm,
    useOptimistic: function(t) {
      var e = Se();
      e.memoizedState = e.baseState = t;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = n, e = kr.bind(
        null,
        ht,
        !0,
        n
      ), n.dispatch = e, [t, e];
    },
    useMemoCache: Lr,
    useCacheRefresh: function() {
      return Se().memoizedState = gS.bind(
        null,
        ht
      );
    },
    useEffectEvent: function(t) {
      var e = Se(), n = { impl: t };
      return e.memoizedState = n, function() {
        if ((zt & 2) !== 0)
          throw Error(u(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Jm = {
    readContext: fe,
    use: fo,
    useCallback: Bm,
    useContext: fe,
    useEffect: qr,
    useImperativeHandle: Um,
    useInsertionEffect: Nm,
    useLayoutEffect: Vm,
    useMemo: Lm,
    useReducer: ho,
    useRef: Om,
    useState: function() {
      return ho(Yn);
    },
    useDebugValue: Xr,
    useDeferredValue: function(t, e) {
      var n = kt();
      return Hm(
        n,
        _t.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = ho(Yn)[0], e = kt().memoizedState;
      return [
        typeof t == "boolean" ? t : Bl(t),
        e
      ];
    },
    useSyncExternalStore: hm,
    useId: qm,
    useHostTransitionStatus: Kr,
    useFormState: Cm,
    useActionState: Cm,
    useOptimistic: function(t, e) {
      var n = kt();
      return bm(n, _t, t, e);
    },
    useMemoCache: Lr,
    useCacheRefresh: Xm,
    useEffectEvent: wm
  }, bS = {
    readContext: fe,
    use: fo,
    useCallback: Bm,
    useContext: fe,
    useEffect: qr,
    useImperativeHandle: Um,
    useInsertionEffect: Nm,
    useLayoutEffect: Vm,
    useMemo: Lm,
    useReducer: jr,
    useRef: Om,
    useState: function() {
      return jr(Yn);
    },
    useDebugValue: Xr,
    useDeferredValue: function(t, e) {
      var n = kt();
      return _t === null ? Qr(n, t, e) : Hm(
        n,
        _t.memoizedState,
        t,
        e
      );
    },
    useTransition: function() {
      var t = jr(Yn)[0], e = kt().memoizedState;
      return [
        typeof t == "boolean" ? t : Bl(t),
        e
      ];
    },
    useSyncExternalStore: hm,
    useId: qm,
    useHostTransitionStatus: Kr,
    useFormState: zm,
    useActionState: zm,
    useOptimistic: function(t, e) {
      var n = kt();
      return _t !== null ? bm(n, _t, t, e) : (n.baseState = t, [t, n.queue.dispatch]);
    },
    useMemoCache: Lr,
    useCacheRefresh: Xm,
    useEffectEvent: wm
  };
  function Jr(t, e, n, i) {
    e = t.memoizedState, n = n(i, e), n = n == null ? e : Z({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
  }
  var Fr = {
    enqueueSetState: function(t, e, n) {
      t = t._reactInternals;
      var i = Xe(), s = oi(i);
      s.payload = e, n != null && (s.callback = n), e = ui(t, s, i), e !== null && (we(e, t, i), wl(e, t, i));
    },
    enqueueReplaceState: function(t, e, n) {
      t = t._reactInternals;
      var i = Xe(), s = oi(i);
      s.tag = 1, s.payload = e, n != null && (s.callback = n), e = ui(t, s, i), e !== null && (we(e, t, i), wl(e, t, i));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var n = Xe(), i = oi(n);
      i.tag = 2, e != null && (i.callback = e), e = ui(t, i, n), e !== null && (we(e, t, n), wl(e, t, n));
    }
  };
  function Fm(t, e, n, i, s, o, f) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(i, o, f) : e.prototype && e.prototype.isPureReactComponent ? !Al(n, i) || !Al(s, o) : !0;
  }
  function Pm(t, e, n, i) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, i), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, i), e.state !== t && Fr.enqueueReplaceState(e, e.state, null);
  }
  function Pi(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var i in e)
        i !== "ref" && (n[i] = e[i]);
    }
    if (t = t.defaultProps) {
      n === e && (n = Z({}, n));
      for (var s in t)
        n[s] === void 0 && (n[s] = t[s]);
    }
    return n;
  }
  function Im(t) {
    Qs(t);
  }
  function Wm(t) {
    console.error(t);
  }
  function $m(t) {
    Qs(t);
  }
  function vo(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, { componentStack: e.stack });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function tp(t, e, n) {
    try {
      var i = t.onCaughtError;
      i(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  function Pr(t, e, n) {
    return n = oi(n), n.tag = 3, n.payload = { element: null }, n.callback = function() {
      vo(t, e);
    }, n;
  }
  function ep(t) {
    return t = oi(t), t.tag = 3, t;
  }
  function np(t, e, n, i) {
    var s = n.type.getDerivedStateFromError;
    if (typeof s == "function") {
      var o = i.value;
      t.payload = function() {
        return s(o);
      }, t.callback = function() {
        tp(e, n, i);
      };
    }
    var f = n.stateNode;
    f !== null && typeof f.componentDidCatch == "function" && (t.callback = function() {
      tp(e, n, i), typeof s != "function" && (yi === null ? yi = /* @__PURE__ */ new Set([this]) : yi.add(this));
      var y = i.stack;
      this.componentDidCatch(i.value, {
        componentStack: y !== null ? y : ""
      });
    });
  }
  function SS(t, e, n, i, s) {
    if (n.flags |= 32768, i !== null && typeof i == "object" && typeof i.then == "function") {
      if (e = n.alternate, e !== null && qi(
        e,
        n,
        s,
        !0
      ), n = de.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
          case 19:
            return ve === null ? jo() : n.alternate === null && Zt === 0 && (Zt = 3), n.flags &= -257, n.flags |= 65536, n.lanes = s, i === io ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = /* @__PURE__ */ new Set([i]) : e.add(i), _c(t, i, s)), !1;
          case 22:
            return n.flags |= 65536, i === io ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([i])
            }, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = /* @__PURE__ */ new Set([i]) : n.add(i)), _c(t, i, s)), !1;
        }
        throw Error(u(435, n.tag));
      }
      return _c(t, i, s), jo(), !1;
    }
    if (pt)
      return e = de.current, e !== null ? ((e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = s, i !== yr && (t = Error(u(422), { cause: i }), Cl(ke(t, n)))) : (i !== yr && (e = Error(u(423), {
        cause: i
      }), Cl(
        ke(e, n)
      )), t = t.current.alternate, t.flags |= 65536, s &= -s, t.lanes |= s, i = ke(i, n), s = Pr(
        t.stateNode,
        i,
        s
      ), Cr(t, s), Zt !== 4 && (Zt = 2)), !1;
    var o = Error(u(520), { cause: i });
    if (o = ke(o, n), Zl === null ? Zl = [o] : Zl.push(o), Zt !== 4 && (Zt = 2), e === null) return !0;
    i = ke(i, n), n = e;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, t = s & -s, n.lanes |= t, t = Pr(n.stateNode, i, t), Cr(n, t), !1;
        case 1:
          if (e = n.type, o = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || o !== null && typeof o.componentDidCatch == "function" && (yi === null || !yi.has(o))))
            return n.flags |= 65536, s &= -s, n.lanes |= s, s = ep(s), np(
              s,
              t,
              n,
              i
            ), Cr(n, s), !1;
          break;
        case 22:
          if (n.memoizedState !== null)
            return n.flags |= 65536, !1;
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var Ir = Error(u(461)), Wt = !1;
  function ne(t, e, n, i) {
    e.child = t === null ? sm(e, null, n, i) : Ji(
      e,
      t.child,
      n,
      i
    );
  }
  function ip(t, e, n, i, s) {
    n = n.render;
    var o = e.ref;
    if ("ref" in i) {
      var f = {};
      for (var y in i)
        y !== "ref" && (f[y] = i[y]);
    } else f = i;
    return Xi(e), i = Vr(
      t,
      e,
      n,
      f,
      o,
      s
    ), y = _r(), t !== null && !Wt ? (Ur(t, e, s), qn(t, e, s)) : (pt && y && Ps(e), e.flags |= 1, ne(t, e, i, s), e.child);
  }
  function ap(t, e, n, i, s) {
    if (t === null) {
      var o = n.type;
      return typeof o == "function" && !dr(o) && o.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = o, lp(
        t,
        e,
        o,
        i,
        s
      )) : (t = Js(
        n.type,
        null,
        i,
        e,
        e.mode,
        s
      ), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (o = t.child, !lc(t, s)) {
      var f = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : Al, n(f, i) && t.ref === e.ref)
        return qn(t, e, s);
    }
    return e.flags |= 1, t = Bn(o, i), t.ref = e.ref, t.return = e, e.child = t;
  }
  function lp(t, e, n, i, s) {
    if (t !== null) {
      var o = t.memoizedProps;
      if (Al(o, i) && t.ref === e.ref)
        if (Wt = !1, e.pendingProps = i = o, lc(t, s))
          (t.flags & 131072) !== 0 && (Wt = !0);
        else
          return e.lanes = t.lanes, qn(t, e, s);
    }
    return Wr(
      t,
      e,
      n,
      i,
      s
    );
  }
  function sp(t, e, n, i) {
    var s = i.children, o = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), i.mode === "hidden") {
      if ((e.flags & 128) !== 0) {
        if (o = o !== null ? o.baseLanes | n : n, t !== null) {
          for (i = e.child = t.child, s = 0; i !== null; )
            s = s | i.lanes | i.childLanes, i = i.sibling;
          i = s & ~o;
        } else i = 0, e.child = null;
        return op(
          t,
          e,
          o,
          n,
          i
        );
      }
      if ((n & 536870912) !== 0)
        e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && eo(
          e,
          o !== null ? o.cachePool : null
        ), o !== null ? rm(e, o) : zr(), cm(e);
      else
        return i = e.lanes = 536870912, op(
          t,
          e,
          o !== null ? o.baseLanes | n : n,
          n,
          i
        );
    } else
      o !== null ? (eo(e, o.cachePool), rm(e, o), fi(), e.memoizedState = null) : (t !== null && eo(e, null), zr(), fi());
    return ne(t, e, s, n), e.child;
  }
  function Hl(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function op(t, e, n, i, s) {
    var o = Er();
    return o = o === null ? null : { parent: Pt._currentValue, pool: o }, e.memoizedState = {
      baseLanes: n,
      cachePool: o
    }, t !== null && eo(e, null), zr(), cm(e), t !== null && qi(t, e, i, !0), e.childLanes = s, null;
  }
  function bo(t, e) {
    return e = So(
      { mode: e.mode, children: e.children },
      t.mode
    ), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function up(t, e, n) {
    return Ji(e, t.child, null, n), t = bo(e, e.pendingProps), t.flags |= 2, je(e), e.memoizedState = null, t;
  }
  function TS(t, e, n) {
    var i = e.pendingProps, s = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (pt) {
        if (i.mode === "hidden")
          return t = bo(e, i), e.lanes = 536870912, t.memoizedState = { baseLanes: 0, cachePool: null }, Hl(null, t);
        if (Rr(e), (t = Ht) ? (t = _y(
          t,
          Pe
        ), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: ei !== null ? { id: yn, overflow: gn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Zh(t), n.return = e, e.child = n, se = e, Ht = null)) : t = null, t === null) throw ii(e);
        return e.lanes = 536870912, null;
      }
      return bo(e, i);
    }
    var o = t.memoizedState;
    if (o !== null) {
      var f = o.dehydrated;
      if (Rr(e), s)
        if (e.flags & 256)
          e.flags &= -257, e = up(
            t,
            e,
            n
          );
        else if (e.memoizedState !== null)
          e.child = t.child, e.flags |= 128, e = null;
        else throw Error(u(558));
      else if (Wt || qi(t, e, n, !1), s = (n & t.childLanes) !== 0, Wt || s) {
        if (ri.current === null) {
          if (i = Ut, i !== null && (f = Jd(i, n), f !== 0 && f !== o.retryLane))
            throw o.retryLane = f, Hi(t, f), we(i, t, f), Ir;
          jo();
        }
        e = up(
          t,
          e,
          n
        );
      } else
        t = o.treeContext, Ht = We(f.nextSibling), se = e, pt = !0, ni = null, Pe = !1, t !== null && Jh(e, t), e = bo(e, i), e.flags |= 134221824;
      return e;
    }
    return t = Bn(t.child, {
      mode: i.mode,
      children: i.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function Ua(t, e) {
    var n = e.ref;
    if (n === null)
      t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object")
        throw Error(u(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function Wr(t, e, n, i, s) {
    return Xi(e), n = Vr(
      t,
      e,
      n,
      i,
      void 0,
      s
    ), i = _r(), t !== null && !Wt ? (Ur(t, e, s), qn(t, e, s)) : (pt && i && Ps(e), e.flags |= 1, ne(t, e, n, s), e.child);
  }
  function rp(t, e, n, i, s, o) {
    return Xi(e), e.updateQueue = null, n = dm(
      e,
      i,
      n,
      s
    ), fm(t), i = _r(), t !== null && !Wt ? (Ur(t, e, o), qn(t, e, o)) : (pt && i && Ps(e), e.flags |= 1, ne(t, e, n, o), e.child);
  }
  function cp(t, e, n, i, s) {
    if (Xi(e), e.stateNode === null) {
      var o = Ma, f = n.contextType;
      typeof f == "object" && f !== null && (o = fe(f)), o = new n(i, o), e.memoizedState = o.state !== null && o.state !== void 0 ? o.state : null, o.updater = Fr, e.stateNode = o, o._reactInternals = e, o = e.stateNode, o.props = i, o.state = e.memoizedState, o.refs = {}, xr(e), f = n.contextType, o.context = typeof f == "object" && f !== null ? fe(f) : Ma, o.state = e.memoizedState, f = n.getDerivedStateFromProps, typeof f == "function" && (Jr(
        e,
        n,
        f,
        i
      ), o.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof o.getSnapshotBeforeUpdate == "function" || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (f = o.state, typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount(), f !== o.state && Fr.enqueueReplaceState(o, o.state, null), Vl(e, i, o, s), Nl(), o.state = e.memoizedState), typeof o.componentDidMount == "function" && (e.flags |= 4194308), i = !0;
    } else if (t === null) {
      o = e.stateNode;
      var y = e.memoizedProps, T = Pi(n, y);
      o.props = T;
      var C = o.context, R = n.contextType;
      f = Ma, typeof R == "object" && R !== null && (f = fe(R));
      var B = n.getDerivedStateFromProps;
      R = typeof B == "function" || typeof o.getSnapshotBeforeUpdate == "function", y = e.pendingProps !== y, R || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (y || C !== f) && Pm(
        e,
        o,
        i,
        f
      ), si = !1;
      var x = e.memoizedState;
      o.state = x, Vl(e, i, o, s), Nl(), C = e.memoizedState, y || x !== C || si ? (typeof B == "function" && (Jr(
        e,
        n,
        B,
        i
      ), C = e.memoizedState), (T = si || Fm(
        e,
        n,
        T,
        i,
        x,
        C,
        f
      )) ? (R || typeof o.UNSAFE_componentWillMount != "function" && typeof o.componentWillMount != "function" || (typeof o.componentWillMount == "function" && o.componentWillMount(), typeof o.UNSAFE_componentWillMount == "function" && o.UNSAFE_componentWillMount()), typeof o.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = i, e.memoizedState = C), o.props = i, o.state = C, o.context = f, i = T) : (typeof o.componentDidMount == "function" && (e.flags |= 4194308), i = !1);
    } else {
      o = e.stateNode, Mr(t, e), f = e.memoizedProps, R = Pi(n, f), o.props = R, B = e.pendingProps, x = o.context, C = n.contextType, T = Ma, typeof C == "object" && C !== null && (T = fe(C)), y = n.getDerivedStateFromProps, (C = typeof y == "function" || typeof o.getSnapshotBeforeUpdate == "function") || typeof o.UNSAFE_componentWillReceiveProps != "function" && typeof o.componentWillReceiveProps != "function" || (f !== B || x !== T) && Pm(
        e,
        o,
        i,
        T
      ), si = !1, x = e.memoizedState, o.state = x, Vl(e, i, o, s), Nl();
      var O = e.memoizedState;
      f !== B || x !== O || si || t !== null && t.dependencies !== null && $s(t.dependencies) ? (typeof y == "function" && (Jr(
        e,
        n,
        y,
        i
      ), O = e.memoizedState), (R = si || Fm(
        e,
        n,
        R,
        i,
        x,
        O,
        T
      ) || t !== null && t.dependencies !== null && $s(t.dependencies)) ? (C || typeof o.UNSAFE_componentWillUpdate != "function" && typeof o.componentWillUpdate != "function" || (typeof o.componentWillUpdate == "function" && o.componentWillUpdate(i, O, T), typeof o.UNSAFE_componentWillUpdate == "function" && o.UNSAFE_componentWillUpdate(
        i,
        O,
        T
      )), typeof o.componentDidUpdate == "function" && (e.flags |= 4), typeof o.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof o.componentDidUpdate != "function" || f === t.memoizedProps && x === t.memoizedState || (e.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || f === t.memoizedProps && x === t.memoizedState || (e.flags |= 1024), e.memoizedProps = i, e.memoizedState = O), o.props = i, o.state = O, o.context = T, i = R) : (typeof o.componentDidUpdate != "function" || f === t.memoizedProps && x === t.memoizedState || (e.flags |= 4), typeof o.getSnapshotBeforeUpdate != "function" || f === t.memoizedProps && x === t.memoizedState || (e.flags |= 1024), i = !1);
    }
    return o = i, Ua(t, e), i = (e.flags & 128) !== 0, o || i ? (o = e.stateNode, n = i && typeof n.getDerivedStateFromError != "function" ? null : o.render(), e.flags |= 1, t !== null && i ? (e.child = Ji(
      e,
      t.child,
      null,
      s
    ), e.child = Ji(
      e,
      null,
      n,
      s
    )) : ne(t, e, n, s), e.memoizedState = o.state, t = e.child) : t = qn(
      t,
      e,
      s
    ), t;
  }
  function fp(t, e, n, i) {
    return Gi(), e.flags |= 256, ne(t, e, n, i), e.child;
  }
  var $r = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function tc(t) {
    return { baseLanes: t, cachePool: tm() };
  }
  function ec(t, e, n) {
    return t = t !== null ? t.childLanes & ~n : 0, e && (t |= qe), t;
  }
  function dp(t, e, n) {
    var i = e.pendingProps, s = !1, o = (e.flags & 128) !== 0, f;
    if ((f = o) || (f = t !== null && t.memoizedState === null ? !1 : (he.current & 2) !== 0), f && (s = !0, e.flags &= -129), f = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (pt) {
        if (s ? ci(e) : fi(), (t = Ht) ? (t = _y(
          t,
          Pe
        ), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: ei !== null ? { id: yn, overflow: gn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = Zh(t), n.return = e, e.child = n, se = e, Ht = null)) : t = null, t === null) throw ii(e);
        return tf(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      return o = i.children, i = i.fallback, s ? (fi(), s = e.mode, o = So(
        { mode: "hidden", children: o },
        s
      ), i = ji(
        i,
        s,
        n,
        null
      ), o.return = e, i.return = e, o.sibling = i, e.child = o, i = e.child, i.memoizedState = tc(n), i.childLanes = ec(
        t,
        f,
        n
      ), e.memoizedState = $r, Hl(null, i)) : (ci(e), nc(e, o));
    }
    var y = t.memoizedState;
    if (y !== null) {
      var T = y.dehydrated;
      if (T !== null)
        return ES(
          t,
          e,
          o,
          f,
          i,
          T,
          y,
          n
        );
    }
    return s ? (fi(), s = i.fallback, o = e.mode, y = t.child, T = y.sibling, i = Bn(y, {
      mode: "hidden",
      children: i.children
    }), i.subtreeFlags = y.subtreeFlags & 1206910976, T !== null ? s = Bn(T, s) : (s = ji(
      s,
      o,
      n,
      null
    ), s.flags |= 2), s.return = e, i.return = e, i.sibling = s, e.child = i, Hl(null, i), i = e.child, s = t.child.memoizedState, s === null ? s = tc(n) : (o = s.cachePool, o !== null ? (y = Pt._currentValue, o = o.parent !== y ? { parent: y, pool: y } : o) : o = tm(), s = {
      baseLanes: s.baseLanes | n,
      cachePool: o
    }), i.memoizedState = s, i.childLanes = ec(
      t,
      f,
      n
    ), e.memoizedState = $r, Hl(t.child, i)) : (ci(e), n = t.child, t = n.sibling, n = Bn(n, {
      mode: "visible",
      children: i.children
    }), n.return = e, n.sibling = null, t !== null && (f = e.deletions, f === null ? (e.deletions = [t], e.flags |= 16) : f.push(t)), e.child = n, e.memoizedState = null, n);
  }
  function nc(t, e) {
    return e = So(
      { mode: "visible", children: e },
      t.mode
    ), e.return = t, t.child = e;
  }
  function So(t, e) {
    return t = De(22, t, null, e), t.lanes = 0, t;
  }
  function To(t, e, n) {
    return Ji(e, t.child, null, n), t = nc(
      e,
      e.pendingProps.children
    ), t.flags |= 2, e.memoizedState = null, t;
  }
  function ES(t, e, n, i, s, o, f, y) {
    if (n)
      return e.flags & 256 ? (ci(e), e.flags &= -257, To(
        t,
        e,
        y
      )) : e.memoizedState !== null ? (fi(), e.child = t.child, e.flags |= 128, null) : (fi(), o = s.fallback, f = e.mode, s = So(
        { mode: "visible", children: s.children },
        f
      ), o = ji(
        o,
        f,
        y,
        null
      ), o.flags |= 2, s.return = e, o.return = e, s.sibling = o, e.child = s, Ji(e, t.child, null, y), s = e.child, s.memoizedState = tc(y), s.childLanes = ec(
        t,
        i,
        y
      ), e.memoizedState = $r, Hl(null, s));
    if (ci(e), tf(o)) {
      if (i = o.nextSibling && o.nextSibling.dataset, i) var T = i.dgst;
      return i = T, i !== "" && (s = Error(u(419)), s.stack = "", s.digest = i, Cl({ value: s, source: null, stack: null })), To(
        t,
        e,
        y
      );
    }
    if (Wt || qi(t, e, y, !1), i = (y & t.childLanes) !== 0, Wt || i) {
      if (ri.current !== null)
        return To(
          t,
          e,
          y
        );
      if (i = Ut, i !== null && (s = Jd(
        i,
        y
      ), s !== 0 && s !== f.retryLane))
        throw f.retryLane = s, Hi(t, s), we(i, t, s), Ir;
      return $c(o) || jo(), To(
        t,
        e,
        y
      );
    }
    return $c(o) ? (e.flags |= 192, e.child = t.child, null) : (t = f.treeContext, Ht = We(o.nextSibling), se = e, pt = !0, ni = null, Pe = !1, t !== null && Jh(e, t), e = nc(
      e,
      s.children
    ), e.flags |= 134221824, e);
  }
  function hp(t, e, n) {
    t.lanes |= e;
    var i = t.alternate;
    i !== null && (i.lanes |= e), Ws(t.return, e, n);
  }
  function mp(t) {
    for (var e = null; t !== null; ) {
      var n = t.alternate;
      n !== null && oo(n) === null && (e = t), t = t.sibling;
    }
    return e;
  }
  function Eo(t, e, n, i, s, o) {
    var f = t.memoizedState;
    f === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: i,
      tail: n,
      tailMode: s,
      treeForkCount: o
    } : (f.isBackwards = e, f.rendering = null, f.renderingStartTime = 0, f.last = i, f.tail = n, f.tailMode = s, f.treeForkCount = o);
  }
  function ic(t) {
    var e = t.child;
    for (t.child = null; e !== null; ) {
      var n = e.sibling;
      e.sibling = t.child, t.child = e, e = n;
    }
  }
  function ac(t, e, n) {
    var i = e.pendingProps, s = i.revealOrder, o = i.tail;
    i = i.children;
    var f = he.current;
    if (e.flags & 128)
      return _l(e, f), null;
    var y = (f & 2) !== 0;
    if (y ? (f = f & 1 | 2, e.flags |= 128) : f &= 1, _l(e, f), s === "backwards" && t !== null ? (ic(t), ne(t, e, i, n), ic(t)) : ne(t, e, i, n), i = pt ? Ml : 0, !y && t !== null && (t.flags & 128) !== 0)
      t: for (t = e.child; t !== null; ) {
        if (t.tag === 13)
          t.memoizedState !== null && hp(t, n, e);
        else if (t.tag === 19)
          hp(t, n, e);
        else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e) break t;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            break t;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    switch (s) {
      case "backwards":
        n = mp(e.child), n === null ? (s = e.child, e.child = null) : (s = n.sibling, n.sibling = null, ic(e)), Eo(
          e,
          !0,
          s,
          null,
          o,
          i
        );
        break;
      case "unstable_legacy-backwards":
        for (n = null, s = e.child, e.child = null; s !== null; ) {
          if (t = s.alternate, t !== null && oo(t) === null) {
            e.child = s;
            break;
          }
          t = s.sibling, s.sibling = n, n = s, s = t;
        }
        Eo(
          e,
          !0,
          n,
          null,
          o,
          i
        );
        break;
      case "together":
        Eo(
          e,
          !1,
          null,
          null,
          void 0,
          i
        );
        break;
      case "independent":
        e.memoizedState = null;
        break;
      default:
        n = mp(e.child), n === null ? (s = e.child, e.child = null) : (s = n.sibling, n.sibling = null), Eo(
          e,
          !1,
          s,
          n,
          o,
          i
        );
    }
    return e.child;
  }
  function pp(t, e, n) {
    var i = e.pendingProps;
    return ai(e, e.type, i.value), ne(t, e, i.children, n), e.child;
  }
  function qn(t, e, n) {
    if (t !== null && (e.dependencies = t.dependencies), pi |= e.lanes, (n & e.childLanes) === 0)
      if (t !== null) {
        if (qi(
          t,
          e,
          n,
          !1
        ), (n & e.childLanes) === 0)
          return null;
      } else return null;
    if (t !== null && e.child !== t.child)
      throw Error(u(153));
    if (e.child !== null) {
      for (t = e.child, n = Bn(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; )
        t = t.sibling, n = n.sibling = Bn(t, t.pendingProps), n.return = e;
      n.sibling = null;
    }
    return e.child;
  }
  function lc(t, e) {
    return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && $s(t)));
  }
  function AS(t, e, n) {
    switch (e.tag) {
      case 3:
        Cs(e, e.stateNode.containerInfo), ai(e, Pt, t.memoizedState.cache), Gi();
        break;
      case 27:
      case 5:
        Nu(e);
        break;
      case 4:
        Cs(e, e.stateNode.containerInfo);
        break;
      case 10:
        ai(
          e,
          e.type,
          e.memoizedProps.value
        );
        break;
      case 31:
        if (e.memoizedState !== null)
          return e.flags |= 128, Rr(e), null;
        break;
      case 13:
        var i = e.memoizedState;
        if (i !== null) {
          if (i.dehydrated !== null)
            return ci(e), e.flags |= 128, null;
          i = qi(
            t,
            e,
            n,
            !1
          );
          var s = e.child.childLanes;
          return i || (n & s) !== 0 ? dp(t, e, n) : (ci(e), t = qn(
            t,
            e,
            n
          ), t !== null ? t.sibling : null);
        }
        ci(e);
        break;
      case 19:
        if (e.flags & 128)
          return ac(
            t,
            e,
            n
          );
        if (s = (t.flags & 128) !== 0, i = (n & e.childLanes) !== 0, i || (qi(
          t,
          e,
          n,
          !1
        ), i = (n & e.childLanes) !== 0), s) {
          if (i)
            return ac(
              t,
              e,
              n
            );
          e.flags |= 128;
        }
        if (s = e.memoizedState, s !== null && (s.rendering = null, s.tail = null, s.lastEffect = null), _l(e, he.current), i) break;
        return null;
      case 22:
        return e.lanes = 0, sp(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        ai(e, Pt, t.memoizedState.cache);
    }
    return qn(t, e, n);
  }
  function yp(t, e, n) {
    if (t !== null)
      if (t.memoizedProps !== e.pendingProps)
        Wt = !0;
      else {
        if (!lc(t, n) && (e.flags & 128) === 0)
          return Wt = !1, AS(
            t,
            e,
            n
          );
        Wt = (t.flags & 131072) !== 0;
      }
    else
      Wt = !1, pt && (e.flags & 1048576) !== 0 && kh(e, Ml, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var i = e.pendingProps;
          if (t = Ki(e.elementType), e.type = t, typeof t == "function")
            dr(t) ? (i = Pi(t, i), e.tag = 1, e = cp(
              null,
              e,
              t,
              i,
              n
            )) : (e.tag = 0, e = Wr(
              null,
              e,
              t,
              i,
              n
            ));
          else {
            if (t != null) {
              var s = t.$$typeof;
              if (s === G) {
                e.tag = 11, e = ip(
                  null,
                  e,
                  t,
                  i,
                  n
                );
                break t;
              } else if (s === ft) {
                e.tag = 14, e = ap(
                  null,
                  e,
                  t,
                  i,
                  n
                );
                break t;
              } else if (s === At) {
                e.tag = 10, e.type = t, e = pp(
                  null,
                  e,
                  n
                );
                break t;
              }
            }
            throw e = ot(t) || t, Error(u(306, e, ""));
          }
        }
        return e;
      case 0:
        return Wr(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 1:
        return i = e.type, s = Pi(
          i,
          e.pendingProps
        ), cp(
          t,
          e,
          i,
          s,
          n
        );
      case 3:
        t: {
          if (Cs(
            e,
            e.stateNode.containerInfo
          ), t === null) throw Error(u(387));
          i = e.pendingProps;
          var o = e.memoizedState;
          s = o.element, Mr(t, e), Vl(e, i, null, n);
          var f = e.memoizedState;
          if (i = f.cache, ai(e, Pt, i), i !== o.cache && br(
            e,
            [Pt],
            n,
            !0
          ), Nl(), i = f.element, o.isDehydrated)
            if (o = {
              element: i,
              isDehydrated: !1,
              cache: f.cache
            }, e.updateQueue.baseState = o, e.memoizedState = o, e.flags & 256) {
              e = fp(
                t,
                e,
                i,
                n
              );
              break t;
            } else if (i !== s) {
              s = ke(
                Error(u(424)),
                e
              ), Cl(s), e = fp(
                t,
                e,
                i,
                n
              );
              break t;
            } else {
              switch (t = e.stateNode.containerInfo, t.nodeType) {
                case 9:
                  t = t.body;
                  break;
                default:
                  t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
              }
              for (Ht = We(t.firstChild), se = e, pt = !0, ni = null, Pe = !0, n = sm(
                e,
                null,
                i,
                n
              ), e.child = n; n; )
                n.flags = n.flags & -3 | 134221824, n = n.sibling;
            }
          else {
            if (Gi(), i === s) {
              e = qn(
                t,
                e,
                n
              );
              break t;
            }
            ne(t, e, i, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return Ua(t, e), t === null ? (n = Yy(
          e.type,
          null,
          e.pendingProps,
          null
        )) ? e.memoizedState = n : pt || (e.stateNode = Sy(
          e.type,
          e.pendingProps,
          Pn.current,
          e
        )) : e.memoizedState = Yy(
          e.type,
          t.memoizedProps,
          e.pendingProps,
          t.memoizedState
        ), null;
      case 27:
        return Nu(e), t === null && pt && (i = e.stateNode = Ly(
          e.type,
          e.pendingProps,
          Pn.current
        ), se = e, Pe = !0, s = Ht, bi(e.type) ? (ef = s, Ht = We(i.firstChild)) : Ht = s), ne(
          t,
          e,
          e.pendingProps.children,
          n
        ), Ua(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && pt && ((s = i = Ht) && (i = gT(
          i,
          e.type,
          e.pendingProps,
          Pe
        ), i !== null ? (e.stateNode = i, se = e, Ht = We(i.firstChild), Pe = !1, s = !0) : s = !1), s || ii(e)), Nu(e), s = e.type, o = e.pendingProps, f = t !== null ? t.memoizedProps : null, i = o.children, Kc(s, o) ? i = null : f !== null && Kc(s, f) && (e.flags |= 32), e.memoizedState !== null && (s = Vr(
          t,
          e,
          dS,
          null,
          null,
          n
        ), $a._currentValue = s), Ua(t, e), ne(t, e, i, n), e.child;
      case 6:
        return t === null && pt && ((t = n = Ht) && (n = vT(
          n,
          e.pendingProps,
          Pe
        ), n !== null ? (e.stateNode = n, se = e, Ht = null, t = !0) : t = !1), t || ii(e)), null;
      case 13:
        return dp(t, e, n);
      case 4:
        return Cs(
          e,
          e.stateNode.containerInfo
        ), i = e.pendingProps, t === null ? e.child = Ji(
          e,
          null,
          i,
          n
        ) : ne(t, e, i, n), e.child;
      case 11:
        return ip(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 7:
        return i = e.pendingProps, Ua(t, e), ne(t, e, i, n), e.child;
      case 8:
        return ne(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 12:
        return ne(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 10:
        return pp(t, e, n);
      case 9:
        return s = e.type._context, i = e.pendingProps.children, Xi(e), s = fe(s), i = i(s), e.flags |= 1, ne(t, e, i, n), e.child;
      case 14:
        return ap(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 15:
        return lp(
          t,
          e,
          e.type,
          e.pendingProps,
          n
        );
      case 19:
        return ac(t, e, n);
      case 31:
        return TS(t, e, n);
      case 22:
        return sp(
          t,
          e,
          n,
          e.pendingProps
        );
      case 24:
        return Xi(e), i = fe(Pt), t === null ? (s = Er(), s === null && (s = Ut, o = Sr(), s.pooledCache = o, o.refCount++, o !== null && (s.pooledCacheLanes |= n), s = o), e.memoizedState = { parent: i, cache: s }, xr(e), ai(e, Pt, s)) : ((t.lanes & n) !== 0 && (Mr(t, e), Vl(e, null, null, n), Nl()), s = t.memoizedState, o = e.memoizedState, s.parent !== i ? (s = { parent: i, cache: i }, e.memoizedState = s, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = s), ai(e, Pt, i)) : (i = o.cache, ai(e, Pt, i), i !== s.cache && br(
          e,
          [Pt],
          n,
          !0
        ))), ne(
          t,
          e,
          e.pendingProps.children,
          n
        ), e.child;
      case 30:
        return e.stateNode === null && (e.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), i = e.pendingProps, i.name != null && i.name !== "auto" ? e.flags |= t === null ? 18882560 : 18874368 : pt && Ps(e), t !== null && t.memoizedProps.name !== i.name ? e.flags |= 4194816 : Ua(t, e), ne(t, e, i.children, n), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(u(156, e.tag));
  }
  function Xn(t) {
    t.flags |= 4;
  }
  function sc(t, e, n, i, s) {
    var o;
    if ((o = (t.mode & 32) !== 0) && (o = n === null ? Zy(e, i) : Zy(e, i) && (i.src !== n.src || i.srcSet !== n.srcSet)), o) {
      if (t.flags |= 16777216, (s & 335544128) === s)
        if (t.stateNode.complete) t.flags |= 8192;
        else if (Ip()) t.flags |= 8192;
        else
          throw ki = io, Ar;
    } else t.flags &= -16777217;
  }
  function gp(t, e) {
    if (e.type !== "stylesheet" || (e.state.loading & 4) !== 0)
      t.flags &= -16777217;
    else if (t.flags |= 16777216, !Ky(e))
      if (Ip()) t.flags |= 8192;
      else
        throw ki = io, Ar;
  }
  function Ao(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Zd() : 536870912, t.lanes |= e, Ga |= e);
  }
  function jl(t, e) {
    if (!pt)
      switch (t.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var n = t.tail, i = null; n !== null; )
            n.alternate !== null && (i = n), n = n.sibling;
          i === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : i.sibling = null;
          break;
        default:
          for (e = t.tail, n = null; e !== null; )
            e.alternate !== null && (n = e), e = e.sibling;
          n === null ? t.tail = null : n.sibling = null;
      }
  }
  function jt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, n = 0, i = 0;
    if (e)
      for (var s = t.child; s !== null; )
        n |= s.lanes | s.childLanes, i |= s.subtreeFlags & 1206910976, i |= s.flags & 1206910976, s.return = t, s = s.sibling;
    else
      for (s = t.child; s !== null; )
        n |= s.lanes | s.childLanes, i |= s.subtreeFlags, i |= s.flags, s.return = t, s = s.sibling;
    return t.subtreeFlags |= i, t.childLanes = n, e;
  }
  function xS(t, e, n) {
    var i = e.pendingProps;
    switch (pr(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return jt(e), null;
      case 1:
        return jt(e), null;
      case 3:
        return n = e.stateNode, i = null, t !== null && (i = t.memoizedState.cache), e.memoizedState.cache !== i && (e.flags |= 2048), jn(Pt), da(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (za(e) ? Xn(e) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, gr())), jt(e), null;
      case 26:
        var s = e.type, o = e.memoizedState;
        return t === null ? (Xn(e), o !== null ? (jt(e), gp(e, o)) : (jt(e), sc(
          e,
          s,
          null,
          i,
          n
        ))) : o ? o !== t.memoizedState ? (Xn(e), jt(e), gp(e, o)) : (jt(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== i && Xn(e), jt(e), sc(
          e,
          s,
          t,
          i,
          n
        )), null;
      case 27:
        if (Ds(e), n = Pn.current, s = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== i && Xn(e);
        else {
          if (!i) {
            if (e.stateNode === null)
              throw Error(u(166));
            return jt(e), e.subtreeFlags &= -33554433, null;
          }
          t = mn.current, za(e) ? Fh(e) : (t = Ly(s, i, n), e.stateNode = t, Xn(e));
        }
        return jt(e), e.subtreeFlags &= -33554433, null;
      case 5:
        if (Ds(e), s = e.type, t !== null && e.stateNode != null)
          t.memoizedProps !== i && Xn(e);
        else {
          if (!i) {
            if (e.stateNode === null)
              throw Error(u(166));
            return jt(e), e.subtreeFlags &= -33554433, null;
          }
          if (o = mn.current, za(e))
            Fh(e);
          else {
            var f = Pl(
              Pn.current
            );
            switch (o) {
              case 1:
                o = f.createElementNS(
                  "http://www.w3.org/2000/svg",
                  s
                );
                break;
              case 2:
                o = f.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  s
                );
                break;
              default:
                switch (s) {
                  case "svg":
                    o = f.createElementNS(
                      "http://www.w3.org/2000/svg",
                      s
                    );
                    break;
                  case "math":
                    o = f.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      s
                    );
                    break;
                  case "script":
                    o = f.createElement("div"), o.innerHTML = "<script><\/script>", o = o.removeChild(
                      o.firstChild
                    );
                    break;
                  case "select":
                    o = typeof i.is == "string" ? f.createElement("select", {
                      is: i.is
                    }) : f.createElement("select"), i.multiple ? o.multiple = !0 : i.size && (o.size = i.size);
                    break;
                  default:
                    o = typeof i.is == "string" ? f.createElement(s, { is: i.is }) : f.createElement(s);
                }
            }
            o[ce] = e, o[Ce] = i;
            t: for (f = e.child; f !== null; ) {
              if (f.tag === 5 || f.tag === 6)
                o.appendChild(f.stateNode);
              else if (f.tag !== 4 && f.tag !== 27 && f.child !== null) {
                f.child.return = f, f = f.child;
                continue;
              }
              if (f === e) break t;
              for (; f.sibling === null; ) {
                if (f.return === null || f.return === e)
                  break t;
                f = f.return;
              }
              f.sibling.return = f.return, f = f.sibling;
            }
            e.stateNode = o;
            t: switch (pe(o, s, i), s) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                i = !!i.autoFocus;
                break t;
              case "img":
                i = !0;
                break t;
              default:
                i = !1;
            }
            i && Xn(e);
          }
        }
        return jt(e), e.subtreeFlags &= -33554433, sc(
          e,
          e.type,
          t === null ? null : t.memoizedProps,
          e.pendingProps,
          n
        ), null;
      case 6:
        if (t && e.stateNode != null)
          t.memoizedProps !== i && Xn(e);
        else {
          if (typeof i != "string" && e.stateNode === null)
            throw Error(u(166));
          if (t = Pn.current, za(e)) {
            if (t = e.stateNode, n = e.memoizedProps, i = null, s = se, s !== null)
              switch (s.tag) {
                case 27:
                case 5:
                  i = s.memoizedProps;
              }
            t[ce] = e, t = !!(t.nodeValue === n || i !== null && i.suppressHydrationWarning === !0 || yy(t.nodeValue, n)), t || ii(e, !0);
          } else
            t = Pl(t).createTextNode(
              i
            ), t[ce] = e, e.stateNode = t;
        }
        return jt(e), null;
      case 31:
        if (n = e.memoizedState, t === null || t.memoizedState !== null) {
          if (i = za(e), n !== null) {
            if (t === null) {
              if (!i) throw Error(u(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(u(557));
              t[ce] = e;
            } else
              Gi(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            jt(e), t = !1;
          } else
            n = gr(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = !0;
          if (!t)
            return e.flags & 256 ? (je(e), e) : (je(e), null);
          if ((e.flags & 128) !== 0)
            throw Error(u(558));
        }
        return jt(e), null;
      case 13:
        if (i = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (s = za(e), i !== null && i.dehydrated !== null) {
            if (t === null) {
              if (!s) throw Error(u(318));
              if (s = e.memoizedState, s = s !== null ? s.dehydrated : null, !s) throw Error(u(317));
              s[ce] = e;
            } else
              Gi(), (e.flags & 128) === 0 && (e.memoizedState = null), e.flags |= 4;
            jt(e), s = !1;
          } else
            s = gr(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = s), s = !0;
          if (!s)
            return e.flags & 256 ? (je(e), e) : (je(e), null);
        }
        return je(e), (e.flags & 128) !== 0 ? (e.lanes = n, e) : (n = i !== null, t = t !== null && t.memoizedState !== null, n && (i = e.child, s = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (s = i.alternate.memoizedState.cachePool.pool), o = null, i.memoizedState !== null && i.memoizedState.cachePool !== null && (o = i.memoizedState.cachePool.pool), o !== s && (i.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), Ao(e, e.updateQueue), jt(e), null);
      case 4:
        return da(), t === null && Yc(e.stateNode.containerInfo), e.flags |= 67108864, jt(e), null;
      case 10:
        return jn(e.type), jt(e), null;
      case 19:
        if (wr(e), i = e.memoizedState, i === null) return jt(e), null;
        if (s = (e.flags & 128) !== 0, o = i.rendering, o === null)
          if (s) jl(i, !1);
          else {
            if (Zt !== 0 || t !== null && (t.flags & 128) !== 0)
              for (t = e.child; t !== null; ) {
                if (o = oo(t), o !== null) {
                  for (e.flags |= 128, jl(i, !1), t = o.updateQueue, e.updateQueue = t, Ao(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null; )
                    Qh(n, t), n = n.sibling;
                  return _l(
                    e,
                    he.current & 1 | 2
                  ), pt && Ln(e, i.treeForkCount), e.child;
                }
                t = t.sibling;
              }
            i.tail !== null && _e() > Uo && (e.flags |= 128, s = !0, jl(i, !1), e.lanes = 4194304);
          }
        else {
          if (!s)
            if (t = oo(o), t !== null) {
              if (e.flags |= 128, s = !0, t = t.updateQueue, e.updateQueue = t, Ao(e, t), jl(i, !0), i.tail === null && i.tailMode !== "collapsed" && i.tailMode !== "visible" && !o.alternate && !pt)
                return jt(e), null;
            } else
              2 * _e() - i.renderingStartTime > Uo && n !== 536870912 && (e.flags |= 128, s = !0, jl(i, !1), e.lanes = 4194304);
          i.isBackwards ? (o.sibling = e.child, e.child = o) : (t = i.last, t !== null ? t.sibling = o : e.child = o, i.last = o);
        }
        if (i.tail !== null) {
          t = i.tail;
          t: {
            for (n = t; n !== null; ) {
              if (n.alternate !== null) {
                n = !1;
                break t;
              }
              n = n.sibling;
            }
            n = !0;
          }
          return i.rendering = t, i.tail = t.sibling, i.renderingStartTime = _e(), t.sibling = null, o = he.current, o = s ? o & 1 | 2 : o & 1, i.tailMode === "visible" || i.tailMode === "collapsed" || !n || pt ? _l(e, o) : (n = o, Lt(de, e), Lt(he, n), ve === null && (ve = e)), pt && Ln(e, i.treeForkCount), t;
        }
        return jt(e), null;
      case 22:
      case 23:
        return je(e), Or(), i = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== i && (e.flags |= 8192) : i && (e.flags |= 8192), i ? (n & 536870912) !== 0 && (e.flags & 128) === 0 && (jt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : jt(e), n = e.updateQueue, n !== null && Ao(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), i = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (i = e.memoizedState.cachePool.pool), i !== n && (e.flags |= 2048), t !== null && re(Zi), null;
      case 24:
        return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), jn(Pt), jt(e), null;
      case 25:
        return null;
      case 30:
        return e.flags |= 33554432, jt(e), null;
    }
    throw Error(u(156, e.tag));
  }
  function MS(t, e) {
    switch (pr(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return jn(Pt), da(), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return Ds(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (je(e), e.alternate === null)
            throw Error(u(340));
          Gi();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (je(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null)
            throw Error(u(340));
          Gi();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return wr(e), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, t = e.memoizedState, t !== null && (t.rendering = null, t.tail = null), e.flags |= 4, e) : null;
      case 4:
        return da(), null;
      case 10:
        return jn(e.type), null;
      case 22:
      case 23:
        return je(e), Or(), t !== null && re(Zi), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return jn(Pt), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function vp(t, e) {
    switch (pr(e), e.tag) {
      case 3:
        jn(Pt), da();
        break;
      case 26:
      case 27:
      case 5:
        Ds(e);
        break;
      case 4:
        da();
        break;
      case 31:
        e.memoizedState !== null && je(e);
        break;
      case 13:
        je(e);
        break;
      case 19:
        wr(e);
        break;
      case 10:
        jn(e.type);
        break;
      case 22:
      case 23:
        je(e), Or(), t !== null && re(Zi);
        break;
      case 24:
        jn(Pt);
    }
  }
  function Gl(t, e) {
    try {
      var n = e.updateQueue, i = n !== null ? n.lastEffect : null;
      if (i !== null) {
        var s = i.next;
        n = s;
        do {
          if ((n.tag & t) === t) {
            i = void 0;
            var o = n.create, f = n.inst;
            i = o(), f.destroy = i;
          }
          n = n.next;
        } while (n !== s);
      }
    } catch (y) {
      wt(e, e.return, y);
    }
  }
  function di(t, e, n) {
    try {
      var i = e.updateQueue, s = i !== null ? i.lastEffect : null;
      if (s !== null) {
        var o = s.next;
        i = o;
        do {
          if ((i.tag & t) === t) {
            var f = i.inst, y = f.destroy;
            if (y !== void 0) {
              f.destroy = void 0, s = e;
              var T = n, C = y;
              try {
                C();
              } catch (R) {
                wt(
                  s,
                  T,
                  R
                );
              }
            }
          }
          i = i.next;
        } while (i !== o);
      }
    } catch (R) {
      wt(e, e.return, R);
    }
  }
  function bp(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        um(e, n);
      } catch (i) {
        wt(t, t.return, i);
      }
    }
  }
  function Sp(t, e, n) {
    n.props = Pi(
      t.type,
      t.memoizedProps
    ), n.state = t.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (i) {
      wt(t, e, i);
    }
  }
  function vn(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var i = t.stateNode;
            break;
          case 30:
            var s = t.stateNode, o = _n(t.memoizedProps, s);
            (s.ref === null || s.ref.name !== o) && (s.ref = Dy(o)), i = s.ref;
            break;
          case 7:
            if (t.stateNode === null) {
              var f = new Qe(t);
              p(
                t.child,
                !1,
                pT,
                f,
                void 0,
                void 0
              ), t.stateNode = f;
            }
            i = t.stateNode;
            break;
          default:
            i = t.stateNode;
        }
        typeof n == "function" ? t.refCleanup = n(i) : n.current = i;
      }
    } catch (y) {
      wt(t, e, y);
    }
  }
  function me(t, e) {
    var n = t.ref, i = t.refCleanup;
    if (n !== null)
      if (typeof i == "function")
        try {
          i();
        } catch (s) {
          wt(t, e, s);
        } finally {
          t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
        }
      else if (typeof n == "function")
        try {
          n(null);
        } catch (s) {
          wt(t, e, s);
        }
      else n.current = null;
  }
  function xo(t, e) {
    if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && e !== null)
      for (var n = 0; n < e.length; n++)
        Vy(
          t.stateNode,
          e[n]
        );
  }
  function Tp(t) {
    for (var e = t.return; e !== null && (uc(e) && Vy(t.stateNode, e.stateNode), !oc(e)); )
      e = e.return;
  }
  function Yl(t) {
    for (var e = t.return; e !== null && (uc(e) && yT(t.stateNode, e.stateNode), !oc(e)); )
      e = e.return;
  }
  function oc(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 27;
  }
  function uc(t) {
    return t && t.tag === 7 && t.stateNode !== null;
  }
  function rc(t) {
    var e = t.type, n = t.memoizedProps, i = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && i.focus();
          break t;
        case "img":
          n.src ? i.src = n.src : n.srcSet && (i.srcset = n.srcSet);
      }
    } catch (s) {
      wt(t, t.return, s);
    }
  }
  function cc(t, e, n) {
    try {
      var i = t.stateNode;
      IS(i, t.type, n, e), i[Ce] = e;
    } catch (s) {
      wt(t, t.return, s);
    }
  }
  function Ep(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && bi(t.type) || t.tag === 4;
  }
  function fc(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || Ep(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && bi(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function dc(t, e, n, i) {
    var s = t.tag;
    if (s === 5 || s === 6)
      s = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(s, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(s), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = pn)), xo(t, i), Dt = !0;
    else if (s !== 4 && (s === 27 && (xo(t, i), i = null, bi(t.type) && (n = t.stateNode, e = null)), t = t.child, t !== null))
      for (dc(
        t,
        e,
        n,
        i
      ), t = t.sibling; t !== null; )
        dc(
          t,
          e,
          n,
          i
        ), t = t.sibling;
  }
  function Mo(t, e, n, i) {
    var s = t.tag;
    if (s === 5 || s === 6)
      s = t.stateNode, e ? n.insertBefore(s, e) : n.appendChild(s), xo(t, i), Dt = !0;
    else if (s !== 4 && (s === 27 && (xo(t, i), i = null, bi(t.type) && (n = t.stateNode)), t = t.child, t !== null))
      for (Mo(
        t,
        e,
        n,
        i
      ), t = t.sibling; t !== null; )
        Mo(
          t,
          e,
          n,
          i
        ), t = t.sibling;
  }
  function Ap(t) {
    var e = t.stateNode, n = t.memoizedProps;
    try {
      for (var i = t.type, s = e.attributes; s.length; )
        e.removeAttributeNode(s[0]);
      pe(e, i, n), e[ce] = t, e[Ce] = n;
    } catch (o) {
      wt(t, t.return, o);
    }
  }
  var Co = !1, Ge = null;
  function xp(t) {
    (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (Co = !0);
  }
  var bn = null;
  function Mp() {
    var t = bn;
    return bn = null, t;
  }
  var ze = 0;
  function Ba(t, e, n, i, s) {
    return ze = 0, Cp(
      t.child,
      e,
      n,
      i,
      s
    );
  }
  function Cp(t, e, n, i, s) {
    for (var o = !1; t !== null; ) {
      if (t.tag === 5) {
        var f = t.stateNode;
        if (i !== null) {
          var y = Fc(f);
          i.push(y), y.view && (o = !0);
        } else
          o || Fc(f).view && (o = !0);
        Co = !0, My(
          f,
          ze === 0 ? e : e + "_" + ze,
          n
        ), ze++;
      } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && s || Cp(
        t.child,
        e,
        n,
        i,
        s
      ) && (o = !0));
      t = t.sibling;
    }
    return o;
  }
  function Sn(t, e) {
    for (; t !== null; )
      t.tag === 5 ? Cy(t.stateNode, t.memoizedProps) : (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && e || Sn(
        t.child,
        e
      )), t = t.sibling;
  }
  function Do(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if ((t.tag !== 22 || t.memoizedState === null) && (Do(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)) {
          var e = t.memoizedProps;
          if (e.name == null || e.name === "auto")
            throw Error(u(544));
          var n = e.name;
          e = Un(e.default, e.share), e !== "none" && (Ba(
            t,
            n,
            e,
            null,
            !1
          ) || Sn(t.child, !1));
        }
        t = t.sibling;
      }
  }
  function hc(t, e) {
    if (t.tag === 30) {
      var n = t.stateNode, i = t.memoizedProps, s = _n(i, n), o = Un(
        i.default,
        n.paired ? i.share : i.enter
      );
      o !== "none" ? Ba(t, s, o, null, !1) ? (Do(t), n.paired || e || Qa(t, i.onEnter)) : Sn(t.child, !1) : Do(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        hc(t, e), t = t.sibling;
    else Do(t);
  }
  function mc(t) {
    if (Ge !== null && Ge.size !== 0) {
      var e = Ge;
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var n = t.memoizedProps, i = n.name;
              if (i != null && i !== "auto") {
                var s = e.get(i);
                if (s !== void 0) {
                  var o = Un(
                    n.default,
                    n.share
                  );
                  if (o !== "none" && (Ba(
                    t,
                    i,
                    o,
                    null,
                    !1
                  ) ? (o = t.stateNode, s.paired = o, o.paired = s, Qa(t, n.onShare)) : Sn(t.child, !1)), e.delete(i), e.size === 0) break;
                }
              }
            }
            mc(t);
          }
          t = t.sibling;
        }
    }
  }
  function pc(t) {
    if (t.tag === 30) {
      var e = t.memoizedProps, n = _n(e, t.stateNode), i = Ge !== null ? Ge.get(n) : void 0, s = Un(
        e.default,
        i !== void 0 ? e.share : e.exit
      );
      s !== "none" && (Ba(t, n, s, null, !1) ? i !== void 0 ? (s = t.stateNode, i.paired = s, s.paired = i, Ge.delete(n), Qa(t, e.onShare)) : Qa(t, e.onExit) : Sn(t.child, !1)), Ge !== null && mc(t);
    } else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        pc(t), t = t.sibling;
    else
      Ge !== null && mc(t);
  }
  function Dp(t) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var e = t.memoizedProps, n = _n(e, t.stateNode);
        e = Un(e.default, e.update), t.flags &= -5, e !== "none" && Ba(
          t,
          n,
          e,
          t.memoizedState = [],
          !1
        );
      } else
        (t.subtreeFlags & 33554432) !== 0 && Dp(t);
      t = t.sibling;
    }
  }
  function yc(t) {
    if ((t.subtreeFlags & 18874368) !== 0)
      for (t = t.child; t !== null; ) {
        if (t.tag !== 22 || t.memoizedState === null) {
          if (t.tag === 30 && (t.flags & 18874368) !== 0) {
            var e = t.stateNode;
            e.paired !== null && (e.paired = null, Sn(t.child, !1));
          }
          yc(t);
        }
        t = t.sibling;
      }
  }
  function zo(t) {
    if (t.tag === 30)
      t.stateNode.paired = null, Sn(t.child, !1), yc(t);
    else if ((t.subtreeFlags & 33554432) !== 0)
      for (t = t.child; t !== null; )
        zo(t), t = t.sibling;
    else yc(t);
  }
  function zp(t) {
    for (t = t.child; t !== null; )
      t.tag === 30 ? Sn(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && zp(t), t = t.sibling;
  }
  function gc(t, e, n, i, s, o, f) {
    for (var y = !1; e !== null; ) {
      if (e.tag === 5) {
        var T = e.stateNode;
        if (o !== null && ze < o.length) {
          var C = o[ze], R = Fc(T);
          (C.view || R.view) && (y = !0);
          var B;
          if (B = (t.flags & 4) === 0)
            if (R.clip) B = !0;
            else {
              B = C.rect;
              var x = R.rect;
              B = B.y !== x.y || B.x !== x.x || B.height !== x.height || B.width !== x.width;
            }
          B && (t.flags |= 4), R.abs ? R = !C.abs : (C = C.rect, R = R.rect, R = C.height !== R.height || C.width !== R.width), R && (t.flags |= 32);
        } else t.flags |= 32;
        (t.flags & 4) !== 0 && My(
          T,
          ze === 0 ? n : n + "_" + ze,
          s
        ), y && (t.flags & 4) !== 0 || (bn === null && (bn = []), bn.push(
          T,
          ze === 0 ? i : i + "_" + ze,
          e.memoizedProps
        )), ze++;
      } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && f ? t.flags |= e.flags & 32 : gc(
        t,
        e.child,
        n,
        i,
        s,
        o,
        f
      ) && (y = !0));
      e = e.sibling;
    }
    return y;
  }
  function Op(t, e) {
    for (t = t.child; t !== null; ) {
      if (t.tag === 30) {
        var n = t.memoizedProps, i = t.stateNode, s = _n(n, i), o = Un(n.default, n.update), f;
        f = t.memoizedState, t.memoizedState = null, i = t;
        var y = t.child;
        ze = 0, s = gc(
          i,
          y,
          s,
          s,
          o,
          f,
          !1
        ), (t.flags & 4) !== 0 && s && Qa(t, n.onUpdate);
      } else
        (t.subtreeFlags & 33554432) !== 0 && Op(t);
      t = t.sibling;
    }
  }
  var oe = !1, Ot = !1, Tn = !1, vc = !1, Rp = typeof WeakSet == "function" ? WeakSet : Set, ue = null, En = !1, ql = !1, Oo = !1, bc = !1;
  function CS(t, e, n) {
    if (t = t.containerInfo, Qc = tl, t = _h(t), lr(t)) {
      if ("selectionStart" in t)
        var i = {
          start: t.selectionStart,
          end: t.selectionEnd
        };
      else
        t: {
          i = (i = t.ownerDocument) && i.defaultView || window;
          var s = i.getSelection && i.getSelection();
          if (s && s.rangeCount !== 0) {
            i = s.anchorNode;
            var o = s.anchorOffset, f = s.focusNode;
            s = s.focusOffset;
            try {
              i.nodeType, f.nodeType;
            } catch {
              i = null;
              break t;
            }
            var y = 0, T = -1, C = -1, R = 0, B = 0, x = t, O = null;
            e: for (; ; ) {
              for (var Q; x !== i || o !== 0 && x.nodeType !== 3 || (T = y + o), x !== f || s !== 0 && x.nodeType !== 3 || (C = y + s), x.nodeType === 3 && (y += x.nodeValue.length), (Q = x.firstChild) !== null; )
                O = x, x = Q;
              for (; ; ) {
                if (x === t) break e;
                if (O === i && ++R === o && (T = y), O === f && ++B === s && (C = y), (Q = x.nextSibling) !== null) break;
                x = O, O = x.parentNode;
              }
              x = Q;
            }
            i = T === -1 || C === -1 ? null : { start: T, end: C };
          } else i = null;
        }
      i = i || { start: 0, end: 0 };
    } else i = null;
    for (Zc = { focusedElem: t, selectionRange: i }, tl = !1, n = (n & 335544064) === n, ue = e, e = n ? 9270 : 1024; ue !== null; ) {
      if (t = ue, n && (i = t.deletions, i !== null))
        for (o = 0; o < i.length; o++)
          n && pc(i[o]);
      if (t.alternate === null && (t.flags & 2) !== 0)
        n && xp(t), Ro(n);
      else {
        if (t.tag === 22) {
          if (i = t.alternate, t.memoizedState !== null) {
            i !== null && i.memoizedState === null && n && pc(i), Ro(n);
            continue;
          } else if (i !== null && i.memoizedState !== null) {
            n && xp(t), Ro(n);
            continue;
          }
        }
        i = t.child, (t.subtreeFlags & e) !== 0 && i !== null ? (i.return = t, ue = i) : (n && Dp(t), Ro(n));
      }
    }
    Ge = null;
  }
  function Ro(t) {
    for (; ue !== null; ) {
      var e = ue, n = t, i = e.alternate, s = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((s & 1024) !== 0 && i !== null) {
            n = void 0, s = i.memoizedProps, i = i.memoizedState;
            var o = e.stateNode;
            try {
              var f = Pi(
                e.type,
                s
              );
              n = o.getSnapshotBeforeUpdate(
                f,
                i
              ), o.__reactInternalSnapshotBeforeUpdate = n;
            } catch (y) {
              wt(e, e.return, y);
            }
          }
          break;
        case 3:
          if ((s & 1024) !== 0) {
            if (i = e.stateNode.containerInfo, n = i.nodeType, n === 9)
              Wc(i);
            else if (n === 1)
              switch (i.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Wc(i);
                  break;
                default:
                  i.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          n && i !== null && (n = _n(
            i.memoizedProps,
            i.stateNode
          ), s = e.memoizedProps, s = Un(s.default, s.update), s !== "none" && Ba(
            i,
            n,
            s,
            i.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((s & 1024) !== 0) throw Error(u(163));
      }
      if (i = e.sibling, i !== null) {
        i.return = e.return, ue = i;
        break;
      }
      ue = e.return;
    }
  }
  function wp(t, e, n) {
    var i = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        An(t, n), i & 4 && Gl(5, n);
        break;
      case 1:
        if (An(t, n), i & 4)
          if (t = n.stateNode, e === null)
            try {
              t.componentDidMount();
            } catch (f) {
              wt(n, n.return, f);
            }
          else {
            var s = Pi(
              n.type,
              e.memoizedProps
            );
            e = e.memoizedState;
            try {
              t.componentDidUpdate(
                s,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            } catch (f) {
              wt(
                n,
                n.return,
                f
              );
            }
          }
        i & 64 && bp(n), i & 512 && vn(n, n.return);
        break;
      case 3:
        if (An(t, n), i & 64 && (t = n.updateQueue, t !== null)) {
          if (e = null, n.child !== null)
            switch (n.child.tag) {
              case 27:
              case 5:
                e = n.child.stateNode;
                break;
              case 1:
                e = n.child.stateNode;
            }
          try {
            um(t, e);
          } catch (f) {
            wt(n, n.return, f);
          }
        }
        break;
      case 27:
        e === null && i & 4 && Ap(n);
      case 26:
      case 5:
        An(t, n), e === null && i & 4 && rc(n), i & 512 && vn(n, n.return);
        break;
      case 12:
        An(t, n);
        break;
      case 31:
        An(t, n), i & 4 && Up(t, n);
        break;
      case 13:
        An(t, n), i & 4 && Bp(t, n), i & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = HS.bind(
          null,
          n
        ), bT(t, n))));
        break;
      case 22:
        if (i = n.memoizedState !== null || oe, !i) {
          var o = e !== null && e.memoizedState !== null || Ot;
          e = oe, s = Ot, oe = i, (Ot = o) && !s ? (i = 2, (n.subtreeFlags & 8772) !== 0 && (i |= 1), sn(
            t,
            n,
            i
          )) : An(t, n), oe = e, Ot = s;
        }
        break;
      case 30:
        An(t, n), i & 512 && vn(n, n.return);
        break;
      case 7:
        i & 512 && vn(n, n.return);
      default:
        An(t, n);
    }
  }
  function Sc(t, e) {
    for (t = t.child; t !== null; )
      Np(t, e), t = t.sibling;
  }
  function Np(t, e) {
    switch (t.tag) {
      case 5:
      case 26:
        try {
          var n = t.stateNode;
          if (e) {
            var i = n.style;
            typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
          } else {
            var s = t.stateNode, o = t.memoizedProps.style, f = o != null && o.hasOwnProperty("display") ? o.display : null;
            s.style.display = f == null || typeof f == "boolean" ? "" : ("" + f).trim();
          }
        } catch (T) {
          wt(t, t.return, T);
        }
        Tc(t, e);
        break;
      case 6:
        try {
          t.stateNode.nodeValue = e ? "" : t.memoizedProps, Dt = !0;
        } catch (T) {
          wt(t, t.return, T);
        }
        break;
      case 18:
        try {
          var y = t.stateNode;
          e ? xy(y, !0) : xy(t.stateNode, !1);
        } catch (T) {
          wt(t, t.return, T);
        }
        break;
      case 22:
      case 23:
        t.memoizedState === null && Sc(t, e);
        break;
      default:
        Sc(t, e);
    }
  }
  function Tc(t, e) {
    if (t.subtreeFlags & 67108864)
      for (t = t.child; t !== null; ) {
        t: {
          var n = t, i = e;
          switch (n.tag) {
            case 4:
              Np(n, i);
              break t;
            case 22:
              n.memoizedState === null && Tc(n, i);
              break t;
            default:
              Tc(n, i);
          }
        }
        t = t.sibling;
      }
  }
  function Vp(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Vp(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && _s(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Gt = null, Oe = !1;
  function an(t, e, n) {
    for (n = n.child; n !== null; )
      _p(t, e, n), n = n.sibling;
  }
  function _p(t, e, n) {
    if (Ue && typeof Ue.onCommitFiberUnmount == "function")
      try {
        Ue.onCommitFiberUnmount(fl, n);
      } catch {
      }
    switch (n.tag) {
      case 26:
        Ot || me(n, e), an(
          t,
          e,
          n
        ), n.memoizedState ? n.memoizedState.count-- : n.stateNode && !Ot && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        Ot || me(n, e), Yl(n);
        var i = Gt, s = Oe;
        bi(n.type) && (Gt = n.stateNode, Oe = !1), an(
          t,
          e,
          n
        ), Hy(
          n.stateNode,
          n.type,
          n.memoizedProps
        ), Gt = i, Oe = s;
        break;
      case 5:
        Ot || me(n, e), Yl(n);
      case 6:
        if (n.tag === 6 && Yl(n), i = Gt, s = Oe, Gt = null, an(
          t,
          e,
          n
        ), Gt = i, Oe = s, Gt !== null)
          if (Oe)
            try {
              (Gt.nodeType === 9 ? Gt.body : Gt.nodeName === "HTML" ? Gt.ownerDocument.body : Gt).removeChild(n.stateNode), Dt = !0;
            } catch (o) {
              wt(
                n,
                e,
                o
              );
            }
          else
            try {
              Gt.removeChild(n.stateNode), Dt = !0;
            } catch (o) {
              wt(
                n,
                e,
                o
              );
            }
        break;
      case 18:
        Gt !== null && (Oe ? (t = Gt, Ay(
          t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
          n.stateNode
        ), el(t)) : Ay(Gt, n.stateNode));
        break;
      case 4:
        i = Gt, s = Oe, Gt = n.stateNode.containerInfo, Oe = !0, an(
          t,
          e,
          n
        ), Gt = i, Oe = s;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        di(2, n, e), Ot || di(4, n, e), an(
          t,
          e,
          n
        );
        break;
      case 1:
        Ot || (me(n, e), i = n.stateNode, typeof i.componentWillUnmount == "function" && Sp(
          n,
          e,
          i
        )), an(
          t,
          e,
          n
        );
        break;
      case 21:
        an(
          t,
          e,
          n
        );
        break;
      case 22:
        Ot = (i = Ot) || n.memoizedState !== null, an(
          t,
          e,
          n
        ), Ot = i;
        break;
      case 30:
        me(n, e), an(
          t,
          e,
          n
        );
        break;
      case 7:
        Ot || me(n, e), an(
          t,
          e,
          n
        );
        break;
      default:
        an(
          t,
          e,
          n
        );
    }
  }
  function Up(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        el(t);
      } catch (n) {
        wt(e, e.return, n);
      }
    }
  }
  function Bp(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
      try {
        el(t);
      } catch (n) {
        wt(e, e.return, n);
      }
  }
  function DS(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new Rp()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new Rp()), e;
      default:
        throw Error(u(435, t.tag));
    }
  }
  function wo(t, e) {
    var n = DS(t);
    e.forEach(function(i) {
      if (!n.has(i)) {
        n.add(i);
        var s = jS.bind(null, t, i);
        i.then(s, s);
      }
    });
  }
  function Te(t, e, n) {
    var i = e.deletions;
    if (i !== null)
      for (var s = 0; s < i.length; s++) {
        var o = i[s], f = t, y = e, T = y;
        t: for (; T !== null; ) {
          switch (T.tag) {
            case 27:
              if (bi(T.type)) {
                Gt = T.stateNode, Oe = !1;
                break t;
              }
              break;
            case 5:
              Gt = T.stateNode, Oe = !1;
              break t;
            case 3:
            case 4:
              Gt = T.stateNode.containerInfo, Oe = !0;
              break t;
          }
          T = T.return;
        }
        if (Gt === null) throw Error(u(160));
        _p(f, y, o), Gt = null, Oe = !1, f = o.alternate, f !== null && (f.return = null), o.return = null;
      }
    if (e.subtreeFlags & 13886)
      for (e = e.child; e !== null; )
        Lp(e, t, n), e = e.sibling;
  }
  var ln = null;
  function Lp(t, e, n) {
    var i = t.alternate, s = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (s & 4 && (i = t.updateQueue, i = i !== null ? i.events : null, i !== null))
          for (var o = 0; o < i.length; o++) {
            var f = i[o];
            f.ref.impl = f.nextImpl;
          }
        Te(e, t, n), Ee(t), s & 4 && (di(3, t, t.return), Gl(3, t), di(5, t, t.return));
        break;
      case 1:
        Te(e, t, n), Ee(t), s & 512 && (Ot || i === null || me(i, i.return)), s & 64 && oe && (t = t.updateQueue, t !== null && (e = t.callbacks, e !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? e : n.concat(e))));
        break;
      case 26:
        if (o = ln, Te(e, t, n), Ee(t), s & 512 && (Ot || i === null || me(i, i.return)), s & 4)
          if (s = i !== null ? i.memoizedState : null, n = t.memoizedState, i === null)
            if (n === null)
              if (t.stateNode === null)
                if (oe)
                  t.stateNode = Sy(
                    t.type,
                    t.memoizedProps,
                    e.containerInfo,
                    t
                  );
                else {
                  t: {
                    e = t.type, n = t.memoizedProps, s = o.ownerDocument || o;
                    e: switch (e) {
                      case "title":
                        i = s.getElementsByTagName("title")[0], (!i || i[ml] || i[ce] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = s.createElement(e), s.head.insertBefore(
                          i,
                          s.querySelector("head > title")
                        )), pe(i, e, n), i[ce] = t, le(i), e = i;
                        break t;
                      case "link":
                        if (o = Qy(
                          "link",
                          "href",
                          s
                        ).get(e + (n.href || ""))) {
                          for (f = 0; f < o.length; f++)
                            if (i = o[f], i.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && i.getAttribute("rel") === (n.rel == null ? null : n.rel) && i.getAttribute("title") === (n.title == null ? null : n.title) && i.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                              o.splice(f, 1);
                              break e;
                            }
                        }
                        i = s.createElement(e), pe(i, e, n), s.head.appendChild(i);
                        break;
                      case "meta":
                        if (o = Qy(
                          "meta",
                          "content",
                          s
                        ).get(e + (n.content || ""))) {
                          for (f = 0; f < o.length; f++)
                            if (i = o[f], i.getAttribute("content") === (n.content == null ? null : "" + n.content) && i.getAttribute("name") === (n.name == null ? null : n.name) && i.getAttribute("property") === (n.property == null ? null : n.property) && i.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && i.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                              o.splice(f, 1);
                              break e;
                            }
                        }
                        i = s.createElement(e), pe(i, e, n), s.head.appendChild(i);
                        break;
                      default:
                        throw Error(u(468, e));
                    }
                    i[ce] = t, le(i), e = i;
                  }
                  t.stateNode = e;
                }
              else
                oe || sf(o, t.type, t.stateNode);
            else
              t.stateNode = Xy(
                o,
                n,
                t.memoizedProps
              );
          else
            s !== n ? (s === null ? (e = i.stateNode, e === null || Ot || e.parentNode.removeChild(e)) : s.count--, n === null ? oe || sf(o, t.type, t.stateNode) : Xy(o, n, t.memoizedProps)) : n === null && t.stateNode !== null && cc(
              t,
              t.memoizedProps,
              i.memoizedProps
            );
        break;
      case 27:
        Te(e, t, n), Ee(t), s & 512 && (Ot || i === null || me(i, i.return)), i !== null && s & 4 && cc(
          t,
          t.memoizedProps,
          i.memoizedProps
        );
        break;
      case 5:
        if (o = Tn, Tn = !1, Te(e, t, n), Tn = o, Ee(t), s & 512 && (Ot || i === null || me(i, i.return)), t.flags & 32) {
          e = t.stateNode;
          try {
            va(e, ""), Dt = !0;
          } catch (R) {
            wt(t, t.return, R);
          }
        }
        s & 4 && t.stateNode != null && (e = t.memoizedProps, cc(
          t,
          e,
          i !== null ? i.memoizedProps : e
        )), s & 1024 && (vc = !0);
        break;
      case 6:
        if (Te(e, t, n), Ee(t), s & 4) {
          if (t.stateNode === null)
            throw Error(u(162));
          e = t.memoizedProps, n = t.stateNode;
          try {
            n.nodeValue = e, Dt = !0;
          } catch (R) {
            wt(t, t.return, R);
          }
        }
        break;
      case 3:
        if (Dt = !1, Ko = null, o = ln, ln = Il(e.containerInfo), Te(e, t, n), ln = o, Ee(t), s & 4 && i !== null && i.memoizedState.isDehydrated)
          try {
            el(e.containerInfo);
          } catch (R) {
            wt(t, t.return, R);
          }
        vc && (vc = !1, Hp(t)), Dt = !1;
        break;
      case 4:
        s = Tn, Tn = oe, i = ah(), o = ln, ln = Il(
          t.stateNode.containerInfo
        ), Te(e, t, n), Ee(t), ln = o, Dt && ql && (Oo = !0), Dt = i, Tn = s;
        break;
      case 12:
        Te(e, t, n), Ee(t);
        break;
      case 31:
        Te(e, t, n), Ee(t), s & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, wo(t, e)));
        break;
      case 13:
        Te(e, t, n), Ee(t), t.child.flags & 8192 && t.memoizedState !== null != (i !== null && i.memoizedState !== null) && (_o = _e()), s & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, wo(t, e)));
        break;
      case 22:
        o = t.memoizedState !== null, f = i !== null && i.memoizedState !== null;
        var y = oe, T = Ot, C = Tn;
        oe = y || o, Tn = C || o, Ot = T || f, Te(e, t, n), Ot = T, Tn = C, oe = y, Ee(t), s & 8192 && (e = t.stateNode, e._visibility = o ? e._visibility & -2 : e._visibility | 1, !o || i === null || f || oe || Ot || (e = f || Ot, n = oe, i = Ot, oe = o || oe, Ot = e, hi(t, 2), oe = n, Ot = i), !o && Tn || Sc(t, o)), s & 4 && (e = t.updateQueue, e !== null && (n = e.retryQueue, n !== null && (e.retryQueue = null, wo(t, n))));
        break;
      case 19:
        Te(e, t, n), Ee(t), s & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, wo(t, e)));
        break;
      case 30:
        s & 512 && (Ot || i === null || me(i, i.return)), s = ah(), o = ql, f = (n & 335544064) === n, y = t.memoizedProps, ql = f && Un(
          y.default,
          y.update
        ) !== "none", Te(e, t, n), Ee(t), f && i !== null && Dt && (t.flags |= 4), ql = o, Dt = s;
        break;
      case 21:
        break;
      case 7:
        s & 512 && (Ot || i === null || me(i, i.return)), i && i.stateNode !== null && (i.stateNode._fragmentFiber = t);
      default:
        Te(e, t, n), Ee(t);
    }
  }
  function Ee(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, i = t.return; i !== null; ) {
          if (Ep(i)) {
            n = i;
            break;
          }
          i = i.return;
        }
        i = null;
        for (var s = t.return; s !== null; ) {
          if (uc(s)) {
            var o = s.stateNode;
            i === null ? i = [o] : i.push(o);
          }
          if (oc(s)) break;
          s = s.return;
        }
        var f = i;
        if (n == null) throw Error(u(160));
        switch (n.tag) {
          case 27:
            var y = n.stateNode, T = fc(t);
            Mo(
              t,
              T,
              y,
              f
            );
            break;
          case 5:
            var C = n.stateNode;
            n.flags & 32 && (va(C, ""), n.flags &= -33);
            var R = fc(t);
            Mo(
              t,
              R,
              C,
              f
            );
            break;
          case 3:
          case 4:
            var B = n.stateNode.containerInfo, x = fc(t);
            dc(
              t,
              x,
              B,
              f
            );
            break;
          default:
            throw Error(u(161));
        }
      } catch (O) {
        wt(t, t.return, O);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Hp(t) {
    if (t.subtreeFlags & 1024)
      for (t = t.child; t !== null; ) {
        var e = t;
        Hp(e), e.tag === 5 && e.flags & 1024 && (e = e.stateNode, tl = !0, e.reset(), tl = !1), t = t.sibling;
      }
  }
  function La(t, e) {
    if (e.subtreeFlags & 9270)
      for (e = e.child; e !== null; )
        jp(e, t), e = e.sibling;
    else Op(e);
  }
  function jp(t, e) {
    var n = t.alternate;
    if (n === null) hc(t, !1);
    else
      switch (t.tag) {
        case 3:
          if (bc = En = !1, Mp(), La(e, t), !En && !Oo) {
            if (t = bn, t !== null)
              for (var i = 0; i < t.length; i += 3) {
                n = t[i];
                var s = t[i + 1];
                Cy(n, t[i + 2]), n = n.ownerDocument.documentElement, n !== null && n.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + s + ")"
                  }
                );
              }
            t = e.containerInfo, t = t.nodeType === 9 ? t.documentElement : t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "" && (t.style.viewTransitionName = "none", t.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), t.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), bc = !0;
          }
          bn = null;
          break;
        case 5:
          La(e, t);
          break;
        case 4:
          i = En, En = !1, La(e, t), En && (Oo = !0), En = i;
          break;
        case 22:
          t.memoizedState === null && (n.memoizedState !== null ? hc(t, !1) : La(e, t));
          break;
        case 30:
          i = En, s = Mp(), En = !1, La(e, t), En && (t.flags |= 4);
          var o = t.memoizedProps, f = t.stateNode;
          e = _n(o, f), f = _n(n.memoizedProps, f);
          var y = Un(o.default, o.update);
          y === "none" ? e = !1 : (o = n.memoizedState, n.memoizedState = null, n = t.child, ze = 0, e = gc(
            t,
            n,
            e,
            f,
            y,
            o,
            !0
          ), ze !== (o === null ? 0 : o.length) && (t.flags |= 32)), (t.flags & 4) !== 0 && e ? (Qa(
            t,
            t.memoizedProps.onUpdate
          ), bn = s) : s !== null && (s.push.apply(s, bn), bn = s), En = (t.flags & 32) !== 0 ? !0 : i;
          break;
        default:
          La(e, t);
      }
  }
  function An(t, e) {
    if (e.subtreeFlags & 8772)
      for (e = e.child; e !== null; )
        wp(t, e.alternate, e), e = e.sibling;
  }
  function hi(t, e) {
    for (t = t.child; t !== null; ) {
      var n = t, i = e;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          di(4, n, n.return), hi(
            n,
            i
          );
          break;
        case 1:
          me(n, n.return);
          var s = n.stateNode;
          typeof s.componentWillUnmount == "function" && Sp(
            n,
            n.return,
            s
          ), hi(
            n,
            i
          );
          break;
        case 27:
          (i & 2) !== 0 && Hy(
            n.stateNode,
            n.type,
            n.memoizedProps
          );
        case 5:
          me(n, n.return), n.tag !== 5 && n.tag !== 27 || Yl(n), hi(
            n,
            i
          );
          break;
        case 6:
          Yl(n);
          break;
        case 26:
          me(n, n.return), s = n.stateNode, n.memoizedState !== null || s === null || Ot || s.parentNode.removeChild(s), hi(
            n,
            i
          );
          break;
        case 22:
          n.memoizedState === null && hi(
            n,
            i
          );
          break;
        case 30:
          me(n, n.return), hi(
            n,
            i
          );
          break;
        case 7:
          me(n, n.return);
        default:
          hi(
            n,
            i
          );
      }
      t = t.sibling;
    }
  }
  function sn(t, e, n) {
    for (n = (e.subtreeFlags & 8772) !== 0 ? n : n & -2, e = e.child; e !== null; ) {
      var i = e.alternate, s = t, o = e, f = o.flags, y = (n & 1) !== 0;
      switch (o.tag) {
        case 0:
        case 11:
        case 15:
          sn(
            s,
            o,
            n
          ), Gl(4, o);
          break;
        case 1:
          if (sn(
            s,
            o,
            n
          ), i = o, s = i.stateNode, typeof s.componentDidMount == "function")
            try {
              s.componentDidMount();
            } catch (R) {
              wt(i, i.return, R);
            }
          if (i = o, s = i.updateQueue, s !== null) {
            var T = i.stateNode;
            try {
              var C = s.shared.hiddenCallbacks;
              if (C !== null)
                for (s.shared.hiddenCallbacks = null, s = 0; s < C.length; s++)
                  om(C[s], T);
            } catch (R) {
              wt(i, i.return, R);
            }
          }
          y && f & 64 && bp(o), vn(o, o.return);
          break;
        case 27:
          (n & 2) !== 0 && Ap(o);
        case 5:
          o.tag !== 5 && o.tag !== 27 || Tp(o), sn(
            s,
            o,
            n
          ), y && i === null && f & 4 && rc(o), vn(o, o.return);
          break;
        case 6:
          Tp(o);
          break;
        case 26:
          T = o.stateNode, o.memoizedState !== null || T === null || oe || sf(
            Il(T.ownerDocument),
            o.type,
            T
          ), sn(
            s,
            o,
            n
          ), y && i === null && f & 4 && rc(o), vn(o, o.return);
          break;
        case 12:
          sn(
            s,
            o,
            n
          );
          break;
        case 31:
          sn(
            s,
            o,
            n
          ), y && f & 4 && Up(s, o);
          break;
        case 13:
          sn(
            s,
            o,
            n
          ), y && f & 4 && Bp(s, o);
          break;
        case 22:
          o.memoizedState === null && sn(
            s,
            o,
            n
          ), vn(o, o.return);
          break;
        case 30:
          sn(
            s,
            o,
            n
          ), vn(o, o.return);
          break;
        case 7:
          vn(o, o.return);
        default:
          sn(
            s,
            o,
            n
          );
      }
      e = e.sibling;
    }
  }
  function Ec(t, e) {
    var n = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && Dl(n));
  }
  function Ac(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && Dl(t));
  }
  function Ie(t, e, n, i) {
    var s = (n & 335544064) === n;
    if (e.subtreeFlags & (s ? 10262 : 10256))
      for (e = e.child; e !== null; )
        Gp(
          t,
          e,
          n,
          i
        ), e = e.sibling;
    else s && zp(e);
  }
  function Gp(t, e, n, i) {
    var s = (n & 335544064) === n;
    s && e.alternate === null && e.return !== null && e.return.alternate !== null && zo(e);
    var o = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Ie(
          t,
          e,
          n,
          i
        ), o & 2048 && Gl(9, e);
        break;
      case 1:
        Ie(
          t,
          e,
          n,
          i
        );
        break;
      case 3:
        Ie(
          t,
          e,
          n,
          i
        ), s && bc && (t = t.containerInfo, t = t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, t.style.viewTransitionName === "root" && (t.style.viewTransitionName = ""), t = t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "none" && (t.style.viewTransitionName = "")), o & 2048 && (o = null, e.alternate !== null && (o = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== o && (e.refCount++, o != null && Dl(o)));
        break;
      case 12:
        if (o & 2048) {
          Ie(
            t,
            e,
            n,
            i
          ), o = e.stateNode;
          try {
            var f = e.memoizedProps, y = f.id, T = f.onPostCommit;
            typeof T == "function" && T(
              y,
              e.alternate === null ? "mount" : "update",
              o.passiveEffectDuration,
              -0
            );
          } catch (C) {
            wt(e, e.return, C);
          }
        } else
          Ie(
            t,
            e,
            n,
            i
          );
        break;
      case 31:
        Ie(
          t,
          e,
          n,
          i
        );
        break;
      case 13:
        Ie(
          t,
          e,
          n,
          i
        );
        break;
      case 23:
        break;
      case 22:
        f = e.stateNode, y = e.alternate, e.memoizedState !== null ? (s && y !== null && y.memoizedState === null && zo(y), f._visibility & 2 ? Ie(
          t,
          e,
          n,
          i
        ) : Xl(
          t,
          e
        )) : (s && y !== null && y.memoizedState !== null && zo(e), f._visibility & 2 ? Ie(
          t,
          e,
          n,
          i
        ) : (f._visibility |= 2, Ha(
          t,
          e,
          n,
          i,
          (e.subtreeFlags & 10256) !== 0 || !1
        ))), o & 2048 && Ec(y, e);
        break;
      case 24:
        Ie(
          t,
          e,
          n,
          i
        ), o & 2048 && Ac(e.alternate, e);
        break;
      case 30:
        s && (o = e.alternate, o !== null && (Sn(o.child, !0), Sn(e.child, !0))), Ie(
          t,
          e,
          n,
          i
        );
        break;
      default:
        Ie(
          t,
          e,
          n,
          i
        );
    }
  }
  function Ha(t, e, n, i, s) {
    for (s = s && ((e.subtreeFlags & 10256) !== 0 || !1), e = e.child; e !== null; ) {
      var o = t, f = e, y = n, T = i, C = f.flags;
      switch (f.tag) {
        case 0:
        case 11:
        case 15:
          Ha(
            o,
            f,
            y,
            T,
            s
          ), Gl(8, f);
          break;
        case 23:
          break;
        case 22:
          var R = f.stateNode;
          f.memoizedState !== null ? R._visibility & 2 ? Ha(
            o,
            f,
            y,
            T,
            s
          ) : Xl(
            o,
            f
          ) : (R._visibility |= 2, Ha(
            o,
            f,
            y,
            T,
            s
          )), s && C & 2048 && Ec(
            f.alternate,
            f
          );
          break;
        case 24:
          Ha(
            o,
            f,
            y,
            T,
            s
          ), s && C & 2048 && Ac(f.alternate, f);
          break;
        default:
          Ha(
            o,
            f,
            y,
            T,
            s
          );
      }
      e = e.sibling;
    }
  }
  function Xl(t, e) {
    if (e.subtreeFlags & 10256)
      for (e = e.child; e !== null; ) {
        var n = t, i = e, s = i.flags;
        switch (i.tag) {
          case 22:
            Xl(n, i), s & 2048 && Ec(
              i.alternate,
              i
            );
            break;
          case 24:
            Xl(n, i), s & 2048 && Ac(i.alternate, i);
            break;
          default:
            Xl(n, i);
        }
        e = e.sibling;
      }
  }
  var Ii = 8192;
  function Wi(t, e, n) {
    if (t.subtreeFlags & Ii)
      for (t = t.child; t !== null; )
        Yp(
          t,
          e,
          n
        ), t = t.sibling;
  }
  function Yp(t, e, n) {
    switch (t.tag) {
      case 26:
        Wi(
          t,
          e,
          n
        ), t.flags & Ii && (t.memoizedState !== null ? VT(
          n,
          ln,
          t.memoizedState,
          t.memoizedProps
        ) : (t = t.stateNode, (e & 335544128) === e && Jy(n, t)));
        break;
      case 5:
        Wi(
          t,
          e,
          n
        ), t.flags & Ii && (t = t.stateNode, (e & 335544128) === e && Jy(n, t));
        break;
      case 3:
      case 4:
        var i = ln;
        ln = Il(t.stateNode.containerInfo), Wi(
          t,
          e,
          n
        ), ln = i;
        break;
      case 22:
        t.memoizedState === null && (i = t.alternate, i !== null && i.memoizedState !== null ? (i = Ii, Ii = 16777216, Wi(
          t,
          e,
          n
        ), Ii = i) : Wi(
          t,
          e,
          n
        ));
        break;
      case 30:
        if ((t.flags & Ii) !== 0 && (i = t.memoizedProps.name, i != null && i !== "auto")) {
          var s = t.stateNode;
          s.paired = null, Ge === null && (Ge = /* @__PURE__ */ new Map()), Ge.set(i, s);
        }
        Wi(
          t,
          e,
          n
        );
        break;
      default:
        Wi(
          t,
          e,
          n
        );
    }
  }
  function qp(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function Ql(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          ue = i, Qp(
            i,
            t
          );
        }
      qp(t);
    }
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null; )
        Xp(t), t = t.sibling;
  }
  function Xp(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Ql(t), t.flags & 2048 && di(9, t, t.return);
        break;
      case 3:
        Ql(t);
        break;
      case 12:
        Ql(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, No(t)) : Ql(t);
        break;
      default:
        Ql(t);
    }
  }
  function No(t) {
    var e = t.deletions;
    if ((t.flags & 16) !== 0) {
      if (e !== null)
        for (var n = 0; n < e.length; n++) {
          var i = e[n];
          ue = i, Qp(
            i,
            t
          );
        }
      qp(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          di(8, e, e.return), No(e);
          break;
        case 22:
          n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, No(e));
          break;
        default:
          No(e);
      }
      t = t.sibling;
    }
  }
  function Qp(t, e) {
    for (; ue !== null; ) {
      var n = ue;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          di(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var i = n.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          Dl(n.memoizedState.cache);
      }
      if (i = n.child, i !== null) i.return = n, ue = i;
      else
        t: for (n = t; ue !== null; ) {
          i = ue;
          var s = i.sibling, o = i.return;
          if (Vp(i), i === n) {
            ue = null;
            break t;
          }
          if (s !== null) {
            s.return = o, ue = s;
            break t;
          }
          ue = o;
        }
    }
  }
  var zS = {
    getCacheForType: function(t) {
      var e = fe(Pt), n = e.data.get(t);
      return n === void 0 && (n = t(), e.data.set(t, n)), n;
    },
    cacheSignal: function() {
      return fe(Pt).controller.signal;
    }
  }, OS = typeof WeakMap == "function" ? WeakMap : Map, zt = 0, Ut = null, gt = null, Tt = 0, Rt = 0, Ye = null, mi = !1, ja = !1, xc = !1, Qn = 0, Zt = 0, pi = 0, $i = 0, Vo = 0, qe = 0, Ga = 0, Zl = null, Re = null, Mc = !1, _o = 0, Zp = 0, Uo = 1 / 0, Bo = null, yi = null, Yt = 0, on = null, ta = null, xn = 0, Cc = 0, Dc = null, Kp = null, Ya = null, qa = null, Xa = null, Kl = 0, Lo = null;
  function Xe() {
    return (zt & 2) !== 0 && Tt !== 0 ? Tt & -Tt : W.T !== null ? Lc() : Fd();
  }
  function kp() {
    if (qe === 0)
      if ((Tt & 536870912) === 0 || pt) {
        var t = Rs;
        Rs <<= 1, (Rs & 3932160) === 0 && (Rs = 262144), qe = t;
      } else qe = 536870912;
    return t = de.current, t !== null && (t.flags |= 32), qe;
  }
  function Qa(t, e) {
    if (e != null) {
      var n = t.stateNode, i = n.ref;
      i === null && (i = n.ref = Dy(
        _n(t.memoizedProps, n)
      )), qa === null && (qa = []), qa.push(e.bind(null, i));
    }
  }
  function we(t, e, n) {
    (t === Ut && (Rt === 2 || Rt === 9) || t.cancelPendingCommit !== null) && (Za(t, 0), gi(
      t,
      Tt,
      qe,
      !1
    )), hl(t, n), ((zt & 2) === 0 || t !== Ut) && (t === Ut && ((zt & 2) === 0 && ($i |= n), Zt === 4 && gi(
      t,
      Tt,
      qe,
      !1
    )), Mn(t));
  }
  function Jp(t, e, n) {
    if ((zt & 6) !== 0) throw Error(u(327));
    var i = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || dl(t, e), s = i ? NS(t, e) : Oc(t, e, !0), o = i;
    do {
      if (s === 0) {
        ja && !i && gi(t, e, 0, !1);
        break;
      } else {
        if (n = t.current.alternate, o && !RS(n)) {
          s = Oc(t, e, !1), o = !1;
          continue;
        }
        if (s === 2) {
          if (o = e, t.errorRecoveryDisabledLanes & o)
            var f = 0;
          else
            f = t.pendingLanes & -536870913, f = f !== 0 ? f : f & 536870912 ? 536870912 : 0;
          if (f !== 0) {
            e = f;
            t: {
              var y = t;
              s = Zl;
              var T = y.current.memoizedState.isDehydrated;
              if (T && (Za(y, f).flags |= 256), f = Oc(
                y,
                f,
                !1
              ), f !== 2 && f !== 6) {
                if (xc && !T) {
                  y.errorRecoveryDisabledLanes |= o, $i |= o, s = 4;
                  break t;
                }
                o = Re, Re = s, o !== null && (Re === null ? Re = o : Re.push.apply(
                  Re,
                  o
                ));
              }
              s = f;
            }
            if (o = !1, s !== 2) continue;
          }
        }
        if (s === 1) {
          Za(t, 0), gi(t, e, 0, !0);
          break;
        }
        t: {
          switch (i = t, o = s, o) {
            case 0:
            case 1:
              throw Error(u(345));
            case 4:
              if ((e & 4194048) !== e && (e & 62914560) !== e)
                break;
            case 6:
              gi(
                i,
                e,
                qe,
                !mi
              );
              break t;
            case 2:
              Re = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(u(329));
          }
          if ((e & 62914560) === e && (s = _o + 300 - _e(), 10 < s)) {
            if (gi(
              i,
              e,
              qe,
              !mi
            ), Ns(i, 0, !0) !== 0) break t;
            xn = e, i.timeoutHandle = Jc(
              Fp.bind(
                null,
                i,
                n,
                Re,
                Bo,
                Mc,
                e,
                qe,
                $i,
                Ga,
                mi,
                o,
                "Throttled",
                -0,
                0
              ),
              s
            );
            break t;
          }
          Fp(
            i,
            n,
            Re,
            Bo,
            Mc,
            e,
            qe,
            $i,
            Ga,
            mi,
            o,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Mn(t);
  }
  function Fp(t, e, n, i, s, o, f, y, T, C, R, B, x, O) {
    t.timeoutHandle = -1;
    var Q = e.subtreeFlags, $ = (o & 335544064) === o;
    if (B = null, ($ || Q & 8192 || (Q & 16785408) === 16785408) && (B = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: pn
    }, Ge = null, Yp(
      e,
      o,
      B
    ), $ && (Q = B, $ = t.containerInfo, $ = ($.nodeType === 9 ? $ : $.ownerDocument).__reactViewTransition, $ != null && (Q.count++, Q.waitingForViewTransition = !0, Q = ts.bind(Q), $.finished.then(Q, Q))), Q = (o & 62914560) === o ? _o - _e() : (o & 4194048) === o ? Zp - _e() : 0, Q = _T(
      B,
      Q
    ), Q !== null)) {
      xn = o, t.cancelPendingCommit = Q(
        iy.bind(
          null,
          t,
          e,
          o,
          n,
          i,
          s,
          f,
          y,
          T,
          C,
          R,
          B,
          null,
          x,
          O
        )
      ), gi(t, o, f, !C);
      return;
    }
    iy(
      t,
      e,
      o,
      n,
      i,
      s,
      f,
      y,
      T,
      C,
      R,
      B
    );
  }
  function RS(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null)))
        for (var i = 0; i < n.length; i++) {
          var s = n[i], o = s.getSnapshot;
          s = s.value;
          try {
            if (!He(o(), s)) return !1;
          } catch {
            return !1;
          }
        }
      if (n = e.child, e.subtreeFlags & 16384 && n !== null)
        n.return = e, e = n;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return !0;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return !0;
  }
  function gi(t, e, n, i) {
    e = Qd(t, e), e &= ~Vo, e &= ~$i, t.suspendedLanes |= e, t.pingedLanes &= ~e, i && (t.warmLanes |= e), i = t.expirationTimes;
    for (var s = e; 0 < s; ) {
      var o = 31 - Be(s), f = 1 << o;
      i[o] = -1, s &= ~f;
    }
    n !== 0 && Kd(t, n, e);
  }
  function Ho() {
    return (zt & 6) === 0 ? (kl(0), !1) : !0;
  }
  function zc() {
    if (gt !== null) {
      if (Rt === 0)
        var t = gt.return;
      else
        t = gt, Hn = Yi = null, Br(t), wa = null, Rl = 0, t = gt;
      for (; t !== null; )
        vp(t.alternate, t), t = t.return;
      gt = null;
    }
  }
  function Za(t, e) {
    var n = t.timeoutHandle;
    return n !== -1 && (t.timeoutHandle = -1, tT(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), xn = 0, zc(), Ut = t, gt = n = Bn(t.current, null), Tt = e, Rt = 0, Ye = null, mi = !1, ja = dl(t, e), xc = !1, Ga = qe = Vo = $i = pi = Zt = 0, Re = Zl = null, Mc = !1, Qn = Qd(t, e), Zs(), n;
  }
  function Pp(t, e) {
    ht = null, W.H = go, e === Ra || e === no ? (e = im(), Rt = 3) : e === Ar ? (e = im(), Rt = 4) : Rt = e === Ir ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, Ye = e, gt === null && (Zt = 1, vo(
      t,
      ke(e, t.current)
    ));
  }
  function Ip() {
    var t = de.current;
    return t === null ? !0 : (Tt & 4194048) === Tt ? ve === null : (Tt & 62914560) === Tt || (Tt & 536870912) !== 0 ? t === ve : !1;
  }
  function Wp() {
    var t = W.H;
    return W.H = go, t === null ? go : t;
  }
  function $p() {
    var t = W.A;
    return W.A = zS, t;
  }
  function jo() {
    Zt = 4, mi || (Tt & 4194048) !== Tt && de.current !== null || (ja = !0), (pi & 134217727) === 0 && ($i & 134217727) === 0 || Ut === null || gi(
      Ut,
      Tt,
      qe,
      !1
    );
  }
  function Oc(t, e, n) {
    var i = zt;
    zt |= 2;
    var s = Wp(), o = $p();
    (Ut !== t || Tt !== e) && (Bo = null, Za(t, e)), e = !1;
    var f = Zt;
    t: do
      try {
        if (Rt !== 0 && gt !== null) {
          var y = gt, T = Ye;
          switch (Rt) {
            case 8:
              zc(), f = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              de.current === null && (e = !0);
              var C = Rt;
              if (Rt = 0, Ye = null, Ka(t, y, T, C), n && ja) {
                f = 0;
                break t;
              }
              break;
            default:
              C = Rt, Rt = 0, Ye = null, Ka(t, y, T, C);
          }
        }
        wS(), f = Zt;
        break;
      } catch (R) {
        Pp(t, R);
      }
    while (!0);
    return e && t.shellSuspendCounter++, Hn = Yi = null, zt = i, W.H = s, W.A = o, gt === null && (Ut = null, Tt = 0, Zs()), f;
  }
  function wS() {
    for (; gt !== null; ) ty(gt);
  }
  function NS(t, e) {
    var n = zt;
    zt |= 2;
    var i = Wp(), s = $p();
    Ut !== t || Tt !== e ? (Bo = null, Uo = _e() + 500, Za(t, e)) : ja = dl(
      t,
      e
    );
    t: do
      try {
        if (Rt !== 0 && gt !== null) {
          e = gt;
          var o = Ye;
          e: switch (Rt) {
            case 1:
              Rt = 0, Ye = null, Ka(t, e, o, 1);
              break;
            case 2:
            case 9:
              if (em(o)) {
                Rt = 0, Ye = null, ey(e);
                break;
              }
              e = function() {
                Rt !== 2 && Rt !== 9 || Ut !== t || (Rt = 7), Mn(t);
              }, o.then(e, e);
              break t;
            case 3:
              Rt = 7;
              break t;
            case 4:
              Rt = 5;
              break t;
            case 7:
              em(o) ? (Rt = 0, Ye = null, ey(e)) : (Rt = 0, Ye = null, Ka(t, e, o, 7));
              break;
            case 5:
              var f = null;
              switch (gt.tag) {
                case 26:
                  f = gt.memoizedState;
                case 5:
                case 27:
                  var y = gt;
                  if (f ? Ky(f) : y.stateNode.complete) {
                    Rt = 0, Ye = null;
                    var T = y.sibling;
                    if (T !== null) gt = T;
                    else {
                      var C = y.return;
                      C !== null ? (gt = C, Go(C)) : gt = null;
                    }
                    break e;
                  }
              }
              Rt = 0, Ye = null, Ka(t, e, o, 5);
              break;
            case 6:
              Rt = 0, Ye = null, Ka(t, e, o, 6);
              break;
            case 8:
              zc(), Zt = 6;
              break t;
            default:
              throw Error(u(462));
          }
        }
        VS();
        break;
      } catch (R) {
        Pp(t, R);
      }
    while (!0);
    return Hn = Yi = null, W.H = i, W.A = s, zt = n, gt !== null ? 0 : (Ut = null, Tt = 0, Zs(), Zt);
  }
  function VS() {
    for (; gt !== null && !Pb(); )
      ty(gt);
  }
  function ty(t) {
    var e = yp(t.alternate, t, Qn);
    t.memoizedProps = t.pendingProps, e === null ? Go(t) : gt = e;
  }
  function ey(t) {
    var e = t, n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = rp(
          n,
          e,
          e.pendingProps,
          e.type,
          void 0,
          Tt
        );
        break;
      case 11:
        e = rp(
          n,
          e,
          e.pendingProps,
          e.type.render,
          e.ref,
          Tt
        );
        break;
      case 5:
        Br(e);
        var i = e;
        i === se && (pt ? (Is(i), i.tag === 5 && i.stateNode != null && (Ht = i.stateNode)) : (Is(i), pt = !0));
      default:
        vp(n, e), e = gt = Qh(e, Qn), e = yp(n, e, Qn);
    }
    t.memoizedProps = t.pendingProps, e === null ? Go(t) : gt = e;
  }
  function Ka(t, e, n, i) {
    Hn = Yi = null, Br(e), wa = null, Rl = 0;
    var s = e.return;
    try {
      if (SS(
        t,
        s,
        e,
        n,
        Tt
      )) {
        Zt = 1, vo(
          t,
          ke(n, t.current)
        ), gt = null;
        return;
      }
    } catch (o) {
      if (s !== null) throw gt = s, o;
      Zt = 1, vo(
        t,
        ke(n, t.current)
      ), gt = null;
      return;
    }
    e.flags & 32768 ? (pt || i === 1 ? t = !0 : ja || (Tt & 536870912) !== 0 ? t = !1 : (mi = t = !0, (i === 2 || i === 9 || i === 3 || i === 6) && (i = de.current, i !== null && i.tag === 13 && (i.flags |= 16384))), ny(e, t)) : Go(e);
  }
  function Go(t) {
    var e = t;
    do {
      if ((e.flags & 32768) !== 0) {
        ny(
          e,
          mi
        );
        return;
      }
      t = e.return;
      var n = xS(
        e.alternate,
        e,
        Qn
      );
      if (n !== null) {
        gt = n;
        return;
      }
      if (e = e.sibling, e !== null) {
        gt = e;
        return;
      }
      gt = e = t;
    } while (e !== null);
    Zt === 0 && (Zt = 5);
  }
  function ny(t, e) {
    do {
      var n = MS(t.alternate, t);
      if (n !== null) {
        n.flags &= 32767, gt = n;
        return;
      }
      if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
        gt = t;
        return;
      }
      gt = t = n;
    } while (t !== null);
    Zt = 6, gt = null;
  }
  function iy(t, e, n, i, s, o, f, y, T, C, R, B) {
    t.cancelPendingCommit = null;
    do
      Yo();
    while (Yt !== 0);
    if ((zt & 6) !== 0) throw Error(u(327));
    if (e !== null) {
      if (e === t.current) throw Error(u(177));
      t === Ut && (gt = Ut = null, Tt = 0), ta = e, on = t, xn = n, Dc = s, Kp = i, _S(
        t,
        e,
        n,
        f,
        y,
        T,
        B
      );
    }
  }
  function _S(t, e, n, i, s, o, f) {
    var y = e.lanes | e.childLanes;
    if (Cc = y, y |= cr, s1(
      t,
      n,
      y,
      i,
      s,
      o
    ), qa = null, (n & 335544064) === n ? (Xa = uS(t), i = 10262) : (Xa = null, i = 10256), (e.subtreeFlags & i) !== 0 || (e.flags & i) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, GS(zs, function() {
      return Vc(), null;
    })) : (t.callbackNode = null, t.callbackPriority = 0), Co = !1, i = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || i) {
      i = W.T, W.T = null, s = ut.p, ut.p = 2, o = zt, zt |= 4;
      try {
        CS(t, e, n);
      } finally {
        zt = o, ut.p = s, W.T = i;
      }
    }
    Yt = 1, Co ? Ya = sT(
      f,
      t.containerInfo,
      Xa,
      Rc,
      wc,
      BS,
      Nc,
      Vc,
      US
    ) : (Rc(), wc(), Nc());
  }
  function US(t) {
    if (Yt !== 0) {
      var e = on.onRecoverableError;
      e(t, { componentStack: null });
    }
  }
  function BS() {
    Yt === 3 && (Yt = 0, jp(ta, on), Yt = 4);
  }
  function Rc() {
    if (Yt === 1) {
      Yt = 0;
      var t = on, e = ta, n = xn, i = (e.flags & 13878) !== 0;
      if ((e.subtreeFlags & 13878) !== 0 || i) {
        i = W.T, W.T = null;
        var s = ut.p;
        ut.p = 2;
        var o = zt;
        zt |= 4;
        try {
          ql = Oo = !1, Lp(e, t, n), n = Zc;
          var f = _h(t.containerInfo), y = n.focusedElem, T = n.selectionRange;
          if (f !== y && y && y.ownerDocument && Vh(
            y.ownerDocument.documentElement,
            y
          )) {
            if (T !== null && lr(y)) {
              var C = T.start, R = T.end;
              if (R === void 0 && (R = C), "selectionStart" in y)
                y.selectionStart = C, y.selectionEnd = Math.min(
                  R,
                  y.value.length
                );
              else {
                var B = y.ownerDocument || document, x = B && B.defaultView || window;
                if (x.getSelection) {
                  var O = x.getSelection(), Q = y.textContent.length, $ = Math.min(T.start, Q), mt = T.end === void 0 ? $ : Math.min(T.end, Q);
                  !O.extend && $ > mt && (f = mt, mt = $, $ = f);
                  var M = Nh(
                    y,
                    $
                  ), E = Nh(
                    y,
                    mt
                  );
                  if (M && E && (O.rangeCount !== 1 || O.anchorNode !== M.node || O.anchorOffset !== M.offset || O.focusNode !== E.node || O.focusOffset !== E.offset)) {
                    var D = B.createRange();
                    D.setStart(M.node, M.offset), O.removeAllRanges(), $ > mt ? (O.addRange(D), O.extend(E.node, E.offset)) : (D.setEnd(E.node, E.offset), O.addRange(D));
                  }
                }
              }
            }
            for (B = [], O = y; O = O.parentNode; )
              O.nodeType === 1 && B.push({
                element: O,
                left: O.scrollLeft,
                top: O.scrollTop
              });
            for (typeof y.focus == "function" && y.focus(), y = 0; y < B.length; y++) {
              var _ = B[y];
              _.element.scrollLeft = _.left, _.element.scrollTop = _.top;
            }
          }
          tl = !!Qc, Zc = Qc = null;
        } finally {
          zt = o, ut.p = s, W.T = i;
        }
      }
      t.current = e, Yt = 2;
    }
  }
  function wc() {
    if (Yt === 2) {
      Yt = 0;
      var t = on, e = ta, n = (e.flags & 8772) !== 0;
      if ((e.subtreeFlags & 8772) !== 0 || n) {
        n = W.T, W.T = null;
        var i = ut.p;
        ut.p = 2;
        var s = zt;
        zt |= 4;
        try {
          wp(t, e.alternate, e);
        } finally {
          zt = s, ut.p = i, W.T = n;
        }
      }
      Yt = 3;
    }
  }
  function Nc() {
    if (Yt === 4 || Yt === 3) {
      Yt = 0;
      var t = Ya;
      Ya = null, Ib();
      var e = on, n = ta, i = xn, s = Kp, o = (i & 335544064) === i ? 10262 : 10256;
      if ((n.subtreeFlags & o) !== 0 || (n.flags & o) !== 0 ? Yt = 5 : (Yt = 0, ta = on = null, ay(e, e.pendingLanes)), o = e.pendingLanes, o === 0 && (yi = null), Yu(i), n = n.stateNode, Ue && typeof Ue.onCommitFiberRoot == "function")
        try {
          Ue.onCommitFiberRoot(
            fl,
            n,
            void 0,
            (n.current.flags & 128) === 128
          );
        } catch {
        }
      if (s !== null) {
        n = W.T, o = ut.p, ut.p = 2, W.T = null;
        try {
          for (var f = e.onRecoverableError, y = 0; y < s.length; y++) {
            var T = s[y];
            f(T.value, {
              componentStack: T.stack
            });
          }
        } finally {
          W.T = n, ut.p = o;
        }
      }
      if (s = qa, f = Xa, Xa = null, s !== null && (qa = null, f === null && (f = []), t !== null))
        for (T = 0; T < s.length; T++)
          n = (0, s[T])(
            f
          ), n !== void 0 && t.finished.finally(n);
      (xn & 3) !== 0 && Yo(), Mn(e), o = e.pendingLanes, (i & 261930) !== 0 && (o & 42) !== 0 ? e === Lo ? Kl++ : (Kl = 0, Lo = e) : (Kl = 0, Lo = null), kl(0);
    }
  }
  function ay(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Dl(e)));
  }
  function Yo() {
    return Ya !== null && (Ya.skipTransition(), Ya = null), Rc(), wc(), Nc(), Vc();
  }
  function Vc() {
    if (Yt !== 5) return !1;
    var t = on, e = Cc;
    Cc = 0;
    var n = Yu(xn), i = W.T, s = ut.p;
    try {
      ut.p = 32 > n ? 32 : n, W.T = null, n = Dc, Dc = null;
      var o = on, f = xn;
      if (Yt = 0, ta = on = null, xn = 0, (zt & 6) !== 0) throw Error(u(331));
      var y = zt;
      if (zt |= 4, Xp(o.current), Gp(
        o,
        o.current,
        f,
        n
      ), zt = y, kl(0, !1), Ue && typeof Ue.onPostCommitFiberRoot == "function")
        try {
          Ue.onPostCommitFiberRoot(fl, o);
        } catch {
        }
      return !0;
    } finally {
      ut.p = s, W.T = i, ay(t, e);
    }
  }
  function ly(t, e, n) {
    e = ke(n, e), e = Pr(t.stateNode, e, 2), t = ui(t, e, 2), t !== null && (hl(t, 2), Mn(t));
  }
  function wt(t, e, n) {
    if (t.tag === 3)
      ly(t, t, n);
    else
      for (; e !== null; ) {
        if (e.tag === 3) {
          ly(
            e,
            t,
            n
          );
          break;
        } else if (e.tag === 1) {
          var i = e.stateNode;
          if (typeof e.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (yi === null || !yi.has(i))) {
            t = ke(n, t), n = ep(2), i = ui(e, n, 2), i !== null && (np(
              n,
              i,
              e,
              t
            ), hl(i, 2), Mn(i));
            break;
          }
        }
        e = e.return;
      }
  }
  function _c(t, e, n) {
    var i = t.pingCache;
    if (i === null) {
      i = t.pingCache = new OS();
      var s = /* @__PURE__ */ new Set();
      i.set(e, s);
    } else
      s = i.get(e), s === void 0 && (s = /* @__PURE__ */ new Set(), i.set(e, s));
    s.has(n) || (xc = !0, s.add(n), t = LS.bind(null, t, e, n), e.then(t, t));
  }
  function LS(t, e, n) {
    var i = t.pingCache;
    i !== null && i.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, Ut === t && (Tt & n) === n && ((Zt === 4 || Zt === 3 && (Tt & 62914560) === Tt && 300 > _e() - _o) && (zt & 2) === 0 ? Za(t, 0) : Vo |= n, Ga === Tt && (Ga = 0)), Mn(t);
  }
  function sy(t, e) {
    e === 0 && (e = Zd()), t = Hi(t, e), t !== null && (hl(t, e), Mn(t));
  }
  function HS(t) {
    var e = t.memoizedState, n = 0;
    e !== null && (n = e.retryLane), sy(t, n);
  }
  function jS(t, e) {
    var n = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var i = t.stateNode, s = t.memoizedState;
        s !== null && (n = s.retryLane);
        break;
      case 19:
        i = t.stateNode;
        break;
      case 22:
        i = t.stateNode._retryCache;
        break;
      default:
        throw Error(u(314));
    }
    i !== null && i.delete(e), sy(t, n);
  }
  function GS(t, e) {
    return Lu(t, e);
  }
  var ka = null, Ja = null, Uc = !1, qo = !1, Bc = !1, vi = 0;
  function Mn(t) {
    t !== Ja && t.next === null && (Ja === null ? ka = Ja = t : Ja = Ja.next = t), qo = !0, Uc || (Uc = !0, qS());
  }
  function kl(t, e) {
    if (!Bc && qo) {
      Bc = !0;
      do
        for (var n = !1, i = ka; i !== null; ) {
          if (t !== 0) {
            var s = i.pendingLanes;
            if (s === 0) var o = 0;
            else {
              var f = i.suspendedLanes, y = i.pingedLanes;
              o = (1 << 31 - Be(42 | t) + 1) - 1, o &= s & ~(f & ~y), o = o & 201326741 ? o & 201326741 | 1 : o ? o | 2 : 0;
            }
            o !== 0 && (n = !0, cy(i, o));
          } else
            o = Tt, o = Ns(
              i,
              i === Ut ? o : 0,
              i.cancelPendingCommit !== null || i.timeoutHandle !== -1
            ), (o & 3) === 0 || dl(i, o) || (n = !0, cy(i, o));
          i = i.next;
        }
      while (n);
      Bc = !1;
    }
  }
  function YS() {
    oy();
  }
  function oy() {
    qo = Uc = !1;
    var t = 0;
    vi !== 0 && $S() && (t = vi);
    for (var e = _e(), n = null, i = ka; i !== null; ) {
      var s = i.next, o = uy(i, e);
      o === 0 ? (i.next = null, n === null ? ka = s : n.next = s, s === null && (Ja = n)) : (n = i, (t !== 0 || (o & 3) !== 0) && (qo = !0)), i = s;
    }
    Yt !== 0 && Yt !== 5 || kl(t), vi !== 0 && (vi = 0);
  }
  function uy(t, e) {
    for (var n = t.suspendedLanes, i = t.pingedLanes, s = t.expirationTimes, o = t.pendingLanes & -62914561; 0 < o; ) {
      var f = 31 - Be(o), y = 1 << f, T = s[f];
      T === -1 ? ((y & n) === 0 || (y & i) !== 0) && (s[f] = l1(y, e)) : T <= e && (t.expiredLanes |= y), o &= ~y;
    }
    if (e = Ut, n = Tt, n = Ns(
      t,
      t === e ? n : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), i = t.callbackNode, n === 0 || t === e && (Rt === 2 || Rt === 9) || t.cancelPendingCommit !== null)
      return i !== null && i !== null && Hu(i), t.callbackNode = null, t.callbackPriority = 0;
    if ((n & 3) === 0 || dl(t, n)) {
      if (e = n & -n, e === t.callbackPriority) return e;
      switch (i !== null && Hu(i), Yu(n)) {
        case 2:
        case 8:
          n = qd;
          break;
        case 32:
          n = zs;
          break;
        case 268435456:
          n = Xd;
          break;
        default:
          n = zs;
      }
      return i = ry.bind(null, t), n = Lu(n, i), t.callbackPriority = e, t.callbackNode = n, e;
    }
    return i !== null && i !== null && Hu(i), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function ry(t, e) {
    if (Yt !== 0 && Yt !== 5)
      return t.callbackNode = null, t.callbackPriority = 0, null;
    var n = t.callbackNode;
    if (Yo() && t.callbackNode !== n)
      return null;
    var i = Tt;
    return i = Ns(
      t,
      t === Ut ? i : 0,
      t.cancelPendingCommit !== null || t.timeoutHandle !== -1
    ), i === 0 ? null : (Jp(t, i, e), uy(t, _e()), t.callbackNode != null && t.callbackNode === n ? ry.bind(null, t) : null);
  }
  function cy(t, e) {
    if (Yo()) return null;
    Jp(t, e, !0);
  }
  function qS() {
    eT(function() {
      (zt & 6) !== 0 ? Lu(
        Yd,
        YS
      ) : oy();
    });
  }
  function Lc() {
    if (vi === 0) {
      var t = Qi;
      t === 0 && (t = Os, Os <<= 1, (Os & 261888) === 0 && (Os = 256)), vi = t;
    }
    return vi;
  }
  function fy(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : Ls(t);
  }
  function XS(t, e, n, i, s) {
    if (e === "submit" && n && n.stateNode === s) {
      var o = fy(
        (s[Ce] || null).action
      ), f = i.submitter;
      f && (e = (e = f[Ce] || null) ? fy(e.formAction) : f.getAttribute("formAction"), e !== null && (o = e, f = null));
      var y = new Ys(
        "action",
        "action",
        null,
        i,
        s
      );
      t.push({
        event: y,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (i.defaultPrevented) {
                if (vi !== 0) {
                  var T = new FormData(s, f);
                  Zr(
                    n,
                    {
                      pending: !0,
                      data: T,
                      method: s.method,
                      action: o
                    },
                    null,
                    T
                  );
                }
              } else
                typeof o == "function" && (y.preventDefault(), T = new FormData(s, f), Zr(
                  n,
                  {
                    pending: !0,
                    data: T,
                    method: s.method,
                    action: o
                  },
                  o,
                  T
                ));
            },
            currentTarget: s
          }
        ]
      });
    }
  }
  for (var Hc = 0; Hc < rr.length; Hc++) {
    var jc = rr[Hc], QS = jc.toLowerCase(), ZS = jc[0].toUpperCase() + jc.slice(1);
    nn(
      QS,
      "on" + ZS
    );
  }
  nn(Lh, "onAnimationEnd"), nn(Hh, "onAnimationIteration"), nn(jh, "onAnimationStart"), nn("dblclick", "onDoubleClick"), nn("focusin", "onFocus"), nn("focusout", "onBlur"), nn(tS, "onTransitionRun"), nn(eS, "onTransitionStart"), nn(nS, "onTransitionCancel"), nn(Gh, "onTransitionEnd"), ya("onMouseEnter", ["mouseout", "mouseover"]), ya("onMouseLeave", ["mouseout", "mouseover"]), ya("onPointerEnter", ["pointerout", "pointerover"]), ya("onPointerLeave", ["pointerout", "pointerover"]), Ui(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), Ui(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), Ui("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), Ui(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), Ui(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), Ui(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var Jl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), KS = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Jl)
  );
  function dy(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var i = t[n], s = i.event;
      i = i.listeners;
      t: {
        var o = void 0;
        if (e)
          for (var f = i.length - 1; 0 <= f; f--) {
            var y = i[f], T = y.instance, C = y.currentTarget;
            if (y = y.listener, T !== o && s.isPropagationStopped())
              break t;
            o = y, s.currentTarget = C;
            try {
              o(s);
            } catch (R) {
              Qs(R);
            }
            s.currentTarget = null, o = T;
          }
        else
          for (f = 0; f < i.length; f++) {
            if (y = i[f], T = y.instance, C = y.currentTarget, y = y.listener, T !== o && s.isPropagationStopped())
              break t;
            o = y, s.currentTarget = C;
            try {
              o(s);
            } catch (R) {
              Qs(R);
            }
            s.currentTarget = null, o = T;
          }
      }
    }
  }
  function vt(t, e) {
    var n = e[Id];
    n === void 0 && (n = e[Id] = /* @__PURE__ */ new Set());
    var i = t + "__bubble";
    n.has(i) || (hy(e, t, 2, !1), n.add(i));
  }
  function Gc(t, e, n) {
    var i = 0;
    e && (i |= 4), hy(
      n,
      t,
      i,
      e
    );
  }
  var Xo = "_reactListening" + Math.random().toString(36).slice(2);
  function Yc(t) {
    if (!t[Xo]) {
      t[Xo] = !0, th.forEach(function(n) {
        n !== "selectionchange" && (KS.has(n) || Gc(n, !1, t), Gc(n, !0, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Xo] || (e[Xo] = !0, Gc("selectionchange", !1, e));
    }
  }
  function hy(t, e, n, i) {
    switch (ng(e)) {
      case 2:
        var s = HT;
        break;
      case 8:
        s = jT;
        break;
      default:
        s = uf;
    }
    n = s.bind(
      null,
      e,
      n,
      t
    ), s = void 0, !Fu || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (s = !0), i ? s !== void 0 ? t.addEventListener(e, n, {
      capture: !0,
      passive: s
    }) : t.addEventListener(e, n, !0) : s !== void 0 ? t.addEventListener(e, n, {
      passive: s
    }) : t.addEventListener(e, n, !1);
  }
  function qc(t, e, n, i, s) {
    var o = i;
    if ((e & 1) === 0 && (e & 2) === 0 && i !== null)
      t: for (; ; ) {
        if (i === null) return;
        var f = i.tag;
        if (f === 3 || f === 4) {
          var y = i.stateNode.containerInfo;
          if (y === s) break;
          if (f === 4)
            for (f = i.return; f !== null; ) {
              var T = f.tag;
              if ((T === 3 || T === 4) && f.stateNode.containerInfo === s)
                return;
              f = f.return;
            }
          for (; y !== null; ) {
            if (f = _i(y), f === null) return;
            if (T = f.tag, T === 5 || T === 6 || T === 26 || T === 27) {
              i = o = f;
              continue t;
            }
            y = y.parentNode;
          }
        }
        i = i.return;
      }
    hh(function() {
      var C = o, R = ku(n), B = [];
      t: {
        var x = Yh.get(t);
        if (x !== void 0) {
          var O = Ys, Q = t;
          switch (t) {
            case "keypress":
              if (js(n) === 0) break t;
            case "keydown":
            case "keyup":
              O = R1;
              break;
            case "focusin":
              Q = "focus", O = $u;
              break;
            case "focusout":
              Q = "blur", O = $u;
              break;
            case "beforeblur":
            case "afterblur":
              O = $u;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              O = yh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              O = v1;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              O = U1;
              break;
            case Lh:
            case Hh:
            case jh:
              O = T1;
              break;
            case Gh:
              O = L1;
              break;
            case "scroll":
            case "scrollend":
              O = y1;
              break;
            case "wheel":
              O = j1;
              break;
            case "copy":
            case "cut":
            case "paste":
              O = A1;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              O = vh;
              break;
            case "submit":
              O = V1;
              break;
            case "toggle":
            case "beforetoggle":
              O = Y1;
          }
          var $ = (e & 4) !== 0, mt = !$ && (t === "scroll" || t === "scrollend"), M = $ ? x !== null ? x + "Capture" : null : x;
          $ = [];
          for (var E = C, D; E !== null; ) {
            var _ = E;
            if (D = _.stateNode, _ = _.tag, _ !== 5 && _ !== 26 && _ !== 27 || D === null || M === null || (_ = yl(E, M), _ != null && $.push(
              Fl(E, _, D)
            )), mt) break;
            E = E.return;
          }
          0 < $.length && (x = new O(
            x,
            Q,
            null,
            n,
            R
          ), B.push({ event: x, listeners: $ }));
        }
      }
      if ((e & 7) === 0) {
        t: {
          if (O = t === "mouseover" || t === "pointerover", x = t === "mouseout" || t === "pointerout", O && n !== Ku && (Q = n.relatedTarget || n.fromElement) && (_i(Q) || Q[ha]))
            break t;
          (x || O) && (Q = R.window === R ? R : (O = R.ownerDocument) ? O.defaultView || O.parentWindow : window, x ? (O = n.relatedTarget || n.toElement, x = C, O = O ? _i(O) : null, O !== null && (mt = h(O), $ = O.tag, O !== mt || $ !== 5 && $ !== 27 && $ !== 6) && (O = null)) : (x = null, O = C), x !== O && ($ = yh, _ = "onMouseLeave", M = "onMouseEnter", E = "mouse", (t === "pointerout" || t === "pointerover") && ($ = vh, _ = "onPointerLeave", M = "onPointerEnter", E = "pointer"), mt = x == null ? Q : pl(x), D = O == null ? Q : pl(O), Q = new $(
            _,
            E + "leave",
            x,
            n,
            R
          ), Q.target = mt, Q.relatedTarget = D, _ = null, _i(R) === C && ($ = new $(
            M,
            E + "enter",
            O,
            n,
            R
          ), $.target = D, $.relatedTarget = mt, _ = $), mt = _, $ = x && O ? st(
            x,
            O,
            kS
          ) : null, x !== null && my(
            B,
            Q,
            x,
            $,
            !1
          ), O !== null && mt !== null && my(
            B,
            mt,
            O,
            $,
            !0
          )));
        }
        t: {
          if (x = C ? pl(C) : window, O = x.nodeName && x.nodeName.toLowerCase(), O === "select" || O === "input" && x.type === "file")
            var J = Ch;
          else if (xh(x))
            if (Dh)
              J = I1;
            else {
              J = F1;
              var Et = J1;
            }
          else
            O = x.nodeName, !O || O.toLowerCase() !== "input" || x.type !== "checkbox" && x.type !== "radio" ? C && Zu(C.elementType) && (J = Ch) : J = P1;
          if (J && (J = J(t, C))) {
            Mh(
              B,
              J,
              n,
              R
            );
            break t;
          }
          Et && Et(t, x, C);
        }
        switch (Et = C ? pl(C) : window, t) {
          case "focusin":
            (xh(Et) || Et.contentEditable === "true") && (Ea = Et, sr = C, xl = null);
            break;
          case "focusout":
            xl = sr = Ea = null;
            break;
          case "mousedown":
            or = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            or = !1, Uh(B, n, R);
            break;
          case "selectionchange":
            if ($1) break;
          case "keydown":
          case "keyup":
            Uh(B, n, R);
        }
        var at;
        if (er)
          t: {
            switch (t) {
              case "compositionstart":
                var rt = "onCompositionStart";
                break t;
              case "compositionend":
                rt = "onCompositionEnd";
                break t;
              case "compositionupdate":
                rt = "onCompositionUpdate";
                break t;
            }
            rt = void 0;
          }
        else
          Ta ? Eh(t, n) && (rt = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (rt = "onCompositionStart");
        rt && (bh && n.locale !== "ko" && (Ta || rt !== "onCompositionStart" ? rt === "onCompositionEnd" && Ta && (at = mh()) : ($n = R, Pu = "value" in $n ? $n.value : $n.textContent, Ta = !0)), Et = Qo(C, rt), 0 < Et.length && (rt = new gh(
          rt,
          t,
          null,
          n,
          R
        ), B.push({ event: rt, listeners: Et }), at ? rt.data = at : (at = Ah(n), at !== null && (rt.data = at)))), (at = X1 ? Q1(t, n) : Z1(t, n)) && (rt = Qo(C, "onBeforeInput"), 0 < rt.length && (Et = new gh(
          "onBeforeInput",
          "beforeinput",
          null,
          n,
          R
        ), B.push({
          event: Et,
          listeners: rt
        }), Et.data = at)), XS(
          B,
          t,
          C,
          n,
          R
        );
      }
      dy(B, e);
    });
  }
  function Fl(t, e, n) {
    return {
      instance: t,
      listener: e,
      currentTarget: n
    };
  }
  function Qo(t, e) {
    for (var n = e + "Capture", i = []; t !== null; ) {
      var s = t, o = s.stateNode;
      if (s = s.tag, s !== 5 && s !== 26 && s !== 27 || o === null || (s = yl(t, n), s != null && i.unshift(
        Fl(t, s, o)
      ), s = yl(t, e), s != null && i.push(
        Fl(t, s, o)
      )), t.tag === 3) return i;
      t = t.return;
    }
    return [];
  }
  function kS(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function my(t, e, n, i, s) {
    for (var o = e._reactName, f = []; n !== null && n !== i; ) {
      var y = n, T = y.alternate, C = y.stateNode;
      if (y = y.tag, T !== null && T === i) break;
      y !== 5 && y !== 26 && y !== 27 || C === null || (T = C, s ? (C = yl(n, o), C != null && f.unshift(
        Fl(n, C, T)
      )) : s || (C = yl(n, o), C != null && f.push(
        Fl(n, C, T)
      ))), n = n.return;
    }
    f.length !== 0 && t.push({ event: e, listeners: f });
  }
  var JS = /\r\n?/g, FS = /\u0000|\uFFFD/g;
  function py(t) {
    return (typeof t == "string" ? t : "" + t).replace(JS, `
`).replace(FS, "");
  }
  function yy(t, e) {
    return e = py(e), py(t) === e;
  }
  function Nt(t, e, n, i, s, o) {
    switch (n) {
      case "children":
        if (typeof i == "string")
          e === "body" || e === "textarea" && i === "" || va(t, i);
        else if (typeof i == "number" || typeof i == "bigint")
          e !== "body" && va(t, "" + i);
        else return;
        break;
      case "className":
        Bs(t, "class", i);
        break;
      case "tabIndex":
        Bs(t, "tabindex", i);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        Bs(t, n, i);
        break;
      case "style":
        fh(t, i, o);
        return;
      case "data":
        if (e !== "object") {
          Bs(t, "data", i);
          break;
        }
      case "src":
      case "href":
        if (i === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (i == null || typeof i == "function" || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        i = Ls(i), t.setAttribute(n, i);
        break;
      case "action":
      case "formAction":
        if (typeof i == "function") {
          t.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof o == "function" && (n === "formAction" ? (e !== "input" && Nt(t, e, "name", s.name, s, null), Nt(
            t,
            e,
            "formEncType",
            s.formEncType,
            s,
            null
          ), Nt(
            t,
            e,
            "formMethod",
            s.formMethod,
            s,
            null
          ), Nt(
            t,
            e,
            "formTarget",
            s.formTarget,
            s,
            null
          )) : (Nt(t, e, "encType", s.encType, s, null), Nt(t, e, "method", s.method, s, null), Nt(t, e, "target", s.target, s, null)));
        if (i == null || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        i = Ls(i), t.setAttribute(n, i);
        break;
      case "onClick":
        i != null && (t.onclick = pn);
        return;
      case "onScroll":
        i != null && vt("scroll", t);
        return;
      case "onScrollEnd":
        i != null && vt("scrollend", t);
        return;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(u(61));
          if (n = i.__html, n != null) {
            if (s.children != null) throw Error(u(60));
            (o != null ? o.__html : void 0) !== n && (t.innerHTML = n);
          }
        }
        break;
      case "multiple":
        t.multiple = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "muted":
        t.muted = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (i == null || typeof i == "function" || typeof i == "boolean" || typeof i == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        n = Ls(i), t.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          n
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        i != null && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        i && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        i === !0 ? t.setAttribute(n, "") : i !== !1 && i != null && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        i != null && typeof i != "function" && typeof i != "symbol" && !isNaN(i) && 1 <= i ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i) ? t.removeAttribute(n) : t.setAttribute(n, i);
        break;
      case "popover":
        vt("beforetoggle", t), vt("toggle", t), Us(t, "popover", i);
        break;
      case "xlinkActuate":
        Nn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          i
        );
        break;
      case "xlinkArcrole":
        Nn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          i
        );
        break;
      case "xlinkRole":
        Nn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          i
        );
        break;
      case "xlinkShow":
        Nn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          i
        );
        break;
      case "xlinkTitle":
        Nn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          i
        );
        break;
      case "xlinkType":
        Nn(
          t,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          i
        );
        break;
      case "xmlBase":
        Nn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          i
        );
        break;
      case "xmlLang":
        Nn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          i
        );
        break;
      case "xmlSpace":
        Nn(
          t,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          i
        );
        break;
      case "is":
        Us(t, "is", i);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N")
          n = m1.get(n) || n, Us(t, n, i);
        else return;
    }
    Dt = !0;
  }
  function Xc(t, e, n, i, s, o) {
    switch (n) {
      case "style":
        fh(t, i, o);
        return;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(u(61));
          if (n = i.__html, n != null) {
            if (s.children != null) throw Error(u(60));
            (o != null ? o.__html : void 0) !== n && (t.innerHTML = n);
          }
        }
        break;
      case "children":
        if (typeof i == "string") va(t, i);
        else if (typeof i == "number" || typeof i == "bigint")
          va(t, "" + i);
        else return;
        break;
      case "onScroll":
        i != null && vt("scroll", t);
        return;
      case "onScrollEnd":
        i != null && vt("scrollend", t);
        return;
      case "onClick":
        i != null && (t.onclick = pn);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!eh.hasOwnProperty(n))
          t: {
            if (n[0] === "o" && n[1] === "n" && (s = n.endsWith("Capture"), o = n.slice(2, s ? n.length - 7 : void 0), e = t[Ce] || null, e = e != null ? e[n] : null, typeof e == "function" && t.removeEventListener(o, e, s), typeof i == "function")) {
              typeof e != "function" && e !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(o, i, s);
              break t;
            }
            Dt = !0, n in t ? t[n] = i : i === !0 ? t.setAttribute(n, "") : Us(t, n, i);
          }
        return;
    }
    Dt = !0;
  }
  function pe(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        vt("error", t), vt("load", t);
        var i = !1, s = !1, o;
        for (o in n)
          if (n.hasOwnProperty(o)) {
            var f = n[o];
            if (f != null)
              switch (o) {
                case "src":
                  i = !0;
                  break;
                case "srcSet":
                  s = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(u(137, e));
                default:
                  Nt(t, e, o, f, n, null);
              }
          }
        s && Nt(t, e, "srcSet", n.srcSet, n, null), i && Nt(t, e, "src", n.src, n, null);
        return;
      case "input":
        vt("invalid", t);
        var y = o = f = s = null, T = null, C = null;
        for (i in n)
          if (n.hasOwnProperty(i)) {
            var R = n[i];
            if (R != null)
              switch (i) {
                case "name":
                  s = R;
                  break;
                case "type":
                  f = R;
                  break;
                case "checked":
                  T = R;
                  break;
                case "defaultChecked":
                  C = R;
                  break;
                case "value":
                  o = R;
                  break;
                case "defaultValue":
                  y = R;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (R != null)
                    throw Error(u(137, e));
                  break;
                default:
                  Nt(t, e, i, R, n, null);
              }
          }
        oh(
          t,
          o,
          y,
          T,
          C,
          f,
          s,
          !1
        );
        return;
      case "select":
        vt("invalid", t), i = f = o = null;
        for (s in n)
          if (n.hasOwnProperty(s) && (y = n[s], y != null))
            switch (s) {
              case "value":
                o = y;
                break;
              case "defaultValue":
                f = y;
                break;
              case "multiple":
                i = y;
              default:
                Nt(t, e, s, y, n, null);
            }
        e = o, n = f, t.multiple = !!i, e != null ? ga(t, !!i, e, !1) : n != null && ga(t, !!i, n, !0);
        return;
      case "textarea":
        vt("invalid", t), o = s = i = null;
        for (f in n)
          if (n.hasOwnProperty(f) && (y = n[f], y != null))
            switch (f) {
              case "value":
                i = y;
                break;
              case "defaultValue":
                s = y;
                break;
              case "children":
                o = y;
                break;
              case "dangerouslySetInnerHTML":
                if (y != null) throw Error(u(91));
                break;
              default:
                Nt(t, e, f, y, n, null);
            }
        rh(t, i, s, o);
        return;
      case "option":
        for (T in n)
          if (n.hasOwnProperty(T) && (i = n[T], i != null))
            switch (T) {
              case "selected":
                t.selected = i && typeof i != "function" && typeof i != "symbol";
                break;
              default:
                Nt(t, e, T, i, n, null);
            }
        return;
      case "dialog":
        vt("beforetoggle", t), vt("toggle", t), vt("cancel", t), vt("close", t);
        break;
      case "iframe":
      case "object":
        vt("load", t);
        break;
      case "video":
      case "audio":
        for (i = 0; i < Jl.length; i++)
          vt(Jl[i], t);
        break;
      case "image":
        vt("error", t), vt("load", t);
        break;
      case "details":
        vt("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        vt("error", t), vt("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (C in n)
          if (n.hasOwnProperty(C) && (i = n[C], i != null))
            switch (C) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(u(137, e));
              default:
                Nt(t, e, C, i, n, null);
            }
        return;
      default:
        if (Zu(e)) {
          for (R in n)
            n.hasOwnProperty(R) && (i = n[R], i !== void 0 && Xc(
              t,
              e,
              R,
              i,
              n,
              void 0
            ));
          return;
        }
    }
    for (y in n)
      n.hasOwnProperty(y) && (i = n[y], i != null && Nt(t, e, y, i, n, null));
  }
  var PS = {};
  function IS(t, e, n, i) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var s = null, o = null, f = null, y = null, T = null, C = null, R = null;
        for (O in n) {
          var B = n[O];
          if (n.hasOwnProperty(O) && B != null)
            switch (O) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                T = B;
              default:
                i.hasOwnProperty(O) || Nt(t, e, O, null, i, B);
            }
        }
        for (var x in i) {
          var O = i[x];
          if (B = n[x], i.hasOwnProperty(x) && (O != null || B != null))
            switch (x) {
              case "type":
                O !== B && (Dt = !0), o = O;
                break;
              case "name":
                O !== B && (Dt = !0), s = O;
                break;
              case "checked":
                O !== B && (Dt = !0), C = O;
                break;
              case "defaultChecked":
                O !== B && (Dt = !0), R = O;
                break;
              case "value":
                O !== B && (Dt = !0), f = O;
                break;
              case "defaultValue":
                O !== B && (Dt = !0), y = O;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (O != null)
                  throw Error(u(137, e));
                break;
              default:
                O !== B && Nt(
                  t,
                  e,
                  x,
                  O,
                  i,
                  B
                );
            }
        }
        Xu(
          t,
          f,
          y,
          T,
          C,
          R,
          o,
          s
        );
        return;
      case "select":
        O = f = y = x = null;
        for (o in n)
          if (T = n[o], n.hasOwnProperty(o) && T != null)
            switch (o) {
              case "value":
                break;
              case "multiple":
                O = T;
              default:
                i.hasOwnProperty(o) || Nt(
                  t,
                  e,
                  o,
                  null,
                  i,
                  T
                );
            }
        for (s in i)
          if (o = i[s], T = n[s], i.hasOwnProperty(s) && (o != null || T != null))
            switch (s) {
              case "value":
                o !== T && (Dt = !0), x = o;
                break;
              case "defaultValue":
                o !== T && (Dt = !0), y = o;
                break;
              case "multiple":
                o !== T && (Dt = !0), f = o;
              default:
                o !== T && Nt(
                  t,
                  e,
                  s,
                  o,
                  i,
                  T
                );
            }
        e = y, n = f, i = O, x != null ? ga(t, !!n, x, !1) : !!i != !!n && (e != null ? ga(t, !!n, e, !0) : ga(t, !!n, n ? [] : "", !1));
        return;
      case "textarea":
        O = x = null;
        for (y in n)
          if (s = n[y], n.hasOwnProperty(y) && s != null && !i.hasOwnProperty(y))
            switch (y) {
              case "value":
                break;
              case "children":
                break;
              default:
                Nt(t, e, y, null, i, s);
            }
        for (f in i)
          if (s = i[f], o = n[f], i.hasOwnProperty(f) && (s != null || o != null))
            switch (f) {
              case "value":
                s !== o && (Dt = !0), x = s;
                break;
              case "defaultValue":
                s !== o && (Dt = !0), O = s;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (s != null) throw Error(u(91));
                break;
              default:
                s !== o && Nt(t, e, f, s, i, o);
            }
        uh(t, x, O);
        return;
      case "option":
        for (var Q in n)
          if (x = n[Q], n.hasOwnProperty(Q) && x != null && !i.hasOwnProperty(Q))
            switch (Q) {
              case "selected":
                t.selected = !1;
                break;
              default:
                Nt(
                  t,
                  e,
                  Q,
                  null,
                  i,
                  x
                );
            }
        for (T in i)
          if (x = i[T], O = n[T], i.hasOwnProperty(T) && x !== O && (x != null || O != null))
            switch (T) {
              case "selected":
                x !== O && (Dt = !0), t.selected = x && typeof x != "function" && typeof x != "symbol";
                break;
              default:
                Nt(
                  t,
                  e,
                  T,
                  x,
                  i,
                  O
                );
            }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var $ in n)
          x = n[$], n.hasOwnProperty($) && x != null && !i.hasOwnProperty($) && Nt(t, e, $, null, i, x);
        for (C in i)
          if (x = i[C], O = n[C], i.hasOwnProperty(C) && x !== O && (x != null || O != null))
            switch (C) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (x != null)
                  throw Error(u(137, e));
                break;
              default:
                Nt(
                  t,
                  e,
                  C,
                  x,
                  i,
                  O
                );
            }
        return;
      default:
        if (Zu(e)) {
          for (var mt in n)
            x = n[mt], n.hasOwnProperty(mt) && x !== void 0 && !i.hasOwnProperty(mt) && Xc(
              t,
              e,
              mt,
              void 0,
              i,
              x
            );
          for (R in i)
            x = i[R], O = n[R], !i.hasOwnProperty(R) || x === O || x === void 0 && O === void 0 || Xc(
              t,
              e,
              R,
              x,
              i,
              O
            );
          return;
        }
    }
    for (var M in n)
      x = n[M], n.hasOwnProperty(M) && x != null && !i.hasOwnProperty(M) && Nt(t, e, M, null, i, x);
    for (B in i)
      x = i[B], O = n[B], !i.hasOwnProperty(B) || x === O || x == null && O == null || Nt(t, e, B, x, i, O);
  }
  function gy(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function WS() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), i = 0; i < n.length; i++) {
        var s = n[i], o = s.transferSize, f = s.initiatorType, y = s.duration;
        if (o && y && gy(f)) {
          for (f = 0, y = s.responseEnd, i += 1; i < n.length; i++) {
            var T = n[i], C = T.startTime;
            if (C > y) break;
            var R = T.transferSize, B = T.initiatorType;
            R && gy(B) && (T = T.responseEnd, f += R * (T < y ? 1 : (y - C) / (T - C)));
          }
          if (--i, e += 8 * (o + f) / (s.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var Qc = null, Zc = null;
  function Pl(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function vy(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function by(t, e) {
    if (t === 0)
      switch (e) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function Sy(t, e, n, i) {
    return n = Pl(
      n
    ).createElement(t), n[ce] = i, n[Ce] = e, pe(n, t, e), le(n), n;
  }
  function Kc(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var kc = null;
  function $S() {
    var t = window.event;
    return t && t.type === "popstate" ? t === kc ? !1 : (kc = t, !0) : (kc = null, !1);
  }
  var Jc = typeof setTimeout == "function" ? setTimeout : void 0, tT = typeof clearTimeout == "function" ? clearTimeout : void 0, Ty = typeof Promise == "function" ? Promise : void 0, Ey = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Jc, eT = typeof queueMicrotask == "function" ? queueMicrotask : typeof Ty < "u" ? function(t) {
    return Ty.resolve(null).then(t).catch(nT);
  } : Jc;
  function nT(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function bi(t) {
    return t === "head";
  }
  function Ay(t, e) {
    var n = e, i = 0;
    do {
      var s = n.nextSibling;
      if (t.removeChild(n), s && s.nodeType === 8)
        if (n = s.data, n === "/$" || n === "/&") {
          if (i === 0) {
            t.removeChild(s), el(e);
            return;
          }
          i--;
        } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&")
          i++;
        else if (n === "html")
          nf(
            t.ownerDocument.documentElement
          );
        else if (n === "head") {
          n = t.ownerDocument.head, nf(n);
          for (var o = n.firstChild; o; ) {
            var f = o.nextSibling, y = o.nodeName;
            o[ml] || y === "SCRIPT" || y === "STYLE" || y === "LINK" && o.rel.toLowerCase() === "stylesheet" || n.removeChild(o), o = f;
          }
        } else
          n === "body" && nf(t.ownerDocument.body);
      n = s;
    } while (n);
    el(e);
  }
  function xy(t, e) {
    var n = t;
    t = 0;
    do {
      var i = n.nextSibling;
      if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), i && i.nodeType === 8)
        if (n = i.data, n === "/$") {
          if (t === 0) break;
          t--;
        } else
          n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
      n = i;
    } while (n);
  }
  function My(t, e, n) {
    if (e = CSS.escape(e) !== e ? "r-" + btoa(e).replace(/=/g, "") : e, t.style.viewTransitionName = e, n != null && (t.style.viewTransitionClass = n), n = getComputedStyle(t), n.display === "inline") {
      if (e = t.getClientRects(), e.length === 1) var i = 1;
      else
        for (var s = i = 0; s < e.length; s++) {
          var o = e[s];
          0 < o.width && 0 < o.height && i++;
        }
      i === 1 && (t = t.style, t.display = e.length === 1 ? "inline-block" : "block", t.marginTop = "-" + n.paddingTop, t.marginBottom = "-" + n.paddingBottom);
    }
  }
  function Cy(t, e) {
    t = t.style, e = e.style;
    var n = e != null ? e.hasOwnProperty("viewTransitionName") ? e.viewTransitionName : e.hasOwnProperty("view-transition-name") ? e["view-transition-name"] : null : null;
    t.viewTransitionName = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), n = e != null ? e.hasOwnProperty("viewTransitionClass") ? e.viewTransitionClass : e.hasOwnProperty("view-transition-class") ? e["view-transition-class"] : null : null, t.viewTransitionClass = n == null || typeof n == "boolean" ? "" : ("" + n).trim(), t.display === "inline-block" && (e == null ? t.display = t.margin = "" : (n = e.display, t.display = n == null || typeof n == "boolean" ? "" : n, n = e.margin, n != null ? t.margin = n : (n = e.hasOwnProperty("marginTop") ? e.marginTop : e["margin-top"], t.marginTop = n == null || typeof n == "boolean" ? "" : n, e = e.hasOwnProperty("marginBottom") ? e.marginBottom : e["margin-bottom"], t.marginBottom = e == null || typeof e == "boolean" ? "" : e)));
  }
  function iT(t, e, n) {
    return n = n.ownerDocument.defaultView, {
      rect: t,
      abs: e.position === "absolute" || e.position === "fixed",
      clip: e.clipPath !== "none" || e.overflow !== "visible" || e.filter !== "none" || e.mask !== "none" || e.mask !== "none" || e.borderRadius !== "0px",
      view: 0 <= t.bottom && 0 <= t.right && t.top <= n.innerHeight && t.left <= n.innerWidth
    };
  }
  function Fc(t) {
    var e = t.getBoundingClientRect(), n = getComputedStyle(t);
    return iT(e, n, t);
  }
  function aT(t) {
    return t.documentElement.clientHeight;
  }
  function lT(t) {
    this.addEventListener("load", t), this.addEventListener("error", t);
  }
  function sT(t, e, n, i, s, o, f, y, T) {
    var C = e.nodeType === 9 ? e : e.ownerDocument;
    try {
      var R = C.startViewTransition({
        update: function() {
          var x = C.defaultView, O = x.navigation && x.navigation.transition, Q = C.fonts.status;
          i();
          var $ = [];
          if (Q === "loaded" && (aT(C), C.fonts.status === "loading" && $.push(C.fonts.ready)), Q = $.length, t !== null)
            for (var mt = t.suspenseyImages, M = 0, E = 0; E < mt.length; E++) {
              var D = mt[E];
              if (!D.complete) {
                var _ = D.getBoundingClientRect();
                if (0 < _.bottom && 0 < _.right && _.top < x.innerHeight && _.left < x.innerWidth) {
                  if (M += ky(D), M > ko) {
                    $.length = Q;
                    break;
                  }
                  D = new Promise(
                    lT.bind(D)
                  ), $.push(D);
                }
              }
            }
          if (0 < $.length)
            return x = Promise.race([
              Promise.all($),
              new Promise(function(J) {
                return setTimeout(J, 500);
              })
            ]).then(s, s), (O ? Promise.allSettled([O.finished, x]) : x).then(o, o);
          if (s(), O)
            return O.finished.then(
              o,
              o
            );
          o();
        },
        types: n
      });
      C.__reactViewTransition = R;
      var B = [];
      return R.ready.then(
        function() {
          for (var x = C.documentElement.getAnimations({
            subtree: !0
          }), O = 0; O < x.length; O++) {
            var Q = x[O], $ = Q.effect, mt = $.pseudoElement;
            if (mt != null && mt.startsWith("::view-transition")) {
              B.push(Q), Q = $.getKeyframes();
              for (var M = mt = void 0, E = !0, D = 0; D < Q.length; D++) {
                var _ = Q[D], J = _.width;
                if (mt === void 0) mt = J;
                else if (mt !== J) {
                  E = !1;
                  break;
                }
                if (J = _.height, M === void 0) M = J;
                else if (M !== J) {
                  E = !1;
                  break;
                }
                delete _.width, delete _.height, _.transform === "none" && delete _.transform;
              }
              E && mt !== void 0 && M !== void 0 && ($.setKeyframes(Q), E = getComputedStyle(
                $.target,
                $.pseudoElement
              ), E.width !== mt || E.height !== M) && (E = Q[0], E.width = mt, E.height = M, E = Q[Q.length - 1], E.width = mt, E.height = M, $.setKeyframes(Q));
            }
          }
          f();
        },
        function(x) {
          C.__reactViewTransition === R && (C.__reactViewTransition = null);
          try {
            if (typeof x == "object" && x !== null)
              switch (x.name) {
                case "InvalidStateError":
                  (x.message === "View transition was skipped because document visibility state is hidden." || x.message === "Skipping view transition because document visibility state has become hidden." || x.message === "Skipping view transition because viewport size changed." || x.message === "Transition was aborted because of invalid state") && (x = null);
              }
            x !== null && T(x);
          } finally {
            i(), s(), f();
          }
        }
      ), R.finished.finally(function() {
        for (var x = 0; x < B.length; x++)
          B[x].cancel();
        C.__reactViewTransition === R && (C.__reactViewTransition = null), y();
      }), R;
    } catch {
      return i(), s(), f(), null;
    }
  }
  function ea(t, e) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + t + "(" + e + ")";
  }
  ea.prototype.animate = function(t, e) {
    return e = typeof e == "number" ? { duration: e } : Z({}, e), e.pseudoElement = this._selector, this._scope.animate(t, e);
  }, ea.prototype.getAnimations = function() {
    for (var t = this._scope, e = this._selector, n = t.getAnimations({ subtree: !0 }), i = [], s = 0; s < n.length; s++) {
      var o = n[s].effect;
      o !== null && o.target === t && o.pseudoElement === e && i.push(n[s]);
    }
    return i;
  }, ea.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function Dy(t) {
    return {
      name: t,
      group: new ea("group", t),
      imagePair: new ea("image-pair", t),
      old: new ea("old", t),
      new: new ea("new", t)
    };
  }
  function Qe(t) {
    this._fragmentFiber = t, this._observers = this._eventListeners = null;
  }
  Qe.prototype.addEventListener = function(t, e, n) {
    var i = null, s = null;
    if (!(n != null && typeof n != "boolean" && (i = n.signal || null, i !== null && i.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var o = this._eventListeners;
      if (Oy(o, t, e, n) === -1) {
        var f = this, y = e;
        n != null && typeof n != "boolean" && n.once === !0 && (y = function(T) {
          f.removeEventListener(
            t,
            e,
            n
          ), typeof e == "function" ? e.call(this, T) : e.handleEvent(T);
        }), i !== null && (s = f.removeEventListener.bind(
          f,
          t,
          e,
          n
        ), i.addEventListener("abort", s, { once: !0 }), s = i.removeEventListener.bind(i, "abort", s)), i = Fa(n), o.push({
          type: t,
          listener: e,
          optionsOrUseCapture: n,
          attachedListener: y,
          cleanup: s
        }), p(
          this._fragmentFiber.child,
          !1,
          oT,
          t,
          y,
          i
        );
      }
      this._eventListeners = o;
    }
  };
  function oT(t, e, n, i) {
    return N(t).addEventListener(
      e,
      n,
      i
    ), !1;
  }
  Qe.prototype.removeEventListener = function(t, e, n) {
    var i = this._eventListeners;
    if (i !== null && (e = Oy(
      i,
      t,
      e,
      n
    ), e !== -1)) {
      var s = i[e];
      n = s.attachedListener;
      var o = s.cleanup;
      s = Fa(s.optionsOrUseCapture), p(
        this._fragmentFiber.child,
        !1,
        uT,
        t,
        n,
        s
      ), i.splice(e, 1), o !== null && o();
    }
  };
  function uT(t, e, n, i) {
    return N(t).removeEventListener(
      e,
      n,
      i
    ), !1;
  }
  function Fa(t) {
    return t != null && typeof t != "boolean" && (t.once === !0 || t.signal instanceof AbortSignal) ? { capture: t.capture, passive: t.passive } : t;
  }
  function zy(t) {
    return t == null ? "c=0" : typeof t == "boolean" ? "c=" + (t ? "1" : "0") : "c=" + (t.capture ? "1" : "0");
  }
  function Oy(t, e, n, i) {
    if (t.length === 0) return -1;
    i = zy(i);
    for (var s = 0; s < t.length; s++) {
      var o = t[s];
      if (o.type === e && o.listener === n && zy(o.optionsOrUseCapture) === i)
        return s;
    }
    return -1;
  }
  Qe.prototype.dispatchEvent = function(t) {
    var e = S(
      this._fragmentFiber
    );
    if (e === null) return !0;
    e = N(e);
    var n = this._eventListeners;
    if (n !== null && 0 < n.length || !t.bubbles) {
      var i = e.nodeType === 9 ? e.createComment("") : document.createTextNode("");
      if (n)
        for (var s = 0; s < n.length; s++) {
          var o = n[s];
          i.addEventListener(
            o.type,
            o.attachedListener,
            Fa(o.optionsOrUseCapture)
          );
        }
      if (e.appendChild(i), t = i.dispatchEvent(t), n)
        for (s = 0; s < n.length; s++)
          o = n[s], i.removeEventListener(
            o.type,
            o.attachedListener,
            Fa(o.optionsOrUseCapture)
          );
      return e.removeChild(i), t;
    }
    return e.dispatchEvent(t);
  }, Qe.prototype.focus = function(t) {
    p(
      this._fragmentFiber.child,
      !0,
      Ry,
      t,
      void 0,
      void 0
    );
  };
  function Ry(t, e) {
    return t.tag === 6 ? !1 : (t = N(t), ST(t, e));
  }
  Qe.prototype.focusLast = function(t) {
    var e = [];
    p(
      this._fragmentFiber.child,
      !0,
      Pc,
      e,
      void 0,
      void 0
    );
    for (var n = e.length - 1; 0 <= n && !Ry(e[n], t); n--) ;
  };
  function Pc(t, e) {
    return e.push(t), !1;
  }
  Qe.prototype.blur = function() {
    var t = S(
      this._fragmentFiber
    );
    t !== null && (t = N(t), t = Pl(t).activeElement, t !== null && p(
      this._fragmentFiber.child,
      !1,
      rT,
      t,
      void 0,
      void 0
    ));
  };
  function rT(t, e) {
    return t.tag === 6 ? !1 : (t = N(t), t === e || t.contains(e) ? (e.blur(), !0) : !1);
  }
  Qe.prototype.observeUsing = function(t) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(t), p(
      this._fragmentFiber.child,
      !1,
      cT,
      t,
      void 0,
      void 0
    );
  };
  function cT(t, e) {
    return t.tag === 6 || (t = N(t), e.observe(t)), !1;
  }
  Qe.prototype.unobserveUsing = function(t) {
    var e = this._observers;
    if (e !== null && e.has(t)) {
      e.delete(t), p(
        this._fragmentFiber.child,
        !1,
        fT,
        t,
        void 0,
        void 0
      );
      for (var n = e = 0; n < un.length; n++) {
        var i = un[n];
        i.fragmentInstance === this && i.observer === t ? t.unobserve(i.instance) : un[e++] = i;
      }
      un.length = e;
    }
  };
  function fT(t, e) {
    return t.tag === 6 || (t = N(t), e.unobserve(t)), !1;
  }
  var un = [], Ic = !1;
  function dT(t, e, n) {
    un.push({
      fragmentInstance: t,
      observer: e,
      instance: n
    }), Ic || (Ic = !0, TT(function() {
      Ic = !1;
      var i = un;
      un = [];
      for (var s = 0; s < i.length; s++) {
        var o = i[s];
        o.observer.unobserve(o.instance);
      }
    }));
  }
  Qe.prototype.getClientRects = function() {
    var t = [];
    return p(
      this._fragmentFiber.child,
      !1,
      hT,
      t,
      void 0,
      void 0
    ), t;
  };
  function hT(t, e) {
    if (t.tag === 6) {
      t = t.stateNode;
      var n = t.ownerDocument.createRange();
      n.selectNodeContents(t), e.push.apply(e, n.getClientRects());
    } else
      t = N(t), e.push.apply(e, t.getClientRects());
    return !1;
  }
  Qe.prototype.getRootNode = function(t) {
    var e = S(
      this._fragmentFiber
    );
    return e === null ? this : N(e).getRootNode(t);
  }, Qe.prototype.compareDocumentPosition = function(t) {
    var e = S(
      this._fragmentFiber
    );
    if (e === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var n = [];
    p(
      this._fragmentFiber.child,
      !1,
      Pc,
      n,
      void 0,
      void 0
    );
    var i = N(e);
    if (n.length === 0) {
      if (n = i, z(this._fragmentFiber)) {
        t: {
          for (e = this._fragmentFiber.return; e !== null; ) {
            if (e.tag === 4) {
              e = e.stateNode.containerInfo;
              break t;
            }
            if (e.tag === 3 || e.tag === 5 || e.tag === 27)
              break;
            e = e.return;
          }
          e = null;
        }
        e != null && (n = e);
      }
      e = this._fragmentFiber;
      var s = i = n.compareDocumentPosition(t);
      return n === t ? s = Node.DOCUMENT_POSITION_CONTAINS : i & Node.DOCUMENT_POSITION_CONTAINED_BY && (n = w(e)[1], n === null ? s = Node.DOCUMENT_POSITION_PRECEDING : (t = N(n).compareDocumentPosition(
        t
      ), s = t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), s |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    e = N(n[0]), s = N(n[n.length - 1]);
    var o = z(this._fragmentFiber) ? e.parentElement : i;
    if (o == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    i = o.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY, o = o.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var f = e.compareDocumentPosition(t), y = s.compareDocumentPosition(t), T = f & Node.DOCUMENT_POSITION_CONTAINED_BY || y & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return y = i && o && f & Node.DOCUMENT_POSITION_FOLLOWING && y & Node.DOCUMENT_POSITION_PRECEDING, e = i && e === t || o && s === t || T || y ? Node.DOCUMENT_POSITION_CONTAINED_BY : !i && e === t || !o && s === t ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : f, e & Node.DOCUMENT_POSITION_DISCONNECTED || e & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || mT(
      e,
      this._fragmentFiber,
      n[0],
      n[n.length - 1],
      t
    ) ? e : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function mT(t, e, n, i, s) {
    var o = _i(s);
    if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (n = !!o)
        t: {
          for (; o !== null; ) {
            if (o.tag === 7 && (o === e || o.alternate === e)) {
              n = !0;
              break t;
            }
            o = o.return;
          }
          n = !1;
        }
      return n;
    }
    if (t & Node.DOCUMENT_POSITION_CONTAINS) {
      if (o === null)
        return o = s.ownerDocument, s === o || s === o.documentElement || s === o.body;
      t: {
        for (o = e, e = S(e); o !== null; ) {
          if (!(o.tag !== 5 && o.tag !== 3 && o.tag !== 27 || o !== e && o.alternate !== e)) {
            o = !0;
            break t;
          }
          o = o.return;
        }
        o = !1;
      }
      return o;
    }
    return t & Node.DOCUMENT_POSITION_PRECEDING ? ((e = !!o) && !(e = o === n) && (e = st(
      n,
      o,
      P
    ), e === null ? e = !1 : (p(
      e,
      !0,
      Y,
      o,
      n
    ), o = H, H = null, e = o !== null)), e) : t & Node.DOCUMENT_POSITION_FOLLOWING ? ((e = !!o) && !(e = o === i) && (e = st(
      i,
      o,
      P
    ), e === null ? e = !1 : (p(
      e,
      !0,
      X,
      o,
      i
    ), o = H, j = H = null, e = o !== null)), e) : !1;
  }
  function wy(t, e) {
    var n = t.ownerDocument.createRange();
    n.selectNodeContents(t), t = n.getBoundingClientRect(), window.scrollTo(
      window.scrollX + t.left,
      e ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight
    );
  }
  Qe.prototype.scrollIntoView = function(t) {
    if (typeof t == "object") throw Error(u(566));
    var e = [];
    p(
      this._fragmentFiber.child,
      !1,
      Pc,
      e,
      void 0,
      void 0
    );
    var n = t !== !1;
    if (e.length === 0) {
      var i = w(
        this._fragmentFiber
      );
      if (i = n ? i[1] || i[0] || S(this._fragmentFiber) : i[0] || i[1], i === null) return;
      if (i.tag === 6) {
        t = N(i), wy(t, n);
        return;
      }
      if (i = N(i), i.nodeType !== 9) {
        if (i.nodeType === 11) {
          n = "host" in i ? i.host : null, n !== null && n.scrollIntoView(t);
          return;
        }
        i.scrollIntoView(t);
      }
    }
    for (i = n ? e.length - 1 : 0; i !== (n ? -1 : e.length); ) {
      var s = e[i];
      s.tag === 6 ? (s = N(s), wy(s, n)) : N(s).scrollIntoView(t), i += n ? -1 : 1;
    }
  };
  function pT(t, e) {
    return t = N(t), Ny(t, e), !1;
  }
  function Ny(t, e) {
    t.reactFragments == null && (t.reactFragments = /* @__PURE__ */ new Set()), t.reactFragments.add(e);
  }
  function Vy(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var s = n[i];
        t.addEventListener(
          s.type,
          s.attachedListener,
          Fa(s.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(o) {
      for (var f = 0, y = 0; y < un.length; y++) {
        var T = un[y];
        (T.fragmentInstance !== e || T.observer !== o || T.instance !== t) && (un[f++] = T);
      }
      un.length = f, o.observe(t);
    }), Ny(t, e));
  }
  function yT(t, e) {
    var n = e._eventListeners;
    if (n !== null)
      for (var i = 0; i < n.length; i++) {
        var s = n[i];
        t.removeEventListener(
          s.type,
          s.attachedListener,
          Fa(s.optionsOrUseCapture)
        );
      }
    t.nodeType !== 3 && (n = e._observers, n !== null && n.forEach(function(o) {
      typeof o.rootMargin == "string" ? dT(
        e,
        o,
        t
      ) : o.unobserve(t);
    }), t.reactFragments != null && t.reactFragments.delete(e));
  }
  function Wc(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (e = e.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Wc(n), _s(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function gT(t, e, n, i) {
    for (; t.nodeType === 1; ) {
      var s = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!i && (t.nodeName !== "INPUT" || t.type !== "hidden"))
          break;
      } else if (i) {
        if (!t[ml])
          switch (e) {
            case "meta":
              if (!t.hasAttribute("itemprop")) break;
              return t;
            case "link":
              if (o = t.getAttribute("rel"), o === "stylesheet" && t.hasAttribute("data-precedence"))
                break;
              if (o !== s.rel || t.getAttribute("href") !== (s.href == null || s.href === "" ? null : s.href) || t.getAttribute("crossorigin") !== (s.crossOrigin == null ? null : s.crossOrigin) || t.getAttribute("title") !== (s.title == null ? null : s.title))
                break;
              return t;
            case "style":
              if (t.hasAttribute("data-precedence")) break;
              return t;
            case "script":
              if (o = t.getAttribute("src"), (o !== (s.src == null ? null : s.src) || t.getAttribute("type") !== (s.type == null ? null : s.type) || t.getAttribute("crossorigin") !== (s.crossOrigin == null ? null : s.crossOrigin)) && o && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                break;
              return t;
            default:
              return t;
          }
      } else if (e === "input" && t.type === "hidden") {
        var o = s.name == null ? null : "" + s.name;
        if (s.type === "hidden" && t.getAttribute("name") === o)
          return t;
      } else return t;
      if (t = We(t.nextSibling), t === null) break;
    }
    return null;
  }
  function vT(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = We(t.nextSibling), t === null)) return null;
    return t;
  }
  function _y(t, e) {
    for (; t.nodeType !== 8; )
      if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = We(t.nextSibling), t === null)) return null;
    return t;
  }
  function $c(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function tf(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function bT(t, e) {
    var n = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || n.readyState !== "loading")
      e();
    else {
      var i = function() {
        e(), n.removeEventListener("DOMContentLoaded", i);
      };
      n.addEventListener("DOMContentLoaded", i), t._reactRetry = i;
    }
  }
  function We(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F")
          break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var ef = null;
  function Uy(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "/$" || n === "/&") {
          if (e === 0)
            return We(t.nextSibling);
          e--;
        } else
          n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function By(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (e === 0) return t;
          e--;
        } else n !== "/$" && n !== "/&" || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function ST(t, e) {
    function n() {
      i = !0;
    }
    if (t.ownerDocument.activeElement === t) return !0;
    var i = !1;
    try {
      t.ownerDocument.addEventListener("focus", n, !0), (t.focus || HTMLElement.prototype.focus).call(t, e);
    } finally {
      t.ownerDocument.removeEventListener("focus", n, !0);
    }
    return i;
  }
  function TT(t) {
    Ey(function() {
      Ey(function(e) {
        return t(e);
      });
    });
  }
  function Ly(t, e, n) {
    switch (e = Pl(n), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(u(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(u(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(u(454));
        return t;
      default:
        throw Error(u(451));
    }
  }
  function Hy(t, e, n) {
    for (var i in n) {
      var s = n[i];
      n.hasOwnProperty(i) && s != null && Nt(t, e, i, null, PS, s);
    }
    n.dangerouslySetInnerHTML != null && (t.textContent = ""), t.onclick === pn && (t.onclick = null), _s(t);
  }
  function nf(t) {
    for (var e = t.attributes; e.length; )
      t.removeAttributeNode(e[0]);
    _s(t);
  }
  var $e = /* @__PURE__ */ new Map(), jy = /* @__PURE__ */ new Set();
  function Il(t) {
    if (typeof t.getRootNode == "function") {
      var e = t.getRootNode();
      if (e.nodeType === 9 || e.nodeType === 11) return e;
    }
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  var Zn = ut.d;
  ut.d = {
    f: ET,
    r: AT,
    D: xT,
    C: MT,
    L: CT,
    m: DT,
    X: OT,
    S: zT,
    M: RT
  };
  function ET() {
    var t = Zn.f(), e = Ho();
    return t || e;
  }
  function AT(t) {
    var e = ma(t);
    e !== null && e.tag === 5 && e.type === "form" ? Ym(e) : Zn.r(t);
  }
  var Pa = typeof document > "u" ? null : document;
  function Gy(t, e, n) {
    var i = Pa;
    if (i && typeof e == "string" && e) {
      var s = Ze(e);
      s = 'link[rel="' + t + '"][href="' + s + '"]', typeof n == "string" && (s += '[crossorigin="' + n + '"]'), jy.has(s) || (jy.add(s), t = { rel: t, crossOrigin: n, href: e }, i.querySelector(s) === null && (e = i.createElement("link"), pe(e, "link", t), le(e), i.head.appendChild(e)));
    }
  }
  function xT(t) {
    Zn.D(t), Gy("dns-prefetch", t, null);
  }
  function MT(t, e) {
    Zn.C(t, e), Gy("preconnect", t, e);
  }
  function CT(t, e, n) {
    Zn.L(t, e, n);
    var i = Pa;
    if (i && t && e) {
      var s = 'link[rel="preload"][as="' + Ze(e) + '"]';
      e === "image" && n && n.imageSrcSet ? (s += '[imagesrcset="' + Ze(
        n.imageSrcSet
      ) + '"]', typeof n.imageSizes == "string" && (s += '[imagesizes="' + Ze(
        n.imageSizes
      ) + '"]')) : s += '[href="' + Ze(t) + '"]';
      var o = s;
      switch (e) {
        case "style":
          o = Ia(t);
          break;
        case "script":
          o = Wa(t);
      }
      if (!($e.has(o) || (t = Z(
        {
          rel: "preload",
          href: e === "image" && n && n.imageSrcSet ? void 0 : t,
          as: e
        },
        n
      ), $e.set(o, t), i.querySelector(s) !== null || e === "style" && i.querySelector(Wl(o)) || e === "script" && i.querySelector($l(o))))) {
        var f = i.createElement("link");
        pe(f, "link", t), e === "style" && (f[Vs] = !0, f.onload = f.onerror = function() {
          $d(f);
        }), le(f), i.head.appendChild(f);
      }
    }
  }
  function DT(t, e) {
    Zn.m(t, e);
    var n = Pa;
    if (n && t) {
      var i = e && typeof e.as == "string" ? e.as : "script", s = 'link[rel="modulepreload"][as="' + Ze(i) + '"][href="' + Ze(t) + '"]', o = s;
      switch (i) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          o = Wa(t);
      }
      if (!$e.has(o) && (t = Z({ rel: "modulepreload", href: t }, e), $e.set(o, t), n.querySelector(s) === null)) {
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector($l(o)))
              return;
        }
        i = n.createElement("link"), pe(i, "link", t), le(i), n.head.appendChild(i);
      }
    }
  }
  function zT(t, e, n) {
    Zn.S(t, e, n);
    var i = Pa;
    if (i && t) {
      var s = pa(i).hoistableStyles, o = Ia(t);
      e = e || "default";
      var f = s.get(o);
      if (!f) {
        var y = { loading: 0, preload: null };
        if (f = i.querySelector(
          Wl(o)
        ))
          y.loading = 5;
        else {
          t = Z(
            { rel: "stylesheet", href: t, "data-precedence": e },
            n
          ), (n = $e.get(o)) && af(t, n);
          var T = f = i.createElement("link");
          le(T), pe(T, "link", t), T._p = new Promise(function(C, R) {
            T.onload = C, T.onerror = R;
          }), T.addEventListener("load", function() {
            y.loading |= 1;
          }), T.addEventListener("error", function() {
            y.loading |= 2;
          }), y.loading |= 4, Zo(f, e, i);
        }
        f = {
          type: "stylesheet",
          instance: f,
          count: 1,
          state: y
        }, s.set(o, f);
      }
    }
  }
  function OT(t, e) {
    Zn.X(t, e);
    var n = Pa;
    if (n && t) {
      var i = pa(n).hoistableScripts, s = Wa(t), o = i.get(s);
      o || (o = n.querySelector($l(s)), o || (t = Z({ src: t, async: !0 }, e), (e = $e.get(s)) && lf(t, e), o = n.createElement("script"), le(o), pe(o, "link", t), n.head.appendChild(o)), o = {
        type: "script",
        instance: o,
        count: 1,
        state: null
      }, i.set(s, o));
    }
  }
  function RT(t, e) {
    Zn.M(t, e);
    var n = Pa;
    if (n && t) {
      var i = pa(n).hoistableScripts, s = Wa(t), o = i.get(s);
      o || (o = n.querySelector($l(s)), o || (t = Z({ src: t, async: !0, type: "module" }, e), (e = $e.get(s)) && lf(t, e), o = n.createElement("script"), le(o), pe(o, "link", t), n.head.appendChild(o)), o = {
        type: "script",
        instance: o,
        count: 1,
        state: null
      }, i.set(s, o));
    }
  }
  function Yy(t, e, n, i) {
    var s = (s = Pn.current) ? Il(s) : null;
    if (!s) throw Error(u(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (n = Ia(n.href), e = pa(
          s
        ).hoistableStyles, i = e.get(n), i || (i = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, i)), i) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          t = Ia(n.href);
          var o = pa(
            s
          ).hoistableStyles, f = o.get(t);
          if (f || (s = s.ownerDocument || s, f = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, o.set(t, f), (o = s.querySelector(
            Wl(t)
          )) ? o._p || (f.instance = o, f.state.loading = 5) : (o = $e.get(t), o || (o = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, $e.set(t, o)), wT(
            s,
            t,
            o,
            f.state
          ))), e && i === null)
            throw Error(u(528, ""));
          return f;
        }
        if (e && i !== null)
          throw Error(u(529, ""));
        return null;
      case "script":
        return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (n = Wa(n), e = pa(
          s
        ).hoistableScripts, i = e.get(n), i || (i = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, e.set(n, i)), i) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(u(444, t));
    }
  }
  function Ia(t) {
    return 'href="' + Ze(t) + '"';
  }
  function Wl(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function qy(t) {
    return Z({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function wT(t, e, n, i) {
    if (e = t.querySelector(
      'link[rel="preload"][as="style"][' + e + "]"
    )) {
      if (e[Vs] !== !0) {
        i.loading = 1;
        return;
      }
    } else
      e = t.createElement("link"), e[Vs] = !0, e.onload = e.onerror = $d.bind(null, e), pe(e, "link", n), le(e), t.head.appendChild(e);
    i.preload = e, e.addEventListener("load", function() {
      return i.loading |= 1;
    }), e.addEventListener("error", function() {
      return i.loading |= 2;
    });
  }
  function Wa(t) {
    return '[src="' + Ze(t) + '"]';
  }
  function $l(t) {
    return "script[async]" + t;
  }
  function Xy(t, e, n) {
    if (e.count++, e.instance === null)
      switch (e.type) {
        case "style":
          var i = t.querySelector(
            'style[data-href~="' + Ze(n.href) + '"]'
          );
          if (i)
            return e.instance = i, le(i), i;
          var s = Z({}, n, {
            "data-href": n.href,
            "data-precedence": n.precedence,
            href: null,
            precedence: null
          });
          return i = (t.ownerDocument || t).createElement(
            "style"
          ), le(i), pe(i, "style", s), Zo(i, n.precedence, t), e.instance = i;
        case "stylesheet":
          s = Ia(n.href);
          var o = t.querySelector(
            Wl(s)
          );
          if (o)
            return e.state.loading |= 4, e.instance = o, le(o), o;
          i = qy(n), (s = $e.get(s)) && af(i, s), o = (t.ownerDocument || t).createElement("link"), le(o);
          var f = o;
          return f._p = new Promise(function(y, T) {
            f.onload = y, f.onerror = T;
          }), pe(o, "link", i), e.state.loading |= 4, Zo(o, n.precedence, t), e.instance = o;
        case "script":
          return o = Wa(n.src), (s = t.querySelector(
            $l(o)
          )) ? (e.instance = s, le(s), s) : (i = n, (s = $e.get(o)) && (i = Z({}, n), lf(i, s)), t = t.ownerDocument || t, s = t.createElement("script"), le(s), pe(s, "link", i), t.head.appendChild(s), e.instance = s);
        case "void":
          return null;
        default:
          throw Error(u(443, e.type));
      }
    else
      e.type === "stylesheet" && (e.state.loading & 4) === 0 && (i = e.instance, e.state.loading |= 4, Zo(i, n.precedence, t));
    return e.instance;
  }
  function Zo(t, e, n) {
    for (var i = n.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), s = i.length ? i[i.length - 1] : null, o = s, f = 0; f < i.length; f++) {
      var y = i[f];
      if (y.dataset.precedence === e) o = y;
      else if (o !== s) break;
    }
    o ? o.parentNode.insertBefore(t, o.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild));
  }
  function af(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function lf(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var Ko = null;
  function Qy(t, e, n) {
    if (Ko === null) {
      var i = /* @__PURE__ */ new Map(), s = Ko = /* @__PURE__ */ new Map();
      s.set(n, i);
    } else
      s = Ko, i = s.get(n), i || (i = /* @__PURE__ */ new Map(), s.set(n, i));
    if (i.has(t)) return i;
    for (i.set(t, null), n = n.getElementsByTagName(t), s = 0; s < n.length; s++) {
      var o = n[s];
      if (!(o[ml] || o[ce] || t === "link" && o.getAttribute("rel") === "stylesheet") && o.namespaceURI !== "http://www.w3.org/2000/svg") {
        var f = o.getAttribute(e) || "";
        f = t + f;
        var y = i.get(f);
        y ? y.push(o) : i.set(f, [o]);
      }
    }
    return i;
  }
  function sf(t, e, n) {
    t = t.ownerDocument || t, t.head.insertBefore(
      n,
      e === "title" ? t.querySelector("head > title") : null
    );
  }
  function NT(t, e, n) {
    if (n === 1 || e.itemProp != null) return !1;
    switch (t) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "")
          break;
        return !0;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError)
          break;
        switch (e.rel) {
          case "stylesheet":
            return t = e.disabled, typeof e.precedence == "string" && t == null;
          default:
            return !0;
        }
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string")
          return !0;
    }
    return !1;
  }
  function Zy(t, e) {
    return t === "img" && e.src != null && e.src !== "" && e.onLoad == null && e.loading !== "lazy";
  }
  function Ky(t) {
    return !(t.type === "stylesheet" && (t.state.loading & 3) === 0);
  }
  function ky(t) {
    return (t.width || 100) * (t.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function Jy(t, e) {
    typeof e.decode == "function" && (t.imgCount++, e.complete || (t.imgBytes += ky(e), t.suspenseyImages.push(e)), t = UT.bind(t), e.decode().then(t, t));
  }
  function VT(t, e, n, i) {
    if (n.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== !1) && (n.state.loading & 4) === 0) {
      if (n.instance === null) {
        var s = Ia(i.href), o = e.querySelector(
          Wl(s)
        );
        if (o) {
          e = o._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = ts.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = o, le(o);
          return;
        }
        o = e.ownerDocument || e, i = qy(i), (s = $e.get(s)) && af(i, s), o = o.createElement("link"), le(o);
        var f = o;
        f._p = new Promise(function(y, T) {
          f.onload = y, f.onerror = T;
        }), pe(o, "link", i), n.instance = o;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(n, e), (e = n.state.preload) && (n.state.loading & 3) === 0 && (t.count++, n = ts.bind(t), e.addEventListener("load", n), e.addEventListener("error", n));
    }
  }
  var ko = 0;
  function _T(t, e) {
    return t.stylesheets && t.count === 0 && Fo(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
      var i = setTimeout(function() {
        if (t.stylesheets && Fo(t, t.stylesheets), t.unsuspend) {
          var o = t.unsuspend;
          t.unsuspend = null, o();
        }
      }, 6e4 + e);
      0 < t.imgBytes && ko === 0 && (ko = 62500 * WS());
      var s = setTimeout(
        function() {
          if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && Fo(t, t.stylesheets), t.unsuspend)) {
            var o = t.unsuspend;
            t.unsuspend = null, o();
          }
        },
        (t.imgBytes > ko ? 50 : 800) + e
      );
      return t.unsuspend = n, function() {
        t.unsuspend = null, clearTimeout(i), clearTimeout(s);
      };
    } : null;
  }
  function Fy(t) {
    if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
      if (t.stylesheets) Fo(t, t.stylesheets);
      else if (t.unsuspend) {
        var e = t.unsuspend;
        t.unsuspend = null, e();
      }
    }
  }
  function ts() {
    this.count--, Fy(this);
  }
  function UT() {
    this.imgCount--, Fy(this);
  }
  var Jo = null;
  function Fo(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, Jo = /* @__PURE__ */ new Map(), e.forEach(BT, t), Jo = null, ts.call(t));
  }
  function BT(t, e) {
    if (!(e.state.loading & 4)) {
      var n = Jo.get(t);
      if (n) var i = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), Jo.set(t, n);
        for (var s = t.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), o = 0; o < s.length; o++) {
          var f = s[o];
          (f.nodeName === "LINK" || f.getAttribute("media") !== "not all") && (n.set(f.dataset.precedence, f), i = f);
        }
        i && n.set(null, i);
      }
      s = e.instance, f = s.getAttribute("data-precedence"), o = n.get(f) || i, o === i && n.set(null, s), n.set(f, s), this.count++, i = ts.bind(this), s.addEventListener("load", i), s.addEventListener("error", i), o ? o.parentNode.insertBefore(s, o.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(s, t.firstChild)), e.state.loading |= 4;
    }
  }
  var $a = {
    $$typeof: At,
    Provider: null,
    Consumer: null,
    _currentValue: Ve,
    _currentValue2: Ve,
    _threadCount: 0
  };
  function LT(t, e, n, i, s, o, f, y, T) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = ju(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = ju(0), this.hiddenUpdates = ju(null), this.identifierPrefix = i, this.onUncaughtError = s, this.onCaughtError = o, this.onRecoverableError = f, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = T, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Py(t, e, n, i, s, o, f, y, T, C, R, B) {
    return t = new LT(
      t,
      e,
      n,
      f,
      T,
      C,
      R,
      B,
      y
    ), e = 1, o === !0 && (e |= 24), o = De(3, null, null, e), t.current = o, o.stateNode = t, e = Sr(), e.refCount++, t.pooledCache = e, e.refCount++, o.memoizedState = {
      element: i,
      isDehydrated: n,
      cache: e
    }, xr(o), t;
  }
  function Iy(t) {
    return t ? (t = Ma, t) : Ma;
  }
  function Wy(t, e, n, i, s, o) {
    s = Iy(s), i.context === null ? i.context = s : i.pendingContext = s, i = oi(e), i.payload = { element: n }, o = o === void 0 ? null : o, o !== null && (i.callback = o), n = ui(t, i, e), n !== null && (we(n, t, e), wl(n, t, e));
  }
  function $y(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function of(t, e) {
    $y(t, e), (t = t.alternate) && $y(t, e);
  }
  function tg(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Hi(t, 67108864);
      e !== null && we(e, t, 67108864), of(t, 67108864);
    }
  }
  function eg(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = Xe();
      e = Gu(e);
      var n = Hi(t, e);
      n !== null && we(n, t, e), of(t, e);
    }
  }
  var tl = !0;
  function HT(t, e, n, i) {
    var s = W.T;
    W.T = null;
    var o = ut.p;
    try {
      ut.p = 2, uf(t, e, n, i);
    } finally {
      ut.p = o, W.T = s;
    }
  }
  function jT(t, e, n, i) {
    var s = W.T;
    W.T = null;
    var o = ut.p;
    try {
      ut.p = 8, uf(t, e, n, i);
    } finally {
      ut.p = o, W.T = s;
    }
  }
  function uf(t, e, n, i) {
    if (tl) {
      var s = rf(i);
      if (s === null)
        qc(
          t,
          e,
          i,
          Po,
          n
        ), ig(t, i);
      else if (YT(
        s,
        t,
        e,
        n,
        i
      ))
        i.stopPropagation();
      else if (ig(t, i), e & 4 && -1 < GT.indexOf(t)) {
        for (; s !== null; ) {
          var o = ma(s);
          if (o !== null)
            switch (o.tag) {
              case 3:
                if (o = o.stateNode, o.current.memoizedState.isDehydrated) {
                  var f = Vi(o.pendingLanes);
                  if (f !== 0) {
                    var y = o;
                    for (y.pendingLanes |= 2, y.entangledLanes |= 2; f; ) {
                      var T = 1 << 31 - Be(f);
                      y.entanglements[1] |= T, f &= ~T;
                    }
                    Mn(o), (zt & 6) === 0 && (Uo = _e() + 500, kl(0));
                  }
                }
                break;
              case 31:
              case 13:
                y = Hi(o, 2), y !== null && we(y, o, 2), Ho(), of(o, 2);
            }
          if (o = rf(i), o === null && qc(
            t,
            e,
            i,
            Po,
            n
          ), o === s) break;
          s = o;
        }
        s !== null && i.stopPropagation();
      } else
        qc(
          t,
          e,
          i,
          null,
          n
        );
    }
  }
  function rf(t) {
    return t = ku(t), cf(t);
  }
  var Po = null;
  function cf(t) {
    if (Po = null, t = _i(t), t !== null) {
      var e = h(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (t = d(e), t !== null) return t;
          t = null;
        } else if (n === 31) {
          if (t = m(e), t !== null) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated)
            return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return Po = t, null;
  }
  function ng(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (Wb()) {
          case Yd:
            return 2;
          case qd:
            return 8;
          case zs:
          case $b:
            return 32;
          case Xd:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var ff = !1, Si = null, Ti = null, Ei = null, es = /* @__PURE__ */ new Map(), ns = /* @__PURE__ */ new Map(), Ai = [], GT = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function ig(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        Si = null;
        break;
      case "dragenter":
      case "dragleave":
        Ti = null;
        break;
      case "mouseover":
      case "mouseout":
        Ei = null;
        break;
      case "pointerover":
      case "pointerout":
        es.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        ns.delete(e.pointerId);
    }
  }
  function is(t, e, n, i, s, o) {
    return t === null || t.nativeEvent !== o ? (t = {
      blockedOn: e,
      domEventName: n,
      eventSystemFlags: i,
      nativeEvent: o,
      targetContainers: [s]
    }, e !== null && (e = ma(e), e !== null && tg(e)), t) : (t.eventSystemFlags |= i, e = t.targetContainers, s !== null && e.indexOf(s) === -1 && e.push(s), t);
  }
  function YT(t, e, n, i, s) {
    switch (e) {
      case "focusin":
        return Si = is(
          Si,
          t,
          e,
          n,
          i,
          s
        ), !0;
      case "dragenter":
        return Ti = is(
          Ti,
          t,
          e,
          n,
          i,
          s
        ), !0;
      case "mouseover":
        return Ei = is(
          Ei,
          t,
          e,
          n,
          i,
          s
        ), !0;
      case "pointerover":
        var o = s.pointerId;
        return es.set(
          o,
          is(
            es.get(o) || null,
            t,
            e,
            n,
            i,
            s
          )
        ), !0;
      case "gotpointercapture":
        return o = s.pointerId, ns.set(
          o,
          is(
            ns.get(o) || null,
            t,
            e,
            n,
            i,
            s
          )
        ), !0;
    }
    return !1;
  }
  function ag(t) {
    var e = _i(t.target);
    if (e !== null) {
      var n = h(e);
      if (n !== null) {
        if (e = n.tag, e === 13) {
          if (e = d(n), e !== null) {
            t.blockedOn = e, Pd(t.priority, function() {
              eg(n);
            });
            return;
          }
        } else if (e === 31) {
          if (e = m(n), e !== null) {
            t.blockedOn = e, Pd(t.priority, function() {
              eg(n);
            });
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Io(t) {
    if (t.blockedOn !== null) return !1;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = rf(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var i = new n.constructor(
          n.type,
          n
        );
        Ku = i, n.target.dispatchEvent(i), Ku = null;
      } else
        return e = ma(n), e !== null && tg(e), t.blockedOn = n, !1;
      e.shift();
    }
    return !0;
  }
  function lg(t, e, n) {
    Io(t) && n.delete(e);
  }
  function qT() {
    ff = !1, Si !== null && Io(Si) && (Si = null), Ti !== null && Io(Ti) && (Ti = null), Ei !== null && Io(Ei) && (Ei = null), es.forEach(lg), ns.forEach(lg);
  }
  function Wo(t, e) {
    t.blockedOn === e && (t.blockedOn = null, ff || (ff = !0, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      qT
    )));
  }
  var $o = null;
  function sg(t) {
    $o !== t && ($o = t, a.unstable_scheduleCallback(
      a.unstable_NormalPriority,
      function() {
        $o === t && ($o = null);
        for (var e = 0; e < t.length; e += 3) {
          var n = t[e], i = t[e + 1], s = t[e + 2];
          if (typeof i != "function") {
            if (cf(i || n) === null)
              continue;
            break;
          }
          var o = ma(n);
          o !== null && (t.splice(e, 3), e -= 3, Zr(
            o,
            {
              pending: !0,
              data: s,
              method: n.method,
              action: i
            },
            i,
            s
          ));
        }
      }
    ));
  }
  function el(t) {
    function e(T) {
      return Wo(T, t);
    }
    Si !== null && Wo(Si, t), Ti !== null && Wo(Ti, t), Ei !== null && Wo(Ei, t), es.forEach(e), ns.forEach(e);
    for (var n = 0; n < Ai.length; n++) {
      var i = Ai[n];
      i.blockedOn === t && (i.blockedOn = null);
    }
    for (; 0 < Ai.length && (n = Ai[0], n.blockedOn === null); )
      ag(n), n.blockedOn === null && Ai.shift();
    if (n = (t.ownerDocument || t).$$reactFormReplay, n != null)
      for (i = 0; i < n.length; i += 3) {
        var s = n[i], o = n[i + 1], f = s[Ce] || null;
        if (typeof o == "function")
          f || sg(n);
        else if (f) {
          var y = null;
          if (o && o.hasAttribute("formAction")) {
            if (s = o, f = o[Ce] || null)
              y = f.formAction;
            else if (cf(s) !== null) continue;
          } else y = f.action;
          typeof y == "function" ? n[i + 1] = y : (n.splice(i, 3), i -= 3), sg(n);
        }
      }
  }
  function og() {
    function t(o) {
      o.canIntercept && o.info === "react-transition" && o.intercept({
        handler: function() {
          return new Promise(function(f) {
            return s = f;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      s !== null && (s(), s = null), i || setTimeout(n, 20);
    }
    function n() {
      if (!i && !navigation.transition) {
        var o = navigation.currentEntry;
        o && o.url != null && navigation.navigate(o.url, {
          state: o.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var i = !1, s = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100), function() {
        i = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), s !== null && (s(), s = null);
      };
    }
  }
  function df(t) {
    this._internalRoot = t;
  }
  tu.prototype.render = df.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(u(409));
    var n = e.current, i = Xe();
    Wy(n, i, t, e, null, null);
  }, tu.prototype.unmount = df.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      Wy(t.current, 2, null, t, null, null), Ho(), e[ha] = null;
    }
  };
  function tu(t) {
    this._internalRoot = t;
  }
  tu.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = Fd();
      t = { blockedOn: null, target: t, priority: e };
      for (var n = 0; n < Ai.length && e !== 0 && e < Ai[n].priority; n++) ;
      Ai.splice(n, 0, t), n === 0 && ag(t);
    }
  };
  var ug = l.version;
  if (ug !== "19.3.0")
    throw Error(
      u(
        527,
        ug,
        "19.3.0"
      )
    );
  ut.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0)
      throw typeof t.render == "function" ? Error(u(188)) : (t = Object.keys(t).join(","), Error(u(268, t)));
    return t = b(e), t = t !== null ? v(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var XT = {
    bundleType: 0,
    version: "19.3.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: W,
    reconcilerVersion: "19.3.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var eu = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!eu.isDisabled && eu.supportsFiber)
      try {
        fl = eu.inject(
          XT
        ), Ue = eu;
      } catch {
      }
  }
  return ls.createRoot = function(t, e) {
    if (!c(t)) throw Error(u(299));
    var n = !1, i = "", s = Im, o = Wm, f = $m;
    return e != null && (e.unstable_strictMode === !0 && (n = !0), e.identifierPrefix !== void 0 && (i = e.identifierPrefix), e.onUncaughtError !== void 0 && (s = e.onUncaughtError), e.onCaughtError !== void 0 && (o = e.onCaughtError), e.onRecoverableError !== void 0 && (f = e.onRecoverableError)), e = Py(
      t,
      1,
      !1,
      null,
      null,
      n,
      i,
      null,
      s,
      o,
      f,
      og
    ), t[ha] = e.current, Yc(t), new df(e);
  }, ls.hydrateRoot = function(t, e, n) {
    if (!c(t)) throw Error(u(299));
    var i = !1, s = "", o = Im, f = Wm, y = $m, T = null;
    return n != null && (n.unstable_strictMode === !0 && (i = !0), n.identifierPrefix !== void 0 && (s = n.identifierPrefix), n.onUncaughtError !== void 0 && (o = n.onUncaughtError), n.onCaughtError !== void 0 && (f = n.onCaughtError), n.onRecoverableError !== void 0 && (y = n.onRecoverableError), n.formState !== void 0 && (T = n.formState)), e = Py(
      t,
      1,
      !0,
      e,
      n ?? null,
      i,
      s,
      T,
      o,
      f,
      y,
      og
    ), e.context = Iy(null), n = e.current, i = Xe(), i = Gu(i), s = oi(i), s.callback = null, ui(n, s, i), n = i, e.current.lanes = n, hl(e, n), Mn(e), t[ha] = e.current, Yc(t), new tu(e);
  }, ls.version = "19.3.0", ls;
}
var vg;
function $T() {
  if (vg) return mf.exports;
  vg = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (l) {
        console.error(l);
      }
  }
  return a(), mf.exports = WT(), mf.exports;
}
var J0 = $T(), lt = ud();
const F0 = lt.createContext({});
function ms(a) {
  const l = lt.useRef(null);
  return l.current === null && (l.current = a()), l.current;
}
const tE = typeof window < "u", P0 = tE ? lt.useLayoutEffect : lt.useEffect, rd = /* @__PURE__ */ lt.createContext(null);
function cd(a, l) {
  a.indexOf(l) === -1 && a.push(l);
}
function pu(a, l) {
  const r = a.indexOf(l);
  r > -1 && a.splice(r, 1);
}
const Rn = (a, l, r) => r > l ? l : r < a ? a : r;
function bg(a, l) {
  return l ? `${a}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${l}` : a;
}
let Ss = () => {
}, Oi = () => {
};
var k0;
typeof process < "u" && ((k0 = process.env) == null ? void 0 : k0.NODE_ENV) !== "production" && (Ss = (a, l, r) => {
  !a && typeof console < "u" && console.warn(bg(l, r));
}, Oi = (a, l, r) => {
  if (!a)
    throw new Error(bg(l, r));
});
const Ri = {}, I0 = (a) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(a), W0 = (a) => typeof a == "object" && a !== null, $0 = (a) => /^0[^.\s]+$/u.test(a);
// @__NO_SIDE_EFFECTS__
function tv(a) {
  let l;
  return () => (l === void 0 && (l = a()), l);
}
const en = /* @__NO_SIDE_EFFECTS__ */ (a) => a, Ts = (...a) => a.reduce((l, r) => (u) => r(l(u))), ps = /* @__NO_SIDE_EFFECTS__ */ (a, l, r) => {
  const u = l - a;
  return u ? (r - a) / u : 1;
};
class fd {
  constructor() {
    this.subscriptions = [];
  }
  add(l) {
    return cd(this.subscriptions, l), () => pu(this.subscriptions, l);
  }
  notify(l, r, u) {
    const c = this.subscriptions.length;
    if (c)
      if (c === 1)
        this.subscriptions[0](l, r, u);
      else
        for (let h = 0; h < c; h++) {
          const d = this.subscriptions[h];
          d && d(l, r, u);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const Ne = /* @__NO_SIDE_EFFECTS__ */ (a) => a * 1e3, tn = /* @__NO_SIDE_EFFECTS__ */ (a) => a / 1e3, ev = /* @__NO_SIDE_EFFECTS__ */ (a, l) => l ? a * (1e3 / l) : 0, nv = (a, l, r) => (((1 - 3 * r + 3 * l) * a + (3 * r - 6 * l)) * a + 3 * l) * a, eE = 1e-7, nE = 12;
function iE(a, l, r, u, c) {
  let h, d, m = 0;
  do
    d = l + (r - l) / 2, h = nv(d, u, c) - a, h > 0 ? r = d : l = d;
  while (Math.abs(h) > eE && ++m < nE);
  return d;
}
// @__NO_SIDE_EFFECTS__
function Es(a, l, r, u) {
  if (a === l && r === u)
    return en;
  const c = (h) => iE(h, 0, 1, a, r);
  return (h) => h === 0 || h === 1 ? h : nv(c(h), l, u);
}
const iv = /* @__NO_SIDE_EFFECTS__ */ (a) => (l) => l <= 0.5 ? a(2 * l) / 2 : (2 - a(2 * (1 - l))) / 2, av = /* @__NO_SIDE_EFFECTS__ */ (a) => (l) => 1 - a(1 - l), lv = /* @__PURE__ */ Es(0.33, 1.53, 0.69, 0.99), dd = /* @__PURE__ */ av(lv), sv = /* @__PURE__ */ iv(dd), ov = (a) => a >= 1 ? 1 : (a *= 2) < 1 ? 0.5 * dd(a) : 0.5 * (2 - Math.pow(2, -10 * (a - 1))), hd = (a) => 1 - Math.sin(Math.acos(a)), uv = /* @__PURE__ */ av(hd), rv = /* @__PURE__ */ iv(hd), aE = /* @__PURE__ */ Es(0.42, 0, 1, 1), lE = /* @__PURE__ */ Es(0, 0, 0.58, 1), cv = /* @__PURE__ */ Es(0.42, 0, 0.58, 1), sE = /* @__NO_SIDE_EFFECTS__ */ (a) => Array.isArray(a) && typeof a[0] != "number", fv = /* @__NO_SIDE_EFFECTS__ */ (a) => Array.isArray(a) && typeof a[0] == "number", Sg = {
  linear: en,
  easeIn: aE,
  easeInOut: cv,
  easeOut: lE,
  circIn: hd,
  circInOut: rv,
  circOut: uv,
  backIn: dd,
  backInOut: sv,
  backOut: lv,
  anticipate: ov
}, oE = (a) => typeof a == "string", Tg = (a) => {
  if (/* @__PURE__ */ fv(a)) {
    Oi(a.length === 4, "Cubic bezier arrays must contain four numerical values.", "cubic-bezier-length");
    const [l, r, u, c] = a;
    return /* @__PURE__ */ Es(l, r, u, c);
  } else if (oE(a))
    return Oi(Sg[a] !== void 0, `Invalid easing type '${a}'`, "invalid-easing-type"), Sg[a];
  return a;
}, nu = [
  "setup",
  // Compute
  "read",
  // Read
  "resolveKeyframes",
  // Write/Read/Write/Read
  "preUpdate",
  // Compute
  "update",
  // Compute
  "preRender",
  // Compute
  "render",
  // Write
  "postRender"
  // Compute
];
function uE(a) {
  let l = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), u = !1, c = !1;
  const h = /* @__PURE__ */ new WeakSet();
  let d = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  };
  function m(b) {
    h.has(b) && (g.schedule(b), a()), b(d);
  }
  const g = {
    /**
     * Schedule a process to run on the next frame.
     */
    schedule: (b, v = !1, p = !1) => {
      const z = p && u ? l : r;
      return v && h.add(b), z.add(b), b;
    },
    /**
     * Cancel the provided callback from running on the next frame.
     */
    cancel: (b) => {
      r.delete(b), h.delete(b);
    },
    /**
     * Execute all schedule callbacks.
     */
    process: (b) => {
      if (d = b, u) {
        c = !0;
        return;
      }
      u = !0;
      const v = l;
      l = r, r = v, l.forEach(m), l.clear(), u = !1, c && (c = !1, g.process(b));
    }
  };
  return g;
}
const rE = 40;
function dv(a, l) {
  let r = !1, u = !0;
  const c = {
    delta: 0,
    timestamp: 0,
    isProcessing: !1
  }, h = () => r = !0, d = nu.reduce((Y, X) => (Y[X] = uE(h), Y), {}), { setup: m, read: g, resolveKeyframes: b, preUpdate: v, update: p, preRender: S, render: z, postRender: w } = d, U = () => {
    const Y = Ri.useManualTiming, X = Y ? c.timestamp : performance.now();
    r = !1, Y || (c.delta = u ? 1e3 / 60 : Math.max(Math.min(X - c.timestamp, rE), 1)), c.timestamp = X, c.isProcessing = !0, m.process(c), g.process(c), b.process(c), v.process(c), p.process(c), S.process(c), z.process(c), w.process(c), c.isProcessing = !1, r && l && (u = !1, a(U));
  }, N = () => {
    r = !0, u = !0, c.isProcessing || a(U);
  };
  return { schedule: nu.reduce((Y, X) => {
    const P = d[X];
    return Y[X] = (st, Z = !1, V = !1) => (r || N(), P.schedule(st, Z, V)), Y;
  }, {}), cancel: (Y) => {
    for (let X = 0; X < nu.length; X++)
      d[nu[X]].cancel(Y);
  }, state: c, steps: d };
}
const { schedule: Vt, cancel: Jn, state: ge, steps: bf } = /* @__PURE__ */ dv(typeof requestAnimationFrame < "u" ? requestAnimationFrame : en, !0);
let uu;
function cE() {
  uu = void 0;
}
const Ae = {
  now: () => (uu === void 0 && Ae.set(ge.isProcessing || Ri.useManualTiming ? ge.timestamp : performance.now()), uu),
  set: (a) => {
    uu = a, queueMicrotask(cE);
  }
}, hv = (a) => (l) => typeof l == "string" && l.startsWith(a), mv = /* @__PURE__ */ hv("--"), fE = /* @__PURE__ */ hv("var(--"), md = (a) => fE(a) ? dE.test(a.split("/*")[0].trim()) : !1, dE = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Eg(a) {
  return typeof a != "string" ? !1 : a.split("/*")[0].includes("var(--");
}
const ol = {
  test: (a) => typeof a == "number",
  parse: parseFloat,
  transform: (a) => a
}, ys = {
  ...ol,
  transform: (a) => Rn(0, 1, a)
}, iu = {
  ...ol,
  default: 1
}, rs = (a) => Math.round(a * 1e5) / 1e5, pd = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function hE(a) {
  return a == null;
}
const mE = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, yd = (a, l) => (r) => !!(typeof r == "string" && mE.test(r) && r.startsWith(a) || l && !hE(r) && Object.prototype.hasOwnProperty.call(r, l)), pv = (a, l, r) => (u) => {
  if (typeof u != "string")
    return u;
  const [c, h, d, m] = u.match(pd);
  return {
    [a]: parseFloat(c),
    [l]: parseFloat(h),
    [r]: parseFloat(d),
    alpha: m !== void 0 ? parseFloat(m) : 1
  };
}, pE = (a) => Rn(0, 255, a), Sf = {
  ...ol,
  transform: (a) => Math.round(pE(a))
}, la = {
  test: /* @__PURE__ */ yd("rgb", "red"),
  parse: /* @__PURE__ */ pv("red", "green", "blue"),
  transform: ({ red: a, green: l, blue: r, alpha: u = 1 }) => "rgba(" + Sf.transform(a) + ", " + Sf.transform(l) + ", " + Sf.transform(r) + ", " + rs(ys.transform(u)) + ")"
};
function yE(a) {
  let l = "", r = "", u = "", c = "";
  return a.length > 5 ? (l = a.substring(1, 3), r = a.substring(3, 5), u = a.substring(5, 7), c = a.substring(7, 9)) : (l = a.substring(1, 2), r = a.substring(2, 3), u = a.substring(3, 4), c = a.substring(4, 5), l += l, r += r, u += u, c += c), {
    red: parseInt(l, 16),
    green: parseInt(r, 16),
    blue: parseInt(u, 16),
    alpha: c ? parseInt(c, 16) / 255 : 1
  };
}
const Lf = {
  test: /* @__PURE__ */ yd("#"),
  parse: yE,
  transform: la.transform
}, As = /* @__NO_SIDE_EFFECTS__ */ (a) => ({
  test: (l) => typeof l == "string" && l.endsWith(a) && l.split(" ").length === 1,
  parse: parseFloat,
  transform: (l) => `${l}${a}`
}), kn = /* @__PURE__ */ As("deg"), On = /* @__PURE__ */ As("%"), tt = /* @__PURE__ */ As("px"), gE = /* @__PURE__ */ As("vh"), vE = /* @__PURE__ */ As("vw"), Ag = {
  ...On,
  parse: (a) => On.parse(a) / 100,
  transform: (a) => On.transform(a * 100)
}, il = {
  test: /* @__PURE__ */ yd("hsl", "hue"),
  parse: /* @__PURE__ */ pv("hue", "saturation", "lightness"),
  transform: ({ hue: a, saturation: l, lightness: r, alpha: u = 1 }) => "hsla(" + Math.round(a) + ", " + On.transform(rs(l)) + ", " + On.transform(rs(r)) + ", " + rs(ys.transform(u)) + ")"
}, te = {
  test: (a) => la.test(a) || Lf.test(a) || il.test(a),
  parse: (a) => la.test(a) ? la.parse(a) : il.test(a) ? il.parse(a) : Lf.parse(a),
  transform: (a) => typeof a == "string" ? a : a.hasOwnProperty("red") ? la.transform(a) : il.transform(a),
  getAnimatableNone: (a) => {
    const l = te.parse(a);
    return l.alpha = 0, te.transform(l);
  }
}, bE = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function SE(a) {
  var l, r;
  return isNaN(a) && typeof a == "string" && (((l = a.match(pd)) == null ? void 0 : l.length) || 0) + (((r = a.match(bE)) == null ? void 0 : r.length) || 0) > 0;
}
const yv = "number", gv = "color", TE = "var", EE = "var(", xg = "${}", AE = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function sl(a) {
  const l = a.toString(), r = [], u = {
    color: [],
    number: [],
    var: []
  }, c = [];
  let h = 0;
  const m = l.replace(AE, (g) => (te.test(g) ? (u.color.push(h), c.push(gv), r.push(te.parse(g))) : g.startsWith(EE) ? (u.var.push(h), c.push(TE), r.push(g)) : (u.number.push(h), c.push(yv), r.push(parseFloat(g))), ++h, xg)).split(xg);
  return { values: r, split: m, indexes: u, types: c };
}
function xE(a) {
  return sl(a).values;
}
function vv({ split: a, types: l }) {
  const r = a.length;
  return (u) => {
    let c = "";
    for (let h = 0; h < r; h++)
      if (c += a[h], u[h] !== void 0) {
        const d = l[h];
        d === yv ? c += rs(u[h]) : d === gv ? c += te.transform(u[h]) : c += u[h];
      }
    return c;
  };
}
function ME(a) {
  return vv(sl(a));
}
const CE = (a) => typeof a == "number" ? 0 : te.test(a) ? te.getAnimatableNone(a) : a, DE = (a, l) => typeof a == "number" ? l != null && l.trim().endsWith("/") ? a : 0 : CE(a);
function zE(a) {
  const l = sl(a);
  return vv(l)(l.values.map((u, c) => DE(u, l.split[c])));
}
const fn = {
  test: SE,
  parse: xE,
  createTransformer: ME,
  getAnimatableNone: zE
};
function Tf(a, l, r) {
  return r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? a + (l - a) * 6 * r : r < 1 / 2 ? l : r < 2 / 3 ? a + (l - a) * (2 / 3 - r) * 6 : a;
}
function OE({ hue: a, saturation: l, lightness: r, alpha: u }) {
  a /= 360, l /= 100, r /= 100;
  let c = 0, h = 0, d = 0;
  if (!l)
    c = h = d = r;
  else {
    const m = r < 0.5 ? r * (1 + l) : r + l - r * l, g = 2 * r - m;
    c = Tf(g, m, a + 1 / 3), h = Tf(g, m, a), d = Tf(g, m, a - 1 / 3);
  }
  return {
    red: Math.round(c * 255),
    green: Math.round(h * 255),
    blue: Math.round(d * 255),
    alpha: u
  };
}
function yu(a, l) {
  return (r) => r > 0 ? l : a;
}
const Bt = (a, l, r) => a + (l - a) * r, Ef = (a, l, r) => {
  const u = a * a, c = r * (l * l - u) + u;
  return c < 0 ? 0 : Math.sqrt(c);
}, RE = [Lf, la, il], wE = (a) => RE.find((l) => l.test(a));
function Mg(a) {
  const l = wE(a);
  if (Ss(!!l, `'${a}' is not an animatable color. Use the equivalent color code instead.`, "color-not-animatable"), !l)
    return !1;
  let r = l.parse(a);
  return l === il && (r = OE(r)), r;
}
const Cg = (a, l) => {
  const r = Mg(a), u = Mg(l);
  if (!r || !u)
    return yu(a, l);
  const c = { ...r };
  return (h) => (c.red = Ef(r.red, u.red, h), c.green = Ef(r.green, u.green, h), c.blue = Ef(r.blue, u.blue, h), c.alpha = Bt(r.alpha, u.alpha, h), la.transform(c));
}, Hf = /* @__PURE__ */ new Set(["none", "hidden"]);
function NE(a, l) {
  return Hf.has(a) ? (r) => r <= 0 ? a : l : (r) => r >= 1 ? l : a;
}
function VE(a, l) {
  return (r) => Bt(a, l, r);
}
function gd(a) {
  return typeof a == "number" ? VE : typeof a == "string" ? md(a) ? yu : te.test(a) ? Cg : BE : Array.isArray(a) ? bv : typeof a == "object" ? te.test(a) ? Cg : _E : yu;
}
function bv(a, l) {
  const r = [...a], u = r.length, c = a.map((h, d) => gd(h)(h, l[d]));
  return (h) => {
    for (let d = 0; d < u; d++)
      r[d] = c[d](h);
    return r;
  };
}
function _E(a, l) {
  const r = { ...a, ...l }, u = {};
  for (const c in r)
    a[c] !== void 0 && l[c] !== void 0 && (u[c] = gd(a[c])(a[c], l[c]));
  return (c) => {
    for (const h in u)
      r[h] = u[h](c);
    return r;
  };
}
function UE(a, l) {
  const r = [], u = { color: 0, var: 0, number: 0 };
  for (let c = 0; c < l.values.length; c++) {
    const h = l.types[c], d = a.indexes[h][u[h]], m = a.values[d] ?? 0;
    r[c] = m, u[h]++;
  }
  return r;
}
const BE = (a, l) => {
  const r = fn.createTransformer(l), u = sl(a), c = sl(l);
  return u.indexes.var.length === c.indexes.var.length && u.indexes.color.length === c.indexes.color.length && u.indexes.number.length >= c.indexes.number.length ? Hf.has(a) && !c.values.length || Hf.has(l) && !u.values.length ? NE(a, l) : Ts(bv(UE(u, c), c.values), r) : (Ss(!0, `Complex values '${a}' and '${l}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`, "complex-values-different"), yu(a, l));
};
function Sv(a, l, r) {
  return typeof a == "number" && typeof l == "number" && typeof r == "number" ? Bt(a, l, r) : gd(a)(a, l);
}
const LE = (a) => {
  const l = ({ timestamp: r }) => a(r);
  return {
    start: (r = !0) => Vt.update(l, r),
    stop: () => Jn(l),
    /**
     * If we're processing this frame we can use the
     * framelocked timestamp to keep things in sync.
     */
    now: () => ge.isProcessing ? ge.timestamp : Ae.now()
  };
}, Tv = (a, l, r = 10) => {
  let u = "";
  const c = Math.max(Math.round(l / r), 2);
  for (let h = 0; h < c; h++)
    u += Math.round(a(h / (c - 1)) * 1e4) / 1e4 + ", ";
  return `linear(${u.substring(0, u.length - 2)})`;
}, gu = 2e4;
function vd(a) {
  let l = 0;
  const r = 50;
  let u = a.next(l);
  for (; !u.done && l < gu; )
    l += r, u = a.next(l);
  return l >= gu ? 1 / 0 : l;
}
function HE(a, l = 100, r) {
  const u = r({ ...a, keyframes: [0, l] }), c = Math.min(vd(u), gu);
  return {
    type: "keyframes",
    ease: (h) => u.next(c * h).value / l,
    duration: /* @__PURE__ */ tn(c)
  };
}
const qt = {
  // Default spring physics
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  // Default duration/bounce-based options
  duration: 800,
  // in ms
  bounce: 0.3,
  visualDuration: 0.3,
  // in seconds
  // Rest thresholds
  restSpeed: {
    granular: 0.01,
    default: 2
  },
  restDelta: {
    granular: 5e-3,
    default: 0.5
  },
  // Limits
  minDuration: 0.01,
  // in seconds
  maxDuration: 10,
  // in seconds
  minDamping: 0.05,
  maxDamping: 1
};
function jf(a, l) {
  return a * Math.sqrt(1 - l * l);
}
const jE = 12;
function GE(a, l, r) {
  let u = r;
  for (let c = 1; c < jE; c++)
    u = u - a(u) / l(u);
  return u;
}
const Af = 1e-3;
function YE({ duration: a = qt.duration, bounce: l = qt.bounce, velocity: r = qt.velocity, mass: u = qt.mass }) {
  let c, h;
  Ss(a <= /* @__PURE__ */ Ne(qt.maxDuration), "Spring duration must be 10 seconds or less", "spring-duration-limit");
  let d = 1 - l;
  d = Rn(qt.minDamping, qt.maxDamping, d), a = Rn(qt.minDuration, qt.maxDuration, /* @__PURE__ */ tn(a)), d < 1 ? (c = (b) => {
    const v = b * d, p = v * a, S = v - r, z = jf(b, d), w = Math.exp(-p);
    return Af - S / z * w;
  }, h = (b) => {
    const p = b * d * a, S = p * r + r, z = Math.pow(d, 2) * Math.pow(b, 2) * a, w = Math.exp(-p), U = jf(Math.pow(b, 2), d);
    return (-c(b) + Af > 0 ? -1 : 1) * ((S - z) * w) / U;
  }) : (c = (b) => {
    const v = Math.exp(-b * a), p = (b - r) * a + 1;
    return -Af + v * p;
  }, h = (b) => {
    const v = Math.exp(-b * a), p = (r - b) * (a * a);
    return v * p;
  });
  const m = 5 / a, g = GE(c, h, m);
  if (a = /* @__PURE__ */ Ne(a), isNaN(g))
    return {
      stiffness: qt.stiffness,
      damping: qt.damping,
      duration: a
    };
  {
    const b = Math.pow(g, 2) * u;
    return {
      stiffness: b,
      damping: d * 2 * Math.sqrt(u * b),
      duration: a
    };
  }
}
const qE = ["duration", "bounce"], XE = ["stiffness", "damping", "mass"];
function Dg(a, l) {
  return l.some((r) => a[r] !== void 0);
}
function QE(a) {
  let l = {
    velocity: qt.velocity,
    stiffness: qt.stiffness,
    damping: qt.damping,
    mass: qt.mass,
    isResolvedFromDuration: !1,
    ...a
  };
  if (!Dg(a, XE) && Dg(a, qE))
    if (l.velocity = 0, a.visualDuration) {
      const r = a.visualDuration, u = 2 * Math.PI / (r * 1.2), c = u * u, h = 2 * Rn(0.05, 1, 1 - (a.bounce || 0)) * Math.sqrt(c);
      l = {
        ...l,
        mass: qt.mass,
        stiffness: c,
        damping: h
      };
    } else {
      const r = YE({ ...a, velocity: 0 });
      l = {
        ...l,
        ...r,
        mass: qt.mass
      }, l.isResolvedFromDuration = !0;
    }
  return l;
}
function vu(a = qt.visualDuration, l = qt.bounce) {
  const r = typeof a != "object" ? {
    visualDuration: a,
    keyframes: [0, 1],
    bounce: l
  } : a;
  let { restSpeed: u, restDelta: c } = r;
  const h = r.keyframes[0], d = r.keyframes[r.keyframes.length - 1], m = { done: !1, value: h }, { stiffness: g, damping: b, mass: v, duration: p, velocity: S, isResolvedFromDuration: z } = QE({
    ...r,
    velocity: -/* @__PURE__ */ tn(r.velocity || 0)
  }), w = S || 0, U = b / (2 * Math.sqrt(g * v)), N = d - h, H = /* @__PURE__ */ tn(Math.sqrt(g / v)), j = Math.abs(N) < 5;
  u || (u = j ? qt.restSpeed.granular : qt.restSpeed.default), c || (c = j ? qt.restDelta.granular : qt.restDelta.default);
  let Y, X, P, st, Z, V;
  if (U < 1)
    P = jf(H, U), st = (w + U * H * N) / P, Y = (nt) => {
      const bt = Math.exp(-U * H * nt);
      return d - bt * (st * Math.sin(P * nt) + N * Math.cos(P * nt));
    }, Z = U * H * st + N * P, V = U * H * N - st * P, X = (nt) => Math.exp(-U * H * nt) * (Z * Math.sin(P * nt) + V * Math.cos(P * nt));
  else if (U === 1) {
    Y = (bt) => d - Math.exp(-H * bt) * (N + (w + H * N) * bt);
    const nt = w + H * N;
    X = (bt) => Math.exp(-H * bt) * (H * nt * bt - w);
  } else {
    const nt = H * Math.sqrt(U * U - 1);
    Y = (Xt) => {
      const At = Math.exp(-U * H * Xt), G = Math.min(nt * Xt, 300);
      return d - At * ((w + U * H * N) * Math.sinh(G) + nt * N * Math.cosh(G)) / nt;
    };
    const bt = (w + U * H * N) / nt, Ct = U * H * bt - N * nt, ee = U * H * N - bt * nt;
    X = (Xt) => {
      const At = Math.exp(-U * H * Xt), G = Math.min(nt * Xt, 300);
      return At * (Ct * Math.sinh(G) + ee * Math.cosh(G));
    };
  }
  const dt = {
    calculatedDuration: z && p || null,
    velocity: (nt) => /* @__PURE__ */ Ne(X(nt)),
    next: (nt) => {
      if (!z && U < 1) {
        const Ct = Math.exp(-U * H * nt), ee = Math.sin(P * nt), Xt = Math.cos(P * nt), At = d - Ct * (st * ee + N * Xt), G = /* @__PURE__ */ Ne(Ct * (Z * ee + V * Xt));
        return m.done = Math.abs(G) <= u && Math.abs(d - At) <= c, m.value = m.done ? d : At, m;
      }
      const bt = Y(nt);
      if (z)
        m.done = nt >= p;
      else {
        const Ct = /* @__PURE__ */ Ne(X(nt));
        m.done = Math.abs(Ct) <= u && Math.abs(d - bt) <= c;
      }
      return m.value = m.done ? d : bt, m;
    },
    toString: () => {
      const nt = Math.min(vd(dt), gu), bt = Tv((Ct) => dt.next(nt * Ct).value, nt, 30);
      return nt + "ms " + bt;
    },
    toTransition: () => {
    }
  };
  return dt;
}
vu.applyToOptions = (a) => {
  const l = HE(a, 100, vu);
  return a.ease = l.ease, a.duration = /* @__PURE__ */ Ne(l.duration), a.type = "keyframes", a;
};
const ZE = 5;
function Ev(a, l, r) {
  const u = Math.max(l - ZE, 0);
  return /* @__PURE__ */ ev(r - a(u), l - u);
}
function Gf({ keyframes: a, velocity: l = 0, power: r = 0.8, timeConstant: u = 325, bounceDamping: c = 10, bounceStiffness: h = 500, modifyTarget: d, min: m, max: g, restDelta: b = 0.5, restSpeed: v }) {
  const p = a[0], S = {
    done: !1,
    value: p
  }, z = (V) => m !== void 0 && V < m || g !== void 0 && V > g, w = (V) => m === void 0 ? g : g === void 0 || Math.abs(m - V) < Math.abs(g - V) ? m : g;
  let U = r * l;
  const N = p + U, H = d === void 0 ? N : d(N);
  H !== N && (U = H - p);
  const j = (V) => -U * Math.exp(-V / u), Y = (V) => H + j(V), X = (V) => {
    const dt = j(V), nt = Y(V);
    S.done = Math.abs(dt) <= b, S.value = S.done ? H : nt;
  };
  let P, st;
  const Z = (V) => {
    z(S.value) && (P = V, st = vu({
      keyframes: [S.value, w(S.value)],
      velocity: Ev(Y, V, S.value),
      // TODO: This should be passing * 1000
      damping: c,
      stiffness: h,
      restDelta: b,
      restSpeed: v
    }));
  };
  return Z(0), {
    calculatedDuration: null,
    next: (V) => {
      let dt = !1;
      return !st && P === void 0 && (dt = !0, X(V), Z(V)), P !== void 0 && V >= P ? st.next(V - P) : (!dt && X(V), S);
    }
  };
}
function KE(a, l, r) {
  const u = [], c = r || Ri.mix || Sv, h = a.length - 1;
  for (let d = 0; d < h; d++) {
    let m = c(a[d], a[d + 1]);
    if (l) {
      const g = Array.isArray(l) ? l[d] || en : l;
      m = Ts(g, m);
    }
    u.push(m);
  }
  return u;
}
function Av(a, l, { clamp: r = !0, ease: u, mixer: c } = {}) {
  const h = a.length;
  if (Oi(h === l.length, "Both input and output ranges must be the same length", "range-length"), h === 1)
    return () => l[0];
  if (h === 2 && l[0] === l[1])
    return () => l[1];
  const d = a[0] === a[1];
  a[0] > a[h - 1] && (a = [...a].reverse(), l = [...l].reverse());
  const m = KE(l, u, c), g = m.length, b = (v) => {
    if (d && v < a[0])
      return l[0];
    let p = 0;
    if (g > 1)
      for (; p < a.length - 2 && !(v < a[p + 1]); p++)
        ;
    const S = /* @__PURE__ */ ps(a[p], a[p + 1], v);
    return m[p](S);
  };
  return r ? (v) => b(Rn(a[0], a[h - 1], v)) : b;
}
function kE(a, l) {
  const r = a[a.length - 1];
  for (let u = 1; u <= l; u++) {
    const c = /* @__PURE__ */ ps(0, l, u);
    a.push(Bt(r, 1, c));
  }
}
function JE(a) {
  const l = [0];
  return kE(l, a.length - 1), l;
}
function FE(a, l) {
  return a.map((r) => r * l);
}
function PE(a, l) {
  return a.map(() => l || cv).splice(0, a.length - 1);
}
function cs({ duration: a = 300, keyframes: l, times: r, ease: u = "easeInOut" }) {
  const c = /* @__PURE__ */ sE(u) ? u.map(Tg) : Tg(u), h = {
    done: !1,
    value: l[0]
  }, d = FE(
    // Only use the provided offsets if they're the correct length
    // TODO Maybe we should warn here if there's a length mismatch
    r && r.length === l.length ? r : JE(l),
    a
  ), m = Av(d, l, {
    ease: Array.isArray(c) ? c : PE(l, c)
  });
  return {
    calculatedDuration: a,
    next: (g) => (h.value = m(g), h.done = g >= a, h)
  };
}
const IE = (a) => a !== null;
function Du(a, { repeat: l, repeatType: r = "loop" }, u, c = 1) {
  const h = a.filter(IE), m = c < 0 || l && r !== "loop" && l % 2 === 1 ? 0 : h.length - 1;
  return !m || u === void 0 ? h[m] : u;
}
const WE = {
  decay: Gf,
  inertia: Gf,
  tween: cs,
  keyframes: cs,
  spring: vu
};
function xv(a) {
  typeof a.type == "string" && (a.type = WE[a.type]);
}
class bd {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((l) => {
      this.resolve = l;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  /**
   * Allows the animation to be awaited.
   *
   * @deprecated Use `finished` instead.
   */
  then(l, r) {
    return this.finished.then(l, r);
  }
}
const $E = (a) => a / 100;
class gs extends bd {
  constructor(l) {
    super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
      done: !1,
      value: void 0
    }, this.stop = () => {
      var u, c;
      const { motionValue: r } = this.options;
      r && r.updatedAt !== Ae.now() && this.tick(Ae.now()), this.isStopped = !0, this.state !== "idle" && (this.teardown(), (c = (u = this.options).onStop) == null || c.call(u));
    }, this.options = l, this.initAnimation(), this.play(), l.autoplay === !1 && this.pause();
  }
  initAnimation() {
    const { options: l } = this;
    xv(l);
    const { type: r = cs, repeat: u = 0, repeatDelay: c = 0, repeatType: h, velocity: d = 0 } = l;
    let { keyframes: m } = l;
    const g = r || cs;
    g !== cs && typeof m[0] != "number" && (this.mixKeyframes = Ts($E, Sv(m[0], m[1])), m = [0, 100]);
    const b = g({ ...l, keyframes: m });
    h === "mirror" && (this.mirroredGenerator = g({
      ...l,
      keyframes: [...m].reverse(),
      velocity: -d
    })), b.calculatedDuration === null && (b.calculatedDuration = vd(b));
    const { calculatedDuration: v } = b;
    this.calculatedDuration = v, this.resolvedDuration = v + c, this.totalDuration = this.resolvedDuration * (u + 1) - c, this.generator = b;
  }
  updateTime(l) {
    const r = Math.round(l - this.startTime) * this.playbackSpeed;
    this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = r;
  }
  tick(l, r = !1) {
    const { generator: u, totalDuration: c, mixKeyframes: h, mirroredGenerator: d, resolvedDuration: m, calculatedDuration: g } = this;
    if (this.startTime === null)
      return u.next(0);
    const { delay: b = 0, keyframes: v, repeat: p, repeatType: S, repeatDelay: z, type: w, onUpdate: U, finalKeyframe: N } = this.options;
    this.speed > 0 ? this.startTime = Math.min(this.startTime, l) : this.speed < 0 && (this.startTime = Math.min(l - c / this.speed, this.startTime)), r ? this.currentTime = l : this.updateTime(l);
    const H = this.currentTime - b * (this.playbackSpeed >= 0 ? 1 : -1), j = this.playbackSpeed >= 0 ? H < 0 : H > c;
    this.currentTime = Math.max(H, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = c);
    let Y = this.currentTime, X = u;
    if (p) {
      const V = Math.min(this.currentTime, c) / m;
      let dt = Math.floor(V), nt = V % 1;
      !nt && V >= 1 && (nt = 1), nt === 1 && dt--, dt = Math.min(dt, p + 1), !!(dt % 2) && (S === "reverse" ? (nt = 1 - nt, z && (nt -= z / m)) : S === "mirror" && (X = d)), Y = Rn(0, 1, nt) * m;
    }
    let P;
    j ? (this.delayState.value = v[0], P = this.delayState) : P = X.next(Y), h && !j && (P.value = h(P.value));
    let { done: st } = P;
    !j && g !== null && (st = this.playbackSpeed >= 0 ? this.currentTime >= c : this.currentTime <= 0);
    const Z = this.holdTime === null && (this.state === "finished" || this.state === "running" && st);
    return Z && w !== Gf && (P.value = Du(v, this.options, N, this.speed)), U && U(P.value), Z && this.finish(), P;
  }
  /**
   * Allows the returned animation to be awaited or promise-chained. Currently
   * resolves when the animation finishes at all but in a future update could/should
   * reject if its cancels.
   */
  then(l, r) {
    return this.finished.then(l, r);
  }
  get duration() {
    return /* @__PURE__ */ tn(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ tn(l);
  }
  get time() {
    return /* @__PURE__ */ tn(this.currentTime);
  }
  set time(l) {
    l = /* @__PURE__ */ Ne(l), this.currentTime = l, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = l : this.driver && (this.startTime = this.driver.now() - l / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = l, this.tick(l));
  }
  /**
   * Returns the generator's velocity at the current time in units/second.
   * Uses the analytical derivative when available (springs), avoiding
   * the MotionValue's frame-dependent velocity estimation.
   */
  getGeneratorVelocity() {
    const l = this.currentTime;
    if (l <= 0)
      return this.options.velocity || 0;
    if (this.generator.velocity)
      return this.generator.velocity(l);
    const r = this.generator.next(l).value;
    return Ev((u) => this.generator.next(u).value, l, r);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(l) {
    const r = this.playbackSpeed !== l;
    r && this.driver && this.updateTime(Ae.now()), this.playbackSpeed = l, r && this.driver && (this.time = /* @__PURE__ */ tn(this.currentTime));
  }
  play() {
    var c, h;
    if (this.isStopped)
      return;
    const { driver: l = LE, startTime: r } = this.options;
    this.driver || (this.driver = l((d) => this.tick(d))), (h = (c = this.options).onPlay) == null || h.call(c);
    const u = this.driver.now();
    this.state === "finished" ? (this.updateFinished(), this.startTime = u) : this.holdTime !== null ? this.startTime = u - this.holdTime : this.startTime || (this.startTime = r ?? u), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
  }
  pause() {
    this.state = "paused", this.updateTime(Ae.now()), this.holdTime = this.currentTime;
  }
  complete() {
    this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
  }
  finish() {
    var l, r;
    this.notifyFinished(), this.teardown(), this.state = "finished", (r = (l = this.options).onComplete) == null || r.call(l);
  }
  cancel() {
    var l, r;
    this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (r = (l = this.options).onCancel) == null || r.call(l);
  }
  teardown() {
    this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
  }
  stopDriver() {
    this.driver && (this.driver.stop(), this.driver = void 0);
  }
  sample(l) {
    return this.startTime = 0, this.tick(l, !0);
  }
  attachTimeline(l) {
    var r;
    return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (r = this.driver) == null || r.stop(), l.observe(this);
  }
}
function tA(a) {
  for (let l = 1; l < a.length; l++)
    a[l] ?? (a[l] = a[l - 1]);
}
const sa = (a) => a * 180 / Math.PI, Yf = (a) => {
  const l = sa(Math.atan2(a[1], a[0]));
  return qf(l);
}, eA = {
  x: 4,
  y: 5,
  translateX: 4,
  translateY: 5,
  scaleX: 0,
  scaleY: 3,
  scale: (a) => (Math.abs(a[0]) + Math.abs(a[3])) / 2,
  rotate: Yf,
  rotateZ: Yf,
  skewX: (a) => sa(Math.atan(a[1])),
  skewY: (a) => sa(Math.atan(a[2])),
  skew: (a) => (Math.abs(a[1]) + Math.abs(a[2])) / 2
}, qf = (a) => (a = a % 360, a < 0 && (a += 360), a), zg = Yf, Og = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1]), Rg = (a) => Math.sqrt(a[4] * a[4] + a[5] * a[5]), nA = {
  x: 12,
  y: 13,
  z: 14,
  translateX: 12,
  translateY: 13,
  translateZ: 14,
  scaleX: Og,
  scaleY: Rg,
  scale: (a) => (Og(a) + Rg(a)) / 2,
  rotateX: (a) => qf(sa(Math.atan2(a[6], a[5]))),
  rotateY: (a) => qf(sa(Math.atan2(-a[2], a[0]))),
  rotateZ: zg,
  rotate: zg,
  skewX: (a) => sa(Math.atan(a[4])),
  skewY: (a) => sa(Math.atan(a[1])),
  skew: (a) => (Math.abs(a[1]) + Math.abs(a[4])) / 2
};
function Xf(a) {
  return a.includes("scale") ? 1 : 0;
}
function Qf(a, l) {
  if (!a || a === "none")
    return Xf(l);
  const r = a.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let u, c;
  if (r)
    u = nA, c = r;
  else {
    const m = a.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    u = eA, c = m;
  }
  if (!c)
    return Xf(l);
  const h = u[l], d = c[1].split(",").map(aA);
  return typeof h == "function" ? h(d) : d[h];
}
const iA = (a, l) => {
  const { transform: r = "none" } = getComputedStyle(a);
  return Qf(r, l);
};
function aA(a) {
  return parseFloat(a.trim());
}
const ul = [
  "transformPerspective",
  "x",
  "y",
  "z",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY"
], rl = /* @__PURE__ */ new Set([...ul, "pathRotation"]), wg = (a) => a === ol || a === tt, lA = /* @__PURE__ */ new Set(["x", "y", "z"]), sA = ul.filter((a) => !lA.has(a));
function oA(a) {
  const l = [];
  return sA.forEach((r) => {
    const u = a.getValue(r);
    u !== void 0 && (l.push([r, u.get()]), u.set(r.startsWith("scale") ? 1 : 0));
  }), l;
}
const zi = {
  // Dimensions
  width: ({ x: a }, { paddingLeft: l = "0", paddingRight: r = "0", boxSizing: u }) => {
    const c = a.max - a.min;
    return u === "border-box" ? c : c - parseFloat(l) - parseFloat(r);
  },
  height: ({ y: a }, { paddingTop: l = "0", paddingBottom: r = "0", boxSizing: u }) => {
    const c = a.max - a.min;
    return u === "border-box" ? c : c - parseFloat(l) - parseFloat(r);
  },
  top: (a, { top: l }) => parseFloat(l),
  left: (a, { left: l }) => parseFloat(l),
  bottom: ({ y: a }, { top: l }) => parseFloat(l) + (a.max - a.min),
  right: ({ x: a }, { left: l }) => parseFloat(l) + (a.max - a.min),
  // Transform
  x: (a, { transform: l }) => Qf(l, "x"),
  y: (a, { transform: l }) => Qf(l, "y")
};
zi.translateX = zi.x;
zi.translateY = zi.y;
const oa = /* @__PURE__ */ new Set();
let Zf = !1, Kf = !1, kf = !1;
function Mv() {
  if (Kf) {
    const a = Array.from(oa).filter((u) => u.needsMeasurement), l = new Set(a.map((u) => u.element)), r = /* @__PURE__ */ new Map();
    l.forEach((u) => {
      const c = oA(u);
      c.length && (r.set(u, c), u.render());
    }), a.forEach((u) => u.measureInitialState()), l.forEach((u) => {
      u.render();
      const c = r.get(u);
      c && c.forEach(([h, d]) => {
        var m;
        (m = u.getValue(h)) == null || m.set(d);
      });
    }), a.forEach((u) => u.measureEndState()), a.forEach((u) => {
      u.suspendedScrollY !== void 0 && window.scrollTo(0, u.suspendedScrollY);
    });
  }
  Kf = !1, Zf = !1, oa.forEach((a) => a.complete(kf)), oa.clear();
}
function Cv() {
  oa.forEach((a) => {
    a.readKeyframes(), a.needsMeasurement && (Kf = !0);
  });
}
function uA() {
  kf = !0, Cv(), Mv(), kf = !1;
}
class Sd {
  constructor(l, r, u, c, h, d = !1) {
    this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...l], this.onComplete = r, this.name = u, this.motionValue = c, this.element = h, this.isAsync = d;
  }
  scheduleResolve() {
    this.state = "scheduled", this.isAsync ? (oa.add(this), Zf || (Zf = !0, Vt.read(Cv), Vt.resolveKeyframes(Mv))) : (this.readKeyframes(), this.complete());
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, name: r, element: u, motionValue: c } = this;
    if (l[0] === null) {
      const h = c == null ? void 0 : c.get(), d = l[l.length - 1];
      if (h !== void 0)
        l[0] = h;
      else if (u && r) {
        const m = u.readValue(r, d);
        m != null && (l[0] = m);
      }
      l[0] === void 0 && (l[0] = d), c && h === void 0 && c.set(l[0]);
    }
    tA(l);
  }
  setFinalKeyframe() {
  }
  measureInitialState() {
  }
  renderEndStyles() {
  }
  measureEndState() {
  }
  complete(l = !1) {
    this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, l), oa.delete(this);
  }
  cancel() {
    this.state === "scheduled" && (oa.delete(this), this.state = "pending");
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const rA = (a) => a.startsWith("--");
function Dv(a, l, r) {
  rA(l) ? a.style.setProperty(l, r) : a.style[l] = r;
}
const cA = {};
function zv(a, l) {
  const r = /* @__PURE__ */ tv(a);
  return () => cA[l] ?? r();
}
const fA = /* @__PURE__ */ zv(() => window.ScrollTimeline !== void 0, "scrollTimeline"), Ov = /* @__PURE__ */ zv(() => {
  try {
    document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
  } catch {
    return !1;
  }
  return !0;
}, "linearEasing"), us = ([a, l, r, u]) => `cubic-bezier(${a}, ${l}, ${r}, ${u})`, Ng = {
  linear: "linear",
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  circIn: /* @__PURE__ */ us([0, 0.65, 0.55, 1]),
  circOut: /* @__PURE__ */ us([0.55, 0, 1, 0.45]),
  backIn: /* @__PURE__ */ us([0.31, 0.01, 0.66, -0.59]),
  backOut: /* @__PURE__ */ us([0.33, 1.53, 0.69, 0.99])
};
function Rv(a, l) {
  if (a)
    return typeof a == "function" ? Ov() ? Tv(a, l) : "ease-out" : /* @__PURE__ */ fv(a) ? us(a) : Array.isArray(a) ? a.map((r) => Rv(r, l) || Ng.easeOut) : Ng[a];
}
function dA(a, l, r, { delay: u = 0, duration: c = 300, repeat: h = 0, repeatType: d = "loop", ease: m = "easeOut", times: g } = {}, b = void 0) {
  const v = {
    [l]: r
  };
  g && (v.offset = g);
  const p = Rv(m, c);
  Array.isArray(p) && (v.easing = p);
  const S = {
    delay: u,
    duration: c,
    easing: Array.isArray(p) ? "linear" : p,
    fill: "both",
    iterations: h + 1,
    direction: d === "reverse" ? "alternate" : "normal"
  };
  return b && (S.pseudoElement = b), a.animate(v, S);
}
function wv(a) {
  return typeof a == "function" && "applyToOptions" in a;
}
function hA({ type: a, ...l }) {
  return wv(a) && Ov() ? a.applyToOptions(l) : (l.duration ?? (l.duration = 300), l.ease ?? (l.ease = "easeOut"), l);
}
class Nv extends bd {
  constructor(l) {
    if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !l)
      return;
    const { element: r, name: u, keyframes: c, pseudoElement: h, allowFlatten: d = !1, finalKeyframe: m, onComplete: g } = l;
    this.isPseudoElement = !!h, this.allowFlatten = d, this.options = l, Oi(typeof l.type != "string", `Mini animate() doesn't support "type" as a string.`, "mini-spring");
    const b = hA(l);
    this.animation = dA(r, u, c, b, h), b.autoplay === !1 && this.animation.pause(), this.animation.onfinish = () => {
      if (this.finishedTime = this.time, !h) {
        const v = Du(c, this.options, m, this.speed);
        this.updateMotionValue && this.updateMotionValue(v), Dv(r, u, v), this.animation.cancel();
      }
      g == null || g(), this.notifyFinished();
    };
  }
  play() {
    this.isStopped || (this.manualStartTime = null, this.animation.play(), this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    var l, r;
    (r = (l = this.animation).finish) == null || r.call(l);
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {
    }
  }
  stop() {
    if (this.isStopped)
      return;
    this.isStopped = !0;
    const { state: l } = this;
    l === "idle" || l === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * In this method, we commit styles back to the DOM before cancelling
   * the animation.
   *
   * This is designed to be overridden by NativeAnimationExtended, which
   * will create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to also correctly calculate velocity for any subsequent animation
   * while deferring the commit until the next animation frame.
   */
  commitStyles() {
    var r, u, c;
    const l = (r = this.options) == null ? void 0 : r.element;
    !this.isPseudoElement && (l != null && l.isConnected) && ((c = (u = this.animation).commitStyles) == null || c.call(u));
  }
  get duration() {
    var r, u;
    const l = ((u = (r = this.animation.effect) == null ? void 0 : r.getComputedTiming) == null ? void 0 : u.call(r).duration) || 0;
    return /* @__PURE__ */ tn(Number(l));
  }
  get iterationDuration() {
    const { delay: l = 0 } = this.options || {};
    return this.duration + /* @__PURE__ */ tn(l);
  }
  get time() {
    return /* @__PURE__ */ tn(Number(this.animation.currentTime) || 0);
  }
  set time(l) {
    const r = this.finishedTime !== null;
    this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = /* @__PURE__ */ Ne(l), r && this.animation.pause();
  }
  /**
   * The playback speed of the animation.
   * 1 = normal speed, 2 = double speed, 0.5 = half speed.
   */
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(l) {
    l < 0 && (this.finishedTime = null), this.animation.playbackRate = l;
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(l) {
    this.manualStartTime = this.animation.startTime = l;
  }
  /**
   * Attaches a timeline to the animation, for instance the `ScrollTimeline`.
   */
  attachTimeline({ timeline: l, rangeStart: r, rangeEnd: u, observe: c }) {
    var h;
    return this.allowFlatten && ((h = this.animation.effect) == null || h.updateTiming({ easing: "linear" })), this.animation.onfinish = null, l && fA() ? (this.animation.timeline = l, r && (this.animation.rangeStart = r), u && (this.animation.rangeEnd = u), en) : c(this);
  }
}
const Vv = {
  anticipate: ov,
  backInOut: sv,
  circInOut: rv
};
function mA(a) {
  return a in Vv;
}
function pA(a) {
  typeof a.ease == "string" && mA(a.ease) && (a.ease = Vv[a.ease]);
}
const xf = 10;
class yA extends Nv {
  constructor(l) {
    pA(l), xv(l), super(l), l.startTime !== void 0 && l.autoplay !== !1 && (this.startTime = l.startTime), this.options = l;
  }
  /**
   * WAAPI doesn't natively have any interruption capabilities.
   *
   * Rather than read committed styles back out of the DOM, we can
   * create a renderless JS animation and sample it twice to calculate
   * its current value, "previous" value, and therefore allow
   * Motion to calculate velocity for any subsequent animation.
   */
  updateMotionValue(l) {
    const { motionValue: r, onUpdate: u, onComplete: c, element: h, ...d } = this.options;
    if (!r)
      return;
    if (l !== void 0) {
      r.set(l);
      return;
    }
    const m = new gs({
      ...d,
      autoplay: !1
    }), g = Math.max(xf, Ae.now() - this.startTime), b = Rn(0, xf, g - xf), v = m.sample(g).value, { name: p } = this.options;
    h && p && Dv(h, p, v), r.setWithVelocity(m.sample(Math.max(0, g - b)).value, v, b), m.stop();
  }
}
const Vg = (a, l) => l === "zIndex" ? !1 : !!(typeof a == "number" || Array.isArray(a) || typeof a == "string" && // It's animatable if we have a string
(fn.test(a) || a === "0") && // And it contains numbers and/or colors
!a.startsWith("url("));
function gA(a) {
  const l = a[0];
  if (a.length === 1)
    return !0;
  for (let r = 0; r < a.length; r++)
    if (a[r] !== l)
      return !0;
}
function vA(a, l, r, u) {
  const c = a[0];
  if (c === null)
    return !1;
  if (l === "display" || l === "visibility")
    return !0;
  const h = a[a.length - 1], d = Vg(c, l), m = Vg(h, l);
  return Ss(d === m, `You are trying to animate ${l} from "${c}" to "${h}". "${d ? h : c}" is not an animatable value.`, "value-not-animatable"), !d || !m ? !1 : gA(a) || (r === "spring" || wv(r)) && u;
}
function Jf(a) {
  a.duration = 0, a.type = "keyframes";
}
const _v = /* @__PURE__ */ new Set([
  "opacity",
  "clipPath",
  "filter",
  "transform",
  "backgroundColor"
]), bA = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function SA(a) {
  for (let l = 0; l < a.length; l++)
    if (typeof a[l] == "string" && bA.test(a[l]))
      return !0;
  return !1;
}
const TA = /* @__PURE__ */ new Set([
  "color",
  "backgroundColor",
  "outlineColor",
  "fill",
  "stroke",
  "borderColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor"
]), EA = /* @__PURE__ */ tv(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function AA(a) {
  var p;
  const { motionValue: l, name: r, repeatDelay: u, repeatType: c, damping: h, type: d, keyframes: m } = a, g = (p = l == null ? void 0 : l.owner) == null ? void 0 : p.current;
  if (!(g instanceof HTMLElement) && !(g instanceof SVGElement))
    return !1;
  const { onUpdate: b, transformTemplate: v } = l.owner.getProps();
  return EA() && r && /**
   * Force WAAPI for color properties with browser-only color formats
   * (oklch, oklab, lab, lch, etc.) that the JS animation path can't parse.
   */
  (_v.has(r) || TA.has(r) && SA(m)) && (r !== "transform" || !v) && /**
   * If we're outputting values to onUpdate then we can't use WAAPI as there's
   * no way to read the value from WAAPI every frame.
   */
  !b && !u && c !== "mirror" && h !== 0 && d !== "inertia";
}
const xA = 40;
class MA extends bd {
  constructor({ autoplay: l = !0, delay: r = 0, type: u = "keyframes", repeat: c = 0, repeatDelay: h = 0, repeatType: d = "loop", keyframes: m, name: g, motionValue: b, element: v, ...p }) {
    var w;
    super(), this.stop = () => {
      var U, N;
      this._animation && (this._animation.stop(), (U = this.stopTimeline) == null || U.call(this)), (N = this.keyframeResolver) == null || N.cancel();
    }, this.createdAt = Ae.now();
    const S = {
      autoplay: l,
      delay: r,
      type: u,
      repeat: c,
      repeatDelay: h,
      repeatType: d,
      name: g,
      motionValue: b,
      element: v,
      ...p
    }, z = (v == null ? void 0 : v.KeyframeResolver) || Sd;
    this.keyframeResolver = new z(m, (U, N, H) => this.onKeyframesResolved(U, N, S, !H), g, b, v), (w = this.keyframeResolver) == null || w.scheduleResolve();
  }
  onKeyframesResolved(l, r, u, c) {
    var H, j;
    this.keyframeResolver = void 0;
    const { name: h, type: d, velocity: m, delay: g, isHandoff: b, onUpdate: v } = u;
    this.resolvedAt = Ae.now();
    let p = !0;
    vA(l, h, d, m) || (p = !1, (Ri.instantAnimations || !g) && (v == null || v(Du(l, u, r))), l[0] = l[l.length - 1], Jf(u), u.repeat = 0);
    const z = {
      startTime: c ? this.resolvedAt ? this.resolvedAt - this.createdAt > xA ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
      finalKeyframe: r,
      ...u,
      keyframes: l
    }, w = p && !b && AA(z), U = (j = (H = z.motionValue) == null ? void 0 : H.owner) == null ? void 0 : j.current;
    let N;
    if (w)
      try {
        N = new yA({
          ...z,
          element: U
        });
      } catch {
        N = new gs(z);
      }
    else
      N = new gs(z);
    N.finished.then(() => {
      this.notifyFinished();
    }).catch(en), this.pendingTimeline && (this.stopTimeline = N.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = N;
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(l, r) {
    return this.finished.finally(l).then(() => {
    });
  }
  get animation() {
    var l;
    return this._animation || ((l = this.keyframeResolver) == null || l.resume(), uA()), this._animation;
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(l) {
    this.animation.time = l;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(l) {
    this.animation.speed = l;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(l) {
    return this._animation ? this.stopTimeline = this.animation.attachTimeline(l) : this.pendingTimeline = l, () => this.stop();
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    var l;
    this._animation && this.animation.cancel(), (l = this.keyframeResolver) == null || l.cancel();
  }
}
function Uv(a, l, r, u = 0, c = 1) {
  const h = Array.from(a).sort((b, v) => b.sortNodePosition(v)).indexOf(l), d = a.size, m = (d - 1) * u;
  return typeof r == "function" ? r(h, d) : c === 1 ? h * u : m - h * u;
}
const _g = 30, CA = (a) => !isNaN(parseFloat(a)), fs = {
  current: void 0
};
class DA {
  /**
   * @param init - The initiating value
   * @param config - Optional configuration options
   *
   * -  `transformer`: A function to transform incoming values with.
   */
  constructor(l, r = {}) {
    this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (u) => {
      var h;
      const c = Ae.now();
      if (this.updatedAt !== c && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(u), this.current !== this.prev && ((h = this.events.change) == null || h.notify(this.current), this.dependents))
        for (const d of this.dependents)
          d.dirty();
    }, this.hasAnimated = !1, this.setCurrent(l), this.owner = r.owner;
  }
  setCurrent(l) {
    this.current = l, this.updatedAt = Ae.now(), this.canTrackVelocity === null && l !== void 0 && (this.canTrackVelocity = CA(this.current));
  }
  setPrevFrameValue(l = this.current) {
    this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt;
  }
  /**
   * Adds a function that will be notified when the `MotionValue` is updated.
   *
   * It returns a function that, when called, will cancel the subscription.
   *
   * When calling `onChange` inside a React component, it should be wrapped with the
   * `useEffect` hook. As it returns an unsubscribe function, this should be returned
   * from the `useEffect` function to ensure you don't add duplicate subscribers..
   *
   * ```jsx
   * export const MyComponent = () => {
   *   const x = useMotionValue(0)
   *   const y = useMotionValue(0)
   *   const opacity = useMotionValue(1)
   *
   *   useEffect(() => {
   *     function updateOpacity() {
   *       const maxXY = Math.max(x.get(), y.get())
   *       const newOpacity = transform(maxXY, [0, 100], [1, 0])
   *       opacity.set(newOpacity)
   *     }
   *
   *     const unsubscribeX = x.on("change", updateOpacity)
   *     const unsubscribeY = y.on("change", updateOpacity)
   *
   *     return () => {
   *       unsubscribeX()
   *       unsubscribeY()
   *     }
   *   }, [])
   *
   *   return <motion.div style={{ x }} />
   * }
   * ```
   *
   * @param subscriber - A function that receives the latest value.
   * @returns A function that, when called, will cancel this subscription.
   *
   * @deprecated
   */
  onChange(l) {
    return this.on("change", l);
  }
  on(l, r) {
    this.events[l] || (this.events[l] = new fd());
    const u = this.events[l].add(r);
    return l === "change" ? () => {
      u(), Vt.read(() => {
        this.events.change.getSize() || this.stop();
      });
    } : u;
  }
  clearListeners() {
    for (const l in this.events)
      this.events[l].clear();
  }
  /**
   * Attaches a passive effect to the `MotionValue`.
   */
  attach(l, r) {
    this.passiveEffect = l, this.stopPassiveEffect = r;
  }
  /**
   * Sets the state of the `MotionValue`.
   *
   * @remarks
   *
   * ```jsx
   * const x = useMotionValue(0)
   * x.set(10)
   * ```
   *
   * @param latest - Latest value to set.
   * @param render - Whether to notify render subscribers. Defaults to `true`
   *
   * @public
   */
  set(l) {
    this.passiveEffect ? this.passiveEffect(l, this.updateAndNotify) : this.updateAndNotify(l);
  }
  setWithVelocity(l, r, u) {
    this.set(r), this.prev = void 0, this.prevFrameValue = l, this.prevUpdatedAt = this.updatedAt - u;
  }
  /**
   * Set the state of the `MotionValue`, stopping any active animations,
   * effects, and resets velocity to `0`.
   */
  jump(l, r = !0) {
    this.updateAndNotify(l), this.prev = l, this.prevUpdatedAt = this.prevFrameValue = void 0, r && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
  dirty() {
    var l;
    (l = this.events.change) == null || l.notify(this.current);
  }
  addDependent(l) {
    this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(l);
  }
  removeDependent(l) {
    this.dependents && this.dependents.delete(l);
  }
  /**
   * Returns the latest state of `MotionValue`
   *
   * @returns - The latest state of `MotionValue`
   *
   * @public
   */
  get() {
    return fs.current && fs.current.push(this), this.current;
  }
  /**
   * @public
   */
  getPrevious() {
    return this.prev;
  }
  /**
   * Returns the latest velocity of `MotionValue`
   *
   * @returns - The latest velocity of `MotionValue`. Returns `0` if the state is non-numerical.
   *
   * @public
   */
  getVelocity() {
    const l = Ae.now();
    if (!this.canTrackVelocity || this.prevFrameValue === void 0 || l - this.updatedAt > _g)
      return 0;
    const r = Math.min(this.updatedAt - this.prevUpdatedAt, _g);
    return /* @__PURE__ */ ev(parseFloat(this.current) - parseFloat(this.prevFrameValue), r);
  }
  /**
   * Registers a new animation to control this `MotionValue`. Only one
   * animation can drive a `MotionValue` at one time.
   *
   * ```jsx
   * value.start()
   * ```
   *
   * @param animation - A function that starts the provided animation
   */
  start(l) {
    return this.stop(), new Promise((r) => {
      this.hasAnimated = !0, this.animation = l(r), this.events.animationStart && this.events.animationStart.notify();
    }).then(() => {
      this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
    });
  }
  /**
   * Stop the currently active animation.
   *
   * @public
   */
  stop() {
    this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
  }
  /**
   * Returns `true` if this value is currently animating.
   *
   * @public
   */
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  /**
   * Destroy and clean up subscribers to this `MotionValue`.
   *
   * The `MotionValue` hooks like `useMotionValue` and `useTransform` automatically
   * handle the lifecycle of the returned `MotionValue`, so this method is only necessary if you've manually
   * created a `MotionValue` via the `motionValue` function.
   *
   * @public
   */
  destroy() {
    var l, r;
    (l = this.dependents) == null || l.clear(), (r = this.events.destroy) == null || r.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
  }
}
function ra(a, l) {
  return new DA(a, l);
}
function Bv(a, l) {
  if (a != null && a.inherit && l) {
    const { inherit: r, ...u } = a;
    return { ...l, ...u };
  }
  return a;
}
function Td(a, l) {
  const r = (a == null ? void 0 : a[l]) ?? (a == null ? void 0 : a.default) ?? a;
  return r !== a ? Bv(r, a) : r;
}
const zA = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  restSpeed: 10
}, OA = (a) => ({
  type: "spring",
  stiffness: 550,
  damping: a === 0 ? 2 * Math.sqrt(550) : 30,
  restSpeed: 10
}), RA = {
  type: "keyframes",
  duration: 0.8
}, wA = {
  type: "keyframes",
  ease: [0.25, 0.1, 0.35, 1],
  duration: 0.3
}, NA = (a, { keyframes: l }) => l.length > 2 ? RA : rl.has(a) ? a.startsWith("scale") ? OA(l[1]) : zA : wA, VA = /* @__PURE__ */ new Set([
  "when",
  "delay",
  "delayChildren",
  "staggerChildren",
  "staggerDirection",
  "repeat",
  "repeatType",
  "repeatDelay",
  "from",
  "elapsed"
]);
function _A(a) {
  for (const l in a)
    if (!VA.has(l))
      return !0;
  return !1;
}
const Ed = (a, l, r, u = {}, c, h) => (d) => {
  const m = Td(u, a) || {}, g = m.delay || u.delay || 0;
  let { elapsed: b = 0 } = u;
  b = b - /* @__PURE__ */ Ne(g);
  const v = {
    keyframes: Array.isArray(r) ? r : [null, r],
    ease: "easeOut",
    velocity: l.getVelocity(),
    ...m,
    delay: -b,
    onUpdate: (S) => {
      l.set(S), m.onUpdate && m.onUpdate(S);
    },
    onComplete: () => {
      d(), m.onComplete && m.onComplete();
    },
    name: a,
    motionValue: l,
    element: h ? void 0 : c
  };
  _A(m) || Object.assign(v, NA(a, v)), v.duration && (v.duration = /* @__PURE__ */ Ne(v.duration)), v.repeatDelay && (v.repeatDelay = /* @__PURE__ */ Ne(v.repeatDelay)), v.from !== void 0 && (v.keyframes[0] = v.from);
  let p = !1;
  if ((v.type === !1 || v.duration === 0 && !v.repeatDelay) && (Jf(v), v.delay === 0 && (p = !0)), (Ri.instantAnimations || Ri.skipAnimations || c != null && c.shouldSkipAnimations || m.skipAnimations) && (p = !0, Jf(v), v.delay = 0), v.allowFlatten = !m.type && !m.ease, p && !h && l.get() !== void 0) {
    const S = Du(v.keyframes, m);
    if (S !== void 0) {
      Vt.update(() => {
        v.onUpdate(S), v.onComplete();
      });
      return;
    }
  }
  return m.isSync ? new gs(v) : new MA(v);
}, UA = (
  // eslint-disable-next-line redos-detector/no-unsafe-regex -- false positive, as it can match a lot of words
  /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
);
function BA(a) {
  const l = UA.exec(a);
  if (!l)
    return [,];
  const [, r, u, c] = l;
  return [`--${r ?? u}`, c];
}
const LA = 4;
function Lv(a, l, r = 1) {
  Oi(r <= LA, `Max CSS variable fallback depth detected in property "${a}". This may indicate a circular fallback dependency.`, "max-css-var-depth");
  const [u, c] = BA(a);
  if (!u)
    return;
  const h = window.getComputedStyle(l).getPropertyValue(u);
  if (h) {
    const d = h.trim();
    return I0(d) ? parseFloat(d) : d;
  }
  return md(c) ? Lv(c, l, r + 1) : c;
}
function Ug(a) {
  const l = [{}, {}];
  return a == null || a.values.forEach((r, u) => {
    l[0][u] = r.get(), l[1][u] = r.getVelocity();
  }), l;
}
function Ad(a, l, r, u) {
  if (typeof l == "function") {
    const [c, h] = Ug(u);
    l = l(r !== void 0 ? r : a.custom, c, h);
  }
  if (typeof l == "string" && (l = a.variants && a.variants[l]), typeof l == "function") {
    const [c, h] = Ug(u);
    l = l(r !== void 0 ? r : a.custom, c, h);
  }
  return l;
}
function ua(a, l, r) {
  const u = a.getProps();
  return Ad(u, l, r !== void 0 ? r : u.custom, a);
}
const Hv = /* @__PURE__ */ new Set([
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  ...ul
]), Ff = (a) => Array.isArray(a);
function HA(a, l, r) {
  a.hasValue(l) ? a.getValue(l).set(r) : a.addValue(l, ra(r));
}
function jA(a) {
  return Ff(a) ? a[a.length - 1] || 0 : a;
}
function GA(a, l) {
  const r = ua(a, l);
  let { transitionEnd: u = {}, transition: c = {}, ...h } = r || {};
  h = { ...h, ...u };
  for (const d in h) {
    const m = jA(h[d]);
    HA(a, d, m);
  }
}
const Ft = (a) => !!(a && a.getVelocity);
function YA(a) {
  return !!(Ft(a) && a.add);
}
function Pf(a, l) {
  const r = a.getValue("willChange");
  if (YA(r))
    return r.add(l);
  if (!r && Ri.WillChange) {
    const u = new Ri.WillChange("auto");
    a.addValue("willChange", u), u.add(l);
  }
}
function xd(a) {
  return a.replace(/([A-Z])/g, (l) => `-${l.toLowerCase()}`);
}
const qA = "framerAppearId", jv = "data-" + xd(qA);
function Gv(a) {
  return a.props[jv];
}
function XA({ protectedKeys: a, needsAnimating: l }, r) {
  const u = a.hasOwnProperty(r) && l[r] !== !0;
  return l[r] = !1, u;
}
function Yv(a, l, { delay: r = 0, transitionOverride: u, type: c } = {}) {
  let { transition: h, transitionEnd: d, ...m } = l;
  const g = a.getDefaultTransition();
  h = h ? Bv(h, g) : g;
  const b = h == null ? void 0 : h.reduceMotion, v = h == null ? void 0 : h.skipAnimations;
  u && (h = u);
  const p = [], S = c && a.animationState && a.animationState.getState()[c], z = h == null ? void 0 : h.path;
  z && z.animateVisualElement(a, m, h, r, p);
  for (const w in m) {
    const U = a.getValue(w, a.latestValues[w] ?? null), N = m[w];
    if (N === void 0 || S && XA(S, w))
      continue;
    const H = {
      delay: r,
      ...Td(h || {}, w)
    };
    v && (H.skipAnimations = !0);
    const j = U.get();
    if (j !== void 0 && !U.isAnimating() && !Array.isArray(N) && N === j && !H.velocity) {
      Vt.update(() => U.set(N));
      continue;
    }
    let Y = !1;
    if (window.MotionHandoffAnimation) {
      const st = Gv(a);
      if (st) {
        const Z = window.MotionHandoffAnimation(st, w, Vt);
        Z !== null && (H.startTime = Z, Y = !0);
      }
    }
    Pf(a, w);
    const X = b ?? a.shouldReduceMotion;
    U.start(Ed(w, U, N, X && Hv.has(w) ? { type: !1 } : H, a, Y));
    const P = U.animation;
    P && p.push(P);
  }
  if (d) {
    const w = () => Vt.update(() => {
      d && GA(a, d);
    });
    p.length ? Promise.all(p).then(w) : w();
  }
  return p;
}
function If(a, l, r = {}) {
  var g;
  const u = ua(a, l, r.type === "exit" ? (g = a.presenceContext) == null ? void 0 : g.custom : void 0);
  let { transition: c = a.getDefaultTransition() || {} } = u || {};
  r.transitionOverride && (c = r.transitionOverride);
  const h = u ? () => Promise.all(Yv(a, u, r)) : () => Promise.resolve(), d = a.variantChildren && a.variantChildren.size ? (b = 0) => {
    const { delayChildren: v = 0, staggerChildren: p, staggerDirection: S } = c;
    return QA(a, l, b, v, p, S, r);
  } : () => Promise.resolve(), { when: m } = c;
  if (m) {
    const [b, v] = m === "beforeChildren" ? [h, d] : [d, h];
    return b().then(() => v());
  } else
    return Promise.all([h(), d(r.delay)]);
}
function QA(a, l, r = 0, u = 0, c = 0, h = 1, d) {
  const m = [];
  for (const g of a.variantChildren)
    g.notify("AnimationStart", l), m.push(If(g, l, {
      ...d,
      delay: r + (typeof u == "function" ? 0 : u) + Uv(a.variantChildren, g, u, c, h)
    }).then(() => g.notify("AnimationComplete", l)));
  return Promise.all(m);
}
function ZA(a, l, r = {}) {
  a.notify("AnimationStart", l);
  let u;
  if (Array.isArray(l)) {
    const c = l.map((h) => If(a, h, r));
    u = Promise.all(c);
  } else if (typeof l == "string")
    u = If(a, l, r);
  else {
    const c = typeof l == "function" ? ua(a, l, r.custom) : l;
    u = Promise.all(Yv(a, c, r));
  }
  return u.then(() => {
    a.notify("AnimationComplete", l);
  });
}
const KA = {
  test: (a) => a === "auto",
  parse: (a) => a
}, qv = (a) => (l) => l.test(a), Xv = [ol, tt, On, kn, vE, gE, KA], Bg = (a) => Xv.find(qv(a));
function kA(a) {
  return typeof a == "number" ? a === 0 : a !== null ? a === "none" || a === "0" || $0(a) : !0;
}
const JA = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function FA(a) {
  const [l, r] = a.slice(0, -1).split("(");
  if (l === "drop-shadow")
    return a;
  const [u] = r.match(pd) || [];
  if (!u)
    return a;
  const c = r.replace(u, "");
  let h = JA.has(l) ? 1 : 0;
  return u !== r && (h *= 100), l + "(" + h + c + ")";
}
const PA = /\b([a-z-]*)\(.*?\)/gu, Wf = {
  ...fn,
  getAnimatableNone: (a) => {
    const l = a.match(PA);
    return l ? l.map(FA).join(" ") : a;
  }
}, $f = {
  ...fn,
  getAnimatableNone: (a) => {
    const l = fn.parse(a);
    return fn.createTransformer(a)(l.map((u) => typeof u == "number" ? 0 : typeof u == "object" ? { ...u, alpha: 1 } : u));
  }
}, Lg = {
  ...ol,
  transform: Math.round
}, IA = {
  rotate: kn,
  /**
   * Internal channel for `transition.path` orientToPath. Composed onto
   * `rotate` at the transform-build sites so the user's `rotate` is
   * never read or overwritten. Not part of `transformPropOrder`.
   */
  pathRotation: kn,
  rotateX: kn,
  rotateY: kn,
  rotateZ: kn,
  scale: iu,
  scaleX: iu,
  scaleY: iu,
  scaleZ: iu,
  skew: kn,
  skewX: kn,
  skewY: kn,
  distance: tt,
  translateX: tt,
  translateY: tt,
  translateZ: tt,
  x: tt,
  y: tt,
  z: tt,
  perspective: tt,
  transformPerspective: tt,
  opacity: ys,
  originX: Ag,
  originY: Ag,
  originZ: tt
}, bu = {
  // Border props
  borderWidth: tt,
  borderTopWidth: tt,
  borderRightWidth: tt,
  borderBottomWidth: tt,
  borderLeftWidth: tt,
  borderRadius: tt,
  borderTopLeftRadius: tt,
  borderTopRightRadius: tt,
  borderBottomRightRadius: tt,
  borderBottomLeftRadius: tt,
  // Positioning props
  width: tt,
  maxWidth: tt,
  height: tt,
  maxHeight: tt,
  top: tt,
  right: tt,
  bottom: tt,
  left: tt,
  inset: tt,
  insetBlock: tt,
  insetBlockStart: tt,
  insetBlockEnd: tt,
  insetInline: tt,
  insetInlineStart: tt,
  insetInlineEnd: tt,
  // Spacing props
  padding: tt,
  paddingTop: tt,
  paddingRight: tt,
  paddingBottom: tt,
  paddingLeft: tt,
  paddingBlock: tt,
  paddingBlockStart: tt,
  paddingBlockEnd: tt,
  paddingInline: tt,
  paddingInlineStart: tt,
  paddingInlineEnd: tt,
  margin: tt,
  marginTop: tt,
  marginRight: tt,
  marginBottom: tt,
  marginLeft: tt,
  marginBlock: tt,
  marginBlockStart: tt,
  marginBlockEnd: tt,
  marginInline: tt,
  marginInlineStart: tt,
  marginInlineEnd: tt,
  // Typography
  fontSize: tt,
  // Misc
  backgroundPositionX: tt,
  backgroundPositionY: tt,
  ...IA,
  zIndex: Lg,
  // SVG
  fillOpacity: ys,
  strokeOpacity: ys,
  numOctaves: Lg
}, WA = {
  ...bu,
  // Color props
  color: te,
  backgroundColor: te,
  outlineColor: te,
  fill: te,
  stroke: te,
  // Border props
  borderColor: te,
  borderTopColor: te,
  borderRightColor: te,
  borderBottomColor: te,
  borderLeftColor: te,
  filter: Wf,
  WebkitFilter: Wf,
  mask: $f,
  WebkitMask: $f
}, Qv = (a) => WA[a], $A = /* @__PURE__ */ new Set([Wf, $f]);
function Zv(a, l) {
  let r = Qv(a);
  return $A.has(r) || (r = fn), r.getAnimatableNone ? r.getAnimatableNone(l) : void 0;
}
const tx = /* @__PURE__ */ new Set(["auto", "none", "0"]);
function ex(a, l, r) {
  let u = 0, c;
  for (; u < a.length && !c; ) {
    const h = a[u];
    typeof h == "string" && !tx.has(h) && sl(h).values.length && (c = a[u]), u++;
  }
  if (c && r)
    for (const h of l)
      a[h] = Zv(r, c);
}
class nx extends Sd {
  constructor(l, r, u, c, h) {
    super(l, r, u, c, h, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: l, element: r, name: u } = this;
    if (!r || !r.current)
      return;
    super.readKeyframes();
    for (let v = 0; v < l.length; v++) {
      let p = l[v];
      if (typeof p == "string" && (p = p.trim(), md(p))) {
        const S = Lv(p, r.current);
        S !== void 0 && (l[v] = S), v === l.length - 1 && (this.finalKeyframe = p);
      }
    }
    if (this.resolveNoneKeyframes(), !Hv.has(u) || l.length !== 2)
      return;
    const [c, h] = l, d = Bg(c), m = Bg(h), g = Eg(c), b = Eg(h);
    if (g !== b && zi[u]) {
      this.needsMeasurement = !0;
      return;
    }
    if (d !== m)
      if (wg(d) && wg(m))
        for (let v = 0; v < l.length; v++) {
          const p = l[v];
          typeof p == "string" && (l[v] = parseFloat(p));
        }
      else zi[u] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: l, name: r } = this, u = [];
    for (let c = 0; c < l.length; c++)
      (l[c] === null || kA(l[c])) && u.push(c);
    u.length && ex(l, u, r);
  }
  measureInitialState() {
    const { element: l, unresolvedKeyframes: r, name: u } = this;
    if (!l || !l.current)
      return;
    u === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = zi[u](l.measureViewportBox(), window.getComputedStyle(l.current)), r[0] = this.measuredOrigin;
    const c = r[r.length - 1];
    c !== void 0 && l.getValue(u, c).jump(c, !1);
  }
  measureEndState() {
    var m;
    const { element: l, name: r, unresolvedKeyframes: u } = this;
    if (!l || !l.current)
      return;
    const c = l.getValue(r);
    c && c.jump(this.measuredOrigin, !1);
    const h = u.length - 1, d = u[h];
    u[h] = zi[r](l.measureViewportBox(), window.getComputedStyle(l.current)), d !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = d), (m = this.removedTransforms) != null && m.length && this.removedTransforms.forEach(([g, b]) => {
      l.getValue(g).set(b);
    }), this.resolveNoneKeyframes();
  }
}
const Md = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius"
];
function Kv(a, l, r) {
  if (a == null)
    return [];
  if (a instanceof EventTarget)
    return [a];
  if (typeof a == "string") {
    let u = document;
    const c = (r == null ? void 0 : r[a]) ?? u.querySelectorAll(a);
    return c ? Array.from(c) : [];
  }
  return Array.from(a).filter((u) => u != null);
}
const td = (a, l) => l && typeof a == "number" ? l.transform(a) : a;
function ix(a) {
  return W0(a) && "offsetHeight" in a && !("ownerSVGElement" in a);
}
const { schedule: Cd } = /* @__PURE__ */ dv(queueMicrotask, !1), cn = {
  x: !1,
  y: !1
};
function kv() {
  return cn.x || cn.y;
}
function ax(a) {
  return a === "x" || a === "y" ? cn[a] ? null : (cn[a] = !0, () => {
    cn[a] = !1;
  }) : cn.x || cn.y ? null : (cn.x = cn.y = !0, () => {
    cn.x = cn.y = !1;
  });
}
function Jv(a, l) {
  const r = Kv(a), u = new AbortController(), c = {
    passive: !0,
    ...l,
    signal: u.signal
  };
  return [r, c, () => u.abort()];
}
function lx(a) {
  return !(a.pointerType === "touch" || kv());
}
function sx(a, l, r = {}) {
  const [u, c, h] = Jv(a, r);
  return u.forEach((d) => {
    let m = !1, g = !1, b;
    const v = () => {
      d.removeEventListener("pointerleave", w);
    }, p = (N) => {
      b && (b(N), b = void 0), v();
    }, S = (N) => {
      m = !1, window.removeEventListener("pointerup", S), window.removeEventListener("pointercancel", S), g && (g = !1, p(N));
    }, z = () => {
      m = !0, window.addEventListener("pointerup", S, c), window.addEventListener("pointercancel", S, c);
    }, w = (N) => {
      if (N.pointerType !== "touch") {
        if (m) {
          g = !0;
          return;
        }
        p(N);
      }
    }, U = (N) => {
      if (!lx(N))
        return;
      g = !1;
      const H = l(d, N);
      typeof H == "function" && (b = H, d.addEventListener("pointerleave", w, c));
    };
    d.addEventListener("pointerenter", U, c), d.addEventListener("pointerdown", z, c);
  }), h;
}
const Fv = (a, l) => l ? a === l ? !0 : Fv(a, l.parentElement) : !1, Dd = (a) => a.pointerType === "mouse" ? typeof a.button != "number" || a.button <= 0 : a.isPrimary !== !1, ox = /* @__PURE__ */ new Set([
  "BUTTON",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "A"
]);
function ux(a) {
  return ox.has(a.tagName) || a.isContentEditable === !0;
}
const rx = /* @__PURE__ */ new Set(["INPUT", "SELECT", "TEXTAREA"]);
function cx(a) {
  return rx.has(a.tagName) || a.isContentEditable === !0;
}
const ru = /* @__PURE__ */ new WeakSet();
function Hg(a) {
  return (l) => {
    l.key === "Enter" && a(l);
  };
}
function Mf(a, l) {
  a.dispatchEvent(new PointerEvent("pointer" + l, { isPrimary: !0, bubbles: !0 }));
}
const fx = (a, l) => {
  const r = a.currentTarget;
  if (!r)
    return;
  const u = Hg(() => {
    if (ru.has(r))
      return;
    Mf(r, "down");
    const c = Hg(() => {
      Mf(r, "up");
    }), h = () => Mf(r, "cancel");
    r.addEventListener("keyup", c, l), r.addEventListener("blur", h, l);
  });
  r.addEventListener("keydown", u, l), r.addEventListener("blur", () => r.removeEventListener("keydown", u), l);
};
function jg(a) {
  return Dd(a) && !kv();
}
const Gg = /* @__PURE__ */ new WeakSet();
function dx(a, l, r = {}) {
  const [u, c, h] = Jv(a, r), d = (m) => {
    const g = m.currentTarget;
    if (!jg(m) || Gg.has(m))
      return;
    ru.add(g), r.stopPropagation && Gg.add(m);
    const b = l(g, m), v = { ...c, capture: !0 }, p = (w, U) => {
      window.removeEventListener("pointerup", S, v), window.removeEventListener("pointercancel", z, v), ru.has(g) && ru.delete(g), jg(w) && typeof b == "function" && b(w, { success: U });
    }, S = (w) => {
      p(w, g === window || g === document || r.useGlobalTarget || Fv(g, w.target));
    }, z = (w) => {
      p(w, !1);
    };
    window.addEventListener("pointerup", S, v), window.addEventListener("pointercancel", z, v);
  };
  return u.forEach((m) => {
    (r.useGlobalTarget ? window : m).addEventListener("pointerdown", d, c), ix(m) && (m.addEventListener("focus", (b) => fx(b, c)), !ux(m) && !m.hasAttribute("tabindex") && (m.tabIndex = 0));
  }), h;
}
function zd(a) {
  return W0(a) && "ownerSVGElement" in a;
}
const cu = /* @__PURE__ */ new WeakMap();
let Ci;
const Pv = (a, l, r) => (u, c) => c && c[0] ? c[0][a + "Size"] : zd(u) && "getBBox" in u ? u.getBBox()[l] : u[r], hx = /* @__PURE__ */ Pv("inline", "width", "offsetWidth"), mx = /* @__PURE__ */ Pv("block", "height", "offsetHeight");
function px({ target: a, borderBoxSize: l }) {
  var r;
  (r = cu.get(a)) == null || r.forEach((u) => {
    u(a, {
      get width() {
        return hx(a, l);
      },
      get height() {
        return mx(a, l);
      }
    });
  });
}
function yx(a) {
  a.forEach(px);
}
function gx() {
  typeof ResizeObserver > "u" || (Ci = new ResizeObserver(yx));
}
function vx(a, l) {
  Ci || gx();
  const r = Kv(a);
  return r.forEach((u) => {
    let c = cu.get(u);
    c || (c = /* @__PURE__ */ new Set(), cu.set(u, c)), c.add(l), Ci == null || Ci.observe(u);
  }), () => {
    r.forEach((u) => {
      const c = cu.get(u);
      c == null || c.delete(l), c != null && c.size || Ci == null || Ci.unobserve(u);
    });
  };
}
const fu = /* @__PURE__ */ new Set();
let al;
function bx() {
  al = () => {
    const a = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      }
    };
    fu.forEach((l) => l(a));
  }, window.addEventListener("resize", al);
}
function Sx(a) {
  return fu.add(a), al || bx(), () => {
    fu.delete(a), !fu.size && typeof al == "function" && (window.removeEventListener("resize", al), al = void 0);
  };
}
function Yg(a, l) {
  return typeof a == "function" ? Sx(a) : vx(a, l);
}
function Tx(a) {
  return zd(a) && a.tagName === "svg";
}
function Ex(...a) {
  const l = !Array.isArray(a[0]), r = l ? 0 : -1, u = a[0 + r], c = a[1 + r], h = a[2 + r], d = a[3 + r], m = Av(c, h, d);
  return l ? m(u) : m;
}
function Ax(a, l, r = {}) {
  const u = a.get();
  let c = null, h = u, d;
  const m = typeof u == "string" ? u.replace(/[\d.-]/g, "") : void 0, g = () => {
    c && (c.stop(), c = null), a.animation = void 0;
  }, b = () => {
    const p = qg(a.get()), S = qg(h);
    if (p === S) {
      g();
      return;
    }
    const z = c ? c.getGeneratorVelocity() : a.getVelocity();
    g(), c = new gs({
      keyframes: [p, S],
      velocity: z,
      // Default to spring if no type specified (matches useSpring behavior)
      type: "spring",
      restDelta: 1e-3,
      restSpeed: 0.01,
      ...r,
      onUpdate: d
    });
  }, v = () => {
    var p;
    b(), a.animation = c ?? void 0, (p = a.events.animationStart) == null || p.notify(), c == null || c.then(() => {
      var S;
      a.animation = void 0, (S = a.events.animationComplete) == null || S.notify();
    });
  };
  if (a.attach((p, S) => {
    h = p, d = (z) => S(Cf(z, m)), Vt.postRender(v);
  }, g), Ft(l)) {
    let p = r.skipInitialAnimation === !0;
    const S = l.on("change", (w) => {
      p ? (p = !1, a.jump(Cf(w, m), !1)) : a.set(Cf(w, m));
    }), z = a.on("destroy", S);
    return () => {
      S(), z();
    };
  }
  return g;
}
function Cf(a, l) {
  return l ? a + l : a;
}
function qg(a) {
  return typeof a == "number" ? a : parseFloat(a);
}
const xx = [...Xv, te, fn], Mx = (a) => xx.find(qv(a)), Xg = () => ({
  translate: 0,
  scale: 1,
  origin: 0,
  originPoint: 0
}), ll = () => ({
  x: Xg(),
  y: Xg()
}), Qg = () => ({ min: 0, max: 0 }), ae = () => ({
  x: Qg(),
  y: Qg()
}), Cx = /* @__PURE__ */ new WeakMap();
function zu(a) {
  return a !== null && typeof a == "object" && typeof a.start == "function";
}
function vs(a) {
  return typeof a == "string" || Array.isArray(a);
}
const Od = [
  "animate",
  "whileInView",
  "whileFocus",
  "whileHover",
  "whileTap",
  "whileDrag",
  "exit"
], Rd = ["initial", ...Od];
function Ou(a) {
  return zu(a.animate) || Rd.some((l) => vs(a[l]));
}
function Iv(a) {
  return !!(Ou(a) || a.variants);
}
function Dx(a, l, r) {
  for (const u in l) {
    const c = l[u], h = r[u];
    if (Ft(c))
      a.addValue(u, c);
    else if (Ft(h))
      a.addValue(u, ra(c, { owner: a }));
    else if (h !== c)
      if (a.hasValue(u)) {
        const d = a.getValue(u);
        d.liveStyle === !0 ? d.jump(c) : d.hasAnimated || d.set(c);
      } else {
        const d = a.getStaticValue(u);
        a.addValue(u, ra(d !== void 0 ? d : c, { owner: a }));
      }
  }
  for (const u in r)
    l[u] === void 0 && a.removeValue(u);
  return l;
}
const Su = { current: null }, wd = { current: !1 }, zx = typeof window < "u";
function Wv() {
  if (wd.current = !0, !!zx)
    if (window.matchMedia) {
      const a = window.matchMedia("(prefers-reduced-motion)"), l = () => Su.current = a.matches;
      a.addEventListener("change", l), l();
    } else
      Su.current = !1;
}
const Zg = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete"
];
let Tu = {};
function $v(a) {
  Tu = a;
}
function Ox() {
  return Tu;
}
class Rx {
  /**
   * This method takes React props and returns found MotionValues. For example, HTML
   * MotionValues will be found within the style prop, whereas for Three.js within attribute arrays.
   *
   * This isn't an abstract method as it needs calling in the constructor, but it is
   * intended to be one.
   */
  scrapeMotionValuesFromProps(l, r, u) {
    return {};
  }
  constructor({ parent: l, props: r, presenceContext: u, reducedMotionConfig: c, skipAnimations: h, blockInitialAnimation: d, visualState: m }, g = {}) {
    this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Sd, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
      this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
    }, this.renderScheduledAt = 0, this.scheduleRender = () => {
      const z = Ae.now();
      this.renderScheduledAt < z && (this.renderScheduledAt = z, Vt.render(this.render, !1, !0));
    };
    const { latestValues: b, renderState: v } = m;
    this.latestValues = b, this.baseTarget = { ...b }, this.initialValues = r.initial ? { ...b } : {}, this.renderState = v, this.parent = l, this.props = r, this.presenceContext = u, this.depth = l ? l.depth + 1 : 0, this.reducedMotionConfig = c, this.skipAnimationsConfig = h, this.options = g, this.blockInitialAnimation = !!d, this.isControllingVariants = Ou(r), this.isVariantNode = Iv(r), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(l && l.current);
    const { willChange: p, ...S } = this.scrapeMotionValuesFromProps(r, {}, this);
    for (const z in S) {
      const w = S[z];
      b[z] !== void 0 && Ft(w) && w.set(b[z]);
    }
  }
  mount(l) {
    var r, u;
    if (this.hasBeenMounted)
      for (const c in this.initialValues)
        (r = this.values.get(c)) == null || r.jump(this.initialValues[c]), this.latestValues[c] = this.initialValues[c];
    this.current = l, Cx.set(l, this), this.projection && !this.projection.instance && this.projection.mount(l), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((c, h) => this.bindToMotionValue(h, c)), this.reducedMotionConfig === "never" ? this.shouldReduceMotion = !1 : this.reducedMotionConfig === "always" ? this.shouldReduceMotion = !0 : (wd.current || Wv(), this.shouldReduceMotion = Su.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, (u = this.parent) == null || u.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0;
  }
  unmount() {
    var l;
    this.projection && this.projection.unmount(), Jn(this.notifyUpdate), Jn(this.render), this.valueSubscriptions.forEach((r) => r()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (l = this.parent) == null || l.removeChild(this);
    for (const r in this.events)
      this.events[r].clear();
    for (const r in this.features) {
      const u = this.features[r];
      u && (u.unmount(), u.isMounted = !1);
    }
    this.current = null;
  }
  addChild(l) {
    this.children.add(l), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(l);
  }
  removeChild(l) {
    this.children.delete(l), this.enteringChildren && this.enteringChildren.delete(l);
  }
  bindToMotionValue(l, r) {
    if (this.valueSubscriptions.has(l) && this.valueSubscriptions.get(l)(), r.accelerate && _v.has(l) && this.current instanceof HTMLElement) {
      const { factory: d, keyframes: m, times: g, ease: b, duration: v } = r.accelerate, p = new Nv({
        element: this.current,
        name: l,
        keyframes: m,
        times: g,
        ease: b,
        duration: /* @__PURE__ */ Ne(v)
      }), S = d(p);
      this.valueSubscriptions.set(l, () => {
        S(), p.cancel();
      });
      return;
    }
    const u = rl.has(l);
    u && this.onBindTransform && this.onBindTransform();
    const c = r.on("change", (d) => {
      this.latestValues[l] = d, this.props.onUpdate && Vt.preRender(this.notifyUpdate), u && this.projection && (this.projection.isTransformDirty = !0), this.scheduleRender();
    });
    let h;
    typeof window < "u" && window.MotionCheckAppearSync && (h = window.MotionCheckAppearSync(this, l, r)), this.valueSubscriptions.set(l, () => {
      c(), h && h();
    });
  }
  sortNodePosition(l) {
    return !this.current || !this.sortInstanceNodePosition || this.type !== l.type ? 0 : this.sortInstanceNodePosition(this.current, l.current);
  }
  updateFeatures() {
    let l = "animation";
    for (l in Tu) {
      const r = Tu[l];
      if (!r)
        continue;
      const { isEnabled: u, Feature: c } = r;
      if (!this.features[l] && c && u(this.props) && (this.features[l] = new c(this)), this.features[l]) {
        const h = this.features[l];
        h.isMounted ? h.update() : (h.mount(), h.isMounted = !0);
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  /**
   * Measure the current viewport box with or without transforms.
   * Only measures axis-aligned boxes, rotate and skew must be manually
   * removed with a re-render to work.
   */
  measureViewportBox() {
    return this.current ? this.measureInstanceViewportBox(this.current, this.props) : ae();
  }
  getStaticValue(l) {
    return this.latestValues[l];
  }
  setStaticValue(l, r) {
    this.latestValues[l] = r;
  }
  /**
   * Update the provided props. Ensure any newly-added motion values are
   * added to our map, old ones removed, and listeners updated.
   */
  update(l, r) {
    (l.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = l, this.prevPresenceContext = this.presenceContext, this.presenceContext = r;
    for (let u = 0; u < Zg.length; u++) {
      const c = Zg[u];
      this.propEventSubscriptions[c] && (this.propEventSubscriptions[c](), delete this.propEventSubscriptions[c]);
      const h = "on" + c, d = l[h];
      d && (this.propEventSubscriptions[c] = this.on(c, d));
    }
    this.prevMotionValues = Dx(this, this.scrapeMotionValuesFromProps(l, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
  }
  getProps() {
    return this.props;
  }
  /**
   * Returns the variant definition with a given name.
   */
  getVariant(l) {
    return this.props.variants ? this.props.variants[l] : void 0;
  }
  /**
   * Returns the defined default transition on this component.
   */
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
  }
  /**
   * Add a child visual element to our set of children.
   */
  addVariantChild(l) {
    const r = this.getClosestVariantNode();
    if (r)
      return r.variantChildren && r.variantChildren.add(l), () => r.variantChildren.delete(l);
  }
  /**
   * Add a motion value and bind it to this visual element.
   */
  addValue(l, r) {
    const u = this.values.get(l);
    r !== u && (u && this.removeValue(l), this.bindToMotionValue(l, r), this.values.set(l, r), this.latestValues[l] = r.get());
  }
  /**
   * Remove a motion value and unbind any active subscriptions.
   */
  removeValue(l) {
    this.values.delete(l);
    const r = this.valueSubscriptions.get(l);
    r && (r(), this.valueSubscriptions.delete(l)), delete this.latestValues[l], this.removeValueFromRenderState(l, this.renderState);
  }
  /**
   * Check whether we have a motion value for this key
   */
  hasValue(l) {
    return this.values.has(l);
  }
  getValue(l, r) {
    if (this.props.values && this.props.values[l])
      return this.props.values[l];
    let u = this.values.get(l);
    return u === void 0 && r !== void 0 && (u = ra(r === null ? void 0 : r, { owner: this }), this.addValue(l, u)), u;
  }
  /**
   * If we're trying to animate to a previously unencountered value,
   * we need to check for it in our state and as a last resort read it
   * directly from the instance (which might have performance implications).
   */
  readValue(l, r) {
    let u = this.latestValues[l] !== void 0 || !this.current ? this.latestValues[l] : this.getBaseTargetFromProps(this.props, l) ?? this.readValueFromInstance(this.current, l, this.options);
    return u != null && (typeof u == "string" && (I0(u) || $0(u)) ? u = parseFloat(u) : !Mx(u) && fn.test(r) && (u = Zv(l, r)), this.setBaseTarget(l, Ft(u) ? u.get() : u)), Ft(u) ? u.get() : u;
  }
  /**
   * Set the base target to later animate back to. This is currently
   * only hydrated on creation and when we first read a value.
   */
  setBaseTarget(l, r) {
    this.baseTarget[l] = r;
  }
  /**
   * Find the base target for a value thats been removed from all animation
   * props.
   */
  getBaseTarget(l) {
    var h;
    const { initial: r } = this.props;
    let u;
    if (typeof r == "string" || typeof r == "object") {
      const d = Ad(this.props, r, (h = this.presenceContext) == null ? void 0 : h.custom);
      d && (u = d[l]);
    }
    if (r && u !== void 0)
      return u;
    const c = this.getBaseTargetFromProps(this.props, l);
    return c !== void 0 && !Ft(c) ? c : this.initialValues[l] !== void 0 && u === void 0 ? void 0 : this.baseTarget[l];
  }
  on(l, r) {
    return this.events[l] || (this.events[l] = new fd()), this.events[l].add(r);
  }
  notify(l, ...r) {
    this.events[l] && this.events[l].notify(...r);
  }
  scheduleRenderMicrotask() {
    Cd.render(this.render);
  }
}
class tb extends Rx {
  constructor() {
    super(...arguments), this.KeyframeResolver = nx;
  }
  sortInstanceNodePosition(l, r) {
    return l.compareDocumentPosition(r) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(l, r) {
    const u = l.style;
    return u ? u[r] : void 0;
  }
  removeValueFromRenderState(l, { vars: r, style: u }) {
    delete r[l], delete u[l];
  }
  handleChildMotionValue() {
    this.childSubscription && (this.childSubscription(), delete this.childSubscription);
    const { children: l } = this.props;
    Ft(l) && (this.childSubscription = l.on("change", (r) => {
      this.current && (this.current.textContent = `${r}`);
    }));
  }
}
class wi {
  constructor(l) {
    this.isMounted = !1, this.node = l;
  }
  update() {
  }
}
function eb({ top: a, left: l, right: r, bottom: u }) {
  return {
    x: { min: l, max: r },
    y: { min: a, max: u }
  };
}
function wx({ x: a, y: l }) {
  return { top: l.min, right: a.max, bottom: l.max, left: a.min };
}
function Nx(a, l) {
  if (!l)
    return a;
  const r = l({ x: a.left, y: a.top }), u = l({ x: a.right, y: a.bottom });
  return {
    top: r.y,
    left: r.x,
    bottom: u.y,
    right: u.x
  };
}
function Df(a) {
  return a === void 0 || a === 1;
}
function ed({ scale: a, scaleX: l, scaleY: r }) {
  return !Df(a) || !Df(l) || !Df(r);
}
function aa(a) {
  return ed(a) || nb(a) || a.z || a.rotate || a.rotateX || a.rotateY || a.skewX || a.skewY;
}
function nb(a) {
  return Kg(a.x) || Kg(a.y);
}
function Kg(a) {
  return a && a !== "0%";
}
function Eu(a, l, r) {
  const u = a - r, c = l * u;
  return r + c;
}
function kg(a, l, r, u, c) {
  return c !== void 0 && (a = Eu(a, c, u)), Eu(a, r, u) + l;
}
function nd(a, l = 0, r = 1, u, c) {
  a.min = kg(a.min, l, r, u, c), a.max = kg(a.max, l, r, u, c);
}
function ib(a, { x: l, y: r }) {
  nd(a.x, l.translate, l.scale, l.originPoint), nd(a.y, r.translate, r.scale, r.originPoint);
}
const Jg = 0.999999999999, Fg = 1.0000000000001;
function Vx(a, l, r, u = !1) {
  var m;
  const c = r.length;
  if (!c)
    return;
  l.x = l.y = 1;
  let h, d;
  for (let g = 0; g < c; g++) {
    h = r[g], d = h.projectionDelta;
    const { visualElement: b } = h.options;
    b && b.props.style && b.props.style.display === "contents" || (u && h.options.layoutScroll && h.scroll && h !== h.root && (zn(a.x, -h.scroll.offset.x), zn(a.y, -h.scroll.offset.y)), d && (l.x *= d.x.scale, l.y *= d.y.scale, ib(a, d)), u && aa(h.latestValues) && du(a, h.latestValues, (m = h.layout) == null ? void 0 : m.layoutBox));
  }
  l.x < Fg && l.x > Jg && (l.x = 1), l.y < Fg && l.y > Jg && (l.y = 1);
}
function zn(a, l) {
  a.min += l, a.max += l;
}
function Pg(a, l, r, u, c = 0.5) {
  const h = Bt(a.min, a.max, c);
  nd(a, l, r, h, u);
}
function Ig(a, l) {
  return typeof a == "string" ? parseFloat(a) / 100 * (l.max - l.min) : a;
}
function du(a, l, r) {
  const u = r ?? a;
  Pg(a.x, Ig(l.x, u.x), l.scaleX, l.scale, l.originX), Pg(a.y, Ig(l.y, u.y), l.scaleY, l.scale, l.originY);
}
function ab(a, l) {
  return eb(Nx(a.getBoundingClientRect(), l));
}
function _x(a, l, r) {
  const u = ab(a, r), { scroll: c } = l;
  return c && (zn(u.x, c.offset.x), zn(u.y, c.offset.y)), u;
}
const Ux = {
  x: "translateX",
  y: "translateY",
  z: "translateZ",
  transformPerspective: "perspective"
}, Bx = ul.length;
function Lx(a, l, r) {
  let u = "", c = !0;
  for (let d = 0; d < Bx; d++) {
    const m = ul[d], g = a[m];
    if (g === void 0)
      continue;
    let b = !0;
    if (typeof g == "number")
      b = g === (m.startsWith("scale") ? 1 : 0);
    else {
      const v = parseFloat(g);
      b = m.startsWith("scale") ? v === 1 : v === 0;
    }
    if (!b || r) {
      const v = td(g, bu[m]);
      if (!b) {
        c = !1;
        const p = Ux[m] || m;
        u += `${p}(${v}) `;
      }
      r && (l[m] = v);
    }
  }
  const h = a.pathRotation;
  return h && (c = !1, u += `rotate(${td(h, bu.pathRotation)}) `), u = u.trim(), r ? u = r(l, c ? "" : u) : c && (u = "none"), u;
}
function Nd(a, l, r) {
  const { style: u, vars: c, transformOrigin: h } = a;
  let d = !1, m = !1;
  for (const g in l) {
    const b = l[g];
    if (rl.has(g)) {
      d = !0;
      continue;
    } else if (mv(g)) {
      c[g] = b;
      continue;
    } else {
      const v = td(b, bu[g]);
      g.startsWith("origin") ? (m = !0, h[g] = v) : u[g] = v;
    }
  }
  if (l.transform || (d || r ? u.transform = Lx(l, a.transform, r) : u.transform && (u.transform = "none")), m) {
    const { originX: g = "50%", originY: b = "50%", originZ: v = 0 } = h;
    u.transformOrigin = `${g} ${b} ${v}`;
  }
}
function lb(a, { style: l, vars: r }, u, c) {
  const h = a.style;
  let d;
  for (d in l)
    h[d] = l[d];
  c == null || c.applyProjectionStyles(h, u);
  for (d in r)
    h.setProperty(d, r[d]);
}
function Wg(a, l) {
  return l.max === l.min ? 0 : a / (l.max - l.min) * 100;
}
const ss = {
  correct: (a, l) => {
    if (!l.target)
      return a;
    if (typeof a == "string")
      if (tt.test(a))
        a = parseFloat(a);
      else
        return a;
    const r = Wg(a, l.target.x), u = Wg(a, l.target.y);
    return `${r}% ${u}%`;
  }
}, Hx = {
  correct: (a, { treeScale: l, projectionDelta: r }) => {
    const u = a, c = fn.parse(a);
    if (c.length > 5)
      return u;
    const h = fn.createTransformer(a), d = typeof c[0] != "number" ? 1 : 0, m = r.x.scale * l.x, g = r.y.scale * l.y;
    c[0 + d] /= m, c[1 + d] /= g;
    const b = Bt(m, g, 0.5);
    return typeof c[2 + d] == "number" && (c[2 + d] /= b), typeof c[3 + d] == "number" && (c[3 + d] /= b), h(c);
  }
}, id = {
  borderRadius: {
    ...ss,
    applyTo: [...Md]
  },
  borderTopLeftRadius: ss,
  borderTopRightRadius: ss,
  borderBottomLeftRadius: ss,
  borderBottomRightRadius: ss,
  boxShadow: Hx
};
function sb(a, { layout: l, layoutId: r }) {
  return rl.has(a) || a.startsWith("origin") || (l || r !== void 0) && (!!id[a] || a === "opacity");
}
function Vd(a, l, r) {
  var d;
  const u = a.style, c = l == null ? void 0 : l.style, h = {};
  if (!u)
    return h;
  for (const m in u)
    (Ft(u[m]) || c && Ft(c[m]) || sb(m, a) || ((d = r == null ? void 0 : r.getValue(m)) == null ? void 0 : d.liveStyle) !== void 0) && (h[m] = u[m]);
  return h;
}
function jx(a) {
  return window.getComputedStyle(a);
}
class Gx extends tb {
  constructor() {
    super(...arguments), this.type = "html", this.renderInstance = lb;
  }
  mount(l) {
    Oi(!!l.style, "motion.create() components must forward their ref to a HTML or SVG element", "custom-component-ref"), super.mount(l);
  }
  readValueFromInstance(l, r) {
    var u;
    if (rl.has(r))
      return (u = this.projection) != null && u.isProjecting ? Xf(r) : iA(l, r);
    {
      const c = jx(l), h = (mv(r) ? c.getPropertyValue(r) : c[r]) || 0;
      return typeof h == "string" ? h.trim() : h;
    }
  }
  measureInstanceViewportBox(l, { transformPagePoint: r }) {
    return ab(l, r);
  }
  build(l, r, u) {
    Nd(l, r, u.transformTemplate);
  }
  scrapeMotionValuesFromProps(l, r, u) {
    return Vd(l, r, u);
  }
}
const Yx = {
  offset: "stroke-dashoffset",
  array: "stroke-dasharray"
}, qx = {
  offset: "strokeDashoffset",
  array: "strokeDasharray"
};
function Xx(a, l, r = 1, u = 0, c = !0) {
  a.pathLength = 1;
  const h = c ? Yx : qx;
  a[h.offset] = `${-u}`, a[h.array] = `${l} ${r}`;
}
const Qx = [
  "offsetDistance",
  "offsetPath",
  "offsetRotate",
  "offsetAnchor"
];
function ob(a, {
  attrX: l,
  attrY: r,
  attrScale: u,
  pathLength: c,
  pathSpacing: h = 1,
  pathOffset: d = 0,
  // This is object creation, which we try to avoid per-frame.
  ...m
}, g, b, v) {
  if (Nd(a, m, b), g) {
    a.style.viewBox && (a.attrs.viewBox = a.style.viewBox);
    return;
  }
  a.attrs = a.style, a.style = {};
  const { attrs: p, style: S } = a;
  p.transform && (S.transform = p.transform, delete p.transform), (S.transform || p.transformOrigin) && (S.transformOrigin = p.transformOrigin ?? "50% 50%", delete p.transformOrigin), S.transform && (S.transformBox = (v == null ? void 0 : v.transformBox) ?? "fill-box", delete p.transformBox);
  for (const z of Qx)
    p[z] !== void 0 && (S[z] = p[z], delete p[z]);
  l !== void 0 && (p.x = l), r !== void 0 && (p.y = r), u !== void 0 && (p.scale = u), c !== void 0 && Xx(p, c, h, d, !1);
}
const ub = /* @__PURE__ */ new Set([
  "baseFrequency",
  "diffuseConstant",
  "kernelMatrix",
  "kernelUnitLength",
  "keySplines",
  "keyTimes",
  "limitingConeAngle",
  "markerHeight",
  "markerWidth",
  "numOctaves",
  "targetX",
  "targetY",
  "surfaceScale",
  "specularConstant",
  "specularExponent",
  "stdDeviation",
  "tableValues",
  "viewBox",
  "gradientTransform",
  "pathLength",
  "startOffset",
  "textLength",
  "lengthAdjust"
]), rb = (a) => typeof a == "string" && a.toLowerCase() === "svg";
function Zx(a, l, r, u) {
  lb(a, l, void 0, u);
  for (const c in l.attrs)
    a.setAttribute(ub.has(c) ? c : xd(c), l.attrs[c]);
}
function cb(a, l, r) {
  const u = Vd(a, l, r);
  for (const c in a)
    if (Ft(a[c]) || Ft(l[c])) {
      const h = ul.indexOf(c) !== -1 ? "attr" + c.charAt(0).toUpperCase() + c.substring(1) : c;
      u[h] = a[c];
    }
  return u;
}
class Kx extends tb {
  constructor() {
    super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = ae;
  }
  getBaseTargetFromProps(l, r) {
    return l[r];
  }
  readValueFromInstance(l, r) {
    if (rl.has(r)) {
      const u = Qv(r);
      return u && u.default || 0;
    }
    return r = ub.has(r) ? r : xd(r), l.getAttribute(r);
  }
  scrapeMotionValuesFromProps(l, r, u) {
    return cb(l, r, u);
  }
  build(l, r, u) {
    ob(l, r, this.isSVGTag, u.transformTemplate, u.style);
  }
  renderInstance(l, r, u, c) {
    Zx(l, r, u, c);
  }
  mount(l) {
    this.isSVGTag = rb(l.tagName), super.mount(l);
  }
}
const kx = Rd.length;
function fb(a) {
  if (!a)
    return;
  if (!a.isControllingVariants) {
    const r = a.parent ? fb(a.parent) || {} : {};
    return a.props.initial !== void 0 && (r.initial = a.props.initial), r;
  }
  const l = {};
  for (let r = 0; r < kx; r++) {
    const u = Rd[r], c = a.props[u];
    (vs(c) || c === !1) && (l[u] = c);
  }
  return l;
}
function db(a, l) {
  if (!Array.isArray(l))
    return !1;
  const r = l.length;
  if (r !== a.length)
    return !1;
  for (let u = 0; u < r; u++)
    if (l[u] !== a[u])
      return !1;
  return !0;
}
const Jx = [...Od].reverse(), Fx = Od.length;
function Px(a) {
  return (l) => Promise.all(l.map(({ animation: r, options: u }) => ZA(a, r, u)));
}
function Ix(a) {
  let l = Px(a), r = $g(), u = !0, c = !1;
  const h = (b) => (v, p) => {
    var z;
    const S = ua(a, p, b === "exit" ? (z = a.presenceContext) == null ? void 0 : z.custom : void 0);
    if (S) {
      const { transition: w, transitionEnd: U, ...N } = S;
      v = { ...v, ...N, ...U };
    }
    return v;
  };
  function d(b) {
    l = b(a);
  }
  function m(b) {
    const { props: v } = a, p = fb(a.parent) || {}, S = [], z = /* @__PURE__ */ new Set();
    let w = {}, U = 1 / 0;
    for (let H = 0; H < Fx; H++) {
      const j = Jx[H], Y = r[j], X = v[j] !== void 0 ? v[j] : p[j], P = vs(X), st = j === b ? Y.isActive : null;
      st === !1 && (U = H);
      let Z = X === p[j] && X !== v[j] && P;
      if (Z && (u || c) && a.manuallyAnimateOnMount && (Z = !1), Y.protectedKeys = { ...w }, // If it isn't active and hasn't *just* been set as inactive
      !Y.isActive && st === null || // If we didn't and don't have any defined prop for this animation type
      !X && !Y.prevProp || // Or if the prop doesn't define an animation
      zu(X) || typeof X == "boolean")
        continue;
      if (j === "exit" && Y.isActive && st !== !0) {
        Y.prevResolvedValues && (w = {
          ...w,
          ...Y.prevResolvedValues
        });
        continue;
      }
      const V = Wx(Y.prevProp, X);
      let dt = V || // If we're making this variant active, we want to always make it active
      j === b && Y.isActive && !Z && P || // If we removed a higher-priority variant (i is in reverse order)
      H > U && P, nt = !1;
      const bt = Array.isArray(X) ? X : [X];
      let Ct = bt.reduce(h(j), {});
      st === !1 && (Ct = {});
      const { prevResolvedValues: ee = {} } = Y, Xt = {
        ...ee,
        ...Ct
      }, At = (k) => {
        dt = !0, z.has(k) && (nt = !0, z.delete(k)), Y.needsAnimating[k] = !0;
        const ft = a.getValue(k);
        ft && (ft.liveStyle = !1);
      };
      for (const k in Xt) {
        const ft = Ct[k], q = ee[k];
        if (w.hasOwnProperty(k))
          continue;
        let Kt = !1;
        Ff(ft) && Ff(q) ? Kt = !db(ft, q) || V : Kt = ft !== q, Kt ? ft != null ? At(k) : z.add(k) : ft !== void 0 && z.has(k) ? At(k) : Y.protectedKeys[k] = !0;
      }
      Y.prevProp = X, Y.prevResolvedValues = Ct, Y.isActive && (w = { ...w, ...Ct }), (u || c) && a.blockInitialAnimation && (dt = !1);
      const G = Z && V;
      dt && (!G || nt) && S.push(...bt.map((k) => {
        const ft = { type: j };
        if (typeof k == "string" && (u || c) && !G && a.manuallyAnimateOnMount && a.parent) {
          const { parent: q } = a, Kt = ua(q, k);
          if (q.enteringChildren && Kt) {
            const { delayChildren: Me } = Kt.transition || {};
            ft.delay = Uv(q.enteringChildren, a, Me);
          }
        }
        return {
          animation: k,
          options: ft
        };
      }));
    }
    if (z.size) {
      const H = {};
      if (typeof v.initial != "boolean") {
        const j = ua(a, Array.isArray(v.initial) ? v.initial[0] : v.initial);
        j && j.transition && (H.transition = j.transition);
      }
      z.forEach((j) => {
        const Y = a.getBaseTarget(j), X = a.getValue(j);
        X && (X.liveStyle = !0), H[j] = Y ?? null;
      }), S.push({ animation: H });
    }
    let N = !!S.length;
    return u && (v.initial === !1 || v.initial === v.animate) && !a.manuallyAnimateOnMount && (N = !1), u = !1, c = !1, N ? l(S) : Promise.resolve();
  }
  function g(b, v) {
    var S;
    if (r[b].isActive === v)
      return Promise.resolve();
    (S = a.variantChildren) == null || S.forEach((z) => {
      var w;
      return (w = z.animationState) == null ? void 0 : w.setActive(b, v);
    }), r[b].isActive = v;
    const p = m(b);
    for (const z in r)
      r[z].protectedKeys = {};
    return p;
  }
  return {
    animateChanges: m,
    setActive: g,
    setAnimateFunction: d,
    getState: () => r,
    reset: () => {
      r = $g(), c = !0;
    }
  };
}
function Wx(a, l) {
  return typeof l == "string" ? l !== a : Array.isArray(l) ? !db(l, a) : !1;
}
function na(a = !1) {
  return {
    isActive: a,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {}
  };
}
function $g() {
  return {
    animate: na(!0),
    whileInView: na(),
    whileHover: na(),
    whileTap: na(),
    whileDrag: na(),
    whileFocus: na(),
    exit: na()
  };
}
function ad(a, l) {
  a.min = l.min, a.max = l.max;
}
function rn(a, l) {
  ad(a.x, l.x), ad(a.y, l.y);
}
function t0(a, l) {
  a.translate = l.translate, a.scale = l.scale, a.originPoint = l.originPoint, a.origin = l.origin;
}
const hb = 1e-4, $x = 1 - hb, t2 = 1 + hb, mb = 0.01, e2 = 0 - mb, n2 = 0 + mb;
function xe(a) {
  return a.max - a.min;
}
function i2(a, l, r) {
  return Math.abs(a - l) <= r;
}
function e0(a, l, r, u = 0.5) {
  a.origin = u, a.originPoint = Bt(l.min, l.max, a.origin), a.scale = xe(r) / xe(l), a.translate = Bt(r.min, r.max, a.origin) - a.originPoint, (a.scale >= $x && a.scale <= t2 || isNaN(a.scale)) && (a.scale = 1), (a.translate >= e2 && a.translate <= n2 || isNaN(a.translate)) && (a.translate = 0);
}
function ds(a, l, r, u) {
  e0(a.x, l.x, r.x, u ? u.originX : void 0), e0(a.y, l.y, r.y, u ? u.originY : void 0);
}
function n0(a, l, r, u = 0) {
  const c = u ? Bt(r.min, r.max, u) : r.min;
  a.min = c + l.min, a.max = a.min + xe(l);
}
function a2(a, l, r, u) {
  n0(a.x, l.x, r.x, u == null ? void 0 : u.x), n0(a.y, l.y, r.y, u == null ? void 0 : u.y);
}
function i0(a, l, r, u = 0) {
  const c = u ? Bt(r.min, r.max, u) : r.min;
  a.min = l.min - c, a.max = a.min + xe(l);
}
function Au(a, l, r, u) {
  i0(a.x, l.x, r.x, u == null ? void 0 : u.x), i0(a.y, l.y, r.y, u == null ? void 0 : u.y);
}
function a0(a, l, r, u, c) {
  return a -= l, a = Eu(a, 1 / r, u), c !== void 0 && (a = Eu(a, 1 / c, u)), a;
}
function l2(a, l = 0, r = 1, u = 0.5, c, h = a, d = a) {
  if (On.test(l) && (l = parseFloat(l), l = Bt(d.min, d.max, l / 100) - d.min), typeof l != "number")
    return;
  let m = Bt(h.min, h.max, u);
  a === h && (m -= l), a.min = a0(a.min, l, r, m, c), a.max = a0(a.max, l, r, m, c);
}
function l0(a, l, [r, u, c], h, d) {
  l2(a, l[r], l[u], l[c], l.scale, h, d);
}
const s2 = ["x", "scaleX", "originX"], o2 = ["y", "scaleY", "originY"];
function s0(a, l, r, u) {
  l0(a.x, l, s2, r ? r.x : void 0, u ? u.x : void 0), l0(a.y, l, o2, r ? r.y : void 0, u ? u.y : void 0);
}
function o0(a) {
  return a.translate === 0 && a.scale === 1;
}
function pb(a) {
  return o0(a.x) && o0(a.y);
}
function u0(a, l) {
  return a.min === l.min && a.max === l.max;
}
function u2(a, l) {
  return u0(a.x, l.x) && u0(a.y, l.y);
}
function r0(a, l) {
  return Math.round(a.min) === Math.round(l.min) && Math.round(a.max) === Math.round(l.max);
}
function yb(a, l) {
  return r0(a.x, l.x) && r0(a.y, l.y);
}
function c0(a) {
  return xe(a.x) / xe(a.y);
}
function f0(a, l) {
  return a.translate === l.translate && a.scale === l.scale && a.originPoint === l.originPoint;
}
function Dn(a) {
  return [a("x"), a("y")];
}
function r2(a, l, r) {
  let u = "";
  const c = a.x.translate / l.x, h = a.y.translate / l.y, d = (r == null ? void 0 : r.z) || 0;
  if ((c || h || d) && (u = `translate3d(${c}px, ${h}px, ${d}px) `), (l.x !== 1 || l.y !== 1) && (u += `scale(${1 / l.x}, ${1 / l.y}) `), r) {
    const { transformPerspective: b, rotate: v, pathRotation: p, rotateX: S, rotateY: z, skewX: w, skewY: U } = r;
    b && (u = `perspective(${b}px) ${u}`), v && (u += `rotate(${v}deg) `), p && (u += `rotate(${p}deg) `), S && (u += `rotateX(${S}deg) `), z && (u += `rotateY(${z}deg) `), w && (u += `skewX(${w}deg) `), U && (u += `skewY(${U}deg) `);
  }
  const m = a.x.scale * l.x, g = a.y.scale * l.y;
  return (m !== 1 || g !== 1) && (u += `scale(${m}, ${g})`), u || "none";
}
const c2 = Md.length, d0 = (a) => typeof a == "string" ? parseFloat(a) : a, h0 = (a) => typeof a == "number" || tt.test(a);
function f2(a, l, r, u, c, h) {
  c ? (a.opacity = Bt(0, r.opacity ?? 1, d2(u)), a.opacityExit = Bt(l.opacity ?? 1, 0, h2(u))) : h && (a.opacity = Bt(l.opacity ?? 1, r.opacity ?? 1, u));
  for (let d = 0; d < c2; d++) {
    const m = Md[d];
    let g = m0(l, m), b = m0(r, m);
    if (g === void 0 && b === void 0)
      continue;
    g || (g = 0), b || (b = 0), g === 0 || b === 0 || h0(g) === h0(b) ? (a[m] = Math.max(Bt(d0(g), d0(b), u), 0), (On.test(b) || On.test(g)) && (a[m] += "%")) : a[m] = b;
  }
  (l.rotate || r.rotate) && (a.rotate = Bt(l.rotate || 0, r.rotate || 0, u));
}
function m0(a, l) {
  return a[l] !== void 0 ? a[l] : a.borderRadius;
}
const d2 = /* @__PURE__ */ gb(0, 0.5, uv), h2 = /* @__PURE__ */ gb(0.5, 0.95, en);
function gb(a, l, r) {
  return (u) => u < a ? 0 : u > l ? 1 : r(/* @__PURE__ */ ps(a, l, u));
}
function m2(a, l, r) {
  const u = Ft(a) ? a : ra(a);
  return u.start(Ed("", u, l, r)), u.animation;
}
function bs(a, l, r, u = { passive: !0 }) {
  return a.addEventListener(l, r, u), () => a.removeEventListener(l, r, u);
}
const p2 = (a, l) => a.depth - l.depth;
class y2 {
  constructor() {
    this.children = [], this.isDirty = !1;
  }
  add(l) {
    cd(this.children, l), this.isDirty = !0;
  }
  remove(l) {
    pu(this.children, l), this.isDirty = !0;
  }
  forEach(l) {
    this.isDirty && this.children.sort(p2), this.isDirty = !1, this.children.forEach(l);
  }
}
function g2(a, l) {
  const r = Ae.now(), u = ({ timestamp: c }) => {
    const h = c - r;
    h >= l && (Jn(u), a(h - l));
  };
  return Vt.setup(u, !0), () => Jn(u);
}
function hu(a) {
  return Ft(a) ? a.get() : a;
}
class v2 {
  constructor() {
    this.members = [];
  }
  add(l) {
    cd(this.members, l);
    for (let r = this.members.length - 1; r >= 0; r--) {
      const u = this.members[r];
      if (u === l || u === this.lead || u === this.prevLead)
        continue;
      const c = u.instance;
      (!c || c.isConnected === !1) && !u.snapshot && (pu(this.members, u), u.unmount());
    }
    l.scheduleRender();
  }
  remove(l) {
    if (pu(this.members, l), l === this.prevLead && (this.prevLead = void 0), l === this.lead) {
      const r = this.members[this.members.length - 1];
      r && this.promote(r);
    }
  }
  relegate(l) {
    var r;
    for (let u = this.members.indexOf(l) - 1; u >= 0; u--) {
      const c = this.members[u];
      if (c.isPresent !== !1 && ((r = c.instance) == null ? void 0 : r.isConnected) !== !1)
        return this.promote(c), !0;
    }
    return !1;
  }
  promote(l, r) {
    var c;
    const u = this.lead;
    if (l !== u && (this.prevLead = u, this.lead = l, l.show(), u)) {
      u.updateSnapshot(), l.scheduleRender();
      const { layoutDependency: h } = u.options, { layoutDependency: d } = l.options;
      (h === void 0 || h !== d) && (l.resumeFrom = u, r && (u.preserveOpacity = !0), u.snapshot && (l.snapshot = u.snapshot, l.snapshot.latestValues = u.animationValues || u.latestValues), (c = l.root) != null && c.isUpdating && (l.isLayoutDirty = !0)), l.options.crossfade === !1 && u.hide();
    }
  }
  exitAnimationComplete() {
    this.members.forEach((l) => {
      var r, u, c, h, d;
      (u = (r = l.options).onExitComplete) == null || u.call(r), (d = (c = l.resumingFrom) == null ? void 0 : (h = c.options).onExitComplete) == null || d.call(h);
    });
  }
  scheduleRender() {
    this.members.forEach((l) => l.instance && l.scheduleRender(!1));
  }
  removeLeadSnapshot() {
    var l;
    (l = this.lead) != null && l.snapshot && (this.lead.snapshot = void 0);
  }
}
const mu = {
  /**
   * Global flag as to whether the tree has animated since the last time
   * we resized the window
   */
  hasAnimatedSinceResize: !0,
  /**
   * We set this to true once, on the first update. Any nodes added to the tree beyond that
   * update will be given a `data-projection-id` attribute.
   */
  hasEverUpdated: !1
}, zf = ["", "X", "Y", "Z"], b2 = 1e3;
let S2 = 0;
function Of(a, l, r, u) {
  const { latestValues: c } = l;
  c[a] && (r[a] = c[a], l.setStaticValue(a, 0), u && (u[a] = 0));
}
function vb(a) {
  if (a.hasCheckedOptimisedAppear = !0, a.root === a)
    return;
  const { visualElement: l } = a.options;
  if (!l)
    return;
  const r = Gv(l);
  if (window.MotionHasOptimisedAnimation(r, "transform")) {
    const { layout: c, layoutId: h } = a.options;
    window.MotionCancelOptimisedAnimation(r, "transform", Vt, !(c || h));
  }
  const { parent: u } = a;
  u && !u.hasCheckedOptimisedAppear && vb(u);
}
function bb({ attachResizeListener: a, defaultParent: l, measureScroll: r, checkIsScrollRoot: u, resetTransform: c }) {
  return class {
    constructor(d = {}, m = l == null ? void 0 : l()) {
      this.id = S2++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = { x: 1, y: 1 }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = !1, this.layoutVersion = 0, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
        this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots());
      }, this.updateProjection = () => {
        this.projectionUpdateScheduled = !1, this.nodes.forEach(A2), this.nodes.forEach(O2), this.nodes.forEach(R2), this.nodes.forEach(x2);
      }, this.resolvedRelativeTargetAt = 0, this.linkedParentVersion = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = d, this.root = m ? m.root || m : this, this.path = m ? [...m.path, m] : [], this.parent = m, this.depth = m ? m.depth + 1 : 0;
      for (let g = 0; g < this.path.length; g++)
        this.path[g].shouldResetTransform = !0;
      this.root === this && (this.nodes = new y2());
    }
    addEventListener(d, m) {
      return this.eventHandlers.has(d) || this.eventHandlers.set(d, new fd()), this.eventHandlers.get(d).add(m);
    }
    notifyListeners(d, ...m) {
      const g = this.eventHandlers.get(d);
      g && g.notify(...m);
    }
    hasListeners(d) {
      return this.eventHandlers.has(d);
    }
    /**
     * Lifecycles
     */
    mount(d) {
      if (this.instance)
        return;
      this.isSVG = zd(d) && !Tx(d), this.instance = d;
      const { layoutId: m, layout: g, visualElement: b } = this.options;
      if (b && !b.current && b.mount(d), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (g || m) && (this.isLayoutDirty = !0), a) {
        let v, p = 0;
        const S = () => this.root.updateBlockedByResize = !1;
        Vt.read(() => {
          p = window.innerWidth;
        }), a(d, () => {
          const z = window.innerWidth;
          z !== p && (p = z, this.root.updateBlockedByResize = !0, v && v(), v = g2(S, 250), mu.hasAnimatedSinceResize && (mu.hasAnimatedSinceResize = !1, this.nodes.forEach(g0)));
        });
      }
      m && this.root.registerSharedNode(m, this), this.options.animate !== !1 && b && (m || g) && this.addEventListener("didUpdate", ({ delta: v, hasLayoutChanged: p, hasRelativeLayoutChanged: S, layout: z }) => {
        if (this.isTreeAnimationBlocked()) {
          this.target = void 0, this.relativeTarget = void 0;
          return;
        }
        const w = this.options.transition || b.getDefaultTransition() || U2, { onLayoutAnimationStart: U, onLayoutAnimationComplete: N } = b.getProps(), H = !this.targetLayout || !yb(this.targetLayout, z), j = !p && S;
        if (this.options.layoutRoot || this.resumeFrom || j || p && (H || !this.currentAnimation)) {
          this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
          const Y = {
            ...Td(w, "layout"),
            onPlay: U,
            onComplete: N
          };
          (b.shouldReduceMotion || this.options.layoutRoot) && (Y.delay = 0, Y.type = !1), this.startAnimation(Y), this.setAnimationOrigin(v, j, Y.path);
        } else
          p || g0(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
        this.targetLayout = z;
      });
    }
    unmount() {
      this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
      const d = this.getStack();
      d && d.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), Jn(this.updateProjection);
    }
    // only on the root
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || !1;
    }
    // Note: currently only running on root node
    startUpdate() {
      this.isUpdateBlocked() || (this.isUpdating = !0, this.nodes && this.nodes.forEach(w2), this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: d } = this.options;
      return d && d.getProps().transformTemplate;
    }
    willUpdate(d = !0) {
      if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && vb(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty)
        return;
      this.isLayoutDirty = !0;
      for (let v = 0; v < this.path.length; v++) {
        const p = this.path[v];
        p.shouldResetTransform = !0, (typeof p.latestValues.x == "string" || typeof p.latestValues.y == "string") && (p.isLayoutDirty = !0), p.updateScroll("snapshot"), p.options.layoutRoot && p.willUpdate(!1);
      }
      const { layoutId: m, layout: g } = this.options;
      if (m === void 0 && !g)
        return;
      const b = this.getTransformTemplate();
      this.prevTransformTemplateValue = b ? b(this.latestValues, "") : void 0, this.updateSnapshot(), d && this.notifyListeners("willUpdate");
    }
    update() {
      if (this.updateScheduled = !1, this.isUpdateBlocked()) {
        const g = this.updateBlockedByResize;
        this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), g && this.nodes.forEach(C2), this.nodes.forEach(p0);
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(y0);
        return;
      }
      this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(D2), this.nodes.forEach(z2), this.nodes.forEach(T2), this.nodes.forEach(E2)) : this.nodes.forEach(y0), this.clearAllSnapshots();
      const m = Ae.now();
      ge.delta = Rn(0, 1e3 / 60, m - ge.timestamp), ge.timestamp = m, ge.isProcessing = !0, bf.update.process(ge), bf.preRender.process(ge), bf.render.process(ge), ge.isProcessing = !1;
    }
    didUpdate() {
      this.updateScheduled || (this.updateScheduled = !0, Cd.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      this.nodes.forEach(M2), this.sharedNodes.forEach(N2);
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, Vt.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      Vt.postRender(() => {
        this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
      });
    }
    /**
     * Update measurements
     */
    updateSnapshot() {
      this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !xe(this.snapshot.measuredBox.x) && !xe(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
    }
    updateLayout() {
      if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty))
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let g = 0; g < this.path.length; g++)
          this.path[g].updateScroll();
      const d = this.layout;
      this.layout = this.measure(!1), this.layoutVersion++, this.layoutCorrected || (this.layoutCorrected = ae()), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
      const { visualElement: m } = this.options;
      m && m.notify("LayoutMeasure", this.layout.layoutBox, d ? d.layoutBox : void 0);
    }
    updateScroll(d = "measure") {
      let m = !!(this.options.layoutScroll && this.instance);
      if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === d && (m = !1), m && this.instance) {
        const g = u(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: d,
          isRoot: g,
          offset: r(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : g
        };
      }
    }
    resetTransform() {
      if (!c)
        return;
      const d = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, m = this.projectionDelta && !pb(this.projectionDelta), g = this.getTransformTemplate(), b = g ? g(this.latestValues, "") : void 0, v = b !== this.prevTransformTemplateValue;
      d && this.instance && (m || aa(this.latestValues) || v) && (c(this.instance, b), this.shouldResetTransform = !1, this.scheduleRender());
    }
    measure(d = !0) {
      const m = this.measurePageBox();
      let g = this.removeElementScroll(m);
      return d && (g = this.removeTransform(g)), B2(g), {
        animationId: this.root.animationId,
        measuredBox: m,
        layoutBox: g,
        latestValues: {},
        source: this.id
      };
    }
    measurePageBox() {
      var b;
      const { visualElement: d } = this.options;
      if (!d)
        return ae();
      const m = d.measureViewportBox();
      if (!(((b = this.scroll) == null ? void 0 : b.wasRoot) || this.path.some(L2))) {
        const { scroll: v } = this.root;
        v && (zn(m.x, v.offset.x), zn(m.y, v.offset.y));
      }
      return m;
    }
    removeElementScroll(d) {
      var g;
      const m = ae();
      if (rn(m, d), (g = this.scroll) != null && g.wasRoot)
        return m;
      for (let b = 0; b < this.path.length; b++) {
        const v = this.path[b], { scroll: p, options: S } = v;
        v !== this.root && p && S.layoutScroll && (p.wasRoot && rn(m, d), zn(m.x, p.offset.x), zn(m.y, p.offset.y));
      }
      return m;
    }
    applyTransform(d, m = !1, g) {
      var v, p;
      const b = g || ae();
      rn(b, d);
      for (let S = 0; S < this.path.length; S++) {
        const z = this.path[S];
        !m && z.options.layoutScroll && z.scroll && z !== z.root && (zn(b.x, -z.scroll.offset.x), zn(b.y, -z.scroll.offset.y)), aa(z.latestValues) && du(b, z.latestValues, (v = z.layout) == null ? void 0 : v.layoutBox);
      }
      return aa(this.latestValues) && du(b, this.latestValues, (p = this.layout) == null ? void 0 : p.layoutBox), b;
    }
    removeTransform(d) {
      var g;
      const m = ae();
      rn(m, d);
      for (let b = 0; b < this.path.length; b++) {
        const v = this.path[b];
        if (!aa(v.latestValues))
          continue;
        let p;
        v.instance && (ed(v.latestValues) && v.updateSnapshot(), p = ae(), rn(p, v.measurePageBox())), s0(m, v.latestValues, (g = v.snapshot) == null ? void 0 : g.layoutBox, p);
      }
      return aa(this.latestValues) && s0(m, this.latestValues), m;
    }
    setTargetDelta(d) {
      this.targetDelta = d, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0;
    }
    setOptions(d) {
      this.options = {
        ...this.options,
        ...d,
        crossfade: d.crossfade !== void 0 ? d.crossfade : !0
      };
    }
    clearMeasurements() {
      this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1;
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ge.timestamp && this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(d = !1) {
      var z;
      const m = this.getLead();
      this.isProjectionDirty || (this.isProjectionDirty = m.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = m.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = m.isSharedProjectionDirty);
      const g = !!this.resumingFrom || this !== m;
      if (!(d || g && this.isSharedProjectionDirty || this.isProjectionDirty || (z = this.parent) != null && z.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize))
        return;
      const { layout: v, layoutId: p } = this.options;
      if (!this.layout || !(v || p))
        return;
      this.resolvedRelativeTargetAt = ge.timestamp;
      const S = this.getClosestProjectingParent();
      S && this.linkedParentVersion !== S.layoutVersion && !S.options.layoutRoot && this.removeRelativeTarget(), !this.targetDelta && !this.relativeTarget && (this.options.layoutAnchor !== !1 && S && S.layout ? this.createRelativeTarget(S, this.layout.layoutBox, S.layout.layoutBox) : this.removeRelativeTarget()), !(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = ae(), this.targetWithTransforms = ae()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), a2(this.target, this.relativeTarget, this.relativeParent.target, this.options.layoutAnchor || void 0)) : this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target) : rn(this.target, this.layout.layoutBox), ib(this.target, this.targetDelta)) : rn(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, this.options.layoutAnchor !== !1 && S && !!S.resumingFrom == !!this.resumingFrom && !S.options.layoutScroll && S.target && this.animationProgress !== 1 ? this.createRelativeTarget(S, this.target, S.target) : this.relativeParent = this.relativeTarget = void 0));
    }
    getClosestProjectingParent() {
      if (!(!this.parent || ed(this.parent.latestValues) || nb(this.parent.latestValues)))
        return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
    }
    createRelativeTarget(d, m, g) {
      this.relativeParent = d, this.linkedParentVersion = d.layoutVersion, this.forceRelativeParentToResolveTarget(), this.relativeTarget = ae(), this.relativeTargetOrigin = ae(), Au(this.relativeTargetOrigin, m, g, this.options.layoutAnchor || void 0), rn(this.relativeTarget, this.relativeTargetOrigin);
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      var w;
      const d = this.getLead(), m = !!this.resumingFrom || this !== d;
      let g = !0;
      if ((this.isProjectionDirty || (w = this.parent) != null && w.isProjectionDirty) && (g = !1), m && (this.isSharedProjectionDirty || this.isTransformDirty) && (g = !1), this.resolvedRelativeTargetAt === ge.timestamp && (g = !1), g)
        return;
      const { layout: b, layoutId: v } = this.options;
      if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(b || v))
        return;
      rn(this.layoutCorrected, this.layout.layoutBox);
      const p = this.treeScale.x, S = this.treeScale.y;
      Vx(this.layoutCorrected, this.treeScale, this.path, m), d.layout && !d.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (d.target = d.layout.layoutBox, d.targetWithTransforms = ae());
      const { target: z } = d;
      if (!z) {
        this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (t0(this.prevProjectionDelta.x, this.projectionDelta.x), t0(this.prevProjectionDelta.y, this.projectionDelta.y)), ds(this.projectionDelta, this.layoutCorrected, z, this.latestValues), (this.treeScale.x !== p || this.treeScale.y !== S || !f0(this.projectionDelta.x, this.prevProjectionDelta.x) || !f0(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", z));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(d = !0) {
      var m;
      if ((m = this.options.visualElement) == null || m.scheduleRender(), d) {
        const g = this.getStack();
        g && g.scheduleRender();
      }
      this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      this.prevProjectionDelta = ll(), this.projectionDelta = ll(), this.projectionDeltaWithTransform = ll();
    }
    setAnimationOrigin(d, m = !1, g) {
      const b = this.snapshot, v = b ? b.latestValues : {}, p = { ...this.latestValues }, S = ll();
      (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !m;
      const z = ae(), w = b ? b.source : void 0, U = this.layout ? this.layout.source : void 0, N = w !== U, H = this.getStack(), j = !H || H.members.length <= 1, Y = !!(N && !j && this.options.crossfade === !0 && !this.path.some(_2));
      this.animationProgress = 0;
      let X;
      const P = g == null ? void 0 : g.interpolateProjection(d);
      this.mixTargetDelta = (st) => {
        const Z = st / 1e3, V = P == null ? void 0 : P(Z);
        V ? (S.x.translate = V.x, S.x.scale = Bt(d.x.scale, 1, Z), S.x.origin = d.x.origin, S.x.originPoint = d.x.originPoint, S.y.translate = V.y, S.y.scale = Bt(d.y.scale, 1, Z), S.y.origin = d.y.origin, S.y.originPoint = d.y.originPoint) : (v0(S.x, d.x, Z), v0(S.y, d.y, Z)), this.setTargetDelta(S), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Au(z, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), V2(this.relativeTarget, this.relativeTargetOrigin, z, Z), X && u2(this.relativeTarget, X) && (this.isProjectionDirty = !1), X || (X = ae()), rn(X, this.relativeTarget)), N && (this.animationValues = p, f2(p, v, this.latestValues, Z, Y, j)), V && V.rotate !== void 0 && (this.animationValues || (this.animationValues = p), this.animationValues.pathRotation = V.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = Z;
      }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
    }
    startAnimation(d) {
      var m, g, b;
      this.notifyListeners("animationStart"), (m = this.currentAnimation) == null || m.stop(), (b = (g = this.resumingFrom) == null ? void 0 : g.currentAnimation) == null || b.stop(), this.pendingAnimation && (Jn(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Vt.update(() => {
        mu.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = ra(0)), this.motionValue.jump(0, !1), this.currentAnimation = m2(this.motionValue, [0, 1e3], {
          ...d,
          velocity: 0,
          isSync: !0,
          onUpdate: (v) => {
            this.mixTargetDelta(v), d.onUpdate && d.onUpdate(v);
          },
          onComplete: () => {
            d.onComplete && d.onComplete(), this.completeAnimation();
          }
        }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
      });
    }
    completeAnimation() {
      this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
      const d = this.getStack();
      d && d.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
    }
    finishAnimation() {
      this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(b2), this.currentAnimation.stop()), this.completeAnimation();
    }
    applyTransformsToTarget() {
      const d = this.getLead();
      let { targetWithTransforms: m, target: g, layout: b, latestValues: v } = d;
      if (!(!m || !g || !b)) {
        if (this !== d && this.layout && b && Sb(this.options.animationType, this.layout.layoutBox, b.layoutBox)) {
          g = this.target || ae();
          const p = xe(this.layout.layoutBox.x);
          g.x.min = d.target.x.min, g.x.max = g.x.min + p;
          const S = xe(this.layout.layoutBox.y);
          g.y.min = d.target.y.min, g.y.max = g.y.min + S;
        }
        rn(m, g), du(m, v), ds(this.projectionDeltaWithTransform, this.layoutCorrected, m, v);
      }
    }
    registerSharedNode(d, m) {
      this.sharedNodes.has(d) || this.sharedNodes.set(d, new v2()), this.sharedNodes.get(d).add(m);
      const b = m.options.initialPromotionConfig;
      m.promote({
        transition: b ? b.transition : void 0,
        preserveFollowOpacity: b && b.shouldPreserveFollowOpacity ? b.shouldPreserveFollowOpacity(m) : void 0
      });
    }
    isLead() {
      const d = this.getStack();
      return d ? d.lead === this : !0;
    }
    getLead() {
      var m;
      const { layoutId: d } = this.options;
      return d ? ((m = this.getStack()) == null ? void 0 : m.lead) || this : this;
    }
    getPrevLead() {
      var m;
      const { layoutId: d } = this.options;
      return d ? (m = this.getStack()) == null ? void 0 : m.prevLead : void 0;
    }
    getStack() {
      const { layoutId: d } = this.options;
      if (d)
        return this.root.sharedNodes.get(d);
    }
    promote({ needsReset: d, transition: m, preserveFollowOpacity: g } = {}) {
      const b = this.getStack();
      b && b.promote(this, g), d && (this.projectionDelta = void 0, this.needsReset = !0), m && this.setOptions({ transition: m });
    }
    relegate() {
      const d = this.getStack();
      return d ? d.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: d } = this.options;
      if (!d)
        return;
      let m = !1;
      const { latestValues: g } = d;
      if ((g.z || g.rotate || g.rotateX || g.rotateY || g.rotateZ || g.skewX || g.skewY) && (m = !0), !m)
        return;
      const b = {};
      g.z && Of("z", d, b, this.animationValues);
      for (let v = 0; v < zf.length; v++)
        Of(`rotate${zf[v]}`, d, b, this.animationValues), Of(`skew${zf[v]}`, d, b, this.animationValues);
      d.render();
      for (const v in b)
        d.setStaticValue(v, b[v]), this.animationValues && (this.animationValues[v] = b[v]);
      d.scheduleRender();
    }
    applyProjectionStyles(d, m) {
      if (!this.instance || this.isSVG)
        return;
      if (!this.isVisible) {
        d.visibility = "hidden";
        return;
      }
      const g = this.getTransformTemplate();
      if (this.needsReset) {
        this.needsReset = !1, d.visibility = "", d.opacity = "", d.pointerEvents = hu(m == null ? void 0 : m.pointerEvents) || "", d.transform = g ? g(this.latestValues, "") : "none";
        return;
      }
      const b = this.getLead();
      if (!this.projectionDelta || !this.layout || !b.target) {
        this.options.layoutId && (d.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, d.pointerEvents = hu(m == null ? void 0 : m.pointerEvents) || ""), this.hasProjected && !aa(this.latestValues) && (d.transform = g ? g({}, "") : "none", this.hasProjected = !1);
        return;
      }
      d.visibility = "";
      const v = b.animationValues || b.latestValues;
      this.applyTransformsToTarget();
      let p = r2(this.projectionDeltaWithTransform, this.treeScale, v);
      g && (p = g(v, p)), d.transform = p;
      const { x: S, y: z } = this.projectionDelta;
      d.transformOrigin = `${S.origin * 100}% ${z.origin * 100}% 0`, b.animationValues ? d.opacity = b === this ? v.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : v.opacityExit : d.opacity = b === this ? v.opacity !== void 0 ? v.opacity : "" : v.opacityExit !== void 0 ? v.opacityExit : 0;
      for (const w in id) {
        if (v[w] === void 0)
          continue;
        const { correct: U, applyTo: N, isCSSVariable: H } = id[w], j = p === "none" ? v[w] : U(v[w], b);
        if (N) {
          const Y = N.length;
          for (let X = 0; X < Y; X++)
            d[N[X]] = j;
        } else
          H ? this.options.visualElement.renderState.vars[w] = j : d[w] = j;
      }
      this.options.layoutId && (d.pointerEvents = b === this ? hu(m == null ? void 0 : m.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    // Only run on root
    resetTree() {
      this.root.nodes.forEach((d) => {
        var m;
        return (m = d.currentAnimation) == null ? void 0 : m.stop();
      }), this.root.nodes.forEach(p0), this.root.sharedNodes.clear();
    }
  };
}
function T2(a) {
  a.updateLayout();
}
function E2(a) {
  var r;
  const l = ((r = a.resumeFrom) == null ? void 0 : r.snapshot) || a.snapshot;
  if (a.isLead() && a.layout && l && a.hasListeners("didUpdate")) {
    const { layoutBox: u, measuredBox: c } = a.layout, { animationType: h } = a.options, d = l.source !== a.layout.source;
    if (h === "size")
      Dn((p) => {
        const S = d ? l.measuredBox[p] : l.layoutBox[p], z = xe(S);
        S.min = u[p].min, S.max = S.min + z;
      });
    else if (h === "x" || h === "y") {
      const p = h === "x" ? "y" : "x";
      ad(d ? l.measuredBox[p] : l.layoutBox[p], u[p]);
    } else Sb(h, l.layoutBox, u) && Dn((p) => {
      const S = d ? l.measuredBox[p] : l.layoutBox[p], z = xe(u[p]);
      S.max = S.min + z, a.relativeTarget && !a.currentAnimation && (a.isProjectionDirty = !0, a.relativeTarget[p].max = a.relativeTarget[p].min + z);
    });
    const m = ll();
    ds(m, u, l.layoutBox);
    const g = ll();
    d ? ds(g, a.applyTransform(c, !0), l.measuredBox) : ds(g, u, l.layoutBox);
    const b = !pb(m);
    let v = !1;
    if (!a.resumeFrom) {
      const p = a.getClosestProjectingParent();
      if (p && !p.resumeFrom) {
        const { snapshot: S, layout: z } = p;
        if (S && z) {
          const w = a.options.layoutAnchor || void 0, U = ae();
          Au(U, l.layoutBox, S.layoutBox, w);
          const N = ae();
          Au(N, u, z.layoutBox, w), yb(U, N) || (v = !0), p.options.layoutRoot && (a.relativeTarget = N, a.relativeTargetOrigin = U, a.relativeParent = p);
        }
      }
    }
    a.notifyListeners("didUpdate", {
      layout: u,
      snapshot: l,
      delta: g,
      layoutDelta: m,
      hasLayoutChanged: b,
      hasRelativeLayoutChanged: v
    });
  } else if (a.isLead()) {
    const { onExitComplete: u } = a.options;
    u && u();
  }
  a.options.transition = void 0;
}
function A2(a) {
  a.parent && (a.isProjecting() || (a.isProjectionDirty = a.parent.isProjectionDirty), a.isSharedProjectionDirty || (a.isSharedProjectionDirty = !!(a.isProjectionDirty || a.parent.isProjectionDirty || a.parent.isSharedProjectionDirty)), a.isTransformDirty || (a.isTransformDirty = a.parent.isTransformDirty));
}
function x2(a) {
  a.isProjectionDirty = a.isSharedProjectionDirty = a.isTransformDirty = !1;
}
function M2(a) {
  a.clearSnapshot();
}
function p0(a) {
  a.clearMeasurements();
}
function C2(a) {
  a.isLayoutDirty = !0, a.updateLayout();
}
function y0(a) {
  a.isLayoutDirty = !1;
}
function D2(a) {
  a.isAnimationBlocked && a.layout && !a.isLayoutDirty && (a.snapshot = a.layout, a.isLayoutDirty = !0);
}
function z2(a) {
  const { visualElement: l } = a.options;
  l && l.getProps().onBeforeLayoutMeasure && l.notify("BeforeLayoutMeasure"), a.resetTransform();
}
function g0(a) {
  a.finishAnimation(), a.targetDelta = a.relativeTarget = a.target = void 0, a.isProjectionDirty = !0;
}
function O2(a) {
  a.resolveTargetDelta();
}
function R2(a) {
  a.calcProjection();
}
function w2(a) {
  a.resetSkewAndRotation();
}
function N2(a) {
  a.removeLeadSnapshot();
}
function v0(a, l, r) {
  a.translate = Bt(l.translate, 0, r), a.scale = Bt(l.scale, 1, r), a.origin = l.origin, a.originPoint = l.originPoint;
}
function b0(a, l, r, u) {
  a.min = Bt(l.min, r.min, u), a.max = Bt(l.max, r.max, u);
}
function V2(a, l, r, u) {
  b0(a.x, l.x, r.x, u), b0(a.y, l.y, r.y, u);
}
function _2(a) {
  return a.animationValues && a.animationValues.opacityExit !== void 0;
}
const U2 = {
  duration: 0.45,
  ease: [0.4, 0, 0.1, 1]
}, S0 = (a) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(a), T0 = S0("applewebkit/") && !S0("chrome/") ? Math.round : en;
function E0(a) {
  a.min = T0(a.min), a.max = T0(a.max);
}
function B2(a) {
  E0(a.x), E0(a.y);
}
function Sb(a, l, r) {
  return a === "position" || a === "preserve-aspect" && !i2(c0(l), c0(r), 0.2);
}
function L2(a) {
  var l;
  return a !== a.root && ((l = a.scroll) == null ? void 0 : l.wasRoot);
}
const H2 = bb({
  attachResizeListener: (a, l) => bs(a, "resize", l),
  measureScroll: () => {
    var a, l;
    return {
      x: document.documentElement.scrollLeft || ((a = document.body) == null ? void 0 : a.scrollLeft) || 0,
      y: document.documentElement.scrollTop || ((l = document.body) == null ? void 0 : l.scrollTop) || 0
    };
  },
  checkIsScrollRoot: () => !0
}), Rf = {
  current: void 0
}, Tb = bb({
  measureScroll: (a) => ({
    x: a.scrollLeft,
    y: a.scrollTop
  }),
  defaultParent: () => {
    if (!Rf.current) {
      const a = new H2({});
      a.mount(window), a.setOptions({ layoutScroll: !0 }), Rf.current = a;
    }
    return Rf.current;
  },
  resetTransform: (a, l) => {
    a.style.transform = l !== void 0 ? l : "none";
  },
  checkIsScrollRoot: (a) => window.getComputedStyle(a).position === "fixed"
}), Ru = lt.createContext({
  transformPagePoint: (a) => a,
  isStatic: !1,
  reducedMotion: "never"
});
function j2(a = !0) {
  const l = lt.useContext(rd);
  if (l === null)
    return [!0, null];
  const { isPresent: r, onExitComplete: u, register: c } = l, h = lt.useId();
  lt.useEffect(() => {
    if (a)
      return c(h);
  }, [a]);
  const d = lt.useCallback(() => a && u && u(h), [h, u, a]);
  return !r && u ? [!1, d] : [!0];
}
const Eb = lt.createContext({ strict: !1 }), A0 = {
  animation: [
    "animate",
    "variants",
    "whileHover",
    "whileTap",
    "exit",
    "whileInView",
    "whileFocus",
    "whileDrag"
  ],
  exit: ["exit"],
  drag: ["drag", "dragControls"],
  focus: ["whileFocus"],
  hover: ["whileHover", "onHoverStart", "onHoverEnd"],
  tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
  pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
  inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
  layout: ["layout", "layoutId"]
};
let x0 = !1;
function G2() {
  if (x0)
    return;
  const a = {};
  for (const l in A0)
    a[l] = {
      isEnabled: (r) => A0[l].some((u) => !!r[u])
    };
  $v(a), x0 = !0;
}
function Ab() {
  return G2(), Ox();
}
function Y2(a) {
  const l = Ab();
  for (const r in a)
    l[r] = {
      ...l[r],
      ...a[r]
    };
  $v(l);
}
const q2 = /* @__PURE__ */ new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport"
]);
function xu(a) {
  return a.startsWith("while") || a.startsWith("drag") && a !== "draggable" || a.startsWith("layout") || a.startsWith("onTap") || a.startsWith("onPan") || a.startsWith("onLayout") || q2.has(a);
}
let xb = (a) => !xu(a);
function X2(a) {
  typeof a == "function" && (xb = (l) => l.startsWith("on") ? !xu(l) : a(l));
}
try {
  X2(require("@emotion/is-prop-valid").default);
} catch {
}
function Q2(a, l, r) {
  const u = {};
  for (const c in a)
    c === "values" && typeof a.values == "object" || Ft(a[c]) || (xb(c) || r === !0 && xu(c) || !l && !xu(c) || // If trying to use native HTML drag events, forward drag listeners
    a.draggable && c.startsWith("onDrag")) && (u[c] = a[c]);
  return u;
}
const wu = /* @__PURE__ */ lt.createContext({});
function Z2(a, l) {
  if (Ou(a)) {
    const { initial: r, animate: u } = a;
    return {
      initial: r === !1 || vs(r) ? r : void 0,
      animate: vs(u) ? u : void 0
    };
  }
  return a.inherit !== !1 ? l : {};
}
function K2(a) {
  const { initial: l, animate: r } = Z2(a, lt.useContext(wu));
  return lt.useMemo(() => ({ initial: l, animate: r }), [M0(l), M0(r)]);
}
function M0(a) {
  return Array.isArray(a) ? a.join(" ") : a;
}
const _d = () => ({
  style: {},
  transform: {},
  transformOrigin: {},
  vars: {}
});
function Mb(a, l, r) {
  for (const u in l)
    !Ft(l[u]) && !sb(u, r) && (a[u] = l[u]);
}
function k2({ transformTemplate: a }, l) {
  return lt.useMemo(() => {
    const r = _d();
    return Nd(r, l, a), Object.assign({}, r.vars, r.style);
  }, [l]);
}
function J2(a, l) {
  const r = a.style || {}, u = {};
  return Mb(u, r, a), Object.assign(u, k2(a, l)), u;
}
function F2(a, l) {
  const r = {}, u = J2(a, l);
  return a.drag && a.dragListener !== !1 && (r.draggable = !1, u.userSelect = u.WebkitUserSelect = u.WebkitTouchCallout = "none", u.touchAction = a.drag === !0 ? "none" : `pan-${a.drag === "x" ? "y" : "x"}`), a.tabIndex === void 0 && (a.onTap || a.onTapStart || a.whileTap) && (r.tabIndex = 0), r.style = u, r;
}
const Cb = () => ({
  ..._d(),
  attrs: {}
});
function P2(a, l, r, u) {
  const c = lt.useMemo(() => {
    const h = Cb();
    return ob(h, l, rb(u), a.transformTemplate, a.style), {
      ...h.attrs,
      style: { ...h.style }
    };
  }, [l]);
  if (a.style) {
    const h = {};
    Mb(h, a.style, a), c.style = { ...h, ...c.style };
  }
  return c;
}
const I2 = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view"
];
function Ud(a) {
  return (
    /**
     * If it's not a string, it's a custom React component. Currently we only support
     * HTML custom React components.
     */
    typeof a != "string" || /**
     * If it contains a dash, the element is a custom HTML webcomponent.
     */
    a.includes("-") ? !1 : (
      /**
       * If it's in our list of lowercase SVG tags, it's an SVG component
       */
      !!(I2.indexOf(a) > -1 || /**
       * If it contains a capital letter, it's an SVG component
       */
      /[A-Z]/u.test(a))
    )
  );
}
function W2(a, l, r, { latestValues: u }, c, h = !1, d) {
  const g = (d ?? Ud(a) ? P2 : F2)(l, u, c, a), b = Q2(l, typeof a == "string", h), v = a !== lt.Fragment ? { ...b, ...g, ref: r } : {}, { children: p } = l, S = lt.useMemo(() => Ft(p) ? p.get() : p, [p]);
  return lt.createElement(a, {
    ...v,
    children: S
  });
}
function $2({ scrapeMotionValuesFromProps: a, createRenderState: l }, r, u, c) {
  return {
    latestValues: tM(r, u, c, a),
    renderState: l()
  };
}
function tM(a, l, r, u) {
  const c = {}, h = u(a, {});
  for (const S in h)
    c[S] = hu(h[S]);
  let { initial: d, animate: m } = a;
  const g = Ou(a), b = Iv(a);
  l && b && !g && a.inherit !== !1 && (d === void 0 && (d = l.initial), m === void 0 && (m = l.animate));
  let v = r ? r.initial === !1 : !1;
  v = v || d === !1;
  const p = v ? m : d;
  if (p && typeof p != "boolean" && !zu(p)) {
    const S = Array.isArray(p) ? p : [p];
    for (let z = 0; z < S.length; z++) {
      const w = Ad(a, S[z]);
      if (w) {
        const { transitionEnd: U, transition: N, ...H } = w;
        for (const j in H) {
          let Y = H[j];
          if (Array.isArray(Y)) {
            const X = v ? Y.length - 1 : 0;
            Y = Y[X];
          }
          Y !== null && (c[j] = Y);
        }
        for (const j in U)
          c[j] = U[j];
      }
    }
  }
  return c;
}
const Db = (a) => (l, r) => {
  const u = lt.useContext(wu), c = lt.useContext(rd), h = () => $2(a, l, u, c);
  return r ? h() : ms(h);
}, eM = /* @__PURE__ */ Db({
  scrapeMotionValuesFromProps: Vd,
  createRenderState: _d
}), nM = /* @__PURE__ */ Db({
  scrapeMotionValuesFromProps: cb,
  createRenderState: Cb
}), iM = Symbol.for("motionComponentSymbol");
function aM(a, l, r) {
  const u = lt.useRef(r);
  lt.useInsertionEffect(() => {
    u.current = r;
  });
  const c = lt.useRef(null);
  return lt.useCallback((h) => {
    var m;
    h && ((m = a.onMount) == null || m.call(a, h)), l && (h ? l.mount(h) : l.unmount());
    const d = u.current;
    if (typeof d == "function")
      if (h) {
        const g = d(h);
        typeof g == "function" && (c.current = g);
      } else c.current ? (c.current(), c.current = null) : d(h);
    else d && (d.current = h);
  }, [l]);
}
const zb = lt.createContext({});
function nl(a) {
  return a && typeof a == "object" && Object.prototype.hasOwnProperty.call(a, "current");
}
function lM(a, l, r, u, c, h) {
  var Y, X;
  const { visualElement: d } = lt.useContext(wu), m = lt.useContext(Eb), g = lt.useContext(rd), b = lt.useContext(Ru), v = b.reducedMotion, p = b.skipAnimations, S = lt.useRef(null), z = lt.useRef(!1);
  u = u || m.renderer, !S.current && u && (S.current = u(a, {
    visualState: l,
    parent: d,
    props: r,
    presenceContext: g,
    blockInitialAnimation: g ? g.initial === !1 : !1,
    reducedMotionConfig: v,
    skipAnimations: p,
    isSVG: h
  }), z.current && S.current && (S.current.manuallyAnimateOnMount = !0));
  const w = S.current, U = lt.useContext(zb);
  w && !w.projection && c && (w.type === "html" || w.type === "svg") && sM(S.current, r, c, U);
  const N = lt.useRef(!1);
  lt.useInsertionEffect(() => {
    w && N.current && w.update(r, g);
  });
  const H = r[jv], j = lt.useRef(!!H && typeof window < "u" && !((Y = window.MotionHandoffIsComplete) != null && Y.call(window, H)) && ((X = window.MotionHasOptimisedAnimation) == null ? void 0 : X.call(window, H)));
  return P0(() => {
    z.current = !0, w && (N.current = !0, window.MotionIsMounted = !0, w.updateFeatures(), w.scheduleRenderMicrotask(), j.current && w.animationState && w.animationState.animateChanges());
  }), lt.useEffect(() => {
    w && (!j.current && w.animationState && w.animationState.animateChanges(), j.current && (queueMicrotask(() => {
      var P;
      (P = window.MotionHandoffMarkAsComplete) == null || P.call(window, H);
    }), j.current = !1), w.enteringChildren = void 0);
  }), w;
}
function sM(a, l, r, u) {
  const { layoutId: c, layout: h, drag: d, dragConstraints: m, layoutScroll: g, layoutRoot: b, layoutAnchor: v, layoutCrossfade: p } = l;
  a.projection = new r(a.latestValues, l["data-framer-portal-id"] ? void 0 : Ob(a.parent)), a.projection.setOptions({
    layoutId: c,
    layout: h,
    alwaysMeasureLayout: !!d || m && nl(m),
    visualElement: a,
    /**
     * TODO: Update options in an effect. This could be tricky as it'll be too late
     * to update by the time layout animations run.
     * We also need to fix this safeToRemove by linking it up to the one returned by usePresence,
     * ensuring it gets called if there's no potential layout animations.
     *
     */
    animationType: typeof h == "string" ? h : "both",
    initialPromotionConfig: u,
    crossfade: p,
    layoutScroll: g,
    layoutRoot: b,
    layoutAnchor: v
  });
}
function Ob(a) {
  if (a)
    return a.options.allowProjection !== !1 ? a.projection : Ob(a.parent);
}
function wf(a, { forwardMotionProps: l = !1, type: r } = {}, u, c) {
  u && Y2(u);
  const h = r ? r === "svg" : Ud(a), d = h ? nM : eM;
  function m(b, v) {
    let p;
    const S = {
      ...lt.useContext(Ru),
      ...b,
      layoutId: oM(b)
    }, { isStatic: z } = S, w = K2(b), U = d(b, z);
    if (!z && typeof window < "u") {
      uM();
      const N = rM(S);
      p = N.MeasureLayout, w.visualElement = lM(a, U, S, c, N.ProjectionNode, h);
    }
    return Jt.jsxs(wu.Provider, { value: w, children: [p && w.visualElement ? Jt.jsx(p, { visualElement: w.visualElement, ...S }) : null, W2(a, b, aM(U, w.visualElement, v), U, z, l, h)] });
  }
  m.displayName = `motion.${typeof a == "string" ? a : `create(${a.displayName ?? a.name ?? ""})`}`;
  const g = lt.forwardRef(m);
  return g[iM] = a, g;
}
function oM({ layoutId: a }) {
  const l = lt.useContext(F0).id;
  return l && a !== void 0 ? l + "-" + a : a;
}
function uM(a, l) {
  lt.useContext(Eb).strict;
}
function rM(a) {
  const l = Ab(), { drag: r, layout: u } = l;
  if (!r && !u)
    return {};
  const c = { ...r, ...u };
  return {
    MeasureLayout: r != null && r.isEnabled(a) || u != null && u.isEnabled(a) ? c.MeasureLayout : void 0,
    ProjectionNode: c.ProjectionNode
  };
}
function cM(a, l) {
  if (typeof Proxy > "u")
    return wf;
  const r = /* @__PURE__ */ new Map(), u = (h, d) => wf(h, d, a, l), c = (h, d) => u(h, d);
  return new Proxy(c, {
    /**
     * Called when `motion` is referenced with a prop: `motion.div`, `motion.input` etc.
     * The prop name is passed through as `key` and we can use that to generate a `motion`
     * DOM component with that name.
     */
    get: (h, d) => d === "create" ? u : (r.has(d) || r.set(d, wf(d, void 0, a, l)), r.get(d))
  });
}
const fM = (a, l) => l.isSVG ?? Ud(a) ? new Kx(l) : new Gx(l, {
  allowProjection: a !== lt.Fragment
});
class dM extends wi {
  /**
   * We dynamically generate the AnimationState manager as it contains a reference
   * to the underlying animation library. We only want to load that if we load this,
   * so people can optionally code split it out using the `m` component.
   */
  constructor(l) {
    super(l), l.animationState || (l.animationState = Ix(l));
  }
  updateAnimationControlsSubscription() {
    const { animate: l } = this.node.getProps();
    zu(l) && (this.unmountControls = l.subscribe(this.node));
  }
  /**
   * Subscribe any provided AnimationControls to the component's VisualElement
   */
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: l } = this.node.getProps(), { animate: r } = this.node.prevProps || {};
    l !== r && this.updateAnimationControlsSubscription();
  }
  unmount() {
    var l;
    this.node.animationState.reset(), (l = this.unmountControls) == null || l.call(this);
  }
}
let hM = 0;
class mM extends wi {
  constructor() {
    super(...arguments), this.id = hM++, this.isExitComplete = !1;
  }
  update() {
    var h;
    if (!this.node.presenceContext)
      return;
    const { isPresent: l, onExitComplete: r } = this.node.presenceContext, { isPresent: u } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || l === u)
      return;
    if (l && u === !1) {
      if (this.isExitComplete) {
        const { initial: d, custom: m } = this.node.getProps();
        if (typeof d == "string" || typeof d == "object" && d !== null && !Array.isArray(d)) {
          const g = ua(this.node, d, m);
          if (g) {
            const { transition: b, transitionEnd: v, ...p } = g;
            for (const S in p)
              (h = this.node.getValue(S)) == null || h.jump(p[S]);
          }
        }
        this.node.animationState.reset(), this.node.animationState.animateChanges();
      } else
        this.node.animationState.setActive("exit", !1);
      this.isExitComplete = !1;
      return;
    }
    const c = this.node.animationState.setActive("exit", !l);
    r && !l && c.then(() => {
      this.isExitComplete = !0, r(this.id);
    });
  }
  mount() {
    const { register: l, onExitComplete: r } = this.node.presenceContext || {};
    r && r(this.id), l && (this.unmount = l(this.id));
  }
  unmount() {
  }
}
const pM = {
  animation: {
    Feature: dM
  },
  exit: {
    Feature: mM
  }
};
function xs(a) {
  return {
    point: {
      x: a.pageX,
      y: a.pageY
    }
  };
}
const yM = (a) => (l) => Dd(l) && a(l, xs(l));
function hs(a, l, r, u) {
  return bs(a, l, yM(r), u);
}
const Rb = ({ current: a }) => a ? a.ownerDocument.defaultView : null, C0 = (a, l) => Math.abs(a - l);
function gM(a, l) {
  const r = C0(a.x, l.x), u = C0(a.y, l.y);
  return Math.sqrt(r ** 2 + u ** 2);
}
const D0 = /* @__PURE__ */ new Set(["auto", "scroll"]);
class wb {
  constructor(l, r, { transformPagePoint: u, contextWindow: c = window, dragSnapToOrigin: h = !1, distanceThreshold: d = 3, element: m } = {}) {
    if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = /* @__PURE__ */ new Map(), this.removeScrollListeners = null, this.onElementScroll = (w) => {
      this.handleScroll(w.target);
    }, this.onWindowScroll = () => {
      this.handleScroll(window);
    }, this.updatePoint = () => {
      if (!(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      this.lastRawMoveEventInfo && (this.lastMoveEventInfo = au(this.lastRawMoveEventInfo, this.transformPagePoint));
      const w = Nf(this.lastMoveEventInfo, this.history), U = this.startEvent !== null, N = gM(w.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
      if (!U && !N)
        return;
      const { point: H } = w, { timestamp: j } = ge;
      this.history.push({ ...H, timestamp: j });
      const { onStart: Y, onMove: X } = this.handlers;
      U || (Y && Y(this.lastMoveEvent, w), this.startEvent = this.lastMoveEvent), X && X(this.lastMoveEvent, w);
    }, this.handlePointerMove = (w, U) => {
      this.lastMoveEvent = w, this.lastRawMoveEventInfo = U, this.lastMoveEventInfo = au(U, this.transformPagePoint), Vt.update(this.updatePoint, !0);
    }, this.handlePointerUp = (w, U) => {
      this.end();
      const { onEnd: N, onSessionEnd: H, resumeAnimation: j } = this.handlers;
      if ((this.dragSnapToOrigin || !this.startEvent) && j && j(), !(this.lastMoveEvent && this.lastMoveEventInfo))
        return;
      const Y = Nf(w.type === "pointercancel" ? this.lastMoveEventInfo : au(U, this.transformPagePoint), this.history);
      this.startEvent && N && N(w, Y), H && H(w, Y);
    }, !Dd(l))
      return;
    this.dragSnapToOrigin = h, this.handlers = r, this.transformPagePoint = u, this.distanceThreshold = d, this.contextWindow = c || window;
    const g = xs(l), b = au(g, this.transformPagePoint), { point: v } = b, { timestamp: p } = ge;
    this.history = [{ ...v, timestamp: p }];
    const { onSessionStart: S } = r;
    S && S(l, Nf(b, this.history));
    const z = { passive: !0, capture: !0 };
    this.removeListeners = Ts(hs(this.contextWindow, "pointermove", this.handlePointerMove, z), hs(this.contextWindow, "pointerup", this.handlePointerUp, z), hs(this.contextWindow, "pointercancel", this.handlePointerUp, z)), m && this.startScrollTracking(m);
  }
  /**
   * Start tracking scroll on ancestors and window.
   */
  startScrollTracking(l) {
    let r = l.parentElement;
    for (; r; ) {
      const u = getComputedStyle(r);
      (D0.has(u.overflowX) || D0.has(u.overflowY)) && this.scrollPositions.set(r, {
        x: r.scrollLeft,
        y: r.scrollTop
      }), r = r.parentElement;
    }
    this.scrollPositions.set(window, {
      x: window.scrollX,
      y: window.scrollY
    }), window.addEventListener("scroll", this.onElementScroll, {
      capture: !0
    }), window.addEventListener("scroll", this.onWindowScroll), this.removeScrollListeners = () => {
      window.removeEventListener("scroll", this.onElementScroll, {
        capture: !0
      }), window.removeEventListener("scroll", this.onWindowScroll);
    };
  }
  /**
   * Handle scroll compensation during drag.
   *
   * For element scroll: adjusts history origin since pageX/pageY doesn't change.
   * For window scroll: adjusts lastMoveEventInfo since pageX/pageY would change.
   */
  handleScroll(l) {
    const r = this.scrollPositions.get(l);
    if (!r)
      return;
    const u = l === window, c = u ? { x: window.scrollX, y: window.scrollY } : {
      x: l.scrollLeft,
      y: l.scrollTop
    }, h = { x: c.x - r.x, y: c.y - r.y };
    h.x === 0 && h.y === 0 || (u ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += h.x, this.lastMoveEventInfo.point.y += h.y) : this.history.length > 0 && (this.history[0].x -= h.x, this.history[0].y -= h.y), this.scrollPositions.set(l, c), Vt.update(this.updatePoint, !0));
  }
  updateHandlers(l) {
    this.handlers = l;
  }
  end() {
    this.removeListeners && this.removeListeners(), this.removeScrollListeners && this.removeScrollListeners(), this.scrollPositions.clear(), Jn(this.updatePoint);
  }
}
function au(a, l) {
  return l ? { point: l(a.point) } : a;
}
function z0(a, l) {
  return { x: a.x - l.x, y: a.y - l.y };
}
function Nf({ point: a }, l) {
  return {
    point: a,
    delta: z0(a, Nb(l)),
    offset: z0(a, vM(l)),
    velocity: bM(l, 0.1)
  };
}
function vM(a) {
  return a[0];
}
function Nb(a) {
  return a[a.length - 1];
}
function bM(a, l) {
  if (a.length < 2)
    return { x: 0, y: 0 };
  let r = a.length - 1, u = null;
  const c = Nb(a);
  for (; r >= 0 && (u = a[r], !(c.timestamp - u.timestamp > /* @__PURE__ */ Ne(l))); )
    r--;
  if (!u)
    return { x: 0, y: 0 };
  u === a[0] && a.length > 2 && c.timestamp - u.timestamp > /* @__PURE__ */ Ne(l) * 2 && (u = a[1]);
  const h = /* @__PURE__ */ tn(c.timestamp - u.timestamp);
  if (h === 0)
    return { x: 0, y: 0 };
  const d = {
    x: (c.x - u.x) / h,
    y: (c.y - u.y) / h
  };
  return d.x === 1 / 0 && (d.x = 0), d.y === 1 / 0 && (d.y = 0), d;
}
function SM(a, { min: l, max: r }, u) {
  return l !== void 0 && a < l ? a = u ? Bt(l, a, u.min) : Math.max(a, l) : r !== void 0 && a > r && (a = u ? Bt(r, a, u.max) : Math.min(a, r)), a;
}
function O0(a, l, r) {
  return {
    min: l !== void 0 ? a.min + l : void 0,
    max: r !== void 0 ? a.max + r - (a.max - a.min) : void 0
  };
}
function TM(a, { top: l, left: r, bottom: u, right: c }) {
  return {
    x: O0(a.x, r, c),
    y: O0(a.y, l, u)
  };
}
function R0(a, l) {
  let r = l.min - a.min, u = l.max - a.max;
  return l.max - l.min < a.max - a.min && ([r, u] = [u, r]), { min: r, max: u };
}
function EM(a, l) {
  return {
    x: R0(a.x, l.x),
    y: R0(a.y, l.y)
  };
}
function AM(a, l) {
  let r = 0.5;
  const u = xe(a), c = xe(l);
  return c > u ? r = /* @__PURE__ */ ps(l.min, l.max - u, a.min) : u > c && (r = /* @__PURE__ */ ps(a.min, a.max - c, l.min)), Rn(0, 1, r);
}
function xM(a, l) {
  const r = {};
  return l.min !== void 0 && (r.min = l.min - a.min), l.max !== void 0 && (r.max = l.max - a.min), r;
}
const ld = 0.35;
function MM(a = ld) {
  return a === !1 ? a = 0 : a === !0 && (a = ld), {
    x: w0(a, "left", "right"),
    y: w0(a, "top", "bottom")
  };
}
function w0(a, l, r) {
  return {
    min: N0(a, l),
    max: N0(a, r)
  };
}
function N0(a, l) {
  return typeof a == "number" ? a : a[l] || 0;
}
const CM = /* @__PURE__ */ new WeakMap();
class DM {
  constructor(l) {
    this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = { x: 0, y: 0 }, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = ae(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = l;
  }
  start(l, { snapToCursor: r = !1, distanceThreshold: u } = {}) {
    const { presenceContext: c } = this.visualElement;
    if (c && c.isPresent === !1)
      return;
    const h = (p) => {
      r && this.snapToCursor(xs(p).point), this.stopAnimation();
    }, d = (p, S) => {
      const { drag: z, dragPropagation: w, onDragStart: U } = this.getProps();
      if (z && !w && (this.openDragLock && this.openDragLock(), this.openDragLock = ax(z), !this.openDragLock))
        return;
      this.latestPointerEvent = p, this.latestPanInfo = S, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = !0, this.visualElement.projection.target = void 0), Dn((H) => {
        let j = this.getAxisMotionValue(H).get() || 0;
        if (On.test(j)) {
          const { projection: Y } = this.visualElement;
          if (Y && Y.layout) {
            const X = Y.layout.layoutBox[H];
            X && (j = xe(X) * (parseFloat(j) / 100));
          }
        }
        this.originPoint[H] = j;
      }), U && Vt.update(() => U(p, S), !1, !0), Pf(this.visualElement, "transform");
      const { animationState: N } = this.visualElement;
      N && N.setActive("whileDrag", !0);
    }, m = (p, S) => {
      this.latestPointerEvent = p, this.latestPanInfo = S;
      const { dragPropagation: z, dragDirectionLock: w, onDirectionLock: U, onDrag: N } = this.getProps();
      if (!z && !this.openDragLock)
        return;
      const { offset: H } = S;
      if (w && this.currentDirection === null) {
        this.currentDirection = OM(H), this.currentDirection !== null && U && U(this.currentDirection);
        return;
      }
      this.updateAxis("x", S.point, H), this.updateAxis("y", S.point, H), this.visualElement.render(), N && Vt.update(() => N(p, S), !1, !0);
    }, g = (p, S) => {
      this.latestPointerEvent = p, this.latestPanInfo = S, this.stop(p, S), this.latestPointerEvent = null, this.latestPanInfo = null;
    }, b = () => {
      const { dragSnapToOrigin: p } = this.getProps();
      (p || this.constraints) && this.startAnimation({ x: 0, y: 0 });
    }, { dragSnapToOrigin: v } = this.getProps();
    this.panSession = new wb(l, {
      onSessionStart: h,
      onStart: d,
      onMove: m,
      onSessionEnd: g,
      resumeAnimation: b
    }, {
      transformPagePoint: this.visualElement.getTransformPagePoint(),
      dragSnapToOrigin: v,
      distanceThreshold: u,
      contextWindow: Rb(this.visualElement),
      element: this.visualElement.current
    });
  }
  /**
   * @internal
   */
  stop(l, r) {
    const u = l || this.latestPointerEvent, c = r || this.latestPanInfo, h = this.isDragging;
    if (this.cancel(), !h || !c || !u)
      return;
    const { velocity: d } = c;
    this.startAnimation(d);
    const { onDragEnd: m } = this.getProps();
    m && Vt.postRender(() => m(u, c));
  }
  /**
   * @internal
   */
  cancel() {
    this.isDragging = !1;
    const { projection: l, animationState: r } = this.visualElement;
    l && (l.isAnimationBlocked = !1), this.endPanSession();
    const { dragPropagation: u } = this.getProps();
    !u && this.openDragLock && (this.openDragLock(), this.openDragLock = null), r && r.setActive("whileDrag", !1);
  }
  /**
   * Clean up the pan session without modifying other drag state.
   * This is used during unmount to ensure event listeners are removed
   * without affecting projection animations or drag locks.
   * @internal
   */
  endPanSession() {
    this.panSession && this.panSession.end(), this.panSession = void 0;
  }
  updateAxis(l, r, u) {
    const { drag: c } = this.getProps();
    if (!u || !lu(l, c, this.currentDirection))
      return;
    const h = this.getAxisMotionValue(l);
    let d = this.originPoint[l] + u[l];
    this.constraints && this.constraints[l] && (d = SM(d, this.constraints[l], this.elastic[l])), h.set(d);
  }
  resolveConstraints() {
    var h;
    const { dragConstraints: l, dragElastic: r } = this.getProps(), u = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(!1) : (h = this.visualElement.projection) == null ? void 0 : h.layout, c = this.constraints;
    l && nl(l) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : l && u ? this.constraints = TM(u.layoutBox, l) : this.constraints = !1, this.elastic = MM(r), c !== this.constraints && !nl(l) && u && this.constraints && !this.hasMutatedConstraints && Dn((d) => {
      this.constraints !== !1 && this.getAxisMotionValue(d) && (this.constraints[d] = xM(u.layoutBox[d], this.constraints[d]));
    });
  }
  resolveRefConstraints() {
    const { dragConstraints: l, onMeasureDragConstraints: r } = this.getProps();
    if (!l || !nl(l))
      return !1;
    const u = l.current;
    Oi(u !== null, "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.", "drag-constraints-ref");
    const { projection: c } = this.visualElement;
    if (!c || !c.layout)
      return !1;
    c.root && (c.root.scroll = void 0, c.root.updateScroll());
    const h = _x(u, c.root, this.visualElement.getTransformPagePoint());
    let d = EM(c.layout.layoutBox, h);
    if (r) {
      const m = r(wx(d));
      this.hasMutatedConstraints = !!m, m && (d = eb(m));
    }
    return d;
  }
  startAnimation(l) {
    const { drag: r, dragMomentum: u, dragElastic: c, dragTransition: h, dragSnapToOrigin: d, onDragTransitionEnd: m } = this.getProps(), g = this.constraints || {}, b = Dn((v) => {
      if (!lu(v, r, this.currentDirection))
        return;
      let p = g && g[v] || {};
      (d === !0 || d === v) && (p = { min: 0, max: 0 });
      const S = c ? 200 : 1e6, z = c ? 40 : 1e7, w = {
        type: "inertia",
        velocity: u ? l[v] : 0,
        bounceStiffness: S,
        bounceDamping: z,
        timeConstant: 750,
        restDelta: 1,
        restSpeed: 10,
        ...h,
        ...p
      };
      return this.startAxisValueAnimation(v, w);
    });
    return Promise.all(b).then(m);
  }
  startAxisValueAnimation(l, r) {
    const u = this.getAxisMotionValue(l);
    return Pf(this.visualElement, l), u.start(Ed(l, u, 0, r, this.visualElement, !1));
  }
  stopAnimation() {
    Dn((l) => this.getAxisMotionValue(l).stop());
  }
  /**
   * Drag works differently depending on which props are provided.
   *
   * - If _dragX and _dragY are provided, we output the gesture delta directly to those motion values.
   * - Otherwise, we apply the delta to the x/y motion values.
   */
  getAxisMotionValue(l) {
    const r = `_drag${l.toUpperCase()}`, c = this.visualElement.getProps()[r];
    return c || this.visualElement.getValue(l, this.visualElement.latestValues[l] ?? 0);
  }
  snapToCursor(l) {
    Dn((r) => {
      const { drag: u } = this.getProps();
      if (!lu(r, u, this.currentDirection))
        return;
      const { projection: c } = this.visualElement, h = this.getAxisMotionValue(r);
      if (c && c.layout) {
        const { min: d, max: m } = c.layout.layoutBox[r], g = h.get() || 0;
        h.set(l[r] - Bt(d, m, 0.5) + g);
      }
    });
  }
  /**
   * When the viewport resizes we want to check if the measured constraints
   * have changed and, if so, reposition the element within those new constraints
   * relative to where it was before the resize.
   */
  scalePositionWithinConstraints() {
    if (!this.visualElement.current)
      return;
    const { drag: l, dragConstraints: r } = this.getProps(), { projection: u } = this.visualElement;
    if (!nl(r) || !u || !this.constraints)
      return;
    this.stopAnimation();
    const c = { x: 0, y: 0 };
    Dn((d) => {
      const m = this.getAxisMotionValue(d);
      if (m && this.constraints !== !1) {
        const g = m.get();
        c[d] = AM({ min: g, max: g }, this.constraints[d]);
      }
    });
    const { transformTemplate: h } = this.visualElement.getProps();
    this.visualElement.current.style.transform = h ? h({}, "") : "none", u.root && u.root.updateScroll(), u.updateLayout(), this.constraints = !1, this.resolveConstraints(), Dn((d) => {
      if (!lu(d, l, null))
        return;
      const m = this.getAxisMotionValue(d), { min: g, max: b } = this.constraints[d];
      m.set(Bt(g, b, c[d]));
    }), this.visualElement.render();
  }
  addListeners() {
    if (!this.visualElement.current)
      return;
    CM.set(this.visualElement, this);
    const l = this.visualElement.current, r = hs(l, "pointerdown", (b) => {
      const { drag: v, dragListener: p = !0 } = this.getProps(), S = b.target, z = S !== l && cx(S);
      v && p && !z && this.start(b);
    });
    let u;
    const c = () => {
      const { dragConstraints: b } = this.getProps();
      nl(b) && b.current && (this.constraints = this.resolveRefConstraints(), u || (u = zM(l, b.current, () => this.scalePositionWithinConstraints())));
    }, { projection: h } = this.visualElement, d = h.addEventListener("measure", c);
    h && !h.layout && (h.root && h.root.updateScroll(), h.updateLayout()), Vt.read(c);
    const m = bs(window, "resize", () => this.scalePositionWithinConstraints()), g = h.addEventListener("didUpdate", (({ delta: b, hasLayoutChanged: v }) => {
      this.isDragging && v && (Dn((p) => {
        const S = this.getAxisMotionValue(p);
        S && (this.originPoint[p] += b[p].translate, S.set(S.get() + b[p].translate));
      }), this.visualElement.render());
    }));
    return () => {
      m(), r(), d(), g && g(), u && u();
    };
  }
  getProps() {
    const l = this.visualElement.getProps(), { drag: r = !1, dragDirectionLock: u = !1, dragPropagation: c = !1, dragConstraints: h = !1, dragElastic: d = ld, dragMomentum: m = !0 } = l;
    return {
      ...l,
      drag: r,
      dragDirectionLock: u,
      dragPropagation: c,
      dragConstraints: h,
      dragElastic: d,
      dragMomentum: m
    };
  }
}
function V0(a) {
  let l = !0;
  return () => {
    if (l) {
      l = !1;
      return;
    }
    a();
  };
}
function zM(a, l, r) {
  const u = Yg(a, V0(r)), c = Yg(l, V0(r));
  return () => {
    u(), c();
  };
}
function lu(a, l, r) {
  return (l === !0 || l === a) && (r === null || r === a);
}
function OM(a, l = 10) {
  let r = null;
  return Math.abs(a.y) > l ? r = "y" : Math.abs(a.x) > l && (r = "x"), r;
}
class RM extends wi {
  constructor(l) {
    super(l), this.removeGroupControls = en, this.removeListeners = en, this.controls = new DM(l);
  }
  mount() {
    const { dragControls: l } = this.node.getProps();
    l && (this.removeGroupControls = l.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || en;
  }
  update() {
    const { dragControls: l } = this.node.getProps(), { dragControls: r } = this.node.prevProps || {};
    l !== r && (this.removeGroupControls(), l && (this.removeGroupControls = l.subscribe(this.controls)));
  }
  unmount() {
    this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession();
  }
}
const Vf = (a) => (l, r) => {
  a && Vt.update(() => a(l, r), !1, !0);
};
class wM extends wi {
  constructor() {
    super(...arguments), this.removePointerDownListener = en;
  }
  onPointerDown(l) {
    this.session = new wb(l, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: Rb(this.node)
    });
  }
  createPanHandlers() {
    const { onPanSessionStart: l, onPanStart: r, onPan: u, onPanEnd: c } = this.node.getProps();
    return {
      onSessionStart: Vf(l),
      onStart: Vf(r),
      onMove: Vf(u),
      onEnd: (h, d) => {
        delete this.session, c && Vt.postRender(() => c(h, d));
      }
    };
  }
  mount() {
    this.removePointerDownListener = hs(this.node.current, "pointerdown", (l) => this.onPointerDown(l));
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    this.removePointerDownListener(), this.session && this.session.end();
  }
}
let _f = !1;
class NM extends lt.Component {
  /**
   * This only mounts projection nodes for components that
   * need measuring, we might want to do it for all components
   * in order to incorporate transforms
   */
  componentDidMount() {
    const { visualElement: l, layoutGroup: r, switchLayoutGroup: u, layoutId: c } = this.props, { projection: h } = l;
    h && (r.group && r.group.add(h), u && u.register && c && u.register(h), _f && h.root.didUpdate(), h.addEventListener("animationComplete", () => {
      this.safeToRemove();
    }), h.setOptions({
      ...h.options,
      layoutDependency: this.props.layoutDependency,
      onExitComplete: () => this.safeToRemove()
    })), mu.hasEverUpdated = !0;
  }
  getSnapshotBeforeUpdate(l) {
    const { layoutDependency: r, visualElement: u, drag: c, isPresent: h } = this.props, { projection: d } = u;
    return d && (d.isPresent = h, l.layoutDependency !== r && d.setOptions({
      ...d.options,
      layoutDependency: r
    }), _f = !0, c || l.layoutDependency !== r || r === void 0 || l.isPresent !== h ? d.willUpdate() : this.safeToRemove(), l.isPresent !== h && (h ? d.promote() : d.relegate() || Vt.postRender(() => {
      const m = d.getStack();
      (!m || !m.members.length) && this.safeToRemove();
    }))), null;
  }
  componentDidUpdate() {
    const { visualElement: l, layoutAnchor: r } = this.props, { projection: u } = l;
    u && (u.options.layoutAnchor = r, u.root.didUpdate(), Cd.postRender(() => {
      !u.currentAnimation && u.isLead() && this.safeToRemove();
    }));
  }
  componentWillUnmount() {
    const { visualElement: l, layoutGroup: r, switchLayoutGroup: u } = this.props, { projection: c } = l;
    _f = !0, c && (c.scheduleCheckAfterUnmount(), r && r.group && r.group.remove(c), u && u.deregister && u.deregister(c));
  }
  safeToRemove() {
    const { safeToRemove: l } = this.props;
    l && l();
  }
  render() {
    return null;
  }
}
function Vb(a) {
  const [l, r] = j2(), u = lt.useContext(F0);
  return Jt.jsx(NM, { ...a, layoutGroup: u, switchLayoutGroup: lt.useContext(zb), isPresent: l, safeToRemove: r });
}
const VM = {
  pan: {
    Feature: wM
  },
  drag: {
    Feature: RM,
    ProjectionNode: Tb,
    MeasureLayout: Vb
  }
};
function _0(a, l, r) {
  const { props: u } = a;
  a.animationState && u.whileHover && a.animationState.setActive("whileHover", r === "Start");
  const c = "onHover" + r, h = u[c];
  h && Vt.postRender(() => h(l, xs(l)));
}
class _M extends wi {
  mount() {
    const { current: l } = this.node;
    l && (this.unmount = sx(l, (r, u) => (_0(this.node, u, "Start"), (c) => _0(this.node, c, "End"))));
  }
  unmount() {
  }
}
class UM extends wi {
  constructor() {
    super(...arguments), this.isActive = !1;
  }
  onFocus() {
    let l = !1;
    try {
      l = this.node.current.matches(":focus-visible");
    } catch {
      l = !0;
    }
    !l || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0);
  }
  onBlur() {
    !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1);
  }
  mount() {
    this.unmount = Ts(bs(this.node.current, "focus", () => this.onFocus()), bs(this.node.current, "blur", () => this.onBlur()));
  }
  unmount() {
  }
}
function U0(a, l, r) {
  const { props: u } = a;
  if (a.current instanceof HTMLButtonElement && a.current.disabled)
    return;
  a.animationState && u.whileTap && a.animationState.setActive("whileTap", r === "Start");
  const c = "onTap" + (r === "End" ? "" : r), h = u[c];
  h && Vt.postRender(() => h(l, xs(l)));
}
class BM extends wi {
  mount() {
    const { current: l } = this.node;
    if (!l)
      return;
    const { globalTapTarget: r, propagate: u } = this.node.props;
    this.unmount = dx(l, (c, h) => (U0(this.node, h, "Start"), (d, { success: m }) => U0(this.node, d, m ? "End" : "Cancel")), {
      useGlobalTarget: r,
      stopPropagation: (u == null ? void 0 : u.tap) === !1
    });
  }
  unmount() {
  }
}
const sd = /* @__PURE__ */ new WeakMap(), Uf = /* @__PURE__ */ new WeakMap(), LM = (a) => {
  const l = sd.get(a.target);
  l && l(a);
}, HM = (a) => {
  a.forEach(LM);
};
function jM({ root: a, ...l }) {
  const r = a || document;
  Uf.has(r) || Uf.set(r, {});
  const u = Uf.get(r), c = JSON.stringify(l);
  return u[c] || (u[c] = new IntersectionObserver(HM, { root: a, ...l })), u[c];
}
function GM(a, l, r) {
  const u = jM(l);
  return sd.set(a, r), u.observe(a), () => {
    sd.delete(a), u.unobserve(a);
  };
}
const YM = {
  some: 0,
  all: 1
};
class qM extends wi {
  constructor() {
    super(...arguments), this.hasEnteredView = !1, this.isInView = !1;
  }
  startObserver() {
    var g;
    (g = this.stopObserver) == null || g.call(this);
    const { viewport: l = {} } = this.node.getProps(), { root: r, margin: u, amount: c = "some", once: h } = l, d = {
      root: r ? r.current : void 0,
      rootMargin: u,
      threshold: typeof c == "number" ? c : YM[c]
    }, m = (b) => {
      const { isIntersecting: v } = b;
      if (this.isInView === v || (this.isInView = v, h && !v && this.hasEnteredView))
        return;
      v && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", v);
      const { onViewportEnter: p, onViewportLeave: S } = this.node.getProps(), z = v ? p : S;
      z && z(b);
    };
    this.stopObserver = GM(this.node.current, d, m);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u")
      return;
    const { props: l, prevProps: r } = this.node;
    ["amount", "margin", "root"].some(XM(l, r)) && this.startObserver();
  }
  unmount() {
    var l;
    (l = this.stopObserver) == null || l.call(this), this.hasEnteredView = !1, this.isInView = !1;
  }
}
function XM({ viewport: a = {} }, { viewport: l = {} } = {}) {
  return (r) => a[r] !== l[r];
}
const QM = {
  inView: {
    Feature: qM
  },
  tap: {
    Feature: BM
  },
  focus: {
    Feature: UM
  },
  hover: {
    Feature: _M
  }
}, ZM = {
  layout: {
    ProjectionNode: Tb,
    MeasureLayout: Vb
  }
}, KM = {
  ...pM,
  ...QM,
  ...VM,
  ...ZM
}, kM = /* @__PURE__ */ cM(KM, fM);
function Mu(a) {
  const l = ms(() => ra(a)), { isStatic: r } = lt.useContext(Ru);
  if (r) {
    const [, u] = lt.useState(a);
    lt.useEffect(() => l.on("change", u), []);
  }
  return l;
}
function Bd(a, l) {
  const r = Mu(l()), u = () => r.set(l());
  return u(), P0(() => {
    const c = () => Vt.preRender(u, !1, !0), h = a.map((d) => d.on("change", c));
    return () => {
      h.forEach((d) => d()), Jn(u);
    };
  }), r;
}
function JM(a, ...l) {
  const r = a.length;
  function u() {
    let c = "";
    for (let h = 0; h < r; h++) {
      c += a[h];
      const d = l[h];
      d && (c += Ft(d) ? d.get() : d);
    }
    return c;
  }
  return Bd(l.filter(Ft), u);
}
function FM(a) {
  fs.current = [], a();
  const l = Bd(fs.current, a);
  return fs.current = void 0, l;
}
function Di(a, l, r, u) {
  if (typeof a == "function")
    return FM(a);
  if (r !== void 0 && !Array.isArray(r) && typeof l != "function")
    return PM(a, l, r, u);
  const d = typeof l == "function" ? l : Ex(l, r, u), m = Array.isArray(a) ? B0(a, d) : B0([a], ([b]) => d(b)), g = Array.isArray(a) ? void 0 : a.accelerate;
  return g && !g.isTransformed && typeof l != "function" && Array.isArray(r) && (u == null ? void 0 : u.clamp) !== !1 && (m.accelerate = {
    ...g,
    times: l,
    keyframes: r,
    isTransformed: !0
  }), m;
}
function B0(a, l) {
  const r = ms(() => []);
  return Bd(a, () => {
    r.length = 0;
    const u = a.length;
    for (let c = 0; c < u; c++)
      r[c] = a[c].get();
    return l(r);
  });
}
function PM(a, l, r, u) {
  const c = ms(() => Object.keys(r)), h = ms(() => ({}));
  for (const d of c)
    h[d] = Di(a, l, r[d], u);
  return h;
}
function IM(a, l = {}) {
  const { isStatic: r } = lt.useContext(Ru), u = () => Ft(a) ? a.get() : a;
  if (r)
    return Di(u);
  const c = Mu(u());
  return lt.useInsertionEffect(() => Ax(c, a, l), [c, JSON.stringify(l)]), c;
}
function L0(a, l = {}) {
  return IM(a, { type: "spring", ...l });
}
function WM() {
  !wd.current && Wv();
  const [a] = lt.useState(Su.current);
  return a;
}
const H0 = kM;
function _b(a) {
  var l, r, u = "";
  if (typeof a == "string" || typeof a == "number") u += a;
  else if (typeof a == "object") if (Array.isArray(a)) {
    var c = a.length;
    for (l = 0; l < c; l++) a[l] && (r = _b(a[l])) && (u && (u += " "), u += r);
  } else for (r in a) a[r] && (u && (u += " "), u += r);
  return u;
}
function $M() {
  for (var a, l, r = 0, u = "", c = arguments.length; r < c; r++) (a = arguments[r]) && (l = _b(a)) && (u && (u += " "), u += l);
  return u;
}
const t3 = (a, l) => {
  const r = new Array(a.length + l.length);
  for (let u = 0; u < a.length; u++)
    r[u] = a[u];
  for (let u = 0; u < l.length; u++)
    r[a.length + u] = l[u];
  return r;
}, e3 = (a, l) => ({
  classGroupId: a,
  validator: l
}), Ub = (a = /* @__PURE__ */ new Map(), l = null, r) => ({
  nextPart: a,
  validators: l,
  classGroupId: r
}), Cu = "-", j0 = [], n3 = "arbitrary..", i3 = (a) => {
  const l = l3(a), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: u
  } = a;
  return {
    getClassGroupId: (d) => {
      if (d.startsWith("[") && d.endsWith("]"))
        return a3(d);
      const m = d.split(Cu), g = m[0] === "" && m.length > 1 ? 1 : 0;
      return Bb(m, g, l);
    },
    getConflictingClassGroupIds: (d, m) => {
      if (m) {
        const g = u[d], b = r[d];
        return g ? b ? t3(b, g) : g : b || j0;
      }
      return r[d] || j0;
    }
  };
}, Bb = (a, l, r) => {
  if (a.length - l === 0)
    return r.classGroupId;
  const c = a[l], h = r.nextPart.get(c);
  if (h) {
    const b = Bb(a, l + 1, h);
    if (b) return b;
  }
  const d = r.validators;
  if (d === null)
    return;
  const m = l === 0 ? a.join(Cu) : a.slice(l).join(Cu), g = d.length;
  for (let b = 0; b < g; b++) {
    const v = d[b];
    if (v.validator(m))
      return v.classGroupId;
  }
}, a3 = (a) => a.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const l = a.slice(1, -1), r = l.indexOf(":"), u = l.slice(0, r);
  return u ? n3 + u : void 0;
})(), l3 = (a) => {
  const {
    theme: l,
    classGroups: r
  } = a;
  return s3(r, l);
}, s3 = (a, l) => {
  const r = Ub();
  for (const u in a) {
    const c = a[u];
    Ld(c, r, u, l);
  }
  return r;
}, Ld = (a, l, r, u) => {
  const c = a.length;
  for (let h = 0; h < c; h++) {
    const d = a[h];
    o3(d, l, r, u);
  }
}, o3 = (a, l, r, u) => {
  if (typeof a == "string") {
    u3(a, l, r);
    return;
  }
  if (typeof a == "function") {
    r3(a, l, r, u);
    return;
  }
  c3(a, l, r, u);
}, u3 = (a, l, r) => {
  const u = a === "" ? l : Lb(l, a);
  u.classGroupId = r;
}, r3 = (a, l, r, u) => {
  if (f3(a)) {
    Ld(a(u), l, r, u);
    return;
  }
  l.validators === null && (l.validators = []), l.validators.push(e3(r, a));
}, c3 = (a, l, r, u) => {
  const c = Object.entries(a), h = c.length;
  for (let d = 0; d < h; d++) {
    const [m, g] = c[d];
    Ld(g, Lb(l, m), r, u);
  }
}, Lb = (a, l) => {
  let r = a;
  const u = l.split(Cu), c = u.length;
  for (let h = 0; h < c; h++) {
    const d = u[h];
    let m = r.nextPart.get(d);
    m || (m = Ub(), r.nextPart.set(d, m)), r = m;
  }
  return r;
}, f3 = (a) => "isThemeGetter" in a && a.isThemeGetter === !0, d3 = (a) => {
  if (a < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let l = 0, r = /* @__PURE__ */ Object.create(null), u = /* @__PURE__ */ Object.create(null);
  const c = (h, d) => {
    r[h] = d, l++, l > a && (l = 0, u = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(h) {
      let d = r[h];
      if (d !== void 0)
        return d;
      if ((d = u[h]) !== void 0)
        return c(h, d), d;
    },
    set(h, d) {
      h in r ? r[h] = d : c(h, d);
    }
  };
}, od = "!", G0 = ":", h3 = [], Y0 = (a, l, r, u, c) => ({
  modifiers: a,
  hasImportantModifier: l,
  baseClassName: r,
  maybePostfixModifierPosition: u,
  isExternal: c
}), m3 = (a) => {
  const {
    prefix: l,
    experimentalParseClassName: r
  } = a;
  let u = (c) => {
    const h = [];
    let d = 0, m = 0, g = 0, b;
    const v = c.length;
    for (let U = 0; U < v; U++) {
      const N = c[U];
      if (d === 0 && m === 0) {
        if (N === G0) {
          h.push(c.slice(g, U)), g = U + 1;
          continue;
        }
        if (N === "/") {
          b = U;
          continue;
        }
      }
      N === "[" ? d++ : N === "]" ? d-- : N === "(" ? m++ : N === ")" && m--;
    }
    const p = h.length === 0 ? c : c.slice(g);
    let S = p, z = !1;
    p.endsWith(od) ? (S = p.slice(0, -1), z = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      p.startsWith(od) && (S = p.slice(1), z = !0)
    );
    const w = b && b > g ? b - g : void 0;
    return Y0(h, z, S, w);
  };
  if (l) {
    const c = l + G0, h = u;
    u = (d) => d.startsWith(c) ? h(d.slice(c.length)) : Y0(h3, !1, d, void 0, !0);
  }
  if (r) {
    const c = u;
    u = (h) => r({
      className: h,
      parseClassName: c
    });
  }
  return u;
}, p3 = (a) => {
  const l = /* @__PURE__ */ new Map();
  return a.orderSensitiveModifiers.forEach((r, u) => {
    l.set(r, 1e6 + u);
  }), (r) => {
    const u = [];
    let c = [];
    for (let h = 0; h < r.length; h++) {
      const d = r[h], m = d[0] === "[", g = l.has(d);
      m || g ? (c.length > 0 && (c.sort(), u.push(...c), c = []), u.push(d)) : c.push(d);
    }
    return c.length > 0 && (c.sort(), u.push(...c)), u;
  };
}, y3 = (a) => ({
  cache: d3(a.cacheSize),
  parseClassName: m3(a),
  sortModifiers: p3(a),
  postfixLookupClassGroupIds: g3(a),
  ...i3(a)
}), g3 = (a) => {
  const l = /* @__PURE__ */ Object.create(null), r = a.postfixLookupClassGroups;
  if (r)
    for (let u = 0; u < r.length; u++)
      l[r[u]] = !0;
  return l;
}, v3 = /\s+/, b3 = (a, l) => {
  const {
    parseClassName: r,
    getClassGroupId: u,
    getConflictingClassGroupIds: c,
    sortModifiers: h,
    postfixLookupClassGroupIds: d
  } = l, m = [], g = a.trim().split(v3);
  let b = "";
  for (let v = g.length - 1; v >= 0; v -= 1) {
    const p = g[v], {
      isExternal: S,
      modifiers: z,
      hasImportantModifier: w,
      baseClassName: U,
      maybePostfixModifierPosition: N
    } = r(p);
    if (S) {
      b = p + (b.length > 0 ? " " + b : b);
      continue;
    }
    let H = !!N, j;
    if (H) {
      const Z = U.substring(0, N);
      j = u(Z);
      const V = j && d[j] ? u(U) : void 0;
      V && V !== j && (j = V, H = !1);
    } else
      j = u(U);
    if (!j) {
      if (!H) {
        b = p + (b.length > 0 ? " " + b : b);
        continue;
      }
      if (j = u(U), !j) {
        b = p + (b.length > 0 ? " " + b : b);
        continue;
      }
      H = !1;
    }
    const Y = z.length === 0 ? "" : z.length === 1 ? z[0] : h(z).join(":"), X = w ? Y + od : Y, P = X + j;
    if (m.indexOf(P) > -1)
      continue;
    m.push(P);
    const st = c(j, H);
    for (let Z = 0; Z < st.length; ++Z) {
      const V = st[Z];
      m.push(X + V);
    }
    b = p + (b.length > 0 ? " " + b : b);
  }
  return b;
}, S3 = (...a) => {
  let l = 0, r, u, c = "";
  for (; l < a.length; )
    (r = a[l++]) && (u = Hb(r)) && (c && (c += " "), c += u);
  return c;
}, Hb = (a) => {
  if (typeof a == "string")
    return a;
  let l, r = "";
  for (let u = 0; u < a.length; u++)
    a[u] && (l = Hb(a[u])) && (r && (r += " "), r += l);
  return r;
}, T3 = (a, ...l) => {
  let r, u, c, h;
  const d = (g) => {
    const b = l.reduce((v, p) => p(v), a());
    return r = y3(b), u = r.cache.get, c = r.cache.set, h = m, m(g);
  }, m = (g) => {
    const b = u(g);
    if (b)
      return b;
    const v = b3(g, r);
    return c(g, v), v;
  };
  return h = d, (...g) => h(S3(...g));
}, E3 = [], ie = (a) => {
  const l = (r) => r[a] || E3;
  return l.isThemeGetter = !0, l.themeKey = a, l;
}, jb = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Gb = /^\((?:(\w[\w-]*):)?(.+)\)$/i, A3 = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, x3 = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, M3 = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, C3 = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix|color|light-dark)\(.+\)$/, D3 = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, z3 = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, Mi = (a) => A3.test(a), yt = (a) => !!a && !Number.isNaN(Number(a)), Cn = (a) => !!a && Number.isInteger(Number(a)), Bf = (a) => a.endsWith("%") && yt(a.slice(0, -1)), Kn = (a) => x3.test(a), Yb = () => !0, O3 = (a) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  M3.test(a) && !C3.test(a)
), Hd = () => !1, R3 = (a) => D3.test(a), w3 = (a) => z3.test(a), N3 = (a) => !F(a) && !I(a), V3 = (a) => a.startsWith("@container") && (a[10] === "/" && a[11] !== void 0 || a[11] === "s" && a[16] !== void 0 && a.startsWith("-size/", 10) || a[11] === "n" && a[18] !== void 0 && a.startsWith("-normal/", 10)), _3 = (a) => Ni(a, Qb, Hd), F = (a) => jb.test(a), ia = (a) => Ni(a, Zb, O3), q0 = (a) => Ni(a, q3, yt), U3 = (a) => Ni(a, kb, Yb), B3 = (a) => Ni(a, Kb, Hd), X0 = (a) => Ni(a, qb, Hd), L3 = (a) => Ni(a, Xb, w3), su = (a) => Ni(a, Jb, R3), I = (a) => Gb.test(a), os = (a) => ca(a, Zb), H3 = (a) => ca(a, Kb), Q0 = (a) => ca(a, qb), j3 = (a) => ca(a, Qb), G3 = (a) => ca(a, Xb), ou = (a) => ca(a, Jb, !0), Y3 = (a) => ca(a, kb, !0), Ni = (a, l, r) => {
  const u = jb.exec(a);
  return u ? u[1] ? l(u[1]) : r(u[2]) : !1;
}, ca = (a, l, r = !1) => {
  const u = Gb.exec(a);
  return u ? u[1] ? l(u[1]) : r : !1;
}, qb = (a) => a === "position" || a === "percentage", Xb = (a) => a === "image" || a === "url", Qb = (a) => a === "length" || a === "size" || a === "bg-size", Zb = (a) => a === "length", q3 = (a) => a === "number", Kb = (a) => a === "family-name", kb = (a) => a === "number" || a === "weight", Jb = (a) => a === "shadow", X3 = () => {
  const a = ie("color"), l = ie("font"), r = ie("text"), u = ie("font-weight"), c = ie("tracking"), h = ie("leading"), d = ie("breakpoint"), m = ie("container"), g = ie("spacing"), b = ie("radius"), v = ie("shadow"), p = ie("inset-shadow"), S = ie("text-shadow"), z = ie("drop-shadow"), w = ie("blur"), U = ie("perspective"), N = ie("aspect"), H = ie("ease"), j = ie("animate"), Y = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], X = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], P = () => [...X(), I, F], st = () => ["auto", "hidden", "clip", "visible", "scroll"], Z = () => ["auto", "contain", "none"], V = () => [I, F, g], dt = () => [Mi, "full", "auto", ...V()], nt = () => [Cn, "none", "subgrid", I, F], bt = () => ["auto", {
    span: ["full", Cn, I, F]
  }, Cn, I, F], Ct = () => [Cn, "auto", I, F], ee = () => ["auto", "min", "max", "fr", I, F], Xt = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], At = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], G = () => ["auto", ...V()], it = () => [Mi, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...V()], k = () => [m, Mi, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...V()], ft = () => [Mi, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...V()], q = () => [a, I, F], Kt = () => [...X(), Q0, X0, {
    position: [I, F]
  }], Me = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], dn = () => ["auto", "cover", "contain", j3, _3, {
    size: [I, F]
  }], A = () => [Bf, os, ia], L = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    b,
    I,
    F
  ], K = () => ["", yt, os, ia], et = () => ["solid", "dashed", "dotted", "double"], St = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], ot = () => [yt, Bf, Q0, X0], xt = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    w,
    I,
    F
  ], W = () => ["none", yt, I, F], ut = () => ["none", yt, I, F], Ve = () => [yt, I, F], Fn = () => [Mi, "full", ...V()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [Kn],
      breakpoint: [Kn],
      color: [Yb],
      container: [Kn],
      "drop-shadow": [Kn],
      ease: ["in", "out", "in-out"],
      font: [N3],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [Kn],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [Kn],
      shadow: [Kn],
      spacing: ["px", yt],
      text: [Kn],
      "text-shadow": [Kn],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", Mi, F, I, N]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Container Type
       * @see https://tailwindcss.com/docs/responsive-design#container-queries
       */
      "container-type": [{
        "@container": ["", "normal", "size", I, F]
      }],
      /**
       * Container Name
       * @see https://tailwindcss.com/docs/responsive-design#named-containers
       */
      "container-named": [V3],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [yt, "auto", F, I, m]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": Y()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": Y()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: P()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: st()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": st()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": st()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: Z()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": Z()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": Z()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Inset
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: dt()
      }],
      /**
       * Inset Inline
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": dt()
      }],
      /**
       * Inset Block
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": dt()
      }],
      /**
       * Inset Inline Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-s` in next major release
       */
      start: [{
        "inset-s": dt(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-s-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        start: dt()
      }],
      /**
       * Inset Inline End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       * @todo class group will be renamed to `inset-e` in next major release
       */
      end: [{
        "inset-e": dt(),
        /**
         * @deprecated since Tailwind CSS v4.2.0 in favor of `inset-e-*` utilities.
         * @see https://github.com/tailwindlabs/tailwindcss/pull/19613
         */
        end: dt()
      }],
      /**
       * Inset Block Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-bs": [{
        "inset-bs": dt()
      }],
      /**
       * Inset Block End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-be": [{
        "inset-be": dt()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: dt()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: dt()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: dt()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: dt()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [Cn, "auto", I, F]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [Mi, "full", "auto", m, ...V()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [yt, Mi, "auto", "initial", "none", F]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", yt, I, F]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", yt, I, F]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [Cn, "first", "last", "none", I, F]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": nt()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: bt()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": Ct()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": Ct()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": nt()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: bt()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": Ct()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": Ct()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ee()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ee()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: V()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": V()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": V()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...Xt(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...At(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...At()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...Xt()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...At(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...At(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": Xt()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...At(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...At()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: V()
      }],
      /**
       * Padding Inline
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: V()
      }],
      /**
       * Padding Block
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: V()
      }],
      /**
       * Padding Inline Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: V()
      }],
      /**
       * Padding Inline End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: V()
      }],
      /**
       * Padding Block Start
       * @see https://tailwindcss.com/docs/padding
       */
      pbs: [{
        pbs: V()
      }],
      /**
       * Padding Block End
       * @see https://tailwindcss.com/docs/padding
       */
      pbe: [{
        pbe: V()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: V()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: V()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: V()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: V()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: G()
      }],
      /**
       * Margin Inline
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: G()
      }],
      /**
       * Margin Block
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: G()
      }],
      /**
       * Margin Inline Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: G()
      }],
      /**
       * Margin Inline End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: G()
      }],
      /**
       * Margin Block Start
       * @see https://tailwindcss.com/docs/margin
       */
      mbs: [{
        mbs: G()
      }],
      /**
       * Margin Block End
       * @see https://tailwindcss.com/docs/margin
       */
      mbe: [{
        mbe: G()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: G()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: G()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: G()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: G()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": V()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": V()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: it()
      }],
      /**
       * Inline Size
       * @see https://tailwindcss.com/docs/inline-size
       */
      "inline-size": [{
        inline: ["auto", ...k()]
      }],
      /**
       * Min-Inline Size
       * @see https://tailwindcss.com/docs/min-inline-size
       */
      "min-inline-size": [{
        "min-inline": ["auto", ...k()]
      }],
      /**
       * Max-Inline Size
       * @see https://tailwindcss.com/docs/max-inline-size
       */
      "max-inline-size": [{
        "max-inline": ["none", ...k()]
      }],
      /**
       * Block Size
       * @see https://tailwindcss.com/docs/block-size
       */
      "block-size": [{
        block: ["auto", ...ft()]
      }],
      /**
       * Min-Block Size
       * @see https://tailwindcss.com/docs/min-block-size
       */
      "min-block-size": [{
        "min-block": ["auto", ...ft()]
      }],
      /**
       * Max-Block Size
       * @see https://tailwindcss.com/docs/max-block-size
       */
      "max-block-size": [{
        "max-block": ["none", ...ft()]
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [m, "screen", ...it()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          m,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...it()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          m,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [d]
          },
          ...it()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...it()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...it()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", "none", ...it()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", r, os, ia]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [u, Y3, U3]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", Bf, F]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [H3, B3, l]
      }],
      /**
       * Font Feature Settings
       * @see https://tailwindcss.com/docs/font-feature-settings
       */
      "font-features": [{
        "font-features": [F]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [c, I, F]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [yt, "none", I, q0]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          h,
          ...V()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", I, F]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", I, F]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: q()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: q()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...et(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [yt, "from-font", "auto", I, ia]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: q()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [yt, "auto", I, F]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: V()
      }],
      /**
       * Tab Size
       * @see https://tailwindcss.com/docs/tab-size
       */
      "tab-size": [{
        tab: [Cn, I, F]
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", I, F]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", I, F]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: Kt()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: Me()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: dn()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, Cn, I, F],
          radial: ["", I, F],
          conic: ["", Cn, I, F]
        }, G3, L3]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: q()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: A()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: A()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: A()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: q()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: q()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: q()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: L()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": L()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": L()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": L()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": L()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": L()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": L()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": L()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": L()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": L()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": L()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": L()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": L()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": L()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": L()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: K()
      }],
      /**
       * Border Width Inline
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": K()
      }],
      /**
       * Border Width Block
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": K()
      }],
      /**
       * Border Width Inline Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": K()
      }],
      /**
       * Border Width Inline End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": K()
      }],
      /**
       * Border Width Block Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-bs": [{
        "border-bs": K()
      }],
      /**
       * Border Width Block End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-be": [{
        "border-be": K()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": K()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": K()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": K()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": K()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": K()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": K()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...et(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...et(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: q()
      }],
      /**
       * Border Color Inline
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": q()
      }],
      /**
       * Border Color Block
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": q()
      }],
      /**
       * Border Color Inline Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": q()
      }],
      /**
       * Border Color Inline End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": q()
      }],
      /**
       * Border Color Block Start
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-bs": [{
        "border-bs": q()
      }],
      /**
       * Border Color Block End
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-be": [{
        "border-be": q()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": q()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": q()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": q()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": q()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: q()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...et(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [yt, I, F]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", yt, os, ia]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: q()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          // Deprecated since Tailwind CSS v4.0.0
          "inner",
          "none",
          v,
          ou,
          su
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: q()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", p, ou, su]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": q()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: K()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: q()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [yt, ia]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": q()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": K()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": q()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", S, ou, su]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": q()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [yt, I, F]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...St(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": St()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [yt]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": ot()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": ot()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": q()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": q()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": ot()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": ot()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": q()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": q()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": ot()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": ot()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": q()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": q()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": ot()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": ot()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": q()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": q()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": ot()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": ot()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": q()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": q()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": ot()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": ot()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": q()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": q()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": ot()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": ot()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": q()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": q()
      }],
      "mask-image-radial": [{
        "mask-radial": [I, F]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": ot()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": ot()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": q()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": q()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": X()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [yt]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": ot()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": ot()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": q()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": q()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: Kt()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: Me()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: dn()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", I, F]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          I,
          F
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: xt()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [yt, I, F]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [yt, I, F]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          z,
          ou,
          su
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": q()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", yt, I, F]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [yt, I, F]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", yt, I, F]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [yt, I, F]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", yt, I, F]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          I,
          F
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": xt()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [yt, I, F]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [yt, I, F]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", yt, I, F]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [yt, I, F]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", yt, I, F]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [yt, I, F]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [yt, I, F]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", yt, I, F]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": V()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": V()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": V()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", I, F]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [yt, "initial", I, F]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", H, I, F]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [yt, I, F]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", j, I, F]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [U, I, F]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": P()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: W()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": W()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": W()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": W()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: ut()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": ut()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": ut()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": ut()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: Ve()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": Ve()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": Ve()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [I, F, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: P()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: Fn()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": Fn()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": Fn()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": Fn()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      /**
       * Zoom
       * @see https://tailwindcss.com/docs/zoom
       */
      zoom: [{
        zoom: [Cn, I, F]
      }],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: q()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: q()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", I, F]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scrollbar Thumb Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-thumb-color": [{
        "scrollbar-thumb": q()
      }],
      /**
       * Scrollbar Track Color
       * @see https://tailwindcss.com/docs/scrollbar-color
       */
      "scrollbar-track-color": [{
        "scrollbar-track": q()
      }],
      /**
       * Scrollbar Gutter
       * @see https://tailwindcss.com/docs/scrollbar-gutter
       */
      "scrollbar-gutter": [{
        "scrollbar-gutter": ["auto", "stable", "both"]
      }],
      /**
       * Scrollbar Width
       * @see https://tailwindcss.com/docs/scrollbar-width
       */
      "scrollbar-w": [{
        scrollbar: ["auto", "thin", "none"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": V()
      }],
      /**
       * Scroll Margin Inline
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": V()
      }],
      /**
       * Scroll Margin Block
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": V()
      }],
      /**
       * Scroll Margin Inline Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": V()
      }],
      /**
       * Scroll Margin Inline End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": V()
      }],
      /**
       * Scroll Margin Block Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbs": [{
        "scroll-mbs": V()
      }],
      /**
       * Scroll Margin Block End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mbe": [{
        "scroll-mbe": V()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": V()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": V()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": V()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": V()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": V()
      }],
      /**
       * Scroll Padding Inline
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": V()
      }],
      /**
       * Scroll Padding Block
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": V()
      }],
      /**
       * Scroll Padding Inline Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": V()
      }],
      /**
       * Scroll Padding Inline End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": V()
      }],
      /**
       * Scroll Padding Block Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbs": [{
        "scroll-pbs": V()
      }],
      /**
       * Scroll Padding Block End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pbe": [{
        "scroll-pbe": V()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": V()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": V()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": V()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": V()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", I, F]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...q()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [yt, os, ia, q0]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...q()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      "container-named": ["container-type"],
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "inset-bs", "inset-be", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["start", "end", "right", "left"],
      "inset-y": ["inset-bs", "inset-be", "top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
      px: ["ps", "pe", "pr", "pl"],
      py: ["pbs", "pbe", "pt", "pb"],
      m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
      mx: ["ms", "me", "mr", "ml"],
      my: ["mbs", "mbe", "mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-bs", "border-w-be", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-s", "border-w-e", "border-w-r", "border-w-l"],
      "border-w-y": ["border-w-bs", "border-w-be", "border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-bs", "border-color-be", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-s", "border-color-e", "border-color-r", "border-color-l"],
      "border-color-y": ["border-color-bs", "border-color-be", "border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-ms", "scroll-me", "scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mbs", "scroll-mbe", "scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-ps", "scroll-pe", "scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pbs", "scroll-pbe", "scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    postfixLookupClassGroups: ["container-type"],
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, Q3 = /* @__PURE__ */ T3(X3);
function Z3(...a) {
  return Q3($M(a));
}
const K3 = ({
  rotateDepth: a = 17.5,
  translateDepth: l = 20,
  className: r,
  children: u
}) => {
  const c = lt.useRef(null), h = WM(), d = Mu(0), m = Mu(0), g = L0(d), b = L0(m), v = h ? 0 : a, p = h ? 0 : l, S = Di(
    b,
    [-0.5, 0.5],
    [`-${v}deg`, `${v}deg`]
  ), z = Di(
    g,
    [-0.5, 0.5],
    [`${v}deg`, `-${v}deg`]
  ), w = Di(
    g,
    [-0.5, 0.5],
    [`-${p}px`, `${p}px`]
  ), U = Di(
    b,
    [-0.5, 0.5],
    [`${p}px`, `-${p}px`]
  ), N = Di(g, [-0.5, 0.5], [0, 100]), H = Di(b, [-0.5, 0.5], [0, 100]), j = JM`radial-gradient(circle at ${N}% ${H}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`, Y = (P) => {
    if (!c.current || h || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const st = c.current.getBoundingClientRect();
    !st.width || !st.height || (d.set(Math.max(-0.5, Math.min(0.5, (P.clientX - st.left) / st.width - 0.5))), m.set(Math.max(-0.5, Math.min(0.5, (P.clientY - st.top) / st.height - 0.5))));
  }, X = () => {
    d.set(0), m.set(0);
  };
  return /* @__PURE__ */ Jt.jsx("div", { className: Z3("perspective-distant transform-3d", r), children: /* @__PURE__ */ Jt.jsxs(
    H0.div,
    {
      ref: c,
      onMouseMove: Y,
      onMouseLeave: X,
      style: {
        rotateX: S,
        rotateY: z,
        translateX: w,
        translateY: U,
        boxShadow: "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px"
      },
      initial: { scale: 1, z: 0 },
      whileHover: h ? void 0 : {
        scale: 1.05,
        z: 50,
        transition: { duration: 0.2 }
      },
      className: "relative rounded-2xl",
      children: [
        u,
        /* @__PURE__ */ Jt.jsx(
          H0.div,
          {
            "aria-hidden": "true",
            className: "pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[16px] mix-blend-overlay",
            style: { background: j, opacity: h ? 0 : 0.6 },
            transition: { duration: 0.2 }
          }
        )
      ]
    }
  ) });
};
function k3() {
  return /* @__PURE__ */ Jt.jsx(K3, { className: "zh-comet w-full max-w-80", children: /* @__PURE__ */ Jt.jsxs(
    "a",
    {
      href: "#work",
      className: "zh-comet-link flex w-full cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-3",
      "aria-label": "浏览韩子和的作品",
      style: { transformStyle: "preserve-3d" },
      children: [
        /* @__PURE__ */ Jt.jsxs("div", { className: "relative aspect-[3/4] w-full overflow-hidden rounded-[12px] bg-black", children: [
          /* @__PURE__ */ Jt.jsx(
            "img",
            {
              loading: "lazy",
              className: "absolute inset-0 h-full w-full object-cover",
              src: "assets/zh-anime.png",
              alt: "韩子和的动漫形象",
              width: 941,
              height: 1672
            }
          ),
          /* @__PURE__ */ Jt.jsx("span", { className: "zh-comet-image-shade", "aria-hidden": "true" }),
          /* @__PURE__ */ Jt.jsx("span", { className: "zh-comet-badge", "aria-hidden": "true", children: "ZH" })
        ] }),
        /* @__PURE__ */ Jt.jsxs("div", { className: "mt-2 flex items-center justify-between gap-2 p-3 font-mono text-white", children: [
          /* @__PURE__ */ Jt.jsx("span", { className: "text-xs tracking-wider", children: "ZH / PERSONAL SPACE" }),
          /* @__PURE__ */ Jt.jsx("span", { className: "text-xs text-gray-300 opacity-60", "aria-hidden": "true", children: "↗" })
        ] })
      ]
    }
  ) });
}
const J3 = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";
function F3() {
  const a = lt.useRef(null);
  return lt.useEffect(() => {
    const l = a.current;
    if (!l) return;
    const r = document.getElementById("portfolio-background");
    if (!r) return;
    const u = matchMedia("(prefers-reduced-motion: reduce)");
    let c = !1, h = 0, d, m = !1, g = !1;
    const b = (N) => {
      cancelAnimationFrame(h);
      const H = Number(l.style.opacity) || 0, j = performance.now(), Y = (X) => {
        const P = Math.min(1, (X - j) / 500);
        l.style.opacity = String(H + (N - H) * P), P < 1 && !g && (h = requestAnimationFrame(Y));
      };
      h = requestAnimationFrame(Y);
    }, v = () => {
      if (!c || document.hidden || u.matches || document.body.classList.contains("ocean-still")) {
        l.pause(), u.matches && l.readyState >= 2 && (l.style.opacity = "1");
        return;
      }
      l.play().then(() => {
        !g && !m && b(1);
      }).catch(() => {
      });
    }, p = () => {
      r.dataset.ready = "true", v();
    }, S = () => {
      Number.isFinite(l.duration) && l.duration - l.currentTime <= 0.55 && !m && !u.matches && (m = !0, b(0));
    }, z = () => {
      l.style.opacity = "0", d = setTimeout(() => {
        g || (l.currentTime = 0, m = !1, v());
      }, 100);
    }, w = () => {
      r.dataset.ready = "false";
    }, U = new IntersectionObserver(([N]) => {
      c = N.isIntersecting && N.intersectionRatio > 1e-3, c && !l.getAttribute("src") && (l.src = J3, l.load()), v();
    }, { threshold: [0, 2e-3] });
    return U.observe(r), l.addEventListener("canplay", p), l.addEventListener("timeupdate", S), l.addEventListener("ended", z), l.addEventListener("error", w), document.addEventListener("visibilitychange", v), document.addEventListener("pointerdown", v), document.addEventListener("keydown", v), window.addEventListener("portfolio-motion-change", v), u.addEventListener("change", v), () => {
      g = !0, cancelAnimationFrame(h), clearTimeout(d), U.disconnect(), l.pause(), l.removeEventListener("canplay", p), l.removeEventListener("timeupdate", S), l.removeEventListener("ended", z), l.removeEventListener("error", w), document.removeEventListener("visibilitychange", v), document.removeEventListener("pointerdown", v), document.removeEventListener("keydown", v), window.removeEventListener("portfolio-motion-change", v), u.removeEventListener("change", v);
    };
  }, []), /* @__PURE__ */ Jt.jsxs(Jt.Fragment, { children: [
    /* @__PURE__ */ Jt.jsx("video", { ref: a, className: "liquid-background-video", "data-decorative": "", muted: !0, playsInline: !0, preload: "none", tabIndex: -1, style: { opacity: 0 } }),
    /* @__PURE__ */ Jt.jsx("div", { className: "liquid-background-shade" })
  ] });
}
const Z0 = document.getElementById("comet-profile");
Z0 && J0.createRoot(Z0).render(/* @__PURE__ */ Jt.jsx(k3, {}));
const K0 = document.getElementById("portfolio-background");
K0 && J0.createRoot(K0).render(/* @__PURE__ */ Jt.jsx(F3, {}));
