# Cube Workflow Engine

`cube-workflow` is a lightweight, event-driven workflow engine for Cube services, built upon the robust and battle-tested `Google Guava EventBus`. It provides a simple yet powerful mechanism for decoupling different parts of your application, allowing for clean, maintainable, and scalable business process implementation.

## Core Components

The engine's architecture revolves around a few key components:

*   **`WFEngine`**: The central hub of the workflow. It acts as a facade over the `EventBus`, providing a simplified API for posting events and managing listener registration. It is a Spring `@Component`, making it easily injectable throughout your application.

*   **`EventBus`**: The underlying message bus, powered by Google Guava. It handles the dispatching of events to all registered listeners. By default, it operates synchronously, but can be configured for asynchronous execution.

*   **`WFEvent`**: A base class for all business events. Events are plain Java objects that encapsulate information about a specific action or state change. They are the primary means of communication between different parts of the workflow.

*   **`WFListener`**: A specialized event listener that subscribes to the `EventBus`. It contains the core logic for processing events. Upon receiving an event, it identifies the appropriate `WFTask` and executes it.

*   **`WFTask`**: Represents a single, atomic unit of work within a business process. Each task is designed to handle a specific `WFEvent` and contains the business logic for that step of the workflow.

## Workflow Execution Flow

1.  **Initialization**: On application startup, the `WFEngine`'s `@PostConstruct` method automatically registers the `WFListener` with the `EventBus`.

2.  **Event Publication**: A service or another part of the application creates an instance of a `WFEvent` subclass and posts it to the `WFEngine` using the `post(WFEvent event)` method.

3.  **Event Dispatch**: The `WFEngine` immediately passes the event to the `EventBus`.

4.  **Listener Invocation**: The `EventBus` dispatches the event to the `WFListener`, which is subscribed to all `WFEvent` types.

5.  **Task Execution**: The `WFListener` inspects the event, determines the corresponding `WFTask` class, and uses a Spring `BeanFactory` to get an instance of the task. It then invokes the task's `execute()` method, passing the event as a parameter.

6.  **Chaining**: A `WFTask` can, in turn, post new events to the `WFEngine`, allowing for the chaining of tasks and the creation of complex, multi-step workflows.

## Key Features

*   **Decoupling**: Promotes loose coupling between components. Publishers of events don't need to know who the subscribers are, or how the event will be handled.
*   **Simplicity**: The API is minimal and easy to understand. Creating new workflows is as simple as defining new Event and Task classes.
*   **Testability**: Individual tasks can be tested in isolation, simplifying unit testing.
*   **Spring Integration**: Seamlessly integrates with the Spring Framework, leveraging dependency injection for managing components like the `WFEngine` and `WFTask`s.

## Getting Started

1.  **Define an Event**:
    ```java
    public class MyCustomEvent extends WFEvent {
        // Add any relevant data for the event
    }
    ```

2.  **Define a Task**:
    ```java
    @Component
    public class MyCustomTask extends WFTask {
        @Override
        public void handle(WFEvent event) {
            MyCustomEvent customEvent = (MyCustomEvent) event;
            // Implement your business logic here
            System.out.println("Handling MyCustomEvent!");
        }
    }
    ```

3.  **Associate Event with Task**: Ensure your event carries the information about which task should handle it.
    ```java
    public class MyCustomEvent extends WFEvent {
        public MyCustomEvent() {
            this.setClazz(MyCustomTask.class);
        }
    }
    ```

4.  **Post the Event**: Inject the `WFEngine` and post your event.
    ```java
    @Autowired
    private WFEngine wfEngine;

    public void triggerWorkflow() {
        wfEngine.post(new MyCustomEvent());
    }
    ```