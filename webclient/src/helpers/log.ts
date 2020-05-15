export default (...args: any[]) => {
  if (process.env.NODE_ENV == 'development') {
    console.log(...args)
  }
}
