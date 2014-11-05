
if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}


window.onload = function() {

		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');
                var fileDisplayMessageArea = document.getElementById('fileDisplayMessageArea');
                
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];
			var textType = /text.*/;

			if (file.type.match(textType)) {
				var reader = new FileReader();

				reader.onload = function(e) {
                                        fileDisplayMessageArea.innerText = 'Your file looks like this';
                                        
                                        fileDisplayArea.innerText = reader.result;
                                        data = reader.result;
                                        var mySudoku = new Sudoku(data);
                                      
					mySudoku.solve()
						
				};

				reader.readAsText(file);	
                               
			} else {
				fileDisplayArea.innerText = "File not supported!";
			}
		});
};




function Sudoku(data) {
    this.text = data;
    this.board = []
    this.emptyCells = []

    // Find the length of one board.
    count = 0

    for (item = 0; item < this.text.length; item++) {
	
	if (this.text[item] == '|') {
		// After hitting the end of the first grid, the value has been found
		break
		// This value is an integer or blank spot, count it
	} else if ((!isNaN(this.text[item]) || this.text[item] == '.') && this.text[item] != ' ') {
		count++
	} 
    }
    
    // Set an instance variable to keep track of the length of a board
    this.N = count

    

    // Initialize the board
    for (row = 0; row < this.N * this.N; row++) {
	    this.board.push([])
    }


    

    this.fill = function(lines) {

	    // Fill the board with the lines given
	    start = 0
            end = this.N * this.N
	    for (row = 0; row < this.N * this.N; row++) {
		    line = lines.slice(start, end)
		    for (column = 0; column < this.N * this.N; column++) {
			// Cast the strings to integers, and insert them into the array accordingly
	           	this.setCell(row, column, parseInt(line[column]))
		    }
		    // Move on to the next row to slice
		    start = end
		    end += this.N * this.N
	    }
	     
    } 


    this.fancyFill = function() {
	    // Strip out the stuff that is not needed
	    var lines = this.text.replace(/\+`/g, '').replace(/\./g, '0').replace(/\|/g, ' ').replace(/\-/g, '').replace(/\s+/g, '')
	    
    	    // Send to fill() to construct the array
	    this.fill(lines)
    }

    // Returns a string of the seperator row
    this.getSeperatorRow = function() {
	    
	    for (item = 0; item < this.text.length; item++) {
		if (this.text[item] == '-') {
			// Found the start of a seperator row, now find the end
			count = item
			while (isNaN(this.text[count])) {
				count++
			}

			// Found the start and end, now slice and return the string
			return this.text.slice(item, count)	
		 }
	    }	
    }
			    

    // Shows the board via console.log() that is currently in memory
    this.show = function() {

    	    for (row = 0; row < this.N * this.N; row++) {
		tempRow = ''
		for (column = 0; column < this.N * this.N; column++) {
			// Are we at a seperator column?
			if (column % this.N == 0 && column != 0) {
				tempRow += '| '
			}
			tempRow += this.getCell(row, column) + ' '
		}

		// Are we at a seperator row?
		if (row % this.N == 0 && row != 0) {		
			console.log(this.getSeperatorRow())
		}

		// If not, print the constructed row
		console.log(tempRow) 
	}

	    				
    }	


    // Getter for the board 
    this.getCell = function(row, column) {
	  return this.board[row][column]
    }

    // Setter for the board
    this.setCell = function(row, column, value) {
	this.board[row][column] = value

    }


    // Returns a boolean if the value is allowed at the given row
    this.checkRow = function(row, value) {
    	for (column = 0; column < this.N * this.N; column++) {		
		if (this.getCell(row, column) == value) {
			return false
		}
	}
	return true	
    }

 
    // Returns a boolean if the value is allowed at the given column
    this.checkColumn = function(column, value) {	
	for (row = 0; row < this.N * this.N; row++) {
    		if (this.getCell(row, column) == value) {
			return false
		}
	}
	return true	
	
    }

    // Returns a boolean if the value is allowed in one of the boards squares
    this.checkSquare = function(row, column, value) {

	    square = ''

	    // Variables to find the corner of the square
	    lowerCol = 0
	    lowerRow = 0
	    

	    // Find inner column and row bounds
	    while (column >= lowerCol + this.N) {
		  lowerCol += this.N
	    }

	    while (row >= lowerRow + this.N) {
		  lowerRow += this.N
	    }
	
	 
	    // Bounds for the outer end of the square
	    upperRow = lowerRow + this.N
	    upperCol = lowerCol + this.N
	    
	    // Loop through rows and slice the square
	    for (row = lowerRow; row < upperRow; row++) {
		    for (column = lowerCol; column < upperCol; column++) {
		    	square += this.getCell(row, column)
		    }
	    }
	    
	    // The square has been built, now check it for the values and return accordingly
    	    for (item = 0; item < square.length; item++) {
		    if (square[item] == value) {
			    return false
		    }
	    }
	  
	    return true
		    	
	}


    // Returns a boolean if the value is allowed at a specific row and column on the board
    this.checkValue = function(row, column, value) {
	if (this.checkRow(row, value) && this.checkColumn(column, value) && this.checkSquare(row, column, value)) {
		return true
	} else {
	       	return false
	}
    } 


   

   // Returns a boolean if the current board is a solution
   this.isSolution = function() {
	for (i = 0; i < this.N * this.N; i++) { // Row counter
		for (j = 0; j < this.N * this.N; j++) { // Column counter
			for (n = 1; n <= 9; n++) { // 1-9 counter
				if (this.checkValue(i, j, n)) {
					return false
				}
			}
		
		}
	}
	
	return true
    }
   
 
   // Find the possibilities of each empty cell generated and save them into the cells array at position 2
   this.generatePossibilities = function() {

	for (cell = 0; cell < this.emptyCells.length; cell++) {

		// Variables of the cell currently on
		cellRow = this.emptyCells[cell][0]
		cellCol = this.emptyCells[cell][1]

		for (n = 1; n <= 9; n++) {
			// If this number 1-9 works, add it to the possibilities for the given cell
			if (this.checkValue(cellRow, cellCol, n)) {
				this.emptyCells[cell][2].push(n)
			}
		}
	}
   }			

   // Finds all the empty cells on the board	 
   this.findEmptyCells = function() {

	   for (row = 0; row < this.N * this.N; row++) {
		   for (column = 0; column < this.N * this.N; column++) {
			   if (this.getCell(row, column) == 0) {
				   // Log the row, column, and possible values for this spot
				   this.emptyCells.push([row, column, []])
				
					   
			   }
		   }
	   }
		// Now, generate possibilities for all the cells
	   this.generatePossibilities();	
   }
   

   // Solves the sudoku board
   this.solve = function() {

	// Start by stripping and constructing the array
	this.fancyFill()

   	// Find empty cells and generate possible solutions for them
	this.findEmptyCells()
	
	// Begin to solve
	currentCell = 0	
	iterations = 0

	// Loop through each empty cell
	while (currentCell != this.emptyCells.length) {
		iterations++
	
		// In the case that cell 1 was unsolvable, exit before it backtracks another
		if (currentCell == -1) {
			alert('This board is unsolvable.')
			return
		}

		
		// Save the current cells info
		cellRow = this.emptyCells[currentCell][0]
		cellCol = this.emptyCells[currentCell][1]
		cellPossible = this.emptyCells[currentCell][2]
		cellValue = parseInt(this.getCell(cellRow, cellCol))
	
		// Find where the current number on the board is in the array of possibilities
		if (cellValue == 0) {	
			cellIndex = 0
		} else {
			cellIndex = cellPossible.indexOf(parseInt(cellValue)) + 1
		}

						
	
		// Loop through the values this cell can be, and try them.
		for (val = cellIndex; val < cellPossible.length; val++) {
			found = false
			if (this.checkValue(cellRow, cellCol, cellPossible[val]) && found == false) {
				// This value is good set it and move on
				found = true
				currentCell++
				this.setCell(cellRow, cellCol, cellPossible[val])
				break	
			}
		}
	
		// If 1-9 is tried at this cell and it fails, backtrack	
		if (!found) {
			this.setCell(cellRow, cellCol, 0)
			currentCell--	
		}	
	}

	// A solution has been found!
	alert('Solution found! It took ' + iterations + ' iterations.')
	// Show the solution
	this.show()		
    }		
	
	
}	
