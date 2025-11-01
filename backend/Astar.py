import heapq
from State import State

def astar(initialState: State, heuristic_type: str = "manhattan"):
    frontier = []
    frontier_set = set()
    visited = set()

    initialState.calculateG()
    initialState.calculateH(heuristic_type)
    initialState.calculateF()

    heapq.heappush(frontier, (initialState.f, initialState))
    frontier_set.add(initialState)

    maxDepth = 0

    while frontier:
        _, current = heapq.heappop(frontier)
        frontier_set.remove(current)
        maxDepth = max(maxDepth, current.depth)

        if current.isGoal():
            return {
                'goal': current,
                'cost': current.g,
                'nodesExpanded': len(visited),
                'searchDepth': maxDepth
            }

        visited.add(current)

        for child in current.getChildren():
            if child in visited:
                continue

            child.calculateG()
            child.calculateH(heuristic_type)
            child.calculateF()

            if child not in frontier_set:
                heapq.heappush(frontier, (child.f, child))
                frontier_set.add(child)


    return {
        'goal': None,
        'cost': None,
        'nodesExpanded': None,
        'searchDepth': None
    }
