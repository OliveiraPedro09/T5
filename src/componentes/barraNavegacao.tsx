import React, { useEffect } from "react";
import 'materialize-css/dist/css/materialize.min.css'
import '../styles/navbar-simple.css'
import M from 'materialize-css'

type props = {
    tema: string,
    botoes: string[],
    seletorView: Function,
    telaAtiva?: string
}

const BarraNavegacao: React.FC<props> = ({ tema, botoes, seletorView, telaAtiva }) => {
    useEffect(() => {
        const initializeMaterialize = () => {
            let elems = document.querySelectorAll('.sidenav');
            M.Sidenav.init(elems);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeMaterialize);
        } else {
            initializeMaterialize();
        }

        return () => {
            document.removeEventListener('DOMContentLoaded', initializeMaterialize);
        };
    }, []);

    const getIconeMenu = (item: string) => {
        switch(item) {
            case 'Dashboard':
            case 'Dashboard Real':
                return <i className="material-icons">dashboard</i>;
            case 'Clientes':
            case 'Clientes Real':
                return <i className="material-icons">people</i>;
            case 'Cadastrar Cliente':
            case 'Cadastro Real':
                return <i className="material-icons">person_add</i>;
            case 'Produtos':
                return <i className="material-icons">inventory</i>;
            case 'Cadastrar Produto':
                return <i className="material-icons">add_box</i>;
            case 'Serviços':
                return <i className="material-icons">build</i>;
            case 'Cadastrar Serviço':
                return <i className="material-icons">add_box</i>;
            case 'Relatórios':
            case 'Relatórios Real':
                return <i className="material-icons">assessment</i>;
            case 'Configurações':
                return <i className="material-icons">settings</i>;
            case 'Teste Backend':
                return <i className="material-icons">storage</i>;
            case 'Demo Integração':
                return <i className="material-icons">integration_instructions</i>;
            default:
                return <i className="material-icons">navigate_next</i>;
        }
    };

    const gerarListaBotoes = () => {
        if (botoes.length <= 0) {
            return <></>
        } else {
            let lista = botoes.map(valor =>
                <li key={valor}>
                    <button 
                        type="button"
                        className={`navbar-nav-button ${telaAtiva === valor ? 'active' : ''}`}
                        onClick={(e) => seletorView(valor, e)}
                    >
                        {getIconeMenu(valor)}
                        <span>{valor}</span>
                    </button>
                </li>
            )
            return lista
        }
    };
    
    return (
        <>
            <nav className="enhanced-navbar">
                <div className="nav-wrapper">
                    <div className="navbar-content">
                        <a href="#!" className="navbar-brand">
                            <i className="material-icons">business</i>
                            <span>WB Sistema</span>
                        </a>
                        
                        <ul className="navbar-nav hide-on-med-and-down">
                            {gerarListaBotoes()}
                        </ul>
                    </div>
                    
                    <a href="#!" data-target="mobile-menu" className="sidenav-trigger mobile-menu-trigger">
                        <i className="material-icons">menu</i>
                    </a>
                </div>
            </nav>
            
            {/* Menu lateral mobile */}
            <ul className="sidenav enhanced-sidenav" id="mobile-menu">
                <li>
                    <div className="user-view">
                        <div className="background"></div>
                        <a href="#!"><i className="material-icons circle white-text">account_circle</i></a>
                        <a href="#!"><span className="white-text name">Usuário Sistema</span></a>
                        <a href="#!"><span className="white-text email">usuario@wb.com</span></a>
                    </div>
                </li>
                {gerarListaBotoes()}
                <li><div className="divider"></div></li>
                <li><a className="waves-effect" href="#!"><i className="material-icons left">exit_to_app</i>Sair</a></li>
            </ul>
        </>
    );
};

export default BarraNavegacao;