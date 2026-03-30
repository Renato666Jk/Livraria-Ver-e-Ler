# PRD - Livraria Ver e Ler

## Visão Geral
Plataforma web de livraria híbrida com marketplace de autores independentes.

## User Personas
1. **Dono (Owner)**: Sandro Gonçalves - Autor principal e curador da plataforma
2. **Autor (Author)**: Escritores independentes que querem publicar seus livros
3. **Leitor (Reader)**: Compradores de livros

## Core Requirements (Static)
- [x] Home page com navegação completa
- [x] Área biográfica do dono com timeline interativa
- [x] Portfólio de obras do dono
- [x] Sistema de Marketplace para autores independentes
- [x] Dashboard do Autor para gestão de livros
- [x] Formulário de submissão de manuscritos
- [x] Sistema de avaliações e comentários
- [x] Carrinho de compras e checkout com PIX
- [x] Busca global por gênero, título ou autor
- [x] Design "Livraria Boutique" (azul marinho, dourado, papel envelhecido)

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI + MongoDB (Motor async)
- **Auth**: JWT com cookies httpOnly
- **Storage**: Emergent Object Storage (para uploads futuros)
- **Payment**: PIX (chave configurável)

## What's Been Implemented (March 30, 2026)
### Backend
- Autenticação JWT completa (register, login, logout, me)
- CRUD de livros com aprovação do dono
- Sistema de reviews e ratings
- Carrinho e checkout com PIX
- Submissão de manuscritos
- Sistema de mensagens
- Gestão de autores e aprovações
- Seed do owner (Sandro Gonçalves) e 3 livros iniciais

### Frontend
- Home page com hero section e livros do dono
- Página "A Minha História" com timeline
- "Meus Livros" - Portfólio do dono
- Marketplace com busca e filtros
- Detalhes do livro com reviews
- Login/Registro com seleção de role
- Carrinho e Checkout PIX
- Dashboard completo para owner/author
- Formulário "Publicar Meu Livro"
- Perfil de autor

## P0 Features (Implemented)
- ✅ Autenticação e autorização
- ✅ Listagem e detalhes de livros
- ✅ Carrinho e checkout
- ✅ Dashboard de gestão

## P1 Features (Backlog)
- Upload de capas e PDFs de amostra (requer EMERGENT_LLM_KEY)
- Chat interno entre autor e equipe
- Notificações por email
- Sistema de cupons de desconto

## P2 Features (Future)
- Integração com gateway de pagamento real
- Relatórios de vendas
- Programa de afiliados
- App mobile

## Configuration Needed
- PIX_KEY no backend/.env para receber pagamentos
- EMERGENT_LLM_KEY para uploads de arquivos

## Credentials
- Owner: sandro@vereler.com / owner123
