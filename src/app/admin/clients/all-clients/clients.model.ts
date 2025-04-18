export class Clients {
  id: number;
  img: string;
  name: string;
  mobile: string;
  email: string;
  company_name: string;
  currency: string;
  billing_method: string;
  contact_person: string;
  contact_phone: string;
  status: string;
  contract_document: string;
  notes: string;
  address: string;

  constructor(client: Partial<Clients>) {
    this.id = client.id || this.getRandomID();
    this.img = client.img || 'assets/images/user/user1.jpg';
    this.name = client.name || '';
    this.mobile = client.mobile || '';
    this.email = client.email || '';
    this.company_name = client.company_name || '';
    this.currency = client.currency || '';
    this.billing_method = client.billing_method || '';
    this.contact_person = client.contact_person || '';
    this.contact_phone = client.contact_phone || '';
    this.status = client.status || '';
    this.contract_document = client.contract_document || '';
    this.notes = client.notes || '';
    this.address = client.address || '';
  }

  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
