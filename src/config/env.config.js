import "dotenv/config";

const requiredVariables = ["PORT", "NODE_ENV", "MONGO_URI"];

const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable]
);

if (missingVariables.length > 0) {
  throw new Error(
    `Faltan variables de entorno requeridas: ${missingVariables.join(", ")}. ` +
      "Revisá tu archivo .env (podés basarte en .env.example)."
  );
}

const config = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI,
};

export default config;
