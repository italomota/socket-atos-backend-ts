import express from 'express'
import socketIO from 'socket.io'
import http from 'http'
import cors from 'cors'

import socketServer from './socketServer'

class App {
  public app: express.Application

  public server: http.Server

  public io: SocketIO.Server

  public constructor () {
    this.app = express()
    this.server = new http.Server(this.app)
    this.io = socketIO(this.server)

    this.ativarMiddlewares()
  }

  public ativarMiddlewares (): void {
    this.app.use(cors())
    this.app.use(express.json())
    socketServer.ativar(this.io)
  }
}

export default new App().server
