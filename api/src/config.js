/**
 * Application Configuration.
 * Dynamically loaded from Cloudflare Workers environment bindings (c.env) at request time.
 */
export const config = {
  port: 8787,
  corsOrigin: '*',
  nodeEnv: 'development',
  paymentProvider: 'toyyibpay',
  param: {
    clientCode: '',
    clientUsername: '',
    clientPassword: '',
    guid: '',
    baseUrl: 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl',
    callbackUrl: 'http://localhost:8787'
  },
  iyzico: {
    apiKey: '',
    secretKey: '',
    baseUrl: 'https://sandbox-api.iyzipay.com',
    callbackUrl: 'http://localhost:8787'
  },
  paytr: {
    merchantId: '',
    merchantKey: '',
    merchantSalt: '',
    baseUrl: 'https://www.paytr.com',
    callbackUrl: 'http://localhost:8787'
  },
  toyyibpay: {
    userSecretKey: '',
    categoryCode: '',
    baseUrl: 'https://toyyibpay.com'
  },
  email: {
    sender: "DIN'O EMPIRE <dinoempire.my@gmail.com>",
    replyTo: 'dinoempire.my@gmail.com',
  },
  clientUrl: 'http://localhost:8000',
  orderNotificationEmail: 'dinoempire.my@gmail.com',
  cdnUrl: 'https://cdn.dinoempire.my',
  googleMerchantToken: ''
};

export let currentEnv = null;

/**
 * Initializes the global config object with Workers environment variables in-place.
 * Preserves nested object references so that static DI modules remain updated.
 * @param {Object} env - Worker env object (c.env).
 */
export function initConfig(env) {
  currentEnv = env;
  config.port = env.PORT || 8787;
  config.corsOrigin = env.CORS_ORIGIN || '*';
  config.nodeEnv = env.NODE_ENV || 'development';
  config.clientUrl = env.CLIENT_URL || 'https://dinoempire.my';
  config.orderNotificationEmail = env.ORDER_NOTIFICATION_EMAIL || 'dinoempire.my@gmail.com';
  config.cdnUrl = env.CDN_URL || 'https://cdn.dinoempire.my';
  config.googleMerchantToken = env.GOOGLE_MERCHANT_TOKEN || '';
  config.paymentProvider = env.PAYMENT_PROVIDER || 'toyyibpay';

  Object.assign(config.param, {
    clientCode: env.PARAM_CLIENT_CODE || '',
    clientUsername: env.PARAM_CLIENT_USERNAME || '',
    clientPassword: env.PARAM_CLIENT_PASSWORD || '',
    guid: env.PARAM_GUID || '',
    baseUrl: env.PARAM_BASE_URL || 'https://testposws.param.com.tr/turkpos.ws/service_turkpos_prod.asmx?wsdl',
    callbackUrl: env.API_URL || 'http://localhost:8787'
  });

  Object.assign(config.iyzico, {
    apiKey: env.IYZICO_API_KEY || '',
    secretKey: env.IYZICO_SECRET_KEY || '',
    baseUrl: env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com',
    callbackUrl: env.API_URL || 'http://localhost:8787'
  });

  Object.assign(config.paytr, {
    merchantId: env.PAYTR_MERCHANT_ID || '',
    merchantKey: env.PAYTR_MERCHANT_KEY || '',
    merchantSalt: env.PAYTR_MERCHANT_SALT || '',
    baseUrl: env.PAYTR_BASE_URL || 'https://www.paytr.com',
    callbackUrl: env.API_URL || 'http://localhost:8787'
  });

  Object.assign(config.toyyibpay, {
    userSecretKey: env.TOYYIBPAY_USER_SECRET_KEY || '',
    categoryCode: env.TOYYIBPAY_CATEGORY_CODE || '',
    baseUrl: env.TOYYIBPAY_BASE_URL || 'https://toyyibpay.com'
  });
  config.apiUrl = env.API_URL || 'https://api.dinoempire.my';

  Object.assign(config.email, {
    sender: env.SMTP_SENDER || "DIN'O EMPIRE <dinoempire.my@gmail.com>",
    replyTo: env.SMTP_REPLY_TO || 'dinoempire.my@gmail.com',
  });
}
