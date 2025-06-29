import React, { useState } from 'react';
import { Servico } from './roteador';
import 'materialize-css/dist/css/materialize.min.css';

type Props = {
    tema: string;
    onAdicionarServico: (servico: Omit<Servico, 'id'>) => void;
    selecionarView?: (tela: string, evento: any) => void;
}

const FormularioCadastroServico: React.FC<Props> = ({ tema, onAdicionarServico, selecionarView }) => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [duracao, setDuracao] = useState('');

    const categoriasPredefinidas = ['Cabelo', 'Pele', 'Unhas', 'Maquiagem', 'Massagem', 'Estética'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nome.trim() || !categoria.trim() || !preco || !descricao.trim() || !duracao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const precoNum = parseFloat(preco);
        const duracaoNum = parseInt(duracao);

        if (precoNum <= 0) {
            alert('O preço deve ser maior que zero.');
            return;
        }

        if (duracaoNum <= 0) {
            alert('A duração deve ser maior que zero.');
            return;
        }

        const novoServico: Omit<Servico, 'id'> = {
            nome: nome.trim(),
            categoria: categoria.trim(),
            preco: precoNum,
            descricao: descricao.trim(),
            duracao: duracaoNum,
            ativo: true
        };

        onAdicionarServico(novoServico);
        
        // Limpar formulário
        setNome('');
        setCategoria('');
        setPreco('');
        setDescricao('');
        setDuracao('');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">
                                <i className="material-icons left">add_box</i>
                                Cadastrar Novo Serviço
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
                                            <label htmlFor="nome">Nome do Serviço *</label>
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
                                                id="duracao"
                                                type="number"
                                                min="1"
                                                value={duracao}
                                                onChange={(e) => setDuracao(e.target.value)}
                                                required
                                            />
                                            <label htmlFor="duracao">Duração (minutos) *</label>
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
                                            Cadastrar Serviço
                                        </button>
                                        <button
                                            type="button"
                                            className="btn grey waves-effect waves-light"
                                            style={{ marginLeft: '10px' }}
                                            onClick={(e) => selecionarView && selecionarView('Serviços', e)}
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

export default FormularioCadastroServico;
