import React from "react";
import 'materialize-css/dist/css/materialize.min.css'

type props = {
    tema: string
}

type Estatisticas = {
    totalClientes: number;
    clientesNovos: number;
    clientesAtivos: number;
    cidadesAtendidas: number;
}

type Atividade = {
    id: number;
    descricao: string;
    data: string;
    tipo: 'cadastro' | 'edicao' | 'exclusao';
}

const Dashboard: React.FC<props> = ({ tema }) => {
    const estatisticas: Estatisticas = {
        totalClientes: 150,
        clientesNovos: 25,
        clientesAtivos: 142,
        cidadesAtendidas: 12
    };

    const atividadesRecentes: Atividade[] = [
        { id: 1, descricao: "Cliente João Silva foi cadastrado", data: "2025-06-27 10:30", tipo: 'cadastro' },
        { id: 2, descricao: "Cliente Maria Santos foi editado", data: "2025-06-27 09:15", tipo: 'edicao' },
        { id: 3, descricao: "Cliente Pedro Oliveira foi cadastrado", data: "2025-06-26 16:45", tipo: 'cadastro' },
        { id: 4, descricao: "Cliente Ana Costa foi excluído", data: "2025-06-26 14:20", tipo: 'exclusao' },
        { id: 5, descricao: "Cliente Carlos Ferreira foi editado", data: "2025-06-26 11:10", tipo: 'edicao' }
    ];

    const getIconeAtividade = (tipo: string) => {
        switch(tipo) {
            case 'cadastro':
                return <i className="material-icons green-text">person_add</i>;
            case 'edicao':
                return <i className="material-icons blue-text">edit</i>;
            case 'exclusao':
                return <i className="material-icons red-text">delete</i>;
            default:
                return <i className="material-icons grey-text">info</i>;
        }
    };
    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <h4 className="center-align">Dashboard</h4>
                    <p className="center-align grey-text">Visão geral do sistema</p>
                </div>
            </div>
            
            {/* Cards de Estatísticas */}
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
                            <i className="material-icons large blue-text">verified_user</i>
                            <h4 className="blue-text">{estatisticas.clientesAtivos}</h4>
                            <p className="grey-text">Clientes Ativos</p>
                        </div>
                    </div>
                </div>
                
                <div className="col s12 m6 l3">
                    <div className="card orange lighten-5">
                        <div className="card-content center-align">
                            <i className="material-icons large orange-text">location_city</i>
                            <h4 className="orange-text">{estatisticas.cidadesAtendidas}</h4>
                            <p className="grey-text">Cidades</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
                {/* Gráfico de Crescimento */}
                <div className="col s12 m8">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">show_chart</i>
                                Crescimento de Clientes
                            </span>
                            <div className="center-align" style={{padding: '40px 0'}}>
                                <div className="row">
                                    <div className="col s2">
                                        <div className={`${tema} lighten-2`} style={{height: '60px', width: '100%', marginBottom: '10px'}}></div>
                                        <span className="grey-text small">Jan</span>
                                    </div>
                                    <div className="col s2">
                                        <div className={`${tema} lighten-2`} style={{height: '80px', width: '100%', marginBottom: '10px'}}></div>
                                        <span className="grey-text small">Fev</span>
                                    </div>
                                    <div className="col s2">
                                        <div className={`${tema} lighten-2`} style={{height: '100px', width: '100%', marginBottom: '10px'}}></div>
                                        <span className="grey-text small">Mar</span>
                                    </div>
                                    <div className="col s2">
                                        <div className={`${tema} lighten-2`} style={{height: '120px', width: '100%', marginBottom: '10px'}}></div>
                                        <span className="grey-text small">Abr</span>
                                    </div>
                                    <div className="col s2">
                                        <div className={`${tema} lighten-2`} style={{height: '140px', width: '100%', marginBottom: '10px'}}></div>
                                        <span className="grey-text small">Mai</span>
                                    </div>
                                    <div className="col s2">
                                        <div className={`${tema}`} style={{height: '160px', width: '100%', marginBottom: '10px'}}></div>
                                        <span className="grey-text small">Jun</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Atividades Recentes */}
                <div className="col s12 m4">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">history</i>
                                Atividades Recentes
                            </span>
                            <div className="collection">
                                {atividadesRecentes.map(atividade => (
                                    <div key={atividade.id} className="collection-item">
                                        <div>
                                            {getIconeAtividade(atividade.tipo)}
                                            <span style={{marginLeft: '10px', fontSize: '14px'}}>
                                                {atividade.descricao}
                                            </span>
                                            <p className="grey-text" style={{fontSize: '12px', margin: '5px 0 0 34px'}}>
                                                {atividade.data}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="card-action">
                            <a className={`btn waves-effect waves-light ${tema}`}>
                                <i className="material-icons left">list</i>Ver Todas
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
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
                                <div className="col s12 m3">
                                    <a className={`btn-large waves-effect waves-light ${tema} full-width`}>
                                        <i className="material-icons left">person_add</i>
                                        Novo Cliente
                                    </a>
                                </div>
                                <div className="col s12 m3">
                                    <a className="btn-large waves-effect waves-light blue full-width">
                                        <i className="material-icons left">search</i>
                                        Buscar Cliente
                                    </a>
                                </div>
                                <div className="col s12 m3">
                                    <a className="btn-large waves-effect waves-light green full-width">
                                        <i className="material-icons left">assessment</i>
                                        Relatório
                                    </a>
                                </div>
                                <div className="col s12 m3">
                                    <a className="btn-large waves-effect waves-light orange full-width">
                                        <i className="material-icons left">backup</i>
                                        Backup
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
