from flask import Flask, request, jsonify
from flask_cors import CORS
from State import State
from collections import deque
import time
from dfs import dfs
from IDS import iddfs

app = Flask(__name__)
CORS(app)

@app.route('/solve', methods=['POST'])
def solve_puzzle():
    try:
        data = request.json
        
        # Extract data from request
        puzzle = data.get('puzzle')
        algorithm = data.get('algorithm')
        
        if not puzzle or not algorithm:
            return jsonify({'success': False, 'error': 'Missing puzzle or algorithm'}), 400
        
        # Find zero index
        zeroIndex = puzzle.index(0)
        
        # Create initial state
        initialState = State(puzzle, 0, zeroIndex, None)
        
        # Start timing
        startTime = time.time()
        
        # Run the selected algorithm
        if algorithm == 'BFS':
            result = {'success': False, 'error': 'IDFS not yet implemented'}

        elif algorithm == 'DFS':
            result = build_output(dfs(initialState))

        elif algorithm == 'IDFS':
            result = build_output(iddfs(initialState))

        elif algorithm.startswith('A*'):
            result = {'success': False, 'error': 'A* not yet implemented'}

        else:
            return jsonify({'success': False, 'error': 'Unknown algorithm'}), 400
        
        # End timing
        endTime = time.time()
        runningTime = round(endTime - startTime, 3)
        result['runningTime'] = runningTime

        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)