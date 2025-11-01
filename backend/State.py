import math

class State:
    def __init__(self, puzzle: list, depth: int = 0, zeroindx: int = 0, parent=None):
        self.puzzle = bytes(puzzle)
        self.depth = depth
        self.zeroindx = zeroindx
        self.parent = parent
        self.f = 0
        self.h = 0
        self.g = 0

    def __eq__(self, other):
        return self.puzzle == other.puzzle

    def __hash__(self):
        return hash(self.puzzle)

    def __str__(self):
        result = ["+---+---+---+"]
        for i in range(0, 9, 3):
            row = '| ' + ' | '.join(str(self.puzzle[j]) if self.puzzle[j] != 0 else ' '
                                    for j in range(i, i + 3)) + ' |'
            result.append(row)
            result.append("+---+---+---+")
        result.append(f"Depth: {self.depth}")
        return '\n'.join(result)
    
    def __lt__(self, other):
        return self.f < other.f

    def getrelation(self, other):
        row = self.zeroindx // 3
        col = self.zeroindx % 3
        otherrow = other.zeroindx // 3
        othercol = other.zeroindx % 3
        if otherrow == row+1:
            return "Down"
        elif otherrow == row-1:
            return "Up"
        elif othercol == col+1:
            return "Right"
        elif othercol == col-1:
            return "Left"
        else:
            return None

    def getChildren(self):
        self.children = []
        row = self.zeroindx // 3
        col = self.zeroindx % 3
        dx = [0, 0, -1, 1]
        dy = [-1, 1, 0, 0]
        for i in range(4):
            newrow = row + dy[i]
            newcol = col + dx[i]
            if newrow >= 0 and newrow < 3 and newcol >= 0 and newcol < 3:
                newpuzzle = list(self.puzzle)
                newpuzzle[self.zeroindx], newpuzzle[newrow * 3 +
                                                    newcol] = newpuzzle[newrow * 3 + newcol], newpuzzle[self.zeroindx]
                self.children.append(
                    State(newpuzzle, self.depth + 1, newrow * 3 + newcol, self) )
        return self.children

    def isGoal(self):
        return self.puzzle == bytes([0, 1, 2, 3, 4, 5, 6, 7, 8])
    
    def getState(self):
        return list(self.puzzle)
    
    # def calculateH(self, goal, method):
    #     current = self.getState()
    #     target = goal.getState()
    #     total = 0
    #     for num in range(1, 9):
    #         ci = current.index(num)
    #         gi = target.index(num)
    #         cx, cy = ci % 3, ci // 3
    #         gx, gy = gi % 3, gi // 3
    #         if method == "Manhattan":
    #             total += abs(cx - gx) + abs(cy - gy)
    #         elif method == "Euclidean":
    #             total += math.sqrt((cx - gx) ** 2 + (cy - gy) ** 2)
    #     self.h = total
    #     return self.h
    
    def calculateH(self, method):
        current = self.getState()
        total = 0
        for num in range(9):
            if (current[num] == 0): continue
            ci = num
            gi = current[num]
            cx, cy = ci % 3, ci // 3
            gx, gy = gi % 3, gi // 3
            if method == "Manhattan":
                total += abs(cx - gx) + abs(cy - gy)
            elif method == "Euclidean":
                total += math.sqrt((cx - gx) ** 2 + (cy - gy) ** 2)
        self.h = total
        return self.h

    def calculateG(self):
        self.g = self.depth
        return self.g

    def calculateF(self):
        self.f = self.g + self.h
        return self.f


if __name__ == "__main__":
    state = State([1, 2, 5, 4, 0, 6, 7, 8, 3], 0, 4)
    print("current state:\n", state)
    print("children:\n")
    for child in state.getChildren():
        print(child)

    dub = State([1, 2, 5, 4, 0, 6, 7, 8, 3], 0, 4)
    print(dub == state)

    goal = State([0, 1, 2, 3, 4, 5, 6, 7, 8], 0, 0)
    print(goal.isGoal())