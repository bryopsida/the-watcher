const TYPES = {
  Services: {
    Logging: Symbol.for("Logging"),
    Config: Symbol.for("Config"),
  },
  Factories: {
    Executor: Symbol.for("Executor"),
    Notifications: Symbol.for("Notifications"),
    Downloaders: Symbol.for("Downloaders"),
  },
}
export { TYPES }
