import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import 'materialize-css/dist/css/materialize.min.css';

const RelatoriosReal: React.FC = () => {
    const [relatorio, setRelatorio] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);
    const [estatisticas, setEstatisticas] = useState<any>({});

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

            setEstatisticas({
                totalClientes: clientes.length,
                totalProdutos: produtos.length,
                totalServicos: servicos.length
            });

            setRelatorio(relatorioConsumo);

        } catch (error) {
            console.error('Erro ao carregar dados dos relatórios:', error);
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
                        <p>Carregando relatórios...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <h4 className="center-align">Relatórios do Sistema</h4>
                    <p className="center-align grey-text">Dados em tempo real do banco SQLite</p>
                </div>
            </div>

            {/* Estatísticas Gerais */}
            <div className="row">
                <div className="col s12 m4">
                    <div className="card purple lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons large purple-text">people</i>
                            <h4 className="purple-text">{estatisticas.totalClientes}</h4>
                            <p className="grey-text">Total de Clientes</p>
                        </div>
                    </div>
                </div>
                
                <div className="col s12 m4">
                    <div className="card blue lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons large blue-text">shopping_cart</i>
                            <h4 className="blue-text">{estatisticas.totalProdutos}</h4>
                            <p className="grey-text">Produtos Cadastrados</p>
                        </div>
                    </div>
                </div>
                
                <div className="col s12 m4">
                    <div className="card green lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons large green-text">build</i>
                            <h4 className="green-text">{estatisticas.totalServicos}</h4>
                            <p className="grey-text">Serviços Cadastrados</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Relatórios de Consumo */}
            {relatorio && (
                <>
                    <div className="row">
                        <div className="col s12">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title">
                                        <i className="material-icons left">trending_up</i>
                                        Produtos Mais Consumidos
                                    </span>
                                    
                                    {relatorio.produtosMaisConsumidos && relatorio.produtosMaisConsumidos.length > 0 ? (
                                        <table className="striped responsive-table">
                                            <thead>
                                                <tr>
                                                    <th>Posição</th>
                                                    <th>Produto</th>
                                                    <th>Quantidade Vendida</th>
                                                    <th>Valor Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {relatorio.produtosMaisConsumidos.map((item: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <span className="badge purple lighten-2 white-text">
                                                                {index + 1}º
                                                            </span>
                                                        </td>
                                                        <td><strong>{item.nome}</strong></td>
                                                        <td>{item.quantidade}</td>
                                                        <td>R$ {item.valor_total?.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="grey-text center-align">Nenhum produto foi consumido ainda</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title">
                                        <i className="material-icons left">build</i>
                                        Serviços Mais Utilizados
                                    </span>
                                    
                                    {relatorio.servicosMaisConsumidos && relatorio.servicosMaisConsumidos.length > 0 ? (
                                        <table className="striped responsive-table">
                                            <thead>
                                                <tr>
                                                    <th>Posição</th>
                                                    <th>Serviço</th>
                                                    <th>Quantidade Utilizada</th>
                                                    <th>Valor Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {relatorio.servicosMaisConsumidos.map((item: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <span className="badge green lighten-2 white-text">
                                                                {index + 1}º
                                                            </span>
                                                        </td>
                                                        <td><strong>{item.nome}</strong></td>
                                                        <td>{item.quantidade}</td>
                                                        <td>R$ {item.valor_total?.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="grey-text center-align">Nenhum serviço foi utilizado ainda</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col s12">
                            <div className="card">
                                <div className="card-content">
                                    <span className="card-title">
                                        <i className="material-icons left">star</i>
                                        Clientes que Mais Consomem
                                    </span>
                                    
                                    {relatorio.clientesQueConsomem && relatorio.clientesQueConsomem.length > 0 ? (
                                        <table className="striped responsive-table">
                                            <thead>
                                                <tr>
                                                    <th>Posição</th>
                                                    <th>Cliente</th>
                                                    <th>Total de Consumos</th>
                                                    <th>Valor Total Gasto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {relatorio.clientesQueConsomem.map((item: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <span className="badge orange lighten-2 white-text">
                                                                {index + 1}º
                                                            </span>
                                                        </td>
                                                        <td><strong>{item.nome}</strong></td>
                                                        <td>{item.total_consumos}</td>
                                                        <td>R$ {item.valor_total?.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="grey-text center-align">Nenhum consumo foi registrado ainda</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Ações */}
            <div className="row">
                <div className="col s12 center-align">
                    <button 
                        className="btn purple lighten-2 waves-effect waves-light"
                        onClick={carregarDados}
                    >
                        <i className="material-icons left">refresh</i>
                        Atualizar Relatórios
                    </button>
                </div>
            </div>

            {/* Informações sobre o sistema */}
            <div className="row">
                <div className="col s12">
                    <div className="card purple lighten-5">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">info</i>
                                Sobre os Relatórios
                            </span>
                            <p>
                                <strong>Fonte dos Dados:</strong> Banco de dados SQLite em tempo real<br />
                                <strong>Atualização:</strong> Os dados são consultados diretamente do banco a cada carregamento<br />
                                <strong>Cálculos:</strong> Valores e quantidades são calculados automaticamente pelo backend<br />
                                <strong>Performance:</strong> Consultas otimizadas com agregações SQL
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelatoriosReal;
