def build_output(result):
    goal = result["goal"]

    if goal is None:
        return {
            "success": False,
            "pathToGoal": [],
            "costOfPath": 0,
            "nodesExpanded": result["nodesExpanded"],
            "searchDepth": result["searchDepth"],
            "maxDepth": result["searchDepth"],
            "runningTime": None,
            "solutionPath": []
        }

    # backtrack from goal to root
    path = []
    path_steps = []
    current = goal
    while current.parent is not None:
        path.append(current.getState())
        path_steps.append(current.parent.getrelation(current))
        current = current.parent
    path.append(current.getState())
    path.reverse()
    path_steps.reverse()

    return {
        "success": True,
        "pathToGoal": path_steps,
        "costOfPath": result["cost"],
        "nodesExpanded": result["nodesExpanded"],
        "searchDepth": result["searchDepth"],
        "maxDepth": result["searchDepth"],
        "runningTime": None,
        "solutionPath": path
    }

def getInvCount(arr):
    inv_count = 0
    empty_value = 0
    for i in range(0, 9):
        for j in range(i + 1, 9):
            if arr[j] != empty_value and arr[i] != empty_value and arr[i] > arr[j]:
                inv_count += 1
    return inv_count

def solvable(board):
    inv_count = getInvCount(board)
    return (inv_count % 2 == 0)