export interface ClienteData {
    id?: number;
    nome: string;
    nomeSocial?: string;
    genero: string;
    cpf: string;
    dataCadastro?: string;
}

export interface RGData {
    id?: number;
    numero: string;
    dataEmissao: string;
    cliente_id: number;
}

export interface TelefoneData {
    id?: number;
    ddd: string;
    numero: string;
    cliente_id: number;
}

export interface ProdutoData {
    id?: number;
    nome: string;
    preco: number;
}

export interface ServicoData {
    id?: number;
    nome: string;
    preco: number;
}

export interface ConsumoData {
    id?: number;
    cliente_id: number;
    produto_id?: number;
    servico_id?: number;
    data_consumo?: string;
}

export interface ClienteCompleto extends ClienteData {
    rgs?: RGData[];
    telefones?: TelefoneData[];
    produtosConsumidos?: ProdutoData[];
    servicosConsumidos?: ServicoData[];
}
