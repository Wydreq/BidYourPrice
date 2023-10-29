import { Component, OnInit } from '@angular/core';
import { OffersService } from '../services/offers.service';
import { OfferItem } from '../models/offers.model';
import { Router } from '@angular/router';
import { MessagesService } from '../services/messages.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.css'],
})
export class MyOffersComponent implements OnInit {
  userOffers!: OfferItem[];
  isLoading: boolean = false;
  offersLength: number = 0;
  messages: Message[] = [];

  constructor(
    private offersService: OffersService,
    private router: Router,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.messagesService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
    this.offersService.userOffers.subscribe((userOffers) => {
      console.log(userOffers);
      this.userOffers = userOffers.data;
      this.offersLength = userOffers.data.length;
    });
    this.offersService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.offersService.getSpecificUserOffers();
  }

  showOffer(id: string) {
    this.router.navigate(['/offers', id]);
  }

  deleteOffer(id: string) {
    if (confirm('Are you sure to delete this offer?')) {
      this.offersService.deleteOffer(id).subscribe((resData) => {
        this.messagesService.setMessage(
          'success',
          'Success',
          'Offer has been deleted!'
        );
      });
    }
    this.offersService.getSpecificUserOffers();
  }
}
