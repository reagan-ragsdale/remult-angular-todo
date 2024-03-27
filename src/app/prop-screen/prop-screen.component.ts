import { Component, HostListener, OnInit, TemplateRef, afterRender, inject } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MlbService } from '../Services/MlbService';

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

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    location.reload()
  }

  private modalService = inject(NgbModal);
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

  team1GameStatsDtoNBA = {
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
  team2GameStatsDtoNBA = {
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
  team1GameStatsDtoMLB = {}
  team2GameStatsDtoMLB = {}

  team1GameStatsDtoNHL = {}
  team2GameStatsDtoNHL = {}

  team1GameStatsDtoNFL = {}
  team2GameStatsDtoNFL = {}


  team1GameStats: any[] = []
  team2GameStats: any[] = []



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
      abvr: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: ''
    };
  public displayPropHtml2: PropData =
    {
      name: '',
      abvr: '',
      h2h: '',
      spreadPoint: '',
      spreadPrice: '',
      totalPoint: '',
      totalPrice: ''
    };

  public selectedTab: number = 0;
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
      //this.selectedGame = this.route.snapshot.paramMap.get('game')
      this.route.paramMap.subscribe(params => {
        this.selectedGame = params.get("game")
        this.router.navigate([`/props/${this.selectedSport}/${this.selectedGame}`])
      })
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
      if (this.selectedSport == 'MLB') {
        this.selectedSport = 'MLB Preseason'
      }
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
    var teamInfo: any[] = []
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
    if (this.selectedSport == "NBA") {
      this.team1GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(reusedFunctions.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(team1[0].teamName)], 2023)
      this.team2GameStats = await NbaController.nbaLoadTeamGameStatsByTeamIdAndSeason(reusedFunctions.arrayOfNBATeams[reusedFunctions.addUnderScoreToName(team2[0].teamName)], 2023)
    }
    else if (this.selectedSport == "MLB Preseason" || "MLB") {
      this.team1GameStats = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(MlbService.mlbTeamIds[reusedFunctions.addUnderScoreToName(team1[0].teamName)], 2023)
      this.team1GameStats = await MlbController.mlbGetTeamGameStatsByTeamIdAndSeason(MlbService.mlbTeamIds[reusedFunctions.addUnderScoreToName(team1[0].teamName)], 2023)
    }
    else if(this.selectedSport == "NHL"){

    }

    else if(this.selectedSport == "NFL"){

    }
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

   
    //}
    //}

    this.computeTeamsGameStats(this.team1GameStats, this.team2GameStats)


    name1 = team1[0].teamName;
    h2h = team1.filter((e) => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team1.filter((e) => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team1.filter((e) => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].point.toString();
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Over")[0].price.toString();
    this.displayPropHtml1 = ({ name: name1, abvr: reusedFunctions.addDash(name1), h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice});

    name1 = team2[0].teamName;
    h2h = team2.filter((e) => e.marketKey == "h2h")[0].price.toString();
    spreadPoint = team2.filter((e) => e.marketKey == "spreads")[0].point.toString();
    spreadPrice = team2.filter((e) => e.marketKey == "spreads")[0].price.toString();
    totalPoint = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].point.toString();
    totalPrice = tempProp.filter((e) => e.marketKey == "totals" && e.teamName == "Under")[0].price.toString();
    this.displayPropHtml2 = ({ name: name1, abvr: reusedFunctions.addDash(name1), h2h: h2h, spreadPoint: spreadPoint, spreadPrice: spreadPrice, totalPoint: totalPoint, totalPrice: totalPrice });
    console.timeEnd("Display Prop")
    this.teamPropIsLoading = false
  }

  computeTeamsGameStats(team1: any[], team2: any[]) {
    if (this.selectedSport) {
      this.team1GameVsOpponentData = []
      this.team1GameStatsDtoNBA = {
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
      this.team2GameStatsDtoNBA = {
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
        e.result == "Win" ? this.team1GameStatsDtoNBA.gamesWon += 1 : this.team1GameStatsDtoNBA.gamesLost += 1
        e.teamAgainstId == team2[0].teamId ? (e.result == "Win" ? this.team1GameStatsDtoNBA.gamesWonVsOpponent += 1 : this.team1GameStatsDtoNBA.gamesLostVsOpponent += 1) : i = 0;
        e.homeOrAway == "Home" ? (e.result == "Win" ? this.team1GameStatsDtoNBA.gamesWonHome += 1 : this.team1GameStatsDtoNBA.gamesLostHome += 1) : (e.result == "Win" ? this.team1GameStatsDtoNBA.gamesWonAway += 1 : this.team1GameStatsDtoNBA.gamesLostAway += 1);
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDtoNBA.quarterOneWon += 1 : this.team1GameStatsDtoNBA.quarterOneLost += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDtoNBA.quarterTwoWon += 1 : this.team1GameStatsDtoNBA.quarterTwoLost += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDtoNBA.quarterThreeWon += 1 : this.team1GameStatsDtoNBA.quarterThreeLost += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDtoNBA.quarterFourWon += 1 : this.team1GameStatsDtoNBA.quarterFourLost += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDtoNBA.halfOneWon += 1 : this.team1GameStatsDtoNBA.halfOneLost += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDtoNBA.halfTwoWon += 1 : this.team1GameStatsDtoNBA.halfTwoLost += 1;
        this.team1GameStatsDtoNBA.spreadGame += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team1GameStatsDtoNBA.spreadFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team1GameStatsDtoNBA.spreadSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team1GameStatsDtoNBA.spreadFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team1GameStatsDtoNBA.spreadSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team1GameStatsDtoNBA.spreadThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team1GameStatsDtoNBA.spreadFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team1GameStatsDtoNBA.totalOverall += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team1GameStatsDtoNBA.totalOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDtoNBA.totalOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDtoNBA.totalOverallFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team1GameStatsDtoNBA.totalOverallSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team1GameStatsDtoNBA.totalOverallThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team1GameStatsDtoNBA.totalOverallFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team1GameStatsDtoNBA.pointsScoredOverallGame += e.pointsScoredOverall
        this.team1GameStatsDtoNBA.pointsScoredOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallFirstQuarter += e.pointsScoredFirstQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallSecondQuarter += e.pointsScoredSecondQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallThirdQuarter += e.pointsScoredThirdQuarter
        this.team1GameStatsDtoNBA.pointsScoredOverallFourthQuarter += e.pointsScoredFourthQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallGame += e.pointsAllowedOverall
        this.team1GameStatsDtoNBA.pointsAllowedOverallFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallFirstQuarter += e.pointsAllowedFirstQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallSecondQuarter += e.pointsAllowedSecondQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallThirdQuarter += e.pointsAllowedThirdQuarter
        this.team1GameStatsDtoNBA.pointsAllowedOverallFourthQuarter += e.pointsAllowedFourthQuarter

        if (e.teamAgainstId == team2[0].teamId) {
          if (e.homeOrAway == "Home") {
            this.team1GameVsOpponentData.push({ data: e, homeOrAway: "home" })
          }
          else {
            this.team1GameVsOpponentData.push({ data: e, homeOrAway: "away" })
          }

          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDtoNBA.quarterOneWonVsOpponent += 1 : this.team1GameStatsDtoNBA.quarterOneLostVsOpponent += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDtoNBA.quarterTwoWonVsOpponent += 1 : this.team1GameStatsDtoNBA.quarterTwoLostVsOpponent += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDtoNBA.quarterThreeWonVsOpponent += 1 : this.team1GameStatsDtoNBA.quarterThreeLostVsOpponent += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDtoNBA.quarterFourWonVsOpponent += 1 : this.team1GameStatsDtoNBA.quarterFourLostVsOpponent += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDtoNBA.halfOneWonVsOpponent += 1 : this.team1GameStatsDtoNBA.halfOneLostVsOpponent += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDtoNBA.halfTwoWonVsOpponent += 1 : this.team1GameStatsDtoNBA.halfTwoLostVsOpponent += 1;
          this.team1GameStatsDtoNBA.spreadVsOpponent += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team1GameStatsDtoNBA.spreadFirstHalfVsOpponent += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team1GameStatsDtoNBA.spreadSecondHalfVsOpponent += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team1GameStatsDtoNBA.spreadFirstQuarterVsOpponent += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team1GameStatsDtoNBA.spreadSecondQuarterVsOpponet += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team1GameStatsDtoNBA.spreadThirdQuarterVsOpponent += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team1GameStatsDtoNBA.spreadFourthQuarterVsOpponent += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team1GameStatsDtoNBA.totalVsTeam += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team1GameStatsDtoNBA.totalVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team1GameStatsDtoNBA.totalVsTeamFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.pointsScoredVsTeamGame += e.pointsScoredOverall
          this.team1GameStatsDtoNBA.pointsScoredVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamFirstQuarter += e.pointsScoredFirstQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamSecondQuarter += e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamThirdQuarter += e.pointsScoredThirdQuarter
          this.team1GameStatsDtoNBA.pointsScoredVsTeamFourthQuarter += e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamGame += e.pointsAllowedOverall
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamFirstQuarter += e.pointsAllowedFirstQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamSecondQuarter += e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamThirdQuarter += e.pointsAllowedThirdQuarter
          this.team1GameStatsDtoNBA.pointsAllowedVsTeamFourthQuarter += e.pointsAllowedFourthQuarter
        }
        if (e.homeOrAway == "Home") {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDtoNBA.quarterOneWonHome += 1 : this.team1GameStatsDtoNBA.quarterOneLostHome += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDtoNBA.quarterTwoWonHome += 1 : this.team1GameStatsDtoNBA.quarterTwoLostHome += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDtoNBA.quarterThreeWonHome += 1 : this.team1GameStatsDtoNBA.quarterThreeLostHome += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDtoNBA.quarterFourWonHome += 1 : this.team1GameStatsDtoNBA.quarterFourLostHome += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDtoNBA.halfOneWonHome += 1 : this.team1GameStatsDtoNBA.halfOneLostHome += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDtoNBA.halfTwoWonHome += 1 : this.team1GameStatsDtoNBA.halfTwoLostHome += 1;
          this.team1GameStatsDtoNBA.spreadHome += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team1GameStatsDtoNBA.spreadHomeFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team1GameStatsDtoNBA.spreadHomeSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team1GameStatsDtoNBA.spreadHomeFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team1GameStatsDtoNBA.spreadHomeSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team1GameStatsDtoNBA.spreadHomeThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team1GameStatsDtoNBA.spreadHomeFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team1GameStatsDtoNBA.totalHome += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team1GameStatsDtoNBA.totalHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.totalHomeFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team1GameStatsDtoNBA.totalHomeSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalHomeThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team1GameStatsDtoNBA.totalHomeFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.pointsScoredHomeGame += e.pointsScoredOverall
          this.team1GameStatsDtoNBA.pointsScoredHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeFirstQuarter += e.pointsScoredFirstQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeSecondQuarter += e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeThirdQuarter += e.pointsScoredThirdQuarter
          this.team1GameStatsDtoNBA.pointsScoredHomeFourthQuarter += e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeGame += e.pointsAllowedOverall
          this.team1GameStatsDtoNBA.pointsAllowedHomeFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeFirstQuarter += e.pointsAllowedFirstQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeSecondQuarter += e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeThirdQuarter += e.pointsAllowedThirdQuarter
          this.team1GameStatsDtoNBA.pointsAllowedHomeFourthQuarter += e.pointsAllowedFourthQuarter

        }
        else if (e.homeOrAway == "Away") {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team1GameStatsDtoNBA.quarterOneWonAway += 1 : this.team1GameStatsDtoNBA.quarterOneLostAway += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team1GameStatsDtoNBA.quarterTwoWonAway += 1 : this.team1GameStatsDtoNBA.quarterTwoLostAway += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team1GameStatsDtoNBA.quarterThreeWonAway += 1 : this.team1GameStatsDtoNBA.quarterThreeLostAway += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team1GameStatsDtoNBA.quarterFourWonAway += 1 : this.team1GameStatsDtoNBA.quarterFourLostAway += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team1GameStatsDtoNBA.halfOneWonAway += 1 : this.team1GameStatsDtoNBA.halfOneLostAway += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team1GameStatsDtoNBA.halfTwoWonAway += 1 : this.team1GameStatsDtoNBA.halfTwoLostAway += 1;
          this.team1GameStatsDtoNBA.spreadAway += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team1GameStatsDtoNBA.spreadAwayFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team1GameStatsDtoNBA.spreadAwaySecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team1GameStatsDtoNBA.spreadAwayFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team1GameStatsDtoNBA.spreadAwaySecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team1GameStatsDtoNBA.spreadAwayThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team1GameStatsDtoNBA.spreadAwayFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team1GameStatsDtoNBA.totalAway += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team1GameStatsDtoNBA.totalAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.totalAwayFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team1GameStatsDtoNBA.totalAwaySecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team1GameStatsDtoNBA.totalAwayThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team1GameStatsDtoNBA.totalAwayFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team1GameStatsDtoNBA.pointsScoredAwayGame += e.pointsScoredOverall
          this.team1GameStatsDtoNBA.pointsScoredAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwayFirstQuarter += e.pointsScoredFirstQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwaySecondQuarter += e.pointsScoredSecondQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwayThirdQuarter += e.pointsScoredThirdQuarter
          this.team1GameStatsDtoNBA.pointsScoredAwayFourthQuarter += e.pointsScoredFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwayGame += e.pointsAllowedOverall
          this.team1GameStatsDtoNBA.pointsAllowedAwayFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwaySecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwayFirstQuarter += e.pointsAllowedFirstQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwaySecondQuarter += e.pointsAllowedSecondQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwayThirdQuarter += e.pointsAllowedThirdQuarter
          this.team1GameStatsDtoNBA.pointsAllowedAwayFourthQuarter += e.pointsAllowedFourthQuarter
        }


      })

      team2.forEach(e => {
        e.result == "Win" ? this.team2GameStatsDtoNBA.gamesWon += 1 : this.team2GameStatsDtoNBA.gamesLost += 1
        e.teamAgainstId == team1[0].teamId ? (e.result == "Win" ? this.team2GameStatsDtoNBA.gamesWonVsOpponent += 1 : this.team2GameStatsDtoNBA.gamesLostVsOpponent += 1) : i = 0;
        e.homeOrAway == "Home" ? (e.result == "Win" ? this.team2GameStatsDtoNBA.gamesWonHome += 1 : this.team2GameStatsDtoNBA.gamesLostHome += 1) : (e.result == "Win" ? this.team2GameStatsDtoNBA.gamesWonAway += 1 : this.team2GameStatsDtoNBA.gamesLostAway += 1);
        e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDtoNBA.quarterOneWon += 1 : this.team2GameStatsDtoNBA.quarterOneLost += 1;
        e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDtoNBA.quarterTwoWon += 1 : this.team2GameStatsDtoNBA.quarterTwoLost += 1;
        e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDtoNBA.quarterThreeWon += 1 : this.team2GameStatsDtoNBA.quarterThreeLost += 1;
        e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDtoNBA.quarterFourWon += 1 : this.team2GameStatsDtoNBA.quarterFourLost += 1;
        (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDtoNBA.halfOneWon += 1 : this.team2GameStatsDtoNBA.halfOneLost += 1;
        (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDtoNBA.halfTwoWon += 1 : this.team2GameStatsDtoNBA.halfTwoLost += 1;
        this.team2GameStatsDtoNBA.spreadGame += (e.pointsAllowedOverall - e.pointsScoredOverall);
        this.team2GameStatsDtoNBA.spreadFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
        this.team2GameStatsDtoNBA.spreadSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
        this.team2GameStatsDtoNBA.spreadFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
        this.team2GameStatsDtoNBA.spreadSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
        this.team2GameStatsDtoNBA.spreadThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
        this.team2GameStatsDtoNBA.spreadFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
        this.team2GameStatsDtoNBA.totalOverall += e.pointsScoredOverall + e.pointsAllowedOverall;
        this.team2GameStatsDtoNBA.totalOverallFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDtoNBA.totalOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDtoNBA.totalOverallFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
        this.team2GameStatsDtoNBA.totalOverallSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
        this.team2GameStatsDtoNBA.totalOverallThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
        this.team2GameStatsDtoNBA.totalOverallFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
        this.team2GameStatsDtoNBA.pointsScoredOverallGame += e.pointsScoredOverall
        this.team2GameStatsDtoNBA.pointsScoredOverallSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
        this.team2GameStatsDtoNBA.pointsScoredOverallFirstQuarter += e.pointsScoredFirstQuarter
        this.team2GameStatsDtoNBA.pointsScoredOverallSecondQuarter += e.pointsScoredSecondQuarter
        this.team2GameStatsDtoNBA.pointsScoredOverallThirdQuarter += e.pointsScoredThirdQuarter
        this.team2GameStatsDtoNBA.pointsScoredOverallFourthQuarter += e.pointsScoredFourthQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallGame += e.pointsAllowedOverall
        this.team2GameStatsDtoNBA.pointsAllowedOverallFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallFirstQuarter += e.pointsAllowedFirstQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallSecondQuarter += e.pointsAllowedSecondQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallThirdQuarter += e.pointsAllowedThirdQuarter
        this.team2GameStatsDtoNBA.pointsAllowedOverallFourthQuarter += e.pointsAllowedFourthQuarter
        if (e.teamAgainstId == team1[0].teamId) {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDtoNBA.quarterOneWonVsOpponent += 1 : this.team2GameStatsDtoNBA.quarterOneLostVsOpponent += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDtoNBA.quarterTwoWonVsOpponent += 1 : this.team2GameStatsDtoNBA.quarterTwoLostVsOpponent += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDtoNBA.quarterThreeWonVsOpponent += 1 : this.team2GameStatsDtoNBA.quarterThreeLostVsOpponent += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDtoNBA.quarterFourWonVsOpponent += 1 : this.team2GameStatsDtoNBA.quarterFourLostVsOpponent += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDtoNBA.halfOneWonVsOpponent += 1 : this.team2GameStatsDtoNBA.halfOneLostVsOpponent += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDtoNBA.halfTwoWonVsOpponent += 1 : this.team2GameStatsDtoNBA.halfTwoLostVsOpponent += 1;
          this.team2GameStatsDtoNBA.spreadVsOpponent += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team2GameStatsDtoNBA.spreadFirstHalfVsOpponent += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team2GameStatsDtoNBA.spreadSecondHalfVsOpponent += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team2GameStatsDtoNBA.spreadFirstQuarterVsOpponent += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team2GameStatsDtoNBA.spreadSecondQuarterVsOpponet += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team2GameStatsDtoNBA.spreadThirdQuarterVsOpponent += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team2GameStatsDtoNBA.spreadFourthQuarterVsOpponent += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team2GameStatsDtoNBA.totalVsTeam += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team2GameStatsDtoNBA.totalVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team2GameStatsDtoNBA.totalVsTeamFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.pointsScoredVsTeamGame += e.pointsScoredOverall
          this.team2GameStatsDtoNBA.pointsScoredVsTeamFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamFirstQuarter += e.pointsScoredFirstQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamSecondQuarter += e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamThirdQuarter += e.pointsScoredThirdQuarter
          this.team2GameStatsDtoNBA.pointsScoredVsTeamFourthQuarter += e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamGame += e.pointsAllowedOverall
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamFirstQuarter += e.pointsAllowedFirstQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamSecondQuarter += e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamThirdQuarter += e.pointsAllowedThirdQuarter
          this.team2GameStatsDtoNBA.pointsAllowedVsTeamFourthQuarter += e.pointsAllowedFourthQuarter
        }
        if (e.homeOrAway == "Home") {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDtoNBA.quarterOneWonHome += 1 : this.team2GameStatsDtoNBA.quarterOneLostHome += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDtoNBA.quarterTwoWonHome += 1 : this.team2GameStatsDtoNBA.quarterTwoLostHome += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDtoNBA.quarterThreeWonHome += 1 : this.team2GameStatsDtoNBA.quarterThreeLostHome += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDtoNBA.quarterFourWonHome += 1 : this.team2GameStatsDtoNBA.quarterFourLostHome += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDtoNBA.halfOneWonHome += 1 : this.team2GameStatsDtoNBA.halfOneLostHome += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDtoNBA.halfTwoWonHome += 1 : this.team2GameStatsDtoNBA.halfTwoLostHome += 1;
          this.team2GameStatsDtoNBA.spreadHome += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team2GameStatsDtoNBA.spreadHomeFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team2GameStatsDtoNBA.spreadHomeSecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team2GameStatsDtoNBA.spreadHomeFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team2GameStatsDtoNBA.spreadHomeSecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team2GameStatsDtoNBA.spreadHomeThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team2GameStatsDtoNBA.spreadHomeFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team2GameStatsDtoNBA.totalHome += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team2GameStatsDtoNBA.totalHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.totalHomeFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team2GameStatsDtoNBA.totalHomeSecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalHomeThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team2GameStatsDtoNBA.totalHomeFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.pointsScoredHomeGame += e.pointsScoredOverall
          this.team2GameStatsDtoNBA.pointsScoredHomeFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeSecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeFirstQuarter += e.pointsScoredFirstQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeSecondQuarter += e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeThirdQuarter += e.pointsScoredThirdQuarter
          this.team2GameStatsDtoNBA.pointsScoredHomeFourthQuarter += e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeGame += e.pointsAllowedOverall
          this.team2GameStatsDtoNBA.pointsAllowedHomeFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeSecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeFirstQuarter += e.pointsAllowedFirstQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeSecondQuarter += e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeThirdQuarter += e.pointsAllowedThirdQuarter
          this.team2GameStatsDtoNBA.pointsAllowedHomeFourthQuarter += e.pointsAllowedFourthQuarter

        }
        else if (e.homeOrAway == "Away") {
          e.pointsScoredFirstQuarter > e.pointsAllowedFirstQuarter ? this.team2GameStatsDtoNBA.quarterOneWonAway += 1 : this.team2GameStatsDtoNBA.quarterOneLostAway += 1;
          e.pointsScoredSecondQuarter > e.pointsAllowedSecondQuarter ? this.team2GameStatsDtoNBA.quarterTwoWonAway += 1 : this.team2GameStatsDtoNBA.quarterTwoLostAway += 1;
          e.pointsScoredThirdQuarter > e.pointsAllowedThirdQuarter ? this.team2GameStatsDtoNBA.quarterThreeWonAway += 1 : this.team2GameStatsDtoNBA.quarterThreeLostAway += 1;
          e.pointsScoredFourthQuarter > e.pointsAllowedFourthQuarter ? this.team2GameStatsDtoNBA.quarterFourWonAway += 1 : this.team2GameStatsDtoNBA.quarterFourLostAway += 1;
          (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter) > (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) ? this.team2GameStatsDtoNBA.halfOneWonAway += 1 : this.team2GameStatsDtoNBA.halfOneLostAway += 1;
          (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter) > (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) ? this.team2GameStatsDtoNBA.halfTwoWonAway += 1 : this.team2GameStatsDtoNBA.halfTwoLostAway += 1;
          this.team2GameStatsDtoNBA.spreadAway += (e.pointsAllowedOverall - e.pointsScoredOverall);
          this.team2GameStatsDtoNBA.spreadAwayFirstHalf += (e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter) - (e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter);
          this.team2GameStatsDtoNBA.spreadAwaySecondHalf += (e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter) - (e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter);
          this.team2GameStatsDtoNBA.spreadAwayFirstQuarter += e.pointsAllowedFirstQuarter - e.pointsScoredFirstQuarter;
          this.team2GameStatsDtoNBA.spreadAwaySecondQuarter += e.pointsAllowedSecondQuarter - e.pointsScoredSecondQuarter;
          this.team2GameStatsDtoNBA.spreadAwayThirdQuarter += e.pointsAllowedThirdQuarter - e.pointsScoredThirdQuarter;
          this.team2GameStatsDtoNBA.spreadAwayFourthQuarter += e.pointsAllowedFourthQuarter - e.pointsScoredFourthQuarter;
          this.team2GameStatsDtoNBA.totalAway += e.pointsScoredOverall + e.pointsAllowedOverall;
          this.team2GameStatsDtoNBA.totalAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter + e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter + e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.totalAwayFirstQuarter += e.pointsScoredFirstQuarter + e.pointsAllowedFirstQuarter;
          this.team2GameStatsDtoNBA.totalAwaySecondQuarter += e.pointsScoredSecondQuarter + e.pointsAllowedSecondQuarter;
          this.team2GameStatsDtoNBA.totalAwayThirdQuarter += e.pointsScoredThirdQuarter + e.pointsAllowedThirdQuarter;
          this.team2GameStatsDtoNBA.totalAwayFourthQuarter += e.pointsScoredFourthQuarter + e.pointsAllowedFourthQuarter;
          this.team2GameStatsDtoNBA.pointsScoredAwayGame += e.pointsScoredOverall
          this.team2GameStatsDtoNBA.pointsScoredAwayFirstHalf += e.pointsScoredFirstQuarter + e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwaySecondHalf += e.pointsScoredThirdQuarter + e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwayFirstQuarter += e.pointsScoredFirstQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwaySecondQuarter += e.pointsScoredSecondQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwayThirdQuarter += e.pointsScoredThirdQuarter
          this.team2GameStatsDtoNBA.pointsScoredAwayFourthQuarter += e.pointsScoredFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwayGame += e.pointsAllowedOverall
          this.team2GameStatsDtoNBA.pointsAllowedAwayFirstHalf += e.pointsAllowedFirstQuarter + e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwaySecondHalf += e.pointsAllowedThirdQuarter + e.pointsAllowedFourthQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwayFirstQuarter += e.pointsAllowedFirstQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwaySecondQuarter += e.pointsAllowedSecondQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwayThirdQuarter += e.pointsAllowedThirdQuarter
          this.team2GameStatsDtoNBA.pointsAllowedAwayFourthQuarter += e.pointsAllowedFourthQuarter
        }
      })

    }

    else if(this.selectedSport == "MLB Preseason" || this.selectedSport == "MLB"){

    }

    else if(this.selectedSport == "NHL"){

    }

    else if(this.selectedSport == "NFL"){

    }

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

  async propTrend(teamName: string, prop: string, content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
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


  ngOnChanges() {
    console.log("Changed")
  }
  ngAfterContentInit() {
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
    this.initializeSport()
    this.getGames()
  }

  detailedStatsClicked(element: any) {
    this.router.navigate(["/playerStats/" + this.selectedSport + "/" + element.id])
  }

}

