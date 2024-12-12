---
name: Ask a Question
about: Ask a question about how to use or configure elements of the Grepper Node library.
title: '[Question]: '
labels: question
assignees: ''

body:
  - type: input
    id: question_summary
    attributes:
      label: Question Summary
      placeholder: Enter a short summary...

  - type: textarea
    id: question_details
    attributes:
      label: Detailed Description
      placeholder: Describe your question here...

  - type: textarea
    id: usage_context
    attributes:
      label: Usage Context
      placeholder: Provide the context of how you're using the library...
      optional: true
---

# Thank you for reaching out! Please provide as much detail as possible to help answer your question effectively.

## Question Summary
Summarize your question (e.g., "How do I use the `search` method?").

## Detailed Description
Describe your question in detail, including:
- What you're trying to achieve.
- Specific challenges or errors you're encountering.
- Any relevant code snippets or configurations.

## Usage Context
(Optional) Share any additional context, such as the environment (Node.js version, dependencies) or other information that might help answer your question.
