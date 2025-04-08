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
  items : Item[];
}