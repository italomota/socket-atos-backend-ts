enum Modulo {
  LOGIN = 'LOGIN',
  CHAT = 'CHAT',
  DADOS_ACESSO = 'DADOS_ACESSO',
  RELATORIO_VENDAS = 'RELATORIO_VENDAS',
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
  public autenticarUsuario (info: Information, socket: SocketIO.Socket): void {
    if (info.evento.dados.usuario && info.evento.dados.senha) {
      const respostaAPI = {
        token: 'kml123tbt',
        cdRede: 110,
        cdGrupoEmpresa: 137,
        cnpj: '11111111000120',
        idUsuario: 10001
      }

      socket.join(respostaAPI.cdRede)
      socket.join(respostaAPI.cdGrupoEmpresa)
      socket.join(respostaAPI.cnpj, () => {
        console.log(Object.keys(socket.rooms))
      })

      socket.emit('response', {
        ...info,
        token: 'kml123tbt'
      })

      return
    }
    socket.emit('response', info)
  }

  public ativar (io: SocketIO.Server): void {
    io.on('connect', socket => {
      socket.on('request', (info: Information) => {
        switch (info.evento.modulo) {
          case Modulo.LOGIN: {
            this.autenticarUsuario(info, socket)
            break
          }
        }
      })
    })
  }
}

export default new SocketServer()
