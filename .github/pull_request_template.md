---
name: Pull Request
about: Submit changes to improve or fix this project.
title: '[PR]: '
labels: enhancement
assignees: ''

body:
  - type: input
    id: pr_title
    attributes:
      label: Pull Request Title
      placeholder: Enter a short title for your changes...

  - type: textarea
    id: pr_description
    attributes:
      label: Description
      placeholder: Describe the purpose and scope of your changes...

  - type: textarea
    id: related_issues
    attributes:
      label: Related Issues
      placeholder: Link related issues here...

  - type: textarea
    id: testing
    attributes:
      label: Testing
      placeholder: Describe your testing process here...

  - type: textarea
    id: compatibility
    attributes:
      label: Compatibility
      placeholder: Enter compatibility details here...
      optional: true

  - type: textarea
    id: additional_notes
    attributes:
      label: Additional Notes
      description: Add any other relevant information, such as known limitations or future improvements.
      placeholder: Add additional notes here...
      optional: true
---

# Thank you for your contribution! I’ll review your changes soon.

## Description
Describe your changes in detail. Include:
- What problem your changes address.
- How your changes fix the problem.
- Any additional context or considerations.

## Related Issues
Link to any related issues (e.g., "Closes #12"). If none, write "None."

## Testing
Explain how you tested your changes. Include steps to verify functionality, unit tests, or screenshots if applicable.

## Compatibility
Describe any compatibility concerns, such as supported Node.js versions, TypeScript configurations, or external dependencies.

## Additional Notes
Add any other relevant information, such as known limitations or future improvements.

