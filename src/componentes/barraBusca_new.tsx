import React, { useState } from "react";
import 'materialize-css/dist/css/materialize.min.css';

export type Filtros = {
    cidade: string;
    ativo: boolean | null;
}

type Props = {
    tema: string;
    onBuscar: (termo: string, filtros: Filtros) => void;
}

const BarraBusca: React.FC<Props> = ({ tema, onBuscar }) => {
    const [termoBusca, setTermoBusca] = useState<string>('');
    const [filtros, setFiltros] = useState<Filtros>({
        cidade: '',
        ativo: null
    });
    const [mostrarFiltros, setMostrarFiltros] = useState<boolean>(false);

    const handleBusca = (event: React.ChangeEvent<HTMLInputElement>) => {
        const termo = event.target.value;
        setTermoBusca(termo);
        onBuscar(termo, filtros);
    };

    const handleFiltroChange = (campo: keyof Filtros, valor: any) => {
        const novosFiltros = { ...filtros, [campo]: valor };
        setFiltros(novosFiltros);
        onBuscar(termoBusca, novosFiltros);
    };

    const limparFiltros = () => {
        const filtrosLimpos = { cidade: '', ativo: null };
        setFiltros(filtrosLimpos);
        setTermoBusca('');
        onBuscar('', filtrosLimpos);
    };

    const toggleFiltros = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    return (
        <div className="card">
            <div className="card-content">
                <div className="row">
                    <div className="col s12 m8">
                        <div className="input-field">
                            <i className="material-icons prefix">search</i>
                            <input 
                                id="busca" 
                                type="text" 
                                className="validate"
                                value={termoBusca}
                                onChange={handleBusca}
                            />
                            <label htmlFor="busca" className={termoBusca ? 'active' : ''}>
                                Buscar por nome, email ou telefone
                            </label>
                        </div>
                    </div>
                    <div className="col s12 m4 center-align">
                        <button 
                            className={`btn waves-effect waves-light ${tema}`}
                            onClick={toggleFiltros}
                            style={{marginTop: '20px'}}
                        >
                            <i className="material-icons left">filter_list</i>
                            Filtros
                        </button>
                        <button 
                            className="btn waves-effect waves-light grey"
                            onClick={limparFiltros}
                            style={{marginTop: '20px', marginLeft: '10px'}}
                        >
                            <i className="material-icons left">clear</i>
                            Limpar
                        </button>
                    </div>
                </div>
                
                {mostrarFiltros && (
                    <div className="row">
                        <div className="col s12">
                            <div className="divider" style={{marginBottom: '20px'}}></div>
                            <h6>Filtros Avançados</h6>
                        </div>
                        <div className="col s12 m6">
                            <div className="input-field">
                                <select 
                                    className="browser-default"
                                    value={filtros.cidade}
                                    onChange={(e) => handleFiltroChange('cidade', e.target.value)}
                                >
                                    <option value="">Todas as cidades</option>
                                    <option value="São Paulo">São Paulo</option>
                                    <option value="Rio de Janeiro">Rio de Janeiro</option>
                                    <option value="Belo Horizonte">Belo Horizonte</option>
                                    <option value="Brasília">Brasília</option>
                                    <option value="Salvador">Salvador</option>
                                </select>
                                <label>Filtrar por cidade</label>
                            </div>
                        </div>
                        <div className="col s12 m6">
                            <div className="input-field">
                                <select 
                                    className="browser-default"
                                    value={filtros.ativo === null ? '' : filtros.ativo.toString()}
                                    onChange={(e) => {
                                        const valor = e.target.value === '' ? null : e.target.value === 'true';
                                        handleFiltroChange('ativo', valor);
                                    }}
                                >
                                    <option value="">Todos os status</option>
                                    <option value="true">Ativos</option>
                                    <option value="false">Inativos</option>
                                </select>
                                <label>Status do cliente</label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarraBusca;
