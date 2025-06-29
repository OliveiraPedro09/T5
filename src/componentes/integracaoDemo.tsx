import React, { useState, useEffect } from 'react';
import apiService, { Cliente as ApiCliente, Produto as ApiProduto, Servico as ApiServico } from '../services/apiService';

// Importando os modelos originais para demonstrar a integração
// (Em uma implementação real, você adaptaria estes para usar o backend)

interface IntegracaoProps {}

const IntegracaoDemo: React.FC<IntegracaoProps> = () => {
    const [clientes, setClientes] = useState<ApiCliente[]>([]);
    const [produtos, setProdutos] = useState<ApiProduto[]>([]);
    const [servicos, setServicos] = useState<ApiServico[]>([]);
    const [relatorio, setRelatorio] = useState<any>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            const [clientesData, produtosData, servicosData, relatorioData] = await Promise.all([
                apiService.listarClientes(),
                apiService.listarProdutos(),
                apiService.listarServicos(),
                apiService.obterRelatorioConsumo()
            ]);

            setClientes(clientesData);
            setProdutos(produtosData);
            setServicos(servicosData);
            setRelatorio(relatorioData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    };

    const registrarConsumoRapido = async (clienteId: number, tipo: 'produto' | 'servico', itemId: number) => {
        try {
            if (tipo === 'produto') {
                await apiService.registrarConsumoProduto({ cliente_id: clienteId, produto_id: itemId });
            } else {
                await apiService.registrarConsumoServico({ cliente_id: clienteId, servico_id: itemId });
            }
            
            // Recarregar relatório
            const novoRelatorio = await apiService.obterRelatorioConsumo();
            setRelatorio(novoRelatorio);
            
            alert(`Consumo de ${tipo} registrado com sucesso!`);
        } catch (error) {
            alert(`Erro ao registrar consumo de ${tipo}`);
            console.error(error);
        }
    };

    const obterDetalhesCliente = async (clienteId: number) => {
        try {
            const clienteDetalhado = await apiService.buscarClientePorId(clienteId);
            
            // Exibir detalhes em um modal (simplificado para demonstração)
            const detalhes = `
Cliente: ${clienteDetalhado.nome}
CPF: ${clienteDetalhado.cpf}
Produtos Consumidos: ${clienteDetalhado.produtosConsumidos?.length || 0}
Serviços Consumidos: ${clienteDetalhado.servicosConsumidos?.length || 0}
Total de Consumos: ${(clienteDetalhado.produtosConsumidos?.length || 0) + (clienteDetalhado.servicosConsumidos?.length || 0)}
            `;
            alert(detalhes);
        } catch (error) {
            alert('Erro ao obter detalhes do cliente');
            console.error(error);
        }
    };

    return (
        <div className="container" style={{ margin: '20px auto', padding: '20px' }}>
            <h2>Demonstração de Integração Backend</h2>
            <p className="grey-text">
                Esta página demonstra como o novo backend com SQLite integra com o modelo de negócio original.
                O backend implementa todas as funcionalidades da pasta api/src com persistência real.
            </p>

            {/* Seção de Clientes */}
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">people</i>
                                Clientes Cadastrados ({clientes.length})
                            </span>
                            <div className="row">
                                {clientes.map(cliente => (
                                    <div key={cliente.id} className="col s12 m6 l4">
                                        <div className="card-panel purple lighten-5">
                                            <strong>{cliente.nome}</strong><br />
                                            <small>{cliente.cpf}</small><br />
                                            <small>{cliente.genero}</small><br />
                                            <button 
                                                className="btn btn-small purple lighten-2 waves-effect waves-light"
                                                onClick={() => obterDetalhesCliente(cliente.id!)}
                                                style={{ marginTop: '5px' }}
                                            >
                                                Ver Detalhes
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seção de Registro Rápido */}
            <div className="row">
                <div className="col s12 m6">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">shopping_cart</i>
                                Registro Rápido - Produtos
                            </span>
                            {produtos.map(produto => (
                                <div key={produto.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <strong>{produto.nome}</strong> - R$ {produto.preco.toFixed(2)}<br />
                                    <div style={{ marginTop: '5px' }}>
                                        {clientes.slice(0, 3).map(cliente => (
                                            <button
                                                key={cliente.id}
                                                className="btn btn-small purple lighten-3 waves-effect waves-light"
                                                style={{ marginRight: '5px', marginBottom: '2px' }}
                                                onClick={() => registrarConsumoRapido(cliente.id!, 'produto', produto.id!)}
                                            >
                                                {cliente.nome.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col s12 m6">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">build</i>
                                Registro Rápido - Serviços
                            </span>
                            {servicos.map(servico => (
                                <div key={servico.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <strong>{servico.nome}</strong> - R$ {servico.preco.toFixed(2)}<br />
                                    <div style={{ marginTop: '5px' }}>
                                        {clientes.slice(0, 3).map(cliente => (
                                            <button
                                                key={cliente.id}
                                                className="btn btn-small purple lighten-3 waves-effect waves-light"
                                                style={{ marginRight: '5px', marginBottom: '2px' }}
                                                onClick={() => registrarConsumoRapido(cliente.id!, 'servico', servico.id!)}
                                            >
                                                {cliente.nome.split(' ')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Relatórios */}
            {relatorio && (
                <div className="row">
                    <div className="col s12">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    <i className="material-icons left">assessment</i>
                                    Relatórios de Consumo
                                </span>
                                
                                <div className="row">
                                    <div className="col s12 m4">
                                        <h6>Produtos Mais Consumidos</h6>
                                        {relatorio.produtosMaisConsumidos?.map((item: any, index: number) => (
                                            <div key={index} className="card-panel grey lighten-4">
                                                <strong>{item.nome}</strong><br />
                                                <small>Quantidade: {item.quantidade}</small><br />
                                                <small>Valor Total: R$ {item.valor_total?.toFixed(2)}</small>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="col s12 m4">
                                        <h6>Serviços Mais Consumidos</h6>
                                        {relatorio.servicosMaisConsumidos?.map((item: any, index: number) => (
                                            <div key={index} className="card-panel grey lighten-4">
                                                <strong>{item.nome}</strong><br />
                                                <small>Quantidade: {item.quantidade}</small><br />
                                                <small>Valor Total: R$ {item.valor_total?.toFixed(2)}</small>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="col s12 m4">
                                        <h6>Clientes que Mais Consomem</h6>
                                        {relatorio.clientesQueConsomem?.map((item: any, index: number) => (
                                            <div key={index} className="card-panel grey lighten-4">
                                                <strong>{item.nome}</strong><br />
                                                <small>Total Consumos: {item.total_consumos}</small><br />
                                                <small>Valor Total: R$ {item.valor_total?.toFixed(2)}</small>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col s12">
                    <div className="card purple lighten-5">
                        <div className="card-content">
                            <span className="card-title">💡 Como funciona a integração</span>
                            <p>
                                <strong>Backend SQLite:</strong> Substitui o armazenamento em memória por persistência real em banco de dados.<br />
                                <strong>API RESTful:</strong> Expõe endpoints para todas as operações CRUD.<br />
                                <strong>Modelos Integrados:</strong> Mantém compatibilidade com os modelos existentes da pasta api/src.<br />
                                <strong>Registro de Consumo:</strong> Implementa a funcionalidade de registro de consumo de forma persistente.<br />
                                <strong>Relatórios:</strong> Gera relatórios em tempo real baseados nos dados do banco.
                            </p>
                            <button 
                                className="btn purple lighten-2 waves-effect waves-light"
                                onClick={carregarDados}
                            >
                                <i className="material-icons left">refresh</i>
                                Atualizar Dados
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegracaoDemo;
