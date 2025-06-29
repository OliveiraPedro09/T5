const API_BASE_URL = 'http://localhost:3001/api';

export interface Cliente {
  id?: number;
  nome: string;
  nomeSocial?: string;
  genero: string;
  cpf: string;
  dataCadastro?: string;
  rgs?: RG[];
  telefones?: Telefone[];
  produtosConsumidos?: Produto[];
  servicosConsumidos?: Servico[];
}

export interface RG {
  id?: number;
  numero: string;
  dataEmissao: string;
  cliente_id?: number;
}

export interface Telefone {
  id?: number;
  ddd: string;
  numero: string;
  cliente_id?: number;
}

export interface Produto {
  id?: number;
  nome: string;
  preco: number;
}

export interface Servico {
  id?: number;
  nome: string;
  preco: number;
}

export interface ConsumoRequest {
  cliente_id: number;
  produto_id?: number;
  servico_id?: number;
}

class ApiService {
  // Clientes
  async criarCliente(cliente: Cliente): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });
    return response.json();
  }

  async listarClientes(): Promise<Cliente[]> {
    const response = await fetch(`${API_BASE_URL}/clientes`);
    return response.json();
  }

  async buscarClientePorId(id: number): Promise<Cliente> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
    return response.json();
  }

  async atualizarCliente(id: number, cliente: Partial<Cliente>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });
    return response.json();
  }

  async deletarCliente(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Produtos
  async criarProduto(produto: Produto): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produto),
    });
    return response.json();
  }

  async listarProdutos(): Promise<Produto[]> {
    const response = await fetch(`${API_BASE_URL}/produtos`);
    return response.json();
  }

  async buscarProdutoPorId(id: number): Promise<Produto> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
    return response.json();
  }

  async atualizarProduto(id: number, produto: Partial<Produto>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produto),
    });
    return response.json();
  }

  async deletarProduto(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Serviços
  async criarServico(servico: Servico): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/servicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servico),
    });
    return response.json();
  }

  async listarServicos(): Promise<Servico[]> {
    const response = await fetch(`${API_BASE_URL}/servicos`);
    return response.json();
  }

  async buscarServicoPorId(id: number): Promise<Servico> {
    const response = await fetch(`${API_BASE_URL}/servicos/${id}`);
    return response.json();
  }

  async atualizarServico(id: number, servico: Partial<Servico>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/servicos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(servico),
    });
    return response.json();
  }

  async deletarServico(id: number): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/servicos/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Consumo
  async registrarConsumoProduto(consumo: ConsumoRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/consumo/produto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consumo),
    });
    return response.json();
  }

  async registrarConsumoServico(consumo: ConsumoRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/consumo/servico`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(consumo),
    });
    return response.json();
  }

  async listarConsumosPorCliente(clienteId: number): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/consumo/cliente/${clienteId}`);
    return response.json();
  }

  async obterRelatorioConsumo(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/consumo/relatorio`);
    return response.json();
  }

  // Health check
  async verificarConexao(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  }
}

export default new ApiService();
