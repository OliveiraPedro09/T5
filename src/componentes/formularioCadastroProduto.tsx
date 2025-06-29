import React, { useState } from 'react';
import { Produto } from './roteador';
import 'materialize-css/dist/css/materialize.min.css';

type Props = {
    tema: string;
    onAdicionarProduto: (produto: Omit<Produto, 'id'>) => void;
    selecionarView?: (tela: string, evento: any) => void;
}

const FormularioCadastroProduto: React.FC<Props> = ({ tema, onAdicionarProduto, selecionarView }) => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [estoque, setEstoque] = useState('');

    const categoriasPredefinidas = ['Cabelo', 'Pele', 'Unhas', 'Maquiagem', 'Perfumaria', 'Equipamentos'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nome.trim() || !categoria.trim() || !preco || !descricao.trim() || !estoque) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const precoNum = parseFloat(preco);
        const estoqueNum = parseInt(estoque);

        if (precoNum <= 0) {
            alert('O preço deve ser maior que zero.');
            return;
        }

        if (estoqueNum < 0) {
            alert('O estoque não pode ser negativo.');
            return;
        }

        const novoProduto: Omit<Produto, 'id'> = {
            nome: nome.trim(),
            categoria: categoria.trim(),
            preco: precoNum,
            descricao: descricao.trim(),
            estoque: estoqueNum,
            ativo: true
        };

        onAdicionarProduto(novoProduto);
        
        // Limpar formulário
        setNome('');
        setCategoria('');
        setPreco('');
        setDescricao('');
        setEstoque('');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">add_box</i>
                                Cadastrar Novo Produto
                            </span>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col s12 m6">
                                        <div className="input-field">
                                            <input
                                                id="nome"
                                                type="text"
                                                value={nome}
                                                onChange={(e) => setNome(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="nome">Nome do Produto *</label>
                                        </div>
                                    </div>
                                    <div className="col s12 m6">
                                        <div className="input-field">
                                            <select
                                                value={categoria}
                                                onChange={(e) => setCategoria(e.target.value)}
                                                className="browser-default"
                                                required
                                            >
                                                <option value="" disabled>Selecione uma categoria</option>
                                                {categoriasPredefinidas.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                                <option value="Outros">Outros</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col s12 m6">
                                        <div className="input-field">
                                            <input
                                                id="preco"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={preco}
                                                onChange={(e) => setPreco(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="preco">Preço (R$) *</label>
                                        </div>
                                    </div>
                                    <div className="col s12 m6">
                                        <div className="input-field">
                                            <input
                                                id="estoque"
                                                type="number"
                                                min="0"
                                                value={estoque}
                                                onChange={(e) => setEstoque(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="estoque">Quantidade em Estoque *</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col s12">
                                        <div className="input-field">
                                            <textarea
                                                id="descricao"
                                                className="materialize-textarea"
                                                value={descricao}
                                                onChange={(e) => setDescricao(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="descricao">Descrição *</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col s12">
                                        <button
                                            type="submit"
                                            className={`btn waves-effect waves-light ${tema}`}
                                        >
                                            <i className="material-icons left">save</i>
                                            Cadastrar Produto
                                        </button>
                                        <button
                                            type="button"
                                            className="btn grey waves-effect waves-light"
                                            style={{ marginLeft: '10px' }}
                                            onClick={(e) => selecionarView && selecionarView('Produtos', e)}
                                        >
                                            <i className="material-icons left">arrow_back</i>
                                            Voltar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormularioCadastroProduto;
