import {ProvenanceEvent} from '@/lib/api/definitions';

// This function sorts an array of events based on their `startsAfter` and `endsBefore` properties.
export function sortEvents(events: ProvenanceEvent[]): ProvenanceEvent[] {
  // `graph` is a Map where each key is an event id, and each value is an array of ids of events that start after the key event.
  const graph = new Map();
  // `incomingEdgeCount` is a Map where each key is an event id, and each value is the number of events that start after the key event.
  const incomingEdgeCount = new Map();

  // Initialize the graph and incomingEdgeCount map
  events.forEach(event => {
    // For each event, create an empty array in the graph, and set the incoming edge count to 0.
    graph.set(event.id, []);
    incomingEdgeCount.set(event.id, 0);
  });

  // Build the graph and update incoming edge counts
  events.forEach(event => {
    // If an event starts after another event, add an edge from the other event to this event in the graph,
    // and increase the incoming edge count for this event.
    if (event.startsAfter) {
      graph.get(event.startsAfter).push(event.id);
      incomingEdgeCount.set(event.id, incomingEdgeCount.get(event.id) + 1);
    }
    // If an event ends before another event, add an edge from this event to the other event in the graph,
    // and increase the incoming edge count for the other event.
    if (event.endsBefore) {
      graph.get(event.id).push(event.endsBefore);
      incomingEdgeCount.set(
        event.endsBefore,
        incomingEdgeCount.get(event.endsBefore) + 1
      );
    }
  });

  // Perform a topological sort
  // Start with a queue of all events that have no incoming edges (i.e., their incoming edge count is 0).
  const queue = Array.from(incomingEdgeCount.entries())
    .filter(([, count]) => count === 0)
    .map(([id]) => id);

  const sorted = [];
  while (queue.length > 0) {
    // Remove an event from the queue, add it to the sorted array,
    // and decrease the incoming edge count for all events that start after it.
    const id = queue.shift();
    sorted.push(events.find(event => event.id === id)!);

    graph.get(id).forEach((neighbor: string) => {
      incomingEdgeCount.set(neighbor, incomingEdgeCount.get(neighbor) - 1);
      // If an event now has no incoming edges, add it to the queue.
      if (incomingEdgeCount.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }

  // Return the sorted array of events
  return sorted;
}
