(() => {
  const MSG = Object.freeze({
    COMMENT_CLICKED: "comment-clicked",
    GENERATE: "generate",          
    COMMENT_GENERATED: "comment-generated",
  });

  globalThis.EVY = Object.freeze({ ...(globalThis.EVY || {}), MSG });
})();
