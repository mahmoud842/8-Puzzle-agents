import React, { useState, useEffect } from 'react';
import { Play, Shuffle, RotateCcw, ChevronRight, Clock, Layers, Route, TrendingDown, Pause, ChevronLeft, SkipForward, SkipBack, RotateCcwSquare, AlertCircle } from 'lucide-react';

const PuzzleSolverUI = () => {
  const [algorithm, setAlgorithm] = useState('BFS');
  const [puzzleState, setPuzzleState] = useState([1, 2, 5, 3, 4, 0, 6, 7, 8]);
  const [editMode, setEditMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [solutionPath, setSolutionPath] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [animationInterval, setAnimationInterval] = useState(null);
  const [showFullPath, setShowFullPath] = useState(false);

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
    setSelectedTile(null);
  };

  const resetPuzzle = () => {
    setPuzzleState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    setResults(null);
    setSolutionPath([]);
    setCurrentStep(0);
    setSelectedTile(null);
  };

  const handleTileClick = (index) => {
    if (!editMode) return;
    
    if (selectedTile === null) {
      // First tile selected
      setSelectedTile(index);
    } else {
      // Second tile selected - swap them
      const newPuzzle = [...puzzleState];
      [newPuzzle[index], newPuzzle[selectedTile]] = [newPuzzle[selectedTile], newPuzzle[index]];
      setPuzzleState(newPuzzle);
      setSelectedTile(null);
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
          runningTime: data.runningTime,
          success: true
        });
        
        setSolutionPath(data.solutionPath);
        setCurrentStep(0);

        console.log(results)
        console.log(solutionPath)
      } else {
        setResults({
          success: false,
          error: data.error || 'Unable to solve this puzzle configuration'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to backend');
    } finally {
      setIsRunning(false);
    }
  };

  const animateSolution = () => {
    if (solutionPath.length === 0) return;
    
    setAnimating(true);
    setIsPaused(false);
    let step = currentStep;
    
    const interval = setInterval(() => {
      if (step >= solutionPath.length - 1) {
        clearInterval(interval);
        setAnimating(false);
        setAnimationInterval(null);
        return;
      }
      
      step++;
      setPuzzleState(solutionPath[step]);
      setCurrentStep(step);
    }, 500);
    
    setAnimationInterval(interval);
  };

  const pauseAnimation = () => {
    if (animationInterval) {
      clearInterval(animationInterval);
      setAnimationInterval(null);
      setIsPaused(true);
      setAnimating(false);
    }
  };

  const resumeAnimation = () => {
    if (isPaused) {
      animateSolution();
    }
  };

  const stepForward = () => {
    if (currentStep < solutionPath.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setPuzzleState(solutionPath[newStep]);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setPuzzleState(solutionPath[newStep]);
    }
  };

  const resetToFirstStep = () => {
    if (solutionPath.length > 0) {
      setCurrentStep(0);
      setPuzzleState(solutionPath[0]);
      if (animationInterval) {
        clearInterval(animationInterval);
        setAnimationInterval(null);
      }
      setAnimating(false);
      setIsPaused(false);
    }
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
                  Reset to Goal State
                </button>
                
                <button
                  onClick={() => {
                    setEditMode(!editMode);
                    setSelectedTile(null);
                  }}
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
              <div className="space-y-3">
                <button
                  onClick={resetToFirstStep}
                  disabled={animating || currentStep === 0}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  <RotateCcwSquare size={20} />
                  Reset to Step 1
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={stepBackward}
                    disabled={animating || currentStep === 0}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    <SkipBack size={20} />
                    Back
                  </button>
                  
                  <button
                    onClick={stepForward}
                    disabled={animating || currentStep === solutionPath.length - 1}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  >
                    Forward
                    <SkipForward size={20} />
                  </button>
                </div>
                
                {!animating && !isPaused && (
                  <button
                    onClick={animateSolution}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play size={20} />
                    Play Animation
                  </button>
                )}
                
                {animating && (
                  <button
                    onClick={pauseAnimation}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Pause size={20} />
                    Pause Animation
                  </button>
                )}
                
                {isPaused && (
                  <button
                    onClick={resumeAnimation}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Play size={20} />
                    Resume Animation
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Middle Panel - Puzzle Board */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {editMode ? '✏️ Click two tiles to swap' : 'Current State'}
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
                    } ${selectedTile === index ? 'ring-4 ring-yellow-400 scale-110' : ''}`}
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
              ) : results.success === false ? (
                <div className="bg-gradient-to-br from-red-500/30 to-rose-600/30 rounded-2xl p-8 border-2 border-red-400/50 shadow-2xl backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="bg-red-500/20 rounded-full p-4 border-2 border-red-400/50">
                      <AlertCircle size={48} className="text-red-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-100">
                      Puzzle Cannot Be Solved
                    </h3>
                    <p className="text-red-200 text-lg leading-relaxed">
                      {results.error || 'This puzzle configuration cannot be solved. The puzzle may be in an unsolvable state.'}
                    </p>
                    {/* <div className="bg-red-500/20 rounded-xl p-4 border border-red-400/30 w-full">
                      <p className="text-red-100 text-sm font-semibold mb-2">💡 Tip:</p>
                      <p className="text-red-200 text-sm">
                        Try generating a random puzzle or resetting to the goal state, then make valid moves to create a solvable configuration.
                      </p>
                    </div> */}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30">
                    <div className="flex items-center justify-between gap-2 text-cyan-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Route size={20} />
                        <span className="font-semibold">Path to Goal</span>
                      </div>
                      <button
                        onClick={() => setShowFullPath(!showFullPath)}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-all"
                      >
                        {showFullPath ? 'Show Less' : 'Show All'}
                      </button>
                    </div>
                    <div className={`flex flex-wrap gap-2 ${!showFullPath ? 'max-h-20 overflow-hidden' : ''}`}>
                      {results.pathToGoal.map((move, idx) => (
                        <span key={idx} className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                          {move}
                        </span>
                      ))}
                    </div>
                    {!showFullPath && results.pathToGoal.length > 6 && (
                      <div className="text-center text-cyan-300 text-sm mt-2">
                        ... and {results.pathToGoal.length - 6} more moves
                      </div>
                    )}
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