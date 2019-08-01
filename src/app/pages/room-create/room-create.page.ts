import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomService } from '../../services/room/room.service';


@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.page.html',
  styleUrls: ['./room-create.page.scss'],
})
export class RoomCreatePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
