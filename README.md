# Grepper Node

A Node.js library for interacting with the Grepper API to browse and manage code snippets. This library provides an intuitive interface to search, retrieve, and update code snippets programmatically.

## Features
- **Search Answers**: Find answers based on a query string.
- **Retrieve an Answer**: (Currently unavailable) Refer to the [official documentation](https://www.grepper.com/api-docs/index.php#retreive-an-answer).
- **Update an Answer**: (Currently unavailable) Refer to the [official documentation](https://www.grepper.com/api-docs/index.php#update-a-specific-answer).

---

## Requirements
1. A [Grepper Account](https://www.grepper.com/).
2. A valid [Grepper API Key](https://www.grepper.com/app/settings-account.php).

---

## Installation
Install the library using npm or yarn:

```bash
npm install grepper-node
# or
yarn add grepper-node
```

---

## Getting Started

### Authentication

Create a new client instance using your Grepper API key:

```typescript
import { Client } from 'grepper-node'

const client = new Client({
    api_key: '<your_api_key>'
});
```

---

### Usage Examples

#### **Search Answers**
Use the `search` method to find answers by a query string:

```typescript
const answers = await client.search('how to build docker image');
console.log(answers);
// output:
// [
//   {
//     object: string,
//     id: number,
//     content: string,
//     author_name: string,
//     title: string,
//     upvotes: number,
//     downvotes: number
//   }
// ]
```

#### **Retrieve an Answer**
This endpoint is currently unavailable. Refer to the [official documentation](https://www.grepper.com/api-docs/index.php#retreive-an-answer).

```typescript
// Example usage when available:
const answer = await client.answer(343661);
console.log(answer);
// output:
// {
//   object: string,
//   id: number,
//   content: string,
//   author_name: string,
//   title: string,
//   upvotes: number,
//   downvotes: number
// }
```

#### **Update an Answer**
This endpoint is currently unavailable. Refer to the [official documentation](https://www.grepper.com/api-docs/index.php#update-a-specific-answer).

```typescript
// Example usage when available:
const status = await client.update(343661, 'new answer content here');
console.log(status);
// output:
// {
//   id: number,
//   success: boolean
// }
```

---

## Contributing
We welcome contributions! To get started: [CONTRIBUTING](./CONTRIBUTING.md)

## License
This project is licensed under the [MIT License](./LICENSE).
