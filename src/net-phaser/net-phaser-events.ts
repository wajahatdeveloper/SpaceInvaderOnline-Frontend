// Define a callback function type
type Callback<T> = (data: T, event: ServerEvent) => void;

// Define an enum for different uses
export enum ServerEvent {
  ConnectionSuccess,
  ConnectionFailure,
}

class EventManager<T> {
  private callbacks: Map<ServerEvent, Callback<T>> = new Map();

  // Method to register a callback for a specific outcome
  registerCallback(outcome: ServerEvent, callback: Callback<T>): void {
    this.callbacks.set(outcome, callback);
  }

  // Method to trigger callbacks for a specific outcome
  triggerCallback(outcome: ServerEvent, data: T): void {
    const callback = this.callbacks.get(outcome);
    if (callback) {
      callback(data, outcome);
    }
  }
}

export const eventManager = new EventManager<string>();
