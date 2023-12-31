import { remultExpress } from 'remult/remult-express';
import { Task } from '../shared/dbTasks/Task';
import { TaskController } from '../shared/Controllers/TaskController';
// Changed path from `src/shared/dbTasks/PlayerInfoMlb` to `../shared/dbTasks/PlayerInfoMlb` relative path works better
import { PlayerInfoMlb } from '../shared/dbTasks/PlayerInfoMlb';
import { MlbController } from '../shared/Controllers/MlbController';
import { DbMlbGameBookData } from '../shared/dbTasks/DbMlbGameBookData';
import { DbGameBookData } from '../shared/dbTasks/DbGameBookData';
import { SportsBookController } from '../shared/Controllers/SportsBookController';
import { DbPlayerPropData } from '../shared/dbTasks/DbPlayerPropData';
import { PlayerPropController } from '../shared/Controllers/PlayerPropController';
import { DbNhlPlayerInfo } from '../shared/dbTasks/DbNhlPlayerInfo';
import { NhlPlayerInfoController } from '../shared/Controllers/NhlPlayerInfoController';
import { DbNhlPlayerGameStats } from '../shared/dbTasks/DbNhlPlayerGameStats';
import { NhlPlayerGameStatsController } from '../shared/Controllers/NhlPlayerGameStatsController';
import { NbaPlayerInfoDb } from '../shared/dbTasks/NbaPlayerInfoDb';
import { NbaController } from '../shared/Controllers/NbaController';
import { DbNbaGameStats } from '../shared/dbTasks/DbNbaGameStats';
import { createPostgresDataProvider } from 'remult/postgres';
import { DbNbaTeamGameStats } from '../shared/dbTasks/DbNbaTeamGameStats';
import { DbNbaTeamLogos } from '../shared/dbTasks/DbNbaTeamLogos';

export const api = remultExpress({
  entities: [
    Task,
    PlayerInfoMlb,
    DbMlbGameBookData,
    DbGameBookData,
    DbPlayerPropData,
    DbNhlPlayerInfo,
    DbNhlPlayerGameStats,
    NbaPlayerInfoDb,
    DbNbaGameStats,
    DbNbaTeamGameStats,
    DbNbaTeamLogos
  ],
  controllers: [
    TaskController,
    MlbController,
    SportsBookController,
    PlayerPropController,
    NhlPlayerInfoController,
    NhlPlayerGameStatsController,
    NbaController,
  ],

  //comment out below when local
  //small change
        dataProvider: createPostgresDataProvider({
    connectionString: "postgresql://postgres:eg*gE31aCf66e5A*A5G35*3d3g1fgCcC@postgres.railway.internal:5432/railway" 
  })      
  
});
