---
name: prompt
description: Refactor prompts to be more structured and actionable for better AI responses
---

## Prompt Refactor Skill

When I provide a prompt prefixed with "Refactor:" or ask for a "better way to say this," apply the following logic:

### 1. Analysis Phase

- **Intent:** Identify the core technical goal (e.g., "Write a unit test").
- **Constraints:** Identify any implied constraints (e.g., "Use Vitest," "Keep it dry").
- **Missing Context:** List any files or variables needed to provide a 10/10 answer.

### 2. Output Format

Return a structured "Optimized Prompt" that follows this template:

- **Role:** Define the specific expert persona needed.
- **Task:** A clear, imperative instruction.
- **Structure:** How the code or explanation should be formatted.
- **Variables:** Placeholder for relevant code snippets or file paths.

### 3. Immediate Action

After showing the refactored prompt, ask: "Would you like me to execute this optimized prompt now?"
