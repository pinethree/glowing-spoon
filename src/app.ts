import express from 'express'
import routes from './routes'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', routes)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on :${PORT}`)
})
