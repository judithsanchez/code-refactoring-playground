// npm install prompt-sync
// node src/librarySystem.js

var books = []
var users = []
var DEBUG = true
var FINE_RATE = 0.5 // dollars per day

// load initial data
function init() {
    books = [
        {id: "B001", n: "The Great Book", a: "Author 1", s: "available", b: null, d: null},
        {id: "B002", n: "Another Book", a: "Author 2", s: "available", b: null, d: null},
        {id: "B003", n: "Third Book", a: "Author 1", s: "available", b: null, d: null}
    ]
    users = [
        {id: "U001", name: "John Doe", books: []},
        {id: "U002", name: "Jane Smith", books: []}
    ]
    if(DEBUG) console.log("Debug: System initialized")
}

// process everything
function process(action, data) {
    if(action == "add") {
        let id = "B" + (books.length + 1).toString().padStart(3, '0')
        books.push({
            id: id,
            n: data.name,
            a: data.author,
            s: "available",
            b: null,
            d: null
        })
        if(DEBUG) console.log("Debug: Added book " + id)
        return "Book added with ID: " + id
    } else if(action == "search") {
        let results = []
        for(let i = 0; i < books.length; i++) {
            let b = books[i]
            if(b.n.toLowerCase().includes(data.toLowerCase()) || 
               b.a.toLowerCase().includes(data.toLowerCase()) ||
               b.id.toLowerCase().includes(data.toLowerCase())) {
                results.push(b)
            }
        }
        return results
    } else if(action == "borrow") {
        let book = null
        let user = null
        
        // find book
        for(let i = 0; i < books.length; i++) {
            if(books[i].id == data.bookId) {
                book = books[i]
                break
            }
        }
        
        // find user
        for(let i = 0; i < users.length; i++) {
            if(users[i].id == data.userId) {
                user = users[i]
                break
            }
        }
        
        if(!book || !user) return "Book or user not found"
        if(book.s != "available") return "Book not available"
        if(user.books.length >= 3) return "User has maximum books"
        
        book.s = "borrowed"
        book.b = data.userId
        book.d = new Date().toISOString()
        user.books.push(data.bookId)
        
        if(DEBUG) console.log("Debug: Book " + data.bookId + " borrowed by " + data.userId)
        return "Book borrowed successfully"
    } else if(action == "return") {
        let book = null
        let user = null
        
        // find book
        for(let i = 0; i < books.length; i++) {
            if(books[i].id == data.bookId) {
                book = books[i]
                break
            }
        }
        
        // find user
        for(let i = 0; i < users.length; i++) {
            if(users[i].id == data.userId) {
                user = users[i]
                break
            }
        }
        
        if(!book || !user) return "Book or user not found"
        if(book.b != data.userId) return "Book not borrowed by this user"
        
        // calculate fine
        let borrowDate = new Date(book.d)
        let returnDate = new Date()
        let days = Math.floor((returnDate - borrowDate) / (1000 * 60 * 60 * 24))
        let fine = 0
        if(days > 14) {
            fine = (days - 14) * FINE_RATE
        }
        
        book.s = "available"
        book.b = null
        book.d = null
        user.books = user.books.filter(b => b != data.bookId)
        
        if(DEBUG) console.log("Debug: Book " + data.bookId + " returned by " + data.userId)
        return fine > 0 ? `Book returned. Fine: $${fine}` : "Book returned successfully"
    }
}

// display stuff
function display(type) {
    if(type == "all") {
        console.log("\nAll Books:")
        for(let i = 0; i < books.length; i++) {
            let b = books[i]
            console.log(`${b.id} - ${b.n} by ${b.a} (${b.s})`)
        }
    } else if(type == "borrowed") {
        console.log("\nBorrowed Books:")
        for(let i = 0; i < books.length; i++) {
            let b = books[i]
            if(b.s == "borrowed") {
                let user = users.find(u => u.id == b.b)
                console.log(`${b.id} - ${b.n} by ${b.a} (borrowed by ${user.name})`)
            }
        }
    } else if(type == "users") {
        console.log("\nUsers and Their Books:")
        for(let i = 0; i < users.length; i++) {
            let u = users[i]
            console.log(`${u.id} - ${u.name}:`)
            if(u.books.length == 0) {
                console.log("  No books borrowed")
            } else {
                for(let j = 0; j < u.books.length; j++) {
                    let book = books.find(b => b.id == u.books[j])
                    console.log(`  - ${book.n}`)
                }
            }
        }
    }
}

// main function
function main() {
    init()
    
    while(true) {
        console.log("\n1. Add Book")
        console.log("2. Search Books")
        console.log("3. Borrow Book")
        console.log("4. Return Book")
        console.log("5. Display All Books")
        console.log("6. Display Borrowed Books")
        console.log("7. Display Users")
        console.log("8. Exit")
        
        let choice = prompt("Choose option: ")
        
        if(choice == "1") {
            let name = prompt("Book name: ")
            let author = prompt("Author: ")
            console.log(process("add", {name: name, author: author}))
        } else if(choice == "2") {
            let term = prompt("Search term: ")
            let results = process("search", term)
            console.log("\nSearch Results:")
            results.forEach(b => console.log(`${b.id} - ${b.n} by ${b.a} (${b.s})`))
        } else if(choice == "3") {
            let userId = prompt("User ID: ")
            let bookId = prompt("Book ID: ")
            console.log(process("borrow", {userId: userId, bookId: bookId}))
        } else if(choice == "4") {
            let userId = prompt("User ID: ")
            let bookId = prompt("Book ID: ")
            console.log(process("return", {userId: userId, bookId: bookId}))
        } else if(choice == "5") {
            display("all")
        } else if(choice == "6") {
            display("borrowed")
        } else if(choice == "7") {
            display("users")
        } else if(choice == "8") {
            break
        } else {
            console.log("Invalid option")
        }
    }
}

main()
