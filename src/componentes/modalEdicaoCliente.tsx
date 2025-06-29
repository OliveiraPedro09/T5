import React, { useState, useEffect, useRef } from "react";
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'

type Cliente = {
    id: number;
    nome: string;
    sobrenome: string;
    telefone: string;
    email: string;
    cidade: string;
    ativo: boolean;
}

type props = {
    cliente: Cliente | null;
    tema: string;
    onSalvar: (cliente: Cliente) => void;
    onFechar: () => void;
    isOpen: boolean;
}

const ModalEdicaoCliente: React.FC<props> = ({ cliente, tema, onSalvar, onFechar, isOpen }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    const [clienteEditado, setClienteEditado] = useState<Cliente>({
        id: 0,
        nome: '',
        sobrenome: '',
        telefone: '',
        email: '',
        cidade: '',
        ativo: true
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (modalRef.current) {
            M.Modal.init(modalRef.current);
        }
    }, []);

    useEffect(() => {
        if (cliente) {
            setClienteEditado({ ...cliente });
        }
    }, [cliente]);

    useEffect(() => {
        if (modalRef.current) {
            const modal = M.Modal.getInstance(modalRef.current);
            if (isOpen) {
                modal.open();
            } else {
                modal.close();
            }
        }
    }, [isOpen]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;
        let finalValue: any = value;
        
        if (type === 'checkbox') {
            finalValue = (event.target as HTMLInputElement).checked;
        }
        
        setClienteEditado(prev => ({ ...prev, [name]: finalValue }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validarFormulario = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        
        if (!clienteEditado.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }
        
        if (!clienteEditado.sobrenome.trim()) {
            newErrors.sobrenome = 'Sobrenome é obrigatório';
        }
        
        if (!clienteEditado.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(clienteEditado.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!clienteEditado.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        if (validarFormulario()) {
            onSalvar(clienteEditado);
            onFechar();
        }
    };

    if (!cliente) return null;

    return (
        <div 
            ref={modalRef}
            id="modalEdicaoCliente" 
            className="modal modal-fixed-footer"
        >
            <div className="modal-content">
                <h4>
                    <i className="material-icons left">edit</i>
                    Editar Cliente
                </h4>
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input 
                                id="modalNome" 
                                name="nome"
                                type="text" 
                                className={`validate ${errors.nome ? 'invalid' : ''}`}
                                value={clienteEditado.nome}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="modalNome" className={clienteEditado.nome ? 'active' : ''}>Nome *</label>
                            {errors.nome && (
                                <span className="helper-text red-text">{errors.nome}</span>
                            )}
                        </div>
                        <div className="input-field col s12 m6">
                            <input 
                                id="modalSobrenome" 
                                name="sobrenome"
                                type="text" 
                                className={`validate ${errors.sobrenome ? 'invalid' : ''}`}
                                value={clienteEditado.sobrenome}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="modalSobrenome" className={clienteEditado.sobrenome ? 'active' : ''}>Sobrenome *</label>
                            {errors.sobrenome && (
                                <span className="helper-text red-text">{errors.sobrenome}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="input-field col s12 m6">
                            <input 
                                id="modalTelefone" 
                                name="telefone"
                                type="text" 
                                className={`validate ${errors.telefone ? 'invalid' : ''}`}
                                value={clienteEditado.telefone}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="modalTelefone" className={clienteEditado.telefone ? 'active' : ''}>Telefone *</label>
                            {errors.telefone && (
                                <span className="helper-text red-text">{errors.telefone}</span>
                            )}
                        </div>
                        <div className="input-field col s12 m6">
                            <input 
                                id="modalEmail" 
                                name="email"
                                type="email" 
                                className={`validate ${errors.email ? 'invalid' : ''}`}
                                value={clienteEditado.email}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="modalEmail" className={clienteEditado.email ? 'active' : ''}>Email *</label>
                            {errors.email && (
                                <span className="helper-text red-text">{errors.email}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="input-field col s12 m8">
                            <select 
                                name="cidade"
                                className="browser-default"
                                value={clienteEditado.cidade}
                                onChange={handleInputChange}
                            >
                                <option value="">Selecione uma cidade</option>
                                <option value="São Paulo">São Paulo</option>
                                <option value="Rio de Janeiro">Rio de Janeiro</option>
                                <option value="Belo Horizonte">Belo Horizonte</option>
                                <option value="Brasília">Brasília</option>
                                <option value="Salvador">Salvador</option>
                            </select>
                        </div>
                        <div className="col s12 m4">
                            <p>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        name="ativo"
                                        checked={clienteEditado.ativo}
                                        onChange={handleInputChange}
                                    />
                                    <span>Cliente Ativo</span>
                                </label>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button 
                    type="button"
                    className="modal-close waves-effect waves-grey btn-flat"
                    onClick={onFechar}
                >
                    Cancelar
                </button>
                <button 
                    type="button"
                    className={`waves-effect waves-light btn ${tema}`}
                    onClick={handleSubmit}
                >
                    <i className="material-icons left">save</i>
                    Salvar
                </button>
            </div>
        </div>
    );
};

export default ModalEdicaoCliente;
