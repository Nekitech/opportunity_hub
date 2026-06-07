const path = require("path");

module.exports = {
  reactStrictMode: true,
  // Self-contained сборка для прод-контейнера (.next/standalone).
  output: "standalone",
  // В монорепо трассировку файлов standalone привязываем к корню репо,
  // иначе в образ не попадут workspace-зависимости.
  outputFileTracingRoot: path.join(__dirname, "../../"),
};
