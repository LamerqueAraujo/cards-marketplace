# Card Marketplace --- Frontend

Aplicação frontend desenvolvida para gerenciamento e negociação de
cartas através de um sistema de trocas (trades).\
O projeto foi construído utilizando **Vue 3, TypeScript, Quasar
Framework e Pinia**, seguindo uma arquitetura modular e orientada a
componentes.

------------------------------------------------------------------------

## Objetivo

Permitir que usuários:

-   Cadastrem uma conta
-   Gerenciem suas cartas
-   Criem trocas (trades)
-   Explore trocas abertas no marketplace
-   Negociem cartas com outros usuários

------------------------------------------------------------------------

# Tecnologias

-   Vue 3 (Composition API)
-   TypeScript
-   Quasar Framework
-   Pinia (State Management)
-   Axios (HTTP Client)
-   SCSS
-   Vite

------------------------------------------------------------------------

# Arquitetura

O projeto segue uma arquitetura **modular**, separando responsabilidades
por domínio.

src/ modules/ auth/ cards/ trades/ home/

shared/ ui/ layout/ feedback/ dialogs/ notification/

boot/ axios

Cada módulo possui:

-   components
-   composables
-   services
-   types
-   mappers

------------------------------------------------------------------------

# Principais Funcionalidades

## Autenticação

-   Login
-   Registro de usuário
-   Persistência de sessão
-   Tratamento de erros da API
-   Feedback visual com sistema de Toast

## Marketplace (Home)

Página inicial que exibe:

-   últimas trocas criadas
-   ações rápidas para usuários autenticados
-   abertura de detalhes da troca em modal

## Sistema de Trades

Usuários podem:

-   criar trocas
-   cancelar trocas
-   visualizar detalhes
-   filtrar "Minhas trocas ativas"

## Sistema de Toast

Notificações globais com:

-   variantes (success, error, info, warning)
-   swipe para fechar
-   barra de progresso
-   fechamento com ESC
-   acessibilidade com ARIA

## Cache de Trades

Foi implementado um sistema de cache no composable `useTrades`:

-   evita requisições duplicadas
-   reutiliza dados já carregados
-   controle de concorrência com `requestId`
-   paginação incremental com `loadMore`

Isso melhora performance e reduz chamadas à API.

------------------------------------------------------------------------

# Estrutura de Componentes

## UI Base

Componentes reutilizáveis:

-   AppButton
-   AppCard
-   AppInput
-   AppSeparator

## Feedback

-   LoadingState
-   ErrorState
-   EmptyState

## Dialogs

-   ConfirmDialog
-   TradeCreateDialog
-   TradeDetailsDialog

## Notification

-   ToastHost
-   ToastStore
-   useToast()

------------------------------------------------------------------------

# Fluxo de Navegação

Home → lista de trocas\
Clique na troca → abre modal de detalhes

Trades → marketplace completo\
Filtro → Minhas trocas ativas

------------------------------------------------------------------------

# Performance

O projeto possui otimizações como:

-   cache de dados
-   controle de requisições concorrentes
-   paginação incremental
-   reutilização de componentes

------------------------------------------------------------------------

## Variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`.

Exemplo:

VITE_API_URL=https://cards-marketplace-api.onrender.com

------------------------------------------------------------------------

# Executar o projeto

Instalar dependências

npm install

Executar em modo desenvolvimento

npm run dev

Build para produção

npm run build

------------------------------------------------------------------------

# Autor
Lamerque Araujo

Projeto desenvolvido como desafio técnico para demonstrar:

-   organização de código
-   arquitetura frontend
-   experiência do usuário
-   boas práticas com Vue 3