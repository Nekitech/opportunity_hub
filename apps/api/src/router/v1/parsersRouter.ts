import express, {Router} from "express";
import prisma from "../../prisma/connect";
import {check, validationResult} from "express-validator";
import {CronTime} from "cron";
import {addJob, deleteJob, updateJob, runParserNow} from "../../cron/parsing";
import usersRouter from "./usersRouter";

const parsersRouter = Router();

const baseUrl = '/v1/parsers'

/**
 * @api {post} /v1/parsers Получение списка парсеров
 */
parsersRouter.post(baseUrl, async (req, res) => {


    await check('skip', 'skip должен быть числом')
        .isNumeric()
        .run(req);
    await check('take', 'take должен быть числом')
        .isNumeric()
        .run(req);

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }
    try {
        let parsers = await prisma.parsers.findMany({
            skip: req.body.skip || 0,
            take: req.body.take || 10,
            orderBy: {
                id: 'desc'
            },
            where: req.body.where || {}
        });

        let count = await prisma.parsers.count({
            where: req.body.where || {}
        });

        return res.status(200).json({
            parsers: parsers,
            count: count
        });
    }
    catch (e) {
        return res.status(500).json({errors: [{msg: 'Ошибка при получении парсеров'}]});
    }

})


usersRouter.post(baseUrl + "/count", async (req:express.Request, res:express.Response) => {
    try{
        const count = await prisma.parsers.count({
            where: req.body.where || {}
        });
        return res.status(200).json({count: count});
    } catch (e) {
        return res.status(500).json({errors: [{msg: 'Ошибка при получении количества парсеров'}]});
    }
});

parsersRouter.patch(baseUrl, async (req, res) => {
    await check('id', 'Не указан id парсера')
        .isInt()
        .run(req);


    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        return res.status(422).json({errors: validationErrors.array()});
    }

    let parser = await prisma.parsers.findUnique({
        where: {
            id: req.body.id
        }
    });

    if (!parser){
        return res.status(422).json({errors: [{msg: 'Парсер не найден'}]});
    }

    let data = {} as any;
    if (req.body.name)
        data["name"] = req.body.name;
    if (req.body.description)
        data["description"] = req.body.description;
    if ('isEnabled' in req.body)
        data["isEnabled"] = req.body.isEnabled;
    if (req.body.pagesToParse)
        data["pagesToParse"] = req.body.pagesToParse;
    if (req.body.cronTime)
        data["cronTime"] = req.body.cronTime;

    await prisma.parsers.update({
        where: {
            id: req.body.id
        },
        data: data
    });

    if (req.body.isEnabled) {
        addJob(parser.id).then();
    }
    else {
        deleteJob(parser.id)
    }

    if (req.body.cronTime){
        updateJob(parser.id)
    }
    return res.status(200).json({message: 'Парсер успешно обновлен'});

})

parsersRouter.delete(baseUrl, async (req, res) => {
    await check('id', 'Не указан id парсера')
        .isInt()
        .run(req);

    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        return res.status(422).json({errors: validationErrors.array()});
    }

    let parser = await prisma.parsers.findUnique({
        where: {
            id: req.body.id
        }
    });

    if (!parser){
        return res.status(422).json({errors: [{msg: 'Парсер не найден'}]});
    }

    await prisma.parsers.delete({
        where: {
            id: req.body.id
        }
    });

    return res.status(200).json({message: 'Парсер успешно удален'});
});

parsersRouter.post(baseUrl, async (req, res) => {

    await check("name", "Не указано имя парсера")
        .notEmpty()
        .run(req);

    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        return res.status(422).json({errors: validationErrors.array()});
    }

    let data = {
        name: req.body.name,
        description: req.body.description,
        isEnabled: req.body.isEnabled || true,
        pagesToParse: req.body.pagesToParse || 1
    }

    let parser = await prisma.parsers.findFirst({
        where: {
            name: req.body.name
        }
    });

    if (parser){
        return res.status(422).json({errors: [{msg: 'Парсер с таким именем уже существует'}]});
    }

    let parserNew = await prisma.parsers.create({
        data: data
    })

    return res.status(200).json({message: 'Парсер успешно добавлен', data: parserNew})
})
/**
 * @api {get} /v1/parsers/stats Parser statistics with item counts per source
 */
parsersRouter.get(baseUrl + "/stats", async (_req, res) => {
    try {
        const parsers = await prisma.parsers.findMany({
            orderBy: { lastSuccessParse: "desc" },
        });

        const stats = await Promise.all(
            parsers.map(async (p) => {
                const [grants, competitions, internships] = await Promise.all([
                    prisma.grants.count({ where: { parser_id: p.id } }),
                    prisma.competitions.count({ where: { parser_id: p.id } }),
                    prisma.internships.count({ where: { parser_id: p.id } }),
                ]);
                return {
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    isEnabled: p.isEnabled,
                    cronTime: p.cronTime,
                    pagesToParse: p.pagesToParse,
                    lastSuccessParse: p.lastSuccessParse,
                    counts: { grants, competitions, internships, total: grants + competitions + internships },
                };
            })
        );

        return res.status(200).json({ stats, total: stats.length });
    } catch (e) {
        return res.status(500).json({ errors: [{ msg: "Ошибка получения статистики" }] });
    }
});

/**
 * @api {post} /v1/parsers/cron/bulk Задать одинаковое cron-расписание всем парсерам
 * body: { cronTime: string }
 */
parsersRouter.post(baseUrl + "/cron/bulk", async (req, res) => {
    const cronTime = req.body?.cronTime;
    if (!cronTime || typeof cronTime !== "string") {
        return res.status(422).json({errors: [{msg: "Не указано cron-время"}]});
    }
    // Валидируем выражение тем же движком, что и сам cron.
    try {
        new CronTime(cronTime);
    } catch {
        return res.status(422).json({errors: [{msg: "Некорректное cron-выражение"}]});
    }

    const result = await prisma.parsers.updateMany({data: {cronTime}});

    // Перерегистрировать задачи у включённых парсеров, чтобы новое время применилось без рестарта.
    const enabled = await prisma.parsers.findMany({where: {isEnabled: true}});
    for (const p of enabled) {
        await updateJob(p.id);
    }

    return res.status(200).json({
        message: `Cron-расписание обновлено у ${result.count} парсеров`,
        count: result.count,
    });
});

/**
 * @api {post} /v1/parsers/run Запустить парсер немедленно (в обход cron)
 * body: { id: number }
 */
parsersRouter.post(baseUrl + "/run", async (req, res) => {
    const id = Number(req.body?.id);
    if (!Number.isInteger(id)) {
        return res.status(422).json({errors: [{msg: "Не указан id парсера"}]});
    }

    const parser = await prisma.parsers.findUnique({where: {id}});
    if (!parser) {
        return res.status(422).json({errors: [{msg: "Парсер не найден"}]});
    }

    // Fire-and-forget: парсинг может идти десятки секунд (внешние сайты, N страниц),
    // не держим HTTP-запрос открытым. Ошибки логируются внутри parsePage.
    runParserNow(id).catch((e) => console.error("runParserNow error:", e));

    return res.status(202).json({message: `Парсинг «${parser.name}» запущен`});
});

export default parsersRouter;