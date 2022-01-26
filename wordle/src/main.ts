const SOLUTION_LENGTH = 5
const MAX_GUESSES = 6

let _currentTheme: string

interface GameState {
    input: {row: number; word: string}
    answer: string
    guesses: string[]
    letters: Map<string, LetterState>
    lastTick: Partial<{
        input: {row: number; word: string}
    }>
}

type LetterState = "unknown" | "absent" | "present" | "correct"

let main = () => {
    let gameState = createGameState()
    let ui = createUI()
    document.addEventListener("keydown", (e) => {
        handleKeyboardEvent(gameState, e)
        updateUI(gameState, ui)
        gameState.lastTick = {}
    })
}

let createGameState = (): GameState => {
    return {
        input: {row: 0, word: ""},
        answer: "train",
        guesses: new Array(MAX_GUESSES).fill(""),
        letters: new Map(),
        lastTick: {},
    }
}

let handleKeyboardEvent = (gameState: GameState, e: KeyboardEvent) => {
    // shortcuts
    if (e.ctrlKey) {
        switch (e.key) {
            case " ":
                applyTheme(_currentTheme === "light" ? "dark" : "light")
                break
        }
        return
    }

    // ignore all other key presses with modifiers
    if (e.metaKey || e.shiftKey) {
        return
    }

    let word = gameState.input.word
    switch (e.key) {
        case "Enter":
            e.preventDefault()
            submitGuess(word, gameState)
            break
        case "Backspace":
            e.preventDefault()
            gameState.input.word = word.slice(0, word.length - 1)
            break
        default:
            e.preventDefault()
            if (/[a-z]/.test(e.key)) {
                if (word.length < SOLUTION_LENGTH) {
                    gameState.input.word += e.key
                }
            }
            break
    }
}

let applyTheme = (theme: string) => {
    _currentTheme = theme
    document.documentElement.setAttribute("data-theme", theme)
    try {
        localStorage.setItem("theme", theme)
    } catch (e) {}
}

let submitGuess = (word: string, gameState: GameState) => {
    if (word.length !== SOLUTION_LENGTH) {
        return
    }

    gameState.guesses[gameState.input.row] = word
    gameState.lastTick.input = {...gameState.input}
    gameState.input.row++
    gameState.input.word = ""

    if (gameState.input.row > MAX_GUESSES) {
        alert("finished guessing")
        return
    }

    // recompute letter states for keyboard overview
    let correctLetters: (string | null)[] = gameState.answer.split("")
    let guessedLetters = word.split("")
    for (let i = 0; i < guessedLetters.length; i++) {
        let letter = guessedLetters[i]
        let state = gameState.letters.get(letter)
        if (state === "correct" || state === "absent") {
            correctLetters[i] = null
        } else if (letter === correctLetters[i]) {
            gameState.letters.set(letter, "correct")
            correctLetters[i] = null
        } else {
            let idx = correctLetters.indexOf(letter)
            if (idx !== -1) {
                gameState.letters.set(letter, "present")
            }
        }
    }
}

interface UI {
    guesses: UIGuessList
    keyboard: UIKeyboard
}
let createUI = (): UI => {
    let theme = "light"
    try {
        let t = localStorage.getItem("theme")!
        if (t === "light" || t === "dark") {
            theme = t
        }
    } catch (e) {}
    applyTheme(theme)

    let root = document.createElement("div")
    root.className = "game"

    let guesses = createUIGuessList(root)
    let keyboard = createUIKeyboard(root)

    document.body.append(root)
    return {guesses, keyboard}
}

let updateUI = (gameState: GameState, ui: UI) => {
    // update current guess
    let cells = ui.guesses.rows[gameState.input.row].cells
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        let letter = gameState.input.word[i]
        cell.textContent = letter!
    }

    // reveal matching letters in last submission
    let {input} = gameState.lastTick
    if (input) {
        let row = ui.guesses.rows[input.row]
        let states = getLetterStates(gameState.answer, input.word)
        for (let i = 0; i < states.length; i++) {
            let cell = row.cells[i]
            cell.setAttribute("data-state", states[i])
        }
    }

    // update keyboard overview
    for (let node of ui.keyboard.keys) {
        let letter = node.textContent!
        let state = gameState.letters.get(letter) || "unknown"
        node.setAttribute("data-state", state)
    }
}

let getLetterStates = (answer: string, word: string): LetterState[] => {
    let states: LetterState[] = []

    let correctLetters: (string | null)[] = answer.split("")
    let guessedLetters = word.split("")
    for (let i = 0; i < guessedLetters.length; i++) {
        let letter = guessedLetters[i]
        if (letter === correctLetters[i]) {
            states[i] = "correct"
            continue
        }
        let idx = correctLetters.indexOf(letter)
        if (idx !== -1) {
            states[i] = "present"
            correctLetters[idx] = null
            continue
        }
        states[i] = "absent"
    }
    return states
}

interface UIGuessList {
    rows: {cells: HTMLElement[]}[]
}
let createUIGuessList = (container: HTMLElement): UIGuessList => {
    let self: UIGuessList = {
        rows: [],
    }

    let root = document.createElement("ol")
    root.className = "guess-list"
    for (let i = 0; i < MAX_GUESSES; i++) {
        let row = document.createElement("li")
        row.className = "guess-row"

        let cells: HTMLElement[] = []
        for (let j = 0; j < SOLUTION_LENGTH; j++) {
            let cell = document.createElement("span")
            cell.className = "guess-cell"
            row.append(cell)
            cells.push(cell)
        }
        self.rows.push({cells})
        root.append(row)
    }
    container.append(root)
    return self
}

interface UIKeyboard {
    keys: HTMLElement[]
}
let createUIKeyboard = (container: HTMLElement) => {
    let self: UIKeyboard = {keys: []}
    let root = document.createElement("div")
    root.className = "keyboard"
    let rows = [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"],
    ]
    for (let row of rows) {
        let $row = document.createElement("div")
        $row.className = "keyboard-row"
        for (let key of row) {
            let $key = document.createElement("button")
            $key.className = "keyboard-key"
            $key.textContent = key
            $row.append($key)
            self.keys.push($key)
        }
        root.append($row)
    }

    container.append(root)
    return self
}

main()
export {}
