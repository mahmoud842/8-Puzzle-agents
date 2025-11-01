from flask import Flask, request, jsonify
from flask_cors import CORS
from State import State
from collections import deque
import time
from util import *
from dfs import dfs
from IDS import iddfs
from bfs import bfs
from Astar import astar

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
        
        # Check solvable
        if not solvable(puzzle):
            return jsonify({'success': False, 'error': 'Unsolvable puzzle'}), 400
        
        # Find zero index
        zeroIndex = puzzle.index(0)
        
        # Create initial state
        initialState = State(puzzle, 0, zeroIndex, None)
        
        # Start timing
        startTime = time.time()
        
        # Run the selected algorithm
        if algorithm == 'BFS':
            result = build_output(bfs(initialState))

        elif algorithm == 'DFS':
            result = build_output(dfs(initialState))

        elif algorithm == 'IDFS':
            result = build_output(iddfs(initialState))

        elif algorithm.startswith('A*'):
            result = build_output(astar(initialState, algorithm[3:]))

        else:
            return jsonify({'success': False, 'error': 'Unknown algorithm'}), 400
        
        # End timing
        endTime = time.time()
        runningTime = round(endTime - startTime, 6)
        result['runningTime'] = runningTime

        return jsonify(result)
            
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)