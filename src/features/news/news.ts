import { Component } from '@angular/core';
import {NewsItem} from '../../components/news-item/news-item';

@Component({
  selector: 'app-news',
  imports: [NewsItem],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class News {
  data = [
    {
      id: 1,
      header: 'McLaren Signs Ella Lloyd, Ella Stevens, and Ella Häkkinen to Driver Programme',
      date: 'Trending now',
      category: 'Sports',
      post_number: 648,
      people: [
        {
          id: 1,
          name: 'Clash of Clans',
          avatar: 'https://images.unsplash.com/photo-1763046287602-7f878927101f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          id: 2,
          name: 'Dora the Explorer',
          avatar: 'https://images.unsplash.com/photo-1762324858968-d131280714ff?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          id: 3,
          name: 'Simpsons',
          avatar: 'https://images.unsplash.com/photo-1762793193633-c26f3d34e710?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
      ]
    },
    {
      id: 2,
      header: 'Clash of Clans Releases Town Hall 18 in Meteor Apocalypse Update',
      date: '1 hour ago',
      category: 'Entertainment',
      post_number: 582,
      people: [
        {
          id: 1,
          name: 'Clash of Clans',
          avatar: 'https://images.unsplash.com/photo-1763046287602-7f878927101f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          id: 2,
          name: 'Dora the Explorer',
          avatar: 'https://images.unsplash.com/photo-1762324858968-d131280714ff?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          id: 3,
          name: 'Simpsons',
          avatar: 'https://images.unsplash.com/photo-1762793193633-c26f3d34e710?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
      ]
    },
    {
      id:3,
      header: 'X to Roll Out Country Labels on Profiles in 72 Hours',
      date: '1 hour ago',
      category: 'News',
      post_number: 595,
      people: [
        {
          id: 1,
          name: 'Clash of Clans',
          avatar: 'https://images.unsplash.com/photo-1763046287602-7f878927101f?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          id: 2,
          name: 'Dora the Explorer',
          avatar: 'https://images.unsplash.com/photo-1762324858968-d131280714ff?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
        {
          id: 3,
          name: 'Simpsons',
          avatar: 'https://images.unsplash.com/photo-1762793193633-c26f3d34e710?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        },
      ]
    }
  ]
}
