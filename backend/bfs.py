from State import State
from collections import deque
def bfs(initialState : State):
    frontier = deque([initialState])
    frontierset = set([initialState])
    visited = set()
    maxDepth = 0
    while frontier:
        state = frontier.popleft()
        frontierset.remove(state)
        maxDepth = max(maxDepth, state.depth)
        visited.add(state)
        if state.isGoal():
            result = {
                'goal': state,
                'cost': state.depth,
                'nodesExpanded': len(visited),
                'searchDepth': maxDepth
            }
            return result
        for child in state.getChildren():
            if child not in visited and child not in frontierset:
                frontier.append(child)
                frontierset.add(child)
    return {
                'goal': None,
                'cost': None,
                'nodesExpanded':None,
                'searchDepth': None
            }
