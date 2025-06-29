import React, { useState, useEffect } from 'react';
import apiService, { Cliente as ApiCliente } from '../services/apiService';
import 'materialize-css/dist/css/materialize.min.css';

type Estatisticas = {
    totalClientes: number;
    clientesNovos: number;
    clientesAtivos: number;
    cidadesAtendidas: number;
    totalProdutos: number;
    totalServicos: number;
}

type props = {
    tema: string,
    selecionarView?: (tela: string, evento: any) => void
}

const Dashboard: React.FC<props> = ({ tema, selecionarView }) => {
    const [estatisticas, setEstatisticas] = useState<Estatisticas>({
        totalClientes: 0,
        clientesNovos: 0,
        clientesAtivos: 0,
        cidadesAtendidas: 0,
        totalProdutos: 0,
        totalServicos: 0
    });

    const [carregando, setCarregando] = useState(true);
    const [relatorio, setRelatorio] = useState<any>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);

            const [clientes, produtos, servicos, relatorioConsumo] = await Promise.all([
                apiService.listarClientes(),
                apiService.listarProdutos(),
                apiService.listarServicos(),
                apiService.obterRelatorioConsumo()
            ]);

            // Calcular estatísticas baseadas nos dados reais
            const agora = new Date();
            const mesAtual = agora.getMonth();
            const anoAtual = agora.getFullYear();

            const clientesNovosMes = clientes.filter((cliente: ApiCliente) => {
                if (cliente.dataCadastro) {
                    const dataCadastro = new Date(cliente.dataCadastro);
                    return dataCadastro.getMonth() === mesAtual && dataCadastro.getFullYear() === anoAtual;
                }
                return false;
            }).length;

            setEstatisticas({
                totalClientes: clientes.length,
                clientesNovos: clientesNovosMes,
                clientesAtivos: clientes.length, // Todos os clientes são ativos no nosso modelo
                cidadesAtendidas: 0, // Campo não existe no modelo atual
                totalProdutos: produtos.length,
                totalServicos: servicos.length
            });

            setRelatorio(relatorioConsumo);

        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12 center-align">
                        <div className="preloader-wrapper big active">
                            <div className="spinner-layer spinner-blue-only">
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
                        <p>Carregando dados...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <h4 className="center-align">Dashboard</h4>
                    <p className="center-align grey-text">Dados em tempo real do banco SQLite</p>
                </div>
            </div>
            
            {/* Cards de Estatísticas Reais */}
            <div className="row">
                <div className="col s12 m6 l3">
                    <div className="card purple lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons large purple-text">people</i>
                            <h4 className="purple-text">{estatisticas.totalClientes}</h4>
                            <p className="grey-text">Total de Clientes</p>
                        </div>
                    </div>
                </div>
                
                <div className="col s12 m6 l3">
                    <div className="card green lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons large green-text">trending_up</i>
                            <h4 className="green-text">{estatisticas.clientesNovos}</h4>
                            <p className="grey-text">Novos Este Mês</p>
                        </div>
                    </div>
                </div>
                
                <div className="col s12 m6 l3">
                    <div className="card blue lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons large blue-text">shopping_cart</i>
                            <h4 className="blue-text">{estatisticas.totalProdutos}</h4>
                            <p className="grey-text">Produtos</p>
                        </div>
                    </div>
                </div>
                
                <div className="col s12 m6 l3">
                    <div className="card orange lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons large orange-text">build</i>
                            <h4 className="orange-text">{estatisticas.totalServicos}</h4>
                            <p className="grey-text">Serviços</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Relatórios de Consumo */}
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
                                        <h6>Top 3 Produtos</h6>
                                        {relatorio.produtosMaisConsumidos?.slice(0, 3).map((item: any, index: number) => (
                                            <div key={index} className="card-panel grey lighten-4" style={{ marginBottom: '10px' }}>
                                                <strong>{item.nome}</strong><br />
                                                <small>Vendas: {item.quantidade}</small><br />
                                                <small>R$ {item.valor_total?.toFixed(2)}</small>
                                            </div>
                                        ))}
                                        {(!relatorio.produtosMaisConsumidos || relatorio.produtosMaisConsumidos.length === 0) && (
                                            <p className="grey-text">Nenhum produto consumido ainda</p>
                                        )}
                                    </div>
                                    
                                    <div className="col s12 m4">
                                        <h6>Top 3 Serviços</h6>
                                        {relatorio.servicosMaisConsumidos?.slice(0, 3).map((item: any, index: number) => (
                                            <div key={index} className="card-panel grey lighten-4" style={{ marginBottom: '10px' }}>
                                                <strong>{item.nome}</strong><br />
                                                <small>Vendas: {item.quantidade}</small><br />
                                                <small>R$ {item.valor_total?.toFixed(2)}</small>
                                            </div>
                                        ))}
                                        {(!relatorio.servicosMaisConsumidos || relatorio.servicosMaisConsumidos.length === 0) && (
                                            <p className="grey-text">Nenhum serviço consumido ainda</p>
                                        )}
                                    </div>
                                    
                                    <div className="col s12 m4">
                                        <h6>Top 3 Clientes</h6>
                                        {relatorio.clientesQueConsomem?.slice(0, 3).map((item: any, index: number) => (
                                            <div key={index} className="card-panel grey lighten-4" style={{ marginBottom: '10px' }}>
                                                <strong>{item.nome}</strong><br />
                                                <small>Consumos: {item.total_consumos}</small><br />
                                                <small>R$ {item.valor_total?.toFixed(2)}</small>
                                            </div>
                                        ))}
                                        {(!relatorio.clientesQueConsomem || relatorio.clientesQueConsomem.length === 0) && (
                                            <p className="grey-text">Nenhum consumo registrado ainda</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Ações Rápidas */}
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">flash_on</i>
                                Ações Rápidas
                            </span>
                            <div className="row">
                                <div className="col s12 m6 l3">
                                    <button 
                                        className="btn-large purple lighten-2 waves-effect waves-light full-width"
                                        onClick={(e) => selecionarView && selecionarView('Cadastro Real', e)}
                                    >
                                        <i className="material-icons left">person_add</i>
                                        Novo Cliente
                                    </button>
                                </div>
                                <div className="col s12 m6 l3">
                                    <button 
                                        className="btn-large blue lighten-2 waves-effect waves-light full-width"
                                        onClick={(e) => selecionarView && selecionarView('Cadastrar Produto', e)}
                                    >
                                        <i className="material-icons left">add_shopping_cart</i>
                                        Novo Produto
                                    </button>
                                </div>
                                <div className="col s12 m6 l3">
                                    <button 
                                        className="btn-large green lighten-2 waves-effect waves-light full-width"
                                        onClick={(e) => selecionarView && selecionarView('Cadastrar Serviço', e)}
                                    >
                                        <i className="material-icons left">build</i>
                                        Novo Serviço
                                    </button>
                                </div>
                                <div className="col s12 m6 l3">
                                    <button 
                                        className="btn-large orange lighten-2 waves-effect waves-light full-width"
                                        onClick={(e) => selecionarView && selecionarView('Relatórios Real', e)}
                                    >
                                        <i className="material-icons left">assignment</i>
                                        Ver Relatórios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col s12">
                    <div className="card purple lighten-5">
                        <div className="card-content center-align">
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

export default Dashboard;
