// # Các route công khai
// src/routes/api/publicRoutes.ts
import express from 'express';
import {
  getPackages,
  getPackageById
} from '~/controllers/public/packageController';

import { getTrainers, getTrainerById } from '~/controllers/public/trainerController';
import { getAllActivePromotions}   from '~/controllers/public/promotionController';
import {getPostBySlug,getLatestPosts,getPostsByTag,getPostsByCategory,getAllPosts,   getFeaturedPosts} from '~/controllers/public/blogPostController';
import {getAllBlogCategories, getCategoryBySlug} from '~/controllers/public/blogCategoryController';
const router = express.Router();

// 1. Routes cho Package (public - không cần auth)
router.get('/packages', getPackages); // Danh sách gói tập
router.get('/packages/:id', getPackageById); // Chi tiết gói tập

// 2. Route cho Trainer
router.get('/trainers', getTrainers); // Danh sách huấn luyện viên
router.get('/trainers/:trainerId', getTrainerById);

// route khuyến mãi
router.get('/promotions', getAllActivePromotions);//danh sách khuyến mãi active

// blog
router.get('/blogs', getAllPosts);
router.get('/blog/latest', getLatestPosts);
router.get('/blog/featured', getFeaturedPosts);
router.get('/blog/tag/:tag', getPostsByTag);
router.get('/blog/category/:slug', getPostsByCategory);
router.get('/blog/:slug', getPostBySlug);
//categories blog
router.get('/blog-categories', getAllBlogCategories);
router.get('/blog-categories/:slug', getCategoryBySlug);

export default router;