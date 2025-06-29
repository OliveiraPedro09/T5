import React, { useState } from 'react';
import { Produto } from './roteador';
import 'materialize-css/dist/css/materialize.min.css';

type Props = {
    tema: string;
    produtos: Produto[];
    setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
    selecionarView?: (tela: string, evento: any) => void;
}

const ListaProdutos: React.FC<Props> = ({ tema, produtos, setProdutos, selecionarView }) => {
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    const produtosFiltrados = produtos.filter(produto => {
        const nomeMatch = produto.nome.toLowerCase().includes(filtro.toLowerCase());
        const categoriaMatch = categoriaFiltro === '' || produto.categoria === categoriaFiltro;
        return nomeMatch && categoriaMatch;
    });

    const toggleAtivo = (id: number) => {
        setProdutos(prevProdutos =>
            prevProdutos.map(produto =>
                produto.id === id ? { ...produto, ativo: !produto.ativo } : produto
            )
        );
    };

    const excluirProduto = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
        }
    };

    const categorias = Array.from(new Set(produtos.map(p => p.categoria)));

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">inventory</i>
                                Gerenciar Produtos
                            </span>
                            
                            {/* Filtros */}
                            <div className="row">
                                <div className="col s12 m6">
                                    <div className="input-field">
                                        <input
                                            id="filtro-produto"
                                            type="text"
                                            value={filtro}
                                            onChange={(e) => setFiltro(e.target.value)}
                                        />
                                        <label htmlFor="filtro-produto">Buscar produto</label>
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
                                        onClick={(e) => selecionarView && selecionarView('Cadastrar Produto', e)}
                                    >
                                        <i className="material-icons left">add</i>
                                        Novo Produto
                                    </button>
                                </div>
                            </div>

                            {/* Lista de Produtos */}
                            <div className="row">
                                {produtosFiltrados.length === 0 ? (
                                    <div className="col s12">
                                        <p className="center-align">Nenhum produto encontrado.</p>
                                    </div>
                                ) : (
                                    produtosFiltrados.map(produto => (
                                        <div key={produto.id} className="col s12 m6 l4">
                                            <div className="card">
                                                <div className="card-content">
                                                    <span className="card-title">
                                                        {produto.nome}
                                                        <span className={`badge ${produto.ativo ? 'green' : 'red'} white-text`}>
                                                            {produto.ativo ? 'Ativo' : 'Inativo'}
                                                        </span>
                                                    </span>
                                                    <p><strong>Categoria:</strong> {produto.categoria}</p>
                                                    <p><strong>Preço:</strong> R$ {produto.preco.toFixed(2)}</p>
                                                    <p><strong>Estoque:</strong> {produto.estoque} unidades</p>
                                                    <p><strong>Descrição:</strong> {produto.descricao}</p>
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
                                                        className={`btn-small ${produto.ativo ? 'orange' : 'green'} waves-effect waves-light`}
                                                        onClick={() => toggleAtivo(produto.id)}
                                                    >
                                                        <i className="material-icons left">
                                                            {produto.ativo ? 'visibility_off' : 'visibility'}
                                                        </i>
                                                        {produto.ativo ? 'Desativar' : 'Ativar'}
                                                    </button>
                                                    <button
                                                        className="btn-small red waves-effect waves-light"
                                                        onClick={() => excluirProduto(produto.id)}
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

export default ListaProdutos;
