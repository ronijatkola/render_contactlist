const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
const morgan = require('morgan')

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { "id": 1, "name": "Arto Hellas", "number": "040-123456" },
  { "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
  { "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
  { "id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122" }
]

app.get('/info', (request, response) => {
    const date = new Date()
    const number = persons.length
    response.send(`
        <p>Phonebook has info for ${number} people</p>
        <p>${date}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(n => n.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    
    try {
        const person = request.body
        if (!person || !person.name || !person.number)
            return response.status(400).json({error: 'name or number missing' })
        if (persons.find(n => n.name === person.name)) {
            return response.status(409).json({error: 'name must be unique'})
        }
    
        const generateId = () => Math.floor(Math.random() * 1000000)

        person.id = generateId()
        
        persons = persons.concat(person)

        response.status(201).json(person)

    } catch (error) {
        console.error('Virhe: ', error.message)
        response.status(500).json({ error: 'Internal server error' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})