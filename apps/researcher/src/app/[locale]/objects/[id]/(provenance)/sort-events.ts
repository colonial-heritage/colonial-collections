import {ProvenanceEvent} from '@colonial-collections/api';

export function sortEvents(events: ProvenanceEvent[]): ProvenanceEvent[] {
  const graph = new Map();
  const incomingEdgeCount = new Map();

  // Step 1: Initialize the `graph` and `incomingEdgeCount` map
  // Input: events array.
  // Operation: For each event, create an empty array in the graph,
  // and set the incoming edge count to 0.
  // Output: `graph` and `incomingEdgeCount` maps initialized with each event id.
  events.forEach(event => {
    graph.set(event.id, []);
    incomingEdgeCount.set(event.id, 0);
  });

  // Step 2: Build the graph and update incoming edge counts
  // Input: events array, graph and incomingEdgeCount maps.
  // Operation: For each event:
  // if it starts after another event,
  // add an edge from the other event to this event in the graph,
  // and increase the incoming edge count for this event.
  // If it ends before another event,
  // add an edge from this event to the other event in the graph,
  // and increase the incoming edge count for the other event.
  // Output: graph map with edges between events, incomingEdgeCount map with counts
  // of incoming edges for each event.
  events.forEach(event => {
    if (event.startsAfter) {
      graph.get(event.startsAfter).push(event.id);
      incomingEdgeCount.set(event.id, incomingEdgeCount.get(event.id) + 1);
    }
    if (event.endsBefore) {
      graph.get(event.id).push(event.endsBefore);
      incomingEdgeCount.set(
        event.endsBefore,
        incomingEdgeCount.get(event.endsBefore) + 1
      );
    }
  });

  // Step 3: Initialize the queue of events
  // Input: `incomingEdgeCount` map.
  // Operation: Create a queue of all events that have no incoming edges
  // (i.e., their incoming edge count is 0).
  // Output: `queueOfEvents` array with ids of events that have no incoming edges.
  const queueOfEvents = Array.from(incomingEdgeCount.entries())
    .filter(([, count]) => count === 0)
    .map(([id]) => id);

  // Step 4: Perform a topological sort
  // Input: `queueOfEvents` array, `graph` and `incomingEdgeCount` maps.
  // Operation: While the queue is not empty, remove an event from the `queue`,
  // add it to the sorted array,
  // and decrease the incoming edge count for all events that start after it.
  // If an event now has no incoming edges, add it to the `queue`.
  // Output: `sortedEvents` array with events sorted based on their
  // `startsAfter` and `endsBefore` properties.
  const sortedEvents = [];
  while (queueOfEvents.length > 0) {
    const id = queueOfEvents.shift();
    sortedEvents.push(events.find(event => event.id === id)!);

    graph.get(id).forEach((neighbor: string) => {
      incomingEdgeCount.set(neighbor, incomingEdgeCount.get(neighbor) - 1);
      if (incomingEdgeCount.get(neighbor) === 0) {
        queueOfEvents.push(neighbor);
      }
    });
  }

  return sortedEvents;
}
