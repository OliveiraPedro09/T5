import React from "react";
import 'materialize-css/dist/css/materialize.min.css'

const Footer: React.FC = () => {
    return (
        <footer className="page-footer purple lighten-4 purple-text text-darken-3">
            <div className="container">
                <div className="row">
                    <div className="col l6 s12">
                        <h5>Sistema WB</h5>
                        <p className="grey-text text-darken-1">
                            Sistema de gerenciamento de clientes desenvolvido com React e MaterializeCSS.
                            Uma solução moderna e responsiva para sua empresa.
                        </p>
                    </div>
                    <div className="col l4 offset-l2 s12">
                        <h5>Links Úteis</h5>
                        <ul>
                            <li><a className="purple-text text-darken-1" href="#!">Documentação</a></li>
                            <li><a className="purple-text text-darken-1" href="#!">Suporte</a></li>
                            <li><a className="purple-text text-darken-1" href="#!">Sobre</a></li>
                            <li><a className="purple-text text-darken-1" href="#!">Contato</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="footer-copyright purple lighten-3">
                <div className="container purple-text text-darken-2">
                    © 2025 Sistema WB - Todos os direitos reservados
                    <a className="purple-text text-darken-2 right" href="#!">
                        <i className="material-icons left">favorite</i>
                        Feito com React
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
