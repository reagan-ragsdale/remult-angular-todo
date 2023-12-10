import { DbNbaTeamLogos } from "src/shared/dbTasks/DbNbaTeamLogos";

export interface PropData {
    name: string;
    h2h: string;
    spreadPoint: string;
    spreadPrice: string;
    totalPoint: string;
    totalPrice: string;
    teamInfo: DbNbaTeamLogos;
}
