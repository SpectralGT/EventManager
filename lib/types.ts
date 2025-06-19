export interface Ticket {
    type: string;
    price: number;
    available: number;
  }


export interface Item{
  name : string;
  price : number;
  quantity : number;
  served : number;
  serveStartTime : string;
  serveEndTime : string;
}

export interface Order{
  attendeeId : string;
  eventId : string;
  memberItems : Item[];
  isGuestOrder : boolean;
  guestName : string;
  guestIsFamily: boolean;
  guestAdultCount: number;
  guestChildCount: number;
  geustItems : Item[];
}

export interface OrderByID{
  id:string;
  attendeeId : string;
  eventId : string;
  eventTitle : string;
  createdAt : string;
  items : Item[];
}


export interface AttendeeOrder{
  id:string
  attendeeId : string;
  eventId : string;
  eventTitle : string;
  memberItems : Item[];
  createdAt : string;
}

export interface Profile {
  id: string;
  username: string;
  balance: number;
  orders: AttendeeOrder[];
}