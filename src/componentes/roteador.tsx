import React, { useState } from "react";
import BarraNavegacao from "./barraNavegacao";
import FormularioCadastroCliente from "./formularioCadastroCliente";
import ListaCliente from "./listaCliente";
import Dashboard from "./dashboard";
import Footer from "./footer";
import TestConnection from "./testConnection";
import IntegracaoDemo from "./integracaoDemo";
// Componentes de Produtos e Serviços
import ListaProdutos from "./listaProdutos";
import FormularioCadastroProduto from "./formularioCadastroProduto";
import ListaServicos from "./listaServicos";
import FormularioCadastroServico from "./formularioCadastroServico";
// Componentes que usam dados reais do backend
import DashboardReal from "./dashboardReal";
import ListaClienteReal from "./listaClienteReal";
import FormularioCadastroClienteReal from "./formularioCadastroClienteReal";
import RelatoriosReal from "./relatoriosReal";
// Estilos de acessibilidade
import '../styles/accessibility.css';

export type Cliente = {
    id: number;
    nome: string;
    sobrenome: string;
    telefone: string;
    email: string;
    cidade: string;
    ativo: boolean;
}

export type Produto = {
    id: number;
    nome: string;
    categoria: string;
    preco: number;
    descricao: string;
    estoque: number;
    ativo: boolean;
}

export type Servico = {
    id: number;
    nome: string;
    categoria: string;
    preco: number;
    descricao: string;
    duracao: number; // em minutos
    ativo: boolean;
}

const Roteador: React.FC = () => {
    const [tela, setTela] = useState<string>('Dashboard Real');
    const [clientes, setClientes] = useState<Cliente[]>([
        { id: 1, nome: "João", sobrenome: "Silva", telefone: "(11) 99999-9999", email: "joao@email.com", cidade: "São Paulo", ativo: true },
        { id: 2, nome: "Maria", sobrenome: "Santos", telefone: "(11) 88888-8888", email: "maria@email.com", cidade: "Rio de Janeiro", ativo: true },
        { id: 3, nome: "Pedro", sobrenome: "Oliveira", telefone: "(11) 77777-7777", email: "pedro@email.com", cidade: "Belo Horizonte", ativo: false },
        { id: 4, nome: "Ana", sobrenome: "Costa", telefone: "(11) 66666-6666", email: "ana@email.com", cidade: "São Paulo", ativo: true },
        { id: 5, nome: "Carlos", sobrenome: "Ferreira", telefone: "(11) 55555-5555", email: "carlos@email.com", cidade: "Brasília", ativo: true },
        { id: 6, nome: "Beatriz", sobrenome: "Lima", telefone: "(11) 44444-4444", email: "beatriz@email.com", cidade: "Salvador", ativo: false },
        { id: 7, nome: "Rafael", sobrenome: "Mendes", telefone: "(11) 33333-3333", email: "rafael@email.com", cidade: "São Paulo", ativo: true },
        { id: 8, nome: "Lucia", sobrenome: "Rocha", telefone: "(11) 22222-2222", email: "lucia@email.com", cidade: "Rio de Janeiro", ativo: true }
    ]);

    const [produtos, setProdutos] = useState<Produto[]>([
        { id: 1, nome: "Shampoo Premium", categoria: "Cabelo", preco: 25.90, descricao: "Shampoo para cabelos secos", estoque: 50, ativo: true },
        { id: 2, nome: "Condicionador", categoria: "Cabelo", preco: 22.50, descricao: "Condicionador hidratante", estoque: 30, ativo: true },
        { id: 3, nome: "Creme Facial", categoria: "Pele", preco: 45.00, descricao: "Creme anti-idade", estoque: 20, ativo: true },
        { id: 4, nome: "Esmalte Gel", categoria: "Unhas", preco: 15.00, descricao: "Esmalte de longa duração", estoque: 100, ativo: true }
    ]);

    const [servicos, setServicos] = useState<Servico[]>([
        { id: 1, nome: "Corte Feminino", categoria: "Cabelo", preco: 80.00, descricao: "Corte e finalização", duracao: 60, ativo: true },
        { id: 2, nome: "Coloração", categoria: "Cabelo", preco: 150.00, descricao: "Coloração completa", duracao: 120, ativo: true },
        { id: 3, nome: "Manicure", categoria: "Unhas", preco: 30.00, descricao: "Cuidados com unhas das mãos", duracao: 45, ativo: true },
        { id: 4, nome: "Pedicure", categoria: "Unhas", preco: 35.00, descricao: "Cuidados com unhas dos pés", duracao: 50, ativo: true },
        { id: 5, nome: "Limpeza de Pele", categoria: "Pele", preco: 120.00, descricao: "Limpeza profunda facial", duracao: 90, ativo: true }
    ]);

    const selecionarView = (novaTela: string, evento: Event) => {
        evento.preventDefault();
        console.log(novaTela);
        setTela(novaTela);
    };

    const adicionarCliente = (novoCliente: Omit<Cliente, 'id'>) => {
        const id = Math.max(...clientes.map(c => c.id)) + 1;
        const clienteComId = { ...novoCliente, id, ativo: true };
        setClientes(prevClientes => [...prevClientes, clienteComId]);
        setTela('Clientes'); // Navegar para a lista após cadastrar
    };

    const adicionarProduto = (novoProduto: Omit<Produto, 'id'>) => {
        const id = Math.max(...produtos.map(p => p.id)) + 1;
        const produtoComId = { ...novoProduto, id, ativo: true };
        setProdutos(prevProdutos => [...prevProdutos, produtoComId]);
        setTela('Produtos'); // Navegar para a lista após cadastrar
    };

    const adicionarServico = (novoServico: Omit<Servico, 'id'>) => {
        const id = Math.max(...servicos.map(s => s.id)) + 1;
        const servicoComId = { ...novoServico, id, ativo: true };
        setServicos(prevServicos => [...prevServicos, servicoComId]);
        setTela('Serviços'); // Navegar para a lista após cadastrar
    };

    const renderConfiguracoes = () => {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <h4 className="center-align">Configurações</h4>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col s12 m6">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    <i className="material-icons left">palette</i>
                                    Aparência
                                </span>
                                <div className="row">
                                    <div className="col s12">
                                        <label>Tema da Aplicação</label>
                                        <select className="browser-default">
                                            <option value="" disabled selected>Escolha um tema</option>
                                            <option value="purple">Roxo (Atual)</option>
                                            <option value="blue">Azul</option>
                                            <option value="green">Verde</option>
                                            <option value="red">Vermelho</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col s12 m6">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    <i className="material-icons left">storage</i>
                                    Dados
                                </span>
                                <div className="row">
                                    <div className="col s12">
                                        <a href="#!" className="btn waves-effect waves-light purple lighten-4 purple-text text-darken-3 full-width">
                                            <i className="material-icons left">backup</i>
                                            Fazer Backup
                                        </a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s12">
                                        <a href="#!" className="btn waves-effect waves-light orange lighten-4 orange-text text-darken-3 full-width">
                                            <i className="material-icons left">restore</i>
                                            Restaurar Backup
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col s12">
                        <div className="card">
                            <div className="card-content">
                                <span className="card-title">
                                    <i className="material-icons left">info</i>
                                    Informações do Sistema
                                </span>
                                <div className="row">
                                    <div className="col s12 m6">
                                        <p><strong>Versão:</strong> 1.0.0</p>
                                        <p><strong>Desenvolvido por:</strong> Equipe WB</p>
                                    </div>
                                    <div className="col s12 m6">
                                        <p><strong>Última atualização:</strong> 27/06/2025</p>
                                        <p><strong>Tecnologias:</strong> React + MaterializeCSS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const barraNavegacao = <BarraNavegacao 
        seletorView={selecionarView} 
        tema="purple lighten-4" 
        botoes={['Dashboard Real', 'Clientes Real', 'Cadastro Real', 'Produtos', 'Serviços', 'Relatórios Real', 'Teste Backend', 'Demo Integração']}
        telaAtiva={tela}
    />;
    
    if (tela === 'Dashboard Real') {
        return (
            <>
                {barraNavegacao}
                <DashboardReal tema="purple lighten-4" selecionarView={selecionarView} />
                <Footer />
            </>
        );
    } else if (tela === 'Clientes Real') {
        return (
            <>
                {barraNavegacao}
                <ListaClienteReal tema="purple lighten-4" />
                <Footer />
            </>
        );
    } else if (tela === 'Cadastro Real') {
        return (
            <>
                {barraNavegacao}
                <FormularioCadastroClienteReal tema="purple lighten-4" />
                <Footer />
            </>
        );
    } else if (tela === 'Produtos') {
        return (
            <>
                {barraNavegacao}
                <ListaProdutos tema="purple lighten-4" produtos={produtos} setProdutos={setProdutos} selecionarView={selecionarView} />
                <Footer />
            </>
        );
    } else if (tela === 'Cadastrar Produto') {
        return (
            <>
                {barraNavegacao}
                <FormularioCadastroProduto tema="purple lighten-4" onAdicionarProduto={adicionarProduto} selecionarView={selecionarView} />
                <Footer />
            </>
        );
    } else if (tela === 'Serviços') {
        return (
            <>
                {barraNavegacao}
                <ListaServicos tema="purple lighten-4" servicos={servicos} setServicos={setServicos} selecionarView={selecionarView} />
                <Footer />
            </>
        );
    } else if (tela === 'Cadastrar Serviço') {
        return (
            <>
                {barraNavegacao}
                <FormularioCadastroServico tema="purple lighten-4" onAdicionarServico={adicionarServico} selecionarView={selecionarView} />
                <Footer />
            </>
        );
    } else if (tela === 'Dashboard') {
        return (
            <>
                {barraNavegacao}
                <Dashboard tema="purple lighten-4" />
                <Footer />
            </>
        );
    } else if (tela === 'Clientes') {
        return (
            <>
                {barraNavegacao}
                <ListaCliente tema="purple lighten-4" clientes={clientes} setClientes={setClientes} />
                <Footer />
            </>
        );
    } else if (tela === 'Cadastrar Cliente') {
        return (
            <>
                {barraNavegacao}
                <FormularioCadastroCliente tema="purple lighten-4" onAdicionarCliente={adicionarCliente} />
                <Footer />
            </>
        );
    } else if (tela === 'Produtos') {
        return (
            <>
                {barraNavegacao}
                <ListaProdutos tema="purple lighten-4" produtos={produtos} setProdutos={setProdutos} />
                <Footer />
            </>
        );
    } else if (tela === 'Cadastrar Produto') {
        return (
            <>
                {barraNavegacao}
                <FormularioCadastroProduto tema="purple lighten-4" onAdicionarProduto={adicionarProduto} />
                <Footer />
            </>
        );
    } else if (tela === 'Serviços') {
        return (
            <>
                {barraNavegacao}
                <ListaServicos tema="purple lighten-4" servicos={servicos} setServicos={setServicos} />
                <Footer />
            </>
        );
    } else if (tela === 'Cadastrar Serviço') {
        return (
            <>
                {barraNavegacao}
                <FormularioCadastroServico tema="purple lighten-4" onAdicionarServico={adicionarServico} />
                <Footer />
            </>
        );
    } else if (tela === 'Relatórios Real') {
        return (
            <>
                {barraNavegacao}
                <RelatoriosReal />
                <Footer />
            </>
        );
    } else if (tela === 'Teste Backend') {
        return (
            <>
                {barraNavegacao}
                <TestConnection />
                <Footer />
            </>
        );
    } else if (tela === 'Demo Integração') {
        return (
            <>
                {barraNavegacao}
                <IntegracaoDemo />
                <Footer />
            </>
        );
    } else if (tela === 'Configurações') {
        return (
            <>
                {barraNavegacao}
                {renderConfiguracoes()}
                <Footer />
            </>
        );
    } else {
        return (
            <>
                {barraNavegacao}
                <DashboardReal tema="purple lighten-4" />
                <Footer />
            </>
        );
    }
};

export default Roteador;