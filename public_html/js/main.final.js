
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
                                      
					// These test cases will work for a 2x2 board
					console.log(mySudoku.isSolution()) // Tests isSolution() before solving
					mySudoku.solve() // Tests solve() fill() fancyFill() getCell() and setCell()
					console.log(mySudoku.isSolution()) // Tests isSolution() after solving
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

    // Find the length of one board (count the valid integers and blank spots up to the first seperator)
    count = 0

    for (item = 0; item < this.text.length; item++) {
	
	if (this.text[item] == '|') {
		break
	// This character is an integer, or a blank spot
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

	    // Fill the board array with the lines given
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

	    // Strip out the characters that are not needed and replace . with 0 for simplicity when solving
	    var lines = this.text.replace(/\+/g, '').replace(/\./g, '0').replace(/\|/g, ' ').replace(/\-/g, '').replace(/\s+/g, '')

	    // Send to fill to construct the array
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
			    

    // console.log()s the current board in memory
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

		// Are we at a seperator row? If so print it out
		if (row % this.N == 0 && row != 0) {		
			console.log(this.getSeperatorRow())
		}

		// If not, print a number row
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
     
        // Check if the value exists in the row given. Returns false if it exists.		
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

    // Returns a boolean if the value is allowed in the square that the cell (row, column) is contained in
    this.checkSquare = function(row, column, value) {
	  
	    square = ''

	    // Variables to find the corner of the square
	    lowerCol = 0
	    lowerRow = 0
	    

	    // Find lower column and row bounds of the square in the array
	    while (column >= lowerCol + this.N) {
		  lowerCol += this.N
	    }

	    while (row >= lowerRow + this.N) {
		  lowerRow += this.N
	    }
	
	 
	    // Upper bounds of the square
	    upperRow = lowerRow + this.N
	    upperCol = lowerCol + this.N
	   
	    
	    for (row = lowerRow; row < upperRow; row++) {
		    for (column = lowerCol; column < upperCol; column++) {
		    	square += this.getCell(row, column)
		    }
	    }
	    
	    

	    // The square has been built, now check it for the value and return accordingly. 
    	    for (item = 0; item < square.length; item++) {
		    if (square[item] == value) {
			    return false
		    }
	    }
	  
	    return true
		    	
	}


    // Returns a boolean if the value is allowed at a specific spot on the board
    this.checkValue = function(row, column, value) {
	if (this.checkRow(row, value) && this.checkColumn(column, value) && this.checkSquare(row, column, value)) {
		return true
	} else {
	       	return false
	}
    } 


   

   // Returns a boolean if the current board is a solution
   this.isSolution = function() {

	// These counter variables need to be in the local scope
	for (var row = 0; row < this.N * this.N; row++) {
		for (var column = 0; column < this.N * this.N; column++) {
			for (var n = 1; n <= this.N * this.N; n++) {
				if (this.checkValue(row, column, n)) {
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
		// Variables of the cell
		cellRow = this.emptyCells[cell][0]
		cellCol = this.emptyCells[cell][1]
		for (n = 1; n <= this.N * this.N; n++) {
			// If this number works, add it to the possibilities for the given cell
			if (this.checkValue(cellRow, cellCol, n)) {
				this.emptyCells[cell][2].push(n)
			}
		}
	}
   }			

   // Finds all the empty cells in the board	 
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

   // Solves the current sudoku board in memory
   this.solve = function() {
  
	// Construct the board array
	this.fancyFill()
	 
	// Find empty cells and generate possible solutions for them
	this.findEmptyCells()

	// Backtrack algorithm begins
	currentCell = 0	
	iterations = 0

	// Loop through each empty cell
	while (currentCell != this.emptyCells.length) {
		iterations++
	
		// In the case that cell 1 was unsolvable, leave the function as there is no solution to the board
		if (currentCell == -1) {
			console.log('This board is unsolvable.')
			return
		}

		
		// Save the current cells info
		cellRow = this.emptyCells[currentCell][0]
		cellCol = this.emptyCells[currentCell][1]
		cellPossible = this.emptyCells[currentCell][2]
		cellValue = parseInt(this.getCell(cellRow, cellCol))
	
		// Find where the current number on the board at this cell is in the array of possibilities
		if (cellValue == 0) {
			// This is the first time seeing this cell, start it at the first index	
			cellIndex = 0
		} else {
			// This cell has been worked with before, start it at the next index then what it was at
			cellIndex = cellPossible.indexOf(cellValue) + 1
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
	
		// Already tried all the possible values for this cell and they are not allowed, backtrack	
		if (!found) {
			this.setCell(cellRow, cellCol, 0)
			currentCell--	
		}	
	}

		// The loop is done, therefore a solution has been found
		console.log('Solution found! It took ' + iterations + ' iterations.')
		
		// console.log() out the board
		this.show()		
	}		
	   

   
	
}	
