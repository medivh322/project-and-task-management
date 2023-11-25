function env(name: string): string {
  return process.env[name] || `в .env нет ${name} значения`;
}
export { env };
