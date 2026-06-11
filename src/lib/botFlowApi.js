const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const mockFlowsList = [
  {
    "id": "mock1",
    "name": "Qualificação de Leads (WhatsApp)",
    "channel": "whatsapp_qr",
    "isActive": true,
    "nodeCount": 12,
    "nodes": [
      {
        "id": "1",
        "type": "message",
        "position": {
          "x": 100,
          "y": 150
        },
        "data": {
          "label": "Boas-vindas WhatsApp #1",
          "content": "Olá! Sou o consultor virtual da MassFlow. 🤖\nPronto para escalar sua operação e multiplicar seus disparos de mensagens em minutos?\n\nEscolha uma das opções abaixo para iniciarmos:",
          "buttons": [
            {
              "text": "Planos Corporativos B2B"
            },
            {
              "text": "Falar com Atendente"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "2",
        "type": "question",
        "position": {
          "x": 450,
          "y": 150
        },
        "data": {
          "label": "Capturar Dados Lead #2",
          "questionText": "Perfeito! Digite seu e-mail profissional para podermos validar sua conta:",
          "fields": [
            {
              "type": "email",
              "label": "E-mail Corporativo"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "3",
        "type": "condition",
        "position": {
          "x": 800,
          "y": 150
        },
        "data": {
          "label": "Filtro Domínio E-mail #3",
          "conditions": [
            {
              "value": "Email contém \"@\""
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "4",
        "type": "action",
        "position": {
          "x": 1150,
          "y": 50
        },
        "data": {
          "label": "Definir Lead Quente #4",
          "actions": [
            {
              "type": "tag_add",
              "value": "WhatsApp_Lead_Hot"
            },
            {
              "type": "tag_add",
              "value": "Valido"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "5",
        "type": "message",
        "position": {
          "x": 1150,
          "y": 280
        },
        "data": {
          "label": "Erro Validação E-mail #5",
          "content": "Ops! O e-mail digitado parece inválido. Certifique-se de digitar um e-mail válido com \"@\" e domínio correto.",
          "buttons": [
            {
              "text": "Tentar Novamente"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "6",
        "type": "delay",
        "position": {
          "x": 1500,
          "y": 150
        },
        "data": {
          "label": "Atraso Inteligente #6",
          "time": "5 minutos"
        },
        "draggable": true
      },
      {
        "id": "7",
        "type": "message",
        "position": {
          "x": 1850,
          "y": 150
        },
        "data": {
          "label": "Envio Catálogo Oficial #7",
          "content": "Show de bola! Dê uma olhada no nosso catálogo de planos e taxas de disparo da API:",
          "buttons": [
            {
              "text": "Ver Catálogo Completo"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "8",
        "type": "question",
        "position": {
          "x": 2200,
          "y": 150
        },
        "data": {
          "label": "Chave Pix Faturamento #8",
          "questionText": "Excelente. Qual é o seu número de telefone celular cadastrado no Pix para podermos liberar sua licença teste?"
        },
        "draggable": true
      },
      {
        "id": "9",
        "type": "split",
        "position": {
          "x": 2550,
          "y": 150
        },
        "data": {
          "label": "Split Notificação Urgência #9",
          "splitPercent": 50,
          "labelA": "Urgência 24h",
          "labelB": "Brinde VIP"
        },
        "draggable": true
      },
      {
        "id": "10",
        "type": "message",
        "position": {
          "x": 2900,
          "y": 50
        },
        "data": {
          "label": "Notificação Urgente A #10",
          "content": "Atenção! Seu acesso ao plano de testes expira nas próximas 24 horas. Garanta sua vaga imediata!",
          "buttons": [
            {
              "text": "Liberar Licença"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "11",
        "type": "message",
        "position": {
          "x": 2900,
          "y": 280
        },
        "data": {
          "label": "Oferta Mentoria Grátis B #11",
          "content": "Compre hoje sua assinatura anual e ganhe mentoria de infraestrutura grátis!",
          "buttons": [
            {
              "text": "Garantir Licença + Bônus"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "12",
        "type": "goto",
        "position": {
          "x": 3250,
          "y": 150
        },
        "data": {
          "label": "Falar Comercial #12",
          "targetNodeId": "1"
        },
        "draggable": true
      }
    ],
    "edges": [
      {
        "id": "e-wa-1",
        "source": "1",
        "target": "2",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-2",
        "source": "2",
        "target": "3",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-3",
        "source": "3",
        "target": "4",
        "sourceHandle": "cond-source-0",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-4",
        "source": "3",
        "target": "5",
        "sourceHandle": "cond-source-else",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-5",
        "source": "4",
        "target": "6",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-6",
        "source": "5",
        "target": "6",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-7",
        "source": "6",
        "target": "7",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-8",
        "source": "7",
        "target": "8",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-9",
        "source": "8",
        "target": "9",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-10",
        "source": "9",
        "target": "10",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-11",
        "source": "9",
        "target": "11",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-12",
        "source": "10",
        "target": "12",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-wa-13",
        "source": "11",
        "target": "12",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      }
    ]
  },
  {
    "id": "mock2",
    "name": "Suporte Técnico Automático (WhatsApp)",
    "channel": "whatsapp_qr",
    "isActive": true,
    "nodeCount": 11,
    "nodes": [
      {
        "id": "1",
        "type": "message",
        "position": { "x": 100, "y": 150 },
        "data": {
          "label": "Boas-vindas Suporte #1",
          "content": "Olá! Bem-vindo ao Canal de Suporte Técnico da MassFlow. 🛠️\nComo podemos te ajudar hoje? Escolha uma das opções abaixo para iniciarmos o atendimento:",
          "buttons": [
            { "text": "Problema com Disparo" },
            { "text": "Dúvida sobre Faturas" }
          ]
        },
        "draggable": true
      },
      {
        "id": "2",
        "type": "question",
        "position": { "x": 450, "y": 150 },
        "data": {
          "label": "Detalhamento do Problema #2",
          "questionText": "Para agilizarmos seu atendimento, descreva brevemente qual o erro apresentado:"
        },
        "draggable": true
      },
      {
        "id": "3",
        "type": "condition",
        "position": { "x": 800, "y": 150 },
        "data": {
          "label": "Filtro Urgência #3",
          "conditions": [
            { "value": "conexão" }
          ]
        },
        "draggable": true
      },
      {
        "id": "4",
        "type": "action",
        "position": { "x": 1150, "y": 50 },
        "data": {
          "label": "Marcar Suporte Urgente #4",
          "actions": [
            { "type": "tag_add", "value": "Suporte_Urgente" },
            { "type": "tag_add", "value": "CRM_Sync_Urgente" }
          ]
        },
        "draggable": true
      },
      {
        "id": "5",
        "type": "action",
        "position": { "x": 1150, "y": 280 },
        "data": {
          "label": "Marcar Suporte Padrão #5",
          "actions": [
            { "type": "tag_add", "value": "Suporte_Regular" }
          ]
        },
        "draggable": true
      },
      {
        "id": "6",
        "type": "delay",
        "position": { "x": 1500, "y": 150 },
        "data": {
          "label": "Atraso Suporte #6",
          "time": "5 minutos"
        },
        "draggable": true
      },
      {
        "id": "7",
        "type": "message",
        "position": { "x": 1850, "y": 150 },
        "data": {
          "label": "Mensagem Resposta Suporte #7",
          "content": "Entendido! Nossa equipe técnica já foi notificada. Enquanto analisamos o seu caso, consulte nosso Guia Rápido de Solução no botão abaixo:",
          "buttons": [
            { "text": "Ver Guia de Solução" }
          ]
        },
        "draggable": true
      },
      {
        "id": "8",
        "type": "split",
        "position": { "x": 2200, "y": 150 },
        "data": {
          "label": "Split Roteamento #8",
          "splitPercent": 50,
          "labelA": "Agente A",
          "labelB": "Agente B"
        },
        "draggable": true
      },
      {
        "id": "9",
        "type": "message",
        "position": { "x": 2550, "y": 50 },
        "data": {
          "label": "Roteamento Agente A #9",
          "content": "Você foi direcionado para a fila de atendimento do Agente A. Por favor, aguarde um momento.",
          "buttons": [
            { "text": "Falar com Agente A" }
          ]
        },
        "draggable": true
      },
      {
        "id": "10",
        "type": "message",
        "position": { "x": 2550, "y": 280 },
        "data": {
          "label": "Roteamento Agente B #10",
          "content": "Você foi direcionado para a fila de atendimento do Agente B. Por favor, aguarde um momento.",
          "buttons": [
            { "text": "Falar com Agente B" }
          ]
        },
        "draggable": true
      },
      {
        "id": "11",
        "type": "goto",
        "position": { "x": 2900, "y": 150 },
        "data": {
          "label": "Fim Atendimento #11",
          "targetNodeId": "1"
        },
        "draggable": true
      }
    ],
    "edges": [
      { "id": "e-su-1", "source": "1", "target": "2", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-2", "source": "2", "target": "3", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-3", "source": "3", "target": "4", "sourceHandle": "cond-source-0", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-4", "source": "3", "target": "5", "sourceHandle": "cond-source-else", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-5", "source": "4", "target": "6", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-6", "source": "5", "target": "6", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-7", "source": "6", "target": "7", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-8", "source": "7", "target": "8", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-9", "source": "8", "target": "9", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-10", "source": "8", "target": "10", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-11", "source": "9", "target": "11", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-su-12", "source": "10", "target": "11", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } }
    ]
  },
  {
    "id": "mock3",
    "name": "Lançamento VIP & Turmas (WhatsApp)",
    "channel": "whatsapp_qr",
    "isActive": true,
    "nodeCount": 12,
    "nodes": [
      {
        "id": "1",
        "type": "message",
        "position": { "x": 100, "y": 150 },
        "data": {
          "label": "Boas-vindas Lançamento #1",
          "content": "Olá! Obrigado por demonstrar interesse no Lançamento da Nova Turma VIP MassFlow! 🚀\n\nQuer garantir sua vaga com desconto exclusivo na pré-venda e receber materiais VIP?",
          "buttons": [
            { "text": "Quero Acesso VIP" },
            { "text": "Quero Saber Mais" }
          ]
        },
        "draggable": true
      },
      {
        "id": "2",
        "type": "question",
        "position": { "x": 450, "y": 150 },
        "data": {
          "label": "Nome Lead #2",
          "questionText": "Excelente escolha! Para personalizar seu atendimento, qual é o seu nome?"
        },
        "draggable": true
      },
      {
        "id": "3",
        "type": "question",
        "position": { "x": 800, "y": 150 },
        "data": {
          "label": "Email Lançamento #3",
          "questionText": "Qual é o seu melhor e-mail para enviarmos os links das aulas ao vivo?",
          "fields": [
            { "type": "email", "label": "E-mail" }
          ]
        },
        "draggable": true
      },
      {
        "id": "4",
        "type": "action",
        "position": { "x": 1150, "y": 150 },
        "data": {
          "label": "Tag Origem WhatsApp #4",
          "actions": [
            { "type": "tag_add", "value": "WhatsApp_Lançamento_VIP" },
            { "type": "tag_add", "value": "Aguardando_Aprovacao" }
          ]
        },
        "draggable": true
      },
      {
        "id": "5",
        "type": "split",
        "position": { "x": 1500, "y": 150 },
        "data": {
          "label": "Divisor Lançamento A/B #5",
          "splitPercent": 50,
          "labelA": "Oferta Antecipada",
          "labelB": "Bônus Exclusivo"
        },
        "draggable": true
      },
      {
        "id": "6",
        "type": "message",
        "position": { "x": 1850, "y": 50 },
        "data": {
          "label": "Oferta Antecipada #6",
          "content": "Parabéns! Liberamos a pré-venda com 50% de desconto imediato. 🎉\n\nEssa é a sua única chance de se inscrever antes de todo mundo!",
          "buttons": [
            { "text": "Garantir Vaga 50%" }
          ]
        },
        "draggable": true
      },
      {
        "id": "7",
        "type": "message",
        "position": { "x": 1850, "y": 280 },
        "data": {
          "label": "Bônus Exclusivo #7",
          "content": "Parabéns! Garanta sua vaga com o Super Bônus de Mentoria de Configuração MassFlow! ⚙️\n\nAprenda a estruturar seu funil em minutos.",
          "buttons": [
            { "text": "Garantir Bônus VIP" }
          ]
        },
        "draggable": true
      },
      {
        "id": "8",
        "type": "delay",
        "position": { "x": 2200, "y": 150 },
        "data": {
          "label": "Atraso Lançamento #8",
          "time": "10 minutos"
        },
        "draggable": true
      },
      {
        "id": "9",
        "type": "condition",
        "position": { "x": 2550, "y": 150 },
        "data": {
          "label": "Validador Inscrição #9",
          "conditions": [
            { "value": "marketing" }
          ]
        },
        "draggable": true
      },
      {
        "id": "10",
        "type": "email",
        "position": { "x": 2900, "y": 50 },
        "data": {
          "label": "E-mail Confirmação #10",
          "subject": "✨ Confirmação de inscrição no Lançamento VIP!",
          "body": "Olá {{lead_name}},\n\nSua vaga na pré-venda está garantida! Em breve enviaremos os detalhes de acesso às aulas."
        },
        "draggable": true
      },
      {
        "id": "11",
        "type": "message",
        "position": { "x": 2900, "y": 280 },
        "data": {
          "label": "WhatsApp Suporte Lançamento #11",
          "content": "Ficou com alguma dúvida sobre as aulas ou sobre o plano VIP? Chame nosso suporte rápido:",
          "buttons": [
            { "text": "Chamar Suporte" }
          ]
        },
        "draggable": true
      },
      {
        "id": "12",
        "type": "goto",
        "position": { "x": 3250, "y": 150 },
        "data": {
          "label": "Fim Lançamento #12",
          "targetNodeId": "1"
        },
        "draggable": true
      }
    ],
    "edges": [
      { "id": "e-la-1", "source": "1", "target": "2", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-2", "source": "2", "target": "3", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-3", "source": "3", "target": "4", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-4", "source": "4", "target": "5", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-5", "source": "5", "target": "6", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-6", "source": "5", "target": "7", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-7", "source": "6", "target": "8", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-8", "source": "7", "target": "8", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-9", "source": "8", "target": "9", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-10", "source": "9", "target": "10", "sourceHandle": "cond-source-0", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-11", "source": "9", "target": "11", "sourceHandle": "cond-source-else", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-12", "source": "10", "target": "12", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-la-13", "source": "11", "target": "12", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } }
    ]
  },
  {
    "id": "mock4",
    "name": "Recuperação de Vendas & Pix (WhatsApp)",
    "channel": "whatsapp_qr",
    "isActive": true,
    "nodeCount": 11,
    "nodes": [
      {
        "id": "1",
        "type": "message",
        "position": { "x": 100, "y": 150 },
        "data": {
          "label": "Gatilho Abandono Pix #1",
          "content": "Olá! Identificamos que você gerou um Pix para a assinatura MassFlow, mas o pagamento ainda não foi processado. 🔔\n\nPrecisa de alguma ajuda para concluir ou tem alguma dúvida?",
          "buttons": [
            { "text": "Concluir Pagamento" },
            { "text": "Dúvida sobre Pix" }
          ]
        },
        "draggable": true
      },
      {
        "id": "2",
        "type": "question",
        "position": { "x": 450, "y": 150 },
        "data": {
          "label": "Motivo do Abandono #2",
          "questionText": "Sem problemas! Qual foi a principal dificuldade com o pagamento?"
        },
        "draggable": true
      },
      {
        "id": "3",
        "type": "condition",
        "position": { "x": 800, "y": 150 },
        "data": {
          "label": "Filtro Motivo Pix #3",
          "conditions": [
            { "value": "desconto" }
          ]
        },
        "draggable": true
      },
      {
        "id": "4",
        "type": "action",
        "position": { "x": 1150, "y": 50 },
        "data": {
          "label": "Aplicar Cupom Pix #4",
          "actions": [
            { "type": "tag_add", "value": "Cupom_Pix_Aplicado" },
            { "type": "tag_add", "value": "Alta_Prioridade" }
          ]
        },
        "draggable": true
      },
      {
        "id": "5",
        "type": "action",
        "position": { "x": 1150, "y": 280 },
        "data": {
          "label": "Apenas Lembrar Pix #5",
          "actions": [
            { "type": "tag_add", "value": "Lembrado_Pix" }
          ]
        },
        "draggable": true
      },
      {
        "id": "6",
        "type": "delay",
        "position": { "x": 1500, "y": 150 },
        "data": {
          "label": "Atraso Recuperação #6",
          "time": "30 minutos"
        },
        "draggable": true
      },
      {
        "id": "7",
        "type": "message",
        "position": { "x": 1850, "y": 150 },
        "data": {
          "label": "Mensagem Cupom Pix #7",
          "content": "Conseguimos um cupom de 10% de desconto adicional para você fechar a assinatura agora! Aproveite:",
          "buttons": [
            { "text": "Pagar com 10% Desconto" }
          ]
        },
        "draggable": true
      },
      {
        "id": "8",
        "type": "split",
        "position": { "x": 2200, "y": 150 },
        "data": {
          "label": "Split Recuperação #8",
          "splitPercent": 50,
          "labelA": "Checkout Direto",
          "labelB": "Chamar Suporte"
        },
        "draggable": true
      },
      {
        "id": "9",
        "type": "message",
        "position": { "x": 2550, "y": 50 },
        "data": {
          "label": "Checkout Direto Pix #9",
          "content": "Use o link rápido abaixo para realizar o pagamento do Pix simplificado:",
          "buttons": [
            { "text": "Pagar Pix" }
          ]
        },
        "draggable": true
      },
      {
        "id": "10",
        "type": "message",
        "position": { "x": 2550, "y": 280 },
        "data": {
          "label": "Suporte Humano Pix #10",
          "content": "Prefere tirar dúvidas com nosso time financeiro? Fale diretamente no botão abaixo:",
          "buttons": [
            { "text": "Chamar Financeiro" }
          ]
        },
        "draggable": true
      },
      {
        "id": "11",
        "type": "goto",
        "position": { "x": 2900, "y": 150 },
        "data": {
          "label": "Fim Recuperação #11",
          "targetNodeId": "1"
        },
        "draggable": true
      }
    ],
    "edges": [
      { "id": "e-rec-1", "source": "1", "target": "2", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-2", "source": "2", "target": "3", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-3", "source": "3", "target": "4", "sourceHandle": "cond-source-0", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-4", "source": "3", "target": "5", "sourceHandle": "cond-source-else", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-5", "source": "4", "target": "6", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-6", "source": "5", "target": "6", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-7", "source": "6", "target": "7", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-8", "source": "7", "target": "8", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-9", "source": "8", "target": "9", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-10", "source": "8", "target": "10", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-11", "source": "9", "target": "11", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } },
      { "id": "e-rec-12", "source": "10", "target": "11", "sourceHandle": "right-source", "targetHandle": "left-target", "animated": true, "style": { "stroke": "#a855f7", "strokeWidth": 2 } }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'massflow_local_bot_flows';

function getLocalFlows() {
  // Force reset once to switch from TikTok/Instagram/LinkedIn templates to WhatsApp-only templates
  if (!localStorage.getItem('massflow_local_bot_flows_v3')) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockFlowsList));
    localStorage.setItem('massflow_local_bot_flows_v3', 'true');
  }

  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockFlowsList));
    return mockFlowsList;
  }
  try {
    return JSON.parse(data);
  } catch {
    return mockFlowsList;
  }
}

function saveLocalFlows(flows) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(flows));
}

function parseJsonField(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}

function mapFlowDetail(raw) {
  return {
    id: raw.id,
    name: String(raw.name ?? 'Fluxo'),
    channel: raw.channel,
    nodes: parseJsonField(raw.nodes, []),
    edges: parseJsonField(raw.edges, []),
    isActive: raw.isActive === true || raw.isActive === 1,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export async function fetchBotFlows() {
  return getLocalFlows().map(mapFlowDetail);
}

export async function fetchBotFlowById(id) {
  const found = getLocalFlows().find(f => String(f.id) === String(id));
  return found ? mapFlowDetail(found) : null;
}

export async function createBotFlow(payload) {
  const flows = getLocalFlows();
  const newId = 'mock' + (flows.length + 1) + '_' + Math.random().toString(36).substring(2, 9);
  const newFlow = {
    id: newId,
    name: payload.name || 'Novo Fluxo',
    channel: payload.channel || 'whatsapp_qr',
    isActive: false,
    nodes: payload.nodes || [],
    edges: payload.edges || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  flows.push(newFlow);
  saveLocalFlows(flows);
  return mapFlowDetail(newFlow);
}

export async function saveBotFlow(id, payload) {
  const flows = getLocalFlows();
  const found = flows.find(f => String(f.id) === String(id));
  if (found) {
    if (payload.nodes) found.nodes = payload.nodes;
    if (payload.edges) found.edges = payload.edges;
    if (payload.isActive !== undefined) found.isActive = payload.isActive;
    found.nodeCount = payload.nodes ? payload.nodes.length : 0;
    found.updatedAt = new Date().toISOString();
    saveLocalFlows(flows);
    return true;
  }
  return false;
}

export async function updateBotFlowMeta(id, payload) {
  const flows = getLocalFlows();
  const found = flows.find(f => String(f.id) === String(id));
  if (found) {
    Object.assign(found, payload);
    found.updatedAt = new Date().toISOString();
    saveLocalFlows(flows);
    return true;
  }
  return false;
}

export async function deleteBotFlow(id) {
  const flows = getLocalFlows();
  const index = flows.findIndex(f => String(f.id) === String(id));
  if (index !== -1) {
    flows.splice(index, 1);
    saveLocalFlows(flows);
    return true;
  }
  return false;
}

export async function fetchTelegramConnectionStatus(flowId) {
  const flows = getLocalFlows();
  const flow = flows.find(f => String(f.id) === String(flowId));
  return { connected: flow?.isActive || false, botUsername: flow?.isActive ? 'MockedTelegramBot' : null };
}

export async function connectTelegramBot(flowId, botToken) {
  const flows = getLocalFlows();
  const flow = flows.find(f => String(f.id) === String(flowId));
  if (flow) {
    flow.isActive = true;
    saveLocalFlows(flows);
  }
  return { success: true, botUsername: 'MockedTelegramBot' };
}

export async function disconnectTelegramBot(flowId) {
  const flows = getLocalFlows();
  const flow = flows.find(f => String(f.id) === String(flowId));
  if (flow) {
    flow.isActive = false;
    saveLocalFlows(flows);
  }
  return true;
}

export async function fetchTelegramDiagnostics(flowId) {
  return { baseUrlUsed: 'https://mock.massflow.com', expectedWebhookUrl: 'https://mock.massflow.com/webhook', issues: [] };
}

export async function reregisterTelegramWebhook(flowId) {
  return { success: true };
}

export async function fetchWhatsappConnectionStatus(flowId) {
  const flows = getLocalFlows();
  const flow = flows.find(f => String(f.id) === String(flowId));
  const hasQrState = localStorage.getItem(`mock_qr_state_${flowId}`) === 'ready';
  return { 
    connected: flow?.isActive || false, 
    status: flow?.isActive ? 'connected' : (hasQrState ? 'qr_ready' : 'disconnected'),
    botPhoneNumber: flow?.isActive ? '5511999999999' : null,
    qrCode: hasQrState ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fff" stroke="%23A855F7" stroke-width="2"/><text x="50" y="45" font-family="sans-serif" font-weight="bold" font-size="6" text-anchor="middle" dominant-baseline="middle" fill="%23A855F7">WhatsApp QR Code</text><text x="50" y="55" font-family="sans-serif" font-size="4" text-anchor="middle" dominant-baseline="middle" fill="%236b7280">Escaneie para Conectar</text></svg>' : null
  };
}

export async function connectWhatsappBot(flowId) {
  localStorage.setItem(`mock_qr_state_${flowId}`, 'ready');
  setTimeout(() => {
    const flows = getLocalFlows();
    const flow = flows.find(f => String(f.id) === String(flowId));
    if (flow) {
      flow.isActive = true;
      saveLocalFlows(flows);
      localStorage.removeItem(`mock_qr_state_${flowId}`);
    }
  }, 4000);
  return { success: true };
}

export async function disconnectWhatsappBot(flowId) {
  const flows = getLocalFlows();
  const flow = flows.find(f => String(f.id) === String(flowId));
  if (flow) {
    flow.isActive = false;
    saveLocalFlows(flows);
  }
  localStorage.removeItem(`mock_qr_state_${flowId}`);
  return true;
}

export const BOT_CHANNELS = [
  {
    id: 'whatsapp_qr',
    label: 'WhatsApp — QR dinâmico',
    description: 'Conecte escaneando o QR Code no celular (WhatsApp Web).',
  },
  {
    id: 'whatsapp_api',
    label: 'WhatsApp — API oficial',
    description: 'Integração via Meta Business / Cloud API (em breve).',
    disabled: true,
  },
];

export const BOT_CHANNEL_LABELS = {
  whatsapp_qr: 'WhatsApp QR',
  whatsapp_api: 'WhatsApp API',
};

export function getBotChannelLabel(channel) {
  return BOT_CHANNEL_LABELS[channel] || channel;
}
