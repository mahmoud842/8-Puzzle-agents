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
        maxDepth = max(maxDepth, state.depth)
        visited.add(state)
        if state.isGoal():
            nodesExpanded = len(visited)
            return state,nodesExpanded,maxDepth
        for child in state.getChildren():
            if child not in visited and child not in frontierset:
                frontier.append(child)
                frontierset.add(child)
    return None


if __name__ == "__main__":
    state = State([1, 0, 2, 3, 4, 5, 6, 7, 8], 0, 1)
    goal, nodesExpanded, maxDepth = dfs (state)
    # print all data
    print(goal)
    print(nodesExpanded)
    print(maxDepth)
    
   
    