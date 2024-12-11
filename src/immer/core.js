import * as is from "./is";
export const INTERNAL = Symbol("INTERNAL");
export function produce(baseState, producer) {
  const proxy = toProxy(baseState);
  producer(proxy);
  const internal = proxy[INTERNAL];
  return internal.mutated ? internal.draftState : baseState;
}

export function toProxy(baseState, valueChange) {
  let keyToProxy = {};
  let internal = {
    draftState: createDraftState(baseState),
    keyToProxy,
    mutated: false,
  };
  return new Proxy(baseState, {
    get(target, key) {
      if (key === INTERNAL) {
        return internal;
      }
      const value = target[key];
      if (is.isObject(value) || is.isArray(value)) {
        if (key in keyToProxy) {
          return keyToProxy[key];
        } else {
          keyToProxy[key] = toProxy(value, () => {
            internal.mutated = true;
            const proxyOfChild = keyToProxy[key];
            const { draftState } = proxyOfChild[INTERNAL];
            internal.draftState[key] = draftState;
            valueChange && valueChange();
          });
          return keyToProxy[key];
        }
      } else if (is.isFunction(value)) {
        internal.mutated = true;
        valueChange && valueChange();
        return value.bind(internal.draftState);
      }
      return internal.mutated ? internal.draftState[key] : baseState[key];
    },
    set(target, key, value) {
      internal.mutated = true;
      let { draftState } = internal;
      for (const key in target) {
        draftState[key] = key in draftState ? draftState[key] : target[key];
      }
      draftState[key] = value;
      valueChange && valueChange();
      return true;
    },
  });
  function createDraftState(baseState) {
    if (is.isArray(baseState)) {
      return [...baseState];
    } else if (is.isObject(baseState)) {
      return Object.assign({}, baseState);
    } else {
      return baseState;
    }
  }
}
