// Generic event (callback) handler for inter-component messaging

class EventBus {

  constructor() {
    this.callbacks = {}
  }

  // Invoke an array of callback for a certain callback key
  emit(key, data) {
    // Stop execution if false is explicitly returned by a callback
    (this.callbacks[key] || []).reduce((acc, callback) => {
      return acc && (callback(data) !== false)
    }, true)
  }

  // Register a new callback with a specific callback key
  on(key, callback) {
    this.callbacks[key] = this.callbacks[key] || []
    this.callbacks[key].push(callback)
  }

  // Un-register an existing callback
  remove(key, callback) {
    this.callbacks[key] = (this.callbacks[key] || []).filter(cb => cb !== callback)
  }

}

module.exports = new EventBus()
