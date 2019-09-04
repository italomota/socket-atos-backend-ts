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

interface Information {
  token?: string;
  cdRede?: number;
  cdGrupoEmpresa?: number;
  cnpj?: string;
  idUsuario?: number;
  idConexao?: string;
  evento: {
    modulo: Modulo;
    acao: Acao;
    filtros?: any;
    dados?: any;
    mensagem: string;
  };
}

class SocketServer {
  public ativar (io: SocketIO.Server): void {
    io.on('connect', socket => {
      const { cdRede, cdGrupoEmpresa, cnpj, idUsuario } = socket.handshake.query

      socket.join(cdRede)
      socket.join(cdGrupoEmpresa)
      socket.join(cnpj)
      socket.join(idUsuario)

      socket.on('sendBroadcast', (info: Information) => {
        switch (info.evento.modulo) {
          case (Modulo.CHAT): {
            io.emit('response', info)
            break
          }
          case (Modulo.DADOS_ACESSO): {
            io.emit('response', info)
            break
          }
        }
      })
    })
  }
}

export default new SocketServer()
