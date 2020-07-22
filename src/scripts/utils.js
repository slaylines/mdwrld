export const debounce = (func, context, delay = 0) => {
  let timeout;

  return (...args) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(
      () => requestAnimationFrame(func.bind(context, ...args)),
      delay
    );
  };
};

export const getClient = (event) => ({
  x: event.targetTouches ? event.targetTouches[0].clientX : event.clientX,
  y: event.targetTouches ? event.targetTouches[0].clientY : event.clientY,
});
