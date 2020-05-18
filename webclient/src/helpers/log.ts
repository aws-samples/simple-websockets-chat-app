const log = (...args: any[]) => {
  if (process.env.NODE_ENV == 'development') {
    console.log(...args)
  }
}

export const logger = (first: any) => (...args: any[]) => log(first, ...args);

export default log;
