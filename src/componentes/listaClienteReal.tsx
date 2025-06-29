import React, { useState, useEffect } from "react";
import apiService, { Cliente as ApiCliente } from '../services/apiService';
import 'materialize-css/dist/css/materialize.min.css';

type props = {
    tema: string;
}

const ListaClienteReal: React.FC<props> = ({ tema }) => {
    const [clientes, setClientes] = useState<ApiCliente[]>([]);
    const [clientesFiltrados, setClientesFiltrados] = useState<ApiCliente[]>([]);
    const [clienteSelecionado, setClienteSelecionado] = useState<ApiCliente | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [termoBusca, setTermoBusca] = useState('');
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

    useEffect(() => {
        carregarClientes();
    }, []);

    const carregarClientes = async () => {
        try {
            setCarregando(true);
            const clientesData = await apiService.listarClientes();
            setClientes(clientesData);
            setClientesFiltrados(clientesData);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            alert('Erro ao carregar clientes. Verifique se o backend está rodando.');
        } finally {
            setCarregando(false);
        }
    };

    const selecionarCliente = async (cliente: ApiCliente) => {
        try {
            // Buscar detalhes completos do cliente
            const clienteDetalhado = await apiService.buscarClientePorId(cliente.id!);
            setClienteSelecionado(clienteDetalhado);
            setMostrarDetalhes(true);
        } catch (error) {
            console.error('Erro ao buscar detalhes do cliente:', error);
            setClienteSelecionado(cliente);
            setMostrarDetalhes(true);
        }
    };

    const removerCliente = async (id: number) => {
        if (window.confirm('Tem certeza que deseja remover este cliente?')) {
            try {
                await apiService.deletarCliente(id);
                await carregarClientes(); // Recarregar lista
                setClienteSelecionado(null);
                setMostrarDetalhes(false);
                alert('Cliente removido com sucesso!');
            } catch (error) {
                console.error('Erro ao remover cliente:', error);
                alert('Erro ao remover cliente.');
            }
        }
    };

    const buscarClientes = (termo: string) => {
        setTermoBusca(termo);
        if (termo.trim() === '') {
            setClientesFiltrados(clientes);
        } else {
            const filtrados = clientes.filter(cliente =>
                cliente.nome.toLowerCase().includes(termo.toLowerCase()) ||
                cliente.cpf.includes(termo) ||
                (cliente.nomeSocial && cliente.nomeSocial.toLowerCase().includes(termo.toLowerCase()))
            );
            setClientesFiltrados(filtrados);
        }
    };

    const formatarData = (dataString?: string) => {
        if (!dataString) return 'N/A';
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR');
    };

    if (carregando) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 center-align">
                        <div className="preloader-wrapper big active">
                            <div className="spinner-layer spinner-purple-only">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div>
                                <div className="gap-patch">
                                    <div className="circle"></div>
                                </div>
                                <div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                        <p>Carregando clientes...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <h4 className="center-align">Lista de Clientes</h4>
                    <p className="center-align grey-text">Dados do banco SQLite ({clientesFiltrados.length} clientes)</p>
                </div>
            </div>

            {/* Barra de Busca */}
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <div className="input-field">
                                <i className="material-icons prefix">search</i>
                                <input 
                                    id="busca" 
                                    type="text" 
                                    value={termoBusca}
                                    onChange={(e) => buscarClientes(e.target.value)}
                                />
                                <label htmlFor="busca">Buscar por nome, CPF ou nome social</label>
                            </div>
                            <button 
                                className="btn purple lighten-2 waves-effect waves-light"
                                onClick={carregarClientes}
                                style={{ marginRight: '10px' }}
                            >
                                <i className="material-icons left">refresh</i>
                                Atualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Lista de Clientes */}
                <div className="col s12 m8">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">people</i>
                                Clientes ({clientesFiltrados.length})
                            </span>
                            
                            {clientesFiltrados.length === 0 ? (
                                <p className="center-align grey-text">
                                    {clientes.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado para a busca'}
                                </p>
                            ) : (
                                <div className="collection">
                                    {clientesFiltrados.map(cliente => (
                                        <div 
                                            key={cliente.id} 
                                            className={`collection-item ${clienteSelecionado?.id === cliente.id ? 'active purple lighten-4' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => selecionarCliente(cliente)}
                                        >
                                            <div>
                                                <strong>{cliente.nome}</strong>
                                                {cliente.nomeSocial && cliente.nomeSocial !== cliente.nome && (
                                                    <span className="grey-text"> ({cliente.nomeSocial})</span>
                                                )}
                                                <br />
                                                <small>
                                                    CPF: {cliente.cpf} | 
                                                    Gênero: {cliente.genero} | 
                                                    Cadastro: {formatarData(cliente.dataCadastro)}
                                                </small>
                                                <button 
                                                    className="btn-small red lighten-2 waves-effect waves-light secondary-content"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removerCliente(cliente.id!);
                                                    }}
                                                >
                                                    <i className="material-icons">delete</i>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detalhes do Cliente */}
                <div className="col s12 m4">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">info</i>
                                Detalhes do Cliente
                            </span>
                            
                            {!mostrarDetalhes ? (
                                <p className="grey-text center-align">
                                    Clique em um cliente para ver os detalhes
                                </p>
                            ) : clienteSelecionado ? (
                                <div>
                                    <h6><strong>{clienteSelecionado.nome}</strong></h6>
                                    
                                    <div className="divider" style={{ margin: '10px 0' }}></div>
                                    
                                    <p><strong>Nome Social:</strong> {clienteSelecionado.nomeSocial || 'N/A'}</p>
                                    <p><strong>CPF:</strong> {clienteSelecionado.cpf}</p>
                                    <p><strong>Gênero:</strong> {clienteSelecionado.genero}</p>
                                    <p><strong>Data Cadastro:</strong> {formatarData(clienteSelecionado.dataCadastro)}</p>
                                    
                                    {clienteSelecionado.telefones && clienteSelecionado.telefones.length > 0 && (
                                        <>
                                            <div className="divider" style={{ margin: '10px 0' }}></div>
                                            <p><strong>Telefones:</strong></p>
                                            {clienteSelecionado.telefones.map((telefone, index) => (
                                                <p key={index} style={{ marginLeft: '10px' }}>
                                                    ({telefone.ddd}) {telefone.numero}
                                                </p>
                                            ))}
                                        </>
                                    )}
                                    
                                    {clienteSelecionado.rgs && clienteSelecionado.rgs.length > 0 && (
                                        <>
                                            <div className="divider" style={{ margin: '10px 0' }}></div>
                                            <p><strong>RGs:</strong></p>
                                            {clienteSelecionado.rgs.map((rg, index) => (
                                                <p key={index} style={{ marginLeft: '10px' }}>
                                                    {rg.numero} - {formatarData(rg.dataEmissao)}
                                                </p>
                                            ))}
                                        </>
                                    )}
                                    
                                    <div className="divider" style={{ margin: '10px 0' }}></div>
                                    <p><strong>Consumo:</strong></p>
                                    <p style={{ marginLeft: '10px' }}>
                                        Produtos: {clienteSelecionado.produtosConsumidos?.length || 0}
                                    </p>
                                    <p style={{ marginLeft: '10px' }}>
                                        Serviços: {clienteSelecionado.servicosConsumidos?.length || 0}
                                    </p>
                                    <p style={{ marginLeft: '10px' }}>
                                        <strong>Total: {(clienteSelecionado.produtosConsumidos?.length || 0) + (clienteSelecionado.servicosConsumidos?.length || 0)}</strong>
                                    </p>
                                </div>
                            ) : (
                                <p className="grey-text center-align">
                                    Erro ao carregar detalhes
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListaClienteReal;
