export type LeadsData = {
  id: number;
  name: string;
  price: number;
  responsibileUser: string;
  leadStatus: {
    name: string;
    color: string;
  };
  contacts: [
    {
      name: string;
      contacts: [
        {
          type: string;
          values: {
            value: string;
            enum_id: number;
            enum_code: string;
          }[];
        }
      ];
    }
  ];
  createdAt: string;
}[];
