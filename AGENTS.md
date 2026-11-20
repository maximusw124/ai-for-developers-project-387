# Правила проекта (AGENTS.md)

## Структура
- `backend/` — сервер на Fastify + TypeScript
- `frontend/` — клиент на React + Vite + TypeScript

## Команды
- `mise run install` — установка зависимостей
- `mise run dev` — запуск бэкенда (:3000) и фронтенда (:5173)
- `mise run check` — единая проверка: линтер (Biome), проверка типов, сборка и дымовой тест

## Agent skills

### Issue tracker

Тикеты ведутся в GitHub Issues репозитория `maximusw124/ai-for-developers-project-387`; все команды `gh` выполняются с `--repo maximusw124/ai-for-developers-project-387`. См. `docs/agents/issue-tracker.md`.

### Skills

Скиллы первого проекта лежат в `.agents/skills/` и доступны OpenCode на свежем раннере без установки. См. `docs/agents/skills.md`.

### Triage labels

Пять канонических ролей триажа соответствуют одноимённым лейблам репозитория. См. `docs/agents/triage-labels.md`.

### Domain docs

Один контекст: `GLOSSARY.md` в корне и ADR в `docs/adr/`, исходная спецификация в `.scratch/booking-spec/`. См. `docs/agents/domain.md`.

## Git и коммиты
Все коммиты и заголовки PR оформляются строго по спецификации **Conventional Commits**:
- `feat: ...` — новая функциональность
- `fix: ...` — исправление бага
- `chore: ...` — настройка окружения, конфиги, зависимости
- `docs: ...` — документация
- `test: ...` — тесты
- `refactor: ...` — рефакторинг без изменения поведения
- `ci: ...` — изменения CI/CD

Допустимы также `perf`, `build`, `style` и `revert`, если они нужны. Scope опционален; `!` и `BREAKING CHANGE` допускаются. Стратегия мержа в `main` — squash.
