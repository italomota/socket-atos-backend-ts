import express from 'express'
import socketIO from 'socket.io'
import http from 'http'
import cors from 'cors'

class App {
  public app: express.Application

  public server: http.Server

  public io: SocketIO.Server

  public constructor () {
    this.app = express()
    this.server = http.Server(this.app)
    this.io = socketIO(this.server)

    this.ativarMiddlewares()
    this.ativarSocketIO()
  }

  public ativarMiddlewares (): void {
    this.app.use(cors())
    this.app.use(express.json())
  }

  public ativarSocketIO (): void {
    this.io.on('connect', socket => {
      this.io.sockets.emit('idsConectados', Object.keys(this.io.sockets.sockets))

      socket.on('entrarSala', sala => {
        socket.join(sala, () => {
          socket.emit('sala')
        })
      })

      socket.on('sairSala', sala => {
        socket.leave(sala, () => {
          socket.emit('sala')
        })
      })

      socket.on('novaMensagem', novaMensagem => {
        socket.broadcast.emit('mensagens', novaMensagem)
      })

      socket.on('novaMensagemSala', novaMensagem => {
        this.io.sockets.in('1107').emit('mensagens', novaMensagem)
      })

      socket.on('novaMensagemId', (id, novaMensagem) => {
        this.io.sockets.in(id).emit('mensagens', novaMensagem)
      })

      socket.on('disconnect', () => {
        this.io.sockets.emit('idsConectados', Object.keys(this.io.sockets.sockets))
      })
    })
  }
}

export default new App().server
