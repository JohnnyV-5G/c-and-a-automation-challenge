// accountOverviewMessages.ts

export class AccountOverviewMessages {
  static readonly list = {
    es: {
      welcome: 'Bienvenido',
      orders: 'Pedidos',
      coupons: 'Beneficios',
      settings: 'Administrar cuenta',
      help: 'Ayuda',
      contact: 'Contacto',
      logout: 'Cerrar sesión',
    },
    fr: {
      welcome: '',
      orders: '',
      coupons: '',
      settings: '',
      help: '',
      contact: '',
      logout: '',
    },
    de: {
      welcome: '',
      orders: '',
      coupons: '',
      settings: '',
      help: '',
      contact: '',
      logout: '',
    },
    // add more countries as needed 
  } as const;
}
