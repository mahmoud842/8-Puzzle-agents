from State import State
def iddfs(initialState : State,maxDepth:int = 31):
    depth = 0
    global nodesExpanded
    nodesExpanded = 0
    while depth <= maxDepth:
        path = set([initialState])
        print(depth)
        goal = dis(initialState, depth,path)
        if goal:
            result =  {
                'goal': goal,
                'cost': goal.depth,
                'nodesExpanded': nodesExpanded,
                'searchDepth': goal.depth
            }
            
            return result
        depth += 1

def dis(state : State, depth:int,path):
    global nodesExpanded
    if state.isGoal() :
        return state
    if depth == 0 :
        return None
    nodesExpanded += 1
    for child in state.getChildren():
        result = None
        if child not in path :
            path.add(child)
            result = dis(child, depth-1,path)
            path.remove(child)
        if result:
            return result
    
if __name__ == "__main__":
    # state = State([1, 0, 2, 3, 4, 5, 6, 7, 8], 0, 1)
    # goal = iddfs (state)
    # # print all data
    # print(goal)
    
    ############
    # 23
# puzzle = [
#     [1, 0, 2],
#     [7, 5, 4],
#     [8, 6, 3]
# ]
    # ez
# puzzle = [
#     [1, 2, 5],
#     [3, 4, 0],
#     [6, 7, 8]
# ]

# no sol
# puzzle = [
#     [1, 2, 3],
#     [4, 5, 6],
#     [8, 7, 0]  # swapped 7 and 8
# ]
# # 27
# # puzzle = [
# #     [8, 6, 7],
# #     [2, 5, 4],
# #     [3, 0, 1]
# # ]
# # 25
# puzzle = [
#     [6, 4, 7],
#     [8, 5, 0],
#     [3, 2, 1]
# ]
    state = State([1, 0, 2, 7, 5, 4, 8, 6, 3], 0, 1, None)
    #tate = State([1, 2, 5, 3, 4, 0, 6, 7, 8], 0, 5, None)
    result = iddfs (state)
    
    # print all data
    print(result['goal'])
    print(result['cost'])
    print(result['nodesExpanded'])
    print(result['searchDepth'])
    



   