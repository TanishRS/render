// In-memory data store (resets whenever the server restarts)
const users = [
  { id: 1, name: 'Tanish', email: 'tanish@example.com', age: 20, city: 'Pune', course: 'Computer Engineering' },
  { id: 2, name: 'Riya', email: 'riya@example.com', age: 19, city: 'Mumbai', course: 'Information Technology' }
];

// Turns a name into a URL-friendly slug, e.g. "Riya Shah" -> "riya-shah"
const toSlug = (name) => String(name).trim().toLowerCase().replace(/\s+/g, '-');

module.exports = { users, toSlug };
