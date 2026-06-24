// PM2 ecosystem — GE.CO.S.
// Avvia DUE processi: il backend Express (CMS) e il frontend Next.js.
// Le porte sono guidate dalle variabili d'ambiente (con default), così non
// vanno hardcodate: imposta BACKEND_PORT e FRONTEND_PORT in .env.
try {
    require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
} catch {
    // dotenv non installato: si usano le env già presenti o i default.
}

const BACKEND_PORT = process.env.BACKEND_PORT || "3036";
const FRONTEND_PORT = process.env.FRONTEND_PORT || process.env.PORT || "3037";
const CONTENT_API_URL = `http://localhost:${BACKEND_PORT}`;

const argEnvIndex = process.argv.indexOf("--env");
let argEnv = (argEnvIndex !== -1 && process.argv[argEnvIndex + 1]) || "prod";

const RUN_ENV_MAP = {
    local: { instances: 1, max_memory_restart: "300M" },
    dev: { instances: 2, max_memory_restart: "400M" },
    prod: { instances: 4, max_memory_restart: "1000M" },
};
if (!(argEnv in RUN_ENV_MAP)) argEnv = "prod";
const env = RUN_ENV_MAP[argEnv];

module.exports = {
    apps: [
        // ── Backend Express + SQLite ──────────────────────────────
        {
            name: `${BACKEND_PORT}.backend-gecos`,
            cwd: "./backend",
            script: "server.js",
            instances: 1,
            exec_mode: "fork",
            max_memory_restart: "300M",
            env_local: {
                NODE_ENV: "development",
                BACKEND_PORT,
                APP_ENV: "local",
            },
            env_dev: {
                NODE_ENV: "production",
                BACKEND_PORT,
                APP_ENV: "dev",
            },
            env_prod: {
                NODE_ENV: "production",
                BACKEND_PORT,
                APP_ENV: "prod",
            },
        },
        // ── Frontend Next.js ──────────────────────────────────────
        {
            name: `${FRONTEND_PORT}.site-gecos`,
            script: "node_modules/next/dist/bin/next",
            args: "start",
            exec_mode: "cluster",
            instances: env.instances,
            max_memory_restart: env.max_memory_restart,
            env_local: {
                NODE_ENV: "development",
                PORT: FRONTEND_PORT,
                APP_ENV: "local",
                CONTENT_API_URL,
            },
            env_dev: {
                NODE_ENV: "production",
                PORT: FRONTEND_PORT,
                APP_ENV: "dev",
                CONTENT_API_URL,
            },
            env_prod: {
                NODE_ENV: "production",
                PORT: FRONTEND_PORT,
                APP_ENV: "prod",
                CONTENT_API_URL,
            },
        },
    ],
};
