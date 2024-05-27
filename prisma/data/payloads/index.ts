import { Account, Customer, Role, Translator } from "@prisma/client";
import { RemoveDefaultFields } from "src/util";

export const ACCOUNT_ITEMS: RemoveDefaultFields<Account>[] = [
  {
    name: 'Alice',
    surname: 'Smith',
    email: 'alice.smith@gmail.com',
    password: '123',
    role: Role.ADMIN,
    avatarPath: ""
  },
  {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@gmail.com',
    password: 'qwe',
    role: Role.CUSTOMER,
    avatarPath: ""
  },
  {
    name: 'Admin',
    surname: 'Admin',
    email: 'admin@gmail.com',
    password: 'qwe',
    role: Role.TRANSLATOR,
    avatarPath: ""
  },
  {
    name: 'Assanali',
    surname: 'Danybayev',
    email: 'asandan@kenfasad.com',
    password: '$2b$10$j13NOWMZs8v2/Qmha00jJ.cCRSSiagYTHXvk1BzieWmr4GKwvz53K',
    role: Role.TRANSLATOR,
    avatarPath: ""
  },
];

export const TRANSLATOR_ITEMS: RemoveDefaultFields<Translator>[] = [
  {
    accountId: 3,
  },
  {
    accountId: 4,
  },
];

export const CUSTOMER_ITEMS: RemoveDefaultFields<Customer>[] = [
  {
    accountId: 2,
  },

];

// export const ADMIN_ITEMS: RemoveDefaultFields<Admin>[] = [
//   {
//     accountId: 1,
//   },
// ];
