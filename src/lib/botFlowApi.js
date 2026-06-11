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
    "name": "Carrinho Abandonado (Instagram)",
    "channel": "whatsapp_qr",
    "isActive": true,
    "nodeCount": 11,
    "nodes": [
      {
        "id": "1",
        "type": "message",
        "position": {
          "x": 100,
          "y": 150
        },
        "data": {
          "label": "Mensagem Direct Reels #1",
          "content": "Que show que você curtiu nosso Reels! 📸\n\nPreparamos um funil de conversão automático incrível. Digite seu principal segmento abaixo para podermos te dar a recomendação perfeita:",
          "buttons": [
            {
              "text": "Marketing de Afiliados"
            },
            {
              "text": "E-commerce / Drop"
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
          "label": "Qualificação Equipe #2",
          "questionText": "Sensacional! Qual é o tamanho atual da sua equipe de vendas e suporte?"
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
          "label": "Filtro Tamanho VIP #3",
          "conditions": [
            {
              "value": "Equipe > 5"
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
          "label": "Marcar como Enterprise #4",
          "actions": [
            {
              "type": "tag_add",
              "value": "Insta_VIP_Enterprise"
            },
            {
              "type": "tag_add",
              "value": "CRM_Sync_Urgente"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "5",
        "type": "action",
        "position": {
          "x": 1150,
          "y": 280
        },
        "data": {
          "label": "Marcar como Padrão #5",
          "actions": [
            {
              "type": "tag_add",
              "value": "Insta_Lead_Regular"
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
          "label": "Atraso Estratégico #6",
          "time": "1 hora"
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
          "label": "Oferta Especial Direct #7",
          "content": "Temos uma oferta exclusiva e personalizada para o tamanho da sua operação com a MassFlow! 🤖\n\nQue tal dar uma olhada e começar a disparar hoje mesmo?",
          "buttons": [
            {
              "text": "Ver Planos Promocionais"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "8",
        "type": "split",
        "position": {
          "x": 2200,
          "y": 150
        },
        "data": {
          "label": "Divisor Split Checkout #8",
          "splitPercent": 50,
          "labelA": "Checkout Direto",
          "labelB": "Mentoria Inclusa"
        },
        "draggable": true
      },
      {
        "id": "9",
        "type": "message",
        "position": {
          "x": 2550,
          "y": 50
        },
        "data": {
          "label": "Link Desconto Direto #9",
          "content": "Feche agora o plano básico com 50% de desconto imediato usando o link abaixo:",
          "buttons": [
            {
              "text": "Garantir Licença"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "10",
        "type": "message",
        "position": {
          "x": 2550,
          "y": 280
        },
        "data": {
          "label": "Link Bônus Mentoria #10",
          "content": "Feche o plano premium hoje e ganhe uma mentoria individual de configuração da API!",
          "buttons": [
            {
              "text": "Garantir Plano Premium"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "11",
        "type": "goto",
        "position": {
          "x": 2900,
          "y": 150
        },
        "data": {
          "label": "Voltar Início Funil #11",
          "targetNodeId": "1"
        },
        "draggable": true
      }
    ],
    "edges": [
      {
        "id": "e-in-1",
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
        "id": "e-in-2",
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
        "id": "e-in-3",
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
        "id": "e-in-4",
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
        "id": "e-in-5",
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
        "id": "e-in-6",
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
        "id": "e-in-7",
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
        "id": "e-in-8",
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
        "id": "e-in-9",
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
        "id": "e-in-10",
        "source": "8",
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
        "id": "e-in-11",
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
        "id": "e-in-12",
        "source": "10",
        "target": "11",
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
    "id": "mock3",
    "name": "FAQ Automático (TikTok)",
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
          "label": "TikTok Início #1Boas-vindas",
          "content": "Fala parceiro! Se liga nessa oportunidade única. 🚀\nIdentificamos que você tem interesse em escalar seus resultados com robôs de disparo e automação.\n\nQuer ter acesso imediato ao nosso Script VIP de Vendas Completo 100% grátis?",
          "buttons": [
            {
              "text": "Quero Acesso VIP"
            },
            {
              "text": "Quero Saber Mais"
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
          "label": "Nome Lead #2",
          "questionText": "Excelente escolha! Para personalizar seu atendimento, qual é o seu primeiro nome?"
        },
        "draggable": true
      },
      {
        "id": "3",
        "type": "question",
        "position": {
          "x": 800,
          "y": 150
        },
        "data": {
          "label": "Email Corporativo #3",
          "questionText": "Obrigado! E qual é o seu melhor e-mail profissional para enviarmos o material de suporte VIP?",
          "fields": [
            {
              "type": "email",
              "label": "E-mail profissional"
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
          "y": 150
        },
        "data": {
          "label": "Tag Origem TikTok #4",
          "actions": [
            {
              "type": "tag_add",
              "value": "TikTok_Lead_Frio"
            },
            {
              "type": "tag_add",
              "value": "Aguardando_Aprovacao"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "5",
        "type": "split",
        "position": {
          "x": 1500,
          "y": 150
        },
        "data": {
          "label": "Divisor Teste A/B #5",
          "splitPercent": 50,
          "labelA": "Copy Emocional (A)",
          "labelB": "Copy Técnica (B)"
        },
        "draggable": true
      },
      {
        "id": "6",
        "type": "message",
        "position": {
          "x": 1850,
          "y": 50
        },
        "data": {
          "label": "Oferta Emocional A #6",
          "content": "Parabéns! Você acaba de garantir 50% de desconto imediato. 🎉\n\nEssa é a sua chance de mudar de vida, automatizar sua operação inteira e finalmente ter a liberdade geográfica e de tempo que sempre sonhou!",
          "buttons": [
            {
              "text": "Garantir Vaga 50%"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "7",
        "type": "message",
        "position": {
          "x": 1850,
          "y": 280
        },
        "data": {
          "label": "Oferta Técnica B #7",
          "content": "Parabéns! Liberamos o Frete Grátis e um Super Bônus de Integração API VIP. ⚙️\n\nAcelere suas integrações em menos de 5 minutos com nossa documentação robusta, webhooks ilimitados e estabilidade garantida de 99.9% uptime!",
          "buttons": [
            {
              "text": "Garantir Bônus VIP"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "8",
        "type": "delay",
        "position": {
          "x": 2200,
          "y": 150
        },
        "data": {
          "label": "Atraso Inteligente #8",
          "time": "10 minutos"
        },
        "draggable": true
      },
      {
        "id": "9",
        "type": "condition",
        "position": {
          "x": 2550,
          "y": 150
        },
        "data": {
          "label": "Validador Nível Lead #9",
          "conditions": [
            {
              "value": "Nicho é marketing"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "10",
        "type": "email",
        "position": {
          "x": 2900,
          "y": 50
        },
        "data": {
          "label": "Script VIP Comercial #10",
          "subject": "✨ Aqui está seu Script VIP de Vendas PDF Completo!",
          "body": "Olá {{lead_name}},\n\nComo prometido no TikTok, aqui está o seu Script VIP completo para turbinar suas conversões nas primeiras 24 horas!\n\nUse com moderação."
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
          "label": "WhatsApp Redirecionamento #11",
          "content": "Notamos que seu nicho não é marketing direto. Quer falar com nosso gerente comercial para adaptarmos a ferramenta?",
          "buttons": [
            {
              "text": "Chamar Gerente"
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
          "label": "Loop Central #12",
          "targetNodeId": "1"
        },
        "draggable": true
      }
    ],
    "edges": [
      {
        "id": "e-tk-1",
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
        "id": "e-tk-2",
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
        "id": "e-tk-3",
        "source": "3",
        "target": "4",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-tk-4",
        "source": "4",
        "target": "5",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-tk-5",
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
        "id": "e-tk-6",
        "source": "5",
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
        "id": "e-tk-7",
        "source": "6",
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
        "id": "e-tk-8",
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
        "id": "e-tk-9",
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
        "id": "e-tk-10",
        "source": "9",
        "target": "10",
        "sourceHandle": "cond-source-0",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-tk-11",
        "source": "9",
        "target": "11",
        "sourceHandle": "cond-source-else",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      },
      {
        "id": "e-tk-12",
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
        "id": "e-tk-13",
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
    "id": "mock4",
    "name": "Prospecção B2B (LinkedIn)",
    "channel": "whatsapp_qr",
    "isActive": true,
    "nodeCount": 11,
    "nodes": [
      {
        "id": "1",
        "type": "message",
        "position": {
          "x": 100,
          "y": 150
        },
        "data": {
          "label": "Conexão Inicial LinkedIn #1",
          "content": "Olá! Agradeço por aceitar minha conexão no LinkedIn. 💼\n\nVi seu perfil e achei super alinhado com nossa solução corporativa de vendas corporativas. Gostaria de receber nossa apresentação?",
          "buttons": [
            {
              "text": "Ver Apresentação B2B"
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
          "label": "Cargo & Segmento #2",
          "questionText": "Excelente! Qual é o seu cargo atual e o segmento principal da sua empresa?"
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
          "label": "Filtro Decisor Cargo #3",
          "conditions": [
            {
              "value": "Cargo contém \"Diretor\""
            },
            {
              "value": "Cargo contém \"CEO\""
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
          "label": "Marcar Decisor VIP #4",
          "actions": [
            {
              "type": "tag_add",
              "value": "LinkedIn_Decisor_B2B"
            },
            {
              "type": "tag_add",
              "value": "Alta_Prioridade"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "5",
        "type": "action",
        "position": {
          "x": 1150,
          "y": 280
        },
        "data": {
          "label": "Marcar Lead Geral #5",
          "actions": [
            {
              "type": "tag_add",
              "value": "LinkedIn_Lead_Geral"
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
          "label": "Atraso Proposta #6",
          "time": "1 hora"
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
          "label": "Envio Apresentação PDF #7",
          "content": "Aqui está nossa proposta e apresentação completa em formato PDF para análise de custos!",
          "buttons": [
            {
              "text": "Baixar PDF Corporativo"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "8",
        "type": "split",
        "position": {
          "x": 2200,
          "y": 150
        },
        "data": {
          "label": "Split Teste Reunião A/B #8",
          "splitPercent": 50,
          "labelA": "Reunião Direta Zoom",
          "labelB": "WhatsApp Gerente"
        },
        "draggable": true
      },
      {
        "id": "9",
        "type": "message",
        "position": {
          "x": 2550,
          "y": 50
        },
        "data": {
          "label": "Convite Reunião Zoom #9",
          "content": "Que tal marcarmos uma demonstração rápida de 15 minutos pelo Zoom para avaliarmos sua demanda?",
          "buttons": [
            {
              "text": "Agendar pelo Calendly"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "10",
        "type": "message",
        "position": {
          "x": 2550,
          "y": 280
        },
        "data": {
          "label": "WhatsApp Gerente B2B #10",
          "content": "Prefere tirar dúvidas pelo WhatsApp corporativo rápido? Fale diretamente com nosso gerente abaixo:",
          "buttons": [
            {
              "text": "Chamar no WhatsApp B2B"
            }
          ]
        },
        "draggable": true
      },
      {
        "id": "11",
        "type": "goto",
        "position": {
          "x": 2900,
          "y": 150
        },
        "data": {
          "label": "Fim Funil LinkedIn #11",
          "targetNodeId": "1"
        },
        "draggable": true
      }
    ],
    "edges": [
      {
        "id": "e-li-1",
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
        "id": "e-li-2",
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
        "id": "e-li-3",
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
        "id": "e-li-4",
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
        "id": "e-li-5",
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
        "id": "e-li-6",
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
        "id": "e-li-7",
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
        "id": "e-li-8",
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
        "id": "e-li-9",
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
        "id": "e-li-10",
        "source": "8",
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
        "id": "e-li-11",
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
        "id": "e-li-12",
        "source": "10",
        "target": "11",
        "sourceHandle": "right-source",
        "targetHandle": "left-target",
        "animated": true,
        "style": {
          "stroke": "#a855f7",
          "strokeWidth": 2
        }
      }
    ]
  }
];

function isMockId(id) {
  return String(id).startsWith('mock');
}

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
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

async function parseResponse(res) {
  const text = await res.text();
  if (!res.ok) return { ok: false, data: null, text };
  if (!text.trim()) return { ok: true, data: null, text };
  return { ok: true, data: JSON.parse(text), text };
}

export async function fetchBotFlows() {
  try {
    const res = await fetch(`${API_BASE}/api/bot-flows`, { headers: authHeaders() });
    const { ok, data } = await parseResponse(res);
    if (ok && Array.isArray(data)) {
      return [...data, ...mockFlowsList];
    }
    return mockFlowsList;
  } catch (err) {
    console.warn('Backend server connection failed, falling back to mock flows.');
    return mockFlowsList;
  }
}

export async function fetchBotFlowById(id) {
  if (isMockId(id)) {
    const found = mockFlowsList.find(f => f.id === id);
    return found ? mapFlowDetail(found) : null;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok && data ? mapFlowDetail(data) : null;
}

export async function createBotFlow(payload) {
  const res = await fetch(`${API_BASE}/api/bot-flows`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const { ok, data } = await parseResponse(res);
  return ok && data ? mapFlowDetail(data) : null;
}

export async function saveBotFlow(id, payload) {
  if (isMockId(id)) {
    const found = mockFlowsList.find(f => f.id === id);
    if (found) {
      if (payload.nodes) found.nodes = payload.nodes;
      if (payload.edges) found.edges = payload.edges;
      if (payload.isActive !== undefined) found.isActive = payload.isActive;
      found.nodeCount = payload.nodes ? payload.nodes.length : found.nodeCount;
    }
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}/save`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function updateBotFlowMeta(id, payload) {
  if (isMockId(id)) {
    const found = mockFlowsList.find(f => f.id === id);
    if (found) {
      Object.assign(found, payload);
    }
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function deleteBotFlow(id) {
  if (isMockId(id)) {
    const index = mockFlowsList.findIndex(f => f.id === id);
    if (index !== -1) mockFlowsList.splice(index, 1);
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return res.ok;
}

export async function fetchTelegramConnectionStatus(flowId) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    return { connected: flow?.isActive || false, botUsername: flow?.isActive ? 'MockedTelegramBot' : null };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/status`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function connectTelegramBot(flowId, botToken) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    if (flow) flow.isActive = true;
    return { success: true, botUsername: 'MockedTelegramBot' };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/connect`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ botToken }),
  });
  const { ok, data, text } = await parseResponse(res);
  if (!ok) {
    try {
      const err = JSON.parse(text);
      return { success: false, message: err.message || 'Erro ao conectar' };
    } catch {
      return { success: false, message: 'Erro ao conectar' };
    }
  }
  return data || { success: true };
}

export async function disconnectTelegramBot(flowId) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    if (flow) flow.isActive = false;
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/disconnect`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return res.ok;
}

export async function fetchTelegramDiagnostics(flowId) {
  if (isMockId(flowId)) {
    return { baseUrlUsed: 'https://mock.massflow.com', expectedWebhookUrl: 'https://mock.massflow.com/webhook', issues: [] };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/diagnostics`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function reregisterTelegramWebhook(flowId) {
  if (isMockId(flowId)) {
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/telegram/reregister-webhook`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const { ok, data, text } = await parseResponse(res);
  if (!ok) {
    try {
      const err = JSON.parse(text);
      return { success: false, message: err.message };
    } catch {
      return { success: false, message: 'Erro ao re-registrar webhook' };
    }
  }
  return data || { success: true };
}

export async function fetchWhatsappConnectionStatus(flowId) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    const hasQrState = localStorage.getItem(`mock_qr_state_${flowId}`) === 'ready';
    return { 
      connected: flow?.isActive || false, 
      status: flow?.isActive ? 'connected' : (hasQrState ? 'qr_ready' : 'disconnected'),
      botPhoneNumber: flow?.isActive ? '5511999999999' : null,
      qrCode: hasQrState ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fff" stroke="%23A855F7" stroke-width="2"/><text x="50" y="45" font-family="sans-serif" font-weight="bold" font-size="6" text-anchor="middle" dominant-baseline="middle" fill="%23A855F7">WhatsApp QR Code</text><text x="50" y="55" font-family="sans-serif" font-size="4" text-anchor="middle" dominant-baseline="middle" fill="%236b7280">Escaneie para Conectar</text></svg>' : null
    };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/whatsapp/status`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const { ok, data } = await parseResponse(res);
  return ok ? data : null;
}

export async function connectWhatsappBot(flowId) {
  if (isMockId(flowId)) {
    localStorage.setItem(`mock_qr_state_${flowId}`, 'ready');
    setTimeout(() => {
      const flow = mockFlowsList.find(f => f.id === flowId);
      if (flow) {
        flow.isActive = true;
        localStorage.removeItem(`mock_qr_state_${flowId}`);
      }
    }, 4000);
    return { success: true };
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/whatsapp/connect`, {
    method: 'POST',
    headers: authHeaders(),
  });
  const { ok, data, text } = await parseResponse(res);
  if (!ok) {
    try {
      const err = JSON.parse(text);
      return { success: false, message: err.message || 'Erro ao conectar' };
    } catch {
      return { success: false, message: 'Erro ao conectar' };
    }
  }
  return data || { success: true };
}

export async function disconnectWhatsappBot(flowId) {
  if (isMockId(flowId)) {
    const flow = mockFlowsList.find(f => f.id === flowId);
    if (flow) flow.isActive = false;
    localStorage.removeItem(`mock_qr_state_${flowId}`);
    return true;
  }
  const res = await fetch(`${API_BASE}/api/bot-flows/${flowId}/whatsapp/disconnect`, {
    method: 'POST',
    headers: authHeaders(),
  });
  return res.ok;
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
