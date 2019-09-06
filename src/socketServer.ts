import { Modulo } from './enums/Modulo'
import { ObjetoPadrao } from './types/ObjetoPadrao'

class SocketServer {
  public ativar (io): void {
    io.on('connect', (socket: SocketIO.Server) => {
      io.sockets.emit('idsConectados', Object.keys(io.sockets.sockets))

      const { cdRede, cdGrupoEmpresa, cnpj, idUsuario } = socket.handshake.query

      socket.join(cdRede)
      socket.join(cdGrupoEmpresa)
      socket.join(cnpj)
      socket.join(idUsuario)

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
        io.sockets.in('1107').emit('mensagens', novaMensagem)
      })

      socket.on('novaMensagemId', (id, novaMensagem) => {
        io.sockets.in(id).emit('mensagens', novaMensagem)
      })

      socket.on('consultarTelaDadosAcesso', info => {
        info.dados.Registros = [{ login: 'teste', senha: 'teste', status: true }]
        io.sockets.in('1107').emit('consultarTelaDadosAcessoResp', info)
      })

      socket.on('solicitacaoServidor', (info: ObjetoPadrao) => {
        if (info.tipo === Modulo.CHAT) {
          socket.broadcast.emit('respSolicitacaoServidor', info)
        } else {
          socket.broadcast.emit('respSolicitacaoServidor', info)
        }
      })

      socket.on('sendBroadcast', (info: ObjetoPadrao) => {
        switch (info.evento.modulo) {
          case (Modulo.CHAT): {
            // io.emit('response', info)
            socket.broadcast.emit('response', info)
            break
          }
          case (Modulo.DADOS_ACESSO): {
            // io.emit('response', info)
            socket.broadcast.emit('response', info)
            break
          }
        }
      })

      socket.on('sendByDynamic', (info: ObjetoPadrao) => {
        switch (info.evento.modulo) {
          case (Modulo.CHAT): {
            io.in(info.tipo).emit('response', info)
            break
          }
          case (Modulo.DADOS_ACESSO): {
            io.in(info.tipo).emit('response', info)
            break
          }
        }
      })

      socket.on('sairGrupo', (id: string | number) => {
        socket.leave(id, () => {
          console.log('Saiu do grupo', id)
        })
      })
    })
  }
}

export default new SocketServer()
