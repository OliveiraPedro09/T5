import React, { useEffect, useState } from 'react';
import apiService, { Cliente, Produto, Servico } from '../services/apiService';

interface TestConnectionProps {}

const TestConnection: React.FC<TestConnectionProps> = () => {
    const [connectionStatus, setConnectionStatus] = useState<string>('Testando...');
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);

    useEffect(() => {
        testConnection();
        loadData();
    }, []);

    const testConnection = async () => {
        try {
            const result = await apiService.verificarConexao();
            setConnectionStatus(`✅ Conectado: ${result.message}`);
        } catch (error) {
            setConnectionStatus('❌ Erro de conexão com o backend');
            console.error('Erro ao conectar com o backend:', error);
        }
    };

    const loadData = async () => {
        try {
            const [clientesData, produtosData, servicosData] = await Promise.all([
                apiService.listarClientes(),
                apiService.listarProdutos(),
                apiService.listarServicos()
            ]);

            setClientes(clientesData);
            setProdutos(produtosData);
            setServicos(servicosData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const registrarConsumo = async (clienteId: number, produtoId?: number, servicoId?: number) => {
        try {
            if (produtoId) {
                await apiService.registrarConsumoProduto({ cliente_id: clienteId, produto_id: produtoId });
                alert('Consumo de produto registrado com sucesso!');
            } else if (servicoId) {
                await apiService.registrarConsumoServico({ cliente_id: clienteId, servico_id: servicoId });
                alert('Consumo de serviço registrado com sucesso!');
            }
        } catch (error) {
            alert('Erro ao registrar consumo');
            console.error('Erro ao registrar consumo:', error);
        }
    };

    return (
        <div className="container" style={{ margin: '20px auto', padding: '20px' }}>
            <h2>Teste de Conexão com Backend</h2>
            
            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
                <h4>Status da Conexão</h4>
                <p>{connectionStatus}</p>
            </div>

            <div className="row">
                <div className="col s12 m4">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Clientes ({clientes.length})</span>
                            {clientes.map(cliente => (
                                <div key={cliente.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }}>
                                    <strong>{cliente.nome}</strong><br />
                                    <small>CPF: {cliente.cpf}</small><br />
                                    <small>Gênero: {cliente.genero}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col s12 m4">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Produtos ({produtos.length})</span>
                            {produtos.map(produto => (
                                <div key={produto.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }}>
                                    <strong>{produto.nome}</strong><br />
                                    <small>R$ {produto.preco.toFixed(2)}</small><br />
                                    {clientes.length > 0 && (
                                        <button 
                                            className="btn btn-small waves-effect waves-light"
                                            style={{ marginTop: '5px' }}
                                            onClick={() => registrarConsumo(clientes[0].id!, produto.id)}
                                        >
                                            Registrar para {clientes[0].nome}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col s12 m4">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Serviços ({servicos.length})</span>
                            {servicos.map(servico => (
                                <div key={servico.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd' }}>
                                    <strong>{servico.nome}</strong><br />
                                    <small>R$ {servico.preco.toFixed(2)}</small><br />
                                    {clientes.length > 0 && (
                                        <button 
                                            className="btn btn-small waves-effect waves-light"
                                            style={{ marginTop: '5px' }}
                                            onClick={() => registrarConsumo(clientes[0].id!, undefined, servico.id)}
                                        >
                                            Registrar para {clientes[0].nome}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
                <h4>Ações de Teste</h4>
                <button 
                    className="btn waves-effect waves-light" 
                    onClick={loadData}
                    style={{ marginRight: '10px' }}
                >
                    Recarregar Dados
                </button>
                <button 
                    className="btn waves-effect waves-light" 
                    onClick={testConnection}
                >
                    Testar Conexão
                </button>
            </div>
        </div>
    );
};

export default TestConnection;
