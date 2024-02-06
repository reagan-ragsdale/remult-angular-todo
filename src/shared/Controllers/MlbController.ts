import { Allow, BackendMethod, remult } from "remult"
import {PlayerInfoMlb}   from '../dbTasks/DbMlbPlayerInfo'
import { DBPlayerGameStatsMlb } from "../dbTasks/DbMlbPlayerGameStats"
import { DbMlbTeamGameStats } from "../dbTasks/DbMlbTeamGameStats"
import { DBMlbPlayerGameStatAverages } from "../dbTasks/DbMlbPlayerGameStatAverages"
import { DbMlbTeamGameStatAverages } from "../dbTasks/DbMlbTeamGameStatAverages"

export class MlbController {



  //player info 
  @BackendMethod({ allowed: true})
  static async mlbSetPlayerInfo(playerData: PlayerInfoMlb[]){
    const taskRepo = remult.repo(PlayerInfoMlb)
    await taskRepo.insert(playerData)
  }

  @BackendMethod({ allowed: true})
  static async mlbGetPlayerInfoByPlayerId(id: number): Promise<PlayerInfoMlb[]>{
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({where: {playerId: id}})
  }

  @BackendMethod({ allowed: true})
  static async mlbGetPlayerInfoByPlayerName(name: string): Promise<PlayerInfoMlb[]>{
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({where: {playerName: name}})
  }

  @BackendMethod({ allowed: true})
  static async mlbGetAllPlayerInfo(): Promise<PlayerInfoMlb[]>{
    const taskRepo = remult.repo(PlayerInfoMlb)
    return await taskRepo.find({ where: { playerId: { "!=": 0 } } })
  }

  //player game stats
  @BackendMethod({ allowed: true})
  static async mlbSetPlayerGameStats(playerStats: DBPlayerGameStatsMlb[]){
    const taskRepo = remult.repo(DBPlayerGameStatsMlb)
    await taskRepo.insert(playerStats)
  }

  @BackendMethod({ allowed: true})
  static async mlbGetPlayerGameStatsByPlayerIdAndSeason(id: number, season: number): Promise<DBPlayerGameStatsMlb[]>{
    const taskRepo = remult.repo(DBPlayerGameStatsMlb)
    return await taskRepo.find({where: {playerId : id, season: season}})
  }

  //team game stats
  @BackendMethod({ allowed: true})
  static async mlbSetTeamGameStats(teamStats: DbMlbTeamGameStats[]){
    const taskRepo = remult.repo(DbMlbTeamGameStats)
    await taskRepo.insert(teamStats)
  }

  @BackendMethod({ allowed: true})
  static async mlbGetTeamGameStatsByTeamIdAndSeason(id: number, season: number): Promise<DbMlbTeamGameStats[]>{
    const taskRepo = remult.repo(DbMlbTeamGameStats)
    return await taskRepo.find({where: {teamId : id, season: season}})
  }

  //player stat averages
  @BackendMethod({ allowed: true })
  static async mlbSetPlayerStatAverage(stat: DBMlbPlayerGameStatAverages) {
    const taskRepo = remult.repo(DBMlbPlayerGameStatAverages)

    var playerStat = await taskRepo.find({where: {playerId: stat.playerId}})
    if(playerStat.length > 0){
      await taskRepo.delete(playerStat[0])
      await taskRepo.insert(stat)
    }
    else{
      await taskRepo.insert(stat)
    }
    
  }

  @BackendMethod({ allowed: true })
  static async mlbGetPlayerStatAverage(playerId: number): Promise<DBMlbPlayerGameStatAverages[]> {
    const taskRepo = remult.repo(DBMlbPlayerGameStatAverages)
    return await taskRepo.find({where: {playerId: playerId}})
  }

  @BackendMethod({ allowed: true })
  static async mlbGetPlayerStatAverageTop5(stat: string): Promise<DBMlbPlayerGameStatAverages[]> {
    const taskRepo = remult.repo(DBMlbPlayerGameStatAverages)
    var finalData: DBMlbPlayerGameStatAverages[] = []

    if(stat == "hits"){
      finalData = await taskRepo.find({orderBy: {batterHits: "desc"}, limit: 5})
    }
    else if(stat == "homeRuns"){
      finalData = await taskRepo.find({orderBy: {batterHomeRuns: "desc"}, limit: 5})
    }
    else if(stat == "rbis"){
      finalData = await taskRepo.find({orderBy: {batterRbis: "desc"}, limit: 5})
    }
    else if(stat == "pitcherStrikeouts"){
      finalData = await taskRepo.find({orderBy: {pitcherStrikeouts: "desc"}, limit: 5})
    }
    else if(stat == "pitcherEarnedRuns"){
      finalData = await taskRepo.find({orderBy: {pitcherEarnedRuns: "asc"}, limit: 5})
    }
    return finalData
  }


  //team stat averages
  @BackendMethod({ allowed: true })
  static async mlbSetTeamStatAverage(stat: DbMlbTeamGameStatAverages) {
    const taskRepo = remult.repo(DbMlbTeamGameStatAverages)

    var teamStat = await taskRepo.find({where: {teamId: stat.teamId}})
    if(teamStat.length > 0){
      await taskRepo.delete(teamStat[0])
      await taskRepo.insert(stat)
    }
    else{
      await taskRepo.insert(stat)
    }
    
  }

  @BackendMethod({ allowed: true })
  static async mlbGetTeamStatAverage(teamId: number): Promise<DbMlbTeamGameStatAverages[]> {
    const taskRepo = remult.repo(DbMlbTeamGameStatAverages)
    return await taskRepo.find({where: {teamId: teamId}})    
  }

  @BackendMethod({ allowed: true })
  static async mlbGetTeamStatAverageTop5(stat: string): Promise<DbMlbTeamGameStatAverages[]> {
    const taskRepo = remult.repo(DbMlbTeamGameStatAverages)
    var finalData: DbMlbTeamGameStatAverages[] = []
    if(stat == "pointsScored"){
      finalData =  await taskRepo.find({orderBy: {pointsScoredOverall: "desc"}, limit: 5})
    }
    else if(stat == "wins"){
      finalData = await taskRepo.find({orderBy: {wins: "desc"}, limit: 5})
    }
    else if(stat == "pointsAllowed"){
      finalData = await taskRepo.find({orderBy: {pointsAllowedOverall: "asc"}, limit: 5})
    }
    return finalData
  }

  
}