import React, { useState } from 'react';
import { Servico } from './roteador';
import 'materialize-css/dist/css/materialize.min.css';

type Props = {
    tema: string;
    servicos: Servico[];
    setServicos: React.Dispatch<React.SetStateAction<Servico[]>>;
    selecionarView?: (tela: string, evento: any) => void;
}

const ListaServicos: React.FC<Props> = ({ tema, servicos, setServicos, selecionarView }) => {
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    const servicosFiltrados = servicos.filter(servico => {
        const nomeMatch = servico.nome.toLowerCase().includes(filtro.toLowerCase());
        const categoriaMatch = categoriaFiltro === '' || servico.categoria === categoriaFiltro;
        return nomeMatch && categoriaMatch;
    });

    const toggleAtivo = (id: number) => {
        setServicos(prevServicos =>
            prevServicos.map(servico =>
                servico.id === id ? { ...servico, ativo: !servico.ativo } : servico
            )
        );
    };

    const excluirServico = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
            setServicos(prevServicos => prevServicos.filter(servico => servico.id !== id));
        }
    };

    const formatarDuracao = (minutos: number) => {
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;
        
        if (horas > 0) {
            return `${horas}h ${minutosRestantes > 0 ? `${minutosRestantes}min` : ''}`.trim();
        }
        return `${minutosRestantes}min`;
    };

    const categorias = Array.from(new Set(servicos.map(s => s.categoria)));

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">build</i>
                                Gerenciar Serviços
                            </span>
                            
                            {/* Filtros */}
                            <div className="row">
                                <div className="col s12 m6">
                                    <div className="input-field">
                                        <input
                                            id="filtro-servico"
                                            type="text"
                                            value={filtro}
                                            onChange={(e) => setFiltro(e.target.value)}
                                        />
                                        <label htmlFor="filtro-servico">Buscar serviço</label>
                                    </div>
                                </div>
                                <div className="col s12 m6">
                                    <div className="input-field">
                                        <select
                                            value={categoriaFiltro}
                                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                                            className="browser-default"
                                        >
                                            <option value="">Todas as categorias</option>
                                            {categorias.map(categoria => (
                                                <option key={categoria} value={categoria}>{categoria}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Botão Adicionar */}
                            <div className="row">
                                <div className="col s12">
                                    <button
                                        className={`btn waves-effect waves-light ${tema}`}
                                        onClick={(e) => selecionarView && selecionarView('Cadastrar Serviço', e)}
                                    >
                                        <i className="material-icons left">add</i>
                                        Novo Serviço
                                    </button>
                                </div>
                            </div>

                            {/* Lista de Serviços */}
                            <div className="row">
                                {servicosFiltrados.length === 0 ? (
                                    <div className="col s12">
                                        <p className="center-align">Nenhum serviço encontrado.</p>
                                    </div>
                                ) : (
                                    servicosFiltrados.map(servico => (
                                        <div key={servico.id} className="col s12 m6 l4">
                                            <div className="card">
                                                <div className="card-content">
                                                    <span className="card-title">
                                                        {servico.nome}
                                                        <span className={`badge ${servico.ativo ? 'green' : 'red'} white-text`}>
                                                            {servico.ativo ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </span>
                                                    <p><strong>Categoria:</strong> {servico.categoria}</p>
                                                    <p><strong>Preço:</strong> R$ {servico.preco.toFixed(2)}</p>
                                                    <p><strong>Duração:</strong> {formatarDuracao(servico.duracao)}</p>
                                                    <p><strong>Descrição:</strong> {servico.descricao}</p>
                                                </div>
                                                <div className="card-action">
                                                    <button
                                                        className="btn-small blue waves-effect waves-light"
                                                        onClick={() => {/* TODO: Implementar edição */}}
                                                    >
                                                        <i className="material-icons left">edit</i>
                                                        Editar
                                                    </button>
                                                    <button
                                                        className={`btn-small ${servico.ativo ? 'orange' : 'green'} waves-effect waves-light`}
                                                        onClick={() => toggleAtivo(servico.id)}
                                                    >
                                                        <i className="material-icons left">
                                                            {servico.ativo ? 'visibility_off' : 'visibility'}
                                                        </i>
                                                        {servico.ativo ? 'Desativar' : 'Ativar'}
                                                    </button>
                                                    <button
                                                        className="btn-small red waves-effect waves-light"
                                                        onClick={() => excluirServico(servico.id)}
                                                    >
                                                        <i className="material-icons left">delete</i>
                                                        Excluir
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListaServicos;
