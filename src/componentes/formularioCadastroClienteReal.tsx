import React, { useState } from 'react';
import apiService from '../services/apiService';
import 'materialize-css/dist/css/materialize.min.css';

type props = {
    tema: string;
    onClienteCadastrado?: () => void;
}

const FormularioCadastroClienteReal: React.FC<props> = ({ tema, onClienteCadastrado }) => {
    const [nome, setNome] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [cpf, setCpf] = useState('');
    const [genero, setGenero] = useState('');
    const [telefones, setTelefones] = useState([{ ddd: '', numero: '' }]);
    const [rgs, setRgs] = useState([{ numero: '', dataEmissao: '' }]);
    const [salvando, setSalvando] = useState(false);

    const adicionarTelefone = () => {
        setTelefones([...telefones, { ddd: '', numero: '' }]);
    };

    const removerTelefone = (index: number) => {
        if (telefones.length > 1) {
            setTelefones(telefones.filter((_, i) => i !== index));
        }
    };

    const atualizarTelefone = (index: number, campo: 'ddd' | 'numero', valor: string) => {
        const novosTelefones = [...telefones];
        novosTelefones[index][campo] = valor;
        setTelefones(novosTelefones);
    };

    const adicionarRg = () => {
        setRgs([...rgs, { numero: '', dataEmissao: '' }]);
    };

    const removerRg = (index: number) => {
        if (rgs.length > 1) {
            setRgs(rgs.filter((_, i) => i !== index));
        }
    };

    const atualizarRg = (index: number, campo: 'numero' | 'dataEmissao', valor: string) => {
        const novosRgs = [...rgs];
        novosRgs[index][campo] = valor;
        setRgs(novosRgs);
    };

    const formatarCpf = (valor: string) => {
        // Remove tudo que não é dígito
        const digitos = valor.replace(/\D/g, '');
        
        // Aplica a máscara do CPF
        if (digitos.length <= 11) {
            const cpfFormatado = digitos
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            return cpfFormatado;
        }
        return valor;
    };

    const handleCpfChange = (valor: string) => {
        const cpfFormatado = formatarCpf(valor);
        setCpf(cpfFormatado);
    };

    const validarFormulario = () => {
        if (!nome.trim()) {
            alert('Nome é obrigatório');
            return false;
        }

        if (!cpf.trim()) {
            alert('CPF é obrigatório');
            return false;
        }

        // Validação básica de CPF (só os dígitos)
        const cpfDigitos = cpf.replace(/\D/g, '');
        if (cpfDigitos.length !== 11) {
            alert('CPF deve ter 11 dígitos');
            return false;
        }

        if (!genero) {
            alert('Gênero é obrigatório');
            return false;
        }

        // Validar telefones preenchidos
        const telefoneValidos = telefones.filter(tel => tel.ddd.trim() && tel.numero.trim());
        if (telefoneValidos.length === 0) {
            alert('Pelo menos um telefone deve ser preenchido');
            return false;
        }

        // Validar RGs preenchidos
        const rgValidos = rgs.filter(rg => rg.numero.trim() && rg.dataEmissao.trim());
        if (rgValidos.length === 0) {
            alert('Pelo menos um RG deve ser preenchido');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        try {
            setSalvando(true);

            // Filtrar apenas telefones e RGs preenchidos
            const telefoneValidos = telefones.filter(tel => tel.ddd.trim() && tel.numero.trim());
            const rgValidos = rgs.filter(rg => rg.numero.trim() && rg.dataEmissao.trim());

            const clienteData = {
                nome: nome.trim(),
                nomeSocial: nomeSocial.trim() || nome.trim(),
                cpf: cpf.replace(/\D/g, ''), // Remover formatação do CPF
                genero,
                telefones: telefoneValidos,
                rgs: rgValidos
            };

            const resultado = await apiService.criarCliente(clienteData);

            if (resultado.error) {
                alert(`Erro ao cadastrar cliente: ${resultado.error}`);
            } else {
                alert('Cliente cadastrado com sucesso!');
                
                // Limpar formulário
                setNome('');
                setNomeSocial('');
                setCpf('');
                setGenero('');
                setTelefones([{ ddd: '', numero: '' }]);
                setRgs([{ numero: '', dataEmissao: '' }]);

                // Callback para atualizar lista
                if (onClienteCadastrado) {
                    onClienteCadastrado();
                }
            }

        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            alert('Erro ao cadastrar cliente. Verifique se o backend está rodando.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <h4 className="center-align">Cadastrar Novo Cliente</h4>
                    <p className="center-align grey-text">Dados serão salvos no banco SQLite</p>
                </div>
            </div>

            <div className="row">
                <div className="col s12">
                    <div className="card">
                        <div className="card-content">
                            <form onSubmit={handleSubmit}>
                                {/* Dados Pessoais */}
                                <div className="row">
                                    <div className="col s12">
                                        <h6><i className="material-icons left">person</i>Dados Pessoais</h6>
                                        <div className="divider" style={{ marginBottom: '20px' }}></div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="nome" 
                                            type="text" 
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="nome">Nome Completo *</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="nomeSocial" 
                                            type="text" 
                                            value={nomeSocial}
                                            onChange={(e) => setNomeSocial(e.target.value)}
                                        />
                                        <label htmlFor="nomeSocial">Nome Social</label>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="input-field col s12 m6">
                                        <input 
                                            id="cpf" 
                                            type="text" 
                                            value={cpf}
                                            onChange={(e) => handleCpfChange(e.target.value)}
                                            maxLength={14}
                                            required
                                        />
                                        <label htmlFor="cpf">CPF *</label>
                                    </div>
                                    <div className="input-field col s12 m6">
                                        <select 
                                            value={genero} 
                                            onChange={(e) => setGenero(e.target.value)}
                                            className="browser-default"
                                            required
                                        >
                                            <option value="" disabled>Selecione o gênero *</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="Feminino">Feminino</option>
                                            <option value="Outro">Outro</option>
                                            <option value="Prefiro não informar">Prefiro não informar</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Telefones */}
                                <div className="row">
                                    <div className="col s12">
                                        <h6><i className="material-icons left">phone</i>Telefones</h6>
                                        <div className="divider" style={{ marginBottom: '20px' }}></div>
                                    </div>
                                </div>

                                {telefones.map((telefone, index) => (
                                    <div key={index} className="row" style={{ marginBottom: '10px' }}>
                                        <div className="input-field col s12 m3">
                                            <input 
                                                type="text" 
                                                value={telefone.ddd}
                                                onChange={(e) => atualizarTelefone(index, 'ddd', e.target.value)}
                                                maxLength={2}
                                            />
                                            <label>DDD</label>
                                        </div>
                                        <div className="input-field col s12 m6">
                                            <input 
                                                type="text" 
                                                value={telefone.numero}
                                                onChange={(e) => atualizarTelefone(index, 'numero', e.target.value)}
                                            />
                                            <label>Número</label>
                                        </div>
                                        <div className="col s12 m3">
                                            {telefones.length > 1 && (
                                                <button 
                                                    type="button"
                                                    className="btn red lighten-2 waves-effect waves-light"
                                                    onClick={() => removerTelefone(index)}
                                                    style={{ marginTop: '20px' }}
                                                >
                                                    <i className="material-icons">delete</i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="row">
                                    <div className="col s12">
                                        <button 
                                            type="button"
                                            className="btn blue lighten-2 waves-effect waves-light"
                                            onClick={adicionarTelefone}
                                        >
                                            <i className="material-icons left">add</i>
                                            Adicionar Telefone
                                        </button>
                                    </div>
                                </div>

                                {/* RGs */}
                                <div className="row">
                                    <div className="col s12">
                                        <h6><i className="material-icons left">credit_card</i>RGs</h6>
                                        <div className="divider" style={{ marginBottom: '20px' }}></div>
                                    </div>
                                </div>

                                {rgs.map((rg, index) => (
                                    <div key={index} className="row" style={{ marginBottom: '10px' }}>
                                        <div className="input-field col s12 m4">
                                            <input 
                                                type="text" 
                                                value={rg.numero}
                                                onChange={(e) => atualizarRg(index, 'numero', e.target.value)}
                                            />
                                            <label>Número do RG</label>
                                        </div>
                                        <div className="input-field col s12 m4">
                                            <input 
                                                type="date" 
                                                value={rg.dataEmissao}
                                                onChange={(e) => atualizarRg(index, 'dataEmissao', e.target.value)}
                                            />
                                            <label>Data de Emissão</label>
                                        </div>
                                        <div className="col s12 m4">
                                            {rgs.length > 1 && (
                                                <button 
                                                    type="button"
                                                    className="btn red lighten-2 waves-effect waves-light"
                                                    onClick={() => removerRg(index)}
                                                    style={{ marginTop: '20px' }}
                                                >
                                                    <i className="material-icons">delete</i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <div className="row">
                                    <div className="col s12">
                                        <button 
                                            type="button"
                                            className="btn blue lighten-2 waves-effect waves-light"
                                            onClick={adicionarRg}
                                        >
                                            <i className="material-icons left">add</i>
                                            Adicionar RG
                                        </button>
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="row">
                                    <div className="col s12 center-align">
                                        <button 
                                            type="submit"
                                            className="btn-large purple lighten-2 waves-effect waves-light"
                                            disabled={salvando}
                                        >
                                            {salvando ? (
                                                <>
                                                    <i className="material-icons left">hourglass_empty</i>
                                                    Salvando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="material-icons left">save</i>
                                                    Cadastrar Cliente
                                                </>
                                            )}
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

export default FormularioCadastroClienteReal;
