var size = 10;
document.querySelectorAll('.difficulty-button').forEach(button => {
    button.addEventListener('click', function() {
        var difficulty = this.textContent;
        startGame(difficulty);
    });
});

function openEmptyCells(cell) {
    var row = cell.parentNode.rowIndex;
    var col = cell.cellIndex;
    for (var i = Math.max(row - 1, 0); i <= Math.min(row + 1, size - 1); i++) {
        for (var j = Math.max(col - 1, 0); j <= Math.min(col + 1, size - 1); j++) {
            var neighbor = document.querySelector(`tr:nth-child(${i + 2}) td:nth-child(${j + 2})`);
            if (neighbor && !neighbor.classList.contains('clicked') && !neighbor.classList.contains('mine')) {
                neighbor.classList.add('clicked');
                var mineCount = countMinesAround(neighbor);
                if (mineCount === 0) {
                    openEmptyCells(neighbor);
                } else {
                    neighbor.textContent = mineCount;
                }
            }
        }
    }
}

function countMinesAround(cell) {
    var count = 0;
    var row = cell.parentNode.rowIndex;
    var col = cell.cellIndex;
    var table = document.querySelector('table');

    for (var i = Math.max(row - 1, 0); i <= Math.min(row + 1, size - 1); i++) {
        for (var j = Math.max(col - 1, 0); j <= Math.min(col + 1, size - 1); j++) {
            if (table.rows[i].cells[j].classList.contains('mine')) {
                count++;
            }
        }
    }

    return count;
}
function addCellClickEvent() {
    document.querySelectorAll('td').forEach(cell => {
        cell.addEventListener('click', function() {
            if (this.classList.contains('mine')) {
                this.classList.add('mine-hit');
                document.getElementById('game-over').style.display = 'block'; 
            } else {
                this.classList.add('clicked');
                var mineCount = countMinesAround(this);
                if (mineCount > 0) {
                    this.textContent = mineCount;
                } else {
                    openEmptyCells(this);
                }
            }
        });
    });
}

window.onload = function() {
    startGame('Easy');
}

function startGame(difficulty) {
    switch (difficulty) {
        case 'Easy':
            size = 5;
            break;
        case 'Average':
            size = 7;
            break;
        case 'Hard':
            size = 9;
            break;
        default:
            console.error(`Unknown difficulty: ${difficulty}`);
            return;
    }

    var table = document.createElement('table');
    for (var i = 0; i < size; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < size; j++) {
            var cell = document.createElement('td');
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    var oldTable = document.querySelector('table');
    if (oldTable) {
        oldTable.parentNode.replaceChild(table, oldTable);
    } else {
        document.body.appendChild(table);
    }

    var cells = Array.from(document.querySelectorAll('td'));
    for (var i = 0; i < size; i++) {
        var randomIndex = Math.floor(Math.random() * cells.length);
        cells[randomIndex].classList.add('mine');
        cells.splice(randomIndex, 1);
    }

    addCellClickEvent();
}