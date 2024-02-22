import { Component, OnInit, afterRender } from '@angular/core';
import { SportsTitleToName } from '../sports-titel-to-name';
import { SelectedSportsData } from '../selected-sports-data';
import { GameId } from '../game-id';
import { PropData } from '../prop-data';
import { PlayerProp } from '../player-prop';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MlbPlayerid } from '../mlb-playerid';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { PropArray } from '../prop-array';
import { GamePropArray } from '../game-prop-array';
import { DateArray } from '../date-array';
import { SportPropArray } from '../sport-prop-array';
import { remult } from 'remult';
import { DbMlbPlayerInfo } from 'src/shared/dbTasks/DbMlbPlayerInfo';
import { MlbController } from 'src/shared/Controllers/MlbController';
import { ISportsBook } from '../isports-book';
import { DbGameBookData } from 'src/shared/dbTasks/DbGameBookData';
import { SportsBookController } from 'src/shared/Controllers/SportsBookController';
import { DbPlayerPropData } from 'src/shared/dbTasks/DbPlayerPropData';
import { PlayerPropController } from 'src/shared/Controllers/PlayerPropController';
import { DbNhlPlayerInfo } from 'src/shared/dbTasks/DbNhlPlayerInfo';
import { NhlPlayerInfoController } from 'src/shared/Controllers/NhlPlayerInfoController';
import { DbNhlPlayerGameStats } from 'src/shared/dbTasks/DbNhlPlayerGameStats';
import { NhlPlayerGameStatsController } from 'src/shared/Controllers/NhlPlayerGameStatsController';
import { nbaApiController } from '../ApiCalls/nbaApiCalls';
import { NbaPlayerInfoDb } from 'src/shared/dbTasks/NbaPlayerInfoDb';
import { NbaController } from 'src/shared/Controllers/NbaController';
import { SportsNameToId } from '../sports-name-to-id';
import { DbNbaGameStats } from 'src/shared/dbTasks/DbNbaGameStats';
import { nhlApiController } from '../ApiCalls/nhlApiCalls';
import { draftKingsApiController } from '../ApiCalls/draftKingsApiCalls';

import { ArrayOfDates } from '../array-of-dates';


import { ActivatedRoute, Route, Router } from '@angular/router';
import { DbNbaTeamLogos } from 'src/shared/dbTasks/DbNbaTeamLogos';
import { DbNbaTeamGameStats } from 'src/shared/dbTasks/DbNbaTeamGameStats';
import { reusedFunctions } from '../Services/reusedFunctions';

@Component({
  selector: 'app-prop-screen',
  templateUrl: './prop-screen.component.html',
  styleUrls: ['./prop-screen.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [nhlApiController],
})



export class PropScreenComponent implements OnInit {




  expandedElement: PlayerProp[] | null | undefined;


  public playerPropsClicked = false;
  public gamePropsClicked = true;

  home_team: string = '';
  away_team: string = '';

  public itemsInCheckout: number = 0;
  public checkoutArray: any[] = [];
  public playerPropButtonDisabled: boolean = false;

  public nbaCount: number = 0
  public sportsNew: any[] = [];
  public gameString: string = ''
  public selectedSport: any = '';
  public selectedDate: string = '';
  public selectedGame: any = '';
  public selectedGameid: string = '';
  public exit: boolean = true;
  public teamPropIsLoading: boolean = true;
  public spreadGameClicked: boolean = true;
  public spreadHalfClicked: boolean = false;
  public spreadQuarterClicked: boolean = false;
  public totalGameClicked: boolean = true;
  public totalHalfClicked: boolean = false;
  public totalQuarterClicked: boolean = false;
  public pointsScoredGameClicked: boolean = true;
  public pointsScoredHalfClicked: boolean = false;
  public pointsScoredQuarterClicked: boolean = false;
  public pointsAllowedGameClicked: boolean = true;
  public pointsAllowedHalfClicked: boolean = false;
  public pointsAllowedQuarterClicked: boolean = false;
  public moneylineGameClicked: boolean = true;
  public moneylineHalfClicked: boolean = false;
  public moneylineQuarterClicked: boolean = false;
  public moneyline2GameClicked: boolean = true;
  public moneyline2HalfClicked: boolean = false;
  public moneyline2QuarterClicked: boolean = false;
  public spread2GameClicked: boolean = true;
  public spread2HalfClicked: boolean = false;
  public spread2QuarterClicked: boolean = false;
  public total2GameClicked: boolean = true;
  public total2HalfClicked: boolean = false;
  public total2QuarterClicked: boolean = false;
  public pointsScored2GameClicked: boolean = true;
  public pointsScored2HalfClicked: boolean = false;
  public pointsScored2QuarterClicked: boolean = false;
  public pointsAllowed2GameClicked: boolean = true;
  public pointsAllowed2HalfClicked: boolean = false;
  public pointsAllowed2QuarterClicked: boolean = false;

  public team1GameVsOpponentData: any[] = []
  public displayProgressBar: boolean = false;




  date = new Date();

  //API strings
  pre_initial_prop = "https://api.the-odds-api.com/v4/sports/";
  post_initial_prop = "/odds/?apiKey=5ab6923d5aa0ae822b05168709bb910c&regions=us&markets=h2h,spreads,totals&bookmakers=draftkings&oddsFormat=american";

  pre_get_games = "https://api.the-odds-api.com/v4/sports/";
  post_get_games = "/scores?apiKey=5ab6923d5aa0ae822b05168709bb910c";

  displayedColumns: string[] = ['name', 'description', 'point', 'price', 'detailedStats'];
  displayedColumnsTeamGames: string[] = ['game', 'date', 'result'];
  displayedTeamAgainstColums: string[] = ["date", "result", "q1Points"];
  displayedTeamAgainstColums2: string[] = ["q2Points", "q3Points", "q4Points"];





  constructor(
    private http: HttpClient,
    private nhlApiController: nhlApiController,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }
  public notes: any = [];







  sports: any[] = [];
  playerProps: any;

  team1GameStatsDto = {
    gamesWon: 0,
    gamesLost: 0,
    gamesWonVsOpponent: 0,
    gamesLostVsOpponent: 0,
    gamesWonHome: 0,
    gamesLostHome: 0,
    gamesWonAway: 0,
    gamesLostAway: 0,
    halfOneWon: 0,
    halfOneLost: 0,
    halfTwoWon: 0,
    halfTwoLost: 0,
    quarterOneWon: 0,
    quarterOneLost: 0,
    quarterTwoWon: 0,
    quarterTwoLost: 0,
    quarterThreeWon: 0,
    quarterThreeLost: 0,
    quarterFourWon: 0,
    quarterFourLost: 0,
    halfOneWonVsOpponent: 0,
    halfOneLostVsOpponent: 0,
    halfTwoWonVsOpponent: 0,
    halfTwoLostVsOpponent: 0,
    quarterOneWonVsOpponent: 0,
    quarterOneLostVsOpponent: 0,
    quarterTwoWonVsOpponent: 0,
    quarterTwoLostVsOpponent: 0,
    quarterThreeWonVsOpponent: 0,
    quarterThreeLostVsOpponent: 0,
    quarterFourWonVsOpponent: 0,
    quarterFourLostVsOpponent: 0,
    halfOneWonHome: 0,
    halfOneLostHome: 0,
    halfOneWonAway: 0,
    halfOneLostAway: 0,
    halfTwoWonHome: 0,
    halfTwoLostHome: 0,
    halfTwoWonAway: 0,
    halfTwoLostAway: 0,
    quarterOneWonHome: 0,
    quarterOneLostHome: 0,
    quarterOneWonAway: 0,
    quarterOneLostAway: 0,
    quarterTwoWonHome: 0,
    quarterTwoLostHome: 0,
    quarterTwoWonAway: 0,
    quarterTwoLostAway: 0,
    quarterThreeWonHome: 0,
    quarterThreeLostHome: 0,
    quarterThreeWonAway: 0,
    quarterThreeLostAway: 0,
    quarterFourWonHome: 0,
    quarterFourLostHome: 0,
    quarterFourWonAway: 0,
    quarterFourLostAway: 0,
    spreadGame: 0,
    spreadFirstHalf: 0,
    spreadSecondHalf: 0,
    spreadFirstQuarter: 0,
    spreadSecondQuarter: 0,
    spreadThirdQuarter: 0,
    spreadFourthQuarter: 0,
    spreadVsOpponent: 0,
    spreadFirstHalfVsOpponent: 0,
    spreadSecondHalfVsOpponent: 0,
    spreadFirstQuarterVsOpponent: 0,
    spreadSecondQuarterVsOpponet: 0,
    spreadThirdQuarterVsOpponent: 0,
    spreadFourthQuarterVsOpponent: 0,
    spreadHome: 0,
    spreadHomeFirstHalf: 0,
    spreadHomeSecondHalf: 0,
    spreadHomeFirstQuarter: 0,
    spreadHomeSecondQuarter: 0,
    spreadHomeThirdQuarter: 0,
    spreadHomeFourthQuarter: 0,
    spreadAway: 0,
    spreadAwayFirstHalf: 0,
    spreadAwaySecondHalf: 0,
    spreadAwayFirstQuarter: 0,
    spreadAwaySecondQuarter: 0,
    spreadAwayThirdQuarter: 0,
    spreadAwayFourthQuarter: 0,
    totalOverall: 0,
    totalOverallFirstHalf: 0,
    totalOverallSecondHalf: 0,
    totalOverallFirstQuarter: 0,
    totalOverallSecondQuarter: 0,
    totalOverallThirdQuarter: 0,
    totalOverallFourthQuarter: 0,
    totalVsTeam: 0,
    totalVsTeamFirstHalf: 0,
    totalVsTeamSecondHalf: 0,
    totalVsTeamFirstQuarter: 0,
    totalVsTeamSecondQuarter: 0,
    totalVsTeamThirdQuarter: 0,
    totalVsTeamFourthQuarter: 0,
    totalHome: 0,
    totalHomeFirstHalf: 0,
    totalHomeSecondHalf: 0,
    totalHomeFirstQuarter: 0,
    totalHomeSecondQuarter: 0,
    totalHomeThirdQuarter: 0,
    totalHomeFourthQuarter: 0,
    totalAway: 0,
    totalAwayFirstHalf: 0,
    totalAwaySecondHalf: 0,
    totalAwayFirstQuarter: 0,
    totalAwaySecondQuarter: 0,
    totalAwayThirdQuarter: 0,
    totalAwayFourthQuarter: 0,
    pointsScoredOverallGame: 0,
    pointsScoredOverallFirstHalf: 0,
    pointsScoredOverallSecondHalf: 0,
    pointsScoredOverallFirstQuarter: 0,
    pointsScoredOverallSecondQuarter: 0,
    pointsScoredOverallThirdQuarter: 0,
    pointsScoredOverallFourthQuarter: 0,
    pointsScoredVsTeamGame: 0,
    pointsScoredVsTeamFirstHalf: 0,
    pointsScoredVsTeamSecondHalf: 0,
    pointsScoredVsTeamFirstQuarter: 0,
    pointsScoredVsTeamSecondQuarter: 0,
    pointsScoredVsTeamThirdQuarter: 0,
    pointsScoredVsTeamFourthQuarter: 0,
    pointsScoredHomeGame: 0,
    pointsScoredHomeFirstHalf: 0,
    pointsScoredHomeSecondHalf: 0,
    pointsScoredHomeFirstQuarter: 0,
    pointsScoredHomeSecondQuarter: 0,
    pointsScoredHomeThirdQuarter: 0,
    pointsScoredHomeFourthQuarter: 0,
    pointsScoredAwayGame: 0,
    pointsScoredAwayFirstHalf: 0,
    pointsScoredAwaySecondHalf: 0,
    pointsScoredAwayFirstQuarter: 0,
    pointsScoredAwaySecondQuarter: 0,
    pointsScoredAwayThirdQuarter: 0,
    pointsScoredAwayFourthQuarter: 0,
    pointsAllowedOverallGame: 0,
    pointsAllowedOverallFirstHalf: 0,
    pointsAllowedOverallSecondHalf: 0,
    pointsAllowedOverallFirstQuarter: 0,
    pointsAllowedOverallSecondQuarter: 0,
    pointsAllowedOverallThirdQuarter: 0,
    pointsAllowedOverallFourthQuarter: 0,
    pointsAllowedVsTeamGame: 0,
    pointsAllowedVsTeamFirstHalf: 0,
    pointsAllowedVsTeamSecondHalf: 0,
    pointsAllowedVsTeamFirstQuarter: 0,
    pointsAllowedVsTeamSecondQuarter: 0,
    pointsAllowedVsTeamThirdQuarter: 0,
    pointsAllowedVsTeamFourthQuarter: 0,
    pointsAllowedHomeGame: 0,
    pointsAllowedHomeFirstHalf: 0,
    pointsAllowedHomeSecondHalf: 0,
    pointsAllowedHomeFirstQuarter: 0,
    pointsAllowedHomeSecondQuarter: 0,
    pointsAllowedHomeThirdQuarter: 0,
    pointsAllowedHomeFourthQuarter: 0,
    pointsAllowedAwayGame: 0,
    pointsAllowedAwayFirstHalf: 0,
    pointsAllowedAwaySecondHalf: 0,
    pointsAllowedAwayFirstQuarter: 0,
    pointsAllowedAwaySecondQuarter: 0,
    pointsAllowedAwayThirdQuarter: 0,
    pointsAllowedAwayFourthQuarter: 0,
  }
  team2GameStatsDto = {
    gamesWon: 0,
    gamesLost: 0,
    gamesWonVsOpponent: 0,
    gamesLostVsOpponent: 0,
    gamesWonHome: 0,
    gamesLostHome: 0,
    gamesWonAway: 0,
    gamesLostAway: 0,
    halfOneWon: 0,
    halfOneLost: 0,
    halfTwoWon: 0,
    halfTwoLost: 0,
    quarterOneWon: 0,
    quarterOneLost: 0,
    quarterTwoWon: 0,
    quarterTwoLost: 0,
    quarterThreeWon: 0,
    quarterThreeLost: 0,
    quarterFourWon: 0,
    quarterFourLost: 0,
    halfOneWonVsOpponent: 0,
    halfOneLostVsOpponent: 0,
    halfTwoWonVsOpponent: 0,
    halfTwoLostVsOpponent: 0,
    quarterOneWonVsOpponent: 0,
    quarterOneLostVsOpponent: 0,
    quarterTwoWonVsOpponent: 0,
    quarterTwoLostVsOpponent: 0,
    quarterThreeWonVsOpponent: 0,
    quarterThreeLostVsOpponent: 0,
    quarterFourWonVsOpponent: 0,
    quarterFourLostVsOpponent: 0,
    halfOneWonHome: 0,
    halfOneLostHome: 0,
    halfOneWonAway: 0,
    halfOneLostAway: 0,
    halfTwoWonHome: 0,
    halfTwoLostHome: 0,
    halfTwoWonAway: 0,
    halfTwoLostAway: 0,
    quarterOneWonHome: 0,
    quarterOneLostHome: 0,
    quarterOneWonAway: 0,
    quarterOneLostAway: 0,
    quarterTwoWonHome: 0,
    quarterTwoLostHome: 0,
    quarterTwoWonAway: 0,
    quarterTwoLostAway: 0,
    quarterThreeWonHome: 0,
    quarterThreeLostHome: 0,
    quarterThreeWonAway: 0,
    quarterThreeLostAway: 0,
    quarterFourWonHome: 0,
    quarterFourLostHome: 0,
    quarterFourWonAway: 0,
    quarterFourLostAway: 0,
    spreadGame: 0,
    spreadFirstHalf: 0,
    spreadSecondHalf: 0,
    spreadFirstQuarter: 0,
    spreadSecondQuarter: 0,
    spreadThirdQuarter: 0,
    spreadFourthQuarter: 0,
    spreadVsOpponent: 0,
    spreadFirstHalfVsOpponent: 0,
    spreadSecondHalfVsOpponent: 0,
    spreadFirstQuarterVsOpponent: 0,
    spreadSecondQuarterVsOpponet: 0,
    spreadThirdQuarterVsOpponent: 0,
    spreadFourthQuarterVsOpponent: 0,
    spreadHome: 0,
    spreadHomeFirstHalf: 0,
    spreadHomeSecondHalf: 0,
    spreadHomeFirstQuarter: 0,
    spreadHomeSecondQuarter: 0,
    spreadHomeThirdQuarter: 0,
    spreadHomeFourthQuarter: 0,
    spreadAway: 0,
    spreadAwayFirstHalf: 0,
    spreadAwaySecondHalf: 0,
    spreadAwayFirstQuarter: 0,
    spreadAwaySecondQuarter: 0,
    spreadAwayThirdQuarter: 0,
    spreadAwayFourthQuarter: 0,
    totalOverall: 0,
    totalOverallFirstHalf: 0,
    totalOverallSecondHalf: 0,
    totalOverallFirstQuarter: 0,
    totalOverallSecondQuarter: 0,
    totalOverallThirdQuarter: 0,
    totalOverallFourthQuarter: 0,
    totalVsTeam: 0,
    totalVsTeamFirstHalf: 0,
    totalVsTeamSecondHalf: 0,
    totalVsTeamFirstQuarter: 0,
    totalVsTeamSecondQuarter: 0,
    totalVsTeamThirdQuarter: 0,
    totalVsTeamFourthQuarter: 0,
    totalHome: 0,
    totalHomeFirstHalf: 0,
    totalHomeSecondHalf: 0,
    totalHomeFirstQuarter: 0,
    totalHomeSecondQuarter: 0,
    totalHomeThirdQuarter: 0,
    totalHomeFourthQuarter: 0,
    totalAway: 0,
    totalAwayFirstHalf: 0,
    totalAwaySecondHalf: 0,
    totalAwayFirstQuarter: 0,
    totalAwaySecondQuarter: 0,
    totalAwayThirdQuarter: 0,
    totalAwayFourthQuarter: 0,
    pointsScoredOverallGame: 0,
    pointsScoredOverallFirstHalf: 0,
    pointsScoredOverallSecondHalf: 0,
    pointsScoredOverallFirstQuarter: 0,
    pointsScoredOverallSecondQuarter: 0,
    pointsScoredOverallThirdQuarter: 0,
    pointsScoredOverallFourthQuarter: 0,
    pointsScoredVsTeamGame: 0,
    pointsScoredVsTeamFirstHalf: 0,
    pointsScoredVsTeamSecondHalf: 0,
    pointsScoredVsTeamFirstQuarter: 0,
    pointsScoredVsTeamSecondQuarter: 0,
    pointsScoredVsTeamThirdQuarter: 0,
    pointsScoredVsTeamFourthQuarter: 0,
    pointsScoredHomeGame: 0,
    pointsScoredHomeFirstHalf: 0,
    pointsScoredHomeSecondHalf: 0,
    pointsScoredHomeFirstQuarter: 0,
    pointsScoredHomeSecondQuarter: 0,
    pointsScoredHomeThirdQuarter: 0,
    pointsScoredHomeFourthQuarter: 0,
    pointsScoredAwayGame: 0,
    pointsScoredAwayFirstHalf: 0,
    pointsScoredAwaySecondHalf: 0,
    pointsScoredAwayFirstQuarter: 0,
    pointsScoredAwaySecondQuarter: 0,
    pointsScoredAwayThirdQuarter: 0,
    pointsScoredAwayFourthQuarter: 0,
    pointsAllowedOverallGame: 0,
    pointsAllowedOverallFirstHalf: 0,
    pointsAllowedOverallSecondHalf: 0,
    pointsAllowedOverallFirstQuarter: 0,
    pointsAllowedOverallSecondQuarter: 0,
    pointsAllowedOverallThirdQuarter: 0,
    pointsAllowedOverallFourthQuarter: 0,
    pointsAllowedVsTeamGame: 0,
    pointsAllowedVsTeamFirstHalf: 0,
    pointsAllowedVsTeamSecondHalf: 0,
    pointsAllowedVsTeamFirstQuarter: 0,
    pointsAllowedVsTeamSecondQuarter: 0,
    pointsAllowedVsTeamThirdQuarter: 0,
    pointsAllowedVsTeamFourthQuarter: 0,
    pointsAllowedHomeGame: 0,
    pointsAllowedHomeFirstHalf: 0,
    pointsAllowedHomeSecondHalf: 0,
    pointsAllowedHomeFirstQuarter: 0,
    pointsAllowedHomeSecondQuarter: 0,
    pointsAllowedHomeThirdQuarter: 0,
    pointsAllowedHomeFourthQuarter: 0,
    pointsAllowedAwayGame: 0,
    pointsAllowedAwayFirstHalf: 0,
    pointsAllowedAwaySecondHalf: 0,
    pointsAllowedAwayFirstQuarter: 0,
    pointsAllowedAwaySecondQuarter: 0,
    pointsAllowedAwayThirdQuarter: 0,
    pointsAllowedAwayFourthQuarter: 0,
  }
  team1GameStats: DbNbaTeamGameStats[] = []
  team2GameStats: DbNbaTeamGameStats[] = []



  playerPropsArray: PlayerProp[] = [{
    name: '',
    id: '',
    description: '',
    price: '',
    point: '',
    event: '',
    isDisabled: false,
    percentTotal: '',
    percentTeam: '',
    avgTotal: '',
    avgTeam: '',
    team1: '',
    team2: '',
    isOpened: false,
    teamAgainst: '',
    averageDifferential: '',
    gamesPlayed: "",
    gamesPlayedvsTeam: "",
    average2022: "",
    average2022vsTeam: ""
  }];
  mlbPlayerId: MlbPlayerid[] = [{
    Name: '',
    Id: '',
    teamName: '',
    teamId: ''
  }]
  playerPropObjectArray: any[] = [];
  public dates: string[] = [];
  public games: GameId[] = [];

  public displayPropHtml1: PropData =
    {
      name: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: '',
      primaryColor: '',
      alternateColor: ''
    };
  public displayPropHtml2: PropData =
    {
      name: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: '',
      primaryColor: '',
      alternateColor: ''
    };

  public selectedTab: number =0;
  listOfSupportedSports: string[] = ["NBA"];
  sportsToTitle: SportsTitleToName = {
    NBA: "basketball_nba",
    NFL: "americanfootball_nfl",
    MLB: "baseball_mlb",
    NHL: "icehockey_nhl"
  }
  postDateSelectedSportGames = {};
  selectedSportsDates: string[] = [];
  selectedSportGames: any[] = [];
  selectedSportGamesFinal: any[] = [];
  selectedSportsData: any;

  playerInfoTemp: DbMlbPlayerInfo[] = []
  playerInfoFinal: DbMlbPlayerInfo[] = []
  gamePropData: ISportsBook[] = []
  sportsBookData: DbGameBookData[] = []
  sportsBookDataFinal: DbGameBookData[] = []
  playerPropData: DbPlayerPropData[] = []
  playerPropDataFinal: DbPlayerPropData[] = []
  nhlPlayerInfo: DbNhlPlayerInfo[] = []
  nhlPlayerInfoFinal: DbNhlPlayerInfo[] = []
  playerInfo: any
  playerStatData: any
  nhlPlayerStatData: DbNhlPlayerGameStats[] = []
  nhlPlayerStatDataFinal: DbNhlPlayerGameStats[] = []
  nhlPlayerStatData2022Final: DbNhlPlayerGameStats[] = []
  nhlPlayerStatData2023Final: DbNhlPlayerGameStats[] = []
  nbaPlayerStatData: DbNbaGameStats[] = []
  nbaPlayerStatDataFinal: DbNbaGameStats[] = []
  nbaPlayerStatData2022Final: DbNbaGameStats[] = []
  nbaPlayerStatData2023Final: DbNbaGameStats[] = []


  initializeSport(): void {
    if (this.route.snapshot.paramMap.get('sport') != null) {
      this.selectedSport = this.route.snapshot.paramMap.get('sport')
    }
    if (this.route.snapshot.paramMap.get('game') != null) {

      //this.selectedGame = this.route.params.subscribe((newPathParams) => console.log(newPathParams));
      this.selectedGame = this.route.snapshot.paramMap.get('game')
    }
  }
  

  async getGames() {
    if (this.selectedGame == '') {
      this.selectedSportGames = await SportsBookController.loadSportBook(this.selectedSport)
      var distinctGames = this.selectedSportGames.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.selectedSportGames.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          teamArray.push(allOfTeam)
        })
        teamArray[0].selected = false;
        this.selectedSportGamesFinal.push(teamArray)
      })
      this.selectedGame = this.selectedSportGamesFinal[0][0][0].bookId
      this.selectedSportGamesFinal[0][0].selected = true;
      this.router.navigate([`/props/${this.selectedSport}/${this.selectedGame}`])
    }
    else {
      this.selectedSportGames = await SportsBookController.loadSportBook(this.selectedSport)
      var distinctGames = this.selectedSportGames.map(game => game.bookId).filter((value, index, array) => array.indexOf(value) === index)
      distinctGames.forEach(book => {
        let allOfBook = this.selectedSportGames.filter(e => e.bookId == book)
        var distinctTeams = allOfBook.map(team => team.teamName).filter((value, index, array) => array.indexOf(value) === index)
        let teamArray: any[] = []
        distinctTeams.forEach(team => {
          let allOfTeam = allOfBook.filter(e => e.teamName == team)
          teamArray.push(allOfTeam)
        })
        teamArray[0].selected = false;
        this.selectedSportGamesFinal.push(teamArray)
      })
      let currentGame = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
      currentGame[0][0].selected = true;
      
    }
    await this.onGameClick(this.selectedGame)
  }

  /* public trimSports(sports: any) {
    //need to figure out a way to order the sports but for now just show the main ones

    sports.forEach((sport: { title: string; }) => {
      this.listOfSupportedSports.forEach(s => {
        if (sport.title == s) {
          this.sportsNew.push(sport);
        }
      })
    });
    this.selectedSport = this.sportsNew[0].title;
  } */

  setSelectedDate(date: string) {
    this.selectedDate = date;
  }
  setSelectedSport(sport: string) {
    this.selectedSport = sport;
  }
  setSelectedGame(game: string) {
    this.selectedGame = game
  }




  /* async onSportClick(sport: any) {
    this.selectedDate = ''
    this.setSelectedSport(sport.tab.textLabel);
    //await this.checkSportPlayerInfoDb();
    //await this.checkPlayerInfoDb();
    this.sportsBookDataFinal = await SportsBookController.loadSportBook(this.selectedSport)
    //await this.checkSportsBookDb();

    this.updateDates();




  } */
  /* onDateClick(date: any) {
    this.setSelectedDate(date.tab.textLabel);
    this.updateGames();
  } */
  async onGameClick(game: string) {
      this.setSelectedGame(game);
      /* this.router.navigate(
        [], 
        {
          relativeTo: this.route,
          queryParams:  this.selectedGame,
          queryParamsHandling: 'merge'
        }
      ); */
      this.router.navigate([`/props/${this.selectedSport}/${this.selectedGame}`])
      this.selectedSportGamesFinal.forEach(e => e[0].selected = false)
      let selectedGame = this.selectedSportGamesFinal.filter(e => e[0][0].bookId == this.selectedGame)
      selectedGame[0][0].selected = true
      
    
      this.playerPropsClicked = false;
      this.gamePropsClicked = true;
      this.displayProp();
    

  }





  //adding items to checkout
  addPropToChechout(event: any) {
  }
  addItemToCheckout(event: any) {
    event.isDisabled = true;
    //var bestBets = this.findBestBetsFromEvent(event);
    //bestBets.forEach(element => {
    // this.checkoutArray.push(element);
    // });
    this.checkoutArray.push(event)


  }


  isExit(event: any) {
    this.checkoutArray.forEach((e) => e.isDisabled = false)
    this.checkoutArray = [];
  }
  getArrayLength(event: any) {
    this.checkoutArray = event;
  }

  findBestBetsFromEvent(event: any) {
    var bestBets: any = this.addBestBets(event);
    bestBets.forEach((element: any) => {
      this.checkoutArray.push(element);
    });
  }

  addBestBets(event: any): any[] {
    var bets: any[] = [];
    for (var i = 0; i < event.length; i++) {
      if ((parseFloat(event[i].percentTeam) >= .900) || (parseFloat(event[i].percentTotal) >= .950)) {
        bets.push(event[i]);
      }
    }
    return bets;
  }


  testFunc(event: any) {
  }

  convertSport(sport: any) {
    return this.sportsToTitle[sport];
  }



  updateDates() {
    this.dates = [];
    this.sportsBookDataFinal.forEach((x) => {
      console.log(x)
      console.log(reusedFunctions.convertDate(x.commenceTime))
      if (!this.dates.includes(reusedFunctions.convertDate(x.commenceTime))) {
        this.dates.push(reusedFunctions.convertDate(x.commenceTime));
      }
    });
    console.log(this.dates)
    this.setSelectedDate(this.dates[0])
    this.updateGames();
  }
  updateGames() {
    this.games = [];
    this.sportsBookDataFinal.forEach((x) => {
      if (this.selectedDate == reusedFunctions.convertDate(x.commenceTime)) {
        let check = this.games.filter((e) => e.id == x.bookId)
        if (check.length == 0) {
          this.games.push({ game: `${x.homeTeam} vs ${x.awayTeam}`, id: x.bookId });
        }

      }
    });
  }

  async displayProp() {
    this.teamPropIsLoading = true



    console.log("Here89")
    console.time("Display Prop")
    const tempProp = this.selectedSportGames.filter((x) => x.bookId == this.selectedGame);
    var name1 = '';
    var h2h = '';
    var spreadPoint = '';
    var spreadPrice = '';
    var totalPoint = '';
    var totalPrice = ''
    var teamInfo: DbNbaTeamLogos[] = []
    var logo = ''
    this.team1GameStats = []
    this.team2GameStats = []


    var team1 = tempProp.filter((e) => e.teamName == e.homeTeam)
    var team2 = tempProp.filter((e) => e.teamName == e.awayTeam)
    //var team1GameStats2023 = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(this.arrayOfNBATeams[this.addUnderScoreToName(team1[0].teamName)], 2023)
    /* if (team1GameStats2023.length == 0) {
      let result = await this.nbaApiController.loadTeamGameStats(this.arrayOfNBATeams[this.addUnderScoreToName(team1[0].teamName)], 2023)
      await NbaController.nbaAddTeamGameStats(result)
      this.team1GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(this.arrayOfNBATeams[this.addUnderScoreToName(team1[0].teamName)], 2023)
    }
    else if (team1GameStats2023.length > 0) {
      if (this.convertDate(team1GameStats2023[0].createdAt?.toString()!) != this.getMonthAndDay()) {
        let result = await this.nbaApiController.loadTeamGameStats(this.arrayOfNBATeams[this.addUnderScoreToName(team1[0].teamName)], 2023)
        await NbaController.nbaAddTeamGameStats(result)
        this.team1GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(this.arrayOfNBATeams[this.addUnderScoreToName(team1[0].teamName)], 2023)
      }
      else { */
    this.team1GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(reusedFunctions.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(team1[0].teamName)], 2023)
    //}

    //}

    //var team2GameStats2023 = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(this.arrayOfNBATeams[this.addUnderScoreToName(team2[0].teamName)], 2023)
    /* if (team2GameStats2023.length == 0) {
      let result = await this.nbaApiController.loadTeamGameStats(this.arrayOfNBATeams[this.addUnderScoreToName(team2[0].teamName)], 2023)
      await NbaController.nbaAddTeamGameStats(result)
      this.team2GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(this.arrayOfNBATeams[this.addUnderScoreToName(team2[0].teamName)], 2023)
    }
    else if (team2GameStats2023.length > 0) {
      if (this.convertDate(team2GameStats2023[0].createdAt?.toString()!) != this.getMonthAndDay()) {
        let result = await this.nbaApiController.loadTeamGameStats(this.arrayOfNBATeams[this.addUnderScoreToName(team2[0].teamName)], 2023)
        await NbaController.nbaAddTeamGameStats(result)
        this.team2GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(this.arrayOfNBATeams[this.addUnderScoreToName(team2[0].teamName)], 2023)
      }
      else { */
    this.team2GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(reusedFunctions.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(team2[0].teamName)], 2023)
    //}
    //}

    this.computeTeamsGameStats(this.team1GameStats, this.team2GameStats)


    name1 = team1[0].teamName;
    h2h = team1.filter((e) => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team1.filter((e) => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team1.filter((e) => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].point.toString();
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].price.toString();
    teamInfo = await NbaController.nbaGetLogoFromTeamName(name1)
    this.displayPropHtml1 = ({ name: name1, h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice, primaryColor: teamInfo[0].primaryColor, alternateColor: teamInfo[0].alternateColor });

    name1 = team2[0].teamName;
    h2h = team2.filter((e) => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team2.filter((e) => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team2.filter((e) => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].point.toString();
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].price.toString();
    teamInfo = await NbaController.nbaGetLogoFromTeamName(name1)
    this.displayPropHtml2 = ({ name: name1, h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice, primaryColor: teamInfo[0].primaryColor, alternateColor: teamInfo[0].alternateColor });
    console.timeEnd("Display Prop")
    this.teamPropIsLoading = false
  }

  computeTeamsGameStats(team1: DbNbaTeamGameStats[], team2: DbNbaTeamGameStats[]) {
    this.team1GameVsOpponentData = []
    this.team1GameStatsDto = {
      gamesWon: 0,
      gamesLost: 0,
      gamesWonVsOpponent: 0,
      gamesLostVsOpponent: 0,
      gamesWonHome: 0,
      gamesLostHome: 0,
      gamesWonAway: 0,
      gamesLostAway: 0,
      halfOneWon: 0,
      halfOneLost: 0,
      halfTwoWon: 0,
      halfTwoLost: 0,
      quarterOneWon: 0,
      quarterOneLost: 0,
      quarterTwoWon: 0,
      quarterTwoLost: 0,
      quarterThreeWon: 0,
      quarterThreeLost: 0,
      quarterFourWon: 0,
      quarterFourLost: 0,
      halfOneWonVsOpponent: 0,
      halfOneLostVsOpponent: 0,
      halfTwoWonVsOpponent: 0,
      halfTwoLostVsOpponent: 0,
      quarterOneWonVsOpponent: 0,
      quarterOneLostVsOpponent: 0,
      quarterTwoWonVsOpponent: 0,
      quarterTwoLostVsOpponent: 0,
      quarterThreeWonVsOpponent: 0,
      quarterThreeLostVsOpponent: 0,
      quarterFourWonVsOpponent: 0,
      quarterFourLostVsOpponent: 0,
      halfOneWonHome: 0,
      halfOneLostHome: 0,
      halfOneWonAway: 0,
      halfOneLostAway: 0,
      halfTwoWonHome: 0,
      halfTwoLostHome: 0,
      halfTwoWonAway: 0,
      halfTwoLostAway: 0,
      quarterOneWonHome: 0,
      quarterOneLostHome: 0,
      quarterOneWonAway: 0,
      quarterOneLostAway: 0,
      quarterTwoWonHome: 0,
      quarterTwoLostHome: 0,
      quarterTwoWonAway: 0,
      quarterTwoLostAway: 0,
      quarterThreeWonHome: 0,
      quarterThreeLostHome: 0,
      quarterThreeWonAway: 0,
      quarterThreeLostAway: 0,
      quarterFourWonHome: 0,
      quarterFourLostHome: 0,
      quarterFourWonAway: 0,
      quarterFourLostAway: 0,
      spreadGame: 0,
      spreadFirstHalf: 0,
      spreadSecondHalf: 0,
      spreadFirstQuarter: 0,
      spreadSecondQuarter: 0,
      spreadThirdQuarter: 0,
      spreadFourthQuarter: 0,
      spreadVsOpponent: 0,
      spreadFirstHalfVsOpponent: 0,
      spreadSecondHalfVsOpponent: 0,
      spreadFirstQuarterVsOpponent: 0,
      spreadSecondQuarterVsOpponet: 0,
      spreadThirdQuarterVsOpponent: 0,
      spreadFourthQuarterVsOpponent: 0,
      spreadHome: 0,
      spreadHomeFirstHalf: 0,
      spreadHomeSecondHalf: 0,
      spreadHomeFirstQuarter: 0,
      spreadHomeSecondQuarter: 0,
      spreadHomeThirdQuarter: 0,
      spreadHomeFourthQuarter: 0,
      spreadAway: 0,
      spreadAwayFirstHalf: 0,
      spreadAwaySecondHalf: 0,
      spreadAwayFirstQuarter: 0,
      spreadAwaySecondQuarter: 0,
      spreadAwayThirdQuarter: 0,
      spreadAwayFourthQuarter: 0,
      totalOverall: 0,
      totalOverallFirstHalf: 0,
      totalOverallSecondHalf: 0,
      totalOverallFirstQuarter: 0,
      totalOverallSecondQuarter: 0,
      totalOverallThirdQuarter: 0,
      totalOverallFourthQuarter: 0,
      totalVsTeam: 0,
      totalVsTeamFirstHalf: 0,
      totalVsTeamSecondHalf: 0,
      totalVsTeamFirstQuarter: 0,
      totalVsTeamSecondQuarter: 0,
      totalVsTeamThirdQuarter: 0,
      totalVsTeamFourthQuarter: 0,
      totalHome: 0,
      totalHomeFirstHalf: 0,
      totalHomeSecondHalf: 0,
      totalHomeFirstQuarter: 0,
      totalHomeSecondQuarter: 0,
      totalHomeThirdQuarter: 0,
      totalHomeFourthQuarter: 0,
      totalAway: 0,
      totalAwayFirstHalf: 0,
      totalAwaySecondHalf: 0,
      totalAwayFirstQuarter: 0,
      totalAwaySecondQuarter: 0,
      totalAwayThirdQuarter: 0,
      totalAwayFourthQuarter: 0,
      pointsScoredOverallGame: 0,
      pointsScoredOverallFirstHalf: 0,
      pointsScoredOverallSecondHalf: 0,
      pointsScoredOverallFirstQuarter: 0,
      pointsScoredOverallSecondQuarter: 0,
      pointsScoredOverallThirdQuarter: 0,
      pointsScoredOverallFourthQuarter: 0,
      pointsScoredVsTeamGame: 0,
      pointsScoredVsTeamFirstHalf: 0,
      pointsScoredVsTeamSecondHalf: 0,
      pointsScoredVsTeamFirstQuarter: 0,
      pointsScoredVsTeamSecondQuarter: 0,
      pointsScoredVsTeamThirdQuarter: 0,
      pointsScoredVsTeamFourthQuarter: 0,
      pointsScoredHomeGame: 0,
      pointsScoredHomeFirstHalf: 0,
      pointsScoredHomeSecondHalf: 0,
      pointsScoredHomeFirstQuarter: 0,
      pointsScoredHomeSecondQuarter: 0,
      pointsScoredHomeThirdQuarter: 0,
      pointsScoredHomeFourthQuarter: 0,
      pointsScoredAwayGame: 0,
      pointsScoredAwayFirstHalf: 0,
      pointsScoredAwaySecondHalf: 0,
      pointsScoredAwayFirstQuarter: 0,
      pointsScoredAwaySecondQuarter: 0,
      pointsScoredAwayThirdQuarter: 0,
      pointsScoredAwayFourthQuarter: 0,
      pointsAllowedOverallGame: 0,
      pointsAllowedOverallFirstHalf: 0,
      pointsAllowedOverallSecondHalf: 0,
      pointsAllowedOverallFirstQuarter: 0,
      pointsAllowedOverallSecondQuarter: 0,
      pointsAllowedOverallThirdQuarter: 0,
      pointsAllowedOverallFourthQuarter: 0,
      pointsAllowedVsTeamGame: 0,
      pointsAllowedVsTeamFirstHalf: 0,
      pointsAllowedVsTeamSecondHalf: 0,
      pointsAllowedVsTeamFirstQuarter: 0,
      pointsAllowedVsTeamSecondQuarter: 0,
      pointsAllowedVsTeamThirdQuarter: 0,
      pointsAllowedVsTeamFourthQuarter: 0,
      pointsAllowedHomeGame: 0,
      pointsAllowedHomeFirstHalf: 0,
      pointsAllowedHomeSecondHalf: 0,
      pointsAllowedHomeFirstQuarter: 0,
      pointsAllowedHomeSecondQuarter: 0,
      pointsAllowedHomeThirdQuarter: 0,
      pointsAllowedHomeFourthQuarter: 0,
      pointsAllowedAwayGame: 0,
      pointsAllowedAwayFirstHalf: 0,
      pointsAllowedAwaySecondHalf: 0,
      pointsAllowedAwayFirstQuarter: 0,
      pointsAllowedAwaySecondQuarter: 0,
      pointsAllowedAwayThirdQuarter: 0,
      pointsAllowedAwayFourthQuarter: 0,
    }
    this.team2GameStatsDto = {
      gamesWon: 0,
      gamesLost: 0,
      gamesWonVsOpponent: 0,
      gamesLostVsOpponent: 0,
      gamesWonHome: 0,
      gamesLostHome: 0,
      gamesWonAway: 0,
      gamesLostAway: 0,
      halfOneWon: 0,
      halfOneLost: 0,
      halfTwoWon: 0,
      halfTwoLost: 0,
      quarterOneWon: 0,
      quarterOneLost: 0,
      quarterTwoWon: 0,
      quarterTwoLost: 0,
      quarterThreeWon: 0,
      quarterThreeLost: 0,
      quarterFourWon: 0,
      quarterFourLost: 0,
      halfOneWonVsOpponent: 0,
      halfOneLostVsOpponent: 0,
      halfTwoWonVsOpponent: 0,
      halfTwoLostVsOpponent: 0,
      quarterOneWonVsOpponent: 0,
      quarterOneLostVsOpponent: 0,
      quarterTwoWonVsOpponent: 0,
      quarterTwoLostVsOpponent: 0,
      quarterThreeWonVsOpponent: 0,
      quarterThreeLostVsOpponent: 0,
      quarterFourWonVsOpponent: 0,
      quarterFourLostVsOpponent: 0,
      halfOneWonHome: 0,
      halfOneLostHome: 0,
      halfOneWonAway: 0,
      halfOneLostAway: 0,
      halfTwoWonHome: 0,
      halfTwoLostHome: 0,
      halfTwoWonAway: 0,
      halfTwoLostAway: 0,
      quarterOneWonHome: 0,
      quarterOneLostHome: 0,
      quarterOneWonAway: 0,
      quarterOneLostAway: 0,
      quarterTwoWonHome: 0,
      quarterTwoLostHome: 0,
      quarterTwoWonAway: 0,
      quarterTwoLostAway: 0,
      quarterThreeWonHome: 0,
      quarterThreeLostHome: 0,
      quarterThreeWonAway: 0,
      quarterThreeLostAway: 0,
      quarterFourWonHome: 0,
      quarterFourLostHome: 0,
      quarterFourWonAway: 0,
      quarterFourLostAway: 0,
      spreadGame: 0,
      spreadFirstHalf: 0,
      spreadSecondHalf: 0,
      spreadFirstQuarter: 0,
      spreadSecondQuarter: 0,
      spreadThirdQuarter: 0,
      spreadFourthQuarter: 0,
      spreadVsOpponent: 0,
      spreadFirstHalfVsOpponent: 0,
      spreadSecondHalfVsOpponent: 0,
      spreadFirstQuarterVsOpponent: 0,
      spreadSecondQuarterVsOpponet: 0,
      spreadThirdQuarterVsOpponent: 0,
      spreadFourthQuarterVsOpponent: 0,
      spreadHome: 0,
      spreadHomeFirstHalf: 0,
      spreadHomeSecondHalf: 0,
      spreadHomeFirstQuarter: 0,
      spreadHomeSecondQuarter: 0,
      spreadHomeThirdQuarter: 0,
      spreadHomeFourthQuarter: 0,
      spreadAway: 0,
      spreadAwayFirstHalf: 0,
      spreadAwaySecondHalf: 0,
      spreadAwayFirstQuarter: 0,
      spreadAwaySecondQuarter: 0,
      spreadAwayThirdQuarter: 0,
      spreadAwayFourthQuarter: 0,
      totalOverall: 0,
      totalOverallFirstHalf: 0,
      totalOverallSecondHalf: 0,
      totalOverallFirstQuarter: 0,
      totalOverallSecondQuarter: 0,
      totalOverallThirdQuarter: 0,
      totalOverallFourthQuarter: 0,
      totalVsTeam: 0,
      totalVsTeamFirstHalf: 0,
      totalVsTeamSecondHalf: 0,
      totalVsTeamFirstQuarter: 0,
      totalVsTeamSecondQuarter: 0,
      totalVsTeamThirdQuarter: 0,
      totalVsTeamFourthQuarter: 0,
      totalHome: 0,
      totalHomeFirstHalf: 0,
      totalHomeSecondHalf: 0,
      totalHomeFirstQuarter: 0,
      totalHomeSecondQuarter: 0,
      totalHomeThirdQuarter: 0,
      totalHomeFourthQuarter: 0,
      totalAway: 0,
      totalAwayFirstHalf: 0,
      totalAwaySecondHalf: 0,
      totalAwayFirstQuarter: 0,
      totalAwaySecondQuarter: 0,
      totalAwayThirdQuarter: 0,
      totalAwayFourthQuarter: 0,
      pointsScoredOverallGame: 0,
      pointsScoredOverallFirstHalf: 0,
      pointsScoredOverallSecondHalf: 0,
      pointsScoredOverallFirstQuarter: 0,
      pointsScoredOverallSecondQuarter: 0,
      pointsScoredOverallThirdQuarter: 0,
      pointsScoredOverallFourthQuarter: 0,
      pointsScoredVsTeamGame: 0,
      pointsScoredVsTeamFirstHalf: 0,
      pointsScoredVsTeamSecondHalf: 0,
      pointsScoredVsTeamFirstQuarter: 0,
      pointsScoredVsTeamSecondQuarter: 0,
      pointsScoredVsTeamThirdQuarter: 0,
      pointsScoredVsTeamFourthQuarter: 0,
      pointsScoredHomeGame: 0,
      pointsScoredHomeFirstHalf: 0,
      pointsScoredHomeSecondHalf: 0,
      pointsScoredHomeFirstQuarter: 0,
      pointsScoredHomeSecondQuarter: 0,
      pointsScoredHomeThirdQuarter: 0,
      pointsScoredHomeFourthQuarter: 0,
      pointsScoredAwayGame: 0,
      pointsScoredAwayFirstHalf: 0,
      pointsScoredAwaySecondHalf: 0,
      pointsScoredAwayFirstQuarter: 0,
      pointsScoredAwaySecondQuarter: 0,
      pointsScoredAwayThirdQuarter: 0,
      pointsScoredAwayFourthQuarter: 0,
      pointsAllowedOverallGame: 0,
      pointsAllowedOverallFirstHalf: 0,
      pointsAllowedOverallSecondHalf: 0,
      pointsAllowedOverallFirstQuarter: 0,
      pointsAllowedOverallSecondQuarter: 0,
      pointsAllowedOverallThirdQuarter: 0,
      pointsAllowedOverallFourthQuarter: 0,
      pointsAllowedVsTeamGame: 0,
      pointsAllowedVsTeamFirstHalf: 0,
      pointsAllowedVsTeamSecondHalf: 0,
      pointsAllowedVsTeamFirstQuarter: 0,
      pointsAllowedVsTeamSecondQuarter: 0,
      pointsAllowedVsTeamThirdQuarter: 0,
      pointsAllowedVsTeamFourthQuarter: 0,
      pointsAllowedHomeGame: 0,
      pointsAllowedHomeFirstHalf: 0,
      pointsAllowedHomeSecondHalf: 0,
      pointsAllowedHomeFirstQuarter: 0,
      pointsAllowedHomeSecondQuarter: 0,
      pointsAllowedHomeThirdQuarter: 0,
      pointsAllowedHomeFourthQuarter: 0,
      pointsAllowedAwayGame: 0,
      pointsAllowedAwayFirstHalf: 0,
      pointsAllowedAwaySecondHalf: 0,
      pointsAllowedAwayFirstQuarter: 0,
      pointsAllowedAwaySecondQuarter: 0,
      pointsAllowedAwayThirdQuarter: 0,
      pointsAllowedAwayFourthQuarter: 0,
    }
    var i
    team1.forEach(e => {
      e.result == "Win" ? this.team1GameStatsDto.gamesWon += 1 : this.team1GameStatsDto.gamesLost += 1
      e.teamAgainstId == team2[0].teamId ? (e.result == "Win" ? this.team1GameStatsDto.gamesWonVsOpponent += 1 : this.team1GameStatsDto.gamesLostVsOpponent += 1) : i = 0;
      e.homeOrAway == "Home" ? (e.result == "Win" ? this.team1GameStatsDto.gamesWonHome += 1 : this.team1GameStatsDto.gamesLostHome += 1) : (e.result == "Win" ? this.team1GameStatsDto.gamesWonAway += 1 : this.team1GameStatsDto.gamesLostAway += 1);
      e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDto.quarterOneWon += 1 : this.team1GameStatsDto.quarterOneLost += 1;
      e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDto.quarterTwoWon += 1 : this.team1GameStatsDto.quarterTwoLost += 1;
      e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDto.quarterThreeWon += 1 : this.team1GameStatsDto.quarterThreeLost += 1;
      e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDto.quarterFourWon += 1 : this.team1GameStatsDto.quarterFourLost += 1;
      (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDto.halfOneWon += 1 : this.team1GameStatsDto.halfOneLost += 1;
      (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDto.halfTwoWon += 1 : this.team1GameStatsDto.halfTwoLost += 1;
      this.team1GameStatsDto.spreadGame += (e.pointsAllowedOverall - e.pointsScoredOverall);
      this.team1GameStatsDto.spreadFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
      this.team1GameStatsDto.spreadSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
      this.team1GameStatsDto.spreadFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
      this.team1GameStatsDto.spreadSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
      this.team1GameStatsDto.spreadThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
      this.team1GameStatsDto.spreadFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
      this.team1GameStatsDto.totalOverall += e.pointsScoredOverall + e.pointsAllowedOverall;
      this.team1GameStatsDto.totalOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
      this.team1GameStatsDto.totalOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
      this.team1GameStatsDto.totalOverallFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
      this.team1GameStatsDto.totalOverallSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
      this.team1GameStatsDto.totalOverallThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
      this.team1GameStatsDto.totalOverallFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
      this.team1GameStatsDto.pointsScoredOverallGame += e.pointsScoredOverall
      this.team1GameStatsDto.pointsScoredOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
      this.team1GameStatsDto.pointsScoredOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
      this.team1GameStatsDto.pointsScoredOverallFirstQuarter += e.pointsScoredFirstQuarter
      this.team1GameStatsDto.pointsScoredOverallSecondQuarter += e.pointsScoredSecondQuarter
      this.team1GameStatsDto.pointsScoredOverallThirdQuarter += e.pointsScoredThirdQuarter
      this.team1GameStatsDto.pointsScoredOverallFourthQuarter += e.pointsScoredFourthQuarter
      this.team1GameStatsDto.pointsAllowedOverallGame += e.pointsAllowedOverall
      this.team1GameStatsDto.pointsAllowedOverallFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
      this.team1GameStatsDto.pointsAllowedOverallSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
      this.team1GameStatsDto.pointsAllowedOverallFirstQuarter += e.pointsAllowedFirstQuarter
      this.team1GameStatsDto.pointsAllowedOverallSecondQuarter += e.pointsAllowedSecondQuarter
      this.team1GameStatsDto.pointsAllowedOverallThirdQuarter += e.pointsAllowedThirdQuarter
      this.team1GameStatsDto.pointsAllowedOverallFourthQuarter += e.pointsAllowedFourthQuarter

      if (e.teamAgainstId == team2[0].teamId) {
        if (e.homeOrAway == "Home") {
          this.team1GameVsOpponentData.push({ data: e, homeOrAway: "home" })
        }
        else {
          this.team1GameVsOpponentData.push({ data: e, homeOrAway: "away" })
        }

        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDto.quarterOneWonVsOpponent += 1 : this.team1GameStatsDto.quarterOneLostVsOpponent += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDto.quarterTwoWonVsOpponent += 1 : this.team1GameStatsDto.quarterTwoLostVsOpponent += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDto.quarterThreeWonVsOpponent += 1 : this.team1GameStatsDto.quarterThreeLostVsOpponent += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDto.quarterFourWonVsOpponent += 1 : this.team1GameStatsDto.quarterFourLostVsOpponent += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDto.halfOneWonVsOpponent += 1 : this.team1GameStatsDto.halfOneLostVsOpponent += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDto.halfTwoWonVsOpponent += 1 : this.team1GameStatsDto.halfTwoLostVsOpponent += 1;
        this.team1GameStatsDto.spreadVsOpponent += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team1GameStatsDto.spreadFirstHalfVsOpponent += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team1GameStatsDto.spreadSecondHalfVsOpponent += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team1GameStatsDto.spreadFirstQuarterVsOpponent += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team1GameStatsDto.spreadSecondQuarterVsOpponet += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team1GameStatsDto.spreadThirdQuarterVsOpponent += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team1GameStatsDto.spreadFourthQuarterVsOpponent += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team1GameStatsDto.totalVsTeam += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team1GameStatsDto.totalVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDto.totalVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDto.totalVsTeamFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team1GameStatsDto.totalVsTeamSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDto.totalVsTeamThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team1GameStatsDto.totalVsTeamFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDto.pointsScoredVsTeamGame += e.pointsScoredOverall
        this.team1GameStatsDto.pointsScoredVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
        this.team1GameStatsDto.pointsScoredVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team1GameStatsDto.pointsScoredVsTeamFirstQuarter += e.pointsScoredFirstQuarter
        this.team1GameStatsDto.pointsScoredVsTeamSecondQuarter += e.pointsScoredSecondQuarter
        this.team1GameStatsDto.pointsScoredVsTeamThirdQuarter += e.pointsScoredThirdQuarter
        this.team1GameStatsDto.pointsScoredVsTeamFourthQuarter += e.pointsScoredFourthQuarter
        this.team1GameStatsDto.pointsAllowedVsTeamGame += e.pointsAllowedOverall
        this.team1GameStatsDto.pointsAllowedVsTeamFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team1GameStatsDto.pointsAllowedVsTeamSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team1GameStatsDto.pointsAllowedVsTeamFirstQuarter += e.pointsAllowedFirstQuarter
        this.team1GameStatsDto.pointsAllowedVsTeamSecondQuarter += e.pointsAllowedSecondQuarter
        this.team1GameStatsDto.pointsAllowedVsTeamThirdQuarter += e.pointsAllowedThirdQuarter
        this.team1GameStatsDto.pointsAllowedVsTeamFourthQuarter += e.pointsAllowedFourthQuarter
      }
      if (e.homeOrAway == "Home") {
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDto.quarterOneWonHome += 1 : this.team1GameStatsDto.quarterOneLostHome += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDto.quarterTwoWonHome += 1 : this.team1GameStatsDto.quarterTwoLostHome += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDto.quarterThreeWonHome += 1 : this.team1GameStatsDto.quarterThreeLostHome += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDto.quarterFourWonHome += 1 : this.team1GameStatsDto.quarterFourLostHome += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDto.halfOneWonHome += 1 : this.team1GameStatsDto.halfOneLostHome += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDto.halfTwoWonHome += 1 : this.team1GameStatsDto.halfTwoLostHome += 1;
        this.team1GameStatsDto.spreadHome += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team1GameStatsDto.spreadHomeFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team1GameStatsDto.spreadHomeSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team1GameStatsDto.spreadHomeFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team1GameStatsDto.spreadHomeSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team1GameStatsDto.spreadHomeThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team1GameStatsDto.spreadHomeFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team1GameStatsDto.totalHome += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team1GameStatsDto.totalHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDto.totalHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDto.totalHomeFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team1GameStatsDto.totalHomeSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDto.totalHomeThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team1GameStatsDto.totalHomeFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDto.pointsScoredHomeGame += e.pointsScoredOverall
        this.team1GameStatsDto.pointsScoredHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
        this.team1GameStatsDto.pointsScoredHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team1GameStatsDto.pointsScoredHomeFirstQuarter += e.pointsScoredFirstQuarter
        this.team1GameStatsDto.pointsScoredHomeSecondQuarter += e.pointsScoredSecondQuarter
        this.team1GameStatsDto.pointsScoredHomeThirdQuarter += e.pointsScoredThirdQuarter
        this.team1GameStatsDto.pointsScoredHomeFourthQuarter += e.pointsScoredFourthQuarter
        this.team1GameStatsDto.pointsAllowedHomeGame += e.pointsAllowedOverall
        this.team1GameStatsDto.pointsAllowedHomeFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team1GameStatsDto.pointsAllowedHomeSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team1GameStatsDto.pointsAllowedHomeFirstQuarter += e.pointsAllowedFirstQuarter
        this.team1GameStatsDto.pointsAllowedHomeSecondQuarter += e.pointsAllowedSecondQuarter
        this.team1GameStatsDto.pointsAllowedHomeThirdQuarter += e.pointsAllowedThirdQuarter
        this.team1GameStatsDto.pointsAllowedHomeFourthQuarter += e.pointsAllowedFourthQuarter

      }
      else if (e.homeOrAway == "Away") {
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDto.quarterOneWonAway += 1 : this.team1GameStatsDto.quarterOneLostAway += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDto.quarterTwoWonAway += 1 : this.team1GameStatsDto.quarterTwoLostAway += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDto.quarterThreeWonAway += 1 : this.team1GameStatsDto.quarterThreeLostAway += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDto.quarterFourWonAway += 1 : this.team1GameStatsDto.quarterFourLostAway += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDto.halfOneWonAway += 1 : this.team1GameStatsDto.halfOneLostAway += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDto.halfTwoWonAway += 1 : this.team1GameStatsDto.halfTwoLostAway += 1;
        this.team1GameStatsDto.spreadAway += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team1GameStatsDto.spreadAwayFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team1GameStatsDto.spreadAwaySecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team1GameStatsDto.spreadAwayFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team1GameStatsDto.spreadAwaySecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team1GameStatsDto.spreadAwayThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team1GameStatsDto.spreadAwayFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team1GameStatsDto.totalAway += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team1GameStatsDto.totalAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDto.totalAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDto.totalAwayFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team1GameStatsDto.totalAwaySecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDto.totalAwayThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team1GameStatsDto.totalAwayFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDto.pointsScoredAwayGame += e.pointsScoredOverall
        this.team1GameStatsDto.pointsScoredAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
        this.team1GameStatsDto.pointsScoredAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team1GameStatsDto.pointsScoredAwayFirstQuarter += e.pointsScoredFirstQuarter
        this.team1GameStatsDto.pointsScoredAwaySecondQuarter += e.pointsScoredSecondQuarter
        this.team1GameStatsDto.pointsScoredAwayThirdQuarter += e.pointsScoredThirdQuarter
        this.team1GameStatsDto.pointsScoredAwayFourthQuarter += e.pointsScoredFourthQuarter
        this.team1GameStatsDto.pointsAllowedAwayGame += e.pointsAllowedOverall
        this.team1GameStatsDto.pointsAllowedAwayFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team1GameStatsDto.pointsAllowedAwaySecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team1GameStatsDto.pointsAllowedAwayFirstQuarter += e.pointsAllowedFirstQuarter
        this.team1GameStatsDto.pointsAllowedAwaySecondQuarter += e.pointsAllowedSecondQuarter
        this.team1GameStatsDto.pointsAllowedAwayThirdQuarter += e.pointsAllowedThirdQuarter
        this.team1GameStatsDto.pointsAllowedAwayFourthQuarter += e.pointsAllowedFourthQuarter
      }


    })

    team2.forEach(e => {
      e.result == "Win" ? this.team2GameStatsDto.gamesWon += 1 : this.team2GameStatsDto.gamesLost += 1
      e.teamAgainstId == team1[0].teamId ? (e.result == "Win" ? this.team2GameStatsDto.gamesWonVsOpponent += 1 : this.team2GameStatsDto.gamesLostVsOpponent += 1) : i = 0;
      e.homeOrAway == "Home" ? (e.result == "Win" ? this.team2GameStatsDto.gamesWonHome += 1 : this.team2GameStatsDto.gamesLostHome += 1) : (e.result == "Win" ? this.team2GameStatsDto.gamesWonAway += 1 : this.team2GameStatsDto.gamesLostAway += 1);
      e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDto.quarterOneWon += 1 : this.team2GameStatsDto.quarterOneLost += 1;
      e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDto.quarterTwoWon += 1 : this.team2GameStatsDto.quarterTwoLost += 1;
      e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDto.quarterThreeWon += 1 : this.team2GameStatsDto.quarterThreeLost += 1;
      e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDto.quarterFourWon += 1 : this.team2GameStatsDto.quarterFourLost += 1;
      (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDto.halfOneWon += 1 : this.team2GameStatsDto.halfOneLost += 1;
      (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDto.halfTwoWon += 1 : this.team2GameStatsDto.halfTwoLost += 1;
      this.team2GameStatsDto.spreadGame += (e.pointsAllowedOverall - e.pointsScoredOverall);
      this.team2GameStatsDto.spreadFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
      this.team2GameStatsDto.spreadSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
      this.team2GameStatsDto.spreadFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
      this.team2GameStatsDto.spreadSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
      this.team2GameStatsDto.spreadThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
      this.team2GameStatsDto.spreadFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
      this.team2GameStatsDto.totalOverall += e.pointsScoredOverall + e.pointsAllowedOverall;
      this.team2GameStatsDto.totalOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
      this.team2GameStatsDto.totalOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
      this.team2GameStatsDto.totalOverallFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
      this.team2GameStatsDto.totalOverallSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
      this.team2GameStatsDto.totalOverallThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
      this.team2GameStatsDto.totalOverallFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
      this.team2GameStatsDto.pointsScoredOverallGame += e.pointsScoredOverall
      this.team2GameStatsDto.pointsScoredOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
      this.team2GameStatsDto.pointsScoredOverallFirstQuarter += e.pointsScoredFirstQuarter
      this.team2GameStatsDto.pointsScoredOverallSecondQuarter += e.pointsScoredSecondQuarter
      this.team2GameStatsDto.pointsScoredOverallThirdQuarter += e.pointsScoredThirdQuarter
      this.team2GameStatsDto.pointsScoredOverallFourthQuarter += e.pointsScoredFourthQuarter
      this.team2GameStatsDto.pointsAllowedOverallGame += e.pointsAllowedOverall
      this.team2GameStatsDto.pointsAllowedOverallFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
      this.team2GameStatsDto.pointsAllowedOverallSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
      this.team2GameStatsDto.pointsAllowedOverallFirstQuarter += e.pointsAllowedFirstQuarter
      this.team2GameStatsDto.pointsAllowedOverallSecondQuarter += e.pointsAllowedSecondQuarter
      this.team2GameStatsDto.pointsAllowedOverallThirdQuarter += e.pointsAllowedThirdQuarter
      this.team2GameStatsDto.pointsAllowedOverallFourthQuarter += e.pointsAllowedFourthQuarter
      if (e.teamAgainstId == team1[0].teamId) {
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDto.quarterOneWonVsOpponent += 1 : this.team2GameStatsDto.quarterOneLostVsOpponent += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDto.quarterTwoWonVsOpponent += 1 : this.team2GameStatsDto.quarterTwoLostVsOpponent += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDto.quarterThreeWonVsOpponent += 1 : this.team2GameStatsDto.quarterThreeLostVsOpponent += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDto.quarterFourWonVsOpponent += 1 : this.team2GameStatsDto.quarterFourLostVsOpponent += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDto.halfOneWonVsOpponent += 1 : this.team2GameStatsDto.halfOneLostVsOpponent += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDto.halfTwoWonVsOpponent += 1 : this.team2GameStatsDto.halfTwoLostVsOpponent += 1;
        this.team2GameStatsDto.spreadVsOpponent += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team2GameStatsDto.spreadFirstHalfVsOpponent += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team2GameStatsDto.spreadSecondHalfVsOpponent += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team2GameStatsDto.spreadFirstQuarterVsOpponent += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team2GameStatsDto.spreadSecondQuarterVsOpponet += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team2GameStatsDto.spreadThirdQuarterVsOpponent += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team2GameStatsDto.spreadFourthQuarterVsOpponent += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team2GameStatsDto.totalVsTeam += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team2GameStatsDto.totalVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDto.totalVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDto.totalVsTeamFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team2GameStatsDto.totalVsTeamSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDto.totalVsTeamThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team2GameStatsDto.totalVsTeamFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDto.pointsScoredVsTeamGame += e.pointsScoredOverall
        this.team2GameStatsDto.pointsScoredVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
        this.team2GameStatsDto.pointsScoredVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team2GameStatsDto.pointsScoredVsTeamFirstQuarter += e.pointsScoredFirstQuarter
        this.team2GameStatsDto.pointsScoredVsTeamSecondQuarter += e.pointsScoredSecondQuarter
        this.team2GameStatsDto.pointsScoredVsTeamThirdQuarter += e.pointsScoredThirdQuarter
        this.team2GameStatsDto.pointsScoredVsTeamFourthQuarter += e.pointsScoredFourthQuarter
        this.team2GameStatsDto.pointsAllowedVsTeamGame += e.pointsAllowedOverall
        this.team2GameStatsDto.pointsAllowedVsTeamFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team2GameStatsDto.pointsAllowedVsTeamSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team2GameStatsDto.pointsAllowedVsTeamFirstQuarter += e.pointsAllowedFirstQuarter
        this.team2GameStatsDto.pointsAllowedVsTeamSecondQuarter += e.pointsAllowedSecondQuarter
        this.team2GameStatsDto.pointsAllowedVsTeamThirdQuarter += e.pointsAllowedThirdQuarter
        this.team2GameStatsDto.pointsAllowedVsTeamFourthQuarter += e.pointsAllowedFourthQuarter
      }
      if (e.homeOrAway == "Home") {
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDto.quarterOneWonHome += 1 : this.team2GameStatsDto.quarterOneLostHome += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDto.quarterTwoWonHome += 1 : this.team2GameStatsDto.quarterTwoLostHome += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDto.quarterThreeWonHome += 1 : this.team2GameStatsDto.quarterThreeLostHome += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDto.quarterFourWonHome += 1 : this.team2GameStatsDto.quarterFourLostHome += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDto.halfOneWonHome += 1 : this.team2GameStatsDto.halfOneLostHome += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDto.halfTwoWonHome += 1 : this.team2GameStatsDto.halfTwoLostHome += 1;
        this.team2GameStatsDto.spreadHome += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team2GameStatsDto.spreadHomeFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team2GameStatsDto.spreadHomeSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team2GameStatsDto.spreadHomeFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team2GameStatsDto.spreadHomeSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team2GameStatsDto.spreadHomeThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team2GameStatsDto.spreadHomeFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team2GameStatsDto.totalHome += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team2GameStatsDto.totalHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDto.totalHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDto.totalHomeFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team2GameStatsDto.totalHomeSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDto.totalHomeThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team2GameStatsDto.totalHomeFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDto.pointsScoredHomeGame += e.pointsScoredOverall
        this.team2GameStatsDto.pointsScoredHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
        this.team2GameStatsDto.pointsScoredHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team2GameStatsDto.pointsScoredHomeFirstQuarter += e.pointsScoredFirstQuarter
        this.team2GameStatsDto.pointsScoredHomeSecondQuarter += e.pointsScoredSecondQuarter
        this.team2GameStatsDto.pointsScoredHomeThirdQuarter += e.pointsScoredThirdQuarter
        this.team2GameStatsDto.pointsScoredHomeFourthQuarter += e.pointsScoredFourthQuarter
        this.team2GameStatsDto.pointsAllowedHomeGame += e.pointsAllowedOverall
        this.team2GameStatsDto.pointsAllowedHomeFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team2GameStatsDto.pointsAllowedHomeSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team2GameStatsDto.pointsAllowedHomeFirstQuarter += e.pointsAllowedFirstQuarter
        this.team2GameStatsDto.pointsAllowedHomeSecondQuarter += e.pointsAllowedSecondQuarter
        this.team2GameStatsDto.pointsAllowedHomeThirdQuarter += e.pointsAllowedThirdQuarter
        this.team2GameStatsDto.pointsAllowedHomeFourthQuarter += e.pointsAllowedFourthQuarter

      }
      else if (e.homeOrAway == "Away") {
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDto.quarterOneWonAway += 1 : this.team2GameStatsDto.quarterOneLostAway += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDto.quarterTwoWonAway += 1 : this.team2GameStatsDto.quarterTwoLostAway += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDto.quarterThreeWonAway += 1 : this.team2GameStatsDto.quarterThreeLostAway += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDto.quarterFourWonAway += 1 : this.team2GameStatsDto.quarterFourLostAway += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDto.halfOneWonAway += 1 : this.team2GameStatsDto.halfOneLostAway += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDto.halfTwoWonAway += 1 : this.team2GameStatsDto.halfTwoLostAway += 1;
        this.team2GameStatsDto.spreadAway += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team2GameStatsDto.spreadAwayFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team2GameStatsDto.spreadAwaySecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team2GameStatsDto.spreadAwayFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team2GameStatsDto.spreadAwaySecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team2GameStatsDto.spreadAwayThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team2GameStatsDto.spreadAwayFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team2GameStatsDto.totalAway += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team2GameStatsDto.totalAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDto.totalAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDto.totalAwayFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team2GameStatsDto.totalAwaySecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDto.totalAwayThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team2GameStatsDto.totalAwayFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDto.pointsScoredAwayGame += e.pointsScoredOverall
        this.team2GameStatsDto.pointsScoredAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
        this.team2GameStatsDto.pointsScoredAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team2GameStatsDto.pointsScoredAwayFirstQuarter += e.pointsScoredFirstQuarter
        this.team2GameStatsDto.pointsScoredAwaySecondQuarter += e.pointsScoredSecondQuarter
        this.team2GameStatsDto.pointsScoredAwayThirdQuarter += e.pointsScoredThirdQuarter
        this.team2GameStatsDto.pointsScoredAwayFourthQuarter += e.pointsScoredFourthQuarter
        this.team2GameStatsDto.pointsAllowedAwayGame += e.pointsAllowedOverall
        this.team2GameStatsDto.pointsAllowedAwayFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team2GameStatsDto.pointsAllowedAwaySecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team2GameStatsDto.pointsAllowedAwayFirstQuarter += e.pointsAllowedFirstQuarter
        this.team2GameStatsDto.pointsAllowedAwaySecondQuarter += e.pointsAllowedSecondQuarter
        this.team2GameStatsDto.pointsAllowedAwayThirdQuarter += e.pointsAllowedThirdQuarter
        this.team2GameStatsDto.pointsAllowedAwayFourthQuarter += e.pointsAllowedFourthQuarter
      }
    })
  }

  moneylineGameToggled() {
    this.moneylineGameClicked = true;
    this.moneylineHalfClicked = false;
    this.moneylineQuarterClicked = false;

  }
  moneylineHalfToggled() {
    this.moneylineGameClicked = false;
    this.moneylineHalfClicked = true;
    this.moneylineQuarterClicked = false;
  }
  moneylineQuarterToggled() {
    this.moneylineGameClicked = false;
    this.moneylineHalfClicked = false;
    this.moneylineQuarterClicked = true;
  }
  spreadGameToggled() {
    this.spreadGameClicked = true;
    this.spreadHalfClicked = false;
    this.spreadQuarterClicked = false;

  }
  spreadHalfToggled() {
    this.spreadGameClicked = false;
    this.spreadHalfClicked = true;
    this.spreadQuarterClicked = false;
  }
  spreadQuarterToggled() {
    this.spreadGameClicked = false;
    this.spreadHalfClicked = false;
    this.spreadQuarterClicked = true;
  }

  totalGameToggled() {
    this.totalGameClicked = true;
    this.totalHalfClicked = false;
    this.totalQuarterClicked = false;

  }
  totalHalfToggled() {
    this.totalGameClicked = false;
    this.totalHalfClicked = true;
    this.totalQuarterClicked = false;
  }
  totalQuarterToggled() {
    this.totalGameClicked = false;
    this.totalHalfClicked = false;
    this.totalQuarterClicked = true;
  }

  pointsScoredGameToggled() {
    this.pointsScoredGameClicked = true;
    this.pointsScoredHalfClicked = false;
    this.pointsScoredQuarterClicked = false;

  }

  pointsScoredHalfToggled() {
    this.pointsScoredGameClicked = false;
    this.pointsScoredHalfClicked = true;
    this.pointsScoredQuarterClicked = false;
  }

  pointsScoredQuarterToggled() {
    this.pointsScoredGameClicked = false;
    this.pointsScoredHalfClicked = false;
    this.pointsScoredQuarterClicked = true;
  }

  pointsAllowedGameToggled() {
    this.pointsAllowedGameClicked = true;
    this.pointsAllowedHalfClicked = false;
    this.pointsAllowedQuarterClicked = false;
  }
  pointsAllowedHalfToggled() {
    this.pointsAllowedGameClicked = false;
    this.pointsAllowedHalfClicked = true;
    this.pointsAllowedQuarterClicked = false;
  }
  pointsAllowedQuarterToggled() {
    this.pointsAllowedGameClicked = false;
    this.pointsAllowedHalfClicked = false;
    this.pointsAllowedQuarterClicked = true;
  }


  moneyline2GameToggled() {
    this.moneyline2GameClicked = true;
    this.moneyline2HalfClicked = false;
    this.moneyline2QuarterClicked = false;


  }
  moneyline2HalfToggled() {
    this.moneyline2GameClicked = false;
    this.moneyline2HalfClicked = true;
    this.moneyline2QuarterClicked = false;
  }
  moneyline2QuarterToggled() {
    this.moneyline2GameClicked = false;
    this.moneyline2HalfClicked = false;
    this.moneyline2QuarterClicked = true;
  }
  spread2GameToggled() {
    this.spread2GameClicked = true;
    this.spread2HalfClicked = false;
    this.spread2QuarterClicked = false;


  }
  spread2HalfToggled() {
    this.spread2GameClicked = false;
    this.spread2HalfClicked = true;
    this.spread2QuarterClicked = false;
  }
  spread2QuarterToggled() {
    this.spread2GameClicked = false;
    this.spread2HalfClicked = false;
    this.spread2QuarterClicked = true;
  }

  total2GameToggled() {
    this.total2GameClicked = true;
    this.total2HalfClicked = false;
    this.total2QuarterClicked = false;

  }
  total2HalfToggled() {
    this.total2GameClicked = false;
    this.total2HalfClicked = true;
    this.total2QuarterClicked = false;
  }
  total2QuarterToggled() {
    this.total2GameClicked = false;
    this.total2HalfClicked = false;
    this.total2QuarterClicked = true;
  }
  pointsScored2GameToggled() {
    this.pointsScored2GameClicked = true;
    this.pointsScored2HalfClicked = false;
    this.pointsScored2QuarterClicked = false;

  }

  pointsScored2HalfToggled() {
    this.pointsScored2GameClicked = false;
    this.pointsScored2HalfClicked = true;
    this.pointsScored2QuarterClicked = false;
  }

  pointsScored2QuarterToggled() {
    this.pointsScored2GameClicked = false;
    this.pointsScored2HalfClicked = false;
    this.pointsScored2QuarterClicked = true;
  }

  pointsAllowed2GameToggled() {
    this.pointsAllowed2GameClicked = true;
    this.pointsAllowed2HalfClicked = false;
    this.pointsAllowed2QuarterClicked = false;
  }
  pointsAllowed2HalfToggled() {
    this.pointsAllowed2GameClicked = false;
    this.pointsAllowed2HalfClicked = true;
    this.pointsAllowed2QuarterClicked = false;
  }
  pointsAllowed2QuarterToggled() {
    this.pointsAllowed2GameClicked = false;
    this.pointsAllowed2HalfClicked = false;
    this.pointsAllowed2QuarterClicked = true;
  }







  splitGameString(game: string): string[] {
    var bothGames: string[] = []
    var temp = ''
    var vsIndex = 0;
    vsIndex = game.indexOf("vs")
    bothGames.push(game.slice(0, vsIndex - 1))
    bothGames.push(game.slice(vsIndex + 3, game.length))
    return bothGames
  }



  async onPropTypeClicked(event: any) {
    console.log(event)
    if (event.tab.textLabel == "Player Props") {
      this.gamePropsClicked = false
      await this.loadPlayerProps()
    }
    else if (event.tab.textLabel == "Game Props") {
      this.playerPropsClicked = false
      this.gamePropsClicked = true

    }
  }






  //API calls



  async loadPlayerProps() {
    if (this.playerPropsClicked == true) {
      this.playerPropsClicked = false;
      return;
    }
    this.playerPropsClicked = true;

    try {
      console.time("load player props")

      var results = await draftKingsApiController.getPlayerProps(this.selectedSport, this.selectedGame);
      if (results.length == 0) {
        alert("Player Props have not been added by Draft Kings yet")
      }
      else {
        await PlayerPropController.addPlayerPropData(results);
        await PlayerPropController.loadPlayerPropData(this.selectedSport, this.selectedGame).then(item => this.playerPropDataFinal = item)
        this.addplayerPropToArray();
      }


      console.timeEnd("load player props")
    } catch (error: any) {
      alert(error.message)
    }



  }








  addplayerPropToArray() {

    // takes the stream from the database and converts it to the objects for display
    console.time("add player prop to array")
    var differentPropTypes: any[] = []
    this.playerPropDataFinal.forEach((e) => {
      if (!differentPropTypes.includes(e.marketKey)) {
        differentPropTypes.push(e.marketKey)
      }
    })
    this.playerPropObjectArray = [];
    for (let j = 0; j < differentPropTypes.length; j++) {
      this.playerPropsArray = [];
      for (var u = 0; u < this.playerPropDataFinal.length; u++) {

        if (this.playerPropDataFinal[u].marketKey == differentPropTypes[j]) {
          var playerName = this.playerPropDataFinal[u].playerName
          playerName = playerName.replaceAll(".", "")
          this.playerPropsArray.push({
            name: playerName,
            id: '',
            description: this.playerPropDataFinal[u].description,
            price: this.playerPropDataFinal[u].price.toString(),
            point: this.playerPropDataFinal[u].point.toString(),
            event: this.removeUnderscoreFromPlayerProp(this.playerPropDataFinal[u].marketKey),
            isDisabled: false,
            percentTotal: "",
            percentTeam: "",
            avgTotal: "",
            avgTeam: "",
            team1: this.playerPropDataFinal[u].homeTeam,
            team2: this.playerPropDataFinal[u].awayTeam,
            isOpened: false,
            teamAgainst: '',
            averageDifferential: "",
            gamesPlayed: "",
            gamesPlayedvsTeam: "",
            average2022: "",
            average2022vsTeam: ""
          });


        }

      }
      this.playerPropObjectArray[j] = this.playerPropsArray;
    }
    this.playerProps = new MatTableDataSource(this.playerPropObjectArray);

    console.timeEnd("add player prop to array")

  }

  removeUnderscoreFromPlayerProp(prop: string): string {
    prop = prop.replaceAll("_", " ");
    return prop;
  }






  //add a button that can find the highest prop percentages out of the selected prop


  //Find a player stat api and create an interface and array of objects that stores the data for each player connected to team that way it can be easily accessed when needed to reference the stats

  public playerAverageForSeason: any = 0;
  public playerAverageVsTeam: any = 0;
  public playerPercentForSeason: any = 0;
  public playerPercentVsTeam: any = 0;
  public teamAgainst: string = '';
  public gamesPlayed: any = 0
  public gamesPlayedVsTeam: any = 0
  public playerId: any = 0
  public average2022: any = 0
  public average2022vsTeam: any = 0;
  public differential: any = 0;
  tempPlayerStatData: any[] = [{}];
  async getPlayerStatsForSeason(element: any) {
    if (element.percentTotal === "") {
      await this.getPlayerStatsForSeasonCall(element);
    }


  }

  async getPlayerStatsForSeasonCall(element: any) {

    try {

      /* if (this.selectedSport == "NHL") {
        for (let i = 0; i < element.length; i++) {
          let player = await NhlPlayerInfoController.nhlLoadPlayerInfoFromName(element[i].name)
          let db2022 = await this.nhlPlayerGameStatRepo.find({ where: { season: "20222023", playerId: player[0].playerId } })
          let db2023 = await this.nhlPlayerGameStatRepo.find({ where: { season: "20232024", playerId: player[0].playerId } })
          if (db2022.length == 0) {
            var results = await this.nhlApiController.loadNhl2022PlayerStatData(player[0].playerId)
            if (results.length == 0) {
              await NhlPlayerGameStatsController.nhlAddPlayerINfo2022BlankData(player[0].playerId, player[0].playerName);
            }
            else {
              await NhlPlayerGameStatsController.nhlAddPlayerINfo2022Data(results);
            }



            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2022FromId(player[0].playerId).then(item => this.nhlPlayerStatData2022Final = item)
          }
          else {
            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2022FromId(player[0].playerId).then(item => this.nhlPlayerStatData2022Final = item)
          }

          if (db2023.length == 0 || db2023[0].createdAt?.getDate() != this.date.getDate()) {
            var results = await this.nhlApiController.loadNhl2023PlayerStatData(player[0].playerId)
            await NhlPlayerGameStatsController.nhlAddPlayerINfo2023Data(results);

            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2023FromId(player[0].playerId).then(item => this.nhlPlayerStatData2023Final = item)

          }
          else {
            await NhlPlayerGameStatsController.nhlLoadPlayerInfo2023FromId(player[0].playerId).then(item => this.nhlPlayerStatData2023Final = item)

          }
          await this.computeStatForPlayer(element[i]);
        }
      } */
      if (this.selectedSport == "NBA") {
        var previousName = ''
        for (let i = 0; i < element.length; i++) {
          let playerName = element[i].name
          if (playerName == previousName) {
            await this.computeStatForPlayer(element[i])
            continue
          }
          let player = await NbaController.nbaLoadPlayerInfoFromName(element[i].name)
          if (player.length == 0) {
            alert(element[i].name + " is not in the player database")
          }
          await NbaController.nbaLoadPlayerStatsInfoFromIdAndSeason(player[0].playerId, 2023).then(item => this.nbaPlayerStatData2023Final = item)
          await this.computeStatForPlayer(element[i]);
          previousName = element[i].name
        }
      }
      this.displayProgressBar = false
    } catch (error: any) {
    }
  }



  async computeStatsForAllPlayersInProp(element: any) {
    this.displayProgressBar = true
    if (element[0].percentTeam == "") {
      await this.getPlayerStatsForSeasonCall(element)
    }



  }
  async computeStatForPlayer(element: any) {
    console.time("compute stat for player")
    //add this function to get called when the original elements get added to the interface
    //don't make the call each time. Make the call once then add it to an array then once they click again check to see if it's already stored
    this.playerAverageForSeason = 0;
    this.playerPercentForSeason = 0;
    this.playerAverageVsTeam = 0;
    this.playerPercentVsTeam = 0;
    this.teamAgainst = '';
    this.differential = 0;
    this.gamesPlayedVsTeam = 0
    this.playerId = 0
    this.average2022 = 0
    this.average2022vsTeam = 0
    var numberOfGamesStarted = 0;
    var numberOfGamesStartedVsTeam = 0;
    var numberOfGamesStartedVsTeam2022 = 0


    if (this.selectedSport == "MLB") {

      var resultArray = Object.keys(this.tempPlayerStatData).map((personNamedIndex: any) => {
        let newStatData = this.tempPlayerStatData[personNamedIndex];
        return newStatData;
      })
      var numberOfGamesStarted = 0;
      var numberOfGamesStartedVsTeam = 0;
      if (resultArray[0].team == this.getTeamName(element.team1)) {
        this.teamAgainst = this.getTeamName(element.team2)
      } else { this.teamAgainst = this.getTeamName(element.team1) }
      var d = new Date();
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = d.getDate().toString();
      if (day.length == 1) {
        day = "0" + day;
      }
      var fullDate = year + month + day;
      //add a check to get the prop variable to searc for, H, HR, TB etc
      var propCde = '';
      switch (element.event) {
        case "batter hits":
          propCde = "H";
          break;
        case "batter home runs":
          propCde = "HR"
          break;
        case "batter total bases":
          propCde = "TB";
          break;
      }
      for (let i = 0; i < resultArray.length; i++) {
        if (resultArray[i].started == "True") {

          var gameDate = resultArray[i].gameID.slice(0, 8);
          if (gameDate == fullDate) {
            continue;
          }
          numberOfGamesStarted++;
          this.playerAverageForSeason += parseInt(resultArray[i].Hitting[propCde]);
          if (element.name == "Over") {
            if (parseInt(resultArray[i].Hitting[propCde]) > element.point) {
              this.playerPercentForSeason++;
            }
          }
          else if (element.name == "Under") {
            if (parseInt(resultArray[i].Hitting[propCde]) < element.point) {
              this.playerPercentForSeason++;
            }
          }

          if (resultArray[i].gameID.includes(this.teamAgainst)) {
            numberOfGamesStartedVsTeam++;
            this.playerAverageVsTeam += parseInt(resultArray[i].Hitting[propCde]);
            if (element.name == "Over") {
              if (parseInt(resultArray[i].Hitting[propCde]) > element.point) {
                this.playerPercentVsTeam++;
              }
            }
            else if (element.name == "Under") {
              if (parseInt(resultArray[i].Hitting[propCde]) < element.point) {
                this.playerPercentVsTeam++;
              }
            }
          }

        }
      }
      if (numberOfGamesStarted == 0) {
        this.playerAverageForSeason = 0;
        this.playerPercentForSeason = 0;
      }
      else {
        this.playerAverageForSeason = (this.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
        this.playerPercentForSeason = (this.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
      }
      if (numberOfGamesStartedVsTeam == 0) {
        this.playerAverageVsTeam = 0;
        this.playerPercentVsTeam = 0;
      }
      else {
        this.playerAverageVsTeam = (this.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        this.playerPercentVsTeam = (this.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
      }
    }
    if (this.selectedSport == "NHL") {
      var teamName = this.nhlPlayerStatData2023Final[0].teamName
      if (teamName.includes(".")) {
        teamName = teamName.replaceAll(".", "")
      }
      this.teamAgainst = teamName == element.team1 ? element.team2 : element.team1


      var d = new Date();
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = d.getDate().toString();
      if (day.length == 1) {
        day = "0" + day;
      }
      var fullDate = year + month + day;
      //add a check to get the prop variable to searc for, H, HR, TB etc
      var propCde = '';
      switch (element.event) {
        case "player assists":
          propCde = "assists";
          break;
        case "player points":
          propCde = "points"
          break;
        case "player shots on goal":
          propCde = "shots";
          break;
      }
      numberOfGamesStarted = this.nhlPlayerStatData2023Final.length;
      this.nhlPlayerStatData2023Final.forEach((e: any) => {
        this.playerAverageForSeason += e[propCde]
        if (element.description == "Over") {
          if (parseInt(e[propCde]) > element.point) {
            this.playerPercentForSeason++;
          }
        }
        else if (element.description == "Under") {
          if (parseInt(e[propCde]) < element.point) {
            this.playerPercentForSeason++;
          }
        }
        if (e.teamAgainst == this.teamAgainst) {
          numberOfGamesStartedVsTeam++;
          this.playerAverageVsTeam += e[propCde];
          if (element.name == "Over") {
            if (e[propCde] > element.point) {
              this.playerPercentVsTeam++;
            }
          }
          else if (element.name == "Under") {
            if (e[propCde] < element.point) {
              this.playerPercentVsTeam++;
            }
          }
        }
      })

      this.nhlPlayerStatData2022Final.forEach((e: any) => {
        this.average2022 += e[propCde]
        if (e.teamAgainst == this.teamAgainst) {
          numberOfGamesStartedVsTeam2022++;
          this.average2022vsTeam += e[propCde];
        }
      })

      if (numberOfGamesStarted == 0) {
        this.playerAverageForSeason = 0;
        this.playerPercentForSeason = 0;
      }
      else {
        this.playerAverageForSeason = (this.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
        this.playerPercentForSeason = (this.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
      }
      if (numberOfGamesStartedVsTeam == 0) {
        this.playerAverageVsTeam = -1;
        this.playerPercentVsTeam = -1;
      }
      else {
        this.playerAverageVsTeam = (this.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        this.playerPercentVsTeam = (this.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
      }
      if (element.description == "Over") {
        this.differential = this.playerAverageForSeason / element.point
      }
      else if (element.description == "Under") {
        if (this.playerAverageForSeason == 0) {
          this.differential = 0;
        }
        else { this.differential = element.point / this.playerAverageForSeason }

      }
      this.gamesPlayedVsTeam = numberOfGamesStartedVsTeam
      if (this.average2022 > 0 && this.nhlPlayerStatData2022Final.length > 0) {
        this.average2022 = (this.average2022 / this.nhlPlayerStatData2022Final.length).toFixed(3)

      } else { this.average2022 = -1 }
      if (this.average2022vsTeam > 0 && this.nhlPlayerStatData2022Final.length > 0) {
        this.average2022vsTeam = (this.average2022vsTeam / numberOfGamesStartedVsTeam2022).toFixed(3)

      } else { this.average2022vsTeam = -1 }


    }
    if (this.selectedSport == "NBA") {
      let tempTeamName1 = element.team1
      let tempTeamName2 = element.team2
      if (tempTeamName1.includes(" ")) {
        tempTeamName1 = tempTeamName1.replaceAll(" ", "_")
      }
      if (tempTeamName2.includes(" ")) {
        tempTeamName2 = tempTeamName2.replaceAll(" ", "_")
      }
      //let teamId1 = this.arrayOfNBATeams[tempTeamName1]
      //let teamId2 = this.arrayOfNBATeams[tempTeamName2]
      //let playerId = await NbaController.nbaLoadPlayerInfoFromName(element.name)
      this.teamAgainst = reusedFunctions.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(element.team1)] == this.nbaPlayerStatData2023Final[0].teamId ? element.team2 : element.team1


      var d = new Date();
      var year = d.getFullYear().toString();
      var month = (d.getMonth() + 1).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      var day = d.getDate().toString();
      if (day.length == 1) {
        day = "0" + day;
      }
      var fullDate = year + month + day;
      //add a check to get the prop variable to searc for, H, HR, TB etc
      let propCde: any;
      switch (element.event) {
        case "player assists":
          propCde = "assists";
          break;
        case "player double double":
          propCde = "doubleDouble"
          break;
        case "player points":
          propCde = "points";
          break;
        case "player rebounds":
          propCde = "totReb";
          break;
        case "player threes":
          propCde = "tpm";
          break;
      }
      numberOfGamesStarted = this.nbaPlayerStatData2023Final.length;
      this.nbaPlayerStatData2023Final.forEach((e: any) => {
        this.playerAverageForSeason += e[propCde]
        if (element.description == "Over") {
          if (parseInt(e[propCde]) > element.point) {
            this.playerPercentForSeason++;
          }
        }
        else if (element.description == "Under") {
          if (parseInt(e[propCde]) < element.point) {
            this.playerPercentForSeason++;
          }
        }
        if (e.teamAgainst == this.teamAgainst) {
          numberOfGamesStartedVsTeam++;
          this.playerAverageVsTeam += e[propCde];
          if (element.name == "Over") {
            if (e[propCde] > element.point) {
              this.playerPercentVsTeam++;
            }
          }
          else if (element.name == "Under") {
            if (e[propCde] < element.point) {
              this.playerPercentVsTeam++;
            }
          }
        }
      })

      this.nbaPlayerStatData2022Final.forEach((e: any) => {
        this.average2022 += e[propCde]
        if (e.teamAgainst == this.teamAgainst) {
          numberOfGamesStartedVsTeam2022++;
          this.average2022vsTeam += e[propCde];
        }
      })

      if (numberOfGamesStarted == 0) {
        this.playerAverageForSeason = 0;
        this.playerPercentForSeason = 0;
      }
      else {
        this.playerAverageForSeason = (this.playerAverageForSeason / numberOfGamesStarted).toFixed(3);
        this.playerPercentForSeason = (this.playerPercentForSeason / numberOfGamesStarted).toFixed(3);
      }
      if (numberOfGamesStartedVsTeam == 0) {
        this.playerAverageVsTeam = -1;
        this.playerPercentVsTeam = -1;
      }
      else {
        this.playerAverageVsTeam = (this.playerAverageVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
        this.playerPercentVsTeam = (this.playerPercentVsTeam / numberOfGamesStartedVsTeam).toFixed(3);
      }
      if (element.description == "Over") {
        this.differential = this.playerAverageForSeason / element.point
      }
      else if (element.description == "Under") {
        if (this.playerAverageForSeason == 0) {
          this.differential = 0;
        }
        else { this.differential = element.point / this.playerAverageForSeason }

      }
      this.playerId = this.nbaPlayerStatData2023Final[0].playerId
      this.gamesPlayed = this.nbaPlayerStatData2023Final.length
      this.gamesPlayedVsTeam = numberOfGamesStartedVsTeam
      if (this.average2022 > 0 && this.nbaPlayerStatData2022Final.length > 0) {
        this.average2022 = (this.average2022 / this.nbaPlayerStatData2022Final.length).toFixed(3)

      } else { this.average2022 = -1 }
      if (this.average2022vsTeam > 0 && this.nbaPlayerStatData2022Final.length > 0) {
        this.average2022vsTeam = (this.average2022vsTeam / numberOfGamesStartedVsTeam2022).toFixed(3)

      } else { this.average2022vsTeam = -1 }
    }
    console.timeEnd("compute stat for player")
    this.updatePlayerPropArray(element);
  }

  updatePlayerPropArray(element: any) {
    console.time("update player prop array")
    element.avgTotal = this.playerAverageForSeason;
    element.percentTotal = this.playerPercentForSeason;
    element.percentTeam = this.playerPercentVsTeam;
    element.avgTeam = this.playerAverageVsTeam;
    element.teamAgainst = this.teamAgainst;
    element.averageDifferential = this.differential.toFixed(3);
    element.gamesPlayed = this.gamesPlayed;
    element.gamesPlayedVsTeam = this.gamesPlayedVsTeam;
    element.average2022 = this.average2022
    element.average2022vsTeam = this.average2022vsTeam
    element.id = this.playerId
    console.timeEnd("update player prop array")
  }

  playerNameSpanishConvert(list: DbMlbPlayerInfo[]): DbMlbPlayerInfo[] {
    var newList = list;
    for (let i = 0; i < newList.length; i++) {
      var name = newList[i].playerName;
      if (name.includes("á")) {
        name = name.replaceAll("á", "a")
      }
      if (name.includes("é")) {
        name = name.replaceAll("é", "e")
      }
      if (name.includes("í")) {
        name = name.replaceAll("í", "i")
      }
      if (name.includes("ñ")) {
        name = name.replaceAll("ñ", "n")
      }
      if (name.includes("ó")) {
        name = name.replaceAll("ó", "o")
      }
      if (name.includes("ú")) {
        name = name.replaceAll("ú", "u")
      }
      newList[i].playerName = name
    }
    return newList
  }

  async getMlbPlayerIds() {
    const url = 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com/getMLBPlayerList';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'b66301c5cdmsh89a2ce517c0ca87p1fe140jsne708007ee552',
        'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
      }
    };
    const response = await fetch(url, options);
    const result = await response.json();
    let temp = result.body
    temp.forEach((e: { playerID: any; longName: any; team: any; teamID: any; }) => this.playerInfoTemp.push({
      playerId: e.playerID,
      playerName: e.longName,
      teamName: e.team,
      teamId: e.teamID
    }))
    this.playerInfoTemp = this.playerNameSpanishConvert(this.playerInfoTemp);

  }

  getMlbPlayerIdFromName(name: string): any {
    var player = this.mlbPlayerId.filter(x => x.Name == name);
    return player[0].Id;
  }
  getTeamName(team: string): string {
    team = this.insertUnderscore(team);
    return reusedFunctions.arrayOfMLBTeams[team];
  }
  insertUnderscore(team: string): string {
    team = team.replaceAll(' ', '_');
    if (team.includes(".")) {
      team = team.replaceAll('.', '');
    }
    return team;
  }

  getDate(): string {
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = d.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    var fullDate = day + "/" + month + "/" + year;
    return fullDate
  }
  getMonthAndDay(): string {
    var d = new Date();
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = d.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    var fullDate = month + "/" + day;
    return fullDate
  }



  ngAfterContentInit(){
    console.log("Here5")
    this.selectedTab = 1;
  }
    ngAfterViewInit() {
      
      console.log("Here3")
    //this.onPropTypeClicked("Game Props")
    //this.trimSports(await draftKingsApiController.getSports());
    
    console.log("Here4")
  }
   ngOnInit() {
    console.log("Here1")
    this.initializeSport()
    this.getGames()
    console.log("Here2")
  }

  detailedStatsClicked(element: any) {
    this.router.navigate(["/playerStats/" + this.selectedSport + "/" + element.id])
  }

}

