'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactNative$1 = require('react-native');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var has = Object.prototype.hasOwnProperty;

function find(iter, tar, key) {
	for (key of iter.keys()) {
		if (dequal(key, tar)) return key;
	}
}

function dequal(foo, bar) {
	var ctor, len, tmp;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (ctor === Set) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len;
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!bar.has(tmp)) return false;
			}
			return true;
		}

		if (ctor === Map) {
			if (foo.size !== bar.size) {
				return false;
			}
			for (len of foo) {
				tmp = len[0];
				if (tmp && typeof tmp === 'object') {
					tmp = find(bar, tmp);
					if (!tmp) return false;
				}
				if (!dequal(len[1], bar.get(tmp))) {
					return false;
				}
			}
			return true;
		}

		if (ctor === ArrayBuffer) {
			foo = new Uint8Array(foo);
			bar = new Uint8Array(bar);
		} else if (ctor === DataView) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo.getInt8(len) === bar.getInt8(len));
			}
			return len === -1;
		}

		if (ArrayBuffer.isView(foo)) {
			if ((len=foo.byteLength) === bar.byteLength) {
				while (len-- && foo[len] === bar[len]);
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}

// context setup
var ChannelsContext = React__default["default"].createContext({});
var __ChannelsContext = ChannelsContext;
/**
 * Provider that creates your channels instances and provides it to child hooks throughout your app.
 */
var ChannelsProvider = function (_a) {
    var children = _a.children;
    var client = usePusher().client;
    var connectedChannels = React.useRef({});
    var subscribe = React.useCallback(function (channelName) {
        /** Return early if there's no client */
        if (!client || !channelName)
            return;
        /** Subscribe to channel and set it in state */
        var pusherChannel = client.subscribe(channelName);
        connectedChannels.current[channelName] = __spreadArrays((connectedChannels.current[channelName] || []), [
            pusherChannel,
        ]);
        return pusherChannel;
    }, [client, connectedChannels]);
    var unsubscribe = React.useCallback(function (channelName) {
        /** Return early if there's no props */
        if (!client ||
            !channelName ||
            !(channelName in connectedChannels.current))
            return;
        /** If just one connection, unsubscribe totally*/
        if (connectedChannels.current[channelName].length === 1) {
            client.unsubscribe(channelName);
            delete connectedChannels.current[channelName];
        }
        else {
            connectedChannels.current[channelName].pop();
        }
    }, [connectedChannels, client]);
    var getChannel = React.useCallback(function (channelName) {
        /** Return early if there's no client */
        if (!client ||
            !channelName ||
            !(channelName in connectedChannels.current))
            return;
        /** Return channel */
        return connectedChannels.current[channelName][0];
    }, [connectedChannels, client]);
    return (React__default["default"].createElement(ChannelsContext.Provider, { value: {
            unsubscribe: unsubscribe,
            subscribe: subscribe,
            getChannel: getChannel,
        } }, children));
};

// context setup
var PusherContext = React__default["default"].createContext({});
var __PusherContext = PusherContext;
/**
 * Provider that creates your pusher instance and provides it to child hooks throughout your app.
 * Note, you can pass in value={{}} as a prop if you'd like to override the pusher client passed.
 * This is handy when simulating pusher locally, or for testing.
 * @param props Config for Pusher client
 */
var CorePusherProvider = function (_a) {
    var clientKey = _a.clientKey, cluster = _a.cluster, triggerEndpoint = _a.triggerEndpoint, _b = _a.defer, defer = _b === void 0 ? false : _b, children = _a.children, _PusherRuntime = _a._PusherRuntime, props = __rest(_a, ["clientKey", "cluster", "triggerEndpoint", "defer", "children", "_PusherRuntime"]);
    // errors when required props are not passed.
    React.useEffect(function () {
        if (!clientKey)
            console.error("A client key is required for pusher");
        if (!cluster)
            console.error("A cluster is required for pusher");
    }, [clientKey, cluster]);
    var config = React.useMemo(function () { return (__assign({ cluster: cluster }, props)); }, [cluster, props]);
    // track config for comparison
    var previousConfig = React.useRef(props);
    React.useEffect(function () {
        previousConfig.current = props;
    });
    var _c = React.useState(), client = _c[0], setClient = _c[1];
    React.useEffect(function () {
        // Skip creation of client if deferring, a value prop is passed, or config props are the same.
        if (!_PusherRuntime ||
            defer ||
            !clientKey ||
            props.value ||
            (dequal(previousConfig.current, props) && client !== undefined)) {
            return;
        }
        setClient(new _PusherRuntime(clientKey, config));
    }, [client, clientKey, props, defer, _PusherRuntime, config]);
    return (React__default["default"].createElement(PusherContext.Provider, __assign({ value: {
            client: client,
            triggerEndpoint: triggerEndpoint,
        } }, props),
        React__default["default"].createElement(ChannelsProvider, null, children)));
};

/**
 * Provides access to the pusher client instance.
 *
 * @returns a `MutableRefObject<Pusher|undefined>`. The instance is held by a `useRef()` hook.
 * @example
 * ```javascript
 * const { client } = usePusher();
 * client.current.subscribe('my-channel');
 * ```
 */
function usePusher() {
    var context = React.useContext(__PusherContext);
    React.useEffect(function () {
        if (!Object.keys(context).length)
            console.warn(NOT_IN_CONTEXT_WARNING$1);
    }, [context]);
    return context;
}
var NOT_IN_CONTEXT_WARNING$1 = "No Pusher context. Did you forget to wrap your app in a <PusherProvider />?";

/**
 * Provides access to the channels global provider.
 */
function useChannels() {
    var context = React.useContext(__ChannelsContext);
    React.useEffect(function () {
        if (!context || !Object.keys(context).length)
            console.warn(NOT_IN_CONTEXT_WARNING);
    }, [context]);
    return context;
}
var NOT_IN_CONTEXT_WARNING = "No Channels context. Did you forget to wrap your app in a <ChannelsProvider />?";

/**
 * Subscribe to a channel
 *
 * @param channelName The name of the channel you want to subscribe to.
 * @typeparam Type of channel you're subscribing to. Can be one of `Channel` or `PresenceChannel` from `pusher-js`.
 * @returns Instance of the channel you just subscribed to.
 *
 * @example
 * ```javascript
 * const channel = useChannel("my-channel")
 * channel.bind('some-event', () => {})
 * ```
 */
function useChannel(channelName) {
    var _a = React.useState(), channel = _a[0], setChannel = _a[1];
    var _b = useChannels(), subscribe = _b.subscribe, unsubscribe = _b.unsubscribe;
    React.useEffect(function () {
        if (!channelName || !subscribe || !unsubscribe)
            return;
        var _channel = subscribe(channelName);
        setChannel(_channel);
        return function () { return unsubscribe(channelName); };
    }, [channelName, subscribe, unsubscribe]);
    /** Return the channel for use. */
    return channel;
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

/** Presence channel reducer to keep track of state */
var SET_STATE = "set-state";
var ADD_MEMBER = "add-member";
var REMOVE_MEMBER = "remove-member";
var presenceChannelReducer = function (state, _a) {
    var _b;
    var type = _a.type, payload = _a.payload;
    switch (type) {
        /** Generic setState */
        case SET_STATE:
            return __assign(__assign({}, state), payload);
        /** Member added */
        case ADD_MEMBER:
            var _c = payload, addedMemberId = _c.id, info = _c.info;
            return __assign(__assign({}, state), { count: state.count + 1, members: __assign(__assign({}, state.members), (_b = {}, _b[addedMemberId] = info, _b)) });
        /** Member removed */
        case REMOVE_MEMBER:
            var removedMemberId = payload.id;
            var members = __assign({}, state.members);
            delete members[removedMemberId];
            return __assign(__assign({}, state), { count: state.count - 1, members: __assign({}, members) });
    }
};
function usePresenceChannel(channelName) {
    // errors for missing arguments
    if (channelName) {
        invariant_1(channelName.includes("presence-"), "Presence channels should use prefix 'presence-' in their name. Use the useChannel hook instead.");
    }
    /** Store internal channel state */
    var _a = React.useReducer(presenceChannelReducer, {
        members: {},
        me: undefined,
        myID: undefined,
        count: 0,
    }), state = _a[0], dispatch = _a[1];
    // bind and unbind member events events on our channel
    var channel = useChannel(channelName);
    React.useEffect(function () {
        if (channel) {
            // Get membership info on successful subscription
            var handleSubscriptionSuccess_1 = function (members) {
                dispatch({
                    type: SET_STATE,
                    payload: {
                        members: members.members,
                        myID: members.myID,
                        me: members.me,
                        count: Object.keys(members.members).length,
                    },
                });
            };
            // Add member to the members object
            var handleAdd_1 = function (member) {
                dispatch({
                    type: ADD_MEMBER,
                    payload: member,
                });
            };
            // Remove member from the members object
            var handleRemove_1 = function (member) {
                dispatch({
                    type: REMOVE_MEMBER,
                    payload: member,
                });
            };
            // bind to all member addition/removal events
            channel.bind("pusher:subscription_succeeded", handleSubscriptionSuccess_1);
            channel.bind("pusher:member_added", handleAdd_1);
            channel.bind("pusher:member_removed", handleRemove_1);
            // cleanup
            return function () {
                channel.unbind("pusher:subscription_succeeded", handleSubscriptionSuccess_1);
                channel.unbind("pusher:member_added", handleAdd_1);
                channel.unbind("pusher:member_removed", handleRemove_1);
            };
        }
        // to make typescript happy.
        return function () { };
    }, [channel]);
    return __assign({ channel: channel }, state);
}

/**
 * Subscribes to a channel event and registers a callback.
 * @param channel Pusher channel to bind to
 * @param eventName Name of event to bind to
 * @param callback Callback to call on a new event
 */
function useEvent(channel, eventName, callback) {
    // error when required arguments aren't passed.
    invariant_1(eventName, "Must supply eventName and callback to onEvent");
    invariant_1(callback, "Must supply callback to onEvent");
    // bind and unbind events whenever the channel, eventName or callback changes.
    React.useEffect(function () {
        if (channel === undefined) {
            return;
        }
        else
            channel.bind(eventName, callback);
        return function () {
            channel.unbind(eventName, callback);
        };
    }, [channel, eventName, callback]);
}

/**
 *
 * @param channel the channel you'd like to trigger clientEvents on. Get this from [[useChannel]] or [[usePresenceChannel]].
 * @typeparam TData shape of the data you're sending with the event.
 * @returns A memoized trigger function that will perform client events on the channel.
 * @example
 * ```javascript
 * const channel = useChannel('my-channel');
 * const trigger = useClientTrigger(channel)
 *
 * const handleClick = () => trigger('some-client-event', {});
 * ```
 */
function useClientTrigger(channel) {
    channel &&
        invariant_1(channel.name.match(/(private-|presence-)/gi), "Channel provided to useClientTrigger wasn't private or presence channel. Client events only work on these types of channels.");
    // memoize trigger so it's not being created every render
    var trigger = React.useCallback(function (eventName, data) {
        invariant_1(eventName, "Must pass event name to trigger a client event.");
        channel && channel.trigger(eventName, data);
    }, [channel]);
    return trigger;
}

/**
 * Hook to provide a trigger function that calls the server defined in `PusherProviderProps.triggerEndpoint` using `fetch`.
 * Any `auth?.headers` in the config object will be passed with the `fetch` call.
 *
 * @param channelName name of channel to call trigger on
 * @typeparam TData shape of the data you're sending with the event
 *
 * @example
 * ```typescript
 * const trigger = useTrigger<{message: string}>('my-channel');
 * trigger('my-event', {message: 'hello'});
 * ```
 */
function useTrigger(channelName) {
    var _a = usePusher(), client = _a.client, triggerEndpoint = _a.triggerEndpoint;
    // you can't use this if you haven't supplied a triggerEndpoint.
    invariant_1(triggerEndpoint, "No trigger endpoint specified to <PusherProvider />. Cannot trigger an event.");
    // subscribe to the channel we'll be triggering to.
    useChannel(channelName);
    // memoized trigger function to return
    var trigger = React.useCallback(function (eventName, data) {
        var _a;
        var fetchOptions = {
            method: "POST",
            body: JSON.stringify({ channelName: channelName, eventName: eventName, data: data }),
        };
        // @ts-expect-error deprecated since 7.1.0, but still supported for backwards compatibility
        // now it should use channelAuthorization instead
        if (client && ((_a = client.config) === null || _a === void 0 ? void 0 : _a.auth)) {
            // @ts-expect-error deprecated
            fetchOptions.headers = client.config.auth.headers;
        }
        else {
            console.warn(NO_AUTH_HEADERS_WARNING);
        }
        return fetch(triggerEndpoint, fetchOptions);
    }, [client, triggerEndpoint, channelName]);
    return trigger;
}
var NO_AUTH_HEADERS_WARNING = "No auth parameters supplied to <PusherProvider />. Your events will be unauthenticated.";

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var arrayWithHoles = createCommonjsModule(function (module) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayWithHoles);

var iterableToArrayLimit = createCommonjsModule(function (module) {
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(iterableToArrayLimit);

var arrayLikeToArray = createCommonjsModule(function (module) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(arrayLikeToArray);

var unsupportedIterableToArray = createCommonjsModule(function (module) {
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(unsupportedIterableToArray);

var nonIterableRest = createCommonjsModule(function (module) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(nonIterableRest);

var slicedToArray = createCommonjsModule(function (module) {
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _slicedToArray = unwrapExports(slicedToArray);

var defineProperty = createCommonjsModule(function (module) {
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

unwrapExports(defineProperty);

var objectSpread = createCommonjsModule(function (module) {
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys.push.apply(ownKeys, Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function (key) {
      defineProperty(target, key, source[key]);
    });
  }
  return target;
}
module.exports = _objectSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _objectSpread = unwrapExports(objectSpread);

var DEFAULT_CONFIGURATION = {reachabilityUrl:'https://clients3.google.com/generate_204',reachabilityTest:function reachabilityTest(response){return Promise.resolve(response.status===204);},reachabilityShortTimeout:5*1000,reachabilityLongTimeout:60*1000,reachabilityRequestTimeout:15*1000};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;
var undefined$1; // More compressible than void 0.
var $Symbol = typeof Symbol === "function" ? Symbol : {};
var iteratorSymbol = $Symbol.iterator || "@@iterator";
var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

function wrap(innerFn, outerFn, self, tryLocsList) {
  // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
  var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
  var generator = Object.create(protoGenerator.prototype);
  var context = new Context(tryLocsList || []);

  // The ._invoke method unifies the implementations of the .next,
  // .throw, and .return methods.
  generator._invoke = makeInvokeMethod(innerFn, self, context);

  return generator;
}

// Try/catch helper to minimize deoptimizations. Returns a completion
// record like context.tryEntries[i].completion. This interface could
// have been (and was previously) designed to take a closure to be
// invoked without arguments, but in all the cases we care about we
// already have an existing method we want to call, so there's no need
// to create a new function object. We can even get away with assuming
// the method takes exactly one argument, since that happens to be true
// in every case, so we don't have to touch the arguments object. The
// only additional allocation required is the completion record, which
// has a stable shape and so hopefully should be cheap to allocate.
function tryCatch(fn, obj, arg) {
  try {
    return { type: "normal", arg: fn.call(obj, arg) };
  } catch (err) {
    return { type: "throw", arg: err };
  }
}

var GenStateSuspendedStart = "suspendedStart";
var GenStateSuspendedYield = "suspendedYield";
var GenStateExecuting = "executing";
var GenStateCompleted = "completed";

// Returning this object from the innerFn has the same effect as
// breaking out of the dispatch switch statement.
var ContinueSentinel = {};

// Dummy constructor functions that we use as the .constructor and
// .constructor.prototype properties for functions that return Generator
// objects. For full spec compliance, you may wish to configure your
// minifier not to mangle the names of these two functions.
function Generator() {}
function GeneratorFunction() {}
function GeneratorFunctionPrototype() {}

// This is a polyfill for %IteratorPrototype% for environments that
// don't natively support it.
var IteratorPrototype = {};
IteratorPrototype[iteratorSymbol] = function () {
  return this;
};

var getProto = Object.getPrototypeOf;
var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
if (NativeIteratorPrototype &&
  NativeIteratorPrototype !== Op &&
  hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
  // This environment has a native %IteratorPrototype%; use it instead
  // of the polyfill.
  IteratorPrototype = NativeIteratorPrototype;
}

var Gp = GeneratorFunctionPrototype.prototype =
  Generator.prototype = Object.create(IteratorPrototype);
GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
GeneratorFunctionPrototype.constructor = GeneratorFunction;
GeneratorFunctionPrototype[toStringTagSymbol] =
  GeneratorFunction.displayName = "GeneratorFunction";

// Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.
function defineIteratorMethods(prototype) {
  ["next", "throw", "return"].forEach(function(method) {
    prototype[method] = function(arg) {
      return this._invoke(method, arg);
    };
  });
}

function isGeneratorFunction (genFun) {
  var ctor = typeof genFun === "function" && genFun.constructor;
  return ctor
    ? ctor === GeneratorFunction ||
    // For the native GeneratorFunction constructor, the best we can
    // do is to check its .name property.
    (ctor.displayName || ctor.name) === "GeneratorFunction"
    : false;
}
function mark (genFun) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
  } else {
    genFun.__proto__ = GeneratorFunctionPrototype;
    if (!(toStringTagSymbol in genFun)) {
      genFun[toStringTagSymbol] = "GeneratorFunction";
    }
  }
  genFun.prototype = Object.create(Gp);
  return genFun;
}
// Within the body of any async function, `await x` is transformed to
// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
// `hasOwn.call(value, "__await")` to determine if the yielded value is
// meant to be awaited.
function awrap (arg) {
  return { __await: arg };
}
function AsyncIterator(generator, PromiseImpl) {
  function invoke(method, arg, resolve, reject) {
    var record = tryCatch(generator[method], generator, arg);
    if (record.type === "throw") {
      reject(record.arg);
    } else {
      var result = record.arg;
      var value = result.value;
      if (value &&
        typeof value === "object" &&
        hasOwn.call(value, "__await")) {
        return PromiseImpl.resolve(value.__await).then(function(value) {
          invoke("next", value, resolve, reject);
        }, function(err) {
          invoke("throw", err, resolve, reject);
        });
      }

      return PromiseImpl.resolve(value).then(function(unwrapped) {
        // When a yielded Promise is resolved, its final value becomes
        // the .value of the Promise<{value,done}> result for the
        // current iteration.
        result.value = unwrapped;
        resolve(result);
      }, function(error) {
        // If a rejected Promise was yielded, throw the rejection back
        // into the async generator function so it can be handled there.
        return invoke("throw", error, resolve, reject);
      });
    }
  }

  var previousPromise;

  function enqueue(method, arg) {
    function callInvokeWithMethodAndArg() {
      return new PromiseImpl(function(resolve, reject) {
        invoke(method, arg, resolve, reject);
      });
    }

    return previousPromise =
      // If enqueue has been called before, then we want to wait until
      // all previous Promises have been resolved before calling invoke,
      // so that results are always delivered in the correct order. If
      // enqueue has not been called before, then it is important to
      // call invoke immediately, without waiting on a callback to fire,
      // so that the async generator function has the opportunity to do
      // any necessary setup in a predictable way. This predictability
      // is why the Promise constructor synchronously invokes its
      // executor callback, and why async functions synchronously
      // execute code before the first await. Since we implement simple
      // async functions in terms of async generators, it is especially
      // important to get this right, even though it requires care.
      previousPromise ? previousPromise.then(
        callInvokeWithMethodAndArg,
        // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg
      ) : callInvokeWithMethodAndArg();
  }

  // Define the unified helper method that is used to implement .next,
  // .throw, and .return (see defineIteratorMethods).
  this._invoke = enqueue;
}

defineIteratorMethods(AsyncIterator.prototype);
AsyncIterator.prototype[asyncIteratorSymbol] = function () {
  return this;
};

// Note that simple async functions are implemented on top of
// AsyncIterator objects; they just return a Promise for the value of
// the final result produced by the iterator.
 function async (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
  if (PromiseImpl === void 0) PromiseImpl = Promise;

  var iter = new AsyncIterator(
    wrap(innerFn, outerFn, self, tryLocsList),
    PromiseImpl
  );

  return isGeneratorFunction(outerFn)
    ? iter // If outerFn is a generator, return the full iterator.
    : iter.next().then(function(result) {
      return result.done ? result.value : iter.next();
    });
}
function makeInvokeMethod(innerFn, self, context) {
  var state = GenStateSuspendedStart;

  return function invoke(method, arg) {
    if (state === GenStateExecuting) {
      throw new Error("Generator is already running");
    }

    if (state === GenStateCompleted) {
      if (method === "throw") {
        throw arg;
      }

      // Be forgiving, per 25.3.3.3.3 of the spec:
      // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
      return doneResult();
    }

    context.method = method;
    context.arg = arg;

    while (true) {
      var delegate = context.delegate;
      if (delegate) {
        var delegateResult = maybeInvokeDelegate(delegate, context);
        if (delegateResult) {
          if (delegateResult === ContinueSentinel) continue;
          return delegateResult;
        }
      }

      if (context.method === "next") {
        // Setting context._sent for legacy support of Babel's
        // function.sent implementation.
        context.sent = context._sent = context.arg;

      } else if (context.method === "throw") {
        if (state === GenStateSuspendedStart) {
          state = GenStateCompleted;
          throw context.arg;
        }

        context.dispatchException(context.arg);

      } else if (context.method === "return") {
        context.abrupt("return", context.arg);
      }

      state = GenStateExecuting;

      var record = tryCatch(innerFn, self, context);
      if (record.type === "normal") {
        // If an exception is thrown from innerFn, we leave state ===
        // GenStateExecuting and loop back for another invocation.
        state = context.done
          ? GenStateCompleted
          : GenStateSuspendedYield;

        if (record.arg === ContinueSentinel) {
          continue;
        }

        return {
          value: record.arg,
          done: context.done
        };

      } else if (record.type === "throw") {
        state = GenStateCompleted;
        // Dispatch the exception by looping back around to the
        // context.dispatchException(context.arg) call above.
        context.method = "throw";
        context.arg = record.arg;
      }
    }
  };
}

// Call delegate.iterator[context.method](context.arg) and handle the
// result, either by returning a { value, done } result from the
// delegate iterator, or by modifying context.method and context.arg,
// setting context.delegate to null, and returning the ContinueSentinel.
function maybeInvokeDelegate(delegate, context) {
  var method = delegate.iterator[context.method];
  if (method === undefined$1) {
    // A .throw or .return when the delegate iterator has no .throw
    // method always terminates the yield* loop.
    context.delegate = null;

    if (context.method === "throw") {
      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined$1;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }

      context.method = "throw";
      context.arg = new TypeError(
        "The iterator does not provide a 'throw' method");
    }

    return ContinueSentinel;
  }

  var record = tryCatch(method, delegate.iterator, context.arg);

  if (record.type === "throw") {
    context.method = "throw";
    context.arg = record.arg;
    context.delegate = null;
    return ContinueSentinel;
  }

  var info = record.arg;

  if (! info) {
    context.method = "throw";
    context.arg = new TypeError("iterator result is not an object");
    context.delegate = null;
    return ContinueSentinel;
  }

  if (info.done) {
    // Assign the result of the finished delegate to the temporary
    // variable specified by delegate.resultName (see delegateYield).
    context[delegate.resultName] = info.value;

    // Resume execution at the desired location (see delegateYield).
    context.next = delegate.nextLoc;

    // If context.method was "throw" but the delegate handled the
    // exception, let the outer generator proceed normally. If
    // context.method was "next", forget context.arg since it has been
    // "consumed" by the delegate iterator. If context.method was
    // "return", allow the original .return call to continue in the
    // outer generator.
    if (context.method !== "return") {
      context.method = "next";
      context.arg = undefined$1;
    }

  } else {
    // Re-yield the result returned by the delegate method.
    return info;
  }

  // The delegate iterator is finished, so forget it and continue with
  // the outer generator.
  context.delegate = null;
  return ContinueSentinel;
}

// Define Generator.prototype.{next,throw,return} in terms of the
// unified ._invoke helper method.
defineIteratorMethods(Gp);

Gp[toStringTagSymbol] = "Generator";

// A Generator should always return itself as the iterator object when the
// @@iterator function is called on it. Some browsers' implementations of the
// iterator prototype chain incorrectly implement this, causing the Generator
// object to not be returned from this call. This ensures that doesn't happen.
// See https://github.com/facebook/regenerator/issues/274 for more details.
Gp[iteratorSymbol] = function() {
  return this;
};

Gp.toString = function() {
  return "[object Generator]";
};

function pushTryEntry(locs) {
  var entry = { tryLoc: locs[0] };

  if (1 in locs) {
    entry.catchLoc = locs[1];
  }

  if (2 in locs) {
    entry.finallyLoc = locs[2];
    entry.afterLoc = locs[3];
  }

  this.tryEntries.push(entry);
}

function resetTryEntry(entry) {
  var record = entry.completion || {};
  record.type = "normal";
  delete record.arg;
  entry.completion = record;
}

function Context(tryLocsList) {
  // The root entry object (effectively a try statement without a catch
  // or a finally block) gives us a place to store values thrown from
  // locations where there is no enclosing try statement.
  this.tryEntries = [{ tryLoc: "root" }];
  tryLocsList.forEach(pushTryEntry, this);
  this.reset(true);
}

function keys (object) {
  var keys = [];
  for (var key in object) {
    keys.push(key);
  }
  keys.reverse();

  // Rather than returning an object with a next method, we keep
  // things simple and return the next function itself.
  return function next() {
    while (keys.length) {
      var key = keys.pop();
      if (key in object) {
        next.value = key;
        next.done = false;
        return next;
      }
    }

    // To avoid creating an additional object, we just hang the .value
    // and .done properties off the next function object itself. This
    // also ensures that the minifier will not anonymize the function.
    next.done = true;
    return next;
  };
}
function values(iterable) {
  if (iterable) {
    var iteratorMethod = iterable[iteratorSymbol];
    if (iteratorMethod) {
      return iteratorMethod.call(iterable);
    }

    if (typeof iterable.next === "function") {
      return iterable;
    }

    if (!isNaN(iterable.length)) {
      var i = -1, next = function next() {
        while (++i < iterable.length) {
          if (hasOwn.call(iterable, i)) {
            next.value = iterable[i];
            next.done = false;
            return next;
          }
        }

        next.value = undefined$1;
        next.done = true;

        return next;
      };

      return next.next = next;
    }
  }

  // Return an iterator with no values.
  return { next: doneResult };
}

function doneResult() {
  return { value: undefined$1, done: true };
}

Context.prototype = {
  constructor: Context,

  reset: function(skipTempReset) {
    this.prev = 0;
    this.next = 0;
    // Resetting context._sent for legacy support of Babel's
    // function.sent implementation.
    this.sent = this._sent = undefined$1;
    this.done = false;
    this.delegate = null;

    this.method = "next";
    this.arg = undefined$1;

    this.tryEntries.forEach(resetTryEntry);

    if (!skipTempReset) {
      for (var name in this) {
        // Not sure about the optimal order of these conditions:
        if (name.charAt(0) === "t" &&
          hasOwn.call(this, name) &&
          !isNaN(+name.slice(1))) {
          this[name] = undefined$1;
        }
      }
    }
  },

  stop: function() {
    this.done = true;

    var rootEntry = this.tryEntries[0];
    var rootRecord = rootEntry.completion;
    if (rootRecord.type === "throw") {
      throw rootRecord.arg;
    }

    return this.rval;
  },

  dispatchException: function(exception) {
    if (this.done) {
      throw exception;
    }

    var context = this;
    function handle(loc, caught) {
      record.type = "throw";
      record.arg = exception;
      context.next = loc;

      if (caught) {
        // If the dispatched exception was caught by a catch block,
        // then let that catch block handle the exception normally.
        context.method = "next";
        context.arg = undefined$1;
      }

      return !! caught;
    }

    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      var record = entry.completion;

      if (entry.tryLoc === "root") {
        // Exception thrown outside of any try block that could handle
        // it, so set the completion value of the entire function to
        // throw the exception.
        return handle("end");
      }

      if (entry.tryLoc <= this.prev) {
        var hasCatch = hasOwn.call(entry, "catchLoc");
        var hasFinally = hasOwn.call(entry, "finallyLoc");

        if (hasCatch && hasFinally) {
          if (this.prev < entry.catchLoc) {
            return handle(entry.catchLoc, true);
          } else if (this.prev < entry.finallyLoc) {
            return handle(entry.finallyLoc);
          }

        } else if (hasCatch) {
          if (this.prev < entry.catchLoc) {
            return handle(entry.catchLoc, true);
          }

        } else if (hasFinally) {
          if (this.prev < entry.finallyLoc) {
            return handle(entry.finallyLoc);
          }

        } else {
          throw new Error("try statement without catch or finally");
        }
      }
    }
  },

  abrupt: function(type, arg) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      if (entry.tryLoc <= this.prev &&
        hasOwn.call(entry, "finallyLoc") &&
        this.prev < entry.finallyLoc) {
        var finallyEntry = entry;
        break;
      }
    }

    if (finallyEntry &&
      (type === "break" ||
        type === "continue") &&
      finallyEntry.tryLoc <= arg &&
      arg <= finallyEntry.finallyLoc) {
      // Ignore the finally entry if control is not jumping to a
      // location outside the try/catch block.
      finallyEntry = null;
    }

    var record = finallyEntry ? finallyEntry.completion : {};
    record.type = type;
    record.arg = arg;

    if (finallyEntry) {
      this.method = "next";
      this.next = finallyEntry.finallyLoc;
      return ContinueSentinel;
    }

    return this.complete(record);
  },

  complete: function(record, afterLoc) {
    if (record.type === "throw") {
      throw record.arg;
    }

    if (record.type === "break" ||
      record.type === "continue") {
      this.next = record.arg;
    } else if (record.type === "return") {
      this.rval = this.arg = record.arg;
      this.method = "return";
      this.next = "end";
    } else if (record.type === "normal" && afterLoc) {
      this.next = afterLoc;
    }

    return ContinueSentinel;
  },

  finish: function(finallyLoc) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      if (entry.finallyLoc === finallyLoc) {
        this.complete(entry.completion, entry.afterLoc);
        resetTryEntry(entry);
        return ContinueSentinel;
      }
    }
  },

  "catch": function(tryLoc) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      if (entry.tryLoc === tryLoc) {
        var record = entry.completion;
        if (record.type === "throw") {
          var thrown = record.arg;
          resetTryEntry(entry);
        }
        return thrown;
      }
    }

    // The context.catch method must only be called with a location
    // argument that corresponds to a known catch block.
    throw new Error("illegal catch attempt");
  },

  delegateYield: function(iterable, resultName, nextLoc) {
    this.delegate = {
      iterator: values(iterable),
      resultName: resultName,
      nextLoc: nextLoc
    };

    if (this.method === "next") {
      // Deliberately forget the last sent value so that we don't
      // accidentally pass it on to the delegate.
      this.arg = undefined$1;
    }

    return ContinueSentinel;
  }
};

// Export a default namespace that plays well with Rollup
var _regeneratorRuntime = {
  wrap,
  isGeneratorFunction,
  AsyncIterator,
  mark,
  awrap,
  async,
  keys,
  values
};

var classCallCheck = createCommonjsModule(function (module) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
});

var _classCallCheck = unwrapExports(classCallCheck);

var RNCNetInfo=reactNative$1.NativeModules.RNCNetInfo;

if(!RNCNetInfo){throw new Error("@react-native-community/netinfo: NativeModule.RNCNetInfo is null. To fix this issue try these steps:\n\n\u2022 Run `react-native link @react-native-community/netinfo` in the project root.\n\u2022 Rebuild and re-run the app.\n\u2022 If you are using CocoaPods on iOS, run `pod install` in the `ios` directory and then rebuild and re-run the app. You may also need to re-open Xcode to get the new pods.\n\u2022 Check that the library was linked correctly when you used the link command by running through the manual installation instructions in the README.\n* If you are getting this error while unit testing you need to mock the native module. Follow the guide in the README.\n\nIf none of these fix the issue, please open an issue on the Github repository: https://github.com/react-native-community/react-native-netinfo");}var nativeEventEmitter=null;var NativeInterface = _objectSpread({},RNCNetInfo,{get eventEmitter(){if(!nativeEventEmitter){nativeEventEmitter=new reactNative$1.NativeEventEmitter(RNCNetInfo);}return nativeEventEmitter;}});

var InternetReachability=function InternetReachability(configuration,listener){var _this=this;_classCallCheck(this,InternetReachability);this._isInternetReachable=undefined;this._currentInternetReachabilityCheckHandler=null;this._currentTimeoutHandle=null;this._setIsInternetReachable=function(isInternetReachable){if(_this._isInternetReachable===isInternetReachable){return;}_this._isInternetReachable=isInternetReachable;_this._listener(_this._isInternetReachable);};this._setExpectsConnection=function(expectsConnection){if(_this._currentInternetReachabilityCheckHandler!==null){_this._currentInternetReachabilityCheckHandler.cancel();_this._currentInternetReachabilityCheckHandler=null;}if(_this._currentTimeoutHandle!==null){clearTimeout(_this._currentTimeoutHandle);_this._currentTimeoutHandle=null;}if(expectsConnection){if(!_this._isInternetReachable){_this._setIsInternetReachable(null);}_this._currentInternetReachabilityCheckHandler=_this._checkInternetReachability();}else {_this._setIsInternetReachable(false);}};this._checkInternetReachability=function(){var responsePromise=fetch(_this._configuration.reachabilityUrl,{method:'HEAD',cache:'no-cache'});var timeoutHandle;var timeoutPromise=new Promise(function(_,reject){timeoutHandle=setTimeout(function(){return reject('timedout');},_this._configuration.reachabilityRequestTimeout);});var cancel=function cancel(){};var cancelPromise=new Promise(function(_,reject){cancel=function cancel(){return reject('canceled');};});var promise=Promise.race([responsePromise,timeoutPromise,cancelPromise]).then(function(response){return _this._configuration.reachabilityTest(response);}).then(function(result){_this._setIsInternetReachable(result);var nextTimeoutInterval=_this._isInternetReachable?_this._configuration.reachabilityLongTimeout:_this._configuration.reachabilityShortTimeout;_this._currentTimeoutHandle=setTimeout(_this._checkInternetReachability,nextTimeoutInterval);}).catch(function(error){if(error!=='canceled'){_this._setIsInternetReachable(false);_this._currentTimeoutHandle=setTimeout(_this._checkInternetReachability,_this._configuration.reachabilityShortTimeout);}}).then(function(){clearTimeout(timeoutHandle);},function(error){clearTimeout(timeoutHandle);throw error;});return {promise:promise,cancel:cancel};};this.update=function(state){if(typeof state.isInternetReachable==='boolean'){_this._setIsInternetReachable(state.isInternetReachable);}else {_this._setExpectsConnection(state.isConnected);}};this.currentState=function(){return _this._isInternetReachable;};this.tearDown=function(){if(_this._currentInternetReachabilityCheckHandler!==null){_this._currentInternetReachabilityCheckHandler.cancel();_this._currentInternetReachabilityCheckHandler=null;}if(_this._currentTimeoutHandle!==null){clearTimeout(_this._currentTimeoutHandle);_this._currentTimeoutHandle=null;}};this._configuration=configuration;this._listener=listener;};

var DEVICE_CONNECTIVITY_EVENT='netInfo.networkStatusDidChange';

var State=function State(configuration){var _this=this;_classCallCheck(this,State);this._nativeEventSubscription=null;this._subscriptions=new Set();this._latestState=null;this._handleNativeStateUpdate=function(state){_this._internetReachability.update(state);var convertedState=_this._convertState(state);_this._latestState=convertedState;_this._subscriptions.forEach(function(handler){return handler(convertedState);});};this._handleInternetReachabilityUpdate=function(isInternetReachable){if(!_this._latestState){return;}var nextState=_objectSpread({},_this._latestState,{isInternetReachable:isInternetReachable});_this._latestState=nextState;_this._subscriptions.forEach(function(handler){return handler(nextState);});};this._fetchCurrentState=function _callee(requestedInterface){var state,convertedState;return _regeneratorRuntime.async(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return _regeneratorRuntime.awrap(NativeInterface.getCurrentState(requestedInterface));case 2:state=_context.sent;_this._internetReachability.update(state);convertedState=_this._convertState(state);if(!requestedInterface){_this._latestState=convertedState;}return _context.abrupt("return",convertedState);case 7:case"end":return _context.stop();}}},null,this);};this._convertState=function(input){if(typeof input.isInternetReachable==='boolean'){return input;}else {return _objectSpread({},input,{isInternetReachable:_this._internetReachability.currentState()});}};this.latest=function(requestedInterface){if(requestedInterface){return _this._fetchCurrentState(requestedInterface);}else if(_this._latestState){return Promise.resolve(_this._latestState);}else {return _this._fetchCurrentState();}};this.add=function(handler){_this._subscriptions.add(handler);if(_this._latestState){handler(_this._latestState);}else {_this.latest().then(handler);}};this.remove=function(handler){_this._subscriptions.delete(handler);};this.tearDown=function(){if(_this._internetReachability){_this._internetReachability.tearDown();}if(_this._nativeEventSubscription){_this._nativeEventSubscription.remove();}_this._subscriptions.clear();};this._internetReachability=new InternetReachability(configuration,this._handleInternetReachabilityUpdate);this._nativeEventSubscription=NativeInterface.eventEmitter.addListener(DEVICE_CONNECTIVITY_EVENT,this._handleNativeStateUpdate);this._fetchCurrentState();};

var NetInfoStateType;(function(NetInfoStateType){NetInfoStateType["unknown"]="unknown";NetInfoStateType["none"]="none";NetInfoStateType["cellular"]="cellular";NetInfoStateType["wifi"]="wifi";NetInfoStateType["bluetooth"]="bluetooth";NetInfoStateType["ethernet"]="ethernet";NetInfoStateType["wimax"]="wimax";NetInfoStateType["vpn"]="vpn";NetInfoStateType["other"]="other";})(NetInfoStateType||(NetInfoStateType={}));var NetInfoCellularGeneration;(function(NetInfoCellularGeneration){NetInfoCellularGeneration["2g"]="2g";NetInfoCellularGeneration["3g"]="3g";NetInfoCellularGeneration["4g"]="4g";})(NetInfoCellularGeneration||(NetInfoCellularGeneration={}));

var _configuration=DEFAULT_CONFIGURATION;var _state=null;var createState=function createState(){return new State(_configuration);};function configure(configuration){_configuration=_objectSpread({},DEFAULT_CONFIGURATION,configuration);if(_state){_state.tearDown();_state=createState();}}function fetch$1(requestedInterface){if(!_state){_state=createState();}return _state.latest(requestedInterface);}function addEventListener(listener){if(!_state){_state=createState();}_state.add(listener);return function(){_state&&_state.remove(listener);};}function useNetInfo(configuration){if(configuration){configure(configuration);}var _useState=React.useState({type:NetInfoStateType.unknown,isConnected:false,isInternetReachable:false,details:null}),_useState2=_slicedToArray(_useState,2),netInfo=_useState2[0],setNetInfo=_useState2[1];React.useEffect(function(){return addEventListener(setNetInfo);},[]);return netInfo;}var require$$0 = {configure:configure,fetch:fetch$1,addEventListener:addEventListener,useNetInfo:useNetInfo};

var pusher = createCommonjsModule(function (module) {
/*!
 * Pusher JavaScript Library v7.4.0
 * https://pusher.com/
 *
 * Copyright 2020, Pusher
 * Released under the MIT licence.
 */
module.exports=function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r});},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=14)}([function(t,n,e){(function(t){e.d(n,"f",(function(){return i})),e.d(n,"m",(function(){return s})),e.d(n,"d",(function(){return a})),e.d(n,"k",(function(){return c})),e.d(n,"i",(function(){return u})),e.d(n,"n",(function(){return h})),e.d(n,"c",(function(){return f})),e.d(n,"j",(function(){return l})),e.d(n,"g",(function(){return p})),e.d(n,"h",(function(){return d})),e.d(n,"b",(function(){return y})),e.d(n,"a",(function(){return g})),e.d(n,"e",(function(){return b})),e.d(n,"l",(function(){return m}));var r=e(10),o=e(2);function i(t){for(var n=[],e=1;e<arguments.length;e++)n[e-1]=arguments[e];for(var r=0;r<n.length;r++){var o=n[r];for(var s in o)o[s]&&o[s].constructor&&o[s].constructor===Object?t[s]=i(t[s]||{},o[s]):t[s]=o[s];}return t}function s(){for(var t=["Pusher"],n=0;n<arguments.length;n++)"string"==typeof arguments[n]?t.push(arguments[n]):t.push(m(arguments[n]));return t.join(" : ")}function a(t,n){var e=Array.prototype.indexOf;if(null===t)return -1;if(e&&t.indexOf===e)return t.indexOf(n);for(var r=0,o=t.length;r<o;r++)if(t[r]===n)return r;return -1}function c(t,n){for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&n(t[e],e,t);}function u(t){var n=[];return c(t,(function(t,e){n.push(e);})),n}function h(t){var n=[];return c(t,(function(t){n.push(t);})),n}function f(n,e,r){for(var o=0;o<n.length;o++)e.call(r||t,n[o],o,n);}function l(t,n){for(var e=[],r=0;r<t.length;r++)e.push(n(t[r],r,t,e));return e}function p(t,n){n=n||function(t){return !!t};for(var e=[],r=0;r<t.length;r++)n(t[r],r,t,e)&&e.push(t[r]);return e}function d(t,n){var e={};return c(t,(function(r,o){(n&&n(r,o,t,e)||Boolean(r))&&(e[o]=r);})),e}function y(t,n){for(var e=0;e<t.length;e++)if(n(t[e],e,t))return !0;return !1}function g(t,n){for(var e=0;e<t.length;e++)if(!n(t[e],e,t))return !1;return !0}function v(t){return n=function(t){return "object"==typeof t&&(t=m(t)),encodeURIComponent(Object(r.a)(t.toString()))},e={},c(t,(function(t,r){e[r]=n(t);})),e;var n,e;}function b(t){var n,e,r=d(t,(function(t){return void 0!==t}));return l((n=v(r),e=[],c(n,(function(t,n){e.push([n,t]);})),e),o.a.method("join","=")).join("&")}function m(t){try{return JSON.stringify(t)}catch(r){return JSON.stringify((n=[],e=[],function t(r,o){var i,s,a;switch(typeof r){case"object":if(!r)return null;for(i=0;i<n.length;i+=1)if(n[i]===r)return {$ref:e[i]};if(n.push(r),e.push(o),"[object Array]"===Object.prototype.toString.apply(r))for(a=[],i=0;i<r.length;i+=1)a[i]=t(r[i],o+"["+i+"]");else for(s in a={},r)Object.prototype.hasOwnProperty.call(r,s)&&(a[s]=t(r[s],o+"["+JSON.stringify(s)+"]"));return a;case"number":case"string":case"boolean":return r}}(t,"$")))}var n,e;}}).call(this,e(6));},function(t,n,e){(function(t){var r=e(0),o=e(5),i=function(){function n(){this.globalLog=function(n){t.console&&t.console.log&&t.console.log(n);};}return n.prototype.debug=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];this.log(this.globalLog,t);},n.prototype.warn=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];this.log(this.globalLogWarn,t);},n.prototype.error=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];this.log(this.globalLogError,t);},n.prototype.globalLogWarn=function(n){t.console&&t.console.warn?t.console.warn(n):this.globalLog(n);},n.prototype.globalLogError=function(n){t.console&&t.console.error?t.console.error(n):this.globalLogWarn(n);},n.prototype.log=function(t){for(var n=[],e=1;e<arguments.length;e++)n[e-1]=arguments[e];var i=r.m.apply(this,arguments);if(o.a.log)o.a.log(i);else if(o.a.logToConsole){var s=t.bind(this);s(i);}},n}();n.a=new i;}).call(this,e(6));},function(t,n,e){var r=e(4),o={now:function(){return Date.now?Date.now():(new Date).valueOf()},defer:function(t){return new r.a(0,t)},method:function(t){for(var n=[],e=1;e<arguments.length;e++)n[e-1]=arguments[e];var r=Array.prototype.slice.call(arguments,1);return function(n){return n[t].apply(n,r.concat(arguments))}}};n.a=o;},function(t,n,e){(function(t){var r=e(0),o=e(11),i=function(){function n(t){this.callbacks=new o.a,this.global_callbacks=[],this.failThrough=t;}return n.prototype.bind=function(t,n,e){return this.callbacks.add(t,n,e),this},n.prototype.bind_global=function(t){return this.global_callbacks.push(t),this},n.prototype.unbind=function(t,n,e){return this.callbacks.remove(t,n,e),this},n.prototype.unbind_global=function(t){return t?(this.global_callbacks=r.g(this.global_callbacks||[],(function(n){return n!==t})),this):(this.global_callbacks=[],this)},n.prototype.unbind_all=function(){return this.unbind(),this.unbind_global(),this},n.prototype.emit=function(n,e,r){for(var o=0;o<this.global_callbacks.length;o++)this.global_callbacks[o](n,e);var i=this.callbacks.get(n),s=[];if(r?s.push(e,r):e&&s.push(e),i&&i.length>0)for(o=0;o<i.length;o++)i[o].fn.apply(i[o].context||t,s);else this.failThrough&&this.failThrough(n,e);return this},n}();n.a=i;}).call(this,e(6));},function(t,n,e){(function(t){e.d(n,"a",(function(){return c})),e.d(n,"b",(function(){return u}));var r,o=e(8),i=(r=function(t,n){return (r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(t,n)},function(t,n){function e(){this.constructor=t;}r(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e);});function s(n){t.clearTimeout(n);}function a(n){t.clearInterval(n);}var c=function(t){function n(n,e){return t.call(this,setTimeout,s,n,(function(t){return e(),null}))||this}return i(n,t),n}(o.a),u=function(t){function n(n,e){return t.call(this,setInterval,a,n,(function(t){return e(),t}))||this}return i(n,t),n}(o.a);}).call(this,e(6));},function(t,n,e){var r=e(0),o={VERSION:"7.4.0",PROTOCOL:7,wsPort:80,wssPort:443,wsPath:"",httpHost:"sockjs.pusher.com",httpPort:80,httpsPort:443,httpPath:"/pusher",stats_host:"stats.pusher.com",authEndpoint:"/pusher/auth",authTransport:"ajax",activityTimeout:12e4,pongTimeout:3e4,unavailableTimeout:1e4,cluster:"mt1",userAuthentication:{endpoint:"/pusher/user-auth",transport:"ajax"},channelAuthorization:{endpoint:"/pusher/auth",transport:"ajax"},cdn_http:"http://js.pusher.com",cdn_https:"https://js.pusher.com",dependency_suffix:""};function i(t,n,e){return t+(n.useTLS?"s":"")+"://"+(n.useTLS?n.hostTLS:n.hostNonTLS)+e}function s(t,n){return "/app/"+t+("?protocol="+o.PROTOCOL+"&client=js&version="+o.VERSION+(n?"&"+n:""))}var a,c={getInitial:function(t,n){return i("ws",n,(n.httpPath||"")+s(t,"flash=false"))}},u={getInitial:function(t,n){return i("http",n,(n.httpPath||"/pusher")+s(t))}},h=e(2),f=e(3),l=e(1),p=(a=function(t,n){return (a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(t,n)},function(t,n){function e(){this.constructor=t;}a(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e);}),d=function(t){function n(n,e,r,o,i){var s=t.call(this)||this;return s.initialize=It.transportConnectionInitializer,s.hooks=n,s.name=e,s.priority=r,s.key=o,s.options=i,s.state="new",s.timeline=i.timeline,s.activityTimeout=i.activityTimeout,s.id=s.timeline.generateUniqueID(),s}return p(n,t),n.prototype.handlesActivityChecks=function(){return Boolean(this.hooks.handlesActivityChecks)},n.prototype.supportsPing=function(){return Boolean(this.hooks.supportsPing)},n.prototype.connect=function(){var t=this;if(this.socket||"initialized"!==this.state)return !1;var n=this.hooks.urls.getInitial(this.key,this.options);try{this.socket=this.hooks.getSocket(n,this.options);}catch(n){return h.a.defer((function(){t.onError(n),t.changeState("closed");})),!1}return this.bindListeners(),l.a.debug("Connecting",{transport:this.name,url:n}),this.changeState("connecting"),!0},n.prototype.close=function(){return !!this.socket&&(this.socket.close(),!0)},n.prototype.send=function(t){var n=this;return "open"===this.state&&(h.a.defer((function(){n.socket&&n.socket.send(t);})),!0)},n.prototype.ping=function(){"open"===this.state&&this.supportsPing()&&this.socket.ping();},n.prototype.onOpen=function(){this.hooks.beforeOpen&&this.hooks.beforeOpen(this.socket,this.hooks.urls.getPath(this.key,this.options)),this.changeState("open"),this.socket.onopen=void 0;},n.prototype.onError=function(t){this.emit("error",{type:"WebSocketError",error:t}),this.timeline.error(this.buildTimelineMessage({error:t.toString()}));},n.prototype.onClose=function(t){t?this.changeState("closed",{code:t.code,reason:t.reason,wasClean:t.wasClean}):this.changeState("closed"),this.unbindListeners(),this.socket=void 0;},n.prototype.onMessage=function(t){this.emit("message",t);},n.prototype.onActivity=function(){this.emit("activity");},n.prototype.bindListeners=function(){var t=this;this.socket.onopen=function(){t.onOpen();},this.socket.onerror=function(n){t.onError(n);},this.socket.onclose=function(n){t.onClose(n);},this.socket.onmessage=function(n){t.onMessage(n);},this.supportsPing()&&(this.socket.onactivity=function(){t.onActivity();});},n.prototype.unbindListeners=function(){this.socket&&(this.socket.onopen=void 0,this.socket.onerror=void 0,this.socket.onclose=void 0,this.socket.onmessage=void 0,this.supportsPing()&&(this.socket.onactivity=void 0));},n.prototype.changeState=function(t,n){this.state=t,this.timeline.info(this.buildTimelineMessage({state:t,params:n})),this.emit(t,n);},n.prototype.buildTimelineMessage=function(t){return r.f({cid:this.id},t)},n}(f.a),y=function(){function t(t){this.hooks=t;}return t.prototype.isSupported=function(t){return this.hooks.isSupported(t)},t.prototype.createConnection=function(t,n,e,r){return new d(this.hooks,t,n,e,r)},t}(),g=new y({urls:c,handlesActivityChecks:!1,supportsPing:!1,isInitialized:function(){return Boolean(It.getWebSocketAPI())},isSupported:function(){return Boolean(It.getWebSocketAPI())},getSocket:function(t){return It.createWebSocket(t)}}),v={urls:u,handlesActivityChecks:!1,supportsPing:!0,isInitialized:function(){return !0}},b=r.f({getSocket:function(t){return It.HTTPFactory.createStreamingSocket(t)}},v),m=r.f({getSocket:function(t){return It.HTTPFactory.createPollingSocket(t)}},v),_={isSupported:function(){return It.isXHRSupported()}},w={ws:g,xhr_streaming:new y(r.f({},b,_)),xhr_polling:new y(r.f({},m,_))},S=function(){function t(t,n,e){this.manager=t,this.transport=n,this.minPingDelay=e.minPingDelay,this.maxPingDelay=e.maxPingDelay,this.pingDelay=void 0;}return t.prototype.createConnection=function(t,n,e,o){var i=this;o=r.f({},o,{activityTimeout:this.pingDelay});var s=this.transport.createConnection(t,n,e,o),a=null,c=function(){s.unbind("open",c),s.bind("closed",u),a=h.a.now();},u=function(t){if(s.unbind("closed",u),1002===t.code||1003===t.code)i.manager.reportDeath();else if(!t.wasClean&&a){var n=h.a.now()-a;n<2*i.maxPingDelay&&(i.manager.reportDeath(),i.pingDelay=Math.max(n/2,i.minPingDelay));}};return s.bind("open",c),s},t.prototype.isSupported=function(t){return this.manager.isAlive()&&this.transport.isSupported(t)},t}(),k={decodeMessage:function(t){try{var n=JSON.parse(t.data),e=n.data;if("string"==typeof e)try{e=JSON.parse(n.data);}catch(t){}var r={event:n.event,channel:n.channel,data:e};return n.user_id&&(r.user_id=n.user_id),r}catch(n){throw {type:"MessageParseError",error:n,data:t.data}}},encodeMessage:function(t){return JSON.stringify(t)},processHandshake:function(t){var n=k.decodeMessage(t);if("pusher:connection_established"===n.event){if(!n.data.activity_timeout)throw "No activity timeout specified in handshake";return {action:"connected",id:n.data.socket_id,activityTimeout:1e3*n.data.activity_timeout}}if("pusher:error"===n.event)return {action:this.getCloseAction(n.data),error:this.getCloseError(n.data)};throw "Invalid handshake"},getCloseAction:function(t){return t.code<4e3?t.code>=1002&&t.code<=1004?"backoff":null:4e3===t.code?"tls_only":t.code<4100?"refused":t.code<4200?"backoff":t.code<4300?"retry":"refused"},getCloseError:function(t){return 1e3!==t.code&&1001!==t.code?{type:"PusherError",data:{code:t.code,message:t.reason||t.message}}:null}},C=k,T=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),P=function(t){function n(n,e){var r=t.call(this)||this;return r.id=n,r.transport=e,r.activityTimeout=e.activityTimeout,r.bindListeners(),r}return T(n,t),n.prototype.handlesActivityChecks=function(){return this.transport.handlesActivityChecks()},n.prototype.send=function(t){return this.transport.send(t)},n.prototype.send_event=function(t,n,e){var r={event:t,data:n};return e&&(r.channel=e),l.a.debug("Event sent",r),this.send(C.encodeMessage(r))},n.prototype.ping=function(){this.transport.supportsPing()?this.transport.ping():this.send_event("pusher:ping",{});},n.prototype.close=function(){this.transport.close();},n.prototype.bindListeners=function(){var t=this,n={message:function(n){var e;try{e=C.decodeMessage(n);}catch(e){t.emit("error",{type:"MessageParseError",error:e,data:n.data});}if(void 0!==e){switch(l.a.debug("Event recd",e),e.event){case"pusher:error":t.emit("error",{type:"PusherError",data:e.data});break;case"pusher:ping":t.emit("ping");break;case"pusher:pong":t.emit("pong");}t.emit("message",e);}},activity:function(){t.emit("activity");},error:function(n){t.emit("error",n);},closed:function(n){e(),n&&n.code&&t.handleCloseEvent(n),t.transport=null,t.emit("closed");}},e=function(){r.k(n,(function(n,e){t.transport.unbind(e,n);}));};r.k(n,(function(n,e){t.transport.bind(e,n);}));},n.prototype.handleCloseEvent=function(t){var n=C.getCloseAction(t),e=C.getCloseError(t);e&&this.emit("error",e),n&&this.emit(n,{action:n,error:e});},n}(f.a),O=function(){function t(t,n){this.transport=t,this.callback=n,this.bindListeners();}return t.prototype.close=function(){this.unbindListeners(),this.transport.close();},t.prototype.bindListeners=function(){var t=this;this.onMessage=function(n){var e;t.unbindListeners();try{e=C.processHandshake(n);}catch(n){return t.finish("error",{error:n}),void t.transport.close()}"connected"===e.action?t.finish("connected",{connection:new P(e.id,t.transport),activityTimeout:e.activityTimeout}):(t.finish(e.action,{error:e.error}),t.transport.close());},this.onClosed=function(n){t.unbindListeners();var e=C.getCloseAction(n)||"backoff",r=C.getCloseError(n);t.finish(e,{error:r});},this.transport.bind("message",this.onMessage),this.transport.bind("closed",this.onClosed);},t.prototype.unbindListeners=function(){this.transport.unbind("message",this.onMessage),this.transport.unbind("closed",this.onClosed);},t.prototype.finish=function(t,n){this.callback(r.f({transport:this.transport,action:t},n));},t}(),A=function(){function t(t,n){this.timeline=t,this.options=n||{};}return t.prototype.send=function(t,n){this.timeline.isEmpty()||this.timeline.send(It.TimelineTransport.getAgent(this,t),n);},t}(),E=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),x=function(t){function n(n){var e=this.constructor,r=t.call(this,n)||this;return Object.setPrototypeOf(r,e.prototype),r}return E(n,t),n}(Error),L=function(t){function n(n){var e=this.constructor,r=t.call(this,n)||this;return Object.setPrototypeOf(r,e.prototype),r}return E(n,t),n}(Error),U=(function(t){function n(n){var e=this.constructor,r=t.call(this,n)||this;return Object.setPrototypeOf(r,e.prototype),r}E(n,t);}(Error),function(t){function n(n){var e=this.constructor,r=t.call(this,n)||this;return Object.setPrototypeOf(r,e.prototype),r}return E(n,t),n}(Error)),R=function(t){function n(n){var e=this.constructor,r=t.call(this,n)||this;return Object.setPrototypeOf(r,e.prototype),r}return E(n,t),n}(Error),M=function(t){function n(n){var e=this.constructor,r=t.call(this,n)||this;return Object.setPrototypeOf(r,e.prototype),r}return E(n,t),n}(Error),j=function(t){function n(n){var e=this.constructor,r=t.call(this,n)||this;return Object.setPrototypeOf(r,e.prototype),r}return E(n,t),n}(Error),I=function(t){function n(n){var e=this.constructor,r=t.call(this,n)||this;return Object.setPrototypeOf(r,e.prototype),r}return E(n,t),n}(Error),N=function(t){function n(n,e){var r=this.constructor,o=t.call(this,e)||this;return o.status=n,Object.setPrototypeOf(o,r.prototype),o}return E(n,t),n}(Error),D={baseUrl:"https://pusher.com",urls:{authenticationEndpoint:{path:"/docs/channels/server_api/authenticating_users"},authorizationEndpoint:{path:"/docs/channels/server_api/authorizing-users/"},javascriptQuickStart:{path:"/docs/javascript_quick_start"},triggeringClientEvents:{path:"/docs/client_api_guide/client_events#trigger-events"},encryptedChannelSupport:{fullUrl:"https://github.com/pusher/pusher-js/tree/cc491015371a4bde5743d1c87a0fbac0feb53195#encrypted-channel-support"}}},H=function(t){var n,e=D.urls[t];return e?(e.fullUrl?n=e.fullUrl:e.path&&(n=D.baseUrl+e.path),n?"See: "+n:""):""},z=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),B=function(t){function n(n,e){var r=t.call(this,(function(t,e){l.a.debug("No callbacks on "+n+" for "+t);}))||this;return r.name=n,r.pusher=e,r.subscribed=!1,r.subscriptionPending=!1,r.subscriptionCancelled=!1,r}return z(n,t),n.prototype.authorize=function(t,n){return n(null,{auth:""})},n.prototype.trigger=function(t,n){if(0!==t.indexOf("client-"))throw new x("Event '"+t+"' does not start with 'client-'");if(!this.subscribed){var e=H("triggeringClientEvents");l.a.warn("Client event triggered before channel 'subscription_succeeded' event . "+e);}return this.pusher.send_event(t,n,this.name)},n.prototype.disconnect=function(){this.subscribed=!1,this.subscriptionPending=!1;},n.prototype.handleEvent=function(t){var n=t.event,e=t.data;if("pusher_internal:subscription_succeeded"===n)this.handleSubscriptionSucceededEvent(t);else if("pusher_internal:subscription_count"===n)this.handleSubscriptionCountEvent(t);else if(0!==n.indexOf("pusher_internal:")){this.emit(n,e,{});}},n.prototype.handleSubscriptionSucceededEvent=function(t){this.subscriptionPending=!1,this.subscribed=!0,this.subscriptionCancelled?this.pusher.unsubscribe(this.name):this.emit("pusher:subscription_succeeded",t.data);},n.prototype.handleSubscriptionCountEvent=function(t){t.data.subscription_count&&(this.subscriptionCount=t.data.subscription_count),this.emit("pusher:subscription_count",t.data);},n.prototype.subscribe=function(){var t=this;this.subscribed||(this.subscriptionPending=!0,this.subscriptionCancelled=!1,this.authorize(this.pusher.connection.socket_id,(function(n,e){n?(t.subscriptionPending=!1,l.a.error(n.toString()),t.emit("pusher:subscription_error",Object.assign({},{type:"AuthError",error:n.message},n instanceof N?{status:n.status}:{}))):t.pusher.send_event("pusher:subscribe",{auth:e.auth,channel_data:e.channel_data,channel:t.name});})));},n.prototype.unsubscribe=function(){this.subscribed=!1,this.pusher.send_event("pusher:unsubscribe",{channel:this.name});},n.prototype.cancelSubscription=function(){this.subscriptionCancelled=!0;},n.prototype.reinstateSubscription=function(){this.subscriptionCancelled=!1;},n}(f.a),F=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),q=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return F(n,t),n.prototype.authorize=function(t,n){return this.pusher.config.channelAuthorizer({channelName:this.name,socketId:t},n)},n}(B),Y=function(){function t(){this.reset();}return t.prototype.get=function(t){return Object.prototype.hasOwnProperty.call(this.members,t)?{id:t,info:this.members[t]}:null},t.prototype.each=function(t){var n=this;r.k(this.members,(function(e,r){t(n.get(r));}));},t.prototype.setMyID=function(t){this.myID=t;},t.prototype.onSubscription=function(t){this.members=t.presence.hash,this.count=t.presence.count,this.me=this.get(this.myID);},t.prototype.addMember=function(t){return null===this.get(t.user_id)&&this.count++,this.members[t.user_id]=t.user_info,this.get(t.user_id)},t.prototype.removeMember=function(t){var n=this.get(t.user_id);return n&&(delete this.members[t.user_id],this.count--),n},t.prototype.reset=function(){this.members={},this.count=0,this.myID=null,this.me=null;},t}(),K=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),J=function(t,n,e,r){return new(e||(e=Promise))((function(o,i){function s(t){try{c(r.next(t));}catch(t){i(t);}}function a(t){try{c(r.throw(t));}catch(t){i(t);}}function c(t){t.done?o(t.value):new e((function(n){n(t.value);})).then(s,a);}c((r=r.apply(t,n||[])).next());}))},X=function(t,n){var e,r,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;s;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,r=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=n.call(t,s);}catch(t){i=[6,t],r=0;}finally{e=o=0;}if(5&i[0])throw i[1];return {value:i[0]?i[1]:void 0,done:!0}}([i,a])}}},W=function(t){function n(n,e){var r=t.call(this,n,e)||this;return r.members=new Y,r}return K(n,t),n.prototype.authorize=function(n,e){var r=this;t.prototype.authorize.call(this,n,(function(t,n){return J(r,void 0,void 0,(function(){var r,o;return X(this,(function(i){switch(i.label){case 0:return t?[3,3]:null==(n=n).channel_data?[3,1]:(r=JSON.parse(n.channel_data),this.members.setMyID(r.user_id),[3,3]);case 1:return [4,this.pusher.user.signinDonePromise];case 2:if(i.sent(),null==this.pusher.user.user_data)return o=H("authorizationEndpoint"),l.a.error("Invalid auth response for channel '"+this.name+"', expected 'channel_data' field. "+o+", or the user should be signed in."),e("Invalid auth response"),[2];this.members.setMyID(this.pusher.user.user_data.id),i.label=3;case 3:return e(t,n),[2]}}))}))}));},n.prototype.handleEvent=function(t){var n=t.event;if(0===n.indexOf("pusher_internal:"))this.handleInternalEvent(t);else {var e=t.data,r={};t.user_id&&(r.user_id=t.user_id),this.emit(n,e,r);}},n.prototype.handleInternalEvent=function(t){var n=t.event,e=t.data;switch(n){case"pusher_internal:subscription_succeeded":this.handleSubscriptionSucceededEvent(t);break;case"pusher_internal:subscription_count":this.handleSubscriptionCountEvent(t);break;case"pusher_internal:member_added":var r=this.members.addMember(e);this.emit("pusher:member_added",r);break;case"pusher_internal:member_removed":var o=this.members.removeMember(e);o&&this.emit("pusher:member_removed",o);}},n.prototype.handleSubscriptionSucceededEvent=function(t){this.subscriptionPending=!1,this.subscribed=!0,this.subscriptionCancelled?this.pusher.unsubscribe(this.name):(this.members.onSubscription(t.data),this.emit("pusher:subscription_succeeded",this.members));},n.prototype.disconnect=function(){this.members.reset(),t.prototype.disconnect.call(this);},n}(q),G=e(12),V=e(7),Z=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),Q=function(t){function n(n,e,r){var o=t.call(this,n,e)||this;return o.key=null,o.nacl=r,o}return Z(n,t),n.prototype.authorize=function(n,e){var r=this;t.prototype.authorize.call(this,n,(function(t,n){if(t)e(t,n);else {var o=n.shared_secret;o?(r.key=Object(V.decode)(o),delete n.shared_secret,e(null,n)):e(new Error("No shared_secret key in auth payload for encrypted channel: "+r.name),null);}}));},n.prototype.trigger=function(t,n){throw new M("Client events are not currently supported for encrypted channels")},n.prototype.handleEvent=function(n){var e=n.event,r=n.data;0!==e.indexOf("pusher_internal:")&&0!==e.indexOf("pusher:")?this.handleEncryptedEvent(e,r):t.prototype.handleEvent.call(this,n);},n.prototype.handleEncryptedEvent=function(t,n){var e=this;if(this.key)if(n.ciphertext&&n.nonce){var r=Object(V.decode)(n.ciphertext);if(r.length<this.nacl.secretbox.overheadLength)l.a.error("Expected encrypted event ciphertext length to be "+this.nacl.secretbox.overheadLength+", got: "+r.length);else {var o=Object(V.decode)(n.nonce);if(o.length<this.nacl.secretbox.nonceLength)l.a.error("Expected encrypted event nonce length to be "+this.nacl.secretbox.nonceLength+", got: "+o.length);else {var i=this.nacl.secretbox.open(r,o,this.key);if(null===i)return l.a.debug("Failed to decrypt an event, probably because it was encrypted with a different key. Fetching a new key from the authEndpoint..."),void this.authorize(this.pusher.connection.socket_id,(function(n,s){n?l.a.error("Failed to make a request to the authEndpoint: "+s+". Unable to fetch new key, so dropping encrypted event"):null!==(i=e.nacl.secretbox.open(r,o,e.key))?e.emit(t,e.getDataToEmit(i)):l.a.error("Failed to decrypt event with new key. Dropping encrypted event");}));this.emit(t,this.getDataToEmit(i));}}}else l.a.error("Unexpected format for encrypted event, expected object with `ciphertext` and `nonce` fields, got: "+n);else l.a.debug("Received encrypted event before key has been retrieved from the authEndpoint");},n.prototype.getDataToEmit=function(t){var n=Object(G.decode)(t);try{return JSON.parse(n)}catch(t){return n}},n}(q),$=e(4),tt=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),nt=function(t){function n(n,e){var r=t.call(this)||this;r.state="initialized",r.connection=null,r.key=n,r.options=e,r.timeline=r.options.timeline,r.usingTLS=r.options.useTLS,r.errorCallbacks=r.buildErrorCallbacks(),r.connectionCallbacks=r.buildConnectionCallbacks(r.errorCallbacks),r.handshakeCallbacks=r.buildHandshakeCallbacks(r.errorCallbacks);var o=It.getNetwork();return o.bind("online",(function(){r.timeline.info({netinfo:"online"}),"connecting"!==r.state&&"unavailable"!==r.state||r.retryIn(0);})),o.bind("offline",(function(){r.timeline.info({netinfo:"offline"}),r.connection&&r.sendActivityCheck();})),r.updateStrategy(),r}return tt(n,t),n.prototype.connect=function(){this.connection||this.runner||(this.strategy.isSupported()?(this.updateState("connecting"),this.startConnecting(),this.setUnavailableTimer()):this.updateState("failed"));},n.prototype.send=function(t){return !!this.connection&&this.connection.send(t)},n.prototype.send_event=function(t,n,e){return !!this.connection&&this.connection.send_event(t,n,e)},n.prototype.disconnect=function(){this.disconnectInternally(),this.updateState("disconnected");},n.prototype.isUsingTLS=function(){return this.usingTLS},n.prototype.startConnecting=function(){var t=this,n=function(e,r){e?t.runner=t.strategy.connect(0,n):"error"===r.action?(t.emit("error",{type:"HandshakeError",error:r.error}),t.timeline.error({handshakeError:r.error})):(t.abortConnecting(),t.handshakeCallbacks[r.action](r));};this.runner=this.strategy.connect(0,n);},n.prototype.abortConnecting=function(){this.runner&&(this.runner.abort(),this.runner=null);},n.prototype.disconnectInternally=function(){(this.abortConnecting(),this.clearRetryTimer(),this.clearUnavailableTimer(),this.connection)&&this.abandonConnection().close();},n.prototype.updateStrategy=function(){this.strategy=this.options.getStrategy({key:this.key,timeline:this.timeline,useTLS:this.usingTLS});},n.prototype.retryIn=function(t){var n=this;this.timeline.info({action:"retry",delay:t}),t>0&&this.emit("connecting_in",Math.round(t/1e3)),this.retryTimer=new $.a(t||0,(function(){n.disconnectInternally(),n.connect();}));},n.prototype.clearRetryTimer=function(){this.retryTimer&&(this.retryTimer.ensureAborted(),this.retryTimer=null);},n.prototype.setUnavailableTimer=function(){var t=this;this.unavailableTimer=new $.a(this.options.unavailableTimeout,(function(){t.updateState("unavailable");}));},n.prototype.clearUnavailableTimer=function(){this.unavailableTimer&&this.unavailableTimer.ensureAborted();},n.prototype.sendActivityCheck=function(){var t=this;this.stopActivityCheck(),this.connection.ping(),this.activityTimer=new $.a(this.options.pongTimeout,(function(){t.timeline.error({pong_timed_out:t.options.pongTimeout}),t.retryIn(0);}));},n.prototype.resetActivityCheck=function(){var t=this;this.stopActivityCheck(),this.connection&&!this.connection.handlesActivityChecks()&&(this.activityTimer=new $.a(this.activityTimeout,(function(){t.sendActivityCheck();})));},n.prototype.stopActivityCheck=function(){this.activityTimer&&this.activityTimer.ensureAborted();},n.prototype.buildConnectionCallbacks=function(t){var n=this;return r.f({},t,{message:function(t){n.resetActivityCheck(),n.emit("message",t);},ping:function(){n.send_event("pusher:pong",{});},activity:function(){n.resetActivityCheck();},error:function(t){n.emit("error",t);},closed:function(){n.abandonConnection(),n.shouldRetry()&&n.retryIn(1e3);}})},n.prototype.buildHandshakeCallbacks=function(t){var n=this;return r.f({},t,{connected:function(t){n.activityTimeout=Math.min(n.options.activityTimeout,t.activityTimeout,t.connection.activityTimeout||1/0),n.clearUnavailableTimer(),n.setConnection(t.connection),n.socket_id=n.connection.id,n.updateState("connected",{socket_id:n.socket_id});}})},n.prototype.buildErrorCallbacks=function(){var t=this,n=function(n){return function(e){e.error&&t.emit("error",{type:"WebSocketError",error:e.error}),n(e);}};return {tls_only:n((function(){t.usingTLS=!0,t.updateStrategy(),t.retryIn(0);})),refused:n((function(){t.disconnect();})),backoff:n((function(){t.retryIn(1e3);})),retry:n((function(){t.retryIn(0);}))}},n.prototype.setConnection=function(t){for(var n in this.connection=t,this.connectionCallbacks)this.connection.bind(n,this.connectionCallbacks[n]);this.resetActivityCheck();},n.prototype.abandonConnection=function(){if(this.connection){for(var t in this.stopActivityCheck(),this.connectionCallbacks)this.connection.unbind(t,this.connectionCallbacks[t]);var n=this.connection;return this.connection=null,n}},n.prototype.updateState=function(t,n){var e=this.state;if(this.state=t,e!==t){var r=t;"connected"===r&&(r+=" with new socket ID "+n.socket_id),l.a.debug("State changed",e+" -> "+r),this.timeline.info({state:t,params:n}),this.emit("state_change",{previous:e,current:t}),this.emit(t,n);}},n.prototype.shouldRetry=function(){return "connecting"===this.state||"connected"===this.state},n}(f.a),et=function(){function t(){this.channels={};}return t.prototype.add=function(t,n){return this.channels[t]||(this.channels[t]=function(t,n){if(0===t.indexOf("private-encrypted-")){if(n.config.nacl)return rt.createEncryptedChannel(t,n,n.config.nacl);var e=H("encryptedChannelSupport");throw new M("Tried to subscribe to a private-encrypted- channel but no nacl implementation available. "+e)}if(0===t.indexOf("private-"))return rt.createPrivateChannel(t,n);if(0===t.indexOf("presence-"))return rt.createPresenceChannel(t,n);if(0===t.indexOf("#"))throw new L('Cannot create a channel with name "'+t+'".');return rt.createChannel(t,n)}(t,n)),this.channels[t]},t.prototype.all=function(){return r.n(this.channels)},t.prototype.find=function(t){return this.channels[t]},t.prototype.remove=function(t){var n=this.channels[t];return delete this.channels[t],n},t.prototype.disconnect=function(){r.k(this.channels,(function(t){t.disconnect();}));},t}();var rt={createChannels:function(){return new et},createConnectionManager:function(t,n){return new nt(t,n)},createChannel:function(t,n){return new B(t,n)},createPrivateChannel:function(t,n){return new q(t,n)},createPresenceChannel:function(t,n){return new W(t,n)},createEncryptedChannel:function(t,n,e){return new Q(t,n,e)},createTimelineSender:function(t,n){return new A(t,n)},createHandshake:function(t,n){return new O(t,n)},createAssistantToTheTransportManager:function(t,n,e){return new S(t,n,e)}},ot=function(){function t(t){this.options=t||{},this.livesLeft=this.options.lives||1/0;}return t.prototype.getAssistant=function(t){return rt.createAssistantToTheTransportManager(this,t,{minPingDelay:this.options.minPingDelay,maxPingDelay:this.options.maxPingDelay})},t.prototype.isAlive=function(){return this.livesLeft>0},t.prototype.reportDeath=function(){this.livesLeft-=1;},t}(),it=function(){function t(t,n){this.strategies=t,this.loop=Boolean(n.loop),this.failFast=Boolean(n.failFast),this.timeout=n.timeout,this.timeoutLimit=n.timeoutLimit;}return t.prototype.isSupported=function(){return r.b(this.strategies,h.a.method("isSupported"))},t.prototype.connect=function(t,n){var e=this,r=this.strategies,o=0,i=this.timeout,s=null,a=function(c,u){u?n(null,u):(o+=1,e.loop&&(o%=r.length),o<r.length?(i&&(i*=2,e.timeoutLimit&&(i=Math.min(i,e.timeoutLimit))),s=e.tryStrategy(r[o],t,{timeout:i,failFast:e.failFast},a)):n(!0));};return s=this.tryStrategy(r[o],t,{timeout:i,failFast:this.failFast},a),{abort:function(){s.abort();},forceMinPriority:function(n){t=n,s&&s.forceMinPriority(n);}}},t.prototype.tryStrategy=function(t,n,e,r){var o=null,i=null;return e.timeout>0&&(o=new $.a(e.timeout,(function(){i.abort(),r(!0);}))),i=t.connect(n,(function(t,n){t&&o&&o.isRunning()&&!e.failFast||(o&&o.ensureAborted(),r(t,n));})),{abort:function(){o&&o.ensureAborted(),i.abort();},forceMinPriority:function(t){i.forceMinPriority(t);}}},t}(),st=function(){function t(t){this.strategies=t;}return t.prototype.isSupported=function(){return r.b(this.strategies,h.a.method("isSupported"))},t.prototype.connect=function(t,n){return function(t,n,e){var o=r.j(t,(function(t,r,o,i){return t.connect(n,e(r,i))}));return {abort:function(){r.c(o,at);},forceMinPriority:function(t){r.c(o,(function(n){n.forceMinPriority(t);}));}}}(this.strategies,t,(function(t,e){return function(o,i){e[t].error=o,o?function(t){return r.a(t,(function(t){return Boolean(t.error)}))}(e)&&n(!0):(r.c(e,(function(t){t.forceMinPriority(i.transport.priority);})),n(null,i));}}))},t}();function at(t){t.error||t.aborted||(t.abort(),t.aborted=!0);}var ct=function(){function t(t,n,e){this.strategy=t,this.transports=n,this.ttl=e.ttl||18e5,this.usingTLS=e.useTLS,this.timeline=e.timeline;}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,n){var e=this.usingTLS,o=function(t){var n=It.getLocalStorage();if(n)try{var e=n[ut(t)];if(e)return JSON.parse(e)}catch(n){ht(t);}return null}(e),i=[this.strategy];if(o&&o.timestamp+this.ttl>=h.a.now()){var s=this.transports[o.transport];s&&(this.timeline.info({cached:!0,transport:o.transport,latency:o.latency}),i.push(new it([s],{timeout:2*o.latency+1e3,failFast:!0})));}var a=h.a.now(),c=i.pop().connect(t,(function o(s,u){s?(ht(e),i.length>0?(a=h.a.now(),c=i.pop().connect(t,o)):n(s)):(!function(t,n,e){var o=It.getLocalStorage();if(o)try{o[ut(t)]=r.l({timestamp:h.a.now(),transport:n,latency:e});}catch(t){}}(e,u.transport.name,h.a.now()-a),n(null,u));}));return {abort:function(){c.abort();},forceMinPriority:function(n){t=n,c&&c.forceMinPriority(n);}}},t}();function ut(t){return "pusherTransport"+(t?"TLS":"NonTLS")}function ht(t){var n=It.getLocalStorage();if(n)try{delete n[ut(t)];}catch(t){}}var ft=function(){function t(t,n){var e=n.delay;this.strategy=t,this.options={delay:e};}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,n){var e,r=this.strategy,o=new $.a(this.options.delay,(function(){e=r.connect(t,n);}));return {abort:function(){o.ensureAborted(),e&&e.abort();},forceMinPriority:function(n){t=n,e&&e.forceMinPriority(n);}}},t}(),lt=function(){function t(t,n,e){this.test=t,this.trueBranch=n,this.falseBranch=e;}return t.prototype.isSupported=function(){return (this.test()?this.trueBranch:this.falseBranch).isSupported()},t.prototype.connect=function(t,n){return (this.test()?this.trueBranch:this.falseBranch).connect(t,n)},t}(),pt=function(){function t(t){this.strategy=t;}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,n){var e=this.strategy.connect(t,(function(t,r){r&&e.abort(),n(t,r);}));return e},t}();function dt(t){return function(){return t.isSupported()}}var yt,gt=function(t,n,e){var o={};function i(n,r,i,s,a){var c=e(t,n,r,i,s,a);return o[n]=c,c}var s,a=Object.assign({},n,{hostNonTLS:t.wsHost+":"+t.wsPort,hostTLS:t.wsHost+":"+t.wssPort,httpPath:t.wsPath}),c=r.f({},a,{useTLS:!0}),u=Object.assign({},n,{hostNonTLS:t.httpHost+":"+t.httpPort,hostTLS:t.httpHost+":"+t.httpsPort,httpPath:t.httpPath}),h={loop:!0,timeout:15e3,timeoutLimit:6e4},f=new ot({lives:2,minPingDelay:1e4,maxPingDelay:t.activityTimeout}),l=new ot({lives:2,minPingDelay:1e4,maxPingDelay:t.activityTimeout}),p=i("ws","ws",3,a,f),d=i("wss","ws",3,c,f),y=i("xhr_streaming","xhr_streaming",1,u,l),g=i("xhr_polling","xhr_polling",1,u),v=new it([p],h),b=new it([d],h),m=new it([y],h),_=new it([g],h),w=new it([new lt(dt(m),new st([m,new ft(_,{delay:4e3})]),_)],h);return s=n.useTLS?new st([v,new ft(w,{delay:2e3})]):new st([v,new ft(b,{delay:2e3}),new ft(w,{delay:5e3})]),new ct(new pt(new lt(dt(p),s,w)),o,{ttl:18e5,timeline:n.timeline,useTLS:n.useTLS})},vt=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),bt=function(t){function n(n,e,r){var o=t.call(this)||this;return o.hooks=n,o.method=e,o.url=r,o}return vt(n,t),n.prototype.start=function(t){var n=this;this.position=0,this.xhr=this.hooks.getRequest(this),this.unloader=function(){n.close();},It.addUnloadListener(this.unloader),this.xhr.open(this.method,this.url,!0),this.xhr.setRequestHeader&&this.xhr.setRequestHeader("Content-Type","application/json"),this.xhr.send(t);},n.prototype.close=function(){this.unloader&&(It.removeUnloadListener(this.unloader),this.unloader=null),this.xhr&&(this.hooks.abortRequest(this.xhr),this.xhr=null);},n.prototype.onChunk=function(t,n){for(;;){var e=this.advanceBuffer(n);if(!e)break;this.emit("chunk",{status:t,data:e});}this.isBufferTooLong(n)&&this.emit("buffer_too_long");},n.prototype.advanceBuffer=function(t){var n=t.slice(this.position),e=n.indexOf("\n");return -1!==e?(this.position+=e+1,n.slice(0,e)):null},n.prototype.isBufferTooLong=function(t){return this.position===t.length&&t.length>262144},n}(f.a);!function(t){t[t.CONNECTING=0]="CONNECTING",t[t.OPEN=1]="OPEN",t[t.CLOSED=3]="CLOSED";}(yt||(yt={}));var mt=yt,_t=1;function wt(t){var n=-1===t.indexOf("?")?"?":"&";return t+n+"t="+ +new Date+"&n="+_t++}function St(t){return Math.floor(Math.random()*t)}var kt=function(){function t(t,n){this.hooks=t,this.session=St(1e3)+"/"+function(t){for(var n=[],e=0;e<t;e++)n.push(St(32).toString(32));return n.join("")}(8),this.location=function(t){var n=/([^\?]*)\/*(\??.*)/.exec(t);return {base:n[1],queryString:n[2]}}(n),this.readyState=mt.CONNECTING,this.openStream();}return t.prototype.send=function(t){return this.sendRaw(JSON.stringify([t]))},t.prototype.ping=function(){this.hooks.sendHeartbeat(this);},t.prototype.close=function(t,n){this.onClose(t,n,!0);},t.prototype.sendRaw=function(t){if(this.readyState!==mt.OPEN)return !1;try{return It.createSocketRequest("POST",wt((n=this.location,e=this.session,n.base+"/"+e+"/xhr_send"))).start(t),!0}catch(t){return !1}var n,e;},t.prototype.reconnect=function(){this.closeStream(),this.openStream();},t.prototype.onClose=function(t,n,e){this.closeStream(),this.readyState=mt.CLOSED,this.onclose&&this.onclose({code:t,reason:n,wasClean:e});},t.prototype.onChunk=function(t){var n;if(200===t.status)switch(this.readyState===mt.OPEN&&this.onActivity(),t.data.slice(0,1)){case"o":n=JSON.parse(t.data.slice(1)||"{}"),this.onOpen(n);break;case"a":n=JSON.parse(t.data.slice(1)||"[]");for(var e=0;e<n.length;e++)this.onEvent(n[e]);break;case"m":n=JSON.parse(t.data.slice(1)||"null"),this.onEvent(n);break;case"h":this.hooks.onHeartbeat(this);break;case"c":n=JSON.parse(t.data.slice(1)||"[]"),this.onClose(n[0],n[1],!0);}},t.prototype.onOpen=function(t){var n,e,r;this.readyState===mt.CONNECTING?(t&&t.hostname&&(this.location.base=(n=this.location.base,e=t.hostname,(r=/(https?:\/\/)([^\/:]+)((\/|:)?.*)/.exec(n))[1]+e+r[3])),this.readyState=mt.OPEN,this.onopen&&this.onopen()):this.onClose(1006,"Server lost session",!0);},t.prototype.onEvent=function(t){this.readyState===mt.OPEN&&this.onmessage&&this.onmessage({data:t});},t.prototype.onActivity=function(){this.onactivity&&this.onactivity();},t.prototype.onError=function(t){this.onerror&&this.onerror(t);},t.prototype.openStream=function(){var t=this;this.stream=It.createSocketRequest("POST",wt(this.hooks.getReceiveURL(this.location,this.session))),this.stream.bind("chunk",(function(n){t.onChunk(n);})),this.stream.bind("finished",(function(n){t.hooks.onFinished(t,n);})),this.stream.bind("buffer_too_long",(function(){t.reconnect();}));try{this.stream.start();}catch(n){h.a.defer((function(){t.onError(n),t.onClose(1006,"Could not start streaming",!1);}));}},t.prototype.closeStream=function(){this.stream&&(this.stream.unbind_all(),this.stream.close(),this.stream=null);},t}(),Ct={getReceiveURL:function(t,n){return t.base+"/"+n+"/xhr_streaming"+t.queryString},onHeartbeat:function(t){t.sendRaw("[]");},sendHeartbeat:function(t){t.sendRaw("[]");},onFinished:function(t,n){t.onClose(1006,"Connection interrupted ("+n+")",!1);}},Tt={getReceiveURL:function(t,n){return t.base+"/"+n+"/xhr"+t.queryString},onHeartbeat:function(){},sendHeartbeat:function(t){t.sendRaw("[]");},onFinished:function(t,n){200===n?t.reconnect():t.onClose(1006,"Connection interrupted ("+n+")",!1);}},Pt={getRequest:function(t){var n=new(It.getXHRAPI());return n.onreadystatechange=n.onprogress=function(){switch(n.readyState){case 3:n.responseText&&n.responseText.length>0&&t.onChunk(n.status,n.responseText);break;case 4:n.responseText&&n.responseText.length>0&&t.onChunk(n.status,n.responseText),t.emit("finished",n.status),t.close();}},n},abortRequest:function(t){t.onreadystatechange=null,t.abort();}},Ot={getDefaultStrategy:gt,Transports:w,transportConnectionInitializer:function(){this.timeline.info(this.buildTimelineMessage({transport:this.name+(this.options.useTLS?"s":"")})),this.hooks.isInitialized()?this.changeState("initialized"):this.onClose();},HTTPFactory:{createStreamingSocket:function(t){return this.createSocket(Ct,t)},createPollingSocket:function(t){return this.createSocket(Tt,t)},createSocket:function(t,n){return new kt(t,n)},createXHR:function(t,n){return this.createRequest(Pt,t,n)},createRequest:function(t,n,e){return new bt(t,n,e)}},setup:function(t){t.ready();},getLocalStorage:function(){},getClientFeatures:function(){return r.i(r.h({ws:w.ws},(function(t){return t.isSupported({})})))},getProtocol:function(){return "http:"},isXHRSupported:function(){return !0},createSocketRequest:function(t,n){if(this.isXHRSupported())return this.HTTPFactory.createXHR(t,n);throw "Cross-origin HTTP requests are not supported"},createXHR:function(){return new(this.getXHRAPI())},createWebSocket:function(t){return new(this.getWebSocketAPI())(t)},addUnloadListener:function(t){},removeUnloadListener:function(t){}},At=e(9),Et=e.n(At),xt=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}();function Lt(t){return "none"!==t.type.toLowerCase()}var Ut,Rt=new(function(t){function n(){var n=t.call(this)||this;return n.online=!0,Et.a.fetch().then((function(t){n.online=Lt(t);})),Et.a.addEventListener((function(t){var e=Lt(t);n.online!==e&&(n.online=e,n.online?n.emit("online"):n.emit("offline"));})),n}return xt(n,t),n.prototype.isOnline=function(){return this.online},n}(f.a));!function(t){t.UserAuthentication="user-authentication",t.ChannelAuthorization="channel-authorization";}(Ut||(Ut={}));var Mt,jt=function(t,n,e,r,o){var i=It.createXHR();for(var s in i.open("POST",e.endpoint,!0),i.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),e.headers)i.setRequestHeader(s,e.headers[s]);return i.onreadystatechange=function(){if(4===i.readyState)if(200===i.status){var t=void 0,n=!1;try{t=JSON.parse(i.responseText),n=!0;}catch(t){o(new N(200,"JSON returned from "+r.toString()+" endpoint was invalid, yet status code was 200. Data was: "+i.responseText),null);}n&&o(null,t);}else {var s="";switch(r){case Ut.UserAuthentication:s=H("authenticationEndpoint");break;case Ut.ChannelAuthorization:s="Clients must be authenticated to join private or presence channels. "+H("authorizationEndpoint");}o(new N(i.status,"Unable to retrieve auth string from "+r.toString()+" endpoint - received status: "+i.status+" from "+e.endpoint+". "+s),null);}},i.send(n),i},It={getDefaultStrategy:Ot.getDefaultStrategy,Transports:Ot.Transports,setup:Ot.setup,getProtocol:Ot.getProtocol,isXHRSupported:Ot.isXHRSupported,getLocalStorage:Ot.getLocalStorage,createXHR:Ot.createXHR,createWebSocket:Ot.createWebSocket,addUnloadListener:Ot.addUnloadListener,removeUnloadListener:Ot.removeUnloadListener,transportConnectionInitializer:Ot.transportConnectionInitializer,createSocketRequest:Ot.createSocketRequest,HTTPFactory:Ot.HTTPFactory,TimelineTransport:{name:"xhr",getAgent:function(t,n){return function(e,o){var i="http"+(n?"s":"")+"://"+(t.host||t.options.host)+t.options.path;i+="/2?"+r.e(e);var s=It.createXHR();s.open("GET",i,!0),s.onreadystatechange=function(){if(4===s.readyState){var n=s.status,e=s.responseText;if(200!==n)return void l.a.debug("TimelineSender Error: received "+n+" from stats.pusher.com");try{var r=JSON.parse(e).host;}catch(t){l.a.debug("TimelineSenderError: invalid response "+e);}r&&(t.host=r);}},s.send();}}},getAuthorizers:function(){return {ajax:jt}},getWebSocketAPI:function(){return WebSocket},getXHRAPI:function(){return XMLHttpRequest},getNetwork:function(){return Rt}};!function(t){t[t.ERROR=3]="ERROR",t[t.INFO=6]="INFO",t[t.DEBUG=7]="DEBUG";}(Mt||(Mt={}));var Nt=Mt,Dt=function(){function t(t,n,e){this.key=t,this.session=n,this.events=[],this.options=e||{},this.sent=0,this.uniqueID=0;}return t.prototype.log=function(t,n){t<=this.options.level&&(this.events.push(r.f({},n,{timestamp:h.a.now()})),this.options.limit&&this.events.length>this.options.limit&&this.events.shift());},t.prototype.error=function(t){this.log(Nt.ERROR,t);},t.prototype.info=function(t){this.log(Nt.INFO,t);},t.prototype.debug=function(t){this.log(Nt.DEBUG,t);},t.prototype.isEmpty=function(){return 0===this.events.length},t.prototype.send=function(t,n){var e=this,o=r.f({session:this.session,bundle:this.sent+1,key:this.key,lib:"js",version:this.options.version,cluster:this.options.cluster,features:this.options.features,timeline:this.events},this.options.params);return this.events=[],t(o,(function(t,r){t||e.sent++,n&&n(t,r);})),!0},t.prototype.generateUniqueID=function(){return this.uniqueID++,this.uniqueID},t}(),Ht=function(){function t(t,n,e,r){this.name=t,this.priority=n,this.transport=e,this.options=r||{};}return t.prototype.isSupported=function(){return this.transport.isSupported({useTLS:this.options.useTLS})},t.prototype.connect=function(t,n){var e=this;if(!this.isSupported())return zt(new I,n);if(this.priority<t)return zt(new U,n);var o=!1,i=this.transport.createConnection(this.name,this.priority,this.options.key,this.options),s=null,a=function(){i.unbind("initialized",a),i.connect();},c=function(){s=rt.createHandshake(i,(function(t){o=!0,f(),n(null,t);}));},u=function(t){f(),n(t);},h=function(){var t;f(),t=r.l(i),n(new R(t));},f=function(){i.unbind("initialized",a),i.unbind("open",c),i.unbind("error",u),i.unbind("closed",h);};return i.bind("initialized",a),i.bind("open",c),i.bind("error",u),i.bind("closed",h),i.initialize(),{abort:function(){o||(f(),s?s.close():i.close());},forceMinPriority:function(t){o||e.priority<t&&(s?s.close():i.close());}}},t}();function zt(t,n){return h.a.defer((function(){n(t);})),{abort:function(){},forceMinPriority:function(){}}}var Bt=It.Transports,Ft=function(t,n,e,o,i,s){var a,c=Bt[e];if(!c)throw new j(e);return !(t.enabledTransports&&-1===r.d(t.enabledTransports,n)||t.disabledTransports&&-1!==r.d(t.disabledTransports,n))?(i=Object.assign({ignoreNullOrigin:t.ignoreNullOrigin},i),a=new Ht(n,o,s?s.getAssistant(c):c,i)):a=qt,a},qt={isSupported:function(){return !1},connect:function(t,n){var e=h.a.defer((function(){n(new I);}));return {abort:function(){e.ensureAborted();},forceMinPriority:function(){}}}},Yt=function(t){if(void 0===It.getAuthorizers()[t.transport])throw "'"+t.transport+"' is not a recognized auth transport";return function(n,e){var r=function(t,n){var e="socket_id="+encodeURIComponent(t.socketId);for(var r in n.params)e+="&"+encodeURIComponent(r)+"="+encodeURIComponent(n.params[r]);return e}(n,t);It.getAuthorizers()[t.transport](It,r,t,Ut.UserAuthentication,e);}},Kt=function(t){if(void 0===It.getAuthorizers()[t.transport])throw "'"+t.transport+"' is not a recognized auth transport";return function(n,e){var r=function(t,n){var e="socket_id="+encodeURIComponent(t.socketId);for(var r in e+="&channel_name="+encodeURIComponent(t.channelName),n.params)e+="&"+encodeURIComponent(r)+"="+encodeURIComponent(n.params[r]);return e}(n,t);It.getAuthorizers()[t.transport](It,r,t,Ut.ChannelAuthorization,e);}},Jt=function(){return (Jt=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t}).apply(this,arguments)};function Xt(t){return t.httpHost?t.httpHost:t.cluster?"sockjs-"+t.cluster+".pusher.com":o.httpHost}function Wt(t){return t.wsHost?t.wsHost:t.cluster?Gt(t.cluster):Gt(o.cluster)}function Gt(t){return "ws-"+t+".pusher.com"}function Vt(t){return "https:"===It.getProtocol()||!1!==t.forceTLS}function Zt(t){return "enableStats"in t?t.enableStats:"disableStats"in t&&!t.disableStats}function Qt(t){var n=Jt({},o.userAuthentication,t.userAuthentication);return "customHandler"in n&&null!=n.customHandler?n.customHandler:Yt(n)}function $t(t,n){var e=function(t,n){var e;return "channelAuthorization"in t?e=Jt({},o.channelAuthorization,t.channelAuthorization):(e={transport:t.authTransport||o.authTransport,endpoint:t.authEndpoint||o.authEndpoint},"auth"in t&&("params"in t.auth&&(e.params=t.auth.params),"headers"in t.auth&&(e.headers=t.auth.headers)),"authorizer"in t&&(e.customHandler=function(t,n,e){var r={authTransport:n.transport,authEndpoint:n.endpoint,auth:{params:n.params,headers:n.headers}};return function(n,o){var i=t.channel(n.channelName);e(i,r).authorize(n.socketId,o);}}(n,e,t.authorizer))),e}(t,n);return "customHandler"in e&&null!=e.customHandler?e.customHandler:Kt(e)}var tn=function(){var t,n;return {promise:new Promise((function(e,r){t=e,n=r;})),resolve:t,reject:n}},nn=function(){var t=function(n,e){return (t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(n,e)};return function(n,e){function r(){this.constructor=n;}t(n,e),n.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r);}}(),en=function(t){function n(n){var e=t.call(this,(function(t,n){l.a.debug("No callbacks on user for "+t);}))||this;return e.signin_requested=!1,e.user_data=null,e.serverToUserChannel=null,e.signinDonePromise=null,e._signinDoneResolve=null,e._onAuthorize=function(t,n){if(t)return l.a.warn("Error during signin: "+t),void e._cleanup();e.pusher.send_event("pusher:signin",{auth:n.auth,user_data:n.user_data});},e.pusher=n,e.pusher.connection.bind("state_change",(function(t){var n=t.previous,r=t.current;"connected"!==n&&"connected"===r&&e._signin(),"connected"===n&&"connected"!==r&&(e._cleanup(),e._newSigninPromiseIfNeeded());})),e.pusher.connection.bind("message",(function(t){"pusher:signin_success"===t.event&&e._onSigninSuccess(t.data),e.serverToUserChannel&&e.serverToUserChannel.name===t.channel&&e.serverToUserChannel.handleEvent(t);})),e}return nn(n,t),n.prototype.signin=function(){this.signin_requested||(this.signin_requested=!0,this._signin());},n.prototype._signin=function(){this.signin_requested&&(this._newSigninPromiseIfNeeded(),"connected"===this.pusher.connection.state&&this.pusher.config.userAuthenticator({socketId:this.pusher.connection.socket_id},this._onAuthorize));},n.prototype._onSigninSuccess=function(t){try{this.user_data=JSON.parse(t.user_data);}catch(n){return l.a.error("Failed parsing user data after signin: "+t.user_data),void this._cleanup()}if("string"!=typeof this.user_data.id||""===this.user_data.id)return l.a.error("user_data doesn't contain an id. user_data: "+this.user_data),void this._cleanup();this._signinDoneResolve(),this._subscribeChannels();},n.prototype._subscribeChannels=function(){var t,n=this;this.serverToUserChannel=new B("#server-to-user-"+this.user_data.id,this.pusher),this.serverToUserChannel.bind_global((function(t,e){0!==t.indexOf("pusher_internal:")&&0!==t.indexOf("pusher:")&&n.emit(t,e);})),(t=this.serverToUserChannel).subscriptionPending&&t.subscriptionCancelled?t.reinstateSubscription():t.subscriptionPending||"connected"!==n.pusher.connection.state||t.subscribe();},n.prototype._cleanup=function(){this.user_data=null,this.serverToUserChannel&&(this.serverToUserChannel.unbind_all(),this.serverToUserChannel.disconnect(),this.serverToUserChannel=null),this.signin_requested&&this._signinDoneResolve();},n.prototype._newSigninPromiseIfNeeded=function(){if(this.signin_requested&&(!this.signinDonePromise||this.signinDonePromise.done)){var t=tn(),n=t.promise,e=t.resolve;t.reject;n.done=!1;var r=function(){n.done=!0;};n.then(r).catch(r),this.signinDonePromise=n,this._signinDoneResolve=e;}},n}(f.a),rn=function(){function t(n,e){var r,i,s,a=this;if(function(t){if(null==t)throw "You must pass your app key when you instantiate Pusher."}(n),!(e=e||{}).cluster&&!e.wsHost&&!e.httpHost){var c=H("javascriptQuickStart");l.a.warn("You should always specify a cluster when connecting. "+c);}"disableStats"in e&&l.a.warn("The disableStats option is deprecated in favor of enableStats"),this.key=n,this.config=(i=this,s={activityTimeout:(r=e).activityTimeout||o.activityTimeout,cluster:r.cluster||o.cluster,httpPath:r.httpPath||o.httpPath,httpPort:r.httpPort||o.httpPort,httpsPort:r.httpsPort||o.httpsPort,pongTimeout:r.pongTimeout||o.pongTimeout,statsHost:r.statsHost||o.stats_host,unavailableTimeout:r.unavailableTimeout||o.unavailableTimeout,wsPath:r.wsPath||o.wsPath,wsPort:r.wsPort||o.wsPort,wssPort:r.wssPort||o.wssPort,enableStats:Zt(r),httpHost:Xt(r),useTLS:Vt(r),wsHost:Wt(r),userAuthenticator:Qt(r),channelAuthorizer:$t(r,i)},"disabledTransports"in r&&(s.disabledTransports=r.disabledTransports),"enabledTransports"in r&&(s.enabledTransports=r.enabledTransports),"ignoreNullOrigin"in r&&(s.ignoreNullOrigin=r.ignoreNullOrigin),"timelineParams"in r&&(s.timelineParams=r.timelineParams),"nacl"in r&&(s.nacl=r.nacl),s),this.channels=rt.createChannels(),this.global_emitter=new f.a,this.sessionID=Math.floor(1e9*Math.random()),this.timeline=new Dt(this.key,this.sessionID,{cluster:this.config.cluster,features:t.getClientFeatures(),params:this.config.timelineParams||{},limit:50,level:Nt.INFO,version:o.VERSION}),this.config.enableStats&&(this.timelineSender=rt.createTimelineSender(this.timeline,{host:this.config.statsHost,path:"/timeline/v2/"+It.TimelineTransport.name}));this.connection=rt.createConnectionManager(this.key,{getStrategy:function(t){return It.getDefaultStrategy(a.config,t,Ft)},timeline:this.timeline,activityTimeout:this.config.activityTimeout,pongTimeout:this.config.pongTimeout,unavailableTimeout:this.config.unavailableTimeout,useTLS:Boolean(this.config.useTLS)}),this.connection.bind("connected",(function(){a.subscribeAll(),a.timelineSender&&a.timelineSender.send(a.connection.isUsingTLS());})),this.connection.bind("message",(function(t){var n=0===t.event.indexOf("pusher_internal:");if(t.channel){var e=a.channel(t.channel);e&&e.handleEvent(t);}n||a.global_emitter.emit(t.event,t.data);})),this.connection.bind("connecting",(function(){a.channels.disconnect();})),this.connection.bind("disconnected",(function(){a.channels.disconnect();})),this.connection.bind("error",(function(t){l.a.warn(t);})),t.instances.push(this),this.timeline.info({instances:t.instances.length}),this.user=new en(this),t.isReady&&this.connect();}return t.ready=function(){t.isReady=!0;for(var n=0,e=t.instances.length;n<e;n++)t.instances[n].connect();},t.getClientFeatures=function(){return r.i(r.h({ws:It.Transports.ws},(function(t){return t.isSupported({})})))},t.prototype.channel=function(t){return this.channels.find(t)},t.prototype.allChannels=function(){return this.channels.all()},t.prototype.connect=function(){if(this.connection.connect(),this.timelineSender&&!this.timelineSenderTimer){var t=this.connection.isUsingTLS(),n=this.timelineSender;this.timelineSenderTimer=new $.b(6e4,(function(){n.send(t);}));}},t.prototype.disconnect=function(){this.connection.disconnect(),this.timelineSenderTimer&&(this.timelineSenderTimer.ensureAborted(),this.timelineSenderTimer=null);},t.prototype.bind=function(t,n,e){return this.global_emitter.bind(t,n,e),this},t.prototype.unbind=function(t,n,e){return this.global_emitter.unbind(t,n,e),this},t.prototype.bind_global=function(t){return this.global_emitter.bind_global(t),this},t.prototype.unbind_global=function(t){return this.global_emitter.unbind_global(t),this},t.prototype.unbind_all=function(t){return this.global_emitter.unbind_all(),this},t.prototype.subscribeAll=function(){var t;for(t in this.channels.channels)this.channels.channels.hasOwnProperty(t)&&this.subscribe(t);},t.prototype.subscribe=function(t){var n=this.channels.add(t,this);return n.subscriptionPending&&n.subscriptionCancelled?n.reinstateSubscription():n.subscriptionPending||"connected"!==this.connection.state||n.subscribe(),n},t.prototype.unsubscribe=function(t){var n=this.channels.find(t);n&&n.subscriptionPending?n.cancelSubscription():(n=this.channels.remove(t))&&n.subscribed&&n.unsubscribe();},t.prototype.send_event=function(t,n,e){return this.connection.send_event(t,n,e)},t.prototype.shouldUseTLS=function(){return this.config.useTLS},t.prototype.signin=function(){this.user.signin();},t.instances=[],t.isReady=!1,t.logToConsole=!1,t.Runtime=It,t.ScriptReceivers=It.ScriptReceivers,t.DependenciesReceivers=It.DependenciesReceivers,t.auth_callbacks=It.auth_callbacks,t}();n.a=rn;It.setup(rn);},function(t,n){var e;e=function(){return this}();try{e=e||new Function("return this")();}catch(t){"object"==typeof window&&(e=window);}t.exports=e;},function(t,n,e){var r,o=this&&this.__extends||(r=function(t,n){return (r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(t,n)},function(t,n){function e(){this.constructor=t;}r(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e);});Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function t(t){void 0===t&&(t="="),this._paddingCharacter=t;}return t.prototype.encodedLength=function(t){return this._paddingCharacter?(t+2)/3*4|0:(8*t+5)/6|0},t.prototype.encode=function(t){for(var n="",e=0;e<t.length-2;e+=3){var r=t[e]<<16|t[e+1]<<8|t[e+2];n+=this._encodeByte(r>>>18&63),n+=this._encodeByte(r>>>12&63),n+=this._encodeByte(r>>>6&63),n+=this._encodeByte(r>>>0&63);}var o=t.length-e;if(o>0){r=t[e]<<16|(2===o?t[e+1]<<8:0);n+=this._encodeByte(r>>>18&63),n+=this._encodeByte(r>>>12&63),n+=2===o?this._encodeByte(r>>>6&63):this._paddingCharacter||"",n+=this._paddingCharacter||"";}return n},t.prototype.maxDecodedLength=function(t){return this._paddingCharacter?t/4*3|0:(6*t+7)/8|0},t.prototype.decodedLength=function(t){return this.maxDecodedLength(t.length-this._getPaddingLength(t))},t.prototype.decode=function(t){if(0===t.length)return new Uint8Array(0);for(var n=this._getPaddingLength(t),e=t.length-n,r=new Uint8Array(this.maxDecodedLength(e)),o=0,i=0,s=0,a=0,c=0,u=0,h=0;i<e-4;i+=4)a=this._decodeChar(t.charCodeAt(i+0)),c=this._decodeChar(t.charCodeAt(i+1)),u=this._decodeChar(t.charCodeAt(i+2)),h=this._decodeChar(t.charCodeAt(i+3)),r[o++]=a<<2|c>>>4,r[o++]=c<<4|u>>>2,r[o++]=u<<6|h,s|=256&a,s|=256&c,s|=256&u,s|=256&h;if(i<e-1&&(a=this._decodeChar(t.charCodeAt(i)),c=this._decodeChar(t.charCodeAt(i+1)),r[o++]=a<<2|c>>>4,s|=256&a,s|=256&c),i<e-2&&(u=this._decodeChar(t.charCodeAt(i+2)),r[o++]=c<<4|u>>>2,s|=256&u),i<e-3&&(h=this._decodeChar(t.charCodeAt(i+3)),r[o++]=u<<6|h,s|=256&h),0!==s)throw new Error("Base64Coder: incorrect characters for decoding");return r},t.prototype._encodeByte=function(t){var n=t;return n+=65,n+=25-t>>>8&6,n+=51-t>>>8&-75,n+=61-t>>>8&-15,n+=62-t>>>8&3,String.fromCharCode(n)},t.prototype._decodeChar=function(t){var n=256;return n+=(42-t&t-44)>>>8&-256+t-43+62,n+=(46-t&t-48)>>>8&-256+t-47+63,n+=(47-t&t-58)>>>8&-256+t-48+52,n+=(64-t&t-91)>>>8&-256+t-65+0,n+=(96-t&t-123)>>>8&-256+t-97+26},t.prototype._getPaddingLength=function(t){var n=0;if(this._paddingCharacter){for(var e=t.length-1;e>=0&&t[e]===this._paddingCharacter;e--)n++;if(t.length<4||n>2)throw new Error("Base64Coder: incorrect padding")}return n},t}();n.Coder=i;var s=new i;n.encode=function(t){return s.encode(t)},n.decode=function(t){return s.decode(t)};var a=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return o(n,t),n.prototype._encodeByte=function(t){var n=t;return n+=65,n+=25-t>>>8&6,n+=51-t>>>8&-75,n+=61-t>>>8&-13,n+=62-t>>>8&49,String.fromCharCode(n)},n.prototype._decodeChar=function(t){var n=256;return n+=(44-t&t-46)>>>8&-256+t-45+62,n+=(94-t&t-96)>>>8&-256+t-95+63,n+=(47-t&t-58)>>>8&-256+t-48+52,n+=(64-t&t-91)>>>8&-256+t-65+0,n+=(96-t&t-123)>>>8&-256+t-97+26},n}(i);n.URLSafeCoder=a;var c=new a;n.encodeURLSafe=function(t){return c.encode(t)},n.decodeURLSafe=function(t){return c.decode(t)},n.encodedLength=function(t){return s.encodedLength(t)},n.maxDecodedLength=function(t){return s.maxDecodedLength(t)},n.decodedLength=function(t){return s.decodedLength(t)};},function(t,n,e){var r=function(){function t(t,n,e,r){var o=this;this.clear=n,this.timer=t((function(){o.timer&&(o.timer=r(o.timer));}),e);}return t.prototype.isRunning=function(){return null!==this.timer},t.prototype.ensureAborted=function(){this.timer&&(this.clear(this.timer),this.timer=null);},t}();n.a=r;},function(t,n){t.exports=require$$0;},function(t,n,e){(function(t){function r(t){return l(h(t))}e.d(n,"a",(function(){return r}));for(var o=String.fromCharCode,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s={},a=0,c=i.length;a<c;a++)s[i.charAt(a)]=a;var u=function(t){var n=t.charCodeAt(0);return n<128?t:n<2048?o(192|n>>>6)+o(128|63&n):o(224|n>>>12&15)+o(128|n>>>6&63)+o(128|63&n)},h=function(t){return t.replace(/[^\x00-\x7F]/g,u)},f=function(t){var n=[0,2,1][t.length%3],e=t.charCodeAt(0)<<16|(t.length>1?t.charCodeAt(1):0)<<8|(t.length>2?t.charCodeAt(2):0);return [i.charAt(e>>>18),i.charAt(e>>>12&63),n>=2?"=":i.charAt(e>>>6&63),n>=1?"=":i.charAt(63&e)].join("")},l=t.btoa||function(t){return t.replace(/[\s\S]{1,3}/g,f)};}).call(this,e(6));},function(t,n,e){var r=e(0),o=function(){function t(){this._callbacks={};}return t.prototype.get=function(t){return this._callbacks[i(t)]},t.prototype.add=function(t,n,e){var r=i(t);this._callbacks[r]=this._callbacks[r]||[],this._callbacks[r].push({fn:n,context:e});},t.prototype.remove=function(t,n,e){if(t||n||e){var o=t?[i(t)]:r.i(this._callbacks);n||e?this.removeCallback(o,n,e):this.removeAllCallbacks(o);}else this._callbacks={};},t.prototype.removeCallback=function(t,n,e){r.c(t,(function(t){this._callbacks[t]=r.g(this._callbacks[t]||[],(function(t){return n&&n!==t.fn||e&&e!==t.context})),0===this._callbacks[t].length&&delete this._callbacks[t];}),this);},t.prototype.removeAllCallbacks=function(t){r.c(t,(function(t){delete this._callbacks[t];}),this);},t}();function i(t){return "_"+t}n.a=o;},function(t,n,e){Object.defineProperty(n,"__esModule",{value:!0});var r="utf8: invalid source encoding";function o(t){for(var n=0,e=0;e<t.length;e++){var r=t.charCodeAt(e);if(r<128)n+=1;else if(r<2048)n+=2;else if(r<55296)n+=3;else {if(!(r<=57343))throw new Error("utf8: invalid string");if(e>=t.length-1)throw new Error("utf8: invalid string");e++,n+=4;}}return n}n.encode=function(t){for(var n=new Uint8Array(o(t)),e=0,r=0;r<t.length;r++){var i=t.charCodeAt(r);i<128?n[e++]=i:i<2048?(n[e++]=192|i>>6,n[e++]=128|63&i):i<55296?(n[e++]=224|i>>12,n[e++]=128|i>>6&63,n[e++]=128|63&i):(r++,i=(1023&i)<<10,i|=1023&t.charCodeAt(r),i+=65536,n[e++]=240|i>>18,n[e++]=128|i>>12&63,n[e++]=128|i>>6&63,n[e++]=128|63&i);}return n},n.encodedLength=o,n.decode=function(t){for(var n=[],e=0;e<t.length;e++){var o=t[e];if(128&o){var i=void 0;if(o<224){if(e>=t.length)throw new Error(r);if(128!=(192&(s=t[++e])))throw new Error(r);o=(31&o)<<6|63&s,i=128;}else if(o<240){if(e>=t.length-1)throw new Error(r);var s=t[++e],a=t[++e];if(128!=(192&s)||128!=(192&a))throw new Error(r);o=(15&o)<<12|(63&s)<<6|63&a,i=2048;}else {if(!(o<248))throw new Error(r);if(e>=t.length-2)throw new Error(r);s=t[++e],a=t[++e];var c=t[++e];if(128!=(192&s)||128!=(192&a)||128!=(192&c))throw new Error(r);o=(15&o)<<18|(63&s)<<12|(63&a)<<6|63&c,i=65536;}if(o<i||o>=55296&&o<=57343)throw new Error(r);if(o>=65536){if(o>1114111)throw new Error(r);o-=65536,n.push(String.fromCharCode(55296|o>>10)),o=56320|1023&o;}}n.push(String.fromCharCode(o));}return n.join("")};},function(t,n,e){!function(t){var n=function(t){var n,e=new Float64Array(16);if(t)for(n=0;n<t.length;n++)e[n]=t[n];return e},r=function(){throw new Error("no PRNG")},o=new Uint8Array(16),i=new Uint8Array(32);i[0]=9;var s=n(),a=n([1]),c=n([56129,1]),u=n([30883,4953,19914,30187,55467,16705,2637,112,59544,30585,16505,36039,65139,11119,27886,20995]),h=n([61785,9906,39828,60374,45398,33411,5274,224,53552,61171,33010,6542,64743,22239,55772,9222]),f=n([54554,36645,11616,51542,42930,38181,51040,26924,56412,64982,57905,49316,21502,52590,14035,8553]),l=n([26200,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214,26214]),p=n([41136,18958,6951,50414,58488,44335,6150,12099,55207,15867,153,11085,57099,20417,9344,11139]);function d(t,n,e,r){t[n]=e>>24&255,t[n+1]=e>>16&255,t[n+2]=e>>8&255,t[n+3]=255&e,t[n+4]=r>>24&255,t[n+5]=r>>16&255,t[n+6]=r>>8&255,t[n+7]=255&r;}function y(t,n,e,r,o){var i,s=0;for(i=0;i<o;i++)s|=t[n+i]^e[r+i];return (1&s-1>>>8)-1}function g(t,n,e,r){return y(t,n,e,r,16)}function v(t,n,e,r){return y(t,n,e,r,32)}function b(t,n,e,r){!function(t,n,e,r){for(var o,i=255&r[0]|(255&r[1])<<8|(255&r[2])<<16|(255&r[3])<<24,s=255&e[0]|(255&e[1])<<8|(255&e[2])<<16|(255&e[3])<<24,a=255&e[4]|(255&e[5])<<8|(255&e[6])<<16|(255&e[7])<<24,c=255&e[8]|(255&e[9])<<8|(255&e[10])<<16|(255&e[11])<<24,u=255&e[12]|(255&e[13])<<8|(255&e[14])<<16|(255&e[15])<<24,h=255&r[4]|(255&r[5])<<8|(255&r[6])<<16|(255&r[7])<<24,f=255&n[0]|(255&n[1])<<8|(255&n[2])<<16|(255&n[3])<<24,l=255&n[4]|(255&n[5])<<8|(255&n[6])<<16|(255&n[7])<<24,p=255&n[8]|(255&n[9])<<8|(255&n[10])<<16|(255&n[11])<<24,d=255&n[12]|(255&n[13])<<8|(255&n[14])<<16|(255&n[15])<<24,y=255&r[8]|(255&r[9])<<8|(255&r[10])<<16|(255&r[11])<<24,g=255&e[16]|(255&e[17])<<8|(255&e[18])<<16|(255&e[19])<<24,v=255&e[20]|(255&e[21])<<8|(255&e[22])<<16|(255&e[23])<<24,b=255&e[24]|(255&e[25])<<8|(255&e[26])<<16|(255&e[27])<<24,m=255&e[28]|(255&e[29])<<8|(255&e[30])<<16|(255&e[31])<<24,_=255&r[12]|(255&r[13])<<8|(255&r[14])<<16|(255&r[15])<<24,w=i,S=s,k=a,C=c,T=u,P=h,O=f,A=l,E=p,x=d,L=y,U=g,R=v,M=b,j=m,I=_,N=0;N<20;N+=2)w^=(o=(R^=(o=(E^=(o=(T^=(o=w+R|0)<<7|o>>>25)+w|0)<<9|o>>>23)+T|0)<<13|o>>>19)+E|0)<<18|o>>>14,P^=(o=(S^=(o=(M^=(o=(x^=(o=P+S|0)<<7|o>>>25)+P|0)<<9|o>>>23)+x|0)<<13|o>>>19)+M|0)<<18|o>>>14,L^=(o=(O^=(o=(k^=(o=(j^=(o=L+O|0)<<7|o>>>25)+L|0)<<9|o>>>23)+j|0)<<13|o>>>19)+k|0)<<18|o>>>14,I^=(o=(U^=(o=(A^=(o=(C^=(o=I+U|0)<<7|o>>>25)+I|0)<<9|o>>>23)+C|0)<<13|o>>>19)+A|0)<<18|o>>>14,w^=(o=(C^=(o=(k^=(o=(S^=(o=w+C|0)<<7|o>>>25)+w|0)<<9|o>>>23)+S|0)<<13|o>>>19)+k|0)<<18|o>>>14,P^=(o=(T^=(o=(A^=(o=(O^=(o=P+T|0)<<7|o>>>25)+P|0)<<9|o>>>23)+O|0)<<13|o>>>19)+A|0)<<18|o>>>14,L^=(o=(x^=(o=(E^=(o=(U^=(o=L+x|0)<<7|o>>>25)+L|0)<<9|o>>>23)+U|0)<<13|o>>>19)+E|0)<<18|o>>>14,I^=(o=(j^=(o=(M^=(o=(R^=(o=I+j|0)<<7|o>>>25)+I|0)<<9|o>>>23)+R|0)<<13|o>>>19)+M|0)<<18|o>>>14;w=w+i|0,S=S+s|0,k=k+a|0,C=C+c|0,T=T+u|0,P=P+h|0,O=O+f|0,A=A+l|0,E=E+p|0,x=x+d|0,L=L+y|0,U=U+g|0,R=R+v|0,M=M+b|0,j=j+m|0,I=I+_|0,t[0]=w>>>0&255,t[1]=w>>>8&255,t[2]=w>>>16&255,t[3]=w>>>24&255,t[4]=S>>>0&255,t[5]=S>>>8&255,t[6]=S>>>16&255,t[7]=S>>>24&255,t[8]=k>>>0&255,t[9]=k>>>8&255,t[10]=k>>>16&255,t[11]=k>>>24&255,t[12]=C>>>0&255,t[13]=C>>>8&255,t[14]=C>>>16&255,t[15]=C>>>24&255,t[16]=T>>>0&255,t[17]=T>>>8&255,t[18]=T>>>16&255,t[19]=T>>>24&255,t[20]=P>>>0&255,t[21]=P>>>8&255,t[22]=P>>>16&255,t[23]=P>>>24&255,t[24]=O>>>0&255,t[25]=O>>>8&255,t[26]=O>>>16&255,t[27]=O>>>24&255,t[28]=A>>>0&255,t[29]=A>>>8&255,t[30]=A>>>16&255,t[31]=A>>>24&255,t[32]=E>>>0&255,t[33]=E>>>8&255,t[34]=E>>>16&255,t[35]=E>>>24&255,t[36]=x>>>0&255,t[37]=x>>>8&255,t[38]=x>>>16&255,t[39]=x>>>24&255,t[40]=L>>>0&255,t[41]=L>>>8&255,t[42]=L>>>16&255,t[43]=L>>>24&255,t[44]=U>>>0&255,t[45]=U>>>8&255,t[46]=U>>>16&255,t[47]=U>>>24&255,t[48]=R>>>0&255,t[49]=R>>>8&255,t[50]=R>>>16&255,t[51]=R>>>24&255,t[52]=M>>>0&255,t[53]=M>>>8&255,t[54]=M>>>16&255,t[55]=M>>>24&255,t[56]=j>>>0&255,t[57]=j>>>8&255,t[58]=j>>>16&255,t[59]=j>>>24&255,t[60]=I>>>0&255,t[61]=I>>>8&255,t[62]=I>>>16&255,t[63]=I>>>24&255;}(t,n,e,r);}function m(t,n,e,r){!function(t,n,e,r){for(var o,i=255&r[0]|(255&r[1])<<8|(255&r[2])<<16|(255&r[3])<<24,s=255&e[0]|(255&e[1])<<8|(255&e[2])<<16|(255&e[3])<<24,a=255&e[4]|(255&e[5])<<8|(255&e[6])<<16|(255&e[7])<<24,c=255&e[8]|(255&e[9])<<8|(255&e[10])<<16|(255&e[11])<<24,u=255&e[12]|(255&e[13])<<8|(255&e[14])<<16|(255&e[15])<<24,h=255&r[4]|(255&r[5])<<8|(255&r[6])<<16|(255&r[7])<<24,f=255&n[0]|(255&n[1])<<8|(255&n[2])<<16|(255&n[3])<<24,l=255&n[4]|(255&n[5])<<8|(255&n[6])<<16|(255&n[7])<<24,p=255&n[8]|(255&n[9])<<8|(255&n[10])<<16|(255&n[11])<<24,d=255&n[12]|(255&n[13])<<8|(255&n[14])<<16|(255&n[15])<<24,y=255&r[8]|(255&r[9])<<8|(255&r[10])<<16|(255&r[11])<<24,g=255&e[16]|(255&e[17])<<8|(255&e[18])<<16|(255&e[19])<<24,v=255&e[20]|(255&e[21])<<8|(255&e[22])<<16|(255&e[23])<<24,b=255&e[24]|(255&e[25])<<8|(255&e[26])<<16|(255&e[27])<<24,m=255&e[28]|(255&e[29])<<8|(255&e[30])<<16|(255&e[31])<<24,_=255&r[12]|(255&r[13])<<8|(255&r[14])<<16|(255&r[15])<<24,w=0;w<20;w+=2)i^=(o=(v^=(o=(p^=(o=(u^=(o=i+v|0)<<7|o>>>25)+i|0)<<9|o>>>23)+u|0)<<13|o>>>19)+p|0)<<18|o>>>14,h^=(o=(s^=(o=(b^=(o=(d^=(o=h+s|0)<<7|o>>>25)+h|0)<<9|o>>>23)+d|0)<<13|o>>>19)+b|0)<<18|o>>>14,y^=(o=(f^=(o=(a^=(o=(m^=(o=y+f|0)<<7|o>>>25)+y|0)<<9|o>>>23)+m|0)<<13|o>>>19)+a|0)<<18|o>>>14,_^=(o=(g^=(o=(l^=(o=(c^=(o=_+g|0)<<7|o>>>25)+_|0)<<9|o>>>23)+c|0)<<13|o>>>19)+l|0)<<18|o>>>14,i^=(o=(c^=(o=(a^=(o=(s^=(o=i+c|0)<<7|o>>>25)+i|0)<<9|o>>>23)+s|0)<<13|o>>>19)+a|0)<<18|o>>>14,h^=(o=(u^=(o=(l^=(o=(f^=(o=h+u|0)<<7|o>>>25)+h|0)<<9|o>>>23)+f|0)<<13|o>>>19)+l|0)<<18|o>>>14,y^=(o=(d^=(o=(p^=(o=(g^=(o=y+d|0)<<7|o>>>25)+y|0)<<9|o>>>23)+g|0)<<13|o>>>19)+p|0)<<18|o>>>14,_^=(o=(m^=(o=(b^=(o=(v^=(o=_+m|0)<<7|o>>>25)+_|0)<<9|o>>>23)+v|0)<<13|o>>>19)+b|0)<<18|o>>>14;t[0]=i>>>0&255,t[1]=i>>>8&255,t[2]=i>>>16&255,t[3]=i>>>24&255,t[4]=h>>>0&255,t[5]=h>>>8&255,t[6]=h>>>16&255,t[7]=h>>>24&255,t[8]=y>>>0&255,t[9]=y>>>8&255,t[10]=y>>>16&255,t[11]=y>>>24&255,t[12]=_>>>0&255,t[13]=_>>>8&255,t[14]=_>>>16&255,t[15]=_>>>24&255,t[16]=f>>>0&255,t[17]=f>>>8&255,t[18]=f>>>16&255,t[19]=f>>>24&255,t[20]=l>>>0&255,t[21]=l>>>8&255,t[22]=l>>>16&255,t[23]=l>>>24&255,t[24]=p>>>0&255,t[25]=p>>>8&255,t[26]=p>>>16&255,t[27]=p>>>24&255,t[28]=d>>>0&255,t[29]=d>>>8&255,t[30]=d>>>16&255,t[31]=d>>>24&255;}(t,n,e,r);}var _=new Uint8Array([101,120,112,97,110,100,32,51,50,45,98,121,116,101,32,107]);function w(t,n,e,r,o,i,s){var a,c,u=new Uint8Array(16),h=new Uint8Array(64);for(c=0;c<16;c++)u[c]=0;for(c=0;c<8;c++)u[c]=i[c];for(;o>=64;){for(b(h,u,s,_),c=0;c<64;c++)t[n+c]=e[r+c]^h[c];for(a=1,c=8;c<16;c++)a=a+(255&u[c])|0,u[c]=255&a,a>>>=8;o-=64,n+=64,r+=64;}if(o>0)for(b(h,u,s,_),c=0;c<o;c++)t[n+c]=e[r+c]^h[c];return 0}function S(t,n,e,r,o){var i,s,a=new Uint8Array(16),c=new Uint8Array(64);for(s=0;s<16;s++)a[s]=0;for(s=0;s<8;s++)a[s]=r[s];for(;e>=64;){for(b(c,a,o,_),s=0;s<64;s++)t[n+s]=c[s];for(i=1,s=8;s<16;s++)i=i+(255&a[s])|0,a[s]=255&i,i>>>=8;e-=64,n+=64;}if(e>0)for(b(c,a,o,_),s=0;s<e;s++)t[n+s]=c[s];return 0}function k(t,n,e,r,o){var i=new Uint8Array(32);m(i,r,o,_);for(var s=new Uint8Array(8),a=0;a<8;a++)s[a]=r[a+16];return S(t,n,e,s,i)}function C(t,n,e,r,o,i,s){var a=new Uint8Array(32);m(a,i,s,_);for(var c=new Uint8Array(8),u=0;u<8;u++)c[u]=i[u+16];return w(t,n,e,r,o,c,a)}var T=function(t){var n,e,r,o,i,s,a,c;this.buffer=new Uint8Array(16),this.r=new Uint16Array(10),this.h=new Uint16Array(10),this.pad=new Uint16Array(8),this.leftover=0,this.fin=0,n=255&t[0]|(255&t[1])<<8,this.r[0]=8191&n,e=255&t[2]|(255&t[3])<<8,this.r[1]=8191&(n>>>13|e<<3),r=255&t[4]|(255&t[5])<<8,this.r[2]=7939&(e>>>10|r<<6),o=255&t[6]|(255&t[7])<<8,this.r[3]=8191&(r>>>7|o<<9),i=255&t[8]|(255&t[9])<<8,this.r[4]=255&(o>>>4|i<<12),this.r[5]=i>>>1&8190,s=255&t[10]|(255&t[11])<<8,this.r[6]=8191&(i>>>14|s<<2),a=255&t[12]|(255&t[13])<<8,this.r[7]=8065&(s>>>11|a<<5),c=255&t[14]|(255&t[15])<<8,this.r[8]=8191&(a>>>8|c<<8),this.r[9]=c>>>5&127,this.pad[0]=255&t[16]|(255&t[17])<<8,this.pad[1]=255&t[18]|(255&t[19])<<8,this.pad[2]=255&t[20]|(255&t[21])<<8,this.pad[3]=255&t[22]|(255&t[23])<<8,this.pad[4]=255&t[24]|(255&t[25])<<8,this.pad[5]=255&t[26]|(255&t[27])<<8,this.pad[6]=255&t[28]|(255&t[29])<<8,this.pad[7]=255&t[30]|(255&t[31])<<8;};function P(t,n,e,r,o,i){var s=new T(i);return s.update(e,r,o),s.finish(t,n),0}function O(t,n,e,r,o,i){var s=new Uint8Array(16);return P(s,0,e,r,o,i),g(t,n,s,0)}function A(t,n,e,r,o){var i;if(e<32)return -1;for(C(t,0,n,0,e,r,o),P(t,16,t,32,e-32,t),i=0;i<16;i++)t[i]=0;return 0}function E(t,n,e,r,o){var i,s=new Uint8Array(32);if(e<32)return -1;if(k(s,0,32,r,o),0!==O(n,16,n,32,e-32,s))return -1;for(C(t,0,n,0,e,r,o),i=0;i<32;i++)t[i]=0;return 0}function x(t,n){var e;for(e=0;e<16;e++)t[e]=0|n[e];}function L(t){var n,e,r=1;for(n=0;n<16;n++)e=t[n]+r+65535,r=Math.floor(e/65536),t[n]=e-65536*r;t[0]+=r-1+37*(r-1);}function U(t,n,e){for(var r,o=~(e-1),i=0;i<16;i++)r=o&(t[i]^n[i]),t[i]^=r,n[i]^=r;}function R(t,e){var r,o,i,s=n(),a=n();for(r=0;r<16;r++)a[r]=e[r];for(L(a),L(a),L(a),o=0;o<2;o++){for(s[0]=a[0]-65517,r=1;r<15;r++)s[r]=a[r]-65535-(s[r-1]>>16&1),s[r-1]&=65535;s[15]=a[15]-32767-(s[14]>>16&1),i=s[15]>>16&1,s[14]&=65535,U(a,s,1-i);}for(r=0;r<16;r++)t[2*r]=255&a[r],t[2*r+1]=a[r]>>8;}function M(t,n){var e=new Uint8Array(32),r=new Uint8Array(32);return R(e,t),R(r,n),v(e,0,r,0)}function j(t){var n=new Uint8Array(32);return R(n,t),1&n[0]}function I(t,n){var e;for(e=0;e<16;e++)t[e]=n[2*e]+(n[2*e+1]<<8);t[15]&=32767;}function N(t,n,e){for(var r=0;r<16;r++)t[r]=n[r]+e[r];}function D(t,n,e){for(var r=0;r<16;r++)t[r]=n[r]-e[r];}function H(t,n,e){var r,o,i=0,s=0,a=0,c=0,u=0,h=0,f=0,l=0,p=0,d=0,y=0,g=0,v=0,b=0,m=0,_=0,w=0,S=0,k=0,C=0,T=0,P=0,O=0,A=0,E=0,x=0,L=0,U=0,R=0,M=0,j=0,I=e[0],N=e[1],D=e[2],H=e[3],z=e[4],B=e[5],F=e[6],q=e[7],Y=e[8],K=e[9],J=e[10],X=e[11],W=e[12],G=e[13],V=e[14],Z=e[15];i+=(r=n[0])*I,s+=r*N,a+=r*D,c+=r*H,u+=r*z,h+=r*B,f+=r*F,l+=r*q,p+=r*Y,d+=r*K,y+=r*J,g+=r*X,v+=r*W,b+=r*G,m+=r*V,_+=r*Z,s+=(r=n[1])*I,a+=r*N,c+=r*D,u+=r*H,h+=r*z,f+=r*B,l+=r*F,p+=r*q,d+=r*Y,y+=r*K,g+=r*J,v+=r*X,b+=r*W,m+=r*G,_+=r*V,w+=r*Z,a+=(r=n[2])*I,c+=r*N,u+=r*D,h+=r*H,f+=r*z,l+=r*B,p+=r*F,d+=r*q,y+=r*Y,g+=r*K,v+=r*J,b+=r*X,m+=r*W,_+=r*G,w+=r*V,S+=r*Z,c+=(r=n[3])*I,u+=r*N,h+=r*D,f+=r*H,l+=r*z,p+=r*B,d+=r*F,y+=r*q,g+=r*Y,v+=r*K,b+=r*J,m+=r*X,_+=r*W,w+=r*G,S+=r*V,k+=r*Z,u+=(r=n[4])*I,h+=r*N,f+=r*D,l+=r*H,p+=r*z,d+=r*B,y+=r*F,g+=r*q,v+=r*Y,b+=r*K,m+=r*J,_+=r*X,w+=r*W,S+=r*G,k+=r*V,C+=r*Z,h+=(r=n[5])*I,f+=r*N,l+=r*D,p+=r*H,d+=r*z,y+=r*B,g+=r*F,v+=r*q,b+=r*Y,m+=r*K,_+=r*J,w+=r*X,S+=r*W,k+=r*G,C+=r*V,T+=r*Z,f+=(r=n[6])*I,l+=r*N,p+=r*D,d+=r*H,y+=r*z,g+=r*B,v+=r*F,b+=r*q,m+=r*Y,_+=r*K,w+=r*J,S+=r*X,k+=r*W,C+=r*G,T+=r*V,P+=r*Z,l+=(r=n[7])*I,p+=r*N,d+=r*D,y+=r*H,g+=r*z,v+=r*B,b+=r*F,m+=r*q,_+=r*Y,w+=r*K,S+=r*J,k+=r*X,C+=r*W,T+=r*G,P+=r*V,O+=r*Z,p+=(r=n[8])*I,d+=r*N,y+=r*D,g+=r*H,v+=r*z,b+=r*B,m+=r*F,_+=r*q,w+=r*Y,S+=r*K,k+=r*J,C+=r*X,T+=r*W,P+=r*G,O+=r*V,A+=r*Z,d+=(r=n[9])*I,y+=r*N,g+=r*D,v+=r*H,b+=r*z,m+=r*B,_+=r*F,w+=r*q,S+=r*Y,k+=r*K,C+=r*J,T+=r*X,P+=r*W,O+=r*G,A+=r*V,E+=r*Z,y+=(r=n[10])*I,g+=r*N,v+=r*D,b+=r*H,m+=r*z,_+=r*B,w+=r*F,S+=r*q,k+=r*Y,C+=r*K,T+=r*J,P+=r*X,O+=r*W,A+=r*G,E+=r*V,x+=r*Z,g+=(r=n[11])*I,v+=r*N,b+=r*D,m+=r*H,_+=r*z,w+=r*B,S+=r*F,k+=r*q,C+=r*Y,T+=r*K,P+=r*J,O+=r*X,A+=r*W,E+=r*G,x+=r*V,L+=r*Z,v+=(r=n[12])*I,b+=r*N,m+=r*D,_+=r*H,w+=r*z,S+=r*B,k+=r*F,C+=r*q,T+=r*Y,P+=r*K,O+=r*J,A+=r*X,E+=r*W,x+=r*G,L+=r*V,U+=r*Z,b+=(r=n[13])*I,m+=r*N,_+=r*D,w+=r*H,S+=r*z,k+=r*B,C+=r*F,T+=r*q,P+=r*Y,O+=r*K,A+=r*J,E+=r*X,x+=r*W,L+=r*G,U+=r*V,R+=r*Z,m+=(r=n[14])*I,_+=r*N,w+=r*D,S+=r*H,k+=r*z,C+=r*B,T+=r*F,P+=r*q,O+=r*Y,A+=r*K,E+=r*J,x+=r*X,L+=r*W,U+=r*G,R+=r*V,M+=r*Z,_+=(r=n[15])*I,s+=38*(S+=r*D),a+=38*(k+=r*H),c+=38*(C+=r*z),u+=38*(T+=r*B),h+=38*(P+=r*F),f+=38*(O+=r*q),l+=38*(A+=r*Y),p+=38*(E+=r*K),d+=38*(x+=r*J),y+=38*(L+=r*X),g+=38*(U+=r*W),v+=38*(R+=r*G),b+=38*(M+=r*V),m+=38*(j+=r*Z),i=(r=(i+=38*(w+=r*N))+(o=1)+65535)-65536*(o=Math.floor(r/65536)),s=(r=s+o+65535)-65536*(o=Math.floor(r/65536)),a=(r=a+o+65535)-65536*(o=Math.floor(r/65536)),c=(r=c+o+65535)-65536*(o=Math.floor(r/65536)),u=(r=u+o+65535)-65536*(o=Math.floor(r/65536)),h=(r=h+o+65535)-65536*(o=Math.floor(r/65536)),f=(r=f+o+65535)-65536*(o=Math.floor(r/65536)),l=(r=l+o+65535)-65536*(o=Math.floor(r/65536)),p=(r=p+o+65535)-65536*(o=Math.floor(r/65536)),d=(r=d+o+65535)-65536*(o=Math.floor(r/65536)),y=(r=y+o+65535)-65536*(o=Math.floor(r/65536)),g=(r=g+o+65535)-65536*(o=Math.floor(r/65536)),v=(r=v+o+65535)-65536*(o=Math.floor(r/65536)),b=(r=b+o+65535)-65536*(o=Math.floor(r/65536)),m=(r=m+o+65535)-65536*(o=Math.floor(r/65536)),_=(r=_+o+65535)-65536*(o=Math.floor(r/65536)),i=(r=(i+=o-1+37*(o-1))+(o=1)+65535)-65536*(o=Math.floor(r/65536)),s=(r=s+o+65535)-65536*(o=Math.floor(r/65536)),a=(r=a+o+65535)-65536*(o=Math.floor(r/65536)),c=(r=c+o+65535)-65536*(o=Math.floor(r/65536)),u=(r=u+o+65535)-65536*(o=Math.floor(r/65536)),h=(r=h+o+65535)-65536*(o=Math.floor(r/65536)),f=(r=f+o+65535)-65536*(o=Math.floor(r/65536)),l=(r=l+o+65535)-65536*(o=Math.floor(r/65536)),p=(r=p+o+65535)-65536*(o=Math.floor(r/65536)),d=(r=d+o+65535)-65536*(o=Math.floor(r/65536)),y=(r=y+o+65535)-65536*(o=Math.floor(r/65536)),g=(r=g+o+65535)-65536*(o=Math.floor(r/65536)),v=(r=v+o+65535)-65536*(o=Math.floor(r/65536)),b=(r=b+o+65535)-65536*(o=Math.floor(r/65536)),m=(r=m+o+65535)-65536*(o=Math.floor(r/65536)),_=(r=_+o+65535)-65536*(o=Math.floor(r/65536)),i+=o-1+37*(o-1),t[0]=i,t[1]=s,t[2]=a,t[3]=c,t[4]=u,t[5]=h,t[6]=f,t[7]=l,t[8]=p,t[9]=d,t[10]=y,t[11]=g,t[12]=v,t[13]=b,t[14]=m,t[15]=_;}function z(t,n){H(t,n,n);}function B(t,e){var r,o=n();for(r=0;r<16;r++)o[r]=e[r];for(r=253;r>=0;r--)z(o,o),2!==r&&4!==r&&H(o,o,e);for(r=0;r<16;r++)t[r]=o[r];}function F(t,e){var r,o=n();for(r=0;r<16;r++)o[r]=e[r];for(r=250;r>=0;r--)z(o,o),1!==r&&H(o,o,e);for(r=0;r<16;r++)t[r]=o[r];}function q(t,e,r){var o,i,s=new Uint8Array(32),a=new Float64Array(80),u=n(),h=n(),f=n(),l=n(),p=n(),d=n();for(i=0;i<31;i++)s[i]=e[i];for(s[31]=127&e[31]|64,s[0]&=248,I(a,r),i=0;i<16;i++)h[i]=a[i],l[i]=u[i]=f[i]=0;for(u[0]=l[0]=1,i=254;i>=0;--i)U(u,h,o=s[i>>>3]>>>(7&i)&1),U(f,l,o),N(p,u,f),D(u,u,f),N(f,h,l),D(h,h,l),z(l,p),z(d,u),H(u,f,u),H(f,h,p),N(p,u,f),D(u,u,f),z(h,u),D(f,l,d),H(u,f,c),N(u,u,l),H(f,f,u),H(u,l,d),H(l,h,a),z(h,p),U(u,h,o),U(f,l,o);for(i=0;i<16;i++)a[i+16]=u[i],a[i+32]=f[i],a[i+48]=h[i],a[i+64]=l[i];var y=a.subarray(32),g=a.subarray(16);return B(y,y),H(g,g,y),R(t,g),0}function Y(t,n){return q(t,n,i)}function K(t,n){return r(n,32),Y(t,n)}function J(t,n,e){var r=new Uint8Array(32);return q(r,e,n),m(t,o,r,_)}T.prototype.blocks=function(t,n,e){for(var r,o,i,s,a,c,u,h,f,l,p,d,y,g,v,b,m,_,w,S=this.fin?0:2048,k=this.h[0],C=this.h[1],T=this.h[2],P=this.h[3],O=this.h[4],A=this.h[5],E=this.h[6],x=this.h[7],L=this.h[8],U=this.h[9],R=this.r[0],M=this.r[1],j=this.r[2],I=this.r[3],N=this.r[4],D=this.r[5],H=this.r[6],z=this.r[7],B=this.r[8],F=this.r[9];e>=16;)l=f=0,l+=(k+=8191&(r=255&t[n+0]|(255&t[n+1])<<8))*R,l+=(C+=8191&(r>>>13|(o=255&t[n+2]|(255&t[n+3])<<8)<<3))*(5*F),l+=(T+=8191&(o>>>10|(i=255&t[n+4]|(255&t[n+5])<<8)<<6))*(5*B),l+=(P+=8191&(i>>>7|(s=255&t[n+6]|(255&t[n+7])<<8)<<9))*(5*z),f=(l+=(O+=8191&(s>>>4|(a=255&t[n+8]|(255&t[n+9])<<8)<<12))*(5*H))>>>13,l&=8191,l+=(A+=a>>>1&8191)*(5*D),l+=(E+=8191&(a>>>14|(c=255&t[n+10]|(255&t[n+11])<<8)<<2))*(5*N),l+=(x+=8191&(c>>>11|(u=255&t[n+12]|(255&t[n+13])<<8)<<5))*(5*I),l+=(L+=8191&(u>>>8|(h=255&t[n+14]|(255&t[n+15])<<8)<<8))*(5*j),p=f+=(l+=(U+=h>>>5|S)*(5*M))>>>13,p+=k*M,p+=C*R,p+=T*(5*F),p+=P*(5*B),f=(p+=O*(5*z))>>>13,p&=8191,p+=A*(5*H),p+=E*(5*D),p+=x*(5*N),p+=L*(5*I),f+=(p+=U*(5*j))>>>13,p&=8191,d=f,d+=k*j,d+=C*M,d+=T*R,d+=P*(5*F),f=(d+=O*(5*B))>>>13,d&=8191,d+=A*(5*z),d+=E*(5*H),d+=x*(5*D),d+=L*(5*N),y=f+=(d+=U*(5*I))>>>13,y+=k*I,y+=C*j,y+=T*M,y+=P*R,f=(y+=O*(5*F))>>>13,y&=8191,y+=A*(5*B),y+=E*(5*z),y+=x*(5*H),y+=L*(5*D),g=f+=(y+=U*(5*N))>>>13,g+=k*N,g+=C*I,g+=T*j,g+=P*M,f=(g+=O*R)>>>13,g&=8191,g+=A*(5*F),g+=E*(5*B),g+=x*(5*z),g+=L*(5*H),v=f+=(g+=U*(5*D))>>>13,v+=k*D,v+=C*N,v+=T*I,v+=P*j,f=(v+=O*M)>>>13,v&=8191,v+=A*R,v+=E*(5*F),v+=x*(5*B),v+=L*(5*z),b=f+=(v+=U*(5*H))>>>13,b+=k*H,b+=C*D,b+=T*N,b+=P*I,f=(b+=O*j)>>>13,b&=8191,b+=A*M,b+=E*R,b+=x*(5*F),b+=L*(5*B),m=f+=(b+=U*(5*z))>>>13,m+=k*z,m+=C*H,m+=T*D,m+=P*N,f=(m+=O*I)>>>13,m&=8191,m+=A*j,m+=E*M,m+=x*R,m+=L*(5*F),_=f+=(m+=U*(5*B))>>>13,_+=k*B,_+=C*z,_+=T*H,_+=P*D,f=(_+=O*N)>>>13,_&=8191,_+=A*I,_+=E*j,_+=x*M,_+=L*R,w=f+=(_+=U*(5*F))>>>13,w+=k*F,w+=C*B,w+=T*z,w+=P*H,f=(w+=O*D)>>>13,w&=8191,w+=A*N,w+=E*I,w+=x*j,w+=L*M,k=l=8191&(f=(f=((f+=(w+=U*R)>>>13)<<2)+f|0)+(l&=8191)|0),C=p+=f>>>=13,T=d&=8191,P=y&=8191,O=g&=8191,A=v&=8191,E=b&=8191,x=m&=8191,L=_&=8191,U=w&=8191,n+=16,e-=16;this.h[0]=k,this.h[1]=C,this.h[2]=T,this.h[3]=P,this.h[4]=O,this.h[5]=A,this.h[6]=E,this.h[7]=x,this.h[8]=L,this.h[9]=U;},T.prototype.finish=function(t,n){var e,r,o,i,s=new Uint16Array(10);if(this.leftover){for(i=this.leftover,this.buffer[i++]=1;i<16;i++)this.buffer[i]=0;this.fin=1,this.blocks(this.buffer,0,16);}for(e=this.h[1]>>>13,this.h[1]&=8191,i=2;i<10;i++)this.h[i]+=e,e=this.h[i]>>>13,this.h[i]&=8191;for(this.h[0]+=5*e,e=this.h[0]>>>13,this.h[0]&=8191,this.h[1]+=e,e=this.h[1]>>>13,this.h[1]&=8191,this.h[2]+=e,s[0]=this.h[0]+5,e=s[0]>>>13,s[0]&=8191,i=1;i<10;i++)s[i]=this.h[i]+e,e=s[i]>>>13,s[i]&=8191;for(s[9]-=8192,r=(1^e)-1,i=0;i<10;i++)s[i]&=r;for(r=~r,i=0;i<10;i++)this.h[i]=this.h[i]&r|s[i];for(this.h[0]=65535&(this.h[0]|this.h[1]<<13),this.h[1]=65535&(this.h[1]>>>3|this.h[2]<<10),this.h[2]=65535&(this.h[2]>>>6|this.h[3]<<7),this.h[3]=65535&(this.h[3]>>>9|this.h[4]<<4),this.h[4]=65535&(this.h[4]>>>12|this.h[5]<<1|this.h[6]<<14),this.h[5]=65535&(this.h[6]>>>2|this.h[7]<<11),this.h[6]=65535&(this.h[7]>>>5|this.h[8]<<8),this.h[7]=65535&(this.h[8]>>>8|this.h[9]<<5),o=this.h[0]+this.pad[0],this.h[0]=65535&o,i=1;i<8;i++)o=(this.h[i]+this.pad[i]|0)+(o>>>16)|0,this.h[i]=65535&o;t[n+0]=this.h[0]>>>0&255,t[n+1]=this.h[0]>>>8&255,t[n+2]=this.h[1]>>>0&255,t[n+3]=this.h[1]>>>8&255,t[n+4]=this.h[2]>>>0&255,t[n+5]=this.h[2]>>>8&255,t[n+6]=this.h[3]>>>0&255,t[n+7]=this.h[3]>>>8&255,t[n+8]=this.h[4]>>>0&255,t[n+9]=this.h[4]>>>8&255,t[n+10]=this.h[5]>>>0&255,t[n+11]=this.h[5]>>>8&255,t[n+12]=this.h[6]>>>0&255,t[n+13]=this.h[6]>>>8&255,t[n+14]=this.h[7]>>>0&255,t[n+15]=this.h[7]>>>8&255;},T.prototype.update=function(t,n,e){var r,o;if(this.leftover){for((o=16-this.leftover)>e&&(o=e),r=0;r<o;r++)this.buffer[this.leftover+r]=t[n+r];if(e-=o,n+=o,this.leftover+=o,this.leftover<16)return;this.blocks(this.buffer,0,16),this.leftover=0;}if(e>=16&&(o=e-e%16,this.blocks(t,n,o),n+=o,e-=o),e){for(r=0;r<e;r++)this.buffer[this.leftover+r]=t[n+r];this.leftover+=e;}};var X=A,W=E;var G=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591];function V(t,n,e,r){for(var o,i,s,a,c,u,h,f,l,p,d,y,g,v,b,m,_,w,S,k,C,T,P,O,A,E,x=new Int32Array(16),L=new Int32Array(16),U=t[0],R=t[1],M=t[2],j=t[3],I=t[4],N=t[5],D=t[6],H=t[7],z=n[0],B=n[1],F=n[2],q=n[3],Y=n[4],K=n[5],J=n[6],X=n[7],W=0;r>=128;){for(S=0;S<16;S++)k=8*S+W,x[S]=e[k+0]<<24|e[k+1]<<16|e[k+2]<<8|e[k+3],L[S]=e[k+4]<<24|e[k+5]<<16|e[k+6]<<8|e[k+7];for(S=0;S<80;S++)if(o=U,i=R,s=M,a=j,c=I,u=N,h=D,l=z,p=B,d=F,y=q,g=Y,v=K,b=J,P=65535&(T=X),O=T>>>16,A=65535&(C=H),E=C>>>16,P+=65535&(T=(Y>>>14|I<<18)^(Y>>>18|I<<14)^(I>>>9|Y<<23)),O+=T>>>16,A+=65535&(C=(I>>>14|Y<<18)^(I>>>18|Y<<14)^(Y>>>9|I<<23)),E+=C>>>16,P+=65535&(T=Y&K^~Y&J),O+=T>>>16,A+=65535&(C=I&N^~I&D),E+=C>>>16,P+=65535&(T=G[2*S+1]),O+=T>>>16,A+=65535&(C=G[2*S]),E+=C>>>16,C=x[S%16],O+=(T=L[S%16])>>>16,A+=65535&C,E+=C>>>16,A+=(O+=(P+=65535&T)>>>16)>>>16,P=65535&(T=w=65535&P|O<<16),O=T>>>16,A=65535&(C=_=65535&A|(E+=A>>>16)<<16),E=C>>>16,P+=65535&(T=(z>>>28|U<<4)^(U>>>2|z<<30)^(U>>>7|z<<25)),O+=T>>>16,A+=65535&(C=(U>>>28|z<<4)^(z>>>2|U<<30)^(z>>>7|U<<25)),E+=C>>>16,O+=(T=z&B^z&F^B&F)>>>16,A+=65535&(C=U&R^U&M^R&M),E+=C>>>16,f=65535&(A+=(O+=(P+=65535&T)>>>16)>>>16)|(E+=A>>>16)<<16,m=65535&P|O<<16,P=65535&(T=y),O=T>>>16,A=65535&(C=a),E=C>>>16,O+=(T=w)>>>16,A+=65535&(C=_),E+=C>>>16,R=o,M=i,j=s,I=a=65535&(A+=(O+=(P+=65535&T)>>>16)>>>16)|(E+=A>>>16)<<16,N=c,D=u,H=h,U=f,B=l,F=p,q=d,Y=y=65535&P|O<<16,K=g,J=v,X=b,z=m,S%16==15)for(k=0;k<16;k++)C=x[k],P=65535&(T=L[k]),O=T>>>16,A=65535&C,E=C>>>16,C=x[(k+9)%16],P+=65535&(T=L[(k+9)%16]),O+=T>>>16,A+=65535&C,E+=C>>>16,_=x[(k+1)%16],P+=65535&(T=((w=L[(k+1)%16])>>>1|_<<31)^(w>>>8|_<<24)^(w>>>7|_<<25)),O+=T>>>16,A+=65535&(C=(_>>>1|w<<31)^(_>>>8|w<<24)^_>>>7),E+=C>>>16,_=x[(k+14)%16],O+=(T=((w=L[(k+14)%16])>>>19|_<<13)^(_>>>29|w<<3)^(w>>>6|_<<26))>>>16,A+=65535&(C=(_>>>19|w<<13)^(w>>>29|_<<3)^_>>>6),E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,x[k]=65535&A|E<<16,L[k]=65535&P|O<<16;P=65535&(T=z),O=T>>>16,A=65535&(C=U),E=C>>>16,C=t[0],O+=(T=n[0])>>>16,A+=65535&C,E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,t[0]=U=65535&A|E<<16,n[0]=z=65535&P|O<<16,P=65535&(T=B),O=T>>>16,A=65535&(C=R),E=C>>>16,C=t[1],O+=(T=n[1])>>>16,A+=65535&C,E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,t[1]=R=65535&A|E<<16,n[1]=B=65535&P|O<<16,P=65535&(T=F),O=T>>>16,A=65535&(C=M),E=C>>>16,C=t[2],O+=(T=n[2])>>>16,A+=65535&C,E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,t[2]=M=65535&A|E<<16,n[2]=F=65535&P|O<<16,P=65535&(T=q),O=T>>>16,A=65535&(C=j),E=C>>>16,C=t[3],O+=(T=n[3])>>>16,A+=65535&C,E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,t[3]=j=65535&A|E<<16,n[3]=q=65535&P|O<<16,P=65535&(T=Y),O=T>>>16,A=65535&(C=I),E=C>>>16,C=t[4],O+=(T=n[4])>>>16,A+=65535&C,E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,t[4]=I=65535&A|E<<16,n[4]=Y=65535&P|O<<16,P=65535&(T=K),O=T>>>16,A=65535&(C=N),E=C>>>16,C=t[5],O+=(T=n[5])>>>16,A+=65535&C,E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,t[5]=N=65535&A|E<<16,n[5]=K=65535&P|O<<16,P=65535&(T=J),O=T>>>16,A=65535&(C=D),E=C>>>16,C=t[6],O+=(T=n[6])>>>16,A+=65535&C,E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,t[6]=D=65535&A|E<<16,n[6]=J=65535&P|O<<16,P=65535&(T=X),O=T>>>16,A=65535&(C=H),E=C>>>16,C=t[7],O+=(T=n[7])>>>16,A+=65535&C,E+=C>>>16,E+=(A+=(O+=(P+=65535&T)>>>16)>>>16)>>>16,t[7]=H=65535&A|E<<16,n[7]=X=65535&P|O<<16,W+=128,r-=128;}return r}function Z(t,n,e){var r,o=new Int32Array(8),i=new Int32Array(8),s=new Uint8Array(256),a=e;for(o[0]=1779033703,o[1]=3144134277,o[2]=1013904242,o[3]=2773480762,o[4]=1359893119,o[5]=2600822924,o[6]=528734635,o[7]=1541459225,i[0]=4089235720,i[1]=2227873595,i[2]=4271175723,i[3]=1595750129,i[4]=2917565137,i[5]=725511199,i[6]=4215389547,i[7]=327033209,V(o,i,n,e),e%=128,r=0;r<e;r++)s[r]=n[a-e+r];for(s[e]=128,s[(e=256-128*(e<112?1:0))-9]=0,d(s,e-8,a/536870912|0,a<<3),V(o,i,s,e),r=0;r<8;r++)d(t,8*r,o[r],i[r]);return 0}function Q(t,e){var r=n(),o=n(),i=n(),s=n(),a=n(),c=n(),u=n(),f=n(),l=n();D(r,t[1],t[0]),D(l,e[1],e[0]),H(r,r,l),N(o,t[0],t[1]),N(l,e[0],e[1]),H(o,o,l),H(i,t[3],e[3]),H(i,i,h),H(s,t[2],e[2]),N(s,s,s),D(a,o,r),D(c,s,i),N(u,s,i),N(f,o,r),H(t[0],a,c),H(t[1],f,u),H(t[2],u,c),H(t[3],a,f);}function $(t,n,e){var r;for(r=0;r<4;r++)U(t[r],n[r],e);}function tt(t,e){var r=n(),o=n(),i=n();B(i,e[2]),H(r,e[0],i),H(o,e[1],i),R(t,o),t[31]^=j(r)<<7;}function nt(t,n,e){var r,o;for(x(t[0],s),x(t[1],a),x(t[2],a),x(t[3],s),o=255;o>=0;--o)$(t,n,r=e[o/8|0]>>(7&o)&1),Q(n,t),Q(t,t),$(t,n,r);}function et(t,e){var r=[n(),n(),n(),n()];x(r[0],f),x(r[1],l),x(r[2],a),H(r[3],f,l),nt(t,r,e);}function rt(t,e,o){var i,s=new Uint8Array(64),a=[n(),n(),n(),n()];for(o||r(e,32),Z(s,e,32),s[0]&=248,s[31]&=127,s[31]|=64,et(a,s),tt(t,a),i=0;i<32;i++)e[i+32]=t[i];return 0}var ot=new Float64Array([237,211,245,92,26,99,18,88,214,156,247,162,222,249,222,20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,16]);function it(t,n){var e,r,o,i;for(r=63;r>=32;--r){for(e=0,o=r-32,i=r-12;o<i;++o)n[o]+=e-16*n[r]*ot[o-(r-32)],e=Math.floor((n[o]+128)/256),n[o]-=256*e;n[o]+=e,n[r]=0;}for(e=0,o=0;o<32;o++)n[o]+=e-(n[31]>>4)*ot[o],e=n[o]>>8,n[o]&=255;for(o=0;o<32;o++)n[o]-=e*ot[o];for(r=0;r<32;r++)n[r+1]+=n[r]>>8,t[r]=255&n[r];}function st(t){var n,e=new Float64Array(64);for(n=0;n<64;n++)e[n]=t[n];for(n=0;n<64;n++)t[n]=0;it(t,e);}function at(t,e,r,o){var i,s,a=new Uint8Array(64),c=new Uint8Array(64),u=new Uint8Array(64),h=new Float64Array(64),f=[n(),n(),n(),n()];Z(a,o,32),a[0]&=248,a[31]&=127,a[31]|=64;var l=r+64;for(i=0;i<r;i++)t[64+i]=e[i];for(i=0;i<32;i++)t[32+i]=a[32+i];for(Z(u,t.subarray(32),r+32),st(u),et(f,u),tt(t,f),i=32;i<64;i++)t[i]=o[i];for(Z(c,t,r+64),st(c),i=0;i<64;i++)h[i]=0;for(i=0;i<32;i++)h[i]=u[i];for(i=0;i<32;i++)for(s=0;s<32;s++)h[i+s]+=c[i]*a[s];return it(t.subarray(32),h),l}function ct(t,e,r,o){var i,c=new Uint8Array(32),h=new Uint8Array(64),f=[n(),n(),n(),n()],l=[n(),n(),n(),n()];if(r<64)return -1;if(function(t,e){var r=n(),o=n(),i=n(),c=n(),h=n(),f=n(),l=n();return x(t[2],a),I(t[1],e),z(i,t[1]),H(c,i,u),D(i,i,t[2]),N(c,t[2],c),z(h,c),z(f,h),H(l,f,h),H(r,l,i),H(r,r,c),F(r,r),H(r,r,i),H(r,r,c),H(r,r,c),H(t[0],r,c),z(o,t[0]),H(o,o,c),M(o,i)&&H(t[0],t[0],p),z(o,t[0]),H(o,o,c),M(o,i)?-1:(j(t[0])===e[31]>>7&&D(t[0],s,t[0]),H(t[3],t[0],t[1]),0)}(l,o))return -1;for(i=0;i<r;i++)t[i]=e[i];for(i=0;i<32;i++)t[i+32]=o[i];if(Z(h,t,r),st(h),nt(f,l,h),et(l,e.subarray(32)),Q(f,l),tt(c,f),r-=64,v(e,0,c,0)){for(i=0;i<r;i++)t[i]=0;return -1}for(i=0;i<r;i++)t[i]=e[i+64];return r}function ut(t,n){if(32!==t.length)throw new Error("bad key size");if(24!==n.length)throw new Error("bad nonce size")}function ht(){for(var t=0;t<arguments.length;t++)if(!(arguments[t]instanceof Uint8Array))throw new TypeError("unexpected type, use Uint8Array")}function ft(t){for(var n=0;n<t.length;n++)t[n]=0;}t.lowlevel={crypto_core_hsalsa20:m,crypto_stream_xor:C,crypto_stream:k,crypto_stream_salsa20_xor:w,crypto_stream_salsa20:S,crypto_onetimeauth:P,crypto_onetimeauth_verify:O,crypto_verify_16:g,crypto_verify_32:v,crypto_secretbox:A,crypto_secretbox_open:E,crypto_scalarmult:q,crypto_scalarmult_base:Y,crypto_box_beforenm:J,crypto_box_afternm:X,crypto_box:function(t,n,e,r,o,i){var s=new Uint8Array(32);return J(s,o,i),X(t,n,e,r,s)},crypto_box_open:function(t,n,e,r,o,i){var s=new Uint8Array(32);return J(s,o,i),W(t,n,e,r,s)},crypto_box_keypair:K,crypto_hash:Z,crypto_sign:at,crypto_sign_keypair:rt,crypto_sign_open:ct,crypto_secretbox_KEYBYTES:32,crypto_secretbox_NONCEBYTES:24,crypto_secretbox_ZEROBYTES:32,crypto_secretbox_BOXZEROBYTES:16,crypto_scalarmult_BYTES:32,crypto_scalarmult_SCALARBYTES:32,crypto_box_PUBLICKEYBYTES:32,crypto_box_SECRETKEYBYTES:32,crypto_box_BEFORENMBYTES:32,crypto_box_NONCEBYTES:24,crypto_box_ZEROBYTES:32,crypto_box_BOXZEROBYTES:16,crypto_sign_BYTES:64,crypto_sign_PUBLICKEYBYTES:32,crypto_sign_SECRETKEYBYTES:64,crypto_sign_SEEDBYTES:32,crypto_hash_BYTES:64,gf:n,D:u,L:ot,pack25519:R,unpack25519:I,M:H,A:N,S:z,Z:D,pow2523:F,add:Q,set25519:x,modL:it,scalarmult:nt,scalarbase:et},t.randomBytes=function(t){var n=new Uint8Array(t);return r(n,t),n},t.secretbox=function(t,n,e){ht(t,n,e),ut(e,n);for(var r=new Uint8Array(32+t.length),o=new Uint8Array(r.length),i=0;i<t.length;i++)r[i+32]=t[i];return A(o,r,r.length,n,e),o.subarray(16)},t.secretbox.open=function(t,n,e){ht(t,n,e),ut(e,n);for(var r=new Uint8Array(16+t.length),o=new Uint8Array(r.length),i=0;i<t.length;i++)r[i+16]=t[i];return r.length<32||0!==E(o,r,r.length,n,e)?null:o.subarray(32)},t.secretbox.keyLength=32,t.secretbox.nonceLength=24,t.secretbox.overheadLength=16,t.scalarMult=function(t,n){if(ht(t,n),32!==t.length)throw new Error("bad n size");if(32!==n.length)throw new Error("bad p size");var e=new Uint8Array(32);return q(e,t,n),e},t.scalarMult.base=function(t){if(ht(t),32!==t.length)throw new Error("bad n size");var n=new Uint8Array(32);return Y(n,t),n},t.scalarMult.scalarLength=32,t.scalarMult.groupElementLength=32,t.box=function(n,e,r,o){var i=t.box.before(r,o);return t.secretbox(n,e,i)},t.box.before=function(t,n){ht(t,n),function(t,n){if(32!==t.length)throw new Error("bad public key size");if(32!==n.length)throw new Error("bad secret key size")}(t,n);var e=new Uint8Array(32);return J(e,t,n),e},t.box.after=t.secretbox,t.box.open=function(n,e,r,o){var i=t.box.before(r,o);return t.secretbox.open(n,e,i)},t.box.open.after=t.secretbox.open,t.box.keyPair=function(){var t=new Uint8Array(32),n=new Uint8Array(32);return K(t,n),{publicKey:t,secretKey:n}},t.box.keyPair.fromSecretKey=function(t){if(ht(t),32!==t.length)throw new Error("bad secret key size");var n=new Uint8Array(32);return Y(n,t),{publicKey:n,secretKey:new Uint8Array(t)}},t.box.publicKeyLength=32,t.box.secretKeyLength=32,t.box.sharedKeyLength=32,t.box.nonceLength=24,t.box.overheadLength=t.secretbox.overheadLength,t.sign=function(t,n){if(ht(t,n),64!==n.length)throw new Error("bad secret key size");var e=new Uint8Array(64+t.length);return at(e,t,t.length,n),e},t.sign.open=function(t,n){if(ht(t,n),32!==n.length)throw new Error("bad public key size");var e=new Uint8Array(t.length),r=ct(e,t,t.length,n);if(r<0)return null;for(var o=new Uint8Array(r),i=0;i<o.length;i++)o[i]=e[i];return o},t.sign.detached=function(n,e){for(var r=t.sign(n,e),o=new Uint8Array(64),i=0;i<o.length;i++)o[i]=r[i];return o},t.sign.detached.verify=function(t,n,e){if(ht(t,n,e),64!==n.length)throw new Error("bad signature size");if(32!==e.length)throw new Error("bad public key size");var r,o=new Uint8Array(64+t.length),i=new Uint8Array(64+t.length);for(r=0;r<64;r++)o[r]=n[r];for(r=0;r<t.length;r++)o[r+64]=t[r];return ct(i,o,o.length,e)>=0},t.sign.keyPair=function(){var t=new Uint8Array(32),n=new Uint8Array(64);return rt(t,n),{publicKey:t,secretKey:n}},t.sign.keyPair.fromSecretKey=function(t){if(ht(t),64!==t.length)throw new Error("bad secret key size");for(var n=new Uint8Array(32),e=0;e<n.length;e++)n[e]=t[32+e];return {publicKey:n,secretKey:new Uint8Array(t)}},t.sign.keyPair.fromSeed=function(t){if(ht(t),32!==t.length)throw new Error("bad seed size");for(var n=new Uint8Array(32),e=new Uint8Array(64),r=0;r<32;r++)e[r]=t[r];return rt(n,e,!0),{publicKey:n,secretKey:e}},t.sign.publicKeyLength=32,t.sign.secretKeyLength=64,t.sign.seedLength=32,t.sign.signatureLength=64,t.hash=function(t){ht(t);var n=new Uint8Array(64);return Z(n,t,t.length),n},t.hash.hashLength=64,t.verify=function(t,n){return ht(t,n),0!==t.length&&0!==n.length&&(t.length===n.length&&0===y(t,0,n,0,t.length))},t.setPRNG=function(t){r=t;},function(){var n="undefined"!=typeof self?self.crypto||self.msCrypto:null;if(n&&n.getRandomValues){t.setPRNG((function(t,e){var r,o=new Uint8Array(e);for(r=0;r<e;r+=65536)n.getRandomValues(o.subarray(r,r+Math.min(e-r,65536)));for(r=0;r<e;r++)t[r]=o[r];ft(o);}));}else (n=e(16))&&n.randomBytes&&t.setPRNG((function(t,e){var r,o=n.randomBytes(e);for(r=0;r<e;r++)t[r]=o[r];ft(o);}));}();}(t.exports?t.exports:self.nacl=self.nacl||{});},function(t,n,e){t.exports=e(15).default;},function(t,n,e){e.r(n);var r,o=e(5),i=e(13),s=(r=function(t,n){return (r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n;}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e]);})(t,n)},function(t,n){function e(){this.constructor=t;}r(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e);}),a=function(t){function n(e,r){return o.a.logToConsole=n.logToConsole,o.a.log=n.log,(r=r||{}).nacl=i,t.call(this,e,r)||this}return s(n,t),n}(o.a);n.default=a;},function(t,n){}]);

});

unwrapExports(pusher);

var reactNative = pusher;

/** Wrapper around the core PusherProvider that passes in the Pusher react-native lib */
var PusherProvider = function (props) { return (React__default["default"].createElement(CorePusherProvider, __assign({ _PusherRuntime: reactNative }, props))); };

exports.ADD_MEMBER = ADD_MEMBER;
exports.ChannelsProvider = ChannelsProvider;
exports.NOT_IN_CONTEXT_WARNING = NOT_IN_CONTEXT_WARNING$1;
exports.NO_AUTH_HEADERS_WARNING = NO_AUTH_HEADERS_WARNING;
exports.PusherProvider = PusherProvider;
exports.REMOVE_MEMBER = REMOVE_MEMBER;
exports.SET_STATE = SET_STATE;
exports.__ChannelsContext = __ChannelsContext;
exports.__PusherContext = __PusherContext;
exports.presenceChannelReducer = presenceChannelReducer;
exports.useChannel = useChannel;
exports.useChannels = useChannels;
exports.useClientTrigger = useClientTrigger;
exports.useEvent = useEvent;
exports.usePresenceChannel = usePresenceChannel;
exports.usePusher = usePusher;
exports.useTrigger = useTrigger;
//# sourceMappingURL=index.js.map
