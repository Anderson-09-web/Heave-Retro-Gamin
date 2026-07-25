import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import usersRouter from "./users";
import apiKeysRouter from "./api_keys";
import categoriesRouter from "./categories";
import endpointsRouter from "./endpoints";
import imagesRouter from "./images";
import logsRouter from "./logs";
import servicesRouter from "./services";
import backupsRouter from "./backups";
import configRouter from "./config";
import giveawaysRouter from "./giveaways";
import gamesRouter from "./games";
import publicRouter from "./public";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(dashboardRouter);
router.use(usersRouter);
router.use(apiKeysRouter);
router.use(categoriesRouter);
router.use(endpointsRouter);
router.use(imagesRouter);
router.use(logsRouter);
router.use(servicesRouter);
router.use(backupsRouter);
router.use(configRouter);
router.use(giveawaysRouter);
router.use(gamesRouter);
router.use(publicRouter);

export default router;
