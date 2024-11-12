const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware para parser de body do formulário
app.use(bodyParser.urlencoded({ extended: true }));

// Armazenamento das concentrações recomendadas por produto e central
let concentracaoRecomendadaPorProdutoECentral = {
    'soda-plataforma': { concentracao: 1.5, validade: null },
    'soda-silo': { concentracao: 1.5, validade: null },
    'acido-plataforma': { concentracao: 1.2, validade: null },
    'acido-silo': { concentracao: 1.8, validade: null },
};

// Página inicial que renderiza a página de cálculo e o botão para definir nova concentração
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Calcular Dosagem</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                background-color: #f8f9fa;
            }
            .navbar {
                background-color: #007bff;
            }
            .navbar a {
                color: white;
            }
            .container {
                margin-top: 50px;
            }
            .alert {
                text-align: center;
            }

            /* Aumentando o tamanho do radio button */
            input[type="radio"] {
                transform: scale(1.5); /* Aumenta o tamanho do radio button */
                margin-right: 10px; /* Adiciona um pequeno espaço à direita */
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg">
            <a class="navbar-brand" href="#">Sistema de Padronização de Concentração</a>
        </nav>
        <div class="container">
            <h1 class="text-center">Cálculo de Dosagem</h1>
            <form action="/calcular" method="POST">
                <div class="form-group">
                    <label>Tipo de Produto:</label>
                    <div>
                        <label>
                            <input type="radio" name="tipoProduto" value="soda" required> Soda
                        </label>
                        <label>
                            <input type="radio" name="tipoProduto" value="acido" required> Ácido
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Central:</label>
                    <div>
                        <label>
                            <input type="radio" name="central" value="plataforma" required> Plataforma
                        </label>
                        <label>
                            <input type="radio" name="central" value="silo" required> Silo
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="concentracaoAtual">Concentração Atual (%):</label>
                    <input type="number" name="concentracaoAtual" id="concentracaoAtual" class="form-control" step="0.01" required>
                </div>

                <button type="submit" class="btn btn-primary">Calcular</button>
            </form>

            <!-- Resultado da dosagem (será mostrado abaixo quando houver cálculo) -->
            ${req.query.resultado ? 
                `<div class="alert alert-success mt-3 text-center">Quantidade a dosar: ${req.query.resultado} litros</div>` : ''
            }
            ${req.query.concentracao ? 
                `<div class="alert alert-info mt-3 text-center">Concentração recomendada: ${req.query.concentracao}% até ${req.query.validade}</div>` : ''
            }

            <a href="/definir-concentracao" class="btn btn-warning mt-4">Definir Nova Concentração</a>
        </div>
    </body>
    </html>
    `);
});

// Rota para definir a nova concentração com tempo específico
app.get('/definir-concentracao', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Definir Nova Concentração</title>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                background-color: #f8f9fa;
            }
            .navbar {
                background-color: #007bff;
            }
            .navbar a {
                color: white;
            }
            .container {
                margin-top: 50px;
            }

            /* Aumentando o tamanho do radio button */
            input[type="radio"] {
                transform: scale(1.5); /* Aumenta o tamanho do radio button */
                margin-right: 10px; /* Adiciona um pequeno espaço à direita */
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg">
            <a class="navbar-brand" href="#">Sistema de Padronização de Concentração</a>
        </nav>
        <div class="container">
            <h1 class="text-center">Definir Nova Concentração</h1>
            <form action="/definir-concentracao" method="POST">
                <div class="form-group">
                    <label>Tipo de Produto:</label>
                    <div>
                        <label>
                            <input type="radio" name="tipoProduto" value="soda" required> Soda
                        </label>
                        <label>
                            <input type="radio" name="tipoProduto" value="acido" required> Ácido
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label>Central:</label>
                    <div>
                        <label>
                            <input type="radio" name="central" value="plataforma" required> Plataforma
                        </label>
                        <label>
                            <input type="radio" name="central" value="silo" required> Silo
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label for="concentracaoRecomendada">Nova Concentração (%):</label>
                    <input type="number" name="concentracaoRecomendada" id="concentracaoRecomendada" class="form-control" step="0.01" required>
                </div>

                <div class="form-group">
                    <label for="validade">Data de Validade:</label>
                    <input type="date" name="validade" id="validade" class="form-control" required>
                </div>

                <button type="submit" class="btn btn-primary">Definir</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Rota para processar a definição da nova concentração
app.post('/definir-concentracao', (req, res) => {
    const novaConcentracao = parseFloat(req.body.concentracaoRecomendada);
    const tipoProduto = req.body.tipoProduto;
    const centralSelecionada = req.body.central;
    const validade = req.body.validade; // Captura a data de validade

    // Chave única para o produto e central selecionados
    const chaveProdutoECentral = `${tipoProduto}-${centralSelecionada}`;

    // Ajusta a concentração e a validade para o produto/central selecionado
    concentracaoRecomendadaPorProdutoECentral[chaveProdutoECentral] = {
        concentracao: novaConcentracao,
        validade: validade, // Salva a data de validade
    };

    // Redireciona para a página principal
    res.redirect('/');
});

// Página de cálculo da quantidade a ser dosada
app.post('/calcular', (req, res) => {
    const concentracaoAtual = parseFloat(req.body.concentracaoAtual);
    const tipoProduto = req.body.tipoProduto;
    const centralSelecionada = req.body.central;
    const volumeTanque = 2000; // Exemplo de volume do tanque

    // Chave única para o produto e central selecionados
    const chaveProdutoECentral = `${tipoProduto}-${centralSelecionada}`;

    // Recupera a concentração recomendada para o tipo de produto e central selecionados
    const concentracaoUtilizada = concentracaoRecomendadaPorProdutoECentral[chaveProdutoECentral]?.concentracao || 1.5;

    // Calcular a quantidade necessária de soluto
    const quantidadeNecessaria = (volumeTanque * (concentracaoUtilizada - concentracaoAtual)) / 100;

    // Redireciona para a página inicial com o resultado como parâmetro de query
    res.redirect(`/?resultado=${quantidadeNecessaria.toFixed(2)}&concentracao=${concentracaoUtilizada}&validade=${concentracaoRecomendadaPorProdutoECentral[chaveProdutoECentral]?.validade || 'Sem validade'}`);
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
