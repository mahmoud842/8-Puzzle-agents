from State import State
from collections import deque
def dfs(initialState : State):
    frontier = deque([initialState])
    frontierset = set([initialState])
    visited = set()
    maxDepth = 0
    nodesExpanded = 0
    while frontier:
        state = frontier.pop()
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


if __name__ == "__main__":
    # state = State([1, 0, 2, 3, 4, 5, 6, 7, 8], 0, 1)
    # goal, nodesExpanded, maxDepth = dfs (state)
    # # print all data
    # print(goal)
    # print(nodesExpanded)
    # print(maxDepth)
    state = State([1, 0, 2, 7, 5, 4, 8, 6, 3], 0, 1, None)
    result = dfs (state)
    # print all data
    print(result['goal'])
    print(result['nodesExpanded'])
    print(result['searchDepth'])
    
    
   
    