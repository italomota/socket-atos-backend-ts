enum Modulo {
  CHAT = 'CHAT',
  PORTAL = 'PORTAL',
}

enum Acao {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface Information {
  tipo?: string;
  token?: string;
  cdRede?: number;
  cdGrupoEmpresa?: number;
  cnpj?: string;
  idUsuario?: number;
  idConexao?: string;
  evento: {
    modulo: Modulo;
    acao: Acao;
  };
  filtro?: object;
  dados?: object;
}

class SocketServer {
  public ativar (io: SocketIO.Server): void {
    io.on('connect', socket => {
      socket.on('request', (info: Information) => {
        socket.broadcast.emit('response', info)
      })
    })
  }
}

export default new SocketServer()
