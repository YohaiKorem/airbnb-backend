import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import authRoutes from './api/auth/auth.routes.cjs'
import userRoutes from './api/user/user.routes.cjs'
import stayRoutes from './api/stay/stay.routes.cjs'
import orderRoutes from './api/order/order.routes.cjs'
import { socketService } from './services/socket.service.cjs'
import setupAsyncLocalStorage from './middlewares/setupAls.middleware.cjs'
import { loggerService } from './services/logger.service.cjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()
const http = createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    sameSite: 'none',
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'http://127.0.0.1:4200',
      'http://localhost:4200',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}

// import { initData } from './api/stay/stay.service.cjs'
// initData('stay')
// Routes
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/stay', stayRoutes)
socketService.setupSocketAPI(http)

app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

loggerService.info('Hi', 90, 'Bubee')

const port = process.env.PORT || 3030
http.listen(port, () => {
  loggerService.info('Server is running on port: ' + port)
})
