import { Allow, BackendMethod, remult } from "remult"

import { DbGameBookData } from "../dbTasks/DbGameBookData";

export class SportsBookController {





  @BackendMethod({ allowed: true })
  static async addBookData(bookData: DbGameBookData[]) {
    const taskRepo = remult.repo(DbGameBookData)
      await taskRepo.insert(bookData)
  }

  @BackendMethod({ allowed: true })
  static async loadSportBook(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    let temp = new Date()
    let date = temp.toISOString()

    return await taskRepo.find({where: {sportTitle: sport, commenceTime:{ ">": date}  }, orderBy: {commenceTime: "asc"}})
  }


  @BackendMethod({ allowed: true })
  static async loadSportBookByH2H(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    let temp = new Date()
    let date = temp.toISOString()

    return await taskRepo.find({where: {sportTitle: sport, commenceTime:{ ">": date}, marketKey: "h2h"}, orderBy: {commenceTime: "asc"}})
  }

  @BackendMethod({ allowed: true })
  static async loadMaxBookSeqByBookId(bookId: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)

    return await taskRepo.find({where: DbGameBookData.bookIdFilter({bookId: bookId})})

    
  }

  @BackendMethod({ allowed: true })
  static async loadAllBookDataBySportAndMaxBookSeq(sport: string): Promise<DbGameBookData[]> {
    const taskRepo = remult.repo(DbGameBookData)
    return await taskRepo.find({where: DbGameBookData.allSportFilterByMAxBookSeq({sport: sport})})

    
  }
  
  

}