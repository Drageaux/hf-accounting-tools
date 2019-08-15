export class Lot {
  lotId: string;
  itemSku: string;
  availableQuant: number;

  constructor(fields?: {
    lotId: string;
    itemSku: string;
    availableQuant: number;
  }) {
    if (fields) {
      Object.assign(this, fields);
    }
  }
}
