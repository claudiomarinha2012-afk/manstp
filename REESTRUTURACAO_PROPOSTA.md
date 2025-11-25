# Proposta de Reestruturação do Código

## Visão Geral
Este documento apresenta uma proposta de reestruturação para o projeto atual, que é uma aplicação React com TypeScript, usando Supabase como backend, Tailwind CSS para estilização e componentes Shadcn/UI.

## Estrutura Atual
- `/src`
  - `/assets` - Arquivos estáticos
  - `/components` - Componentes reutilizáveis
  - `/contexts` - Contextos do React
  - `/hooks` - Hooks personalizados
  - `/i18n` - Configurações de internacionalização
  - `/integrations` - Integrações externas (Supabase)
  - `/lib` - Funções utilitárias
  - `/pages` - Páginas da aplicação
  - `App.tsx` - Componente principal com rotas
  - `main.tsx` - Ponto de entrada da aplicação

## Problemas Identificados
1. **Falta de organização por domínios**: As páginas estão em uma única pasta sem agrupamento lógico
2. **Rotas extensas no App.tsx**: O componente App.tsx está muito grande com todas as rotas definidas nele
3. **Falta de separação clara de responsabilidades**: Componentes, páginas e lógica de negócios não estão bem organizados
4. **Falta de padrões consistentes**: Diferentes partes do código podem seguir padrões diferentes

## Proposta de Nova Estrutura
- `/src`
  - `/app` - Configuração principal da aplicação (rotas, provedores, layout principal)
    - `App.tsx` - Apenas configuração de provedores e roteamento principal
    - `providers.tsx` - Componente que agrupa todos os provedores
    - `routes.tsx` - Definição de rotas separada
  - `/domains` - Domínios de funcionalidades
    - `/auth` - Tudo relacionado à autenticação
      - `/components`
      - `/hooks`
      - `/types`
      - `/services`
      - `AuthPage.tsx`
    - `/dashboard` - Dashboard e componentes relacionados
      - `/components`
      - `/hooks`
      - `/types`
      - `DashboardPage.tsx`
    - `/cursos` - Gerenciamento de cursos
      - `/components`
      - `/hooks`
      - `/types`
      - `CursoListPage.tsx`
      - `CursoDetailPage.tsx`
    - `/turmas` - Gerenciamento de turmas
      - `/components`
      - `/hooks`
      - `/types`
      - `TurmaListPage.tsx`
      - `TurmaDetailPage.tsx`
    - `/alunos` - Gerenciamento de alunos
      - `/components`
      - `/hooks`
      - `/types`
      - `AlunoListPage.tsx`
      - `AlunoDetailPage.tsx`
    - `/instrutores` - Gerenciamento de instrutores
      - `/components`
      - `/hooks`
      - `/types`
      - `InstrutorListPage.tsx`
      - `InstrutorDetailPage.tsx`
    - `/presencas` - Gerenciamento de presenças
      - `/components`
      - `/hooks`
      - `/types`
      - `PresencaListPage.tsx`
      - `PresencaDetailPage.tsx`
    - `/notas` - Gerenciamento de notas
      - `/components`
      - `/hooks`
      - `/types`
      - `NotaListPage.tsx`
      - `NotaDetailPage.tsx`
    - `/certificados` - Gerenciamento de certificados
      - `/components`
      - `/hooks`
      - `/types`
      - `CertificadoListPage.tsx`
      - `CertificadoDetailPage.tsx`
    - `/relatorios` - Geração de relatórios
      - `/components`
      - `/hooks`
      - `/types`
      - `RelatorioListPage.tsx`
      - `RelatorioDetailPage.tsx`
  - `/shared` - Recursos compartilhados
    - `/components` - Componentes reutilizáveis
    - `/hooks` - Hooks compartilhados
    - `/types` - Tipos globais
    - `/utils` - Funções utilitárias
    - `/services` - Serviços compartilhados
    - `/constants` - Constantes globais
  - `/infrastructure` - Configurações e integrações
    - `/api` - Configurações de API
    - `/database` - Configurações do banco de dados
    - `/auth` - Configurações de autenticação
    - `/storage` - Configurações de armazenamento
  - `/assets` - Arquivos estáticos
  - `main.tsx` - Ponto de entrada da aplicação

## Benefícios da Reestruturação
1. **Organização por domínios**: Facilita a navegação e manutenção do código
2. **Separação de responsabilidades**: Cada domínio é responsável por sua própria lógica
3. **Escalabilidade**: Fácil adicionar novos domínios e funcionalidades
4. **Facilidade de teste**: Componentes e lógica estão mais isolados
5. **Time paralelo**: Diferentes times podem trabalhar em domínios diferentes sem conflitos

## Plano de Execução
1. Criar a nova estrutura de pastas
2. Migrar os componentes existentes para as novas pastas
3. Refatorar as importações para usar os novos caminhos
4. Separar as rotas em um arquivo próprio
5. Criar provedores de contexto específicos para cada domínio
6. Atualizar os testes (se existirem)
7. Documentar as mudanças

## Considerações Finais
Esta reestruturação segue o padrão de arquitetura Domain-Driven Design (DDD) aplicado ao frontend, promovendo uma melhor organização do código e facilitando a manutenção e evolução da aplicação.