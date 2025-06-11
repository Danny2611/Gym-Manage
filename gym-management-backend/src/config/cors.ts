// # Cấu hình CORS

// src/config/cors.ts
import dotenv from 'dotenv';
import { CorsOptions } from 'cors';

dotenv.config();

// Danh sách origin được phép truy cập
const whitelist = [
  process.env.FRONTEND_URL || 'http://localhost:3000', // URL của ứng dụng frontend
  'https://momo.vn',  // Thêm domain của MoMo
  'https://payment.momo.vn',  // Thêm nếu cần thiết
  'https://test-payment.momo.vn', // Nếu dùng môi trường test của MoMo
  process.env.FRONTEND_URL_PROD ||'http://localhost:4173'
];

// Cấu hình CORS
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning'], // ✅ THÊM Ở ĐÂY
  exposedHeaders: ['Content-Length', 'X-Rate-Limit'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
};


// Cấu hình CORS đơn giản cho môi trường phát triển
const developmentCorsOptions: CorsOptions = {
  origin: '*', // Cho phép tất cả origin trong môi trường phát triển
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'ngrok-skip-browser-warning'],
  credentials: true,
};

export default {
  production: corsOptions,
  development: developmentCorsOptions,
  // Sử dụng cấu hình dựa trên môi trường
  get current(): CorsOptions {
    return process.env.NODE_ENV === 'production' ? this.production : this.development;
  },
};