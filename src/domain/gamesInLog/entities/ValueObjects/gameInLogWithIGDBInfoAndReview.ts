import { ValueObject } from '@/core/entities/valueObjects';
import { GameInLog } from '../gameInLog.entity';
import { Review } from '../review.entity';

export interface GameInLogWithIGDBInfoAndReviewProps {
  gameInLog: GameInLog;
  review: Review;
  gameIGDB: any;
}

export class GameInLogWithIGDBInfoAndReview extends ValueObject<GameInLogWithIGDBInfoAndReviewProps> {
  static create(props: GameInLogWithIGDBInfoAndReviewProps) {
    return new GameInLogWithIGDBInfoAndReview(props);
  }

  get gameInLog() {
    return this.props.gameInLog;
  }

  set gameInLog(gameInLog: GameInLog) {
    this.props.gameInLog = gameInLog;
  }

  get review() {
    return this.props.review;
  }

  set review(review: Review) {
    this.props.review = review;
  }

  get gameIGDB() {
    return this.props.gameIGDB;
  }

  set gameIGDB(gameIGDB: any) {
    this.props.gameIGDB = gameIGDB;
  }
}
