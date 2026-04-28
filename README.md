# FinPilot AI

AI-powered payment intelligence platform.

## Problem Statement

Modern payment teams need to react quickly to failures, route transactions intelligently, and spot fraud or retry inefficiencies before they compound into revenue loss. Most internal tools are either too generic, too operationally heavy, or not explainable enough for analysts to trust.

## Solution Overview

FinPilot AI is a polished frontend fintech control room that simulates how a payments company can combine analytics, explainable fraud scoring, optimization heuristics, and conversational support in one internal dashboard. The app is fully frontend-only and uses deterministic logic, mock data, and keyword-based intelligence to feel like a production-grade system without external APIs.

## Features

- Global dashboard with KPI cards, method mix, and success/failure trend charts.
- Fraud Risk Engine with explainable risk scores, reasoning text, and a risk meter.
- Payment Optimization Engine with best-rail recommendations, retry timing, and confidence scoring.
- AI Insights Engine that analyzes a 30+ transaction mock dataset and surfaces trends, anomalies, and patterns.
- AI Assistant panel with a predefined knowledge base and contextual keyword matching.
- Sidebar navigation, status banners, loading states, timestamps, and polished card-based layout.

## System Architecture

The application is organized into a small React module graph:

- `src/data` contains realistic mock transaction and knowledge data.
- `src/utils` contains deterministic engines for fraud scoring, payment optimization, and insight generation.
- `src/components` contains the dashboard modules, sidebar, and AI assistant UI.
- `src/App.jsx` coordinates navigation, analysis boot-up state, and shared telemetry.

This structure keeps the product readable, modular, and easy to extend with real APIs or services later.

## Future Scope

- Replace rule-based heuristics with real ML models.
- Add live payment gateway integration.
- Persist analyst actions and assistant conversations.
- Connect to real fraud labels, retry telemetry, and settlement data.
- Add role-based access, exports, and audit logs.

## Run Locally

```bash
npm install
npm run dev
```