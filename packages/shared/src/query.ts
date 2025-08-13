export const waitForQuery = <T>(
  query: () => T | null | undefined,
  callback: (result: T) => void,
  options:
    | number
    | {
        target: Node;
        config?: MutationObserverInit;
      },
): (() => void) => {
  const initialResult = query();
  if (initialResult !== null && initialResult !== undefined) {
    callback(initialResult);
    return () => {};
  }

  if (typeof options === "number") {
    const intervalId = setInterval(() => {
      const queryResult = query();
      if (queryResult !== null && queryResult !== undefined) {
        clearInterval(intervalId);
        callback(queryResult);
      }
    }, options);

    return () => clearInterval(intervalId);
  } else {
    const { target, config = { childList: true, subtree: true } } = options;

    const observer = new MutationObserver((_, obs) => {
      const queryResult = query();
      if (queryResult !== null && queryResult !== undefined) {
        obs.disconnect();
        callback(queryResult);
      }
    });

    observer.observe(target, config);

    return () => observer.disconnect();
  }
};
