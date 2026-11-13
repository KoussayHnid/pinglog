# PingLog

> Micro-SaaS B2B — Public changelog & feedback widget for your products.

## Stack

| Couche | Choix |
|---|---|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| Déploiement | Vercel |

## Démarrage rapide

```bash
# 1. Variables d'environnement
cp .env.example .env.local
# → renseigner NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY
# → configurer NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL et LEMONSQUEEZY_WEBHOOK_SECRET pour les paiements

# 2. Dépendances
npm install

# 3. Appliquer le schéma SQL
# Dans le SQL Editor de Supabase, coller le contenu de supabase/schema.sql

# 4. Lancer le serveur de dev
npm run dev
```

## Structure

```
pinglog/
├── src/
│   ├── app/                # Routes App Router
│   │   ├── (dashboard)/    # Pages authentifiées (layout protégé)
│   │   ├── (public)/       # Widget public (changelog, feedback)
│   │   └── api/            # Route Handlers Next.js
│   ├── components/
│   │   ├── ui/             # Composants génériques
│   │   ├── changelog/
│   │   └── feedback/
│   ├── lib/
│   │   ├── supabase/       # Clients server / browser
│   │   └── utils.ts
│   └── types/              # Types TypeScript dérivés du schéma
├── supabase/
│   └── schema.sql          # Schéma complet + RLS
└── .env.example
```

## Schéma de données

```
projects ──< changelogs
         ──< feedback_items ──< votes
```

### RLS Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `projects` | owner | owner | owner | owner |
| `changelogs` | public (api_key) + owner | owner | owner | owner |
| `feedback_items` | public (api_key) + owner | public (api_key) + owner | owner | owner |
| `votes` | public (api_key) + owner | public (anti-spam fingerprint) | — | owner |
| `subscriptions` | owner | webhook/service role | webhook/service role | — |

## Plans et paiements

Le plan Free est limité à un projet et 10 entrées Changelog, avec le lien « Powered by PingLog » dans le widget.
Le plan Pro ($19/mois) débloque projets et entrées illimités, les couleurs personnalisées et le widget sans badge.
Les limites sont vérifiées dans les actions serveur et par des triggers PostgreSQL.

Pour activer les paiements :

1. Appliquer `supabase/schema.sql` (ou la migration `supabase/migrations/20261113000000_subscriptions_and_plan_limits.sql` sur une base existante).
2. Définir `NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL` avec l'URL de checkout du variant Pro et `LEMONSQUEEZY_WEBHOOK_SECRET` avec le secret de signature.
3. Configurer dans Lemon Squeezy le webhook `POST /api/webhooks/lemonsqueezy` pour `subscription_created`, `subscription_updated` et `subscription_cancelled`.
4. Conserver `SUPABASE_SERVICE_ROLE_KEY` côté serveur uniquement. Le checkout transmet l'ID Supabase de l'utilisateur dans `checkout[custom][user_id]`.

Les statuts `active` donnent accès au plan Pro. Les abonnements `past_due` ou annulés reviennent aux limites Free.
