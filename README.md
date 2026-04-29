# Juntos na Aventura — Front-end

Aplicação desenvolvida em **Next.js + TypeScript + Tailwind CSS** para gerenciamento de aventuras em grupo com tarifação dinâmica baseada na quantidade de participantes.

A plataforma permite:
- visualizar aventuras disponíveis
- realizar reservas individuais
- compartilhar links públicos da viagem
- acompanhar formação de grupos em tempo real
- visualizar redução progressiva de preços conforme o grupo cresce

---

# Tecnologias Utilizadas

## Front-end
- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS v4
- Radix UI
- lucide-react

## Gerenciamento de Estado e Formulários
- zustand
- react-hook-form
- zod

## UX/UI
- sonner
- next-themes

## Qualidade de Código
- ESLint
- eslint-config-next

---

# Funcionalidades

## Cadastro e Exibição de Aventuras
- Listagem de aventuras disponíveis
- Exibição de destino, datas e vagas
- Exibição de preços dinâmicos

## Reserva de Viajante
- Cadastro de:
  - Nome
  - E-mail
  - WhatsApp
- Reserva vinculada à aventura

## Compartilhamento Público
- Geração de link compartilhável
- Página pública da aventura
- Atualização dinâmica da formação do grupo

## Tarifação Dinâmica

O valor por pessoa diminui conforme novas reservas entram no grupo.

| Pessoas | Valor por Pessoa |
|----------|------------------|
| 1 pessoa | R$ 4.000 |
| 2 pessoas | R$ 3.200 |
| 3 pessoas | R$ 2.700 |
| 4 pessoas | R$ 2.300 |

---

# Requisitos

- Node.js 20+
- npm

---

# Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Acesse a pasta do projeto:

```bash
cd front-desafio-juntos-na-aventura
```

Instale as dependências:

```bash
npm install
```

---

# Configuração

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

Ajuste a URL conforme a porta utilizada pela API.

---

# Executando o Projeto

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```txt
http://localhost:3000
```

---

# Estrutura do Projeto

```txt
src/
 ├── app/
 ├── components/
 ├── services/
 ├── hooks/
 ├── store/
 ├── schemas/
 └── lib/
```

---

# Integração com API

O frontend consome a API do projeto:

```txt
api-desafio-juntos-na-aventura
```

Principais funcionalidades integradas:
- listagem de aventuras
- criação de reservas
- cálculo dinâmico de tarifas
- atualização automática do status da viagem
- geração de links públicos

---

# Regras de Negócio

## Status da Aventura

### pending_group
Grupo ainda não atingiu o mínimo de participantes.

### confirmed
Grupo confirmado automaticamente ao atingir o mínimo necessário.

---

# Mensagens Dinâmicas

A plataforma atualiza automaticamente as mensagens conforme o estado do grupo.

### Grupo não confirmado
> “Faltam apenas X pessoas para garantir a aventura.”

### Grupo confirmado
> “🎉 Saída Confirmada! Continue compartilhando para reduzir ainda mais o valor.”

### Tarifa mínima atingida
> “🔥 Tarifa mínima atingida! Garanta sua vaga.”

---

# Scripts Disponíveis

## Desenvolvimento

```bash
npm run dev
```

## Build de produção

```bash
npm run build
```

## Executar produção

```bash
npm run start
```

## Lint

```bash
npm run lint
```

---

# Responsividade

A aplicação foi desenvolvida com foco em:
- responsividade
- experiência mobile
- interface moderna
- acessibilidade
- feedback visual para ações do usuário

---

# Deploy

O projeto pode ser publicado em:
- Vercel
- Netlify
- Railway
- AWS
- qualquer ambiente compatível com Next.js

---