import cors from "cors";
import type { parsers as PrismaParser } from "@prisma/client";
import dotenv from 'dotenv';
import baseRouter from "./router/baseRouter";
import grantsRouter from "./router/v1/grantsRouter";
import prisma, {connect} from "./prisma/connect";
import usersRouter from "./router/v1/usersRouter";
import rolesRouter from "./router/v1/rolesRouter";
import express from "express";
import resourceAccess from "./middlewares/resourceAccess";
import getUserFromToken from "./middlewares/getUserFromToken";
import accessingLog from "./middlewares/accessingLog";
import resourcesRouter from "./router/v1/resourcesRouter";
import settingsRouter from "./router/v1/settingsRouter";
import parsersRouter from "./router/v1/parsersRouter";
import {telegramBotInit} from "./telegram/init";
import {addJob} from "./cron/parsing";
import telegramRouter from "./router/v1/telegram";
import * as path from "path";
import cronRouter from "./router/v1/cronRouter";
import competionsRouter from "./router/v1/competionsRouter";
import accessingLogsRouter from "./router/v1/acessingLogsRouter";
import internshipsRouter from "./router/v1/internshipsRouter";
import accessingLogsWarningsRouter from "./router/v1/accessingLogsWarningsRouter";
dotenv.config();
const app = express();
const port = process.env.PORT || 3003;

// /health — before all middleware, no auth required
app.get("/health", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: "ok", db: "connected", ts: new Date().toISOString() });
    } catch {
        res.status(503).json({ status: "error", db: "disconnected", ts: new Date().toISOString() });
    }
});

// Пока связи с бд нет, приложение не запускается
connect().then(async _ => {

	// Список разрешённых origin'ов берём из env CORS_ORIGINS (через запятую),
	// с дефолтом на локальную разработку (web :3001, admin :8081, api :3000).
	// В проде задаём CORS_ORIGINS=https://opportunity.nekado.dev,https://admin.nekado.dev
	const allowedOrigins = (
		process.env.CORS_ORIGINS ??
		"http://localhost:3001,http://localhost:3000,http://localhost:8081,http://localhost:5000"
	)
		.split(",")
		.map((o) => o.trim())
		.filter(Boolean);

	const isProd = process.env.NODE_ENV === 'production';
	// В dev Next.js внутри Docker подставляет Docker-internal IP контейнера (172.x.x.x)
	// как origin вместо localhost. Разрешаем bridge-сеть только в dev.
	const dockerBridgeOrigin = /^https?:\/\/172\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/;

	const corsOptions = {
		credentials: true, // access-control-allow-credentials: true
		origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
			// origin === undefined — запрос не из браузера (curl, server-to-server) — пропускаем.
			if (!origin) return callback(null, true);
			if (allowedOrigins.includes(origin)) return callback(null, true);
			if (!isProd && dockerBridgeOrigin.test(origin)) return callback(null, true);
			return callback(new Error(`Origin ${origin} запрещён политикой CORS`));
		},
		exposedHeaders: 'Authorization',
	};

	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'ejs');
	app.use('/public', express.static(__dirname+'/public'));

	// плагины
	app.use(cors(corsOptions));
	app.use(express.json());
	app.use(express.urlencoded({extended:true})); //Parse URL-encoded bodies

	// мидлвары
	app.use(getUserFromToken as any);
	app.use(accessingLog as any);
	app.use(resourceAccess as any);

	// routes start
	app.use(baseRouter);
	app.use(grantsRouter);
	app.use(usersRouter);
	app.use(rolesRouter);
	app.use(resourcesRouter);
	app.use(settingsRouter);
	app.use(parsersRouter);
	app.use(telegramRouter);
	app.use(competionsRouter)
	app.use(cronRouter);
	app.use(accessingLogsRouter);
	app.use(internshipsRouter);
	app.use(accessingLogsWarningsRouter);

	// routes end

	// Добавление парсеров в крон
	const parsers = await prisma.parsers.findMany();
	parsers.forEach((parser: PrismaParser) => {
		if (!parser.cronTime){
			return;
		}
		if (parser.isEnabled){
			addJob(parser.id);
		}
	})

	// init telegram
	telegramBotInit();
})

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

