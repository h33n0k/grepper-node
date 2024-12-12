---
name: Bug Report
about: Report a problem with this API client module.
title: '[Bug]: '
labels: bug
assignees: ''

body:
  - type: input
    id: bug_summary
    attributes:
      label: Bug Summary
      placeholder: Enter a short summary of the bug...

  - type: textarea
    id: bug_description
    attributes:
      label: Detailed Description
      placeholder: Describe the bug and how to reproduce it...

  - type: textarea
    id: reproduction_steps
    attributes:
      label: Steps to Reproduce
      placeholder: List reproduction steps here...

  - type: textarea
    id: error_logs
    attributes:
      label: Error Logs or Output
      placeholder: Paste error logs or console output here...
      optional: true

  - type: textarea
    id: environment_info
    attributes:
      label: Environment Information
      placeholder: Include Node.js version, OS, and library version here...

  - type: textarea
    id: additional_context
    attributes:
      label: Additional Context
      placeholder: Add additional context here...
      optional: true
---

# Thank you for reporting an issue! Please fill out the information below to help us diagnose and fix the problem.

## Bug Summary:
Briefly summarize the bug (e.g., "Error when using the search method").

## Detailed Description:
Provide a clear and detailed description of the bug, including:
- What you expected to happen.
- What actually happened.
- Any screenshots or relevant context.

## Steps to Reproduce:
List the steps to reproduce the issue (e.g., "1. Create a client instance. 2. Call the `search` method with a query string.").

## Error Logs or Output:
Include any relevant logs, error messages, or output. Attach screenshots if helpful.

## Environment Information:
Share your Node.js version, OS, and the version of this library.

## Additional Context:
Add any other context about the problem here, such as configuration files or dependencies that might affect the issue.
