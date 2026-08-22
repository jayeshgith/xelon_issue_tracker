import ApiError from '../utils/ApiError.js';
import Category from '../models/Category.js';

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const listCategories = async ({ includeInactive = false } = {}) => {
  const filter = includeInactive ? {} : { isActive: true };
  return Category.find(filter).sort({ name: 1 });
};

export const getActiveCategory = async (categoryId) => {
  const category = await Category.findOne({ _id: categoryId, isActive: true });

  if (!category) {
    throw new ApiError(400, 'Valid category is required');
  }

  return category;
};

export const createCategory = async ({ name, createdBy }) => {
  const cleanName = String(name || '').trim();

  if (!cleanName) {
    throw new ApiError(400, 'Category name is required');
  }

  const existing = await Category.findOne({ name: new RegExp(`^${escapeRegex(cleanName)}$`, 'i') });

  if (existing) {
    throw new ApiError(409, 'Category already exists');
  }

  return Category.create({
    name: cleanName,
    createdBy
  });
};

export const updateCategory = async (categoryId, payload) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (payload.name !== undefined) {
    const cleanName = String(payload.name || '').trim();

    if (!cleanName) {
      throw new ApiError(400, 'Category name is required');
    }

    const existing = await Category.findOne({
      _id: { $ne: category._id },
      name: new RegExp(`^${escapeRegex(cleanName)}$`, 'i')
    });

    if (existing) {
      throw new ApiError(409, 'Category already exists');
    }

    category.name = cleanName;
  }

  if (payload.isActive !== undefined) {
    category.isActive = Boolean(payload.isActive);
  }

  await category.save();
  return category;
};

export const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  category.isActive = false;
  await category.save();
};
