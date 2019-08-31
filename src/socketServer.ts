enum Modulo {
  CHAT = 'CHAT',
  DADOS_ACESSO = 'DADOS_ACESSO',
}

enum Acao {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface ObjetoPadrao {
  tipo: string;
  token: string;
  cdRede: number;
  cdGrupoEmpresa: number;
  cnpj: string;
  idUsuario: number;
  idConexao: string;
  evento: {
    modulo: Modulo;
    acao: Acao;
  };
  filtro: object;
  dados: object;
}

class SocketServer {
  public ativar (io): void {
    io.on('connect', socket => {
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
    })
  }
}

export default new SocketServer()
