# Project Context

## What is CollabSpace?

CollabSpace is a rebuild of a previous team collaboration application. The primary goal is to learn Java and Spring Boot while delivering a working product.

## Goals

- Rebuild core collaboration features from the earlier app
- Learn Java 21 and the Spring ecosystem hands-on
- Keep the codebase understandable and maintainable

## Architecture

**Modular monolith, package by feature.**

- One deployable backend, split into feature modules (e.g. users, teams, tasks)
- Each feature owns its controllers, services, and persistence
- Shared infrastructure (config, security, common types) lives in a small core layer
- React frontend consumes the REST API

## Explicit non-goals

To stay focused on learning and delivery, we are **not** adopting:

- Microservices
- Redis, Kafka, or message brokers
- Kubernetes or complex orchestration
- Extra infrastructure beyond PostgreSQL and Docker Compose for local dev

Add complexity only when a concrete requirement demands it.

## Repository

Monorepo with separate `backend/` and `frontend/` directories. Shared documentation lives in `docs/`.
