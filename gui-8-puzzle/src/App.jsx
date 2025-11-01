import React, { useState, useEffect } from 'react';
import { Play, Shuffle, RotateCcw, ChevronRight, Clock, Layers, Route, TrendingDown } from 'lucide-react';

const PuzzleSolverUI = () => {
  const [algorithm, setAlgorithm] = useState('BFS');
  const [puzzleState, setPuzzleState] = useState([1, 2, 5, 3, 4, 0, 6, 7, 8]);
  const [editMode, setEditMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [solutionPath, setSolutionPath] = useState([]);
  const [animating, setAnimating] = useState(false);

  const algorithms = [
    { id: 'BFS', name: 'BFS', color: 'from-blue-500 to-cyan-500' },
    { id: 'DFS', name: 'DFS', color: 'from-purple-500 to-pink-500' },
    { id: 'IDFS', name: 'Iterative DFS', color: 'from-green-500 to-emerald-500' },
    { id: 'A*_Manhattan', name: 'A* (Manhattan)', color: 'from-orange-500 to-red-500' },
    { id: 'A*_Euclidean', name: 'A* (Euclidean)', color: 'from-yellow-500 to-amber-500' }
  ];

  const generateRandomPuzzle = () => {
    let puzzle = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = puzzle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
    }
    setPuzzleState(puzzle);
    setResults(null);
    setSolutionPath([]);
    setCurrentStep(0);
  };

  const resetPuzzle = () => {
    setPuzzleState([1, 2, 5, 3, 4, 0, 6, 7, 8]);
    setResults(null);
    setSolutionPath([]);
    setCurrentStep(0);
  };

  const handleTileClick = (index) => {
    if (!editMode) return;
    
    const zeroIndex = puzzleState.indexOf(0);
    const row = Math.floor(index / 3);
    const col = index % 3;
    const zeroRow = Math.floor(zeroIndex / 3);
    const zeroCol = zeroIndex % 3;
    
    if ((Math.abs(row - zeroRow) === 1 && col === zeroCol) || 
        (Math.abs(col - zeroCol) === 1 && row === zeroRow)) {
      const newPuzzle = [...puzzleState];
      [newPuzzle[index], newPuzzle[zeroIndex]] = [newPuzzle[zeroIndex], newPuzzle[index]];
      setPuzzleState(newPuzzle);
    }
  };

  const runAlgorithm = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const response = await fetch('http://localhost:5000/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          puzzle: puzzleState,
          algorithm: algorithm
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResults({
          pathToGoal: data.pathToGoal,
          costOfPath: data.costOfPath,
          nodesExpanded: data.nodesExpanded,
          searchDepth: data.searchDepth,
          maxDepth: data.maxDepth,
          runningTime: data.runningTime
        });
        
        setSolutionPath(data.solutionPath);
        setCurrentStep(0);

        console.log(results)
        console.log(solutionPath)
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to backend');
    } finally {
      setIsRunning(false);
    }
  };

  // const runAlgorithm = async () => {
  //   setIsRunning(true);
  //   setResults(null);
    
  //   const startTime = performance.now();
    
  //   // Simulate algorithm execution - integrate with your Python backend here
  //   await new Promise(resolve => setTimeout(resolve, 1000));
    
  //   const endTime = performance.now();
  //   const runningTime = ((endTime - startTime) / 1000).toFixed(3);
    
  //   // Mock results - replace with actual algorithm results
  //   const mockResults = {
  //     pathToGoal: ['Up', 'Left', 'Down', 'Right', 'Up'],
  //     costOfPath: 5,
  //     nodesExpanded: 23,
  //     searchDepth: 5,
  //     maxDepth: 8,
  //     runningTime: runningTime
  //   };
    
  //   // Mock solution path - replace with actual path from algorithm
  //   const mockPath = [
  //     [1, 2, 5, 3, 4, 0, 6, 7, 8],
  //     [1, 2, 0, 3, 4, 5, 6, 7, 8],
  //     [1, 0, 2, 3, 4, 5, 6, 7, 8],
  //     [0, 1, 2, 3, 4, 5, 6, 7, 8]
  //   ];
    
  //   setResults(mockResults);
  //   setSolutionPath(mockPath);
  //   setCurrentStep(0);
  //   setIsRunning(false);
  // };

  const animateSolution = () => {
    if (solutionPath.length === 0) return;
    
    setAnimating(true);
    let step = 0;
    
    const interval = setInterval(() => {
      if (step >= solutionPath.length) {
        clearInterval(interval);
        setAnimating(false);
        return;
      }
      
      setPuzzleState(solutionPath[step]);
      setCurrentStep(step);
      step++;
    }, 500);
  };

  const getTileColor = (num) => {
    const colors = [
      'bg-gray-800', // 0 (empty)
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-cyan-400 to-cyan-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-red-400 to-red-600'
    ];
    return colors[num];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            🧩 8-Puzzle Solver
          </h1>
          <p className="text-xl text-purple-200">AI Search Algorithms Visualizer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Algorithm Selection */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="text-cyan-400" />
                Select Algorithm
              </h2>
              <div className="space-y-3">
                {algorithms.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setAlgorithm(algo.id)}
                    className={`w-full p-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                      algorithm === algo.id
                        ? `bg-gradient-to-r ${algo.color} shadow-lg scale-105`
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Puzzle Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">Puzzle Setup</h2>
              <div className="space-y-3">
                <button
                  onClick={generateRandomPuzzle}
                  disabled={isRunning || animating}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  <Shuffle size={20} />
                  Random Puzzle
                </button>
                
                <button
                  onClick={resetPuzzle}
                  disabled={isRunning || animating}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  <RotateCcw size={20} />
                  Reset to Default
                </button>
                
                <button
                  onClick={() => setEditMode(!editMode)}
                  disabled={isRunning || animating}
                  className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                    editMode
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {editMode ? '✓ Edit Mode ON' : 'Edit Mode OFF'}
                </button>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runAlgorithm}
              disabled={isRunning || animating}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl text-xl"
            >
              <Play size={24} />
              {isRunning ? 'Running...' : 'Solve Puzzle'}
            </button>

            {solutionPath.length > 0 && (
              <button
                onClick={animateSolution}
                disabled={animating}
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <ChevronRight size={20} />
                {animating ? 'Animating...' : 'Animate Solution'}
              </button>
            )}
          </div>

          {/* Middle Panel - Puzzle Board */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {editMode ? '✏️ Click tiles to move' : 'Current State'}
              </h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {puzzleState.map((num, index) => (
                  <div
                    key={index}
                    onClick={() => handleTileClick(index)}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-4xl font-bold text-white transition-all duration-300 transform shadow-lg ${
                      num === 0
                        ? 'bg-gray-800/50 cursor-default'
                        : `${getTileColor(num)} ${editMode ? 'cursor-pointer hover:scale-110 hover:shadow-2xl' : ''}`
                    }`}
                  >
                    {num !== 0 && num}
                  </div>
                ))}
              </div>

              {solutionPath.length > 0 && (
                <div className="text-center text-white">
                  <p className="text-lg">
                    Step <span className="font-bold text-cyan-400">{currentStep + 1}</span> of{' '}
                    <span className="font-bold text-pink-400">{solutionPath.length}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Route className="text-yellow-400" />
                Results
              </h2>
              
              {!results ? (
                <div className="text-center text-purple-200 py-12">
                  <p className="text-lg">Run an algorithm to see results</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30">
                    <div className="flex items-center gap-2 text-cyan-300 mb-2">
                      <Route size={20} />
                      <span className="font-semibold">Path to Goal</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {results.pathToGoal.map((move, idx) => (
                        <span key={idx} className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                          {move}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-400/30">
                    <div className="flex items-center gap-2 text-green-300 mb-1">
                      <TrendingDown size={20} />
                      <span className="font-semibold">Cost of Path</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{results.costOfPath}</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/30">
                    <div className="flex items-center gap-2 text-purple-300 mb-1">
                      <Layers size={20} />
                      <span className="font-semibold">Nodes Expanded</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{results.nodesExpanded}</p>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30">
                    <div className="text-yellow-300 mb-2 font-semibold">Search Metrics</div>
                    <div className="space-y-2 text-white">
                      <div className="flex justify-between">
                        <span>Search Depth:</span>
                        <span className="font-bold">{results.searchDepth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Depth:</span>
                        <span className="font-bold">{results.maxDepth}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-4 border border-pink-400/30">
                    <div className="flex items-center gap-2 text-pink-300 mb-1">
                      <Clock size={20} />
                      <span className="font-semibold">Running Time</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{results.runningTime}s</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzleSolverUI;