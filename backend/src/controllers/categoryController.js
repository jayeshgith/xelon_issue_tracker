import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import {
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  listCategories as listCategoriesService,
  updateCategory as updateCategoryService
} from '../services/categoryService.js';

export const listCategories = asyncHandler(async (req, res) => {
  const includeInactive = req.user.role === 'admin' && req.query.includeInactive === 'true';
  const categories = await listCategoriesService({ includeInactive });
  sendSuccess(res, 200, 'Categories loaded', { categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await createCategoryService({
    name: req.body.name,
    createdBy: req.user._id
  });
  sendSuccess(res, 201, 'Category created successfully', { category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await updateCategoryService(req.params.id, req.body);
  sendSuccess(res, 200, 'Category updated successfully', { category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await deleteCategoryService(req.params.id);
  sendSuccess(res, 200, 'Category deleted successfully');
});
