---
name: Request Support
about: Seek help for issues or challenges not covered by existing documentation or bug reports.
title: '[Support]: '
labels: support
assignees: ''

body:
  - type: input
    id: support_title
    attributes:
      label: Support Request Title
      placeholder: Enter a short title...

  - type: textarea
    id: description
    attributes:
      label: Description
      placeholder: Describe your issue or question...

  - type: textarea
    id: steps_tried
    attributes:
      label: Steps Taken
      placeholder: Describe what you’ve tried so far...

  - type: dropdown
    id: urgency
    attributes:
      label: Urgency Level
      description: Select how critical this request is for you.
      options:
        - Low
        - Medium
        - High
---

# Thank you for seeking support! Please provide as much detail as possible to help us assist you effectively.

## Support Request Title:
Summarize the issue or help you need (e.g., "How do I configure the API key?").

## Description:
Provide a detailed explanation of your request. Include:
- What you’re trying to achieve.
- Any error messages or unexpected behavior.
- Relevant context or configurations.

## Steps Taken:
List any steps you've already tried to resolve the issue or find the answer.

## Select how critical this request is for you:
- Low (General question or non-blocking issue).
- Medium (Important but not blocking development).
- High (Blocking progress or critical functionality).
