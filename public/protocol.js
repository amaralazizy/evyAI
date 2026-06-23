(() => {
  const MSG = Object.freeze({
    SET_SELECTORS: "set-selectors",
    ELEMENT_CAPTURED: "element-captured",
    INSERT_IN_ELEMENT: "insert-in-element",
  });

  globalThis.EVY = Object.freeze({ ...(globalThis.EVY || {}), MSG });
})();
