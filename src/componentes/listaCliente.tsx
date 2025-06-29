import React, { useState, useEffect, useMemo } from "react";
import 'materialize-css/dist/css/materialize.min.css'
import BarraBusca, { Filtros } from "./barraBusca";
import ModalEdicaoCliente from "./modalEdicaoCliente";
import { Cliente } from "./roteador";

type props = {
    tema: string;
    clientes?: Cliente[];
    setClientes?: React.Dispatch<React.SetStateAction<Cliente[]>>;
}

const ListaCliente: React.FC<props> = ({ tema, clientes: clientesProps, setClientes: setClientesProps }) => {
    const clientesIniciais = useMemo(() => clientesProps || [
        { id: 1, nome: "João", sobrenome: "Silva", telefone: "(11) 99999-9999", email: "joao@email.com", cidade: "São Paulo", ativo: true },
        { id: 2, nome: "Maria", sobrenome: "Santos", telefone: "(11) 88888-8888", email: "maria@email.com", cidade: "Rio de Janeiro", ativo: true },
        { id: 3, nome: "Pedro", sobrenome: "Oliveira", telefone: "(11) 77777-7777", email: "pedro@email.com", cidade: "Belo Horizonte", ativo: false },
        { id: 4, nome: "Ana", sobrenome: "Costa", telefone: "(11) 66666-6666", email: "ana@email.com", cidade: "São Paulo", ativo: true },
        { id: 5, nome: "Carlos", sobrenome: "Ferreira", telefone: "(11) 55555-5555", email: "carlos@email.com", cidade: "Brasília", ativo: true },
        { id: 6, nome: "Beatriz", sobrenome: "Lima", telefone: "(11) 44444-4444", email: "beatriz@email.com", cidade: "Salvador", ativo: false },
        { id: 7, nome: "Rafael", sobrenome: "Mendes", telefone: "(11) 33333-3333", email: "rafael@email.com", cidade: "São Paulo", ativo: true },
        { id: 8, nome: "Lucia", sobrenome: "Rocha", telefone: "(11) 22222-2222", email: "lucia@email.com", cidade: "Rio de Janeiro", ativo: true }
    ], [clientesProps]);

    const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>([]);
    const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
    const [modalAberto, setModalAberto] = useState<boolean>(false);
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);

    useEffect(() => {
        setClientesFiltrados(clientesIniciais);
    }, [clientesIniciais]);

    const selecionarCliente = (cliente: Cliente) => {
        setClienteSelecionado(cliente);
    };

    const removerCliente = (id: number) => {
        const novosFiltrados = clientesFiltrados.filter(cliente => cliente.id !== id);
        setClientesFiltrados(novosFiltrados);
        
        // Atualizar lista principal se disponível
        if (setClientesProps) {
            setClientesProps(prev => prev.filter(cliente => cliente.id !== id));
        }
        
        setClienteSelecionado(null);
    };

    const buscarClientes = (termo: string, filtros: Filtros) => {
        let clientesFiltradosTemp = clientesIniciais;
        
        // Filtro por termo de busca
        if (termo.trim() !== '') {
            clientesFiltradosTemp = clientesFiltradosTemp.filter(cliente => 
                cliente.nome.toLowerCase().includes(termo.toLowerCase()) ||
                cliente.sobrenome.toLowerCase().includes(termo.toLowerCase()) ||
                cliente.email.toLowerCase().includes(termo.toLowerCase()) ||
                cliente.telefone.includes(termo)
            );
        }
        
        // Filtro por cidade
        if (filtros.cidade && filtros.cidade !== '') {
            clientesFiltradosTemp = clientesFiltradosTemp.filter(cliente => 
                cliente.cidade === filtros.cidade
            );
        }
        
        // Filtro por status
        if (filtros.ativo !== null) {
            clientesFiltradosTemp = clientesFiltradosTemp.filter(cliente => 
                cliente.ativo === filtros.ativo
            );
        }
        
        setClientesFiltrados(clientesFiltradosTemp);
    };

    const abrirModalEdicao = (cliente: Cliente) => {
        setClienteEditando(cliente);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setClienteEditando(null);
    };

    const salvarEdicao = (clienteEditado: Cliente) => {
        const filtradosAtualizados = clientesFiltrados.map(cliente => 
            cliente.id === clienteEditado.id ? clienteEditado : cliente
        );
        
        setClientesFiltrados(filtradosAtualizados);
        
        // Atualizar lista principal se disponível
        if (setClientesProps) {
            setClientesProps(prev => prev.map(cliente => 
                cliente.id === clienteEditado.id ? clienteEditado : cliente
            ));
        }
        
        setClienteSelecionado(clienteEditado);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <h4 className="center-align">Lista de Clientes</h4>
                </div>
            </div>
            
            <div className="row">
                <div className="col s12">
                    <BarraBusca tema={tema} onBuscar={buscarClientes} />
                </div>
            </div>
            
            <div className="row">
                <div className="col s12 m8">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                Clientes Cadastrados 
                                <span className="badge purple white-text">{clientesFiltrados.length}</span>
                            </span>
                            <div className="collection">
                                {clientesFiltrados.length > 0 ? (
                                    clientesFiltrados.map(cliente => (                        <a 
                            key={cliente.id}
                            href="#!"
                            className={`collection-item ${clienteSelecionado?.id === cliente.id ? 'active ' + tema : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                selecionarCliente(cliente);
                            }}
                        >
                                            <div>
                                                <div className="row valign-wrapper" style={{margin: '0'}}>
                                                    <div className="col s2">
                                                        <i className={`material-icons circle ${cliente.ativo ? 'green' : 'grey'} white-text`}>
                                                            {cliente.ativo ? 'check' : 'block'}
                                                        </i>
                                                    </div>
                                                    <div className="col s8">
                                                        <strong>{cliente.nome} {cliente.sobrenome}</strong>
                                                        <br />
                                                        <span className="grey-text">{cliente.email}</span>
                                                        <br />
                                                        <span className="grey-text">{cliente.cidade}</span>
                                                    </div>
                                                    <div className="col s2">
                                                        <a 
                                                            href="#!"
                                                            className="secondary-content red-text"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                removerCliente(cliente.id);
                                                            }}
                                                        >
                                                            <i className="material-icons">delete</i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="collection-item center-align">
                                        <i className="material-icons large grey-text">search_off</i>
                                        <p className="grey-text">Nenhum cliente encontrado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col s12 m4">
                    {clienteSelecionado ? (
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    Detalhes do Cliente
                                    <span className={`new badge ${clienteSelecionado.ativo ? 'green' : 'red'}`} data-badge-caption="">
                                        {clienteSelecionado.ativo ? 'Ativo' : 'Inativo'}
                                    </span>
                                </span>
                                <div className="section">
                                    <p><strong>Nome:</strong> {clienteSelecionado.nome}</p>
                                    <p><strong>Sobrenome:</strong> {clienteSelecionado.sobrenome}</p>
                                    <p><strong>Telefone:</strong> {clienteSelecionado.telefone}</p>
                                    <p><strong>Email:</strong> {clienteSelecionado.email}</p>
                                    <p><strong>Cidade:</strong> {clienteSelecionado.cidade}</p>
                                </div>
                            </div>
                            <div className="card-action">
                                <button 
                                    className={`btn waves-effect waves-light ${tema}`} 
                                    onClick={() => clienteSelecionado && abrirModalEdicao(clienteSelecionado)}
                                >
                                    <i className="material-icons left">edit</i>Editar
                                </button>
                                <button 
                                    className="btn waves-effect waves-light red"
                                    onClick={() => removerCliente(clienteSelecionado.id)}
                                    style={{marginLeft: '10px'}}
                                >
                                    <i className="material-icons left">delete</i>Excluir
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title grey-text">Selecione um Cliente</span>
                                <div className="center-align" style={{padding: '20px 0'}}>
                                    <i className="material-icons large grey-text">person_outline</i>
                                    <p className="grey-text">Clique em um cliente na lista para ver os detalhes.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {modalAberto && clienteEditando && (
                <ModalEdicaoCliente 
                    cliente={clienteEditando}
                    onFechar={fecharModal}
                    onSalvar={salvarEdicao}
                    tema={tema}
                    isOpen={modalAberto}
                />
            )}
        </div>
    );
};

export default ListaCliente;