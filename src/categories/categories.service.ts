import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './interface/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { category } = createCategoryDto;

    const categoryExist = await this.categoryModel.findOne({ category }).exec();

    if (categoryExist) {
      throw new BadRequestException(`Categoria ${category} já cadastrada`);
    }

    const categoryCreate = new this.categoryModel(createCategoryDto);

    return await categoryCreate.save();
  }

  async getAllCategories(): Promise<Array<Category>> {
    return await this.categoryModel.find().exec();
  }

  async getCategory(category: string): Promise<Category> {
    const categoryDoc = await this.categoryModel.findOne({ category }).exec();

    if (!categoryDoc) {
      throw new NotFoundException(`Categoria ${category} não encontrado`);
    }

    return categoryDoc;
  }
}
