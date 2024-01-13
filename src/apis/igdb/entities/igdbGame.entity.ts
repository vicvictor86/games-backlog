import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';

export interface IGDBGameProps {
  igdbId: string;
  slug: string;
  title: string;
  gameImage: string;
  cover: string;
  category: string;
  genres: string[];
  involvedCompanies: string[];
  platforms: string[];
  releaseDate: Date;
  similarGames: string[];
  summary: string;
  themes: string[];
}

export class IGDBGame extends Entity<IGDBGameProps> {
  get igdbId() { return this.props.igdbId; }

  get slug() { return this.props.slug; }

  get title() { return this.props.title; }

  get gameImage() { return this.props.gameImage; }

  get cover() { return this.props.cover; }

  get category() { return this.props.category; }

  get genres() { return this.props.genres; }

  get involvedCompanies() { return this.props.involvedCompanies; }

  get platforms() { return this.props.platforms; }

  get releaseDate() { return this.props.releaseDate; }

  get similarGames() { return this.props.similarGames; }

  get summary() { return this.props.summary; }

  get themes() { return this.props.themes; }

  static create(props: IGDBGameProps, id?: UniqueEntityId) {
    const igdbGame = new IGDBGame({
      ...props,
    }, id);

    return igdbGame;
  }
}
