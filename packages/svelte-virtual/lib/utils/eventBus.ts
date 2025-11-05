type EventCallback<T = any> = (data: T) => void;

class EventBus {
  private static instance: EventBus;
  private events: Record<string, EventCallback[]> = {};

  private constructor() {}

  // Get EventBus instance (Singleton)
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // Subscribe to an event
  public on<T = any>(event: string, callback: EventCallback<T>): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  // Unsubscribe from an event
  public off<T = any>(event: string, callback: EventCallback<T>): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  // Publish (emit) an event
  public emit<T = any>(event: string, data: T): void {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
}

const eventBus = EventBus.getInstance();
export default eventBus;
