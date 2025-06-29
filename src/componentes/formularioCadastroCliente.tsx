import React, { useState } from "react";
import 'materialize-css/dist/css/materialize.min.css'
import { Cliente } from "./roteador";

type props = {
    tema: string;
    onAdicionarCliente?: (novoCliente: Omit<Cliente, 'id'>) => void;
}

type FormData = {
    nome: string;
    sobrenome: string;
    telefone: string;
    email: string;
    endereco: string;
    cidade: string;
    cep: string;
    cpf: string;
    dataNascimento: string;
}

type Errors = {
    [key: string]: string;
}

const FormularioCadastroCliente: React.FC<props> = ({ tema, onAdicionarCliente }) => {
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        sobrenome: '',
        telefone: '',
        email: '',
        endereco: '',
        cidade: '',
        cep: '',
        cpf: '',
        dataNascimento: ''
    });

    const [errors, setErrors] = useState<Errors>({});

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpar erro específico quando usuário começa a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validarFormulario = (): boolean => {
        const newErrors: Errors = {};
        
        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }
        
        if (!formData.sobrenome.trim()) {
            newErrors.sobrenome = 'Sobrenome é obrigatório';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório';
        }
        
        if (!formData.cpf.trim()) {
            newErrors.cpf = 'CPF é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        if (validarFormulario()) {
            const novoCliente = {
                nome: formData.nome,
                sobrenome: formData.sobrenome,
                telefone: formData.telefone,
                email: formData.email,
                cidade: formData.cidade,
                ativo: true
            };
            
            if (onAdicionarCliente) {
                onAdicionarCliente(novoCliente);
                alert('Cliente cadastrado com sucesso!');
            } else {
                console.log('Cliente cadastrado:', novoCliente);
                alert('Cliente cadastrado com sucesso!');
            }
            
            limparFormulario();
        }
    };

    const limparFormulario = () => {
        setFormData({
            nome: '',
            sobrenome: '',
            telefone: '',
            email: '',
            endereco: '',
            cidade: '',
            cep: '',
            cpf: '',
            dataNascimento: ''
        });
        setErrors({});
    };
    let estiloBotao = `btn waves-effect waves-light ${tema}`;
    let estiloBotaoSecundario = `btn waves-effect waves-light grey lighten-1`;
    
    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <h4 className="center-align">Cadastro de Cliente</h4>
                </div>
            </div>
            
            <div className="row">
                <div className="col s12 m10 l8 offset-m1 offset-l2">
                    <div className="card">
                        <div className="card-content">
                            <span className="card-title">Dados Pessoais</span>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="nome" 
                                            name="nome"
                                            type="text" 
                                            className={`validate ${errors.nome ? 'invalid' : ''}`}
                                            value={formData.nome}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="nome" className={formData.nome ? 'active' : ''}>Nome *</label>
                                        {errors.nome && (
                                            <span className="helper-text red-text">{errors.nome}</span>
                                        )}
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="sobrenome" 
                                            name="sobrenome"
                                            type="text" 
                                            className={`validate ${errors.sobrenome ? 'invalid' : ''}`}
                                            value={formData.sobrenome}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="sobrenome" className={formData.sobrenome ? 'active' : ''}>Sobrenome *</label>
                                        {errors.sobrenome && (
                                            <span className="helper-text red-text">{errors.sobrenome}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="cpf" 
                                            name="cpf"
                                            type="text" 
                                            className={`validate ${errors.cpf ? 'invalid' : ''}`}
                                            value={formData.cpf}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="cpf" className={formData.cpf ? 'active' : ''}>CPF *</label>
                                        {errors.cpf && (
                                            <span className="helper-text red-text">{errors.cpf}</span>
                                        )}
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="dataNascimento" 
                                            name="dataNascimento"
                                            type="date" 
                                            className="validate"
                                            value={formData.dataNascimento}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="dataNascimento" className={formData.dataNascimento ? 'active' : ''}>Data de Nascimento</label>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="telefone" 
                                            name="telefone"
                                            type="text" 
                                            className={`validate ${errors.telefone ? 'invalid' : ''}`}
                                            value={formData.telefone}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="telefone" className={formData.telefone ? 'active' : ''}>Telefone *</label>
                                        {errors.telefone && (
                                            <span className="helper-text red-text">{errors.telefone}</span>
                                        )}
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="email" 
                                            name="email"
                                            type="email" 
                                            className={`validate ${errors.email ? 'invalid' : ''}`}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="email" className={formData.email ? 'active' : ''}>Email *</label>
                                        {errors.email && (
                                            <span className="helper-text red-text">{errors.email}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="divider" style={{margin: '20px 0'}}></div>
                                <h6>Endereço</h6>
                                
                                <div className="row">
                                    <div className="input-field col s12 m8">
                                        <input 
                                            id="endereco" 
                                            name="endereco"
                                            type="text" 
                                            className="validate"
                                            value={formData.endereco}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="endereco" className={formData.endereco ? 'active' : ''}>Endereço</label>
                                    </div>
                                    <div className="input-field col s12 m4">
                                        <input 
                                            id="cep" 
                                            name="cep"
                                            type="text" 
                                            className="validate"
                                            value={formData.cep}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="cep" className={formData.cep ? 'active' : ''}>CEP</label>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input 
                                            id="cidade" 
                                            name="cidade"
                                            type="text" 
                                            className="validate"
                                            value={formData.cidade}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor="cidade" className={formData.cidade ? 'active' : ''}>Cidade</label>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col s12 center-align">
                                        <p className="grey-text">* Campos obrigatórios</p>
                                    </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col s12 center-align">
                                        <button className={estiloBotao} type="submit">
                                            <i className="material-icons left">save</i>Cadastrar Cliente
                                        </button>
                                        <button 
                                            className={estiloBotaoSecundario} 
                                            type="button"
                                            onClick={limparFormulario}
                                            style={{marginLeft: '10px'}}
                                        >
                                            <i className="material-icons left">clear</i>Limpar
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

export default FormularioCadastroCliente;