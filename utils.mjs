const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

export { sleep, getRandomInt };
