import {Component, Input} from '@angular/core';
interface NewsItemType {
  id: number;
  header: string;
  date: string;
  category: string;
  post_number: number;
  people: {
    id: number;
    name: string;
    avatar: string;
  }[];
}

@Component({
  selector: 'app-news-item',
  imports: [],
  templateUrl: './news-item.html',
  styleUrl: './news-item.scss',
  standalone: true,
})
export class NewsItem {
  @Input() item = {} as NewsItemType
}
